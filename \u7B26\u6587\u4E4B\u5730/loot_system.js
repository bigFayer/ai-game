/**
 * 符文之地 - 战利品系统
 */

class LootDrop {
    constructor(itemId, chance, quantity = [1, 1]) {
        this.itemId = itemId;
        this.chance = chance;
        this.quantity = quantity;
    }
    
    roll() {
        if (Math.random() > this.chance) return null;
        const qty = this.quantity[0] + Math.floor(Math.random() * (this.quantity[1] - this.quantity[0] + 1));
        return { itemId: this.itemId, quantity: qty };
    }
}

class LootTable {
    constructor(entries = []) {
        this.entries = entries;
        this.rolls = 1;
        this.guaranteed = false;
    }
    
    addEntry(itemId, chance, quantity = [1, 1]) {
        this.entries.push(new LootDrop(itemId, chance, quantity));
        return this;
    }
    
    setRolls(count) {
        this.rolls = count;
        return this;
    }
    
    setGuaranteed(guaranteed = true) {
        this.guaranteed = guaranteed;
        return this;
    }
    
    roll() {
        const results = [];
        let guaranteedRolled = false;
        
        for (let i = 0; i < this.rolls; i++) {
            for (const entry of this.entries) {
                const drop = entry.roll();
                if (drop) {
                    this.combineDrop(results, drop);
                }
            }
            
            // 保底
            if (this.guaranteed && !guaranteedRolled) {
                const guaranteedEntry = this.getGuaranteedEntry();
                if (guaranteedEntry) {
                    results.push({ itemId: guaranteedEntry.itemId, quantity: 1 });
                    guaranteedRolled = true;
                }
            }
        }
        
        return results;
    }
    
    getGuaranteedEntry() {
        // 返回第一个条目作为保底
        return this.entries[0];
    }
    
    combineDrop(results, newDrop) {
        const existing = results.find(r => r.itemId === newDrop.itemId);
        if (existing) {
            existing.quantity += newDrop.quantity;
        } else {
            results.push(newDrop);
        }
    }
}

const STANDARD_LOOT_TABLES = {
    // 普通怪物掉落
    common_enemy: new LootTable([
        { itemId: 'gold_coin', chance: 0.8, quantity: [5, 15] },
        { itemId: 'health_potion', chance: 0.1, quantity: [1, 1] },
        { itemId: 'mana_potion', chance: 0.05, quantity: [1, 1] }
    ]).setRolls(2),
    
    // 精英怪物掉落
    elite_enemy: new LootTable([
        { itemId: 'gold_coin', chance: 1.0, quantity: [30, 80] },
        { itemId: 'health_potion', chance: 0.5, quantity: [1, 3] },
        { itemId: 'mana_potion', chance: 0.3, quantity: [1, 2] },
        { itemId: 'enchant_stone', chance: 0.15, quantity: [1, 1] },
        { itemId: 'iron_ore', chance: 0.4, quantity: [2, 5] },
        { itemId: 'leather', chance: 0.3, quantity: [1, 3] }
    ]).setRolls(4).setGuaranteed(),
    
    // BOSS掉落
    boss_enemy: new LootTable([
        { itemId: 'gold_coin', chance: 1.0, quantity: [100, 300] },
        { itemId: 'health_potion', chance: 1.0, quantity: [3, 5] },
        { itemId: 'mana_potion', chance: 0.8, quantity: [3, 5] },
        { itemId: 'enchant_stone', chance: 0.8, quantity: [1, 3] },
        { itemId: 'rare_material', chance: 0.6, quantity: [1, 2] },
        { itemId: 'epic_material', chance: 0.3, quantity: [1, 1] }
    ]).setRolls(6).setGuaranteed(),
    
    // 宝箱掉落
    chest: new LootTable([
        { itemId: 'gold_coin', chance: 1.0, quantity: [20, 100] },
        { itemId: 'health_potion', chance: 0.6, quantity: [2, 5] },
        { itemId: 'mana_potion', chance: 0.5, quantity: [2, 5] },
        { itemId: 'enchant_stone', chance: 0.3, quantity: [1, 2] },
        { itemId: 'rare_item', chance: 0.2, quantity: [1, 1] }
    ]).setRolls(3).setGuaranteed(),
    
    // 森林地区特殊掉落
    forest_special: new LootTable([
        { itemId: 'wolf_pelt', chance: 0.4, quantity: [1, 3] },
        { itemId: 'bone', chance: 0.3, quantity: [2, 4] },
        { itemId: 'herb', chance: 0.35, quantity: [1, 3] },
        { itemId: 'mana_herb', chance: 0.15, quantity: [1, 2] }
    ]).setRolls(2),
    
    // 沙漠地区特殊掉落
    desert_special: new LootTable([
        { itemId: 'ancient_bandage', chance: 0.25, quantity: [1, 2] },
        { itemId: 'scarab_shell', chance: 0.2, quantity: [1, 2] },
        { itemId: 'sandworm_tooth', chance: 0.15, quantity: [1, 1] }
    ]).setRolls(2),
    
    // 冰霜地区特殊掉落
    ice_special: new LootTable([
        { itemId: 'ice_crystal', chance: 0.35, quantity: [1, 3] },
        { itemId: 'wraith_essence', chance: 0.25, quantity: [1, 2] },
        { itemId: 'elemental_core', chance: 0.1, quantity: [1, 1] }
    ]).setRolls(2),
    
    // 火焰地区特殊掉落
    fire_special: new LootTable([
        { itemId: 'fire_essence', chance: 0.4, quantity: [1, 3] },
        { itemId: 'dragon_scale', chance: 0.2, quantity: [1, 2] },
        { itemId: 'infernal_core', chance: 0.1, quantity: [1, 1] }
    ]).setRolls(2),
    
    // 虚空地区特殊掉落
    void_special: new LootTable([
        { itemId: 'void_shard', chance: 0.35, quantity: [1, 2] },
        { itemId: 'soul_essence', chance: 0.3, quantity: [1, 2] },
        { itemId: 'rune_heart_shard', chance: 0.1, quantity: [1, 1] }
    ]).setRolls(2)
};

class LootManager {
    constructor(game) {
        this.game = game;
        this.lootTables = { ...STANDARD_LOOT_TABLES };
    }
    
    getLootTable(tableId) {
        return this.lootTables[tableId] || this.lootTables.common_enemy;
    }
    
    generateEnemyDrop(enemy) {
        const biome = enemy.biome || 'forest';
        const isBoss = enemy.isBoss;
        const isElite = enemy.isElite;
        
        let tableId;
        if (isBoss) {
            tableId = 'boss_enemy';
        } else if (isElite) {
            tableId = 'elite_enemy';
        } else {
            tableId = 'common_enemy';
        }
        
        // 加上地区特殊掉落
        const biomeTableId = `${biome}_special`;
        const biomeTable = this.lootTables[biomeTableId];
        
        const drops = [];
        
        // 基础掉落
        const baseTable = this.getLootTable(tableId);
        const baseDrops = baseTable.roll();
        drops.push(...baseDrops);
        
        // 地区特殊掉落
        if (biomeTable) {
            const biomeDrops = biomeTable.roll();
            drops.push(...biomeDrops);
        }
        
        return this.processDrops(drops);
    }
    
    generateChestDrop(floor, biome) {
        const table = this.getLootTable('chest');
        const drops = table.roll();
        
        // 根据层数调整
        const floorBonus = Math.floor(floor / 10);
        for (const drop of drops) {
            if (drop.itemId === 'gold_coin') {
                drop.quantity = Math.floor(drop.quantity * (1 + floorBonus * 0.2));
            }
        }
        
        return this.processDrops(drops);
    }
    
    processDrops(drops) {
        const processed = [];
        
        for (const drop of drops) {
            const item = this.findItem(drop.itemId);
            if (item) {
                processed.push({
                    ...item,
                    quantity: drop.quantity
                });
            }
        }
        
        return processed;
    }
    
    findItem(itemId) {
        // 在物品数据库中查找
        for (const category of Object.values(this.game.itemDatabase)) {
            if (category[itemId]) {
                return { ...category[itemId], id: itemId };
            }
        }
        
        // 特殊物品
        const specialItems = {
            gold_coin: { id: 'gold_coin', name: '金币', type: 'currency', stackable: true },
            rare_material: { id: 'rare_material', name: '稀有材料', type: 'material', stackable: true },
            epic_material: { id: 'epic_material', name: '史诗材料', type: 'material', stackable: true },
            rare_item: { id: 'rare_item', name: '稀有物品', type: 'item', rarity: 'RARE', stackable: false }
        };
        
        return specialItems[itemId] || null;
    }
    
    dropItems(x, y, drops) {
        for (const drop of drops) {
            const item = {
                id: drop.id,
                name: drop.name,
                x,
                y,
                quantity: drop.quantity,
                worldDrop: true
            };
            
            this.game.items.push(item);
        }
    }
    
    pickupItem(item) {
        if (!item) return false;
        
        // 金币
        if (item.id === 'gold_coin') {
            const amount = item.quantity || 1;
            this.game.player.gold += amount;
            this.game.notificationManager.showGold(amount);
            return true;
        }
        
        // 添加到背包
        const added = this.game.inventory.addItem(item.id, item.quantity || 1);
        
        if (added) {
            this.game.notificationManager.showItem(`获得 ${item.name}`);
        } else {
            this.game.notificationManager.showWarning('背包已满！');
        }
        
        return added;
    }
}

export { LootManager, LootTable, LootDrop, STANDARD_LOOT_TABLES };
