/**
 * 符文之地 - 核心游戏引擎
 */

import { Player, CharacterClass } from './player.js';
import { CombatSystem, BattleState } from './combat.js';
import { EnemyFactory, EnemyManager } from './enemy.js';
import { DungeonGenerator, Dungeon } from './dungeon.js';
import { Inventory, ItemFactory } from './items.js';
import { SkillSystem, SkillBar } from './skills.js';
import { QuestManager } from './quest.js';
import { CraftingSystem } from './crafting.js';
import { NPCDialogueManager } from './npc.js';
import { NotificationManager } from './notification_system.js';
import { InputHandler, KeyBindings } from './input_handler.js';
import { GameState, GameStateManager, SaveManager } from './game_state.js';
import { AdvancedParticleSystem } from './particle_advanced.js';
import { Camera, CameraManager } from './camera_system.js';
import { AnimationManager, Easing } from './animations.js';
import { ThemeManager } from './color_themes.js';
import { ShaderEffects } from './shader_effects.js';
import { MapGenerator, Room } from './map_generator.js';
import { GAME_CONFIG, CharacterClassConfig, ElementType } from './game_constants.js';
import { ITEM_DATABASE } from './item_database_full.js';
import { SKILL_DATABASE } from './skill_database_full.js';
import { ENEMY_DATABASE } from './enemies_full_config.js';
import { GAME_LORE } from './lore.js';
import { BIOME_DATA } from './biomes.js';

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // 时间
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fixedTimeStep = GAME_CONFIG.FIXED_TIMESTEP;
        this.accumulator = 0;
        this.playTime = 0;
        this.pausedTime = 0;
        
        // 状态
        this.state = 'TITLE';
        this.stateManager = new GameStateManager(this);
        
        // 玩家
        this.player = null;
        
        // 地下城
        this.currentFloor = 1;
        this.currentBiome = 'forest';
        this.dungeon = null;
        this.dungeonMap = null;
        
        // 系统
        this.inventory = new Inventory(this);
        this.skillSystem = new SkillSystem(this);
        this.questManager = new QuestManager(this);
        this.craftingSystem = new CraftingSystem(this);
        this.notificationManager = new NotificationManager(this);
        this.npcDialogueManager = new NPCDialogueManager(this);
        this.combatSystem = new CombatSystem(this);
        
        // 输入
        this.input = new InputHandler(this);
        this.keyBindings = new KeyBindings();
        
        // 渲染
        this.camera = new CameraManager();
        this.camera.init(this.width, this.height);
        this.particleSystem = new AdvancedParticleSystem();
        this.animationManager = new AnimationManager();
        this.themeManager = new ThemeManager();
        this.shaderEffects = new ShaderEffects(this.ctx, this.canvas);
        
        // UI
        this.ui = {
            hotbar: null,
            skillBar: null,
            minimap: null,
            chatLog: []
        };
        
        // 存档
        this.saveManager = new SaveManager(this);
        
        // 游戏数据
        this.enemies = [];
        this.npcs = [];
        this.items = [];
        this.projectiles = [];
        
        // 配置数据
        this.itemDatabase = ITEM_DATABASE;
        this.skillDatabase = SKILL_DATABASE;
        this.enemyDatabase = ENEMY_DATABASE;
        this.biomeData = BIOME_DATA;
        
        this.init();
    }
    
    init() {
        console.log(`[Game] 符文之地 v${GAME_CONFIG.GAME_VERSION || '1.0.0'} 初始化中...`);
        
        // 绑定输入
        this.bindInput();
        
        // 初始化相机
        this.camera.init(this.width, this.height);
        
        console.log('[Game] 初始化完成');
    }
    
    bindInput() {
        // ESC暂停
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.state === 'PLAYING') {
                    this.pause();
                } else if (this.state === 'PAUSED') {
                    this.resume();
                }
            }
        });
        
        // 调整大小
        window.addEventListener('resize', () => {
            this.resize();
        });
    }
    
    resize() {
        // 保持canvas大小
    }
    
    // 游戏循环
    start() {
        this.state = 'PLAYING';
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    startGameLoop() {
        this.start();
    }
    
    pauseGameLoop() {
        // 暂停
    }
    
    resumeGameLoop() {
        // 继续
    }
    
    gameLoop(currentTime) {
        if (this.state !== 'PLAYING') return;
        
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // 限制deltaTime
        if (this.deltaTime > 0.25) {
            this.deltaTime = 0.25;
        }
        
        this.accumulator += this.deltaTime;
        
        // 固定时间步更新
        while (this.accumulator >= this.fixedTimeStep) {
            this.update(this.fixedTimeStep);
            this.accumulator -= this.fixedTimeStep;
        }
        
        // 渲染
        this.render();
        
        // 更新输入
        this.input.update();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(dt) {
        if (this.state !== 'PLAYING') return;
        
        this.playTime += dt;
        
        // 更新玩家
        if (this.player) {
            this.player.update(dt);
        }
        
        // 更新地下城
        if (this.dungeon) {
            this.dungeon.update(dt);
        }
        
        // 更新敌人
        for (const enemy of this.enemies) {
            enemy.update(dt);
        }
        
        // 更新技能
        this.skillSystem.update(dt);
        
        // 更新粒子
        this.particleSystem.update(dt);
        
        // 更新动画
        this.animationManager.update(dt);
        
        // 更新通知
        this.notificationManager.update(dt);
        
        // 自动存档
        if (GAME_CONFIG.SAVE.AUTO_SAVE_ENABLED && 
            Math.floor(this.playTime) % GAME_CONFIG.SAVE.AUTO_SAVE_INTERVAL === 0) {
            this.autoSave();
        }
    }
    
    render() {
        // 清屏
        this.ctx.fillStyle = '#0a0a15';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 相机变换
        this.ctx.save();
        this.camera.applyTransform(this.ctx);
        
        // 渲染地下城
        if (this.dungeon) {
            this.dungeon.render(this.ctx);
        }
        
        // 渲染物品
        for (const item of this.items) {
            item.render(this.ctx);
        }
        
        // 渲染敌人
        for (const enemy of this.enemies) {
            enemy.render(this.ctx);
        }
        
        // 渲染玩家
        if (this.player) {
            this.player.render(this.ctx);
        }
        
        // 渲染粒子
        this.particleSystem.draw(this.ctx);
        
        this.ctx.restore();
        
        // UI层
        this.renderUI();
        
        // 通知
        this.notificationManager.render(this.ctx);
    }
    
    renderUI() {
        // 子类实现
    }
    
    // 场景切换
    loadScene(sceneName) {
        console.log(`[Game] 加载场景: ${sceneName}`);
        
        switch (sceneName) {
            case 'title':
                this.state = 'TITLE';
                break;
            case 'game':
                this.state = 'PLAYING';
                this.startGame();
                break;
            case 'combat':
                this.state = 'COMBAT';
                this.combatSystem.startBattle();
                break;
        }
    }
    
    // 新游戏
    newGame(characterClass) {
        console.log(`[Game] 新游戏: ${characterClass}`);
        
        this.currentFloor = 1;
        this.currentBiome = 'forest';
        this.playTime = 0;
        
        // 创建玩家
        this.player = new Player(this, characterClass);
        
        // 初始化背包
        this.inventory = new Inventory(this);
        this.inventory.addItem('health_potion', 3);
        
        // 生成地下城
        this.generateDungeon();
        
        // 通知系统
        this.notificationManager = new NotificationManager(this);
        
        // 切换到游戏状态
        this.state = 'PLAYING';
    }
    
    // 生成地下城
    generateDungeon() {
        console.log(`[Game] 生成地下城: 第${this.currentFloor}层, ${this.currentBiome}`);
        
        const biome = this.biomeData[this.currentBiome];
        if (!biome) {
            console.error(`[Game] 未找到生物群系: ${this.currentBiome}`);
            return;
        }
        
        // 生成地图
        this.dungeonMap = new MapGenerator({
            width: 50,
            height: 40,
            tileSize: 40,
            maxRooms: 8 + this.currentFloor
        }).generate();
        
        // 生成敌人
        this.spawnEnemies();
        
        // 生成事件
        this.spawnEvents();
    }
    
    spawnEnemies() {
        this.enemies = [];
        
        const baseCount = 3 + Math.floor(this.currentFloor / 2);
        
        for (let i = 0; i < baseCount; i++) {
            const enemyType = this.getRandomEnemyForBiome();
            const pos = this.getRandomFloorPosition();
            
            if (pos) {
                const enemy = EnemyFactory.create(enemyType, pos.x, pos.y);
                this.enemies.push(enemy);
            }
        }
    }
    
    spawnEvents() {
        // 生成商店、宝箱等事件
    }
    
    getRandomEnemyForBiome() {
        const biomeEnemies = Object.keys(this.enemyDatabase).filter(
            id => this.enemyDatabase[id].biome === this.currentBiome
        );
        
        if (biomeEnemies.length === 0) return 'forest_goblin_1';
        
        return biomeEnemies[Math.floor(Math.random() * biomeEnemies.length)];
    }
    
    getRandomFloorPosition() {
        if (!this.dungeonMap) return null;
        
        for (let i = 0; i < 100; i++) {
            const x = Math.floor(Math.random() * this.dungeonMap.width);
            const y = Math.floor(Math.random() * this.dungeonMap.height);
            
            if (this.dungeonMap.isWalkable(x, y)) {
                return { x, y };
            }
        }
        
        return null;
    }
    
    // 存档
    autoSave() {
        this.saveManager.save(0);
    }
    
    save(slot = 0) {
        return this.saveManager.save(slot);
    }
    
    load(slot = 0) {
        return this.saveManager.load(slot);
    }
    
    // 暂停/继续
    pause() {
        this.state = 'PAUSED';
        this.stateManager.set('PAUSED');
    }
    
    resume() {
        this.state = 'PLAYING';
        this.stateManager.set('PLAYING');
    }
    
    // 进入战斗
    enterCombat() {
        this.state = 'COMBAT';
    }
    
    exitCombat() {
        this.state = 'PLAYING';
    }
    
    // 游戏结束
    onGameOver() {
        this.state = 'GAME_OVER';
        console.log('[Game] 游戏结束');
    }
    
    onVictory() {
        this.state = 'VICTORY';
        console.log('[Game] 胜利!');
        this.notificationManager.showAchievement('你通关了符文之地!');
    }
    
    // 下一层
    nextFloor() {
        this.currentFloor++;
        
        if (this.currentFloor > GAME_CONFIG.DUNGEON.TOTAL_FLOORS) {
            this.onVictory();
            return;
        }
        
        // 更新生物群系
        this.updateBiome();
        
        // 生成新地下城
        this.generateDungeon();
        
        // 恢复玩家
        this.player.fullHeal();
        
        // 通知
        const biome = this.biomeData[this.currentBiome];
        this.notificationManager.show(`进入第${this.currentFloor}层: ${biome.name}`);
    }
    
    updateBiome() {
        for (const [biome, floors] of Object.entries(GAME_CONFIG.DUNGEON.BIOME_FLOORS)) {
            if (this.currentFloor >= floors[0] && this.currentFloor <= floors[1]) {
                this.currentBiome = biome;
                break;
            }
        }
    }
    
    // 获取玩家数据
    getPlayerData() {
        return this.player?.getSaveData();
    }
    
    // 加载玩家数据
    loadPlayerData(data) {
        this.player = new Player(this, data.characterClass);
        this.player.loadSaveData(data);
    }
    
    // 获取游戏信息
    getGameInfo() {
        return {
            version: GAME_CONFIG.GAME_VERSION || '1.0.0',
            name: GAME_CONFIG.GAME_NAME || '符文之地',
            playTime: this.playTime,
            currentFloor: this.currentFloor,
            biome: this.currentBiome,
            state: this.state
        };
    }
}

export { Game };
