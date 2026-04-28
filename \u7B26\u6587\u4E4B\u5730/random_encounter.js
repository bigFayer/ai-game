/**
 * 符文之地 - 随机事件系统
 */

const RANDOM_EVENTS = {
    // 发现事件
    find_gold: {
        id: 'find_gold',
        name: '发现金币',
        description: '你在角落发现了一些金币！',
        type: 'positive',
        choices: [
            { text: '拿走', action: (game) => { const gold = 10 + Math.floor(Math.random() * 50); game.player.gold += gold; game.notificationManager.showGold(gold); } },
            { text: '离开', action: (game) => {} }
        ]
    },
    
    find_item: {
        id: 'find_item',
        name: '发现物品',
        description: '你发现了地上有一个宝箱！',
        type: 'positive',
        choices: [
            { text: '打开', action: (game) => { 
                const items = ['health_potion', 'mana_potion', 'antidote'];
                const itemId = items[Math.floor(Math.random() * items.length)];
                game.inventory.addItem(itemId, 1);
                game.notificationManager.showItem(`获得 ${itemId}`);
            }},
            { text: '离开', action: (game) => {} }
        ]
    },
    
    trap: {
        id: 'trap',
        name: '陷阱！',
        description: '你踩到了陷阱！',
        type: 'negative',
        choices: [
            { text: '继续前进', action: (game) => { 
                const damage = 10 + Math.floor(Math.random() * 20);
                game.player.takeDamage(damage);
                game.notificationManager.showDamage(`受到 ${damage} 点伤害`);
            }}
        ]
    },
    
    mysterious_voice: {
        id: 'mysterious_voice',
        name: '神秘声音',
        description: '"勇敢的冒险者...我这里有一个交易..."',
        type: 'neutral',
        choices: [
            { text: '听听看', action: (game) => {
                if (game.player.gold >= 50) {
                    game.player.gold -= 50;
                    game.player.exp += 50;
                    game.notificationManager.show('你获得了50点经验!');
                } else {
                    game.notificationManager.show('金币不够...');
                }
            }},
            { text: '离开', action: (game) => {} }
        ]
    },
    
    heal_spring: {
        id: 'heal_spring',
        name: '治愈之泉',
        description: '你发现了一眼泉水，喝一口感觉精力充沛。',
        type: 'positive',
        choices: [
            { text: '饮用', action: (game) => {
                game.player.heal(Math.floor(game.player.maxHp * 0.5));
                game.notificationManager.show('恢复了50%生命值!');
            }},
            { text: '离开', action: (game) => {} }
        ]
    },
    
    merchant_encounter: {
        id: 'merchant_encounter',
        name: '流浪商人',
        description: '一个商人在这里摆摊卖东西。',
        type: 'neutral',
        choices: [
            { text: '交易', action: (game) => { game.stateManager.set('SHOP'); }},
            { text: '离开', action: (game) => {} }
        ]
    },
    
    ancient_statue: {
        id: 'ancient_statue',
        name: '古老雕像',
        description: '这座雕像似乎在注视着你...',
        type: 'neutral',
        choices: [
            { text: '祈祷', action: (game) => {
                if (Math.random() < 0.5) {
                    game.player.buff('atk', 0.2, 5);
                    game.notificationManager.show('获得攻击力+20% (5回合)');
                } else {
                    const damage = 15;
                    game.player.takeDamage(damage);
                    game.notificationManager.showDamage(`受到 ${damage} 点神秘伤害`);
                }
            }},
            { text: '离开', action: (game) => {} }
        ]
    },
    
    hidden_passage: {
        id: 'hidden_passage',
        name: '隐藏通道',
        description: '你发现了一条隐藏的通道！',
        type: 'positive',
        choices: [
            { text: '探索', action: (game) => {
                if (Math.random() < 0.6) {
                    const gold = 30 + Math.floor(Math.random() * 70);
                    game.player.gold += gold;
                    game.notificationManager.showGold(gold);
                } else {
                    const enemy = game.getRandomEnemyForBiome();
                    game.startCombat(enemy);
                }
            }},
            { text: '离开', action: (game) => {} }
        ]
    },
    
    ambushed: {
        id: 'ambushed',
        name: '伏击！',
        description: '你被一群敌人伏击了！',
        type: 'negative',
        choices: [
            { text: '应战', action: (game) => {
                const enemy = game.getRandomEnemyForBiome();
                game.startCombat(enemy);
            }}
        ]
    }
};

class RandomEventManager {
    constructor(game) {
        this.game = game;
        this.cooldown = 0;
        this.minInterval = 5; // 最少5回合
        this.maxInterval = 15; // 最多15回合
        this.nextEventTurn = this.randomInterval();
        this.currentEvent = null;
    }
    
    randomInterval() {
        return this.minInterval + Math.floor(Math.random() * (this.maxInterval - this.minInterval));
    }
    
    update(dt) {
        if (this.cooldown > 0) {
            this.cooldown -= dt;
            return;
        }
        
        this.nextEventTurn--;
        
        if (this.nextEventTurn <= 0) {
            this.triggerRandomEvent();
            this.nextEventTurn = this.randomInterval();
        }
    }
    
    triggerRandomEvent() {
        const eventIds = Object.keys(RANDOM_EVENTS);
        const eventId = eventIds[Math.floor(Math.random() * eventIds.length)];
        const event = RANDOM_EVENTS[eventId];
        
        this.currentEvent = event;
        
        // 显示事件UI
        if (this.game.ui && this.game.ui.showEvent) {
            this.game.ui.showEvent(event);
        }
    }
    
    handleChoice(choiceIndex) {
        if (!this.currentEvent || !this.currentEvent.choices[choiceIndex]) return;
        
        const choice = this.currentEvent.choices[choiceIndex];
        choice.action(this.game);
        
        this.currentEvent = null;
        this.cooldown = 2; // 2秒冷却
    }
    
    skipEvent() {
        this.currentEvent = null;
        this.cooldown = 2;
    }
}

export { RandomEventManager, RANDOM_EVENTS };
