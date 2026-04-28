/**
 * 符文之地 - 小地图渲染器
 */

class MinimapRenderer {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;
        this.width = 150;
        this.height = 100;
        this.padding = 5;
        this.x = this.game.width - this.width - 10;
        this.y = 10;
        this.scale = 1;
        this.showPlayers = true;
        this.showEnemies = true;
        this.showItems = true;
        this.showNPCs = true;
        this.showLabels = false;
        this.opacity = 0.9;
    }
    
    update(dt) {
        // 更新小地图逻辑
    }
    
    render() {
        const ctx = this.ctx;
        
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // 背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(this.x - this.padding, this.y - this.padding, this.width + this.padding * 2, this.height + this.padding * 2);
        
        // 边框
        ctx.strokeStyle = '#4488ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - this.padding, this.y - this.padding, this.width + this.padding * 2, this.height + this.padding * 2);
        
        // 地图内容
        if (this.game.dungeonMap) {
            this.renderMap();
        }
        
        ctx.restore();
    }
    
    renderMap() {
        const ctx = this.ctx;
        const map = this.game.dungeonMap;
        
        // 计算缩放比例
        const mapWidth = map.width;
        const mapHeight = map.height;
        const scaleX = this.width / mapWidth;
        const scaleY = this.height / mapHeight;
        this.scale = Math.min(scaleX, scaleY);
        
        const offsetX = this.x + (this.width - mapWidth * this.scale) / 2;
        const offsetY = this.y + (this.height - mapHeight * this.scale) / 2;
        
        // 渲染地形
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                const tile = map.getTile(x, y);
                const px = offsetX + x * this.scale;
                const py = offsetY + y * this.scale;
                
                if (tile === 0) {
                    ctx.fillStyle = '#1a1a2a'; // 墙
                } else {
                    ctx.fillStyle = '#2a2a3a'; // 地板
                }
                
                ctx.fillRect(px, py, this.scale + 0.5, this.scale + 0.5);
            }
        }
        
        // 渲染事件
        if (this.showItems && map.events) {
            for (const event of map.events) {
                const px = offsetX + event.x * this.scale;
                const py = offsetY + event.y * this.scale;
                
                ctx.fillStyle = this.getEventColor(event.type);
                ctx.beginPath();
                ctx.arc(px, py, this.scale * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // 渲染敌人
        if (this.showEnemies && this.game.enemies) {
            for (const enemy of this.game.enemies) {
                const px = offsetX + enemy.x * this.scale;
                const py = offsetY + enemy.y * this.scale;
                
                ctx.fillStyle = '#ff4444';
                ctx.beginPath();
                ctx.arc(px, py, this.scale * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // 渲染玩家
        if (this.showPlayers && this.game.player) {
            const px = offsetX + this.game.player.x * this.scale;
            const py = offsetY + this.game.player.y * this.scale;
            
            ctx.fillStyle = '#44ff44';
            ctx.beginPath();
            ctx.arc(px, py, this.scale * 3, 0, Math.PI * 2);
            ctx.fill();
            
            // 玩家方向指示
            if (this.game.player.direction) {
                ctx.strokeStyle = '#44ff44';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(px, py);
                const dir = this.game.player.direction;
                ctx.lineTo(px + dir.x * this.scale * 5, py + dir.y * this.scale * 5);
                ctx.stroke();
            }
        }
        
        // 渲染楼梯
        if (map.stairsPos) {
            const px = offsetX + map.stairsPos.x * this.scale;
            const py = offsetY + map.stairsPos.y * this.scale;
            
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(px - this.scale, py - this.scale, this.scale * 2, this.scale * 2);
        }
        
        // 标签
        if (this.showLabels) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px sans-serif';
            ctx.fillText(`F${this.game.currentFloor}`, this.x + 5, this.y + 12);
        }
    }
    
    getEventColor(type) {
        const colors = {
            ENEMY: '#ff4444',
            CHEST: '#ffd700',
            SHOP: '#00ccff',
            TRAP: '#ff6600',
            NPC: '#66ff66'
        };
        return colors[type] || '#888888';
    }
    
    toggleVisibility() {
        this.opacity = this.opacity > 0.5 ? 0.3 : 0.9;
    }
    
    resize(newWidth, newHeight) {
        this.x = newWidth - this.width - 10;
    }
}

export { MinimapRenderer };
