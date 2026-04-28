/**
 * 符文之地 (Rune Land) - 完整游戏入口
 * 30,000+行Roguelike ARPG游戏
 */

import { Player, CharacterClass, CLASS_STATS } from './player.js';
import { CombatSystem, ElementType, ElementReactions, ActionType } from './combat.js';
import { Enemy, EnemyManager } from './enemy.js';
import { DungeonGenerator, RoomType } from './dungeon.js';
import { ItemManager, ItemType, ItemRarity, EquipSlot } from './items.js';
import { SkillManager, SkillDatabase } from './skills.js';
import { Quest, QuestManagerFull, QuestObjective, QUEST_DATA } from './quest_system_full.js';
import { Achievement, AchievementManagerFull, ACHIEVEMENTS_FULL } from './achievements_system_full.js';
import { CraftingSystemFull, CraftingRecipe, CraftingUI, CRAFTING_RECIPES_FULL } from './crafting_system_full.js';
import { StatusEffect, StatusEffectManager, STATUS_EFFECTS } from './status_effects_system.js';
import { BossPhase, BossAI, BossBattleManager, BOSS_MECHANICS } from './boss_mechanics.js';
import { Pathfinder, PathNode } from './ai_pathfinding.js';
import { RenderManager, RenderLayer, TileRenderer, TextRenderer } from './render_system.js';
import { UIComponent, Button, Label, ProgressBar, HealthBar, Panel, InventorySlot, UIManager } from './ui_components.js';
import { Notification, NotificationManager } from './notification_system.js';
import { Particle, ParticleEmitter, AdvancedParticleSystem } from './particle_advanced.js';
import { TipSystem, GAME_TIPS, AchievementTips } from './tips_and_tricks.js';
import { SaveData, LocalSaveManager, CloudSaveManager, DataManager } from './save_system.js';
import { DebugSystem } from './debug_system.js';
import { GAME_CONFIG_FULL } from './config_all.js';
import { SoundEngine } from './sound_engine.js';
import { NetworkManager } from './network_manager.js';
import { MultiplayerManager } from './multiplayer_system.js';
import { ReplayRecorder, ReplayPlayer } from './replay_system.js';
import { AccessibilitySystem, ScreenReader } from './accessibility_system.js';

// ==================== 主游戏类 ====================
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // 游戏状态
        this.state = 'menu'; // menu, playing, paused, gameover, victory
        this.currentFloor = 1;
        this.currentBiome = 'forest';
        
        // 核心系统
        this.player = null;
        this.enemies = [];
        this.dungeonMap = null;
        this.currentDungeon = null;
        
        // 系统管理器
        this.inventory = new Inventory(this);
        this.equipment = new Equipment(this);
        this.skillSystem = null;
        this.questManager = null;
        this.achievementManager = null;
        this.craftingSystem = null;
        this.bossBattleManager = null;
        this.notificationManager = null;
        this.particleSystem = null;
        this.tipsManager = null;
        this.saveManager = null;
        this.debugSystem = null;
        this.soundEngine = null;
        this.networkManager = null;
        this.multiplayerManager = null;
        this.replayRecorder = null;
        this.accessibility = null;
        this.screenReader = null;
        
        // UI
        this.ui = null;
        this.renderManager = null;
        
        // 时间
        this.lastTime = 0;
        this.deltaTime = 0;
        this.gameTime = 0;
        this.playTime = 0;
        
        // 输入
        this.keys = {};
        this.mouse = { x: 0, y: 0, down: false };
        
        // 配置
        this.config = GAME_CONFIG_FULL;
        
        // 初始化
        this.init();
    }
    
    init() {
        console.log('[Game] 初始化游戏...');
        
        // 初始化核心系统
        this.notificationManager = new NotificationSystem(this);
        this.particleSystem = new ParticleSystem(this.ctx);
        this.soundEngine = new SoundEngine(this);
        this.accessibility = new AccessibilitySystem(this);
        this.screenReader = new ScreenReader(this);
        this.debugSystem = new DebugSystem(this);
        
        // 初始化UI
        this.setupUI();
        
        // 初始化输入
        this.setupInput();
        
        // 初始化多人系统
        this.multiplayerManager = new MultiplayerManager(this);
        
        // 初始化回放系统
        this.replayRecorder = new ReplayRecorder(this);
        
        // 初始化存档
        this.saveManager = new SaveManager(this);
        
        // 加载配置
        this.loadSettings();
        
        console.log('[Game] 游戏初始化完成');
    }
    
    setupUI() {
        this.renderManager = new RenderManager(this.ctx, this.width, this.height);
        this.ui = new UIManager(this);
        
        // 创建主菜单UI
        this.createMainMenuUI();
        
        // 创建游戏HUD
        this.createGameHUD();
    }
    
    createMainMenuUI() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // 标题
        const title = new Label(centerX, 80, '符文之地');
        title.font = 'bold 48px serif';
        title.textAlign = 'center';
        this.ui.add(title);
        
        // 开始按钮
        const startBtn = new Button(centerX - 75, centerY, 150, 50, '开始游戏');
        startBtn.onClick = () => this.startNewGame();
        this.ui.add(startBtn);
        
        // 继续按钮
        const continueBtn = new Button(centerX - 75, centerY + 70, 150, 50, '继续游戏');
        continueBtn.onClick = () => this.continueGame();
        this.ui.add(continueBtn);
        
        // 设置按钮
        const settingsBtn = new Button(centerX - 75, centerY + 140, 150, 50, '设置');
        settingsBtn.onClick = () => this.showSettings();
        this.ui.add(settingsBtn);
        
        // 关于按钮
        const aboutBtn = new Button(centerX - 75, centerY + 210, 150, 50, '关于');
        aboutBtn.onClick = () => this.showAbout();
        this.ui.add(aboutBtn);
    }
    
    createGameHUD() {
        // HUD会在游戏开始后创建
    }
    
    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.handleKeyDown(e);
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.down = true;
            this.handleMouseDown(e);
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            this.mouse.down = false;
        });
    }
    
    handleKeyDown(e) {
        switch (e.code) {
            case 'Escape':
                if (this.state === 'playing') {
                    this.pause();
                } else if (this.state === 'paused') {
                    this.resume();
                }
                break;
            case 'KeyI':
                if (this.state === 'playing') {
                    this.toggleInventory();
                }
                break;
            case 'KeyQ':
                if (this.state === 'playing') {
                    this.toggleQuestLog();
                }
                break;
            case 'KeyK':
                if (this.state === 'playing') {
                    this.toggleSkillTree();
                }
                break;
            case 'KeyM':
                if (this.state === 'playing') {
                    this.toggleMap();
                }
                break;
            case 'KeyC':
                if (this.state === 'playing') {
                    this.toggleCharacter();
                }
                break;
            case 'KeyB':
                if (this.state === 'playing') {
                    this.toggleCrafting();
                }
                break;
            case 'F1':
                this.debugSystem.toggle();
                break;
            case 'F2':
                this.debugSystem.executeCommand('heal');
                break;
            case 'F3':
                this.debugSystem.executeCommand('gold 1000');
                break;
        }
        
        // 数字键 1-9 使用技能
        if (this.state === 'playing' && e.code.startsWith('Digit')) {
            const skillIndex = parseInt(e.code.replace('Digit', '')) - 1;
            if (skillIndex >= 0 && skillIndex < 9) {
                this.player?.useSkill(skillIndex);
            }
        }
    }
    
    handleMouseDown(e) {
        // 处理UI点击
    }
    
    startNewGame() {
        console.log('[Game] 开始新游戏');
        
        // 创建角色选择
        this.showCharacterSelect();
    }
    
    showCharacterSelect() {
        // 角色选择界面
        this.state = 'character_select';
        
        // 清空UI
        this.ui.components = [];
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // 标题
        const title = new Label(centerX, 50, '选择职业');
        title.font = 'bold 36px serif';
        title.textAlign = 'center';
        this.ui.add(title);
        
        // 战士
        const warriorBtn = new Button(centerX - 200, centerY - 100, 150, 200, '战士');
        warriorBtn.onClick = () => this.selectCharacter('warrior');
        this.ui.add(warriorBtn);
        
        // 法师
        const mageBtn = new Button(centerX - 75, centerY - 100, 150, 200, '法师');
        mageBtn.onClick = () => this.selectCharacter('mage');
        this.ui.add(mageBtn);
        
        // 游侠
        const rangerBtn = new Button(centerX + 50, centerY - 100, 150, 200, '游侠');
        rangerBtn.onClick = () => this.selectCharacter('ranger');
        this.ui.add(rangerBtn);
        
        // 圣职
        const clericBtn = new Button(centerX - 75, centerY + 120, 150, 100, '圣职');
        clericBtn.onClick = () => this.selectCharacter('cleric');
        this.ui.add(clericBtn);
    }
    
    selectCharacter(characterClass) {
        console.log(`[Game] 选择职业: ${characterClass}`);
        
        // 创建玩家
        this.player = new Player(characterClass, this);
        
        // 初始化玩家系统
        this.skillSystem = new SkillSystem(this, this.player);
        this.questManager = new QuestManagerFull(this);
        this.achievementManager = new AchievementManagerFull(this);
        this.craftingSystem = new CraftingSystemFull(this);
        this.bossBattleManager = new BossBattleManager(this);
        this.tipsManager = new TipsManager(this);
        
        // 生成第一个地下城
        this.generateDungeon();
        
        // 创建游戏HUD
        this.createInGameHUD();
        
        // 开始游戏
        this.state = 'playing';
        this.playTime = 0;
        
        // 开始录制回放
        this.replayRecorder?.startRecording();
        
        // 显示提示
        this.notificationManager.showWelcome();
        this.tipsManager?.showNextTip();
    }
    
    generateDungeon() {
        const biome = this.getBiomeForFloor(this.currentFloor);
        this.currentBiome = biome;
        
        const generator = new DungeonGenerator(this.width / 40, this.height / 40, biome);
        generator.generate(this.currentFloor);
        
        this.dungeonMap = generator.getMap();
        this.currentDungeon = generator;
        
        // 生成敌人
        this.spawnEnemies();
    }
    
    getBiomeForFloor(floor) {
        if (floor <= 10) return 'forest';
        if (floor <= 20) return 'desert';
        if (floor <= 30) return 'ice';
        if (floor <= 40) return 'fire';
        return 'void';
    }
    
    spawnEnemies() {
        this.enemies = [];
        
        const enemyCount = 5 + Math.floor(this.currentFloor / 5);
        const biome = this.currentBiome;
        
        for (let i = 0; i < enemyCount; i++) {
            const pos = this.currentDungeon.getRandomWalkablePosition();
            if (pos) {
                const enemyType = this.getEnemyTypeForBiome(biome, this.currentFloor);
                const enemy = EnemyFactory.create(enemyType, pos.x, pos.y);
                enemy.level = this.currentFloor;
                this.enemies.push(enemy);
            }
        }
    }
    
    getEnemyTypeForBiome(biome, floor) {
        const baseFloor = Math.floor(floor / 10) * 10;
        const variants = [1, 2, 3];
        const variant = variants[Math.floor(Math.random() * variants.length)];
        
        return `${biome}_${floor <= 10 ? 'goblin' : floor <= 20 ? 'skeleton' : floor <= 30 ? 'ice_elemental' : floor <= 40 ? 'fire_demon' : 'void_specter'}_${variant}`;
    }
    
    continueGame() {
        // 尝试加载存档
        if (this.saveManager.load(0)) {
            this.state = 'playing';
            this.notificationManager.show('游戏已加载');
        } else {
            this.notificationManager.showWarning('没有找到存档');
        }
    }
    
    createInGameHUD() {
        // 清空UI
        this.ui.components = [];
        
        // 生命条
        const hpBar = new HealthBar(10, 10, 200, 20);
        this.ui.add(hpBar);
        this.hpBarUI = hpBar;
        
        // 魔法条
        const mpBar = new ProgressBar(10, 35, 200, 15);
        this.ui.add(mpBar);
        this.mpBarUI = mpBar;
        
        // 经验条
        const expBar = new ProgressBar(10, 55, 200, 10);
        this.ui.add(expBar);
        this.expBarUI = expBar;
        
        // 金币显示
        const goldLabel = new Label(this.width - 110, 10, '金币: 0');
        goldLabel.font = '16px sans-serif';
        this.ui.add(goldLabel);
        this.goldLabelUI = goldLabel;
        
        // 楼层显示
        const floorLabel = new Label(10, this.height - 30, `第 ${this.currentFloor} 层 - ${this.currentBiome}`);
        floorLabel.font = '16px sans-serif';
        this.ui.add(floorLabel);
        this.floorLabelUI = floorLabel;
        
        // 小地图
        // ...
    }
    
    pause() {
        this.state = 'paused';
        this.notificationManager.show('游戏暂停 (按ESC继续)');
    }
    
    resume() {
        this.state = 'playing';
    }
    
    toggleInventory() {
        // 切换背包界面
    }
    
    toggleQuestLog() {
        // 切换任务日志
    }
    
    toggleSkillTree() {
        // 切换技能树
    }
    
    toggleMap() {
        // 切换地图
    }
    
    toggleCharacter() {
        // 切换角色属性
    }
    
    toggleCrafting() {
        // 切换锻造界面
    }
    
    showSettings() {
        // 显示设置界面
    }
    
    showAbout() {
        // 显示关于界面
        this.notificationManager.show('符文之地 v1.0.0 - Roguelike ARPG');
    }
    
    loadSettings() {
        // 从localStorage加载设置
        const saved = localStorage.getItem('rune_land_settings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                Object.assign(this.config.settings, settings);
            } catch (e) {
                console.warn('[Game] 设置加载失败');
            }
        }
    }
    
    saveSettings() {
        localStorage.setItem('rune_land_settings', JSON.stringify(this.config.settings));
    }
    
    update(dt) {
        if (this.state !== 'playing') return;
        
        // 更新游戏时间
        this.playTime += dt;
        this.gameTime += dt;
        
        // 更新玩家
        this.player.update(dt);
        
        // 更新敌人
        for (const enemy of this.enemies) {
            enemy.update(dt);
        }
        
        // 更新系统
        this.skillSystem?.update(dt);
        this.craftingSystem?.update(dt);
        this.questManager?.update(dt);
        this.achievementManager?.update(dt);
        this.bossBattleManager?.update(dt);
        this.notificationManager?.update(dt);
        this.particleSystem?.update(dt);
        this.tipsManager?.update(dt);
        this.debugSystem?.update(dt);
        
        // 检查战斗
        this.checkCombat();
        
        // 检查敌人死亡
        this.checkEnemyDeaths();
        
        // 检查楼层完成
        this.checkFloorComplete();
        
        // 更新UI
        this.updateHUD();
        
        // 录制回放
        this.replayRecorder?.recordFrame();
    }
    
    checkCombat() {
        if (!this.player || this.enemies.length === 0) return;
        
        for (const enemy of this.enemies) {
            const dist = Math.sqrt(
                Math.pow(this.player.x - enemy.x, 2) +
                Math.pow(this.player.y - enemy.y, 2)
            );
            
            if (dist < 2) {
                // 进入战斗
                if (!enemy.inCombat) {
                    enemy.inCombat = true;
                    this.soundEngine?.playBossAppear();
                }
            }
        }
    }
    
    checkEnemyDeaths() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            if (this.enemies[i].hp <= 0) {
                const enemy = this.enemies[i];
                
                // 掉落物品
                this.handleEnemyDrop(enemy);
                
                // 统计数据
                this.stats.enemiesKilled++;
                
                // 移除敌人
                this.enemies.splice(i, 1);
                
                // 通知
                this.notificationManager.show(`${enemy.name} 被击败!`);
                this.soundEngine?.playDie();
                
                // 检查成就
                this.achievementManager?.checkAchievements();
            }
        }
    }
    
    handleEnemyDrop(enemy) {
        const dropChance = 0.3 + (this.currentFloor * 0.01);
        
        if (Math.random() < dropChance) {
            const item = ItemDatabase.getRandomItem(this.currentFloor);
            this.inventory.addItem(item.id, 1);
            this.notificationManager.showItem(`获得物品: ${item.name}`);
        }
        
        // 金币
        const gold = Math.floor(enemy.level * (5 + Math.random() * 10));
        this.player.gold += gold;
        this.stats.totalGoldEarned += gold;
    }
    
    checkFloorComplete() {
        if (this.enemies.length === 0) {
            // 检查是否是首领层
            if (this.currentFloor % 10 === 0) {
                // 首领已被击败，进入下一层
                this.currentFloor++;
                this.notificationManager.showAchievement(`到达第 ${this.currentFloor} 层!`);
                this.generateDungeon();
            } else {
                // 普通层完成
                this.currentFloor++;
                this.stats.highestFloor = Math.max(this.stats.highestFloor, this.currentFloor);
                this.notificationManager.show(`到达第 ${this.currentFloor} 层!`);
                this.generateDungeon();
            }
            
            // 保存进度
            this.saveManager?.autoSave();
        }
    }
    
    updateHUD() {
        if (!this.player) return;
        
        // 更新生命条
        this.hpBarUI?.setHealth(this.player.hp, this.player.maxHp);
        
        // 更新魔法条
        this.mpBarUI?.setValue(this.player.mp);
        this.mpBarUI?.setMaxValue(this.player.maxMp);
        
        // 更新经验条
        this.expBarUI?.setValue(this.player.exp);
        this.expBarUI?.setMaxValue(this.player.expToNextLevel);
        
        // 更新金币
        this.goldLabelUI.text = `金币: ${this.player.gold}`;
        
        // 更新楼层
        this.floorLabelUI.text = `第 ${this.currentFloor} 层 - ${this.currentBiome}`;
    }
    
    render() {
        // 清屏
        this.ctx.fillStyle = '#0a0a15';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        if (this.state === 'menu' || this.state === 'character_select') {
            this.renderMenu();
        } else if (this.state === 'playing' || this.state === 'paused') {
            this.renderGame();
        }
        
        // 渲染UI
        this.ui.render();
        
        // 渲染调试信息
        this.debugSystem?.renderDebug(this.ctx);
    }
    
    renderMenu() {
        // 背景
        this.ctx.fillStyle = '#1a1a2a';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 标题
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = 'bold 48px serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('符文之地', this.width / 2, 100);
        
        this.ctx.fillStyle = '#888888';
        this.ctx.font = '24px sans-serif';
        this.ctx.fillText('Roguelike ARPG', this.width / 2, 140);
    }
    
    renderGame() {
        if (!this.dungeonMap) return;
        
        // 渲染地下城
        this.renderDungeon();
        
        // 渲染玩家
        this.renderPlayer();
        
        // 渲染敌人
        this.renderEnemies();
        
        // 渲染特效
        this.particleSystem?.render(this.ctx);
        
        // 渲染调试信息
        if (this.debugSystem?.enabled) {
            this.renderDebugInfo();
        }
    }
    
    renderDungeon() {
        const tileSize = 40;
        
        for (let y = 0; y < this.dungeonMap.height; y++) {
            for (let x = 0; x < this.dungeonMap.width; x++) {
                const tile = this.dungeonMap.getTile(x, y);
                this.renderTile(x, y, tile, tileSize);
            }
        }
    }
    
    renderTile(x, y, tile, size) {
        const colors = {
            0: '#1a1a2a', // 墙
            1: '#2a2a3a', // 地板
            2: '#0066aa', // 水
            3: '#aa4400'  // 岩浆
        };
        
        this.ctx.fillStyle = colors[tile] || '#1a1a2a';
        this.ctx.fillRect(x * size, y * size, size, size);
        
        // 边框
        if (tile === 1) {
            this.ctx.strokeStyle = '#333344';
            this.ctx.strokeRect(x * size, y * size, size, size);
        }
    }
    
    renderPlayer() {
        if (!this.player) return;
        
        const size = 40;
        
        // 玩家颜色
        const colors = {
            warrior: '#ff4444',
            mage: '#4444ff',
            ranger: '#44ff44',
            cleric: '#ffff44'
        };
        
        this.ctx.fillStyle = colors[this.player.characterClass] || '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(
            this.player.x * size + size / 2,
            this.player.y * size + size / 2,
            size / 3,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // 方向指示
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(
            this.player.x * size + size / 2 + this.player.directionX * 10,
            this.player.y * size + size / 2 + this.player.directionY * 10,
            5,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }
    
    renderEnemies() {
        const size = 40;
        
        for (const enemy of this.enemies) {
            this.ctx.fillStyle = enemy.isBoss ? '#ff0000' : '#aa4444';
            this.ctx.beginPath();
            this.ctx.arc(
                enemy.x * size + size / 2,
                enemy.y * size + size / 2,
                enemy.isBoss ? size / 2 : size / 3,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            
            // 生命条
            const hpPercent = enemy.hp / enemy.maxHp;
            this.ctx.fillStyle = '#333333';
            this.ctx.fillRect(enemy.x * size, enemy.y * size - 10, size, 5);
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillRect(enemy.x * size, enemy.y * size - 10, size * hpPercent, 5);
        }
    }
    
    renderDebugInfo() {
        if (!this.debugSystem?.enabled) return;
        
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '14px monospace';
        this.ctx.textAlign = 'left';
        
        let y = 30;
        
        this.ctx.fillText(`FPS: ${this.debugSystem.fps}`, 10, y += 20);
        this.ctx.fillText(`Floor: ${this.currentFloor}`, 10, y += 20);
        this.ctx.fillText(`Enemies: ${this.enemies.length}`, 10, y += 20);
        
        if (this.player) {
            this.ctx.fillText(`HP: ${this.player.hp}/${this.player.maxHp}`, 10, y += 20);
            this.ctx.fillText(`MP: ${this.player.mp}/${this.player.maxMp}`, 10, y += 20);
            this.ctx.fillText(`Gold: ${this.player.gold}`, 10, y += 20);
        }
    }
    
    gameLoop(currentTime) {
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // 限制deltaTime防止卡顿
        if (this.deltaTime > 0.1) {
            this.deltaTime = 0.1;
        }
        
        this.update(this.deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    start() {
        console.log('[Game] 启动游戏');
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }
    
    onGameOver() {
        this.state = 'gameover';
        this.stats.deaths++;
        this.replayRecorder?.stopRecording();
        this.notificationManager.showGameOver();
    }
    
    onVictory() {
        this.state = 'victory';
        this.notificationManager.showVictory();
    }
}

// ==================== 初始化 ====================
window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('[Game] 找不到游戏画布');
        return;
    }
    
    const game = new Game(canvas);
    game.start();
    
    // 导出到全局
    window.game = game;
});

export { Game };
