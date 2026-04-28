/**
 * 符文之地 - 事件系统
 */

class GameEvent {
    constructor(type, data = {}) {
        this.id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        this.type = type;
        this.data = data;
        this.timestamp = Date.now();
        this.handled = false;
    }
}

class EventBus {
    constructor() {
        this.listeners = {};
    }
    
    on(eventType, callback, context = null) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }
        
        this.listeners[eventType].push({ callback, context });
        
        // 返回取消函数
        return () => this.off(eventType, callback);
    }
    
    off(eventType, callback) {
        if (!this.listeners[eventType]) return;
        
        this.listeners[eventType] = this.listeners[eventType].filter(
            listener => listener.callback !== callback
        );
    }
    
    emit(eventType, data = {}) {
        const event = new GameEvent(eventType, data);
        
        if (this.listeners[eventType]) {
            for (const listener of this.listeners[eventType]) {
                listener.callback.call(listener.context, event);
            }
        }
        
        return event;
    }
    
    once(eventType, callback, context = null) {
        const wrapped = (event) => {
            this.off(eventType, wrapped);
            callback.call(context, event);
        };
        
        return this.on(eventType, wrapped, context);
    }
}

// 游戏事件类型
const EventTypes = {
    // 玩家事件
    PLAYER_MOVE: 'player_move',
    PLAYER_ATTACK: 'player_attack',
    PLAYER_DAMAGED: 'player_damaged',
    PLAYER_DEATH: 'player_death',
    PLAYER_LEVEL_UP: 'player_level_up',
    PLAYER_USE_ITEM: 'player_use_item',
    PLAYER_EQUIP: 'player_equip',
    PLAYER_LEARN_SKILL: 'player_learn_skill',
    PLAYER_CAST_SKILL: 'player_cast_skill',
    
    // 敌人事件
    ENEMY_SPAWN: 'enemy_spawn',
    ENEMY_DEATH: 'enemy_death',
    ENEMY_ATTACK: 'enemy_attack',
    ENEMY_DAMAGED: 'enemy_damaged',
    
    // 战斗事件
    BATTLE_START: 'battle_start',
    BATTLE_END: 'battle_end',
    BATTLE_TURN: 'battle_turn',
    
    // 物品事件
    ITEM_PICKUP: 'item_pickup',
    ITEM_DROP: 'item_drop',
    ITEM_USE: 'item_use',
    ITEM_EQUIP: 'item_equip',
    
    // 任务事件
    QUEST_ACCEPT: 'quest_accept',
    QUEST_COMPLETE: 'quest_complete',
    QUEST_UPDATE: 'quest_update',
    QUEST_FAIL: 'quest_fail',
    
    // 成就事件
    ACHIEVEMENT_UNLOCK: 'achievement_unlock',
    
    // 地下城事件
    FLOOR_ENTER: 'floor_enter',
    FLOOR_CLEAR: 'floor_clear',
    DUNGEON_COMPLETE: 'dungeon_complete',
    
    // 系统事件
    GAME_SAVE: 'game_save',
    GAME_LOAD: 'game_load',
    GAME_PAUSE: 'game_pause',
    GAME_RESUME: 'game_resume',
    SETTINGS_CHANGE: 'settings_change',
    
    // UI事件
    UI_OPEN: 'ui_open',
    UI_CLOSE: 'ui_close',
    NOTIFICATION: 'notification',
    
    // 声音事件
    SOUND_PLAY: 'sound_play',
    MUSIC_PLAY: 'music_play',
    MUSIC_CHANGE: 'music_change'
};

// 事件处理器
class EventHandler {
    constructor(game) {
        this.game = game;
        this.eventBus = new EventBus();
        this.setupListeners();
    }
    
    setupListeners() {
        // 玩家升级
        this.eventBus.on(EventTypes.PLAYER_LEVEL_UP, (event) => {
            const { level } = event.data;
            this.game.notificationManager.showLevelUp(level);
        });
        
        // 获得成就
        this.eventBus.on(EventTypes.ACHIEVEMENT_UNLOCK, (event) => {
            const { achievement } = event.data;
            this.game.notificationManager.showAchievement(achievement.name);
        });
        
        // 拾取物品
        this.eventBus.on(EventTypes.ITEM_PICKUP, (event) => {
            const { item } = event.data;
            this.game.notificationManager.showItem(`获得 ${item.name}`);
        });
        
        // 玩家死亡
        this.eventBus.on(EventTypes.PLAYER_DEATH, (event) => {
            this.game.onGameOver();
        });
        
        // 敌人死亡
        this.eventBus.on(EventTypes.ENEMY_DEATH, (event) => {
            const { enemy, killer } = event.data;
            if (enemy.exp) {
                // 给予经验
            }
            if (enemy.gold) {
                this.game.notificationManager.showGold(enemy.gold);
            }
        });
        
        // 战斗开始
        this.eventBus.on(EventTypes.BATTLE_START, (event) => {
            const { enemy } = event.data;
            this.game.notificationManager.show(`遭遇 ${enemy.name}!`);
        });
        
        // 层级进入
        this.eventBus.on(EventTypes.FLOOR_ENTER, (event) => {
            const { floor } = event.data;
            // 更新音乐等
        });
    }
    
    emit(type, data = {}) {
        return this.eventBus.emit(type, data);
    }
    
    on(type, callback, context = null) {
        return this.eventBus.on(type, callback, context);
    }
}

export { EventBus, EventHandler, EventTypes, GameEvent };
