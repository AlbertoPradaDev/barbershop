import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap, ScrollTrigger } from '../../lib/gsap'

export default function SkullCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current

    // ─── ESCENA ───────────────────────────────────────────
    const scene = new THREE.Scene()

    // ─── CÁMARA ───────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    )
    camera.position.z = 3

    // ─── RENDERER ─────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true

    // ─── ENTRADA SINCRONIZADA CON EL TEXTO ───────────────
    const entranceTween = gsap.fromTo(
      canvas,
      { opacity: 0 },
      { opacity: 0.9, duration: 2.5, delay: 0.8, ease: 'power2.out' }
    )

    // ─── LUCES ────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight('#ffffff', 2, 10)
    pointLight.position.set(2, 2, 2)
    scene.add(pointLight)

    const redLight = new THREE.PointLight('#8B0000', 3, 8)
    redLight.position.set(-2, -2, 1)
    scene.add(redLight)

    // ─── PARTÍCULAS ───────────────────────────────────────
    const particleCount = 200
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 8
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: '#F5F0E8',
      size: 0.02,
      transparent: true,
      opacity: 0.4,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // ─── CARGAR MODELO GLB ────────────────────────────────
    let skull = null
    const loader = new GLTFLoader()

    loader.load(
      '/models/skull.glb',
      (gltf) => {
        skull = gltf.scene

        // Centrar el modelo automáticamente
        const box = new THREE.Box3().setFromObject(skull)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        // Mover el modelo a la origen
        skull.position.sub(center)

        // Escalar para que quepa bien en pantalla
        const maxDim = Math.max(size.x, size.y, size.z)
        skull.scale.setScalar(2 / maxDim)

        scene.add(skull)
      },
      // Progreso de carga
      (xhr) => {
        console.log(`Cargando: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`)
      },
      // Error
      (error) => {
        console.error('Error cargando el modelo:', error)
      }
    )

    // ─── LOOP DE ANIMACIÓN ────────────────────────────────
    let animationId
    const clock = new THREE.Clock()

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      if (skull) {
        skull.rotation.y += 0.003
        skull.rotation.x = Math.sin(elapsed * 0.5) * 0.1
      }

      particles.rotation.y = elapsed * 0.02
      particles.rotation.x = elapsed * 0.01

      renderer.render(scene, camera)
    }

    animate()

    // ─── SCROLL ANIMATION ─────────────────────────────────
    const scrollAnim = ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        if (skull) {
          skull.rotation.y = p * Math.PI * 2
          skull.position.y = p * 0.5
        }
        redLight.intensity = 3 + p * 5
        particles.scale.setScalar(1 + p * 0.3)
      },
    })

    // ─── RESPONSIVE ───────────────────────────────────────
    const handleResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    // ─── LIMPIEZA ─────────────────────────────────────────
    return () => {
      entranceTween.kill()
      cancelAnimationFrame(animationId)
      scrollAnim.kill()
      renderer.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ opacity: 0 }}
    />
  )
}