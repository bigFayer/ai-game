/**
 * 符文之地 - 完整对话系统
 */

class DialogueNode {
    constructor(data) {
        this.id = data.id;
        this.text = data.text;
        this.responses = data.responses || [];
        this.condition = data.condition || null;
        this.onEnter = data.onEnter || null;
        this.onExit = data.onExit || null;
        this.portrait = data.portrait || null;
        this.speaker = data.speaker || null;
        this.background = data.background || null;
    }
    
    canEnter(game) {
        if (!this.condition) return true;
        return this.condition(game);
    }
}

class DialogueResponse {
    constructor(data) {
        this.text = data.text;
        this.next = data.next || null;
        this.action = data.action || null;
        this.condition = data.condition || null;
        this.goto = data.goto || null;
        this.end = data.end || false;
        this.icon = data.icon || null;
    }
    
    canSelect(game) {
        if (!this.condition) return true;
        return this.condition(game);
    }
}

class DialogueEngine {
    constructor(game) {
        this.game = game;
        this.dialogues = new Map();
        this.currentDialogue = null;
        this.currentNode = null;
        this.history = [];
        this.variables = {};
    }
    
    registerDialogue(id, nodes) {
        const dialogueNodes = {};
        for (const [nodeId, nodeData] of Object.entries(nodes)) {
            dialogueNodes[nodeId] = new DialogueNode({ id: nodeId, ...nodeData });
        }
        this.dialogues.set(id, dialogueNodes);
    }
    
    startDialogue(dialogueId, startNodeId = 'greeting') {
        const dialogue = this.dialogues.get(dialogueId);
        if (!dialogue) {
            console.warn(`[Dialogue] 未找到对话: ${dialogueId}`);
            return false;
        }
        
        const startNode = dialogue[startNodeId];
        if (!startNode) {
            console.warn(`[Dialogue] 未找到节点: ${startNodeId}`);
            return false;
        }
        
        this.currentDialogue = dialogue;
        this.currentNode = startNode;
        this.history = [];
        
        // 执行进入事件
        if (this.currentNode.onEnter) {
            this.currentNode.onEnter(this.game);
        }
        
        return true;
    }
    
    getCurrentText() {
        if (!this.currentNode) return '';
        return this.currentNode.text;
    }
    
    getCurrentResponses() {
        if (!this.currentNode) return [];
        
        return this.currentNode.responses
            .map(r => new DialogueResponse(r))
            .filter(r => r.canSelect(this.game));
    }
    
    selectResponse(responseIndex) {
        const responses = this.currentNode.responses;
        const response = responses[responseIndex];
        if (!response) return;
        
        // 记录历史
        this.history.push({
            node: this.currentNode.id,
            response: responseIndex
        });
        
        // 执行动作
        if (response.action) {
            this.executeAction(response.action);
        }
        
        // 结束对话
        if (response.end) {
            this.endDialogue();
            return;
        }
        
        // 跳转节点
        if (response.next) {
            this.goToNode(response.next);
        }
    }
    
    goToNode(nodeId) {
        const node = this.currentDialogue[nodeId];
        if (!node) return;
        
        // 检查条件
        if (!node.canEnter(this.game)) {
            console.warn(`[Dialogue] 节点条件不满足: ${nodeId}`);
            return;
        }
        
        // 执行退出事件
        if (this.currentNode.onExit) {
            this.currentNode.onExit(this.game);
        }
        
        this.currentNode = node;
        
        // 执行进入事件
        if (this.currentNode.onEnter) {
            this.currentNode.onEnter(this.game);
        }
    }
    
    executeAction(action) {
        switch (action) {
            case 'accept_forest_quest':
                this.game.questManager?.acceptQuest('forest_goblin_hunt');
                break;
            case 'accept_spider_quest':
                this.game.questManager?.acceptQuest('spider_queen');
                break;
            case 'accept_queen_quest':
                this.game.questManager?.acceptQuest('elf_queen');
                break;
            case 'accept_pharaoh_quest':
                this.game.questManager?.acceptQuest('pharaoh_treasure');
                break;
            case 'accept_fire_quest':
                this.game.questManager?.acceptQuest('fire_lord');
                break;
            case 'accept_void_quest':
                this.game.questManager?.acceptQuest('void_runes');
                break;
            case 'buy_fire_gem':
                if (this.game.player.gold >= 500) {
                    this.game.player.gold -= 500;
                    this.game.inventory.addItem('fire_gem', 1);
                    this.game.notificationManager.showItem('购买了火宝石！');
                }
                break;
        }
    }
    
    endDialogue() {
        if (this.currentNode?.onExit) {
            this.currentNode.onExit(this.game);
        }
        
        this.currentDialogue = null;
        this.currentNode = null;
    }
    
    isActive() {
        return this.currentNode !== null;
    }
    
    setVariable(key, value) {
        this.variables[key] = value;
    }
    
    getVariable(key, defaultValue = null) {
        return this.variables[key] !== undefined ? this.variables[key] : defaultValue;
    }
    
    clearVariables() {
        this.variables = {};
    }
}

class DialogueUI {
    constructor(dialogueEngine) {
        this.engine = dialogueEngine;
        this.game = dialogueEngine.game;
        this.ctx = dialogueEngine.game.ctx;
        this.selectedIndex = 0;
        this.textProgress = 0;
        this.textSpeed = 30; // 字符每秒
        this.isTyping = true;
        this.skipText = false;
    }
    
    update(dt) {
        if (this.isTyping) {
            const text = this.engine.getCurrentText();
            this.textProgress += dt * this.textSpeed;
            
            if (this.textProgress >= text.length) {
                this.textProgress = text.length;
                this.isTyping = false;
            }
        }
    }
    
    skipToEnd() {
        if (this.isTyping) {
            this.skipText = true;
            this.isTyping = false;
            this.textProgress = this.engine.getCurrentText().length;
        }
    }
    
    navigate(direction) {
        const responses = this.engine.getCurrentResponses();
        if (responses.length === 0) return;
        
        if (!this.isTyping) {
            this.selectedIndex += direction;
            if (this.selectedIndex < 0) this.selectedIndex = responses.length - 1;
            if (this.selectedIndex >= responses.length) this.selectedIndex = 0;
        }
    }
    
    confirm() {
        if (this.isTyping) {
            this.skipToEnd();
        } else {
            this.engine.selectResponse(this.selectedIndex);
            this.selectedIndex = 0;
            this.textProgress = 0;
            this.isTyping = true;
        }
    }
    
    render() {
        if (!this.engine.isActive()) return;
        
        const ctx = this.ctx;
        const width = this.game.width;
        const height = this.game.height;
        const boxHeight = 200;
        const boxY = height - boxHeight - 20;
        
        // 背景遮罩
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, width, height);
        
        // 对话框
        ctx.fillStyle = 'rgba(20, 20, 40, 0.95)';
        ctx.fillRect(20, boxY, width - 40, boxHeight);
        
        // 边框
        ctx.strokeStyle = '#4488ff';
        ctx.lineWidth = 3;
        ctx.strokeRect(20, boxY, width - 40, boxHeight);
        
        // 说话者
        const speaker = this.engine.currentNode?.speaker;
        if (speaker) {
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(speaker, 40, boxY + 25);
        }
        
        // 对话文字
        const text = this.engine.getCurrentText();
        const displayText = text.substring(0, Math.floor(this.textProgress));
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'left';
        
        // 自动换行
        const maxWidth = width - 80;
        const words = displayText.split(' ');
        let line = '';
        let y = boxY + 60;
        
        for (const word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && line !== '') {
                ctx.fillText(line, 40, y);
                line = word + ' ';
                y += 24;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, 40, y);
        
        // 继续提示
        if (!this.isTyping) {
            const responses = this.engine.getCurrentResponses();
            
            // 选项
            for (let i = 0; i < responses.length; i++) {
                const response = responses[i];
                const optionY = boxY + boxHeight - 30 - (responses.length - 1 - i) * 30;
                const isSelected = i === this.selectedIndex;
                
                ctx.fillStyle = isSelected ? '#44ff44' : '#aaaaaa';
                ctx.font = isSelected ? 'bold 14px sans-serif' : '14px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(`> ${response.text}`, 60, optionY);
            }
        } else {
            // 点击继续提示
            ctx.fillStyle = '#888888';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText('点击继续...', width - 40, boxY + boxHeight - 20);
        }
    }
}

export { DialogueEngine, DialogueUI };
