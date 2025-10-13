import React, { useRef, useState, useEffect, createContext, useContext } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useHelper, Html } from "@react-three/drei";
import * as THREE from "three";
import { PointLightHelper } from "three";
import { useControls } from "leva";


function createTextTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "#877935";
  ctx.font = "bold 180px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 2;
  
  
  const centerY = canvas.height / 2;
  const lineHeight = 220;
  
  ctx.fillText("WHEN", canvas.width / 2, centerY - lineHeight + 50);
  ctx.fillText("WILL YOU", canvas.width / 2, centerY);
  ctx.fillText("START", canvas.width / 2, centerY + lineHeight - 50);
  ctx.fillText("PLAYING ?", canvas.width / 2, centerY + lineHeight * 2 - 100);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function useTextTexture() {
  const [texture, setTexture] = useState(null);
  
  useEffect(() => {
    const tex = createTextTexture();
    setTexture(tex);
  }, []);
  
  return texture;
}

const vertexShader = `
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  float circle(vec2 uv, vec2 circlePosition, float radius) {
    float dist = distance(circlePosition, uv);
    return 1. - smoothstep(0.0, radius, dist);
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    
    vec3 newPosition = position;

    vec2 mousePositions = uMouse * 0.5 + 0.5;
    float circleShape = circle(uv, mousePositions, 0.35);
    float intensity = 0.9;

    newPosition.z += circleShape * intensity;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    
    // Light follows mouse position
    vec2 mousePos = uMouse * 0.5 + 0.5;
    vec3 lightPos = vec3(mousePos.x * 10.0 - 5.0, mousePos.y * 10.0 - 5.0, 8.0);
    
    vec3 lightDir = normalize(lightPos - vPosition);
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    
    // Add specular highlight at light source
    // vec3 viewDir = normalize(-vPosition);
    // vec3 reflectDir = reflect(-lightDir, vNormal);
    // float specular = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    
    vec3 finalColor = texColor.rgb * (0.4 + diffuse * 1.0)  * 0.6; //+ specular
    gl_FragColor = vec4(finalColor, texColor.a);
  }
`;

const TextureContext = createContext(null);

function SceneText() {
  const { viewport } = useThree();
  const materialRef = useRef();
  const texture = useContext(TextureContext);

  const uniforms = useRef({
    uTexture: { value: texture },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }).current;

  useEffect(() => {
    if (texture && materialRef.current) {
      materialRef.current.uniforms.uTexture.value = texture;
    }
  }, [texture]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uMouse.value.copy(state.mouse);
    }
  });

  if (!texture) return null;

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[viewport.width, viewport.height, 256, 256]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
        />
        <Lights />
      </mesh>
      
      {/* Lighting */}
      <pointLight position={[2, 4, 6]} intensity={1.5} />
      <pointLight position={[-2, -4, 6]} intensity={0.8} />
      <ambientLight intensity={0.6} />
    </>
  );
}

function Lights() {
  const pointLightRef = useRef();

  useHelper(pointLightRef, PointLightHelper, 0.7, "cyan");

  const config = useControls("Lights", {
    color: "#ffffff",
    intensity: { value: 30, min: 0, max: 5000, step: 0.01 },
    distance: { value: 12, min: 0, max: 100, step: 0.1 },
    decay: { value: 1, min: 0, max: 5, step: 0.1 },
    position: { value: [2, 4, 6] },
  });
  return <pointLight ref={pointLightRef} {...config} />;
}


export default function SceneTextWithCapture() {
  const texture = useTextTexture();

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <TextureContext.Provider value={texture}>
        <Canvas 
          gl={{ preserveDrawingBuffer: true, antialias: true }}
          style={{ width: "100%", height: "100%", background: '#000000', position: 'fixed', top: 0, left: 0 }}
        >
          <SceneText />
        </Canvas>
      </TextureContext.Provider>
    </div>
  );
}