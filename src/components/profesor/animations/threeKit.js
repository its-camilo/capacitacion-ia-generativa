import * as THREE from 'three'

/** Utilidades compartidas para las escenas Three.js de las animaciones RAG. */

export const PALETTE = {
  primary: '#4574b9',
  primaryDark: '#042361',
  accent: '#44d3fe',
  highlight: '#f4cb18',
  paper: '#f6f0dc',
  paperDeep: '#e6dcc0',
  green: '#1f8a5b',
  greenDark: '#14633f',
  ink: '#042361',
}

const FONT_DISPLAY = "'Montserrat', 'Fira Sans', system-ui, sans-serif"
const FONT_BODY = "'Fira Sans', system-ui, sans-serif"
export { FONT_DISPLAY, FONT_BODY }

/* ---------- easing ---------- */

export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x)
/** Progreso 0..1 de x dentro de [a, b]. */
export const seg = (x, a, b) => clamp01((x - a) / (b - a))
export const lerp = (a, b, k) => a + (b - a) * k
export const smooth = (k) => k * k * (3 - 2 * k)
export const easeOutCubic = (k) => 1 - Math.pow(1 - k, 3)
export const easeInOutCubic = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2)
export const easeOutBack = (k) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2)
}
/** Pulso 0→1→0 sobre k en [0,1]. */
export const bump = (k) => Math.sin(clamp01(k) * Math.PI)

/** PRNG determinista (mulberry32) para que cada loop sea idéntico. */
export function createRandom(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ---------- canvas ---------- */

export function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

/**
 * Textura dibujada en canvas. Se redibuja cuando las tipografías web terminan de
 * cargar, para que el título salga en Montserrat y no en la fuente de respaldo.
 */
export function makeCanvasTexture(width, height, draw, invalidate) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4

  const paint = () => {
    ctx.clearRect(0, 0, width, height)
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
      document.fonts.load(`500 24px ${FONT_BODY}`),
    ])
      .then(() => {
        if (dead) return
        paint()
        if (invalidate) invalidate()
      })
      .catch(() => {})
  }
  return texture
}

/** Textura radial blanca → transparente para sprites de brillo. */
export function makeGlowTexture(size = 128) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.2, 'rgba(255,255,255,0.55)')
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.14)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function makeGlowSprite(texture, color, scale, opacity = 1) {
  const material = new THREE.SpriteMaterial({
    map: texture,
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(scale, scale, 1)
  return sprite
}

/* ---------- geometría ---------- */

export function roundedRectShape(width, height, radius) {
  const x = -width / 2
  const y = -height / 2
  const r = Math.min(radius, width / 2, height / 2)
  const shape = new THREE.Shape()
  shape.moveTo(x + r, y)
  shape.lineTo(x + width - r, y)
  shape.absarc(x + width - r, y + r, r, -Math.PI / 2, 0, false)
  shape.lineTo(x + width, y + height - r)
  shape.absarc(x + width - r, y + height - r, r, 0, Math.PI / 2, false)
  shape.lineTo(x + r, y + height)
  shape.absarc(x + r, y + height - r, r, Math.PI / 2, Math.PI, false)
  shape.lineTo(x, y + r)
  shape.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false)
  return shape
}

/**
 * Losa de esquinas redondeadas con bisel (ExtrudeGeometry), centrada en el origen.
 * `width`/`height` son las medidas finales (bisel incluido).
 * Devuelve la geometría y el grosor total para ubicar planos de textura encima.
 */
export function roundedSlab(width, height, depth, radius, bevel = 0.02, hole = null) {
  const inset = bevel
  const shape = roundedRectShape(width - inset * 2, height - inset * 2, Math.max(radius - inset, 0.01))
  if (hole) {
    const path = roundedRectShape(hole.width + inset * 2, hole.height + inset * 2, hole.radius + inset)
    shape.holes.push(path)
  }
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: 0,
    bevelSegments: 4,
    curveSegments: 14,
  })
  geometry.translate(0, 0, -depth / 2)
  return { geometry, thickness: depth + bevel * 2 }
}

/** Plano con textura que “viste” la cara frontal de una losa. */
export function makeFace(width, height, map, thickness, extra = {}) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshStandardMaterial({
      map,
      roughness: 0.82,
      metalness: 0,
      transparent: true,
      ...extra,
    }),
  )
  mesh.position.z = thickness / 2 + 0.004
  mesh.receiveShadow = true
  return mesh
}

/* ---------- texturas concretas ---------- */

function textLines(ctx, rand, x, y, width, count, gap, color, thickness = 9) {
  for (let i = 0; i < count; i += 1) {
    const w = i === count - 1 ? width * (0.35 + rand() * 0.3) : width * (0.82 + rand() * 0.18)
    ctx.fillStyle = color
    roundRectPath(ctx, x, y + i * gap, w, thickness, thickness / 2)
    ctx.fill()
  }
}

/** Página de documento: título, líneas de texto y una línea resaltada en ámbar. */
export function drawDocumentPage(ctx, w, h, title, seed) {
  const rand = createRandom(seed)
  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, '#fbf6e6')
  bg.addColorStop(1, '#eadfc2')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = PALETTE.green
  ctx.fillRect(0, 0, w, 16)

  const pad = w * 0.11
  ctx.fillStyle = PALETTE.primaryDark
  ctx.font = `800 ${Math.round(w * 0.088)}px ${FONT_DISPLAY}`
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(title, pad, h * 0.135)

  ctx.fillStyle = PALETTE.green
  roundRectPath(ctx, pad, h * 0.16, w * 0.16, 7, 3.5)
  ctx.fill()

  const bodyWidth = w - pad * 2
  const gap = h * 0.049
  const startY = h * 0.24
  textLines(ctx, rand, pad, startY, bodyWidth, 5, gap, 'rgba(46,70,128,0.62)')

  // línea resaltada en ámbar
  const hy = startY + gap * 5.6
  ctx.fillStyle = 'rgba(244,203,24,0.88)'
  roundRectPath(ctx, pad - 8, hy - 9, bodyWidth + 16, 28, 8)
  ctx.fill()
  ctx.fillStyle = 'rgba(4,35,97,0.82)'
  roundRectPath(ctx, pad, hy, bodyWidth * 0.9, 10, 5)
  ctx.fill()

  textLines(ctx, rand, pad, hy + gap * 1.6, bodyWidth, 6, gap, 'rgba(46,70,128,0.55)')

  ctx.fillStyle = 'rgba(4,35,97,0.35)'
  ctx.font = `500 ${Math.round(w * 0.04)}px ${FONT_BODY}`
  ctx.fillText(String(1 + Math.floor(rand() * 9)), w - pad - 8, h - h * 0.045)
}

/** Fragmento (trozo de papel pequeño) con número de chunk. */
export function drawFragmentCard(ctx, w, h, index, seed) {
  const rand = createRandom(seed)
  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, '#fbf6e6')
  bg.addColorStop(1, '#ebe0c4')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = index % 2 === 0 ? PALETTE.primary : PALETTE.green
  ctx.fillRect(0, 0, w, 10)

  ctx.fillStyle = PALETTE.primaryDark
  ctx.font = `800 ${Math.round(h * 0.15)}px ${FONT_DISPLAY}`
  ctx.fillText(String(index + 1), w * 0.08, h * 0.3)

  const x = w * 0.08
  const width = w * 0.84
  textLines(ctx, rand, x, h * 0.42, width, 2, h * 0.115, 'rgba(46,70,128,0.6)', h * 0.055)
  ctx.fillStyle = 'rgba(244,203,24,0.9)'
  roundRectPath(ctx, x - 5, h * 0.64 - 6, width + 10, h * 0.115, 6)
  ctx.fill()
  ctx.fillStyle = 'rgba(4,35,97,0.8)'
  roundRectPath(ctx, x, h * 0.665, width * 0.85, h * 0.055, 4)
  ctx.fill()
  textLines(ctx, rand, x, h * 0.8, width, 2, h * 0.1, 'rgba(46,70,128,0.5)', h * 0.05)
}

/** Posiciones (px) de los badges [1][2][3] en la página de respuesta. */
export const ANSWER_BADGES = [
  { x: 150, y: 612 },
  { x: 256, y: 612 },
  { x: 362, y: 612 },
]

export function drawAnswerPage(ctx, w, h) {
  const rand = createRandom(77)
  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, '#fbf6e6')
  bg.addColorStop(1, '#ebe0c4')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  const pad = w * 0.11
  ctx.fillStyle = PALETTE.primaryDark
  ctx.font = `800 ${Math.round(w * 0.088)}px ${FONT_DISPLAY}`
  ctx.fillText('Respuesta', pad, h * 0.115)
  ctx.fillStyle = PALETTE.green
  roundRectPath(ctx, pad, h * 0.14, w * 0.16, 7, 3.5)
  ctx.fill()

  const bodyWidth = w - pad * 2
  const gap = h * 0.052
  textLines(ctx, rand, pad, h * 0.22, bodyWidth, 3, gap, 'rgba(46,70,128,0.62)', 11)

  const hy = h * 0.22 + gap * 3.4
  ctx.fillStyle = 'rgba(244,203,24,0.88)'
  roundRectPath(ctx, pad - 8, hy - 10, bodyWidth + 16, 30, 8)
  ctx.fill()
  ctx.fillStyle = 'rgba(4,35,97,0.82)'
  roundRectPath(ctx, pad, hy, bodyWidth * 0.92, 11, 5.5)
  ctx.fill()

  textLines(ctx, rand, pad, hy + gap * 1.5, bodyWidth, 4, gap, 'rgba(46,70,128,0.55)', 11)

  ANSWER_BADGES.forEach((badge, index) => {
    ctx.fillStyle = PALETTE.green
    roundRectPath(ctx, badge.x - 40, badge.y - 22, 80, 44, 22)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.65)'
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.fillStyle = '#ffffff'
    ctx.font = `800 24px ${FONT_DISPLAY}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`[${index + 1}]`, badge.x, badge.y + 1)
  })
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  ctx.fillStyle = 'rgba(4,35,97,0.5)'
  ctx.font = `500 21px ${FONT_BODY}`
  ctx.textAlign = 'center'
  ctx.fillText('fuentes abiertas para verificar', w / 2, h * 0.93)
  ctx.textAlign = 'left'
}

export function drawSeal(ctx, w, h) {
  const c = w / 2
  const gradient = ctx.createRadialGradient(c * 0.8, c * 0.7, 4, c, c, c)
  gradient.addColorStop(0, '#4ed08f')
  gradient.addColorStop(1, '#14774a')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(c, c, c - 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = w * 0.11
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(w * 0.28, h * 0.53)
  ctx.lineTo(w * 0.44, h * 0.68)
  ctx.lineTo(w * 0.73, h * 0.34)
  ctx.stroke()
}

export function drawQuestionMark(ctx, w, h) {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `900 ${Math.round(h * 0.82)}px ${FONT_DISPLAY}`
  ctx.shadowColor = 'rgba(244,203,24,0.85)'
  ctx.shadowBlur = h * 0.12
  const gradient = ctx.createLinearGradient(0, h * 0.1, 0, h * 0.9)
  gradient.addColorStop(0, '#fff1a6')
  gradient.addColorStop(0.55, '#f4cb18')
  gradient.addColorStop(1, '#d99a0a')
  ctx.fillStyle = gradient
  ctx.fillText('?', w / 2, h * 0.52)
  ctx.shadowBlur = 0
  ctx.lineWidth = h * 0.02
  ctx.strokeStyle = 'rgba(4,35,97,0.55)'
  ctx.strokeText('?', w / 2, h * 0.52)
}

export function drawPlanetSurface(ctx, w, h) {
  const rand = createRandom(5)
  const base = ctx.createLinearGradient(0, 0, 0, h)
  base.addColorStop(0, '#ffd45a')
  base.addColorStop(0.5, '#f4b21c')
  base.addColorStop(1, '#d9830c')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < 16; i += 1) {
    const y = rand() * h
    const bandHeight = 6 + rand() * 20
    ctx.fillStyle = rand() > 0.5 ? 'rgba(255,240,170,0.28)' : 'rgba(150,70,0,0.2)'
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x <= w; x += 16) {
      ctx.lineTo(x, y + Math.sin(x * 0.03 + i) * 4)
    }
    for (let x = w; x >= 0; x -= 16) {
      ctx.lineTo(x, y + bandHeight + Math.sin(x * 0.03 + i + 1) * 4)
    }
    ctx.closePath()
    ctx.fill()
  }
}

/* ---------- estrellas ---------- */

export function makeStarField({ count, box, size, opacity, glow, seed }) {
  const rand = createRandom(seed)
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const tint = new THREE.Color()
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (rand() - 0.5) * box.x
    positions[i * 3 + 1] = box.yMin + rand() * (box.yMax - box.yMin)
    positions[i * 3 + 2] = box.zMin + rand() * (box.zMax - box.zMin)
    tint.setHSL(0.55 + rand() * 0.1, 0.6, 0.65 + rand() * 0.3)
    const strength = 0.4 + rand() * 0.6
    colors[i * 3] = tint.r * strength
    colors[i * 3 + 1] = tint.g * strength
    colors[i * 3 + 2] = tint.b * strength
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const material = new THREE.PointsMaterial({
    size,
    map: glow,
    vertexColors: true,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    fog: false,
  })
  return new THREE.Points(geometry, material)
}
