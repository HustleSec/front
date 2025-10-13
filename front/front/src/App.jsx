import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { OrbitControls, SpotLight, useHelper, useGLTF } from '@react-three/drei';
import { useControls } from 'leva';
import { SpotLightHelper, MeshStandardMaterial } from 'three';
// import { SceneText } from './play';
import SceneTextWithCapture from "./play";



function Model({ rotationAngle }) {
  const { scene } = useGLTF('/test2.glb');
  const modelRef = useRef();
  const initialRotationY = 4.72; // default rotation

  useFrame(() => {
    if (!modelRef.current) return;

    // Rotation: start at initialRotationY and rotate based on scroll
    const targetRotationY = initialRotationY + rotationAngle * -0.0065;
    modelRef.current.rotation.y += (targetRotationY - modelRef.current.rotation.y) * 0.1;

    // Scale: start big and shrink on scroll
    const baseScale = 5;
    const shrinkFactor = 0.004;
    const targetScale = baseScale - rotationAngle * shrinkFactor;
    modelRef.current.scale.x += (targetScale - modelRef.current.scale.x) * 0.1;
    modelRef.current.scale.y += (targetScale - modelRef.current.scale.y) * 0.1;
    modelRef.current.scale.z += (targetScale - modelRef.current.scale.z) * 0.1;

    // Move to bottom-right smoothly
    const targetPosX = rotationAngle > 0 ? 4.2 : 0;
    const targetPosY = rotationAngle > 0 ? -2 : 0;

    modelRef.current.position.x += (targetPosX - modelRef.current.position.x) * 0.08;
    modelRef.current.position.y += (targetPosY  - modelRef.current.position.y) * 0.08;
  });

  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.metalness = 0.2;
      child.material.roughness = 0.4;
      child.material.side = 2;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return <primitive ref={modelRef} object={scene} />;
}


function LightWithHelper({ modelPosition }) {
  const light = useRef();

  const { angle, penumbra, intensity, distX, distY, distZ } = useControls({
    angle: Math.PI / 3,
    penumbra: {
      value: 10,
      min: 0.0,
      max: 1.0,
      step: 0.1,
    },
    intensity: {
      value: 150,
      min: 0,
      max: 200,
      step: 5,
    },
    distX: {
      value: 3,
      min: -20,
      max: 20,
      step: 1,
    },
    distY: {
      value: 6,
      min: 0,
      max: 20,
      step: 1,
    },
    distZ: {
      value: 3,
      min: -20,
      max: 20,
      step: 1,
    },
  });
  
  useHelper(light, SpotLightHelper, 'yellow');

  useFrame(() => {
    if (light.current && modelPosition) {
      // Light follows object with offset
      light.current.position.x = modelPosition.x + distX;
      light.current.position.y = modelPosition.y + distY;
      light.current.position.z = modelPosition.z + distZ;
      
      // Light looks at object
      light.current.target.position.copy(modelPosition);
      light.current.target.updateMatrixWorld();
    }
  });
  
  return (
    <SpotLight
      ref={light}
      angle={angle}
      penumbra={penumbra}
      intensity={intensity}
      color={0xfaee02}
      castShadow
      decay={1}
    />
  );
}

function App() {
  const { ambientIntensity, pointIntensity } = useControls({
    ambientIntensity: {
      value: 150,
      min: 0,
      max: 5,
      step: 0.1,
    },
    pointIntensity: {
      value: 160,
      min: 0,
      max: 200,
      step: 5,
    },
  });

  const [oldScrollY, setOldScrollY] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOldScrollY(prevScrollY => {
        const delta = window.scrollY - prevScrollY;
  
        if (delta > 10) {
          setRotationAngle(250);
          return window.scrollY;
        } else if (delta < 0) {
          setRotationAngle(0);
          return window.scrollY;
        }
        return prevScrollY;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <SceneTextWithCapture />;
}

export default App;
// <div>
//   <Canvas shadows style={{ background: '#000000', position: 'fixed', top: 0, left: 0 }}>
//     {/* Very bright ambient light */}
//     <ambientLight intensity={ambientIntensity} color={0xEDD798} />
    
//     {/* Multiple point lights from different angles */}
//     <pointLight position={[10, 10, 10]} intensity={pointIntensity} color={0xE5B412} />
//     <pointLight position={[-10, 10, -10]} intensity={pointIntensity * 0.8} color={0xE5B412} />
//     <pointLight position={[0, -5, 0]} intensity={pointIntensity * 0.6} color={0xE5B412} />
    
//     {/* <axesHelper args={[10]} /> */}
//     {/* <LightWithHelper modelPosition={scrollY ? { x: 0, y: (scrollY * 0.01), z: scrollY * 0.002 } : { x: 0, y: -5, z: 0 }} /> */}
//     <OrbitControls enableZoom={false} enablePan={false} enableRotate={false}  /> 
//     <Model rotationAngle={rotationAngle}/>
//   </Canvas>
//   <div style={{ height: '105vh', position: 'relative', zIndex: 1 }} />

  
// </div>