/**
 * 符文之地 - 状态效果详细系统
 */

class StatusEffect {
    constructor(id, data) {
        this.id = id;
        this.name = data.name;
        this.type = data.type; // buff, debuff, dot, hot
        this.duration = data.duration;
        this.intensity = data.intensity || 1;
        this.source = data.source || null;
        this.tickInterval = data.tickInterval || 1;
        this.tickCounter = 0;
        this.isActive = true;
        this.metadata = data.metadata || {};
    }
    
    onApply(target) {
        if (this.type === 'dot') {
            // 伤害 over time
        } else if (this.type === 'hot') {
            // 治疗 over time
        }
    }
    
    onRemove(target) {
        // 清理效果
    }
    
    onTick(target) {
        this.tickCounter++;
        if (this.tickCounter >= this.tickInterval) {
            this.tickCounter = 0;
            this.applyEffect(target);
        }
    }
    
    applyEffect(target) {
        switch (this.id) {
            case 'poison':
                target.takePureDamage(5 * this.intensity);
                break;
            case 'burn':
                target.takePureDamage(10 * this.intensity);
                target.takeDamage(2, 'fire');
                break;
            case 'regen':
                target.heal(10 * this.intensity);
                break;
            case 'bleed':
                target.takePureDamage(3 * this.intensity);
                break;
        }
    }
    
    extend(duration) {
        this.duration += duration;
    }
    
    reduce(duration) {
        this.duration -= duration;
        if (this.duration <= 0) {
            this.isActive = false;
        }
    }
}

const STATUS_EFFECT_TYPES = {
    DOT: 'dot',      // Damage over time
    HOT: 'hot',      // Heal over time
    BUFF: 'buff',    // Positive buff
    DEBUFF: 'debuff' // Negative debuff
};

const DOT_EFFECTS = {
    poison: { name: '中毒', damage: 5, type: 'poison', color: '#00ff00' },
    burn: { name: '灼烧', damage: 10, type: 'fire', color: '#ff4400' },
    bleed: { name: '流血', damage: 3, type: 'physical', color: '#ff0000' },
    curse_dot: { name: '诅咒之火', damage: 8, type: 'void', color: '#880088' }
};

const HOT_EFFECTS = {
    regen: { name: '恢复', healing: 10, color: '#44ff44' },
    meditation: { name: '冥想', manaRegen: 5, color: '#4488ff' }
};

class StatusEffectFactory {
    static create(type, options = {}) {
        switch (type) {
            case STATUS_EFFECT_TYPES.DOT:
                return new DotEffect(options);
            case STATUS_EFFECT_TYPES.HOT:
                return new HotEffect(options);
            default:
                return new StatusEffect(type, options);
        }
    }
    
    static createPoison(intensity = 1, duration = 3) {
        return new StatusEffect('poison', {
            name: '中毒',
            type: 'dot',
            duration,
            intensity,
            tickInterval: 1,
            metadata: { damage: 5 * intensity }
        });
    }
    
    static createBurn(intensity = 1, duration = 2) {
        return new StatusEffect('burn', {
            name: '灼烧',
            type: 'dot',
            duration,
            intensity,
            tickInterval: 1,
            metadata: { damage: 10 * intensity }
        });
    }
    
    static createFreeze(duration = 1) {
        return new StatusEffect('freeze', {
            name: '冰冻',
            type: 'debuff',
            duration,
            intensity: 1,
            metadata: { canAct: false }
        });
    }
    
    static createStun(duration = 1) {
        return new StatusEffect('stun', {
            name: '眩晕',
            type: 'debuff',
            duration,
            intensity: 1,
            metadata: { canAct: false }
        });
    }
    
    static createRegen(intensity = 1, duration = 5) {
        return new StatusEffect('regen', {
            name: '恢复',
            type: 'hot',
            duration,
            intensity,
            tickInterval: 1,
            metadata: { healing: 10 * intensity }
        });
    }
}

class DotEffect extends StatusEffect {
    constructor(options) {
        super(options.id || 'dot', {
            name: options.name || '持续伤害',
            type: 'dot',
            duration: options.duration || 3,
            intensity: options.intensity || 1,
            tickInterval: options.tickInterval || 1
        });
        this.damage = options.damage || 5;
        this.damageType = options.damageType || 'physical';
    }
    
    applyEffect(target) {
        if (this.damageType === 'physical') {
            target.takePureDamage(this.damage * this.intensity);
        } else {
            target.takeDamage(this.damage * this.intensity, this.damageType);
        }
    }
}

class HotEffect extends StatusEffect {
    constructor(options) {
        super(options.id || 'hot', {
            name: options.name || '持续治疗',
            type: 'hot',
            duration: options.duration || 3,
            intensity: options.intensity || 1,
            tickInterval: options.tickInterval || 1
        });
        this.healing = options.healing || 10;
    }
    
    applyEffect(target) {
        target.heal(this.healing * this.intensity);
    }
}

export { StatusEffect, StatusEffectFactory, STATUS_EFFECT_TYPES, DOT_EFFECTS, HOT_EFFECTS };
