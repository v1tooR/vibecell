/* ============================================================
   VIBE CELL — Fundo animado do Hero (WebGL "silk" shader)
   Canvas único, sem dependências, com a rampa oficial da marca
   (#59a6e7 → #5b80d9 → #6f4ac4 → #8330a8) sobre o preto da logo.
   A opacidade do canvas (--shader-op) muda por tema no CSS, então
   este módulo não precisa saber se a visão é clara ou escura.
   ============================================================ */
(function () {
  'use strict';

  var VERT = 'attribute vec2 a_position;\n' +
    'void main() {\n' +
    '  gl_Position = vec4(a_position, 0.0, 1.0);\n' +
    '}';

  var FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;      // resolution.xy, time, colour count
uniform vec4 u_shape;      // scale, intensity, paramA, warp
uniform vec4 u_surface;    // detail, contrast, brightness, saturation
uniform vec4 u_finish;     // hue, vignette, blur, grain
uniform vec4 u_transform;  // seed, rotation, drift, OKLab toggle
uniform vec4 u_space;      // offset.xy, pointer.xy

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_offset u_space.xy

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 palette(float x) {
  float n = max(u_colorCount - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n)
      col = mix(col, u_colors[i + 1],
        smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

vec3 hueRotate(vec3 col, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211,
                          0.587, -0.274, -0.523,
                          0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0,
                          0.956, -0.272, -1.106,
                          0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * col;
  float ca = cos(a), sa = sin(a);
  yiq = vec3(yiq.x, yiq.y * ca - yiq.z * sa, yiq.y * sa + yiq.z * ca);
  return toRGB * yiq;
}

vec3 shade(vec2 p, float t) {
  vec2 q = p * 1.6;
  float amp = 0.25 + u_intensity * 0.85;
  for (float i = 1.0; i < 5.0; i += 1.0) {
    q.x += amp / i * cos(i * 2.4 * q.y + t * 0.8 + u_seed);
    q.y += amp / i * cos(i * 1.7 * q.x + t * 0.6);
  }
  return palette(0.5 + 0.5 * sin(q.x + q.y));
}

void main() {
  vec2 screenUv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);

  p *= u_scale;
  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }
  p += u_offset;
  if (u_drift > 0.0001)
    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  if (u_warp > 0.0) {
    p += u_warp * (vec2(
      fbm(p * u_detail + u_seed),
      fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  }

  vec3 col;
  if (u_blur > 0.0) {
    float pe = u_blur * u_scale;
    col  = shade(p, u_time) * 0.36;
    col += shade(p + vec2(pe, 0.0), u_time) * 0.16;
    col += shade(p - vec2(pe, 0.0), u_time) * 0.16;
    col += shade(p + vec2(0.0, pe), u_time) * 0.16;
    col += shade(p - vec2(0.0, pe), u_time) * 0.16;
  } else {
    col = shade(p, u_time);
  }

  if (abs(u_contrast - 1.0) > 0.0001)
    col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }
  if (abs(u_hue) > 0.0001)
    col = hueRotate(col, u_hue);
  if (abs(u_brightness) > 0.0001)
    col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_grain > 0.0001)
    col += (grainHash(
      gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

  /* Rampa oficial Vibe sobre o preto da logo — ver --c-ciano/azul/roxo/violeta
     e --bg escuro em style.css. Preenche os 8 slots do array do shader
     repetindo a última cor (o shader só varia 0..colorCount-1). */
  var VIBE_COLORS = [
    [0.019607843137254902, 0.023529411764705882, 0.03529411764705882], // #050609
    [0.34901960784313724, 0.6509803921568628, 0.9058823529411765],     // #59a6e7 ciano
    [0.3568627450980392, 0.5019607843137255, 0.8509803921568627],      // #5b80d9 azul
    [0.43529411764705883, 0.2901960784313726, 0.7686274509803922],     // #6f4ac4 roxo
    [0.5137254901960784, 0.18823529411764706, 0.6588235294117647]      // #8330a8 violeta
  ];
  while (VIBE_COLORS.length < 8) {
    VIBE_COLORS.push(VIBE_COLORS[VIBE_COLORS.length - 1]);
  }

  var UNIFORMS = {
    colors: VIBE_COLORS,
    colorCount: 5,
    scale: 1.5,
    intensity: 0.55,
    warp: 0.15,
    detail: 2.4,
    contrast: 1.02,
    brightness: -0.02,
    saturation: 1.05,
    hue: 0,
    vignette: 0.18,
    blur: 0.012,
    grain: 0.035,
    seed: 1.0,
    rotate: 0,
    offsetX: 0,
    offsetY: 0,
    drift: 0.04,
    timeScale: 0.14
  };

  function initShaderBackground(canvas) {
    var reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var timeScale = reducedMotion ? 0 : UNIFORMS.timeScale;

    var gl = canvas.getContext('webgl', { antialias: false });
    if (!gl) return;

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    var program = gl.createProgram();
    var vertexShader = compile(gl.VERTEX_SHADER, VERT);
    var fragmentShader = compile(gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.useProgram(program);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uni = {
      colors: gl.getUniformLocation(program, 'u_colors'),
      scene: gl.getUniformLocation(program, 'u_scene'),
      shape: gl.getUniformLocation(program, 'u_shape'),
      surface: gl.getUniformLocation(program, 'u_surface'),
      finish: gl.getUniformLocation(program, 'u_finish'),
      transform: gl.getUniformLocation(program, 'u_transform'),
      space: gl.getUniformLocation(program, 'u_space')
    };

    var flatColors = [];
    for (var i = 0; i < UNIFORMS.colors.length; i++) {
      flatColors.push(UNIFORMS.colors[i][0], UNIFORMS.colors[i][1], UNIFORMS.colors[i][2]);
    }
    gl.uniform3fv(uni.colors, new Float32Array(flatColors));
    gl.uniform4f(uni.shape, UNIFORMS.scale, UNIFORMS.intensity, 0, UNIFORMS.warp);
    gl.uniform4f(uni.surface, UNIFORMS.detail, UNIFORMS.contrast, UNIFORMS.brightness, UNIFORMS.saturation);
    gl.uniform4f(uni.finish, UNIFORMS.hue, UNIFORMS.vignette, UNIFORMS.blur, UNIFORMS.grain);
    gl.uniform4f(uni.transform, UNIFORMS.seed, UNIFORMS.rotate, UNIFORMS.drift, 0);
    gl.uniform4f(uni.space, UNIFORMS.offsetX, UNIFORMS.offsetY, 0, 0);

    var bounds = canvas.getBoundingClientRect();
    var raf = 0;
    var start = performance.now();
    var visible = document.visibilityState === 'visible';
    var inView = true;
    var disposed = false;
    var timeAnimated = Math.abs(timeScale) > 0.0001;

    function resizeCanvas() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rawWidth = Math.max(1, Math.round(bounds.width * dpr));
      var rawHeight = Math.max(1, Math.round(bounds.height * dpr));
      var pixelScale = Math.min(1, Math.sqrt(2000000 / Math.max(1, rawWidth * rawHeight)));
      var width = Math.max(1, Math.round(rawWidth * pixelScale));
      var height = Math.max(1, Math.round(rawHeight * pixelScale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    function requestRender() {
      if (!disposed && visible && inView && raf === 0) {
        raf = requestAnimationFrame(render);
      }
    }

    function updateLayout() {
      bounds = canvas.getBoundingClientRect();
      resizeCanvas();
      requestRender();
    }
    window.addEventListener('resize', updateLayout);

    var resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(canvas);

    var intersectionObserver = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      inView = entry ? entry.isIntersecting : true;
      if (inView) {
        requestRender();
      } else if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    intersectionObserver.observe(canvas);

    document.addEventListener('visibilitychange', function () {
      visible = document.visibilityState === 'visible';
      if (visible) {
        requestRender();
      } else if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });

    function render(now) {
      raf = 0;
      if (disposed || !visible || !inView) return;
      resizeCanvas();
      gl.uniform4f(uni.scene, canvas.width, canvas.height, ((now - start) / 1000) * timeScale, UNIFORMS.colorCount);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (timeAnimated) requestRender();
    }
    requestRender();
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var canvas = document.getElementById('heroShader');
    if (canvas) initShaderBackground(canvas);
  });
})();
