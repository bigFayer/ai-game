/**
 * 符文之地 - 游戏事件系统
 */

class GameEvent {
    constructor(id, data) {
        this.id = id;
        this.name = data.name;
        this.description = data.description;
        this.type = data.type; // random, triggered, timed
        this.condition = data.condition || (() => true);
        this.effect = data.effect;
        this.oneTime = data.oneTime !== undefined ? data.oneTime : true;
        this.triggered = false;
    }
    
    canTrigger() {
        return this.oneTime ? !this.triggered : true;
    }
    
    trigger(game) {
        if (!this.canTrigger()) return false;
        if (!this.condition(game)) return false;
        
        this.triggered = true;
        this.effect(game);
        return true;
    }
}

class EventManager {
    constructor(game) {
        this.game = game;
        this.events = {};
        this.triggeredEvents = new Set();
        this.initEvents();
    }
    
    initEvents() {
        // 随机事件
        this.events = {
            // 宝箱事件
            'chest_rare_find': new GameEvent('chest_rare_find', {
                name: '稀有发现',
                description: '在宝箱中发现了一件稀有装备！',
                type: 'random',
                condition: (g) => Math.random() < 0.1,
                effect: (g) => {
                    const item = g.itemManager.generateRandomItem(g.currentFloor);
                    item.rarity = 'RARE';
                    g.player.addItem(item);
                    g.showNotification('稀有发现！' + item.name);
                }
            }),
            
            // 金币事件
            'gold_rain': new GameEvent('gold_rain', {
                name: '金币雨',
                description: '地下城中突然下起了金币雨！',
                type: 'random',
                condition: (g) => Math.random() < 0.05,
                effect: (g) => {
                    const gold = 20 + g.currentFloor * 2;
                    g.player.gold += gold;
                    g.showNotification('获得' + gold + '金币！');
                }
            }),
            
            // 陷阱事件
            'trap_trigger': new GameEvent('trap_trigger', {
                name: '陷阱触发',
                description: '你踩到了陷阱！',
                type: 'triggered',
                condition: (g) => Math.random() < 0.3,
                effect: (g) => {
                    const damage = 10 + g.currentFloor * 3;
                    g.player.takeDamage(damage);
                    g.showNotification('陷阱造成' + damage + '伤害！');
                }
            }),
            
            // 治疗事件
            'healing_spring': new GameEvent('healing_spring', {
                name: '治愈之泉',
                description: '你发现了一眼治愈之泉！',
                type: 'random',
                condition: (g) => Math.random() < 0.08 && g.player.hp < g.player.totalMaxHP * 0.5,
                effect: (g) => {
                    g.player.hp = g.player.totalMaxHP;
                    g.showNotification('HP完全恢复！');
                }
            }),
            
            // 商人事件
            'wandering_merchant': new GameEvent('wandering_merchant', {
                name: '流浪商人',
                description: '一位流浪商人出现在你面前！',
                type: 'random',
                condition: (g) => Math.random() < 0.1,
                effect: (g) => {
                    g.state = 'SHOP';
                    g.showNotification('流浪商人出现！');
                }
            }),
            
            // 敌人强化
            'enemy_buff': new GameEvent('enemy_buff', {
                name: '黑暗力量',
                description: '黑暗力量使这个敌人变得更强！',
                type: 'triggered',
                condition: (g) => Math.random() < 0.15 && g.currentFloor > 10,
                effect: (g) => {
                    if (g.currentEnemy) {
                        g.currentEnemy.atk = Math.floor(g.currentEnemy.atk * 1.2);
                        g.currentEnemy.hp = Math.floor(g.currentEnemy.hp * 1.2);
                        g.showNotification('敌人获得了黑暗力量！');
                    }
                }
            }),
            
            // 玩家强化
            'blessing': new GameEvent('blessing', {
                name: '神圣祝福',
                description: '你获得了神圣祝福！',
                type: 'random',
                condition: (g) => Math.random() < 0.05,
                effect: (g) => {
                    g.player.bonusATK += 5;
                    g.player.bonusDEF += 3;
                    g.showNotification('攻击力+5，防御力+3！');
                }
            }),
            
            // 经验事件
            'exp_boost': new GameEvent('exp_boost', {
                name: '经验加成',
                description: '这个区域的魔力使你获得更多经验！',
                type: 'random',
                condition: (g) => Math.random() < 0.1,
                effect: (g) => {
                    g.expBoost = 1.5;
                    g.expBoostTimer = 3;
                    g.showNotification('接下来3层经验+50%！');
                }
            }),
            
            // 灵魂事件
            'soul_absorption': new GameEvent('soul_absorption', {
                name: '灵魂吸收',
                description: '你吸收了战场的灵魂！',
                type: 'triggered',
                condition: (g) => Math.random() < 0.2,
                effect: (g) => {
                    const heal = 10 + g.currentFloor;
                    const exp = 20 + g.currentFloor * 2;
                    g.player.heal(heal);
                    g.player.addExp(exp);
                    g.showNotification('灵魂吸收：HP+' + heal + ', 经验+' + exp);
                }
            })
        };
    }
    
    checkRandomEvents() {
        for (const event of Object.values(this.events)) {
            if (event.type === 'random' && event.canTrigger()) {
                event.trigger(this.game);
            }
        }
    }
    
    checkTriggeredEvents(trigger) {
        for (const event of Object.values(this.events)) {
            if (event.type === 'triggered' && event.canTrigger()) {
                event.trigger(this.game);
            }
        }
    }
    
    update() {
        // 每回合检查事件
        if (Math.random() < 0.1) { // 10%几率触发随机事件
            this.checkRandomEvents();
        }
        
        // 经验加成计时器
        if (this.game.expBoostTimer > 0) {
            this.game.expBoostTimer--;
            if (this.game.expBoostTimer <= 0) {
                this.game.expBoost = 1.0;
            }
        }
    }
    
    getAvailableEvents() {
        return Object.values(this.events).filter(e => e.canTrigger());
    }
    
    getEventDescription(eventId) {
        const event = this.events[eventId];
        return event ? event.description : '';
    }
}

export { GameEvent, EventManager };
