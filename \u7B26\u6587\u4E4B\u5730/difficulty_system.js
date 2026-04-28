/**
 * 符文之地 - 难度系统
 */

const DIFFICULTY_PRESETS = {
    EASY: {
        name: '简单',
        description: '适合新手',
        playerDamageTaken: 0.7,
        playerDamageDealt: 1.2,
        enemyHp: 0.8,
        enemyAtk: 0.7,
        goldEarned: 1.3,
        expEarned: 1.2,
        enemySpawnRate: 0.8,
        bossHpMultiplier: 0.7,
        bossAtkMultiplier: 0.7,
        friendlyFire: false,
        autoHealRate: 1.5,
        startingGold: 100,
        startingItems: [
            { id: 'health_potion', quantity: 10 },
            { id: 'mana_potion', quantity: 5 }
        ]
    },
    NORMAL: {
        name: '普通',
        description: '标准难度',
        playerDamageTaken: 1.0,
        playerDamageDealt: 1.0,
        enemyHp: 1.0,
        enemyAtk: 1.0,
        goldEarned: 1.0,
        expEarned: 1.0,
        enemySpawnRate: 1.0,
        bossHpMultiplier: 1.0,
        bossAtkMultiplier: 1.0,
        friendlyFire: true,
        autoHealRate: 1.0,
        startingGold: 50,
        startingItems: [
            { id: 'health_potion', quantity: 3 },
            { id: 'mana_potion', quantity: 2 }
        ]
    },
    HARD: {
        name: '困难',
        description: '适合有经验的玩家',
        playerDamageTaken: 1.3,
        playerDamageDealt: 0.9,
        enemyHp: 1.2,
        enemyAtk: 1.2,
        goldEarned: 0.9,
        expEarned: 1.1,
        enemySpawnRate: 1.2,
        bossHpMultiplier: 1.3,
        bossAtkMultiplier: 1.3,
        friendlyFire: true,
        autoHealRate: 0.5,
        startingGold: 20,
        startingItems: [
            { id: 'health_potion', quantity: 1 }
        ]
    },
    NIGHTMARE: {
        name: '噩梦',
        description: '极具挑战性',
        playerDamageTaken: 1.6,
        playerDamageDealt: 0.8,
        enemyHp: 1.5,
        enemyAtk: 1.5,
        goldEarned: 0.8,
        expEarned: 1.2,
        enemySpawnRate: 1.4,
        bossHpMultiplier: 1.6,
        bossAtkMultiplier: 1.6,
        friendlyFire: true,
        autoHealRate: 0,
        startingGold: 0,
        startingItems: []
    },
    HELL: {
        name: '地狱',
        description: '极限挑战',
        playerDamageTaken: 2.0,
        playerDamageDealt: 0.7,
        enemyHp: 2.0,
        enemyAtk: 2.0,
        goldEarned: 0.7,
        expEarned: 1.3,
        enemySpawnRate: 1.6,
        bossHpMultiplier: 2.0,
        bossAtkMultiplier: 2.0,
        friendlyFire: true,
        autoHealRate: 0,
        permadeath: true,
        startingGold: 0,
        startingItems: []
    }
};

class DifficultyManager {
    constructor(game) {
        this.game = game;
        this.currentDifficulty = 'NORMAL';
        this.preset = DIFFICULTY_PRESETS.NORMAL;
        this.customModifiers = {};
    }
    
    setDifficulty(difficulty) {
        if (DIFFICULTY_PRESETS[difficulty]) {
            this.currentDifficulty = difficulty;
            this.preset = DIFFICULTY_PRESETS[difficulty];
            console.log(`[Difficulty] 难度设置为: ${this.preset.name}`);
        }
    }
    
    getModifier(category) {
        if (this.customModifiers[category] !== undefined) {
            return this.customModifiers[category];
        }
        return this.preset[category] || 1.0;
    }
    
    applyDamageMultiplier(damage, source = 'enemy') {
        if (source === 'enemy') {
            return damage * this.getModifier('playerDamageTaken');
        } else if (source === 'player') {
            return damage * this.getModifier('playerDamageDealt');
        }
        return damage;
    }
    
    applyEnemyStats(baseHp, baseAtk, isBoss = false) {
        const category = isBoss ? 'bossHpMultiplier' : 'enemyHp';
        const atkCategory = isBoss ? 'bossAtkMultiplier' : 'enemyAtk';
        
        return {
            hp: Math.floor(baseHp * this.getModifier(category)),
            atk: Math.floor(baseAtk * this.getModifier(atkCategory))
        };
    }
    
    applyGoldMultiplier(gold) {
        return Math.floor(gold * this.getModifier('goldEarned'));
    }
    
    applyExpMultiplier(exp) {
        return Math.floor(exp * this.getModifier('expEarned'));
    }
    
    isPermadeath() {
        return this.preset.permadeath === true;
    }
    
    getStartingGold() {
        return this.getModifier('startingGold') || this.preset.startingGold;
    }
    
    getStartingItems() {
        return this.preset.startingItems || [];
    }
}

export { DifficultyManager, DIFFICULTY_PRESETS };
