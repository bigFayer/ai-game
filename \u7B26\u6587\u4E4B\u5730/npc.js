/**
 * 符文之地 - NPC系统
 * NPC对话 + 商店 + 任务
 */

import { ItemType } from './items.js';

class NPC {
    constructor(data) {
        this.id = data.id || crypto.randomUUID();
        this.name = data.name;
        this.title = data.title || '';
        this.description = data.description || '';
        this.portrait = data.portrait || '';
        this.dialogues = data.dialogues || [];
        this.dialogueIndex = 0;
        this.type = data.type || 'general'; // shop/quest/guild/info
        this.inventory = data.inventory || [];
        this.questIds = data.questIds || [];
        this.dialogueState = {};
    }
    
    advanceDialogue() {
        this.dialogueIndex++;
        if (this.dialogueIndex >= this.dialogues.length) {
            this.dialogueIndex = this.dialogues.length - 1;
        }
    }
    
    resetDialogue() {
        this.dialogueIndex = 0;
    }
    
    getCurrentDialogue() {
        return this.dialogues[this.dialogueIndex] || this.dialogues[0] || '';
    }
}

class NPCManager {
    constructor(game) {
        this.game = game;
        this.npcs = this.initNPCs();
    }
    
    initNPCs() {
        return {
            // 森林NPC
            'forest_merchant': {
                id: 'forest_merchant',
                name: '流浪商人',
                title: '商人',
                type: 'shop',
                dialogues: [
                    '欢迎光临！看看我的商品吧，都是好东西。',
                    '这把剑怎么样？很锋利的。',
                    '下次再来啊！'
                ],
                inventory: this.generateShopInventory('common'),
                shopPrices: 1.0
            },
            'forest_elder': {
                id: 'forest_elder',
                name: '森林长老',
                title: '贤者',
                type: 'quest',
                dialogues: [
                    '年轻人，这片森林里据说藏着一件古老的神器。',
                    '如果你能找到它，请带回来给我看看。',
                    '森林的深处有一个被遗忘的神殿，那里或许有你想要的答案。'
                ],
                questIds: ['ancient_artifact']
            },
            'forest_healer': {
                id: 'forest_healer',
                name: '森林治愈师',
                title: '治疗师',
                type: 'shop',
                dialogues: [
                    '你需要治疗吗？我可以帮你。',
                    '这些药水都是我亲手调制的。',
                    '愿森林的祝福与你同在。'
                ],
                inventory: [
                    { id: 'health_potion', name: '生命药水', price: 15, quantity: 10 },
                    { id: 'mana_potion', name: '魔法药水', price: 20, quantity: 10 },
                    { id: 'antidote', name: '解毒剂', price: 25, quantity: 5 }
                ]
            },
            // 沙漠NPC
            'desert_merchant': {
                id: 'desert_merchant',
                name: '沙漠商人',
                title: '商人',
                type: 'shop',
                dialogues: [
                    '哦？又有冒险者来了。',
                    '沙漠里的宝藏可不少，但危险也很多。',
                    '买些装备吧，我给你打折。'
                ],
                inventory: this.generateShopInventory('uncommon'),
                shopPrices: 1.2
            },
            'desert_scholar': {
                id: 'desert_scholar',
                name: '沙漠学者',
                title: '学者',
                type: 'quest',
                dialogues: [
                    '这片沙漠曾经是一个繁荣的王国...',
                    '法老王的陵墓就在这附近，据说里面有无尽的宝藏。',
                    '如果你能带回法老的圣物，我会有丰厚的奖励。'
                ],
                questIds: ['pharaoh_treasure']
            },
            // 冰霜NPC
            'ice_merchant': {
                id: 'ice_merchant',
                name: '冰霜商人',
                title: '商人',
                type: 'shop',
                dialogues: [
                    '这里的冬天很漫长，但我们有独特的商品。',
                    '试试这把冰霜剑？非常锋利。',
                    '小心那些冰霜幽魂，它们很危险。'
                ],
                inventory: this.generateShopInventory('rare'),
                shopPrices: 1.5
            },
            // 火焰NPC
            'fire_smith': {
                id: 'fire_smith',
                name: '火焰铁匠',
                title: '铁匠',
                type: 'shop',
                dialogues: [
                    '哈！欢迎来到我的熔炉！',
                    '我能帮你锻造武器和护甲，只要材料够。',
                    '火焰领主的领地有最好的矿石，但也有最危险的守护者。'
                ],
                inventory: this.generateShopInventory('epic'),
                shopPrices: 1.8,
                hasForge: true
            },
            // 虚空NPC
            'void_wise': {
                id: 'void_wise',
                name: '虚空智者',
                title: '先知',
                type: 'quest',
                dialogues: [
                    '我看到了... 你命中注定要面对虚空君主。',
                    '虚空神殿的深处有一把能克制它的武器。',
                    '但要小心，那些守护者不是普通人能对付的。'
                ],
                questIds: ['void_weapon']
            },
            // 通用NPC
            'adventurer_guild': {
                id: 'adventurer_guild',
                name: '冒险者公会接待员',
                title: '接待员',
                type: 'info',
                dialogues: [
                    '欢迎来到冒险者公会！',
                    '我们提供各种任务，完成它们可以获得丰厚奖励。',
                    '你的等级越高，能接的任务就越难，奖励也越丰厚。'
                ],
                questIds: ['guild_missions']
            },
            'banker': {
                id: 'banker',
                name: '银行家',
                title: '银行家',
                type: 'info',
                dialogues: [
                    '我可以帮你保管金币，收取5%的手续费。',
                    '存入的金币会安全保存，即使你死亡也不会丢失。',
                    '要存款吗？'
                ]
            },
            'tips_master': {
                id: 'tips_master',
                name: '老冒险者',
                title: '导师',
                type: 'info',
                dialogues: [
                    '年轻人，让我告诉你一些冒险的技巧：',
                    '1. 记得随时补充药水，死亡会失去当前层的进度。',
                    '2. 击败首领可以获得稀有装备和大量金币。',
                    '3. 升级技能可以让你在战斗中更占优势。',
                    '4. 注意敌人的弱点，用相克的元素攻击可以造成更多伤害。',
                    '祝你好运，冒险者！'
                ]
            }
        };
    }
    
    generateShopInventory(quality) {
        const inventories = {
            common: [
                { id: 'health_potion', name: '生命药水', price: 15, quantity: 10 },
                { id: 'mana_potion', name: '魔法药水', price: 20, quantity: 10 }
            ],
            uncommon: [
                { id: 'health_potion', name: '生命药水', price: 15, quantity: 15 },
                { id: 'mana_potion', name: '魔法药水', price: 20, quantity: 15 },
                { id: 'antidote', name: '解毒剂', price: 25, quantity: 8 }
            ],
            rare: [
                { id: 'health_potion_large', name: '大生命药水', price: 50, quantity: 10 },
                { id: 'mana_potion_large', name: '大魔法药水', price: 60, quantity: 10 },
                { id: 'elixir', name: '万能药', price: 180, quantity: 3 },
                { id: 'phoenix_down', name: '凤凰羽毛', price: 450, quantity: 2 }
            ],
            epic: [
                { id: 'fire_sword', name: '火焰剑', price: 800, rarity: 'RARE', stats: { atk: 18, fireResist: 25 } },
                { id: 'ice_sword', name: '冰霜剑', price: 800, rarity: 'RARE', stats: { atk: 18, iceResist: 25 } },
                { id: 'dragon_scale_armor', name: '龙鳞甲', price: 1200, rarity: 'LEGENDARY', stats: { def: 30, hp: 80 } }
            ]
        };
        return inventories[quality] || inventories.common;
    }
    
    getNPC(id) {
        const template = this.npcs[id];
        if (!template) return null;
        return new NPC({ ...template });
    }
    
    getNPCsByType(type) {
        return Object.values(this.npcs).filter(npc => npc.type === type);
    }
    
    interact(npcId) {
        const npc = this.getNPC(npcId);
        if (!npc) return null;
        
        // 特殊处理商店NPC
        if (npc.type === 'shop') {
            return { type: 'shop', npc };
        }
        
        return { type: 'dialogue', npc };
    }
}

export { NPC, NPCManager };
