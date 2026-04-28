/**
 * 符文之地 - 新手教程系统
 */

const TUTORIAL_STEPS = {
    movement: {
        id: 'movement',
        title: '移动教学',
        text: '使用 WASD 或方向键移动你的角色。尝试走动熟悉操作。',
        highlight: 'keys',
        highlightKeys: ['KeyW', 'KeyA', 'KeyS', 'KeyD'],
        condition: (game) => true,
        onComplete: (game) => {}
    },
    combat_basic: {
        id: 'combat_basic',
        title: '战斗教学',
        text: '靠近敌人后按 J 或 Z 键进行普通攻击。攻击敌人获得经验和金币！',
        highlight: 'attack_button',
        highlightKeys: ['KeyJ'],
        condition: (game) => game.player && game.player.x !== undefined,
        onComplete: (game) => {}
    },
    first_enemy: {
        id: 'first_enemy',
        title: '击败敌人',
        text: '现在去击败一个哥布林吧！你应该能够轻松获胜。',
        highlight: 'enemy',
        condition: (game) => game.stats?.enemiesKilled >= 1,
        onComplete: (game) => {
            game.notificationManager.showAchievement('首次击杀！');
        }
    },
    use_potion: {
        id: 'use_potion',
        title: '使用药水',
        text: '按 H 键使用生命药水恢复HP。确保保持足够的生命值！',
        highlight: 'hotbar_1',
        highlightKeys: ['KeyH'],
        condition: (game) => game.player && game.player.hp < game.player.maxHp,
        onComplete: (game) => {}
    },
    open_inventory: {
        id: 'open_inventory',
        title: '背包',
        text: '按 I 键打开背包查看你的物品。你可以在那里装备物品或使用消耗品。',
        highlight: 'inventory_button',
        highlightKeys: ['KeyI'],
        condition: (game) => game.inventory && game.inventory.items.length > 0,
        onComplete: (game) => {}
    },
    equip_item: {
        id: 'equip_item',
        title: '装备物品',
        text: '在背包中点击物品可以装备它。好的装备能让你更强大！',
        highlight: 'equipment_slot',
        condition: (game) => game.inventory && game.inventory.getEquippableItems().length > 0,
        onComplete: (game) => {}
    },
    skill_usage: {
        id: 'skill_usage',
        title: '技能教学',
        text: '按 1-4 键使用技能。技能需要消耗MP，但能造成更大伤害！',
        highlight: 'skill_bar',
        highlightKeys: ['Digit1', 'Digit2', 'Digit3', 'Digit4'],
        condition: (game) => game.skillSystem && game.skillSystem.learnedSkills.length > 0,
        onComplete: (game) => {}
    },
    level_up: {
        id: 'level_up',
        title: '升级教学',
        text: '获得足够经验后会自动升级！升级会提升你的属性。恭喜你变强了！',
        highlight: 'level_up_indicator',
        condition: (game) => game.player && game.player.level >= 2,
        onComplete: (game) => {
            game.notificationManager.show('你已经升到2级了！');
        }
    },
    explore_floor: {
        id: 'explore_floor',
        title: '探索地下城',
        text: '探索当前楼层，击败所有敌人后找到楼梯进入下一层。注意收集金币和物品！',
        highlight: 'minimap',
        condition: (game) => game.stats?.floorsExplored >= 1,
        onComplete: (game) => {}
    },
    boss_intro: {
        id: 'boss_intro',
        title: '首领战斗',
        text: '每10层会有强大的首领！首领比普通敌人强很多，确保你的装备和HP充足再去挑战。',
        highlight: 'boss_health',
        condition: (game) => game.currentFloor >= 10,
        onComplete: (game) => {}
    },
    game_complete: {
        id: 'game_complete',
        title: '游戏通关',
        text: '你已经完成了基础教程！现在你可以自由探索符文之地，挑战各个首领，成为最强的冒险者！',
        highlight: null,
        condition: (game) => game.state === 'VICTORY',
        onComplete: (game) => {
            game.notificationManager.showAchievement('符文之地英雄！');
        }
    }
};

class TutorialManager {
    constructor(game) {
        this.game = game;
        this.steps = Object.values(TUTORIAL_STEPS);
        this.currentStepIndex = 0;
        this.completedSteps = new Set();
        this.isActive = false;
        this.skipped = false;
    }
    
    start() {
        this.isActive = true;
        this.currentStepIndex = 0;
        this.skipped = false;
        this.findNextStep();
    }
    
    skip() {
        this.skipped = true;
        this.completeCurrentStep();
    }
    
    findNextStep() {
        while (this.currentStepIndex < this.steps.length) {
            const step = this.steps[this.currentStepIndex];
            
            if (this.completedSteps.has(step.id)) {
                this.currentStepIndex++;
                continue;
            }
            
            if (step.condition(this.game)) {
                return step;
            }
            
            this.currentStepIndex++;
        }
        
        this.isActive = false;
        return null;
    }
    
    getCurrentStep() {
        if (!this.isActive || this.skipped) return null;
        return this.steps[this.currentStepIndex];
    }
    
    completeCurrentStep() {
        const step = this.steps[this.currentStepIndex];
        if (step) {
            this.completedSteps.add(step.id);
            if (step.onComplete) {
                step.onComplete(this.game);
            }
        }
        
        this.currentStepIndex++;
        this.findNextStep();
    }
    
    update(dt) {
        if (!this.isActive || this.skipped) return;
        
        const step = this.getCurrentStep();
        if (!step) return;
        
        // 检查条件
        if (step.condition && step.condition(this.game)) {
            // 条件满足，等待用户确认或自动完成
        }
    }
    
    onAction(action) {
        if (!this.isActive || this.skipped) return;
        
        const step = this.getCurrentStep();
        if (!step) return;
        
        // 检查是否是目标动作
        if (this.isTargetAction(action, step)) {
            this.completeCurrentStep();
        }
    }
    
    isTargetAction(action, step) {
        // 根据步骤类型判断动作
        switch (step.id) {
            case 'movement':
                return action === 'move';
            case 'combat_basic':
                return action === 'attack';
            case 'first_enemy':
                return action === 'kill_enemy';
            case 'use_potion':
                return action === 'use_item';
            case 'open_inventory':
                return action === 'open_inventory';
            case 'skill_usage':
                return action === 'use_skill';
            default:
                return false;
        }
    }
    
    render(ctx) {
        if (!this.isActive || this.skipped) return;
        
        const step = this.getCurrentStep();
        if (!step) return;
        
        // 渲染教程提示
        const boxWidth = 400;
        const boxHeight = 120;
        const x = (this.game.width - boxWidth) / 2;
        const y = 50;
        
        // 背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(x, y, boxWidth, boxHeight);
        
        // 边框
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, boxWidth, boxHeight);
        
        // 标题
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(step.title, x + boxWidth / 2, y + 30);
        
        // 文本
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px sans-serif';
        
        // 自动换行
        const words = step.text.split(' ');
        let line = '';
        let lineY = y + 60;
        const maxWidth = boxWidth - 40;
        
        for (const word of words) {
            const testLine = line + word + ' ';
            if (ctx.measureText(testLine).width > maxWidth) {
                ctx.fillText(line, x + 20, lineY);
                line = word + ' ';
                lineY += 20;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x + 20, lineY);
        
        // 跳过提示
        ctx.fillStyle = '#888888';
        ctx.font = '12px sans-serif';
        ctx.fillText('按 ESC 跳过教程', x + boxWidth / 2, y + boxHeight - 15);
    }
}

export { TutorialManager, TUTORIAL_STEPS };
