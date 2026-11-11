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
  setCardOpacity,
  setShockRing,
} from './stageKit'

/**
 * Entregable · Lo que se lleva
 *  1 Pregunta · 2 Respuesta · 3 Fuente abierta
 *  4 El entregable · 5 Probado con otra cuenta
 */

export const ENTREGABLE_DURATION = 16

const GREEN = '#1f8a5b'
const RED = '#d23a31'

/* ---------------- piezas de rompecabezas ---------------- */
const PIECE = { w: 4.2, h: 3.6, depth: 0.16, r: 0.26, y: 3.6 }
const BEVEL = 0.035
const KNOB = { c: 0.25, R: 0.45 } // saliente / hueco, medidos desde el borde real
const FACE = { w: PIECE.w + 1.6, h: PIECE.h + 0.2 }
const PXU = 130 // píxeles de textura por unidad en las piezas
const SLOT_X = [-5.0, 0, 5.0]
const JOIN_X = [-4.2, 0, 4.2]
const DROP_AT = [0.75, 3.95, 7.15]
const DROPS = [
  { tone: '#f4cb18', tag: '1 · PREGUNTA', left: false, right: true },
  { tone: '#4574b9', tag: '2 · RESPUESTA', left: true, right: true },
  { tone: '#1f8a5b', tag: '3 · FUENTE ABIERTA', left: true, right: false },
]
// frase resaltada en la pieza de la fuente (unidades locales de la pieza)
const HL = { x: 0.3, y: 0.02, w: 2.9, h: 0.44 }
const CITE = { x: -0.78, y: -1.05 } // chip [1] en la pieza de la respuesta

/* ---------------- verificación ---------------- */
const WIN = { x: -0.5, y: 3.7, w: 6.4, h: 4.8 }
const CHROME_H = 0.76
const CHECK = { x: 5.7, y: 3.7, w: 4.6, h: 5.0 }
const CLAIMS = [
  'Responde solo con las fuentes del curso',
  'Cada cita que uso la abrí y verifiqué',
  'El informe no tiene datos inventados',
  'El enlace funciona con otra cuenta',
]
const TICK_AT = [14.2, 14.6, 15.0, 15.4]
const CHIP = { w: 4.4, h: 0.8, x: 0, y: 1.05 }

const FOCUS_KEYS = [
  [0, -3],
  [2.8, -3],
  [3.6, 0],
  [6.0, 0],
  [6.8, 3.2],
  [9.4, 3.2],
  [10.1, 0],
  [12.6, 0],
  [13.4, 1.6],
  [16, 1.6],
]

function track(T, keys) {
  const first = keys[0]
  const last = keys[keys.length - 1]
  if (T <= first[0]) return first[1]
  if (T >= last[0]) return last[1]
  for (let i = 0; i < keys.length - 1; i += 1) {
    const a = keys[i]
    const b = keys[i + 1]
    if (T <= b[0]) return lerp(a[1], b[1], easeInOutCubic((T - a[0]) / (b[0] - a[0])))
  }
  return last[1]
}

/* ================================================================== */
/* Contorno de pieza (compartido por geometría y textura)               */
/* ================================================================== */

/** Saliente/hueco circular: devuelve el semialto de corte y el ángulo del punto de corte. */
function knobParams(c, R) {
  const dy = Math.sqrt(Math.max(R * R - c * c, 0.0001))
  return { c, R, dy, a: Math.atan2(dy, -c) }
}

/**
 * Traza el contorno de una pieza. `p` es un adaptador { move, line, quad, arc }
 * (arc: cx, cy, R, a0, a1, ccw) en coordenadas con y hacia arriba.
 */
function piecePath(p, hw, hh, r, tab, notch, hasNotch, hasTab) {
  p.move(-hw + r, -hh)
  p.line(hw - r, -hh)
  p.quad(hw, -hh, hw, -hh + r)
  if (hasTab) {
    p.line(hw, -tab.dy)
    p.arc(hw + tab.c, 0, tab.R, -tab.a, tab.a, true)
  }
  p.line(hw, hh - r)
  p.quad(hw, hh, hw - r, hh)
  p.line(-hw + r, hh)
  p.quad(-hw, hh, -hw, hh - r)
  if (hasNotch) {
    p.line(-hw, notch.dy)
    p.arc(-hw + notch.c, 0, notch.R, notch.a, -notch.a, false)
  }
  p.line(-hw, -hh + r)
  p.quad(-hw, -hh, -hw + r, -hh)
}

const shapeAdapter = (shape) => ({
  move: (x, y) => shape.moveTo(x, y),
  line: (x, y) => shape.lineTo(x, y),
  quad: (cx, cy, x, y) => shape.quadraticCurveTo(cx, cy, x, y),
  arc: (cx, cy, R, a0, a1, ccw) => shape.absarc(cx, cy, R, a0, a1, !ccw),
})

/** Adaptador de canvas: origen (ox, oy), escala S, y invertida. */
const canvasAdapter = (ctx, ox, oy, S) => ({
  move: (x, y) => ctx.moveTo(ox + x * S, oy - y * S),
  line: (x, y) => ctx.lineTo(ox + x * S, oy - y * S),
  quad: (cx, cy, x, y) => ctx.quadraticCurveTo(ox + cx * S, oy - cy * S, ox + x * S, oy - y * S),
  arc: (cx, cy, R, a0, a1, ccw) => ctx.arc(ox + cx * S, oy - cy * S, R * S, -a0, -a1, ccw),
})

function tracePiece(ctx, ox, oy, S, spec) {
  const knob = knobParams(KNOB.c, KNOB.R)
  ctx.beginPath()
  piecePath(canvasAdapter(ctx, ox, oy, S), PIECE.w / 2, PIECE.h / 2, PIECE.r, knob, knob, spec.left, spec.right)
  ctx.closePath()
}

const geometryCache = new Map()
function pieceGeometry(spec) {
  const key = `${spec.left}|${spec.right}`
  let geometry = geometryCache.get(key)
  if (!geometry) {
    // el bisel agranda el contorno: se compensa para que saliente y hueco encajen
    const tab = knobParams(KNOB.c + BEVEL, KNOB.R - BEVEL)
    const notch = knobParams(KNOB.c - BEVEL, KNOB.R + BEVEL)
    const shape = new THREE.Shape()
    piecePath(shapeAdapter(shape), PIECE.w / 2 - BEVEL, PIECE.h / 2 - BEVEL, PIECE.r - BEVEL * 0.5, tab, notch, spec.left, spec.right)
    geometry = new THREE.ExtrudeGeometry(shape, {
      depth: PIECE.depth,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: BEVEL,
      bevelOffset: 0,
      bevelSegments: 3,
      curveSegments: 16,
    })
    geometry.translate(0, 0, -PIECE.depth / 2)
    geometryCache.set(key, geometry)
  }
  return geometry
}
const PIECE_THICKNESS = PIECE.depth + BEVEL * 2

/* ================================================================== */
/* Texturas                                                            */
/* ================================================================== */

function drawPieceFace(ctx, w, h, index) {
  const spec = DROPS[index]
  const S = PXU
  const ox = w / 2
  const oy = h / 2
  const X = (x) => ox + x * S
  const Y = (y) => oy - y * S
  const hw = PIECE.w / 2

  ctx.save()
  tracePiece(ctx, ox, oy, S, spec)
  ctx.clip()
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#fffaf0')
  g.addColorStop(1, '#ece2c6')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = spec.tone
  ctx.fillRect(0, 0, w, Y(PIECE.h / 2 - 0.22))
  const left = spec.left ? -hw + 1.0 : -hw + 0.45
  const bodyW = (hw - 0.4 - left) * S
  const ink = '#042361'

  fitText(ctx, spec.tag, X(left), Y(1.2), { weight: 500, size: 23, family: FONT_MONO, color: 'rgba(4,35,97,0.68)', maxWidth: bodyW })

  if (index === 0) {
    drawFlowText(
      ctx,
      [{ text: '¿Quién paga un impuesto: el comprador o el vendedor?' }],
      X(left),
      Y(0.55),
      bodyW,
      0.44 * S,
      { weight: 800, size: 36, color: ink },
    )
    // signo de pregunta
    ctx.fillStyle = spec.tone
    ctx.beginPath()
    ctx.arc(X(1.2), Y(-1.08), 0.42 * S, 0, Math.PI * 2)
    ctx.fill()
    fitText(ctx, '?', X(1.2), Y(-1.08) + 22, { weight: 900, size: 70, color: ink, align: 'center', maxWidth: 40 })
    fitText(ctx, 'pregunta al cuaderno', X(left), Y(-1.45), { weight: 500, size: 21, family: FONT_MONO, color: 'rgba(4,35,97,0.5)', maxWidth: bodyW * 0.6 })
  } else if (index === 1) {
    drawFlowText(
      ctx,
      [
        { text: 'El costo ' },
        { text: 'se reparte entre ambos', hl: true },
        { text: ', según la elasticidad.' },
      ],
      X(left),
      Y(0.7),
      bodyW,
      0.38 * S,
      { weight: 700, size: 31, color: ink },
    )
    fitText(ctx, 'con cita a la fuente', X(left), Y(-1.5), { weight: 500, size: 21, family: FONT_MONO, color: 'rgba(4,35,97,0.5)', maxWidth: bodyW })
  } else {
    fitText(ctx, 'Lectura 2 · p. 14', X(left), Y(0.84), { weight: 800, size: 28, color: ink, maxWidth: bodyW })
    ctx.fillStyle = 'rgba(46,70,128,0.45)'
    ;[0.55, 0.32].forEach((y, i) => {
      roundRectPath(ctx, X(left), Y(y), i === 1 ? bodyW * 0.7 : bodyW, 10, 5)
      ctx.fill()
    })
    fitText(ctx, '…el costo se reparte entre ambos…', X(left), Y(-0.04), { weight: 700, size: 26, color: ink, maxWidth: bodyW })
    ctx.fillStyle = 'rgba(46,70,128,0.45)'
    ;[-0.4, -0.64, -0.88].forEach((y, i) => {
      roundRectPath(ctx, X(left), Y(y), i === 2 ? bodyW * 0.55 : bodyW, 10, 5)
      ctx.fill()
    })
    fitText(ctx, 'fragmento exacto', X(left), Y(-1.5), { weight: 500, size: 21, family: FONT_MONO, color: 'rgba(4,35,97,0.5)', maxWidth: bodyW })
  }
  ctx.restore()
}

function drawTray(ctx, w, h) {
  ctx.save()
  clipRound(ctx, w, h, 36)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#12388a')
  g.addColorStop(1, '#0a2252')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(68,211,254,0.07)'
  ctx.fillRect(0, 0, w, h * 0.4)
  ctx.strokeStyle = 'rgba(68,211,254,0.55)'
  ctx.lineWidth = 4
  roundRectPath(ctx, 6, 6, w - 12, h - 12, 32)
  ctx.stroke()
  SLOT_X.forEach((x, i) => {
    const ox = w / 2 + x * 100
    const oy = h / 2
    ctx.setLineDash([16, 12])
    ctx.strokeStyle = 'rgba(127,220,255,0.55)'
    ctx.lineWidth = 3.5
    tracePiece(ctx, ox, oy, 100, DROPS[i])
    ctx.stroke()
    ctx.setLineDash([])
    fitText(ctx, String(i + 1), ox, oy + 55, { weight: 800, size: 160, color: 'rgba(127,220,255,0.14)', align: 'center', maxWidth: 140 })
  })
  ctx.restore()
}

function drawFrame(ctx, w, h) {
  ctx.fillStyle = 'rgba(244,203,24,0.07)'
  roundRectPath(ctx, 8, 8, w - 16, h - 16, 44)
  ctx.fill()
  ctx.strokeStyle = '#f4cb18'
  ctx.lineWidth = 8
  ctx.setLineDash([26, 16])
  ctx.stroke()
  ctx.setLineDash([])
}

function drawPill(ctx, w, h, text, tone) {
  ctx.fillStyle = 'rgba(4,35,97,0.92)'
  roundRectPath(ctx, 3, 3, w - 6, h - 6, (h - 6) / 2)
  ctx.fill()
  ctx.strokeStyle = tone
  ctx.lineWidth = 4
  ctx.stroke()
  ctx.fillStyle = tone
  ctx.beginPath()
  ctx.arc(h * 0.5, h / 2, h * 0.17, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, text, h * 0.88, h * 0.66, { weight: 800, size: h * 0.46, color: '#ffffff', maxWidth: w - h * 1.1 })
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
  ctx.moveTo(w * 0.28, h * 0.53)
  ctx.lineTo(w * 0.44, h * 0.68)
  ctx.lineTo(w * 0.73, h * 0.34)
  ctx.stroke()
}

function drawCiteChip(ctx, w, h) {
  ctx.fillStyle = GREEN
  roundRectPath(ctx, 3, 3, w - 6, h - 6, (h - 6) / 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 3
  ctx.stroke()
  fitText(ctx, '[1]', w / 2, h * 0.68, { weight: 800, size: h * 0.56, color: '#ffffff', align: 'center', maxWidth: w - 16 })
}

function drawChain(ctx, cx, cy) {
  ctx.save()
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#042361'
  ;[-1, 1].forEach((side) => {
    ctx.save()
    ctx.translate(cx + side * 10, cy)
    ctx.rotate(-Math.PI / 4)
    roundRectPath(ctx, -17, -9, 34, 18, 9)
    ctx.stroke()
    ctx.restore()
  })
  ctx.restore()
}

function drawChip(ctx, w, h) {
  ctx.save()
  clipRound(ctx, w, h, h / 2)
  const g = ctx.createLinearGradient(0, 0, w, 0)
  g.addColorStop(0, '#ffe27a')
  g.addColorStop(1, '#f2b90f')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  drawChain(ctx, h * 0.62, h / 2)
  fitText(ctx, 'Enlace al cuaderno', h * 1.05, h * 0.66, { weight: 800, size: h * 0.46, color: '#042361', maxWidth: w - h * 1.3 })
  ctx.restore()
}

function drawBrowser(ctx, w, h) {
  ctx.save()
  clipRound(ctx, w, h, 26)
  ctx.fillStyle = '#1b2233'
  ctx.fillRect(0, 0, w, h)
  // pestaña sin sesión
  ctx.fillStyle = '#2c3550'
  roundRectPath(ctx, 14, 8, 232, 34, 12)
  ctx.fill()
  // sombrero y gafas
  ctx.fillStyle = '#c7d2ee'
  roundRectPath(ctx, 26, 15, 22, 5, 2.5)
  ctx.fill()
  ctx.fillRect(31, 11, 12, 6)
  ctx.strokeStyle = '#c7d2ee'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(32, 28, 5, 0, Math.PI * 2)
  ctx.arc(44, 28, 5, 0, Math.PI * 2)
  ctx.stroke()
  fitText(ctx, 'Ventana sin sesión', 58, 32, { weight: 500, size: 17, family: FONT_BODY, color: '#e6edff', maxWidth: 180 })
  // estudiante
  ctx.fillStyle = '#44d3fe'
  ctx.beginPath()
  ctx.arc(w - 150, 26, 17, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, 'E', w - 150, 33, { weight: 800, size: 21, color: '#042361', align: 'center', maxWidth: 20 })
  fitText(ctx, 'Estudiante', w - 126, 33, { weight: 500, size: 18, family: FONT_MONO, color: '#c9d6f5', maxWidth: 112 })
  // barra de direcciones
  ctx.fillStyle = '#101624'
  roundRectPath(ctx, 120, 46, w - 180, 26, 13)
  ctx.fill()
  ctx.fillStyle = '#2c3550'
  ;[0, 1, 2].forEach((i) => {
    ctx.beginPath()
    ctx.arc(32 + i * 24, 59, 7, 0, Math.PI * 2)
    ctx.fill()
  })
  // área de contenido (se cubre luego con la vista de conversación)
  ctx.fillStyle = '#f4f6fa'
  ctx.fillRect(0, 76, w, h - 76)
  ctx.restore()
}

function drawUrl(ctx, w, h) {
  fitText(ctx, 'notebooklm.google.com/…/chat', 8, h * 0.7, { weight: 500, size: h * 0.62, family: FONT_MONO, color: '#c9d6f5', maxWidth: w - 12 })
}

function drawConversation(ctx, w, h) {
  ctx.save()
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#fffaf0')
  g.addColorStop(1, '#efe6cc')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  fitText(ctx, 'Incidencia de los impuestos', 28, 44, { weight: 800, size: 28, color: '#042361', maxWidth: w - 60 })
  ctx.fillStyle = 'rgba(4,35,97,0.12)'
  ctx.fillRect(24, 60, w - 48, 2)
  // pregunta
  ctx.fillStyle = '#4574b9'
  roundRectPath(ctx, w - 360, 82, 336, 58, 18)
  ctx.fill()
  fitText(ctx, '¿Quién paga un impuesto?', w - 192, 119, { weight: 700, size: 24, color: '#ffffff', align: 'center', maxWidth: 304 })
  // respuesta
  ctx.fillStyle = '#e6eefb'
  roundRectPath(ctx, 24, 158, 450, 190, 18)
  ctx.fill()
  ctx.strokeStyle = '#b9cdee'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fillStyle = 'rgba(46,70,128,0.5)'
  ;[190, 214].forEach((y) => {
    roundRectPath(ctx, 46, y, 402, 10, 5)
    ctx.fill()
  })
  ctx.fillStyle = 'rgba(244,203,24,0.88)'
  roundRectPath(ctx, 38, 236, 420, 32, 9)
  ctx.fill()
  ctx.fillStyle = 'rgba(4,35,97,0.8)'
  roundRectPath(ctx, 46, 247, 360, 11, 5.5)
  ctx.fill()
  ctx.fillStyle = 'rgba(46,70,128,0.5)'
  roundRectPath(ctx, 46, 284, 300, 10, 5)
  ctx.fill()
  ;[1, 2].forEach((n, i) => {
    ctx.fillStyle = GREEN
    roundRectPath(ctx, 46 + i * 62, 308, 52, 28, 14)
    ctx.fill()
    fitText(ctx, `[${n}]`, 72 + i * 62, 328, { weight: 800, size: 18, color: '#ffffff', align: 'center', maxWidth: 44 })
  })
  // caja de pregunta
  ctx.fillStyle = '#ffffff'
  roundRectPath(ctx, 24, h - 52, w - 48, 38, 19)
  ctx.fill()
  ctx.strokeStyle = 'rgba(4,35,97,0.16)'
  ctx.stroke()
  fitText(ctx, 'Pregunta sobre las fuentes…', 46, h - 28, { weight: 500, size: 17, family: FONT_BODY, color: 'rgba(4,35,97,0.45)', maxWidth: 360 })
  ctx.restore()
}

function drawChecklist(ctx, w, h) {
  const S = 120
  ctx.save()
  clipRound(ctx, w, h, 32)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#fffaf0')
  g.addColorStop(1, '#ece2c6')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = GREEN
  ctx.fillRect(0, 0, w, 16)
  fitText(ctx, 'Antes de entregar', 28, 62, { weight: 800, size: 36, color: '#042361', maxWidth: w - 56 })
  fitText(ctx, 'PROBADO CON OTRA CUENTA', 28, 98, { weight: 500, size: 19, family: FONT_MONO, color: 'rgba(4,35,97,0.6)', maxWidth: w - 56 })
  CLAIMS.forEach((text, i) => {
    const top = (1.3 + 0.9 * i) * S
    ctx.fillStyle = 'rgba(255,255,255,0.75)'
    roundRectPath(ctx, 20, top, w - 40, 0.8 * S, 16)
    ctx.fill()
    ctx.strokeStyle = 'rgba(4,35,97,0.1)'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.strokeStyle = 'rgba(4,35,97,0.35)'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(0.6 * S + 8, top + 0.4 * S, 17, 0, Math.PI * 2)
    ctx.stroke()
    drawFlowText(ctx, [{ text }], 1.05 * S + 8, top + 0.4 * S - 6, w - 1.05 * S - 40, 30, { weight: 700, size: 25, color: '#042361' })
  })
  ctx.restore()
}

/* ================================================================== */

export default function createEntregableScene({ canvas, width, height, invalidate }) {
  const DUR = ENTREGABLE_DURATION
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: DUR,
    frame: { wideHalfW: 8.6, narrowHalfW: 6.4, halfH: 4.5, camY: 5.0, lookY: 3.45 },
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 14, perBurst: 18, seed: 66 })
  scene.add(bursts.points)
  const cGreen = new THREE.Color(0x3be09a)
  const cGold = new THREE.Color(0xf4cb18)
  const cBlue = new THREE.Color(0x7fb0ff)

  const markOk = makeTex(128, 128, (ctx, w, h) => drawMark(ctx, w, h, 'ok'), invalidate)
  const makeSprite = (map, parent) => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false }))
    sprite.scale.setScalar(0.0001)
    parent.add(sprite)
    return sprite
  }

  /* ---------------- bandeja con tres huecos ---------------- */
  const tray = makeSlabCard({
    w: 15.6,
    h: 4.8,
    depth: 0.1,
    radius: 0.5,
    bevel: 0.04,
    edge: '#0b2a66',
    texture: makeTex(1560, 480, drawTray, invalidate),
    roughness: 0.5,
    metalness: 0.15,
    emissive: '#44d3fe',
  })
  tray.group.position.set(0, PIECE.y, -0.32)
  tray.group.scale.setScalar(0.0001)
  scene.add(tray.group)
  const trayGlow = addGlow(scene, glow, 0x44d3fe, 17, 0)
  trayGlow.position.set(0, PIECE.y, -1.0)

  /* ---------------- las tres piezas ---------------- */
  const pieces = DROPS.map((spec, i) => {
    const group = new THREE.Group()
    group.visible = false
    scene.add(group)

    const edgeMat = new THREE.MeshStandardMaterial({
      color: '#efe6cb',
      roughness: 0.6,
      metalness: 0.05,
      emissive: spec.tone,
      emissiveIntensity: 0,
    })
    const slab = new THREE.Mesh(pieceGeometry(spec), edgeMat)
    slab.castShadow = true
    slab.receiveShadow = true
    group.add(slab)

    const faceMat = new THREE.MeshStandardMaterial({
      map: makeTex(Math.round(FACE.w * PXU), Math.round(FACE.h * PXU), (ctx, w, h) => drawPieceFace(ctx, w, h, i), invalidate),
      roughness: 0.7,
      metalness: 0.02,
      emissive: spec.tone,
      emissiveIntensity: 0,
      transparent: true,
    })
    const face = new THREE.Mesh(new THREE.PlaneGeometry(FACE.w, FACE.h), faceMat)
    face.position.z = PIECE_THICKNESS / 2 + 0.004
    face.receiveShadow = true
    group.add(face)

    const halo = addGlow(group, glow, new THREE.Color(spec.tone), 8.5, 0)
    halo.position.z = -0.5
    return { group, edgeMat, faceMat, halo, spec, color: new THREE.Color(spec.tone) }
  })
  const flashPiece = (piece, amount) => {
    piece.edgeMat.emissiveIntensity = amount
    piece.faceMat.emissiveIntensity = amount * 0.5
  }

  const FZ = PIECE_THICKNESS / 2

  // chip [1] de la respuesta
  const cite = makeTextPlane(0.62, 0.3, makeTex(124, 60, drawCiteChip, invalidate))
  cite.position.set(CITE.x, CITE.y, FZ + 0.03)
  cite.scale.setScalar(0.0001)
  cite.renderOrder = 6
  pieces[1].group.add(cite)

  // marcador de la frase resaltada de la fuente
  const hlGeometry = new THREE.PlaneGeometry(1, 1)
  hlGeometry.translate(0.5, 0, 0)
  const hl = new THREE.Mesh(
    hlGeometry,
    new THREE.MeshBasicMaterial({ color: 0xf4cb18, transparent: true, opacity: 0.5, depthWrite: false, toneMapped: false }),
  )
  hl.position.set(HL.x - HL.w / 2, HL.y, FZ + 0.025)
  hl.scale.set(0.0001, HL.h, 1)
  hl.renderOrder = 5
  pieces[2].group.add(hl)

  // lupa que abre la fuente y rayo cita → fuente
  const lens = makeMagnifier({ radius: 0.7 })
  lens.group.scale.setScalar(0.0001)
  lens.group.position.z = 1.3
  scene.add(lens.group)
  const lensGlow = addGlow(lens.group, glow, 0xfff1a6, 2.6, 0)
  lensGlow.position.z = 0.1
  const citeBeam = makeBeam(0x3be09a, 0.85)
  scene.add(citeBeam)
  const citeDot = addGlow(scene, glow, 0x9ff0c8, 0.8, 0)
  const bA = new THREE.Vector3()
  const bB = new THREE.Vector3()
  const bC = new THREE.Vector3()
  const bD = new THREE.Vector3()

  const joinRings = [0, 1].map(() => {
    const ring = makeShockRing(0xffe27a)
    ring.position.z = 0.5
    scene.add(ring)
    return ring
  })
  const landRings = DROPS.map((spec) => {
    const ring = makeShockRing(new THREE.Color(spec.tone))
    ring.position.set(0, PIECE.y - PIECE.h / 2 + 0.05, 0.4)
    ring.rotation.x = 0
    scene.add(ring)
    return ring
  })

  /* ---------------- el entregable ---------------- */
  const rootE = new THREE.Group()
  scene.add(rootE)
  const frameMesh = makeTextPlane(13.4, 4.3, makeTex(1340, 430, drawFrame, invalidate))
  frameMesh.position.set(0, PIECE.y, -0.18)
  frameMesh.material.opacity = 0
  rootE.add(frameMesh)
  const label = makeTextPlane(4.4, 0.76, makeTex(440, 76, (ctx, w, h) => drawPill(ctx, w, h, 'El entregable', '#f4cb18'), invalidate))
  label.position.set(0, 6.25, 0.4)
  label.scale.setScalar(0.0001)
  rootE.add(label)
  const finalGlow = addGlow(rootE, glow, 0xf4cb18, 18, 0)
  finalGlow.position.set(0, PIECE.y, -0.9)

  const chip = makeSlabCard({
    w: CHIP.w,
    h: CHIP.h,
    depth: 0.1,
    radius: 0.4,
    bevel: 0.03,
    edge: '#d9a40a',
    texture: makeTex(Math.round(CHIP.w * 120), Math.round(CHIP.h * 120), drawChip, invalidate),
    roughness: 0.45,
    emissive: '#f4cb18',
  })
  chip.group.position.set(CHIP.x, CHIP.y, 0.5)
  chip.group.scale.setScalar(0.0001)
  scene.add(chip.group)
  const chipGlow = addGlow(chip.group, glow, 0xffe27a, 6, 0)
  chipGlow.position.z = -0.3

  /* ---------------- ventana sin sesión + lista ---------------- */
  const rootV = new THREE.Group()
  rootV.visible = false
  scene.add(rootV)

  const win = makeSlabCard({
    w: WIN.w,
    h: WIN.h,
    depth: 0.12,
    radius: 0.3,
    bevel: 0.04,
    edge: '#10162a',
    texture: makeTex(Math.round(WIN.w * 100), Math.round(WIN.h * 100), drawBrowser, invalidate),
    roughness: 0.55,
    metalness: 0.1,
    emissive: '#44d3fe',
  })
  win.group.position.set(WIN.x, WIN.y, 0.2)
  win.group.scale.setScalar(0.0001)
  rootV.add(win.group)
  const WZ = win.thickness / 2
  const winGlow = addGlow(rootV, glow, 0x44d3fe, 11, 0)
  winGlow.position.set(WIN.x, WIN.y, -0.6)

  const contentH = WIN.h - CHROME_H
  const content = makeTextPlane(
    WIN.w - 0.06,
    contentH - 0.03,
    makeTex(Math.round((WIN.w - 0.06) * 100), Math.round((contentH - 0.03) * 100), drawConversation, invalidate),
  )
  content.position.set(0, WIN.h / 2 - CHROME_H - contentH / 2 - 0.0, WZ + 0.012)
  content.material.opacity = 0
  content.renderOrder = 4
  win.group.add(content)

  const urlText = makeTextPlane(3.5, 0.24, makeTex(700, 48, drawUrl, invalidate))
  urlText.position.set(0.0, WIN.h / 2 - 0.59, WZ + 0.02)
  urlText.material.opacity = 0
  urlText.renderOrder = 5
  win.group.add(urlText)

  const loadGeometry = new THREE.PlaneGeometry(1, 1)
  loadGeometry.translate(0.5, 0, 0)
  const loadBar = new THREE.Mesh(
    loadGeometry,
    new THREE.MeshBasicMaterial({ color: 0x44d3fe, transparent: true, opacity: 0.95, depthWrite: false, toneMapped: false }),
  )
  loadBar.position.set(-WIN.w / 2 + 0.03, WIN.h / 2 - CHROME_H + 0.02, WZ + 0.025)
  loadBar.scale.set(0.0001, 0.05, 1)
  loadBar.renderOrder = 6
  win.group.add(loadBar)

  const winTag = makeTextPlane(4.8, 0.76, makeTex(480, 76, (ctx, w, h) => drawPill(ctx, w, h, 'Sin sesión · como estudiante', '#44d3fe'), invalidate))
  winTag.position.set(WIN.x, 6.55, 0.5)
  winTag.scale.setScalar(0.0001)
  rootV.add(winTag)

  const check = makeSlabCard({
    w: CHECK.w,
    h: CHECK.h,
    depth: 0.12,
    radius: 0.34,
    bevel: 0.04,
    edge: '#d8cda9',
    texture: makeTex(Math.round(CHECK.w * 120), Math.round(CHECK.h * 120), drawChecklist, invalidate),
    roughness: 0.62,
    emissive: '#3be09a',
  })
  check.group.position.set(CHECK.x, CHECK.y, 0.2)
  check.group.scale.setScalar(0.0001)
  rootV.add(check.group)
  const CZ = check.thickness / 2
  const checkGlow = addGlow(rootV, glow, 0x3be09a, 12, 0)
  checkGlow.position.set(CHECK.x, CHECK.y, -0.6)

  const rowGeometry = new THREE.PlaneGeometry(1, 1)
  rowGeometry.translate(0.5, 0, 0)
  const rows = CLAIMS.map((_, i) => {
    const y = 0.8 - 0.9 * i // local a la tarjeta
    const bar = new THREE.Mesh(
      rowGeometry,
      new THREE.MeshBasicMaterial({ color: 0x3be09a, transparent: true, opacity: 0.22, depthWrite: false, toneMapped: false }),
    )
    bar.position.set(-CHECK.w / 2 + 0.17, y, CZ + 0.012)
    bar.scale.set(0.0001, 0.8, 1)
    bar.renderOrder = 4
    check.group.add(bar)
    const tick = makeSprite(markOk, check.group)
    tick.position.set(-CHECK.w / 2 + 0.6 + 0.07, y, CZ + 0.16)
    return { bar, tick, y }
  })
  const checkRing = makeShockRing(0x3be09a)
  checkRing.position.set(CHECK.x, CHECK.y, 0.9)
  rootV.add(checkRing)

  /* ---------------- utilidades de movimiento ---------------- */
  const setGroupScale = (group, s, pivotY) => {
    const k = safeScale(s)
    group.scale.setScalar(k)
    group.position.y = pivotY * (1 - k)
    group.visible = s > 0.004
  }

  const quad = (a, c, b, k, out) => {
    const m = 1 - k
    out.x = m * m * a.x + 2 * m * k * c.x + k * k * b.x
    out.y = m * m * a.y + 2 * m * k * c.y + k * k * b.y
    out.z = m * m * a.z + 2 * m * k * c.z + k * k * b.z
  }

  function resize(w, h) {
    stage.resize(w, h)
  }

  // posición de la lupa sobre la frase resaltada
  const LENS_KEYS_X = [[7.3, 7.6], [7.95, SLOT_X[2] + HL.x - 0.5], [8.85, SLOT_X[2] + HL.x + 0.6], [9.35, 8.0]]
  const LENS_KEYS_Y = [[7.3, 6.6], [7.95, PIECE.y + HL.y + 0.2], [8.85, PIECE.y + HL.y + 0.2], [9.35, 6.8]]

  function draw(t) {
    const T = t * DUR
    const fx = track(T, FOCUS_KEYS)
    stage.update(T, fx)
    stage.spot.position.set(fx, 4.6, 5.5)

    const events = []
    const burst = (t0, x, y, z, color, speed = 2.4, life = 0.9) => {
      if (T >= t0 && T <= t0 + life) events.push({ t: t0, x, y, z, color, speed, life })
    }

    /* ---------- 1-3 · las tres piezas caen ---------- */
    const trayIn = easeOutBack(seg(T, 0.1, 0.7))
    const trayOut = smooth(seg(T, 10.0, 10.5))
    tray.group.scale.setScalar(safeScale(trayIn))
    setCardOpacity(tray, 1 - trayOut)
    trayGlow.material.opacity = (0.16 + smooth(seg(T, 0.2, 0.9)) * 0.1) * (1 - trayOut)

    const join = easeInOutCubic(seg(T, 9.85, 10.6))
    const snap = bump(seg(T, 10.5, 10.95))
    pieces.forEach((piece, i) => {
      const a = DROP_AT[i]
      const kf = seg(T, a, a + 0.62)
      const age = T - (a + 0.62)
      const hop = age > 0 ? Math.abs(Math.sin(age * 10)) * Math.exp(-age * 5.5) * 0.4 : 0
      const x = lerp(SLOT_X[i], JOIN_X[i], join)
      const squash = bump(seg(age, 0, 0.16))
      piece.group.visible = T > a
      piece.group.position.set(x, PIECE.y + 5.4 * (1 - kf * kf) + hop, 0.1 + snap * 0.18)
      const tilt = 1 - easeOutCubic(kf)
      piece.group.rotation.set(tilt * 0.6, tilt * 0.35 * (i === 1 ? -1 : 1), tilt * 0.28 * (i === 1 ? -1 : 1))
      piece.group.scale.set(1 + squash * 0.035, 1 - squash * 0.05, 1)
      piece.halo.material.opacity = bump(seg(age, 0, 1.3)) * 0.4 + snap * 0.25
      flashPiece(piece, bump(seg(age, 0, 0.7)) * 0.42 + snap * 0.35)
      setShockRing(landRings[i], age, 0.8, 2.6)
      landRings[i].position.x = SLOT_X[i]
      landRings[i].visible = landRings[i].visible && T < 9.9
      burst(a + 0.62, SLOT_X[i], PIECE.y - 1.7, 0.9, i === 0 ? cGold : i === 1 ? cBlue : cGreen, 2.6, 0.9)
    })

    // chip [1] de la respuesta
    const citeIn = easeOutBack(seg(T, 4.75, 5.2)) * (1 + 0.15 * bump(seg(T, 7.3, 7.9)))
    cite.scale.setScalar(safeScale(citeIn))
    burst(4.8, SLOT_X[1] + CITE.x, PIECE.y + CITE.y, 0.9, cGreen, 1.6, 0.7)

    // lupa que abre la fuente y la frase se resalta
    const lensIn = easeOutBack(seg(T, 7.3, 7.7)) * (1 - smooth(seg(T, 9.0, 9.4)))
    const lx = track(T, LENS_KEYS_X)
    const ly = track(T, LENS_KEYS_Y)
    lens.group.position.set(lx, ly, 1.3)
    lens.group.rotation.z = Math.sin(T * 2.1) * 0.05
    lens.group.scale.setScalar(safeScale(lensIn * (1 + bump(seg(T, 7.9, 8.6)) * 0.15)))
    lensGlow.material.opacity = 0.25 + smooth(seg(T, 7.9, 8.4)) * 0.5

    const mark = easeInOutCubic(seg(T, 8.0, 8.65))
    hl.scale.set(safeScale(HL.w * mark), HL.h, 1)

    bA.set(SLOT_X[1] + CITE.x + 0.3, PIECE.y + CITE.y, 0.5)
    bB.set(SLOT_X[2] + HL.x - HL.w / 2 + 0.3, PIECE.y + HL.y, 0.5)
    const beamK = smooth(seg(T, 7.55, 8.1)) * (T < 9.7 ? 1 - smooth(seg(T, 9.1, 9.5)) : 0)
    bC.copy(bA).lerp(bB, smooth(seg(T, 7.55, 8.1)))
    setBeam(citeBeam, bA, bC, 0.04)
    citeBeam.material.opacity = beamK * 0.85
    citeDot.position.copy(bC)
    citeDot.material.opacity = beamK * 0.9
    burst(8.1, bB.x, bB.y, 0.9, cGold, 2.2, 0.9)

    /* ---------- 4 · las piezas encajan: el entregable ---------- */
    setShockRing(joinRings[0], T - 10.5, 0.9, 2.4)
    setShockRing(joinRings[1], T - 10.55, 0.9, 2.4)
    joinRings[0].position.set(-PIECE.w / 2, PIECE.y, 0.5)
    joinRings[1].position.set(PIECE.w / 2, PIECE.y, 0.5)
    burst(10.5, -PIECE.w / 2, PIECE.y, 0.9, cGold, 2.8, 0.9)
    burst(10.55, PIECE.w / 2, PIECE.y, 0.9, cGold, 2.8, 0.9)

    const frameIn = smooth(seg(T, 10.6, 11.1))
    frameMesh.material.opacity = frameIn * 0.9
    finalGlow.material.opacity = frameIn * 0.3 + snap * 0.2
    label.scale.setScalar(safeScale(easeOutBack(seg(T, 10.85, 11.3))))
    burst(10.95, 0, 6.2, 1.0, cGold, 2.2, 0.8)

    const chipIn = easeOutBack(seg(T, 11.6, 12.1))
    const rootEOut = smooth(seg(T, 12.55, 13.1))
    setGroupScale(rootE, 1 - rootEOut, PIECE.y)
    // las piezas se llevan con el grupo cuando se retira el entregable
    const pieceOut = 1 - rootEOut
    pieces.forEach((piece) => {
      if (rootEOut > 0) {
        const s = safeScale(pieceOut)
        piece.group.scale.multiplyScalar(s)
        piece.group.position.x *= s
        piece.group.position.y = PIECE.y * (1 - s) + piece.group.position.y * s
        piece.group.visible = piece.group.visible && pieceOut > 0.004
      }
    })

    /* ---------- 5 · chip y ventana sin sesión ---------- */
    rootV.visible = T > 12.8
    const winIn = easeOutBack(seg(T, 12.9, 13.45))
    win.group.scale.setScalar(safeScale(winIn))
    winGlow.material.opacity = smooth(seg(T, 13.0, 13.6)) * 0.22
    winTag.scale.setScalar(safeScale(easeOutBack(seg(T, 13.1, 13.55))))
    const checkIn = easeOutBack(seg(T, 13.3, 13.85))
    check.group.scale.setScalar(safeScale(checkIn))
    checkGlow.material.opacity = smooth(seg(T, 13.5, 14.0)) * 0.18

    // el enlace viaja de su sitio a la barra de direcciones
    const flight = seg(T, 12.85, 13.5)
    const fk = easeInOutCubic(flight)
    bA.set(CHIP.x, CHIP.y, 0.5)
    bB.set(WIN.x + 0.0, WIN.y + WIN.h / 2 - 0.56, 0.5)
    bC.set(-4.5, 3.0, 2.2)
    quad(bA, bC, bB, fk, bD)
    const chipSize = T < 12.85 ? chipIn : lerp(1, 0.32, fk) * (1 - smooth(seg(flight, 0.92, 1)))
    chip.group.position.copy(T < 12.85 ? bA : bD)
    chip.group.rotation.z = T < 12.85 ? 0 : Math.sin(fk * Math.PI) * -0.14
    chip.group.scale.setScalar(safeScale(chipSize))
    chip.group.visible = chipSize > 0.004
    chipGlow.material.opacity = 0.25 + Math.sin(fk * Math.PI) * 0.5
    flashCard(chip, T < 12.85 ? bump(seg(T, 12.0, 12.6)) * 0.35 : 0)
    burst(13.5, bB.x, bB.y, 0.9, cGold, 1.8, 0.7)

    urlText.material.opacity = smooth(seg(T, 13.5, 13.8))
    const load = easeOutCubic(seg(T, 13.6, 14.05))
    loadBar.scale.set(safeScale(load * (WIN.w - 0.06)), 0.05, 1)
    loadBar.material.opacity = 0.95 * (1 - smooth(seg(T, 14.0, 14.2)))
    content.material.opacity = smooth(seg(T, 13.95, 14.25))

    // las afirmaciones se marcan una a una
    rows.forEach((row, i) => {
      const at = TICK_AT[i]
      row.bar.scale.set(safeScale(easeInOutCubic(seg(T, at - 0.05, at + 0.3)) * (CHECK.w - 0.34)), 0.8, 1)
      row.tick.scale.setScalar(safeScale(easeOutBack(seg(T, at, at + 0.3)) * 0.46))
      burst(at, CHECK.x - CHECK.w / 2 + 0.67, CHECK.y + row.y, 1.0, cGreen, 1.8, 0.8)
    })
    flashCard(check, bump(seg(T, TICK_AT[3], TICK_AT[3] + 0.55)) * 0.3)
    setShockRing(checkRing, T - TICK_AT[3], 0.9, 3.6)

    bursts.update(T, events)
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize, dispose }
}
