/**
 * 符文之地 - 完整成就系统
 * 50+成就
 */

const ALL_ACHIEVEMENTS = {
    // 战斗成就
    'first_blood': { name: '初战告捷', description: '击败第一个敌人', category: 'combat', condition: (g) => g.player?.stats.enemiesDefeated >= 1, reward: { gold: 50 } },
    'slayer_10': { name: '初露锋芒', description: '击败10个敌人', category: 'combat', condition: (g) => g.player?.stats.enemiesDefeated >= 10, reward: { gold: 100 } },
    'slayer_50': { name: '战士', description: '击败50个敌人', category: 'combat', condition: (g) => g.player?.stats.enemiesDefeated >= 50, reward: { gold: 200 } },
    'slayer_100': { name: '老练战士', description: '击败100个敌人', category: 'combat', condition: (g) => g.player?.stats.enemiesDefeated >= 100, reward: { gold: 400 } },
    'slayer_500': { name: '屠夫', description: '击败500个敌人', category: 'combat', condition: (g) => g.player?.stats.enemiesDefeated >= 500, reward: { gold: 1000 } },
    'slayer_1000': { name: '死神', description: '击败1000个敌人', category: 'combat', condition: (g) => g.player?.stats.enemiesDefeated >= 1000, reward: { gold: 2000 } },
    
    // BOSS成就
    'boss_killer': { name: '首领猎人', description: '击败任意首领', category: 'combat', condition: (g) => g.player?.stats.bossesDefeated >= 1, reward: { gold: 500 } },
    'boss_slayer': { name: '首领杀手', description: '击败所有5个首领', category: 'combat', condition: (g) => g.player?.stats.bossesDefeated >= 5, reward: { gold: 5000 } },
    
    // 层数成就
    'floor_5': { name: '深入地下', description: '到达第5层', category: 'exploration', condition: (g) => g.currentFloor >= 5, reward: { exp: 100 } },
    'floor_10': { name: '小有名气', description: '到达第10层', category: 'exploration', condition: (g) => g.currentFloor >= 10, reward: { exp: 200 } },
    'floor_15': { name: '渐入佳境', description: '到达第15层', category: 'exploration', condition: (g) => g.currentFloor >= 15, reward: { exp: 300 } },
    'floor_20': { name: '资深冒险者', description: '到达第20层', category: 'exploration', condition: (g) => g.currentFloor >= 20, reward: { exp: 500 } },
    'floor_25': { name: '高手', description: '到达第25层', category: 'exploration', condition: (g) => g.currentFloor >= 25, reward: { exp: 800 } },
    'floor_30': { name: '精英冒险者', description: '到达第30层', category: 'exploration', condition: (g) => g.currentFloor >= 30, reward: { exp: 1200 } },
    'floor_35': { name: '大师', description: '到达第35层', category: 'exploration', condition: (g) => g.currentFloor >= 35, reward: { exp: 1800 } },
    'floor_40': { name: '传奇冒险者', description: '到达第40层', category: 'exploration', condition: (g) => g.currentFloor >= 40, reward: { exp: 2500 } },
    'floor_45': { name: '半神', description: '到达第45层', category: 'exploration', condition: (g) => g.currentFloor >= 45, reward: { exp: 3500 } },
    'floor_50': { name: '征服者', description: '到达第50层', category: 'exploration', condition: (g) => g.currentFloor >= 50, reward: { exp: 5000 } },
    
    // 等级成就
    'level_5': { name: '新人冒险者', description: '达到5级', category: 'progression', condition: (g) => g.player?.level >= 5, reward: { exp: 100 } },
    'level_10': { name: '初级冒险者', description: '达到10级', category: 'progression', condition: (g) => g.player?.level >= 10, reward: { exp: 200 } },
    'level_20': { name: '中级冒险者', description: '达到20级', category: 'progression', condition: (g) => g.player?.level >= 20, reward: { exp: 500 } },
    'level_30': { name: '高级冒险者', description: '达到30级', category: 'progression', condition: (g) => g.player?.level >= 30, reward: { exp: 1000 } },
    'level_40': { name: '专家冒险者', description: '达到40级', category: 'progression', condition: (g) => g.player?.level >= 40, reward: { exp: 2000 } },
    'level_50': { name: '大师冒险者', description: '达到50级', category: 'progression', condition: (g) => g.player?.level >= 50, reward: { exp: 5000 } },
    
    // 暴击成就
    'crit_10': { name: '暴击初学者', description: '累计10次暴击', category: 'combat', condition: (g) => g.player?.stats.criticalHits >= 10, reward: { gold: 50 } },
    'crit_50': { name: '暴击达人', description: '累计50次暴击', category: 'combat', condition: (g) => g.player?.stats.criticalHits >= 50, reward: { gold: 150 } },
    'crit_100': { name: '暴击制造者', description: '累计100次暴击', category: 'combat', condition: (g) => g.player?.stats.criticalHits >= 100, reward: { gold: 300 } },
    'crit_500': { name: '暴击狂热者', description: '累计500次暴击', category: 'combat', condition: (g) => g.player?.stats.criticalHits >= 500, reward: { gold: 1000 } },
    
    // 连击成就
    'combo_5': { name: '连击新手', description: '达成5连击', category: 'combat', condition: (g) => g.player?.maxCombo >= 5, reward: { gold: 30 } },
    'combo_10': { name: '连击达人', description: '达成10连击', category: 'combat', condition: (g) => g.player?.maxCombo >= 10, reward: { gold: 80 } },
    'combo_20': { name: '连击高手', description: '达成20连击', category: 'combat', condition: (g) => g.player?.maxCombo >= 20, reward: { gold: 200 } },
    'combo_50': { name: '连击之王', description: '达成50连击', category: 'combat', condition: (g) => g.player?.maxCombo >= 50, reward: { gold: 500 } },
    
    // 金币成就
    'gold_100': { name: '小有积蓄', description: '累计获得100金币', category: 'economy', condition: (g) => g.player?.gold >= 100, reward: { items: ['health_potion'] } },
    'gold_1000': { name: '富翁', description: '累计获得1000金币', category: 'economy', condition: (g) => g.player?.gold >= 1000, reward: { gold: 200 } },
    'gold_10000': { name: '大富翁', description: '累计获得10000金币', category: 'economy', condition: (g) => g.player?.gold >= 10000, reward: { gold: 1000 } },
    'gold_50000': { name: '超级富豪', description: '累计获得50000金币', category: 'economy', condition: (g) => g.player?.gold >= 50000, reward: { gold: 5000 } },
    
    // 装备成就
    'equip_rare': { name: '收藏开始', description: '获得第一件稀有装备', category: 'collection', condition: (g) => g.player?.hasRareEquipment, reward: { gold: 100 } },
    'equip_epic': { name: '史诗收藏', description: '获得第一件史诗装备', category: 'collection', condition: (g) => g.player?.hasEpicEquipment, reward: { gold: 300 } },
    'equip_legendary': { name: '传说收藏', description: '获得第一件传说装备', category: 'collection', condition: (g) => g.player?.hasLegendaryEquipment, reward: { gold: 800 } },
    'equip_mythic': { name: '神话收藏', description: '获得第一件神话装备', category: 'collection', condition: (g) => g.player?.hasMythicEquipment, reward: { gold: 2000 } },
    'full_legendary': { name: '全身传说', description: '装备全身传说装备', category: 'collection', condition: (g) => g.player?.isFullLegendary, reward: { gold: 5000 } },
    
    // 技能成就
    'skill_master': { name: '技能大师', description: '学习所有基础技能', category: 'progression', condition: (g) => g.player?.learnedSkills?.length >= 10, reward: { exp: 300 } },
    
    // 游戏完成成就
    'complete_game': { name: '征服符文之地', description: '通关游戏', category: 'special', condition: (g) => g.currentFloor > 50, reward: { gold: 10000, title: '征服者' } },
    'true_ending': { name: '真实结局', description: '以50级通关游戏', category: 'special', condition: (g) => g.currentFloor > 50 && g.player?.level >= 50, reward: { gold: 20000, title: '传奇英雄' } },
    
    // 特殊成就
    'no_hit_floor': { name: '无伤通关', description: '不受伤通过一层', category: 'special', condition: (g) => g.floorNoHit, reward: { gold: 500 } },
    'speed_runner': { name: '速通达人', description: '10分钟内到达第10层', category: 'special', condition: (g) => g.speedrun10, reward: { gold: 1000 } },
    'poor_hero': { name: '穷英雄', description: '0金币通关游戏', category: 'special', condition: (g) => g.zeroGold, reward: { gold: 5000 } },
    'die_hard': { name: '不死战士', description: '死亡50次后通关', category: 'special', condition: (g) => g.player?.stats.deaths >= 50 && g.currentFloor > 50, reward: { gold: 3000 } },
    
    // 探索成就
    'chest_10': { name: '宝箱猎人', description: '开启10个宝箱', category: 'exploration', condition: (g) => g.player?.stats.chestsOpened >= 10, reward: { gold: 200 } },
    'chest_50': { name: '宝箱收藏家', description: '开启50个宝箱', category: 'exploration', condition: (g) => g.player?.stats.chestsOpened >= 50, reward: { gold: 500 } },
    'full_explore': { name: '完美探索', description: '探索每个地区的前10层', category: 'exploration', condition: (g) => g.exploredAllBiomes, reward: { gold: 2000 } }
};

class AchievementSystem {
    constructor(game) {
        this.game = game;
        this.achievements = { ...ALL_ACHIEVEMENTS };
        this.unlocked = new Set();
        this.checkCounters = {};
    }
    
    check() {
        for (const [id, achievement] of Object.entries(this.achievements)) {
            if (this.unlocked.has(id)) continue;
            
            try {
                if (achievement.condition(this.game)) {
                    this.unlock(id);
                }
            } catch (e) {
                // 忽略错误
            }
        }
    }
    
    unlock(id) {
        if (this.unlocked.has(id)) return;
        
        const achievement = this.achievements[id];
        if (!achievement) return;
        
        this.unlocked.add(id);
        
        // 发放奖励
        if (achievement.reward) {
            if (achievement.reward.gold) {
                this.game.player.gold += achievement.reward.gold;
            }
            if (achievement.reward.exp) {
                this.game.player.addExp(achievement.reward.exp);
            }
            if (achievement.reward.items) {
                achievement.reward.items.forEach(itemId => {
                    this.game.player.addItem({ id: itemId, name: itemId });
                });
            }
            if (achievement.reward.title) {
                this.game.player.title = achievement.reward.title;
            }
        }
        
        this.game.showNotification(`🏆 成就解锁: ${achievement.name}`);
        this.game.showAchievement(achievement.name);
        
        console.log(`[Achievement] 解锁: ${achievement.name} (${id})`);
    }
    
    getUnlockedCount() {
        return this.unlocked.size;
    }
    
    getTotalCount() {
        return Object.keys(this.achievements).length;
    }
    
    getProgress() {
        return {
            unlocked: this.unlocked.size,
            total: this.getTotalCount(),
            percent: Math.floor(this.unlocked.size / this.getTotalCount() * 100)
        };
    }
    
    getByCategory(category) {
        return Object.entries(this.achievements)
            .filter(([_, a]) => a.category === category)
            .map(([id, a]) => ({
                id,
                ...a,
                unlocked: this.unlocked.has(id)
            }));
    }
}

export { AchievementSystem, ALL_ACHIEVEMENTS };
