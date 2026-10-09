"use client";

/**
 * Prism Streaks — the hero's WebGL background.
 *
 * A single full-screen fragment-shader quad (Three.js): a bundle of curved,
 * chromatic light filaments with cursor-reactive sway and a sparkle-dust pool
 * that follows the pointer. Ported from the source bundle's `prism-streaks`
 * scene. Colours/behaviour come from {@link PrismConfig} props — no hardcoded
 * scene values here.
 *
 * This is a GLSL canvas effect, not DOM motion, so it sits outside the
 * spring/CSS-motion system by necessity (react-spring cannot drive a fragment
 * shader). See obsidian/frontend/components/hero.md.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { PrismConfig } from "@/data/mocks/home";

interface PrismStreaksProps {
  config: PrismConfig;
  className?: string;
}

const VERTEX_SHADER = /* glsl */ `
  void main() { gl_Position = vec4(position, 1.0); }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform float iTime, iAlpha;
  uniform vec2  iResolution, uMouse;
  uniform vec3  uCore, uWarm, uCool, uDust, uBg, uBgTint;
  uniform float uSpeed, uTwist, uBend, uWaist, uWidth, uDisperse, uBright, uDustAmt, uDustRadius, uExposure, uLean;
  uniform vec3 uArcX;           // top, peak and return horizontal fractions
  uniform vec2 uArcY;           // peak and return vertical fractions
  uniform vec3 uArcResponsive;  // portrait peak, portrait and landscape aspect ratios

  const int STREAKS = 34;   // constant loop bound — density fixed; art-direct via uWidth/uBright

  float hash(float n){ return fract(sin(n) * 43758.5453123); }
  float hash2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  // thin bright filament profile around a signed distance e (sharp core, soft tails)
  float fila(float e, float th){ float v = th / (abs(e) + th); return v * v; }

  // chromatic streak field — one bundle of curved vertical filaments
  vec3 field(vec2 p, float t){
    vec3 acc = vec3(0.0);
    float flow = t * uSpeed;
    float sway = uMouse.x * uLean;                              // cursor leans the bundle
    float env  = mix(uWaist, 1.0, smoothstep(0.0, 0.95, abs(p.y - uMouse.y * 0.5)));  // waist follows cursor.y
    for (int i = 0; i < STREAKS; i++){
      float fi = float(i);
      float s1 = hash(fi * 1.37);
      float s2 = hash(fi * 2.11 + 5.3);
      float lane = s1 * 2.0 - 1.0;
      float bend = sin(p.y * uTwist + s2 * 6.2831 + t * (0.3 + 0.5 * s2)) * uBend;
      float x = lane * uWidth * env + bend + sway * (0.6 + 0.4 * s1);
      float th = mix(0.0035, 0.016, s2);
      float dx = p.x - x;
      float disp = uDisperse * (0.25 + abs(dx) * 2.0);          // dispersion grows toward the fringe
      float cr = fila(dx + disp, th);
      float cg = fila(dx, th);
      float cb = fila(dx - disp, th);
      float fl = (0.45 + 0.55 * sin(p.y * 7.0 - flow * (0.6 + s1) + s2 * 15.0))
               * (0.6 + 0.4 * sin(p.y * 2.0 + s1 * 9.0 - flow * 0.3));   // streaking dashes along length
      float bright = (0.35 + 0.85 * s2) * uBright * max(fl, 0.0);
      acc += (cr * uWarm + cg * uCore + cb * uCool) * bright;
    }
    return acc;
  }

  // drifting sparkle dust — randomised position/size/brightness per cell (no grid feel)
  float dust(vec2 uv, float t){
    vec2 q = uv * 130.0; q.y += t * uSpeed * 9.0;
    vec2 ip = floor(q), fp = fract(q);
    vec2 jit = vec2(hash2(ip), hash2(ip + 31.7));    // random sparkle pos inside the cell
    float d  = length(fp - jit);
    float on = step(0.80, hash2(ip + 13.1));         // ~20% of cells lit, scattered
    float sz = mix(0.05, 0.22, hash2(ip + 7.3));     // random grain size
    float br = 0.35 + 0.65 * hash2(ip + 53.9);       // random brightness
    float tw = 0.5 + 0.5 * sin(t * 6.0 + hash2(ip) * 40.0);
    return smoothstep(sz, 0.0, d) * on * br * tw;
  }

  void main(){
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
    float t = iTime;
    float breath = 1.0 + 0.02 * sin(t * 0.2);
    vec2 p = uv * breath;                                     // gentle breathing

    // Bend the whole bundle around the owner's right-facing arc. Remap only
    // the filament coordinates; their original flow, width and cursor sway stay intact.
    float aspect = iResolution.x / iResolution.y;
    float screenY = 1.0 - gl_FragCoord.y / iResolution.y;
    float peakX = mix(uArcResponsive.x, uArcX.y,
      smoothstep(uArcResponsive.y, uArcResponsive.z, aspect));
    float leg = screenY < uArcY.x
      ? (screenY - uArcY.x) / uArcY.x
      : (screenY - uArcY.x) / (uArcY.y - uArcY.x);
    float endpointX = mix(uArcX.x, uArcX.z, step(uArcY.x, screenY));
    float centerX = mix(endpointX, peakX, cos(clamp(leg, -1.0, 1.0) * 1.5707963));
    p.x -= (2.0 * centerX - 1.0) * aspect * breath;

    // dark scene-coloured radial gradient (not flat black)
    float rg = length(uv * vec2(0.6, 0.45));
    vec3 col = mix(uBgTint, uBg, smoothstep(0.0, 1.4, rg));

    col += field(p, t);                                        // the prism filaments

    // sparkle dust ONLY in a soft pool that follows the cursor
    float md = length(uv - uMouse);
    float dustMask = exp(-md * md / (uDustRadius * uDustRadius));
    col += uDust * dust(uv, t) * uDustAmt * dustMask;

    col += uCore * exp(-md * md * 6.0) * 0.10;                 // soft glow under the cursor

    col = vec3(1.0) - exp(-col * uExposure);                   // filmic-ish rolloff: cores burn to white
    gl_FragColor = vec4(col, iAlpha);
  }
`;

/** Min ms between desktop frames — at most 60 fps on a 120 Hz panel (D-031). */
const DESKTOP_FRAME_MS = 12.5;

const hexToVec3 = (hex: string): THREE.Vector3 => {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
  );
};

export const PrismStreaks = ({ config, className }: PrismStreaksProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Latest config kept in a ref so the render loop reads live values without
  // re-creating the scene on every prop change.
  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 0, 15);
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      80,
    );
    camera.position.set(0, 0, 3);

    const cfg = configRef.current;
    const uniforms = {
      iTime: { value: 0 },
      iAlpha: { value: 0 },
      iResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uCore: { value: hexToVec3(cfg.coreColor) },
      uWarm: { value: hexToVec3(cfg.warmFringe) },
      uCool: { value: hexToVec3(cfg.coolFringe) },
      uDust: { value: hexToVec3(cfg.dustColor) },
      uBg: { value: hexToVec3(cfg.bgColor) },
      uBgTint: { value: hexToVec3(cfg.bgTint) },
      uDustRadius: { value: cfg.dustRadius },
      uSpeed: { value: cfg.speed },
      uTwist: { value: cfg.twist },
      uBend: { value: cfg.bend },
      uArcX: {
        value: new THREE.Vector3(cfg.arc.startX, cfg.arc.peakX, cfg.arc.endX),
      },
      uArcY: { value: new THREE.Vector2(cfg.arc.peakY, cfg.arc.endY) },
      uArcResponsive: {
        value: new THREE.Vector3(
          cfg.arc.portraitPeakX,
          cfg.arc.portraitAspect,
          cfg.arc.landscapeAspect,
        ),
      },
      uWaist: { value: cfg.waist },
      uWidth: { value: cfg.width },
      uDisperse: { value: cfg.dispersion },
      uBright: { value: cfg.brightness },
      uDustAmt: { value: cfg.dustAmount },
      uExposure: { value: cfg.exposure },
      uLean: { value: cfg.mouseLean },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), material);
    scene.add(mesh);

    // Cursor steers the bundle (lean x + waist height y), eased. uv-space,
    // aspect-corrected via / innerHeight.
    const mouseTarget = new THREE.Vector2(0, 0);
    const onPointerMove = (e: PointerEvent) => {
      mouseTarget.set(
        (2 * e.clientX - window.innerWidth) / window.innerHeight,
        -(2 * e.clientY - window.innerHeight) / window.innerHeight,
      );
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio, 1.5); // cap — heavy fullscreen shader
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      uniforms.iResolution.value.set(w * dpr, h * dpr);
    };
    window.addEventListener("resize", resize);
    resize();

    // Desktop draws at most 60 fps (D-031): on a 120 Hz panel (ProMotion, the
    // scroll test's desktop) this full-screen shader redrew every 8.3 ms tick
    // and the frame drops were the GPU's. 12.5 ms sits between a 120 Hz tick
    // and a 60 Hz one, so a 60 Hz screen keeps every frame however its
    // timestamps jitter. Phones keep drawing every tick, as before.
    let minFrameMs = 0;
    const tier = () => {
      const phone =
        window.innerWidth < 768 ||
        window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      minFrameMs = phone ? 0 : DESKTOP_FRAME_MS;
    };
    window.addEventListener("resize", tier);
    tier();

    const appearStart = performance.now();
    let raf = 0;
    let lastFrame = -Infinity;
    let inView = true;
    const render = () => {
      if (!inView || document.hidden) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(render);
      // The cursor eases per display tick, as it did before the cap, so it
      // tracks at the same speed on any panel; the time uniforms read the clock.
      uniforms.uMouse.value.lerp(mouseTarget, 0.3); // snappy cursor tracking
      const now = performance.now();
      if (now - lastFrame < minFrameMs) return;
      lastFrame = now;
      uniforms.iTime.value = now / 1000;
      const elapsed = now - appearStart;
      uniforms.iAlpha.value =
        Math.max(0, Math.min(1, (elapsed - 400) / 1000)) *
        configRef.current.mainAlpha;
      renderer.render(scene, camera);
    };
    render();

    // The page now scrolls beyond the hero. Suspend GPU work off-screen and
    // in hidden tabs while retaining the original desktop frame cap.
    const syncVisibility = () => {
      if (inView && !document.hidden) {
        if (!raf) render();
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncVisibility();
    });
    observer.observe(canvas);
    document.addEventListener("visibilitychange", syncVisibility);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", tier);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};
