/**
 * 符文之地 - UI组件库
 */

class UIComponent {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.visible = true;
        this.enabled = true;
        this.children = [];
        this.parent = null;
        this.style = {};
        this.zIndex = 0;
    }
    
    add(child) {
        child.parent = this;
        this.children.push(child);
        return child;
    }
    
    remove(child) {
        const index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
            child.parent = null;
        }
    }
    
    update(dt) {}
    
    render(ctx) {}
    
    contains(x, y) {
        return x >= this.x && x < this.x + this.width &&
               y >= this.y && y < this.y + this.height;
    }
    
    setStyle(styles) {
        Object.assign(this.style, styles);
    }
}

class Button extends UIComponent {
    constructor(x, y, width, height, text) {
        super(x, y, width, height);
        this.text = text;
        this.isHovered = false;
        this.isPressed = false;
        this.onClick = null;
        this.backgroundColor = '#3a3a6a';
        this.hoverColor = '#4a4a8a';
        this.pressedColor = '#2a2a5a';
        this.textColor = '#ffffff';
        this.borderColor = '#5a5a9a';
        this.borderWidth = 2;
    }
    
    onMouseMove(x, y) {
        this.isHovered = this.contains(x, y);
    }
    
    onMouseDown(x, y) {
        if (this.contains(x, y)) {
            this.isPressed = true;
        }
    }
    
    onMouseUp(x, y) {
        if (this.isPressed && this.contains(x, y) && this.onClick) {
            this.onClick();
        }
        this.isPressed = false;
    }
    
    render(ctx) {
        if (!this.visible) return;
        
        // 背景
        let bgColor = this.backgroundColor;
        if (this.isPressed) bgColor = this.pressedColor;
        else if (this.isHovered) bgColor = this.hoverColor;
        
        ctx.fillStyle = bgColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 边框
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // 文字
        ctx.fillStyle = this.textColor;
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }
}

class Label extends UIComponent {
    constructor(x, y, text) {
        super(x, y, 0, 0);
        this.text = text;
        this.font = '16px sans-serif';
        this.color = '#ffffff';
        this.textAlign = 'left';
        this.textBaseline = 'top';
    }
    
    render(ctx) {
        if (!this.visible) return;
        
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.fillText(this.text, this.x, this.y);
    }
}

class ProgressBar extends UIComponent {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.value = 0;
        this.maxValue = 100;
        this.backgroundColor = '#333333';
        this.fillColor = '#44aa44';
        this.borderColor = '#555555';
        this.showText = true;
        this.textColor = '#ffffff';
    }
    
    setValue(value) {
        this.value = Math.max(0, Math.min(value, this.maxValue));
    }
    
    setMaxValue(maxValue) {
        this.maxValue = maxValue;
    }
    
    render(ctx) {
        if (!this.visible) return;
        
        // 背景
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 填充
        const progress = this.value / this.maxValue;
        const fillWidth = this.width * progress;
        
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(this.x, this.y, fillWidth, this.height);
        
        // 边框
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // 文字
        if (this.showText) {
            const percent = Math.floor(progress * 100);
            ctx.fillStyle = this.textColor;
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${this.value}/${this.maxValue}`, this.x + this.width / 2, this.y + this.height / 2);
        }
    }
}

class HealthBar extends ProgressBar {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.fillColor = '#ff4444';
        this.lowThreshold = 0.3;
        this.criticalColor = '#ff0000';
    }
    
    setHealth(hp, maxHp) {
        this.setValue(hp);
        this.setMaxValue(maxHp);
        
        if (maxHp > 0 && hp / maxHp <= this.lowThreshold) {
            this.fillColor = this.criticalColor;
        } else {
            this.fillColor = '#ff4444';
        }
    }
    
    render(ctx) {
        if (!this.visible) return;
        
        // 背景
        ctx.fillStyle = '#333333';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 填充
        const progress = this.value / this.maxValue;
        const fillWidth = this.width * progress;
        
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(this.x, this.y, fillWidth, this.height);
        
        // 边框
        ctx.strokeStyle = '#555555';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // 文字
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${this.value}/${this.maxValue}`, this.x + this.width / 2, this.y + this.height / 2);
    }
}

class Panel extends UIComponent {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.backgroundColor = 'rgba(20, 20, 40, 0.9)';
        this.borderColor = '#4488ff';
        this.borderWidth = 2;
        this.padding = 10;
    }
    
    render(ctx) {
        if (!this.visible) return;
        
        // 背景
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 边框
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // 子组件
        for (const child of this.children) {
            child.render(ctx);
        }
    }
}

class InventorySlot extends UIComponent {
    constructor(x, y, size) {
        super(x, y, size, size);
        this.item = null;
        this.quantity = 0;
        this.isSelected = false;
        this.isHovered = false;
        this.backgroundColor = '#2a2a4a';
        this.borderColor = '#4a4a7a';
        this.selectedColor = '#4488ff';
        this.hoverColor = '#3a3a6a';
    }
    
    setItem(item, quantity = 0) {
        this.item = item;
        this.quantity = quantity;
    }
    
    clear() {
        this.item = null;
        this.quantity = 0;
    }
    
    onMouseEnter() {
        this.isHovered = true;
    }
    
    onMouseLeave() {
        this.isHovered = false;
    }
    
    render(ctx) {
        if (!this.visible) return;
        
        // 背景
        let bgColor = this.backgroundColor;
        if (this.isSelected) bgColor = this.selectedColor;
        else if (this.isHovered) bgColor = this.hoverColor;
        
        ctx.fillStyle = bgColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 边框
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // 物品图标
        if (this.item) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.item.icon || '?', this.x + this.width / 2, this.y + this.height / 2);
            
            // 数量
            if (this.quantity > 1) {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 10px sans-serif';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                ctx.fillText(this.quantity.toString(), this.x + this.width - 3, this.y + this.height - 3);
            }
        }
    }
}

class UIManager {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;
        this.width = game.width;
        this.height = game.height;
        
        this.components = [];
        this.focusedComponent = null;
        this.hoveredComponent = null;
        this.draggedComponent = null;
        
        this.setupInput();
    }
    
    setupInput() {
        this.game.canvas.addEventListener('mousemove', (e) => {
            const rect = this.game.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.onMouseMove(x, y);
        });
        
        this.game.canvas.addEventListener('mousedown', (e) => {
            const rect = this.game.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.onMouseDown(x, y);
        });
        
        this.game.canvas.addEventListener('mouseup', (e) => {
            const rect = this.game.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.onMouseUp(x, y);
        });
    }
    
    add(component) {
        this.components.push(component);
        return component;
    }
    
    remove(component) {
        const index = this.components.indexOf(component);
        if (index >= 0) {
            this.components.splice(index, 1);
        }
    }
    
    onMouseMove(x, y) {
        for (const component of this.components) {
            if (component.contains && component.contains(x, y)) {
                if (component.onMouseMove) {
                    component.onMouseMove(x, y);
                }
                if (component.onMouseEnter) {
                    component.onMouseEnter();
                }
                this.hoveredComponent = component;
            } else {
                if (component.onMouseLeave) {
                    component.onMouseLeave();
                }
            }
        }
    }
    
    onMouseDown(x, y) {
        for (const component of this.components) {
            if (component.contains && component.contains(x, y)) {
                this.focusedComponent = component;
                if (component.onMouseDown) {
                    component.onMouseDown(x, y);
                }
            }
        }
    }
    
    onMouseUp(x, y) {
        for (const component of this.components) {
            if (component.onMouseUp) {
                component.onMouseUp(x, y);
            }
        }
    }
    
    update(dt) {
        for (const component of this.components) {
            if (component.update) {
                component.update(dt);
            }
        }
    }
    
    render() {
        for (const component of this.components) {
            if (component.visible) {
                component.render(this.ctx);
            }
        }
    }
}

export { UIComponent, Button, Label, ProgressBar, HealthBar, Panel, InventorySlot, UIManager };
