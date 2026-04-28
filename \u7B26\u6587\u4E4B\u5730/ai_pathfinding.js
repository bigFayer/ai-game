/**
 * 符文之地 - AI路径规划系统
 */

class PathNode {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.g = 0; // 从起点到当前节点的实际代价
        this.h = 0; // 从当前节点到终点的估计代价
        this.f = 0; // g + h
        this.parent = null;
        this.walkable = true;
    }
}

class Pathfinder {
    constructor(map) {
        this.map = map;
        this.width = map?.width || 50;
        this.height = map?.height || 40;
        this.grid = [];
        this.initGrid();
    }
    
    initGrid() {
        this.grid = [];
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x] = new PathNode(x, y);
            }
        }
    }
    
    isWalkable(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
        return this.map?.getTile(x, y) === 1;
    }
    
    heuristic(x1, y1, x2, y2) {
        // 曼哈顿距离
        return Math.abs(x2 - x1) + Math.abs(y2 - y1);
    }
    
    getNeighbors(node) {
        const neighbors = [];
        const directions = [
            [-1, -1], [0, -1], [1, -1],
            [-1, 0],          [1, 0],
            [-1, 1],  [0, 1],  [1, 1]
        ];
        
        for (const [dx, dy] of directions) {
            const nx = node.x + dx;
            const ny = node.y + dy;
            
            if (this.isWalkable(nx, ny)) {
                neighbors.push(this.grid[ny][nx]);
            }
        }
        
        return neighbors;
    }
    
    findPath(startX, startY, endX, endY, maxIterations = 1000) {
        if (!this.isWalkable(endX, endY)) {
            return null;
        }
        
        // 初始化
        this.initGrid();
        
        const startNode = this.grid[startY][startX];
        const endNode = this.grid[endY][endX];
        
        const openList = [startNode];
        const closedSet = new Set();
        
        startNode.g = 0;
        startNode.h = this.heuristic(startX, startY, endX, endY);
        startNode.f = startNode.g + startNode.h;
        
        let iterations = 0;
        
        while (openList.length > 0 && iterations < maxIterations) {
            iterations++;
            
            // 找到F值最小的节点
            openList.sort((a, b) => a.f - b.f);
            const current = openList.shift();
            
            // 到达终点
            if (current === endNode) {
                return this.reconstructPath(current);
            }
            
            closedSet.add(`${current.x},${current.y}`);
            
            // 检查邻居
            for (const neighbor of this.getNeighbors(current)) {
                const key = `${neighbor.x},${neighbor.y}`;
                if (closedSet.has(key)) continue;
                
                const isDiagonal = neighbor.x !== current.x && neighbor.y !== current.y;
                const moveCost = isDiagonal ? 1.414 : 1;
                
                const tentativeG = current.g + moveCost;
                
                const inOpen = openList.includes(neighbor);
                
                if (!inOpen || tentativeG < neighbor.g) {
                    neighbor.parent = current;
                    neighbor.g = tentativeG;
                    neighbor.h = this.heuristic(neighbor.x, neighbor.y, endX, endY);
                    neighbor.f = neighbor.g + neighbor.h;
                    
                    if (!inOpen) {
                        openList.push(neighbor);
                    }
                }
            }
        }
        
        // 找不到路径
        return null;
    }
    
    reconstructPath(endNode) {
        const path = [];
        let current = endNode;
        
        while (current.parent) {
            path.unshift({ x: current.x, y: current.y });
            current = current.parent;
        }
        
        return path;
    }
    
    findPathAvoiding(startX, startY, endX, endY, avoidPositions) {
        // 临时将避免位置设为不可走
        const tempBlocked = new Set();
        
        for (const pos of avoidPositions) {
            if (this.isWalkable(pos.x, pos.y)) {
                this.grid[pos.y][pos.x].walkable = false;
                tempBlocked.add(`${pos.x},${pos.y}`);
            }
        }
        
        const path = this.findPath(startX, startY, endX, endY);
        
        // 恢复
        for (const key of tempBlocked) {
            const [x, y] = key.split(',').map(Number);
            this.grid[y][x].walkable = true;
        }
        
        return path;
    }
}

class EnemyAI {
    constructor(enemy, game) {
        this.enemy = enemy;
        this.game = game;
        this.state = 'idle';
        this.target = null;
        this.path = [];
        this.pathIndex = 0;
        this.pathfinder = new Pathfinder(game.dungeonMap);
        this.stateTimer = 0;
        this.attackRange = 1.5;
        this.sightRange = 8;
        this.moveTimer = 0;
        this.moveInterval = 0.5;
        this.thinkTimer = 0;
        this.thinkInterval = 0.5;
    }
    
    update(dt) {
        this.thinkTimer += dt;
        this.moveTimer += dt;
        
        // 思考
        if (this.thinkTimer >= this.thinkInterval) {
            this.thinkTimer = 0;
            this.think();
        }
        
        // 执行状态
        switch (this.state) {
            case 'idle':
                this.updateIdle(dt);
                break;
            case 'chase':
                this.updateChase(dt);
                break;
            case 'attack':
                this.updateAttack(dt);
                break;
            case 'retreat':
                this.updateRetreat(dt);
                break;
            case 'wander':
                this.updateWander(dt);
                break;
            case 'flee':
                this.updateFlee(dt);
                break;
        }
    }
    
    think() {
        const player = this.game.player;
        if (!player) return;
        
        const dx = player.x - this.enemy.x;
        const dy = player.y - this.enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // 检查是否在视野内
        if (dist <= this.sightRange) {
            this.target = player;
            
            // 是否在攻击范围
            if (dist <= this.attackRange) {
                this.state = 'attack';
            } else {
                this.state = 'chase';
                this.recalculatePath();
            }
        } else {
            // 视野外
            if (this.state === 'chase' || this.state === 'attack') {
                this.state = 'wander';
                this.path = [];
            }
        }
        
        // HP低时撤退
        if (this.enemy.hp / this.enemy.maxHp < 0.3 && this.state !== 'idle') {
            this.state = 'retreat';
        }
    }
    
    recalculatePath() {
        if (!this.target) return;
        
        this.path = this.pathfinder.findPath(
            Math.floor(this.enemy.x),
            Math.floor(this.enemy.y),
            Math.floor(this.target.x),
            Math.floor(this.target.y)
        );
        
        this.pathIndex = 0;
    }
    
    updateIdle(dt) {
        // 随机移动
        if (Math.random() < 0.3) {
            this.state = 'wander';
        }
    }
    
    updateChase(dt) {
        if (!this.target || this.path.length === 0) {
            this.state = 'idle';
            return;
        }
        
        if (this.moveTimer < this.moveInterval) return;
        this.moveTimer = 0;
        
        // 跟随路径
        if (this.pathIndex < this.path.length) {
            const nextPos = this.path[this.pathIndex];
            
            // 检查是否接近目标
            const distToTarget = Math.sqrt(
                Math.pow(nextPos.x - this.target.x, 2) +
                Math.pow(nextPos.y - this.target.y, 2)
            );
            
            if (distToTarget <= this.attackRange) {
                this.state = 'attack';
                return;
            }
            
            // 移动
            const dx = nextPos.x - this.enemy.x;
            const dy = nextPos.y - this.enemy.y;
            
            this.enemy.move(dx, dy);
            
            this.pathIndex++;
        } else {
            // 重新计算路径
            this.recalculatePath();
        }
    }
    
    updateAttack(dt) {
        // 攻击
        if (this.enemy.canAttack()) {
            this.enemy.attack(this.target);
        }
        
        // 攻击后可能有短暂硬直
        this.stateTimer += dt;
        if (this.stateTimer > 0.5) {
            this.stateTimer = 0;
            // 重新判断
        }
    }
    
    updateRetreat(dt) {
        // 向后移动
        if (!this.target) {
            this.state = 'idle';
            return;
        }
        
        const dx = this.enemy.x - this.target.x;
        const dy = this.enemy.y - this.target.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 3) {
            // 太近了，继续后退
            this.enemy.move(-dx / dist, -dy / dist);
        } else {
            // 脱离战斗
            this.state = 'idle';
        }
    }
    
    updateWander(dt) {
        if (this.moveTimer < this.moveInterval) return;
        this.moveTimer = 0;
        
        // 随机移动
        const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        const dir = directions[Math.floor(Math.random() * directions.length)];
        
        const newX = this.enemy.x + dir[0];
        const newY = this.enemy.y + dir[1];
        
        if (this.pathfinder.isWalkable(newX, newY)) {
            this.enemy.move(dir[0], dir[1]);
        }
    }
    
    updateFlee(dt) {
        // 逃跑
    }
}

export { Pathfinder, PathNode, EnemyAI };
