import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap, ScrollTrigger } from '../../lib/gsap';

export default function SkullCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    // ─── 1. ESCENA ───────────────────────────────────────────
    // La escena es el "mundo" donde viven todos los objetos 3D
    const scene = new THREE.Scene();

    // ─── 2. CÁMARA ───────────────────────────────────────────
    // PerspectiveCamera(fov, aspect, near, far)
    // fov: campo de visión en grados (75 = natural, humano)
    // aspect: proporción ancho/alto del canvas
    // near/far: rango de visibilidad (objetos fuera no se renderizan)
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 3; // alejamos la cámara del centro

    // ─── 3. RENDERER ─────────────────────────────────────────
    // El renderer toma la escena + cámara y dibuja en el canvas
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true, // bordes suavizados
      alpha: true, // fondo transparente
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ─── 4. GEOMETRÍA (la calavera temporal) ─────────────────
    // Usamos una esfera por ahora como placeholder
    // Más adelante la reemplazamos con un modelo 3D real (.glb)
    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: '#F5F0E8',
      wireframe: true, // solo las aristas, estilo técnico/oscuro
    });
    const skull = new THREE.Mesh(geometry, material);
    scene.add(skull);

    // ─── 5. LUCES ────────────────────────────────────────────
    // Sin luz los materiales estándar no se ven (quedan negros)
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
    scene.add(ambientLight);

    // Luz puntual — como una bombilla en el espacio
    const pointLight = new THREE.PointLight('#ffffff', 2, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    // Luz de acento roja — desde abajo para dramatismo
    const redLight = new THREE.PointLight('#8B0000', 3, 8);
    redLight.position.set(-2, -2, 1);
    scene.add(redLight);

    // ─── 6. PARTÍCULAS ───────────────────────────────────────
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3); // x,y,z por partícula

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 8; // distribuidas en espacio de 8 unidades
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    );

    const particleMat = new THREE.PointsMaterial({
      color: '#F5F0E8',
      size: 0.02,
      transparent: true,
      opacity: 0.4,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ─── 7. ANIMACIÓN BASE (loop) ────────────────────────────
    // Este loop corre ~60 veces por segundo independientemente del scroll
    // Solo maneja la rotación suave automática y las partículas
    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotación suave automática (flotando)
      skull.rotation.y += 0.003;
      skull.rotation.x = Math.sin(elapsed * 0.5) * 0.1; // oscilación suave

      // Partículas rotan lentamente en dirección opuesta
      particles.rotation.y = elapsed * 0.02;
      particles.rotation.x = elapsed * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // ─── 8. SCROLL ANIMATION ─────────────────────────────────
    // ScrollTrigger conecta el scroll de la página con propiedades del objeto 3D
    const scrollAnim = ScrollTrigger.create({
      trigger: '#hero', // sección que dispara la animación
      start: 'top top', // cuando el top del hero llega al top del viewport
      end: 'bottom bottom', // cuando el bottom del hero llega al bottom del viewport
      scrub: 1.5, // 1.5s de suavizado — no es 1:1 brusco con el scroll
      onUpdate: (self) => {
        // self.progress va de 0 a 1 mientras scrolleas el hero
        const p = self.progress;

        // Rotación Y completa (una vuelta entera con el scroll)
        skull.rotation.y = p * Math.PI * 2;

        // Sube levemente al final del scroll
        skull.position.y = p * 0.5;

        // La luz roja se intensifica al final
        redLight.intensity = 3 + p * 5;

        // Las partículas se expanden ligeramente
        particles.scale.setScalar(1 + p * 0.3);
      },
    });

    // ─── 9. RESPONSIVE ───────────────────────────────────────
    const handleResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix(); // obligatorio después de cambiar aspect
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // ─── 10. LIMPIEZA ────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationId); // para el loop
      scrollAnim.kill(); // mata el ScrollTrigger
      renderer.dispose(); // libera memoria GPU
      geometry.dispose();
      material.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ opacity: 0.9 }}
    />
  );
}
