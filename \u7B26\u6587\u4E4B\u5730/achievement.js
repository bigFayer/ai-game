/**
 * 符文之地 - 成就系统
 */

class AchievementManager {
    constructor(game) {
        this.game = game;
        this.achievements = this.initAchievements();
        this.unlocked = new Set();
        this.checkCounters = {};
    }
    
    initAchievements() {
        return {
            'first_gold': { name: '第一桶金', description: '获得100金币', condition: (g) => g.player?.gold >= 100 },
            'first_blood': { name: '初战告捷', description: '击败第一个敌人', condition: (g) => g.player?.stats.enemiesDefeated >= 1 },
            'floor_5': { name: '深入地下', description: '到达第5层', condition: (g) => g.currentFloor >= 5 },
            'floor_10': { name: '小有名气', description: '到达第10层', condition: (g) => g.currentFloor >= 10 },
            'floor_25': { name: '资深冒险者', description: '到达第25层', condition: (g) => g.currentFloor >= 25 },
            'floor_50': { name: '传奇冒险者', description: '到达第50层', condition: (g) => g.currentFloor >= 50 },
            'kill_enemies': { name: '战士', description: '击败100个敌人', condition: (g) => g.player?.stats.enemiesDefeated >= 100 },
            'kill_500': { name: '屠夫', description: '击败500个敌人', condition: (g) => g.player?.stats.enemiesDefeated >= 500 },
            'kill_1000': { name: '死神', description: '击败1000个敌人', condition: (g) => g.player?.stats.enemiesDefeated >= 1000 },
            'complete_game': { name: '征服符文之地', description: '通关游戏', condition: (g) => g.currentFloor > 50 },
            'rich': { name: '富翁', description: '积累10000金币', condition: (g) => g.player?.gold >= 10000 },
            'upgrade_10': { name: '升级达人', description: '达到10级', condition: (g) => g.player?.level >= 10 },
            'upgrade_25': { name: '精英冒险者', description: '达到25级', condition: (g) => g.player?.level >= 25 },
            'upgrade_50': { name: '大师', description: '达到50级', condition: (g) => g.player?.level >= 50 },
            'combo_10': { name: '连击达人', description: '达成10连击', condition: (g) => g.player?.maxCombo >= 10 },
            'crit_100': { name: '暴击制造者', description: '累计100次暴击', condition: (g) => g.player?.stats.criticalHits >= 100 },
            'no_hit_floor': { name: '无伤通关', description: '不受伤通过一层', condition: (g) => false }, // 需要特殊追踪
            'boss_killer': { name: '首领杀手', description: '击败所有5个首领', condition: (g) => false },
            'collector': { name: '收藏家', description: '收集所有装备类型', condition: (g) => false }
        };
    }
    
    update() {
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
    
    check(id, value) {
        if (this.unlocked.has(id)) return;
        
        // 手动检查
        if (id === 'kill_enemies' && this.game.player) {
            if (this.game.player.stats.enemiesDefeated >= value) {
                this.unlock(id);
            }
        }
    }
    
    unlock(id) {
        if (this.unlocked.has(id)) return;
        
        const achievement = this.achievements[id];
        if (!achievement) return;
        
        this.unlocked.add(id);
        this.game.showAchievement(achievement.name);
        console.log(`[Achievement] 解锁: ${achievement.name}`);
    }
    
    getProgress() {
        return {
            unlocked: [...this.unlocked],
            total: Object.keys(this.achievements).length
        };
    }
}

export { AchievementManager };
