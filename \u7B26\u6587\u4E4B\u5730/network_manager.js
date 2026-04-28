/**
 * 符文之地 - 网络与实时通信
 */

class NetworkManager {
    constructor(game) {
        this.game = game;
        this.ws = null;
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        this.pingInterval = null;
        this.lastPing = 0;
        this.latency = 0;
        this.serverUrl = 'ws://localhost:8080';
        this.messageQueue = [];
        this.eventHandlers = new Map();
    }
    
    connect(url = null) {
        if (url) {
            this.serverUrl = url;
        }
        
        try {
            this.ws = new WebSocket(this.serverUrl);
            this.setupWebSocket();
        } catch (e) {
            console.error('[Network] 连接失败:', e);
            this.scheduleReconnect();
        }
    }
    
    setupWebSocket() {
        this.ws.onopen = () => {
            console.log('[Network] 连接成功');
            this.connected = true;
            this.reconnectAttempts = 0;
            this.startPing();
            this.flushMessageQueue();
        };
        
        this.ws.onclose = () => {
            console.log('[Network] 连接关闭');
            this.connected = false;
            this.stopPing();
            this.scheduleReconnect();
        };
        
        this.ws.onerror = (error) => {
            console.error('[Network] 连接错误:', error);
        };
        
        this.ws.onmessage = (event) => {
            this.handleMessage(event.data);
        };
    }
    
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.connected = false;
        this.stopPing();
    }
    
    scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('[Network] 达到最大重连次数');
            return;
        }
        
        this.reconnectAttempts++;
        console.log(`[Network] ${this.reconnectDelay / 1000}秒后尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        
        setTimeout(() => {
            this.connect();
        }, this.reconnectDelay);
    }
    
    send(type, data = {}) {
        const message = {
            type,
            data,
            timestamp: Date.now(),
            clientId: this.clientId
        };
        
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            this.messageQueue.push(message);
        }
    }
    
    flushMessageQueue() {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            this.send(message.type, message.data);
        }
    }
    
    handleMessage(rawMessage) {
        try {
            const message = JSON.parse(rawMessage);
            
            switch (message.type) {
                case 'pong':
                    this.handlePong(message);
                    break;
                case 'game_state':
                    this.handleGameState(message.data);
                    break;
                case 'player_joined':
                    this.handlePlayerJoined(message.data);
                    break;
                case 'player_left':
                    this.handlePlayerLeft(message.data);
                    break;
                case 'player_action':
                    this.handlePlayerAction(message.data);
                    break;
                case 'chat':
                    this.handleChat(message.data);
                    break;
                default:
                    this.emit(message.type, message.data);
            }
        } catch (e) {
            console.error('[Network] 消息解析失败:', e);
        }
    }
    
    handlePong(message) {
        this.latency = Date.now() - this.lastPing;
    }
    
    handleGameState(data) {
        // 同步游戏状态
        this.game.multiplayerManager?.receiveSync(data);
    }
    
    handlePlayerJoined(data) {
        console.log(`[Network] 玩家加入: ${data.name}`);
        this.game.multiplayerManager?.addSimulatedPlayer(data.name);
    }
    
    handlePlayerLeft(data) {
        console.log(`[Network] 玩家离开: ${data.name}`);
    }
    
    handlePlayerAction(data) {
        this.game.multiplayerManager?.applyAction(data);
    }
    
    handleChat(data) {
        console.log(`[Chat] ${data.player}: ${data.message}`);
        this.game.ui?.addChatMessage(data.player, data.message);
    }
    
    startPing() {
        this.pingInterval = setInterval(() => {
            this.lastPing = Date.now();
            this.send('ping');
        }, 5000);
    }
    
    stopPing() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }
    
    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(handler);
    }
    
    off(event, handler) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index >= 0) {
                handlers.splice(index, 1);
            }
        }
    }
    
    emit(event, data) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            for (const handler of handlers) {
                handler(data);
            }
        }
    }
    
    sendChat(message) {
        this.send('chat', { message });
    }
    
    broadcastAction(action) {
        this.send('player_action', { action });
    }
}

export { NetworkManager };
