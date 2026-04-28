/**
 * 符文之地 - 50+详细任务数据
 */

const QUEST_DATABASE = {
    // 主线任务
    main_001: {
        id: 'main_001',
        name: '初入地下城',
        description: '进入地下城，击败第一个敌人',
        type: 'main',
        level: 1,
        objectives: [{ type: 'kill_enemy', target: 1, progress: 0 }],
        rewards: { gold: 50, exp: 100 },
        nextQuest: 'main_002'
    },
    main_002: {
        id: 'main_002',
        name: '深入探索',
        description: '到达第5层',
        type: 'main',
        level: 3,
        objectives: [{ type: 'reach_floor', target: 5, progress: 0 }],
        rewards: { gold: 100, exp: 200 },
        nextQuest: 'main_003'
    },
    main_003: {
        id: 'main_003',
        name: '首领之战',
        description: '击败森林首领-巨魔',
        type: 'main',
        level: 10,
        objectives: [{ type: 'kill_boss', target: 'troll', progress: 0 }],
        rewards: { gold: 500, exp: 500, items: [{ id: 'troll_hammer', name: '巨魔之锤' }] },
        nextQuest: 'main_004'
    },
    main_004: {
        id: 'main_004',
        name: '沙漠之旅',
        description: '进入沙漠地区',
        type: 'main',
        level: 11,
        objectives: [{ type: 'reach_floor', target: 11, progress: 0 }],
        rewards: { gold: 150, exp: 300 },
        nextQuest: 'main_005'
    },
    main_005: {
        id: 'main_005',
        name: '法老的诅咒',
        description: '击败沙漠首领-法老王',
        type: 'main',
        level: 20,
        objectives: [{ type: 'kill_boss', target: 'pharaoh', progress: 0 }],
        rewards: { gold: 800, exp: 800, items: [{ id: 'pharaoh_staff', name: '法老之杖' }] },
        nextQuest: 'main_006'
    },
    main_006: {
        id: 'main_006',
        name: '冰霜要塞',
        description: '进入冰霜地区',
        type: 'main',
        level: 21,
        objectives: [{ type: 'reach_floor', target: 21, progress: 0 }],
        rewards: { gold: 200, exp: 400 },
        nextQuest: 'main_007'
    },
    main_007: {
        id: 'main_007',
        name: '冰霜巨龙',
        description: '击败冰霜首领-冰霜巨龙',
        type: 'main',
        level: 30,
        objectives: [{ type: 'kill_boss', target: 'ice_dragon', progress: 0 }],
        rewards: { gold: 1000, exp: 1000, items: [{ id: 'ice_dragon_scale', name: '冰龙鳞片' }] },
        nextQuest: 'main_008'
    },
    main_008: {
        id: 'main_008',
        name: '烈焰地狱',
        description: '进入火焰地区',
        type: 'main',
        level: 31,
        objectives: [{ type: 'reach_floor', target: 31, progress: 0 }],
        rewards: { gold: 300, exp: 600 },
        nextQuest: 'main_009'
    },
    main_009: {
        id: 'main_009',
        name: '火焰领主',
        description: '击败火焰首领-火焰领主',
        type: 'main',
        level: 40,
        objectives: [{ type: 'kill_boss', target: 'fire_lord', progress: 0 }],
        rewards: { gold: 1500, exp: 1500, items: [{ id: 'fire_lord_crown', name: '火焰王冠' }] },
        nextQuest: 'main_010'
    },
    main_010: {
        id: 'main_010',
        name: '虚空神殿',
        description: '进入虚空地区',
        type: 'main',
        level: 41,
        objectives: [{ type: 'reach_floor', target: 41, progress: 0 }],
        rewards: { gold: 500, exp: 1000 },
        nextQuest: 'main_011'
    },
    main_011: {
        id: 'main_011',
        name: '最终决战',
        description: '击败虚空君主',
        type: 'main',
        level: 50,
        objectives: [{ type: 'kill_boss', target: 'void_overlord', progress: 0 }],
        rewards: { gold: 10000, exp: 10000, title: '征服者', items: [{ id: 'rune_heart', name: '符文之心' }] },
        nextQuest: null
    },
    
    // 支线任务 - 森林
    forest_001: {
        id: 'forest_001',
        name: '哥布林侵扰',
        description: '击败10只哥布林',
        type: 'side',
        level: 2,
        location: 'forest',
        objectives: [{ type: 'kill_enemy_type', target: 'goblin', targetCount: 10, progress: 0 }],
        rewards: { gold: 80, exp: 120 }
    },
    forest_002: {
        id: 'forest_002',
        name: '狼群威胁',
        description: '击败5只森林狼',
        type: 'side',
        level: 3,
        location: 'forest',
        objectives: [{ type: 'kill_enemy_type', target: 'wolf', targetCount: 5, progress: 0 }],
        rewards: { gold: 100, exp: 150 }
    },
    forest_003: {
        id: 'forest_003',
        name: '骷髅军团',
        description: '击败15只骷髅',
        type: 'side',
        level: 5,
        location: 'forest',
        objectives: [{ type: 'kill_enemy_type', target: 'skeleton', targetCount: 15, progress: 0 }],
        rewards: { gold: 150, exp: 200 }
    },
    forest_004: {
        id: 'forest_004',
        name: '蜘蛛巢穴',
        description: '击败蜘蛛女王',
        type: 'side',
        level: 8,
        location: 'forest',
        objectives: [{ type: 'kill_elite', target: 'spider_queen', progress: 0 }],
        rewards: { gold: 200, exp: 300, items: [{ id: 'spider_silk', name: '蜘蛛丝' }] }
    },
    
    // 支线任务 - 沙漠
    desert_001: {
        id: 'desert_001',
        name: '蝎子危机',
        description: '击败10只沙漠蝎子',
        type: 'side',
        level: 12,
        location: 'desert',
        objectives: [{ type: 'kill_enemy_type', target: 'scorpion', targetCount: 10, progress: 0 }],
        rewards: { gold: 150, exp: 200 }
    },
    desert_002: {
        id: 'desert_002',
        name: '木乃伊诅咒',
        description: '击败10只木乃伊',
        type: 'side',
        level: 15,
        location: 'desert',
        objectives: [{ type: 'kill_enemy_type', target: 'mummy', targetCount: 10, progress: 0 }],
        rewards: { gold: 200, exp: 300 }
    },
    desert_003: {
        id: 'desert_003',
        name: '沙虫之灾',
        description: '击败沙虫',
        type: 'side',
        level: 18,
        location: 'desert',
        objectives: [{ type: 'kill_enemy_type', target: 'sandworm', targetCount: 3, progress: 0 }],
        rewards: { gold: 300, exp: 400 }
    },
    
    // 支线任务 - 冰霜
    ice_001: {
        id: 'ice_001',
        name: '傀儡入侵',
        description: '击败15只冰霜傀儡',
        type: 'side',
        level: 23,
        location: 'ice',
        objectives: [{ type: 'kill_enemy_type', target: 'golem', targetCount: 15, progress: 0 }],
        rewards: { gold: 250, exp: 350 }
    },
    ice_002: {
        id: 'ice_002',
        name: '幽魂狩猎',
        description: '击败10只冰霜幽魂',
        type: 'side',
        level: 26,
        location: 'ice',
        objectives: [{ type: 'kill_enemy_type', target: 'wraith', targetCount: 10, progress: 0 }],
        rewards: { gold: 300, exp: 450 }
    },
    ice_003: {
        id: 'ice_003',
        name: '巨人传说',
        description: '击败冰霜巨人',
        type: 'side',
        level: 28,
        location: 'ice',
        objectives: [{ type: 'kill_elite', target: 'ice_giant', progress: 0 }],
        rewards: { gold: 400, exp: 500, items: [{ id: 'giant_heart', name: '巨人之心' }] }
    },
    
    // 支线任务 - 火焰
    fire_001: {
        id: 'fire_001',
        name: '小鬼讨伐',
        description: '击败20只火焰小鬼',
        type: 'side',
        level: 33,
        location: 'fire',
        objectives: [{ type: 'kill_enemy_type', target: 'imp', targetCount: 20, progress: 0 }],
        rewards: { gold: 350, exp: 500 }
    },
    fire_002: {
        id: 'fire_002',
        name: '火龙狩猎',
        description: '击败火龙',
        type: 'side',
        level: 37,
        location: 'fire',
        objectives: [{ type: 'kill_enemy_type', target: 'drake', targetCount: 3, progress: 0 }],
        rewards: { gold: 500, exp: 700 }
    },
    fire_003: {
        id: 'fire_003',
        name: '恶魔契约',
        description: '击败火焰恶魔',
        type: 'side',
        level: 39,
        location: 'fire',
        objectives: [{ type: 'kill_elite', target: 'fire_demon', progress: 0 }],
        rewards: { gold: 600, exp: 800, items: [{ id: 'demon_horn', name: '恶魔之角' }] }
    },
    
    // 支线任务 - 虚空
    void_001: {
        id: 'void_001',
        name: '虚空异兽',
        description: '击败15只虚空异兽',
        type: 'side',
        level: 43,
        location: 'void',
        objectives: [{ type: 'kill_enemy_type', target: 'abomination', targetCount: 15, progress: 0 }],
        rewards: { gold: 500, exp: 700 }
    },
    void_002: {
        id: 'void_002',
        name: '巫妖王',
        description: '击败巫妖',
        type: 'side',
        level: 46,
        location: 'void',
        objectives: [{ type: 'kill_elite', target: 'lich', progress: 0 }],
        rewards: { gold: 700, exp: 900, items: [{ id: 'lich_tome', name: '巫妖典籍' }] }
    },
    void_003: {
        id: 'void_003',
        name: '幽灵船',
        description: '击败虚空幽灵',
        type: 'side',
        level: 48,
        location: 'void',
        objectives: [{ type: 'kill_enemy_type', target: 'specter', targetCount: 10, progress: 0 }],
        rewards: { gold: 800, exp: 1000 }
    },
    
    // 日常任务
    daily_001: {
        id: 'daily_001',
        name: '日常：怪物清除',
        description: '击败10个敌人',
        type: 'daily',
        level: 1,
        objectives: [{ type: 'kill_enemy', targetCount: 10, progress: 0 }],
        rewards: { gold: 50, exp: 100 },
        resetTime: 'daily'
    },
    daily_002: {
        id: 'daily_002',
        name: '日常：宝箱猎人',
        description: '开启3个宝箱',
        type: 'daily',
        level: 1,
        objectives: [{ type: 'open_chest', targetCount: 3, progress: 0 }],
        rewards: { gold: 80, exp: 50 },
        resetTime: 'daily'
    },
    daily_003: {
        id: 'daily_003',
        name: '日常：首领挑战',
        description: '击败任意首领',
        type: 'daily',
        level: 10,
        objectives: [{ type: 'kill_boss', targetCount: 1, progress: 0 }],
        rewards: { gold: 200, exp: 300 },
        resetTime: 'daily'
    },
    daily_004: {
        id: 'daily_004',
        name: '日常：深入探索',
        description: '探索5层',
        type: 'daily',
        level: 5,
        objectives: [{ type: 'reach_floor', targetCount: 5, progress: 0 }],
        rewards: { gold: 100, exp: 150 },
        resetTime: 'daily'
    },
    daily_005: {
        id: 'daily_005',
        name: '日常：收集材料',
        description: '收集10个材料',
        type: 'daily',
        level: 1,
        objectives: [{ type: 'collect_material', targetCount: 10, progress: 0 }],
        rewards: { gold: 60, exp: 80 },
        resetTime: 'daily'
    },
    
    // 成就任务
    achievement_001: {
        id: 'achievement_001',
        name: '成就：连胜',
        description: '在一次探险中击败50个敌人',
        type: 'achievement',
        level: 10,
        objectives: [{ type: 'kill_in_single_run', targetCount: 50, progress: 0 }],
        rewards: { gold: 1000, exp: 2000 }
    },
    achievement_002: {
        id: 'achievement_002',
        name: '成就：财富',
        description: '累计获得10000金币',
        type: 'achievement',
        level: 1,
        objectives: [{ type: 'total_gold', targetCount: 10000, progress: 0 }],
        rewards: { gold: 500 }
    }
};

class QuestManager {
    constructor(game) {
        this.game = game;
        this.quests = {};
        this.activeQuests = [];
        this.completedQuests = new Set();
        this.failedQuests = new Set();
        this.initQuests();
    }
    
    initQuests() {
        this.quests = { ...QUEST_DATABASE };
    }
    
    acceptQuest(questId) {
        const quest = this.quests[questId];
        if (!quest) return false;
        if (this.activeQuests.includes(questId)) return false;
        if (this.completedQuests.has(questId)) return false;
        
        this.activeQuests.push(questId);
        this.game.showNotification('接受任务: ' + quest.name);
        return true;
    }
    
    abandonQuest(questId) {
        const index = this.activeQuests.indexOf(questId);
        if (index >= 0) {
            this.activeQuests.splice(index, 1);
            this.failedQuests.add(questId);
            return true;
        }
        return false;
    }
    
    completeQuest(questId) {
        const quest = this.quests[questId];
        if (!quest) return false;
        
        const index = this.activeQuests.indexOf(questId);
        if (index >= 0) {
            this.activeQuests.splice(index, 1);
            this.completedQuests.add(questId);
            
            // 发放奖励
            if (quest.rewards) {
                if (quest.rewards.gold) this.game.player.gold += quest.rewards.gold;
                if (quest.rewards.exp) this.game.player.addExp(quest.rewards.exp);
                if (quest.rewards.items) {
                    quest.rewards.items.forEach(item => {
                        this.game.player.addItem(item);
                    });
                }
            }
            
            this.game.showNotification('完成任务: ' + quest.name);
            this.game.audioManager?.play('victory');
            
            // 接受下一个任务
            if (quest.nextQuest) {
                this.acceptQuest(quest.nextQuest);
            }
            
            return true;
        }
        return false;
    }
    
    updateQuestProgress(type, target, amount = 1) {
        for (const questId of this.activeQuests) {
            const quest = this.quests[questId];
            if (!quest) continue;
            
            for (const obj of quest.objectives) {
                if (obj.type === type && (obj.target === target || !obj.target)) {
                    obj.progress += amount;
                    
                    // 检查是否完成
                    const targetCount = obj.targetCount || obj.target;
                    if (obj.progress >= targetCount) {
                        // 检查所有目标是否完成
                        if (quest.objectives.every(o => {
                            const t = o.targetCount || o.target;
                            return o.progress >= t;
                        })) {
                            this.completeQuest(questId);
                        }
                    }
                }
            }
        }
    }
    
    getActiveQuests() {
        return this.activeQuests.map(id => this.quests[id]).filter(Boolean);
    }
    
    getAvailableQuests() {
        const available = [];
        for (const [id, quest] of Object.entries(this.quests)) {
            if (this.completedQuests.has(id)) continue;
            if (this.activeQuests.includes(id)) continue;
            if (this.failedQuests.has(id)) continue;
            
            // 检查等级要求
            if (quest.level && this.game.player.level < quest.level) continue;
            
            available.push(quest);
        }
        return available;
    }
    
    getQuestById(questId) {
        return this.quests[questId];
    }
    
    saveProgress() {
        return {
            activeQuests: this.activeQuests,
            completedQuests: [...this.completedQuests],
            failedQuests: [...this.failedQuests],
            questProgress: Object.fromEntries(
                this.activeQuests.map(id => [id, this.quests[id]?.objectives || []])
            )
        };
    }
    
    loadProgress(data) {
        if (data.activeQuests) this.activeQuests = data.activeQuests;
        if (data.completedQuests) this.completedQuests = new Set(data.completedQuests);
        if (data.failedQuests) this.failedQuests = new Set(data.failedQuests);
        
        // 恢复任务进度
        if (data.questProgress) {
            for (const [questId, objectives] of Object.entries(data.questProgress)) {
                if (this.quests[questId]) {
                    this.quests[questId].objectives = objectives;
                }
            }
        }
    }
}

export { QuestManager, QUEST_DATABASE };
