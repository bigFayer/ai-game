/**
 * 符文之地 - 着色器特效系统
 */

class ShaderEffects {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.gl = null;
        this.supported = false;
        
        // WebGL 备用
        try {
            this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (this.gl) {
                this.supported = true;
                this.initShaders();
            }
        } catch (e) {
            console.warn('[Shader] WebGL不支持:', e);
        }
        
        // Canvas 2D 替代效果
        this.filters = {
            blur: 0,
            brightness: 1,
            contrast: 1,
            grayscale: 0,
            hue: 0,
            invert: 0,
            opacity: 1,
            saturate: 1,
            sepia: 0
        };
    }
    
    initShaders() {
        const gl = this.gl;
        
        // 顶点着色器
        const vertexShaderSource = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `;
        
        // 片段着色器
        const fragmentShaderSource = `
            precision mediump float;
            varying vec2 v_texCoord;
            uniform sampler2D u_image;
            uniform float u_blur;
            uniform float u_brightness;
            uniform float u_contrast;
            uniform float u_grayscale;
            uniform float u_invert;
            uniform float u_sepia;
            
            void main() {
                vec4 color = texture2D(u_image, v_texCoord);
                
                // 亮度
                color.rgb *= u_brightness;
                
                // 对比度
                color.rgb = (color.rgb - 0.5) * u_contrast + 0.5;
                
                // 灰度
                if (u_grayscale > 0.0) {
                    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                    color.rgb = mix(color.rgb, vec3(gray), u_grayscale);
                }
                
                // 反转
                if (u_invert > 0.0) {
                    color.rgb = mix(color.rgb, 1.0 - color.rgb, u_invert);
                }
                
                // 复古（棕褐色）
                if (u_sepia > 0.0) {
                    vec3 sepia = vec3(
                        dot(color.rgb, vec3(0.393, 0.769, 0.189)),
                        dot(color.rgb, vec3(0.349, 0.686, 0.168)),
                        dot(color.rgb, vec3(0.272, 0.534, 0.131))
                    );
                    color.rgb = mix(color.rgb, sepia, u_sepia);
                }
                
                gl_FragColor = color;
            }
        `;
        
        // 编译着色器
        const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
        
        if (!vertexShader || !fragmentShader) return;
        
        // 创建程序
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('[Shader] 程序链接失败');
            return;
        }
        
        this.shaderProgram = program;
        
        // 获取位置
        this.positionLocation = gl.getAttribLocation(program, 'a_position');
        this.texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
        
        // Uniforms
        this.uniforms = {
            blur: gl.getUniformLocation(program, 'u_blur'),
            brightness: gl.getUniformLocation(program, 'u_brightness'),
            contrast: gl.getUniformLocation(program, 'u_contrast'),
            grayscale: gl.getUniformLocation(program, 'u_grayscale'),
            invert: gl.getUniformLocation(program, 'u_invert'),
            sepia: gl.getUniformLocation(program, 'u_sepia')
        };
        
        // 创建缓冲
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1
        ]), gl.STATIC_DRAW);
        
        this.texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 1, 1, 1, 0, 0,
            0, 0, 1, 1, 1, 0
        ]), gl.STATIC_DRAW);
        
        // 创建纹理
        this.imageTexture = gl.createTexture();
    }
    
    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('[Shader] 着色器编译失败:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    // Canvas 2D 滤镜效果（备用）
    applyCanvasFilter(filter, value) {
        this.filters[filter] = value;
        
        let filterString = '';
        if (this.filters.blur > 0) filterString += `blur(${this.filters.blur}px) `;
        if (this.filters.brightness !== 1) filterString += `brightness(${this.filters.brightness}) `;
        if (this.filters.contrast !== 1) filterString += `contrast(${this.filters.contrast}) `;
        if (this.filters.grayscale > 0) filterString += `grayscale(${this.filters.grayscale}) `;
        if (this.filters.hue !== 0) filterString += `hue-rotate(${this.filters.hue}deg) `;
        if (this.filters.invert > 0) filterString += `invert(${this.filters.invert}) `;
        if (this.filters.saturate !== 1) filterString += `saturate(${this.filters.saturate}) `;
        if (this.filters.sepia > 0) filterString += `sepia(${this.filters.sepia}) `;
        
        this.canvas.style.filter = filterString;
    }
    
    resetFilters() {
        for (const filter in this.filters) {
            this.filters[filter] = filter === 'brightness' || filter === 'contrast' || filter === 'opacity' || filter === 'saturate' ? 1 : 0;
        }
        this.canvas.style.filter = 'none';
    }
    
    // 预设效果
    setGrayscale(value) {
        this.applyCanvasFilter('grayscale', value);
    }
    
    setSepia(value) {
        this.applyCanvasFilter('sepia', value);
    }
    
    setInvert(value) {
        this.applyCanvasFilter('invert', value);
    }
    
    setBrightness(value) {
        this.applyCanvasFilter('brightness', value);
    }
    
    setContrast(value) {
        this.applyCanvasFilter('contrast', value);
    }
    
    setBlur(value) {
        this.applyCanvasFilter('blur', value);
    }
    
    // 预设主题
    applyNightVision() {
        this.setBrightness(0.8);
        this.setContrast(1.3);
        this.setGreenVision();
    }
    
    setGreenVision() {
        this.setGrayscale(1);
        this.applyCanvasFilter('hue', 90);
        this.setSaturate(0);
        this.setBrightness(1.1);
    }
    
    setDream() {
        this.setBlur(2);
        this.setBrightness(1.1);
        this.setContrast(0.9);
        this.setSepia(0.3);
    }
    
    setHorror() {
        this.setContrast(1.5);
        this.setBrightness(0.9);
        this.setSepia(0.5);
        this.applyCanvasFilter('hue', -20);
    }
}

export { ShaderEffects };
