/**
 * 符文之地 - 提示与技巧系统
 */

const GAME_TIPS = {
    // ===== 新手提示 =====
    beginner: [
        "使用WASD或方向键移动角色",
        "点击鼠标左键进行普通攻击",
        "按数字键1-4使用技能",
        "按E键打开背包/物品栏",
        "按Q键打开任务日志",
        "按Tab键查看地图",
        "在战斗中注意躲避敌人的攻击",
        "及时使用药水恢复生命值",
        "打败精英怪和首领可以获得更好的装备",
        "每10层会遇到首领，击败首领可以进入下一区域",
        "收集金币可以在商店购买物品",
        "完成每日任务可以获得额外奖励",
        "注意角色的属性，攻击力和防御力很重要",
        "不同的敌人有不同的弱点，尝试找出它们",
        "不要忘记升级技能！"
    ],
    
    // ===== 进阶提示 =====
    intermediate: [
        "连击可以造成额外伤害，尽量保持高连击数",
        "元素之间存在克制关系：火克冰、冰克雷、雷克水",
        "某些装备有套装效果，穿戴全套可以获得额外属性",
        "圣职的治疗技能对队友也有效",
        "法师的魔法攻击可以穿透敌人的防御",
        "游侠的闪避技能在关键时刻非常有用",
        "战士的嘲讽技能可以吸引敌人的注意力",
        "在首领战前确保有足够的药水",
        "学会合理分配属性点很重要",
        "不同的技能组合可以产生意想不到的效果",
        "注意观察敌人的攻击模式",
        "在战斗中使用技能比普通攻击更有效",
        "完成支线任务可以获得额外的经验和奖励",
        "挑战极限可以获得更高的分数",
        "善用环境优势"
    ],
    
    // ===== 高级提示 =====
    advanced: [
        "可以通过控制台命令获得额外的调试功能",
        "某些隐藏任务需要特殊条件才能触发",
        "完成所有成就可以获得特殊奖励",
        "探索所有秘密区域可以获得稀有物品",
        "多人模式可以获得更好的合作效果",
        "某些敌人有特殊的行为模式，需要特定策略",
        "高级玩家通常会规划自己的属性发展路线",
        "了解每个职业的优缺点可以让你更好地配合",
        "在困难模式下，敌人的AI更加智能",
        "某些装备可以通过锻造系统强化",
        "附魔可以给你的装备附加额外属性",
        "某些稀有物品只能通过特殊途径获得",
        "挑战无尽模式可以获得无尽的奖励",
        "收集特定的物品可以解锁特殊结局",
        "最高难度的通关可以获得独一无二的称号"
    ]
};

class TipSystem {
    constructor(game) {
        this.game = game;
        this.currentTipIndex = 0;
        this.tips = [];
        this.unlockedTips = new Set();
        this.tipCooldown = 0;
        this.tipInterval = 60; // 秒
        this.showTipUI = true;
        
        this.loadTipsForPlayer();
    }
    
    loadTipsForPlayer() {
        // 根据玩家等级加载合适的提示
        const level = this.game.player?.level || 1;
        
        if (level < 5) {
            this.tips = [...GAME_TIPS.beginner];
        } else if (level < 20) {
            this.tips = [...GAME_TIPS.beginner, ...GAME_TIPS.intermediate];
        } else {
            this.tips = [...GAME_TIPS.beginner, ...GAME_TIPS.intermediate, ...GAME_TIPS.advanced];
        }
        
        // 随机打乱
        this.shuffleTips();
    }
    
    shuffleTips() {
        for (let i = this.tips.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tips[i], this.tips[j]] = [this.tips[j], this.tips[i]];
        }
    }
    
    update(dt) {
        if (!this.showTipUI) return;
        
        this.tipCooldown -= dt;
        
        if (this.tipCooldown <= 0) {
            this.tipCooldown = this.tipInterval;
            this.showNextTip();
        }
    }
    
    showNextTip() {
        const tip = this.tips[this.currentTipIndex];
        if (!tip) {
            // 重新开始
            this.shuffleTips();
            this.currentTipIndex = 0;
            return;
        }
        
        this.game.notificationManager.showTip(tip);
        this.currentTipIndex = (this.currentTipIndex + 1) % this.tips.length;
    }
    
    showTip(tip) {
        this.game.notificationManager.showTip(tip);
    }
    
    showTipByCategory(category) {
        const tips = GAME_TIPS[category];
        if (tips && tips.length > 0) {
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            this.showTip(randomTip);
        }
    }
    
    unlockTip(tipId) {
        this.unlockedTips.add(tipId);
    }
    
    getUnlockedCount() {
        return this.unlockedTips.size;
    }
    
    getTotalCount() {
        return Object.values(GAME_TIPS).reduce((sum, tips) => sum + tips.length, 0);
    }
    
    showTipUI() {
        this.showTipUI = true;
    }
    
    hideTipUI() {
        this.showTipUI = false;
    }
}

class AchievementTips {
    static getTipForAchievement(achievementId) {
        const tips = {
            'kills_1': '尝试使用技能来更有效地击败敌人',
            'kills_10': '保持高连击数可以获得更多经验',
            'flawless_1': '注意观察敌人的攻击模式，躲避所有攻击',
            'floor_5': '每10层会遇到首领，确保准备充分',
            'boss_1': '首领战需要良好的装备和足够的药水',
            'combo_10': '尝试使用技能来维持连击'
        };
        
        return tips[achievementId] || '继续探索符文之地！';
    }
}

export { TipSystem, GAME_TIPS, AchievementTips };
