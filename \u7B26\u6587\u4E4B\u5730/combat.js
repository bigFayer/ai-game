/**
 * 符文之地 - 战斗系统
 * 回合制战斗 + 元素反应 + 连击系统
 */

import { Player, PlayerClass } from './player.js';

// ==================== 元素类型 ====================
const ElementType = {
    PHYSICAL: 'physical',
    FIRE: 'fire',
    ICE: 'ice',
    LIGHTNING: 'lightning',
    VOID: 'void',
    HOLY: 'holy'
};

// ==================== 元素反应 ====================
const ElementReactions = {
    'fire+ice': 'vaporize',    // 蒸发：额外伤害
    'ice+fire': 'vaporize',
    'fire+lightning': 'overload',  // 超载：扩散伤害
    'lightning+fire': 'overload',
    'fire+void': 'corruption',     // 腐蚀：持续伤害
    'void+fire': 'corruption',
    'lightning+ice': 'freeze',     // 冻结：眩晕
    'ice+lightning': 'freeze',
    'holy+void': 'disintegrate',   // 湮灭：高额伤害
    'void+holy': 'disintegrate'
};

// ==================== 行动类型 ====================
const ActionType = {
    ATTACK: 'attack',
    DEFEND: 'defend',
    SKILL: 'skill',
    ITEM: 'item',
    FLEE: 'flee'
};

// ==================== 战斗系统类 ====================
class CombatSystem {
    constructor(game) {
        this.game = game;
        this.inCombat = false;
        this.enemy = null;
        this.turn = 'player';
        this.battleLog = [];
        this.playerTurnActions = [];
        this.enemyTurnTimer = 0;
        this.enemyThinkTime = 1.5; // 敌人思考时间(秒)
        this.animationQueue = [];
        this.elementalAuras = { player: null, enemy: null };
    }
    
    start(enemy) {
        this.inCombat = true;
        this.enemy = enemy;
        this.turn = 'player';
        this.battleLog = [];
        this.playerTurnActions = [];
        this.enemyTurnTimer = 0;
        this.elementalAuras = { player: null, enemy: null };
        
        // 记录战斗开始
        this.log(`${enemy.name}出现了！`);
        
        // 初始化敌人
        if (enemy.init) enemy.init();
    }
    
    update(dt) {
        if (!this.inCombat) return;
        
        if (this.turn === 'enemy') {
            this.enemyTurnTimer += dt;
            
            if (this.enemyTurnTimer >= this.enemyThinkTime) {
                this.executeEnemyTurn();
            }
        }
        
        // 处理动画队列
        this.processAnimationQueue(dt);
    }
    
    executeAction(actionType, param = null) {
        if (!this.inCombat || this.turn !== 'player') return;
        
        switch (actionType) {
            case ActionType.ATTACK:
                this.executePlayerAttack();
                break;
            case ActionType.DEFEND:
                this.executePlayerDefend();
                break;
            case ActionType.SKILL:
                this.executePlayerSkill(param);
                break;
            case ActionType.ITEM:
                this.executePlayerItem(param);
                break;
            case ActionType.FLEE:
                this.executeFlee();
                break;
        }
    }
    
    executePlayerAttack() {
        const player = this.game.player;
        
        // 攻击
        const result = player.attack(this.enemy);
        
        // 记录日志
        let msg = `你攻击了 ${this.enemy.name}，造成了 ${result.damage} 点伤害`;
        if (result.isCrit) msg += ' (暴击！)';
        if (result.combo > 1) msg += ` x${result.combo}连击！`;
        this.log(msg);
        
        // 添加攻击动画
        this.queueAnimation('playerAttack', { target: 'enemy' });
        
        // 播放音效
        if (this.game.audioManager) {
            this.game.audioManager.play('attack');
        }
        
        // 检查敌人死亡
        if (this.enemy.hp <= 0) {
            this.endCombat(true);
            return;
        }
        
        // 切换到敌人回合
        this.startEnemyTurn();
    }
    
    executePlayerDefend() {
        const player = this.game.player;
        player.defend();
        this.log('你进入了防御姿态');
        
        // 添加防御动画
        this.queueAnimation('playerDefend', {});
        
        this.startEnemyTurn();
    }
    
    executePlayerSkill(skillIndex) {
        const player = this.game.player;
        const skillId = player.equippedSkills[skillIndex];
        
        if (!skillId) {
            this.log('该技能槽为空');
            return;
        }
        
        // 获取技能数据
        const skill = this.game.skillManager.getSkill(skillId);
        if (!skill) return;
        
        // 检查MP
        if (!player.useMP(skill.mpCost)) {
            this.log('MP不足！');
            return;
        }
        
        // 检查冷却
        const cd = player.skillCooldowns[skillId] || 0;
        if (cd > 0) {
            this.log(`技能冷却中: ${cd.toFixed(1)}秒`);
            return;
        }
        
        // 执行技能效果
        const result = this.game.skillManager.executeSkill(skillId, player, this.enemy, this);
        
        if (result.success) {
            this.log(`使用了 ${skill.name}！`);
            player.skillCooldowns[skillId] = skill.cooldown || 3;
            
            // 设置元素附魔
            if (skill.element) {
                this.elementalAuras.player = skill.element;
            }
            
            // 检查敌人死亡
            if (this.enemy.hp <= 0) {
                this.endCombat(true);
                return;
            }
        }
        
        this.startEnemyTurn();
    }
    
    executePlayerItem(itemIndex) {
        const player = this.game.player;
        const invItem = player.inventory[itemIndex];
        
        if (!invItem) return;
        
        if (player.useItem(invItem.item.id)) {
            this.log(`使用了 ${invItem.item.name}`);
            this.game.audioManager.play('item');
        }
        
        this.startEnemyTurn();
    }
    
    executeFlee() {
        const player = this.game.player;
        const fleeChance = 0.5 + (player.totalSPD - (this.enemy.spd || 10)) * 0.02;
        
        if (Math.random() < Math.max(0.2, Math.min(0.9, fleeChance))) {
            this.log('成功逃脱了！');
            this.inCombat = false;
            this.game.setState('DUNGEON');
        } else {
            this.log('逃跑失败！');
            this.startEnemyTurn();
        }
    }
    
    startEnemyTurn() {
        this.turn = 'enemy';
        this.enemyTurnTimer = 0;
        this.game.player.endDefend();
    }
    
    executeEnemyTurn() {
        if (!this.enemy || !this.inCombat) return;
        
        // 敌人AI决策
        const action = this.enemy.decideAction(this.game.player, this);
        
        switch (action.type) {
            case 'attack':
                this.executeEnemyAttack(action);
                break;
            case 'skill':
                this.executeEnemySkill(action);
                break;
            case 'defend':
                this.executeEnemyDefend();
                break;
            case 'flee':
                this.executeEnemyFlee();
                break;
        }
        
        // 处理元素反应
        this.processElementalReaction();
        
        // 检查玩家死亡
        if (this.game.player.hp <= 0) {
            this.endCombat(false);
            return;
        }
        
        // 切换到玩家回合
        this.turn = 'player';
        this.playerTurnActions = [];
    }
    
    executeEnemyAttack(action) {
        const enemy = this.enemy;
        const player = this.game.player;
        
        // 基础伤害
        let damage = enemy.atk || 10;
        
        // 元素附魔加成
        if (this.elementalAuras.enemy) {
            const elem = this.elementalAuras.enemy;
            damage = this.applyElementalDamage(damage, elem, player);
            this.elementalAuras.enemy = null;
        }
        
        // 攻击
        const result = player.takeDamage(damage, action.element);
        
        let msg = `${enemy.name}攻击了你，造成了 ${result.damage} 点伤害`;
        if (result.evaded) msg = `${enemy.name}的攻击被闪避了！`;
        if (result.blocked) msg += ' (被防御)';
        this.log(msg);
        
        this.queueAnimation('enemyAttack', { target: 'player' });
        
        if (this.game.audioManager) {
            this.game.audioManager.play('hurt');
        }
        
        if (this.game.screenShake) {
            this.game.screenShake(3, 150);
        }
    }
    
    executeEnemySkill(action) {
        const enemy = this.enemy;
        const player = this.game.player;
        const skill = action.skill;
        
        // 消耗MP
        if (enemy.mp !== undefined) {
            enemy.mp -= skill.mpCost;
        }
        
        // 应用技能效果
        if (skill.effect) {
            if (skill.effect.damage) {
                let damage = skill.effect.damage;
                if (skill.element) {
                    damage = this.applyElementalDamage(damage, skill.element, player);
                }
                player.takeDamage(damage, skill.element);
                this.log(`${enemy.name}使用了${skill.name}，造成了 ${damage} 点伤害！`);
            }
            
            if (skill.effect.heal) {
                enemy.hp = Math.min(enemy.maxHp, enemy.hp + skill.effect.heal);
                this.log(`${enemy.name}恢复了 ${skill.effect.heal} HP！`);
            }
            
            if (skill.effect.status) {
                player.applyStatus(skill.effect.status, skill.effect.duration, skill.effect.value);
                this.log(`${enemy.name}对你施加了${skill.effect.status}效果！`);
            }
        }
        
        // 设置元素附魔
        if (skill.element) {
            this.elementalAuras.enemy = skill.element;
        }
        
        this.queueAnimation('enemySkill', { target: 'player', skill: skill.name });
    }
    
    executeEnemyDefend() {
        if (this.enemy.defend) {
            this.enemy.defend();
            this.log(`${this.enemy.name}进入了防御姿态`);
        }
    }
    
    executeEnemyFlee() {
        this.log(`${this.enemy.name}试图逃跑...`);
        if (Math.random() < 0.3) {
            this.log(`${this.enemy.name}逃跑了！`);
            this.inCombat = false;
            this.game.setState('DUNGEON');
        } else {
            this.log(`${this.enemy.name}逃跑失败！`);
        }
    }
    
    applyElementalDamage(baseDamage, element, target) {
        let damage = baseDamage;
        
        // 元素克制
        if (element === ElementType.FIRE && target.elementResists?.ice > 0) {
            damage = Math.floor(damage * 1.5);
        }
        if (element === ElementType.ICE && target.elementResists?.fire > 0) {
            damage = Math.floor(damage * 1.5);
        }
        
        return damage;
    }
    
    processElementalReaction() {
        const playerElem = this.elementalAuras.player;
        const enemyElem = this.elementalAuras.enemy;
        
        if (!playerElem || !enemyElem) return;
        
        const key1 = `${playerElem}+${enemyElem}`;
        const key2 = `${enemyElem}+${playerElem}`;
        const reaction = ElementReactions[key1] || ElementReactions[key2];
        
        if (reaction) {
            switch (reaction) {
                case 'vaporize':
                    const dmg = Math.floor(this.enemy.hp * 0.1);
                    this.enemy.hp = Math.max(1, this.enemy.hp - dmg);
                    this.log(`蒸发反应！蒸发伤害: ${dmg}`);
                    break;
                case 'overload':
                    // 扩散到玩家
                    const odmg = Math.floor(this.game.player.hp * 0.05);
                    this.game.player.takeDamage(odmg, ElementType.LIGHTNING);
                    this.log(`超载反应！扩散伤害: ${odmg}`);
                    break;
                case 'freeze':
                    this.game.player.applyStatus('frozen', 1, 0);
                    this.log('冻结反应！玩家被冻结了！');
                    break;
                case 'disintegrate':
                    const ddmg = Math.floor(this.game.player.totalMaxHP * 0.15);
                    this.game.player.takeDamage(ddmg, ElementType.VOID);
                    this.log(`湮灭反应！湮灭伤害: ${ddmg}`);
                    break;
            }
        }
        
        // 清除附魔
        this.elementalAuras.player = null;
        this.elementalAuras.enemy = null;
    }
    
    queueAnimation(type, data) {
        this.animationQueue.push({ type, data, time: 0, duration: 0.3 });
    }
    
    processAnimationQueue(dt) {
        this.animationQueue = this.animationQueue.filter(anim => {
            anim.time += dt;
            return anim.time < anim.duration;
        });
    }
    
    endCombat(victory) {
        this.inCombat = false;
        
        if (victory) {
            const enemy = this.enemy;
            const player = this.game.player;
            
            // 经验
            const expGain = enemy.exp || 10;
            const levelUp = player.addExp(expGain);
            
            // 金币
            const goldGain = enemy.gold || 5;
            player.gold += goldGain;
            player.stats.goldEarned += goldGain;
            
            // 掉落物品
            if (enemy.drops && Math.random() < (enemy.dropRate || 0.3)) {
                const drop = enemy.drops[Math.floor(Math.random() * enemy.drops.length)];
                if (drop) {
                    player.addItem(drop);
                    this.log(`获得了: ${drop.name}`);
                }
            }
            
            // 统计
            player.stats.enemiesDefeated++;
            
            // 成就检查
            this.game.achievementManager.check('kill_enemies', player.stats.enemiesDefeated);
            
            // 日志
            this.log(`胜利！经验+${expGain} 金币+${goldGain}`);
            if (levelUp.leveledUp) {
                this.log(`升级了！现在是 Lv.${player.level}！`);
                this.game.audioManager?.play('levelup');
                this.game.showAchievement(`升级到 Lv.${player.level}`);
            }
            
            this.game.audioManager?.play('victory');
        } else {
            this.game.player.stats.deaths++;
            this.log('你被击败了...');
            this.game.audioManager?.play('defeat');
        }
        
        // 清除战斗状态
        this.enemy = null;
        this.turn = 'player';
        
        // 返回地下城
        setTimeout(() => {
            if (!this.inCombat) {
                this.game.setState('DUNGEON');
            }
        }, victory ? 1000 : 2000);
    }
    
    log(message) {
        this.battleLog.push(message);
        if (this.battleLog.length > 20) {
            this.battleLog.shift();
        }
        console.log(`[Battle] ${message}`);
    }
    
    render(ctx) {
        if (!this.inCombat) return;
        
        const w = 1200;
        const h = 800;
        
        // 战斗背景
        this.renderBattleBackground(ctx);
        
        // 敌人区域
        this.renderEnemyArea(ctx);
        
        // 玩家区域
        this.renderPlayerArea(ctx);
        
        // 战斗UI
        this.renderBattleUI(ctx);
        
        // 战斗日志
        this.renderBattleLog(ctx);
        
        // 敌人行动指示
        if (this.turn === 'enemy') {
            this.renderEnemyThinking(ctx);
        }
    }
    
    renderBattleBackground(ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 800);
        gradient.addColorStop(0, '#1a0a0a');
        gradient.addColorStop(0.5, '#2a1a1a');
        gradient.addColorStop(1, '#0a0a0a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1200, 800);
    }
    
    renderEnemyArea(ctx) {
        if (!this.enemy) return;
        
        const ex = 600;
        const ey = 200;
        
        // 敌人名称
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.enemy.name, ex, ey - 80);
        
        // 等级
        ctx.fillStyle = '#888';
        ctx.font = '16px sans-serif';
        ctx.fillText(`Lv.${this.enemy.level || 1}`, ex, ey - 55);
        
        // HP条
        const hpBarWidth = 300;
        const hpPercent = Math.max(0, this.enemy.hp / this.enemy.maxHp);
        
        ctx.fillStyle = '#333';
        ctx.fillRect(ex - hpBarWidth/2, ey - 35, hpBarWidth, 20);
        ctx.fillStyle = '#aa2222';
        ctx.fillRect(ex - hpBarWidth/2, ey - 35, hpBarWidth * hpPercent, 20);
        ctx.strokeStyle = '#666';
        ctx.strokeRect(ex - hpBarWidth/2, ey - 35, hpBarWidth, 20);
        
        ctx.fillStyle = '#fff';
        ctx.font = '14px monospace';
        ctx.fillText(`${Math.max(0, this.enemy.hp)} / ${this.enemy.maxHp}`, ex, ey - 20);
        
        // MP条(如果有)
        if (this.enemy.mp !== undefined) {
            const mpPercent = Math.max(0, this.enemy.mp / this.enemy.maxMp);
            ctx.fillStyle = '#333';
            ctx.fillRect(ex - hpBarWidth/2, ey - 10, hpBarWidth, 12);
            ctx.fillStyle = '#2222aa';
            ctx.fillRect(ex - hpBarWidth/2, ey - 10, hpBarWidth * mpPercent, 12);
        }
        
        // 敌人外观(用文字代替图形)
        ctx.fillStyle = '#aa4444';
        ctx.font = '80px serif';
        ctx.fillText('👹', ex, ey + 60);
        
        // 状态效果
        if (this.enemy.statusEffects?.length > 0) {
            ctx.font = '20px sans-serif';
            this.enemy.statusEffects.forEach((se, i) => {
                ctx.fillText(`[${se.type}]`, ex - 50 + i * 40, ey + 100);
            });
        }
    }
    
    renderPlayerArea(ctx) {
        const player = this.game.player;
        const px = 600;
        const py = 550;
        
        // 玩家外观
        ctx.fillStyle = '#4a9fff';
        ctx.font = '80px serif';
        ctx.fillText('🧙', px, py + 30);
        
        // HP条
        const hpBarWidth = 300;
        const hpPercent = Math.max(0, player.hp / player.totalMaxHP);
        
        ctx.fillStyle = '#333';
        ctx.fillRect(px - hpBarWidth/2, py + 50, hpBarWidth, 20);
        ctx.fillStyle = '#22aa22';
        ctx.fillRect(px - hpBarWidth/2, py + 50, hpBarWidth * hpPercent, 20);
        ctx.strokeStyle = '#666';
        ctx.strokeRect(px - hpBarWidth/2, py + 50, hpBarWidth, 20);
        
        ctx.fillStyle = '#fff';
        ctx.font = '14px monospace';
        ctx.fillText(`HP: ${player.hp} / ${player.totalMaxHP}`, px, py + 67);
        
        // MP条
        const mpPercent = Math.max(0, player.mp / player.totalMaxMP);
        ctx.fillStyle = '#333';
        ctx.fillRect(px - hpBarWidth/2, py + 75, hpBarWidth, 15);
        ctx.fillStyle = '#2244aa';
        ctx.fillRect(px - hpBarWidth/2, py + 75, hpBarWidth * mpPercent, 15);
        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.fillText(`MP: ${player.mp} / ${player.totalMaxMP}`, px, py + 87);
        
        // 连击显示
        if (player.combo > 1) {
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 24px sans-serif';
            ctx.fillText(`${player.combo}连击！`, px, py + 110);
        }
        
        // 防御姿态
        if (player.isDefending) {
            ctx.fillStyle = '#4a4aff';
            ctx.font = '18px sans-serif';
            ctx.fillText('防御中', px, py - 10);
        }
    }
    
    renderBattleUI(ctx) {
        const player = this.game.player;
        
        // 技能栏
        ctx.fillStyle = 'rgba(20, 20, 40, 0.9)';
        ctx.fillRect(100, 650, 1000, 120);
        ctx.strokeStyle = '#4a4a6a';
        ctx.strokeRect(100, 650, 1000, 120);
        
        // 技能按钮
        const skillNames = ['攻击', '防御', '技能1', '技能2', '道具', '逃跑'];
        const shortcuts = ['1', '2', '3', '4', '5', 'Esc'];
        
        for (let i = 0; i < 6; i++) {
            const x = 150 + (i % 3) * 300;
            const y = 670 + Math.floor(i / 3) * 50;
            
            ctx.fillStyle = i === 0 ? '#2a4a2a' : i === 1 ? '#2a2a4a' : '#3a3a5a';
            ctx.fillRect(x, y, 260, 40);
            ctx.strokeStyle = '#6a6a8a';
            ctx.strokeRect(x, y, 260, 40);
            
            ctx.fillStyle = '#fff';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`[${shortcuts[i]}] ${skillNames[i]}`, x + 10, y + 25);
            
            // 技能冷却显示
            if (i >= 2 && i <= 3) {
                const skillId = player.equippedSkills[i - 2];
                if (skillId) {
                    const cd = player.skillCooldowns[skillId] || 0;
                    if (cd > 0) {
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                        ctx.fillRect(x, y, 260, 40);
                        ctx.fillStyle = '#aaa';
                        ctx.font = '14px sans-serif';
                        ctx.fillText(`冷却: ${cd.toFixed(1)}s`, x + 10, y + 25);
                    }
                }
            }
        }
    }
    
    renderBattleLog(ctx) {
        ctx.fillStyle = 'rgba(20, 20, 40, 0.85)';
        ctx.fillRect(800, 200, 380, 200);
        ctx.strokeStyle = '#4a4a6a';
        ctx.strokeRect(800, 200, 380, 200);
        
        ctx.fillStyle = '#8a8aaa';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';
        
        const startY = 220;
        const logLines = this.battleLog.slice(-8);
        logLines.forEach((log, i) => {
            ctx.fillText(log, 815, startY + i * 20);
        });
    }
    
    renderEnemyThinking(ctx) {
        const thinking = ['思考中.', '思考中..', '思考中...'][Math.floor(this.enemyTurnTimer * 3) % 3];
        
        ctx.fillStyle = '#ffd700';
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.enemy.name} ${thinking}`, 600, 350);
    }
}

// 导出
export { CombatSystem, ElementType, ElementReactions, ActionType };
