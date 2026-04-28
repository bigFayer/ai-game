/**
 * 符文之地 - 完整技能数据库
 */

const SKILL_DATABASE = {
    // ========== 战士技能 ==========
    warrior: {
        slash: {
            name: '斩击', description: '基础攻击，造成100%攻击力伤害',
            mpCost: 0, cooldown: 0, targetType: 'enemy',
            damage: { type: 'physical', percent: 1.0 }
        },
        power_slash: {
            name: '强力斩击', description: '造成150%攻击力伤害',
            mpCost: 10, cooldown: 3, targetType: 'enemy',
            damage: { type: 'physical', percent: 1.5 }
        },
        shield_bash: {
            name: '盾击', description: '造成80%伤害，30%几率眩晕1回合',
            mpCost: 5, cooldown: 2, targetType: 'enemy',
            damage: { type: 'physical', percent: 0.8 },
            effect: { stun: { chance: 0.3, duration: 1 } }
        },
        battle_cry: {
            name: '战吼', description: '3回合内攻击力+30%',
            mpCost: 15, cooldown: 5, targetType: 'self',
            buff: { stat: 'atk', percent: 30, duration: 3 }
        },
        whirlwind: {
            name: '旋风斩', description: '对所有敌人造成100%伤害',
            mpCost: 20, cooldown: 4, targetType: 'all_enemy',
            damage: { type: 'physical', percent: 1.0, aoe: true }
        },
        ground_slam: {
            name: '大地猛击', description: '造成180%伤害，40%几率眩晕',
            mpCost: 18, cooldown: 5, targetType: 'enemy',
            damage: { type: 'physical', percent: 1.8 },
            effect: { stun: { chance: 0.4, duration: 1 } }
        },
        charge: {
            name: '冲锋', description: '冲向敌人造成100%伤害并击退',
            mpCost: 12, cooldown: 4, targetType: 'enemy',
            damage: { type: 'physical', percent: 1.0 },
            effect: { knockback: true }
        },
        taunt: {
            name: '嘲讽', description: '强迫所有敌人攻击你2回合',
            mpCost: 15, cooldown: 6, targetType: 'self',
            buff: { taunt: true, duration: 2 }
        }
    },
    
    // ========== 法师技能 ==========
    mage: {
        fireball: {
            name: '火球术', description: '造成80+智力伤害，附带灼烧',
            mpCost: 15, cooldown: 3, targetType: 'enemy',
            element: 'fire',
            damage: { type: 'fire', baseDamage: 80, percent: 0.5 },
            effect: { dot: { type: 'burn', damage: 10, duration: 2 } }
        },
        ice_shard: {
            name: '冰刺术', description: '造成70+智力伤害，30%几率冻结',
            mpCost: 12, cooldown: 2, targetType: 'enemy',
            element: 'ice',
            damage: { type: 'ice', baseDamage: 70, percent: 0.4 },
            effect: { freeze: { chance: 0.3, duration: 1 } }
        },
        lightning: {
            name: '雷电术', description: '造成100+智力伤害，20%几率麻痹',
            mpCost: 18, cooldown: 3, targetType: 'enemy',
            element: 'lightning',
            damage: { type: 'lightning', baseDamage: 100, percent: 0.6 },
            effect: { paralyze: { chance: 0.2, duration: 1 } }
        },
        frost_nova: {
            name: '冰霜新星', description: '对所有敌人造成60+智力伤害，20%冻结',
            mpCost: 25, cooldown: 5, targetType: 'all_enemy',
            element: 'ice',
            damage: { type: 'ice', baseDamage: 60, aoe: true },
            effect: { freeze: { chance: 0.2 } }
        },
        arcane_surge: {
            name: '奥术涌动', description: '3回合内MP消耗-50%，伤害+20%',
            mpCost: 30, cooldown: 6, targetType: 'self',
            buff: { damage: 20, mpCostReduction: 0.5, duration: 3 }
        },
        meteor: {
            name: '陨石术', description: '造成200%魔法伤害',
            mpCost: 35, cooldown: 7, targetType: 'enemy',
            element: 'fire',
            damage: { type: 'fire', percent: 2.0 }
        },
        ice_barrier: {
            name: '冰盾', description: '获得30%HP护盾，持续3回合',
            mpCost: 20, cooldown: 5, targetType: 'self',
            buff: { shield: 0.3, duration: 3 }
        },
        void_blast: {
            name: '虚空冲击', description: '造成150%虚空伤害',
            mpCost: 25, cooldown: 4, targetType: 'enemy',
            element: 'void',
            damage: { type: 'void', percent: 1.5 }
        }
    },
    
    // ========== 游侠技能 ==========
    ranger: {
        quick_shot: {
            name: '疾风箭', description: '快速射击，无视敌人10%防御',
            mpCost: 5, cooldown: 1, targetType: 'enemy',
            damage: { type: 'physical', percent: 0.9, ignoreDef: 0.1 }
        },
        multi_shot: {
            name: '多重射击', description: '对所有敌人造成70%伤害',
            mpCost: 20, cooldown: 4, targetType: 'all_enemy',
            damage: { type: 'physical', percent: 0.7, aoe: true }
        },
        trap: {
            name: '陷阱', description: '放置陷阱造成50%伤害并减速',
            mpCost: 15, cooldown: 3, targetType: 'enemy',
            damage: { type: 'physical', percent: 0.5 },
            effect: { slow: { chance: 1.0, duration: 2 } }
        },
        evasion: {
            name: '闪避姿态', description: '2回合内闪避率+40%',
            mpCost: 10, cooldown: 4, targetType: 'self',
            buff: { evasion: 40, duration: 2 }
        },
        assassinate: {
            name: '暗杀', description: '对低血量敌人200%伤害，高血量80%',
            mpCost: 25, cooldown: 5, targetType: 'enemy',
            damage: { type: 'physical', lowHpDamage: 2.0, highHpDamage: 0.8 }
        },
        poison_arrow: {
            name: '毒箭', description: '造成100%伤害并中毒3回合',
            mpCost: 12, cooldown: 3, targetType: 'enemy',
            damage: { type: 'physical', percent: 1.0 },
            effect: { dot: { type: 'poison', damage: 8, duration: 3 } }
        },
        called_shot: {
            name: '精准射击', description: '必定暴击，200%伤害',
            mpCost: 20, cooldown: 5, targetType: 'enemy',
            damage: { type: 'physical', percent: 2.0, guaranteedCrit: true }
        },
        smoke_bomb: {
            name: '烟雾弹', description: '3回合内闪避+60%',
            mpCost: 15, cooldown: 6, targetType: 'self',
            buff: { evasion: 60, duration: 3 }
        }
    },
    
    // ========== 圣职技能 ==========
    cleric: {
        heal: {
            name: '治疗术', description: '恢复30+感知值的HP',
            mpCost: 15, cooldown: 3, targetType: 'ally',
            healing: { type: 'flat', baseHeal: 30, scaling: 'wis' }
        },
        holy_bolt: {
            name: '神圣制裁', description: '造成60+感知伤害，对不死系1.5倍',
            mpCost: 12, cooldown: 2, targetType: 'enemy',
            element: 'holy',
            damage: { type: 'holy', baseDamage: 60, scaling: 'wis', undeadBonus: 1.5 }
        },
        bless: {
            name: '祝福', description: '3回合内全属性+15%',
            mpCost: 20, cooldown: 5, targetType: 'self',
            buff: { allStats: 15, duration: 3 }
        },
        smite: {
            name: '重击', description: '造成120%攻击+感知伤害，20%击晕',
            mpCost: 10, cooldown: 2, targetType: 'enemy',
            damage: { type: 'physical', percent: 1.2, scaling: 'wis' },
            effect: { stun: { chance: 0.2, duration: 1 } }
        },
        divine_shield: {
            name: '神圣护盾', description: '2回合内免疫所有伤害',
            mpCost: 25, cooldown: 6, targetType: 'self',
            buff: { invincible: true, duration: 2 }
        },
        group_heal: {
            name: '群体治疗', description: '恢复所有队友25%HP',
            mpCost: 30, cooldown: 6, targetType: 'all_ally',
            healing: { type: 'percent', percent: 0.25, aoe: true }
        },
        holy_fire: {
            name: '神圣之火', description: '造成100%圣属性伤害',
            mpCost: 18, cooldown: 3, targetType: 'enemy',
            element: 'holy',
            damage: { type: 'holy', percent: 1.0 }
        },
        cleanse: {
            name: '净化', description: '移除所有debuff',
            mpCost: 15, cooldown: 4, targetType: 'ally',
            effect: { removeDebuffs: true }
        }
    }
};

export { SKILL_DATABASE };
