/**
 * 符文之地 - 对话系统
 */

class DialogueNode {
    constructor(id, data) {
        this.id = id;
        this.text = data.text;
        this.responses = data.responses || [];
        this.condition = data.condition || null;
        this.effect = data.effect || null;
        this.next = data.next || null;
        this.portrait = data.portrait || null;
        this.speaker = data.speaker || null;
        this.isEnd = data.isEnd || false;
    }
    
    canShow() {
        if (!this.condition) return true;
        // 评估条件
        return this.condition();
    }
    
    execute() {
        if (this.effect) {
            this.effect();
        }
    }
}

class DialogueTree {
    constructor(npcId, nodes) {
        this.npcId = npcId;
        this.nodes = nodes;
        this.currentNodeId = null;
        this.history = [];
    }
    
    start(nodeId = 'start') {
        this.currentNodeId = nodeId;
        this.history = [];
        return this.getCurrentNode();
    }
    
    selectResponse(responseIndex) {
        const node = this.getCurrentNode();
        if (!node || !node.responses[responseIndex]) return null;
        
        const response = node.responses[responseIndex];
        this.history.push({ nodeId: this.currentNodeId, responseIndex });
        
        if (response.effect) {
            response.effect();
        }
        
        if (response.next) {
            this.currentNodeId = response.next;
            return this.getCurrentNode();
        } else if (response.action) {
            return { action: response.action };
        } else if (response.isEnd) {
            return { isEnd: true };
        }
        
        return null;
    }
    
    getCurrentNode() {
        const node = this.nodes[this.currentNodeId];
        if (!node) return null;
        if (!node.canShow()) {
            // 跳转到下一个可显示的节点
            return this.jumpToNext();
        }
        return node;
    }
    
    jumpToNext() {
        // 简化实现
        if (this.currentNodeId === 'start') {
            this.currentNodeId = 'main';
        }
        return this.getCurrentNode();
    }
    
    getAvailableResponses() {
        const node = this.getCurrentNode();
        if (!node) return [];
        return node.responses.filter(r => !r.condition || r.condition());
    }
}

class DialogueManager {
    constructor(game) {
        this.game = game;
        this.activeDialogue = null;
        this.dialogueTrees = this.initDialogueTrees();
    }
    
    initDialogueTrees() {
        return {
            'forest_elder': new DialogueTree('forest_elder', {
                'start': new DialogueNode('start', {
                    text: '啊，又是一位冒险者。来这里做什么？',
                    responses: [
                        { text: '我在寻找传说中的神器', next: 'artifact' },
                        { text: '我想接受任务', next: 'quest' },
                        { text: '只是想聊聊天', next: 'chat' },
                        { text: '告辞了', isEnd: true }
                    ]
                }),
                'artifact': new DialogueNode('artifact', {
                    text: '神器啊...据说被封印在地下城的最深处。但要小心，那里有虚空君主守护。',
                    responses: [
                        { text: '虚空君主是什么？', next: 'void_overlord' },
                        { text: '我明白了，谢谢', isEnd: true }
                    ]
                }),
                'void_overlord': new DialogueNode('void_overlord', {
                    text: '虚空君主曾是一位英雄，但被黑暗力量腐蚀。它是这片土地上最可怕的敌人。',
                    responses: [
                        { text: '我该如何打败它？', next: 'how_to_beat' },
                        { text: '我会小心的', isEnd: true }
                    ]
                }),
                'how_to_beat': new DialogueNode('how_to_beat', {
                    text: '你需要收集五件元素神器，用它们的力量封印虚空。只有真正的英雄才能做到。',
                    responses: [
                        { text: '我会努力的', isEnd: true }
                    ]
                }),
                'quest': new DialogueNode('quest', {
                    text: '森林里最近哥布林活动频繁，你能帮我清除它们吗？',
                    responses: [
                        { text: '没问题', action: 'accept_quest', next: 'quest_accepted' },
                        { text: '让我考虑一下', isEnd: true }
                    ]
                }),
                'quest_accepted': new DialogueNode('quest_accepted', {
                    text: '太好了！击败10只哥布林后回来找我领取奖励。',
                    isEnd: true
                }),
                'chat': new DialogueNode('chat', {
                    text: '这片森林曾经是精灵的家园。大灾变之后，一切都变了...',
                    responses: [
                        { text: '大灾变是什么？', next: 'cataclysm' },
                        { text: '原来如此', isEnd: true }
                    ]
                }),
                'cataclysm': new DialogueNode('cataclysm', {
                    text: '一千多年前，一场灾难性的事件摧毁了整个文明。虚空力量涌入世界，一切都变了。',
                    responses: [
                        { text: '谢谢你告诉我', isEnd: true }
                    ]
                })
            }),
            
            'tips_master': new DialogueTree('tips_master', {
                'start': new DialogueNode('start', {
                    text: '年轻人，想听听我的建议吗？',
                    responses: [
                        { text: '请说', next: 'advice' },
                        { text: '关于战斗', next: 'combat_tips' },
                        { text: '关于探索', next: 'exploration_tips' },
                        { text: '不需要', isEnd: true }
                    ]
                }),
                'advice': new DialogueNode('advice', {
                    text: '记住，地下城中最重要的是保持警惕。永远不要忽视药水的重要性。',
                    responses: [
                        { text: '明白了', isEnd: true }
                    ]
                }),
                'combat_tips': new DialogueNode('combat_tips', {
                    text: '战斗时，注意敌人的攻击模式。有些敌人会周期性使用强力技能，提前准备好防御。',
                    responses: [
                        { text: '谢谢', isEnd: true }
                    ]
                }),
                'exploration_tips': new DialogueNode('exploration_tips', {
                    text: '探索时，多注意地图上的标记。不同的颜色代表不同的事件。红色是敌人，黄色是宝箱。',
                    responses: [
                        { text: '记住了', isEnd: true }
                    ]
                })
            })
        };
    }
    
    startDialogue(npcId) {
        const tree = this.dialogueTrees[npcId];
        if (!tree) {
            // 使用默认对话
            this.activeDialogue = {
                npcId,
                text: '......',
                responses: [{ text: '再见', isEnd: true }]
            };
            return;
        }
        
        const startNode = tree.start();
        this.activeDialogue = {
            npcId,
            node: startNode,
            text: startNode.text,
            responses: tree.getAvailableResponses().map((r, i) => ({
                index: i,
                text: r.text
            }))
        };
    }
    
    selectResponse(responseIndex) {
        if (!this.activeDialogue?.node) return null;
        
        const tree = this.dialogueTrees[this.activeDialogue.npcId];
        if (!tree) return null;
        
        const nextNode = tree.selectResponse(responseIndex);
        
        if (nextNode?.isEnd) {
            this.endDialogue();
            return null;
        }
        
        if (nextNode?.action) {
            this.handleDialogueAction(nextNode.action);
            return null;
        }
        
        if (nextNode) {
            this.activeDialogue.node = nextNode;
            this.activeDialogue.text = nextNode.text;
            this.activeDialogue.responses = tree.getAvailableResponses().map((r, i) => ({
                index: i,
                text: r.text
            }));
        }
        
        return this.activeDialogue;
    }
    
    handleDialogueAction(action) {
        switch (action) {
            case 'accept_quest':
                this.game.questManager?.acceptQuest('forest_001');
                break;
            case 'join_guild':
                this.game.player?.joinGuild();
                break;
        }
        this.endDialogue();
    }
    
    endDialogue() {
        this.activeDialogue = null;
    }
    
    isActive() {
        return this.activeDialogue !== null;
    }
    
    getCurrentDialogue() {
        return this.activeDialogue;
    }
}

export { DialogueNode, DialogueTree, DialogueManager };
