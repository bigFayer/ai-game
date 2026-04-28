/**
 * 符文之地 - 地下城生成系统
 * 程序化生成 + 房间事件 + 地图渲染
 */

import { ElementType } from './combat.js';

// ==================== 房间类型 ====================
const RoomType = {
    EMPTY: 'empty',
    ENEMY: 'enemy',
    ELITE: 'elite',
    BOSS: 'boss',
    CHEST: 'chest',
    SHOP: 'shop',
    TREASURE: 'treasure',
    TRAP: 'trap',
    NPC: 'npc',
    STAIRS: 'stairs',
    ENTRANCE: 'entrance',
    EXIT: 'exit'
};

// ==================== 地牢类 ====================
class DungeonGenerator {
    constructor(game) {
        this.game = game;
        this.width = 20;
        this.height = 15;
        this.tileSize = 40;
        this.tiles = [];
        this.rooms = [];
        this.events = [];
        this.playerStart = { x: 1, y: 1 };
        this.stairsPos = { x: 0, y: 0 };
        this.revealed = new Set();
        this.visited = new Set();
        
        // 地区主题
        this.biomeThemes = {
            forest: {
                name: '阴暗森林',
                floorColor: '#1a3a1a',
                wallColor: '#2a4a2a',
                accentColor: '#4a8a4a'
            },
            desert: {
                name: '荒芜沙漠',
                floorColor: '#3a3020',
                wallColor: '#5a4a30',
                accentColor: '#c2a64d'
            },
            ice: {
                name: '冰霜要塞',
                floorColor: '#1a2a3a',
                wallColor: '#3a5a7a',
                accentColor: '#6a9fb5'
            },
            fire: {
                name: '烈焰地狱',
                floorColor: '#3a1a1a',
                wallColor: '#5a2a2a',
                accentColor: '#b54a2a'
            },
            void: {
                name: '虚空神殿',
                floorColor: '#1a1a2a',
                wallColor: '#3a2a4a',
                accentColor: '#6a4a8a'
            }
        };
    }
    
    generate(floor, biome) {
        console.log(`[Dungeon] 生成地下城: 第${floor}层, ${biome}`);
        
        this.floor = floor;
        this.biome = biome;
        this.tiles = [];
        this.rooms = [];
        this.events = [];
        this.revealed = new Set();
        this.visited = new Set();
        
        // 初始化地图
        this.initTiles();
        
        // 生成房间
        this.generateRooms();
        
        // 连接房间
        this.connectRooms();
        
        // 放置事件
        this.placeEvents();
        
        // 放置玩家起点
        this.placePlayerStart();
        
        // 检查BOSS层
        if (floor % 10 === 0) {
            this.placeBoss();
        }
        
        // 放置楼梯
        this.placeStairs();
        
        return this;
    }
    
    initTiles() {
        // 0 = 墙, 1 = 地板, 2 = 通道
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = 0; // 默认墙
            }
        }
    }
    
    generateRooms() {
        const roomCount = 5 + Math.floor(Math.random() * 4); // 5-8个房间
        const maxAttempts = 50;
        
        for (let i = 0; i < maxAttempts && this.rooms.length < roomCount; i++) {
            const room = this.createRoom();
            if (this.canPlaceRoom(room)) {
                this.placeRoom(room);
                this.rooms.push(room);
            }
        }
        
        // 确保至少有一些房间
        if (this.rooms.length < 3) {
            this.generateRooms(); // 递归重试
        }
    }
    
    createRoom() {
        const minSize = 3;
        const maxSize = 6;
        const w = minSize + Math.floor(Math.random() * (maxSize - minSize));
        const h = minSize + Math.floor(Math.random() * (maxSize - minSize));
        const x = 1 + Math.floor(Math.random() * (this.width - w - 2));
        const y = 1 + Math.floor(Math.random() * (this.height - h - 2));
        
        return {
            x, y, w, h,
            centerX: Math.floor(x + w / 2),
            centerY: Math.floor(y + h / 2),
            type: RoomType.EMPTY,
            enemies: [],
            cleared: false
        };
    }
    
    canPlaceRoom(room) {
        // 检查是否与现有房间重叠
        for (const existing of this.rooms) {
            if (room.x < existing.x + existing.w + 1 &&
                room.x + room.w + 1 > existing.x &&
                room.y < existing.y + existing.h + 1 &&
                room.y + room.h + 1 > existing.y) {
                return false;
            }
        }
        return true;
    }
    
    placeRoom(room) {
        for (let y = room.y; y < room.y + room.h; y++) {
            for (let x = room.x; x < room.x + room.w; x++) {
                this.tiles[y][x] = 1; // 地板
            }
        }
    }
    
    connectRooms() {
        // 按位置排序房间
        const sorted = [...this.rooms].sort((a, b) => 
            (a.centerX + a.centerY) - (b.centerX + b.centerY)
        );
        
        // 连接相邻房间
        for (let i = 0; i < sorted.length - 1; i++) {
            const roomA = sorted[i];
            const roomB = sorted[i + 1];
            this.createCorridor(roomA.centerX, roomA.centerY, roomB.centerX, roomB.centerY);
        }
    }
    
    createCorridor(x1, y1, x2, y2) {
        let x = x1;
        let y = y1;
        
        // 随机选择水平或垂直优先
        if (Math.random() < 0.5) {
            // 水平然后垂直
            while (x !== x2) {
                this.tiles[y][x] = this.tiles[y][x] === 0 ? 2 : this.tiles[y][x];
                x += x < x2 ? 1 : -1;
            }
            while (y !== y2) {
                this.tiles[y][x] = this.tiles[y][x] === 0 ? 2 : this.tiles[y][x];
                y += y < y2 ? 1 : -1;
            }
        } else {
            // 垂直然后水平
            while (y !== y2) {
                this.tiles[y][x] = this.tiles[y][x] === 0 ? 2 : this.tiles[y][x];
                y += y < y2 ? 1 : -1;
            }
            while (x !== x2) {
                this.tiles[y][x] = this.tiles[y][x] === 0 ? 2 : this.tiles[y][x];
                x += x < x2 ? 1 : -1;
            }
        }
        
        this.tiles[y2][x2] = 1; // 确保终点是地板
    }
    
    placeEvents() {
        // 分配事件到房间
        const eventRooms = this.rooms.slice(1, -1); // 不包括入口和出口房间
        
        // 每层敌人数量
        const enemyCount = Math.min(this.rooms.length - 2, 3 + Math.floor(this.floor / 5));
        
        for (let i = 0; i < eventRooms.length && this.events.length < enemyCount + 2; i++) {
            const room = eventRooms[i];
            const roll = Math.random();
            
            if (roll < 0.4) {
                // 40% 敌人
                room.type = RoomType.ENEMY;
                this.events.push({
                    x: room.centerX,
                    y: room.centerY,
                    type: RoomType.ENEMY,
                    enemy: this.game.enemyManager.generateEnemy(this.floor, this.biome)
                });
            } else if (roll < 0.5) {
                // 10% 宝箱
                room.type = RoomType.CHEST;
                this.events.push({
                    x: room.centerX,
                    y: room.centerY,
                    type: RoomType.CHEST,
                    gold: Math.floor(10 + this.floor * 3)
                });
            } else if (roll < 0.6 && this.floor > 5) {
                // 10% 商店(5层后)
                room.type = RoomType.SHOP;
                this.events.push({
                    x: room.centerX,
                    y: room.centerY,
                    type: RoomType.SHOP,
                    npc: this.createShopNPC()
                });
            } else if (roll < 0.7 && this.floor > 3) {
                // 10% 陷阱(3层后)
                room.type = RoomType.TRAP;
                this.events.push({
                    x: room.centerX,
                    y: room.centerY,
                    type: RoomType.TRAP,
                    trap: this.createTrap()
                });
            } else if (roll < 0.8 && this.floor > 10) {
                // 10% NPC(10层后)
                room.type = RoomType.NPC;
                this.events.push({
                    x: room.centerX,
                    y: room.centerY,
                    type: RoomType.NPC,
                    npc: this.createQuestNPC()
                });
            }
            // 剩下30%是空房间
        }
    }
    
    createShopNPC() {
        return {
            name: '流浪商人',
            type: 'shop',
            dialogue: ['欢迎光临！', '这些都是好东西，看看吧！'],
            inventory: this.generateShopInventory()
        };
    }
    
    generateShopInventory() {
        const items = [];
        const itemCount = 4 + Math.floor(Math.random() * 4);
        
        // 生成随机物品
        for (let i = 0; i < itemCount; i++) {
            items.push(this.game.itemManager.generateShopItem(this.floor));
        }
        
        return items;
    }
    
    createTrap() {
        const traps = [
            { name: '尖刺陷阱', damage: 10 + this.floor * 2, type: 'damage' },
            { name: '毒气陷阱', damage: 5 + this.floor, type: 'poison', duration: 3 },
            { name: '火焰陷阱', damage: 8 + this.floor * 1.5, type: 'burn', duration: 2 }
        ];
        
        return traps[Math.floor(Math.random() * traps.length)];
    }
    
    createQuestNPC() {
        const npcs = [
            { name: '老猎人', dialogue: ['这森林里据说藏着一件神器...'] },
            { name: '迷路的商人', dialogue: ['我迷路了，能帮帮我吗？'] },
            { name: '神秘的占卜师', dialogue: ['我能看到你的命运...'] }
        ];
        
        return npcs[Math.floor(Math.random() * npcs.length)];
    }
    
    placePlayerStart() {
        if (this.rooms.length > 0) {
            const startRoom = this.rooms[0];
            this.playerStart = {
                x: startRoom.centerX,
                y: startRoom.centerY
            };
            startRoom.type = RoomType.ENTRANCE;
        }
    }
    
    placeStairs() {
        if (this.rooms.length > 1) {
            const lastRoom = this.rooms[this.rooms.length - 1];
            this.stairsPos = {
                x: lastRoom.centerX,
                y: lastRoom.centerY
            };
            
            // 检查是否已有事件
            const hasEvent = this.events.some(e => e.x === this.stairsPos.x && e.y === this.stairsPos.y);
            if (!hasEvent) {
                this.events.push({
                    x: this.stairsPos.x,
                    y: this.stairsPos.y,
                    type: RoomType.STAIRS
                });
            }
            
            lastRoom.type = RoomType.EXIT;
        }
    }
    
    placeBoss() {
        // BOSS房间
        const bossRoom = this.rooms[this.rooms.length - 1];
        bossRoom.type = RoomType.BOSS;
        bossRoom.cleared = false;
        
        // 移除该房间的其他事件
        this.events = this.events.filter(e => e.x !== bossRoom.centerX || e.y !== bossRoom.centerY);
        
        // 添加BOSS
        this.events.push({
            x: bossRoom.centerX,
            y: bossRoom.centerY,
            type: RoomType.BOSS,
            enemy: this.game.enemyManager.generateBoss(this.floor, this.biome)
        });
    }
    
    canMoveTo(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
        return this.tiles[y][x] !== 0;
    }
    
    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;
        return this.tiles[y][x];
    }
    
    getTileEvent(x, y) {
        return this.events.find(e => e.x === x && e.y === y);
    }
    
    removeEvent(x, y) {
        const index = this.events.findIndex(e => e.x === x && e.y === y);
        if (index >= 0) {
            this.events.splice(index, 1);
            // 标记房间为已清理
            const room = this.rooms.find(r => r.centerX === x && r.centerY === y);
            if (room) room.cleared = true;
        }
    }
    
    checkTileEvent(x, y) {
        const key = `${x},${y}`;
        
        // 标记为已访问
        this.visited.add(key);
        
        // 揭示周围区域
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                const rx = x + dx;
                const ry = y + dy;
                if (rx >= 0 && rx < this.width && ry >= 0 && ry < this.height) {
                    this.revealed.add(`${rx},${ry}`);
                }
            }
        }
    }
    
    isInSight(x, y) {
        return this.revealed.has(`${x},${y}`);
    }
    
    isVisited(x, y) {
        return this.visited.has(`${x},${y}`);
    }
    
    render(ctx, player) {
        const theme = this.biomeThemes[this.biome] || this.biomeThemes.forest;
        const tileSize = this.tileSize;
        
        // 计算玩家视野
        const sightRange = 4;
        const playerX = player.x;
        const playerY = player.y;
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.tiles[y][x];
                const key = `${x},${y}`;
                
                // 计算与玩家的距离
                const dist = Math.sqrt(Math.pow(x - playerX, 2) + Math.pow(y - playerY, 2));
                const inSight = dist <= sightRange;
                const isVisible = inSight || this.isInSight(x, y);
                
                if (!isVisible) {
                    ctx.fillStyle = '#0a0a0f';
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                    continue;
                }
                
                // 绘制地形
                if (tile === 0) {
                    // 墙
                    ctx.fillStyle = theme.wallColor;
                } else if (tile === 1 || tile === 2) {
                    // 地板
                    ctx.fillStyle = inSight ? theme.floorColor : this.dimColor(theme.floorColor, 0.5);
                }
                
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                
                // 绘制网格
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
        
        // 绘制事件
        this.renderEvents(ctx, playerX, playerY, sightRange);
        
        // 绘制玩家
        this.renderPlayer(ctx, player);
    }
    
    renderEvents(ctx, playerX, playerY, sightRange) {
        for (const event of this.events) {
            const dist = Math.sqrt(Math.pow(event.x - playerX, 2) + Math.pow(event.y - playerY, 2));
            const inSight = dist <= sightRange;
            
            if (!inSight && !this.isInSight(event.x, event.y)) continue;
            
            const tileSize = this.tileSize;
            const x = event.x * tileSize;
            const y = event.y * tileSize;
            const alpha = inSight ? 1 : 0.5;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            
            switch (event.type) {
                case RoomType.ENEMY:
                    if (!event.cleared) {
                        ctx.fillStyle = '#ff4444';
                        ctx.font = '24px serif';
                        ctx.fillText('⚔', x + 8, y + 28);
                    }
                    break;
                case RoomType.BOSS:
                    ctx.fillStyle = '#ff0000';
                    ctx.font = '28px serif';
                    ctx.fillText('👹', x + 4, y + 30);
                    break;
                case RoomType.CHEST:
                    ctx.fillStyle = '#ffd700';
                    ctx.font = '24px serif';
                    ctx.fillText('📦', x + 8, y + 28);
                    break;
                case RoomType.SHOP:
                    ctx.fillStyle = '#00ccff';
                    ctx.font = '24px serif';
                    ctx.fillText('🏪', x + 8, y + 28);
                    break;
                case RoomType.TRAP:
                    ctx.fillStyle = '#ff6600';
                    ctx.font = '20px serif';
                    ctx.fillText('⚠', x + 10, y + 28);
                    break;
                case RoomType.NPC:
                    ctx.fillStyle = '#66ff66';
                    ctx.font = '24px serif';
                    ctx.fillText('👤', x + 8, y + 28);
                    break;
                case RoomType.STAIRS:
                    ctx.fillStyle = '#88ff88';
                    ctx.font = '24px serif';
                    ctx.fillText('⬇', x + 8, y + 28);
                    break;
            }
            
            ctx.restore();
        }
    }
    
    renderPlayer(ctx, player) {
        const tileSize = this.tileSize;
        const x = player.x * tileSize;
        const y = player.y * tileSize;
        
        ctx.fillStyle = '#4488ff';
        ctx.font = '28px serif';
        ctx.fillText('🧙', x + 4, y + 30);
    }
    
    renderMinimap(ctx, x, y, w, h, player) {
        const scale = Math.min(w / this.width, h / this.height) * 0.8;
        const offsetX = x + (w - this.width * scale) / 2;
        const offsetY = y + (h - this.height * scale) / 2;
        
        // 背景
        ctx.fillStyle = 'rgba(10, 10, 20, 0.9)';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#4a4a6a';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
        
        // 标题
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('地图', x + w/2, y + 15);
        
        // 绘制地图
        const theme = this.biomeThemes[this.biome] || this.biomeThemes.forest;
        
        for (let my = 0; my < this.height; my++) {
            for (let mx = 0; mx < this.width; mx++) {
                const tile = this.tiles[my][mx];
                const px = offsetX + mx * scale;
                const py = offsetY + 25 + my * scale;
                
                const key = `${mx},${my}`;
                const inSight = Math.sqrt(Math.pow(mx - player.x, 2) + Math.pow(my - player.y, 2)) <= 4;
                
                if (!this.isInSight(key) && !inSight) {
                    ctx.fillStyle = '#1a1a1a';
                } else if (tile === 0) {
                    ctx.fillStyle = theme.wallColor;
                } else {
                    ctx.fillStyle = theme.floorColor;
                }
                
                ctx.fillRect(px, py, scale, scale);
            }
        }
        
        // 绘制玩家
        ctx.fillStyle = '#4488ff';
        ctx.fillRect(
            offsetX + player.x * scale,
            offsetY + 25 + player.y * scale,
            scale, scale
        );
        
        // 绘制事件
        for (const event of this.events) {
            if (!this.isInSight(`${event.x},${event.y}`)) continue;
            
            let color = '#888';
            switch (event.type) {
                case RoomType.ENEMY: color = '#ff4444'; break;
                case RoomType.BOSS: color = '#ff0000'; break;
                case RoomType.CHEST: color = '#ffd700'; break;
                case RoomType.SHOP: color = '#00ccff'; break;
                case RoomType.STAIRS: color = '#88ff88'; break;
            }
            
            ctx.fillStyle = color;
            ctx.fillRect(
                offsetX + event.x * scale,
                offsetY + 25 + event.y * scale,
                scale, scale
            );
        }
    }
    
    dimColor(color, factor) {
        // 简化：返回暗色
        return color;
    }
}

// 导出
export { DungeonGenerator, RoomType };
