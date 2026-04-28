/**
 * 符文之地 - 高级敌人AI系统
 */

class EnemyAI {
    constructor(enemy, game) {
        this.enemy = enemy;
        this.game = game;
        this.behavior = enemy.behavior || 'balanced';
        this.target = null;
        this.lastAction = null;
        this.actionHistory = [];
        this.buffs = [];
        this.debuffs = [];
    }
    
    selectAction() {
        const availableActions = this.getAvailableActions();
        if (availableActions.length === 0) return { type: 'wait' };
        
        // 根据行为模式选择
        switch (this.behavior) {
            case 'aggressive':
                return this.selectAggressiveAction(availableActions);
            case 'defensive':
                return this.selectDefensiveAction(availableActions);
            case 'balanced':
                return this.selectBalancedAction(availableActions);
            case 'evasive':
                return this.selectEvasiveAction(availableActions);
            case 'healer':
                return this.selectHealerAction(availableActions);
            case 'summoner':
                return this.selectSummonerAction(availableActions);
            case 'caster':
                return this.selectCasterAction(availableActions);
            case 'berserker':
                return this.selectBerserkerAction(availableActions);
            default:
                return this.selectBalancedAction(availableActions);
        }
    }
    
    getAvailableActions() {
        const actions = [];
        
        // 检查是否可以攻击
        if (this.canAttack()) {
            actions.push({ type: 'attack', priority: 3 });
        }
        
        // 检查技能
        if (this.canUseSkill()) {
            const skills = this.getUsableSkills();
            for (const skill of skills) {
                actions.push({ type: 'skill', skill, priority: skill.priority || 2 });
            }
        }
        
        // 检查是否应该逃跑
        if (this.shouldFlee()) {
            actions.push({ type: 'flee', priority: 1 });
        }
        
        // 使用物品
        if (this.canUseItem()) {
            actions.push({ type: 'item', priority: 2 });
        }
        
        // 默认等待
        if (actions.length === 0) {
            actions.push({ type: 'wait', priority: 0 });
        }
        
        return actions;
    }
    
    selectAggressiveAction(actions) {
        // 优先攻击，忽略低血量警告
        const attackActions = actions.filter(a => a.type === 'attack' || a.type === 'skill');
        if (attackActions.length > 0) {
            return attackActions[0];
        }
        return actions.find(a => a.type === 'flee') || { type: 'wait' };
    }
    
    selectDefensiveAction(actions) {
        const player = this.game.player;
        
        // 低血量时优先治疗或逃跑
        if (this.enemy.hp < this.enemy.totalMaxHP * 0.3) {
            const healActions = actions.filter(a => a.type === 'item' || (a.type === 'skill' && a.skill?.heal));
            if (healActions.length > 0) return healActions[0];
            
            const fleeAction = actions.find(a => a.type === 'flee');
            if (fleeAction) return fleeAction;
        }
        
        // 优先使用防御技能
        const defActions = actions.filter(a => a.type === 'skill' && a.skill?.defensive);
        if (defActions.length > 0) return defActions[0];
        
        // 否则普通攻击
        return actions.find(a => a.type === 'attack') || { type: 'wait' };
    }
    
    selectBalancedAction(actions) {
        // 根据情况选择
        const player = this.game.player;
        
        // 如果玩家血量低，优先攻击
        if (player.hp < player.totalMaxHP * 0.3) {
            const attackActions = actions.filter(a => a.type === 'attack');
            if (attackActions.length > 0) return attackActions[0];
        }
        
        // 如果自己血量低，优先防御
        if (this.enemy.hp < this.enemy.totalMaxHP * 0.4) {
            const defActions = actions.filter(a => a.type === 'defensive' || a.type === 'item');
            if (defActions.length > 0) return defActions[0];
        }
        
        // 按优先级排序
        actions.sort((a, b) => b.priority - a.priority);
        return actions[0];
    }
    
    selectEvasiveAction(actions) {
        const player = this.game.player;
        
        // 优先保持距离
        if (this.enemy.hp < this.enemy.totalMaxHP * 0.5) {
            const fleeAction = actions.find(a => a.type === 'flee');
            if (fleeAction) return fleeAction;
        }
        
        // 优先使用远程攻击
        const rangedActions = actions.filter(a => a.type === 'skill' && a.skill?.ranged);
        if (rangedActions.length > 0) return rangedActions[0];
        
        return actions.find(a => a.type === 'attack') || { type: 'wait' };
    }
    
    selectHealerAction(actions) {
        // 优先治疗队友
        const healActions = actions.filter(a => a.type === 'skill' && a.skill?.heal);
        if (healActions.length > 0) return healActions[0];
        
        // 然后攻击
        return actions.find(a => a.type === 'attack') || { type: 'wait' };
    }
    
    selectSummonerAction(actions) {
        // 优先召唤
        const summonActions = actions.filter(a => a.type === 'skill' && a.skill?.summon);
        if (summonActions.length > 0) return summonActions[0];
        
        return actions.find(a => a.type === 'attack') || { type: 'wait' };
    }
    
    selectCasterAction(actions) {
        // 优先使用魔法技能
        const magicActions = actions.filter(a => a.type === 'skill' && a.skill?.magic);
        if (magicActions.length > 0) return magicActions[0];
        
        // 检查MP
        if (this.enemy.mp < 10) {
            const attackActions = actions.filter(a => a.type === 'attack');
            if (attackActions.length > 0) return attackActions[0];
        }
        
        return actions[0] || { type: 'wait' };
    }
    
    selectBerserkerAction(actions) {
        // 低血量时伤害更高
        const hpPercent = this.enemy.hp / this.enemy.totalMaxHP;
        
        if (hpPercent < 0.3) {
            // 狂暴状态：只攻击
            const attackActions = actions.filter(a => a.type === 'attack' || a.type === 'skill');
            if (attackActions.length > 0) {
                attackActions[0].damageMultiplier = 1.5;
                return attackActions[0];
            }
        }
        
        return actions.find(a => a.type === 'attack') || { type: 'wait' };
    }
    
    canAttack() {
        return this.enemy.hp > 0;
    }
    
    canUseSkill() {
        if (!this.enemy.skills || this.enemy.skills.length === 0) return false;
        if (this.enemy.mp < 5) return false;
        return true;
    }
    
    getUsableSkills() {
        if (!this.enemy.skills) return [];
        
        return this.enemy.skills
            .filter(skill => {
                if (skill.mpCost && this.enemy.mp < skill.mpCost) return false;
                if (skill.cooldown && skill.currentCooldown > 0) return false;
                return true;
            })
            .map(skill => ({ ...skill, priority: skill.priority || 2 }));
    }
    
    shouldFlee() {
        if (this.enemy.hp < this.enemy.totalMaxHP * 0.2) {
            return Math.random() < 0.7; // 70%几率逃跑
        }
        return false;
    }
    
    canUseItem() {
        return false; // 敌人默认不能使用物品
    }
    
    recordAction(action) {
        this.actionHistory.push({
            action,
            timestamp: Date.now(),
            enemyHp: this.enemy.hp,
            playerHp: this.game.player?.hp
        });
        
        // 保留最近10个动作
        if (this.actionHistory.length > 10) {
            this.actionHistory.shift();
        }
    }
    
    getLastActions(count = 3) {
        return this.actionHistory.slice(-count);
    }
    
    predictPlayerAction() {
        // 简单的玩家行为预测
        const recentActions = this.game.combatLog?.getRecent(5) || [];
        
        // 统计玩家行为
        const actionCounts = {};
        for (const action of recentActions) {
            actionCounts[action.type] = (actionCounts[action.type] || 0) + 1;
        }
        
        // 预测最可能的下一个行为
        const mostLikely = Object.entries(actionCounts)
            .sort((a, b) => b[1] - a[1])[0];
        
        return mostLikely ? mostLikely[0] : 'attack';
    }
}

class BossAI extends EnemyAI {
    constructor(enemy, game) {
        super(enemy, game);
        this.phase = 1;
        this.maxPhase = enemy.phases || 1;
        this.phaseThresholds = enemy.phaseThresholds || [0.5]; // 50%血量进入下一阶段
        this.usedSpecialAttacks = new Set();
        this.rageTimer = 0;
    }
    
    updatePhase() {
        const hpPercent = this.enemy.hp / this.enemy.totalMaxHP;
        
        for (let i = 0; i < this.phaseThresholds.length; i++) {
            if (hpPercent <= this.phaseThresholds[i] && this.phase < i + 2) {
                this.phase = i + 2;
                this.onPhaseChange(this.phase);
                return;
            }
        }
    }
    
    onPhaseChange(newPhase) {
        console.log(`[BossAI] Boss进入第${newPhase}阶段`);
        
        // 触发特殊效果
        if (newPhase === 2) {
            // 进入狂暴状态
            this.enemy.atk *= 1.3;
            this.enemy.spd *= 1.2;
            this.game.showNotification(this.enemy.name + '进入了狂暴状态！');
        } else if (newPhase === 3) {
            // 终极形态
            this.enemy.atk *= 1.5;
            this.game.showNotification(this.enemy.name + '进入了终极形态！');
        }
    }
    
    selectAction() {
        this.updatePhase();
        return super.selectAction();
    }
    
    selectPhaseActions() {
        // 根据阶段选择特殊动作
        const actions = [];
        
        if (this.phase >= 2) {
            // 第二阶段：更多技能
            if (this.usedSpecialAttacks.has('enrage') && this.enemy.hp < this.enemy.totalMaxHP * 0.3) {
                actions.push({ type: 'ultimate', priority: 5 });
            }
        }
        
        return actions;
    }
}

export { EnemyAI, BossAI };
