import * as THREE from 'three'
import {
  FONT_BODY,
  FONT_DISPLAY,
  PALETTE,
  clamp01,
  lerp,
  makeGlowTexture,
  makeStarField,
  roundRectPath,
  roundedSlab,
  seg,
  smooth,
} from './threeKit'

/**
 * Kit común para las escenas de práctica de la Sesión 2 (RAG).
 * Cada escena sigue el mismo contrato que ideaScene: `draw(t)` es una función
 * pura del tiempo T dentro del loop, así cada vuelta es idéntica.
 */

export const FONT_MONO = "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace"
export { FONT_BODY, FONT_DISPLAY, PALETTE }

/** Colores por curso (cian, violeta, coral) para la práctica 2. */
export const COURSE_COLORS = ['#44d3fe', '#a98bff', '#ff8a70']

export const LOOP = 16
export const PHASE_LEN = LOOP / 5

/** Fase 0..4 a partir de T. */
export const phaseOf = (T) => Math.min(4, Math.max(0, Math.floor(T / PHASE_LEN)))

/* ------------------------------------------------------------------ */
/* Texturas de canvas con repintado                                    */
/* ------------------------------------------------------------------ */

/**
 * Textura dibujada en canvas con `repaint()` manual. Se repinta sola cuando
 * terminan de cargar las tipografías y pide un repintado de la escena.
 */
export function makeTex(width, height, draw, invalidate) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4

  const paint = () => {
    ctx.clearRect(0, 0, width, height)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.globalAlpha = 1
    draw(ctx, width, height)
    texture.needsUpdate = true
  }
  paint()

  let dead = false
  texture.addEventListener('dispose', () => {
    dead = true
  })
  if (typeof document !== 'undefined' && document.fonts && document.fonts.load) {
    Promise.all([
      document.fonts.load(`800 40px ${FONT_DISPLAY}`),
      document.fonts.load(`700 40px ${FONT_DISPLAY}`),
      document.fonts.load(`500 24px ${FONT_BODY}`),
      document.fonts.load(`500 24px ${FONT_MONO}`),
    ])
      .then(() => {
        if (dead) return
        paint()
        if (invalidate) invalidate()
      })
      .catch(() => {})
  }
  texture.userData.repaint = paint
  return texture
}

/** Escribe texto reduciendo la fuente hasta que quepa en `maxWidth`. */
export function fitText(ctx, text, x, y, { weight = 700, size = 40, family = FONT_DISPLAY, maxWidth, color, align = 'left', minSize = 10 }) {
  let px = size
  ctx.font = `${weight} ${px}px ${family}`
  if (maxWidth) {
    while (px > minSize && ctx.measureText(text).width > maxWidth) {
      px -= 1
      ctx.font = `${weight} ${px}px ${family}`
    }
  }
  ctx.textAlign = align
  if (color) ctx.fillStyle = color
  ctx.fillText(text, x, y)
  ctx.textAlign = 'left'
  return px
}

/* ------------------------------------------------------------------ */
/* Fondo, luces y cámara                                               */
/* ------------------------------------------------------------------ */

function makeStageBackground() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  const { width: w, height: h } = canvas
  ctx.fillStyle = '#021536'
  ctx.fillRect(0, 0, w, h)
  ctx.save()
  ctx.translate(w / 2, h)
  ctx.scale(w * 0.75, h * 1.1)
  const base = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
  base.addColorStop(0, '#031a4d')
  base.addColorStop(0.55, '#042361')
  base.addColorStop(1, '#021536')
  ctx.fillStyle = base
  ctx.fillRect(-1, -1, 2, 2)
  ctx.restore()
  ctx.save()
  ctx.translate(w / 2, h * 0.42)
  ctx.scale(w * 0.4, h * 0.36)
  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
  halo.addColorStop(0, 'rgba(69,116,185,0.38)')
  halo.addColorStop(1, 'rgba(69,116,185,0)')
  ctx.fillStyle = halo
  ctx.fillRect(-1, -1, 2, 2)
  ctx.restore()
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/** Rejilla de suelo difuminada hacia los bordes (se ve con el blending aditivo). */
function makeFloorGridTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  const { width: w, height: h } = canvas
  ctx.strokeStyle = 'rgba(120,200,255,0.55)'
  ctx.lineWidth = 2
  for (let x = 0; x <= w; x += 64) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
  for (let y = 0; y <= h; y += 64) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }
  ctx.globalCompositeOperation = 'destination-in'
  const mask = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.5)
  mask.addColorStop(0, 'rgba(0,0,0,0.9)')
  mask.addColorStop(0.55, 'rgba(0,0,0,0.35)')
  mask.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = mask
  ctx.fillRect(0, 0, w, h)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

/**
 * Escenario común: niebla, fondo, key/fill/rim, sombras suaves, estrellas,
 * polvo, suelo y cámara con deriva suave.
 *
 * `frame`:
 *   wideHalfW   semiancho (unidades) que debe caber en pantallas anchas
 *   narrowHalfW semiancho en pantallas estrechas (la cámara sigue el foco)
 *   halfH       semialto visible
 *   camY, lookY altura de la cámara y del punto de mira
 */
export function createStage({ canvas, width, height, _invalidate, duration = LOOP, fov = 34, frame }) {
  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x042361, 24, 62)

  const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 140)
  const glow = makeGlowTexture()
  scene.background = makeStageBackground()

  scene.add(new THREE.HemisphereLight(0x9fc4ff, 0x061a4d, 0.8))

  const reach = frame.wideHalfW + 2
  const key = new THREE.DirectionalLight(0xfff0d8, 2.7)
  key.position.set(-5, 10, 10)
  key.castShadow = true
  const shadowSize = width < 600 ? 1024 : 2048
  key.shadow.mapSize.set(shadowSize, shadowSize)
  key.shadow.camera.left = -reach
  key.shadow.camera.right = reach
  key.shadow.camera.top = 10
  key.shadow.camera.bottom = -6
  key.shadow.camera.near = 1
  key.shadow.camera.far = 46
  key.shadow.radius = 4
  key.shadow.bias = -0.0004
  key.shadow.normalBias = 0.03
  scene.add(key)

  const fill = new THREE.DirectionalLight(0x44d3fe, 0.95)
  fill.position.set(9, 3, 8)
  scene.add(fill)

  const rim = new THREE.DirectionalLight(0x6aa0ff, 2.1)
  rim.position.set(0, 7, -11)
  scene.add(rim)

  const spot = new THREE.PointLight(0xffe2a0, 34, 15, 2)
  spot.position.set(0, 4, 5)
  scene.add(spot)

  const stars = makeStarField({
    count: 260,
    box: { x: 70, yMin: -4, yMax: 20, zMin: -36, zMax: -8 },
    size: 0.2,
    opacity: 0.7,
    glow,
    seed: 3,
  })
  scene.add(stars)
  const dust = makeStarField({
    count: 120,
    box: { x: 36, yMin: 0, yMax: 9, zMin: -5, zMax: 8 },
    size: 0.07,
    opacity: 0.32,
    glow,
    seed: 9,
  })
  scene.add(dust)

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 32),
    new THREE.ShadowMaterial({ color: 0x010818, opacity: 0.45 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  const grid = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 30),
    new THREE.MeshBasicMaterial({
      map: makeFloorGridTexture(),
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )
  grid.rotation.x = -Math.PI / 2
  grid.position.y = 0.004
  scene.add(grid)

  /* ---- cámara ---- */
  const tanHalf = Math.tan((fov * Math.PI) / 360)
  let narrow = 0
  let dist = 18

  function resize(w, h) {
    const aspect = w / h
    camera.aspect = aspect
    narrow = clamp01((1.85 - aspect) / 0.6)
    const halfW = lerp(frame.wideHalfW, frame.narrowHalfW, narrow)
    dist = Math.max(halfW / (tanHalf * aspect), frame.halfH / tanHalf)
    camera.updateProjectionMatrix()
  }
  resize(width, height)

  let lastOpacity = -1

  /** Cámara + fondo + fundido del borde del loop. `fx` es la x que se sigue en móvil. */
  function update(T, fx = 0) {
    const fade = smooth(seg(T, 0, 0.5)) * (1 - smooth(seg(T, duration - 0.55, duration)))
    const quantized = Math.round(fade * 100) / 100
    if (quantized !== lastOpacity) {
      lastOpacity = quantized
      canvas.style.opacity = String(quantized)
    }

    const camX = lerp(fx * 0.02, fx, narrow) + Math.sin(T * 0.5) * 0.4
    camera.position.set(
      camX,
      frame.camY + Math.sin(T * 0.37) * 0.22,
      dist + Math.sin(T * 0.29) * 0.4,
    )
    camera.lookAt(camX * 0.95, frame.lookY + Math.sin(T * 0.41) * 0.1, 0)

    stars.position.x = Math.sin(T * 0.12) * 0.6
    stars.material.opacity = 0.62 + Math.sin(T * 1.7) * 0.1
    dust.position.y = Math.sin(T * 0.3) * 0.25
    dust.rotation.y = T * 0.012
    dust.material.opacity = 0.28 + Math.sin(T * 1.1 + 1) * 0.06
    spot.intensity = 34 + Math.sin(T * 2.2) * 4
  }

  function dispose() {
    glow.dispose()
  }

  return { scene, camera, glow, key, fill, rim, spot, update, resize, dispose, isNarrow: () => narrow }
}

/* ------------------------------------------------------------------ */
/* Geometría reutilizable                                              */
/* ------------------------------------------------------------------ */

const slabCache = new Map()
/** Losa con bisel (geometría compartida por tamaño). */
export function cachedSlab(w, h, depth, radius, bevel) {
  const key = [w, h, depth, radius, bevel].join('|')
  let slab = slabCache.get(key)
  if (!slab) {
    slab = roundedSlab(w, h, depth, radius, bevel)
    slabCache.set(key, slab)
  }
  return slab
}

/**
 * Losa con cara texturizada. `edge` es el color del canto.
 * Devuelve { group, slab, face, edgeMat, faceMat, thickness }.
 */
export function makeSlabCard({
  w,
  h,
  depth = 0.06,
  radius = 0.12,
  bevel = 0.026,
  edge = '#efe6cb',
  texture = null,
  faceColor = '#ffffff',
  roughness = 0.7,
  metalness = 0.02,
  edgeRoughness = 0.6,
  edgeMetalness = 0.05,
  emissive = '#f4cb18',
  inset = 0.05,
  castShadow = true,
}) {
  const group = new THREE.Group()
  const base = cachedSlab(w, h, depth, radius, bevel)
  const edgeMat = new THREE.MeshStandardMaterial({
    color: edge,
    roughness: edgeRoughness,
    metalness: edgeMetalness,
    emissive,
    emissiveIntensity: 0,
  })
  const slab = new THREE.Mesh(base.geometry, edgeMat)
  slab.castShadow = castShadow
  slab.receiveShadow = true
  group.add(slab)

  const faceMat = new THREE.MeshStandardMaterial({
    map: texture,
    color: texture ? 0xffffff : faceColor,
    roughness,
    metalness,
    emissive,
    emissiveIntensity: 0,
    transparent: true,
  })
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w - inset, h - inset), faceMat)
  face.position.z = base.thickness / 2 + 0.004
  face.receiveShadow = true
  group.add(face)

  return { group, slab, face, edgeMat, faceMat, thickness: base.thickness }
}

/** Fija opacidad de un Slab Card entero (cara + canto). */
export function setCardOpacity(card, value) {
  card.faceMat.opacity = value
  card.edgeMat.transparent = value < 0.999
  card.edgeMat.opacity = value
  card.group.visible = value > 0.003
}

/** Pulso de brillo emisivo sobre un Slab Card. */
export function flashCard(card, amount) {
  card.edgeMat.emissiveIntensity = amount
  card.faceMat.emissiveIntensity = amount * 0.6
}

/* ---------------- vigas (cilindros entre dos puntos) ---------------- */

const UP = new THREE.Vector3(0, 1, 0)
const beamDir = new THREE.Vector3()

export function makeBeam(color = 0x8fe3ff, opacity = 0.8, additive = true) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 1, 8, 1, true),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
      fog: false,
    }),
  )
  mesh.visible = false
  return mesh
}

export function setBeam(mesh, a, b, radius = 0.03) {
  beamDir.subVectors(b, a)
  const length = beamDir.length()
  if (length < 0.0001) {
    mesh.visible = false
    return
  }
  mesh.visible = true
  mesh.position.addVectors(a, b).multiplyScalar(0.5)
  mesh.quaternion.setFromUnitVectors(UP, beamDir.multiplyScalar(1 / length))
  mesh.scale.set(radius, length, radius)
}

/** Tubo sobre una curva, con progreso 0..1 mediante drawRange. */
export const TUBE_RADIAL = 6
export function makeArcTube(curve, radius, color, opacity = 0.85, segments = 48) {
  const mesh = new THREE.Mesh(
    new THREE.TubeGeometry(curve, segments, radius, TUBE_RADIAL, false),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    }),
  )
  mesh.userData.segments = segments
  mesh.geometry.setDrawRange(0, 0)
  return mesh
}

export function setArcProgress(mesh, progress) {
  const count = Math.floor(clamp01(progress) * mesh.userData.segments) * TUBE_RADIAL * 6
  mesh.geometry.setDrawRange(0, count)
  mesh.visible = count > 0
}

/* ---------------- destellos y chispas ---------------- */

/**
 * Sistema de chispas de ráfagas deterministas. `update(T, bursts)` recibe
 * [{ t, x, y, z, color: THREE.Color, speed, life, lift }] y coloca las partículas.
 */
export function createBurstSystem({ glow, maxBursts = 8, perBurst = 22, seed = 5, size = 0.3 }) {
  const count = maxBursts * perBurst
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const dirs = []
  let a = seed >>> 0
  const rand = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  for (let i = 0; i < perBurst; i += 1) {
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    dirs.push({
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.sin(phi) * Math.sin(theta) * 0.8,
      z: Math.cos(phi) * 0.7,
      s: 0.45 + rand() * 0.8,
    })
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size,
      map: glow,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      fog: false,
    }),
  )
  points.frustumCulled = false

  function update(T, bursts) {
    colors.fill(0)
    for (let b = 0; b < bursts.length && b < maxBursts; b += 1) {
      const burst = bursts[b]
      const age = T - burst.t
      if (age < 0 || age > burst.life) continue
      const k = age / burst.life
      const fade = (1 - k) * (1 - k)
      const speed = burst.speed || 2.6
      const lift = burst.lift === undefined ? 0.8 : burst.lift
      for (let i = 0; i < perBurst; i += 1) {
        const d = dirs[i]
        const index = (b * perBurst + i) * 3
        const travel = (1 - Math.pow(1 - k, 2)) * speed * d.s
        positions[index] = burst.x + d.x * travel
        positions[index + 1] = burst.y + d.y * travel + lift * k - 1.4 * k * k
        positions[index + 2] = burst.z + d.z * travel
        colors[index] = burst.color.r * fade
        colors[index + 1] = burst.color.g * fade
        colors[index + 2] = burst.color.b * fade
      }
    }
    geometry.attributes.position.needsUpdate = true
    geometry.attributes.color.needsUpdate = true
  }
  return { points, update }
}

/** Onda circular que se expande (anillo aditivo). */
export function makeShockRing(color = 0xffffff) {
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.95, 1, 64),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      fog: false,
    }),
  )
  ring.visible = false
  return ring
}

export function setShockRing(ring, age, life, maxScale) {
  if (age < 0 || age > life) {
    ring.visible = false
    return
  }
  const k = age / life
  ring.visible = true
  const s = Math.max(0.0001, maxScale * (1 - Math.pow(1 - k, 3)))
  ring.scale.set(s, s, 1)
  ring.material.opacity = (1 - k) * 0.75
}

/* ------------------------------------------------------------------ */
/* Objetos compartidos                                                 */
/* ------------------------------------------------------------------ */

/** Lupa: aro metálico, cristal translúcido, mango y brillo. */
export function makeMagnifier({ radius = 0.9, color = 0xf4cb18, glass = 0x9fe8ff } = {}) {
  const group = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.75,
    roughness: 0.28,
    emissive: color,
    emissiveIntensity: 0.12,
  })
  const rim = new THREE.Mesh(new THREE.TorusGeometry(radius, radius * 0.1, 18, 64), metal)
  rim.castShadow = true
  group.add(rim)

  const lens = new THREE.Mesh(
    new THREE.CircleGeometry(radius * 0.97, 48),
    new THREE.MeshPhysicalMaterial({
      color: glass,
      transparent: true,
      opacity: 0.2,
      roughness: 0.05,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      depthWrite: false,
    }),
  )
  lens.position.z = 0.01
  group.add(lens)

  const handle = new THREE.Mesh(new THREE.CapsuleGeometry(radius * 0.13, radius * 1.0, 8, 16), metal)
  handle.position.set(radius * 0.92, -radius * 0.92, 0)
  handle.rotation.z = Math.PI / 4
  handle.castShadow = true
  group.add(handle)

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.17, radius * 0.17, radius * 0.2, 16), metal)
  collar.position.set(radius * 0.72, -radius * 0.72, 0)
  collar.rotation.z = Math.PI / 4
  group.add(collar)

  return { group, rim, lens, metal }
}

/** Moneda-sello con la cara texturizada (verificación). */
export function makeSealCoin(radius, faceTexture) {
  const group = new THREE.Group()
  const side = new THREE.MeshStandardMaterial({ color: 0xf1c40f, metalness: 0.85, roughness: 0.28 })
  const cap = new THREE.MeshStandardMaterial({
    map: faceTexture,
    roughness: 0.4,
    metalness: 0.1,
    emissive: new THREE.Color(0x1f8a5b),
    emissiveIntensity: 0.18,
  })
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.16, 56), [side, cap, cap])
  coin.rotation.x = Math.PI / 2
  coin.castShadow = true
  group.add(coin)
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(radius, radius * 0.07, 14, 56),
    new THREE.MeshStandardMaterial({ color: 0xf6d44a, metalness: 0.9, roughness: 0.25 }),
  )
  group.add(rim)
  return { group, coin, cap }
}

/** Cuaderno cerrado: tapa de cuero con título, lomo de anillas y goma elástica. */
export function drawNotebookCover(ctx, w, h, { title, subtitle, color = '#0b3a7a', band = '#f4cb18' }) {
  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, '#1a56a8')
  bg.addColorStop(1, color)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  // grano de cuero
  ctx.globalAlpha = 0.06
  ctx.fillStyle = '#ffffff'
  for (let i = 0; i < 900; i += 1) {
    ctx.fillRect(((i * 97) % w), ((i * 57) % h), 2, 2)
  }
  ctx.globalAlpha = 1
  // marco
  ctx.strokeStyle = 'rgba(244,203,24,0.85)'
  ctx.lineWidth = 6
  roundRectPath(ctx, w * 0.1, h * 0.09, w * 0.8, h * 0.82, 26)
  ctx.stroke()
  // etiqueta
  ctx.fillStyle = '#f6f0dc'
  roundRectPath(ctx, w * 0.16, h * 0.3, w * 0.68, h * 0.34, 20)
  ctx.fill()
  ctx.fillStyle = band
  ctx.fillRect(w * 0.16, h * 0.3, w * 0.68, 10)
  fitText(ctx, title, w / 2, h * 0.46, {
    weight: 800,
    size: Math.round(h * 0.075),
    maxWidth: w * 0.6,
    color: PALETTE.primaryDark,
    align: 'center',
  })
  if (subtitle) {
    fitText(ctx, subtitle, w / 2, h * 0.56, {
      weight: 500,
      size: Math.round(h * 0.048),
      family: FONT_BODY,
      maxWidth: w * 0.6,
      color: 'rgba(4,35,97,0.7)',
      align: 'center',
    })
  }
}

export function makeSpiral(count, spacing, radius, color = 0xd9dee8) {
  const group = new THREE.Group()
  const material = new THREE.MeshStandardMaterial({ color, metalness: 0.9, roughness: 0.25 })
  const geometry = new THREE.TorusGeometry(radius, radius * 0.17, 10, 28)
  for (let i = 0; i < count; i += 1) {
    const ring = new THREE.Mesh(geometry, material)
    ring.position.y = (i - (count - 1) / 2) * spacing
    ring.rotation.x = Math.PI / 2
    ring.castShadow = true
    group.add(ring)
  }
  return group
}

/** Etiqueta de texto plana (sin sombra) para rotular objetos. */
export function makeTextPlane(w, h, texture, { opacity = 1 } = {}) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity, depthWrite: false, toneMapped: false }),
  )
  return mesh
}

/** Sprite de brillo ya posicionable. */
export function addGlow(parent, glow, color, scale, opacity = 0.8) {
  const material = new THREE.SpriteMaterial({
    map: glow,
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(scale, scale, 1)
  parent.add(sprite)
  return sprite
}

/** Cursor de flecha (para simular clics). */
export function makeCursorTexture() {
  return makeTex(128, 128, (ctx) => {
    ctx.shadowColor = 'rgba(0,0,0,0.5)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetY = 3
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#042361'
    ctx.lineWidth = 6
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(24, 12)
    ctx.lineTo(24, 98)
    ctx.lineTo(46, 78)
    ctx.lineTo(62, 112)
    ctx.lineTo(80, 104)
    ctx.lineTo(64, 72)
    ctx.lineTo(94, 70)
    ctx.closePath()
    ctx.fill()
    ctx.shadowColor = 'transparent'
    ctx.stroke()
  })
}

/* ------------------------------------------------------------------ */
/* Pequeñas utilidades de movimiento                                   */
/* ------------------------------------------------------------------ */

/** Escala segura (nunca 0 exacto para evitar matrices singulares). */
export const safeScale = (k) => Math.max(k, 0.0001)

/** Sube/baja: 0→1 en [a,b] y 1→0 en [c,d]. */
export function window01(T, a, b, c, d) {
  return smooth(seg(T, a, b)) * (1 - smooth(seg(T, c, d)))
}

/** Bote amortiguado tras un golpe: 1 en t=0 que decae oscilando. */
export function settleWobble(age, freq = 14, decay = 5) {
  if (age < 0) return 0
  return Math.exp(-age * decay) * Math.cos(age * freq)
}

/* ------------------------------------------------------------------ */
/* Texto que fluye con resaltado                                       */
/* ------------------------------------------------------------------ */

/**
 * Párrafo con saltos de línea automáticos. `segments` es una lista de
 * { text, hl } y las palabras con `hl` se subrayan con un marcador cuyo avance
 * (0..1) lo da `hlProgress`. `y` es la línea base de la primera línea.
 * Devuelve el número de líneas usadas.
 */
export function drawFlowText(
  ctx,
  segments,
  x,
  y,
  maxWidth,
  lineHeight,
  { weight = 500, size = 28, family = FONT_BODY, color = '#042361', hlColor = 'rgba(244,203,24,0.9)', hlProgress = 1 } = {},
) {
  ctx.font = `${weight} ${size}px ${family}`
  ctx.textAlign = 'left'
  const spaceW = ctx.measureText(' ').width
  const words = []
  segments.forEach((part, si) => {
    const prev = segments[si - 1]
    part.text
      .split(' ')
      .filter(Boolean)
      .forEach((token, ti) => {
        let spaced = ti > 0
        if (ti === 0 && prev) spaced = /\s$/.test(prev.text) || /^\s/.test(part.text)
        words.push({ token, hl: Boolean(part.hl), spaced, width: ctx.measureText(token).width, x: 0, line: 0 })
      })
  })

  let cx = x
  let line = 0
  words.forEach((word) => {
    const advance = word.spaced && cx > x ? spaceW : 0
    if (cx > x && cx + advance + word.width > x + maxWidth) {
      line += 1
      cx = x
    } else {
      cx += advance
    }
    word.x = cx
    word.line = line
    cx += word.width
  })

  const total = words.filter((word) => word.hl).length
  let index = 0
  let run = null
  const flush = () => {
    if (!run) return
    const fraction = clamp01((hlProgress * total - run.start) / run.count)
    if (fraction > 0) {
      ctx.fillStyle = hlColor
      roundRectPath(ctx, run.x0 - 6, y + run.line * lineHeight - size * 0.86, (run.x1 - run.x0 + 12) * fraction, size * 1.2, 7)
      ctx.fill()
    }
    run = null
  }
  words.forEach((word) => {
    if (word.hl) {
      if (run && run.line === word.line) {
        run.x1 = word.x + word.width
        run.count += 1
      } else {
        flush()
        run = { line: word.line, x0: word.x, x1: word.x + word.width, start: index, count: 1 }
      }
      index += 1
    } else {
      flush()
    }
  })
  flush()

  ctx.font = `${weight} ${size}px ${family}`
  ctx.fillStyle = color
  ctx.textAlign = 'left'
  words.forEach((word) => ctx.fillText(word.token, word.x, y + word.line * lineHeight))
  return line + 1
}

/** Recorte de esquinas redondeadas (usar entre ctx.save() y ctx.restore()). */
export function clipRound(ctx, w, h, r) {
  roundRectPath(ctx, 0, 0, w, h, r)
  ctx.clip()
}
