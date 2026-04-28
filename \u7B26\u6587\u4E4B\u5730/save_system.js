/**
 * 符文之地 - 云存档与数据管理
 */

class SaveData {
    constructor() {
        this.version = '1.0.0';
        this.timestamp = Date.now();
        this.playTime = 0;
        this.player = null;
        this.dungeon = null;
        this.quests = null;
        this.achievements = null;
        this.stats = null;
        this.settings = null;
        this.metadata = {};
    }
    
    toJSON() {
        return {
            version: this.version,
            timestamp: this.timestamp,
            playTime: this.playTime,
            player: this.player,
            dungeon: this.dungeon,
            quests: this.quests,
            achievements: this.achievements,
            stats: this.stats,
            settings: this.settings,
            metadata: this.metadata
        };
    }
    
    fromJSON(json) {
        Object.assign(this, json);
    }
}

class LocalSaveManager {
    constructor() {
        this.storageKey = 'rune_land_save_';
        this.maxSlots = 5;
        this.currentSlot = 0;
    }
    
    save(slot = 0, gameState) {
        try {
            const saveData = new SaveData();
            
            saveData.timestamp = Date.now();
            saveData.playTime = gameState.playTime || 0;
            saveData.player = gameState.player?.getSaveData();
            saveData.dungeon = {
                currentFloor: gameState.currentFloor,
                currentBiome: gameState.currentBiome,
                dungeonState: gameState.dungeon?.getSaveData?.()
            };
            saveData.quests = gameState.questManager?.saveProgress?.();
            saveData.achievements = gameState.achievementManager?.getProgress?.();
            saveData.stats = gameState.stats?.save?.();
            saveData.settings = gameState.settings?.getAll?.();
            saveData.metadata = {
                playerLevel: gameState.player?.level,
                enemiesKilled: gameState.stats?.enemiesKilled,
                floorsExplored: gameState.stats?.floorsExplored
            };
            
            const json = JSON.stringify(saveData.toJSON());
            localStorage.setItem(this.storageKey + slot, json);
            
            console.log(`[Save] 存档成功: 槽位${slot}`);
            return true;
        } catch (e) {
            console.error('[Save] 存档失败:', e);
            return false;
        }
    }
    
    load(slot = 0) {
        try {
            const json = localStorage.getItem(this.storageKey + slot);
            if (!json) return null;
            
            const data = JSON.parse(json);
            
            // 版本检查
            if (data.version !== '1.0.0') {
                console.warn('[Save] 存档版本不匹配');
            }
            
            const saveData = new SaveData();
            saveData.fromJSON(data);
            
            console.log(`[Save] 读档成功: 槽位${slot}`);
            return saveData;
        } catch (e) {
            console.error('[Save] 读档失败:', e);
            return null;
        }
    }
    
    delete(slot = 0) {
        localStorage.removeItem(this.storageKey + slot);
        console.log(`[Save] 删除存档: 槽位${slot}`);
    }
    
    exists(slot = 0) {
        return localStorage.getItem(this.storageKey + slot) !== null;
    }
    
    getSaveInfo(slot = 0) {
        const saveData = this.load(slot);
        if (!saveData) return null;
        
        return {
            slot,
            timestamp: new Date(saveData.timestamp).toLocaleString(),
            playTime: this.formatPlayTime(saveData.playTime),
            level: saveData.metadata?.playerLevel,
            floor: saveData.dungeon?.currentFloor,
            biome: saveData.dungeon?.currentBiome,
            enemiesKilled: saveData.metadata?.enemiesKilled,
            version: saveData.version
        };
    }
    
    formatPlayTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    
    listAllSaves() {
        const saves = [];
        for (let i = 0; i < this.maxSlots; i++) {
            saves.push(this.getSaveInfo(i));
        }
        return saves;
    }
}

class CloudSaveManager {
    constructor() {
        this.apiEndpoint = '/api/saves';
        this.cloudEnabled = false;
        this.userId = null;
        this.syncPending = false;
    }
    
    async login(credentials) {
        // 模拟登录
        this.userId = 'user_' + Date.now();
        this.cloudEnabled = true;
        return true;
    }
    
    async uploadSave(slot, saveData) {
        if (!this.cloudEnabled) return false;
        
        try {
            const response = await fetch(this.apiEndpoint + '/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: this.userId,
                    slot,
                    data: saveData.toJSON()
                })
            });
            
            return response.ok;
        } catch (e) {
            console.error('[CloudSave] 上传失败:', e);
            return false;
        }
    }
    
    async downloadSave(slot) {
        if (!this.cloudEnabled) return null;
        
        try {
            const response = await fetch(this.apiEndpoint + `/download?userId=${this.userId}&slot=${slot}`);
            
            if (!response.ok) return null;
            
            const json = await response.json();
            const saveData = new SaveData();
            saveData.fromJSON(json.data);
            
            return saveData;
        } catch (e) {
            console.error('[CloudSave] 下载失败:', e);
            return null;
        }
    }
    
    async listCloudSaves() {
        if (!this.cloudEnabled) return [];
        
        try {
            const response = await fetch(this.apiEndpoint + `/list?userId=${this.userId}`);
            
            if (!response.ok) return [];
            
            return await response.json();
        } catch (e) {
            console.error('[CloudSave] 列表获取失败:', e);
            return [];
        }
    }
}

class DataManager {
    constructor(game) {
        this.game = game;
        this.localSaveManager = new LocalSaveManager();
        this.cloudSaveManager = new CloudSaveManager();
        this.autoSaveEnabled = true;
        this.autoSaveInterval = 300; // 5分钟
        this.autoSaveTimer = 0;
        
        this.exportFormat = 'json';
    }
    
    update(dt) {
        if (!this.autoSaveEnabled) return;
        
        this.autoSaveTimer += dt;
        
        if (this.autoSaveTimer >= this.autoSaveInterval) {
            this.autoSaveTimer = 0;
            this.autoSave();
        }
    }
    
    autoSave() {
        this.localSaveManager.save(0, this.game);
        console.log('[DataManager] 自动存档完成');
    }
    
    save(slot = 0) {
        return this.localSaveManager.save(slot, this.game);
    }
    
    load(slot = 0) {
        const saveData = this.localSaveManager.load(slot);
        if (!saveData) return false;
        
        this.applySaveData(saveData);
        return true;
    }
    
    applySaveData(saveData) {
        // 恢复玩家数据
        if (saveData.player) {
            this.game.player?.loadSaveData?.(saveData.player);
        }
        
        // 恢复地下城
        if (saveData.dungeon) {
            this.game.currentFloor = saveData.dungeon.currentFloor;
            this.game.currentBiome = saveData.dungeon.currentBiome;
        }
        
        // 恢复任务
        if (saveData.quests) {
            this.game.questManager?.loadProgress?.(saveData.quests);
        }
        
        // 恢复成就
        if (saveData.achievements) {
            this.game.achievementManager?.loadProgress?.(saveData.achievements);
        }
        
        // 恢复统计
        if (saveData.stats) {
            this.game.stats?.load?.(saveData.stats);
        }
        
        console.log('[DataManager] 存档数据已应用');
    }
    
    exportSave(slot = 0, format = 'json') {
        const saveData = this.localSaveManager.load(slot);
        if (!saveData) return null;
        
        switch (format) {
            case 'json':
                return JSON.stringify(saveData.toJSON(), null, 2);
            case 'base64':
                return btoa(JSON.stringify(saveData.toJSON()));
            default:
                return JSON.stringify(saveData.toJSON());
        }
    }
    
    importSave(jsonString, slot = 0) {
        try {
            const json = JSON.parse(jsonString);
            const saveData = new SaveData();
            saveData.fromJSON(json);
            
            return this.localSaveManager.save(slot, { playTime: 0, player: null, dungeon: null }); // 占位
        } catch (e) {
            console.error('[DataManager] 导入失败:', e);
            return false;
        }
    }
    
    deleteSave(slot = 0) {
        this.localSaveManager.delete(slot);
    }
    
    listSaves() {
        return this.localSaveManager.listAllSaves();
    }
}

export { SaveData, LocalSaveManager, CloudSaveManager, DataManager };
