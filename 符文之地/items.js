/**
 * 符文之地 - 物品系统
 * 物品生成 + 装备 + 消耗品
 */

import { ElementType } from './combat.js';

// ==================== 物品类型 ====================
const ItemType = {
    WEAPON: 'weapon',
    ARMOR: 'armor',
    HELMET: 'helmet',
    GLOVES: 'gloves',
    BOOTS: 'boots',
    ACCESSORY: 'accessory',
    CONSUMABLE: 'consumable',
    SCROLL: 'scroll',
    MATERIAL: 'material',
    QUEST: 'quest'
};

const ItemRarity = {
    COMMON: { name: '普通', color: '#888888', multiplier: 1.0 },
    UNCOMMON: { name: '优秀', color: '#00ff00', multiplier: 1.3 },
    RARE: { name: '稀有', color: '#0088ff', multiplier: 1.6 },
    EPIC: { name: '史诗', color: '#aa00ff', multiplier: 2.0 },
    LEGENDARY: { name: '传说', color: '#ff8800', multiplier: 2.5 },
    MYTHIC: { name: '神话', color: '#ffd700', multiplier: 3.0 }
};

const EquipSlot = {
    WEAPON: 'weapon',
    ARMOR: 'armor',
    HELMET: 'helmet',
    GLOVES: 'gloves',
    BOOTS: 'boots',
    ACCESSORY1: 'accessory1',
    ACCESSORY2: 'accessory2'
};

// ==================== 物品管理器 ====================
class ItemManager {
    constructor(game) {
        this.game = game;
        this.itemDatabase = this.initItemDatabase();
    }
    
    initItemDatabase() {
        return {
            weapons: [
                { id: 'iron_sword', name: '铁剑', type: ItemType.WEAPON, slot: EquipSlot.WEAPON, rarity: 'COMMON', stats: { atk: 5 }, price: 50 },
                { id: 'steel_sword', name: '钢剑', type: ItemType.WEAPON, slot: EquipSlot.WEAPON, rarity: 'UNCOMMON', stats: { atk: 10 }, price: 120 },
                { id: 'fire_sword', name: '火焰剑', type: ItemType.WEAPON, slot: EquipSlot.WEAPON, rarity: 'RARE', stats: { atk: 15, fireResist: 20 }, element: ElementType.FIRE, price: 350 },
                { id: 'ice_sword', name: '冰霜剑', type: ItemType.WEAPON, slot: EquipSlot.WEAPON, rarity: 'RARE', stats: { atk: 15, iceResist: 20 }, element: ElementType.ICE, price: 350 },
                { id: 'thunder_sword', name: '雷电剑', type: ItemType.WEAPON, slot: EquipSlot.WEAPON, rarity: 'EPIC', stats: { atk: 25, spd: 5 }, element: ElementType.LIGHTNING, price: 600 },
                { id: 'dragon_sword', name: '龙之剑', type: ItemType.WEAPON, slot: EquipSlot.WEAPON, rarity: 'LEGENDARY', stats: { atk: 40, critRate: 10 }, price: 1500 },
                { id: 'void_blade', name: '虚空之刃', type: ItemType.WEAPON, slot: EquipSlot.WEAPON, rarity: 'MYTHIC', stats: { atk: 55, luk: 15, voidResist: 50 }, element: ElementType.VOID, price: 5000 },
                
                { id: 'wooden_staff', name: '木杖', type: ItemType.WEAPON, slot: EquipSlot.WEAPON, rarity: 'COMMON', stats: { atk: 3, mp: 10 }, price: 40 },
                { id: 'crystal_staff', name: '水晶杖', type: ItemType.WEAPON, slot: EquipSlot.WEAPON, rarity: 'UNCOMMON', stats: { atk: 5, mp: 25 }, price: 150 },
                { id: 'fire_staff', name: '火焰法杖', type: ItemType.WEAPON, slot: EquipSlot.WEAPON, rarity: 'RARE', stats: { atk: 8, mp: 40, fireResist: 30 }, element: ElementType.FIRE, price: 400 },
                { id: 'arcane_staff', name: '奥术法杖', type: ItemType.WEAPON, slot: EquipSlot.WEAPON, rarity: 'EPIC', stats: { atk: 12, mp: 60, critDamage: 25 }, price: 800 },
                { id: 'phoenix_staff', name: '凤凰法杖', type: ItemType.WEAPON, slot: EquipSlot.WEAPON, rarity: 'LEGENDARY', stats: { atk: 20, mp: 80, hp: 50 }, element: ElementType.FIRE, price: 2000 },
                
                { id: 'short_bow', name: '短弓', type: ItemType.WEAPON, slot: EquipSlot.WEAPON, rarity: 'COMMON', stats: { atk: 6, spd: 3 }, price: 60 },
                { id: 'long_bow', name: '长弓', type: ItemType.WEAPON, slot: EquipSlot.WEAPON, rarity: 'UNCOMMON', stats: { atk: 12, spd: 5, critRate: 5 }, price: 180 },
                { id: 'assassin_dagger', name: '刺客匕首', type: ItemType.WEAPON, slot: EquipSlot.WEAPON, rarity: 'EPIC', stats: { atk: 18, spd: 10, critRate: 15, critDamage: 30 }, price: 900 },
                { id: 'phoenix_bow', name: '凤凰之弓', type: ItemType.WEAPON, slot: EquipSlot.WEAPON, rarity: 'LEGENDARY', stats: { atk: 35, spd: 8, critRate: 10 }, element: ElementType.FIRE, price: 1800 },
            ],
            armors: [
                { id: 'leather_armor', name: '皮甲', type: ItemType.ARMOR, slot: EquipSlot.ARMOR, rarity: 'COMMON', stats: { def: 5 }, price: 40 },
                { id: 'chainmail', name: '锁甲', type: ItemType.ARMOR, slot: EquipSlot.ARMOR, rarity: 'UNCOMMON', stats: { def: 12, spd: -2 }, price: 150 },
                { id: 'plate_armor', name: '板甲', type: ItemType.ARMOR, slot: EquipSlot.ARMOR, rarity: 'RARE', stats: { def: 25, hp: 30 }, price: 400 },
                { id: 'dragon_scale', name: '龙鳞甲', type: ItemType.ARMOR, slot: EquipSlot.ARMOR, rarity: 'LEGENDARY', stats: { def: 40, hp: 80, fireResist: 50 }, price: 2000 },
                
                { id: 'mage_robe', name: '法师长袍', type: ItemType.ARMOR, slot: EquipSlot.ARMOR, rarity: 'COMMON', stats: { def: 3, mp: 20 }, price: 60 },
                { id: 'arcane_robe', name: '奥术长袍', type: ItemType.ARMOR, slot: EquipSlot.ARMOR, rarity: 'RARE', stats: { def: 8, mp: 50, critRate: 5 }, price: 350 },
                { id: 'phoenix_robe', name: '凤凰长袍', type: ItemType.ARMOR, slot: EquipSlot.ARMOR, rarity: 'LEGENDARY', stats: { def: 15, mp: 100, hp: 50, fireResist: 75 }, price: 1800 },
            ],
            helmets: [
                { id: 'iron_helmet', name: '铁头盔', type: ItemType.HELMET, slot: EquipSlot.HELMET, rarity: 'COMMON', stats: { def: 3, hp: 10 }, price: 35 },
                { id: 'knight_helmet', name: '骑士头盔', type: ItemType.HELMET, slot: EquipSlot.HELMET, rarity: 'UNCOMMON', stats: { def: 8, hp: 25 }, price: 120 },
                { id: 'dragon_helm', name: '龙头盔', type: ItemType.HELMET, slot: EquipSlot.HELMET, rarity: 'EPIC', stats: { def: 15, hp: 50, luk: 5 }, price: 600 },
                { id: 'crown', name: '王冠', type: ItemType.HELMET, slot: EquipSlot.HELMET, rarity: 'LEGENDARY', stats: { def: 20, luk: 15, allResist: 10 }, price: 2500 },
            ],
            consumables: [
                { id: 'health_potion', name: '生命药水', type: ItemType.CONSUMABLE, stackable: true, maxStack: 10, effect: { hp: 50 }, price: 20 },
                { id: 'health_potion_large', name: '大生命药水', type: ItemType.CONSUMABLE, stackable: true, maxStack: 5, effect: { hp: 150 }, price: 60 },
                { id: 'mana_potion', name: '魔法药水', type: ItemType.CONSUMABLE, stackable: true, maxStack: 10, effect: { mp: 30 }, price: 25 },
                { id: 'mana_potion_large', name: '大魔法药水', type: ItemType.CONSUMABLE, stackable: true, maxStack: 5, effect: { mp: 100 }, price: 80 },
                { id: 'elixir', name: '万能药', type: ItemType.CONSUMABLE, stackable: true, maxStack: 3, effect: { hp: 'full', mp: 'full' }, price: 200 },
                { id: 'antidote', name: '解毒剂', type: ItemType.CONSUMABLE, stackable: true, maxStack: 5, effect: { curePoison: true }, price: 30 },
                { id: 'phoenix_down', name: '凤凰羽毛', type: ItemType.CONSUMABLE, stackable: true, maxStack: 2, effect: { revive: 0.5 }, price: 500, description: '战斗外复活并恢复50%HP' },
            ],
            accessories: [
                { id: 'ring_health', name: '生命戒指', type: ItemType.ACCESSORY, slot: EquipSlot.ACCESSORY1, rarity: 'COMMON', stats: { hp: 30 }, price: 80 },
                { id: 'ring_mana', name: '魔法戒指', type: ItemType.ACCESSORY, slot: EquipSlot.ACCESSORY1, rarity: 'COMMON', stats: { mp: 20 }, price: 80 },
                { id: 'ring_crit', name: '暴击戒指', type: ItemType.ACCESSORY, slot: EquipSlot.ACCESSORY1, rarity: 'RARE', stats: { critRate: 8 }, price: 300 },
                { id: 'ring_luck', name: '幸运戒指', type: ItemType.ACCESSORY, slot: EquipSlot.ACCESSORY1, rarity: 'UNCOMMON', stats: { luk: 10, goldEarned: 0.1 }, price: 200 },
                { id: 'amulet_fire', name: '火焰护符', type: ItemType.ACCESSORY, slot: EquipSlot.ACCESSORY2, rarity: 'EPIC', stats: { fireResist: 50, atk: 5 }, element: ElementType.FIRE, price: 700 },
                { id: 'amulet_void', name: '虚空护符', type: ItemType.ACCESSORY, slot: EquipSlot.ACCESSORY2, rarity: 'LEGENDARY', stats: { voidResist: 75, luk: 10, atk: 10 }, price: 1800 },
            ]
        };
    }
    
    generateRandomItem(floor) {
        const rarity = this.rollRarity(floor);
        const itemPool = [
            ...this.itemDatabase.weapons,
            ...this.itemDatabase.armors,
            ...this.itemDatabase.helmets,
            ...this.itemDatabase.consumables,
            ...this.itemDatabase.accessories
        ];
        
        // 过滤符合稀有度的物品
        const available = itemPool.filter(i => {
            const itemRarity = ItemRarity[i.rarity];
            return itemRarity.multiplier >= rarity.multiplier;
        });
        
        if (available.length === 0) {
            return this.itemDatabase.consumables[0]; // 默认返回药水
        }
        
        const template = available[Math.floor(Math.random() * available.length)];
        return this.scaleItem({ ...template }, floor, rarity);
    }
    
    generateShopItem(floor) {
        const itemPool = [
            ...this.itemDatabase.weapons.slice(0, 5),
            ...this.itemDatabase.armors.slice(0, 3),
            ...this.itemDatabase.consumables.slice(0, 4),
            ...this.itemDatabase.accessories.slice(0, 3)
        ];
        
        const template = itemPool[Math.floor(Math.random() * itemPool.length)];
        return { ...template, price: Math.floor(template.price * (1 + floor * 0.1)) };
    }
    
    rollRarity(floor) {
        const roll = Math.random();
        const bonus = floor * 0.005;
        
        if (roll < 0.0005 + bonus && floor >= 40) return ItemRarity.MYTHIC;
        if (roll < 0.005 + bonus && floor >= 30) return ItemRarity.LEGENDARY;
        if (roll < 0.02 + bonus && floor >= 20) return ItemRarity.EPIC;
        if (roll < 0.08 + bonus && floor >= 10) return ItemRarity.RARE;
        if (roll < 0.2 + bonus) return ItemRarity.UNCOMMON;
        return ItemRarity.COMMON;
    }
    
    scaleItem(item, floor, rarity) {
        const scaleFactor = 1 + (floor - 1) * 0.12;
        
        // 缩放属性
        if (item.stats) {
            for (const stat in item.stats) {
                item.stats[stat] = Math.floor(item.stats[stat] * scaleFactor);
            }
        }
        
        // 设置稀有度
        item.rarity = rarity.name;
        item.rarityColor = rarity.color;
        
        // 价格缩放
        item.price = Math.floor(item.price * scaleFactor * rarity.multiplier);
        
        // ID添加后缀
        item.id = `${item.id}_floor${floor}`;
        
        return item;
    }
    
    useItem(player, item) {
        if (item.effect.hp) {
            if (item.effect.hp === 'full') {
                player.hp = player.totalMaxHP;
            } else {
                player.heal(item.effect.hp);
            }
        }
        
        if (item.effect.mp) {
            if (item.effect.mp === 'full') {
                player.mp = player.totalMaxMP;
            } else {
                player.restoreMP(item.effect.mp);
            }
        }
        
        if (item.effect.curePoison) {
            player.statusEffects = player.statusEffects.filter(s => s.type !== 'poison');
        }
        
        if (item.effect.revive) {
            // 复活效果由调用者处理
        }
        
        return true;
    }
    
    getItemById(id) {
        const allItems = [
            ...this.itemDatabase.weapons,
            ...this.itemDatabase.armors,
            ...this.itemDatabase.helmets,
            ...this.itemDatabase.consumables,
            ...this.itemDatabase.accessories
        ];
        
        return allItems.find(i => i.id === id);
    }
    
    getSellPrice(item) {
        return Math.floor(item.price * 0.3);
    }
}

// 导出
export { ItemManager, ItemType, ItemRarity, EquipSlot };
