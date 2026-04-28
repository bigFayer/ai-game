/**
 * 符文之地 - 程序化地图生成器
 */

const ROOM_TYPES = {
    EMPTY: { weight: 30 },
    ENEMY: { weight: 25 },
    ELITE: { weight: 5 },
    BOSS: { weight: 0 },
    CHEST: { weight: 12 },
    SHOP: { weight: 8 },
    TREASURE: { weight: 5 },
    TRAP: { weight: 10 },
    NPC: { weight: 5 }
};

const ROOM_CONNECTIONS = {
    CORRIDOR: { minLength: 2, maxLength: 6 },
    DOOR: { width: 1 }
};

class Room {
    constructor(x, y, width, height, type = 'empty') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.connections = [];
        this.event = null;
        this.cleared = false;
        this.revealed = false;
        this.visited = false;
    }
    
    center() {
        return {
            x: Math.floor(this.x + this.width / 2),
            y: Math.floor(this.y + this.height / 2)
        };
    }
    
    intersects(other, padding = 1) {
        return !(this.x + this.width + padding < other.x ||
                other.x + other.width + padding < this.x ||
                this.y + this.height + padding < other.y ||
                other.y + other.height + padding < this.y);
    }
    
    contains(x, y) {
        return x >= this.x && x < this.x + this.width &&
               y >= this.y && y < this.y + this.height;
    }
}

class MapGenerator {
    constructor(options = {}) {
        this.width = options.width || 50;
        this.height = options.height || 40;
        this.tileSize = options.tileSize || 40;
        this.minRoomSize = options.minRoomSize || 4;
        this.maxRoomSize = options.maxRoomSize || 10;
        this.maxRooms = options.maxRooms || 20;
        this.maxIterations = options.maxIterations || 100;
        
        this.tiles = [];
        this.rooms = [];
        this.corridors = [];
        this.events = [];
    }
    
    generate(seed = null) {
        if (seed !== null) {
            this.seedRandom(seed);
        }
        
        this.initTiles();
        this.generateRooms();
        this.connectRooms();
        this.placeEvents();
        this.placePlayerStart();
        this.placeStairs();
        
        return this;
    }
    
    seedRandom(seed) {
        // 简单的伪随机数生成器
        this._seed = seed;
    }
    
    random() {
        this._seed = (this._seed * 1103515245 + 12345) & 0x7fffffff;
        return this._seed / 0x7fffffff;
    }
    
    initTiles() {
        this.tiles = [];
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = 0; // 0 = wall
            }
        }
    }
    
    generateRooms() {
        this.rooms = [];
        
        for (let i = 0; i < this.maxIterations && this.rooms.length < this.maxRooms; i++) {
            const width = this.minRoomSize + Math.floor(this.random() * (this.maxRoomSize - this.minRoomSize));
            const height = this.minRoomSize + Math.floor(this.random() * (this.maxRoomSize - this.minRoomSize));
            const x = 1 + Math.floor(this.random() * (this.width - width - 2));
            const y = 1 + Math.floor(this.random() * (this.height - height - 2));
            
            const newRoom = new Room(x, y, width, height);
            
            let intersects = false;
            for (const room of this.rooms) {
                if (newRoom.intersects(room, 2)) {
                    intersects = true;
                    break;
                }
            }
            
            if (!intersects) {
                this.carveRoom(newRoom);
                this.rooms.push(newRoom);
            }
        }
        
        // 排序房间
        this.rooms.sort((a, b) => 
            (a.x + a.y) - (b.x + b.y)
        );
    }
    
    carveRoom(room) {
        for (let y = room.y; y < room.y + room.height; y++) {
            for (let x = room.x; x < room.x + room.width; x++) {
                if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
                    this.tiles[y][x] = 1; // 1 = floor
                }
            }
        }
    }
    
    connectRooms() {
        for (let i = 0; i < this.rooms.length - 1; i++) {
            const roomA = this.rooms[i];
            const roomB = this.rooms[i + 1];
            
            const centerA = roomA.center();
            const centerB = roomB.center();
            
            // 随机选择水平或垂直优先
            if (this.random() < 0.5) {
                this.carveHorizontalTunnel(centerA.x, centerB.x, centerA.y);
                this.carveVerticalTunnel(centerA.y, centerB.y, centerB.x);
            } else {
                this.carveVerticalTunnel(centerA.y, centerB.y, centerA.x);
                this.carveHorizontalTunnel(centerA.x, centerB.x, centerB.y);
            }
            
            roomA.connections.push(roomB);
            roomB.connections.push(roomA);
        }
    }
    
    carveHorizontalTunnel(x1, x2, y) {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        
        for (let x = minX; x <= maxX; x++) {
            if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
                this.tiles[y][x] = 1;
            }
        }
    }
    
    carveVerticalTunnel(y1, y2, x) {
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        
        for (let y = minY; y <= maxY; y++) {
            if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
                this.tiles[y][x] = 1;
            }
        }
    }
    
    placeEvents() {
        // 保留一些房间不放事件
        const eventRooms = this.rooms.slice(1, -1);
        
        for (const room of eventRooms) {
            if (this.random() < 0.7) {
                const roll = this.random();
                let type;
                
                if (roll < 0.35) type = 'ENEMY';
                else if (roll < 0.5) type = 'CHEST';
                else if (roll < 0.6) type = 'SHOP';
                else if (roll < 0.7) type = 'TRAP';
                
                if (type) {
                    const center = room.center();
                    this.events.push({
                        x: center.x,
                        y: center.y,
                        type,
                        room,
                        data: this.generateEventData(type)
                    });
                }
            }
        }
    }
    
    generateEventData(type) {
        switch (type) {
            case 'ENEMY':
                return { enemyType: 'normal' };
            case 'CHEST':
                return { gold: 10 + Math.floor(this.random() * 50) };
            case 'SHOP':
                return { npcType: 'merchant' };
            case 'TRAP':
                return { trapType: 'damage' };
            default:
                return {};
        }
    }
    
    placePlayerStart() {
        if (this.rooms.length > 0) {
            const start = this.rooms[0].center();
            this.playerStart = { x: start.x, y: start.y };
        }
    }
    
    placeStairs() {
        if (this.rooms.length > 1) {
            const end = this.rooms[this.rooms.length - 1].center();
            this.stairsPos = { x: end.x, y: end.y };
        }
    }
    
    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;
        return this.tiles[y][x];
    }
    
    isWalkable(x, y) {
        return this.getTile(x, y) !== 0;
    }
    
    getRoomAt(x, y) {
        return this.rooms.find(room => room.contains(x, y));
    }
    
    getEventAt(x, y) {
        return this.events.find(e => e.x === x && e.y === y);
    }
    
    removeEventAt(x, y) {
        const index = this.events.findIndex(e => e.x === x && e.y === y);
        if (index >= 0) {
            const event = this.events[index];
            event.room.cleared = true;
            this.events.splice(index, 1);
            return event;
        }
        return null;
    }
    
    revealRoom(room) {
        room.revealed = true;
        for (let y = room.y - 2; y <= room.y + room.height + 2; y++) {
            for (let x = room.x - 2; x <= room.x + room.width + 2; x++) {
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    // 揭示周围区域
                }
            }
        }
    }
    
    render(ctx, playerX, playerY, viewRadius = 8) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const dist = Math.sqrt(Math.pow(x - playerX, 2) + Math.pow(y - playerY, 2));
                if (dist > viewRadius + 2) continue;
                
                const tile = this.tiles[y][x];
                const inSight = dist <= viewRadius;
                
                if (tile === 0) {
                    ctx.fillStyle = inSight ? '#2a2a3a' : '#1a1a2a';
                } else {
                    ctx.fillStyle = inSight ? '#3a3a4a' : '#2a2a3a';
                }
                
                ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        }
        
        // 渲染事件
        for (const event of this.events) {
            const dist = Math.sqrt(Math.pow(event.x - playerX, 2) + Math.pow(event.y - playerY, 2));
            if (dist > viewRadius + 2) continue;
            
            ctx.fillStyle = this.getEventColor(event.type);
            ctx.beginPath();
            ctx.arc(
                event.x * this.tileSize + this.tileSize / 2,
                event.y * this.tileSize + this.tileSize / 2,
                this.tileSize / 3,
                0, Math.PI * 2
            );
            ctx.fill();
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
}

export { MapGenerator, Room };
