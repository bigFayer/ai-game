/**
 * 符文之地 - 商店系统
 */

const SHOP_INVENTORY = {
    // 基础商店 - 所有职业通用
    basic: {
        name: '基础商店',
        items: [
            { id: 'health_potion', price: 20, stock: -1 },
            { id: 'mana_potion', price: 25, stock: -1 },
            { id: 'antidote', price: 30, stock: -1 }
        ]
    },
    
    // 武器商店
    weapons: {
        name: '武器店',
        items: [
            { id: 'iron_sword', price: 50, stock: 1 },
            { id: 'steel_sword', price: 150, stock: 1 },
            { id: 'fire_sword', price: 400, stock: 1 },
            { id: 'short_bow', price: 60, stock: 1 },
            { id: 'long_bow', price: 180, stock: 1 },
            { id: 'wooden_staff', price: 40, stock: 1 },
            { id: 'mace', price: 55, stock: 1 }
        ]
    },
    
    // 防具商店
    armor: {
        name: '防具店',
        items: [
            { id: 'leather_armor', price: 40, stock: 1 },
            { id: 'chainmail', price: 150, stock: 1 },
            { id: 'plate_armor', price: 400, stock: 1 },
            { id: 'mage_robe', price: 60, stock: 1 },
            { id: 'iron_helmet', price: 35, stock: 1 }
        ]
    },
    
    // 饰品商店
    accessories: {
        name: '饰品店',
        items: [
            { id: 'hp_ring', price: 80, stock: 1 },
            { id: 'mp_ring', price: 80, stock: 1 },
            { id: 'crit_ring', price: 300, stock: 1 },
            { id: 'luck_amulet', price: 200, stock: 1 }
        ]
    },
    
    // 材料商店
    materials: {
        name: '杂货店',
        items: [
            { id: 'iron_ore', price: 10, stock: -1 },
            { id: 'coal', price: 5, stock: -1 },
            { id: 'leather', price: 8, stock: -1 },
            { id: 'herb', price: 8, stock: -1 },
            { id: 'mana_herb', price: 12, stock: -1 },
            { id: 'enchant_stone', price: 100, stock: 5 }
        ]
    },
    
    // 沙漠商人
    desert: {
        name: '沙漠商店',
        items: [
            { id: 'fire_amulet', price: 700, stock: 1 },
            { id: 'phoenix_down', price: 500, stock: 2 },
            { id: 'desert_map', price: 100, stock: 1 }
        ]
    },
    
    // 冰霜商人
    ice: {
        name: '冰霜商店',
        items: [
            { id: 'ice_sword', price: 400, stock: 1 },
            { id: 'ice_crystal', price: 60, stock: -1 },
            { id: 'warm_cloak', price: 300, stock: 1 }
        ]
    },
    
    // 火焰商人
    fire: {
        name: '火焰商店',
        items: [
            { id: 'fire_sword', price: 400, stock: 1 },
            { id: 'phoenix_staff', price: 2500, stock: 1 },
            { id: 'fire_essence', price: 50, stock: -1 },
            { id: 'infernal_core', price: 200, stock: 3 }
        ]
    },
    
    // 虚空商人
    void: {
        name: '虚空商店',
        items: [
            { id: 'void_blade', price: 5000, stock: 1 },
            { id: 'void_amulet', price: 1800, stock: 1 },
            { id: 'void_essence', price: 75, stock: -1 },
            { id: 'rune_heart_shard', price: 500, stock: 3 }
        ]
    }
};

class ShopInventory {
    constructor(shopId) {
        this.shopId = shopId;
        this.inventory = [...(SHOP_INVENTORY[shopId]?.items || [])];
        this.soldOut = new Set();
        this.refreshTimer = 0;
        this.refreshInterval = 60; // 秒
    }
    
    getItems() {
        return this.inventory.filter(item => !this.soldOut.has(item.id) && (item.stock === -1 || item.stock > 0));
    }
    
    buyItem(itemId) {
        const item = this.inventory.find(i => i.id === itemId);
        if (!item || this.soldOut.has(itemId)) return null;
        
        if (item.stock > 0) {
            item.stock--;
            if (item.stock <= 0) {
                this.soldOut.add(itemId);
            }
        }
        
        return { ...item };
    }
    
    refresh() {
        this.soldOut.clear();
        for (const item of this.inventory) {
            if (item.defaultStock) {
                item.stock = item.defaultStock;
            }
        }
    }
    
    update(dt) {
        this.refreshTimer += dt;
        if (this.refreshTimer >= this.refreshInterval) {
            this.refreshTimer = 0;
            this.refresh();
        }
    }
}

class Shop {
    constructor(game, shopId) {
        this.game = game;
        this.shopId = shopId;
        this.shopData = SHOP_INVENTORY[shopId];
        this.inventory = new ShopInventory(shopId);
        
        this.selectedIndex = 0;
        this.page = 0;
        this.itemsPerPage = 8;
        this.mode = 'buy'; // buy, sell
    }
    
    getItems() {
        return this.inventory.getItems();
    }
    
    getCurrentPageItems() {
        const items = this.mode === 'buy' ? this.getItems() : this.getSellItems();
        const start = this.page * this.itemsPerPage;
        return items.slice(start, start + this.itemsPerPage);
    }
    
    getSellItems() {
        const items = [];
        for (const item of this.game.inventory.items) {
            const basePrice = this.getBasePrice(item.id);
            if (basePrice > 0) {
                items.push({
                    id: item.id,
                    name: item.name,
                    price: Math.floor(basePrice * GAME_CONFIG.ITEM.PRICE_MULTIPLIER.SELL),
                    quantity: item.quantity
                });
            }
        }
        return items;
    }
    
    getBasePrice(itemId) {
        // 查找物品原价
        for (const category of Object.values(this.game.itemDatabase)) {
            if (category[itemId]) {
                return category[itemId].price || 0;
            }
        }
        
        // 默认材料价格
        const materialPrices = {
            iron_ore: 10, coal: 5, leather: 8, herb: 8,
            mana_herb: 12, bone: 5, fire_essence: 50
        };
        
        return materialPrices[itemId] || 0;
    }
    
    buyItem(itemId) {
        const items = this.getItems();
        const item = items.find(i => i.id === itemId);
        
        if (!item) return false;
        if (this.game.player.gold < item.price) {
            this.game.notificationManager.showWarning('金币不足！');
            return false;
        }
        
        this.game.player.gold -= item.price;
        this.inventory.buyItem(itemId);
        this.game.inventory.addItem(itemId, 1);
        
        this.game.notificationManager.showItem(`购买了 ${item.name}`);
        this.game.audioManager?.play('buy');
        
        return true;
    }
    
    sellItem(itemId, quantity = 1) {
        if (!this.game.inventory.hasItem(itemId, quantity)) {
            return false;
        }
        
        const basePrice = this.getBasePrice(itemId);
        const sellPrice = Math.floor(basePrice * GAME_CONFIG.ITEM.PRICE_MULTIPLIER.SELL);
        
        this.game.inventory.removeItem(itemId, quantity);
        this.game.player.gold += sellPrice;
        
        this.game.notificationManager.showGold(sellPrice);
        this.game.audioManager?.play('sell');
        
        return true;
    }
    
    navigate(direction) {
        const items = this.mode === 'buy' ? this.getItems() : this.getSellItems();
        const maxPages = Math.ceil(items.length / this.itemsPerPage);
        
        this.page += direction;
        if (this.page < 0) this.page = maxPages - 1;
        if (this.page >= maxPages) this.page = 0;
        this.selectedIndex = 0;
    }
    
    selectItem(direction) {
        const items = this.getCurrentPageItems();
        this.selectedIndex += direction;
        if (this.selectedIndex < 0) this.selectedIndex = items.length - 1;
        if (this.selectedIndex >= items.length) this.selectedIndex = 0;
    }
    
    confirm() {
        const items = this.getCurrentPageItems();
        const item = items[this.selectedIndex];
        if (!item) return;
        
        if (this.mode === 'buy') {
            this.buyItem(item.id);
        } else {
            this.sellItem(item.id, 1);
        }
    }
    
    toggleMode() {
        this.mode = this.mode === 'buy' ? 'sell' : 'buy';
        this.page = 0;
        this.selectedIndex = 0;
    }
}

class ShopUI {
    constructor(shop) {
        this.shop = shop;
        this.game = shop.game;
        this.ctx = shop.game.ctx;
    }
    
    render() {
        const ctx = this.ctx;
        const width = 600;
        const height = 500;
        const x = (this.game.width - width) / 2;
        const y = (this.game.height - height) / 2;
        
        // 背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(x, y, width, height);
        
        // 边框
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
        
        // 标题
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.shop.shopData?.name || '商店', x + width / 2, y + 35);
        
        // 玩家金币
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`金币: ${this.shop.game.player.gold}`, x + width - 20, y + 35);
        
        // 模式切换
        ctx.textAlign = 'left';
        ctx.fillStyle = this.shop.mode === 'buy' ? '#44ff44' : '#aaaaaa';
        ctx.fillText('[购买]', x + 20, y + 70);
        ctx.fillStyle = this.shop.mode === 'sell' ? '#44ff44' : '#aaaaaa';
        ctx.fillText('[出售]', x + 100, y + 70);
        
        // 物品列表
        const items = this.shop.getCurrentPageItems();
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemY = y + 100 + i * 40;
            const isSelected = i === this.shop.selectedIndex;
            
            // 选中背景
            if (isSelected) {
                ctx.fillStyle = 'rgba(68, 136, 255, 0.3)';
                ctx.fillRect(x + 10, itemY - 15, width - 20, 35);
            }
            
            // 物品名称
            ctx.fillStyle = isSelected ? '#ffffff' : '#aaaaaa';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(item.name, x + 20, itemY + 5);
            
            // 价格
            ctx.fillStyle = isSelected ? '#ffd700' : '#888888';
            ctx.textAlign = 'right';
            ctx.fillText(`${item.price} 金币`, x + width - 20, itemY + 5);
        }
        
        // 提示
        ctx.fillStyle = '#666666';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('←→ 选择物品    Enter 购买/出售    Tab 切换模式    ESC 关闭', x + width / 2, y + height - 20);
    }
}

export { Shop, ShopUI, SHOP_INVENTORY };
