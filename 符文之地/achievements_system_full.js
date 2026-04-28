/**
 * 符文之地 - 完整成就系统
 */

const ACHIEVEMENTS_FULL = {
    // ===== 战斗成就 =====
    combat_kills: {
        kills_1: { id: 'kills_1', name: '初试锋芒', description: '击败1个敌人', category: 'COMBAT', reward: { gold: 10 } },
        kills_10: { id: 'kills_10', name: '小有名气', description: '累计击败10个敌人', category: 'COMBAT', reward: { gold: 50 } },
        kills_50: { id: 'kills_50', name: '战斗老手', description: '累计击败50个敌人', category: 'COMBAT', reward: { gold: 200 } },
        kills_100: { id: 'kills_100', name: '百战勇士', description: '累计击败100个敌人', category: 'COMBAT', reward: { gold: 500 } },
        kills_500: { id: 'kills_500', name: '战神降世', description: '累计击败500个敌人', category: 'COMBAT', reward: { gold: 2000 } },
        kills_1000: { id: 'kills_1000', name: '传奇杀手', description: '累计击败1000个敌人', category: 'COMBAT', reward: { gold: 5000 } }
    },
    
    // ===== 无伤成就 =====
    flawless: {
        flawless_1: { id: 'flawless_1', name: '完美主义者', description: '无伤击败1个敌人', category: 'COMBAT', reward: { gold: 100 } },
        flawless_5: { id: 'flawless_5', name: '刺客信条', description: '无伤击败5个敌人', category: 'COMBAT', reward: { gold: 300 } },
        flawless_10: { id: 'flawless_10', name: '滴水不漏', description: '无伤击败10个敌人', category: 'COMBAT', reward: { gold: 500 } }
    },
    
    // ===== BOSS成就 =====
    bosses: {
        boss_1: { id: 'boss_1', name: '首领猎人', description: '击败1个首领', category: 'COMBAT', reward: { gold: 200 } },
        boss_3: { id: 'boss_3', name: '精英杀手', description: '击败3个首领', category: 'COMBAT', reward: { gold: 500 } },
        boss_all: { id: 'boss_all', name: '征服者', description: '击败所有首领', category: 'COMBAT', reward: { gold: 5000 } }
    },
    
    // ===== 探索成就 =====
    exploration: {
        floor_5: { id: 'floor_5', name: '初窥门径', description: '到达第5层', category: 'EXPLORATION', reward: { gold: 50 } },
        floor_10: { id: 'floor_10', name: '深入虎穴', description: '到达第10层', category: 'EXPLORATION', reward: { gold: 100 } },
        floor_20: { id: 'floor_20', name: '深渊潜行者', description: '到达第20层', category: 'EXPLORATION', reward: { gold: 300 } },
        floor_30: { id: 'floor_30', name: '黑暗征服者', description: '到达第30层', category: 'EXPLORATION', reward: { gold: 800 } },
        floor_40: { id: 'floor_40', name: '虚空探险家', description: '到达第40层', category: 'EXPLORATION', reward: { gold: 1500 } },
        floor_50: { id: 'floor_50', name: '深渊之主', description: '到达第50层', category: 'EXPLORATION', reward: { gold: 3000 } }
    },
    
    // ===== 收集成就 =====
    collection: {
        gold_1000: { id: 'gold_1000', name: '小有积蓄', description: '累计获得1000金币', category: 'COLLECTION', reward: { gold: 50 } },
        gold_10000: { id: 'gold_10000', name: '富甲一方', description: '累计获得10000金币', category: 'COLLECTION', reward: { gold: 500 } },
        gold_100000: { id: 'gold_100000', name: '金币之王', description: '累计获得100000金币', category: 'COLLECTION', reward: { gold: 5000 } }
    },
    
    // ===== 技能成就 =====
    skills: {
        skill_1: { id: 'skill_1', name: '技能入门', description: '学会1个技能', category: 'SKILLS', reward: { gold: 30 } },
        skill_5: { id: 'skill_5', name: '技能达人', description: '学会5个技能', category: 'SKILLS', reward: { gold: 100 } },
        skill_10: { id: 'skill_10', name: '技能大师', description: '学会10个技能', category: 'SKILLS', reward: { gold: 300 } }
    },
    
    // ===== 升级成就 =====
    levels: {
        level_5: { id: 'level_5', name: '崭露头角', description: '达到5级', category: 'PROGRESSION', reward: { gold: 30 } },
        level_10: { id: 'level_10', name: '初露锋芒', description: '达到10级', category: 'PROGRESSION', reward: { gold: 100 } },
        level_30: { id: 'level_30', name: '资深冒险者', description: '达到30级', category: 'PROGRESSION', reward: { gold: 500 } },
        level_50: { id: 'level_50', name: '传奇英雄', description: '达到50级', category: 'PROGRESSION', reward: { gold: 2000 } },
        level_99: { id: 'level_99', name: '登峰造极', description: '达到99级', category: 'PROGRESSION', reward: { gold: 10000 } }
    },
    
    // ===== 特殊成就 =====
    special: {
        first_death: { id: 'first_death', name: '死亡教训', description: '第一次死亡', category: 'SPECIAL', reward: { gold: 0 } },
        no_death: { id: 'no_death', name: '永生者', description: '不死亡通关', category: 'SPECIAL', reward: { gold: 10000 } },
        speed_run: { id: 'speed_run', name: '速度之王', description: '30分钟内通关', category: 'SPECIAL', reward: { gold: 3000 } },
        combo_10: { id: 'combo_10', name: '连击达人', description: '达成10连击', category: 'SPECIAL', reward: { gold: 100 } },
        combo_50: { id: 'combo_50', name: '连击狂魔', description: '达成50连击', category: 'SPECIAL', reward: { gold: 500 } },
        combo_100: { id: 'combo_100', name: '连击神话', description: '达成100连击', category: 'SPECIAL', reward: { gold: 2000 } }
    },
    
    // ===== 职业成就 =====
    class_achievements: {
        warrior_master: { id: 'warrior_master', name: '战士大师', description: '用战士通关', category: 'CLASS', reward: { gold: 1000 } },
        mage_master: { id: 'mage_master', name: '法师大师', description: '用法师通关', category: 'CLASS', reward: { gold: 1000 } },
        ranger_master: { id: 'ranger_master', name: '游侠大师', description: '用游侠通关', category: 'CLASS', reward: { gold: 1000 } },
        cleric_master: { id: 'cleric_master', name: '圣职大师', description: '用圣职通关', category: 'CLASS', reward: { gold: 1000 } }
    }
};

class Achievement {
    constructor(data) {
        Object.assign(this, data);
        this.unlocked = false;
        this.unlockedAt = null;
    }
    
    unlock() {
        if (this.unlocked) return false;
        
        this.unlocked = true;
        this.unlockedAt = Date.now();
        
        return true;
    }
}

class AchievementManagerFull {
    constructor(game) {
        this.game = game;
        this.achievements = new Map();
        this.recentlyUnlocked = [];
        this.maxRecent = 5;
        
        this.loadAchievements();
    }
    
    loadAchievements() {
        for (const category of Object.values(ACHIEVEMENTS_FULL)) {
            for (const [id, data] of Object.entries(category)) {
                this.achievements.set(id, new Achievement(data));
            }
        }
    }
    
    unlock(achievementId) {
        const achievement = this.achievements.get(achievementId);
        if (!achievement || achievement.unlocked) return false;
        
        const success = achievement.unlock();
        
        if (success) {
            this.recentlyUnlocked.unshift(achievement);
            
            if (this.recentlyUnlocked.length > this.maxRecent) {
                this.recentlyUnlocked.pop();
            }
            
            // 给予奖励
            this.grantReward(achievement);
            
            // 通知
            this.game.notificationManager.showAchievement(achievement.name);
            
            // 事件
            this.game.eventBus?.emit('achievement_unlocked', { achievement });
        }
        
        return success;
    }
    
    grantReward(achievement) {
        const reward = achievement.reward;
        
        if (reward.gold) {
            this.game.player.gold += reward.gold;
        }
        
        if (reward.items) {
            for (const item of reward.items) {
                this.game.inventory.addItem(item.id, item.quantity);
            }
        }
    }
    
    checkAchievements() {
        // 检查各种条件
        const stats = this.game.stats;
        const player = this.game.player;
        
        // 击杀数
        this.checkKillAchievements(stats);
        
        // 楼层
        this.checkFloorAchievements();
        
        // 等级
        this.checkLevelAchievements();
        
        // 连击
        this.checkComboAchievements();
    }
    
    checkKillAchievements(stats) {
        if (!stats) return;
        
        const kills = stats.enemiesKilled || 0;
        
        if (kills >= 1) this.unlock('kills_1');
        if (kills >= 10) this.unlock('kills_10');
        if (kills >= 50) this.unlock('kills_50');
        if (kills >= 100) this.unlock('kills_100');
        if (kills >= 500) this.unlock('kills_500');
        if (kills >= 1000) this.unlock('kills_1000');
    }
    
    checkFloorAchievements() {
        const floor = this.game.currentFloor || 0;
        
        if (floor >= 5) this.unlock('floor_5');
        if (floor >= 10) this.unlock('floor_10');
        if (floor >= 20) this.unlock('floor_20');
        if (floor >= 30) this.unlock('floor_30');
        if (floor >= 40) this.unlock('floor_40');
        if (floor >= 50) this.unlock('floor_50');
    }
    
    checkLevelAchievements() {
        const level = this.game.player?.level || 0;
        
        if (level >= 5) this.unlock('level_5');
        if (level >= 10) this.unlock('level_10');
        if (level >= 30) this.unlock('level_30');
        if (level >= 50) this.unlock('level_50');
        if (level >= 99) this.unlock('level_99');
    }
    
    checkComboAchievements() {
        const maxCombo = this.game.stats?.maxCombo || 0;
        
        if (maxCombo >= 10) this.unlock('combo_10');
        if (maxCombo >= 50) this.unlock('combo_50');
        if (maxCombo >= 100) this.unlock('combo_100');
    }
    
    getProgress() {
        const total = this.achievements.size;
        const unlocked = Array.from(this.achievements.values()).filter(a => a.unlocked).length;
        
        return {
            total,
            unlocked,
            progress: total > 0 ? unlocked / total : 0
        };
    }
    
    getUnlockedAchievements() {
        return Array.from(this.achievements.values()).filter(a => a.unlocked);
    }
    
    getLockedAchievements() {
        return Array.from(this.achievements.values()).filter(a => !a.unlocked);
    }
    
    getAchievementsByCategory(category) {
        return Array.from(this.achievements.values()).filter(a => a.category === category);
    }
}

export { Achievement, AchievementManagerFull, ACHIEVEMENTS_FULL };
