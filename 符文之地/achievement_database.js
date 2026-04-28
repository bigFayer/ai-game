/**
 * 符文之地 - 完整成就数据库
 */

const ACHIEVEMENT_DATABASE = {
    // ========== 战斗成就 ==========
    first_blood: {
        id: 'first_blood',
        name: '初战告捷',
        description: '击败第一个敌人',
        category: 'COMBAT',
        reward: { gold: 50 },
        condition: (game) => game.stats.enemiesKilled >= 1
    },
    warrior_10: {
        id: 'warrior_10',
        name: '战士之路',
        description: '击败10个敌人',
        category: 'COMBAT',
        reward: { gold: 100 },
        condition: (game) => game.stats.enemiesKilled >= 10
    },
    warrior_50: {
        id: 'warrior_50',
        name: '战斗老手',
        description: '击败50个敌人',
        category: 'COMBAT',
        reward: { gold: 500 },
        condition: (game) => game.stats.enemiesKilled >= 50
    },
    warrior_100: {
        id: 'warrior_100',
        name: '百战百胜',
        description: '击败100个敌人',
        category: 'COMBAT',
        reward: { gold: 1000, item: { id: 'warrior_badge' } },
        condition: (game) => game.stats.enemiesKilled >= 100
    },
    warrior_500: {
        id: 'warrior_500',
        name: '战神降世',
        description: '击败500个敌人',
        category: 'COMBAT',
        reward: { gold: 5000, item: { id: 'legendary_weapon' } },
        condition: (game) => game.stats.enemiesKilled >= 500
    },
    
    // 首领击杀成就
    first_boss: {
        id: 'first_boss',
        name: '征服者',
        description: '击败第一个首领',
        category: 'COMBAT',
        reward: { gold: 200 },
        condition: (game) => game.stats.bossesKilled >= 1
    },
    boss_hunter: {
        id: 'boss_hunter',
        name: '首领猎人',
        description: '击败所有首领',
        category: 'COMBAT',
        reward: { gold: 10000, item: { id: 'boss_slayer_ trophy' } },
        condition: (game) => game.stats.bossesKilled >= 5
    },
    
    // 无伤成就
    flawless_combat: {
        id: 'flawless_combat',
        name: '完美战斗',
        description: '不受伤击败一个敌人',
        category: 'COMBAT',
        reward: { gold: 100 },
        condition: (game) => game.stats.flawlessKills >= 1
    },
    untouchable: {
        id: 'untouchable',
        name: '不可触碰',
        description: '连续10次无伤击杀',
        category: 'COMBAT',
        reward: { gold: 500, item: { id: 'agility_boots' } },
        condition: (game) => game.stats.flawlessKills >= 10
    },
    
    // 探索成就
    first_steps: {
        id: 'first_steps',
        name: '第一步',
        description: '进入第一层地下城',
        category: 'EXPLORATION',
        reward: { gold: 10 },
        condition: (game) => game.currentFloor >= 1
    },
    dungeon_crawler: {
        id: 'dungeon_crawler',
        name: '地牢探险者',
        description: '探索10层地下城',
        category: 'EXPLORATION',
        reward: { gold: 200 },
        condition: (game) => game.stats.floorsExplored >= 10
    },
    deep_diver: {
        id: 'deep_diver',
        name: '深渊潜行者',
        description: '探索25层地下城',
        category: 'EXPLORATION',
        reward: { gold: 500 },
        condition: (game) => game.stats.floorsExplored >= 25
    },
    world_explorer: {
        id: 'world_explorer',
        name: '世界探索者',
        description: '探索全部50层地下城',
        category: 'EXPLORATION',
        reward: { gold: 5000, item: { id: 'explorer_compass' } },
        condition: (game) => game.stats.floorsExplored >= 50
    },
    
    // 生物群系成就
    forest_master: {
        id: 'forest_master',
        name: '森林之主',
        description: '通关森林地区(1-10层)',
        category: 'EXPLORATION',
        reward: { gold: 500 },
        condition: (game) => game.currentBiome !== 'forest' || game.currentFloor > 10
    },
    desert_master: {
        id: 'desert_master',
        name: '沙漠之主',
        description: '通关沙漠地区(11-20层)',
        category: 'EXPLORATION',
        reward: { gold: 800 },
        condition: (game) => game.stats.biomesCompleted?.includes('desert')
    },
    ice_master: {
        id: 'ice_master',
        name: '冰霜之主',
        description: '通关冰霜地区(21-30层)',
        category: 'EXPLORATION',
        reward: { gold: 1000 },
        condition: (game) => game.stats.biomesCompleted?.includes('ice')
    },
    fire_master: {
        id: 'fire_master',
        name: '火焰之主',
        description: '通关火焰地区(31-40层)',
        category: 'EXPLORATION',
        reward: { gold: 1500 },
        condition: (game) => game.stats.biomesCompleted?.includes('fire')
    },
    void_master: {
        id: 'void_master',
        name: '虚空之主',
        description: '通关虚空地区(41-50层)',
        category: 'EXPLORATION',
        reward: { gold: 2000, item: { id: 'void_key' } },
        condition: (game) => game.stats.biomesCompleted?.includes('void')
    },
    
    // 收集成就
    item_collector_10: {
        id: 'item_collector_10',
        name: '收藏家',
        description: '收集10种不同物品',
        category: 'COLLECTION',
        reward: { gold: 100 },
        condition: (game) => game.stats.uniqueItemsCollected >= 10
    },
    item_collector_50: {
        id: 'item_collector_50',
        name: '大收藏家',
        description: '收集50种不同物品',
        category: 'COLLECTION',
        reward: { gold: 500 },
        condition: (game) => game.stats.uniqueItemsCollected >= 50
    },
    item_collector_100: {
        id: 'item_collector_100',
        name: '传奇收藏家',
        description: '收集100种不同物品',
        category: 'COLLECTION',
        reward: { gold: 2000, item: { id: 'collector_chest' } },
        condition: (game) => game.stats.uniqueItemsCollected >= 100
    },
    
    // 技能成就
    skill_learner: {
        id: 'skill_learner',
        name: '技能学习者',
        description: '学会第一个技能',
        category: 'SKILL',
        reward: { gold: 50 },
        condition: (game) => game.stats.skillsLearned >= 1
    },
    skill_master_5: {
        id: 'skill_master_5',
        name: '技能大师',
        description: '学会5个技能',
        category: 'SKILL',
        reward: { gold: 200 },
        condition: (game) => game.stats.skillsLearned >= 5
    },
    skill_master_10: {
        id: 'skill_master_10',
        name: '技能宗师',
        description: '学会10个技能',
        category: 'SKILL',
        reward: { gold: 1000 },
        condition: (game) => game.stats.skillsLearned >= 10
    },
    
    // 经济成就
    wealthy_1000: {
        id: 'wealthy_1000',
        name: '小有积蓄',
        description: '累计获得1000金币',
        category: 'ECONOMY',
        reward: { gold: 100 },
        condition: (game) => game.stats.totalGoldEarned >= 1000
    },
    wealthy_10000: {
        id: 'wealthy_10000',
        name: '富甲一方',
        description: '累计获得10000金币',
        category: 'ECONOMY',
        reward: { gold: 500 },
        condition: (game) => game.stats.totalGoldEarned >= 10000
    },
    wealthy_100000: {
        id: 'wealthy_100000',
        name: '金币之王',
        description: '累计获得100000金币',
        category: 'ECONOMY',
        reward: { gold: 5000, item: { id: 'golden_statue' } },
        condition: (game) => game.stats.totalGoldEarned >= 100000
    },
    
    // 任务成就
    quester_5: {
        id: 'quester_5',
        name: '任务达人',
        description: '完成5个任务',
        category: 'SPECIAL',
        reward: { gold: 200 },
        condition: (game) => game.stats.questsCompleted >= 5
    },
    quester_20: {
        id: 'quester_20',
        name: '任务大师',
        description: '完成20个任务',
        category: 'SPECIAL',
        reward: { gold: 800 },
        condition: (game) => game.stats.questsCompleted >= 20
    },
    quester_all: {
        id: 'quester_all',
        name: '任务传奇',
        description: '完成所有任务',
        category: 'SPECIAL',
        reward: { gold: 5000, item: { id: 'quest_master_badge' } },
        condition: (game) => game.stats.questsCompleted >= 50
    },
    
    // 特殊成就
    combo_10: {
        id: 'combo_10',
        name: '连击达人',
        description: '达成10连击',
        category: 'SPECIAL',
        reward: { gold: 100 },
        condition: (game) => game.stats.maxCombo >= 10
    },
    combo_50: {
        id: 'combo_50',
        name: '连击狂魔',
        description: '达成50连击',
        category: 'SPECIAL',
        reward: { gold: 500 },
        condition: (game) => game.stats.maxCombo >= 50
    },
    combo_100: {
        id: 'combo_100',
        name: '连击神话',
        description: '达成100连击',
        category: 'SPECIAL',
        reward: { gold: 2000, item: { id: 'combo_master_ring' } },
        condition: (game) => game.stats.maxCombo >= 100
    },
    
    // 升级成就
    level_10: {
        id: 'level_10',
        name: '初露头角',
        description: '达到10级',
        category: 'SPECIAL',
        reward: { gold: 100 },
        condition: (game) => game.player?.level >= 10
    },
    level_30: {
        id: 'level_30',
        name: '资深冒险者',
        description: '达到30级',
        category: 'SPECIAL',
        reward: { gold: 500 },
        condition: (game) => game.player?.level >= 30
    },
    level_50: {
        id: 'level_50',
        name: '传奇英雄',
        description: '达到50级',
        category: 'SPECIAL',
        reward: { gold: 2000 },
        condition: (game) => game.player?.level >= 50
    },
    level_99: {
        id: 'level_99',
        name: '登峰造极',
        description: '达到99级',
        category: 'SPECIAL',
        reward: { gold: 10000, item: { id: 'max_level_trophy' } },
        condition: (game) => game.player?.level >= 99
    },
    
    // 通关成就
    clear_forest: {
        id: 'clear_forest',
        name: '森林克星',
        description: '击败森林首领',
        category: 'SPECIAL',
        reward: { gold: 300 },
        condition: (game) => game.stats.bossesKilled >= 1
    },
    clear_desert: {
        id: 'clear_desert',
        name: '沙漠征服者',
        description: '击败沙漠首领',
        category: 'SPECIAL',
        reward: { gold: 500 },
        condition: (game) => game.stats.bossesKilled >= 2
    },
    clear_ice: {
        id: 'clear_ice',
        name: '冰霜终结者',
        description: '击败冰霜首领',
        category: 'SPECIAL',
        reward: { gold: 800 },
        condition: (game) => game.stats.bossesKilled >= 3
    },
    clear_fire: {
        id: 'clear_fire',
        name: '火焰驱逐者',
        description: '击败火焰首领',
        category: 'SPECIAL',
        reward: { gold: 1000 },
        condition: (game) => game.stats.bossesKilled >= 4
    },
    clear_void: {
        id: 'clear_void',
        name: '虚空杀手',
        description: '击败虚空首领',
        category: 'SPECIAL',
        reward: { gold: 2000 },
        condition: (game) => game.stats.bossesKilled >= 5
    },
    
    // 终极成就
    champion: {
        id: 'champion',
        name: '符文之地冠军',
        description: '通关符文之地',
        category: 'SPECIAL',
        reward: { gold: 50000, item: { id: 'champion_crown' } },
        condition: (game) => game.state === 'VICTORY'
    }
};

export { ACHIEVEMENT_DATABASE };
