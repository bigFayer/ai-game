/**
 * 符文之地 - 属性与战斗统计系统
 */

class Stats {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.enemiesKilled = 0;
        this.bossesKilled = 0;
        this.flawlessKills = 0;
        this.floorsExplored = 0;
        this.biomesCompleted = [];
        this.uniqueItemsCollected = new Set();
        this.itemsCollected = 0;
        this.skillsLearned = 0;
        this.questsCompleted = 0;
        this.questsAccepted = 0;
        this.totalGoldEarned = 0;
        this.totalGoldSpent = 0;
        this.totalDamageDealt = 0;
        this.totalDamageTaken = 0;
        this.totalHealingDone = 0;
        this.maxCombo = 0;
        this.highestFloor = 0;
        this.deaths = 0;
        this.highestLevel = 1;
        this.playTime = 0;
        this.sessionsPlayed = 0;
    }
    
    save() {
        return {
            enemiesKilled: this.enemiesKilled,
            bossesKilled: this.bossesKilled,
            flawlessKills: this.flawlessKills,
            floorsExplored: this.floorsExplored,
            biomesCompleted: [...this.biomesCompleted],
            uniqueItemsCollected: [...this.uniqueItemsCollected],
            itemsCollected: this.itemsCollected,
            skillsLearned: this.skillsLearned,
            questsCompleted: this.questsCompleted,
            questsAccepted: this.questsAccepted,
            totalGoldEarned: this.totalGoldEarned,
            totalGoldSpent: this.totalGoldSpent,
            totalDamageDealt: this.totalDamageDealt,
            totalDamageTaken: this.totalDamageTaken,
            totalHealingDone: this.totalHealingDone,
            maxCombo: this.maxCombo,
            highestFloor: this.highestFloor,
            deaths: this.deaths,
            highestLevel: this.highestLevel,
            playTime: this.playTime
        };
    }
    
    load(data) {
        Object.assign(this, data);
        this.uniqueItemsCollected = new Set(data.uniqueItemsCollected || []);
    }
}

class DamageCalculator {
    static calculate(attacker, defender, skill = null) {
        let damage = attacker.atk;
        let damageType = 'physical';
        
        if (skill) {
            damage = attacker.atk * (skill.damagePercent || 1);
            damageType = skill.element || 'physical';
        }
        
        // 防御减伤
        let reduction = defender.def / (defender.def + 100);
        reduction = Math.min(reduction, 0.75); // 最高75%减伤
        
        damage *= (1 - reduction);
        
        // 暴击
        let isCrit = false;
        const critChance = attacker.critRate || 5;
        if (Math.random() * 100 < critChance) {
            isCrit = true;
            damage *= (attacker.critDamage || 150) / 100;
        }
        
        // 元素克制
        if (damageType !== 'physical' && defender.element) {
            const effectiveness = ElementType.WEAKNESS[damageType] === defender.element ? 2.0 : 1.0;
            damage *= effectiveness;
        }
        
        // 随机波动
        damage *= 0.9 + Math.random() * 0.2;
        
        return {
            base: Math.floor(damage),
            final: Math.floor(damage),
            isCrit,
            type: damageType
        };
    }
    
    static calculateMagic(attacker, defender, spell) {
        let damage = attacker.matk || attacker.atk;
        
        if (spell.baseDamage) {
            damage += spell.baseDamage;
        }
        
        damage *= spell.damagePercent || 1;
        
        // 魔法防御减伤
        const mdef = defender.mdef || defender.def || 0;
        let reduction = mdef / (mdef + 100);
        reduction = Math.min(reduction, 0.75);
        
        damage *= (1 - reduction);
        
        // 元素
        if (spell.element) {
            const effectiveness = ElementType.WEAKNESS[spell.element] === defender.element ? 2.0 : 1.0;
            damage *= effectiveness;
        }
        
        damage *= 0.9 + Math.random() * 0.2;
        
        return {
            base: Math.floor(damage),
            final: Math.floor(damage),
            element: spell.element
        };
    }
    
    static calculateDot(dotData, target) {
        return dotData.damage;
    }
}

class CombatLog {
    constructor(maxEntries = 100) {
        this.entries = [];
        this.maxEntries = maxEntries;
    }
    
    add(type, data) {
        this.entries.push({
            type,
            data,
            timestamp: Date.now()
        });
        
        if (this.entries.length > this.maxEntries) {
            this.entries.shift();
        }
    }
    
    addDamage(target, amount, source, isCrit = false) {
        this.add('damage', { target, amount, source, isCrit });
    }
    
    addHeal(target, amount, source) {
        this.add('heal', { target, amount, source });
    }
    
    addStatus(target, status, duration) {
        this.add('status', { target, status, duration });
    }
    
    addDeath(entity) {
        this.add('death', { entity });
    }
    
    getRecent(count = 10) {
        return this.entries.slice(-count);
    }
    
    clear() {
        this.entries = [];
    }
}

class DamageNumber {
    constructor(x, y, value, options = {}) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.color = options.color || '#ffffff';
        this.isCrit = options.isCrit || false;
        this.isHeal = options.isHeal || false;
        this.life = 1.0;
        this.vy = -2;
        this.scale = this.isCrit ? 1.5 : 1.0;
        this.rotation = (Math.random() - 0.5) * 0.5;
    }
    
    update(dt) {
        this.y += this.vy;
        this.vy += 0.1; // 重力
        this.life -= dt;
        
        if (this.life < 0.3) {
            this.scale *= 0.9;
        }
        
        return this.life > 0;
    }
    
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, this.life * 2);
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        
        ctx.font = `bold ${this.isCrit ? 28 : 20}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 描边
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText(this.value, 0, 0);
        
        // 填充
        ctx.fillStyle = this.color;
        ctx.fillText(this.value, 0, 0);
        
        ctx.restore();
    }
}

class DamageNumberManager {
    constructor() {
        this.numbers = [];
    }
    
    add(x, y, value, options = {}) {
        this.numbers.push(new DamageNumber(x, y, value, options));
    }
    
    addDamage(x, y, value, isCrit = false, isHeal = false) {
        let color = '#ff4444';
        if (isCrit) color = '#ff00ff';
        if (isHeal) color = '#44ff44';
        
        this.add(x, y, value, { color, isCrit, isHeal });
    }
    
    update(dt) {
        for (let i = this.numbers.length - 1; i >= 0; i--) {
            if (!this.numbers[i].update(dt)) {
                this.numbers.splice(i, 1);
            }
        }
    }
    
    render(ctx) {
        for (const number of this.numbers) {
            number.render(ctx);
        }
    }
}

export { Stats, DamageCalculator, CombatLog, DamageNumber, DamageNumberManager };
