import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Background3D() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // ── Particles ──────────────────────────────────────
    const pCount = 1800;
    const pPositions = new Float32Array(pCount * 3);
    const pSizes = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3]     = (Math.random() - 0.5) * 24;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      pSizes[i] = Math.random() * 1.5 + 0.5;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));

    const pMat = new THREE.PointsMaterial({
      color: 0x00e5ff, size: 0.025, transparent: true,
      opacity: 0.55, sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Wireframe Icosahedron ───────────────────────────
    const icoGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.055
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(3.5, -1, -2);
    scene.add(ico);

    // ── Wireframe Octahedron (purple) ────────────────────
    const octGeo = new THREE.OctahedronGeometry(1.4, 0);
    const octMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.06
    });
    const oct = new THREE.Mesh(octGeo, octMat);
    oct.position.set(-4, 1.5, -1.5);
    scene.add(oct);

    // ── Torus (cyan) ──────────────────────────────────────
    const torGeo = new THREE.TorusGeometry(1.2, 0.015, 8, 60);
    const torMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff, transparent: true, opacity: 0.07
    });
    const tor = new THREE.Mesh(torGeo, torMat);
    tor.position.set(-2.5, -2.2, -1);
    scene.add(tor);

    // ── Mouse parallax ─────────────────────────────────
    let mx = 0, my = 0;
    const onMouse = (e) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 0.3;
      my = (e.clientY / window.innerHeight - 0.5) * 0.2;
    };
    window.addEventListener('mousemove', onMouse);

    let animId;
    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      particles.rotation.y = t * 0.025 + mx * 0.5;
      particles.rotation.x = t * 0.01  + my * 0.3;

      ico.rotation.x = t * 0.2;
      ico.rotation.y = t * 0.3;

      oct.rotation.x = -t * 0.25;
      oct.rotation.z = t * 0.18;

      tor.rotation.x = t * 0.4;
      tor.rotation.z = t * 0.15;

      camera.position.x += (mx - camera.position.x) * 0.04;
      camera.position.y += (-my - camera.position.y) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="canvas-bg" />;
}
