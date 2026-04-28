/**
 * 符文之地 - 状态效果系统
 */

const STATUS_EFFECTS = {
    // ===== 正面状态 =====
    buff_atk: {
        name: '攻击力提升',
        type: 'buff',
        stat: 'atk',
        multiplier: 1.3,
        color: '#ff4444',
        icon: '⚔',
        removable: true,
        duration: 3
    },
    buff_def: {
        name: '防御力提升',
        type: 'buff',
        stat: 'def',
        multiplier: 1.3,
        color: '#4488ff',
        icon: '🛡',
        removable: true,
        duration: 3
    },
    buff_spd: {
        name: '速度提升',
        type: 'buff',
        stat: 'spd',
        multiplier: 1.3,
        color: '#44ff44',
        icon: '💨',
        removable: true,
        duration: 3
    },
    buff_luk: {
        name: '幸运提升',
        type: 'buff',
        stat: 'luk',
        multiplier: 1.5,
        color: '#ffd700',
        icon: '🍀',
        removable: true,
        duration: 3
    },
    buff_crit: {
        name: '暴击率提升',
        type: 'buff',
        stat: 'critRate',
        flat: 15,
        color: '#ff44ff',
        icon: '💥',
        removable: true,
        duration: 3
    },
    buff_regen: {
        name: '生命回复',
        type: 'buff',
        stat: 'hpRegen',
        multiplier: 2,
        color: '#44ff44',
        icon: '💚',
        removable: true,
        duration: 5
    },
    buff_mp_regen: {
        name: '魔法回复',
        type: 'buff',
        stat: 'mpRegen',
        multiplier: 2,
        color: '#4444ff',
        icon: '💙',
        removable: true,
        duration: 5
    },
    buff_shield: {
        name: '护盾',
        type: 'shield',
        amount: 0.3,
        color: '#4488ff',
        icon: '🔵',
        removable: false,
        duration: 3
    },
    buff_invincible: {
        name: '无敌',
        type: 'invincible',
        color: '#ffd700',
        icon: '⭐',
        removable: false,
        duration: 2
    },
    buff_evasion: {
        name: '闪避提升',
        type: 'buff',
        stat: 'evasion',
        flat: 30,
        color: '#44ffaa',
        icon: '👻',
        removable: true,
        duration: 3
    },
    buff_fire_resist: {
        name: '火焰抗性',
        type: 'resist',
        element: 'fire',
        amount: 50,
        color: '#ff6600',
        icon: '🔥',
        removable: true,
        duration: 5
    },
    buff_ice_resist: {
        name: '冰霜抗性',
        type: 'resist',
        element: 'ice',
        amount: 50,
        color: '#00ccff',
        icon: '❄',
        removable: true,
        duration: 5
    },
    
    // ===== 负面状态 =====
    debuff_atk: {
        name: '攻击力下降',
        type: 'debuff',
        stat: 'atk',
        multiplier: 0.7,
        color: '#aa4444',
        icon: '📉',
        removable: true,
        duration: 3
    },
    debuff_def: {
        name: '防御力下降',
        type: 'debuff',
        stat: 'def',
        multiplier: 0.7,
        color: '#4444aa',
        icon: '📉',
        removable: true,
        duration: 3
    },
    debuff_spd: {
        name: '速度下降',
        type: 'debuff',
        stat: 'spd',
        multiplier: 0.7,
        color: '#44aa44',
        icon: '📉',
        removable: true,
        duration: 3
    },
    stun: {
        name: '眩晕',
        type: 'stun',
        color: '#ffaa00',
        icon: '⚡',
        removable: true,
        duration: 1
    },
    freeze: {
        name: '冻结',
        type: 'freeze',
        color: '#00ccff',
        icon: '🧊',
        removable: true,
        duration: 1
    },
    paralyze: {
        name: '麻痹',
        type: 'paralyze',
        color: '#ffff00',
        icon: '⚡',
        removable: true,
        duration: 2
    },
    sleep: {
        name: '睡眠',
        type: 'sleep',
        color: '#aaaaff',
        icon: '💤',
        removable: true,
        duration: 2
    },
    fear: {
        name: '恐惧',
        type: 'fear',
        color: '#ff00ff',
        icon: '👻',
        removable: true,
        duration: 2
    },
    silence: {
        name: '沉默',
        type: 'silence',
        color: '#888888',
        icon: '🔇',
        removable: true,
        duration: 2
    },
    blind: {
        name: '致盲',
        type: 'blind',
        color: '#666666',
        icon: '👁',
        removable: true,
        duration: 2
    },
    poison: {
        name: '中毒',
        type: 'dot',
        element: 'poison',
        damage: 5,
        color: '#44ff00',
        icon: '☠',
        removable: true,
        duration: 3
    },
    burn: {
        name: '灼烧',
        type: 'dot',
        element: 'fire',
        damage: 8,
        color: '#ff4400',
        icon: '🔥',
        removable: true,
        duration: 3
    },
    bleed: {
        name: '流血',
        type: 'dot',
        element: 'physical',
        damage: 3,
        color: '#ff0000',
        icon: '🩸',
        removable: true,
        duration: 3
    },
    curse: {
        name: '诅咒',
        type: 'curse',
        color: '#8800ff',
        icon: '💀',
        removable: true,
        duration: 5
    },
    no_heal: {
        name: '禁止治疗',
        type: 'debuff',
        color: '#ff0088',
        icon: '❌',
        removable: true,
        duration: 3
    }
};

class StatusEffect {
    constructor(effectId, duration, stacks = 1) {
        const template = STATUS_EFFECTS[effectId];
        if (!template) {
            console.warn(`[StatusEffect] 未找到效果: ${effectId}`);
            return;
        }
        
        Object.assign(this, template);
        this.id = effectId;
        this.duration = duration || template.duration;
        this.maxDuration = this.duration;
        this.stacks = stacks;
        this.elapsed = 0;
        this.tickTimer = 0;
        this.tickInterval = 1; // 每秒触发
        this.isActive = true;
    }
    
    update(dt) {
        this.elapsed += dt;
        this.tickTimer += dt;
        
        // 持续伤害
        if (this.type === 'dot' && this.tickTimer >= this.tickInterval) {
            this.tickTimer = 0;
            return { tick: true, damage: this.damage };
        }
        
        // 持续时间结束
        if (this.elapsed >= this.duration) {
            this.isActive = false;
        }
        
        return null;
    }
    
    refresh(duration) {
        this.duration = duration || this.maxDuration;
        this.elapsed = 0;
    }
    
    addStack() {
        if (this.maxStacks) {
            this.stacks = Math.min(this.stacks + 1, this.maxStacks);
        }
    }
    
    getRemainingDuration() {
        return Math.max(0, this.duration - this.elapsed);
    }
    
    getProgress() {
        return this.elapsed / this.duration;
    }
}

class StatusEffectManager {
    constructor(entity) {
        this.entity = entity;
        this.effects = new Map();
        this.immuneTypes = new Set();
    }
    
    addEffect(effectId, duration, stacks = 1) {
        // 检查免疫
        const template = STATUS_EFFECTS[effectId];
        if (!template) return false;
        
        if (this.immuneTypes.has(template.type)) {
            return false;
        }
        
        // 检查已有效果
        if (this.effects.has(effectId)) {
            const existing = this.effects.get(effectId);
            existing.refresh(duration);
            if (template.stacking) {
                existing.addStack();
            }
            return false;
        }
        
        const effect = new StatusEffect(effectId, duration, stacks);
        this.effects.set(effectId, effect);
        
        // 应用立即效果
        this.applyImmediateEffect(effect);
        
        return true;
    }
    
    removeEffect(effectId) {
        const effect = this.effects.get(effectId);
        if (effect) {
            this.removeImmediateEffect(effect);
            this.effects.delete(effectId);
        }
    }
    
    applyImmediateEffect(effect) {
        switch (effect.type) {
            case 'shield':
                this.entity.shield = (this.entity.shield || 0) + this.entity.maxHp * effect.amount * effect.stacks;
                break;
            case 'invincible':
                this.entity.invincible = true;
                break;
        }
    }
    
    removeImmediateEffect(effect) {
        switch (effect.type) {
            case 'shield':
                this.entity.shield = 0;
                break;
            case 'invincible':
                this.entity.invincible = false;
                break;
        }
    }
    
    update(dt) {
        for (const [effectId, effect] of this.effects) {
            const tickResult = effect.update(dt);
            
            if (tickResult?.tick) {
                this.entity.takeDamage(tickResult.damage, effect.element, 'dot');
            }
            
            if (!effect.isActive) {
                this.effects.delete(effectId);
            }
        }
    }
    
    getStatModifier(stat) {
        let modifier = 1.0;
        let flat = 0;
        
        for (const effect of this.effects.values()) {
            if (effect.type === 'buff' || effect.type === 'debuff') {
                if (effect.stat === stat) {
                    if (effect.multiplier) {
                        modifier *= effect.multiplier;
                    }
                    if (effect.flat) {
                        flat += effect.flat;
                    }
                }
            }
        }
        
        return { multiplier: modifier, flat };
    }
    
    hasEffect(effectId) {
        return this.effects.has(effectId);
    }
    
    hasEffectType(type) {
        for (const effect of this.effects.values()) {
            if (effect.type === type) return true;
        }
        return false;
    }
    
    canAct() {
        return !this.hasEffectType('stun') &&
               !this.hasEffectType('freeze') &&
               !this.hasEffectType('sleep') &&
               !this.hasEffectType('paralyze');
    }
    
    canCastSkills() {
        return !this.hasEffectType('silence');
    }
    
    canBeHealed() {
        return !this.hasEffectType('no_heal');
    }
    
    getActiveEffects() {
        return Array.from(this.effects.values());
    }
    
    clear() {
        for (const effect of this.effects.values()) {
            this.removeImmediateEffect(effect);
        }
        this.effects.clear();
    }
}

export { StatusEffect, StatusEffectManager, STATUS_EFFECTS };
