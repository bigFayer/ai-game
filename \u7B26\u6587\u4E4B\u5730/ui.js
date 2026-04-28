/**
 * 符文之地 - UI系统
 */

class UIManager {
    constructor(game) {
        this.game = game;
        this.components = [];
    }
    
    render(ctx) {
        switch (this.game.state) {
            case 'INVENTORY':
                this.renderInventory(ctx);
                break;
            case 'SHOP':
                this.renderShop(ctx);
                break;
            case 'QUEST_LOG':
                this.renderQuestLog(ctx);
                break;
        }
    }
    
    renderInventory(ctx) {
        // 背包UI
    }
    
    renderShop(ctx) {
        // 商店UI
    }
    
    renderQuestLog(ctx) {
        // 任务日志UI
    }
}

export { UIManager };
