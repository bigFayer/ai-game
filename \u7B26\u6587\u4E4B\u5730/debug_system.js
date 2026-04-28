/**
 * 符文之地 - 调试系统
 */

class DebugSystem {
    constructor(game) {
        this.game = game;
        this.enabled = false;
        this.showFPS = true;
        this.showPosition = true;
        this.showPerformance = false;
        this.showCollision = false;
        this.showPathfinding = false;
        this.showGrid = false;
        this.logLevel = 'info'; // debug, info, warn, error
        this.logs = [];
        this.maxLogs = 100;
        
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        this.updateTime = 0;
        this.renderTime = 0;
        
        this.commands = new Map();
        this.registerDefaultCommands();
    }
    
    toggle() {
        this.enabled = !this.enabled;
        console.log(`[Debug] 调试模式: ${this.enabled ? '开启' : '关闭'}`);
    }
    
    registerCommand(name, callback, description) {
        this.commands.set(name, { callback, description });
    }
    
    registerDefaultCommands() {
        this.registerCommand('help', () => {
            console.log('=== 可用命令 ===');
            for (const [name, cmd] of this.commands) {
                console.log(`${name}: ${cmd.description}`);
            }
        }, '显示帮助');
        
        this.registerCommand('spawn', (args) => {
            const enemyType = args[0] || 'forest_goblin_1';
            const x = parseInt(args[1]) || 10;
            const y = parseInt(args[2]) || 10;
            
            const enemy = EnemyFactory.create(enemyType, x, y);
            this.game.enemies.push(enemy);
            console.log(`[Debug] 生成敌人: ${enemyType} at (${x}, ${y})`);
        }, 'spawn <type> <x> <y>');
        
        this.registerCommand('heal', () => {
            if (this.game.player) {
                this.game.player.hp = this.game.player.maxHp;
                this.game.player.mp = this.game.player.maxMp;
                console.log('[Debug] 玩家已满血满蓝');
            }
        }, '满血满蓝');
        
        this.registerCommand('killall', () => {
            this.game.enemies = [];
            console.log('[Debug] 所有敌人已清除');
        }, '清除所有敌人');
        
        this.registerCommand('levelup', (args) => {
            const levels = parseInt(args[0]) || 1;
            if (this.game.player) {
                for (let i = 0; i < levels; i++) {
                    this.game.player.addExp(this.game.player.expToNextLevel);
                }
                console.log(`[Debug] 升级 ${levels} 次`);
            }
        }, 'levelup [n]');
        
        this.registerCommand('gold', (args) => {
            const amount = parseInt(args[0]) || 1000;
            if (this.game.player) {
                this.game.player.gold += amount;
                console.log(`[Debug] 获得 ${amount} 金币`);
            }
        }, 'gold [n]');
        
        this.registerCommand('tp', (args) => {
            const x = parseInt(args[0]) || 0;
            const y = parseInt(args[1]) || 0;
            if (this.game.player) {
                this.game.player.x = x;
                this.game.player.y = y;
                console.log(`[Debug] 传送到 (${x}, ${y})`);
            }
        }, 'tp <x> <y>');
        
        this.registerCommand('floor', (args) => {
            const floor = parseInt(args[0]) || 1;
            this.game.currentFloor = floor;
            this.game.generateDungeon();
            console.log(`[Debug] 传送到第 ${floor} 层`);
        }, 'floor <n>');
        
        this.registerCommand('debug', (args) => {
            const option = args[0];
            if (option === 'fps') this.showFPS = !this.showFPS;
            else if (option === 'pos') this.showPosition = !this.showPosition;
            else if (option === 'perf') this.showPerformance = !this.showPerformance;
            else if (option === 'collision') this.showCollision = !this.showCollision;
            console.log(`[Debug] 调试选项: fps=${this.showFPS} pos=${this.showPosition} perf=${this.showPerformance}`);
        }, 'debug [fps|pos|perf|collision]');
        
        this.registerCommand('give', (args) => {
            const itemId = args[0];
            const quantity = parseInt(args[1]) || 1;
            if (itemId) {
                this.game.inventory.addItem(itemId, quantity);
                console.log(`[Debug] 获得物品: ${itemId} x${quantity}`);
            }
        }, 'give <item> [quantity]');
        
        this.registerCommand('stats', () => {
            const stats = this.game.stats;
            console.log('=== 统计数据 ===');
            console.log(`击杀: ${stats.enemiesKilled}`);
            console.log(`死亡: ${stats.deaths}`);
            console.log(`最高层: ${stats.highestFloor}`);
            console.log(`最高等级: ${stats.highestLevel}`);
            console.log(`最大连击: ${stats.maxCombo}`);
            console.log(`总金币: ${stats.totalGoldEarned}`);
        }, '显示统计');
    }
    
    executeCommand(input) {
        const parts = input.split(' ');
        const name = parts[0];
        const args = parts.slice(1);
        
        const cmd = this.commands.get(name);
        if (cmd) {
            cmd.callback(args);
        } else {
            console.log(`[Debug] 未知命令: ${name}`);
        }
    }
    
    log(level, message) {
        const levels = ['debug', 'info', 'warn', 'error'];
        const levelPriority = levels.indexOf(level);
        const currentPriority = levels.indexOf(this.logLevel);
        
        if (levelPriority < currentPriority) return;
        
        const log = {
            level,
            message,
            timestamp: Date.now()
        };
        
        this.logs.push(log);
        
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        console.log(`[${level.toUpperCase()}] ${message}`);
    }
    
    debug(message) { this.log('debug', message); }
    info(message) { this.log('info', message); }
    warn(message) { this.log('warn', message); }
    error(message) { this.log('error', message); }
    
    update(dt) {
        if (!this.enabled) return;
        
        // FPS计算
        this.frameCount++;
        this.updateTime += dt;
        
        if (this.updateTime >= 1) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.updateTime = 0;
        }
    }
    
    renderDebug(ctx) {
        if (!this.enabled) return;
        
        ctx.save();
        
        let y = 10;
        const x = 10;
        
        // FPS
        if (this.showFPS) {
            ctx.fillStyle = '#00ff00';
            ctx.font = '14px monospace';
            ctx.fillText(`FPS: ${this.fps}`, x, y += 20);
        }
        
        // 位置
        if (this.showPosition && this.game.player) {
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`Position: (${this.game.player.x.toFixed(1)}, ${this.game.player.y.toFixed(1)})`, x, y += 20);
            ctx.fillText(`Floor: ${this.game.currentFloor}`, x, y += 20);
            ctx.fillText(`HP: ${this.game.player.hp}/${this.game.player.maxHp}`, x, y += 20);
        }
        
        // 性能
        if (this.showPerformance) {
            ctx.fillStyle = '#ffff00';
            ctx.fillText(`Update: ${(this.updateTime * 1000).toFixed(2)}ms`, x, y += 20);
            ctx.fillText(`Entities: ${this.game.enemies?.length || 0}`, x, y += 20);
        }
        
        // 碰撞网格
        if (this.showCollision) {
            this.renderCollisionGrid(ctx);
        }
        
        // 路径
        if (this.showPathfinding && this.game.enemies) {
            this.renderPathfinding(ctx);
        }
        
        ctx.restore();
    }
    
    renderCollisionGrid(ctx) {
        if (!this.game.dungeonMap) return;
        
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        
        const map = this.game.dungeonMap;
        
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                if (map.isWalkable(x, y)) {
                    ctx.strokeRect(x * 40, y * 40, 40, 40);
                }
            }
        }
    }
    
    renderPathfinding(ctx) {
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.lineWidth = 2;
        
        for (const enemy of this.game.enemies) {
            if (enemy.ai?.path) {
                ctx.beginPath();
                ctx.moveTo(enemy.x * 40, enemy.y * 40);
                
                for (const point of enemy.ai.path) {
                    ctx.lineTo(point.x * 40, point.y * 40);
                }
                
                ctx.stroke();
            }
        }
    }
}

export { DebugSystem };
