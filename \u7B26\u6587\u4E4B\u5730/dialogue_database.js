/**
 * 符文之地 - 完整对话数据库
 */

const FULL_DIALOGUE_DATABASE = {
    // ========== 森林NPC ==========
    merchant_forest: {
        id: 'merchant_forest',
        name: '流浪商人',
        portrait: 'merchant_1',
        location: 'forest',
        dialogues: [
            {
                id: 'greeting',
                text: '欢迎光临！看看我的商品吧，都是从各地收集来的好东西。',
                responses: [
                    { text: '我想买点东西', next: 'show_shop' },
                    { text: '有什么新鲜货吗？', next: 'new_items' },
                    { text: '最近生意怎么样？', next: 'business' },
                    { text: '再见', end: true }
                ]
            },
            {
                id: 'new_items',
                text: '哦，你运气不错！昨天刚进了一批从沙漠那边来的稀有物品，还有火宝石呢！',
                responses: [
                    { text: '火宝石？拿来看看', next: 'fire_gem' },
                    { text: '下次再说', end: true }
                ]
            },
            {
                id: 'fire_gem',
                text: '火宝石可是好东西，用它可以给武器附上火焰属性。不过价格嘛...要500金币。',
                responses: [
                    { text: '太贵了', next: 'greeting' },
                    { text: '我买了', action: 'buy_fire_gem', end: true }
                ]
            },
            {
                id: 'business',
                text: '唉，最近生意不好做啊。森林里的哥布林越来越多了，冒险者们都不敢进来。',
                responses: [
                    { text: '我会帮忙清理的', next: 'quest_hint' },
                    { text: '保重', end: true }
                ]
            },
            {
                id: 'quest_hint',
                text: '真的吗？那太感谢了！如果你能帮我清理20只哥布林，我给你打折！',
                responses: [
                    { text: '一言为定', action: 'accept_forest_quest', end: true }
                ]
            }
        ]
    },
    
    elder_forest: {
        id: 'elder_forest',
        name: '森林长老',
        portrait: 'elder_1',
        location: 'forest',
        dialogues: [
            {
                id: 'greeting',
                text: '年轻人，来这里有何贵干？愿森林的智慧与你同在。',
                responses: [
                    { text: '我想接受任务', next: 'quests' },
                    { text: '大灾变是什么？', next: 'cataclysm' },
                    { text: '这里有什么宝藏？', next: 'treasure' },
                    { text: '告辞了', end: true }
                ]
            },
            {
                id: 'cataclysm',
                text: '一千多年前，虚空裂隙打开，黑暗力量涌入世界。精灵女王试图封印它，但失败了...她的灵魂至今还在森林深处徘徊。',
                responses: [
                    { text: '我可以去看看吗？', next: 'queen_quest' },
                    { text: '谢谢你告诉我', end: true }
                ]
            },
            {
                id: 'queen_quest',
                text: '如果你能找到女王的灵魂并让她安息，你将获得精灵的祝福——攻击力永久+5%。但要小心，那里有强大的守护者。',
                responses: [
                    { text: '我接受这个任务', action: 'accept_queen_quest', end: true },
                    { text: '让我想想', end: true }
                ]
            },
            {
                id: 'quests',
                text: '森林深处出现了一只巨大的蜘蛛，它的网几乎覆盖了整个西部森林。帮我除掉它。',
                responses: [
                    { text: '没问题', action: 'accept_spider_quest', end: true },
                    { text: '太危险了', end: true }
                ]
            },
            {
                id: 'treasure',
                text: '森林的东南角有一个被遗忘的神殿，据说那里藏着精灵的遗产。但那里有很多骷髅守卫...',
                responses: [
                    { text: '我会去看看的', end: true },
                    { text: '谢谢提示', end: true }
                ]
            }
        ]
    },
    
    healer_forest: {
        id: 'healer_forest',
        name: '森林治愈师',
        portrait: 'healer_1',
        location: 'forest',
        dialogues: [
            {
                id: 'greeting',
                text: '愿森林的祝福与你同在。需要治疗吗？我这里有各种草药调配的药水。',
                responses: [
                    { text: '给我来点药水', next: 'show_shop' },
                    { text: '你的药水有什么特别的吗？', next: 'special' },
                    { text: '再见', end: true }
                ]
            },
            {
                id: 'special',
                text: '我用的是森林深处的神秘草药，效果比普通药水好50%。当然，价格也贵一些。',
                responses: [
                    { text: '贵点也值', next: 'greeting' },
                    { text: '我考虑一下', end: true }
                ]
            }
        ]
    },
    
    // ========== 沙漠NPC ==========
    merchant_desert: {
        id: 'merchant_desert',
        name: '沙漠商人',
        portrait: 'merchant_2',
        location: 'desert',
        dialogues: [
            {
                id: 'greeting',
                text: '欢迎！在这个鬼地方能遇到人真不容易。想买点什么吗？',
                responses: [
                    { text: '给我看看商品', next: 'show_shop' },
                    { text: '有什么建议吗？', next: 'advice' },
                    { text: '再见', end: true }
                ]
            },
            {
                id: 'advice',
                text: '法老的诅咒可不是闹着玩的。如果你看到发光的符文，一定要绕开——那是陷阱。',
                responses: [
                    { text: '谢谢提醒', next: 'greeting' },
                    { text: '还有别的要注意的吗？', next: 'more_tips' }
                ]
            },
            {
                id: 'more_tips',
                text: '沙虫喜欢从沙子里突然冒出来，看到地面震动就赶紧跑。还有，木乃伊会传染诅咒，记得带解毒剂。',
                responses: [
                    { text: '记住了', end: true }
                ]
            }
        ]
    },
    
    scholar_desert: {
        id: 'scholar_desert',
        name: '沙漠学者',
        portrait: 'scholar_1',
        location: 'desert',
        dialogues: [
            {
                id: 'greeting',
                text: '哦？又一个冒险者。你对这片沙漠的历史感兴趣吗？',
                responses: [
                    { text: '后来怎么样了？', next: 'empire_fall' },
                    { text: '法老王现在在哪？', next: 'pharaoh_location' },
                    { text: '我对历史没兴趣', end: true }
                ]
            },
            {
                id: 'empire_fall',
                text: '大灾变那天，法老王试图用太阳的力量封印虚空。但他失败了...被黑暗力量腐蚀，变成了现在的木乃伊之王。',
                responses: [
                    { text: '他很强大吗？', next: 'pharaoh_strength' },
                    { text: '我明白了', end: true }
                ]
            },
            {
                id: 'pharaoh_location',
                text: '在沙漠的最深处，有一座金字塔。法老王就在那里守护着他的宝藏——以及他的诅咒。',
                responses: [
                    { text: '我想去挑战他', next: 'pharaoh_quest' },
                    { text: '我需要更多准备', end: true }
                ]
            },
            {
                id: 'pharaoh_strength',
                text: '他操控着太阳的力量，会召唤木乃伊军队。而且...他是不死的。除非你能找到圣水。',
                responses: [
                    { text: '圣水在哪里？', next: 'holy_water' },
                    { text: '这太难了', end: true }
                ]
            },
            {
                id: 'holy_water',
                text: '据说在沙漠绿洲的底部，有一眼被遗忘的圣泉。但那里被毒蛇守护着...',
                responses: [
                    { text: '我会去找的', end: true }
                ]
            },
            {
                id: 'pharaoh_quest',
                text: '如果你能带回法老的圣物——太阳护符，我将给你关于这个帝国最珍贵的宝藏的线索。',
                responses: [
                    { text: '我接受', action: 'accept_pharaoh_quest', end: true },
                    { text: '让我准备一下', end: true }
                ]
            }
        ]
    },
    
    // ========== 冰霜NPC ==========
    merchant_ice: {
        id: 'merchant_ice',
        name: '冰霜商人',
        portrait: 'merchant_3',
        location: 'ice',
        dialogues: [
            {
                id: 'greeting',
                text: '欢迎来到我的小店，这里有最珍贵的冰霜宝物。',
                responses: [
                    { text: '给我看看', next: 'show_shop' },
                    { text: '这里有什么传说吗？', next: 'legends' },
                    { text: '再见', end: true }
                ]
            },
            {
                id: 'legends',
                text: '据说冰霜巨人是这片土地的守护者，它们守护着远古的力量。但现在只剩下冰冷的幽灵在游荡...',
                responses: [
                    { text: '谢谢你', end: true }
                ]
            }
        ]
    },
    
    ice_scholar: {
        id: 'ice_scholar',
        name: '冰霜学者',
        portrait: 'scholar_2',
        location: 'ice',
        dialogues: [
            {
                id: 'greeting',
                text: '这片冰冻的土地埋葬着古老的秘密。你想知道什么？',
                responses: [
                    { text: '冰霜巨人是怎么回事？', next: 'giants' },
                    { text: '有什么宝藏吗？', next: 'treasure' },
                    { text: '再见', end: true }
                ]
            },
            {
                id: 'giants',
                text: '很久以前，冰霜巨人统治这片土地。但大灾变后，它们失去了理智，变成了只会破坏的怪物。',
                responses: [
                    { text: '有办法让它们恢复吗？', next: 'restore' },
                    { text: '我明白了', end: true }
                ]
            },
            {
                id: 'restore',
                text: '据说巨人的核心——冰霜之心——被封印在冰霜要塞的最深处。如果能摧毁它，巨人就会永久沉睡。',
                responses: [
                    { text: '我会去找到它的', action: 'accept_ice_quest', end: true },
                    { text: '太危险了', end: true }
                ]
            },
            {
                id: 'treasure',
                text: '冰霜要塞的深处据说有一把用永冻冰晶打造的武器——霜之哀伤。但很少有人能活着看到它。',
                responses: [
                    { text: '我会去看看的', end: true }
                ]
            }
        ]
    },
    
    // ========== 火焰NPC ==========
    smith_fire: {
        id: 'smith_fire',
        name: '火焰铁匠',
        portrait: 'smith_1',
        location: 'fire',
        dialogues: [
            {
                id: 'greeting',
                text: '哈！欢迎来到我的熔炉！想打造点什么吗？',
                responses: [
                    { text: '我想锻造', next: 'show_forge' },
                    { text: '有什么高级配方吗？', next: 'recipes' },
                    { text: '再见', end: true }
                ]
            },
            {
                id: 'recipes',
                text: '哦？你眼光不错！我这里有龙之剑的配方——需要龙鳞片、凤凰羽毛和大量黄金。这可是传说级武器！',
                responses: [
                    { text: '我会收集材料的', next: 'greeting' },
                    { text: '听起来很难', end: true }
                ]
            }
        ]
    },
    
    fire_mage: {
        id: 'fire_mage',
        name: '火焰法师',
        portrait: 'mage_2',
        location: 'fire',
        dialogues: [
            {
                id: 'greeting',
                text: '火焰的子民，欢迎你。我是这片熔岩之地最后的火焰法师。',
                responses: [
                    { text: '这里发生了什么？', next: 'history' },
                    { text: '你能教我火焰魔法吗？', next: 'teach' },
                    { text: '再见', end: true }
                ]
            },
            {
                id: 'history',
                text: '大灾变时，火焰领主试图用地狱之火封印虚空。但火焰失控了，烧毁了一切。现在这里只剩下熔岩和恶魔。',
                responses: [
                    { text: '有办法恢复吗？', next: 'restore' },
                    { text: '真可怕', end: true }
                ]
            },
            {
                id: 'restore',
                text: '如果你能击败火焰领主，取回他的王冠，也许能平息这场火焰之怒。',
                responses: [
                    { text: '我去挑战他', action: 'accept_fire_quest', end: true },
                    { text: '我需要准备', end: true }
                ]
            },
            {
                id: 'teach',
                text: '我可以教你一些基础的火焰魔法。但需要火焰精华作为媒介。',
                responses: [
                    { text: '我会带来火焰精华', end: true }
                ]
            }
        ]
    },
    
    // ========== 虚空NPC ==========
    void_sage: {
        id: 'void_sage',
        name: '虚空先知',
        portrait: 'sage_1',
        location: 'void',
        dialogues: [
            {
                id: 'greeting',
                text: '...我看到了...你命中注定要面对虚空君主...',
                responses: [
                    { text: '我该如何准备？', next: 'preparation' },
                    { text: '虚空君主有多强？', next: 'power' },
                    { text: '我不信这些', end: true }
                ]
            },
            {
                id: 'preparation',
                text: '你需要收集五种元素的精华——火焰、冰霜、雷电、圣光，以及...虚空本身。它们可以保护你免受虚空力量的侵蚀。',
                responses: [
                    { text: '在哪里可以找到这些？', next: 'locations' },
                    { text: '我明白了', end: true }
                ]
            },
            {
                id: 'locations',
                text: '火焰精华在火焰地狱...冰霜在冰霜要塞...雷电...在某个被遗忘的地方。圣光嘛...据说圣职者知道。虚空本身...就在最深处。',
                responses: [
                    { text: '谢谢你', end: true }
                ]
            },
            {
                id: 'power',
                text: '虚空君主曾经是一位英雄...但现在他已经被虚空完全吞噬。他是所有BOSS中最强大的——比法老王、冰霜巨龙和火焰领主加起来都要强。',
                responses: [
                    { text: '我要打败他', next: 'final_quest' },
                    { text: '这不可能', end: true }
                ]
            },
            {
                id: 'final_quest',
                text: '如果你真的想挑战虚空君主...去收集符文碎片的线索吧。每一个首领都守护着一块碎片。当你集齐五块...你就有机会了。',
                responses: [
                    { text: '我会去收集的', action: 'accept_void_quest', end: true },
                    { text: '我需要时间考虑', end: true }
                ]
            }
        ]
    },
    
    // ========== 通用NPC ==========
    guild_receptionist: {
        id: 'guild_receptionist',
        name: '冒险者公会接待员',
        portrait: 'guild_1',
        location: 'guild',
        dialogues: [
            {
                id: 'greeting',
                text: '欢迎来到冒险者公会！今天想接什么任务？',
                responses: [
                    { text: '有什么任务？', next: 'quests' },
                    { text: '公会声望有什么用？', next: 'reputation' },
                    { text: '下次再说', end: true }
                ]
            },
            {
                id: 'quests',
                text: '目前最需要的是清理地下城的怪物。击杀50只哥布林可以获得200金币和公会声望。',
                responses: [
                    { text: '我接受', action: 'accept_guild_quest', end: true },
                    { text: '有更难的任务吗？', next: 'hard_quests' }
                ]
            },
            {
                id: 'hard_quests',
                text: '当然有！击杀首领可以获得1000金币和大量声望。但那需要相当的实力...',
                responses: [
                    { text: '我会努力的', end: true },
                    { text: '先从小任务开始', end: true }
                ]
            },
            {
                id: 'reputation',
                text: '声望越高，你在公会的地位就越高。高声望可以接更高级的任务，购买稀有物品，甚至...获得传说装备的配方！',
                responses: [
                    { text: '我要努力提升声望', end: true },
                    { text: '明白了', end: true }
                ]
            }
        ]
    },
    
    banker: {
        id: 'banker',
        name: '银行家',
        portrait: 'banker_1',
        location: 'bank',
        dialogues: [
            {
                id: 'greeting',
                text: '欢迎，请问要存款吗？',
                responses: [
                    { text: '我想存款', next: 'deposit' },
                    { text: '我想取款', next: 'withdraw' },
                    { text: '当前利率是多少？', next: 'interest' },
                    { text: '不用了', end: true }
                ]
            },
            {
                id: 'deposit',
                text: '我可以帮你保管金币。存进来的钱即使你死亡也不会丢失。不过，我需要收取5%的手续费。',
                responses: [
                    { text: '我明白了', action: 'open_deposit', end: true }
                ]
            },
            {
                id: 'withdraw',
                text: '请告诉我你想取多少。',
                responses: [
                    { text: '算了', end: true }
                ]
            },
            {
                id: 'interest',
                text: '存款每天会获得0.1%的利息。虽然不多，但长期来看也是一笔收入。',
                responses: [
                    { text: '存一些', end: true },
                    { text: '改天再说', end: true }
                ]
            }
        ]
    },
    
    tips_master: {
        id: 'tips_master',
        name: '老冒险者',
        portrait: 'veteran_1',
        location: 'tavern',
        dialogues: [
            {
                id: 'greeting',
                text: '年轻人，来听听我的经验之谈吧。我年轻时也是个冒险者，在地下城里摸爬滚打了五十年。',
                responses: [
                    { text: '请讲战斗技巧', next: 'combat_tips' },
                    { text: '关于探索', next: 'exploration_tips' },
                    { text: '关于装备', next: 'equipment_tips' },
                    { text: '我有事先走了', end: true }
                ]
            },
            {
                id: 'combat_tips',
                text: '战斗时，一定要注意敌人的攻击模式。有些敌人会周期性放大招，看到它们发光就要准备好防御。还有，没事别硬抗。',
                responses: [
                    { text: '还有其他建议吗？', next: 'greeting' },
                    { text: '记住了', end: true }
                ]
            },
            {
                id: 'exploration_tips',
                text: '探索时，要善用地图。那些发光的标记通常是事件点。但也别太贪，遇到打不过的就跑，留得青山在。',
                responses: [
                    { text: '明白了', end: true },
                    { text: '还有吗？', next: 'greeting' }
                ]
            },
            {
                id: 'equipment_tips',
                text: '装备不是越稀有越好，关键是适合你。有些蓝色装备的属性组合可能比紫色更好。还有，别忘了附魔！',
                responses: [
                    { text: '谢谢指点', end: true }
                ]
            }
        ]
    }
};

export { FULL_DIALOGUE_DATABASE };
