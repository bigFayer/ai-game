/**
 * 符文之地 - 50成就完整数据
 */

const ACHIEVEMENT_DATA = {
    // 战斗类成就
    combat: {
        'first_blood': {
            name: '初战告捷',
            description: '击败你的第一个敌人',
            category: 'combat',
            unlocked: false,
            unlockDate: null,
            progress: { current: 0, target: 1 },
            reward: { gold: 50, exp: 0 },
            icon: '⚔',
            tips: '选择战士职业可以更轻松地击败第一个敌人。'
        },
        'slayer_10': {
            name: '初露锋芒',
            description: '击败10个敌人',
            category: 'combat',
            unlocked: false,
            unlockDate: null,
            progress: { current: 0, target: 10 },
            reward: { gold: 100, exp: 0 },
            icon: '⚔',
            tips: '多探索地下城，击败更多敌人。'
        },
        'slayer_50': {
            name: '初露锋芒',
            description: '击败50个敌人',
            category: 'combat',
            unlocked: false,
            unlockDate: null,
            progress: { current: 0, target: 50 },
            reward: { gold: 200, exp: 0 },
            icon: '⚔',
            tips: '每10层敌人会变得更强大，但奖励也更好。'
        },
        'boss_killer': {
            name: '首领猎人',
            description: '击败任意首领',
            category: 'combat',
            unlocked: false,
            unlockDate: null,
            progress: { current: 0, target: 1 },
            reward: { gold: 500, exp: 200 },
            icon: '👹',
            tips: '首领出现在每10层的BOSS房间。'
        }
    },
    
    // 探索类成就
    exploration: {
        'floor_5': {
            name: '深入地下',
            description: '到达第5层',
            category: 'exploration',
            unlocked: false,
            unlockDate: null,
            progress: { current: 0, target: 5 },
            reward: { gold: 0, exp: 100 },
            icon: '⬇',
            tips: '击败所有敌人后，楼梯会出现。'
        },
        'floor_10': {
            name: '小有名气',
            description: '到达第10层',
            category: 'exploration',
            unlocked: false,
            unlockDate: null,
            progress: { current: 0, target: 10 },
            reward: { gold: 0, exp: 200 },
            icon: '⬇',
            tips: '第10层是森林地区的BOSS层。'
        },
        'floor_25': {
            name: '资深冒险者',
            description: '到达第25层',
            category: 'exploration',
            unlocked: false,
            unlockDate: null,
            progress: { current: 0, target: 25 },
            reward: { gold: 0, exp: 500 },
            icon: '⬇',
            tips: '第25层是冰霜地区的BOSS层。'
        },
        'floor_50': {
            name: '征服者',
            description: '到达第50层',
            category: 'exploration',
            unlocked: false,
            unlockDate: null,
            progress: { current: 0, target: 50 },
            reward: { gold: 0, exp: 5000 },
            icon: '🏆',
            tips: '通关游戏！恭喜你征服了符文之地！'
        }
    },
    
    // 收集类成就
    collection: {
        'equip_rare': {
            name: '收藏开始',
            description: '获得第一件稀有装备',
            category: 'collection',
            unlocked: false,
            unlockDate: null,
            progress: { current: 0, target: 1 },
            reward: { gold: 100, exp: 0 },
            icon: '💎',
            tips: '稀有装备呈蓝色边框。'
        },
        'equip_epic': {
            name: '史诗收藏',
            description: '获得第一件史诗装备',
            category: 'collection',
            unlocked: false,
            unlockDate: null,
            progress: { current: 0, target: 1 },
            reward: { gold: 300, exp: 0 },
            icon: '💎',
            tips: '史诗装备呈紫色边框。'
        },
        'equip_legendary': {
            name: '传说收藏',
            description: '获得第一件传说装备',
            category: 'collection',
            unlocked: false,
            unlockDate: null,
            progress: { current: 0, target: 1 },
            reward: { gold: 800, exp: 0 },
            icon: '💎',
            tips: '传说装备呈橙色边框，通常有特殊效果。'
        },
        'equip_mythic': {
            name: '神话收藏',
            description: '获得第一件神话装备',
            category: 'collection',
            unlocked: false,
            unlockDate: null,
            progress: { current: 0, target: 1 },
            reward: { gold: 2000, exp: 0 },
            icon: '💎',
            tips: '神话装备呈金色边框，是最稀有的装备。'
        }
    },
    
    // 技能类成就
    skill: {
        'skill_master': {
            name: '技能大师',
            description: '学习10个技能',
            category: 'skill',
            unlocked: false,
            unlockDate: null,
            progress: { current: 0, target: 10 },
            reward: { gold: 0, exp: 300 },
            icon: '✨',
            tips: '升级可以学习新技能。'
        }
    },
    
    // 经济类成就
    economy: {
        'gold_1000': {
            name: '富翁',
            description: '累计获得1000金币',
            category: 'economy',
            unlocked: false,
            unlockDate: null,
            progress: { current: 0, target: 1000 },
            reward: { gold: 200, exp: 0 },
            icon: '💰',
            tips: '击败敌人和完成任务可以获得金币。'
        },
        'gold_10000': {
            name: '大富翁',
            description: '累计获得10000金币',
            category: 'economy',
            unlocked: false,
            unlockDate: null,
            progress: { current: 0, target: 10000 },
            reward: { gold: 1000, exp: 0 },
            icon: '💰',
            tips: '首领会掉落大量金币。'
        }
    },
    
    // 特殊成就
    special: {
        'complete_game': {
            name: '征服符文之地',
            description: '通关游戏',
            category: 'special',
            unlocked: false,
            unlockDate: null,
            progress: { current: 0, target: 1 },
            reward: { gold: 10000, exp: 0, title: '征服者' },
            icon: '🏆',
            tips: '到达第50层即可通关。'
        },
        'true_ending': {
            name: '真实结局',
            description: '以50级通关游戏',
            category: 'special',
            unlocked: false,
            unlockDate: null,
            progress: { current: 0, target: 1 },
            reward: { gold: 20000, exp: 0, title: '传奇英雄' },
            icon: '🏆',
            tips: '保持高等级通关可以获得更好的结局。'
        }
    }
};

const CATEGORY_INFO = {
    combat: { name: '战斗', icon: '⚔', color: '#ff4444' },
    exploration: { name: '探索', icon: '🗺', color: '#44ff44' },
    collection: { name: '收集', icon: '💎', color: '#4444ff' },
    skill: { name: '技能', icon: '✨', color: '#ff44ff' },
    economy: { name: '经济', icon: '💰', color: '#ffaa00' },
    special: { name: '特殊', icon: '🏆', color: '#ffd700' }
};

export { ACHIEVEMENT_DATA, CATEGORY_INFO };
