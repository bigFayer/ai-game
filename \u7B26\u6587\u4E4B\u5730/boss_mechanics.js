/**
 * 符文之地 - BOSS机制系统
 */

class BossPhase {
    constructor(threshold, abilities, effects = []) {
        this.threshold = threshold; // HP百分比
        this.abilities = abilities;
        this.effects = effects;
        this.triggered = false;
    }
    
    checkAndTrigger(currentHpPercent, boss) {
        if (!this.triggered && currentHpPercent <= this.threshold) {
            this.triggered = true;
            
            // 执行阶段效果
            for (const effect of this.effects) {
                this.applyEffect(effect, boss);
            }
            
            // 解锁技能
            for (const abilityId of this.abilities) {
                boss.abilitySystem?.unlockAbility(abilityId);
            }
            
            return true;
        }
        return false;
    }
    
    applyEffect(effect, boss) {
        switch (effect.type) {
            case 'buff':
                boss.applyBuff(effect.stat, effect.amount);
                break;
            case 'debuff':
                boss.applyDebuff(effect.stat, effect.amount);
                break;
            case 'spawn':
                boss.spawnMinions(effect.count, effect.type);
                break;
            case 'transform':
                boss.transform(effect.sprite);
                break;
            case 'enviroment':
                boss.changeEnviroment(effect.type);
                break;
        }
    }
}

class BossAI {
    constructor(boss) {
        this.boss = boss;
        this.currentPattern = 0;
        this.patternTimer = 0;
        this.patternDuration = 5; // 每种模式持续时间
        this.attackCooldowns = new Map();
        this.enraged = false;
        this.phases = [];
    }
    
    addPhase(phase) {
        this.phases.push(phase);
    }
    
    update(dt) {
        // 检查阶段切换
        const hpPercent = this.boss.hp / this.boss.maxHp;
        
        for (const phase of this.phases) {
            if (phase.checkAndTrigger(hpPercent, this.boss)) {
                this.onPhaseChange(phase);
            }
        }
        
        // 更新攻击冷却
        for (const [abilityId, cooldown] of this.attackCooldowns) {
            if (cooldown > 0) {
                this.attackCooldowns.set(abilityId, cooldown - dt);
            }
        }
        
        // 模式更新
        this.patternTimer += dt;
        if (this.patternTimer >= this.patternDuration) {
            this.patternTimer = 0;
            this.nextPattern();
        }
        
        // 检查激怒
        if (!this.enraged && hpPercent <= 0.3) {
            this.enrage();
        }
    }
    
    nextPattern() {
        this.currentPattern = (this.currentPattern + 1) % this.getAvailablePatterns().length;
    }
    
    getAvailablePatterns() {
        return ['aggressive', 'defensive', 'balanced'];
    }
    
    selectAttack() {
        const availableAbilities = this.getAvailableAbilities();
        if (availableAbilities.length === 0) return null;
        
        // 随机选择
        return availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
    }
    
    getAvailableAbilities() {
        const available = [];
        
        for (const ability of this.boss.abilities) {
            const cooldown = this.attackCooldowns.get(ability.id) || 0;
            if (cooldown <= 0) {
                available.push(ability);
            }
        }
        
        return available;
    }
    
    enrage() {
        this.enraged = true;
        
        // 激怒效果
        this.boss.atk *= 1.5;
        this.boss.spd *= 1.3;
        
        // 解锁究极技能
        this.boss.ultimateUnlocked = true;
        
        // 视觉效果
        this.boss.screenShake(10, 1);
    }
    
    onPhaseChange(phase) {
        console.log(`[BossAI] Boss进入新阶段: ${phase.threshold * 100}%`);
        
        // 特殊阶段效果
        this.patternTimer = 0;
        this.currentPattern = 0;
    }
}

const BOSS_MECHANICS = {
    // 森林首领 - 巨魔
    forest_troll: {
        phases: [
            { threshold: 0.5, abilities: ['ground_slam', 'toss'], effects: [{ type: 'buff', stat: 'atk', amount: 1.3 }] },
            { threshold: 0.3, abilities: ['enrage'], effects: [{ type: 'spawn', count: 2, type: 'forest_goblin' }] }
        ],
        patterns: {
            0: ['strike', 'guard'],
            1: ['strike', 'strike', 'power_strike'],
            2: ['strike', 'heal', 'guard']
        }
    },
    
    // 沙漠首领 - 法老
    desert_pharaoh: {
        phases: [
            { threshold: 0.66, abilities: ['sandstorm'], effects: [{ type: 'enviroment', type: 'sandstorm' }] },
            { threshold: 0.33, abilities: ['pharaoh_wrath', 'summon_undead'], effects: [{ type: 'spawn', count: 3, type: 'desert_mummy' }] }
        ],
        patterns: {
            0: ['curse', 'strike'],
            1: ['sandstorm', 'strike'],
            2: ['summon_undead', 'curse', 'pharaoh_wrath']
        }
    },
    
    // 冰霜首领 - 冰龙
    ice_dragon: {
        phases: [
            { threshold: 0.5, abilities: ['fly', 'ice_prison'], effects: [{ type: 'buff', stat: 'spd', amount: 1.5 }] },
            { threshold: 0.25, abilities: ['frost_breath', 'tail_sweep'], effects: [{ type: 'transform', sprite: 'ice_dragon_enraged' }] }
        ],
        patterns: {
            0: ['frost_breath', 'tail_sweep'],
            1: ['freeze_aura', 'strike'],
            2: ['ice_prison', 'strike', 'wing_attack']
        }
    },
    
    // 火焰首领 - 火焰领主
    fire_lord: {
        phases: [
            { threshold: 0.66, abilities: ['flame_summon'], effects: [{ type: 'spawn', count: 2, type: 'fire_imp' }] },
            { threshold: 0.33, abilities: ['inferno', 'meteor_strike'], effects: [{ type: 'buff', stat: 'atk', amount: 1.5 }, { type: 'transform', sprite: 'fire_lord_enraged' }] }
        ],
        patterns: {
            0: ['fireball', 'flame_whip'],
            1: ['fire_shield', 'strike'],
            2: ['meteor_strike', 'fireball', 'hellfire']
        }
    },
    
    // 虚空首领 - 虚空君主
    void_overlord: {
        phases: [
            { threshold: 0.75, abilities: ['void_armor'], effects: [{ type: 'buff', stat: 'def', amount: 1.5 }] },
            { threshold: 0.5, abilities: ['soul_harvest', 'dimension_rift'], effects: [{ type: 'spawn', count: 2, type: 'void_specter' }] },
            { threshold: 0.25, abilities: ['void_annihilation', 'ultimate_curse'], effects: [{ type: 'spawn', count: 3, type: 'void_abomination' }, { type: 'transform', sprite: 'void_overlord_final' }] }
        ],
        patterns: {
            0: ['void_bolt', 'dimension_rift'],
            1: ['soul_drain', 'void_strike'],
            2: ['summon_void', 'void_armor', 'soul_harvest'],
            3: ['void_annihilation', 'dimension_rift', 'ultimate_curse']
        }
    }
};

class BossBattleManager {
    constructor(game) {
        this.game = game;
        this.activeBoss = null;
        this.bossAI = null;
        this.battleStarted = false;
        this.battleEnded = false;
        this.enviromentEffects = [];
    }
    
    startBossBattle(boss) {
        this.activeBoss = boss;
        this.bossAI = new BossAI(boss);
        
        // 加载首领机制
        const mechanics = BOSS_MECHANICS[boss.id];
        if (mechanics) {
            for (const phaseData of mechanics.phases) {
                const phase = new BossPhase(phaseData.threshold, phaseData.abilities, phaseData.effects);
                this.bossAI.addPhase(phase);
            }
        }
        
        this.battleStarted = true;
        this.battleEnded = false;
        
        // 特殊战斗环境
        this.applyEnviroment(boss.biome);
        
        // 通知
        this.game.notificationManager.show(`${boss.name} 出现!`, 'warning');
        this.game.notificationManager.show('首领战开始!', 'warning');
    }
    
    applyEnviroment(biome) {
        this.enviromentEffects = [];
        
        switch (biome) {
            case 'desert':
                this.enviromentEffects.push({ type: 'heat', damagePerTurn: 5 });
                break;
            case 'ice':
                this.enviromentEffects.push({ type: 'cold', spdDebuff: 0.1 });
                break;
            case 'fire':
                this.enviromentEffects.push({ type: 'burn', damagePerTurn: 10 });
                break;
            case 'void':
                this.enviromentEffects.push({ type: 'void_corruption', maxHpDebuff: 0.2 });
                break;
        }
    }
    
    update(dt) {
        if (!this.battleStarted || this.battleEnded) return;
        
        // 更新首领AI
        if (this.bossAI) {
            this.bossAI.update(dt);
        }
        
        // 更新环境效果
        this.updateEnviromentEffects(dt);
        
        // 检查首领死亡
        if (this.activeBoss && this.activeBoss.hp <= 0) {
            this.endBossBattle(true);
        }
    }
    
    updateEnviromentEffects(dt) {
        // 应用环境伤害
        for (const effect of this.enviromentEffects) {
            if (effect.type === 'heat' || effect.type === 'burn') {
                this.game.player.takeDamage(effect.damagePerTurn * dt);
            }
        }
    }
    
    endBossBattle(victory) {
        this.battleEnded = true;
        
        if (victory) {
            // 掉落战利品
            this.generateBossDrops();
            
            // 通知
            this.game.notificationManager.showAchievement(`${this.activeBoss.name} 被击败!`);
            
            // 统计数据
            this.game.stats.bossesKilled++;
            
            // 检查通关
            if (this.activeBoss.id === 'void_overlord') {
                this.game.onVictory();
            }
        } else {
            // 玩家失败
            this.game.onGameOver();
        }
        
        this.activeBoss = null;
        this.bossAI = null;
    }
    
    generateBossDrops() {
        if (!this.activeBoss) return;
        
        const lootManager = this.game.lootManager || new LootManager(this.game);
        const drops = lootManager.generateEnemyDrop({
            isBoss: true,
            biome: this.activeBoss.biome
        });
        
        // 添加首领特殊掉落
        if (this.activeBoss.drops) {
            for (const drop of this.activeBoss.drops) {
                if (Math.random() < drop.chance) {
                    drops.push({ ...drop });
                }
            }
        }
        
        // 放置掉落物
        lootManager.dropItems(this.activeBoss.x, this.activeBoss.y, drops);
    }
}

export { BossPhase, BossAI, BossBattleManager, BOSS_MECHANICS };
