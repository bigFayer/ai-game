/**
 * 符文之地 - 玩家系统
 * 4职业 × 属性 × 装备 × 技能
 */

import { ItemType, EquipSlot } from './items.js';
import { ElementType } from './combat.js';

// ==================== 职业枚举 ====================
const CharacterClass = {
    WARRIOR: 'warrior',
    MAGE: 'mage',
    RANGER: 'ranger',
    CLERIC: 'cleric'
};

// ==================== 职业属性配置 ====================
const CLASS_STATS = {
    [CharacterClass.WARRIOR]: {
        name: '战士',
        description: '高攻物理，厚血量',
        color: '#ff6b6b',
        baseHP: 150,
        baseMP: 30,
        baseATK: 25,
        baseDEF: 15,
        baseSPD: 8,
        baseLUK: 5,
        hpGrowth: 20,
        mpGrowth: 5,
        atkGrowth: 5,
        defGrowth: 3,
        spdGrowth: 1,
        lukGrowth: 1,
        statPriority: ['hp', 'atk', 'def', 'spd'],
        baseSkills: ['slash', 'shield_bash', 'battle_cry'],
        skillPointsPerLevel: 1
    },
    [CharacterClass.MAGE]: {
        name: '法师',
        description: '元素魔法，高爆发',
        color: '#6b9fff',
        baseHP: 80,
        baseMP: 100,
        baseATK: 10,
        baseDEF: 6,
        baseSPD: 10,
        baseLUK: 8,
        hpGrowth: 10,
        mpGrowth: 15,
        atkGrowth: 2,
        defGrowth: 1,
        spdGrowth: 2,
        lukGrowth: 2,
        statPriority: ['mp', 'atk', 'spd', 'hp'],
        baseSkills: ['fireball', 'ice_shard', 'lightning'],
        skillPointsPerLevel: 1
    },
    [CharacterClass.RANGER]: {
        name: '游侠',
        description: '敏捷暴击，高闪避',
        color: '#6bff6b',
        baseHP: 100,
        baseMP: 50,
        baseATK: 18,
        baseDEF: 10,
        baseSPD: 18,
        baseLUK: 15,
        hpGrowth: 12,
        mpGrowth: 8,
        atkGrowth: 4,
        defGrowth: 2,
        spdGrowth: 3,
        lukGrowth: 3,
        statPriority: ['spd', 'atk', 'luk', 'hp'],
        baseSkills: ['quick_shot', 'multi_shot', 'trap'],
        skillPointsPerLevel: 1
    },
    [CharacterClass.CLERIC]: {
        name: '圣职',
        description: '治疗辅助，平衡',
        color: '#ffd700',
        baseHP: 110,
        baseMP: 70,
        baseATK: 12,
        baseDEF: 12,
        baseSPD: 9,
        baseLUK: 10,
        hpGrowth: 15,
        mpGrowth: 12,
        atkGrowth: 3,
        defGrowth: 3,
        spdGrowth: 2,
        lukGrowth: 2,
        statPriority: ['hp', 'mp', 'def', 'luk'],
        baseSkills: ['heal', 'holy_bolt', 'bless'],
        skillPointsPerLevel: 1
    }
};

// ==================== 玩家类 ====================
class Player {
    constructor(characterClass) {
        const stats = CLASS_STATS[characterClass];
        if (!stats) throw new Error(`Unknown class: ${characterClass}`);
        
        // 基础信息
        this.id = crypto.randomUUID();
        this.name = '冒险者';
        this.characterClass = characterClass;
        this.characterClassName = stats.name;
        this.level = 1;
        this.exp = 0;
        this.expToNextLevel = this.calcExpToLevel(1);
        this.skillPoints = 0;
        this.attributePoints = 0;
        
        // 战斗属性(基础值)
        this.maxHp = stats.baseHP;
        this.hp = this.maxHp;
        this.maxMp = stats.baseMP;
        this.mp = this.maxMp;
        this.atk = stats.baseATK;
        this.def = stats.baseDEF;
        this.spd = stats.baseSPD;
        this.luk = stats.baseLUK;
        
        // 战斗属性(加成，来自装备/技能/状态)
        this.bonusHP = 0;
        this.bonusMP = 0;
        this.bonusATK = 0;
        this.bonusDEF = 0;
        this.bonusSPD = 0;
        this.bonusLUK = 0;
        
        // 元素抗性
        this.elementResists = {
            [ElementType.FIRE]: 0,
            [ElementType.ICE]: 0,
            [ElementType.LIGHTNING]: 0,
            [ElementType.VOID]: 0,
            [ElementType.HOLY]: 0,
            physical: 0
        };
        
        // 暴击
        this.critRate = 5;
        this.critDamage = 150;
        this.critRateBonus = 0;
        this.critDamageBonus = 0;
        
        // 回避
        this.evasion = 0;
        this.evasionBonus = 0;
        
        // 资源
        this.gold = 50;
        this.floor = 1;
        this.biome = 'forest';
        
        // 位置
        this.x = 5;
        this.y = 5;
        this.mapX = 5;
        this.mapY = 5;
        
        // 战斗状态
        this.isDefending = false;
        this.isProne = false;
        this.isParalyzed = false;
        this.isFrozen = false;
        this.isBurning = false;
        this.isPoisoned = false;
        this.isBuffed = false;
        this.isSilenced = false;
        this.statusEffects = [];
        
        // 连击
        this.combo = 0;
        this.maxCombo = 0;
        this.comboTimer = 0;
        this.lastAction = null;
        this.actionHistory = [];
        
        // 装备槽位
        this.equipment = {
            [EquipSlot.WEAPON]: null,
            [EquipSlot.ARMOR]: null,
            [EquipSlot.HELMET]: null,
            [EquipSlot.GLOVES]: null,
            [EquipSlot.BOOTS]: null,
            [EquipSlot.ACCESSORY1]: null,
            [EquipSlot.ACCESSORY2]: null
        };
        
        // 背包
        this.inventory = [];
        this.maxInventorySize = 30;
        
        // 已学技能
        this.learnedSkills = [...stats.baseSkills];
        this.equippedSkills = [...stats.baseSkills].slice(0, 4);
        this.skillCooldowns = {};
        
        // 天赋
        this.talents = {};
        
        // 统计数据
        this.stats = {
            totalDamageDealt: 0,
            totalDamageTaken: 0,
            totalHealing: 0,
            enemiesDefeated: 0,
            floorsCleared: 0,
            goldEarned: 0,
            itemsUsed: 0,
            criticalHits: 0,
            combosAchieved: 0,
            deaths: 0,
            gamesPlayed: 1
        };
        
        // 任务进度
        this.questProgress = {};
        
        // 成就进度
        this.achievementProgress = {};
    }
    
    // ==================== 派生属性 ====================
    get totalMaxHP() { return this.maxHp + this.bonusHP; }
    get totalMaxMP() { return this.maxMp + this.bonusMP; }
    get totalATK() { return this.atk + this.bonusATK; }
    get totalDEF() { return this.def + this.bonusDEF; }
    get totalSPD() { return this.spd + this.bonusSPD; }
    get totalLUK() { return this.luk + this.bonusLUK; }
    get totalCritRate() { return Math.min(95, this.critRate + this.critRateBonus); }
    get totalCritDamage() { return this.critDamage + this.critDamageBonus; }
    get totalEvasion() { return Math.min(75, this.evasion + this.evasionBonus); }
    
    // ==================== 经验与升级 ====================
    calcExpToLevel(level) {
        return Math.floor(100 * Math.pow(level, 1.5));
    }
    
    addExp(amount) {
        if (amount <= 0) return { leveledUp: false };
        
        this.exp += amount;
        let leveledUp = false;
        let newLevels = 0;
        
        while (this.exp >= this.expToNextLevel) {
            this.exp -= this.expToNextLevel;
            this.levelUp();
            leveledUp = true;
            newLevels++;
        }
        
        return { leveledUp, newLevels, currentExp: this.exp, expToNext: this.expToNextLevel };
    }
    
    levelUp() {
        this.level++;
        this.expToNextLevel = this.calcExpToLevel(this.level);
        
        const classStats = CLASS_STATS[this.characterClass];
        
        // 应用属性成长
        this.maxHp += classStats.hpGrowth;
        this.maxMp += classStats.mpGrowth;
        this.atk += classStats.atkGrowth;
        this.def += classStats.defGrowth;
        this.spd += classStats.spdGrowth;
        this.luk += classStats.lukGrowth;
        
        // 全量恢复
        this.hp = this.totalMaxHP;
        this.mp = this.totalMaxMP;
        
        // 获得技能点
        this.skillPoints += classStats.skillPointsPerLevel;
        
        console.log(`[Player] Lv.${this.level}: HP+${classStats.hpGrowth} MP+${classStats.mpGrowth} ATK+${classStats.atkGrowth}`);
    }
    
    // ==================== 战斗方法 ====================
    takeDamage(damage, element = ElementType.PHYSICAL) {
        // 防御姿态减伤
        let actualDamage = this.isDefending 
            ? Math.floor(damage * CONFIG.COMBAT.DEFEND_DAMAGE_REDUCTION) 
            : damage;
        
        // 元素抗性
        const resist = this.elementResists[element] || 0;
        actualDamage = Math.floor(actualDamage * (1 - resist / 100));
        
        // 最小伤害
        actualDamage = Math.max(CONFIG.COMBAT.MIN_DAMAGE, actualDamage);
        
        // 闪避判定
        if (Math.random() * 100 < this.totalEvasion) {
            console.log('[Player] 闪避了攻击！');
            this.showMessage('闪避！');
            return { damage: 0, blocked: false, evaded: true, crit: false };
        }
        
        this.hp = Math.max(0, this.hp - actualDamage);
        this.stats.totalDamageTaken += actualDamage;
        
        // 重置连击
        this.combo = 0;
        
        return { damage: actualDamage, blocked: this.isDefending, evaded: false, crit: false };
    }
    
    heal(amount) {
        const actualHeal = Math.min(amount, this.totalMaxHP - this.hp);
        this.hp += actualHeal;
        this.stats.totalHealing += actualHeal;
        return actualHeal;
    }
    
    useMP(amount) {
        if (this.mp >= amount) {
            this.mp -= amount;
            return true;
        }
        return false;
    }
    
    restoreMP(amount) {
        this.mp = Math.min(this.totalMaxMP, this.mp + amount);
    }
    
    attack(target) {
        // 基础伤害
        let damage = this.totalATK;
        
        // 防御减伤
        damage = Math.max(1, damage - target.totalDEF);
        
        // 暴击判定
        const isCrit = Math.random() * 100 < this.totalCritRate;
        if (isCrit) {
            damage = Math.floor(damage * this.totalCritDamage / 100);
            this.stats.criticalHits++;
        }
        
        // 连击累积
        if (this.lastAction === 'attack') {
            this.combo++;
            if (this.combo > this.maxCombo) {
                this.maxCombo = this.combo;
                if (this.combo >= 10) {
                    this.stats.combosAchieved++;
                }
            }
        } else {
            this.combo = 1;
        }
        this.comboTimer = 3; // 3秒内不攻击则重置
        
        // 记录动作
        this.lastAction = 'attack';
        this.actionHistory.push('attack');
        if (this.actionHistory.length > 5) this.actionHistory.shift();
        
        // 应用伤害
        const result = target.takeDamage(damage);
        
        this.stats.totalDamageDealt += result.damage;
        
        return { damage: result.damage, isCrit, isKill: result.died, combo: this.combo };
    }
    
    useSkill(skillId, targets) {
        if (this.isSilenced) {
            this.showMessage('被沉默了！');
            return null;
        }
        
        const cooldown = this.skillCooldowns[skillId] || 0;
        if (cooldown > 0) {
            this.showMessage(`技能冷却中: ${cooldown.toFixed(1)}秒`);
            return null;
        }
        
        // 执行技能(由SkillManager处理具体逻辑)
        // 这里只处理通用部分
        
        // 记录动作
        this.lastAction = 'skill';
        this.combo = Math.max(1, this.combo);
        this.actionHistory.push('skill');
        if (this.actionHistory.length > 5) this.actionHistory.shift();
        
        // 设置冷却
        this.skillCooldowns[skillId] = 3; // 默认3秒
        
        return { success: true, skillId };
    }
    
    defend() {
        this.isDefending = true;
        this.lastAction = 'defend';
        this.combo = 0;
        return true;
    }
    
    endDefend() {
        this.isDefending = false;
    }
    
    // ==================== 装备系统 ====================
    equipItem(item) {
        if (!item || !item.equipSlot) return false;
        
        const slot = item.equipSlot;
        const oldItem = this.equipment[slot];
        
        // 卸下旧装备
        if (oldItem) {
            this.unequipItem(slot);
        }
        
        // 装备新物品
        this.equipment[slot] = item;
        
        // 应用属性加成
        if (item.stats) {
            if (item.stats.hp) this.bonusHP += item.stats.hp;
            if (item.stats.mp) this.bonusMP += item.stats.mp;
            if (item.stats.atk) this.bonusATK += item.stats.atk;
            if (item.stats.def) this.bonusDEF += item.stats.def;
            if (item.stats.spd) this.bonusSPD += item.stats.spd;
            if (item.stats.luk) this.bonusLUK += item.stats.luk;
            if (item.stats.critRate) this.critRateBonus += item.stats.critRate;
            if (item.stats.critDamage) this.critDamageBonus += item.stats.critDamage;
            if (item.stats.evasion) this.evasionBonus += item.stats.evasion;
        }
        
        // 应用元素抗性
        if (item.elementResists) {
            for (const [elem, value] of Object.entries(item.elementResists)) {
                this.elementResists[elem] = (this.elementResists[elem] || 0) + value;
            }
        }
        
        // 从背包移除
        const invIndex = this.inventory.findIndex(inv => inv.item.id === item.id);
        if (invIndex >= 0) {
            if (this.inventory[invIndex].quantity > 1) {
                this.inventory[invIndex].quantity--;
            } else {
                this.inventory.splice(invIndex, 1);
            }
        }
        
        console.log(`[Player] 装备: ${item.name}`);
        return true;
    }
    
    unequipItem(slot) {
        const item = this.equipment[slot];
        if (!item) return false;
        
        // 检查背包空间
        if (!this.canAddToInventory()) {
            this.showMessage('背包已满！');
            return false;
        }
        
        // 移除属性加成
        if (item.stats) {
            if (item.stats.hp) this.bonusHP -= item.stats.hp;
            if (item.stats.mp) this.bonusMP -= item.stats.mp;
            if (item.stats.atk) this.bonusATK -= item.stats.atk;
            if (item.stats.def) this.bonusDEF -= item.stats.def;
            if (item.stats.spd) this.bonusSPD -= item.stats.spd;
            if (item.stats.luk) this.bonusLUK -= item.stats.luk;
            if (item.stats.critRate) this.critRateBonus -= item.stats.critRate;
            if (item.stats.critDamage) this.critDamageBonus -= item.stats.critDamage;
            if (item.stats.evasion) this.evasionBonus -= item.stats.evasion;
        }
        
        // 移除元素抗性
        if (item.elementResists) {
            for (const [elem, value] of Object.entries(item.elementResists)) {
                this.elementResists[elem] = Math.max(0, (this.elementResists[elem] || 0) - value);
            }
        }
        
        // 放入背包
        this.addItem(item);
        
        // 清空槽位
        this.equipment[slot] = null;
        
        return true;
    }
    
    // ==================== 背包系统 ====================
    canAddToInventory() {
        return this.inventory.length < this.maxInventorySize;
    }
    
    addItem(item, quantity = 1) {
        // 检查是否可堆叠
        if (item.stackable) {
            const existing = this.inventory.find(inv => inv.item.id === item.id);
            if (existing) {
                existing.quantity += quantity;
                return true;
            }
        }
        
        // 检查空间
        if (!this.canAddToInventory()) {
            return false;
        }
        
        this.inventory.push({ item: { ...item }, quantity });
        return true;
    }
    
    removeItem(itemId, quantity = 1) {
        const index = this.inventory.findIndex(inv => inv.item.id === itemId);
        if (index < 0) return null;
        
        const invItem = this.inventory[index];
        if (invItem.quantity > quantity) {
            invItem.quantity -= quantity;
        } else {
            this.inventory.splice(index, 1);
        }
        
        return invItem.item;
    }
    
    useItem(itemId) {
        const invIndex = this.inventory.findIndex(inv => inv.item.id === itemId);
        if (invIndex < 0) return false;
        
        const invItem = this.inventory[invIndex];
        const item = invItem.item;
        
        if (item.type !== ItemType.CONSUMABLE) {
            return false;
        }
        
        // 应用物品效果
        if (item.effect) {
            if (item.effect.hp) this.heal(item.effect.hp);
            if (item.effect.mp) this.restoreMP(item.effect.mp);
        }
        
        // 消耗物品
        this.stats.itemsUsed++;
        this.removeItem(itemId, 1);
        
        return true;
    }
    
    // ==================== 位置 ====================
    moveTo(x, y) {
        this.x = x;
        this.y = y;
        this.mapX = x;
        this.mapY = y;
    }
    
    enterDungeon(floor, biome) {
        this.floor = floor;
        this.biome = biome;
        this.stats.floorsCleared++;
    }
    
    // ==================== 状态效果 ====================
    applyStatus(type, duration, value = 0, source = null) {
        // 检查是否免疫
        if (type === 'poison' && this.elementResists.void > 50) return false;
        if (type === 'burn' && this.elementResists.fire > 50) return false;
        if (type === 'freeze' && this.elementResists.ice > 50) return false;
        
        // 移除同类效果
        this.statusEffects = this.statusEffects.filter(s => s.type !== type);
        
        // 添加新效果
        this.statusEffects.push({ type, duration, maxDuration: duration, value, source });
        
        return true;
    }
    
    updateStatus(dt) {
        this.statusEffects = this.statusEffects.filter(effect => {
            effect.duration -= dt;
            
            // 每秒处理一次效果
            if (Math.floor(effect.duration + dt) > Math.floor(effect.duration)) {
                switch (effect.type) {
                    case 'poison':
                        this.takeDamage(effect.value, ElementType.VOID);
                        break;
                    case 'burn':
                        this.takeDamage(effect.value, ElementType.FIRE);
                        break;
                    case 'regen':
                        this.heal(effect.value);
                        break;
                }
            }
            
            return effect.duration > 0;
        });
        
        // 更新冷却
        for (const skillId in this.skillCooldowns) {
            this.skillCooldowns[skillId] = Math.max(0, this.skillCooldowns[skillId] - dt);
        }
        
        // 更新连击计时
        if (this.comboTimer > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) {
                this.combo = 0;
            }
        }
        
        // 清除防御姿态(每回合重置)
        this.isDefending = false;
    }
    
    clearNegativeStatus() {
        const negativeTypes = ['poison', 'burn', 'freeze', 'paralyze', 'silence'];
        this.statusEffects = this.statusEffects.filter(e => !negativeTypes.includes(e.type));
    }
    
    hasStatus(type) {
        return this.statusEffects.some(e => e.type === type);
    }
    
    // ==================== 技能系统 ====================
    learnSkill(skillId) {
        if (this.learnedSkills.includes(skillId)) return false;
        if (this.skillPoints <= 0) return false;
        
        this.learnedSkills.push(skillId);
        this.skillPoints--;
        return true;
    }
    
    equipSkill(skillId, slot) {
        if (!this.learnedSkills.includes(skillId)) return false;
        
        // 替换当前槽位技能
        this.equippedSkills[slot] = skillId;
        return true;
    }
    
    // ==================== 消息 ====================
    showMessage(msg) {
        // 由Game类处理显示
        if (this.game) {
            this.game.showNotification(msg);
        }
    }
    
    // ==================== 存档 ====================
    getSaveData() {
        return {
            id: this.id,
            name: this.name,
            characterClass: this.characterClass,
            level: this.level,
            exp: this.exp,
            expToNextLevel: this.expToNextLevel,
            skillPoints: this.skillPoints,
            
            // 属性
            maxHp: this.maxHp,
            hp: this.hp,
            maxMp: this.maxMp,
            mp: this.mp,
            atk: this.atk,
            def: this.def,
            spd: this.spd,
            luk: this.luk,
            
            // 位置
            floor: this.floor,
            biome: this.biome,
            x: this.x,
            y: this.y,
            
            // 装备
            equipment: this.equipment,
            
            // 背包
            inventory: this.inventory,
            
            // 技能
            learnedSkills: this.learnedSkills,
            equippedSkills: this.equippedSkills,
            
            // 统计数据
            stats: this.stats,
            
            // 任务进度
            questProgress: this.questProgress
        };
    }
    
    loadSaveData(data) {
        Object.assign(this, data);
    }
}

// 导出
export { Player, PlayerClass, CLASS_STATS, CharacterClass };
