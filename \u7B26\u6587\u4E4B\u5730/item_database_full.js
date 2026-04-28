/**
 * 符文之地 - 完整物品数据库
 */

const ITEM_DATABASE = {
    // ========== 武器 ==========
    weapons: {
        // 剑类
        iron_sword: { id: 'iron_sword', name: '铁剑', type: 'weapon', slot: 'weapon', rarity: 'COMMON', stats: { atk: 5 }, price: 50 },
        steel_sword: { id: 'steel_sword', name: '钢剑', type: 'weapon', slot: 'weapon', rarity: 'UNCOMMON', stats: { atk: 10 }, price: 150 },
        fire_sword: { id: 'fire_sword', name: '火焰剑', type: 'weapon', slot: 'weapon', rarity: 'RARE', stats: { atk: 18, fireResist: 25 }, element: 'fire', price: 400 },
        ice_sword: { id: 'ice_sword', name: '冰霜剑', type: 'weapon', slot: 'weapon', rarity: 'RARE', stats: { atk: 18, iceResist: 25 }, element: 'ice', price: 400 },
        thunder_sword: { id: 'thunder_sword', name: '雷电剑', type: 'weapon', slot: 'weapon', rarity: 'EPIC', stats: { atk: 28, spd: 5 }, element: 'lightning', price: 800 },
        dragon_sword: { id: 'dragon_sword', name: '龙之剑', type: 'weapon', slot: 'weapon', rarity: 'LEGENDARY', stats: { atk: 45, critRate: 10 }, price: 2000 },
        void_blade: { id: 'void_blade', name: '虚空之刃', type: 'weapon', slot: 'weapon', rarity: 'MYTHIC', stats: { atk: 60, luk: 20, voidResist: 50 }, element: 'void', price: 5000 },
        troll_hammer: { id: 'troll_hammer', name: '巨魔之锤', type: 'weapon', slot: 'weapon', rarity: 'EPIC', stats: { atk: 30, hp: 50 }, price: 1000, bossDrop: true },
        pharaoh_staff: { id: 'pharaoh_staff', name: '法老之杖', type: 'weapon', slot: 'weapon', rarity: 'LEGENDARY', stats: { atk: 25, mp: 80, wis: 15 }, element: 'void', price: 2500, bossDrop: true },
        ice_dragon_scale: { id: 'ice_dragon_scale', name: '冰龙鳞片剑', type: 'weapon', slot: 'weapon', rarity: 'LEGENDARY', stats: { atk: 50, def: 10, iceResist: 50 }, element: 'ice', price: 3000, bossDrop: true },
        fire_lord_crown: { id: 'fire_lord_crown', name: '火焰王冠剑', type: 'weapon', slot: 'weapon', rarity: 'LEGENDARY', stats: { atk: 55, fireResist: 75, hp: 100 }, element: 'fire', price: 3500, bossDrop: true },
        
        // 法杖
        wooden_staff: { id: 'wooden_staff', name: '木杖', type: 'weapon', slot: 'weapon', rarity: 'COMMON', stats: { atk: 3, mp: 15 }, price: 40 },
        crystal_staff: { id: 'crystal_staff', name: '水晶杖', type: 'weapon', slot: 'weapon', rarity: 'UNCOMMON', stats: { atk: 6, mp: 35 }, price: 180 },
        arcane_staff: { id: 'arcane_staff', name: '奥术法杖', type: 'weapon', slot: 'weapon', rarity: 'RARE', stats: { atk: 10, mp: 60, critRate: 5 }, price: 450 },
        phoenix_staff: { id: 'phoenix_staff', name: '凤凰法杖', type: 'weapon', slot: 'weapon', rarity: 'LEGENDARY', stats: { atk: 25, mp: 100, hp: 50 }, element: 'fire', price: 2500 },
        
        // 弓
        short_bow: { id: 'short_bow', name: '短弓', type: 'weapon', slot: 'weapon', rarity: 'COMMON', stats: { atk: 6, spd: 2 }, price: 60 },
        long_bow: { id: 'long_bow', name: '长弓', type: 'weapon', slot: 'weapon', rarity: 'UNCOMMON', stats: { atk: 12, spd: 5, critRate: 5 }, price: 180 },
        assassin_dagger: { id: 'assassin_dagger', name: '刺客匕首', type: 'weapon', slot: 'weapon', rarity: 'EPIC', stats: { atk: 22, spd: 12, critRate: 15, critDamage: 40 }, price: 1200 },
        phoenix_bow: { id: 'phoenix_bow', name: '凤凰之弓', type: 'weapon', slot: 'weapon', rarity: 'LEGENDARY', stats: { atk: 40, spd: 10, critRate: 12 }, element: 'fire', price: 2200 },
        
        // 钉锤
        mace: { id: 'mace', name: '钉锤', type: 'weapon', slot: 'weapon', rarity: 'COMMON', stats: { atk: 7, def: 2 }, price: 55 }
    },
    
    // ========== 护甲 ==========
    armors: {
        leather_armor: { id: 'leather_armor', name: '皮甲', type: 'armor', slot: 'armor', rarity: 'COMMON', stats: { def: 5 }, price: 40 },
        chainmail: { id: 'chainmail', name: '锁甲', type: 'armor', slot: 'armor', rarity: 'UNCOMMON', stats: { def: 12, spd: -1 }, price: 150 },
        plate_armor: { id: 'plate_armor', name: '板甲', type: 'armor', slot: 'armor', rarity: 'RARE', stats: { def: 25, hp: 30 }, price: 400 },
        dragon_scale_armor: { id: 'dragon_scale_armor', name: '龙鳞甲', type: 'armor', slot: 'armor', rarity: 'LEGENDARY', stats: { def: 45, hp: 100, fireResist: 50 }, price: 2500 },
        mage_robe: { id: 'mage_robe', name: '法师长袍', type: 'armor', slot: 'armor', rarity: 'COMMON', stats: { def: 3, mp: 20 }, price: 60 },
        arcane_robe: { id: 'arcane_robe', name: '奥术长袍', type: 'armor', slot: 'armor', rarity: 'RARE', stats: { def: 8, mp: 50, critRate: 5 }, price: 350 },
        phoenix_robe: { id: 'phoenix_robe', name: '凤凰长袍', type: 'armor', slot: 'armor', rarity: 'LEGENDARY', stats: { def: 18, mp: 120, hp: 60, fireResist: 75 }, price: 2200 }
    },
    
    // ========== 头盔 ==========
    helmets: {
        iron_helmet: { id: 'iron_helmet', name: '铁头盔', type: 'helmet', slot: 'helmet', rarity: 'COMMON', stats: { def: 3, hp: 10 }, price: 35 },
        knight_helmet: { id: 'knight_helmet', name: '骑士头盔', type: 'helmet', slot: 'helmet', rarity: 'UNCOMMON', stats: { def: 8, hp: 25 }, price: 120 },
        dragon_helm: { id: 'dragon_helm', name: '龙头盔', type: 'helmet', slot: 'helmet', rarity: 'EPIC', stats: { def: 15, hp: 60, luk: 5 }, price: 600 },
        crown: { id: 'crown', name: '王冠', type: 'helmet', slot: 'helmet', rarity: 'LEGENDARY', stats: { def: 22, luk: 18, allResist: 10 }, price: 2500 }
    },
    
    // ========== 饰品 ==========
    accessories: {
        hp_ring: { id: 'hp_ring', name: '生命戒指', type: 'accessory', slot: 'accessory1', rarity: 'COMMON', stats: { hp: 30 }, price: 80 },
        mp_ring: { id: 'mp_ring', name: '魔法戒指', type: 'accessory', slot: 'accessory1', rarity: 'COMMON', stats: { mp: 20 }, price: 80 },
        crit_ring: { id: 'crit_ring', name: '暴击戒指', type: 'accessory', slot: 'accessory1', rarity: 'RARE', stats: { critRate: 10 }, price: 300 },
        luck_amulet: { id: 'luck_amulet', name: '幸运护符', type: 'accessory', slot: 'accessory2', rarity: 'UNCOMMON', stats: { luk: 12, goldEarned: 0.15 }, price: 200 },
        fire_amulet: { id: 'fire_amulet', name: '火焰护符', type: 'accessory', slot: 'accessory2', rarity: 'EPIC', stats: { fireResist: 60, atk: 8 }, element: 'fire', price: 700 },
        void_amulet: { id: 'void_amulet', name: '虚空护符', type: 'accessory', slot: 'accessory2', rarity: 'LEGENDARY', stats: { voidResist: 80, luk: 15, atk: 12 }, element: 'void', price: 1800 }
    },
    
    // ========== 消耗品 ==========
    consumables: {
        health_potion: { id: 'health_potion', name: '生命药水', type: 'consumable', stackable: true, maxStack: 10, effect: { hp: 50 }, price: 20 },
        health_potion_large: { id: 'health_potion_large', name: '大生命药水', type: 'consumable', stackable: true, maxStack: 5, effect: { hp: 150 }, price: 60 },
        mana_potion: { id: 'mana_potion', name: '魔法药水', type: 'consumable', stackable: true, maxStack: 10, effect: { mp: 30 }, price: 25 },
        mana_potion_large: { id: 'mana_potion_large', name: '大魔法药水', type: 'consumable', stackable: true, maxStack: 5, effect: { mp: 100 }, price: 80 },
        elixir: { id: 'elixir', name: '万能药', type: 'consumable', stackable: true, maxStack: 3, effect: { hp: 'full', mp: 'full' }, price: 200 },
        antidote: { id: 'antidote', name: '解毒剂', type: 'consumable', stackable: true, maxStack: 5, effect: { curePoison: true }, price: 30 },
        phoenix_down: { id: 'phoenix_down', name: '凤凰羽毛', type: 'consumable', stackable: true, maxStack: 2, effect: { revive: 0.5 }, description: '战斗外复活并恢复50%HP', price: 500 }
    },
    
    // ========== 材料 ==========
    materials: {
        iron_ore: { id: 'iron_ore', name: '铁矿石', type: 'material', stackable: true, maxStack: 99, price: 10 },
        coal: { id: 'coal', name: '煤炭', type: 'material', stackable: true, maxStack: 99, price: 5 },
        steel_ingot: { id: 'steel_ingot', name: '钢锭', type: 'material', stackable: true, maxStack: 99, price: 30 },
        leather: { id: 'leather', name: '皮革', type: 'material', stackable: true, maxStack: 99, price: 8 },
        bone: { id: 'bone', name: '骨头', type: 'material', stackable: true, maxStack: 99, price: 5 },
        herb: { id: 'herb', name: '草药', type: 'material', stackable: true, maxStack: 99, price: 8 },
        mana_herb: { id: 'mana_herb', name: '魔力草', type: 'material', stackable: true, maxStack: 99, price: 12 },
        fire_essence: { id: 'fire_essence', name: '火焰精华', type: 'material', stackable: true, maxStack: 99, price: 50 },
        ice_essence: { id: 'ice_essence', name: '冰霜精华', type: 'material', stackable: true, maxStack: 99, price: 50 },
        lightning_essence: { id: 'lightning_essence', name: '雷电精华', type: 'material', stackable: true, maxStack: 99, price: 50 },
        void_essence: { id: 'void_essence', name: '虚空精华', type: 'material', stackable: true, maxStack: 99, price: 75 },
        holy_essence: { id: 'holy_essence', name: '神圣精华', type: 'material', stackable: true, maxStack: 99, price: 75 },
        dragon_scale: { id: 'dragon_scale', name: '龙鳞片', type: 'material', stackable: true, maxStack: 99, price: 100 },
        dragon_tooth: { id: 'dragon_tooth', name: '龙牙', type: 'material', stackable: true, maxStack: 99, price: 80 },
        phoenix_feather: { id: 'phoenix_feather', name: '凤凰羽毛', type: 'material', stackable: true, maxStack: 20, price: 200 },
        life_crystal: { id: 'life_crystal', name: '生命水晶', type: 'material', stackable: true, maxStack: 50, price: 80 },
        gold_ingot: { id: 'gold_ingot', name: '金锭', type: 'material', stackable: true, maxStack: 99, price: 50 },
        enchant_stone: { id: 'enchant_stone', name: '附魔石', type: 'material', stackable: true, maxStack: 50, price: 100 },
        ice_crystal: { id: 'ice_crystal', name: '冰晶', type: 'material', stackable: true, maxStack: 50, price: 60 },
        wraith_essence: { id: 'wraith_essence', name: '幽魂精华', type: 'material', stackable: true, maxStack: 30, price: 90 },
        void_shard: { id: 'void_shard', name: '虚空碎片', type: 'material', stackable: true, maxStack: 30, price: 120 },
        soul_essence: { id: 'soul_essence', name: '灵魂精华', type: 'material', stackable: true, maxStack: 30, price: 100 },
        rune_heart_shard: { id: 'rune_heart_shard', name: '符文之心碎片', type: 'material', stackable: true, maxStack: 10, price: 500 }
    }
};

export { ITEM_DATABASE };
