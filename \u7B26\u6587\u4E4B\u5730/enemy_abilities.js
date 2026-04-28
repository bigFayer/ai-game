/**
 * 符文之地 - 敌人技能库
 */

const ENEMY_ABILITIES = {
    // 通用技能
    strike: {
        name: '打击',
        type: 'melee',
        damage: 1.0,
        mpCost: 0,
        cooldown: 0,
        description: '基础物理攻击'
    },
    bite: {
        name: '撕咬',
        type: 'melee',
        damage: 1.2,
        mpCost: 0,
        cooldown: 2,
        description: '造成120%伤害'
    },
    shoot: {
        name: '射击',
        type: 'ranged',
        damage: 0.9,
        mpCost: 5,
        cooldown: 2,
        description: '远程物理攻击'
    },
    guard: {
        name: '防御',
        type: 'defensive',
        damage: 0,
        effect: { def: 1.5 },
        duration: 2,
        mpCost: 0,
        cooldown: 3,
        description: '防御力+50%'
    },
    heal: {
        name: '治疗',
        type: 'heal',
        healing: 0.3,
        mpCost: 10,
        cooldown: 5,
        description: '恢复30%最大HP'
    },
    
    // 森林技能
    poison_bite: {
        name: '毒咬',
        type: 'melee',
        damage: 1.0,
        effect: { dot: { type: 'poison', damage: 5, duration: 3 } },
        mpCost: 0,
        cooldown: 3,
        description: '造成伤害并附加中毒'
    },
    web_shot: {
        name: '吐网',
        type: 'ranged',
        damage: 0.5,
        effect: { debuff: { type: 'slow', duration: 2 } },
        mpCost: 5,
        cooldown: 4,
        description: '造成50%伤害并减速'
    },
    summon_spiders: {
        name: '召唤蜘蛛',
        type: 'summon',
        summon: 'forest_goblin_1',
        count: 2,
        mpCost: 20,
        cooldown: 8,
        description: '召唤2只哥布林'
    },
    howl: {
        name: '嚎叫',
        type: 'buff',
        effect: { partyBuff: { atk: 1.3 } },
        duration: 3,
        mpCost: 0,
        cooldown: 5,
        description: '攻击力+30%'
    },
    maul: {
        name: '撕裂',
        type: 'melee',
        damage: 1.5,
        effect: { dot: { type: 'bleed', damage: 3, duration: 3 } },
        mpCost: 0,
        cooldown: 4,
        description: '造成150%伤害并流血'
    },
    magic_arrow: {
        name: '魔法箭',
        type: 'ranged',
        damage: 1.2,
        element: 'void',
        mpCost: 8,
        cooldown: 3,
        description: '远程魔法攻击'
    },
    phase: {
        name: '相位移动',
        type: 'defensive',
        damage: 0,
        effect: { evasion: 100 },
        duration: 1,
        mpCost: 10,
        cooldown: 5,
        description: '闪避所有攻击1回合'
    },
    strike: {
        name: '攻击',
        type: 'melee',
        damage: 1.0,
        mpCost: 0,
        cooldown: 0,
        description: '普通攻击'
    },
    shield_bash: {
        name: '盾击',
        type: 'melee',
        damage: 0.8,
        effect: { stun: { chance: 0.3, duration: 1 } },
        mpCost: 0,
        cooldown: 3,
        description: '80%伤害，30%眩晕'
    },
    
    // 沙漠技能
    sting: {
        name: '毒刺',
        type: 'melee',
        damage: 1.3,
        effect: { dot: { type: 'poison', damage: 8, duration: 2 } },
        mpCost: 0,
        cooldown: 3,
        description: '造成130%伤害并中毒'
    },
    poison_cloud: {
        name: '毒云',
        type: 'aoe',
        damage: 0.6,
        effect: { dot: { type: 'poison', damage: 5, duration: 3 } },
        mpCost: 15,
        cooldown: 5,
        description: 'AOE并附加中毒'
    },
    curse: {
        name: '诅咒',
        type: 'debuff',
        effect: { debuff: { type: 'curse', duration: 3 } },
        mpCost: 10,
        cooldown: 4,
        description: '使目标治疗效果减半'
    },
    burrow: {
        name: '钻地',
        type: 'movement',
        damage: 1.0,
        effect: { position: 'behind' },
        mpCost: 5,
        cooldown: 4,
        description: '从背后攻击'
    },
    sandstorm: {
        name: '沙尘暴',
        type: 'aoe',
        damage: 0.8,
        effect: { debuff: { type: 'blind', duration: 2 } },
        mpCost: 20,
        cooldown: 6,
        description: 'AOE并致盲'
    },
    engulf: {
        name: '吞噬',
        type: 'melee',
        damage: 2.0,
        effect: { heal: 0.3 },
        mpCost: 15,
        cooldown: 8,
        description: '造成200%伤害并治疗自身'
    },
    spit_poison: {
        name: '喷毒',
        type: 'ranged',
        damage: 0.9,
        effect: { dot: { type: 'poison', damage: 10, duration: 3 } },
        mpCost: 8,
        cooldown: 4,
        description: '远程喷吐毒素'
    },
    swarm_attack: {
        name: '群体攻击',
        type: 'multi',
        damage: 0.5,
        hits: 3,
        mpCost: 0,
        cooldown: 2,
        description: '快速攻击3次'
    },
    
    // 冰霜技能
    freeze_touch: {
        name: '冰冻之触',
        type: 'melee',
        damage: 1.0,
        effect: { freeze: { chance: 0.3, duration: 1 } },
        mpCost: 5,
        cooldown: 3,
        description: '造成伤害并可能冻结'
    },
    ice_bolt: {
        name: '冰箭',
        type: 'ranged',
        damage: 1.3,
        element: 'ice',
        mpCost: 10,
        cooldown: 3,
        description: '冰属性远程攻击'
    },
    frost_nova: {
        name: '冰霜新星',
        type: 'aoe',
        damage: 1.0,
        element: 'ice',
        effect: { freeze: { chance: 0.2, duration: 1 } },
        mpCost: 25,
        cooldown: 6,
        description: 'AOE并可能冻结'
    },
    ice_shield: {
        name: '冰盾',
        type: 'defensive',
        effect: { shield: 0.3 },
        duration: 3,
        mpCost: 15,
        cooldown: 5,
        description: '获得30%HP护盾'
    },
    chilling_aura: {
        name: '冰霜光环',
        type: 'passive',
        effect: { aura: { damage: 5, chance: 0.2 } },
        mpCost: 0,
        cooldown: 0,
        description: '攻击时反射伤害'
    },
    ground_slam: {
        name: '大地重击',
        type: 'aoe',
        damage: 1.5,
        effect: { stun: { chance: 0.4, duration: 1 } },
        mpCost: 15,
        cooldown: 5,
        description: 'AOE并可能眩晕'
    },
    freeze_aura: {
        name: '冰冻光环',
        type: 'aura',
        damage: 0.3,
        effect: { freeze: { chance: 0.15, duration: 1 } },
        duration: -1,
        mpCost: 0,
        cooldown: 0,
        description: '被动冻结周围敌人'
    },
    frost_breath: {
        name: '霜冻吐息',
        type: 'special',
        damage: 2.0,
        element: 'ice',
        effect: { freeze: { chance: 0.5, duration: 2 } },
        mpCost: 30,
        cooldown: 8,
        description: '强力冰属性攻击'
    },
    wing_attack: {
        name: '翼击',
        type: 'aoe',
        damage: 1.2,
        mpCost: 10,
        cooldown: 4,
        description: 'AOE攻击'
    },
    fly: {
        name: '飞行',
        type: 'movement',
        effect: { evasion: 50, buff: { atk: 1.2 } },
        duration: 3,
        mpCost: 20,
        cooldown: 6,
        description: '闪避提升并攻击力增加'
    },
    tail_sweep: {
        name: '横扫',
        type: 'aoe',
        damage: 1.3,
        mpCost: 15,
        cooldown: 5,
        description: '尾部AOE攻击'
    },
    
    // 火焰技能
    fireball: {
        name: '火球术',
        type: 'ranged',
        damage: 1.4,
        element: 'fire',
        mpCost: 12,
        cooldown: 3,
        description: '火属性远程攻击'
    },
    ember_shower: {
        name: '余烬雨',
        type: 'aoe',
        damage: 0.8,
        element: 'fire',
        effect: { dot: { type: 'burn', damage: 5, duration: 2 } },
        mpCost: 18,
        cooldown: 5,
        description: 'AOE并灼烧'
    },
    flame_whip: {
        name: '火焰长鞭',
        type: 'melee',
        damage: 1.6,
        element: 'fire',
        mpCost: 15,
        cooldown: 4,
        description: '高伤害火属性攻击'
    },
    fire_breath: {
        name: '火焰吐息',
        type: 'special',
        damage: 2.2,
        element: 'fire',
        mpCost: 35,
        cooldown: 8,
        description: '强力火属性攻击'
    },
    flame_wall: {
        name: '火墙',
        type: 'defensive',
        effect: { damageReflect: 0.3 },
        duration: 3,
        mpCost: 20,
        cooldown: 6,
        description: '反弹30%伤害'
    },
    fire_shield: {
        name: '火焰护盾',
        type: 'defensive',
        effect: { shield: 0.25, damageReflect: 0.5 },
        duration: 4,
        mpCost: 25,
        cooldown: 7,
        description: '护盾+反弹伤害'
    },
    claw_attack: {
        name: '爪击',
        type: 'melee',
        damage: 1.3,
        hits: 2,
        mpCost: 10,
        cooldown: 3,
        description: '连续攻击2次'
    },
    hellfire: {
        name: '地狱火',
        type: 'aoe',
        damage: 1.8,
        element: 'fire',
        effect: { dot: { type: 'burn', damage: 10, duration: 3 } },
        mpCost: 30,
        cooldown: 7,
        description: '高伤害AOE'
    },
    demon_strike: {
        name: '恶魔打击',
        type: 'melee',
        damage: 1.8,
        element: 'fire',
        mpCost: 20,
        cooldown: 4,
        description: '强力单体攻击'
    },
    flame_summon: {
        name: '召唤火焰',
        type: 'summon',
        summon: 'fire_imp_1',
        count: 2,
        mpCost: 25,
        cooldown: 8,
        description: '召唤2只火焰小鬼'
    },
    meteor_strike: {
        name: '陨石',
        type: 'special',
        damage: 2.5,
        element: 'fire',
        mpCost: 50,
        cooldown: 10,
        description: '超大范围陨石攻击'
    },
    inferno: {
        name: '炼狱',
        type: 'special',
        damage: 3.0,
        element: 'fire',
        effect: { dot: { type: 'burn', damage: 15, duration: 5 } },
        mpCost: 60,
        cooldown: 12,
        description: '终极火焰技能'
    },
    berserker: {
        name: '狂暴',
        type: 'buff',
        effect: { buff: { atk: 1.5, def: 0.5 } },
        duration: 5,
        mpCost: 0,
        cooldown: 10,
        description: '攻击力+50%，防御-50%'
    },
    enrage: {
        name: '激怒',
        type: 'buff',
        effect: { buff: { atk: 1.3, spd: 1.2 } },
        duration: 5,
        mpCost: 0,
        cooldown: 15,
        description: '激怒时自动触发'
    },
    
    // 虚空技能
    void_strike: {
        name: '虚空打击',
        type: 'melee',
        damage: 1.5,
        element: 'void',
        mpCost: 15,
        cooldown: 3,
        description: '虚空属性攻击'
    },
    dimension_rift: {
        name: '维度裂隙',
        type: 'teleport',
        damage: 1.0,
        effect: { position: 'back', debuff: { type: 'weak', duration: 2 } },
        mpCost: 20,
        cooldown: 5,
        description: '传送到背后并弱化'
    },
    corruption: {
        name: '腐蚀',
        type: 'debuff',
        effect: { dot: { type: 'void', damage: 10, duration: 5 } },
        mpCost: 15,
        cooldown: 6,
        description: '虚空持续伤害'
    },
    devaour: {
        name: '吞噬',
        type: 'special',
        damage: 2.0,
        effect: { heal: 0.5 },
        mpCost: 25,
        cooldown: 8,
        description: '造成200%伤害并治疗50%'
    },
    void_bolt: {
        name: '虚空弹',
        type: 'ranged',
        damage: 1.6,
        element: 'void',
        mpCost: 15,
        cooldown: 3,
        description: '虚空属性远程攻击'
    },
    soul_drain: {
        name: '灵魂吸取',
        type: 'drain',
        damage: 1.2,
        effect: { heal: 0.4, mpDrain: 20 },
        mpCost: 20,
        cooldown: 5,
        description: '伤害并治疗和吸MP'
    },
    undead_ally: {
        name: '召唤亡灵',
        type: 'summon',
        summon: 'skeleton',
        count: 2,
        mpCost: 25,
        cooldown: 8,
        description: '召唤2只骷髅'
    },
    resurrect: {
        name: '复活',
        type: 'special',
        damage: 0,
        effect: { revive: 0.5 },
        mpCost: 40,
        cooldown: 15,
        description: '复活并恢复50%HP'
    },
    mass_terror: {
        name: '大规模恐惧',
        type: 'aoe',
        damage: 0.5,
        effect: { debuff: { type: 'fear', duration: 3 } },
        mpCost: 30,
        cooldown: 8,
        description: 'AOE并恐惧'
    },
    soul_siphon: {
        name: '灵魂虹吸',
        type: 'drain',
        damage: 0.8,
        effect: { heal: 0.3 },
        mpCost: 15,
        cooldown: 4,
        description: '持续吸取生命'
    },
    soul_harvest: {
        name: '灵魂收割',
        type: 'special',
        damage: 2.5,
        effect: { heal: 1.0, atk: 0.3 },
        mpCost: 50,
        cooldown: 12,
        description: '造成250%伤害并治疗100%，攻击力+30%'
    },
    mass_siphon: {
        name: '大规模虹吸',
        type: 'aoe',
        damage: 1.2,
        effect: { heal: 0.3 },
        mpCost: 35,
        cooldown: 8,
        description: 'AOE吸取生命'
    },
    life_steal: {
        name: '生命偷取',
        type: 'passive',
        effect: { lifesteal: 0.15 },
        mpCost: 0,
        cooldown: 0,
        description: '攻击时偷取15%伤害'
    },
    void_armor: {
        name: '虚空护甲',
        type: 'defensive',
        effect: { buff: { def: 1.5, voidResist: 100 } },
        duration: 5,
        mpCost: 30,
        cooldown: 10,
        description: '防御+50%，虚空抗性+100'
    },
    summon_void: {
        name: '召唤虚空',
        type: 'summon',
        summon: 'void_specter',
        count: 3,
        mpCost: 40,
        cooldown: 12,
        description: '召唤3只虚空幽灵'
    },
    void_annihilation: {
        name: '虚空湮灭',
        type: 'special',
        damage: 3.5,
        element: 'void',
        mpCost: 80,
        cooldown: 15,
        description: '终极虚空攻击'
    },
    ultimate_curse: {
        name: '究极诅咒',
        type: 'debuff',
        effect: { dot: { type: 'void', damage: 20, duration: 10 }, debuff: { type: 'all', duration: 5 } },
        mpCost: 60,
        cooldown: 20,
        description: '全属性降低+持续伤害'
    },
    
    // BOSS特殊技能
    regenerate: {
        name: '再生',
        type: 'passive',
        effect: { regen: 0.05 },
        mpCost: 0,
        cooldown: 0,
        description: '每回合恢复5%HP'
    },
    toss: {
        name: '投掷',
        type: 'special',
        damage: 1.8,
        effect: { knockback: true },
        mpCost: 20,
        cooldown: 6,
        description: '造成180%伤害并击退'
    },
    sandstorm: {
        name: '沙尘暴',
        type: 'aoe',
        damage: 1.0,
        effect: { debuff: { type: 'blind', duration: 2 } },
        mpCost: 25,
        cooldown: 6,
        description: 'AOE并致盲'
    },
    mummy_curse: {
        name: '木乃伊诅咒',
        type: 'debuff',
        effect: { dot: { type: 'void', damage: 15, duration: 5 }, debuff: { type: 'heal', duration: 5 } },
        mpCost: 30,
        cooldown: 8,
        description: '持续伤害+禁止治疗'
    },
    summon_undead: {
        name: '召唤亡灵',
        type: 'summon',
        summon: 'mummy',
        count: 3,
        mpCost: 40,
        cooldown: 10,
        description: '召唤3只木乃伊'
    },
    pharaoh_wrath: {
        name: '法老之怒',
        type: 'special',
        damage: 2.5,
        element: 'holy',
        mpCost: 60,
        cooldown: 12,
        description: '究极神圣攻击'
    },
    activate_sandstorm: {
        name: '激活沙尘暴',
        type: 'enviroment',
        effect: { env: 'sandstorm', duration: 5 },
        mpCost: 30,
        cooldown: 15,
        description: '改变战斗环境'
    },
    ice_prison: {
        name: '冰牢',
        type: 'special',
        damage: 1.5,
        effect: { stun: { duration: 2 } },
        mpCost: 35,
        cooldown: 8,
        description: '造成150%伤害并冻结'
    }
};

export { ENEMY_ABILITIES };
