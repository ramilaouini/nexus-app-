import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

const ProceduralRealisticElf = ({ equipped }) => {
  const group = useRef();
  const leftArm = useRef();
  const rightArm = useRef();
  const leftLeg = useRef();
  const rightLeg = useRef();
  const head = useRef();
  const wings = useRef();
  
  const skinColor = equipped?.skin?.baseColor || '#4b0082';
  const name = equipped?.skin?.name || 'Void Walker';
  
  const matSkin = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.2, metalness: 0.8, emissive: skinColor, emissiveIntensity: 0.2 });
  const matFlesh = new THREE.MeshStandardMaterial({ color: '#ffdcbe', roughness: 0.4 });

  let WingComponent;
  if(name.includes('Ranger')) {
     WingComponent = () => (
       <group ref={wings} position={[0, 1.2, -0.2]} rotation={[0.4, 0, 0]}>
         <mesh position={[-0.4, 0, -0.1]} rotation={[0, -0.4, 0.4]}><planeGeometry args={[0.8, 2]} /><meshStandardMaterial color='#228b22' side={THREE.DoubleSide} /></mesh>
         <mesh position={[0.4, 0, -0.1]} rotation={[0, 0.4, -0.4]}><planeGeometry args={[0.8, 2]} /><meshStandardMaterial color='#228b22' side={THREE.DoubleSide} /></mesh>
       </group>
     );
  } else if(name.includes('Cyber')) {
     WingComponent = () => (
       <group ref={wings} position={[0, 1.5, -0.3]}>
         <mesh position={[-0.6, 0.5, 0]} rotation={[0, 0, 0.6]}><boxGeometry args={[1.5, 0.1, 0.05]} /><meshBasicMaterial color='#00ffff' wireframe /></mesh>
         <mesh position={[0.6, 0.5, 0]} rotation={[0, 0, -0.6]}><boxGeometry args={[1.5, 0.1, 0.05]} /><meshBasicMaterial color='#00ffff' wireframe /></mesh>
         <mesh position={[-0.4, 0, 0]} rotation={[0, 0, 0.8]}><boxGeometry args={[1.2, 0.1, 0.05]} /><meshBasicMaterial color='#00ffff' /></mesh>
         <mesh position={[0.4, 0, 0]} rotation={[0, 0, -0.8]}><boxGeometry args={[1.2, 0.1, 0.05]} /><meshBasicMaterial color='#00ffff' /></mesh>
       </group>
     );
  } else if(name.includes('Paladin')) {
     WingComponent = () => (
       <group ref={wings} position={[0, 1.5, -0.3]}>
         {Array.from({length: 6}).map((_, i) => (
           <mesh key={'l-'+i} position={[-0.3 - i*0.15, 0.5 - i*0.1, 0]} rotation={[0, 0, 0.5 - i*0.1]}>
             <cylinderGeometry args={[0.02, 0.05, 1.5, 4]} /><meshStandardMaterial color='#ffd700' emissive='#ffaa00' />
           </mesh>
         ))}
         {Array.from({length: 6}).map((_, i) => (
           <mesh key={'r-'+i} position={[0.3 + i*0.15, 0.5 - i*0.1, 0]} rotation={[0, 0, -0.5 + i*0.1]}>
             <cylinderGeometry args={[0.02, 0.05, 1.5, 4]} /><meshStandardMaterial color='#ffd700' emissive='#ffaa00' />
           </mesh>
         ))}
       </group>
     );
  } else {
     WingComponent = () => (
       <group ref={wings} position={[0, 1.5, -0.2]}>
         <mesh position={[-0.5, 0.5, 0]} rotation={[0, 0, 0.4]}><coneGeometry args={[0.3, 1.5, 3]} /><meshStandardMaterial color={skinColor} transparent opacity={0.8} emissive={skinColor} /></mesh>
         <mesh position={[0.5, 0.5, 0]} rotation={[0, 0, -0.4]}><coneGeometry args={[0.3, 1.5, 3]} /><meshStandardMaterial color={skinColor} transparent opacity={0.8} emissive={skinColor} /></mesh>
       </group>
     );
  }

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      // Extensive Movement: Flying, sweeping, orbiting around the canvas
      group.current.position.y = Math.sin(t * 3) * 0.3 - 0.5;
      group.current.position.x = Math.sin(t * 1.5) * 1.2;
      group.current.position.z = Math.cos(t * 1.5) * 0.8;
      group.current.rotation.y = Math.sin(t * 1.5) * 0.5 + Math.cos(t * 0.3) * 0.2;
      group.current.rotation.z = Math.sin(t * 1.5) * 0.2;
      group.current.rotation.x = Math.sin(t * 3) * 0.1;
    }
    // Dynamic flying poses for arms and legs
    if (leftArm.current) leftArm.current.rotation.x = Math.sin(t * 5) * 0.3 - 0.2;
    if (rightArm.current) rightArm.current.rotation.x = Math.cos(t * 5) * 0.3 - 0.5;
    if (leftLeg.current) leftLeg.current.rotation.x = Math.sin(t * 5) * 0.4 + 0.2;
    if (rightLeg.current) rightLeg.current.rotation.x = Math.cos(t * 5) * 0.4 + 0.2;
    if (head.current) {
        head.current.rotation.y = Math.sin(t * 2) * 0.3;
        head.current.rotation.x = Math.sin(t * 1) * 0.2;
    }
    if (wings.current) wings.current.rotation.y = Math.sin(t * 15) * 0.2; // faster flapping
  });

  return (
    <group ref={group} scale={0.65}>
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.25, 0.15, 0.9, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.2} metalness={0.9} />
      </mesh>
       <mesh position={[0, 1.6, 0.05]}>
         <boxGeometry args={[0.4, 0.4, 0.4]} />
         <meshStandardMaterial color='#ffffff' metalness={1} roughness={0} emissive={skinColor} emissiveIntensity={0.5} />
       </mesh>

      <group ref={head} position={[0, 2.1, 0]}>
        <mesh position={[0, 0, 0.05]}><sphereGeometry args={[0.22, 32, 32]} /><primitive object={matFlesh} /></mesh>
        <mesh position={[0, 0.1, -0.05]}><sphereGeometry args={[0.23, 16, 16]} /><primitive object={matSkin} /></mesh>
        <mesh position={[-0.08, 0.05, 0.22]}><sphereGeometry args={[0.03, 16, 16]} /><meshBasicMaterial color='#ffffff' /></mesh>
        <mesh position={[0.08, 0.05, 0.22]}><sphereGeometry args={[0.03, 16, 16]} /><meshBasicMaterial color='#ffffff' /></mesh>
        <mesh position={[-0.22, 0, 0]} rotation={[0, 0.2, 1]}><coneGeometry args={[0.05, 0.4, 16]} /><primitive object={matFlesh} /></mesh>
        <mesh position={[0.22, 0, 0]} rotation={[0, -0.2, -1]}><coneGeometry args={[0.05, 0.4, 16]} /><primitive object={matFlesh} /></mesh>
      </group>

      <WingComponent />

      {equipped?.backpack && (
        <group position={[0, 1.5, -0.25]}>
          {equipped.backpack.shape === 'box' && (<mesh><boxGeometry args={[0.4, 0.5, 0.2]} /><meshStandardMaterial color={equipped.backpack.baseColor||equipped.backpack.color} roughness={0.9} /></mesh>)}
          {equipped.backpack.shape === 'sphere' && (<mesh><sphereGeometry args={[0.3, 32, 32]} /><meshStandardMaterial color={equipped.backpack.baseColor||equipped.backpack.color} roughness={0.4} /></mesh>)}
          {equipped.backpack.shape === 'crate' && (
             <group>
               <mesh><boxGeometry args={[0.45, 0.45, 0.25]} /><meshStandardMaterial color='#333' metalness={0.8} /></mesh>
               <mesh><boxGeometry args={[0.48, 0.48, 0.28]} /><meshBasicMaterial color={equipped.backpack.color} wireframe /></mesh>
             </group>
          )}
          {equipped.backpack.shape === 'cylinder' && (<mesh rotation={[0,0,Math.PI/4]}><cylinderGeometry args={[0.15, 0.15, 0.6, 16]} /><meshStandardMaterial color='#654321' /></mesh>)}
        </group>
      )}

      <group position={[-0.35, 1.7, 0]} ref={leftArm}>
        <mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.06, 0.05, 0.6]} /><primitive object={matSkin} /></mesh>
      </group>
      <group position={[-0.12, 0.9, 0]} ref={leftLeg}>
        <mesh position={[0, -0.4, 0]}><cylinderGeometry args={[0.08, 0.06, 0.8]} /><primitive object={matSkin} /></mesh>
      </group>
      <group position={[0.12, 0.9, 0]} ref={rightLeg}>
        <mesh position={[0, -0.4, 0]}><cylinderGeometry args={[0.08, 0.06, 0.8]} /><primitive object={matSkin} /></mesh>
      </group>

      <group position={[0.35, 1.7, 0]} ref={rightArm}>
        <mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.06, 0.05, 0.6]} /><primitive object={matSkin} /></mesh>
        
        {equipped?.item && (
          <group position={[0, -0.6, 0.1]} rotation={[Math.PI/2, 0, 0]}>
            {equipped.item.shape === 'sword' && (
              <group position={[0, 0.5, 0]}>
                 <mesh><boxGeometry args={[0.04, 1.2, 0.1]} /><meshStandardMaterial color={equipped.item.color} metalness={1} roughness={0.1} emissive={equipped.item.color} emissiveIntensity={0.8} /></mesh>
                 <mesh position={[0,-0.6,0]}><boxGeometry args={[0.2, 0.05, 0.1]} /><meshStandardMaterial color='#ffd700' /></mesh>
              </group>
            )}
            {equipped.item.shape === 'staff' && (
              <group position={[0, 0.8, 0]}>
                <mesh><cylinderGeometry args={[0.03, 0.03, 2, 8]} /><meshStandardMaterial color='#5c4033' /></mesh>
                <mesh position={[0,1,0]}><sphereGeometry args={[0.15]} /><meshStandardMaterial color={equipped.item.color} emissive={equipped.item.color} emissiveIntensity={2} /></mesh>
              </group>
            )}
            {equipped.item.shape === 'book' && (
              <group position={[0, 0, 0.2]} rotation={[0,0,-0.5]}>
                 <mesh><boxGeometry args={[0.3, 0.4, 0.08]} /><meshStandardMaterial color={equipped.item.color} /></mesh>
                 <mesh position={[0.02,0,0]}><boxGeometry args={[0.28, 0.38, 0.1]} /><meshStandardMaterial color='#fff' /></mesh>
              </group>
            )}
            {equipped.item.shape === 'orb' && (
              <mesh position={[0, 0.3, 0]}><sphereGeometry args={[0.2, 32, 32]} /><meshStandardMaterial color={equipped.item.color} transparent opacity={0.6} emissive={equipped.item.color} emissiveIntensity={2} /></mesh>
            )}
            {equipped.item.shape === 'bow' && (
              <mesh position={[0, 0.4, 0]} rotation={[0, Math.PI/2, 0]}>
                <torusGeometry args={[0.4, 0.03, 8, 30, Math.PI]} /><meshStandardMaterial color={equipped.item.color} emissive={equipped.item.color} />
              </mesh>
            )}
            {equipped.item.shape === 'lantern' && (
              <group position={[0, -0.4, 0]}>
                <mesh><cylinderGeometry args={[0.1, 0.1, 0.3, 8]} /><meshBasicMaterial color='#000' wireframe /></mesh>
                <mesh><sphereGeometry args={[0.08]} /><meshStandardMaterial color={equipped.item.color} emissive={equipped.item.color} emissiveIntensity={3} /></mesh>
              </group>
            )}
          </group>
        )}
      </group>
    </group>
  );
};

export default function MiniGuide({ equipped }) {
  const [open, setOpen] = useState(false);
  const [chatLog, setChatLog] = useState([{ sender: 'bot', text: 'Greetings! I am equipped and ready. How can I assist you today?' }]);
  const [inputVal, setInputVal] = useState('');
  
  // Make the entire guide div float around the screen randomly
  const [pos, setPos] = useState({ x: 30, y: 30 });
  const [velocity, setVelocity] = useState({ x: 0.5, y: 0.3 });

  useEffect(() => {
    // A simple bounce-around logic so it floats on the screen instead of sitting still
    const interval = setInterval(() => {
       setPos(p => {
          let newX = p.x + velocity.x;
          let newY = p.y + velocity.y;
          let nvX = velocity.x;
          let nvY = velocity.y;

          if(newX > window.innerWidth - 300 || newX < 0) nvX = -velocity.x;
          if(newY > window.innerHeight - 450 || newY < 0) nvY = -velocity.y;

          setVelocity({ x: nvX, y: nvY });
          return { x: newX, y: newY };
       });
    }, 50);
    return () => clearInterval(interval);
  }, [velocity]);

  const handleAsk = (e) => {
    e.preventDefault();
    if(!inputVal.trim()) return;
    setChatLog(prev => [...prev, { sender: 'user', text: inputVal }]);
    setTimeout(() => {
      setChatLog(prev => [...prev, { sender: 'bot', text: 'I am tracking your request: ' + inputVal + '. My sensors are scanning the environment!' }]);
    }, 1000);
    setInputVal('');
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: pos.y + 'px', 
      right: pos.x + 'px', 
      zIndex: 9999, 
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', pointerEvents: 'none',
      transition: 'bottom 0.1s linear, right 0.1s linear'
    }}>
      {open && (
        <div style={{
          background: 'rgba(15, 15, 20, 0.9)', border: '1px solid var(--primary)', borderRadius: '16px',
          padding: '20px', marginBottom: '20px', width: '350px', color: 'var(--text-bright)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', animation: 'fadeIn 0.3s ease',
          pointerEvents: 'auto', display: 'flex', flexDirection: 'column', maxHeight: '400px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '10px' }}>
             <h4 style={{ margin: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🧝</span> Nexus Guide AI
             </h4>
             <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
             {chatLog.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)', color: msg.sender === 'user' ? '#000' : '#fff', padding: '8px 12px', borderRadius: '12px', fontSize: '0.9rem', maxWidth: '85%' }}>
                  {msg.text}
                </div>
             ))}
          </div>
          <form onSubmit={handleAsk} style={{ display: 'flex', gap: '10px' }}>
            <input type='text' value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder='Ask me anything...' style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: '#fff' }} />
            <button type='submit' className='btn' style={{ padding: '0 15px' }}>Ask</button>
          </form>
          <div style={{ marginTop: '10px' }}>
             <button className='btn' onClick={() => setChatLog(prev => [...prev, { sender: 'bot', text: 'Status: Optimal! Keep studying!'}])} style={{ width: '100%', padding: '8px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>Get Status Report</button>
          </div>
        </div>
      )}

      <div 
        onClick={() => !open && setOpen(true)}
        style={{
          width: '280px', height: '400px', pointerEvents: 'auto', cursor: open ? 'default' : 'pointer',
          borderRadius: '24px', overflow: 'hidden', position: 'relative', border: open ? '2px solid var(--primary)' : '2px solid transparent',
          boxShadow: open ? '0 0 30px var(--primary)' : 'none', transition: 'all 0.3s'
        }}
      >
        <Canvas camera={{ position: [0, 1.5, 4], fov: 60 }}>
          <Environment preset='city' />
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={2} color='#ffffff' />
          <pointLight position={[-10, 5, -10]} intensity={1} color={equipped?.skin?.color || '#a855f7'} />
          <ProceduralRealisticElf equipped={equipped} />
          <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/2} />
        </Canvas>
      </div>
    </div>
  );
}
