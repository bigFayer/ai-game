/**
 * 符文之地 - 游戏状态管理系统
 */

const GameState = {
    TITLE: 'title',
    CHARACTER_SELECT: 'character_select',
    PLAYING: 'playing',
    PAUSED: 'paused',
    INVENTORY: 'inventory',
    EQUIPMENT: 'equipment',
    SKILLS: 'skills',
    SHOP: 'shop',
    FORGE: 'forge',
    QUEST_LOG: 'quest_log',
    ACHIEVEMENTS: 'achievements',
    SETTINGS: 'settings',
    SAVE_LOAD: 'save_load',
    COMBAT: 'combat',
    GAME_OVER: 'game_over',
    VICTORY: 'victory',
    DIALOGUE: 'dialogue',
    MENU: 'menu'
};

class GameStateManager {
    constructor(game) {
        this.game = game;
        this.state = GameState.TITLE;
        this.previousState = null;
        this.stateData = {};
        this.stateHistory = [];
        this.maxHistory = 10;
    }
    
    set(newState, data = {}) {
        if (this.state === newState) return;
        
        this.previousState = this.state;
        this.state = newState;
        this.stateData = data;
        
        this.stateHistory.push({
            state: newState,
            timestamp: Date.now(),
            data
        });
        
        if (this.stateHistory.length > this.maxHistory) {
            this.stateHistory.shift();
        }
        
        this.onStateChange(newState, this.previousState);
    }
    
    back() {
        if (this.previousState) {
            const temp = this.state;
            this.state = this.previousState;
            this.previousState = temp;
        }
    }
    
    onStateChange(newState, oldState) {
        console.log(`[GameState] ${oldState} -> ${newState}`);
        
        // 状态进入处理
        switch (newState) {
            case GameState.PLAYING:
                this.game.startGameLoop();
                break;
            case GameState.PAUSED:
                this.game.pauseGameLoop();
                break;
            case GameState.COMBAT:
                this.game.enterCombat();
                break;
            case GameState.GAME_OVER:
                this.game.onGameOver();
                break;
            case GameState.VICTORY:
                this.game.onVictory();
                break;
        }
        
        // 状态退出处理
        switch (oldState) {
            case GameState.COMBAT:
                this.game.exitCombat();
                break;
            case GameState.PAUSED:
                this.game.resumeGameLoop();
                break;
        }
    }
    
    is(state) {
        return this.state === state;
    }
    
    isPlaying() {
        return this.state === GameState.PLAYING || this.state === GameState.COMBAT;
    }
    
    isMenu() {
        return [
            GameState.TITLE,
            GameState.CHARACTER_SELECT,
            GameState.MENU,
            GameState.INVENTORY,
            GameState.EQUIPMENT,
            GameState.SKILLS,
            GameState.SHOP,
            GameState.QUEST_LOG,
            GameState.ACHIEVEMENTS,
            GameState.SETTINGS,
            GameState.SAVE_LOAD
        ].includes(this.state);
    }
    
    getState() {
        return this.state;
    }
    
    getStateData() {
        return this.stateData;
    }
    
    getPreviousState() {
        return this.previousState;
    }
    
    canSave() {
        return [GameState.PLAYING, GameState.COMBAT].includes(this.state);
    }
    
    canLoad() {
        return [GameState.TITLE, GameState.PAUSED].includes(this.state);
    }
}

class SaveManager {
    constructor(game) {
        this.game = game;
        this.saveSlots = 3;
        this.currentSlot = 0;
    }
    
    createSaveData(slot = 0) {
        const saveData = {
            version: '1.0.0',
            slot,
            timestamp: Date.now(),
            playTime: this.game.playTime,
            
            // 玩家数据
            player: this.game.player?.getSaveData(),
            
            // 游戏进度
            currentFloor: this.game.currentFloor,
            currentBiome: this.game.currentBiome,
            gameState: this.game.stateManager?.getState(),
            
            // 地下城数据
            dungeon: this.game.dungeon?.getSaveData?.(),
            
            // 任务进度
            quests: this.game.questManager?.saveProgress(),
            
            // 成就进度
            achievements: this.game.achievementManager?.getProgress(),
            
            // 设置
            settings: this.game.settings?.getAll?.()
        };
        
        return saveData;
    }
    
    save(slot = 0) {
        try {
            const saveData = this.createSaveData(slot);
            const key = `rune_land_save_${slot}`;
            localStorage.setItem(key, JSON.stringify(saveData));
            console.log(`[Save] 存档成功: 槽位${slot}`);
            return true;
        } catch (e) {
            console.error('[Save] 存档失败:', e);
            return false;
        }
    }
    
    load(slot = 0) {
        try {
            const key = `rune_land_save_${slot}`;
            const saveStr = localStorage.getItem(key);
            if (!saveStr) return false;
            
            const saveData = JSON.parse(saveStr);
            
            // 版本检查
            if (saveData.version !== '1.0.0') {
                console.warn('[Save] 存档版本不匹配');
            }
            
            // 恢复玩家数据
            if (saveData.player) {
                this.game.loadPlayerData(saveData.player);
            }
            
            // 恢复游戏进度
            this.game.currentFloor = saveData.currentFloor;
            this.game.currentBiome = saveData.currentBiome;
            this.game.playTime = saveData.playTime;
            
            // 恢复地下城
            if (saveData.dungeon) {
                this.game.loadDungeonData(saveData.dungeon);
            }
            
            // 恢复任务
            if (saveData.quests) {
                this.game.questManager?.loadProgress(saveData.quests);
            }
            
            // 恢复成就
            if (saveData.achievements) {
                this.game.achievementManager?.loadProgress?.(saveData.achievements);
            }
            
            console.log(`[Save] 读档成功: 槽位${slot}`);
            return true;
        } catch (e) {
            console.error('[Save] 读档失败:', e);
            return false;
        }
    }
    
    delete(slot = 0) {
        const key = `rune_land_save_${slot}`;
        localStorage.removeItem(key);
        console.log(`[Save] 删除存档: 槽位${slot}`);
    }
    
    hasSave(slot = 0) {
        const key = `rune_land_save_${slot}`;
        return localStorage.getItem(key) !== null;
    }
    
    getSaveInfo(slot = 0) {
        if (!this.hasSave(slot)) return null;
        
        try {
            const key = `rune_land_save_${slot}`;
            const saveData = JSON.parse(localStorage.getItem(key));
            
            return {
                slot,
                timestamp: new Date(saveData.timestamp).toLocaleString(),
                playTime: this.formatPlayTime(saveData.playTime),
                floor: saveData.currentFloor,
                level: saveData.player?.level,
                class: saveData.player?.characterClassName
            };
        } catch (e) {
            return null;
        }
    }
    
    formatPlayTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    
    getAllSaveInfo() {
        const info = [];
        for (let i = 0; i < this.saveSlots; i++) {
            info.push(this.getSaveInfo(i));
        }
        return info;
    }
}

export { GameState, GameStateManager, SaveManager };
