/**
 * 符文之地 - 任务系统
 */

class QuestManager {
    constructor(game) {
        this.game = game;
        this.quests = {};
        this.activeQuests = [];
        this.completedQuests = new Set();
        this.initQuests();
    }
    
    initQuests() {
        this.quests = {
            'first_blood': {
                id: 'first_blood',
                name: '初出茅庐',
                description: '击败你的第一个敌人',
                type: 'kill',
                target: 1,
                progress: 0,
                reward: { gold: 50, exp: 30 }
            },
            'slayer_10': {
                id: 'slayer_10',
                name: '杀手之路',
                description: '击败10个敌人',
                type: 'kill',
                target: 10,
                progress: 0,
                reward: { gold: 200, exp: 100 }
            },
            'treasure_hunter': {
                id: 'treasure_hunter',
                name: '宝藏猎人',
                description: '开启10个宝箱',
                type: 'chest',
                target: 10,
                progress: 0,
                reward: { gold: 300, exp: 150 }
            },
            'deep_diver': {
                id: 'deep_diver',
                name: '深渊潜行者',
                description: '探索第5层',
                type: 'floor',
                target: 5,
                progress: 0,
                reward: { gold: 100, exp: 80 }
            },
            'boss_slayer': {
                id: 'boss_slayer',
                name: '首领猎人',
                description: '击败任意首领',
                type: 'boss',
                target: 1,
                progress: 0,
                reward: { gold: 500, exp: 300 }
            },
            'collector': {
                id: 'collector',
                name: '收藏家',
                description: '收集5件稀有以上装备',
                type: 'item',
                target: 5,
                progress: 0,
                reward: { gold: 400, exp: 200 }
            }
        };
    }
    
    update() {
        if (!this.game.player) return;
        
        // 检查任务进度
        for (const quest of Object.values(this.quests)) {
            if (this.completedQuests.has(quest.id)) continue;
            
            switch (quest.type) {
                case 'kill':
                    quest.progress = this.game.player.stats.enemiesDefeated;
                    break;
                case 'floor':
                    quest.progress = Math.max(quest.progress, this.game.currentFloor);
                    break;
                case 'chest':
                    // 追踪宝箱开启数
                    break;
                case 'boss':
                    // 追踪首领击败数
                    break;
            }
            
            // 检查完成
            if (quest.progress >= quest.target) {
                this.completeQuest(quest);
            }
        }
    }
    
    completeQuest(quest) {
        if (this.completedQuests.has(quest.id)) return;
        
        this.completedQuests.add(quest.id);
        
        // 发放奖励
        if (this.game.player && quest.reward) {
            if (quest.reward.gold) this.game.player.gold += quest.reward.gold;
            if (quest.reward.exp) this.game.player.addExp(quest.reward.exp);
        }
        
        this.game.showNotification(`任务完成: ${quest.name}`);
        this.game.showAchievement(`任务: ${quest.name}`);
        console.log(`[Quest] 完成: ${quest.name}`);
    }
    
    check(event, data) {
        // 事件触发检查
        if (event === 'kill' && this.quests.slayer_10) {
            this.quests.slayer_10.progress++;
        }
    }
    
    getProgress() {
        return {
            activeQuests: this.activeQuests.map(q => q.id),
            completedQuests: [...this.completedQuests]
        };
    }
    
    getActiveQuests() {
        return Object.values(this.quests).filter(q => !this.completedQuests.has(q.id));
    }
}

export { QuestManager };
