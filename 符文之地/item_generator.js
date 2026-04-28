/**
 * 符文之地 - 物品生成器
 */

class ItemGenerator {
    constructor(game) {
        this.game = game;
        this.baseItemTemplates = this.initBaseTemplates();
    }
    
    initBaseTemplates() {
        return {
            // 武器模板
            weapons: {
                sword: {
                    baseStats: { atk: 5 },
                    statRange: { atk: [3, 8] },
                    possibleAffixes: ['sharp', 'heavy', 'balanced', 'keen', 'masterwork'],
                    elements: ['fire', 'ice', 'lightning', 'void'],
                    suffixes: {
                        'fire': { element: 'fire', additionalStats: { fireResist: 10 } },
                        'ice': { element: 'ice', additionalStats: { iceResist: 10 } },
                        'lightning': { element: 'lightning', additionalStats: { spd: 3 } },
                        'void': { element: 'void', additionalStats: { luk: 5 } }
                    }
                },
                staff: {
                    baseStats: { atk: 3, mp: 15 },
                    statRange: { atk: [2, 5], mp: [10, 25] },
                    possibleAffixes: ['arcane', 'mystic', 'ancient', 'powerful'],
                    elements: ['fire', 'ice', 'lightning'],
                    suffixes: {
                        'fire': { element: 'fire', additionalStats: { fireDamage: 15 } },
                        'ice': { element: 'ice', additionalStats: { iceDamage: 15 } }
                    }
                },
                bow: {
                    baseStats: { atk: 6, spd: 2 },
                    statRange: { atk: [4, 10], spd: [1, 5] },
                    possibleAffixes: ['swift', 'long_range', 'precise', 'hunter'],
                    elements: ['fire', 'ice'],
                    suffixes: {}
                }
            },
            
            // 防具模板
            armors: {
                chest: {
                    baseStats: { def: 5 },
                    statRange: { def: [3, 10] },
                    possibleAffixes: ['reinforced', 'guardian', 'fortified', 'ancient'],
                    elements: ['fire', 'ice', 'lightning'],
                    suffixes: {
                        'fire': { additionalStats: { fireResist: 20 } },
                        'ice': { additionalStats: { iceResist: 20 } }
                    }
                },
                helmet: {
                    baseStats: { def: 3, hp: 10 },
                    statRange: { def: [2, 6], hp: [5, 20] },
                    possibleAffixes: ['iron', 'steel', 'dragon', 'royal'],
                    elements: [],
                    suffixes: {}
                }
            }
        };
    }
    
    generate(floor, rarity = null) {
        // 决定稀有度
        if (!rarity) {
            rarity = this.rollRarity(floor);
        }
        
        // 决定物品类型
        const type = this.rollItemType();
        
        // 获取模板
        const templates = this.baseItemTemplates[type.category];
        if (!templates) return null;
        
        const template = templates[type.subType];
        if (!template) return null;
        
        // 生成基础物品
        const item = this.createBaseItem(template, type, floor, rarity);
        
        // 添加词缀
        if (rarity.multiplier >= 1.3) {
            this.addAffix(item, template, floor);
        }
        
        // 添加元素后缀
        if (rarity.multiplier >= 1.6 && template.elements.length > 0 && Math.random() < 0.5) {
            const element = template.elements[Math.floor(Math.random() * template.elements.length)];
            this.addElementSuffix(item, template, element);
        }
        
        // 缩放属性
        this.scaleItem(item, floor, rarity);
        
        return item;
    }
    
    rollRarity(floor) {
        const roll = Math.random();
        const floorBonus = Math.min(floor * 0.003, 0.1);
        
        if (roll < 0.0003 + floorBonus && floor >= 40) return { name: 'MYTHIC', multiplier: 3.0, color: '#ffd700' };
        if (roll < 0.003 + floorBonus && floor >= 30) return { name: 'LEGENDARY', multiplier: 2.5, color: '#ff8800' };
        if (roll < 0.015 + floorBonus && floor >= 20) return { name: 'EPIC', multiplier: 2.0, color: '#aa00ff' };
        if (roll < 0.06 + floorBonus && floor >= 10) return { name: 'RARE', multiplier: 1.6, color: '#0088ff' };
        if (roll < 0.18) return { name: 'UNCOMMON', multiplier: 1.3, color: '#00ff00' };
        return { name: 'COMMON', multiplier: 1.0, color: '#888888' };
    }
    
    rollItemType() {
        const roll = Math.random();
        
        if (roll < 0.35) return { category: 'weapons', subType: 'sword' };
        if (roll < 0.45) return { category: 'weapons', subType: 'staff' };
        if (roll < 0.55) return { category: 'weapons', subType: 'bow' };
        if (roll < 0.70) return { category: 'armors', subType: 'chest' };
        if (roll < 0.80) return { category: 'armors', subType: 'helmet' };
        
        return { category: 'weapons', subType: 'sword' };
    }
    
    createBaseItem(template, type, floor, rarity) {
        const item = {
            id: `${type.subType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: type.category === 'weapons' ? 'weapon' : 'armor',
            name: this.getBaseName(type.subType),
            rarity: rarity.name,
            rarityColor: rarity.color,
            stats: {},
            level: floor,
            price: 50
        };
        
        return item;
    }
    
    getBaseName(subType) {
        const names = {
            sword: '剑',
            staff: '法杖',
            bow: '弓',
            chest: '胸甲',
            helmet: '头盔'
        };
        return names[subType] || '物品';
    }
    
    addAffix(item, template, floor) {
        if (template.possibleAffixes.length === 0) return;
        
        const affix = template.possibleAffixes[Math.floor(Math.random() * template.possibleAffixes.length)];
        
        const affixes = {
            'sharp': { atk: [2, 5] },
            'heavy': { atk: [3, 7], def: [1, 3] },
            'balanced': { atk: [2, 4], spd: [1, 3] },
            'keen': { critRate: [3, 8] },
            'masterwork': { atk: [5, 10], luk: [2, 5] },
            'arcane': { mp: [10, 20], atk: [1, 3] },
            'mystic': { mp: [15, 30], critRate: [2, 5] },
            'ancient': { allStats: [1, 3] },
            'powerful': { atk: [8, 15], mp: [5, 10] },
            'swift': { spd: [3, 7] },
            'long_range': { atk: [4, 8], range: [1, 3] },
            'precise': { critRate: [5, 10], critDamage: [10, 20] },
            'hunter': { atk: [5, 10], luk: [3, 6] },
            'reinforced': { def: [3, 8], hp: [10, 30] },
            'guardian': { def: [5, 12], hp: [20, 40] },
            'fortified': { def: [8, 15], allResist: [5, 10] },
            'iron': { def: [2, 5] },
            'steel': { def: [5, 10] },
            'dragon': { def: [10, 20], fireResist: [20, 30] },
            'royal': { def: [8, 15], luk: [5, 10] }
        };
        
        const affixData = affixes[affix];
        if (!affixData) return;
        
        for (const [stat, range] of Object.entries(affixData)) {
            if (stat === 'allStats') {
                item.stats.atk = (item.stats.atk || 0) + this.randomInRange(range);
                item.stats.def = (item.stats.def || 0) + this.randomInRange(range);
            } else if (stat === 'allResist') {
                item.stats.fireResist = (item.stats.fireResist || 0) + this.randomInRange(range);
                item.stats.iceResist = (item.stats.iceResist || 0) + this.randomInRange(range);
            } else {
                item.stats[stat] = (item.stats[stat] || 0) + this.randomInRange(range);
            }
        }
        
        item.name = affix + '_' + item.name;
    }
    
    addElementSuffix(item, template, element) {
        const suffix = template.suffixes?.[element];
        if (!suffix) return;
        
        item.element = element;
        
        if (suffix.additionalStats) {
            for (const [stat, value] of Object.entries(suffix.additionalStats)) {
                item.stats[stat] = (item.stats[stat] || 0) + value;
            }
        }
        
        const elementNames = { fire: '火焰', ice: '冰霜', lightning: '雷电', void: '虚空' };
        item.name = item.name + ' (' + elementNames[element] + ')';
    }
    
    scaleItem(item, floor, rarity) {
        const scaleFactor = 1 + (floor - 1) * 0.1;
        
        for (const stat in item.stats) {
            if (typeof item.stats[stat] === 'number') {
                item.stats[stat] = Math.floor(item.stats[stat] * scaleFactor);
            }
        }
        
        item.price = Math.floor(item.price * scaleFactor * rarity.multiplier);
    }
    
    randomInRange([min, max]) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }
    
    generateWeapon(floor, rarity) {
        return this.generate(floor, rarity);
    }
    
    generateArmor(floor, rarity) {
        return this.generate(floor, rarity);
    }
    
    generateAccessory(floor, rarity) {
        const item = {
            id: `accessory_${Date.now()}`,
            type: 'accessory',
            name: '饰品',
            rarity: rarity.name,
            rarityColor: rarity.color,
            stats: {},
            level: floor,
            price: 30
        };
        
        const accessoryTypes = [
            { name: '戒指', stats: { hp: [10, 30] } },
            { name: '项链', stats: { mp: [10, 30] } },
            { name: '护符', stats: { atk: [2, 8] } },
            { name: '手镯', stats: { def: [2, 8] } }
        ];
        
        const type = accessoryTypes[Math.floor(Math.random() * accessoryTypes.length)];
        item.name = type.name;
        
        for (const [stat, range] of Object.entries(type.stats)) {
            item.stats[stat] = this.randomInRange(range) * (1 + floor * 0.1);
        }
        
        return item;
    }
}

export { ItemGenerator };
