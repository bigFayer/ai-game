/**
 * 符文之地 - 敌人特殊能力库
 */

const ENEMY_SPECIAL_ABILITIES = {
    // ===== BOSS 特殊技能 =====
    boss_troll_regenerate: {
        name: '再生',
        description: '每回合恢复5%最大HP',
        type: 'passive',
        effect: { regen: 0.05 },
        target: 'self'
    },
    
    boss_troll_ground_slam: {
        name: '大地猛击',
        description: '对所有敌人造成150%伤害，40%几率眩晕',
        type: 'special',
        damage: { percent: 1.5 },
        aoe: true,
        effect: { stun: { chance: 0.4, duration: 1 } },
        mpCost: 20,
        cooldown: 4,
        target: 'all_enemies'
    },
    
    boss_troll_toss: {
        name: '投掷',
        description: '将玩家扔出战斗区域，造成180%伤害',
        type: 'special',
        damage: { percent: 1.8 },
        effect: { knockback: true },
        mpCost: 15,
        cooldown: 3,
        target: 'single_enemy'
    },
    
    boss_troll_enrage: {
        name: '激怒',
        description: 'HP低于50%时自动触发，攻击力+30%',
        type: 'passive',
        trigger: { hpBelow: 0.5 },
        effect: { buff: { atk: 0.3 } },
        target: 'self'
    },
    
    // ===== 法老王技能 =====
    pharaoh_sandstorm: {
        name: '沙尘暴',
        description: '全屏攻击，造成100%伤害并致盲',
        type: 'special',
        damage: { percent: 1.0 },
        aoe: true,
        effect: { debuff: { type: 'blind', duration: 2 } },
        mpCost: 25,
        cooldown: 5,
        target: 'all_enemies'
    },
    
    pharaoh_mummy_curse: {
        name: '木乃伊诅咒',
        description: '造成持续虚空伤害并禁止治疗',
        type: 'debuff',
        damage: { percent: 0.5, dot: { damage: 15, duration: 5 } },
        effect: { debuff: { type: 'no_heal', duration: 5 } },
        mpCost: 20,
        cooldown: 4,
        target: 'single_enemy'
    },
    
    pharaoh_summon_undead: {
        name: '召唤亡灵',
        description: '召唤3只木乃伊助战',
        type: 'summon',
        summon: 'desert_mummy_1',
        count: 3,
        mpCost: 35,
        cooldown: 8,
        target: 'self'
    },
    
    pharaoh_wrath: {
        name: '法老之怒',
        description: '究极攻击，造成250%神圣伤害',
        type: 'special',
        damage: { percent: 2.5, element: 'holy' },
        mpCost: 50,
        cooldown: 10,
        target: 'single_enemy'
    },
    
    pharaoh_phases: [
        { threshold: 0.66, abilities: ['pharaoh_sandstorm'] },
        { threshold: 0.33, abilities: ['pharaoh_wrath', 'enrage'] }
    ],
    
    // ===== 冰霜巨龙技能 =====
    frost_dragon_frost_breath: {
        name: '霜冻吐息',
        description: '强力冰属性攻击，50%几率冻结',
        type: 'special',
        damage: { percent: 2.0, element: 'ice' },
        effect: { freeze: { chance: 0.5, duration: 2 } },
        mpCost: 30,
        cooldown: 6,
        target: 'all_enemies'
    },
    
    frost_dragon_tail_sweep: {
        name: '尾部横扫',
        description: 'AOE攻击造成130%伤害',
        type: 'special',
        damage: { percent: 1.3 },
        aoe: true,
        mpCost: 15,
        cooldown: 3,
        target: 'all_enemies'
    },
    
    frost_dragon_freeze_aura: {
        name: '冰冻光环',
        description: '被动光环，对攻击者造成冰冻',
        type: 'passive',
        effect: { aura: { damage: 10, chance: 0.2, freeze: true } },
        target: 'self'
    },
    
    frost_dragon_ice_prison: {
        name: '冰牢',
        description: '将目标冻结2回合并造成150%伤害',
        type: 'special',
        damage: { percent: 1.5 },
        effect: { freeze: { chance: 1.0, duration: 2 } },
        mpCost: 25,
        cooldown: 5,
        target: 'single_enemy'
    },
    
    frost_dragon_fly: {
        name: '飞行',
        description: '腾空闪避所有攻击，攻击力+20%',
        type: 'buff',
        effect: { evasion: 100, buff: { atk: 0.2 } },
        duration: 3,
        mpCost: 20,
        cooldown: 6,
        target: 'self'
    },
    
    // ===== 火焰领主技能 =====
    fire_lord_inferno: {
        name: '炼狱',
        description: '终极火焰技能，造成300%伤害并灼烧',
        type: 'special',
        damage: { percent: 3.0, element: 'fire' },
        effect: { dot: { type: 'burn', damage: 15, duration: 5 } },
        mpCost: 60,
        cooldown: 10,
        target: 'all_enemies'
    },
    
    fire_lord_meteor_strike: {
        name: '陨石',
        description: '单体超高伤害，250%',
        type: 'special',
        damage: { percent: 2.5, element: 'fire' },
        mpCost: 40,
        cooldown: 7,
        target: 'single_enemy'
    },
    
    fire_lord_flame_summon: {
        name: '召唤火焰仆从',
        description: '召唤2只火焰小鬼',
        type: 'summon',
        summon: 'fire_imp_1',
        count: 2,
        mpCost: 25,
        cooldown: 6,
        target: 'self'
    },
    
    fire_lord_fire_shield: {
        name: '火焰护盾',
        description: '获得25%HP护盾并反弹50%近战伤害',
        type: 'buff',
        effect: { shield: 0.25, damageReflect: 0.5 },
        duration: 4,
        mpCost: 20,
        cooldown: 5,
        target: 'self'
    },
    
    fire_lord_enrage: {
        name: '激怒',
        description: 'HP低于33%时触发，所有属性+50%',
        type: 'passive',
        trigger: { hpBelow: 0.33 },
        effect: { buff: { atk: 0.5, def: 0.5, spd: 0.5 } },
        target: 'self'
    },
    
    // ===== 虚空君主技能 =====
    void_overlord_void_annihilation: {
        name: '虚空湮灭',
        description: '终极技能，造成350%虚空伤害',
        type: 'special',
        damage: { percent: 3.5, element: 'void' },
        mpCost: 80,
        cooldown: 12,
        target: 'all_enemies'
    },
    
    void_overlord_dimension_rift: {
        name: '维度裂隙',
        description: '传送到目标背后造成150%伤害并弱化',
        type: 'special',
        damage: { percent: 1.5, element: 'void' },
        effect: { debuff: { type: 'atk_debuff', duration: 3 } },
        mpCost: 20,
        cooldown: 4,
        target: 'single_enemy'
    },
    
    void_overlord_soul_harvest: {
        name: '灵魂收割',
        description: '造成250%伤害并治疗自身100%HP，攻击力+30%',
        type: 'special',
        damage: { percent: 2.5 },
        effect: { heal: 1.0, buff: { atk: 0.3 } },
        mpCost: 50,
        cooldown: 8,
        target: 'single_enemy'
    },
    
    void_overlord_void_armor: {
        name: '虚空护甲',
        description: '防御+50%，虚空抗性+100%',
        type: 'buff',
        effect: { buff: { def: 0.5, voidResist: 100 } },
        duration: 5,
        mpCost: 30,
        cooldown: 8,
        target: 'self'
    },
    
    void_overlord_ultimate_curse: {
        name: '究极诅咒',
        description: '全属性降低并造成持续虚空伤害',
        type: 'debuff',
        damage: { dot: { type: 'void', damage: 20, duration: 10 } },
        effect: { debuff: { type: 'all_stats', duration: 5 } },
        mpCost: 60,
        cooldown: 15,
        target: 'single_enemy'
    },
    
    void_overlord_summon_void: {
        name: '召唤虚空',
        description: '召唤3只虚空幽灵',
        type: 'summon',
        summon: 'void_specter_1',
        count: 3,
        mpCost: 40,
        cooldown: 10,
        target: 'self'
    },
    
    void_overlord_phases: [
        { threshold: 0.75, abilities: ['void_overlord_void_armor'] },
        { threshold: 0.5, abilities: ['void_overlord_soul_harvest', 'void_overlord_dimension_rift'] },
        { threshold: 0.25, abilities: ['void_overlord_enrage_final', 'void_overlord_void_annihilation', 'void_overlord_ultimate_curse'] }
    ],
    
    // ===== 精英怪特殊能力 =====
    elite_rage: {
        name: '精英之怒',
        description: 'HP低于30%时攻击力+50%',
        type: 'passive',
        trigger: { hpBelow: 0.3 },
        effect: { buff: { atk: 0.5 } },
        target: 'self'
    },
    
    elite_shield: {
        name: '精英护盾',
        description: '战斗开始时获得50%HP护盾',
        type: 'buff',
        effect: { shield: 0.5 },
        trigger: { combatStart: true },
        target: 'self'
    },
    
    elite_lifesteal: {
        name: '精英吸血',
        description: '攻击时偷取20%伤害',
        type: 'passive',
        effect: { lifesteal: 0.2 },
        target: 'self'
    },
    
    elite_teleport: {
        name: '瞬移',
        description: 'HP低于50%时有几率瞬移躲避攻击',
        type: 'defensive',
        trigger: { hpBelow: 0.5, chance: 0.3 },
        effect: { evasion: 100 },
        duration: 1,
        target: 'self'
    }
};

// 技能效果处理器
class AbilityProcessor {
    constructor(game) {
        this.game = game;
    }
    
    process(ability, source, targets) {
        switch (ability.type) {
            case 'special':
            case 'melee':
            case 'ranged':
                return this.processDamageAbility(ability, source, targets);
            case 'buff':
                return this.processBuffAbility(ability, source);
            case 'debuff':
                return this.processDebuffAbility(ability, source, targets);
            case 'heal':
                return this.processHealAbility(ability, source);
            case 'summon':
                return this.processSummonAbility(ability, source);
            case 'passive':
                return this.processPassiveAbility(ability, source);
            case 'aura':
                return this.processAuraAbility(ability, source);
            default:
                return [];
        }
    }
    
    processDamageAbility(ability, source, targets) {
        const results = [];
        
        for (const target of targets) {
            let damage = this.calculateDamage(ability, source, target);
            
            // 检查是否命中
            if (!this.checkHit(ability, source, target)) {
                results.push({ target, missed: true });
                continue;
            }
            
            // 应用伤害
            target.takeDamage(damage, ability.element);
            results.push({ target, damage, element: ability.element });
            
            // 效果
            if (ability.effect) {
                this.applyEffect(ability.effect, target);
            }
        }
        
        return results;
    }
    
    calculateDamage(ability, source, target) {
        let baseDamage = source.atk;
        
        if (ability.percent) {
            baseDamage *= ability.percent;
        }
        
        if (ability.baseDamage) {
            baseDamage += ability.baseDamage;
        }
        
        // 元素克制
        if (ability.element) {
            const effectiveness = this.getElementEffectiveness(ability.element, target.element);
            baseDamage *= effectiveness;
        }
        
        // 随机波动
        baseDamage *= 0.9 + Math.random() * 0.2;
        
        return Math.floor(baseDamage);
    }
    
    checkHit(ability, source, target) {
        const accuracy = 95; // 基础命中率
        const evasion = target.evasion || 0;
        const hitChance = accuracy - evasion;
        
        return Math.random() * 100 < hitChance;
    }
    
    getElementEffectiveness(attackElement, defenseElement) {
        if (!attackElement || !defenseElement) return 1.0;
        
        const weaknesses = ElementType.WEAKNESS[attackElement];
        if (weaknesses && weaknesses === defenseElement) return 2.0;
        
        const resists = ElementType.RESISTANCE[defenseElement];
        if (resists && resists[attackElement]) return 0.5;
        
        return 1.0;
    }
    
    processBuffAbility(ability, source) {
        if (ability.buff) {
            source.applyBuff(ability.buff, ability.duration);
        }
        if (ability.effect?.shield) {
            source.applyShield(ability.effect.shield);
        }
        if (ability.effect?.evasion) {
            source.evasion += ability.effect.evasion;
        }
        return [];
    }
    
    processDebuffAbility(ability, source, targets) {
        for (const target of targets) {
            if (ability.effect) {
                this.applyEffect(ability.effect, target);
            }
        }
        return [];
    }
    
    processHealAbility(ability, source) {
        if (ability.healing) {
            let healAmount = source.maxHp * ability.healing;
            if (ability.baseHeal) healAmount += ability.baseHeal;
            source.heal(healAmount);
        }
        return [];
    }
    
    processSummonAbility(ability, source) {
        // 召唤逻辑
        return [];
    }
    
    processPassiveAbility(ability, source) {
        // 被动技能通常由AI系统处理
        return [];
    }
    
    processAuraAbility(ability, source) {
        // 光环效果
        return [];
    }
    
    applyEffect(effect, target) {
        if (effect.stun?.chance && Math.random() < effect.stun.chance) {
            target.applyStatus('stun', effect.stun.duration);
        }
        if (effect.freeze?.chance && Math.random() < effect.freeze.chance) {
            target.applyStatus('freeze', effect.freeze.duration);
        }
        if (effect.dot) {
            target.applyDot(effect.dot.type, effect.dot.damage, effect.dot.duration);
        }
        if (effect.debuff) {
            target.applyDebuff(effect.debuff.type, effect.debuff.duration);
        }
    }
}

export { ENEMY_SPECIAL_ABILITIES, AbilityProcessor };
