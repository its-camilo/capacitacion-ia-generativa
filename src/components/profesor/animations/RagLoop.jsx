import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

/**
 * Harness compartido para escenas Three.js en loop.
 *
 * Contrato de `createScene({ renderer, canvas, width, height })`:
 *   devuelve `{ scene, camera, draw(t, dt, elapsed), resize(w, h), dispose?() }`
 *   - `t` va de 0 a 1 dentro del loop y se reinicia solo.
 *   - `dt` son los segundos (acotados) desde el último frame.
 *   El harness hace render, reloj, pausa por viewport, reduced-motion y limpieza.
 */

const MAX_DELTA = 0.1 // s: tope por frame para que un tirón no salte la animación

function disposeMaterial(material) {
  for (const value of Object.values(material)) {
    if (value && value.isTexture) value.dispose()
  }
  material.dispose()
}

function disposeScene(scene) {
  scene.traverse((object) => {
    if (object.geometry) object.geometry.dispose()
    if (object.material) {
      const materials = Array.isArray(object.material) ? object.material : [object.material]
      materials.forEach(disposeMaterial)
    }
    if (object.isInstancedMesh) object.dispose()
  })
  if (scene.background && scene.background.isTexture) scene.background.dispose()
}

function RagLoop({
  createScene,
  duration = 16,
  phaseCount = 5,
  startT = 0,
  onPhaseChange,
  className = '',
  ariaLabel,
}) {
  const hostRef = useRef(null)
  const phaseCallbackRef = useRef(onPhaseChange)
  const [unsupported, setUnsupported] = useState(false)

  useEffect(() => {
    phaseCallbackRef.current = onPhaseChange
  }, [onPhaseChange])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch (error) {
      console.warn('RagLoop: WebGL no disponible', error)
      setUnsupported(true)
      return undefined
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap

    const canvas = renderer.domElement
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    host.appendChild(canvas)

    const width = Math.max(host.clientWidth, 1)
    const height = Math.max(host.clientHeight, 1)
    renderer.setSize(width, height, false)

    // Repintar bajo demanda (p. ej. cuando carga una tipografía en modo estático).
    let invalidateImpl = () => {}
    const api = createScene({ renderer, canvas, width, height, invalidate: () => invalidateImpl() })

    let disposed = false
    let rafId = 0
    let visible = true
    let lastTime = null
    let elapsed = startT * duration
    let lastPhase = -1
    let lastError = ''

    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const phaseFor = (t) => Math.min(phaseCount - 1, Math.floor(t * phaseCount))

    const renderAt = (t, dt) => {
      api.draw(t, dt, elapsed)
      renderer.render(api.scene, api.camera)
      const phase = phaseFor(t)
      if (phase !== lastPhase) {
        lastPhase = phase
        if (phaseCallbackRef.current) phaseCallbackRef.current(phase)
      }
    }

    const currentT = () => (elapsed % duration) / duration

    const frame = (now) => {
      // Se programa ANTES de actualizar: si la escena falla, el loop sigue vivo.
      rafId = requestAnimationFrame(frame)
      try {
        // Solo deltas: el timestamp absoluto del RAF no se usa como tiempo.
        let dt = 0
        if (lastTime !== null) dt = (now - lastTime) / 1000
        lastTime = now
        if (!(dt > 0)) dt = 0
        dt = Math.min(dt, MAX_DELTA)
        elapsed += dt
        renderAt(currentT(), dt)
      } catch (error) {
        const message = String(error && error.message ? error.message : error)
        if (message !== lastError) {
          lastError = message
          console.warn('RagLoop: frame fallido', error)
        }
      }
    }

    const start = () => {
      if (disposed || rafId || !visible || reducedQuery.matches) return
      lastTime = null // el primer frame tras reanudar no suma tiempo
      rafId = requestAnimationFrame(frame)
    }

    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
    }

    const paintStill = () => {
      try {
        renderAt(currentT(), 0)
      } catch (error) {
        console.warn('RagLoop: no se pudo pintar el fotograma', error)
      }
    }

    invalidateImpl = () => {
      if (!disposed && !rafId) paintStill()
    }

    // Primer fotograma síncrono: nunca se ve el canvas vacío esperando al RAF.
    paintStill()

    const handleResize = () => {
      if (disposed) return
      const w = Math.max(host.clientWidth, 1)
      const h = Math.max(host.clientHeight, 1)
      renderer.setSize(w, h, false)
      if (api.resize) api.resize(w, h)
      // Si no hay loop corriendo (reduced-motion / fuera de viewport) repinta el estático.
      if (!rafId) paintStill()
    }
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(host)
    handleResize()

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1]
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { threshold: 0.05 },
    )
    intersectionObserver.observe(host)

    const handleMotionChange = () => {
      if (reducedQuery.matches) {
        stop()
        elapsed = startT * duration
        paintStill()
      } else {
        start()
      }
    }
    reducedQuery.addEventListener('change', handleMotionChange)

    const handleContextLost = (event) => {
      event.preventDefault()
      stop()
    }
    const handleContextRestored = () => {
      if (disposed) return
      paintStill()
      start()
    }
    canvas.addEventListener('webglcontextlost', handleContextLost)
    canvas.addEventListener('webglcontextrestored', handleContextRestored)

    start()

    return () => {
      disposed = true
      stop()
      intersectionObserver.disconnect()
      resizeObserver.disconnect()
      reducedQuery.removeEventListener('change', handleMotionChange)
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      canvas.removeEventListener('webglcontextrestored', handleContextRestored)
      if (api.dispose) api.dispose()
      disposeScene(api.scene)
      renderer.dispose()
      renderer.forceContextLoss()
      if (canvas.parentNode === host) host.removeChild(canvas)
    }
    // createScene, duration, phaseCount y startT son constantes por instancia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={hostRef}
      className={`rag-loop ${className}`.trim()}
      role="img"
      aria-label={ariaLabel}
      data-unsupported={unsupported ? 'true' : undefined}
    />
  )
}

export default RagLoop
