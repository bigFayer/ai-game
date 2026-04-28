/**
 * 符文之地 - 完整任务系统
 */

const QUEST_DATA = {
    // ===== 主线任务 =====
    main_story: {
        prologue: {
            id: 'prologue',
            name: '序章：符文之地的召唤',
            description: '你醒来发现自己身处一片神秘的森林，一个声音在召唤你前往地下城深处...',
            type: 'main',
            objectives: [
                { type: 'talk_to', target: 'elder_forest', description: '与森林长老交谈' },
                { type: 'kill', target: 'forest_goblin', count: 10, description: '击败10只哥布林' },
                { type: 'reach_floor', floor: 5, description: '到达第5层' }
            ],
            rewards: { exp: 500, gold: 100, items: [{ id: 'health_potion', quantity: 3 }] },
            nextQuest: 'forest_hero'
        },
        
        forest_hero: {
            id: 'forest_hero',
            name: '第一章：森林英雄',
            description: '击败森林首领——巨魔，并找到精灵的秘密',
            type: 'main',
            objectives: [
                { type: 'kill_boss', bossId: 'boss_forest_troll', description: '击败森林巨魔' },
                { type: 'explore', area: 'forest_shrine', description: '探索精灵神殿' }
            ],
            rewards: { exp: 1000, gold: 300, items: [{ id: 'steel_sword', quantity: 1 }] },
            nextQuest: 'desert_trial'
        },
        
        desert_trial: {
            id: 'desert_trial',
            name: '第二章：沙漠试炼',
            description: '穿越炎热沙漠，挑战法老的诅咒',
            type: 'main',
            objectives: [
                { type: 'reach_floor', floor: 15, description: '到达第15层' },
                { type: 'collect', itemId: 'holy_water', count: 1, description: '收集圣水' },
                { type: 'kill_boss', bossId: 'boss_desert_pharaoh', description: '击败法老王' }
            ],
            rewards: { exp: 2000, gold: 600, items: [{ id: 'fire_amulet', quantity: 1 }] },
            nextQuest: 'ice_trial'
        },
        
        ice_trial: {
            id: 'ice_trial',
            name: '第三章：冰霜试炼',
            description: '穿越冰霜要塞，寻找冰霜之心',
            type: 'main',
            objectives: [
                { type: 'reach_floor', floor: 25, description: '到达第25层' },
                { type: 'collect', itemId: 'ice_crystal', count: 5, description: '收集5个冰晶' },
                { type: 'kill_boss', bossId: 'boss_ice_dragon', description: '击败冰霜巨龙' }
            ],
            rewards: { exp: 3000, gold: 1000, items: [{ id: 'ice_sword', quantity: 1 }] },
            nextQuest: 'fire_trial'
        },
        
        fire_trial: {
            id: 'fire_trial',
            name: '第四章：火焰试炼',
            description: '深入火焰地狱，挑战火焰领主',
            type: 'main',
            objectives: [
                { type: 'reach_floor', floor: 35, description: '到达第35层' },
                { type: 'collect', itemId: 'phoenix_feather', count: 1, description: '收集凤凰羽毛' },
                { type: 'kill_boss', bossId: 'boss_fire_lord', description: '击败火焰领主' }
            ],
            rewards: { exp: 4000, gold: 1500, items: [{ id: 'fire_lord_crown', quantity: 1 }] },
            nextQuest: 'void_confrontation'
        },
        
        void_confrontation: {
            id: 'void_confrontation',
            name: '第五章：虚空对决',
            description: '最终决战，面对虚空君主',
            type: 'main',
            objectives: [
                { type: 'reach_floor', floor: 45, description: '到达第45层' },
                { type: 'collect', itemId: 'rune_heart_shard', count: 5, description: '收集5块符文之心碎片' },
                { type: 'kill_boss', bossId: 'boss_void_overlord', description: '击败虚空君主' }
            ],
            rewards: { exp: 10000, gold: 5000, items: [{ id: 'void_blade', quantity: 1 }] },
            nextQuest: null
        }
    },
    
    // ===== 支线任务 =====
    side_quests: {
        goblin_hunter: {
            id: 'goblin_hunter',
            name: '哥布林猎人',
            description: '流浪商人请你清除森林中的哥布林威胁',
            type: 'side',
            giver: 'merchant_forest',
            objectives: [
                { type: 'kill', target: 'forest_goblin', count: 20, description: '击败20只哥布林' }
            ],
            rewards: { exp: 300, gold: 150, reputation: { faction: 'merchants', amount: 10 } },
            repeatable: true
        },
        
        spider_slayer: {
            id: 'spider_slayer',
            name: '蜘蛛杀手',
            description: '森林长老请求你消灭巨大的蜘蛛女王',
            type: 'side',
            giver: 'elder_forest',
            objectives: [
                { type: 'kill', target: 'forest_spider_queen', count: 1, description: '击败蜘蛛女王' }
            ],
            rewards: { exp: 500, gold: 200, items: [{ id: 'spider_silk', quantity: 3 }] }
        },
        
        ancient_scholar: {
            id: 'ancient_scholar',
            name: '古老学者',
            description: '沙漠学者希望你能带回一些古代文物',
            type: 'side',
            giver: 'scholar_desert',
            objectives: [
                { type: 'collect', itemId: 'ancient_bandage', count: 3, description: '收集3个古老绷带' },
                { type: 'collect', itemId: 'scarab_shell', count: 2, description: '收集2个圣甲虫壳' }
            ],
            rewards: { exp: 400, gold: 300, items: [{ id: 'ancient_tome', quantity: 1 }] }
        }
    },
    
    // ===== 日常任务 =====
    daily_quests: {
        daily_hunt: {
            id: 'daily_hunt',
            name: '每日狩猎',
            description: '击败今天的怪物目标',
            type: 'daily',
            objectives: [
                { type: 'kill', target: 'any', count: 10, description: '击败10只怪物' }
            ],
            rewards: { exp: 100, gold: 50 }
        },
        
        daily_explore: {
            id: 'daily_explore',
            name: '每日探索',
            description: '探索新的楼层',
            type: 'daily',
            objectives: [
                { type: 'explore', count: 3, description: '探索3个新房间' }
            ],
            rewards: { exp: 150, gold: 75 }
        }
    }
};

class QuestObjective {
    constructor(data) {
        this.type = data.type;
        this.target = data.target;
        this.count = data.count || 1;
        this.description = data.description;
        this.current = 0;
        this.completed = false;
    }
    
    checkProgress(game) {
        if (this.completed) return;
        
        switch (this.type) {
            case 'kill':
                if (game.stats?.enemiesKilled >= this.count) {
                    this.current = this.count;
                    this.completed = true;
                }
                break;
            case 'kill_boss':
                if (game.stats?.bossesKilled >= this.count) {
                    this.current = this.count;
                    this.completed = true;
                }
                break;
            case 'collect':
                if (game.inventory?.hasItem(this.target, this.count)) {
                    this.current = this.count;
                    this.completed = true;
                }
                break;
            case 'reach_floor':
                if (game.currentFloor >= this.floor) {
                    this.current = game.currentFloor;
                    this.completed = true;
                }
                break;
            case 'talk_to':
                // 需要对话系统
                break;
        }
    }
    
    getProgress() {
        return {
            current: this.current,
            count: this.count,
            progress: this.count > 0 ? this.current / this.count : 0,
            completed: this.completed
        };
    }
}

class Quest {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.type = data.type; // main, side, daily
        this.objectives = data.objectives.map(o => new QuestObjective(o));
        this.rewards = data.rewards;
        this.giver = data.giver || null;
        this.nextQuest = data.nextQuest || null;
        this.repeatable = data.repeatable || false;
        
        this.status = 'available'; // available, active, completed, failed
        this.acceptedAt = null;
        this.completedAt = null;
    }
    
    accept() {
        this.status = 'active';
        this.acceptedAt = Date.now();
    }
    
    checkCompletion(game) {
        if (this.status !== 'active') return false;
        
        for (const objective of this.objectives) {
            objective.checkProgress(game);
        }
        
        const allCompleted = this.objectives.every(o => o.completed);
        
        if (allCompleted) {
            this.complete();
            return true;
        }
        
        return false;
    }
    
    complete() {
        this.status = 'completed';
        this.completedAt = Date.now();
    }
    
    fail() {
        this.status = 'failed';
    }
    
    getProgress() {
        return {
            status: this.status,
            objectives: this.objectives.map(o => o.getProgress())
        };
    }
}

class QuestManagerFull {
    constructor(game) {
        this.game = game;
        this.activeQuests = new Map();
        this.completedQuests = new Set();
        this.failedQuests = new Set();
        this.availableQuests = new Map();
        
        this.loadQuests();
    }
    
    loadQuests() {
        // 加载主线任务
        for (const [id, data] of Object.entries(QUEST_DATA.main_story)) {
            this.availableQuests.set(id, new Quest(data));
        }
        
        // 加载支线任务
        for (const [id, data] of Object.entries(QUEST_DATA.side_quests)) {
            this.availableQuests.set(id, new Quest(data));
        }
    }
    
    acceptQuest(questId) {
        const quest = this.availableQuests.get(questId);
        if (!quest) return false;
        
        if (quest.status !== 'available') return false;
        
        quest.accept();
        this.activeQuests.set(questId, quest);
        
        this.game.notificationManager.showQuest(`接受任务: ${quest.name}`);
        
        return true;
    }
    
    completeQuest(questId) {
        const quest = this.activeQuests.get(questId);
        if (!quest) return false;
        
        quest.complete();
        this.activeQuests.delete(questId);
        this.completedQuests.add(questId);
        
        // 给予奖励
        this.grantRewards(quest);
        
        // 解锁后续任务
        if (quest.nextQuest) {
            const nextQuest = this.availableQuests.get(quest.nextQuest);
            if (nextQuest) {
                // 触发新任务可用
            }
        }
        
        return true;
    }
    
    grantRewards(quest) {
        const rewards = quest.rewards;
        
        if (rewards.exp) {
            this.game.player.addExp(rewards.exp);
        }
        
        if (rewards.gold) {
            this.game.player.gold += rewards.gold;
        }
        
        if (rewards.items) {
            for (const item of rewards.items) {
                this.game.inventory.addItem(item.id, item.quantity);
            }
        }
        
        this.game.notificationManager.showAchievement(`完成任务: ${quest.name}`);
    }
    
    update(dt) {
        // 检查任务进度
        for (const quest of this.activeQuests.values()) {
            quest.checkCompletion(this.game);
            
            if (quest.status === 'completed') {
                this.completeQuest(quest.id);
            }
        }
    }
    
    getActiveQuests() {
        return Array.from(this.activeQuests.values());
    }
    
    getQuestLog() {
        return {
            active: this.getActiveQuests(),
            completed: Array.from(this.completedQuests),
            available: Array.from(this.availableQuests.values()).filter(q => q.status === 'available')
        };
    }
}

export { Quest, QuestManagerFull, QuestObjective, QUEST_DATA };
