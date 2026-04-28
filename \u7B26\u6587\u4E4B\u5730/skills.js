/**
 * 符文之地 - 技能系统
 * 技能执行 + 天赋
 */

import { ElementType } from './combat.js';
import { PlayerClass } from './player.js';

// ==================== 技能数据 ====================
const SkillDatabase = {
    // 战士技能
    'slash': {
        name: '斩击',
        class: PlayerClass.WARRIOR,
        type: 'active',
        mpCost: 0,
        cooldown: 0,
        targetType: 'enemy',
        description: '基础攻击，造成100%攻击力伤害',
        effect: { damageType: 'physical', damagePercent: 1.0 }
    },
    'power_slash': {
        name: '强力斩击',
        class: PlayerClass.WARRIOR,
        type: 'active',
        mpCost: 10,
        cooldown: 3,
        targetType: 'enemy',
        description: '造成150%攻击力伤害',
        effect: { damageType: 'physical', damagePercent: 1.5 }
    },
    'shield_bash': {
        name: '盾击',
        class: PlayerClass.WARRIOR,
        type: 'active',
        mpCost: 5,
        cooldown: 2,
        targetType: 'enemy',
        description: '造成80%攻击力伤害，有30%几率眩晕敌人1回合',
        effect: { damageType: 'physical', damagePercent: 0.8, stunChance: 0.3, stunDuration: 1 }
    },
    'battle_cry': {
        name: '战吼',
        class: PlayerClass.WARRIOR,
        type: 'active',
        mpCost: 15,
        cooldown: 5,
        targetType: 'self',
        description: '3回合内攻击力+30%',
        effect: { buff: 'atk', buffPercent: 30, buffDuration: 3 }
    },
    'whirlwind': {
        name: '旋风斩',
        class: PlayerClass.WARRIOR,
        type: 'active',
        mpCost: 20,
        cooldown: 4,
        targetType: 'all_enemy',
        description: '对所有敌人造成100%攻击力伤害',
        effect: { damageType: 'physical', damagePercent: 1.0, aoe: true }
    },
    
    // 法师技能
    'fireball': {
        name: '火球术',
        class: PlayerClass.MAGE,
        type: 'active',
        mpCost: 15,
        cooldown: 3,
        targetType: 'enemy',
        element: ElementType.FIRE,
        description: '造成80+智力伤害，附带灼烧效果',
        effect: { damageType: ElementType.FIRE, baseDamage: 80, damagePercent: 0.5, burnDamage: 10, burnDuration: 2 }
    },
    'ice_shard': {
        name: '冰刺术',
        class: PlayerClass.MAGE,
        type: 'active',
        mpCost: 12,
        cooldown: 2,
        targetType: 'enemy',
        element: ElementType.ICE,
        description: '造成70+智力伤害，30%几率冻结敌人',
        effect: { damageType: ElementType.ICE, baseDamage: 70, damagePercent: 0.4, freezeChance: 0.3, freezeDuration: 1 }
    },
    'lightning': {
        name: '雷电术',
        class: PlayerClass.MAGE,
        type: 'active',
        mpCost: 18,
        cooldown: 3,
        targetType: 'enemy',
        element: ElementType.LIGHTNING,
        description: '造成100+智力伤害，20%几率麻痹',
        effect: { damageType: ElementType.LIGHTNING, baseDamage: 100, damagePercent: 0.6, paralyzeChance: 0.2, paralyzeDuration: 1 }
    },
    'frost_nova': {
        name: '冰霜新星',
        class: PlayerClass.MAGE,
        type: 'active',
        mpCost: 25,
        cooldown: 5,
        targetType: 'all_enemy',
        element: ElementType.ICE,
        description: '对所有敌人造成60+智力伤害，20%几率冻结',
        effect: { damageType: ElementType.ICE, baseDamage: 60, aoe: true, freezeChance: 0.2 }
    },
    'arcane_surge': {
        name: '奥术涌动',
        class: PlayerClass.MAGE,
        type: 'active',
        mpCost: 30,
        cooldown: 6,
        targetType: 'self',
        description: '3回合内MP消耗-50%，伤害+20%',
        effect: { buff: 'damage', buffPercent: 20, buffDuration: 3, mpCostReduction: 0.5 }
    },
    
    // 游侠技能
    'quick_shot': {
        name: '疾风箭',
        class: PlayerClass.RANGER,
        type: 'active',
        mpCost: 5,
        cooldown: 1,
        targetType: 'enemy',
        description: '快速射击，造成90%攻击力+敏捷伤害，无视敌人10%防御',
        effect: { damageType: 'physical', damagePercent: 0.9, spdBonus: true, ignoreDef: 0.1 }
    },
    'multi_shot': {
        name: '多重射击',
        class: PlayerClass.RANGER,
        type: 'active',
        mpCost: 20,
        cooldown: 4,
        targetType: 'all_enemy',
        description: '对所有敌人造成70%攻击力伤害',
        effect: { damageType: 'physical', damagePercent: 0.7, aoe: true }
    },
    'trap': {
        name: '陷阱',
        class: PlayerClass.RANGER,
        type: 'active',
        mpCost: 15,
        cooldown: 3,
        targetType: 'enemy',
        description: '放置陷阱，下回合触发造成50%攻击力+敏捷伤害并减速',
        effect: { damageType: 'physical', damagePercent: 0.5, spdBonus: true, slowDuration: 2 }
    },
    'evasion': {
        name: '闪避姿态',
        class: PlayerClass.RANGER,
        type: 'active',
        mpCost: 10,
        cooldown: 4,
        targetType: 'self',
        description: '2回合内闪避率+40%',
        effect: { buff: 'evasion', evasionBonus: 40, buffDuration: 2 }
    },
    'assassinate': {
        name: '暗杀',
        class: PlayerClass.RANGER,
        type: 'active',
        mpCost: 25,
        cooldown: 5,
        targetType: 'enemy',
        description: '对低血量敌人造成200%伤害，对高血量敌人造成80%伤害',
        effect: { damageType: 'physical', lowHpPercent: 0.3, highHpDamage: 0.8, lowHpDamage: 2.0 }
    },
    
    // 圣职技能
    'heal': {
        name: '治疗术',
        class: PlayerClass.CLERIC,
        type: 'active',
        mpCost: 15,
        cooldown: 3,
        targetType: 'ally',
        description: '恢复30+感知值的HP',
        descriptionAlt: '恢复目标30+感知值的HP',
        effect: { healType: 'flat', baseHeal: 30, scaling: 'wis' }
    },
    'holy_bolt': {
        name: '神圣制裁',
        class: PlayerClass.CLERIC,
        type: 'active',
        mpCost: 12,
        cooldown: 2,
        targetType: 'enemy',
        element: ElementType.HOLY,
        description: '造成60+感知值的圣属性伤害，对不死系敌人伤害x1.5',
        effect: { damageType: ElementType.HOLY, baseDamage: 60, scaling: 'wis', undeadBonus: 1.5 }
    },
    'bless': {
        name: '祝福',
        class: PlayerClass.CLERIC,
        type: 'active',
        mpCost: 20,
        cooldown: 5,
        targetType: 'self',
        description: '3回合内全属性+15%',
        effect: { buff: 'all', buffPercent: 15, buffDuration: 3 }
    },
    'smite': {
        name: '重击',
        class: PlayerClass.CLERIC,
        type: 'active',
        mpCost: 10,
        cooldown: 2,
        targetType: 'enemy',
        description: '造成120%攻击力+感知伤害，有20%几率击晕',
        effect: { damageType: 'physical', damagePercent: 1.2, scaling: 'wis', stunChance: 0.2 }
    },
    'divine_shield': {
        name: '神圣护盾',
        class: PlayerClass.CLERIC,
        type: 'active',
        mpCost: 25,
        cooldown: 6,
        targetType: 'self',
        description: '2回合内免疫所有伤害',
        effect: { buff: 'invincible', buffDuration: 2 }
    }
};

// ==================== 技能管理器 ====================
class SkillManager {
    constructor(game) {
        this.game = game;
        this.skills = SkillDatabase;
    }
    
    initializePlayerSkills(player) {
        const classSkills = Object.entries(this.skills)
            .filter(([id, skill]) => skill.class === player.characterClass)
            .map(([id]) => id);
        
        player.learnedSkills = classSkills.slice(0, 6);
        player.equippedSkills = classSkills.slice(0, Math.min(4, classSkills.length));
    }
    
    getSkill(skillId) {
        return this.skills[skillId] || null;
    }
    
    executeSkill(skillId, caster, target, combatSystem) {
        const skill = this.skills[skillId];
        if (!skill) return { success: false, message: '技能不存在' };
        
        // MP检查
        if (caster.mp < skill.mpCost) {
            return { success: false, message: 'MP不足' };
        }
        
        // 消耗MP
        caster.useMP(skill.mpCost);
        
        // 执行效果
        const effect = skill.effect;
        let damage = 0;
        let healing = 0;
        
        if (effect.damagePercent) {
            let baseDamage = caster.totalATK;
            if (effect.baseDamage) baseDamage += effect.baseDamage;
            if (effect.scaling === 'wis') baseDamage += caster.totalLUK; // 感知用LUK代替
            
            damage = Math.floor(baseDamage * effect.damagePercent);
            
            // 属性加成
            if (skill.element) {
                damage = combatSystem.applyElementalDamage(damage, skill.element, target);
            }
            
            // AOE
            if (effect.aoe) {
                // 对所有敌人造成伤害(这里简化处理)
                damage = Math.floor(damage * 0.7);
            }
            
            // 暴击
            if (Math.random() * 100 < caster.totalCritRate) {
                damage = Math.floor(damage * caster.totalCritDamage / 100);
            }
            
            // 防御减伤
            damage = Math.max(1, damage - Math.floor(target.def / 2));
            
            target.takeDamage(damage, skill.element || 'physical');
        }
        
        if (effect.healType === 'flat') {
            const healAmount = effect.baseHeal + (effect.scaling === 'wis' ? caster.totalLUK : 0);
            healing = caster.heal(healAmount);
        }
        
        // 状态效果
        if (effect.burnDamage) {
            target.applyStatus('burn', effect.burnDuration, effect.burnDamage);
        }
        if (effect.freezeChance && Math.random() < effect.freezeChance) {
            target.applyStatus('frozen', effect.freezeDuration || 1);
        }
        if (effect.paralyzeChance && Math.random() < effect.paralyzeChance) {
            target.applyStatus('paralyze', effect.paralyzeDuration || 1);
        }
        if (effect.stunChance && Math.random() < effect.stunChance) {
            target.applyStatus('stun', effect.stunDuration || 1);
        }
        
        // Buff效果
        if (effect.buff) {
            if (effect.buff === 'atk') {
                caster.bonusATK += Math.floor(caster.atk * (effect.buffPercent / 100));
            } else if (effect.buff === 'evasion') {
                caster.evasionBonus += effect.evasionBonus;
            } else if (effect.buff === 'all') {
                caster.bonusATK += Math.floor(caster.atk * (effect.buffPercent / 100));
                caster.bonusDEF += Math.floor(caster.def * (effect.buffPercent / 100));
            }
            
            // 设置buff持续时间
            caster.applyStatus('buff_' + effect.buff, effect.buffDuration);
        }
        
        return {
            success: true,
            damage,
            healing,
            skill: skill.name
        };
    }
    
    getSkillDescription(skillId) {
        const skill = this.skills[skillId];
        if (!skill) return '';
        return skill.description;
    }
    
    getSkillIcon(skillId) {
        const icons = {
            'slash': '⚔', 'power_slash': '⚔', 'shield_bash': '🛡', 'battle_cry': '📢', 'whirlwind': '🌀',
            'fireball': '🔥', 'ice_shard': '❄', 'lightning': '⚡', 'frost_nova': '💠', 'arcane_surge': '✨',
            'quick_shot': '🏹', 'multi_shot': '🎯', 'trap': '⚠', 'evasion': '💨', 'assassinate': '🗡',
            'heal': '💚', 'holy_bolt': '⚡', 'bless': '✨', 'smite': '👊', 'divine_shield': '🛡'
        };
        return icons[skillId] || '✨';
    }
}

// 导出
export { SkillManager, SkillDatabase };
