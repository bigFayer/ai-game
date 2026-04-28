/**
 * 符文之地 - 世界状态管理
 */

class WorldState {
    constructor() {
        this.day = 1;
        this.time = 0; // 0-24小时
        this.weather = 'clear';
        this.events = [];
        this.globalFlags = {};
        this.npcStates = {};
        this.worldModifiers = [];
    }
    
    advanceDay() {
        this.day++;
        this.time = 0;
        this.onDayChange();
    }
    
    advanceTime(hours = 1) {
        this.time += hours;
        if (this.time >= 24) {
            this.time = 0;
            this.advanceDay();
        }
    }
    
    setWeather(weather) {
        this.weather = weather;
        this.applyWeatherEffects();
    }
    
    setFlag(key, value) {
        this.globalFlags[key] = value;
    }
    
    getFlag(key, defaultValue = null) {
        return this.globalFlags[key] !== undefined ? this.globalFlags[key] : defaultValue;
    }
    
    onDayChange() {
        // 触发日常事件
    }
    
    applyWeatherEffects() {
        // 应用天气效果
    }
    
    save() {
        return {
            day: this.day,
            time: this.time,
            weather: this.weather,
            globalFlags: this.globalFlags,
            npcStates: this.npcStates
        };
    }
    
    load(data) {
        this.day = data.day || 1;
        this.time = data.time || 0;
        this.weather = data.weather || 'clear';
        this.globalFlags = data.globalFlags || {};
        this.npcStates = data.npcStates || {};
    }
}

// 天气效果
const WEATHER_EFFECTS = {
    clear: {
        name: '晴朗',
        effects: {},
        particle: null,
        message: null
    },
    rain: {
        name: '下雨',
        effects: { spd: -0.1 },
        particle: 'rain',
        message: '雨越下越大了...'
    },
    heavy_rain: {
        name: '暴雨',
        effects: { spd: -0.2, atk: -0.1 },
        particle: 'rain_heavy',
        message: '暴雨倾盆，视野模糊...'
    },
    snow: {
        name: '下雪',
        effects: { spd: -0.3 },
        particle: 'snow',
        message: '雪花飘飘...'
    },
    blizzard: {
        name: '暴风雪',
        effects: { spd: -0.5, atk: -0.2 },
        particle: 'blizzard',
        message: '暴风雪来袭！'
    },
    fog: {
        name: '大雾',
        effects: { sight: -2 },
        particle: 'fog',
        message: '雾越来越浓了...'
    },
    sandstorm: {
        name: '沙尘暴',
        effects: { spd: -0.3, sight: -1 },
        particle: 'sand',
        message: '沙尘暴席卷而来！'
    },
    storm: {
        name: '暴风雨',
        effects: { spd: -0.2, atk: -0.1 },
        particle: 'lightning',
        message: '雷电交加...'
    }
};

// 世界事件
const WORLD_EVENTS = {
    full_moon: {
        id: 'full_moon',
        name: '满月',
        duration: 1,
        effects: { luk: 10, enemySpawn: 1.2 },
        message: '满月之夜，狼人出没...'
    },
    merchants_day: {
        id: 'merchants_day',
        name: '商人日',
        duration: 1,
        effects: { shopPrices: 0.8 },
        message: '今天是商人日，商店打折！'
    },
    monster_plague: {
        id: 'monster_plague',
        name: '怪物瘟疫',
        duration: 3,
        effects: { enemyHp: 0.7, enemyAtk: 1.3 },
        message: '怪物们变得狂暴了...'
    },
    blessed_day: {
        id: 'blessed_day',
        name: '祝福之日',
        duration: 1,
        effects: { playerHpRegen: 2, playerMpRegen: 2 },
        message: '今日受神明祝福，回复翻倍！'
    },
    dragon_awakening: {
        id: 'dragon_awakening',
        name: '巨龙苏醒',
        duration: 2,
        effects: { bossAtk: 1.5, bossHp: 1.3 },
        message: '巨龙的气息弥漫在空气中...'
    }
};

export { WorldState, WEATHER_EFFECTS, WORLD_EVENTS };
