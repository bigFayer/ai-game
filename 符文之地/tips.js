/**
 * 符文之地 - 提示系统
 */

const GAME_TIPS = {
    combat: [
        '攻击时注意敌人的防御力，防御越高伤害越低。',
        '暴击可以造成1.5倍伤害，提高暴击率让你输出更高。',
        '防御姿态可以减少50%伤害，适合在血量低时使用。',
        '连击数越高，伤害加成越高，最高可达2倍。',
        '元素攻击对特定敌人有额外伤害，火克冰，冰克火。',
        '使用技能会消耗MP，合理管理MP很重要。',
        '有些敌人有弱点，使用相克的元素可以造成双倍伤害。',
        'HP低时使用治疗药水，不要等到最后。',
        '遇到BOSS时，先清除小怪再专注对付BOSS。',
        '逃跑有成功率，速度越高成功率越高。'
    ],
    dungeon: [
        '探索地下城时，注意周围的视野范围。',
        '踩到陷阱会损失HP，优先拆除或绕过陷阱。',
        '商店和宝箱可以提供额外的资源和装备。',
        '每10层会遇到一个首领，击败他们可以获得稀有装备。',
        '地下城的层数越高，敌人越强但奖励也越好。',
        '开启宝箱可以获得金币和物品。',
        '击败所有敌人后，楼梯才会出现。',
        '注意地图上的不同颜色，代表不同的事件。',
        '探索过的区域会记录在地图上。',
        '使用小地图可以更快找到目标位置。'
    ],
    equipment: [
        '装备的稀有度越高，基础属性越好。',
        '同一部位只能装备一件物品。',
        '更好的装备需要更高的等级才能使用。',
        '附魔可以为装备增加额外属性。',
        '传说和神话装备通常有特殊效果。',
        '定期更换装备可以保持战斗力。',
        '注意装备的属性加成和你的职业特点相符。',
        '有些装备对特定元素有抗性加成。',
        '金色边框的装备是稀有以上的。',
        '不要卖掉你的好装备，未来可能用得上。'
    ],
    skill: [
        '每个职业有不同的技能组合。',
        '升级可以获得技能点，用来学习新技能。',
        '技能有冷却时间，合理安排技能释放顺序。',
        '有些技能可以造成范围伤害。',
        '控制技能可以在关键时刻救你一命。',
        'Buff技能可以临时提升属性。',
        '优先升级常用的主要技能。',
        '技能书可以在商店购买或从敌人掉落。',
        '不同技能组合可以产生不同的战斗效果。',
        '有些技能有特殊效果，如眩晕、中毒等。'
    ],
    quest: [
        '完成主线任务可以获得大量经验和奖励。',
        '支线任务虽然奖励较少，但可以丰富游戏体验。',
        '有些任务需要击败特定敌人或收集特定物品。',
        '任务日志可以查看当前的进行中任务。',
        '有些任务有时间限制，注意任务描述。',
        '多和NPC对话可以触发新任务。',
        '任务奖励通常包括金币、经验和物品。',
        '有些任务需要到达特定层数才能接取。',
        '完成后记得领取任务奖励。',
        '有些任务是隐藏的，需要特殊条件触发。'
    ],
    crafting: [
        '锻造可以制作更强大的装备。',
        '炼金可以制作各种药水。',
        '附魔可以为装备增加额外属性。',
        '收集材料是锻造的基础。',
        '有些高级配方需要稀有材料。',
        '锻造等级越高，能制作的装备越好。',
        '材料可以通过击败敌人和探索获得。',
        '商店也会出售一些稀有材料。',
        '有时候直接购买装备比锻造更划算。',
        '注意配方的等级需求。'
    ],
    economy: [
        '金币可以通过击败敌人和出售物品获得。',
        '商店出售物品价格是定价的30%。',
        '完成任务是获得金币的好方法。',
        '注意金币的使用，不要买无用的东西。',
        '有些物品会随着游戏进展而涨价。',
        '投资好装备可以让你走得更远。',
        '银行可以保管金币，但需要手续费。',
        '稀有物品的价值更高。',
        '与商人讨价还价可以获得折扣。',
        '有时候等待更好的购买时机也是明智的。'
    ],
    general: [
        '定期存档以防万一。',
        '死亡会损失当前层的进度，但会保留等级和装备。',
        '游戏有多种结局，取决于你的选择。',
        '探索游戏的各种系统可以发现更多乐趣。',
        '与其他冒险者交流可以获得有用的建议。',
        '注意游戏中的提示信息。',
        '每个职业都有独特的玩法和策略。',
        '尝试不同的职业可以获得不同体验。',
        '游戏会不定期更新新内容。',
        '最重要的是享受游戏！'
    ]
};

class TipsManager {
    constructor(game) {
        this.game = game;
        this.displayedTips = new Set();
    }
    
    getRandomTip(category = null) {
        const categories = Object.keys(GAME_TIPS);
        const cat = category || categories[Math.floor(Math.random() * categories.length)];
        const tips = GAME_TIPS[cat] || GAME_TIPS.general;
        
        // 避免重复显示同样的提示
        const availableTips = tips.filter((_, i) => !this.displayedTips.has(`${cat}_${i}`));
        
        if (availableTips.length === 0) {
            this.displayedTips.clear();
            return tips[Math.floor(Math.random() * tips.length)];
        }
        
        const tipIndex = tips.indexOf(availableTips[Math.floor(Math.random() * availableTips.length)]);
        this.displayedTips.add(`${cat}_${tipIndex}`);
        
        return tips[tipIndex];
    }
    
    getTipOfTheDay() {
        const today = new Date().toDateString();
        const hash = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const categories = Object.keys(GAME_TIPS);
        const catIndex = hash % categories.length;
        const cat = categories[catIndex];
        const tips = GAME_TIPS[cat];
        const tipIndex = (hash * 3) % tips.length;
        
        return { category: cat, tip: tips[tipIndex] };
    }
    
    getAllCategories() {
        return Object.keys(GAME_TIPS);
    }
    
    getTipsByCategory(category) {
        return GAME_TIPS[category] || [];
    }
}

export { TipsManager, GAME_TIPS };
