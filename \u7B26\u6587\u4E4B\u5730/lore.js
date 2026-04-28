/**
 * 符文之地 - 世界观与传说
 */

const GAME_LORE = {
    world: {
        name: '符文之地',
        description: '符文之地是一片被古老魔法笼罩的大陆。这里曾经是繁荣昌盛的文明，但一场名为"大灾变"的神秘灾难将一切化为废墟。如今，只有地下深处的迷宫还保留着古代的宝藏和危险。冒险者们纷纷涌入这片土地，追寻传说中的神器和无尽的力量。',
        age: '大灾变后第1024年'
    },
    
    regions: {
        forest: {
            name: '阴暗森林',
            description: '曾经是精灵的家园，大灾变后被黑暗力量侵蚀，如今布满哥布林和骷髅。',
            history: '精灵女王在此建立过繁荣的文明，直到虚空裂隙打开，黑暗力量涌入。',
            dangers: ['哥布林部落', '骷髅军团', '巨型蜘蛛巢穴'],
            treasures: ['精灵之弓', '自然之心', '古老的精灵典籍']
        },
        desert: {
            name: '荒芜沙漠',
            description: '曾经的沙漠帝国如今只剩废墟和金字塔，法老王的诅咒依然笼罩这片土地。',
            history: '法老王试图征服虚空，却反被虚空吞噬，他的陵墓成为最危险的禁地。',
            dangers: ['木乃伊守卫', '沙漠巨蝎', '沙虫'],
            treasures: ['法老的权杖', '沙漠之眼', '古老金币堆']
        },
        ice: {
            name: '冰霜要塞',
            description: '远古巨人族的遗迹，冰雪覆盖的塔楼中封印着古老的力量。',
            history: '巨人族试图用冰雪封印虚空裂隙，成功但代价是整个种族的消亡。',
            dangers: ['冰霜傀儡', '冰霜幽魂', '冰元素'],
            treasures: ['巨人之心', '冰霜巨剑', '远古冰晶']
        },
        fire: {
            name: '烈焰地狱',
            description: '火山活跃的区域，火焰领主统治着这片燃烧的土地。',
            history: '火焰领主原本是守护者，但在虚空的诱惑下堕落为恶魔。',
            dangers: ['火焰小鬼', '火龙', '火焰恶魔'],
            treasures: ['火焰领主的头盔', '熔岩之心', '凤凰羽毛']
        },
        void: {
            name: '虚空神殿',
            description: '大灾变的中心，虚空力量最浓郁的地方，神器和最终敌人都在此处。',
            history: '这里是最初打开虚空裂隙的地方，也是最强大的神器"符文之心"沉睡之地。',
            dangers: ['虚空异兽', '巫妖', '虚空幽灵', '虚空君主'],
            treasures: ['符文之心', '虚空之剑', '不朽之契']
        }
    },
    
    characters: {
        warrior: {
            name: '战士',
            history: '战士是最古老的职业，源自巨人族的战斗技巧。',
            philosophy: '力量就是一切，只有足够强大才能保护想保护的人。',
            training: '在战场上磨练技艺，每一次受伤都是成长的养分。'
        },
        mage: {
            name: '法师',
            history: '法师传承自精灵族的魔法文明，是唯一能操控元素力量的职业。',
            philosophy: '知识就是力量，魔法是对世界规则的理解和运用。',
            training: '在古老的法师塔中学习，阅读无数典籍，感悟元素的本质。'
        },
        ranger: {
            name: '游侠',
            history: '游侠是森林精灵和人类的混血后代，擅长弓箭和隐蔽行动。',
            philosophy: '速度和技巧比蛮力更重要，一击必杀才是真正的艺术。',
            training: '在森林中与野兽追逐，练习箭术和潜行技巧。'
        },
        cleric: {
            name: '圣职',
            history: '圣职者是神圣力量的追随者，传承自太阳神殿的祭祀传统。',
            philosophy: '光明的力量可以驱散黑暗，即使在最绝望的时刻也有希望。',
            training: '在神殿中祈祷，学习神圣法术，用信念治愈伤痛。'
        }
    },
    
    factions: {
        adventurers_guild: {
            name: '冒险者公会',
            description: '管理冒险者的组织，提供任务和奖励。',
            headquarters: '城镇中心',
            services: ['发布任务', '提供奖励', '交易物品', '情报收集']
        },
        merchants_union: {
            name: '商人联盟',
            description: '控制大陆贸易的组织，在各地都有商店。',
            headquarters: '沙漠城市',
            services: ['买卖物品', '提供情报', '护送服务']
        },
        ancient_order: {
            name: '远古秩序',
            description: '研究古代文明的秘密组织。',
            headquarters: '冰霜要塞深处',
            services: ['提供任务', '古代知识', '特殊物品']
        }
    },
    
    legends: {
        rune_heart: {
            name: '符文之心',
            description: '最强大的神器，据说可以控制虚空的力量。',
            location: '虚空神殿最深处',
            power: '可以实现任何愿望，但代价未知。',
            guardians: ['虚空君主', '四大元素守护者']
        },
        dragon_slayer: {
            name: '屠龙者之剑',
            description: '可以杀死不朽巨龙的唯一武器。',
            location: '火焰地狱BOSS掉落',
            power: '对龙类敌人伤害+200%'
        },
        phoenix_armor: {
            name: '凤凰铠甲',
            description: '由凤凰羽毛编织的不朽铠甲。',
            location: '冰霜要塞BOSS掉落',
            power: '免疫一次致命伤害，每场战斗一次'
        }
    },
    
    events: {
        great_cataclysm: {
            name: '大灾变',
            year: '1024年前',
            description: '一场神秘灾难摧毁了整个文明，虚空力量涌入世界。',
            cause: '未知，传说中是有人打开了不该打开的门。',
            consequence: '文明毁灭，怪物横行，只有地下迷宫保存下来。'
        },
        rise_of_adventurers: {
            name: '冒险者时代',
            year: '大灾变后500年',
            description: '人们开始涌入迷宫寻找财富和力量。',
            cause: '地表资源枯竭，地下宝藏的传说。',
            consequence: '冒险者公会成立，城镇开始繁荣。'
        }
    }
};

const BACKSTORY = {
    player: [
        '你是一名普通的冒险者，听闻地下迷宫中藏有传说中的神器，决定前来一试。',
        '你的家乡被怪物袭击，只有你幸存下来。你发誓要变得更强，消灭所有怪物。',
        '你是一名退伍老兵，退休后闲来无事，决定成为一名冒险者。',
        '你是冒险者家族的继承人，从小就接受训练，注定要进入迷宫探索。',
        '你是一名法师，学成后进入迷宫寻找失传的古代魔法。'
    ],
    
    villain_backstory: {
        void_overlord: '虚空君主曾是大灾变时的英雄，他试图封印虚空却反被吞噬，成为虚空的代言人。',
        fire_lord: '火焰领主原本是守护者，守护着人类不受黑暗侵害，但虚空的诱惑让他堕落。',
        ice_dragon: '冰霜巨龙是远古巨人族的最后守护者，被虚空腐蚀后变得狂暴。',
        pharaoh: '法老王在大灾变时试图用虚空的力量永生，却变成了木乃伊。',
        forest_troll: '森林巨魔原本是精灵的盟友，黑暗力量让它变得狂暴。'
    }
};

const LORE_TIPS = [
    '据说在大灾变之前，世界是由五种元素力量维持平衡的。',
    '冒险者公会的创始人是唯一从大灾变中幸存的神级冒险者。',
    '传说符文之心是由第一位英雄用五种元素精华铸造而成。',
    '虚空君主曾经是人类的守护者，直到他触碰了不该触碰的力量。',
    '每个首领都守护着一件神器碎片，收集所有碎片可以召唤符文之心。',
    '大灾变那天，天空出现了五个裂隙，每个地区对应一个裂隙。',
    '据说在最深的地下，有一扇通往其他世界的大门。',
    '有些冒险者声称在迷宫中遇到了来自其他世界的旅行者。',
    '巨人是这个世界上最古老的种族，他们在大灾变前就已经消亡。',
    '精灵族在大灾变后分裂成了几个分支，游侠是其中一支的后裔。'
];

class LoreManager {
    constructor(game) {
        this.game = game;
        this.data = GAME_LORE;
        this.backstory = BACKSTORY;
        this.tips = LORE_TIPS;
    }
    
    getRandomTip() {
        return this.tips[Math.floor(Math.random() * this.tips.length)];
    }
    
    getRegionLore(region) {
        return this.data.regions[region] || null;
    }
    
    getLegend(legendId) {
        return this.data.legends[legendId] || null;
    }
    
    getPlayerBackstory() {
        return this.backstory.player[Math.floor(Math.random() * this.backstory.player.length)];
    }
    
    getVillainBackstory(villainId) {
        return this.backstory.villain_backstory[villainId] || '这个敌人有一段神秘的过去。';
    }
    
    getWorldInfo() {
        return this.data.world;
    }
    
    getFactionInfo(factionId) {
        return this.data.factions[factionId] || null;
    }
    
    discoverLorePiece(pieceId) {
        // 记录玩家发现的 Lore
        console.log(`[Lore] 发现 lore piece: ${pieceId}`);
    }
}

export { LoreManager, GAME_LORE };
