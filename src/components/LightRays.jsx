// src/components/LightRays.jsx
import { useRef, useEffect } from "react";
import { Renderer, Program, Triangle, Mesh } from "ogl";

const DEFAULT_COLOR = "#00ffff";

const hexToRgb = (hex) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [
        parseInt(m[1], 16) / 255,
        parseInt(m[2], 16) / 255,
        parseInt(m[3], 16) / 255,
      ]
    : [1, 1, 1];
};

const getAnchorAndDir = (origin, w, h) => {
  const outside = 0.2;
  switch (origin) {
    case "bottom-center":
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case "top-center":
    default:
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
  }
};

const LightRays = ({
  raysOrigin = "bottom-center",
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1.5,
  lightSpread = 0.8,
  rayLength = 1.2,
  fadeDistance = 1.0,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0.1,
  distortion = 0.05,
  className = "",
}) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationIdRef = useRef(null);
  const meshRef = useRef(null);
  const uniformsRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    // insert canvas
    while (containerRef.current.firstChild)
      containerRef.current.removeChild(containerRef.current.firstChild);
    containerRef.current.appendChild(gl.canvas);

    const vert = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }`;

    const frag = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec2 rayPos;
      uniform vec2 rayDir;
      uniform vec3 raysColor;
      uniform float raysSpeed;
      uniform float lightSpread;
      uniform float rayLength;
      uniform float fadeDistance;
      uniform vec2 mousePos;
      uniform float mouseInfluence;
      uniform float noiseAmount;
      uniform float distortion;
      varying vec2 vUv;
      float noise(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123); }
      float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
        vec2 sourceToCoord = coord - raySource;
        vec2 dirNorm = normalize(sourceToCoord);
        float cosAngle = dot(dirNorm, rayRefDirection);
        float distortedAngle = cosAngle + distortion * sin(iTime*2.0+length(sourceToCoord)*0.01)*0.2;
        float spreadFactor = pow(max(distortedAngle,0.0), 1.0/max(lightSpread,0.001));
        float distance = length(sourceToCoord);
        float maxDistance = iResolution.x*rayLength;
        float lengthFalloff = clamp((maxDistance-distance)/maxDistance,0.0,1.0);
        float fadeFalloff = clamp((iResolution.x*fadeDistance-distance)/(iResolution.x*fadeDistance),0.5,1.0);
        float baseStrength = clamp((0.45+0.15*sin(distortedAngle*seedA+iTime*speed))+(0.3+0.2*cos(-distortedAngle*seedB+iTime*speed)),0.0,1.0);
        return baseStrength*lengthFalloff*fadeFalloff*spreadFactor;
      }
      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
        vec2 finalRayDir = rayDir;
        if(mouseInfluence>0.0){
          vec2 mouseScreenPos = mousePos*iResolution.xy;
          vec2 mouseDirection = normalize(mouseScreenPos-rayPos);
          finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
        }
        vec4 rays1 = vec4(1.0)*rayStrength(rayPos, finalRayDir, coord,36.2214,21.11349,1.5*raysSpeed);
        vec4 rays2 = vec4(1.0)*rayStrength(rayPos, finalRayDir, coord,22.3991,18.0234,1.1*raysSpeed);
        fragColor = rays1*0.5 + rays2*0.4;
        if(noiseAmount>0.0){ float n=noise(coord*0.01+0.1*iTime); fragColor.rgb*=(1.0-noiseAmount+noiseAmount*n); }
        fragColor.rgb *= raysColor;
      }
      void main(){ vec4 color; mainImage(color, gl_FragCoord.xy); gl_FragColor = color; }`;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] },
      rayPos: { value: [0, 0] },
      rayDir: { value: [0, 1] },
      raysColor: { value: hexToRgb(raysColor) },
      raysSpeed: { value: raysSpeed },
      lightSpread: { value: lightSpread },
      rayLength: { value: rayLength },
      fadeDistance: { value: fadeDistance },
      mousePos: { value: [0.5, 0.5] },
      mouseInfluence: { value: mouseInfluence },
      noiseAmount: { value: noiseAmount },
      distortion: { value: distortion },
    };
    uniformsRef.current = uniforms;

    const geometry = new Triangle(gl);
    const program = new Program(gl, { vertex: vert, fragment: frag, uniforms });
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const updatePlacement = () => {
      const { clientWidth, clientHeight } = containerRef.current;
      renderer.setSize(clientWidth, clientHeight);
      const dpr = renderer.dpr;
      const w = clientWidth * dpr;
      const h = clientHeight * dpr;
      uniforms.iResolution.value = [w, h];
      const { anchor, dir } = getAnchorAndDir(raysOrigin, w, h);
      uniforms.rayPos.value = anchor;
      uniforms.rayDir.value = dir;
    };

    const loop = (t) => {
      uniforms.iTime.value = t * 0.001;
      if (followMouse) {
        const smoothing = 0.92;
        smoothMouseRef.current.x =
          smoothMouseRef.current.x * smoothing +
          mouseRef.current.x * (1 - smoothing);
        smoothMouseRef.current.y =
          smoothMouseRef.current.y * smoothing +
          mouseRef.current.y * (1 - smoothing);
        uniforms.mousePos.value = [
          smoothMouseRef.current.x,
          smoothMouseRef.current.y,
        ];
      }
      try {
        renderer.render({ scene: mesh });
      } catch (err) {
        // ignore render exceptions (device/browser)
      }
      animationIdRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("resize", updatePlacement);
    updatePlacement();
    animationIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", updatePlacement);
      try {
        renderer.gl.canvas.remove();
      } catch (e) {}
      rendererRef.current = null;
    };
  }, [
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
    fadeDistance,
  ]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!followMouse) return;
    const onMouse = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    window.addEventListener("mousemove", onMouse);
    return () => window.removeEventListener("mousemove", onMouse);
  }, [followMouse]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
    />
  );
};

export default LightRays;
