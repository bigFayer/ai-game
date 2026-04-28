/**
 * 符文之地 - 音效引擎
 */

class SoundEngine {
    constructor(game) {
        this.game = game;
        this.ctx = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.ambientGain = null;
        
        this.music = {};
        this.sfx = {};
        this.ambient = {};
        
        this.currentMusic = null;
        this.currentAmbient = null;
        
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.ambientVolume = 0.3;
        this.masterVolume = 1.0;
        
        this.muted = false;
        this.musicMuted = false;
        this.sfxMuted = false;
        
        this.init();
    }
    
    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            
            // 创建增益节点
            this.masterGain = this.ctx.createGain();
            this.musicGain = this.ctx.createGain();
            this.sfxGain = this.ctx.createGain();
            this.ambientGain = this.ctx.createGain();
            
            // 连接节点
            this.musicGain.connect(this.masterGain);
            this.sfxGain.connect(this.masterGain);
            this.ambientGain.connect(this.masterGain);
            this.masterGain.connect(this.ctx.destination);
            
            // 设置初始音量
            this.updateVolumes();
            
            console.log('[Sound] 音效引擎初始化完成');
        } catch (e) {
            console.warn('[Sound] 音效引擎初始化失败:', e);
        }
    }
    
    updateVolumes() {
        if (this.masterGain) {
            this.masterGain.gain.value = this.muted ? 0 : this.masterVolume;
        }
        if (this.musicGain) {
            this.musicGain.gain.value = this.musicMuted ? 0 : this.musicVolume;
        }
        if (this.sfxGain) {
            this.sfxGain.gain.value = this.sfxMuted ? 0 : this.sfxVolume;
        }
        if (this.ambientGain) {
            this.ambientGain.gain.value = this.ambientMuted ? 0 : this.ambientVolume;
        }
    }
    
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
    }
    
    setAmbientVolume(volume) {
        this.ambientVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
    }
    
    mute() {
        this.muted = true;
        this.updateVolumes();
    }
    
    unmute() {
        this.muted = false;
        this.updateVolumes();
    }
    
    playMusic(name, loop = true) {
        if (!this.ctx || !this.music[name]) return;
        
        // 停止当前音乐
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
        
        const source = this.ctx.createBufferSource();
        source.buffer = this.music[name];
        source.loop = loop;
        source.connect(this.musicGain);
        source.start();
        
        this.currentMusic = source;
    }
    
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }
    
    playSFX(name, volume = 1.0) {
        if (!this.ctx || !this.sfx[name]) return;
        
        const source = this.ctx.createBufferSource();
        source.buffer = this.sfx[name];
        
        const gain = this.ctx.createGain();
        gain.gain.value = volume;
        
        source.connect(gain);
        gain.connect(this.sfxGain);
        source.start();
    }
    
    playAmbient(name, loop = true) {
        if (!this.ctx || !this.ambient[name]) return;
        
        if (this.currentAmbient) {
            this.currentAmbient.stop();
            this.currentAmbient = null;
        }
        
        const source = this.ctx.createBufferSource();
        source.buffer = this.ambient[name];
        source.loop = loop;
        source.connect(this.ambientGain);
        source.start();
        
        this.currentAmbient = source;
    }
    
    stopAmbient() {
        if (this.currentAmbient) {
            this.currentAmbient.stop();
            this.currentAmbient = null;
        }
    }
    
    // 音效方法
    playAttack() { this.playSFX('attack'); }
    playHit() { this.playSFX('hit'); }
    playDie() { this.playSFX('die'); }
    playLevelUp() { this.playSFX('levelup'); }
    playPickup() { this.playSFX('pickup'); }
    playUseSkill() { this.playSFX('skill'); }
    playOpenMenu() { this.playSFX('menu_open'); }
    playCloseMenu() { this.playSFX('menu_close'); }
    playButtonClick() { this.playSFX('button_click'); }
    playBossAppear() { this.playSFX('boss_appear'); }
    playBossDie() { this.playSFX('boss_die'); }
    
    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
}

export { SoundEngine };
