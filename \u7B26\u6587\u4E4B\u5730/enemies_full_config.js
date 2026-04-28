/**
 * 符文之地 - 75种敌人完整配置
 */

const ENEMY_DATABASE = {
    // ========== 森林地区 (1-10层) ==========
    forest_goblin_1: {
        id: 'forest_goblin_1',
        name: '哥布林',
        level: 1, hp: 30, atk: 8, def: 3, spd: 9, luk: 3,
        exp: 8, gold: 5,
        behavior: 'balanced',
        biome: 'forest',
        abilities: [],
        drops: [{ id: 'herb', chance: 0.2 }]
    },
    forest_goblin_2: {
        id: 'forest_goblin_2',
        name: '哥布林战士',
        level: 2, hp: 40, atk: 12, def: 5, spd: 10, luk: 4,
        exp: 12, gold: 8,
        behavior: 'aggressive',
        biome: 'forest',
        abilities: ['strike'],
        drops: [{ id: 'leather', chance: 0.2 }]
    },
    forest_goblin_3: {
        id: 'forest_goblin_3',
        name: '哥布林萨满',
        level: 3, hp: 35, atk: 10, def: 3, spd: 8, luk: 6,
        exp: 15, gold: 12,
        behavior: 'caster',
        biome: 'forest',
        abilities: ['heal'],
        drops: [{ id: 'mana_herb', chance: 0.15 }]
    },
    forest_wolf_1: {
        id: 'forest_wolf_1',
        name: '森林狼',
        level: 2, hp: 35, atk: 10, def: 4, spd: 12, luk: 5,
        exp: 10, gold: 6,
        behavior: 'aggressive',
        biome: 'forest',
        abilities: ['bite'],
        drops: [{ id: 'wolf_pelt', chance: 0.25 }]
    },
    forest_wolf_2: {
        id: 'forest_wolf_2',
        name: '森林狼王',
        level: 4, hp: 80, atk: 18, def: 8, spd: 14, luk: 8,
        exp: 30, gold: 20,
        behavior: 'aggressive',
        biome: 'forest',
        abilities: ['bite', 'howl'],
        drops: [{ id: 'wolf_pelt', chance: 0.5 }]
    },
    forest_skeleton_1: {
        id: 'forest_skeleton_1',
        name: '骷髅',
        level: 3, hp: 50, atk: 12, def: 6, spd: 7, luk: 5,
        exp: 15, gold: 10,
        behavior: 'balanced',
        biome: 'forest',
        abilities: ['strike'],
        drops: [{ id: 'bone', chance: 0.3 }]
    },
    forest_skeleton_2: {
        id: 'forest_skeleton_2',
        name: '骷髅战士',
        level: 5, hp: 70, atk: 16, def: 10, spd: 8, luk: 6,
        exp: 25, gold: 18,
        behavior: 'defensive',
        biome: 'forest',
        abilities: ['strike', 'shield_bash'],
        drops: [{ id: 'bone', chance: 0.4 }]
    },
    forest_skeleton_archer: {
        id: 'forest_skeleton_archer',
        name: '骷髅弓箭手',
        level: 4, hp: 45, atk: 14, def: 5, spd: 10, luk: 8,
        exp: 20, gold: 15,
        behavior: 'evasive',
        biome: 'forest',
        abilities: ['shoot'],
        drops: [{ id: 'bone', chance: 0.3 }]
    },
    forest_spider_1: {
        id: 'forest_spider_1',
        name: '毒蜘蛛',
        level: 4, hp: 40, atk: 14, def: 4, spd: 11, luk: 7,
        exp: 18, gold: 15,
        behavior: 'aggressive',
        biome: 'forest',
        abilities: ['poison_bite'],
        element: 'poison',
        drops: [{ id: 'poison_gland', chance: 0.2 }]
    },
    forest_spider_queen: {
        id: 'forest_spider_queen',
        name: '蜘蛛女王',
        level: 8, hp: 200, atk: 25, def: 12, spd: 8, luk: 10,
        exp: 80, gold: 60,
        behavior: 'berserker',
        biome: 'forest',
        abilities: ['poison_bite', 'web_shot', 'summon_spiders'],
        element: 'poison',
        isElite: true,
        drops: [{ id: 'spider_silk', chance: 0.8 }]
    },
    forest_bear: {
        id: 'forest_bear',
        name: '森林熊',
        level: 6, hp: 100, atk: 18, def: 10, spd: 6, luk: 5,
        exp: 30, gold: 25,
        behavior: 'aggressive',
        biome: 'forest',
        abilities: ['strike', 'maul'],
        drops: [{ id: 'bear_claw', chance: 0.3 }]
    },
    forest_elf_ghost: {
        id: 'forest_elf_ghost',
        name: '精灵亡魂',
        level: 7, hp: 80, atk: 20, def: 8, spd: 12, luk: 12,
        exp: 40, gold: 35,
        behavior: 'caster',
        biome: 'forest',
        abilities: ['magic_arrow', 'phase'],
        element: 'void',
        drops: [{ id: 'elf_dust', chance: 0.4 }]
    },
    
    // ========== 沙漠地区 (11-20层) ==========
    desert_scorpion_1: {
        id: 'desert_scorpion_1',
        name: '沙漠蝎子',
        level: 11, hp: 80, atk: 20, def: 8, spd: 14, luk: 8,
        exp: 40, gold: 35,
        behavior: 'aggressive',
        biome: 'desert',
        abilities: ['sting'],
        element: 'poison',
        drops: [{ id: 'poison_gland', chance: 0.3 }]
    },
    desert_scorpion_2: {
        id: 'desert_scorpion_2',
        name: '剧毒蝎子',
        level: 14, hp: 120, atk: 28, def: 12, spd: 16, luk: 10,
        exp: 60, gold: 50,
        behavior: 'aggressive',
        biome: 'desert',
        abilities: ['sting', 'poison_cloud'],
        element: 'poison',
        drops: [{ id: 'poison_gland', chance: 0.5 }]
    },
    desert_mummy_1: {
        id: 'desert_mummy_1',
        name: '木乃伊',
        level: 13, hp: 120, atk: 22, def: 15, spd: 5, luk: 8,
        exp: 50, gold: 40,
        behavior: 'defensive',
        biome: 'desert',
        abilities: ['strike', 'curse'],
        element: 'void',
        drops: [{ id: 'ancient_bandage', chance: 0.25 }]
    },
    desert_mummy_2: {
        id: 'desert_mummy_2',
        name: '木乃伊祭司',
        level: 16, hp: 150, atk: 26, def: 18, spd: 4, luk: 10,
        exp: 70, gold: 60,
        behavior: 'healer',
        biome: 'desert',
        abilities: ['strike', 'heal', 'curse'],
        element: 'void',
        drops: [{ id: 'ancient_tome', chance: 0.3 }]
    },
    desert_sandworm_1: {
        id: 'desert_sandworm_1',
        name: '沙虫',
        level: 15, hp: 90, atk: 28, def: 6, spd: 10, luk: 7,
        exp: 60, gold: 50,
        behavior: 'aggressive',
        biome: 'desert',
        abilities: ['burrow', 'sandstorm'],
        drops: [{ id: 'sandworm_tooth', chance: 0.3 }]
    },
    desert_sandworm_2: {
        id: 'desert_sandworm_2',
        name: '巨型沙虫',
        level: 18, hp: 180, atk: 35, def: 10, spd: 8, luk: 8,
        exp: 90, gold: 80,
        behavior: 'berserker',
        biome: 'desert',
        abilities: ['burrow', 'sandstorm', 'engulf'],
        drops: [{ id: 'sandworm_tooth', chance: 0.5 }]
    },
    desert_cobra: {
        id: 'desert_cobra',
        name: '沙漠眼镜蛇',
        level: 14, hp: 70, atk: 25, def: 5, spd: 15, luk: 12,
        exp: 55, gold: 45,
        behavior: 'evasive',
        biome: 'desert',
        abilities: ['venom_bite', 'spit_poison'],
        element: 'poison',
        drops: [{ id: 'poison_gland', chance: 0.4 }]
    },
    desert_pharaoh_guard: {
        id: 'desert_pharaoh_guard',
        name: '法老守卫',
        level: 16, hp: 140, atk: 30, def: 20, spd: 8, luk: 10,
        exp: 70, gold: 60,
        behavior: 'balanced',
        biome: 'desert',
        abilities: ['strike', 'shield_bash', 'curse'],
        element: 'holy',
        drops: [{ id: 'gold_coin', chance: 0.6 }]
    },
    desert_scarab_swarm: {
        id: 'desert_scarab_swarm',
        name: '圣甲虫群',
        level: 12, hp: 60, atk: 18, def: 4, spd: 16, luk: 10,
        exp: 45, gold: 30,
        behavior: 'aggressive',
        biome: 'desert',
        abilities: ['swarm_attack'],
        drops: [{ id: 'scarab_shell', chance: 0.25 }]
    },
    
    // ========== 冰霜地区 (21-30层) ==========
    ice_golem_1: {
        id: 'ice_golem_1',
        name: '冰霜傀儡',
        level: 22, hp: 180, atk: 25, def: 20, spd: 4, luk: 5,
        exp: 80, gold: 60,
        behavior: 'defensive',
        biome: 'ice',
        abilities: ['strike', 'freeze_touch'],
        element: 'ice',
        weakness: 'fire',
        drops: [{ id: 'ice_crystal', chance: 0.3 }]
    },
    ice_golem_2: {
        id: 'ice_golem_2',
        name: '强化冰霜傀儡',
        level: 25, hp: 250, atk: 32, def: 28, spd: 3, luk: 6,
        exp: 100, gold: 80,
        behavior: 'defensive',
        biome: 'ice',
        abilities: ['strike', 'freeze_touch', 'ice_bolt'],
        element: 'ice',
        weakness: 'fire',
        drops: [{ id: 'ice_crystal', chance: 0.4 }]
    },
    ice_wraith_1: {
        id: 'ice_wraith_1',
        name: '冰霜幽魂',
        level: 25, hp: 100, atk: 30, def: 8, spd: 18, luk: 15,
        exp: 90, gold: 70,
        behavior: 'aggressive',
        biome: 'ice',
        abilities: ['ice_bolt', 'phase', 'chilling_aura'],
        element: 'ice',
        weakness: 'fire',
        drops: [{ id: 'wraith_essence', chance: 0.35 }]
    },
    ice_wraith_2: {
        id: 'ice_wraith_2',
        name: '冰霜怨灵',
        level: 28, hp: 130, atk: 35, def: 10, spd: 20, luk: 18,
        exp: 120, gold: 100,
        behavior: 'caster',
        biome: 'ice',
        abilities: ['ice_bolt', 'frost_nova', 'phase', 'chilling_aura'],
        element: 'ice',
        weakness: 'fire',
        drops: [{ id: 'wraith_essence', chance: 0.5 }]
    },
    ice_elemental: {
        id: 'ice_elemental',
        name: '冰元素',
        level: 24, hp: 110, atk: 28, def: 12, spd: 12, luk: 10,
        exp: 85, gold: 65,
        behavior: 'balanced',
        biome: 'ice',
        abilities: ['ice_bolt', 'frost_nova', 'ice_shield'],
        element: 'ice',
        weakness: 'fire',
        drops: [{ id: 'elemental_core', chance: 0.3 }]
    },
    ice_giant: {
        id: 'ice_giant',
        name: '冰霜巨人',
        level: 27, hp: 220, atk: 32, def: 25, spd: 3, luk: 8,
        exp: 100, gold: 80,
        behavior: 'defensive',
        biome: 'ice',
        abilities: ['strike', 'ground_slam', 'freeze_aura'],
        element: 'ice',
        weakness: 'fire',
        drops: [{ id: 'giant_heart', chance: 0.4 }]
    },
    frost_wyrm: {
        id: 'frost_wyrm',
        name: '霜翼龙',
        level: 30, hp: 300, atk: 40, def: 18, spd: 14, luk: 12,
        exp: 150, gold: 120,
        behavior: 'berserker',
        biome: 'ice',
        abilities: ['frost_breath', 'wing_attack', 'fly'],
        element: 'ice',
        weakness: 'fire',
        isElite: true,
        drops: [{ id: 'dragon_scale', chance: 0.6 }]
    },
    
    // ========== 火焰地区 (31-40层) ==========
    fire_imp_1: {
        id: 'fire_imp_1',
        name: '火焰小鬼',
        level: 32, hp: 110, atk: 28, def: 10, spd: 15, luk: 10,
        exp: 95, gold: 75,
        behavior: 'aggressive',
        biome: 'fire',
        abilities: ['fireball', 'ember_shower'],
        element: 'fire',
        weakness: 'ice',
        drops: [{ id: 'fire_essence', chance: 0.25 }]
    },
    fire_imp_2: {
        id: 'fire_imp_2',
        name: '火焰狂魔',
        level: 35, hp: 150, atk: 35, def: 14, spd: 16, luk: 12,
        exp: 120, gold: 100,
        behavior: 'aggressive',
        biome: 'fire',
        abilities: ['fireball', 'flame_whip', 'berserker'],
        element: 'fire',
        weakness: 'ice',
        drops: [{ id: 'fire_essence', chance: 0.35 }]
    },
    fire_drake_1: {
        id: 'fire_drake_1',
        name: '火龙',
        level: 35, hp: 200, atk: 35, def: 15, spd: 12, luk: 10,
        exp: 120, gold: 100,
        behavior: 'balanced',
        biome: 'fire',
        abilities: ['fire_breath', 'claw_attack', 'tail_sweep'],
        element: 'fire',
        weakness: 'ice',
        drops: [{ id: 'dragon_tooth', chance: 0.4 }]
    },
    fire_drake_2: {
        id: 'fire_drake_2',
        name: '上古火龙',
        level: 38, hp: 350, atk: 45, def: 22, spd: 10, luk: 12,
        exp: 180, gold: 150,
        behavior: 'berserker',
        biome: 'fire',
        abilities: ['infernal_breath', 'claw_attack', 'tail_sweep', 'fire_shield'],
        element: 'fire',
        weakness: 'ice',
        isElite: true,
        drops: [{ id: 'dragon_scale', chance: 0.5 }]
    },
    fire_elemental: {
        id: 'fire_elemental',
        name: '火元素',
        level: 33, hp: 130, atk: 30, def: 12, spd: 14, luk: 10,
        exp: 100, gold: 85,
        behavior: 'balanced',
        biome: 'fire',
        abilities: ['fireball', 'flame_wall', 'fire_shield'],
        element: 'fire',
        weakness: 'ice',
        drops: [{ id: 'elemental_core', chance: 0.3 }]
    },
    fire_demon: {
        id: 'fire_demon',
        name: '火焰恶魔',
        level: 39, hp: 250, atk: 40, def: 20, spd: 10, luk: 15,
        exp: 140, gold: 120,
        behavior: 'aggressive',
        biome: 'fire',
        abilities: ['hellfire', 'demon_strike', 'flame_summon'],
        element: 'fire',
        weakness: 'ice',
        isElite: true,
        drops: [{ id: 'demon_horn', chance: 0.4 }]
    },
    inferno: {
        id: 'inferno',
        name: '炼狱炎魔',
        level: 40, hp: 400, atk: 50, def: 25, spd: 8, luk: 18,
        exp: 200, gold: 180,
        behavior: 'berserker',
        biome: 'fire',
        abilities: ['inferno', 'meteor_strike', 'flame_shield', 'enrage'],
        element: 'fire',
        weakness: 'ice',
        isElite: true,
        drops: [{ id: 'infernal_core', chance: 0.6 }]
    },
    
    // ========== 虚空地区 (41-50层) ==========
    void_abomination_1: {
        id: 'void_abomination_1',
        name: '虚空异兽',
        level: 42, hp: 250, atk: 38, def: 18, spd: 10, luk: 12,
        exp: 150, gold: 120,
        behavior: 'aggressive',
        biome: 'void',
        abilities: ['void_strike', 'dimension_rift', 'corruption'],
        element: 'void',
        weakness: 'holy',
        drops: [{ id: 'void_shard', chance: 0.3 }]
    },
    void_abomination_2: {
        id: 'void_abomination_2',
        name: '虚空巨兽',
        level: 45, hp: 350, atk: 48, def: 25, spd: 8, luk: 15,
        exp: 200, gold: 160,
        behavior: 'berserker',
        biome: 'void',
        abilities: ['void_strike', 'dimension_rift', 'corruption', 'devour'],
        element: 'void',
        weakness: 'holy',
        drops: [{ id: 'void_shard', chance: 0.4 }]
    },
    void_lich_1: {
        id: 'void_lich_1',
        name: '巫妖',
        level: 45, hp: 180, atk: 32, def: 12, spd: 14, luk: 18,
        exp: 180, gold: 150,
        behavior: 'caster',
        biome: 'void',
        abilities: ['void_bolt', 'soul_drain', 'undead_ally', 'resurrect'],
        element: 'void',
        weakness: 'holy',
        drops: [{ id: 'lich_tome', chance: 0.35 }]
    },
    void_lich_2: {
        id: 'void_lich_2',
        name: '巫妖王',
        level: 48, hp: 250, atk: 40, def: 18, spd: 12, luk: 20,
        exp: 220, gold: 200,
        behavior: 'healer',
        biome: 'void',
        abilities: ['void_bolt', 'soul_drain', 'undead_ally', 'resurrect', 'dark_ritual'],
        element: 'void',
        weakness: 'holy',
        isElite: true,
        drops: [{ id: 'lich_crown', chance: 0.5 }]
    },
    void_specter_1: {
        id: 'void_specter_1',
        name: '虚空幽灵',
        level: 43, hp: 140, atk: 35, def: 8, spd: 20, luk: 20,
        exp: 160, gold: 130,
        behavior: 'evasive',
        biome: 'void',
        abilities: ['void_strike', 'phase', 'soul_siphon'],
        element: 'void',
        weakness: 'holy',
        drops: [{ id: 'soul_essence', chance: 0.3 }]
    },
    void_specter_2: {
        id: 'void_specter_2',
        name: '虚空怨灵',
        level: 46, hp: 180, atk: 42, def: 10, spd: 22, luk: 22,
        exp: 200, gold: 170,
        behavior: 'caster',
        biome: 'void',
        abilities: ['void_strike', 'phase', 'soul_siphon', 'mass_terror'],
        element: 'void',
        weakness: 'holy',
        drops: [{ id: 'soul_essence', chance: 0.4 }]
    },
    void_herald: {
        id: 'void_herald',
        name: '虚空使者',
        level: 48, hp: 300, atk: 45, def: 20, spd: 14, luk: 20,
        exp: 250, gold: 220,
        behavior: 'balanced',
        biome: 'void',
        abilities: ['void_strike', 'dimension_rift', 'void_armor', 'summon_void'],
        element: 'void',
        weakness: 'holy',
        isElite: true,
        drops: [{ id: 'rune_heart_shard', chance: 0.3 }]
    },
    soul_harvester: {
        id: 'soul_harvester',
        name: '灵魂收割者',
        level: 49, hp: 350, atk: 50, def: 22, spd: 16, luk: 25,
        exp: 300, gold: 280,
        behavior: 'caster',
        biome: 'void',
        abilities: ['soul_harvest', 'void_strike', 'mass_siphon', 'life_steal'],
        element: 'void',
        weakness: 'holy',
        isElite: true,
        drops: [{ id: 'soul_gem', chance: 0.5 }]
    },
    
    // ========== BOSS ==========
    boss_forest_troll: {
        id: 'boss_forest_troll',
        name: '森林巨魔首领',
        level: 10, hp: 500, atk: 30, def: 20, spd: 5, luk: 10,
        exp: 200, gold: 200,
        behavior: 'boss',
        biome: 'forest',
        abilities: ['regenerate', 'ground_slam', 'toss', 'enrage'],
        phases: [
            { threshold: 0.5, effects: ['atk *= 1.3', 'spd *= 1.2'] }
        ],
        isBoss: true,
        drops: [
            { id: 'troll_hammer', chance: 1.0 },
            { id: 'gold_coin', chance: 1.0, quantity: 50 },
            { id: 'rare_material', chance: 0.3 }
        ]
    },
    boss_desert_pharaoh: {
        id: 'boss_desert_pharaoh',
        name: '法老王',
        level: 20, hp: 800, atk: 40, def: 25, spd: 8, luk: 15,
        exp: 400, gold: 400,
        behavior: 'boss',
        biome: 'desert',
        abilities: ['sandstorm', 'mummy_curse', 'summon_undead', 'pharaoh_wrath'],
        phases: [
            { threshold: 0.66, abilities: ['activate_sandstorm'] },
            { threshold: 0.33, abilities: ['enrage', 'pharaoh_wrath'] }
        ],
        element: 'void',
        weakness: 'holy',
        isBoss: true,
        drops: [
            { id: 'pharaoh_staff', chance: 1.0 },
            { id: 'gold_coin', chance: 1.0, quantity: 100 },
            { id: 'ancient_tome', chance: 0.5 },
            { id: 'scarab_gem', chance: 0.3 }
        ]
    },
    boss_ice_dragon: {
        id: 'boss_ice_dragon',
        name: '冰霜巨龙',
        level: 30, hp: 1200, atk: 50, def: 30, spd: 10, luk: 18,
        exp: 600, gold: 600,
        behavior: 'boss',
        biome: 'ice',
        abilities: ['frost_breath', 'tail_sweep', 'freeze_aura', 'ice_prison'],
        phases: [
            { threshold: 0.5, effects: ['spd *= 1.5', 'ice_prison'] }
        ],
        element: 'ice',
        weakness: 'fire',
        isBoss: true,
        drops: [
            { id: 'ice_dragon_scale', chance: 1.0 },
            { id: 'dragon_tooth', chance: 0.8 },
            { id: 'gold_coin', chance: 1.0, quantity: 150 },
            { id: 'frost_heart', chance: 0.4 }
        ]
    },
    boss_fire_lord: {
        id: 'boss_fire_lord',
        name: '火焰领主',
        level: 40, hp: 1500, atk: 55, def: 35, spd: 8, luk: 20,
        exp: 800, gold: 800,
        behavior: 'boss',
        biome: 'fire',
        abilities: ['inferno', 'meteor_strike', 'flame_summon', 'fire_shield', 'enrage'],
        phases: [
            { threshold: 0.66, abilities: ['flame_summon'] },
            { threshold: 0.33, abilities: ['enrage', 'inferno'] }
        ],
        element: 'fire',
        weakness: 'ice',
        isBoss: true,
        drops: [
            { id: 'fire_lord_crown', chance: 1.0 },
            { id: 'infernal_core', chance: 0.8 },
            { id: 'gold_coin', chance: 1.0, quantity: 200 },
            { id: 'phoenix_feather', chance: 0.3 }
        ]
    },
    boss_void_overlord: {
        id: 'boss_void_overlord',
        name: '虚空君主',
        level: 50, hp: 2000, atk: 65, def: 40, spd: 12, luk: 25,
        exp: 1000, gold: 1000,
        behavior: 'boss',
        biome: 'void',
        abilities: ['void_annihilation', 'dimension_rift', 'soul_harvest', 'void_armor', 'ultimate_curse', 'enrage'],
        phases: [
            { threshold: 0.75, abilities: ['void_armor'] },
            { threshold: 0.5, abilities: ['soul_harvest', 'dimension_rift'] },
            { threshold: 0.25, abilities: ['enrage', 'void_annihilation', 'ultimate_curse'] }
        ],
        element: 'void',
        weakness: 'holy',
        isBoss: true,
        drops: [
            { id: 'rune_heart', chance: 1.0 },
            { id: 'void_armor_set', chance: 1.0 },
            { id: 'gold_coin', chance: 1.0, quantity: 500 },
            { id: 'rune_heart_shard', chance: 1.0, quantity: 5 }
        ]
    }
};

export { ENEMY_DATABASE };
