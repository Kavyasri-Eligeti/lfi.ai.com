// GLSL for the AI universe. All surfaces are procedural: no texture downloads,
// no third-party imagery. Written for WebGL2 (three r180 requires WebGL2).

// 3D simplex noise: Ashima Arts / Stefan Gustavson (MIT license)
// https://github.com/ashima/webgl-noise
export const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){
  float f=0.0;
  float a=0.5;
  for(int i=0;i<OCTAVES;i++){
    f+=a*snoise(p);
    p=p*2.03+vec3(1.7,9.2,3.1);
    a*=0.5;
  }
  return f;
}
`;

const WORLD_VARYINGS = /* glsl */ `
varying vec3 vObj;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;
`;

export const worldVertex = /* glsl */ `
${WORLD_VARYINGS}
void main(){
  vObj = position;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

// Procedural planet: fbm continents blended with flowing bands, lit by the
// central emblem (uLightPos), with night-side "data filaments" and an inner rim.
export const planetFragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uAtmos;
uniform vec3 uLightPos;
uniform float uTime;
uniform float uNoise;
uniform float uBands;
uniform float uBandMix;
uniform float uLines;
uniform float uSeed;
uniform float uHover;
${WORLD_VARYINGS}
${NOISE}
void main(){
  vec3 p = normalize(vObj);
  float n = fbm(p * uNoise + uSeed) * 0.5 + 0.5;
  float warp = fbm(p * uNoise * 0.6 + vec3(uTime * 0.012, 0.0, uSeed * 1.3));
  float band = sin((p.y + warp * 0.32) * uBands * 3.14159) * 0.5 + 0.5;
  float t = mix(n, band, uBandMix);

  vec3 col = mix(uColorA, uColorB, smoothstep(0.22, 0.78, t));
  col = mix(col, uColorC, smoothstep(0.7, 0.98, t) * 0.8);

  float contour = n * 7.0 + uTime * 0.015;
  float w = fwidth(contour) * 1.2;
  float line = 1.0 - smoothstep(0.0, w + 0.02, abs(fract(contour) - 0.5));

  vec3 N = normalize(vWorldNormal);
  vec3 L = normalize(uLightPos - vWorldPos);
  vec3 V = normalize(cameraPosition - vWorldPos);
  float ndl = dot(N, L);
  float day = smoothstep(-0.25, 0.65, ndl);

  vec3 color = col * (0.035 + 0.95 * day);
  vec3 H = normalize(L + V);
  color += pow(max(dot(N, H), 0.0), 48.0) * 0.16 * day * vec3(1.0, 0.95, 0.85);

  float night = 1.0 - smoothstep(-0.15, 0.35, ndl);
  color += uColorC * line * uLines * (0.18 + 1.3 * night);

  float fres = pow(1.0 - max(dot(N, V), 0.0), 2.6);
  color += uAtmos * fres * (0.12 + 0.8 * day);
  color += uAtmos * uHover * 0.14;

  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

// Atmosphere shell (BackSide, additive): brightest at the limb, stronger on the lit side.
export const atmosphereFragment = /* glsl */ `
uniform vec3 uAtmos;
uniform vec3 uLightPos;
uniform float uIntensity;
${WORLD_VARYINGS}
void main(){
  vec3 N = normalize(vWorldNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);
  vec3 L = normalize(uLightPos - vWorldPos);
  float a = smoothstep(0.0, 0.62, -dot(N, V));
  a = pow(a, 1.7);
  float lit = smoothstep(-0.45, 0.55, dot(N, L));
  vec3 color = uAtmos * a * (0.18 + 0.82 * lit) * uIntensity;
  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}
`;

// Planetary ring: radial bands, transparent, lit by the core.
export const ringVertex = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldPos;
void main(){
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

export const ringFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uInner;
uniform float uOuter;
uniform float uSeed;
varying vec2 vUv;
varying vec3 vWorldPos;
float hash(float x){ return fract(sin(x * 127.1 + uSeed) * 43758.5453); }
void main(){
  float r = (length(vUv - 0.5) * 2.0 - uInner) / (uOuter - uInner);
  if (r < 0.0 || r > 1.0) discard;
  float bands = 0.55 + 0.45 * sin(r * 60.0 + hash(floor(r * 14.0)) * 6.0);
  float edge = smoothstep(0.0, 0.08, r) * smoothstep(1.0, 0.85, r);
  float gap = smoothstep(0.52, 0.55, r) * smoothstep(0.6, 0.57, r);
  float alpha = edge * bands * (1.0 - gap * 0.85) * 0.55;
  gl_FragColor = vec4(uColor * (0.5 + 0.5 * bands), alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

// Stars: soft round points with slow twinkle.
export const starVertex = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
uniform float uTime;
uniform float uPixelRatio;
varying vec3 vColor;
varying float vTwinkle;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  vTwinkle = 0.62 + 0.38 * sin(uTime * (0.4 + aPhase * 1.6) + aPhase * 40.0);
  vColor = aColor;
  gl_PointSize = clamp(aSize * uPixelRatio * (320.0 / -mv.z), 1.0, 9.0 * uPixelRatio);
}
`;

export const starFragment = /* glsl */ `
varying vec3 vColor;
varying float vTwinkle;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  gl_FragColor = vec4(vColor * vTwinkle * a * 1.5, 1.0);
  #include <colorspace_fragment>
}
`;

// Deep-space backdrop: low-octave nebula and a faint galactic band.
export const nebulaVertex = /* glsl */ `
varying vec3 vDir;
void main(){
  vDir = normalize(position);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

export const nebulaFragment = /* glsl */ `
uniform vec3 uDeep;
uniform vec3 uBlue;
uniform vec3 uWarm;
varying vec3 vDir;
${NOISE}
void main(){
  float n = fbm(vDir * 1.7) * 0.5 + 0.5;
  float n2 = fbm(vDir * 3.3 + 5.0) * 0.5 + 0.5;
  float band = exp(-pow(dot(vDir, normalize(vec3(0.35, 1.0, 0.15))) * 3.2, 2.0));
  vec3 col = uDeep;
  col += uBlue * smoothstep(0.35, 0.95, n) * 0.32;
  col += uBlue * band * (0.06 + 0.22 * n2);
  col += uWarm * smoothstep(0.55, 1.0, n2) * smoothstep(0.4, 0.9, n) * 0.12;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

// Emblem core: hot centre, warm body, cool rim. Values above 1.0 feed the bloom.
export const coreFragment = /* glsl */ `
uniform float uTime;
uniform float uPulse;
uniform vec3 uHot;
uniform vec3 uWarm;
uniform vec3 uCool;
${WORLD_VARYINGS}
${NOISE}
void main(){
  vec3 N = normalize(vWorldNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);
  float facing = max(dot(N, V), 0.0);
  float n = fbm(normalize(vObj) * 2.6 + vec3(0.0, uTime * 0.18, uTime * 0.05)) * 0.5 + 0.5;
  vec3 col = mix(uWarm, uHot, pow(facing, 1.4));
  col = mix(col, uCool, pow(1.0 - facing, 3.0) * 0.55);
  col *= (1.25 + 0.9 * n) * (1.0 + 0.18 * uPulse);
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

// Faceted glass shell: flat facet normals from derivatives, fresnel rim and moving glints.
export const glassFragment = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform vec3 uRim;
uniform vec3 uTint;
${WORLD_VARYINGS}
void main(){
  vec3 N = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
  vec3 V = normalize(cameraPosition - vWorldPos);
  if (dot(N, V) < 0.0) N = -N;
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.2);
  vec3 L = normalize(vec3(sin(uTime * 0.31), 0.65, cos(uTime * 0.31)));
  float glint = pow(max(dot(reflect(-L, N), V), 0.0), 26.0);
  vec3 col = uTint * 0.1 + uRim * fres * 1.05 + vec3(1.0, 0.94, 0.8) * glint * 0.9;
  float alpha = clamp(0.08 + fres * 0.7 + glint * 0.6, 0.0, 1.0) * uOpacity;
  gl_FragColor = vec4(col, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

// Light trails: energy pulses travelling along line segments.
export const trailVertex = /* glsl */ `
attribute float aT;
attribute float aSeed;
varying float vT;
varying float vSeed;
void main(){
  vT = aT;
  vSeed = aSeed;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const trailFragment = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform vec3 uBase;
uniform vec3 uPulse;
varying float vT;
varying float vSeed;
void main(){
  float head = fract(uTime * (0.22 + vSeed * 0.2) + vSeed * 7.0);
  float pulse = smoothstep(0.18, 0.0, abs(head - vT));
  vec3 col = mix(uBase * 0.35, uPulse * 2.2, pulse);
  gl_FragColor = vec4(col * uOpacity, 1.0);
  #include <colorspace_fragment>
}
`;
