import * as THREE from 'three'
import {
  bump,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  lerp,
  roundRectPath,
  seg,
  smooth,
} from './threeKit'
import {
  FONT_BODY,
  FONT_MONO,
  addGlow,
  clipRound,
  createBurstSystem,
  createStage,
  drawFlowText,
  fitText,
  flashCard,
  makeBeam,
  makeMagnifier,
  makeShockRing,
  makeSlabCard,
  makeTex,
  makeTextPlane,
  safeScale,
  setBeam,
  setShockRing,
  window01,
} from './stageKit'

/**
 * Práctica 4 · Convertirlo en material de estudio
 *  1 Las mismas fuentes · 2 Se transforman · 3 Audio y video primero
 *  4 En paralelo · 5 Revisar antes de compartir
 */

export const PRACTICA4_DURATION = 16

const GREEN = '#1f8a5b'
const RED = '#d23a31'

/* ---------------- fuentes ---------------- */
const SOURCES = [
  { title: 'Programa', tone: '#4574b9' },
  { title: 'Lectura 1', tone: '#1f8a5b' },
  { title: 'Lectura 2', tone: '#1f8a5b' },
  { title: 'Artículo', tone: '#a07ad8' },
  { title: 'Transcripción', tone: '#e08a2c' },
]
const SRC_X = [-6, -3, 0, 3, 6]
const SRC_Y = 6.7
const HUB = { x: 0, y: 5.0, z: 0.7 }

/* ---------------- salidas ---------------- */
const OUT_X = [-7, -4.2, -1.4, 1.4, 4.2, 7]
const OUT_Y = 2.3
const OUTPUTS = [
  { key: 'report', name: 'Informe', foot: 'Resumen escrito', tone: '#4574b9', ink: '#ffffff', lane: 2, start: 0.3, end: 3.2 },
  { key: 'mind', name: 'Mapa mental', foot: 'Ideas conectadas', tone: '#a98bff', ink: '#042361', lane: 3, start: 0.3, end: 2.1 },
  { key: 'cards', name: 'Tarjetas', foot: 'Repaso rápido', tone: '#f4cb18', ink: '#042361', lane: 4, start: 0.5, end: 4.0 },
  { key: 'quiz', name: 'Cuestionario', foot: 'Preguntas de práctica', tone: '#3be09a', ink: '#042361', lane: 5, start: 0.4, end: 5.2 },
  { key: 'audio', name: 'Audio', foot: 'Resumen en audio', tone: '#ff8a70', ink: '#042361', lane: 0, start: 0, pre: 11.0, end: 11.8 },
  { key: 'video', name: 'Video', foot: 'Resumen en video', tone: '#44d3fe', ink: '#042361', lane: 1, start: 0, pre: 10.4, end: 13.6 },
]

/* ---------------- línea de tiempo ---------------- */
const PANEL = { w: 16.6, h: 7.0, y: 3.7 }
const LANE_Y = [6.35, 5.4, 4.45, 3.5, 2.55, 1.6]
const LABEL_X = -6.65
const X0 = -4.6 // minuto 0
const UPM = 12.5 / 15 // unidades por minuto
const minX = (m) => X0 + m * UPM
const BAR_H = 0.5

/* ---------------- revisión ---------------- */
const PAPER = { x: -3.6, y: 3.7, z: 0.4, w: 6.2, h: 5.2 }
const FLAG_Y = 3.1 // altura mundial de la frase suavizada
const CARD = { x: 4.3, y: 3.2, z: 0.4, w: 5.4, h: 3.4 }
const LENS_PATH = [
  { t: 13.2, x: 3.8, y: 6.9 },
  { t: 13.6, x: -5.3, y: 5.0 },
  { t: 13.95, x: -1.9, y: 4.5 },
  { t: 14.25, x: -5.2, y: 3.95 },
  { t: 14.55, x: -3.4, y: 3.15 },
]

/* ================================================================== */
/* Texturas                                                            */
/* ================================================================== */

function drawTray(ctx, w, h) {
  ctx.save()
  clipRound(ctx, w, h, 30)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#12388a')
  g.addColorStop(1, '#0a2252')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(68,211,254,0.08)'
  ctx.fillRect(0, 0, w, h * 0.4)
  ctx.strokeStyle = 'rgba(68,211,254,0.6)'
  ctx.lineWidth = 4
  roundRectPath(ctx, 6, 6, w - 12, h - 12, 26)
  ctx.stroke()
  fitText(ctx, 'FUENTES DEL CUADERNO', 40, 44, { weight: 500, size: 24, family: FONT_MONO, color: '#7fdcff', maxWidth: 600 })
  ctx.restore()
}

function drawDocChip(ctx, w, h, spec) {
  ctx.save()
  clipRound(ctx, w, h, 16)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#fffaf0')
  g.addColorStop(1, '#ebe0c4')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = spec.tone
  ctx.fillRect(0, 0, 20, h)
  fitText(ctx, spec.title, 40, 62, { weight: 800, size: 36, color: '#042361', maxWidth: w - 64 })
  ctx.fillStyle = 'rgba(46,70,128,0.5)'
  roundRectPath(ctx, 40, 86, w - 90, 9, 4.5)
  ctx.fill()
  roundRectPath(ctx, 40, 108, (w - 90) * 0.6, 9, 4.5)
  ctx.fill()
  ctx.restore()
}

function drawIcon(ctx, kind, cx, cy, tone) {
  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  if (kind === 'report') {
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = tone
    ctx.lineWidth = 5
    roundRectPath(ctx, cx - 52, cy - 64, 104, 128, 10)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = tone
    roundRectPath(ctx, cx - 36, cy - 46, 52, 10, 5)
    ctx.fill()
    ctx.fillStyle = 'rgba(46,70,128,0.45)'
    for (let i = 0; i < 4; i += 1) {
      roundRectPath(ctx, cx - 36, cy - 20 + i * 20, i === 3 ? 44 : 72, 8, 4)
      ctx.fill()
    }
    ctx.fillStyle = 'rgba(244,203,24,0.85)'
    roundRectPath(ctx, cx - 38, cy + 2, 76, 14, 5)
    ctx.fill()
  } else if (kind === 'mind') {
    const sats = [
      [-62, -40],
      [60, -46],
      [-66, 36],
      [64, 40],
      [0, -70],
    ]
    ctx.strokeStyle = tone
    ctx.lineWidth = 5
    sats.forEach(([x, y]) => {
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + x, cy + y)
      ctx.stroke()
    })
    ctx.fillStyle = '#ffffff'
    sats.forEach(([x, y]) => {
      ctx.beginPath()
      ctx.arc(cx + x, cy + y, 15, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    })
    ctx.fillStyle = tone
    ctx.beginPath()
    ctx.arc(cx, cy, 26, 0, Math.PI * 2)
    ctx.fill()
  } else if (kind === 'cards') {
    ctx.strokeStyle = '#8a6d00'
    ctx.lineWidth = 4
    ;[
      { r: -0.16, dx: -14, fill: '#ffe9a0', label: 'A' },
      { r: 0.1, dx: 12, fill: '#ffffff', label: '?' },
    ].forEach((card) => {
      ctx.save()
      ctx.translate(cx + card.dx, cy)
      ctx.rotate(card.r)
      ctx.fillStyle = card.fill
      roundRectPath(ctx, -46, -62, 92, 124, 12)
      ctx.fill()
      ctx.stroke()
      fitText(ctx, card.label, 0, 20, { weight: 900, size: 64, color: '#8a6d00', align: 'center', maxWidth: 60 })
      ctx.restore()
    })
  } else if (kind === 'quiz') {
    for (let i = 0; i < 3; i += 1) {
      const y = cy - 46 + i * 46
      ctx.strokeStyle = '#14633f'
      ctx.lineWidth = 5
      ctx.fillStyle = i === 0 ? '#14633f' : '#ffffff'
      ctx.beginPath()
      ctx.arc(cx - 42, y, 15, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      if (i === 0) {
        ctx.strokeStyle = '#ffffff'
        ctx.beginPath()
        ctx.moveTo(cx - 50, y)
        ctx.lineTo(cx - 44, y + 7)
        ctx.lineTo(cx - 33, y - 7)
        ctx.stroke()
      }
      ctx.fillStyle = 'rgba(46,70,128,0.5)'
      roundRectPath(ctx, cx - 14, y - 6, i === 1 ? 70 : 88, 12, 6)
      ctx.fill()
    }
  } else if (kind === 'audio') {
    const heights = [26, 52, 84, 60, 108, 70, 92, 46, 24]
    ctx.fillStyle = '#d4573c'
    heights.forEach((hh, i) => {
      roundRectPath(ctx, cx - 78 + i * 18, cy - hh / 2, 11, hh, 5.5)
      ctx.fill()
    })
  } else if (kind === 'video') {
    ctx.fillStyle = '#0a2663'
    ctx.strokeStyle = '#1b8fc0'
    ctx.lineWidth = 6
    roundRectPath(ctx, cx - 70, cy - 48, 140, 96, 14)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#44d3fe'
    ctx.beginPath()
    ctx.moveTo(cx - 14, cy - 26)
    ctx.lineTo(cx + 30, cy)
    ctx.lineTo(cx - 14, cy + 26)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
}

function drawOutput(ctx, w, h, spec) {
  ctx.save()
  clipRound(ctx, w, h, 20)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#fffaf0')
  g.addColorStop(1, '#ece2c6')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = spec.tone
  ctx.fillRect(0, 0, w, 58)
  fitText(ctx, spec.name, w / 2, 40, { weight: 800, size: 32, color: spec.ink, align: 'center', maxWidth: w - 30 })
  drawIcon(ctx, spec.key, w / 2, 160, spec.tone)
  fitText(ctx, spec.foot, w / 2, 272, { weight: 500, size: 22, family: FONT_BODY, color: 'rgba(4,35,97,0.7)', align: 'center', maxWidth: w - 24 })
  ctx.restore()
}

function drawLabel(ctx, w, h, spec) {
  ctx.fillStyle = 'rgba(4,35,97,0.92)'
  roundRectPath(ctx, 3, 3, w - 6, h - 6, (h - 6) / 2)
  ctx.fill()
  ctx.strokeStyle = spec.tone
  ctx.lineWidth = 4
  ctx.stroke()
  ctx.fillStyle = spec.tone
  ctx.beginPath()
  ctx.arc(h * 0.5, h / 2, h * 0.17, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, spec.name, h * 0.88, h * 0.66, { weight: 800, size: h * 0.46, color: '#ffffff', maxWidth: w - h * 1.1 })
}

function drawPanel(ctx, w, h) {
  const px = (x) => (x + PANEL.w / 2) * 100
  const py = (y) => (PANEL.y + PANEL.h / 2 - y) * 100
  ctx.save()
  clipRound(ctx, w, h, 28)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#0f3478')
  g.addColorStop(1, '#081f4c')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = 'rgba(68,211,254,0.5)'
  ctx.lineWidth = 4
  roundRectPath(ctx, 6, 6, w - 12, h - 12, 24)
  ctx.stroke()
  LANE_Y.forEach((y) => {
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    roundRectPath(ctx, px(X0 - 0.15), py(y + 0.38), 12.5 * 100 + 30, 76, 14)
    ctx.fill()
  })
  ;[0, 5, 10, 15].forEach((m) => {
    const x = px(minX(m))
    ctx.setLineDash(m === 10 ? [14, 10] : [])
    ctx.strokeStyle = m === 10 ? 'rgba(244,203,24,0.95)' : 'rgba(120,200,255,0.28)'
    ctx.lineWidth = m === 10 ? 5 : 2
    ctx.beginPath()
    ctx.moveTo(x, py(6.95))
    ctx.lineTo(x, py(0.95))
    ctx.stroke()
    ctx.setLineDash([])
    fitText(ctx, m === 10 ? '10 min' : m === 15 ? '15 min' : String(m), x, py(0.45), {
      weight: m === 10 ? 800 : 500,
      size: 26,
      family: FONT_MONO,
      color: m === 10 ? '#f4cb18' : 'rgba(180,215,255,0.8)',
      align: 'center',
      maxWidth: 120,
    })
  })
  fitText(ctx, 'tiempo de generación →', px(-8.0), py(0.45), { weight: 500, size: 22, family: FONT_MONO, color: 'rgba(180,215,255,0.6)', maxWidth: 360 })
  ctx.restore()
}

function drawStripes(ctx, w, h) {
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  for (let x = -h; x < w; x += 32) {
    ctx.beginPath()
    ctx.moveTo(x, h)
    ctx.lineTo(x + 14, h)
    ctx.lineTo(x + 14 + h, 0)
    ctx.lineTo(x + h, 0)
    ctx.closePath()
    ctx.fill()
  }
}

function drawLongTag(ctx, w, h) {
  ctx.fillStyle = '#f4cb18'
  roundRectPath(ctx, 3, 3, w - 6, h - 6, (h - 6) / 2)
  ctx.fill()
  fitText(ctx, '+10 min', w / 2, h * 0.7, { weight: 800, size: h * 0.55, color: '#042361', align: 'center', maxWidth: w * 0.9 })
}

function drawMark(ctx, w, h, kind) {
  const c = w / 2
  ctx.fillStyle = kind === 'ok' ? GREEN : RED
  ctx.beginPath()
  ctx.arc(c, c, c - 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = w * 0.1
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  if (kind === 'ok') {
    ctx.moveTo(w * 0.28, h * 0.53)
    ctx.lineTo(w * 0.44, h * 0.68)
    ctx.lineTo(w * 0.73, h * 0.34)
  } else {
    ctx.moveTo(w * 0.5, h * 0.24)
    ctx.lineTo(w * 0.5, h * 0.58)
    ctx.moveTo(w * 0.5, h * 0.74)
    ctx.lineTo(w * 0.5, h * 0.76)
  }
  ctx.stroke()
}

function drawNeq(ctx, w, h) {
  const c = w / 2
  const g = ctx.createRadialGradient(c * 0.8, c * 0.7, 4, c, c, c)
  g.addColorStop(0, '#ff8a70')
  g.addColorStop(1, '#c42a22')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(c, c, c - 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = w * 0.075
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(w * 0.28, h * 0.4)
  ctx.lineTo(w * 0.72, h * 0.4)
  ctx.moveTo(w * 0.28, h * 0.6)
  ctx.lineTo(w * 0.72, h * 0.6)
  ctx.moveTo(w * 0.6, h * 0.24)
  ctx.lineTo(w * 0.4, h * 0.76)
  ctx.stroke()
}

function drawPaper(ctx, w, h) {
  ctx.save()
  clipRound(ctx, w, h, 24)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#fffaf0')
  g.addColorStop(1, '#ece2c6')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#4574b9'
  ctx.fillRect(0, 0, w, 14)
  fitText(ctx, 'INFORME DE ESTUDIO', 40, 58, { weight: 500, size: 22, family: FONT_MONO, color: '#4574b9', maxWidth: 400 })
  fitText(ctx, 'Incidencia de los impuestos', 40, 104, { weight: 800, size: 40, color: '#042361', maxWidth: w - 80 })
  ctx.fillStyle = 'rgba(46,70,128,0.45)'
  ;[150, 186, 222].forEach((y, i) => {
    roundRectPath(ctx, 40, y, i === 2 ? 300 : w - 90, 12, 6)
    ctx.fill()
  })
  drawFlowText(
    ctx,
    [{ text: 'Las fuentes coinciden: el costo se reparte entre ambos.' }],
    44,
    312,
    w - 90,
    42,
    { weight: 700, size: 30 },
  )
  ctx.fillStyle = 'rgba(46,70,128,0.45)'
  ;[392, 428, 464].forEach((y, i) => {
    roundRectPath(ctx, 40, y, i === 2 ? 240 : w - 90, 12, 6)
    ctx.fill()
  })
  ctx.restore()
}

function drawSourcesCard(ctx, w, h) {
  ctx.save()
  clipRound(ctx, w, h, 24)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#fffaf0')
  g.addColorStop(1, '#ece2c6')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = RED
  ctx.fillRect(0, 0, w, 62)
  fitText(ctx, 'En las fuentes', 28, 43, { weight: 800, size: 32, color: '#ffffff', maxWidth: w - 60 })
  const rows = [
    { tag: 'LECTURA 1', text: 'Lo paga el consumidor', tone: '#44d3fe', y: 132 },
    { tag: 'ARTÍCULO', text: 'Lo paga el vendedor', tone: '#ff8a70', y: 262 },
  ]
  rows.forEach((row) => {
    ctx.fillStyle = row.tone
    roundRectPath(ctx, 28, row.y - 38, 10, 82, 5)
    ctx.fill()
    fitText(ctx, row.tag, 54, row.y - 8, { weight: 500, size: 22, family: FONT_MONO, color: 'rgba(4,35,97,0.65)', maxWidth: 240 })
    fitText(ctx, row.text, 54, row.y + 34, { weight: 800, size: 34, color: '#042361', maxWidth: w - 220 })
  })
  ctx.save()
  ctx.translate(w - 130, h / 2 - 22)
  drawNeq(ctx, 88, 88)
  ctx.restore()
  ctx.restore()
}

/* ================================================================== */

export default function createPractica4Scene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: PRACTICA4_DURATION,
    frame: { wideHalfW: 8.6, narrowHalfW: 6.4, halfH: 4.5, camY: 5.0, lookY: 3.45 },
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 14, perBurst: 18, seed: 44 })
  scene.add(bursts.points)
  const cGreen = new THREE.Color(0x3be09a)
  const cCyan = new THREE.Color(0x7fdcff)
  const cGold = new THREE.Color(0xf4cb18)
  const cRed = new THREE.Color(0xff5a4d)

  const markOk = makeTex(128, 128, (ctx, w, h) => drawMark(ctx, w, h, 'ok'), invalidate)
  const markWarn = makeTex(128, 128, (ctx, w, h) => drawMark(ctx, w, h, 'bad'), invalidate)
  const makeMarkSprite = (map, parent) => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false }))
    sprite.scale.setScalar(0.0001)
    parent.add(sprite)
    return sprite
  }

  /* ---------------- grupo superior: fuentes y hub ---------------- */
  const rootTop = new THREE.Group()
  scene.add(rootTop)

  const tray = makeSlabCard({
    w: 16.2,
    h: 2.1,
    depth: 0.1,
    radius: 0.4,
    bevel: 0.04,
    edge: '#0b2a66',
    texture: makeTex(1620, 210, drawTray, invalidate),
    roughness: 0.5,
    metalness: 0.15,
    emissive: '#44d3fe',
  })
  tray.group.position.set(0, SRC_Y, -0.2)
  tray.group.scale.setScalar(0.0001)
  rootTop.add(tray.group)
  const trayGlow = addGlow(rootTop, glow, 0x44d3fe, 17, 0.2)
  trayGlow.position.set(0, SRC_Y, -0.9)

  const docs = SOURCES.map((spec) => {
    const group = new THREE.Group()
    rootTop.add(group)
    const card = makeSlabCard({
      w: 2.7,
      h: 1.4,
      depth: 0.08,
      radius: 0.16,
      bevel: 0.03,
      edge: '#efe6cb',
      texture: makeTex(270, 140, (ctx, w, h) => drawDocChip(ctx, w, h, spec), invalidate),
      emissive: '#f4cb18',
    })
    group.add(card.group)
    group.scale.setScalar(0.0001)
    return { group, card }
  })

  // núcleo que transforma las fuentes
  const hub = new THREE.Group()
  hub.position.set(HUB.x, HUB.y, HUB.z)
  rootTop.add(hub)
  const gem = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.62, 1),
    new THREE.MeshPhysicalMaterial({
      color: 0x44d3fe,
      emissive: 0x1a8fd0,
      emissiveIntensity: 0.55,
      roughness: 0.15,
      metalness: 0.25,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      flatShading: true,
    }),
  )
  gem.castShadow = true
  hub.add(gem)
  const hubRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.0, 0.05, 12, 64),
    new THREE.MeshStandardMaterial({ color: 0xf4cb18, metalness: 0.8, roughness: 0.3, emissive: 0xf4cb18, emissiveIntensity: 0.25 }),
  )
  hubRing.rotation.x = 1.15
  hub.add(hubRing)
  const hubGlow = addGlow(hub, glow, 0x7fdcff, 5.5, 0)
  hubGlow.position.z = -0.3
  hub.scale.setScalar(0.0001)
  const hubWave = makeShockRing(0x7fdcff)
  hubWave.position.set(HUB.x, HUB.y, HUB.z - 0.1)
  rootTop.add(hubWave)

  const feedBeams = SRC_X.map(() => {
    const beam = makeBeam(0x7fdcff, 0.75)
    rootTop.add(beam)
    return beam
  })
  const outBeams = OUT_X.map(() => {
    const beam = makeBeam(0xf4cb18, 0.6)
    rootTop.add(beam)
    return beam
  })
  const pA = new THREE.Vector3()
  const pB = new THREE.Vector3()
  const pC = new THREE.Vector3()

  /* ---------------- salidas (tarjetas) ---------------- */
  const outputs = OUTPUTS.map((spec, i) => {
    const group = new THREE.Group()
    scene.add(group)
    const card = makeSlabCard({
      w: 2.5,
      h: 3.0,
      depth: 0.12,
      radius: 0.22,
      bevel: 0.035,
      edge: '#d8cda9',
      texture: makeTex(250, 300, (ctx, w, h) => drawOutput(ctx, w, h, spec), invalidate),
      roughness: 0.6,
      emissive: spec.tone,
    })
    group.add(card.group)
    const halo = addGlow(group, glow, new THREE.Color(spec.tone), 5.2, 0)
    halo.position.z = -0.4
    group.scale.setScalar(0.0001)
    return { group, card, halo, spec, i, color: new THREE.Color(spec.tone) }
  })

  /* ---------------- línea de tiempo ---------------- */
  const rootG = new THREE.Group()
  scene.add(rootG)
  const panel = makeSlabCard({
    w: PANEL.w,
    h: PANEL.h,
    depth: 0.1,
    radius: 0.4,
    bevel: 0.04,
    edge: '#0b2a66',
    texture: makeTex(1660, 700, drawPanel, invalidate),
    roughness: 0.55,
    metalness: 0.12,
    emissive: '#44d3fe',
  })
  panel.group.position.set(0, PANEL.y, -0.15)
  rootG.add(panel.group)

  const labels = OUTPUTS.map((spec) => {
    const mesh = makeTextPlane(3.0, 0.72, makeTex(300, 72, (ctx, w, h) => drawLabel(ctx, w, h, spec), invalidate))
    mesh.position.set(LABEL_X, LANE_Y[spec.lane], 0.2)
    rootG.add(mesh)
    return mesh
  })

  const barGeometry = new THREE.BoxGeometry(1, BAR_H, 0.16)
  barGeometry.translate(0.5, 0, 0)
  const stripeGeometry = new THREE.PlaneGeometry(1, BAR_H * 0.88)
  stripeGeometry.translate(0.5, 0, 0)
  const bars = OUTPUTS.map((spec) => {
    const y = LANE_Y[spec.lane]
    const mesh = new THREE.Mesh(
      barGeometry,
      new THREE.MeshStandardMaterial({
        color: spec.tone,
        emissive: spec.tone,
        emissiveIntensity: 0.3,
        roughness: 0.35,
        metalness: 0.1,
      }),
    )
    mesh.position.set(minX(spec.start), y, 0.2)
    mesh.scale.set(0.0001, 1, 1)
    mesh.castShadow = true
    rootG.add(mesh)

    const stripeMap = makeTex(64, 32, drawStripes, invalidate)
    stripeMap.wrapS = THREE.RepeatWrapping
    const stripes = new THREE.Mesh(
      stripeGeometry,
      new THREE.MeshBasicMaterial({
        map: stripeMap,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    )
    stripes.position.set(minX(spec.start), y, 0.285)
    stripes.scale.set(0.0001, 1, 1)
    rootG.add(stripes)

    const head = addGlow(rootG, glow, new THREE.Color(spec.tone), 1.5, 0)
    head.position.set(minX(spec.start), y, 0.4)

    const tick = makeMarkSprite(markOk, rootG)
    const tag = spec.pre
      ? makeTextPlane(1.3, 0.38, makeTex(260, 76, drawLongTag, invalidate))
      : null
    if (tag) {
      tag.scale.setScalar(0.0001)
      tag.position.set(0, y, 0.34)
      rootG.add(tag)
    }
    return { spec, mesh, stripes, head, tick, tag, y }
  })

  // marca de los 10 minutos y cabezal de tiempo
  const tenGlow = addGlow(rootG, glow, 0xf4cb18, 3.2, 0)
  tenGlow.position.set(minX(10), LANE_Y[0], 0.4)
  const playheadLine = new THREE.Mesh(
    new THREE.PlaneGeometry(0.07, 5.8),
    new THREE.MeshBasicMaterial({
      color: 0x7fdcff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
  )
  playheadLine.position.set(minX(0), 4.0, 0.42)
  rootG.add(playheadLine)
  const playheadGlow = addGlow(rootG, glow, 0x7fdcff, 1.4, 0)
  playheadGlow.position.set(minX(0), 6.85, 0.45)
  rootG.visible = false

  /* ---------------- grupo R: revisar el informe ---------------- */
  const rootR = new THREE.Group()
  scene.add(rootR)
  const paper = makeSlabCard({
    w: PAPER.w,
    h: PAPER.h,
    depth: 0.12,
    radius: 0.28,
    bevel: 0.04,
    edge: '#d8cda9',
    texture: makeTex(620, 520, drawPaper, invalidate),
    roughness: 0.7,
    emissive: '#ff5a4d',
  })
  paper.group.position.set(PAPER.x, PAPER.y, PAPER.z)
  paper.group.scale.setScalar(0.0001)
  rootR.add(paper.group)
  const PZ = paper.thickness / 2

  const flagGeometry = new THREE.PlaneGeometry(1, 1)
  flagGeometry.translate(0.5, 0, 0)
  const flagBar = new THREE.Mesh(
    flagGeometry,
    new THREE.MeshBasicMaterial({ color: 0xf4cb18, transparent: true, opacity: 0.42, depthWrite: false, toneMapped: false }),
  )
  flagBar.position.set(PAPER.x - 2.7, FLAG_Y, PAPER.z + PZ + 0.03)
  flagBar.scale.set(0.0001, 1.0, 1)
  rootR.add(flagBar)
  const flagFrame = new THREE.Mesh(
    new THREE.PlaneGeometry(5.5, 1.04),
    new THREE.MeshBasicMaterial({
      map: makeTex(550, 104, (ctx, w, h) => {
        ctx.strokeStyle = '#ff5a4d'
        ctx.lineWidth = 7
        roundRectPath(ctx, 5, 5, w - 10, h - 10, 18)
        ctx.stroke()
      }, invalidate),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false,
    }),
  )
  flagFrame.position.set(PAPER.x, FLAG_Y, PAPER.z + PZ + 0.04)
  rootR.add(flagFrame)
  const flagWarn = makeMarkSprite(markWarn, rootR)
  flagWarn.position.set(PAPER.x + 3.05, FLAG_Y, PAPER.z + PZ + 0.5)
  const flagGlow = addGlow(rootR, glow, 0xff5a4d, 7, 0)
  flagGlow.position.set(PAPER.x, FLAG_Y, PAPER.z + 0.3)

  const sourcesCard = makeSlabCard({
    w: CARD.w,
    h: CARD.h,
    depth: 0.12,
    radius: 0.28,
    bevel: 0.04,
    edge: '#f0c5c0',
    texture: makeTex(540, 340, drawSourcesCard, invalidate),
    roughness: 0.65,
    emissive: '#ff5a4d',
  })
  sourcesCard.group.position.set(CARD.x, CARD.y, CARD.z)
  sourcesCard.group.scale.setScalar(0.0001)
  rootR.add(sourcesCard.group)
  const cardGlow = addGlow(rootR, glow, 0xff5a4d, 9, 0)
  cardGlow.position.set(CARD.x, CARD.y, CARD.z - 0.5)
  const linkBeam = makeBeam(0xff5a4d, 0.85)
  rootR.add(linkBeam)
  const linkDot = addGlow(rootR, glow, 0xffb0a5, 0.9, 0)

  const lens = makeMagnifier({ radius: 0.85 })
  lens.group.position.set(LENS_PATH[0].x, LENS_PATH[0].y, 1.2)
  lens.group.scale.setScalar(0.0001)
  rootR.add(lens.group)
  const lensGlow = addGlow(lens.group, glow, 0xfff1a6, 3.2, 0)
  lensGlow.position.z = 0.1

  /* ---------------- utilidades de movimiento ---------------- */
  const setGroupScale = (group, s, pivotY) => {
    const k = safeScale(s)
    group.scale.setScalar(k)
    group.position.y = pivotY * (1 - k)
    group.visible = s > 0.004
  }

  function resize(w, h) {
    stage.resize(w, h)
  }

  const lensAt = (T, out) => {
    const first = LENS_PATH[0]
    const last = LENS_PATH[LENS_PATH.length - 1]
    if (T <= first.t) {
      out.x = first.x
      out.y = first.y
      return
    }
    if (T >= last.t) {
      out.x = last.x
      out.y = last.y
      return
    }
    for (let i = 0; i < LENS_PATH.length - 1; i += 1) {
      const a = LENS_PATH[i]
      const b = LENS_PATH[i + 1]
      if (T >= a.t && T <= b.t) {
        const k = easeInOutCubic((T - a.t) / (b.t - a.t))
        out.x = lerp(a.x, b.x, k)
        out.y = lerp(a.y, b.y, k)
        return
      }
    }
  }
  const lensPos = { x: 0, y: 0 }

  /** Largo (en minutos) de la barra de audio / video en el instante T. */
  const longBarLen = (spec, T) => {
    const pre = spec.pre * seg(T, 7.2, 9.5)
    const post = (spec.end - spec.pre) * easeOutCubic(seg(T, 9.6, 12.4))
    return pre + post
  }
  /** Posición del cabezal en minutos. */
  const playheadAt = (T) => {
    if (T < 9.6) return 11.0 * seg(T, 7.2, 9.5)
    if (T < 10.0) return lerp(11.0, 0.2, easeInOutCubic(seg(T, 9.6, 10.0)))
    return 0.2 + 5.8 * seg(T, 10.0, 12.4)
  }

  function draw(t) {
    const T = t * PRACTICA4_DURATION
    const fx = 1.7 * Math.sin(seg(T, 7.0, 12.6) * Math.PI * 2 - Math.PI / 2) * window01(T, 7.0, 7.6, 12.2, 12.8)
    stage.update(T, fx)
    stage.spot.position.set(fx, 4.6, 5.5)

    const events = []
    const burst = (t0, x, y, z, color, speed = 2.4, life = 0.9) => {
      if (T >= t0 && T <= t0 + life) events.push({ t: t0, x, y, z, color, speed, life })
    }

    /* ---------- 1 · las mismas fuentes ---------- */
    setGroupScale(rootTop, 1 - smooth(seg(T, 6.4, 7.0)), 5.5)
    const trayIn = easeOutBack(seg(T, 0.15, 0.7))
    tray.group.scale.setScalar(safeScale(trayIn))
    trayGlow.material.opacity = 0.18 + bump(seg(T, 2.5, 3.3)) * 0.25
    flashCard(tray, bump(seg(T, 2.5, 3.3)) * 0.25)

    docs.forEach((doc, i) => {
      const a = 0.55 + i * 0.28
      const k = seg(T, a, a + 0.75)
      const fall = easeOutBack(k)
      doc.group.position.set(
        SRC_X[i],
        SRC_Y + (1 - easeOutCubic(k)) * 3.6 + Math.sin(T * 1.2 + i) * 0.04 * k,
        0.15,
      )
      doc.group.rotation.set((1 - fall) * 0.7, (1 - fall) * 0.5 * (i % 2 ? 1 : -1), (1 - fall) * 0.4)
      doc.group.scale.setScalar(safeScale(k > 0 ? fall : 0))
      flashCard(doc.card, bump(seg(T, 2.5, 3.2)) * 0.5 + bump(seg(T, 3.3 + i * 0.05, 3.8 + i * 0.05)) * 0.35)
      burst(a + 0.6, SRC_X[i], SRC_Y - 0.5, 0.8, cCyan, 1.6, 0.8)
    })

    /* ---------- 2 · se transforman ---------- */
    const hubIn = easeOutBack(seg(T, 3.3, 3.95))
    hub.scale.setScalar(safeScale(hubIn))
    hub.rotation.set(T * 0.5, T * 0.9, 0)
    hubRing.rotation.set(1.15 + Math.sin(T * 0.8) * 0.2, 0, T * 1.4)
    const active = smooth(seg(T, 3.3, 3.9)) * (1 - smooth(seg(T, 6.0, 6.4)))
    hubGlow.material.opacity = active * (0.6 + 0.2 * Math.sin(T * 5))
    gem.material.emissiveIntensity = 0.45 + active * 0.5
    setShockRing(hubWave, T - 3.4, 1.0, 4.5)
    burst(3.45, HUB.x, HUB.y, 1.2, cGold, 3.0, 1.0)

    feedBeams.forEach((beam, i) => {
      const grow = smooth(seg(T, 3.2 + i * 0.05, 3.7 + i * 0.05))
      pA.set(SRC_X[i], SRC_Y - 0.75, 0.3)
      pB.set(HUB.x, HUB.y + 0.45, HUB.z)
      pC.copy(pA).lerp(pB, grow)
      setBeam(beam, pA, pC, 0.035)
      beam.material.opacity = 0.75 * (1 - smooth(seg(T, 4.6, 5.4)) * 0.6)
    })

    outputs.forEach((out) => {
      const i = out.i
      const appear = 3.95 + i * 0.28
      const k = seg(T, appear, appear + 0.75)
      const fly = easeOutCubic(k)
      const toLabel = easeInOutCubic(seg(T, 6.45, 7.05))
      const lane = LANE_Y[out.spec.lane]
      const bob = Math.sin(T * 1.2 + i) * 0.06 * (1 - toLabel)
      const gx = lerp(HUB.x, OUT_X[i], fly)
      const gy = lerp(HUB.y, OUT_Y, fly) + bob + Math.sin(fly * Math.PI) * 0.7
      out.group.position.set(lerp(gx, LABEL_X, toLabel), lerp(gy, lane, toLabel), lerp(lerp(HUB.z, 0.3, fly), 0.4, toLabel))
      out.group.rotation.set(0, (1 - fly) * -0.9 + Math.sin(T * 0.7 + i) * 0.04 * (1 - toLabel), (1 - fly) * (i - 2.5) * 0.35)
      const pop = k > 0 ? lerp(0.2, 1, easeOutBack(k)) : 0
      out.group.scale.setScalar(safeScale(pop * (1 - toLabel * 0.97)))
      out.group.visible = T < 7.1 && k > 0
      flashCard(out.card, bump(seg(T, appear + 0.3, appear + 1.0)) * 0.55)
      out.halo.material.opacity = bump(seg(T, appear, appear + 1.2)) * 0.5
      burst(appear + 0.45, OUT_X[i], OUT_Y + 0.4, 0.9, out.color, 2.4, 0.9)
    })

    outBeams.forEach((beam, i) => {
      const appear = 3.95 + i * 0.28
      const grow = smooth(seg(T, appear - 0.15, appear + 0.3))
      pA.set(HUB.x, HUB.y - 0.4, HUB.z)
      pB.set(OUT_X[i], OUT_Y + 1.6, 0.3)
      pC.copy(pA).lerp(pB, grow)
      setBeam(beam, pA, pC, 0.03)
      beam.material.opacity = 0.6 * (1 - smooth(seg(T, appear + 0.5, appear + 1.2)) * 0.55)
    })

    /* ---------- 3 y 4 · línea de tiempo ---------- */
    const gIn = easeOutBack(seg(T, 6.5, 7.1))
    const gOut = smooth(seg(T, 12.5, 12.95))
    setGroupScale(rootG, gIn * (1 - gOut), PANEL.y)

    const longGo = smooth(seg(T, 9.7, 10.2))
    labels.forEach((label, i) => {
      const spec = OUTPUTS[i]
      label.material.opacity = spec.pre ? 1 : lerp(0.4, 1, longGo)
    })

    const head = playheadAt(T)
    const headOn = smooth(seg(T, 7.2, 7.4)) * (1 - smooth(seg(T, 12.3, 12.6)))
    playheadLine.position.x = minX(head)
    playheadLine.material.opacity = headOn * 0.75
    playheadGlow.position.x = minX(head)
    playheadGlow.material.opacity = headOn * 0.9

    bars.forEach((bar) => {
      const spec = bar.spec
      let len
      if (spec.pre) {
        len = Math.max(0, longBarLen(spec, T))
      } else {
        const p = T >= 10.0 ? 0.2 + 5.8 * seg(T, 10.0, 12.4) : 0
        len = Math.min(Math.max(p - spec.start, 0), spec.end - spec.start)
      }
      const w = len * UPM
      bar.mesh.scale.set(safeScale(w), 1, 1)
      bar.mesh.visible = w > 0.001
      bar.stripes.scale.set(safeScale(w), 1, 1)
      bar.stripes.visible = w > 0.001
      const done = spec.pre ? T > 12.4 : len >= spec.end - spec.start - 1e-6
      const running = !done && w > 0.001
      const map = bar.stripes.material.map
      map.repeat.x = Math.max(w * 1.6, 0.01)
      map.offset.x = -T * 0.7
      bar.stripes.material.opacity = running ? 0.34 : 0.0
      bar.mesh.material.emissiveIntensity = 0.28 + (running ? 0.18 * Math.sin(T * 6 + spec.lane) : 0)
      bar.head.position.x = bar.mesh.position.x + w
      bar.head.material.opacity = running ? 0.8 : 0
      const doneAt = spec.pre ? 12.4 : 10.0 + ((spec.end - 0.2) / 5.8) * 2.4
      bar.tick.position.set(bar.mesh.position.x + w + 0.42, bar.y, 0.45)
      bar.tick.scale.setScalar(safeScale(easeOutBack(seg(T, doneAt, doneAt + 0.35)) * 0.42))
      if (T >= doneAt && T < doneAt + 0.9) events.push({ t: doneAt, x: bar.mesh.position.x + w, y: bar.y, z: 0.9, color: cGreen, speed: 1.4, life: 0.8 })
      if (bar.tag) {
        const showAt = spec.key === 'audio' ? 9.3 : 9.45
        bar.tag.scale.setScalar(safeScale(easeOutBack(seg(T, showAt, showAt + 0.4))))
        bar.tag.position.x = bar.mesh.position.x + Math.max(w - 0.95, 0.7)
      }
    })

    // los 10 minutos
    tenGlow.material.opacity = bump(seg(T, 9.25, 10.0)) * 0.9
    burst(9.3, minX(10), LANE_Y[0], 0.9, cGold, 2.6, 1.0)
    burst(9.45, minX(10), LANE_Y[1], 0.9, cGold, 2.6, 1.0)

    /* ---------- 5 · revisar antes de compartir ---------- */
    rootR.visible = T > 12.85
    const paperIn = easeOutBack(seg(T, 12.95, 13.55))
    paper.group.scale.setScalar(safeScale(paperIn))
    paper.group.rotation.set(0, Math.sin(T * 0.6) * 0.03, Math.sin(T * 0.45) * 0.006)

    // lupa
    lensAt(T, lensPos)
    const lensIn = easeOutBack(seg(T, 13.1, 13.5))
    const lensZoom = 1 + bump(seg(T, 14.4, 15.2)) * 0.18
    lens.group.position.set(lensPos.x, lensPos.y, 1.2)
    lens.group.rotation.z = Math.sin(T * 2) * 0.05
    lens.group.scale.setScalar(safeScale(lensIn * lensZoom))
    lensGlow.material.opacity = 0.3 + smooth(seg(T, 14.4, 14.7)) * 0.5

    // frase suavizada: marcada
    const mark = easeInOutCubic(seg(T, 14.5, 14.95))
    flagBar.scale.set(safeScale(5.3 * mark), 1.0, 1)
    const frameOn = smooth(seg(T, 14.85, 15.1))
    flagFrame.material.opacity = frameOn * (0.75 + 0.25 * Math.sin(T * 7))
    flagWarn.scale.setScalar(safeScale(easeOutBack(seg(T, 14.9, 15.3)) * 0.75))
    flagGlow.material.opacity = frameOn * 0.4
    flashCard(paper, frameOn * 0.22)
    burst(14.9, PAPER.x + 3.0, FLAG_Y, 1.2, cRed, 2.6, 1.0)

    // fuentes que no coinciden
    const cardIn = easeOutBack(seg(T, 14.75, 15.3))
    sourcesCard.group.scale.setScalar(safeScale(cardIn))
    sourcesCard.group.position.y = CARD.y + Math.sin(T * 1.3) * 0.05
    cardGlow.material.opacity = smooth(seg(T, 14.8, 15.3)) * 0.35
    flashCard(sourcesCard, bump(seg(T, 15.0, 15.7)) * 0.4)
    const link = smooth(seg(T, 15.0, 15.4))
    pA.set(PAPER.x + 3.35, FLAG_Y, 0.9)
    pB.set(CARD.x - CARD.w / 2 + 0.1, CARD.y, 0.9)
    pC.copy(pA).lerp(pB, link)
    setBeam(linkBeam, pA, pC, 0.05)
    linkBeam.material.opacity = 0.85 * (link > 0 ? 1 : 0)
    linkDot.position.copy(pC)
    linkDot.material.opacity = link > 0 ? 0.9 : 0

    bursts.update(T, events)
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize, dispose }
}
