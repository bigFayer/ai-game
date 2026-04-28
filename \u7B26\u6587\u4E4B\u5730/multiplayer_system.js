/**
 * 符文之地 - 多人联机系统（模拟）
 */

class MultiplayerManager {
    constructor(game) {
        this.game = game;
        this.isHost = false;
        this.isConnected = false;
        this.players = new Map();
        this.localPlayerId = null;
        this.syncInterval = 100; // ms
        this.lastSync = 0;
        this.lagCompensation = true;
        this.prediction = true;
        
        // 模拟玩家
        this.simulatedPlayers = [];
    }
    
    startHost() {
        this.isHost = true;
        this.isConnected = true;
        this.localPlayerId = 'host';
        
        this.players.set('host', {
            id: 'host',
            name: '主机玩家',
            isHost: true,
            isLocal: true
        });
        
        console.log('[Multiplayer] 作为主机开始游戏');
    }
    
    joinGame(hostId) {
        this.isHost = false;
        this.isConnected = true;
        this.localPlayerId = 'client';
        
        this.players.set('host', {
            id: 'host',
            name: '主机玩家',
            isHost: true,
            isLocal: false
        });
        
        this.players.set('client', {
            id: 'client',
            name: '客户端玩家',
            isLocal: true
        });
        
        console.log('[Multiplayer] 加入游戏');
    }
    
    disconnect() {
        this.isConnected = false;
        this.players.clear();
        this.simulatedPlayers = [];
        console.log('[Multiplayer] 断开连接');
    }
    
    addSimulatedPlayer(name) {
        const id = `player_${Date.now()}`;
        
        const player = {
            id,
            name,
            x: Math.random() * 50,
            y: Math.random() * 40,
            hp: 100,
            maxHp: 100,
            level: 1,
            characterClass: 'warrior',
            inventory: [],
            equipment: {},
            skills: [],
            buffs: [],
            direction: { x: 0, y: 0 },
            state: 'idle',
            lastUpdate: Date.now()
        };
        
        this.simulatedPlayers.push(player);
        this.players.set(id, player);
        
        return id;
    }
    
    update(dt) {
        if (!this.isConnected) return;
        
        // 更新模拟玩家
        for (const player of this.simulatedPlayers) {
            this.updateSimulatedPlayer(player, dt);
        }
        
        // 同步
        const now = Date.now();
        if (now - this.lastSync > this.syncInterval) {
            this.syncState();
            this.lastSync = now;
        }
    }
    
    updateSimulatedPlayer(player, dt) {
        // 随机移动
        if (Math.random() < 0.1) {
            player.direction = {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            };
        }
        
        // 移动
        const speed = 5 * dt;
        player.x += player.direction.x * speed;
        player.y += player.direction.y * speed;
        
        // 边界检查
        player.x = Math.max(0, Math.min(50, player.x));
        player.y = Math.max(0, Math.min(40, player.y));
        
        player.lastUpdate = Date.now();
    }
    
    syncState() {
        if (!this.isHost) return;
        
        // 广播状态给所有客户端
        const state = {
            type: 'sync',
            timestamp: Date.now(),
            players: this.getPlayersState(),
            dungeon: this.getDungeonState(),
            enemies: this.getEnemiesState()
        };
        
        // 模拟发送
        // socket.emit('game_sync', state);
    }
    
    getPlayersState() {
        const state = {};
        for (const [id, player] of this.players) {
            state[id] = {
                x: player.x,
                y: player.y,
                hp: player.hp,
                maxHp: player.maxHp,
                level: player.level,
                state: player.state,
                buffs: player.buffs
            };
        }
        return state;
    }
    
    getDungeonState() {
        return {
            currentFloor: this.game.currentFloor,
            currentBiome: this.game.currentBiome
        };
    }
    
    getEnemiesState() {
        return this.game.enemies.map(e => ({
            id: e.id,
            x: e.x,
            y: e.y,
            hp: e.hp,
            maxHp: e.maxHp,
            state: e.state
        }));
    }
    
    sendPlayerAction(action) {
        const message = {
            type: 'action',
            playerId: this.localPlayerId,
            action,
            timestamp: Date.now()
        };
        
        // 预测执行
        if (this.prediction) {
            this.applyAction(message);
        }
        
        // 发送到服务器
        // socket.emit('player_action', message);
    }
    
    applyAction(message) {
        const player = this.players.get(message.playerId);
        if (!player) return;
        
        switch (message.action.type) {
            case 'move':
                player.x = message.action.x;
                player.y = message.action.y;
                break;
            case 'attack':
                // 处理攻击
                break;
            case 'use_item':
                // 使用物品
                break;
        }
    }
    
    receiveSync(state) {
        if (!this.lagCompensation) return;
        
        // 应用服务器状态
        for (const [id, playerState] of Object.entries(state.players)) {
            if (id === this.localPlayerId) continue;
            
            const player = this.players.get(id);
            if (player) {
                // 插值
                player.x = playerState.x;
                player.y = playerState.y;
                player.hp = playerState.hp;
                player.state = playerState.state;
            }
        }
    }
    
    getOtherPlayers() {
        return Array.from(this.players.values()).filter(p => !p.isLocal);
    }
    
    getPlayerCount() {
        return this.players.size;
    }
}

export { MultiplayerManager };
