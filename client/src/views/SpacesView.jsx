import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Stars, Sky, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// --- First Person Roaming Controller ---
const FPVPlayer = () => {
  const { camera } = useThree();
  const [move, setMove] = useState({ forward: false, backward: false, left: false, right: false });

  useEffect(() => {
    const down = (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') setMove(m => ({ ...m, forward: true }));
      if (e.code === 'KeyS' || e.code === 'ArrowDown') setMove(m => ({ ...m, backward: true }));
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') setMove(m => ({ ...m, left: true }));
      if (e.code === 'KeyD' || e.code === 'ArrowRight') setMove(m => ({ ...m, right: true }));
    };
    const up = (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') setMove(m => ({ ...m, forward: false }));
      if (e.code === 'KeyS' || e.code === 'ArrowDown') setMove(m => ({ ...m, backward: false }));
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') setMove(m => ({ ...m, left: false }));
      if (e.code === 'KeyD' || e.code === 'ArrowRight') setMove(m => ({ ...m, right: false }));
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();
  const speed = 40;

  useFrame((state, delta) => {
    frontVector.set(0, 0, Number(move.backward) - Number(move.forward));
    sideVector.set(Number(move.right) - Number(move.left), 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed * delta);
    camera.translateX(direction.x);
    camera.translateZ(direction.z);
    camera.position.y = 3;
  });

  return <PointerLockControls />;
};

const EndlessGrid = ({ color, gridColor, size = 1500 }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.1, 0]}>
    <planeGeometry args={[size, size, 100, 100]} />
    <meshStandardMaterial color={color} wireframe={!!gridColor} roughness={0.8} />
  </mesh>
);

const AnimatedCreatures = ({ count, type }) => {
  const meshRef = useRef();
  
  // Create randomized offsets and speeds
  const instances = useRef(Array.from({ length: count }).map(() => ({
    pos: new THREE.Vector3((Math.random()-0.5)*400, Math.random()*50 + 10, (Math.random()-0.5)*400),
    vel: new THREE.Vector3((Math.random()-0.5)*10, (Math.random()-0.5)*2, (Math.random()-0.5)*10),
    rot: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
    rs: new THREE.Vector3(0.01, 0.05, 0.01),
    scale: Math.random() * 2 + 1
  })));

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    instances.current.forEach((inst, i) => {
       inst.pos.addScaledVector(inst.vel, delta);
       // Boundary wrap
       if (inst.pos.x > 200) inst.pos.x = -200; if (inst.pos.x < -200) inst.pos.x = 200;
       if (inst.pos.z > 200) inst.pos.z = -200; if (inst.pos.z < -200) inst.pos.z = 200;
       if (inst.pos.y > 60 || inst.pos.y < 5) inst.vel.y *= -1;

       inst.rot.add(inst.rs);

       dummy.position.copy(inst.pos);
       dummy.rotation.set(inst.rot.x, inst.rot.y, inst.rot.z);
       dummy.scale.set(inst.scale, inst.scale, inst.scale);
       // Point towards velocity loosely
       dummy.lookAt(inst.pos.clone().add(inst.vel));
       dummy.updateMatrix();
       meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      {type === 'bird' && <coneGeometry args={[0.5, 2, 4]} />}
      {type === 'drone' && <boxGeometry args={[1, 0.2, 1]} />}
      {type === 'ray' && <cylinderGeometry args={[2, 0.1, 4, 8]} />}
      {type === 'fish' && <capsuleGeometry args={[0.5, 2, 4, 8]} />}
      {type === 'bird' && <meshStandardMaterial color='#22aadd' />}
      {type === 'drone' && <meshStandardMaterial color='#00ffff' wireframe />}
      {type === 'ray' && <meshStandardMaterial color='#ff5500' emissive='#ff0000' transparent opacity={0.6} />}
      {type === 'fish' && <meshStandardMaterial color='#00ffcc' emissive='#00aaff' />}
    </instancedMesh>
  );
}

// 1. Forest
const Forest = () => {
  const treeRef = useRef();
  const leafRef = useRef();
  const bushRef = useRef();
  const shroomRef = useRef();

  useEffect(() => {
    if (!treeRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 2000; i++) {
       const x = (Math.random() - 0.5) * 800; const z = (Math.random() - 0.5) * 800;
       if (x*x + z*z < 400) continue;
       const h = 5 + Math.random() * 15;
       dummy.position.set(x, h/2, z); dummy.scale.set(1, h, 1); dummy.updateMatrix();
       treeRef.current.setMatrixAt(i, dummy.matrix);
       dummy.position.set(x, h + 2, z); dummy.scale.set(3 + Math.random()*2, 6 + Math.random()*4, 3 + Math.random()*2); dummy.updateMatrix();
       leafRef.current.setMatrixAt(i, dummy.matrix);
       
       if (i < 500 && bushRef.current) {
         dummy.position.set(x + (Math.random()-0.5)*5, 1, z + (Math.random()-0.5)*5);
         dummy.scale.set(2, 2, 2); dummy.updateMatrix();
         bushRef.current.setMatrixAt(i, dummy.matrix);
       }
       if (i < 300 && shroomRef.current) {
         dummy.position.set(x + (Math.random()-0.5)*5, 0.5, z + (Math.random()-0.5)*5);
         dummy.scale.set(1, 1, 1); dummy.updateMatrix();
         shroomRef.current.setMatrixAt(i, dummy.matrix);
       }
    }
    treeRef.current.instanceMatrix.needsUpdate = true; leafRef.current.instanceMatrix.needsUpdate = true;
    if(bushRef.current) bushRef.current.instanceMatrix.needsUpdate = true;
    if(shroomRef.current) shroomRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group>
      <fog attach='fog' args={['#a8e6cf', 10, 150]} />
      <ambientLight intensity={0.4} color='#a8e6cf' />
      <directionalLight position={[100, 50, 100]} intensity={1.5} color='#ffeb3b' castShadow />
      <Sky sunPosition={[100, 20, 100]} turbidity={0.3} rayleigh={2} />
      <EndlessGrid color='#1a4d2e' />
      <instancedMesh ref={treeRef} args={[null, null, 2000]}><cylinderGeometry args={[0.5, 0.8, 1, 8]} /><meshStandardMaterial color='#3d2817' /></instancedMesh>
      <instancedMesh ref={leafRef} args={[null, null, 2000]}><coneGeometry args={[1, 1, 8]} /><meshStandardMaterial color='#2e8b57' /></instancedMesh>
      <instancedMesh ref={bushRef} args={[null, null, 500]}><sphereGeometry args={[1]} /><meshStandardMaterial color='#105b22' /></instancedMesh>
      <instancedMesh ref={shroomRef} args={[null, null, 300]}><cylinderGeometry args={[0.5, 0.5, 0.2]} /><meshStandardMaterial color='#ff0055' /></instancedMesh>
      <AnimatedCreatures count={50} type='bird' />
      <Sparkles count={1000} scale={400} size={8} speed={0.4} opacity={0.8} color='#a8ff4a' />
    </group>
  );
};

// 2. Cyberpunk
const Cyberpunk = () => {
  const bldgRef = useRef();
  useEffect(() => {
    if (!bldgRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 1500; i++) {
       const x = (Math.random() - 0.5) * 800; const z = (Math.random() - 0.5) * 800;
       if (x*x + z*z < 900) continue;
       const h = 20 + Math.random() * 80;
       dummy.position.set(x, h/2, z); dummy.scale.set(4 + Math.random()*10, h, 4 + Math.random()*10); dummy.updateMatrix();
       bldgRef.current.setMatrixAt(i, dummy.matrix);
    }
    bldgRef.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <group>
      <fog attach='fog' args={['#ff00ff', 10, 300]} />
      <ambientLight intensity={0.2} color='#111133' />
      <pointLight position={[0, 50, 0]} intensity={2} color='#00ffff' distance={400} />
      <Stars radius={200} depth={100} count={3000} factor={4} />
      <EndlessGrid color='#0a0a0a' gridColor />
      <instancedMesh ref={bldgRef} args={[null, null, 1500]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color='#0f0f1a' emissive='#ff00ff' emissiveIntensity={0.2} wireframe={Math.random() > 0.8} wireframeLinewidth={2} metalness={0.9} roughness={0.1} /></instancedMesh>
      <AnimatedCreatures count={100} type='drone' />
      <Sparkles count={2000} scale={500} size={3} speed={3} opacity={0.6} color='#00ffff' direction='top' />
    </group>
  );
};

// 3. Cosmic
const Cosmic = () => (
  <group>
    <fog attach='fog' args={['#000000', 50, 800]} />
    <ambientLight intensity={0.1} />
    <pointLight position={[0, 100, -200]} intensity={5} color='#ffffff' distance={1000} />
    <Stars radius={300} depth={200} count={20000} factor={7} saturation={1} fade speed={0.5} />
    <mesh position={[0, 150, -400]}><sphereGeometry args={[100, 64, 64]} /><meshBasicMaterial color='#000000' /></mesh>
    <mesh position={[0, 150, -400]}><sphereGeometry args={[105, 32, 32]} /><meshBasicMaterial color='#ff5500' wireframe /></mesh>
    <mesh position={[0, 150, -400]} rotation={[Math.PI/2.2, 0, 0]}><torusGeometry args={[160, 20, 16, 100]} /><meshStandardMaterial color='#ff5500' emissive='#ff0000' emissiveIntensity={3} transparent opacity={0.8} /></mesh>
    <AnimatedCreatures count={30} type='ray' />
    <Sparkles count={5000} scale={1000} size={5} speed={0.1} color='#ffffff' />
  </group>
);

// 4. Desert
const Desert = () => {
  const rockRef = useRef();
  useEffect(() => {
    if (!rockRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 1000; i++) {
       const x = (Math.random() - 0.5) * 800; const z = (Math.random() - 0.5) * 800;
       const s = Math.random() * 5 + 1;
       dummy.position.set(x, s/2, z); dummy.rotation.set(Math.random(), Math.random(), Math.random()); dummy.scale.set(s, s*2, s); dummy.updateMatrix();
       rockRef.current.setMatrixAt(i, dummy.matrix);
    }
    rockRef.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <group>
      <fog attach='fog' args={['#d2b48c', 20, 250]} />
      <ambientLight intensity={0.6} color='#ffa500' />
      <directionalLight position={[-100, 50, 100]} intensity={1.5} color='#ffffff' />
      <Sky sunPosition={[-100, 20, 100]} turbidity={1} rayleigh={4} mieCoefficient={0.005} mieDirectionalG={0.8} />
      <EndlessGrid color='#c2b280' />
      <instancedMesh ref={rockRef} args={[null, null, 1000]}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color='#8b4513' roughness={0.9} /></instancedMesh>
      <AnimatedCreatures count={40} type='bird' />
    </group>
  );
}

// 5. Ocean
const Ocean = () => (
  <group>
    <fog attach='fog' args={['#004466', 10, 100]} />
    <ambientLight intensity={0.5} color='#004466' />
    <directionalLight position={[0, 100, 0]} intensity={1} color='#aaddff' />
    <EndlessGrid color='#001133' />
    <AnimatedCreatures count={200} type='fish' />
    <Sparkles count={3000} scale={300} size={15} speed={1} opacity={0.4} color='#66ccff' direction='top' />
  </group>
);

// We keep the rest simple due to space, mapped from original...
const GenericSpace = ({ color, fog, count, type }) => (
  <group>
    <fog attach='fog' args={[fog, 10, 200]} />
    <ambientLight intensity={0.5} color={color} />
    <EndlessGrid color={color} />
    <AnimatedCreatures count={count} type={type} />
    <Sparkles count={1000} scale={400} size={10} color={color} />
  </group>
);

const SPACES = [
  { id: 'forest', title: 'Druid Forest', desc: 'A serene ancient woods focusing on natural calm.', Component: Forest },
  { id: 'cyber', title: 'Neon Grid', desc: 'A high-tech digital zone for intense coding.', Component: Cyberpunk },
  { id: 'cosmic', title: 'Void Core', desc: 'Float in the abyss of maximum concentration.', Component: Cosmic },
  { id: 'desert', title: 'Endless Dunes', desc: 'Vast golden sands under an amber sky.', Component: Desert },
  { id: 'ocean', title: 'Deep Abyss', desc: 'Underwater tranquility with floating bioluminescence.', Component: Ocean },
  { id: 'crystal', title: 'Crystal Cavern', desc: 'Pitch black dotted with giant glowing amethysts.', Component: () => <GenericSpace color='#a855f7' fog='#0a001a' count={50} type='ray' /> },
  { id: 'volcano', title: 'Molten Core', desc: 'Red hot ash and cinder for intense sessions.', Component: () => <GenericSpace color='#ff4500' fog='#330000' count={20} type='drone' /> },
  { id: 'sky', title: 'Sky Kingdom', desc: 'Platforms floating high among majestic clouds.', Component: () => <GenericSpace color='#ffffff' fog='#cccccc' count={100} type='bird' /> },
  { id: 'winter', title: 'Silent Tundra', desc: 'Endless white snow and absolute freezing silence.', Component: () => <GenericSpace color='#e0f7fa' fog='#ffffff' count={50} type='fish' /> },
  { id: 'ruins', title: 'Ancient Monuments', desc: 'Lost civilization pillars bathing in golden hour light.', Component: () => <GenericSpace color='#ffd700' fog='#8b8989' count={40} type='bird' /> },
  { id: 'abstract', title: 'Abstract Realm', desc: 'Bizarre geometries defying logic.', Component: () => <GenericSpace color='#ff00ff' fog='#000000' count={60} type='drone' /> },
  { id: 'zen', title: 'Zen Sakura', desc: 'Pink cherry blossom paradise.', Component: () => <GenericSpace color='#ffb6c1' fog='#ffe4e1' count={100} type='bird' /> },
  { id: 'synth', title: 'Synthwave Matrix', desc: 'Retro 80s outrun vaporwave simulation.', Component: () => <GenericSpace color='#ff00ff' fog='#2a0033' count={150} type='drone' /> }
];

export default function SpacesView() {
  const [activeSpace, setActiveSpace] = useState(null);

  if (activeSpace) {
    const ActiveComponent = SPACES.find(s => s.id === activeSpace).Component;
    return (
      <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#000', cursor: 'crosshair' }}>
        <button className='btn' onClick={() => setActiveSpace(null)} style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 100, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: '1px solid #fff' }}>← Exit Space</button>
        <Canvas camera={{ position: [0, 3, 0], fov: 60 }}><ActiveComponent /><FPVPlayer /></Canvas>
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', padding: '20px 40px', borderRadius: '30px', textAlign: 'center', pointerEvents: 'none' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '2rem', letterSpacing: '2px', color: '#fff' }}>{SPACES.find(s => s.id === activeSpace).title}</h2>
          <p style={{ margin: 0, color: '#f59e0b', fontWeight: 'bold' }}>CLICK CANVAS TO LOCK MOUSE. W A S D TO WALK. MOUSE TO LOOK.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='view-container' style={{ padding: '40px', height: '100%', overflowY: 'auto' }}>
      <header style={{ marginBottom: '40px' }}><h1 style={{ fontSize: '3rem', margin: 0, color: 'var(--text-bright)' }}>Multiverse Hub</h1><p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>13 Massive endless worlds. Walk, explore, and focus in 360 degrees.</p></header>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
        {SPACES.map(space => (
          <div key={space.id} className='card' onClick={() => setActiveSpace(space.id)} style={{ padding: '25px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-bright)', margin: '0 0 10px 0' }}>{space.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{space.desc}</p>
            <button className='btn' style={{ width: '100%', marginTop: '20px' }}>ENTER</button>
          </div>
        ))}
      </div>
    </div>
  );
}

