/**
 * 符文之地 - 输入处理系统
 */

class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.keysPrevious = {};
        this.mouse = {
            x: 0,
            y: 0,
            buttons: [false, false, false],
            justPressed: [false, false, false],
            justReleased: [false, false, false]
        };
        this.gamepad = null;
        this.touch = {
            active: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            tap: false,
            swipe: null
        };
        
        this.setupKeyboard();
        this.setupMouse();
        this.setupGamepad();
        this.setupTouch();
    }
    
    setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // 阻止默认行为
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // 失焦时清除所有按键
        window.addEventListener('blur', () => {
            this.keys = {};
        });
    }
    
    setupMouse() {
        const canvas = this.game.canvas;
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const button = e.button;
            if (button >= 0 && button < 3) {
                this.mouse.buttons[button] = true;
                this.mouse.justPressed[button] = true;
            }
        });
        
        canvas.addEventListener('mouseup', (e) => {
            const button = e.button;
            if (button >= 0 && button < 3) {
                this.mouse.buttons[button] = false;
                this.mouse.justReleased[button] = true;
            }
        });
        
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    setupGamepad() {
        window.addEventListener('gamepadconnected', (e) => {
            console.log('[Input] 手柄已连接:', e.gamepad.id);
            this.gamepad = e.gamepad;
        });
        
        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('[Input] 手柄已断开');
            this.gamepad = null;
        });
    }
    
    setupTouch() {
        const canvas = this.game.canvas;
        
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            
            this.touch.active = true;
            this.touch.startX = touch.clientX - rect.left;
            this.touch.startY = touch.clientY - rect.top;
            this.touch.currentX = this.touch.startX;
            this.touch.currentY = this.touch.startY;
            this.touch.tap = true;
            this.touch.swipe = null;
        });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            
            this.touch.currentX = touch.clientX - rect.left;
            this.touch.currentY = touch.clientY - rect.top;
            
            const dx = this.touch.currentX - this.touch.startX;
            const dy = this.touch.currentY - this.touch.startY;
            
            if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
                this.touch.tap = false;
                
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.touch.swipe = dx > 0 ? 'right' : 'left';
                } else {
                    this.touch.swipe = dy > 0 ? 'down' : 'up';
                }
            }
        });
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touch.active = false;
        });
    }
    
    update() {
        // 保存上一帧状态
        this.keysPrevious = { ...this.keys };
        
        // 更新鼠标状态
        this.mouse.justPressed = [false, false, false];
        this.mouse.justReleased = [false, false, false];
        
        // 更新游戏手柄
        if (this.gamepad) {
            const gamepads = navigator.getGamepads();
            this.gamepad = gamepads[0];
        }
    }
    
    isKeyDown(code) {
        return this.keys[code] === true;
    }
    
    isKeyPressed(code) {
        return this.keys[code] === true && this.keysPrevious[code] !== true;
    }
    
    isKeyReleased(code) {
        return this.keys[code] === false && this.keysPrevious[code] === true;
    }
    
    isMouseDown(button = 0) {
        return this.mouse.buttons[button] === true;
    }
    
    isMousePressed(button = 0) {
        return this.mouse.justPressed[button] === true;
    }
    
    isMouseReleased(button = 0) {
        return this.mouse.justReleased[button] === true;
    }
    
    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }
    
    isGamepadButtonDown(button) {
        if (!this.gamepad) return false;
        return this.gamepad.buttons[button]?.pressed;
    }
    
    isGamepadButtonPressed(button) {
        // 需要跟踪上一帧状态
        return false;
    }
    
    getMovement() {
        let dx = 0;
        let dy = 0;
        
        if (this.isKeyDown('KeyW') || this.isKeyDown('ArrowUp')) dy -= 1;
        if (this.isKeyDown('KeyS') || this.isKeyDown('ArrowDown')) dy += 1;
        if (this.isKeyDown('KeyA') || this.isKeyDown('ArrowLeft')) dx -= 1;
        if (this.isKeyDown('KeyD') || this.isKeyDown('ArrowRight')) dx += 1;
        
        // 游戏手柄
        if (this.gamepad) {
            const deadzone = 0.2;
            const lx = this.gamepad.axes[0];
            const ly = this.gamepad.axes[1];
            
            if (Math.abs(lx) > deadzone) dx = lx;
            if (Math.abs(ly) > deadzone) dy = ly;
        }
        
        // 触摸
        if (this.touch.active && this.touch.swipe) {
            switch (this.touch.swipe) {
                case 'up': dy = -1; break;
                case 'down': dy = 1; break;
                case 'left': dx = -1; break;
                case 'right': dx = 1; break;
            }
        }
        
        // 标准化
        if (dx !== 0 || dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;
        }
        
        return { dx, dy };
    }
}

class KeyBindings {
    constructor() {
        this.bindings = {
            'moveUp': ['KeyW', 'ArrowUp'],
            'moveDown': ['KeyS', 'ArrowDown'],
            'moveLeft': ['KeyA', 'ArrowLeft'],
            'moveRight': ['KeyD', 'ArrowRight'],
            'interact': ['Space', 'Enter'],
            'attack': ['KeyJ', 'KeyZ'],
            'skill1': ['Digit1'],
            'skill2': ['Digit2'],
            'skill3': ['Digit3'],
            'skill4': ['Digit4'],
            'inventory': ['KeyI'],
            'equipment': ['KeyE'],
            'skills': ['KeyK'],
            'quests': ['KeyQ'],
            'settings': ['Escape', 'KeyO'],
            'useItem1': ['Digit7'],
            'useItem2': ['Digit8'],
            'useItem3': ['Digit9'],
            'useItem4': ['Digit0'],
            'healthPotion': ['KeyH'],
            'manaPotion': ['KeyM'],
            'map': ['KeyM'],
            'menu': ['Escape']
        };
    }
    
    isAction(action) {
        const codes = this.bindings[action];
        if (!codes) return false;
        return codes.some(code => window.keyboard.isKeyDown(code));
    }
}

export { InputHandler, KeyBindings };
