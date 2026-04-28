/**
 * 符文之地 - 小地图系统
 */

class MinimapRenderer {
    constructor(ctx, dungeon, tileSize = 4) {
        this.ctx = ctx;
        this.dungeon = dungeon;
        this.tileSize = tileSize;
        this.width = dungeon.width * tileSize;
        this.height = dungeon.height * tileSize;
        this.padding = 10;
        this.position = { x: 0, y: 0 };
        this.visible = true;
        this.opacity = 0.9;
        
        // 颜色
        this.colors = {
            wall: '#1a1a2e',
            floor: '#3a3a5e',
            revealed: '#2a2a4e',
            player: '#4488ff',
            enemy: '#ff4444',
            chest: '#ffd700',
            shop: '#00ccff',
            stairs: '#88ff88',
            npc: '#66ff66',
            trap: '#ff6600',
            elite: '#ff00ff',
            boss: '#ff0000'
        };
        
        // 缩放级别
        this.zoomLevel = 1;
        this.minZoom = 0.5;
        this.maxZoom = 2;
    }
    
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }
    
    render(player, events) {
        if (!this.visible) return;
        
        const ctx = this.ctx;
        const x = this.position.x;
        const y = this.position.y;
        
        // 背景
        ctx.fillStyle = 'rgba(10, 10, 30, 0.9)';
        ctx.fillRect(x, y, this.width + this.padding * 2, this.height + this.padding * 2 + 20);
        
        // 边框
        ctx.strokeStyle = '#4a4a6a';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, this.width + this.padding * 2, this.height + this.padding * 2 + 20);
        
        // 标题
        ctx.fillStyle = '#888888';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`第${this.dungeon.floor}层`, x + this.width / 2 + this.padding, y + 12);
        
        // 地图内容
        ctx.save();
        ctx.translate(x + this.padding, y + this.padding + 15);
        ctx.scale(this.zoomLevel, this.zoomLevel);
        
        // 绘制地形
        for (let my = 0; my < this.dungeon.height; my++) {
            for (let mx = 0; mx < this.dungeon.width; mx++) {
                const tile = this.dungeon.getTile(mx, my);
                const isRevealed = this.dungeon.isInSight(mx, my);
                
                if (!isRevealed) continue;
                
                ctx.fillStyle = tile === 0 ? this.colors.wall : this.colors.floor;
                ctx.fillRect(mx * this.tileSize, my * this.tileSize, this.tileSize, this.tileSize);
            }
        }
        
        // 绘制事件
        for (const event of events || []) {
            if (!this.dungeon.isInSight(event.x, event.y)) continue;
            
            let color = this.colors.floor;
            let icon = null;
            
            switch (event.type) {
                case 'enemy': color = this.colors.enemy; break;
                case 'elite': color = this.colors.elite; break;
                case 'boss': color = this.colors.boss; break;
                case 'chest': color = this.colors.chest; break;
                case 'shop': color = this.colors.shop; break;
                case 'stairs': color = this.colors.stairs; break;
                case 'npc': color = this.colors.npc; break;
                case 'trap': color = this.colors.trap; break;
            }
            
            ctx.fillStyle = color;
            ctx.fillRect(
                event.x * this.tileSize,
                event.y * this.tileSize,
                this.tileSize,
                this.tileSize
            );
        }
        
        // 绘制玩家
        ctx.fillStyle = this.colors.player;
        ctx.beginPath();
        ctx.arc(
            player.x * this.tileSize + this.tileSize / 2,
            player.y * this.tileSize + this.tileSize / 2,
            this.tileSize * 0.8,
            0, Math.PI * 2
        );
        ctx.fill();
        
        ctx.restore();
        
        // 缩放提示
        ctx.fillStyle = '#666666';
        ctx.font = '8px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`x${this.zoomLevel.toFixed(1)}`, x + this.width + this.padding - 2, y + this.height + this.padding + 18);
    }
    
    toggle() {
        this.visible = !this.visible;
    }
    
    zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel + 0.25, this.maxZoom);
    }
    
    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel - 0.25, this.minZoom);
    }
}

export { MinimapRenderer };
