/**
 * 符文之地 - NPC完整对话树
 */

const NPC_DIALOGUES = {
    // 森林NPC
    merchant_forest: {
        id: 'merchant_forest',
        name: '流浪商人',
        portrait: 'merchant',
        greeting: '欢迎光临！看看我的商品吧！',
        dialogues: {
            main: {
                text: '这些都是我从各地收集来的好东西，看看有没有需要的？',
                responses: [
                    { text: '我想买点东西', action: 'open_shop' },
                    { text: '有什么新鲜货吗？', next: 'new_items' },
                    { text: '最近生意怎么样？', next: 'small_talk' },
                    { text: '再见', isEnd: true }
                ]
            },
            new_items: {
                text: '哦，你运气不错！昨天刚进了一批从沙漠那边来的稀有物品，还有火宝石呢！',
                responses: [
                    { text: '火宝石？拿来看看', next: 'fire_gem_info' },
                    { text: '下次再说', isEnd: true }
                ]
            },
            fire_gem_info: {
                text: '火宝石可是好东西，用它可以给武器附上火焰属性。不过价格嘛...要500金币。',
                responses: [
                    { text: '太贵了', next: 'main' },
                    { text: '我买了', action: 'buy_fire_gem', next: 'main' }
                ]
            },
            small_talk: {
                text: '唉，最近生意不好做啊。森林里的哥布林越来越多了，冒险者们都不敢进来。',
                responses: [
                    { text: '我会帮忙清理的', next: 'quest_hint' },
                    { text: '保重', isEnd: true }
                ]
            },
            quest_hint: {
                text: '真的吗？那太感谢了！如果你能帮我清理20只哥布林，我给你打折！',
                responses: [
                    { text: '一言为定', action: 'accept_forest_quest', isEnd: true }
                ]
            }
        }
    },
    
    elder_forest: {
        id: 'elder_forest',
        name: '森林长老',
        portrait: 'elder',
        greeting: '年轻人，来这里有何贵干？',
        dialogues: {
            main: {
                text: '这片森林曾经是精灵的家园...大灾变之后，一切都变了。',
                responses: [
                    { text: '大灾变是什么？', next: 'cataclysm_explain' },
                    { text: '我想接受任务', next: 'elder_quest' },
                    { text: '这里有什么宝藏？', next: 'treasure_hint' },
                    { text: '告辞了', isEnd: true }
                ]
            },
            cataclysm_explain: {
                text: '一千多年前，虚空裂隙打开，黑暗力量涌入世界。精灵女王试图封印它，但失败了...她的灵魂至今还在森林深处徘徊。',
                responses: [
                    { text: '我可以去看看吗？', next: 'queen_quest' },
                    { text: '谢谢你告诉我', isEnd: true }
                ]
            },
            queen_quest: {
                text: '如果你能找到女王的灵魂并让她安息，你将获得精灵的祝福——攻击力永久+5%。但要小心，那里有强大的守护者。',
                responses: [
                    { text: '我接受这个任务', action: 'accept_queen_quest', isEnd: true },
                    { text: '让我想想', isEnd: true }
                ]
            },
            elder_quest: {
                text: '森林深处出现了一只巨大的蜘蛛，它的网几乎覆盖了整个西部森林。帮我除掉它。',
                responses: [
                    { text: '没问题', action: 'accept_spider_quest', isEnd: true },
                    { text: '太危险了', isEnd: true }
                ]
            },
            treasure_hint: {
                text: '森林的东南角有一个被遗忘的神殿，据说那里藏着精灵的遗产。但那里有很多骷髅守卫...',
                responses: [
                    { text: '我会去看看的', isEnd: true },
                    { text: '谢谢提示', isEnd: true }
                ]
            }
        }
    },
    
    healer_forest: {
        id: 'healer_forest',
        name: '森林治愈师',
        portrait: 'healer',
        greeting: '愿森林的祝福与你同在。',
        dialogues: {
            main: {
                text: '你需要治疗吗？我这里有各种草药调配的药水。',
                responses: [
                    { text: '给我来点药水', action: 'open_shop' },
                    { text: '你的药水有什么特别的吗？', next: 'healer_special' },
                    { text: '再见', isEnd: true }
                ]
            },
            healer_special: {
                text: '我用的是森林深处的神秘草药，效果比普通药水好50%。当然，价格也贵一些。',
                responses: [
                    { text: '贵点也值', next: 'main' },
                    { text: '我考虑一下', isEnd: true }
                ]
            }
        }
    },
    
    // 沙漠NPC
    merchant_desert: {
        id: 'merchant_desert',
        name: '沙漠商人',
        portrait: 'merchant',
        greeting: '欢迎！在这个鬼地方能遇到人真不容易。',
        dialogues: {
            main: {
                text: '沙漠里的宝藏可不少，但危险也很多。看你的装备...似乎还有很长的路要走。',
                responses: [
                    { text: '你想说什么？', next: 'merchant_advice' },
                    { text: '给我看看商品', action: 'open_shop' },
                    { text: '再见', isEnd: true }
                ]
            },
            merchant_advice: {
                text: '法老的诅咒可不是闹着玩的。如果你看到发光的符文，一定要绕开——那是陷阱。',
                responses: [
                    { text: '谢谢提醒', next: 'main' },
                    { text: '还有别的要注意的吗？', next: 'desert_tips' }
                ]
            },
            desert_tips: {
                text: '沙虫喜欢从沙子里突然冒出来，看到地面震动就赶紧跑。还有，木乃伊会传染诅咒，记得带解毒剂。',
                responses: [
                    { text: '记住了', isEnd: true }
                ]
            }
        }
    },
    
    scholar_desert: {
        id: 'scholar_desert',
        name: '沙漠学者',
        portrait: 'scholar',
        greeting: '哦？又一个冒险者。你对这片沙漠的历史感兴趣吗？',
        dialogues: {
            main: {
                text: '这个沙漠曾经是一个繁荣的帝国——太阳帝国。法老王拥有操控太阳的力量。',
                responses: [
                    { text: '后来怎么样了？', next: 'empire_fall' },
                    { text: '法老王现在在哪？', next: 'pharaoh_location' },
                    { text: '我对历史没兴趣', isEnd: true }
                ]
            },
            empire_fall: {
                text: '大灾变那天，法老王试图用太阳的力量封印虚空。但他失败了...被黑暗力量腐蚀，变成了现在的木乃伊之王。',
                responses: [
                    { text: '他很强大吗？', next: 'pharaoh_strength' },
                    { text: '我明白了', isEnd: true }
                ]
            },
            pharaoh_location: {
                text: '在沙漠的最深处，有一座金字塔。法老王就在那里守护着他的宝藏——以及他的诅咒。',
                responses: [
                    { text: '我想去挑战他', next: 'pharaoh_quest' },
                    { text: '我需要更多准备', isEnd: true }
                ]
            },
            pharaoh_strength: {
                text: '他操控着太阳的力量，会召唤木乃伊军队。而且...他是不死的。除非你能找到圣水。',
                responses: [
                    { text: '圣水在哪里？', next: 'holy_water_location' },
                    { text: '这太难了', isEnd: true }
                ]
            },
            holy_water_location: {
                text: '据说在沙漠绿洲的底部，有一眼被遗忘的圣泉。但那里被毒蛇守护着...',
                responses: [
                    { text: '我会去找的', isEnd: true }
                ]
            },
            pharaoh_quest: {
                text: '如果你能带回法老的圣物——太阳护符——我将给你关于这个帝国最珍贵的宝藏的线索。',
                responses: [
                    { text: '我接受', action: 'accept_pharaoh_quest', isEnd: true },
                    { text: '让我准备一下', isEnd: true }
                ]
            }
        }
    },
    
    // 冰霜NPC
    merchant_ice: {
        id: 'merchant_ice',
        name: '冰霜商人',
        portrait: 'merchant',
        greeting: '欢迎来到我的小店，这里有最珍贵的冰霜宝物。',
        dialogues: {
            main: {
                text: '这里的冬天很漫长，但我们有独特的商品——冰晶和火宝石都是稀有品。',
                responses: [
                    { text: '给我看看', action: 'open_shop' },
                    { text: '这里有什么传说吗？', next: 'ice_legends' },
                    { text: '再见', isEnd: true }
                ]
            },
            ice_legends: {
                text: '据说冰霜巨人是这片土地的守护者，它们守护着远古的力量。但现在只剩下冰冷的幽灵在游荡...',
                responses: [
                    { text: '谢谢你', isEnd: true }
                ]
            }
        }
    },
    
    // 火焰NPC
    smith_fire: {
        id: 'smith_fire',
        name: '火焰铁匠',
        portrait: 'smith',
        greeting: '哈！欢迎来到我的熔炉！想打造点什么吗？',
        dialogues: {
            main: {
                text: '我能帮你锻造武器和护甲！只要材料够，没有我做不出来的东西。',
                responses: [
                    { text: '我想锻造', action: 'open_forge' },
                    { text: '有什么高级配方吗？', next: 'advanced_recipes' },
                    { text: '再见', isEnd: true }
                ]
            },
            advanced_recipes: {
                text: '哦？你眼光不错！我这里有龙之剑的配方——需要龙鳞片、凤凰羽毛和大量黄金。这可是传说级武器！',
                responses: [
                    { text: '我会收集材料的', next: 'main' },
                    { text: '听起来很难', isEnd: true }
                ]
            }
        }
    },
    
    // 虚空NPC
    void_sage: {
        id: 'void_sage',
        name: '虚空先知',
        portrait: 'sage',
        greeting: '...我看到了...你命中注定要面对虚空君主...',
        dialogues: {
            main: {
                text: '虚空的力量正在召唤你。但要小心...那里的黑暗会腐蚀你的灵魂。',
                responses: [
                    { text: '我该如何准备？', next: 'void_preparation' },
                    { text: '虚空君主有多强？', next: 'void_overlord_power' },
                    { text: '我不信这些', isEnd: true }
                ]
            },
            void_preparation: {
                text: '你需要收集五种元素的精华——火焰、冰霜、雷电、圣光，以及...虚空本身。它们可以保护你免受虚空力量的侵蚀。',
                responses: [
                    { text: '在哪里可以找到这些？', next: 'element_locations' },
                    { text: '我明白了', isEnd: true }
                ]
            },
            element_locations: {
                text: '火焰精华在火焰地狱...冰霜在冰霜要塞...雷电...在某个被遗忘的地方。圣光嘛...据说圣职者知道。虚空本身...就在最深处。',
                responses: [
                    { text: '谢谢你', isEnd: true }
                ]
            },
            void_overlord_power: {
                text: '虚空君主曾经是一位英雄...但现在他已经被虚空完全吞噬。他是所有BOSS中最强大的——比法老王、冰霜巨龙和火焰领主加起来都要强。',
                responses: [
                    { text: '我要打败他', next: 'void_final_quest' },
                    { text: '这不可能', isEnd: true }
                ]
            },
            void_final_quest: {
                text: '如果你真的想挑战虚空君主...去收集符文碎片的线索吧。每一个首领都守护着一块碎片。当你集齐五块...你就有机会了。',
                responses: [
                    { text: '我会去收集的', action: 'accept_void_quest', isEnd: true },
                    { text: '我需要时间考虑', isEnd: true }
                ]
            }
        }
    },
    
    // 冒险者公会NPC
    guild_receptionist: {
        id: 'guild_receptionist',
        name: '冒险者公会接待员',
        portrait: 'guild_member',
        greeting: '欢迎来到冒险者公会！今天想接什么任务？',
        dialogues: {
            main: {
                text: '我们公会有各种难度的任务。从清理怪物到收集物品，应有尽有。完成任务可以获得金币和公会声望。',
                responses: [
                    { text: '有什么任务？', next: 'available_quests' },
                    { text: '公会声望有什么用？', next: 'guild_reputation' },
                    { text: '下次再说', isEnd: true }
                ]
            },
            available_quests: {
                text: '目前最需要的是清理地下城的怪物。击杀50只哥布林可以获得200金币和公会声望。',
                responses: [
                    { text: '我接受', action: 'accept_guild_quest', next: 'main' },
                    { text: '有更难的任务吗？', next: 'hard_quests' }
                ]
            },
            hard_quests: {
                text: '当然有！击杀首领可以获得1000金币和大量声望。但那需要相当的实力...',
                responses: [
                    { text: '我会努力的', next: 'main' },
                    { text: '先从小任务开始', isEnd: true }
                ]
            },
            guild_reputation: {
                text: '声望越高，你在公会的地位就越高。高声望可以接更高级的任务，购买稀有物品，甚至...获得传说装备的配方！',
                responses: [
                    { text: '我要努力提升声望', next: 'main' },
                    { text: '明白了', isEnd: true }
                ]
            }
        }
    },
    
    // 银行家NPC
    banker: {
        id: 'banker',
        name: '银行家',
        portrait: 'banker',
        greeting: '欢迎，请问要存款吗？',
        dialogues: {
            main: {
                text: '我可以帮你保管金币。存进来的钱即使你死亡也不会丢失。不过，我需要收取5%的手续费。',
                responses: [
                    { text: '我想存款', action: 'deposit' },
                    { text: '我想取款', action: 'withdraw' },
                    { text: '当前利率是多少？', next: 'interest_rate' },
                    { text: '不用了', isEnd: true }
                ]
            },
            interest_rate: {
                text: '存款每天会获得0.1%的利息。虽然不多，但长期来看也是一笔收入。',
                responses: [
                    { text: '存一些', action: 'deposit', next: 'main' },
                    { text: '改天再说', isEnd: true }
                ]
            }
        }
    },
    
    // 导师NPC
    tips_master: {
        id: 'tips_master',
        name: '老冒险者',
        portrait: 'veteran',
        greeting: '年轻人，来听听我的经验之谈吧。',
        dialogues: {
            main: {
                text: '我年轻时也是个冒险者，在地下城里摸爬滚打了五十年。虽然没能通关，但经验还是有一些的。',
                responses: [
                    { text: '请讲', next: 'tips_combat' },
                    { text: '关于探索', next: 'tips_exploration' },
                    { text: '关于装备', next: 'tips_equipment' },
                    { text: '我有事先走了', isEnd: true }
                ]
            },
            tips_combat: {
                text: '战斗时，一定要注意敌人的攻击模式。有些敌人会周期性放大招，看到它们发光就要准备好防御。还有，没事别硬抗。',
                responses: [
                    { text: '还有其他建议吗？', next: 'main' },
                    { text: '记住了', isEnd: true }
                ]
            },
            tips_exploration: {
                text: '探索时，要善用地图。那些发光的标记通常是事件点。但也别太贪，遇到打不过的就跑，留得青山在。',
                responses: [
                    { text: '明白了', isEnd: true },
                    { text: '还有吗？', next: 'main' }
                ]
            },
            tips_equipment: {
                text: '装备不是越稀有越好，关键是适合你。有些蓝色装备的属性组合可能比紫色更好。还有，别忘了附魔！',
                responses: [
                    { text: '谢谢指点', isEnd: true }
                ]
            }
        }
    }
};

class NPCDialogueManager {
    constructor(game) {
        this.game = game;
        this.dialogues = NPC_DIALOGUES;
        this.currentNPC = null;
        this.currentNodeId = 'main';
    }
    
    startDialogue(npcId) {
        const npcData = this.dialogues[npcId];
        if (!npcData) {
            console.warn(`[NPCDialogue] 未找到NPC: ${npcId}`);
            return null;
        }
        
        this.currentNPC = npcId;
        this.currentNodeId = 'main';
        
        return this.getCurrentDialogue();
    }
    
    getCurrentDialogue() {
        const npcData = this.dialogues[this.currentNPC];
        if (!npcData) return null;
        
        const node = npcData.dialogues[this.currentNodeId];
        if (!node) return null;
        
        return {
            npcId: this.currentNPC,
            npcName: npcData.name,
            portrait: npcData.portrait,
            greeting: npcData.greeting,
            text: node.text,
            responses: node.responses.map((r, i) => ({ index: i, ...r }))
        };
    }
    
    selectResponse(responseIndex) {
        const npcData = this.dialogues[this.currentNPC];
        if (!npcData) return null;
        
        const node = npcData.dialogues[this.currentNodeId];
        if (!node || !node.responses[responseIndex]) return null;
        
        const response = node.responses[responseIndex];
        
        // 执行动作
        if (response.action) {
            this.executeAction(response.action);
        }
        
        // 跳转节点
        if (response.next) {
            this.currentNodeId = response.next;
        }
        
        // 结束对话
        if (response.isEnd) {
            return { isEnd: true };
        }
        
        return this.getCurrentDialogue();
    }
    
    executeAction(action) {
        switch (action) {
            case 'open_shop':
                this.game.state = 'SHOP';
                break;
            case 'open_forge':
                this.game.state = 'FORGE';
                break;
            case 'accept_forest_quest':
                this.game.questManager?.acceptQuest('forest_001');
                break;
            case 'accept_spider_quest':
                this.game.questManager?.acceptQuest('forest_004');
                break;
            case 'accept_queen_quest':
                this.game.questManager?.acceptQuest('forest_queen');
                break;
            case 'accept_pharaoh_quest':
                this.game.questManager?.acceptQuest('desert_pharaoh');
                break;
            case 'accept_void_quest':
                this.game.questManager?.acceptQuest('void_runes');
                break;
            case 'accept_guild_quest':
                this.game.questManager?.acceptQuest('guild_cleaning');
                break;
            case 'deposit':
                // 存款
                break;
            case 'withdraw':
                // 取款
                break;
        }
    }
    
    endDialogue() {
        this.currentNPC = null;
        this.currentNodeId = 'main';
    }
    
    isActive() {
        return this.currentNPC !== null;
    }
    
    getNPCDialogue(npcId) {
        return this.dialogues[npcId] || null;
    }
}

export { NPCDialogueManager, NPC_DIALOGUES };
