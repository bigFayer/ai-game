/**
 * 符文之地 - 完整游戏配置
 */

const GAME_CONFIG_FULL = {
    // ===== 版本信息 =====
    version: '1.0.0',
    build: '20260428',
    name: '符文之地 (Rune Land)',
    subtitle: 'Roguelike ARPG',
    
    // ===== 游戏设置 =====
    settings: {
        // 画质
        graphics: {
            resolution: { width: 800, height: 600 },
            fullscreen: false,
            vsync: true,
            antiAliasing: true,
            particleDensity: 1.0,
            shadowQuality: 'medium', // off, low, medium, high
            postProcessing: true
        },
        
        // 音效
        audio: {
            masterVolume: 1.0,
            musicVolume: 0.5,
            sfxVolume: 0.7,
            ambientVolume: 0.3,
            monoAudio: false
        },
        
        // 游戏性
        gameplay: {
            difficulty: 'NORMAL',
            autoSave: true,
            autoSaveInterval: 300,
            showDamageNumbers: true,
            showCombatText: true,
            battleSpeed: 1.0,
            skipAnimations: false
        },
        
        // 控制
        controls: {
            invertY: false,
            mouseSensitivity: 1.0,
            touchControls: false,
            vibration: true
        },
        
        // 辅助功能
        accessibility: {
            colorblindMode: false,
            largeText: false,
            highContrast: false,
            screenReader: false
        }
    },
    
    // ===== 数值配置 =====
    balance: {
        // 玩家
        player: {
            baseHp: 100,
            baseMp: 50,
            baseAtk: 10,
            baseDef: 5,
            baseSpd: 10,
            baseLuk: 5,
            baseCritRate: 5,
            baseCritDamage: 150,
            baseEvasion: 5,
            
            hpRegen: 1,
            mpRegen: 0.5,
            
            maxLevel: 99,
            expCurve: [
                0, 100, 200, 350, 550, 800, 1100, 1500, 2000, 2600,
                3300, 4100, 5000, 6000, 7100, 8300, 9600, 11000, 12500, 14100,
                15800, 17600, 19500, 21500, 23600, 25800, 28100, 30500, 33000, 35600,
                38300, 41100, 44000, 47000, 50100, 53300, 56600, 60000, 63500, 67100,
                70800, 74600, 78500, 82500, 86600, 90800, 95100, 99500, 104000, 108600,
                113300, 118100, 123000, 128000, 133100, 138300, 143600, 149000, 154500, 160100,
                165800, 171600, 177500, 183500, 189600, 195800, 202100, 208500, 215000, 221600,
                228300, 235100, 242000, 249000, 256100, 263300, 270600, 278000, 285500, 293100,
                300800, 308600, 316500, 324500, 332600, 340800, 349100, 357500, 366000, 374600,
                383300, 392100, 401000, 410000, 419100, 428300, 437600, 447000, 456500, 466100
            ]
        },
        
        // 战斗
        combat: {
            attackSpeed: 1.0,
            skillSpeedMult: 1.5,
            
            dodgeBaseChance: 5,
            critBaseChance: 5,
            critBaseDamage: 150,
            
            damageReductionCap: 0.75,
            dodgeCap: 75,
            critCap: 75,
            
            comboWindow: 3,
            comboDamageBonus: 0.1,
            maxCombo: 10
        },
        
        // 地下城
        dungeon: {
            totalFloors: 50,
            
            biomeFloors: {
                forest: [1, 10],
                desert: [11, 20],
                ice: [21, 30],
                fire: [31, 40],
                void: [41, 50]
            },
            
            bossFloors: [10, 20, 30, 40, 50],
            
            enemySpawnRate: 0.3,
            chestSpawnRate: 0.15,
            shopSpawnRate: 0.1,
            trapSpawnRate: 0.2,
            
            enemyScaling: 0.1,
            goldScaling: 0.08,
            dropRateScaling: 0.02
        }
    }
};

export { GAME_CONFIG_FULL };
