/**
 * 符文之地 (Rune Land) - 主入口
 * 超大型Roguelike ARPG
 */

import { Player, PlayerClass, CLASS_STATS } from './player.js';
import { CombatSystem } from './combat.js';
import { EnemyManager } from './enemy.js';
import { DungeonGenerator } from './dungeon.js';
import { ItemManager } from './items.js';
import { SkillManager } from './skills.js';
import { QuestManager } from './quest.js';
import { AchievementManager } from './achievement.js';
import { UIManager } from './ui.js';
import { AudioManager } from './audio.js';
import { SaveManager } from './save.js';
import { ParticleSystem } from './particle.js';

// ==================== 游戏状态枚举 ====================
const GameState = {
    TITLE: 'TITLE',
    MENU: 'MENU',
    CLASS_SELECT: 'CLASS_SELECT',
    DUNGEON: 'DUNGEON',
    BATTLE: 'BATTLE',
    SHOP: 'SHOP',
    CRAFTING: 'CRAFTING',
    INVENTORY: 'INVENTORY',
    NPC: 'NPC',
    QUEST_LOG: 'QUEST_LOG',
    GAME_OVER: 'GAME_OVER',
    VICTORY: 'VICTORY',
    SETTINGS: 'SETTINGS',
    PAUSE: 'PAUSE'
};

// ==================== 游戏配置 ====================
const CONFIG = {
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT: 800,
    FPS: 60,
    DEBUG: false,
    AUTO_SAVE_INTERVAL: 30000,
    
    // 地区配置
    BIOMES: {
        forest: { name: '阴暗森林', color: '#2d5a2d', enemyTypes: 15, floorRange: [1, 10] },
        desert: { name: '荒芜沙漠', color: '#c2a64d', enemyTypes: 15, floorRange: [11, 20] },
        ice: { name: '冰霜要塞', color: '#6a9fb5', enemyTypes: 15, floorRange: [21, 30] },
        fire: { name: '烈焰地狱', color: '#b54a2a', enemyTypes: 15, floorRange: [31, 40] },
        void: { name: '虚空神殿', color: '#4a2d5a', enemyTypes: 15, floorRange: [41, 50] }
    },
    
    // 元素类型
    ELEMENTS: {
        PHYSICAL: 'physical',
        FIRE: 'fire',
        ICE: 'ice',
        LIGHTNING: 'lightning',
        VOID: 'void',
        HOLY: 'holy'
    },
    
    // 战斗配置
    COMBAT: {
        BASE_CRIT_RATE: 5,
        BASE_CRIT_DAMAGE: 150,
        DEFEND_DAMAGE_REDUCTION: 0.5,
        MIN_DAMAGE: 1,
        COMBO_DECAY_RATE: 0.1,
        COMBO_BONUS_PER: 5
    },
    
    // 存档键名
    SAVE_KEY: 'rune_land_save',
    SETTINGS_KEY: 'rune_land_settings'
};

const ACHIEVEMENT_DISPLAY_TIME = 4000;

// ==================== 主Game类 ====================
class Game {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.state = GameState.TITLE;
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // 管理器
        this.player = null;
        this.combat = null;
        this.enemyManager = null;
        this.dungeon = null;
        this.itemManager = null;
        this.skillManager = null;
        this.questManager = null;
        this.achievementManager = null;
        this.uiManager = null;
        this.audioManager = null;
        this.saveManager = null;
        this.particleSystem = null;
        
        // 游戏状态
        this.currentFloor = 1;
        this.currentBiome = 'forest';
        this.gameTime = 0;
        this.paused = false;
        this.gameStarted = false;
        
        // 性能
        this.fpsCounter = 0;
        this.fpsTime = 0;
        this.currentFPS = 0;
        
        // UI状态
        this.notifications = [];
        this.achievementPopup = null;
        this.screenShake = { intensity: 0, duration: 0 };
        this.fadeAlpha = 0;
        this.isFading = false;
        
        // 菜单选择
        this.menuSelection = 0;
        this.classSelection = 0;
        
        // 输入
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        
        // 配置数据(延迟加载)
        this.configs = {};
    }
    
    async init() {
        console.log('[Game] 符文之地初始化中...');
        
        // 1. 初始化Canvas
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'gameCanvas';
            this.canvas.width = CONFIG.CANVAS_WIDTH;
            this.canvas.height = CONFIG.CANVAS_HEIGHT;
            document.body.appendChild(this.canvas);
        }
        this.ctx = this.canvas.getContext('2d');
        
        // 2. 加载配置
        await this.loadConfigs();
        
        // 3. 初始化管理器
        this.initializeManagers();
        
        // 4. 绑定事件
        this.bindEvents();
        
        // 5. 检查存档
        if (this.saveManager.hasSave()) {
            console.log('[Game] 检测到存档');
        }
        
        // 6. 启动游戏循环
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
        
        console.log('[Game] 初始化完成');
    }
    
    async loadConfigs() {
        // 加载JSON配置
        try {
            this.configs.classes = await this.fetchJSON('config/classes.json');
            this.configs.enemies = await this.fetchJSON('config/enemies.json');
            this.configs.items = await this.fetchJSON('config/items.json');
            this.configs.dungeons = await this.fetchJSON('config/dungeons.json');
            this.configs.skills = await this.fetchJSON('config/skills.json');
            this.configs.npcs = await this.fetchJSON('config/npcs.json');
            this.configs.quests = await this.fetchJSON('config/quests.json');
            this.configs.achievements = await this.fetchJSON('config/achievements.json');
        } catch (e) {
            console.warn('[Game] 配置加载失败，使用默认值', e);
        }
    }
    
    fetchJSON(path) {
        return fetch(path).then(r => r.json()).catch(() => ({}));
    }
    
    initializeManagers() {
        this.audioManager = new AudioManager();
        this.particleSystem = new ParticleSystem(this.ctx);
        this.saveManager = new SaveManager();
        this.uiManager = new UIManager(this);
        this.achievementManager = new AchievementManager(this);
        this.questManager = new QuestManager(this);
        this.itemManager = new ItemManager(this);
        this.skillManager = new SkillManager(this);
        this.enemyManager = new EnemyManager(this);
        this.combat = new CombatSystem(this);
        this.dungeon = new DungeonGenerator(this);
    }
    
    bindEvents() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            this.handleKeyDown(e);
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('click', (e) => {
            this.handleClick();
        });
    }
    
    handleKeyDown(e) {
        switch (this.state) {
            case GameState.TITLE:
                this.handleTitleInput(e);
                break;
            case GameState.MENU:
                this.handleMenuInput(e);
                break;
            case GameState.CLASS_SELECT:
                this.handleClassSelectInput(e);
                break;
            case GameState.DUNGEON:
                this.handleDungeonInput(e);
                break;
            case GameState.BATTLE:
                this.handleBattleInput(e);
                break;
            case GameState.SHOP:
                this.handleShopInput(e);
                break;
            case GameState.CRAFTING:
                this.handleCraftingInput(e);
                break;
            case GameState.INVENTORY:
                this.handleInventoryInput(e);
                break;
            case GameState.NPC:
                this.handleNPCInput(e);
                break;
            case GameState.QUEST_LOG:
                this.handleQuestLogInput(e);
                break;
            case GameState.PAUSE:
                this.handlePauseInput(e);
                break;
            case GameState.SETTINGS:
                this.handleSettingsInput(e);
                break;
        }
    }
    
    handleTitleInput(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            this.audioManager.resume();
            this.gameStarted = true;
            this.setState(GameState.CLASS_SELECT);
        } else if (e.key === 'Escape') {
            this.setState(GameState.SETTINGS);
        }
    }
    
    handleMenuInput(e) {
        if (e.key === 'ArrowUp' || e.key === 'w') {
            this.menuSelection = (this.menuSelection - 1 + 4) % 4;
        } else if (e.key === 'ArrowDown' || e.key === 's') {
            this.menuSelection = (this.menuSelection + 1) % 4;
        } else if (e.key === 'Enter' || e.key === ' ') {
            this.selectMenuItem(this.menuSelection);
        } else if (e.key === 'Escape') {
            this.setState(GameState.TITLE);
        }
    }
    
    selectMenuItem(index) {
        switch (index) {
            case 0: // 继续游戏
                if (this.saveManager.hasSave()) {
                    this.saveManager.load(this);
                    this.setState(GameState.DUNGEON);
                }
                break;
            case 1: // 新游戏
                this.setState(GameState.CLASS_SELECT);
                break;
            case 2: // 设置
                this.setState(GameState.SETTINGS);
                break;
            case 3: // 退出
                console.log('[Game] 退出游戏');
                break;
        }
    }
    
    handleClassSelectInput(e) {
        if (e.key === 'ArrowUp' || e.key === 'w') {
            this.classSelection = (this.classSelection - 1 + 4) % 4;
        } else if (e.key === 'ArrowDown' || e.key === 's') {
            this.classSelection = (this.classSelection + 1) % 4;
        } else if (e.key === 'Enter' || e.key === ' ') {
            this.startNewGame(Object.values(PlayerClass)[this.classSelection]);
        } else if (e.key === 'Escape') {
            this.setState(GameState.MENU);
        }
    }
    
    startNewGame(characterClass) {
        this.player = new Player(characterClass);
        this.currentFloor = 1;
        this.currentBiome = 'forest';
        
        // 初始化技能
        this.skillManager.initializePlayerSkills(this.player);
        
        // 生成第一层地下城
        this.dungeon.generate(this.currentFloor, this.currentBiome);
        
        this.setState(GameState.DUNGEON);
        this.showNotification('欢迎来到符文之地！', 3000);
    }
    
    handleDungeonInput(e) {
        if (e.key === 'Escape' || e.key === 'p') {
            this.setState(GameState.PAUSE);
            return;
        }
        
        const directions = {
            'ArrowUp': { x: 0, y: -1 }, 'w': { x: 0, y: -1 }, 'W': { x: 0, y: -1 },
            'ArrowDown': { x: 0, y: 1 }, 's': { x: 0, y: 1 }, 'S': { x: 0, y: 1 },
            'ArrowLeft': { x: -1, y: 0 }, 'a': { x: -1, y: 0 }, 'A': { x: -1, y: 0 },
            'ArrowRight': { x: 1, y: 0 }, 'd': { x: 1, y: 0 }, 'D': { x: 1, y: 0 }
        };
        
        if (directions[e.key]) {
            this.movePlayer(directions[e.key]);
        } else if (e.key === ' ') {
            this.interact();
        } else if (e.key === 'i' || e.key === 'I') {
            this.setState(GameState.INVENTORY);
        } else if (e.key === 'k' || e.key === 'K') {
            this.setState(GameState.QUEST_LOG);
        } else if (e.key === 'c' || e.key === 'C') {
            this.openCharacterSheet();
        }
    }
    
    movePlayer(dir) {
        if (!this.player || !this.dungeon) return;
        
        const newX = this.player.x + dir.x;
        const newY = this.player.y + dir.y;
        
        // 检查碰撞
        if (this.dungeon.canMoveTo(newX, newY)) {
            this.player.moveTo(newX, newY);
            
            // 触发视野内事件
            this.dungeon.checkTileEvent(newX, newY);
        }
    }
    
    interact() {
        if (!this.player || !this.dungeon) return;
        
        const event = this.dungeon.getTileEvent(this.player.x, this.player.y);
        if (event) {
            this.triggerEvent(event);
        }
    }
    
    triggerEvent(event) {
        switch (event.type) {
            case 'enemy':
                this.startBattle(event.enemy);
                break;
            case 'chest':
                this.openChest(event);
                break;
            case 'shop':
                this.openShop(event.npc);
                break;
            case 'npc':
                this.startNPCDialogue(event.npc);
                break;
            case 'stairs':
                this.nextFloor();
                break;
            case 'trap':
                this.triggerTrap(event.trap);
                break;
            case 'treasure':
                this.openTreasure(event);
                break;
        }
    }
    
    startBattle(enemy) {
        this.combat.start(enemy);
        this.setState(GameState.BATTLE);
    }
    
    openChest(event) {
        const gold = Math.floor(Math.random() * 50) + this.currentFloor * 5;
        this.player.gold += gold;
        this.showNotification(`获得 ${gold} 金币！`, 2000);
        this.dungeon.removeEvent(event.x, event.y);
        this.achievementManager.check('first_gold');
    }
    
    openShop(npc) {
        this.currentNPC = npc;
        this.setState(GameState.SHOP);
    }
    
    startNPCDialogue(npc) {
        this.currentNPC = npc;
        this.setState(GameState.NPC);
    }
    
    nextFloor() {
        this.currentFloor++;
        
        // 检查地区变化
        for (const [biome, data] of Object.entries(CONFIG.BIOMES)) {
            if (this.currentFloor >= data.floorRange[0] && this.currentFloor <= data.floorRange[1]) {
                if (this.currentBiome !== biome) {
                    this.currentBiome = biome;
                    this.showNotification(`进入: ${data.name}`, 2000);
                }
                break;
            }
        }
        
        // 检查胜利条件
        if (this.currentFloor > 50) {
            this.victory();
            return;
        }
        
        // 生成新地下城
        this.dungeon.generate(this.currentFloor, this.currentBiome);
        this.player.floor = this.currentFloor;
        this.showNotification(`第 ${this.currentFloor} 层`, 2000);
        this.achievementManager.check('floor_' + this.currentFloor);
    }
    
    triggerTrap(trap) {
        let damage = trap.damage;
        if (this.player.isDefending) damage = Math.floor(damage * CONFIG.COMBAT.DEFEND_DAMAGE_REDUCTION);
        
        this.player.takeDamage(damage);
        this.screenShake(5, 200);
        this.showNotification(`触发陷阱！受到 ${damage} 点伤害`, 2000);
        
        if (this.player.hp <= 0) {
            this.gameOver();
        }
    }
    
    openTreasure(event) {
        // 随机获得物品
        const item = this.itemManager.generateRandomItem(this.currentFloor);
        this.player.addItem(item);
        this.showNotification(`获得宝物: ${item.name}！`, 2000);
        this.dungeon.removeEvent(event.x, event.y);
    }
    
    handleBattleInput(e) {
        if (!this.combat || !this.combat.inCombat) return;
        
        const shortcuts = {
            '1': 'attack', '2': 'defend', '3': 'skill1', '4': 'skill2', '5': 'item', 'Escape': 'flee'
        };
        
        if (shortcuts[e.key]) {
            this.combat.executeAction(shortcuts[e.key]);
        }
    }
    
    handleShopInput(e) {
        if (e.key === 'Escape' || e.key === 'q') {
            this.setState(GameState.DUNGEON);
        } else if (e.key >= '1' && e.key <= '9') {
            const index = parseInt(e.key) - 1;
            this.buyItem(index);
        }
    }
    
    buyItem(index) {
        if (!this.currentNPC || !this.currentNPC.inventory) return;
        const item = this.currentNPC.inventory[index];
        if (!item) return;
        
        if (this.player.gold >= item.price) {
            this.player.gold -= item.price;
            this.player.addItem(item);
            this.showNotification(`购买: ${item.name}`, 1500);
            this.audioManager.play('purchase');
        } else {
            this.showNotification('金币不足！', 1500);
        }
    }
    
    handleCraftingInput(e) {
        if (e.key === 'Escape') this.setState(GameState.DUNGEON);
    }
    
    handleInventoryInput(e) {
        if (e.key === 'Escape' || e.key === 'i' || e.key === 'I') {
            this.setState(GameState.DUNGEON);
        } else if (e.key >= '1' && e.key <= '9') {
            const index = parseInt(e.key) - 1;
            this.useInventoryItem(index);
        }
    }
    
    useInventoryItem(index) {
        const inv = this.player.inventory;
        if (index >= inv.length) return;
        
        const { item } = inv[index];
        if (item.type === 'consumable') {
            this.itemManager.useItem(this.player, item);
            inv.splice(index, 1);
            this.audioManager.play('item');
        }
    }
    
    handleNPCInput(e) {
        if (e.key === 'Escape' || e.key === 'q') {
            this.setState(GameState.DUNGEON);
        } else if (e.key === ' ' || e.key === 'Enter') {
            this.advanceDialogue();
        }
    }
    
    advanceDialogue() {
        if (!this.currentNPC) return;
        this.currentNPC.dialogueIndex++;
        if (this.currentNPC.dialogueIndex >= this.currentNPC.dialogue.length) {
            this.setState(GameState.DUNGEON);
        }
    }
    
    handleQuestLogInput(e) {
        if (e.key === 'Escape' || e.key === 'k' || e.key === 'K') {
            this.setState(GameState.DUNGEON);
        }
    }
    
    handlePauseInput(e) {
        if (e.key === 'Escape' || e.key === 'p') {
            this.setState(GameState.DUNGEON);
        }
    }
    
    handleSettingsInput(e) {
        if (e.key === 'Escape') {
            if (this.gameStarted) this.setState(GameState.MENU);
            else this.setState(GameState.TITLE);
        }
    }
    
    handleClick() {
        // 点击处理(菜单按钮等)
    }
    
    openCharacterSheet() {
        // 显示角色面板
        this.showNotification(`Lv.${this.player.level} ${this.player.name}`, 2000);
    }
    
    // ==================== 游戏循环 ====================
    gameLoop(timestamp) {
        // 计算deltaTime
        this.deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        
        // FPS计算
        this.fpsCounter++;
        this.fpsTime += this.deltaTime;
        if (this.fpsTime >= 1) {
            this.currentFPS = this.fpsCounter;
            this.fpsCounter = 0;
            this.fpsTime = 0;
        }
        
        // 更新
        if (!this.paused) {
            this.update(this.deltaTime);
        }
        
        // 渲染
        this.render();
        
        // 下一帧
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    update(dt) {
        // 更新游戏时间
        this.gameTime += dt;
        
        // 更新粒子
        this.particleSystem.update(dt);
        
        // 更新屏幕震动
        if (this.screenShake.duration > 0) {
            this.screenShake.duration -= dt * 1000;
        }
        
        // 更新通知
        this.notifications = this.notifications.filter(n => {
            n.duration -= dt * 1000;
            return n.duration > 0;
        });
        
        // 更新成就弹窗
        if (this.achievementPopup) {
            this.achievementPopup.time -= dt * 1000;
            if (this.achievementPopup.time <= 0) {
                this.achievementPopup = null;
            }
        }
        
        // 更新淡出
        if (this.isFading && this.fadeCallback) {
            this.fadeAlpha += dt * 2;
            if (this.fadeAlpha >= 1) {
                this.fadeAlpha = 1;
                this.isFading = false;
                this.fadeCallback();
                this.fadeCallback = null;
            }
        }
        
        // 更新状态特定逻辑
        if (this.state === GameState.BATTLE) {
            this.combat.update(dt);
        }
        
        // 更新玩家状态
        if (this.player) {
            this.player.updateStatus(dt);
        }
        
        // 检查成就
        this.achievementManager.update();
        
        // 自动存档
        if (this.gameTime > 0 && Math.floor(this.gameTime) % 30 === 0) {
            // 每30秒自动存档
        }
    }
    
    render() {
        // 保存context
        this.ctx.save();
        
        // 应用屏幕震动
        if (this.screenShake.duration > 0) {
            const shakeX = (Math.random() - 0.5) * this.screenShake.intensity;
            const shakeY = (Math.random() - 0.5) * this.screenShake.intensity;
            this.ctx.translate(shakeX, shakeY);
        }
        
        // 清空画布
        this.ctx.fillStyle = '#0a0a0f';
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        // 渲染当前状态
        switch (this.state) {
            case GameState.TITLE:
                this.renderTitle();
                break;
            case GameState.MENU:
                this.renderMenu();
                break;
            case GameState.CLASS_SELECT:
                this.renderClassSelect();
                break;
            case GameState.DUNGEON:
                this.renderDungeon();
                break;
            case GameState.BATTLE:
                this.renderBattle();
                break;
            case GameState.SHOP:
                this.renderShop();
                break;
            case GameState.CRAFTING:
                this.renderCrafting();
                break;
            case GameState.INVENTORY:
                this.renderInventory();
                break;
            case GameState.NPC:
                this.renderNPC();
                break;
            case GameState.QUEST_LOG:
                this.renderQuestLog();
                break;
            case GameState.PAUSE:
                this.renderDungeon();
                this.renderPauseOverlay();
                break;
            case GameState.GAME_OVER:
                this.renderGameOver();
                break;
            case GameState.VICTORY:
                this.renderVictory();
                break;
            case GameState.SETTINGS:
                this.renderSettings();
                break;
        }
        
        // 渲染UI覆盖层
        this.renderNotifications();
        this.renderAchievementPopup();
        
        // 渲染FPS
        if (CONFIG.DEBUG) {
            this.ctx.fillStyle = '#00ff00';
            this.ctx.font = '12px monospace';
            this.ctx.fillText(`FPS: ${this.currentFPS}`, 10, 20);
        }
        
        // 渲染淡出
        if (this.fadeAlpha > 0) {
            this.ctx.fillStyle = `rgba(0, 0, 0, ${this.fadeAlpha})`;
            this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        }
        
        this.ctx.restore();
    }
    
    renderTitle() {
        const ctx = this.ctx;
        const cx = CONFIG.CANVAS_WIDTH / 2;
        const cy = CONFIG.CANVAS_HEIGHT / 2;
        
        // 背景渐变
        const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.CANVAS_HEIGHT);
        gradient.addColorStop(0, '#0a0a12');
        gradient.addColorStop(0.5, '#1a1a2e');
        gradient.addColorStop(1, '#0f0f1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        // 装饰线条
        ctx.strokeStyle = '#4a4a6a';
        ctx.lineWidth = 1;
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * 40);
            ctx.lineTo(CONFIG.CANVAS_WIDTH, i * 40);
            ctx.stroke();
        }
        
        // 主标题
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 72px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 文字阴影
        ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
        ctx.shadowBlur = 30;
        ctx.fillText('符文之地', cx, cy - 150);
        ctx.shadowBlur = 0;
        
        // 副标题
        ctx.fillStyle = '#8a8aaa';
        ctx.font = '24px serif';
        ctx.fillText('RUNE LAND', cx, cy - 80);
        
        // 版本
        ctx.fillStyle = '#4a4a6a';
        ctx.font = '14px monospace';
        ctx.fillText('v1.0.0', cx, cy - 40);
        
        // 开始提示
        const pulse = Math.sin(this.gameTime * 3) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(224, 224, 224, ${pulse})`;
        ctx.font = '20px sans-serif';
        ctx.fillText('按 Enter 或 空格 开始游戏', cx, cy + 80);
        
        // 快捷键提示
        ctx.fillStyle = '#6a6a8a';
        ctx.font = '14px sans-serif';
        ctx.fillText('WASD移动 | 空格交互 | I背包 | K任务 | C角色 | ESC暂停', cx, cy + 150);
        
        // 版权
        ctx.fillStyle = '#3a3a5a';
        ctx.font = '12px sans-serif';
        ctx.fillText('© 2026 Roguelike ARPG', cx, CONFIG.CANVAS_HEIGHT - 30);
    }
    
    renderMenu() {
        const ctx = this.ctx;
        const cx = CONFIG.CANVAS_WIDTH / 2;
        const cy = CONFIG.CANVAS_HEIGHT / 2;
        
        // 背景
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        // 标题
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 36px serif';
        ctx.textAlign = 'center';
        ctx.fillText('主菜单', cx, 100);
        
        // 菜单项
        const menuItems = ['继续游戏', '新游戏', '设置', '退出'];
        const menuY = cy - 60;
        
        menuItems.forEach((item, i) => {
            const y = menuY + i * 60;
            const selected = i === this.menuSelection;
            
            if (selected) {
                ctx.fillStyle = '#4a4a6a';
                ctx.fillRect(cx - 150, y - 20, 300, 45);
                ctx.fillStyle = '#ffd700';
            } else {
                ctx.fillStyle = '#8a8aaa';
            }
            
            ctx.font = selected ? 'bold 24px sans-serif' : '20px sans-serif';
            ctx.fillText(item, cx, y + 5);
            
            if (selected) {
                ctx.fillText('▶', cx - 130, y + 5);
            }
        });
        
        // 底部信息
        ctx.fillStyle = '#4a4a6a';
        ctx.font = '14px sans-serif';
        ctx.fillText('按 Enter 选择 | ESC 返回', cx, CONFIG.CANVAS_HEIGHT - 50);
    }
    
    renderClassSelect() {
        const ctx = this.ctx;
        const cx = CONFIG.CANVAS_WIDTH / 2;
        
        // 背景
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        // 标题
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 36px serif';
        ctx.textAlign = 'center';
        ctx.fillText('选择职业', cx, 80);
        
        // 职业选项
        const classes = [
            { class: PlayerClass.WARRIOR, name: '战士', desc: '高攻物理，厚血量', color: '#ff6b6b' },
            { class: PlayerClass.MAGE, name: '法师', desc: '元素魔法，高爆发', color: '#6b9fff' },
            { class: PlayerClass.RANGER, name: '游侠', desc: '敏捷暴击，高闪避', color: '#6bff6b' },
            { class: PlayerClass.CLERIC, name: '圣职', desc: '治疗辅助，平衡', color: '#ffd700' }
        ];
        
        const startY = 150;
        const cardWidth = 260;
        const cardHeight = 140;
        const gap = 20;
        const totalWidth = classes.length * cardWidth + (classes.length - 1) * gap;
        const startX = (CONFIG.CANVAS_WIDTH - totalWidth) / 2;
        
        classes.forEach((c, i) => {
            const x = startX + i * (cardWidth + gap);
            const y = startY;
            const selected = i === this.classSelection;
            
            // 卡片背景
            ctx.fillStyle = selected ? '#2a2a4a' : '#1a1a2a';
            ctx.fillRect(x, y, cardWidth, cardHeight);
            
            // 边框
            ctx.strokeStyle = selected ? c.color : '#4a4a6a';
            ctx.lineWidth = selected ? 3 : 1;
            ctx.strokeRect(x, y, cardWidth, cardHeight);
            
            // 职业名
            ctx.fillStyle = c.color;
            ctx.font = 'bold 24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(c.name, x + cardWidth / 2, y + 40);
            
            // 描述
            ctx.fillStyle = '#aaaaaa';
            ctx.font = '14px sans-serif';
            ctx.fillText(c.desc, x + cardWidth / 2, y + 70);
            
            // 属性预览
            const stats = CLASS_STATS[c.class];
            ctx.font = '12px monospace';
            ctx.fillStyle = '#888888';
            ctx.fillText(`HP:${stats.baseHP} ATK:${stats.baseATK} DEF:${stats.baseDEF}`, x + cardWidth / 2, y + 100);
            
            // 选择指示
            if (selected) {
                ctx.fillStyle = c.color;
                ctx.fillText('▲', x + cardWidth / 2, y - 10);
            }
        });
        
        // 底部提示
        ctx.fillStyle = '#6a6a8a';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('↑↓ 选择职业 | Enter 确认 | ESC 返回', cx, CONFIG.CANVAS_HEIGHT - 50);
    }
    
    renderDungeon() {
        if (!this.dungeon) return;
        this.dungeon.render(this.ctx, this.player);
        this.renderHUD();
    }
    
    renderHUD() {
        const ctx = this.ctx;
        if (!this.player) return;
        
        // 玩家信息面板(左上)
        ctx.fillStyle = 'rgba(20, 20, 40, 0.9)';
        ctx.fillRect(10, 10, 220, 100);
        ctx.strokeStyle = '#4a4a6a';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, 220, 100);
        
        // 名称和等级
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${this.player.name} Lv.${this.player.level}`, 20, 32);
        
        // HP条
        ctx.fillStyle = '#333';
        ctx.fillRect(20, 40, 200, 16);
        const hpPercent = this.player.hp / this.player.totalMaxHP;
        ctx.fillStyle = hpPercent > 0.3 ? '#4a4' : '#a44';
        ctx.fillRect(20, 40, 200 * hpPercent, 16);
        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.fillText(`HP: ${this.player.hp}/${this.player.totalMaxHP}`, 25, 53);
        
        // MP条
        ctx.fillStyle = '#333';
        ctx.fillRect(20, 60, 200, 16);
        const mpPercent = this.player.mp / this.player.totalMaxMP;
        ctx.fillStyle = '#44a';
        ctx.fillRect(20, 60, 200 * mpPercent, 16);
        ctx.fillStyle = '#fff';
        ctx.fillText(`MP: ${this.player.mp}/${this.player.totalMaxMP}`, 25, 73);
        
        // 金币和层数
        ctx.fillStyle = '#ffd700';
        ctx.font = '14px sans-serif';
        ctx.fillText(`💰 ${this.player.gold}`, 20, 95);
        ctx.fillStyle = '#aaa';
        ctx.fillText(`第 ${this.currentFloor} 层`, 120, 95);
        
        // 状态效果(右上)
        if (this.player.statusEffects.length > 0) {
            ctx.fillStyle = 'rgba(20, 20, 40, 0.9)';
            ctx.fillRect(CONFIG.CANVAS_WIDTH - 160, 10, 150, 30 + this.player.statusEffects.length * 20);
            
            this.player.statusEffects.forEach((se, i) => {
                ctx.fillStyle = se.type === 'buff' ? '#4a4' : '#a44';
                ctx.font = '12px sans-serif';
                ctx.fillText(`${se.type}: ${se.duration}`, CONFIG.CANVAS_WIDTH - 150, 30 + i * 20);
            });
        }
        
        // 小地图(右下)
        if (this.dungeon) {
            this.dungeon.renderMinimap(ctx, CONFIG.CANVAS_WIDTH - 170, CONFIG.CANVAS_HEIGHT - 170, 160, 160, this.player);
        }
    }
    
    renderBattle() {
        if (!this.combat) return;
        this.combat.render(this.ctx);
        this.renderHUD();
    }
    
    renderShop() {
        const ctx = this.ctx;
        const cx = CONFIG.CANVAS_WIDTH / 2;
        
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 32px serif';
        ctx.textAlign = 'center';
        ctx.fillText('商店', cx, 60);
        
        if (this.currentNPC && this.currentNPC.inventory) {
            this.currentNPC.inventory.forEach((item, i) => {
                const y = 120 + i * 50;
                ctx.fillStyle = i % 2 === 0 ? '#1a1a2a' : '#2a2a3a';
                ctx.fillRect(cx - 300, y, 600, 45);
                
                ctx.fillStyle = '#fff';
                ctx.font = '16px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(`${i + 1}. ${item.name}`, cx - 280, y + 25);
                
                ctx.fillStyle = '#ffd700';
                ctx.textAlign = 'right';
                ctx.fillText(`${item.price}G`, cx + 280, y + 25);
            });
        }
        
        ctx.fillStyle = '#6a6a8a';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('按 1-9 购买 | ESC 退出', cx, CONFIG.CANVAS_HEIGHT - 40);
    }
    
    renderCrafting() {
        const ctx = this.ctx;
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 32px serif';
        ctx.textAlign = 'center';
        ctx.fillText('锻造与炼金', CONFIG.CANVAS_WIDTH / 2, 60);
        
        ctx.fillStyle = '#6a6a8a';
        ctx.font = '16px sans-serif';
        ctx.fillText('ESC 返回游戏', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT - 40);
    }
    
    renderInventory() {
        const ctx = this.ctx;
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 32px serif';
        ctx.textAlign = 'center';
        ctx.fillText('背包', CONFIG.CANVAS_WIDTH / 2, 60);
        
        if (this.player && this.player.inventory) {
            const cols = 5;
            const itemWidth = 100;
            const itemHeight = 80;
            const startX = (CONFIG.CANVAS_WIDTH - cols * itemWidth) / 2;
            const startY = 120;
            
            this.player.inventory.forEach((invItem, i) => {
                const col = i % cols;
                const row = Math.floor(i / cols);
                const x = startX + col * itemWidth;
                const y = startY + row * itemHeight;
                
                ctx.fillStyle = '#1a1a2a';
                ctx.fillRect(x, y, itemWidth - 5, itemHeight - 5);
                ctx.strokeStyle = '#4a4a6a';
                ctx.strokeRect(x, y, itemWidth - 5, itemHeight - 5);
                
                ctx.fillStyle = '#fff';
                ctx.font = '12px sans-serif';
                ctx.textAlign = 'center';
                const name = invItem.item.name.length > 10 
                    ? invItem.item.name.substring(0, 8) + '..' 
                    : invItem.item.name;
                ctx.fillText(name, x + itemWidth / 2 - 2, y + 30);
                
                if (invItem.quantity > 1) {
                    ctx.fillStyle = '#ffd700';
                    ctx.fillText(`x${invItem.quantity}`, x + itemWidth / 2 - 2, y + 55);
                }
                
                ctx.fillStyle = '#666';
                ctx.font = '10px monospace';
                ctx.fillText(`${i + 1}`, x + 10, y + 15);
            });
        }
        
        ctx.fillStyle = '#6a6a8a';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('按 1-9 使用物品 | I 或 ESC 返回', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT - 40);
    }
    
    renderNPC() {
        const ctx = this.ctx;
        
        // 对话框背景
        ctx.fillStyle = 'rgba(20, 20, 40, 0.95)';
        ctx.fillRect(50, CONFIG.CANVAS_HEIGHT - 200, CONFIG.CANVAS_WIDTH - 100, 150);
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.strokeRect(50, CONFIG.CANVAS_HEIGHT - 200, CONFIG.CANVAS_WIDTH - 100, 150);
        
        if (this.currentNPC) {
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(this.currentNPC.name, 70, CONFIG.CANVAS_HEIGHT - 170);
            
            ctx.fillStyle = '#e0e0e0';
            ctx.font = '16px sans-serif';
            const dialogue = this.currentNPC.dialogue[this.currentNPC.dialogueIndex] || '';
            this.drawTextBox(ctx, dialogue, 70, CONFIG.CANVAS_HEIGHT - 145, CONFIG.CANVAS_WIDTH - 140, 100);
        }
        
        ctx.fillStyle = '#6a6a8a';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('空格/Enter 继续 | ESC 退出', CONFIG.CANVAS_WIDTH - 70, CONFIG.CANVAS_HEIGHT - 60);
    }
    
    drawTextBox(ctx, text, x, y, maxWidth, maxHeight) {
        const words = text.split('');
        let line = '';
        let yPos = y;
        
        ctx.fillText(line, x, yPos);
    }
    
    renderQuestLog() {
        const ctx = this.ctx;
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 32px serif';
        ctx.textAlign = 'center';
        ctx.fillText('任务日志', CONFIG.CANVAS_WIDTH / 2, 60);
        
        ctx.fillStyle = '#6a6a8a';
        ctx.font = '14px sans-serif';
        ctx.fillText('K 或 ESC 返回', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT - 40);
    }
    
    renderPauseOverlay() {
        const ctx = this.ctx;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 48px serif';
        ctx.textAlign = 'center';
        ctx.fillText('暂停', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2);
        
        ctx.fillStyle = '#8a8aaa';
        ctx.font = '20px sans-serif';
        ctx.fillText('按 ESC 或 P 继续', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 50);
    }
    
    renderGameOver() {
        const ctx = this.ctx;
        
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        ctx.fillStyle = '#aa2222';
        ctx.font = 'bold 64px serif';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 - 50);
        
        ctx.fillStyle = '#8a8aaa';
        ctx.font = '24px sans-serif';
        ctx.fillText(`达到第 ${this.currentFloor} 层`, CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 20);
        
        ctx.fillStyle = '#6a6a8a';
        ctx.font = '18px sans-serif';
        ctx.fillText('按 Enter 回到标题', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 80);
    }
    
    renderVictory() {
        const ctx = this.ctx;
        
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        // 胜利动画背景
        const time = this.gameTime;
        for (let i = 0; i < 50; i++) {
            const x = (Math.sin(time + i) * 0.5 + 0.5) * CONFIG.CANVAS_WIDTH;
            const y = (Math.cos(time * 0.7 + i * 1.3) * 0.5 + 0.5) * CONFIG.CANVAS_HEIGHT;
            ctx.fillStyle = `rgba(255, 215, 0, ${0.3 + Math.sin(time * 2 + i) * 0.2})`;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 64px serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        ctx.shadowBlur = 30;
        ctx.fillText('胜利！', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 - 50);
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#e0e0e0';
        ctx.font = '24px sans-serif';
        ctx.fillText('你征服了符文之地！', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 20);
        
        ctx.fillStyle = '#6a6a8a';
        ctx.font = '18px sans-serif';
        ctx.fillText('按 Enter 回到标题', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 80);
    }
    
    renderSettings() {
        const ctx = this.ctx;
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 32px serif';
        ctx.textAlign = 'center';
        ctx.fillText('设置', CONFIG.CANVAS_WIDTH / 2, 80);
        
        ctx.fillStyle = '#6a6a8a';
        ctx.font = '16px sans-serif';
        ctx.fillText('ESC 返回', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT - 40);
    }
    
    renderNotifications() {
        const ctx = this.ctx;
        this.notifications.forEach((n, i) => {
            const alpha = Math.min(1, n.duration / 500);
            ctx.fillStyle = `rgba(20, 20, 40, ${alpha * 0.9})`;
            ctx.fillRect(CONFIG.CANVAS_WIDTH / 2 - 200, 150 + i * 40, 400, 35);
            
            ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(n.message, CONFIG.CANVAS_WIDTH / 2, 173 + i * 40);
        });
    }
    
    renderAchievementPopup() {
        if (!this.achievementPopup) return;
        
        const ctx = this.ctx;
        const alpha = Math.min(1, this.achievementPopup.time / 1000);
        
        ctx.fillStyle = `rgba(20, 20, 40, ${alpha * 0.95})`;
        ctx.fillRect(CONFIG.CANVAS_WIDTH / 2 - 200, CONFIG.CANVAS_HEIGHT - 120, 400, 80);
        ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.strokeRect(CONFIG.CANVAS_WIDTH / 2 - 200, CONFIG.CANVAS_HEIGHT - 120, 400, 80);
        
        ctx.fillStyle = `rgba(150, 150, 150, ${alpha})`;
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏆 成就解锁', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT - 95);
        
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(this.achievementPopup.name, CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT - 65);
    }
    
    // ==================== 状态切换 ====================
    setState(newState) {
        const oldState = this.state;
        this.state = newState;
        console.log(`[Game] 状态切换: ${oldState} → ${newState}`);
        
        // 状态进入处理
        if (newState === GameState.TITLE) {
            this.gameStarted = false;
        }
    }
    
    // ==================== 游戏控制 ====================
    gameOver() {
        this.setState(GameState.GAME_OVER);
        this.saveManager.autoSave(this);
    }
    
    victory() {
        this.setState(GameState.VICTORY);
        this.achievementManager.check('complete_game');
        this.saveManager.deleteSave();
    }
    
    // ==================== 通知系统 ====================
    showNotification(message, duration = 2000) {
        this.notifications.push({ message, duration });
    }
    
    showAchievement(name) {
        this.achievementPopup = { name, time: ACHIEVEMENT_DISPLAY_TIME };
    }
    
    screenShake(intensity = 5, duration = 200) {
        this.screenShake = { intensity, duration };
    }
    
    fadeIn(duration = 0.5) {
        this.fadeAlpha = 1;
        this.isFading = true;
        this.fadeDirection = -1;
    }
    
    fadeOut(duration = 0.5, callback) {
        this.fadeAlpha = 0;
        this.isFading = true;
        this.fadeDirection = 1;
        this.fadeCallback = callback;
    }
}

// ==================== 启动游戏 ====================
const game = new Game();
document.addEventListener('DOMContentLoaded', () => game.init());

// 导出
export { Game, GameState, CONFIG, ACHIEVEMENT_DISPLAY_TIME };
