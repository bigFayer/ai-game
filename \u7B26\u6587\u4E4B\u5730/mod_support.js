/**
 * 符文之地 - MOD支持系统
 */

class Mod {
    constructor(id, name, version, author) {
        this.id = id;
        this.name = name;
        this.version = version;
        this.author = author;
        this.enabled = false;
        this.initialized = false;
        this.dependencies = [];
        this.conflicts = [];
        this.files = new Map();
        this.patches = [];
        this.hooks = {};
    }
    
    addDependency(modId, version = '*') {
        this.dependencies.push({ id: modId, version });
    }
    
    addConflict(modId) {
        this.conflicts.push(modId);
    }
    
    registerFile(path, content) {
        this.files.set(path, content);
    }
    
    addPatch(target, patch) {
        this.patches.push({ target, patch });
    }
    
    registerHook(hookName, callback) {
        if (!this.hooks[hookName]) {
            this.hooks[hookName] = [];
        }
        this.hooks[hookName].push(callback);
    }
    
    enable() {
        this.enabled = true;
        console.log(`[Mod] 启用MOD: ${this.name}`);
    }
    
    disable() {
        this.enabled = false;
        console.log(`[Mod] 禁用MOD: ${this.name}`);
    }
}

class ModManager {
    constructor(game) {
        this.game = game;
        this.mods = new Map();
        this.loadOrder = [];
        this.hookCache = new Map();
        
        this.modDirectory = './mods/';
    }
    
    registerMod(mod) {
        this.mods.set(mod.id, mod);
        console.log(`[ModManager] 注册MOD: ${mod.name} v${mod.version}`);
    }
    
    loadMod(modId) {
        const mod = this.mods.get(modId);
        if (!mod) return false;
        
        // 检查依赖
        for (const dep of mod.dependencies) {
            if (!this.mods.has(dep.id)) {
                console.error(`[ModManager] 缺少依赖: ${dep.id}`);
                return false;
            }
        }
        
        // 检查冲突
        for (const conflictId of mod.conflicts) {
            if (this.mods.has(conflictId)) {
                console.error(`[ModManager] MOD冲突: ${mod.name} 与 ${conflictId}`);
                return false;
            }
        }
        
        // 初始化
        if (mod.initialize) {
            mod.initialize(this.game);
        }
        
        mod.initialized = true;
        this.loadOrder.push(mod);
        
        // 注册钩子
        this.rebuildHookCache();
        
        console.log(`[ModManager] 加载MOD: ${mod.name}`);
        return true;
    }
    
    unloadMod(modId) {
        const mod = this.mods.get(modId);
        if (!mod) return;
        
        mod.disable();
        mod.initialized = false;
        
        const index = this.loadOrder.indexOf(mod);
        if (index >= 0) {
            this.loadOrder.splice(index, 1);
        }
        
        this.rebuildHookCache();
        
        console.log(`[ModManager] 卸载MOD: ${mod.name}`);
    }
    
    enableMod(modId) {
        const mod = this.mods.get(modId);
        if (!mod) return;
        
        mod.enable();
        this.rebuildHookCache();
    }
    
    disableMod(modId) {
        const mod = this.mods.get(modId);
        if (!mod) return;
        
        mod.disable();
        this.rebuildHookCache();
    }
    
    rebuildHookCache() {
        this.hookCache.clear();
        
        for (const mod of this.loadOrder) {
            if (!mod.enabled) continue;
            
            for (const [hookName, callbacks] of Object.entries(mod.hooks)) {
                if (!this.hookCache.has(hookName)) {
                    this.hookCache.set(hookName, []);
                }
                
                this.hookCache.get(hookName).push(...callbacks);
            }
        }
    }
    
    callHook(hookName, ...args) {
        const hooks = this.hookCache.get(hookName);
        if (!hooks) return;
        
        for (const callback of hooks) {
            try {
                callback(...args);
            } catch (e) {
                console.error(`[ModManager] 钩子执行失败: ${hookName}`, e);
            }
        }
    }
    
    getEnabledMods() {
        return Array.from(this.mods.values()).filter(m => m.enabled);
    }
    
    getModInfo(modId) {
        const mod = this.mods.get(modId);
        if (!mod) return null;
        
        return {
            id: mod.id,
            name: mod.name,
            version: mod.version,
            author: mod.author,
            enabled: mod.enabled,
            initialized: mod.initialized,
            dependencies: mod.dependencies,
            conflicts: mod.conflicts
        };
    }
}

// 示例MOD
function createExampleMod() {
    const mod = new Mod(
        'example_mod',
        '示例MOD',
        '1.0.0',
        'Rune Land Team'
    );
    
    mod.initialize = (game) => {
        console.log('[ExampleMod] 初始化中...');
    };
    
    mod.registerHook('onPlayerAttack', (attacker, target) => {
        console.log('[ExampleMod] 玩家攻击触发');
    });
    
    mod.registerHook('onEnemyDeath', (enemy, killer) => {
        console.log('[ExampleMod] 敌人死亡:', enemy.name);
    });
    
    return mod;
}

export { Mod, ModManager };
