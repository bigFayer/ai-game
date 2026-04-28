/**
 * 符文之地 - 存档系统
 * localStorage存档 + 自动存档
 */

class SaveManager {
    constructor() {
        this.SAVE_KEY = 'rune_land_save';
        this.SETTINGS_KEY = 'rune_land_settings';
    }
    
    hasSave() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    }
    
    save(game) {
        const saveData = {
            version: '1.0.0',
            timestamp: Date.now(),
            gameTime: game.gameTime,
            currentFloor: game.currentFloor,
            currentBiome: game.currentBiome,
            player: game.player?.getSaveData(),
            dungeon: {
                floor: game.dungeon?.floor,
                biome: game.dungeon?.biome
            },
            questProgress: game.questManager?.getProgress(),
            achievementProgress: game.achievementManager?.getProgress(),
            gameState: game.state
        };
        
        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
            console.log('[Save] 存档完成');
            return true;
        } catch (e) {
            console.error('[Save] 存档失败:', e);
            return false;
        }
    }
    
    load(game) {
        const saveStr = localStorage.getItem(this.SAVE_KEY);
        if (!saveStr) return false;
        
        try {
            const saveData = JSON.parse(saveStr);
            
            // 恢复玩家
            if (saveData.player) {
                const Player = game.player?.constructor;
                if (Player) {
                    // 重新创建玩家并加载数据
                    const newPlayer = new Player(saveData.player.characterClass);
                    newPlayer.loadSaveData(saveData.player);
                    game.player = newPlayer;
                }
            }
            
            // 恢复游戏状态
            game.currentFloor = saveData.currentFloor;
            game.currentBiome = saveData.currentBiome;
            game.gameTime = saveData.gameTime;
            
            // 恢复地下城
            if (saveData.dungeon) {
                game.dungeon?.generate(saveData.dungeon.floor, saveData.dungeon.biome);
            }
            
            console.log('[Save] 读档完成');
            return true;
        } catch (e) {
            console.error('[Save] 读档失败:', e);
            return false;
        }
    }
    
    deleteSave() {
        localStorage.removeItem(this.SAVE_KEY);
        console.log('[Save] 存档已删除');
    }
    
    autoSave(game) {
        this.save(game);
    }
    
    saveSettings(settings) {
        try {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('[Save] 设置保存失败:', e);
        }
    }
    
    loadSettings() {
        try {
            const str = localStorage.getItem(this.SETTINGS_KEY);
            return str ? JSON.parse(str) : this.getDefaultSettings();
        } catch (e) {
            return this.getDefaultSettings();
        }
    }
    
    getDefaultSettings() {
        return {
            musicVolume: 0.5,
            sfxVolume: 0.7,
            showFPS: false,
            screenShake: true,
            combatSpeed: 1.0
        };
    }
    
    getSaveInfo() {
        if (!this.hasSave()) return null;
        
        try {
            const saveData = JSON.parse(localStorage.getItem(this.SAVE_KEY));
            return {
                floor: saveData.currentFloor,
                biome: saveData.currentBiome,
                playerLevel: saveData.player?.level,
                playerClass: saveData.player?.characterClassName,
                timestamp: new Date(saveData.timestamp).toLocaleString()
            };
        } catch (e) {
            return null;
        }
    }
}

// 导出
export { SaveManager };
