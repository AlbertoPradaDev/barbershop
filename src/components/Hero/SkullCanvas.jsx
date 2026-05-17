import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
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
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.5

    // ─── ENTRADA SINCRONIZADA CON EL TEXTO ───────────────
    const entranceTween = gsap.fromTo(
      canvas,
      { opacity: 0 },
      { opacity: 0.9, duration: 2.5, delay: 0.8, ease: 'power2.out' }
    )

    // ─── LUCES ────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight('#ffffff', 2)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight('#ffffff', 5, 15)
    pointLight.position.set(2, 3, 3)
    scene.add(pointLight)

    const redLight = new THREE.PointLight('#8B0000', 4, 10)
    redLight.position.set(-2, -2, 1)
    scene.add(redLight)

    const rimLight = new THREE.PointLight('#ffffff', 3, 10)
    rimLight.position.set(0, 2, -3)
    scene.add(rimLight)

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
    const initialRotY = window.innerWidth >= 768 ? Math.PI / 4 : 0
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)

    loader.load(
      '/models/barbers_pole.glb',
      (gltf) => {
        skull = gltf.scene

        // Centrar y escalar el modelo correctamente
        const box = new THREE.Box3().setFromObject(skull)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        const maxDim = Math.max(size.x, size.y, size.z)
        const scaleFactor = window.innerWidth >= 1024 ? 2.8 : 2

        skull.scale.setScalar(scaleFactor / maxDim)
        // Centrar DESPUÉS de escalar para que el pivot no desplace el modelo
        skull.position.copy(center).multiplyScalar(-scaleFactor / maxDim)
        skull.rotation.y = initialRotY

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
          skull.rotation.y = initialRotY + p * Math.PI * 2
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
      dracoLoader.dispose()
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