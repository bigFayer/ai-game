/**
 * 符文之地 - 游戏常量与配置
 */

// ==================== 版本信息 ====================
const GAME_VERSION = '1.0.0';
const GAME_BUILD = '20260428';
const GAME_NAME = '符文之地';
const GAME_SUBTITLE = 'Roguelike ARPG';

// ==================== 游戏配置 ====================
const GAME_CONFIG = {
    // Canvas
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    TARGET_FPS: 60,
    FIXED_TIMESTEP: 1 / 60,
    
    // 游戏难度
    DIFFICULTY: {
        EASY: 0.8,
        NORMAL: 1.0,
        HARD: 1.3,
        NIGHTMARE: 1.6,
        HELL: 2.0
    },
    
    // 地图设置
    MAP: {
        TILE_SIZE: 40,
        WIDTH: 20,
        HEIGHT: 15,
        MIN_ROOMS: 5,
        MAX_ROOMS: 10
    },
    
    // 玩家设置
    PLAYER: {
        BASE_HP: 100,
        BASE_MP: 50,
        BASE_ATK: 10,
        BASE_DEF: 5,
        BASE_SPD: 10,
        BASE_LUK: 5,
        BASE_CRIT_RATE: 5,
        BASE_CRIT_DAMAGE: 150,
        BASE_EVASION: 5,
        
        HP_REGEN: 1, // 每秒回复
        MP_REGEN: 0.5,
        
        MAX_LEVEL: 99,
        EXP_CURVE: [0, 100, 200, 350, 550, 800, 1100, 1500, 2000, 2600, 3300, 4100, 5000, 6000, 7100, 8300, 9600, 11000, 12500, 14100, 15800, 17600, 19500, 21500, 23600, 25800, 28100, 30500, 33000, 35600, 38300, 41100, 44000, 47000, 50100, 53300, 56600, 60000, 63500, 67100, 70800, 74600, 78500, 82500, 86600, 90800, 95100, 99500, 104000],
        
        MAX_SKILL_SLOTS: 4,
        MAX_LEARNED_SKILLS: 20,
        INVENTORY_SIZE: 50,
        EQUIP_SLOTS: 7
    },
    
    // 战斗设置
    COMBAT: {
        ATTACK_SPEED: 1.0, // 秒每次攻击
        SKILL_SPEED_MULT: 1.5,
        
        DODGE_BASE_CHANCE: 5,
        CRIT_BASE_CHANCE: 5,
        CRIT_BASE_DAMAGE: 150,
        
        DAMAGE_REDUCTION_CAP: 0.75,
        DODGE_CAP: 75,
        CRIT_CAP: 75,
        
        COMBO_WINDOW: 3, // 秒
        COMBO_DAMAGE_BONUS: 0.1, // 每combo +10%
        MAX_COMBO: 10
    },
    
    // 地下城设置
    DUNGEON: {
        TOTAL_FLOORS: 50,
        
        BIOME_FLOORS: {
            forest: [1, 10],
            desert: [11, 20],
            ice: [21, 30],
            fire: [31, 40],
            void: [41, 50]
        },
        
        BOSS_FLOORS: [10, 20, 30, 40, 50],
        
        ENEMY_SPAWN_RATE: 0.3, // 每步几率
        CHEST_SPAWN_RATE: 0.15,
        SHOP_SPAWN_RATE: 0.1,
        TRAP_SPAWN_RATE: 0.2,
        
        ENEMY_SCALING: 0.1, // 每层+10%
        GOLD_SCALING: 0.08,
        DROP_RATE_SCALING: 0.02
    },
    
    // 物品设置
    ITEM: {
        DROP_RATE: {
            COMMON: 0.70,
            UNCOMMON: 0.20,
            RARE: 0.07,
            EPIC: 0.02,
            LEGENDARY: 0.008,
            MYTHIC: 0.002
        },
        
        DROP_RATE_BOSS: {
            COMMON: 0.40,
            UNCOMMON: 0.30,
            RARE: 0.20,
            EPIC: 0.07,
            LEGENDARY: 0.025,
            MYTHIC: 0.005
        },
        
        ENEMY_DROP_CHANCE: 0.3,
        BOSS_GUARANTEE_DROP: 2, // 至少掉落2件
        
        PRICE_MULTIPLIER: {
            SELL: 0.3,
            BUY: 1.0,
            SHOP_BUY: 1.2
        }
    },
    
    // 技能设置
    SKILL: {
        MAX_SKILL_LEVEL: 5,
        SKILL_UPGRADE_COST: [0, 100, 250, 500, 1000],
        SKILL_UNLEARN_COST: 0.5 // 50%返还
    },
    
    // 锻造设置
    CRAFTING: {
        SUCCESS_RATE: {
            BASIC: 1.0,
            ADVANCED: 0.9,
            EXPERT: 0.8,
            MASTER: 0.7
        },
        
        BREAK_CHANCE: {
            BASIC: 0,
            ADVANCED: 0.05,
            EXPERT: 0.10,
            MASTER: 0.15
        }
    },
    
    // 存档设置
    SAVE: {
        AUTO_SAVE_INTERVAL: 300, // 秒
        MAX_SAVE_SLOTS: 3,
        AUTO_SAVE_ENABLED: true
    },
    
    // UI设置
    UI: {
        NOTIFICATION_DURATION: 3000,
        MAX_NOTIFICATIONS: 5,
        TOOLTIP_DELAY: 500,
        HOVER_SCALE: 1.05
    }
};

// ==================== 元素类型 ====================
const ElementType = {
    PHYSICAL: 'physical',
    FIRE: 'fire',
    ICE: 'ice',
    LIGHTNING: 'lightning',
    HOLY: 'holy',
    VOID: 'void',
    POISON: 'poison',
    
    // 克制关系
    WEAKNESS: {
        fire: 'ice',
        ice: 'fire',
        lightning: 'void',
        void: 'holy',
        holy: 'void',
        poison: 'holy'
    },
    
    // 抗性
    RESISTANCE: {
        physical: { physical: 0.5 },
        fire: { fire: 0.5, ice: 1.5 },
        ice: { ice: 0.5, fire: 1.5 },
        lightning: { lightning: 0.5 },
        holy: { holy: 0.5, void: 0.5 },
        void: { void: 0.5, holy: 1.5 },
        poison: { poison: 0.5, holy: 1.5 }
    }
};

// ==================== 职业配置 ====================
const CharacterClassConfig = {
    warrior: {
        id: 'warrior',
        name: '战士',
        description: '高攻物理，厚血量',
        stats: {
            hp: 150, mp: 30, atk: 25, def: 15, spd: 8, luk: 5,
            hpGrowth: 20, mpGrowth: 5, atkGrowth: 5, defGrowth: 3, spdGrowth: 1, lukGrowth: 1
        },
        skills: ['slash', 'power_slash', 'shield_bash', 'battle_cry', 'whirlwind'],
        startingItems: [
            { id: 'iron_sword', name: '铁剑' },
            { id: 'leather_armor', name: '皮甲' },
            { id: 'health_potion', name: '生命药水', quantity: 3 }
        ],
        color: '#ff6b6b',
        strength: ['高血量', '高防御', '易上手'],
        weakness: ['MP较少', '技能MP消耗高']
    },
    mage: {
        id: 'mage',
        name: '法师',
        description: '元素魔法，高爆发',
        stats: {
            hp: 80, mp: 100, atk: 10, def: 6, spd: 10, luk: 8,
            hpGrowth: 10, mpGrowth: 15, atkGrowth: 2, defGrowth: 1, spdGrowth: 2, lukGrowth: 2
        },
        skills: ['fireball', 'ice_shard', 'lightning', 'frost_nova', 'arcane_surge'],
        startingItems: [
            { id: 'wooden_staff', name: '木杖' },
            { id: 'mage_robe', name: '法师长袍' },
            { id: 'mana_potion', name: '魔法药水', quantity: 5 }
        ],
        color: '#6b9fff',
        strength: ['高MP', '元素伤害', '范围攻击'],
        weakness: ['血量低', '防御弱']
    },
    ranger: {
        id: 'ranger',
        name: '游侠',
        description: '敏捷暴击，高闪避',
        stats: {
            hp: 100, mp: 50, atk: 18, def: 10, spd: 18, luk: 15,
            hpGrowth: 12, mpGrowth: 8, atkGrowth: 4, defGrowth: 2, spdGrowth: 3, lukGrowth: 3
        },
        skills: ['quick_shot', 'multi_shot', 'trap', 'evasion', 'assassinate'],
        startingItems: [
            { id: 'short_bow', name: '短弓' },
            { id: 'leather_armor', name: '皮甲' },
            { id: 'health_potion', name: '生命药水', quantity: 3 }
        ],
        color: '#6bff6b',
        strength: ['高速度', '高闪避', '暴击高'],
        weakness: ['血量中等', '防御中等']
    },
    cleric: {
        id: 'cleric',
        name: '圣职',
        description: '治疗辅助，平衡',
        stats: {
            hp: 110, mp: 70, atk: 12, def: 12, spd: 9, luk: 10,
            hpGrowth: 15, mpGrowth: 12, atkGrowth: 3, defGrowth: 3, spdGrowth: 2, lukGrowth: 2
        },
        skills: ['heal', 'holy_bolt', 'bless', 'smite', 'divine_shield'],
        startingItems: [
            { id: 'mace', name: '钉锤' },
            { id: 'chainmail', name: '锁甲' },
            { id: 'health_potion', name: '生命药水', quantity: 5 },
            { id: 'mana_potion', name: '魔法药水', quantity: 3 }
        ],
        color: '#ffd700',
        strength: ['可治疗', '平衡', '圣属性'],
        weakness: ['输出中等', '依赖技能']
    }
};

// ==================== 稀有度配置 ====================
const RarityConfig = {
    COMMON: {
        name: '普通',
        color: '#888888',
        multiplier: 1.0,
        borderColor: '#888888',
        glowColor: null
    },
    UNCOMMON: {
        name: '优秀',
        color: '#00ff00',
        multiplier: 1.3,
        borderColor: '#00ff00',
        glowColor: null
    },
    RARE: {
        name: '稀有',
        color: '#0088ff',
        multiplier: 1.6,
        borderColor: '#0088ff',
        glowColor: 'rgba(0, 136, 255, 0.3)'
    },
    EPIC: {
        name: '史诗',
        color: '#aa00ff',
        multiplier: 2.0,
        borderColor: '#aa00ff',
        glowColor: 'rgba(170, 0, 255, 0.3)'
    },
    LEGENDARY: {
        name: '传说',
        color: '#ff8800',
        multiplier: 2.5,
        borderColor: '#ff8800',
        glowColor: 'rgba(255, 136, 0, 0.4)'
    },
    MYTHIC: {
        name: '神话',
        color: '#ffd700',
        multiplier: 3.0,
        borderColor: '#ffd700',
        glowColor: 'rgba(255, 215, 0, 0.5)'
    }
};

// ==================== 装备槽位 ====================
const EquipSlot = {
    WEAPON: { id: 'weapon', name: '武器', icon: '⚔' },
    ARMOR: { id: 'armor', name: '护甲', icon: '🛡' },
    HELMET: { id: 'helmet', name: '头盔', icon: '⛑' },
    GLOVES: { id: 'gloves', name: '手套', icon: '🧤' },
    BOOTS: { id: 'boots', name: '靴子', icon: '👢' },
    ACCESSORY1: { id: 'accessory1', name: '饰品1', icon: '💍' },
    ACCESSORY2: { id: 'accessory2', name: '饰品2', icon: '📿' }
};

// ==================== 物品类型 ====================
const ItemType = {
    WEAPON: { id: 'weapon', name: '武器', slot: 'weapon' },
    ARMOR: { id: 'armor', name: '护甲', slot: 'armor' },
    HELMET: { id: 'helmet', name: '头盔', slot: 'helmet' },
    GLOVES: { id: 'gloves', name: '手套', slot: 'gloves' },
    BOOTS: { id: 'boots', name: '靴子', slot: 'boots' },
    ACCESSORY: { id: 'accessory', name: '饰品', slot: 'accessory' },
    CONSUMABLE: { id: 'consumable', name: '消耗品' },
    SCROLL: { id: 'scroll', name: '卷轴' },
    MATERIAL: { id: 'material', name: '材料' },
    QUEST: { id: 'quest', name: '任务物品' }
};

// ==================== 敌人类型 ====================
const EnemyType = {
    NORMAL: { name: '普通', expMultiplier: 1.0, goldMultiplier: 1.0 },
    ELITE: { name: '精英', expMultiplier: 3.0, goldMultiplier: 2.5, isElite: true },
    BOSS: { name: '首领', expMultiplier: 10.0, goldMultiplier: 5.0, isBoss: true }
};

// ==================== 天气系统 ====================
const WeatherType = {
    CLEAR: { name: '晴朗', particle: null, effect: {} },
    RAIN: { name: '下雨', particle: 'rain', effect: { spd: -0.1 } },
    SNOW: { name: '下雪', particle: 'snow', effect: { spd: -0.2 } },
    FOG: { name: '大雾', particle: 'fog', effect: { sight: -1 } },
    STORM: { name: '暴风雨', particle: 'storm', effect: { spd: -0.2, atk: -0.1 } }
};

// ==================== 音效配置 ====================
const AudioConfig = {
    masterVolume: 1.0,
    musicVolume: 0.5,
    sfxVolume: 0.7,
    
    sounds: {
        attack: { volume: 0.5, pitch: [0.9, 1.1] },
        hit: { volume: 0.4, pitch: [0.8, 1.2] },
        critical: { volume: 0.6, pitch: [1.0, 1.2] },
        death: { volume: 0.5, pitch: [0.9, 1.1] },
        levelup: { volume: 0.7, pitch: [1.0, 1.0] },
        item: { volume: 0.4, pitch: [0.9, 1.1] },
        gold: { volume: 0.3, pitch: [1.0, 1.2] },
        skill: { volume: 0.6, pitch: [0.9, 1.1] },
        buy: { volume: 0.4, pitch: [1.0, 1.0] },
        sell: { volume: 0.4, pitch: [0.8, 1.0] },
        open: { volume: 0.5, pitch: [1.0, 1.0] },
        footsteps: { volume: 0.2, pitch: [0.9, 1.1] }
    },
    
    music: {
        title: { loop: true, fadeIn: 2 },
        forest: { loop: true, fadeIn: 3 },
        desert: { loop: true, fadeIn: 3 },
        ice: { loop: true, fadeIn: 3 },
        fire: { loop: true, fadeIn: 3 },
        void: { loop: true, fadeIn: 3 },
        combat: { loop: true, fadeIn: 1 },
        boss: { loop: true, fadeIn: 1 },
        victory: { loop: false, fadeIn: 0 },
        gameover: { loop: false, fadeIn: 0 }
    }
};

// ==================== 成就分类 ====================
const AchievementCategory = {
    COMBAT: { name: '战斗', icon: '⚔', color: '#ff4444' },
    EXPLORATION: { name: '探索', icon: '🗺', color: '#44ff44' },
    COLLECTION: { name: '收集', icon: '💎', color: '#4444ff' },
    SKILL: { name: '技能', icon: '✨', color: '#ff44ff' },
    ECONOMY: { name: '经济', icon: '💰', color: '#ffaa00' },
    SPECIAL: { name: '特殊', icon: '🏆', color: '#ffd700' }
};

export { GAME_VERSION, GAME_BUILD, GAME_NAME, GAME_SUBTITLE, GAME_CONFIG, ElementType, CharacterClassConfig, RarityConfig, EquipSlot, ItemType, EnemyType, WeatherType, AudioConfig, AchievementCategory };
