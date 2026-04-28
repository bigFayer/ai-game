/**
 * 符文之地 - 敌人系统
 * 敌人生成 + AI + 首领战
 */

import { ElementType } from './combat.js';
import { CharacterClass } from './player.js';

// ==================== 敌人类 ====================
class Enemy {
    constructor(data) {
        this.id = data.id || crypto.randomUUID();
        this.name = data.name;
        this.level = data.level || 1;
        this.description = data.description || '';
        
        // 属性
        this.maxHp = data.hp || 50;
        this.hp = this.maxHp;
        this.maxMp = data.mp || 30;
        this.mp = this.maxMp;
        this.atk = data.atk || 10;
        this.def = data.def || 5;
        this.spd = data.spd || 8;
        this.luk = data.luk || 5;
        
        // 战斗属性
        this.critRate = data.critRate || 5;
        this.critDamage = data.critDamage || 150;
        
        // 掉落
        this.exp = data.exp || Math.floor(10 * this.level);
        this.gold = data.gold || Math.floor(5 * this.level);
        this.drops = data.drops || [];
        this.dropRate = data.dropRate || 0.3;
        
        // 类型和元素
        this.type = data.type || 'normal';
        this.element = data.element || ElementType.PHYSICAL;
        this.weakness = data.weakness || null; // 弱点
        
        // AI配置
        this.behavior = data.behavior || 'balanced'; // aggressive/balanced/defensive/passive
        this.skills = data.skills || ['attack'];
        this.skillWeights = data.skillWeights || { attack: 1 };
        
        // 状态
        this.isDefending = false;
        this.statusEffects = [];
        this.elementalAura = null;
        
        // 特殊能力
        this.abilities = data.abilities || [];
        this.isBoss = data.isBoss || false;
        this.phases = data.phases || null; // 首领多阶段
        
        // 表情
        this.mood = 'normal';
        this.moodTimer = 0;
    }
    
    init() {
        // 初始化首领
        if (this.isBoss && this.phases) {
            this.currentPhase = 0;
            this.applyPhase(0);
        }
    }
    
    applyPhase(phaseIndex) {
        if (!this.phases || !this.phases[phaseIndex]) return;
        
        const phase = this.phases[phaseIndex];
        this.currentPhase = phaseIndex;
        this.maxHp = phase.hp || this.maxHp;
        this.hp = this.maxHp;
        this.skills = phase.skills || this.skills;
        
        console.log(`[Enemy] ${this.name} 进入阶段 ${phaseIndex + 1}`);
    }
    
    takeDamage(damage, element = ElementType.PHYSICAL) {
        // 弱点加成
        if (this.weakness === element) {
            damage = Math.floor(damage * 1.5);
            console.log(`[Enemy] 弱点攻击！伤害+50%`);
        }
        
        // 防御姿态减伤
        if (this.isDefending) {
            damage = Math.floor(damage * 0.5);
        }
        
        // 防御属性减伤
        damage = Math.max(1, damage - Math.floor(this.def / 2));
        
        // 暴击判定
        const isCrit = Math.random() * 100 < this.critRate;
        if (isCrit) {
            damage = Math.floor(damage * this.critDamage / 100);
        }
        
        this.hp = Math.max(0, this.hp - damage);
        
        return { damage, isCrit, died: this.hp <= 0 };
    }
    
    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }
    
    defend() {
        this.isDefending = true;
    }
    
    endTurn() {
        this.isDefending = false;
        
        // 清除临时效果
        this.statusEffects = this.statusEffects.filter(e => {
            e.duration--;
            return e.duration > 0;
        });
        
        // 元素附魔衰减
        if (this.elementalAura && Math.random() < 0.5) {
            this.elementalAura = null;
        }
    }
    
    decideAction(player, combatSystem) {
        // 基础攻击
        let action = { type: 'attack' };
        
        // HP低时可能逃跑
        if (this.hp < this.maxHp * 0.2 && Math.random() < 0.2) {
            action = { type: 'flee' };
        }
        
        // HP低时治疗
        if (this.hp < this.maxHp * 0.3 && this.mp >= 10 && Math.random() < 0.3) {
            const healSkill = this.skills.find(s => s.includes('heal') || s.includes('restore'));
            if (healSkill) {
                action = { type: 'skill', skill: this.getSkillData(healSkill) };
            }
        }
        
        // 检查技能使用
        if (this.mp >= 10 && this.skills.length > 0 && Math.random() < 0.4) {
            const skill = this.chooseSkill();
            if (skill) {
                action = { type: 'skill', skill: skill };
            }
        }
        
        // 防御行为
        if (this.behavior === 'defensive' && this.hp < this.maxHp * 0.5 && Math.random() < 0.3) {
            action = { type: 'defend' };
        }
        
        // 设置元素附魔
        if (action.type === 'skill' && action.skill?.element) {
            this.elementalAura = action.skill.element;
        }
        
        return action;
    }
    
    chooseSkill() {
        const availableSkills = this.skills.filter(skillId => {
            const skill = this.getSkillData(skillId);
            return skill && (!skill.mpCost || this.mp >= skill.mpCost);
        });
        
        if (availableSkills.length === 0) return null;
        
        // 根据权重选择
        const weights = availableSkills.map(s => this.skillWeights?.[s] || 1);
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < availableSkills.length; i++) {
            random -= weights[i];
            if (random <= 0) return this.getSkillData(availableSkills[i]);
        }
        
        return this.getSkillData(availableSkills[0]);
    }
    
    getSkillData(skillId) {
        const skills = {
            // 通用技能
            'attack': { name: '攻击', mpCost: 0, effect: { damage: this.atk } },
            'power_attack': { name: '强力攻击', mpCost: 5, effect: { damage: Math.floor(this.atk * 1.5) } },
            'heal': { name: '治疗', mpCost: 15, effect: { heal: Math.floor(this.maxHp * 0.3) } },
            'fire_attack': { name: '火焰攻击', mpCost: 10, element: ElementType.FIRE, effect: { damage: Math.floor(this.atk * 1.2) } },
            'ice_attack': { name: '冰霜攻击', mpCost: 10, element: ElementType.ICE, effect: { damage: Math.floor(this.atk * 1.2) } },
            // 首领技能
            'boss_slams': { name: '粉碎', mpCost: 20, effect: { damage: Math.floor(this.atk * 2) } },
            'boss_aoe': { name: 'AOE攻击', mpCost: 25, effect: { damage: Math.floor(this.atk * 1.5) } },
        };
        return skills[skillId] || null;
    }
    
    applyStatus(type, duration, value) {
        this.statusEffects.push({ type, duration, value });
    }
    
    getStatus() {
        return {
            name: this.name,
            hp: this.hp,
            maxHp: this.maxHp,
            level: this.level,
            isBoss: this.isBoss,
            statusEffects: this.statusEffects
        };
    }
}

// ==================== 敌人管理器 ====================
class EnemyManager {
    constructor(game) {
        this.game = game;
        this.enemyTemplates = {};
        this.loadEnemyTemplates();
    }
    
    loadEnemyTemplates() {
        // 预定义敌人模板
        this.enemyTemplates = {
            // 森林地区 (1-10层)
            'forest_wolf': {
                name: '森林狼',
                level: 1,
                hp: 40,
                atk: 8,
                def: 3,
                spd: 12,
                exp: 8,
                gold: 5,
                behavior: 'aggressive',
                skills: ['attack', 'power_attack']
            },
            'forest_goblin': {
                name: '哥布林',
                level: 2,
                hp: 35,
                atk: 10,
                def: 4,
                spd: 9,
                exp: 10,
                gold: 8,
                behavior: 'balanced',
                skills: ['attack']
            },
            'forest_skeleton': {
                name: '骷髅战士',
                level: 3,
                hp: 55,
                atk: 12,
                def: 6,
                spd: 7,
                exp: 15,
                gold: 12,
                behavior: 'defensive',
                skills: ['attack', 'defend']
            },
            'forest_spider': {
                name: '剧毒蜘蛛',
                level: 4,
                hp: 45,
                atk: 14,
                def: 4,
                spd: 11,
                exp: 18,
                gold: 15,
                behavior: 'aggressive',
                skills: ['attack'],
                abilities: ['poison']
            },
            'forest_bear': {
                name: '森林熊',
                level: 6,
                hp: 100,
                atk: 18,
                def: 10,
                spd: 6,
                exp: 30,
                gold: 25,
                behavior: 'aggressive',
                skills: ['attack', 'power_attack']
            },
            // 沙漠地区 (11-20层)
            'desert_scorpion': {
                name: '沙漠蝎子',
                level: 11,
                hp: 80,
                atk: 20,
                def: 8,
                spd: 14,
                exp: 40,
                gold: 35,
                behavior: 'aggressive',
                skills: ['attack', 'power_attack'],
                weakness: ElementType.ICE
            },
            'desert_mummy': {
                name: '木乃伊',
                level: 13,
                hp: 120,
                atk: 22,
                def: 15,
                spd: 5,
                exp: 50,
                gold: 40,
                behavior: 'defensive',
                skills: ['attack', 'heal'],
                abilities: ['regen']
            },
            'desert_sandworm': {
                name: '沙虫',
                level: 15,
                hp: 90,
                atk: 28,
                def: 6,
                spd: 10,
                exp: 60,
                gold: 50,
                behavior: 'aggressive',
                skills: ['attack', 'power_attack']
            },
            // 冰霜地区 (21-30层)
            'ice_golem': {
                name: '冰霜傀儡',
                level: 22,
                hp: 180,
                atk: 25,
                def: 20,
                spd: 4,
                exp: 80,
                gold: 60,
                behavior: 'defensive',
                skills: ['attack', 'defend', 'ice_attack'],
                weakness: ElementType.FIRE,
                element: ElementType.ICE
            },
            'ice_wraith': {
                name: '冰霜幽魂',
                level: 25,
                hp: 100,
                atk: 30,
                def: 8,
                spd: 18,
                exp: 90,
                gold: 70,
                behavior: 'aggressive',
                skills: ['attack', 'ice_attack'],
                abilities: ['phase'],
                weakness: ElementType.FIRE,
                element: ElementType.ICE
            },
            // 火焰地区 (31-40层)
            'fire_imp': {
                name: '火焰小鬼',
                level: 32,
                hp: 110,
                atk: 28,
                def: 10,
                spd: 15,
                exp: 95,
                gold: 75,
                behavior: 'aggressive',
                skills: ['attack', 'fire_attack'],
                weakness: ElementType.ICE,
                element: ElementType.FIRE
            },
            'fire_drake': {
                name: '火龙',
                level: 35,
                hp: 200,
                atk: 35,
                def: 15,
                spd: 12,
                exp: 120,
                gold: 100,
                behavior: 'balanced',
                skills: ['attack', 'fire_attack', 'power_attack'],
                weakness: ElementType.ICE,
                element: ElementType.FIRE
            },
            // 虚空地区 (41-50层)
            'void_abomination': {
                name: '虚空异兽',
                level: 42,
                hp: 250,
                atk: 38,
                def: 18,
                spd: 10,
                exp: 150,
                gold: 120,
                behavior: 'aggressive',
                skills: ['attack', 'power_attack'],
                weakness: ElementType.HOLY,
                element: ElementType.VOID
            },
            'void_lich': {
                name: '巫妖领主',
                level: 45,
                hp: 180,
                atk: 32,
                def: 12,
                spd: 14,
                exp: 180,
                gold: 150,
                behavior: 'balanced',
                skills: ['attack', 'fire_attack', 'ice_attack', 'heal'],
                abilities: ['resurrect'],
                weakness: ElementType.HOLY,
                element: ElementType.VOID
            },
            // 首领
            'boss_forest_troll': {
                name: '森林巨魔首领',
                level: 10,
                hp: 500,
                atk: 30,
                def: 20,
                spd: 5,
                exp: 200,
                gold: 200,
                isBoss: true,
                behavior: 'defensive',
                skills: ['attack', 'power_attack', 'heal'],
                drops: [
                    { id: 'troll_hammer', name: '巨魔之锤', type: 'weapon', rarity: 'rare', stats: { atk: 15 } },
                    { id: 'troll_leather', name: '巨魔皮甲', type: 'armor', rarity: 'rare', stats: { def: 12 } }
                ],
                dropRate: 1.0
            },
            'boss_desert_pharaoh': {
                name: '沙漠法老王',
                level: 20,
                hp: 800,
                atk: 40,
                def: 25,
                spd: 8,
                exp: 400,
                gold: 400,
                isBoss: true,
                behavior: 'balanced',
                skills: ['attack', 'fire_attack', 'ice_attack', 'heal', 'boss_aoe'],
                phases: [
                    { hp: 800, skills: ['attack', 'fire_attack'] },
                    { hp: 400, skills: ['fire_attack', 'ice_attack', 'boss_aoe'] },
                    { hp: 200, skills: ['fire_attack', 'ice_attack', 'heal', 'boss_aoe'] }
                ],
                weakness: ElementType.ICE,
                element: ElementType.FIRE,
                drops: [
                    { id: 'pharaoh_staff', name: '法老权杖', type: 'weapon', rarity: 'epic', stats: { atk: 25, mp: 30 } },
                    { id: 'pharaoh_crown', name: '法老王冠', type: 'helmet', rarity: 'epic', stats: { def: 15, luk: 10 } }
                ],
                dropRate: 1.0
            },
            'boss_ice_dragon': {
                name: '冰霜巨龙',
                level: 30,
                hp: 1200,
                atk: 50,
                def: 30,
                spd: 10,
                exp: 600,
                gold: 600,
                isBoss: true,
                behavior: 'aggressive',
                skills: ['attack', 'ice_attack', 'boss_slams', 'boss_aoe'],
                weakness: ElementType.FIRE,
                element: ElementType.ICE,
                phases: [
                    { hp: 1200, skills: ['attack', 'ice_attack'] },
                    { hp: 800, skills: ['ice_attack', 'boss_slams'] },
                    { hp: 400, skills: ['boss_slams', 'boss_aoe'] }
                ],
                drops: [
                    { id: 'ice_dragon_scale', name: '冰龙鳞片', type: 'armor', rarity: 'legendary', stats: { def: 25, iceResist: 50 } },
                    { id: 'ice_dragon_sword', name: '冰龙剑', type: 'weapon', rarity: 'legendary', stats: { atk: 35, iceResist: 30 } }
                ],
                dropRate: 1.0
            },
            'boss_fire_lord': {
                name: '火焰领主',
                level: 40,
                hp: 1500,
                atk: 55,
                def: 35,
                spd: 8,
                exp: 800,
                gold: 800,
                isBoss: true,
                behavior: 'aggressive',
                skills: ['attack', 'fire_attack', 'boss_slams', 'boss_aoe', 'heal'],
                weakness: ElementType.ICE,
                element: ElementType.FIRE,
                phases: [
                    { hp: 1500, skills: ['attack', 'fire_attack'] },
                    { hp: 1000, skills: ['fire_attack', 'boss_slams'] },
                    { hp: 500, skills: ['boss_slams', 'boss_aoe', 'heal'] }
                ],
                drops: [
                    { id: 'fire_lord_sword', name: '炎魔剑', type: 'weapon', rarity: 'legendary', stats: { atk: 45, fireResist: 50 } },
                    { id: 'fire_lord_armor', name: '炎魔甲', type: 'armor', rarity: 'legendary', stats: { def: 35, fireResist: 75 } }
                ],
                dropRate: 1.0
            },
            'boss_void_overlord': {
                name: '虚空君主',
                level: 50,
                hp: 2000,
                atk: 65,
                def: 40,
                spd: 12,
                exp: 1000,
                gold: 1000,
                isBoss: true,
                behavior: 'balanced',
                skills: ['attack', 'fire_attack', 'ice_attack', 'heal', 'boss_slams', 'boss_aoe'],
                weakness: ElementType.HOLY,
                element: ElementType.VOID,
                abilities: ['phase', 'resurrect'],
                phases: [
                    { hp: 2000, skills: ['attack', 'fire_attack', 'ice_attack'] },
                    { hp: 1400, skills: ['fire_attack', 'boss_slams'] },
                    { hp: 800, skills: ['boss_slams', 'boss_aoe'] },
                    { hp: 300, skills: ['boss_aoe', 'heal', 'fire_attack', 'ice_attack'] }
                ],
                drops: [
                    { id: 'void_crown', name: '虚空王冠', type: 'helmet', rarity: 'mythic', stats: { atk: 30, def: 30, luk: 20, voidResist: 75 } },
                    { id: 'void_sword', name: '虚空之刃', type: 'weapon', rarity: 'mythic', stats: { atk: 55, luk: 15, voidResist: 50 } }
                ],
                dropRate: 1.0
            }
        };
    }
    
    generateEnemy(floor, biome) {
        // 根据层数和地区选择敌人
        const biomePrefix = {
            'forest': 'forest_',
            'desert': 'desert_',
            'ice': 'ice_',
            'fire': 'fire_',
            'void': 'void_'
        }[biome] || 'forest_';
        
        // 普通敌人
        const normalTemplates = Object.entries(this.enemyTemplates)
            .filter(([key, e]) => !e.isBoss && key.startsWith(biomePrefix))
            .map(([key, e]) => ({ key, ...e }));
        
        if (normalTemplates.length === 0) {
            // 默认敌人
            const defaultEnemy = new Enemy({
                name: '史莱姆',
                level: floor,
                hp: 30 + floor * 5,
                atk: 5 + floor * 2,
                def: 2 + floor,
                spd: 8 + Math.floor(floor / 5),
                exp: 5 + floor * 2,
                gold: 3 + floor
            });
            return defaultEnemy;
        }
        
        // 选择随机敌人
        const template = normalTemplates[Math.floor(Math.random() * normalTemplates.length)];
        const scaledEnemy = this.scaleEnemy(template, floor);
        
        return new Enemy(scaledEnemy);
    }
    
    generateBoss(floor, biome) {
        const bossKeys = {
            'forest': 'boss_forest_troll',
            'desert': 'boss_desert_pharaoh',
            'ice': 'boss_ice_dragon',
            'fire': 'boss_fire_lord',
            'void': 'boss_void_overlord'
        };
        
        const bossKey = bossKeys[biome];
        const template = this.enemyTemplates[bossKey];
        
        if (!template) return this.generateEnemy(floor, biome);
        
        const scaledBoss = this.scaleEnemy(template, floor);
        return new Enemy(scaledBoss);
    }
    
    scaleEnemy(template, floor) {
        const scaleFactor = 1 + (floor - 1) * 0.15;
        
        return {
            ...template,
            level: floor,
            hp: Math.floor((template.hp || 50) * scaleFactor),
            maxHp: Math.floor((template.hp || 50) * scaleFactor),
            atk: Math.floor((template.atk || 10) * scaleFactor),
            def: Math.floor((template.def || 5) * scaleFactor),
            exp: Math.floor((template.exp || 10) * scaleFactor),
            gold: Math.floor((template.gold || 5) * scaleFactor)
        };
    }
    
    getEnemyCount(floor) {
        // 每层敌人数量
        if (floor <= 10) return 3;
        if (floor <= 20) return 4;
        if (floor <= 30) return 5;
        if (floor <= 40) return 6;
        return 7;
    }
}

// 导出
export { Enemy, EnemyManager };
