import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { gsap, ScrollTrigger } from '../../lib/gsap'

export default function BarberPole() {
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
    // El tercer argumento `false` evita que Three.js escriba width/height
    // inline en el canvas, lo que sobreescribiría las clases Tailwind
    // (w-full h-full) y rompería la fluidez al redimensionar.
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
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

    // ─── ESTADO DEL MODELO ────────────────────────────────
    let barberPole = null
    let modelCenter = null
    let modelMaxDim = null
    let initialRotY = window.innerWidth >= 768 ? Math.PI / 4 : 0
    let scrollRotY = initialRotY
    let lastScrollP = 0
    let entrancePoleAnim = null

    // Recalcula escala, centrado y rotación base según el ancho del viewport.
    // Llamable en cualquier momento (resize, breakpoint flip) sin re-medir bbox.
    const applyTransform = () => {
      if (!barberPole || !modelCenter || !modelMaxDim) return
      const scaleFactor = window.innerWidth >= 1024 ? 2.8 : 2
      const s = scaleFactor / modelMaxDim
      initialRotY = window.innerWidth >= 768 ? Math.PI / 4 : 0
      barberPole.scale.setScalar(s)
      barberPole.position.copy(modelCenter).multiplyScalar(-s)
      // Re-sincroniza la rotación con el progreso de scroll actual
      scrollRotY = initialRotY + lastScrollP * Math.PI * 2
    }

    // ─── CARGAR MODELO GLB ────────────────────────────────
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)

    loader.load(
      '/models/barbers_pole.glb',
      (gltf) => {
        barberPole = gltf.scene

        const box = new THREE.Box3().setFromObject(barberPole)
        modelCenter = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        modelMaxDim = Math.max(size.x, size.y, size.z)

        applyTransform()
        barberPole.rotation.y = initialRotY

        barberPole.traverse((child) => {
          if (child.isMesh && child.name.includes('Metal')) {
            child.material.color.multiplyScalar(0.45)
          }
        })

        scene.add(barberPole)

        // Entrada: el modelo sube desde abajo hasta su Y final
        const finalY = barberPole.position.y
        barberPole.position.y = finalY - 2
        entrancePoleAnim = gsap.to(barberPole.position, {
          y: finalY,
          duration: 2,
          ease: 'power3.out',
          delay: 0.3,
        })
      },
      undefined,
      (error) => {
        console.error('Error cargando el modelo:', error)
      }
    )

    // ─── CHEQUEO DE RESIZE POR FRAME (mecanismo principal) ──
    // Compara el tamaño CSS del canvas (clientWidth/Height) contra el
    // tamaño del drawing buffer (canvas.width/height). Si difieren, el
    // layout cambió (resize de ventana, DevTools, transición CSS, reflow
    // del contenedor) y resincronizamos renderer + cámara + transform del
    // modelo. No depende de ningún evento.
    const resizeIfNeeded = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (w === 0 || h === 0) return
      if (canvas.width !== w || canvas.height !== h) {
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        applyTransform()
      }
    }

    // ─── LOOP DE ANIMACIÓN ────────────────────────────────
    let animationId
    const clock = new THREE.Clock()
    let autoRotateY = 0

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Chequeo de resize en cada frame — fuente de verdad
      resizeIfNeeded()

      const elapsed = clock.getElapsedTime()

      autoRotateY += 0.003

      if (barberPole) {
        barberPole.rotation.y = scrollRotY + autoRotateY
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
        lastScrollP = self.progress
        scrollRotY = initialRotY + lastScrollP * Math.PI * 2
        redLight.intensity = 3 + lastScrollP * 5
        particles.scale.setScalar(1 + lastScrollP * 0.3)
      },
    })

    // ─── RESIZE OBSERVER (secundario, belt-and-suspenders) ──
    // El chequeo por frame en animate() es el principal, pero el
    // ResizeObserver dispara `resizeIfNeeded` inmediatamente cuando el
    // contenedor cambia de tamaño, incluso si el rAF está throttled
    // (pestaña en background, etc.).
    const resizeObserver = new ResizeObserver(() => {
      resizeIfNeeded()
    })
    resizeObserver.observe(canvas)

    // ─── LIMPIEZA ─────────────────────────────────────────
    return () => {
      entranceTween.kill()
      if (entrancePoleAnim) entrancePoleAnim.kill()
      cancelAnimationFrame(animationId)
      scrollAnim.kill()
      resizeObserver.disconnect()
      renderer.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      dracoLoader.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ opacity: 0 }}
    />
  )
}
