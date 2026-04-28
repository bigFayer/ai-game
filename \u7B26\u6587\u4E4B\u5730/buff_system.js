/**
 * 符文之地 - Buff/Debuff系统
 * 状态效果 + 持续效果
 */

const BUFF_DEFINITIONS = {
    // Buffs (正面效果)
    'atk_up': {
        name: '攻击力提升',
        type: 'buff',
        duration: 3,
        stackable: false,
        stats: { atk: 0.2 }, // 20%加成
        icon: '⚔',
        color: '#ff4444',
        description: '攻击力+20%'
    },
    'def_up': {
        name: '防御力提升',
        type: 'buff',
        duration: 3,
        stackable: false,
        stats: { def: 0.2 },
        icon: '🛡',
        color: '#4488ff',
        description: '防御力+20%'
    },
    'spd_up': {
        name: '速度提升',
        type: 'buff',
        duration: 3,
        stackable: false,
        stats: { spd: 0.3 },
        icon: '💨',
        color: '#44ff44',
        description: '速度+30%'
    },
    'regen': {
        name: '生命恢复',
        type: 'buff',
        duration: 5,
        stackable: false,
        effect: (target) => { target.heal(5); },
        icon: '💚',
        color: '#44ff44',
        description: '每回合恢复5HP'
    },
    'invincible': {
        name: '无敌',
        type: 'buff',
        duration: 2,
        stackable: false,
        effect: (target) => { target.invincible = true; },
        icon: '⭐',
        color: '#ffd700',
        description: '免疫所有伤害'
    },
    'evasion_up': {
        name: '闪避提升',
        type: 'buff',
        duration: 3,
        stackable: false,
        stats: { evasion: 40 },
        icon: '💨',
        color: '#44ffaa',
        description: '闪避率+40%'
    },
    'crit_up': {
        name: '暴击提升',
        type: 'buff',
        duration: 3,
        stackable: false,
        stats: { critRate: 20 },
        icon: '💥',
        color: '#ff44ff',
        description: '暴击率+20%'
    },
    'mp_regen': {
        name: '魔法恢复',
        type: 'buff',
        duration: 5,
        stackable: false,
        effect: (target) => { target.restoreMP(10); },
        icon: '💙',
        color: '#4488ff',
        description: '每回合恢复10MP'
    },
    
    // Debuffs (负面效果)
    'poison': {
        name: '中毒',
        type: 'debuff',
        duration: 3,
        stackable: true,
        maxStack: 5,
        effect: (target, stack) => { target.takePureDamage(5 * stack); },
        icon: '☠',
        color: '#00ff00',
        description: '每回合受到5点伤害，可叠加'
    },
    'burn': {
        name: '灼烧',
        type: 'debuff',
        duration: 2,
        stackable: false,
        effect: (target) => { target.takePureDamage(10); },
        icon: '🔥',
        color: '#ff4400',
        description: '每回合受到10点火焰伤害'
    },
    'freeze': {
        name: '冰冻',
        type: 'debuff',
        duration: 1,
        stackable: false,
        effect: (target) => { target.canAct = false; },
        icon: '❄',
        color: '#00ffff',
        description: '无法行动1回合'
    },
    'paralyze': {
        name: '麻痹',
        type: 'debuff',
        duration: 1,
        stackable: false,
        effect: (target) => { target.canAct = false; },
        icon: '⚡',
        color: '#ffff00',
        description: '有50%几率无法行动'
    },
    'stun': {
        name: '眩晕',
        type: 'debuff',
        duration: 1,
        stackable: false,
        effect: (target) => { target.canAct = false; },
        icon: '💫',
        color: '#ff8800',
        description: '无法行动1回合'
    },
    'slow': {
        name: '减速',
        type: 'debuff',
        duration: 2,
        stackable: false,
        stats: { spd: -0.5 },
        icon: '🐌',
        color: '#888888',
        description: '速度-50%'
    },
    'weak': {
        name: '虚弱',
        type: 'debuff',
        duration: 3,
        stackable: false,
        stats: { atk: -0.3 },
        icon: '😫',
        color: '#aa8888',
        description: '攻击力-30%'
    },
    'silence': {
        name: '沉默',
        type: 'debuff',
        duration: 2,
        stackable: false,
        effect: (target) => { target.canUseSkills = false; },
        icon: '🔇',
        color: '#8888ff',
        description: '无法使用技能'
    },
    'curse': {
        name: '诅咒',
        type: 'debuff',
        duration: 5,
        stackable: false,
        effect: (target) => { target.healingReceived = 0.5; },
        icon: '💀',
        color: '#880088',
        description: '受到的治疗效果减半'
    },
    'bleed': {
        name: '流血',
        type: 'debuff',
        duration: 3,
        stackable: true,
        maxStack: 3,
        effect: (target, stack) => { target.takePureDamage(3 * stack); },
        icon: '🩸',
        color: '#ff0000',
        description: '每回合受到3点伤害，可叠加'
    },
    'confusion': {
        name: '混乱',
        type: 'debuff',
        duration: 2,
        stackable: false,
        effect: (target) => { target.confused = true; },
        icon: '🌀',
        color: '#ff00ff',
        description: '有30%几率攻击自己'
    },
    'fear': {
        name: '恐惧',
        type: 'debuff',
        duration: 2,
        stackable: false,
        effect: (target) => { target.fleeChance = 0.5; },
        icon: '👻',
        color: '#440044',
        description: '逃跑几率+50%'
    }
};

class Buff {
    constructor(buffId, duration, stack = 1) {
        this.id = buffId;
        this.buffId = buffId;
        this.def = BUFF_DEFINITIONS[buffId];
        this.duration = duration;
        this.maxDuration = duration;
        this.stack = stack;
        this.tickRate = 1; // 每回合触发
        this.tickCounter = 0;
        this.source = null; // 来源
        this.appliedTo = null; // 应用对象
    }
    
    update() {
        this.tickCounter++;
        if (this.tickCounter >= this.tickRate) {
            this.tickCounter = 0;
            this.onTick();
        }
        this.duration--;
        return this.duration <= 0;
    }
    
    onTick() {
        if (this.def.effect && this.appliedTo) {
            this.def.effect(this.appliedTo, this.stack);
        }
    }
    
    extend(extraDuration) {
        this.duration += extraDuration;
        this.maxDuration = Math.max(this.maxDuration, this.duration);
    }
    
    refresh() {
        this.duration = this.def.duration;
    }
    
    stackUp() {
        if (this.def.stackable) {
            const max = this.def.maxStack || 99;
            this.stack = Math.min(this.stack + 1, max);
        }
    }
    
    getName() {
        return this.def.name + (this.stack > 1 ? ` x${this.stack}` : '');
    }
    
    getDescription() {
        return this.def.description;
    }
    
    getIcon() {
        return this.def.icon || '❓';
    }
    
    getColor() {
        return this.def.color || '#ffffff';
    }
    
    isBuff() {
        return this.def.type === 'buff';
    }
    
    isDebuff() {
        return this.def.type === 'debuff';
    }
}

class BuffManager {
    constructor(entity) {
        this.entity = entity;
        this.buffs = [];
        this.buffMap = new Map(); // buffId -> Buff
    }
    
    add(buffId, duration, stack = 1, source = null) {
        const buff = new Buff(buffId, duration, stack);
        buff.source = source;
        buff.appliedTo = this.entity;
        
        const existing = this.buffMap.get(buffId);
        if (existing) {
            if (BUFF_DEFINITIONS[buffId].stackable) {
                existing.stackUp();
            } else {
                existing.refresh();
            }
            return existing;
        }
        
        this.buffs.push(buff);
        this.buffMap.set(buffId, buff);
        
        // 应用属性加成
        this.applyStatBuffs(buff);
        
        return buff;
    }
    
    remove(buffId) {
        const buff = this.buffMap.get(buffId);
        if (buff) {
            this.removeStatBuffs(buff);
            this.buffs = this.buffs.filter(b => b.id !== buffId);
            this.buffMap.delete(buffId);
        }
    }
    
    has(buffId) {
        return this.buffMap.has(buffId);
    }
    
    get(buffId) {
        return this.buffMap.get(buffId);
    }
    
    update() {
        const expired = [];
        
        for (const buff of this.buffs) {
            if (buff.update()) {
                expired.push(buff.id);
            }
        }
        
        for (const id of expired) {
            this.remove(id);
        }
    }
    
    clear() {
        this.buffs = [];
        this.buffMap.clear();
    }
    
    clearDebuffs() {
        const debuffs = this.buffs.filter(b => b.isDebuff());
        for (const debuff of debuffs) {
            this.remove(debuff.id);
        }
    }
    
    applyStatBuffs(buff) {
        if (!buff.def.stats || !this.entity.applyBuffStat) return;
        this.entity.applyBuffStat(buff.def.stats, buff.isBuff() ? 1 : -1);
    }
    
    removeStatBuffs(buff) {
        if (!buff.def.stats || !this.entity.removeBuffStat) return;
        this.entity.removeBuffStat(buff.def.stats);
    }
    
    getAllBuffs() {
        return [...this.buffs];
    }
    
    getBuffsByType(type) {
        return this.buffs.filter(b => b.def.type === type);
    }
    
    getActiveBuffNames() {
        return this.buffs.map(b => b.getName());
    }
    
    getDebuffCount() {
        return this.buffs.filter(b => b.isDebuff()).length;
    }
}

export { Buff, BuffManager, BUFF_DEFINITIONS };
