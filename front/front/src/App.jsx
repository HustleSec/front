import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { OrbitControls, SpotLight, useHelper, useGLTF, Text } from '@react-three/drei';
import { useControls } from 'leva';
import { SpotLightHelper, MeshStandardMaterial } from 'three';
import './App.css'
import Infinite from './infinite.jsx';
import Claim from './claim.jsx';
import Circular from './circular.jsx';
import ReactCurvedText from 'react-curved-text';
import { div } from 'three/tsl';


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
    modelRef.current.position.y += (targetPosY - modelRef.current.position.y) * 0.08;
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


function App() {

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

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const showText = scrollY < 15;
  const deleteText = scrollY > 400;
  const textOpacity = Math.max(0, 1 - scrollY / 10);
  const textOpacity2 = Math.min(scrollY / 10, 1);

  return (
    <div>
      <div className='main'>
        <div className='navbar'>
          <h1 className='logo'>NTX</h1>
          <div className='elements'>
            <a href="#" className='link home'>Home</a>
            <a href="#" className='link about'>About us</a>
            <a href="#" className='link Play To win'>Play To Win</a>
          </div>
          <div className='play1'>
            <button className='play'> Start Now </button>
          </div>
        </div>
        {showText && (<h1 className='title' style={{ opacity: textOpacity }}>NXTGNX</h1>)}
        <Infinite />
        {showText && (<Claim value={textOpacity} />)}
        {!showText && (
          <div
            style={{
              position: "absolute",
              top: "80%",
              left: "25%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              userSelect: 'none',
            }}
          >
            <Circular />
          </div>
        )}
        {!showText && (
          <div
            style={{
              position: "absolute",
              top: "97%",
              left: "60%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              userSelect: 'none',
            }}
          >
            <Circular />
          </div>
        )}
        {!showText && (<h1 style={{ opacity: textOpacity2 }} className='text2'>Do you have what it takes to become the ultimate ping pong champion?</h1>)}
        {!showText && (<h3 className='text3'>go head-to-head with friends in real-time online matches. Whether you’re just starting out or a pro, enjoy fast-paced action, smooth controls, and endless fun—right in your browser!</h3>)}
        {!showText && (<h3 className='text4'>Challenge yourself with our AI-powered ping pong game that adapts to your skill level. </h3>)}
        <div style={{ position: 'absolute' }}>
          <Canvas shadows style={{ backgroundColor: '#000000', position: 'fixed', top: 0, left: 0 }}>
            <ambientLight intensity={5} color={0xEDD798} />

            <pointLight position={[10, 10, 10]} intensity={160} color={0xE5B412} />
            <pointLight position={[-10, 10, -10]} intensity={160 * 0.8} color={0xE5B412} />
            <pointLight position={[0, -5, 0]} intensity={160 * 0.6} color={0xE5B412} />

            {showText && (
              <Text
                fontSize={1.5}
                color={'#FFBB00'}
                depth={10}
                material-transparent={true}
                material-opacity={textOpacity}
              >
                勝つために{'\n'}
                プレーする
              </Text>
            )}

            <Model rotationAngle={rotationAngle} />
          </Canvas>
        </div>
      </div>
      <div className='us'>
        <div className='info'>
          <div className='morph'>
            <h1>1</h1>
          </div>
          <div className='user'>
            <div className='info1'>
              <span>
                  I'm a Penetration Tester and Bug Bounty Hunter, 
                  specializing in discovering vulnerabilities. 
                  As a Software Engineer blending development 
                  and security expertise to ensure robust solutions from the ground up.
              </span>
            </div>
            <div className='xgen'>
              <div className='inside'>
                  <h3>NEXTGNX</h3>
              </div>
              <div className='x'>
                  <h3>X</h3>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className='start-info'>
            <div className='start'></div>
            <div className='date-info'>
                <h5>
                  2025-07-01
                </h5>
                <h5 className='start-date'>
                  start design
                </h5>
            </div>
          </div>

          <div className='start-info1'>
            <div className='start1'></div>
            <div className='date-info1'>
                <h5>
                  2025-11-10
                </h5>
                <h5 className='start-date1'>
                  finish the project
                </h5>
            </div>
            </div>
      </div>

      <div className='container'>
        <div className='container2'>
            <div className='first-role'><span>Design Of The Application</span></div>
            <div className='second-role'><span>Front</span></div>
        </div>
        <div className='container2'>
            <div className='first-role1'><span>Back</span></div>
            <div className='second-role2'><span>User Management</span></div>
            <div className='second-role3'><span>Cyber Security</span></div>
        </div>
      </div>

      <div className='name'>
            <h1 className='user-name'>
            Younes<br/> BELLAKRIDI
            </h1>
      </div>
          
      </div>
    </div>
  );
}

export default App;