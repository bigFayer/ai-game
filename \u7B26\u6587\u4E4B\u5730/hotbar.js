/**
 * 符文之地 - 快捷栏系统
 */

class Hotbar {
    constructor(game) {
        this.game = game;
        this.slots = 8;
        this.items = [];
        this.selectedSlot = 0;
        this.x = 0;
        this.y = 0;
        this.slotSize = 50;
        this.padding = 5;
        this.visible = true;
        
        // 初始化空槽位
        for (let i = 0; i < this.slots; i++) {
            this.items.push(null);
        }
    }
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    addItem(item, slot = null) {
        if (slot !== null && slot < this.slots) {
            this.items[slot] = item;
            return slot;
        }
        
        // 找空槽位
        for (let i = 0; i < this.slots; i++) {
            if (!this.items[i]) {
                this.items[i] = item;
                return i;
            }
        }
        
        return -1; // 栏位已满
    }
    
    removeItem(slot) {
        if (slot >= 0 && slot < this.slots) {
            this.items[slot] = null;
        }
    }
    
    useItem(slot) {
        const item = this.items[slot];
        if (!item) return false;
        
        if (item.type === 'consumable') {
            // 使用消耗品
            const player = this.game.player;
            
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
                player.buffManager?.clearDebuffs();
            }
            
            // 消耗物品
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                this.items[slot] = null;
            }
            
            this.game.audioManager?.play('item');
            return true;
        }
        
        return false;
    }
    
    selectSlot(index) {
        if (index >= 0 && index < this.slots) {
            this.selectedSlot = index;
            
            // 使用选中的物品
            this.useItem(index);
        }
    }
    
    render(ctx) {
        if (!this.visible) return;
        
        const ctx = ctx;
        const totalWidth = this.slots * this.slotSize + (this.slots - 1) * this.padding;
        const startX = this.x - totalWidth / 2;
        const y = this.y;
        
        // 背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(startX - 5, y - 5, totalWidth + 10, this.slotSize + 10);
        
        // 槽位
        for (let i = 0; i < this.slots; i++) {
            const x = startX + i * (this.slotSize + this.padding);
            const isSelected = i === this.selectedSlot;
            const item = this.items[i];
            
            // 槽位背景
            ctx.fillStyle = isSelected ? '#4a4a6a' : '#2a2a4a';
            ctx.fillRect(x, y, this.slotSize, this.slotSize);
            
            // 边框
            ctx.strokeStyle = isSelected ? '#8888ff' : '#4a4a6a';
            ctx.lineWidth = isSelected ? 3 : 1;
            ctx.strokeRect(x, y, this.slotSize, this.slotSize);
            
            // 物品
            if (item) {
                // 图标/颜色
                ctx.fillStyle = this.getItemColor(item);
                ctx.fillRect(x + 5, y + 5, this.slotSize - 10, this.slotSize - 10);
                
                // 数量
                if (item.quantity > 1) {
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 12px sans-serif';
                    ctx.textAlign = 'right';
                    ctx.fillText(`${item.quantity}`, x + this.slotSize - 3, y + this.slotSize - 3);
                }
            }
            
            // 快捷键提示
            ctx.fillStyle = '#666666';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`${i + 1}`, x + 3, y + 12);
        }
    }
    
    getItemColor(item) {
        if (item.rarity === 'LEGENDARY') return '#ff8800';
        if (item.rarity === 'EPIC') return '#aa00ff';
        if (item.rarity === 'RARE') return '#0088ff';
        if (item.rarity === 'UNCOMMON') return '#00ff00';
        return '#888888';
    }
    
    handleClick(x, y) {
        const totalWidth = this.slots * this.slotSize + (this.slots - 1) * this.padding;
        const startX = this.x - totalWidth / 2;
        
        for (let i = 0; i < this.slots; i++) {
            const slotX = startX + i * (this.slotSize + this.padding);
            if (x >= slotX && x < slotX + this.slotSize && y >= this.y && y < this.y + this.slotSize) {
                this.selectSlot(i);
                return true;
            }
        }
        return false;
    }
}

export { Hotbar };
