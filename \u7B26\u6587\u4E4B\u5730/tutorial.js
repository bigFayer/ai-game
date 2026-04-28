/**
 * 符文之地 - 新手教程系统
 */

const TUTORIAL_STEPS = {
    // 游戏开始
    'intro': {
        title: '欢迎来到符文之地',
        content: '欢迎来到符文之地！这是一款Roguelike地牢探险游戏。你将扮演一名冒险者，深入地下城，击败敌人，获取宝藏，最终征服这片土地。',
        highlight: null,
        action: 'dismiss',
        canSkip: true
    },
    
    // 选择职业
    'choose_class': {
        title: '选择你的职业',
        content: '游戏开始时，你需要选择一个职业。每个职业都有独特的技能和属性加成。战士适合新手，游侠输出高但脆弱，法师需要操作，聖职可治疗。',
        highlight: '.class-selection',
        action: 'choose_class',
        canSkip: false
    },
    
    // 移动教学
    'movement': {
        title: '移动',
        content: '使用WASD或方向键在地下城中移动。探索地图，击败敌人，找到通往下一层的楼梯。',
        highlight: null,
        action: 'move',
        canSkip: false
    },
    
    // 战斗教学
    'combat': {
        title: '战斗',
        content: '靠近敌人会自动进入战斗。按1-4使用技能，数字键1-4对应快捷栏中的技能。普通攻击会自动进行。',
        highlight: '.skill-bar',
        action: 'defeat_enemy',
        canSkip: false
    },
    
    // 使用药水
    'potion': {
        title: '使用药水',
        content: '按Q使用生命药水，按W使用魔法药水。药水可以在商店购买或从敌人掉落。记得随时补充药水！',
        highlight: '.hotbar',
        action: 'use_potion',
        canSkip: false
    },
    
    // 背包
    'inventory': {
        title: '背包',
        content: '按I打开背包。你可以查看、装备、使用物品。更好的装备可以让你走得更远。',
        highlight: null,
        action: 'open_inventory',
        canSkip: false
    },
    
    // 装备
    'equipment': {
        title: '装备',
        content: '在背包中点击装备可以装备。装备会提供属性加成。注意职业限制和等级要求。',
        highlight: '.equipment-slot',
        action: 'equip_item',
        canSkip: false
    },
    
    // 技能
    'skills': {
        title: '技能',
        content: '按K打开技能面板。升级可以获得技能点，学习新技能。不同的技能组合可以产生强大的效果。',
        highlight: '.skill-panel',
        action: 'view_skills',
        canSkip: false
    },
    
    // 商店
    'shop': {
        title: '商店',
        content: '在地下城中你会遇到商店。你可以在这里购买药水、装备和材料。记住商店价格是定价的100%，卖掉物品只能得到30%。',
        highlight: null,
        action: 'visit_shop',
        canSkip: false
    },
    
    // 存档
    'save': {
        title: '存档',
        content: '游戏会自动存档。但你也可以手动存档以便随时继续。死亡会损失当前层，但等级和装备不会丢失。',
        highlight: null,
        action: 'acknowledge',
        canSkip: true
    }
};

class TutorialSystem {
    constructor(game) {
        this.game = game;
        this.currentStep = null;
        this.completedSteps = new Set();
        this.isActive = false;
        this.stepData = TUTORIAL_STEPS;
    }
    
    start() {
        if (!this.game.settings.get('showTutorial', true)) return;
        
        // 从第一个未完成的步骤开始
        for (const [stepId, step] of Object.entries(this.stepData)) {
            if (!this.completedSteps.has(stepId)) {
                this.currentStep = stepId;
                this.isActive = true;
                this.showStep(stepId);
                return;
            }
        }
    }
    
    showStep(stepId) {
        const step = this.stepData[stepId];
        if (!step) return;
        
        this.currentStep = stepId;
        
        // 显示教程提示
        this.game.showTutorialPopup({
            title: step.title,
            content: step.content,
            canSkip: step.canSkip
        });
        
        // 高亮区域（如果有）
        if (step.highlight) {
            this.highlightElement(step.highlight);
        }
    }
    
    completeCurrentStep() {
        if (this.currentStep) {
            this.completedSteps.add(this.currentStep);
            this.clearHighlight();
            this.advance();
        }
    }
    
    advance() {
        const stepIds = Object.keys(this.stepData);
        const currentIndex = stepIds.indexOf(this.currentStep);
        
        if (currentIndex < stepIds.length - 1) {
            const nextStepId = stepIds[currentIndex + 1];
            if (!this.completedSteps.has(nextStepId)) {
                this.showStep(nextStepId);
            } else {
                this.advance(); // 跳过已完成的
            }
        } else {
            this.end();
        }
    }
    
    skip() {
        // 跳过当前步骤
        this.completeCurrentStep();
    }
    
    end() {
        this.isActive = false;
        this.currentStep = null;
        this.clearHighlight();
    }
    
    highlightElement(selector) {
        // 简化版高亮
        console.log('[Tutorial] 高亮:', selector);
    }
    
    clearHighlight() {
        console.log('[Tutorial] 清除高亮');
    }
    
    isStepCompleted(stepId) {
        return this.completedSteps.has(stepId);
    }
    
    reset() {
        this.completedSteps.clear();
        this.currentStep = null;
        this.isActive = false;
    }
}

export { TutorialSystem, TUTORIAL_STEPS };
