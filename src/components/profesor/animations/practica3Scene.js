import * as THREE from 'three'
import {
  bump,
  drawQuestionMark,
  drawSeal,
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
  makeSealCoin,
  makeShockRing,
  makeSlabCard,
  makeTex,
  makeTextPlane,
  safeScale,
  setBeam,
  setShockRing,
  settleWobble,
  window01,
} from './stageKit'

/**
 * Práctica 3 · Preguntar con citas y buscar huecos
 *  1 La pregunta · 2 La cita se abre · 3 Contradicción · 4 El hueco · 5 Verificar siempre
 */

export const PRACTICA3_DURATION = 16

const PIVOT_Y = 3.7
const GREEN = '#1f8a5b'
const RED = '#d23a31'

/* ---------------- paso 2: respuesta, fuentes y fragmentos ---------------- */
const ANS = { x: -4.4, y: 3.7, z: 0.2 }
const ROW_Y = [5.0, 2.5] // altura mundial de cada frase
const ROW_LOCAL = ROW_Y.map((y) => y - ANS.y)
const BADGE_LOCAL_X = 2.9
const FR_X = 3.6
const DOC_X = 7.75

const SOURCES = [
  { title: 'Lectura 1', tone: '#1f8a5b' },
  { title: 'Lectura 2', tone: '#e08a2c' },
]

const FRAGMENTS = [
  {
    tag: 'Lectura 1',
    ok: true,
    segs: [
      { text: '…si la demanda es poco elástica, los compradores no reducen su consumo y ' },
      { text: 'soportan la mayor parte del impuesto', hl: true },
      { text: '…' },
    ],
  },
  {
    tag: 'Lectura 2',
    ok: false,
    segs: [
      { text: '…quien entrega el dinero al fisco ' },
      { text: 'no determina quién lo soporta', hl: true },
      { text: ': eso depende de las elasticidades de oferta y demanda…' },
    ],
  },
]

/* ---------------- paso 3: lecturas enfrentadas ---------------- */
const READINGS = [
  {
    tag: 'Lectura 1',
    claim: 'Lo soporta más el comprador',
    body: 'Con demanda poco elástica, el comprador absorbe el impuesto en un precio más alto.',
    tone: '#44d3fe',
  },
  {
    tag: 'Lectura 2',
    claim: 'Siempre lo paga el consumidor',
    body: 'Esta lectura afirma que el impuesto siempre lo paga el consumidor: es el error a propósito que hay que detectar.',
    tone: '#ff8a70',
  },
]
const READ_Y = 3.9
const READ_REST = 3.3
const READ_HIT = 2.85

/* ---------------- paso 4: temas del programa ---------------- */
const TOPICS = [
  { name: 'Oferta y demanda', source: 'Lectura 1', x: -5.2, y: 5.2 },
  { name: 'Equilibrio', source: 'Programa', x: 0, y: 5.2 },
  { name: 'Elasticidades', source: 'Lectura 2', x: 5.2, y: 5.2 },
  { name: 'Controles de precios', source: 'Artículo', x: -5.2, y: 2.7 },
  { name: 'Excedentes', source: 'Lectura 1', x: 0, y: 2.7 },
  { name: 'Tema del programa', source: null, x: 5.2, y: 2.7 },
]
const TILE_W = 4.8
const TILE_H = 1.8
const SCAN_AT = 10.95
const SCAN_STEP = 0.19

/* ---------------- paso 5: verificación ---------------- */
const CHECKS = [
  {
    tag: '[1] Lectura 1',
    ok: true,
    x: -5.5,
    segs: [{ text: '…los compradores soportan ' }, { text: 'la mayor parte del impuesto', hl: true }, { text: '…' }],
  },
  {
    tag: '[2] Lectura 2',
    ok: false,
    x: 0,
    segs: [{ text: '…eso depende de las elasticidades, ' }, { text: 'no de quién paga al fisco', hl: true }, { text: '…' }],
  },
  {
    tag: '[3] Programa',
    ok: true,
    x: 5.5,
    segs: [{ text: '…impuestos, ' }, { text: 'incidencia', hl: true }, { text: ' y elasticidades…' }],
  },
]
const CHECK_Y = 3.5
const STAMP_AT = [14.0, null, 14.8]

/* ================================================================== */
/* Texturas                                                            */
/* ================================================================== */

function drawQuestion(ctx, w, h) {
  ctx.save()
  clipRound(ctx, w, h, 24)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#1a4aa0')
  g.addColorStop(1, '#0a2663')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(68,211,254,0.14)'
  ctx.fillRect(0, 0, w, h * 0.46)
  ctx.strokeStyle = 'rgba(68,211,254,0.75)'
  ctx.lineWidth = 4
  roundRectPath(ctx, 6, 6, w - 12, h - 12, 20)
  ctx.stroke()
  ctx.fillStyle = '#f4cb18'
  ctx.beginPath()
  ctx.arc(104, h / 2, 58, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, '?', 104, h / 2 + 34, { weight: 900, size: 100, color: '#042361', align: 'center', maxWidth: 80 })
  fitText(ctx, 'PREGUNTA', 192, 62, { weight: 500, size: 24, family: FONT_MONO, color: '#7fdcff', maxWidth: 300 })
  fitText(ctx, '¿Quién paga un impuesto?', 192, 142, { weight: 800, size: 70, color: '#ffffff', maxWidth: w - 232 })
  ctx.restore()
}

function drawAnswer(ctx, w, h) {
  ctx.save()
  clipRound(ctx, w, h, 26)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#fbf6e6')
  g.addColorStop(1, '#ebe0c4')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  fitText(ctx, 'Respuesta con citas', 36, 58, { weight: 800, size: 32, color: '#042361', maxWidth: 420 })
  ctx.fillStyle = GREEN
  roundRectPath(ctx, 36, 72, 110, 7, 3.5)
  ctx.fill()
  const sentences = [
    'El impuesto recae más sobre quien tiene la demanda menos elástica.',
    'El impuesto siempre lo paga el consumidor.',
  ]
  sentences.forEach((text, i) => {
    const rowY = h / 2 - ROW_LOCAL[i] * 100
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    roundRectPath(ctx, 24, rowY - 74, w - 48, 148, 18)
    ctx.fill()
    drawFlowText(ctx, [{ text }], 44, rowY - 14, w - 200, 42, { weight: 600, size: 31 })
    // casilla vacía para la cita
    ctx.setLineDash([9, 8])
    ctx.strokeStyle = 'rgba(69,116,185,0.5)'
    ctx.lineWidth = 3
    roundRectPath(ctx, w - 138, rowY - 28, 96, 56, 28)
    ctx.stroke()
    ctx.setLineDash([])
  })
  ctx.restore()
}

function drawRowOutline(ctx, w, h, color) {
  ctx.shadowColor = color
  ctx.shadowBlur = 18
  ctx.strokeStyle = color
  ctx.lineWidth = 8
  roundRectPath(ctx, 14, 14, w - 28, h - 28, 26)
  ctx.stroke()
  ctx.shadowBlur = 0
  ctx.fillStyle = color
  ctx.globalAlpha = 0.14
  roundRectPath(ctx, 14, 14, w - 28, h - 28, 26)
  ctx.fill()
  ctx.globalAlpha = 1
}

function drawBadge(ctx, w, h, label, color) {
  ctx.fillStyle = color
  roundRectPath(ctx, 4, 4, w - 8, h - 8, (h - 8) / 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.lineWidth = 4
  ctx.stroke()
  fitText(ctx, label, w / 2, h * 0.68, { weight: 800, size: h * 0.52, color: '#ffffff', align: 'center', maxWidth: w * 0.8 })
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
    ctx.moveTo(w * 0.32, h * 0.32)
    ctx.lineTo(w * 0.68, h * 0.68)
    ctx.moveTo(w * 0.68, h * 0.32)
    ctx.lineTo(w * 0.32, h * 0.68)
  }
  ctx.stroke()
}

function drawSource(ctx, w, h, spec) {
  ctx.save()
  clipRound(ctx, w, h, 14)
  ctx.fillStyle = '#fbf6e6'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = spec.tone
  ctx.fillRect(0, 0, w, h * 0.16)
  fitText(ctx, spec.title, w / 2, h * 0.42, { weight: 800, size: h * 0.12, color: '#042361', align: 'center', maxWidth: w * 0.84 })
  ctx.fillStyle = 'rgba(46,70,128,0.5)'
  for (let i = 0; i < 6; i += 1) {
    roundRectPath(ctx, w * 0.14, h * (0.52 + i * 0.072), w * (i % 3 === 2 ? 0.4 : 0.72), h * 0.03, 5)
    ctx.fill()
  }
  ctx.restore()
}

function drawFragment(ctx, w, h, spec, state) {
  const s = w / 620
  ctx.save()
  clipRound(ctx, w, h, 20 * s)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#fffaf0')
  g.addColorStop(1, '#f0e6cc')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = spec.ok ? GREEN : RED
  ctx.fillRect(0, 0, w, 56 * s)
  fitText(ctx, spec.tag, 26 * s, 38 * s, { weight: 800, size: 27 * s, color: '#ffffff', maxWidth: w * 0.52 })
  fitText(ctx, spec.ok ? 'Respalda la frase' : 'No respalda la frase', w - 26 * s, 38 * s, {
    weight: 500,
    size: 23 * s,
    family: FONT_BODY,
    color: '#ffffff',
    align: 'right',
    maxWidth: w * 0.4,
  })
  drawFlowText(ctx, spec.segs, 28 * s, 108 * s, w - 56 * s, 38 * s, {
    size: 26 * s,
    hlColor: spec.ok ? 'rgba(244,203,24,0.92)' : 'rgba(255,107,95,0.8)',
    hlProgress: state.hl,
  })
  if (!spec.ok) {
    ctx.strokeStyle = 'rgba(210,58,49,0.95)'
    ctx.lineWidth = 9 * s
    roundRectPath(ctx, 5 * s, 5 * s, w - 10 * s, h - 10 * s, 17 * s)
    ctx.stroke()
  }
  ctx.restore()
}

function drawReading(ctx, w, h, spec) {
  ctx.save()
  clipRound(ctx, w, h, 24)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#fffaf0')
  g.addColorStop(1, '#eee3c6')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = spec.tone
  ctx.fillRect(0, 0, w, 60)
  fitText(ctx, spec.tag, 28, 41, { weight: 800, size: 28, color: '#042361', maxWidth: w - 56 })
  fitText(ctx, spec.claim, 28, 132, { weight: 800, size: 50, color: '#042361', maxWidth: w - 56 })
  ctx.fillStyle = '#d23a31'
  roundRectPath(ctx, 28, 148, w - 120, 7, 3.5)
  ctx.fill()
  drawFlowText(ctx, [{ text: spec.body }], 28, 206, w - 56, 38, { size: 27 })
  ctx.restore()
}

function drawNeq(ctx, w, h) {
  const c = w / 2
  const g = ctx.createRadialGradient(c * 0.8, c * 0.7, 6, c, c, c)
  g.addColorStop(0, '#ff8a70')
  g.addColorStop(1, '#c42a22')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(c, c, c - 5, 0, Math.PI * 2)
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

function drawTopic(ctx, w, h, topic) {
  ctx.save()
  clipRound(ctx, w, h, 22)
  if (topic.source) {
    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, '#fffaf0')
    g.addColorStop(1, '#e9dfc3')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#4574b9'
    ctx.fillRect(0, 0, 14, h)
    fitText(ctx, topic.name, 40, 82, { weight: 800, size: 40, color: '#042361', maxWidth: w - 80 })
    ctx.fillStyle = GREEN
    ctx.beginPath()
    ctx.arc(52, 132, 9, 0, Math.PI * 2)
    ctx.fill()
    fitText(ctx, `Fuente: ${topic.source}`, 74, 141, { weight: 500, size: 26, family: FONT_MONO, color: GREEN, maxWidth: w - 120 })
  } else {
    ctx.fillStyle = '#071a42'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = 'rgba(0,0,0,0.35)'
    ctx.fillRect(0, 0, w, 22)
    ctx.setLineDash([16, 12])
    ctx.strokeStyle = 'rgba(255,107,95,0.95)'
    ctx.lineWidth = 5
    roundRectPath(ctx, 12, 12, w - 24, h - 24, 18)
    ctx.stroke()
    ctx.setLineDash([])
    fitText(ctx, topic.name, 40, 82, { weight: 800, size: 40, color: 'rgba(200,215,245,0.55)', maxWidth: w - 80 })
    fitText(ctx, 'Sin fuente', 40, 141, { weight: 700, size: 30, family: FONT_MONO, color: '#ff8a70', maxWidth: w - 80 })
  }
  ctx.restore()
}

function drawHuecoTag(ctx, w, h) {
  ctx.fillStyle = '#f4cb18'
  roundRectPath(ctx, 4, 4, w - 8, h - 8, (h - 8) / 2)
  ctx.fill()
  ctx.strokeStyle = '#042361'
  ctx.lineWidth = 4
  ctx.stroke()
  fitText(ctx, 'HUECO · tema sin fuente', w / 2, h * 0.67, { weight: 800, size: h * 0.46, color: '#042361', align: 'center', maxWidth: w * 0.9 })
}

function drawHeader(ctx, w, h, text) {
  ctx.fillStyle = 'rgba(4,35,97,0.85)'
  roundRectPath(ctx, 4, 4, w - 8, h - 8, (h - 8) / 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(68,211,254,0.7)'
  ctx.lineWidth = 3
  ctx.stroke()
  fitText(ctx, text, w / 2, h * 0.67, { weight: 800, size: h * 0.46, color: '#ffffff', align: 'center', maxWidth: w * 0.9 })
}

/* ================================================================== */

export default function createPractica3Scene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: PRACTICA3_DURATION,
    frame: { wideHalfW: 8.6, narrowHalfW: 6.4, halfH: 4.5, camY: 5.0, lookY: 3.45 },
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 12, perBurst: 18, seed: 33 })
  scene.add(bursts.points)
  const cGreen = new THREE.Color(0x3be09a)
  const cCyan = new THREE.Color(0x7fdcff)
  const cGold = new THREE.Color(0xf4cb18)
  const cRed = new THREE.Color(0xff5a4d)

  const markOk = makeTex(128, 128, (ctx, w, h) => drawMark(ctx, w, h, 'ok'), invalidate)
  const markBad = makeTex(128, 128, (ctx, w, h) => drawMark(ctx, w, h, 'bad'), invalidate)

  const makeMarkSprite = (map, parent) => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false }))
    sprite.scale.setScalar(0.0001)
    parent.add(sprite)
    return sprite
  }

  /* ---------------- la pregunta (persiste pasos 1-3) ---------------- */
  const qRoot = new THREE.Group()
  scene.add(qRoot)
  const question = makeSlabCard({
    w: 8.4,
    h: 1.9,
    depth: 0.18,
    radius: 0.34,
    bevel: 0.05,
    edge: '#0b2a66',
    texture: makeTex(840, 190, drawQuestion, invalidate),
    roughness: 0.45,
    metalness: 0.12,
    emissive: '#44d3fe',
  })
  qRoot.add(question.group)
  const qGlow = addGlow(qRoot, glow, 0x44d3fe, 13, 0.3)
  qGlow.position.z = -0.6
  qRoot.scale.setScalar(0.0001)

  const markTex = makeTex(128, 128, drawQuestionMark, invalidate)
  const floaters = [
    { x: -6.4, y: 6.3, z: 0.6, size: 1.3, ph: 0.0 },
    { x: 6.5, y: 6.1, z: 0.8, size: 1.1, ph: 1.7 },
    { x: -5.6, y: 2.0, z: 1.0, size: 0.95, ph: 3.1 },
    { x: 6.0, y: 2.3, z: 0.4, size: 1.2, ph: 4.4 },
  ].map((f) => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: markTex, transparent: true, depthWrite: false, opacity: 0 }))
    sprite.scale.setScalar(f.size)
    scene.add(sprite)
    return { ...f, sprite }
  })

  /* ---------------- grupo A: respuesta y citas ---------------- */
  const rootA = new THREE.Group()
  scene.add(rootA)

  const answerRoot = new THREE.Group()
  answerRoot.position.set(ANS.x, ANS.y, ANS.z)
  rootA.add(answerRoot)
  const answer = makeSlabCard({
    w: 7.2,
    h: 4.8,
    depth: 0.14,
    radius: 0.3,
    bevel: 0.04,
    edge: '#cdbf93',
    texture: makeTex(720, 480, drawAnswer, invalidate),
    roughness: 0.7,
    emissive: '#f4cb18',
  })
  answerRoot.add(answer.group)
  const AZ = answer.thickness / 2
  answerRoot.scale.setScalar(0.0001)

  const outlineTex = {
    amber: makeTex(660, 130, (ctx, w, h) => drawRowOutline(ctx, w, h, '#f4cb18'), invalidate),
    red: makeTex(660, 130, (ctx, w, h) => drawRowOutline(ctx, w, h, '#ff5a4d'), invalidate),
  }
  const makeOutline = (map, y) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(6.6, 1.3),
      new THREE.MeshBasicMaterial({ map, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
    )
    mesh.position.set(0, y, AZ + 0.02)
    answerRoot.add(mesh)
    return mesh
  }
  const rowAmber = ROW_LOCAL.map((y) => makeOutline(outlineTex.amber, y))
  const rowRed = ROW_LOCAL.map((y) => makeOutline(outlineTex.red, y))

  const badgeTex = {
    green: makeTex(190, 104, (ctx, w, h) => drawBadge(ctx, w, h, '[1]', GREEN), invalidate),
    amber: makeTex(190, 104, (ctx, w, h) => drawBadge(ctx, w, h, '[2]', '#d9a406'), invalidate),
    red: makeTex(190, 104, (ctx, w, h) => drawBadge(ctx, w, h, '[2]', RED), invalidate),
  }
  const makeBadge = (map, i) => {
    const mesh = makeTextPlane(0.95, 0.52, map)
    mesh.position.set(BADGE_LOCAL_X, ROW_LOCAL[i], AZ + 0.06)
    mesh.scale.setScalar(0.0001)
    answerRoot.add(mesh)
    return mesh
  }
  const badges = [
    { ok: makeBadge(badgeTex.green, 0), bad: null },
    { ok: makeBadge(badgeTex.amber, 1), bad: makeBadge(badgeTex.red, 1) },
  ]
  const badgeGlows = badges.map((_, i) => {
    const sprite = addGlow(answerRoot, glow, i === 0 ? 0x3be09a : 0xff5a4d, 2.6, 0)
    sprite.position.set(BADGE_LOCAL_X, ROW_LOCAL[i], AZ + 0.04)
    return sprite
  })

  // documentos fuente (derecha)
  const docs = SOURCES.map((spec, i) => {
    const group = new THREE.Group()
    rootA.add(group)
    const card = makeSlabCard({
      w: 1.5,
      h: 2.0,
      depth: 0.07,
      radius: 0.1,
      bevel: 0.02,
      edge: '#efe6cb',
      texture: makeTex(225, 300, (ctx, w, h) => drawSource(ctx, w, h, spec), invalidate),
      emissive: '#f4cb18',
    })
    group.add(card.group)
    const halo = addGlow(group, glow, i === 0 ? 0x3be09a : 0xff9b4a, 3.6, 0.35)
    halo.position.z = -0.3
    group.position.set(11, ROW_Y[i], 0.1)
    group.scale.setScalar(0.0001)
    return { group, card, halo }
  })

  // fragmentos que se abren
  const fragState = FRAGMENTS.map(() => ({ hl: 0 }))
  const fragments = FRAGMENTS.map((spec, i) => {
    const group = new THREE.Group()
    rootA.add(group)
    const tex = makeTex(620, 230, (ctx, w, h) => drawFragment(ctx, w, h, spec, fragState[i]), invalidate)
    const card = makeSlabCard({
      w: 6.2,
      h: 2.3,
      depth: 0.08,
      radius: 0.2,
      bevel: 0.03,
      edge: spec.ok ? '#d7e6cf' : '#f0c5c0',
      texture: tex,
      roughness: 0.6,
      emissive: spec.ok ? '#3be09a' : '#ff5a4d',
    })
    group.add(card.group)
    const halo = addGlow(group, glow, spec.ok ? 0x3be09a : 0xff5a4d, 9, 0)
    halo.position.z = -0.5
    const mark = makeMarkSprite(spec.ok ? markOk : markBad, group)
    mark.position.set(-3.1, 0.0, card.thickness / 2 + 0.12)
    group.scale.setScalar(0.0001)
    return { group, card, halo, mark, tex, spec }
  })

  const beams = [0, 1].map((i) => {
    const beam = makeBeam(i === 0 ? 0x3be09a : 0xff5a4d, 0.85)
    rootA.add(beam)
    return beam
  })
  const beamDots = [0, 1].map((i) => {
    const dot = addGlow(rootA, glow, i === 0 ? 0x9ff5c9 : 0xff9b8f, 0.9, 0)
    return dot
  })
  const bStart = new THREE.Vector3()
  const bEnd = new THREE.Vector3()
  const bNow = new THREE.Vector3()

  /* ---------------- grupo B: contradicción ---------------- */
  const rootB = new THREE.Group()
  scene.add(rootB)
  const readings = READINGS.map((spec, i) => {
    const group = new THREE.Group()
    rootB.add(group)
    const card = makeSlabCard({
      w: 5.6,
      h: 3.0,
      depth: 0.14,
      radius: 0.3,
      bevel: 0.04,
      edge: spec.tone,
      texture: makeTex(560, 300, (ctx, w, h) => drawReading(ctx, w, h, spec), invalidate),
      roughness: 0.6,
      emissive: '#ff5a4d',
    })
    group.add(card.group)
    const halo = addGlow(group, glow, i === 0 ? 0x44d3fe : 0xff8a70, 8.5, 0.3)
    halo.position.z = -0.5
    group.position.set(i === 0 ? -11 : 11, READ_Y, 0.5)
    return { group, card, halo, side: i === 0 ? -1 : 1 }
  })
  const neq = makeTextPlane(1.7, 1.7, makeTex(256, 256, drawNeq, invalidate))
  neq.position.set(0, READ_Y, 1.3)
  neq.scale.setScalar(0.0001)
  rootB.add(neq)
  const clashGlow = addGlow(rootB, glow, 0xff4a3d, 9, 0)
  clashGlow.position.set(0, READ_Y, 0.9)
  const clashRing = makeShockRing(0xff8a70)
  clashRing.position.set(0, READ_Y, 1.0)
  rootB.add(clashRing)
  const boltCore = Array.from({ length: 5 }, () => makeBeam(0xfff3d0, 0.95))
  const boltHalo = Array.from({ length: 5 }, () => makeBeam(0xff5a4d, 0.5))
  boltHalo.forEach((b) => rootB.add(b))
  boltCore.forEach((b) => rootB.add(b))
  const boltPts = Array.from({ length: 6 }, () => new THREE.Vector3())
  const hash = (n) => {
    const s = Math.sin(n * 12.9898) * 43758.5453
    return s - Math.floor(s)
  }

  /* ---------------- grupo C: temas y hueco ---------------- */
  const rootC = new THREE.Group()
  scene.add(rootC)
  const tickTex = markOk
  const topicHeader = makeTextPlane(5.6, 0.7, makeTex(560, 70, (ctx, w, h) => drawHeader(ctx, w, h, 'Temas del programa'), invalidate))
  topicHeader.position.set(0, 7.0, 0.3)
  topicHeader.scale.setScalar(0.0001)
  rootC.add(topicHeader)

  const tiles = TOPICS.map((topic) => {
    const group = new THREE.Group()
    group.position.set(topic.x, topic.y, 0.3)
    rootC.add(group)
    const card = makeSlabCard({
      w: TILE_W,
      h: TILE_H,
      depth: topic.source ? 0.14 : 0.04,
      radius: 0.26,
      bevel: 0.035,
      edge: topic.source ? '#cfc3a0' : '#2a1020',
      texture: makeTex(480, 180, (ctx, w, h) => drawTopic(ctx, w, h, topic), invalidate),
      roughness: topic.source ? 0.65 : 0.9,
      emissive: topic.source ? '#3be09a' : '#ff5a4d',
    })
    group.add(card.group)
    const mark = makeMarkSprite(topic.source ? tickTex : markBad, group)
    mark.position.set(TILE_W / 2 - 0.5, 0.0, card.thickness / 2 + 0.1)
    group.scale.setScalar(0.0001)
    return { group, card, mark, topic }
  })
  const gapTile = tiles[5]
  const gapGlow = addGlow(rootC, glow, 0xff4a3d, 9, 0)
  gapGlow.position.set(gapTile.topic.x, gapTile.topic.y, 0.1)
  const gapRing = makeShockRing(0xff6b5a)
  gapRing.position.set(gapTile.topic.x, gapTile.topic.y, 0.6)
  rootC.add(gapRing)
  const huecoTag = makeTextPlane(3.5, 0.62, makeTex(560, 100, drawHuecoTag, invalidate))
  huecoTag.position.set(gapTile.topic.x, gapTile.topic.y + 1.5, 0.8)
  huecoTag.scale.setScalar(0.0001)
  rootC.add(huecoTag)
  const scanOrb = addGlow(rootC, glow, 0x7fdcff, 3.4, 0)

  /* ---------------- grupo D: verificar ---------------- */
  const rootD = new THREE.Group()
  scene.add(rootD)
  const verifyHeader = makeTextPlane(
    7.0,
    0.8,
    makeTex(700, 80, (ctx, w, h) => drawHeader(ctx, w, h, 'Verificar siempre: abrir cada cita'), invalidate),
  )
  verifyHeader.position.set(0, 6.3, 0.4)
  verifyHeader.scale.setScalar(0.0001)
  rootD.add(verifyHeader)

  const checkState = CHECKS.map(() => ({ hl: 1 }))
  const sealTex = makeTex(256, 256, drawSeal, invalidate)
  const checks = CHECKS.map((spec, i) => {
    const group = new THREE.Group()
    group.position.set(spec.x, CHECK_Y, 0.3)
    rootD.add(group)
    const card = makeSlabCard({
      w: 5.2,
      h: 2.9,
      depth: 0.1,
      radius: 0.24,
      bevel: 0.035,
      edge: spec.ok ? '#d7e6cf' : '#f0c5c0',
      texture: makeTex(520, 290, (ctx, w, h) => drawFragment(ctx, w, h, spec, checkState[i]), invalidate),
      roughness: 0.6,
      emissive: spec.ok ? '#3be09a' : '#ff5a4d',
    })
    group.add(card.group)
    const halo = addGlow(group, glow, spec.ok ? 0x3be09a : 0xff5a4d, 9, 0)
    halo.position.z = -0.5
    group.scale.setScalar(0.0001)

    let coin = null
    let ring = null
    let flag = null
    if (spec.ok) {
      coin = makeSealCoin(0.7, sealTex)
      coin.group.position.set(1.9, 1.35, 6)
      coin.group.scale.setScalar(0.0001)
      group.add(coin.group)
      ring = makeShockRing(0x3be09a)
      ring.position.set(1.9, 1.35, 0.4)
      group.add(ring)
    } else {
      flag = makeMarkSprite(markBad, group)
      flag.position.set(1.9, 1.35, 0.4)
    }
    return { group, card, halo, coin, ring, flag, spec }
  })
  const finalGlow = addGlow(rootD, glow, 0x3be09a, 24, 0)
  finalGlow.position.set(0, CHECK_Y, -0.8)

  /* ---------------- utilidades de movimiento ---------------- */
  const setGroupScale = (group, s) => {
    const k = safeScale(s)
    group.scale.setScalar(k)
    group.position.y = PIVOT_Y * (1 - k)
    group.visible = s > 0.004
  }

  function resize(w, h) {
    stage.resize(w, h)
  }

  function draw(t) {
    const T = t * PRACTICA3_DURATION
    const fx = 2.2 * window01(T, 3.4, 4.2, 6.3, 6.9)
    stage.update(T, fx)
    stage.spot.position.set(fx, 4.6, 5.5)

    const events = []
    const burst = (t0, x, y, z, color, speed = 2.6, life = 1) => {
      if (T >= t0 && T <= t0 + life) events.push({ t: t0, x, y, z, color, speed, life })
    }

    /* ---------- 1 · la pregunta ---------- */
    const qIn = easeOutBack(seg(T, 0.2, 0.9))
    const qMove = easeInOutCubic(seg(T, 3.2, 4.0))
    const qOut = smooth(seg(T, 9.7, 10.2))
    const qScale = lerp(1, 0.62, qMove) * qIn * (1 - qOut)
    qRoot.scale.setScalar(safeScale(qScale))
    qRoot.visible = qScale > 0.004
    qRoot.position.set(
      0,
      lerp(4.5, 7.05, qMove) + Math.sin(T * 1.4) * 0.09 * (1 - qMove),
      lerp(1.2, 0.4, qMove),
    )
    qRoot.rotation.set(Math.sin(T * 0.9) * 0.03, Math.sin(T * 0.7) * 0.06 * (1 - qMove), 0)
    qGlow.material.opacity = 0.22 + bump(seg(T, 0.2, 1.4)) * 0.3
    flashCard(question, bump(seg(T, 0.3, 1.2)) * 0.5)
    burst(0.35, 0, 4.5, 1.4, cCyan, 3.2, 1.1)

    floaters.forEach((f) => {
      const on = smooth(seg(T, 0.8, 1.5)) * (1 - smooth(seg(T, 2.9, 3.5)))
      f.sprite.material.opacity = on * 0.9
      f.sprite.position.set(f.x + Math.sin(T * 0.8 + f.ph) * 0.25, f.y + Math.sin(T * 1.1 + f.ph) * 0.3, f.z)
      f.sprite.material.rotation = Math.sin(T * 0.9 + f.ph) * 0.25
    })

    /* ---------- grupo A ---------- */
    setGroupScale(rootA, 1 - smooth(seg(T, 6.45, 6.9)))

    // documentos fuente
    docs.forEach((doc, i) => {
      const a = 1.5 + i * 0.25
      const slide = easeOutCubic(seg(T, a, a + 0.8))
      doc.group.position.set(lerp(11, DOC_X, slide), ROW_Y[i] + Math.sin(T * 1.2 + i * 2) * 0.07, 0.1)
      doc.group.rotation.set(0, lerp(0.7, -0.22, slide) + Math.sin(T * 0.6 + i) * 0.04, (1 - slide) * 0.3)
      doc.group.scale.setScalar(safeScale(slide))
      const open = i === 0 ? bump(seg(T, 4.15, 5.0)) : bump(seg(T, 5.05, 5.9))
      flashCard(doc.card, open * 0.6)
      doc.halo.material.opacity = 0.25 + open * 0.4
    })

    // tarjeta de respuesta
    const ansIn = easeOutBack(seg(T, 3.4, 4.0))
    answerRoot.scale.setScalar(safeScale(ansIn))
    answerRoot.rotation.y = Math.sin(T * 0.5) * 0.025

    const rowOn = [
      smooth(seg(T, 3.95, 4.2)) * (1 - smooth(seg(T, 5.1, 5.4))),
      smooth(seg(T, 4.85, 5.1)),
    ]
    const row2Bad = smooth(seg(T, 5.85, 6.1))
    rowAmber[0].material.opacity = rowOn[0] * (0.7 + 0.3 * Math.sin(T * 8))
    rowAmber[1].material.opacity = rowOn[1] * (1 - row2Bad) * (0.7 + 0.3 * Math.sin(T * 8))
    rowRed[0].material.opacity = 0
    rowRed[1].material.opacity = row2Bad * 0.95

    // citas [1] y [2]
    const b0 = easeOutBack(seg(T, 3.85, 4.3))
    const b1 = easeOutBack(seg(T, 4.0, 4.45))
    badges[0].ok.scale.setScalar(safeScale(b0))
    badges[1].ok.scale.setScalar(safeScale(b1 * (1 - row2Bad)))
    badges[1].bad.scale.setScalar(safeScale(b1 * row2Bad * (1 + bump(seg(T, 5.85, 6.3)) * 0.25)))
    badgeGlows[0].material.opacity = bump(seg(T, 5.0, 5.8)) * 0.8
    badgeGlows[1].material.opacity = bump(seg(T, 5.9, 6.4)) * 0.9

    // fragmentos: se abren desde su fuente
    const windows = [
      { beam: [4.05, 4.4], open: [4.2, 4.8], hl: [4.75, 5.15], mark: [5.1, 5.45] },
      { beam: [4.95, 5.3], open: [5.1, 5.7], hl: [5.65, 6.05], mark: [5.95, 6.3] },
    ]
    fragments.forEach((fr, i) => {
      const w = windows[i]
      const open = seg(T, w.open[0], w.open[1])
      const eased = easeInOutCubic(open)
      const pop = easeOutBack(open)
      fr.group.position.set(
        lerp(DOC_X, FR_X, eased),
        ROW_Y[i],
        lerp(0.1, 0.45, eased),
      )
      fr.group.rotation.set(0, lerp(-1.1, 0, eased) + Math.sin(T * 0.7 + i) * 0.02, 0)
      fr.group.scale.setScalar(safeScale(lerp(0.2, 1, pop) * (open > 0 ? 1 : 0)))

      const hlNow = Math.round(seg(T, w.hl[0], w.hl[1]) * 14) / 14
      if (fragState[i].hl !== hlNow) {
        fragState[i].hl = hlNow
        fr.tex.userData.repaint()
      }
      const done = seg(T, w.mark[0], w.mark[1])
      fr.mark.scale.setScalar(safeScale(easeOutBack(done) * 0.62))
      fr.halo.material.opacity = bump(seg(T, w.open[0], w.mark[1] + 0.4)) * 0.45
      flashCard(fr.card, bump(seg(T, w.mark[0], w.mark[1] + 0.35)) * (fr.spec.ok ? 0.4 : 0.55))
    })
    burst(5.1, FR_X - 3.1, ROW_Y[0], 0.9, cGreen, 2.4, 1)
    burst(5.95, FR_X - 3.1, ROW_Y[1], 0.9, cRed, 2.4, 1)

    // vigas badge → fragmento con un punto que viaja
    beams.forEach((beam, i) => {
      const w = windows[i]
      const grow = smooth(seg(T, w.beam[0], w.beam[1]))
      const fade = 1 - smooth(seg(T, w.open[1], w.open[1] + 0.5))
      bStart.set(ANS.x + BADGE_LOCAL_X + 0.55, ROW_Y[i], 0.45)
      bEnd.set(FR_X - 3.1, ROW_Y[i], 0.45)
      bNow.copy(bStart).lerp(bEnd, grow)
      setBeam(beam, bStart, bNow, 0.05)
      beam.material.opacity = 0.85 * fade
      beamDots[i].position.copy(bNow)
      beamDots[i].material.opacity = grow > 0 ? fade : 0
    })

    /* ---------- grupo B: contradicción ---------- */
    rootB.visible = T > 6.8 && T < 10.3
    const bExit = smooth(seg(T, 9.55, 10.1))
    const hitT = 7.8
    readings.forEach((r) => {
      const fly = Math.pow(seg(T, 6.9, hitT), 3)
      let x = lerp(r.side * 11, r.side * READ_HIT, fly)
      const age = T - hitT
      if (age > 0) {
        const recoil = easeOutCubic(seg(T, hitT, hitT + 0.5))
        const settle = easeInOutCubic(seg(T, hitT + 0.5, hitT + 1.0))
        x = r.side * (READ_HIT + (3.6 - READ_HIT) * recoil + (READ_REST - 3.6) * settle)
      }
      const inward = smooth(seg(T, hitT + 0.3, hitT + 1.1))
      r.group.position.set(x * (1 + bExit * 1.5), READ_Y + Math.sin(T * 1.3 + r.side) * 0.06 + settleWobble(age, 18, 6) * 0.08, 0.5)
      r.group.rotation.set(0, -r.side * 0.16 * inward, r.side * 0.04 * inward + settleWobble(age, 20, 7) * 0.05 * r.side)
      r.group.scale.setScalar(safeScale(1 - bExit))
      flashCard(r.card, bump(seg(T, hitT, hitT + 0.9)) * 0.7)
      r.halo.material.opacity = 0.25 + bump(seg(T, hitT - 0.2, hitT + 1.2)) * 0.45
    })
    const neqK = easeOutBack(seg(T, hitT + 0.15, hitT + 0.7))
    neq.scale.setScalar(safeScale(neqK * (1 - bExit) * (1 + Math.sin(T * 5) * 0.03)))
    clashGlow.material.opacity = (bump(seg(T, hitT - 0.1, hitT + 1.6)) * 0.8 + 0.15 * smooth(seg(T, hitT + 1, hitT + 1.6))) * (1 - bExit)
    setShockRing(clashRing, T - hitT, 1.0, 6)
    burst(hitT, 0, READ_Y, 1.2, cRed, 4.2, 1.1)
    burst(hitT + 0.02, 0, READ_Y + 0.6, 1.2, cGold, 3.4, 1.1)
    burst(hitT + 0.05, 0, READ_Y - 0.6, 1.2, cCyan, 3.0, 1.1)

    // rayo entre las dos lecturas
    const boltOn = smooth(seg(T, hitT, hitT + 0.1)) * (1 - smooth(seg(T, 9.1, 9.5)))
    const frame = Math.floor(T * 14)
    for (let k = 0; k < 6; k += 1) {
      const edge = k === 0 || k === 5
      boltPts[k].set(edge ? 0 : (hash(frame * 7 + k) - 0.5) * 0.9, READ_Y + 1.75 - k * 0.7, 1.15)
    }
    for (let k = 0; k < 5; k += 1) {
      setBeam(boltCore[k], boltPts[k], boltPts[k + 1], 0.045)
      setBeam(boltHalo[k], boltPts[k], boltPts[k + 1], 0.12)
      boltCore[k].material.opacity = 0.95 * boltOn * (0.75 + 0.25 * hash(frame + k))
      boltHalo[k].material.opacity = 0.5 * boltOn
      if (boltOn < 0.01) {
        boltCore[k].visible = false
        boltHalo[k].visible = false
      }
    }

    /* ---------- grupo C: temas del programa ---------- */
    setGroupScale(rootC, 1 - smooth(seg(T, 12.95, 13.4)))
    if (T < 9.95) rootC.visible = false
    topicHeader.scale.setScalar(safeScale(easeOutBack(seg(T, 10.0, 10.5))))
    tiles.forEach((tile, i) => {
      const pop = easeOutBack(seg(T, 10.1 + i * 0.12, 10.65 + i * 0.12))
      tile.group.scale.setScalar(safeScale(pop))
      tile.group.position.y = tile.topic.y + Math.sin(T * 1.1 + i) * 0.04
      const visitAt = SCAN_AT + i * SCAN_STEP
      if (tile.topic.source) {
        flashCard(tile.card, bump(seg(T, visitAt - 0.1, visitAt + 0.5)) * 0.65)
        tile.mark.scale.setScalar(safeScale(easeOutBack(seg(T, visitAt + 0.05, visitAt + 0.4)) * 0.6))
        burst(visitAt, tile.topic.x + TILE_W / 2 - 0.5, tile.topic.y, 0.9, cGreen, 1.6, 0.8)
      }
    })
    // la esfera de luz recorre los temas, uno por uno
    const scanK = seg(T, SCAN_AT, SCAN_AT + 5 * SCAN_STEP) * 5
    const lo = Math.min(4, Math.floor(scanK))
    const frac = scanK - lo
    const pa = TOPICS[lo]
    const pb = TOPICS[Math.min(5, lo + 1)]
    scanOrb.position.set(lerp(pa.x, pb.x, frac), lerp(pa.y, pb.y, frac) + 0.15, 1.0)
    scanOrb.material.opacity = smooth(seg(T, SCAN_AT - 0.1, SCAN_AT + 0.1)) * (1 - smooth(seg(T, SCAN_AT + 5 * SCAN_STEP + 0.1, SCAN_AT + 5 * SCAN_STEP + 0.45)))

    // el hueco: tema vacío, sin fuente
    const gapT = SCAN_AT + 5 * SCAN_STEP
    const gapK = smooth(seg(T, gapT, gapT + 0.4))
    const gapPulse = 0.5 + 0.5 * Math.sin(T * 6)
    flashCard(gapTile.card, gapK * (0.25 + 0.45 * gapPulse))
    gapGlow.material.opacity = gapK * (0.35 + 0.3 * gapPulse)
    gapTile.mark.scale.setScalar(safeScale(easeOutBack(seg(T, gapT + 0.1, gapT + 0.5)) * 0.8))
    setShockRing(gapRing, (T - gapT) % 0.9 + (T >= gapT ? 0 : -10), 0.9, 4.2)
    huecoTag.scale.setScalar(safeScale(easeOutBack(seg(T, gapT + 0.2, gapT + 0.7))))
    huecoTag.position.y = gapTile.topic.y + 1.5 + Math.sin(T * 3) * 0.06
    burst(gapT, gapTile.topic.x, gapTile.topic.y, 0.9, cRed, 3.2, 1.0)

    /* ---------- grupo D: verificar siempre ---------- */
    rootD.visible = T > 12.95
    verifyHeader.scale.setScalar(safeScale(easeOutBack(seg(T, 13.2, 13.7))))
    checks.forEach((c, i) => {
      const pop = easeOutBack(seg(T, 13.1 + i * 0.16, 13.65 + i * 0.16))
      c.group.scale.setScalar(safeScale(pop))
      c.group.position.y = CHECK_Y + Math.sin(T * 1.2 + i * 1.7) * 0.06
      const at = STAMP_AT[i]
      if (c.coin) {
        const drop = seg(T, at - 0.5, at)
        const age = T - at
        const fall = drop * drop
        const bounce = age > 0 ? Math.abs(settleWobble(age, 15, 6)) * 0.35 : 0
        c.coin.group.position.set(1.9, 1.35 + (1 - fall) * 3.2 + bounce, 0.24 + (1 - fall) * 1.2)
        c.coin.group.rotation.set((1 - fall) * 0.9, 0, (1 - fall) * 1.5)
        c.coin.group.scale.setScalar(safeScale(easeOutCubic(seg(T, at - 0.55, at - 0.3)) * lerp(1.5, 1, fall)))
        setShockRing(c.ring, age, 0.8, 3.0)
        const landed = smooth(seg(T, at, at + 0.35))
        flashCard(c.card, bump(seg(T, at, at + 0.9)) * 0.55)
        c.halo.material.opacity = landed * (0.28 + 0.1 * Math.sin(T * 3 + i))
        burst(at, c.spec.x + 1.9, CHECK_Y + 1.35, 0.9, cGreen, 2.4, 1)
      } else {
        const flagAt = 14.4
        c.flag.scale.setScalar(safeScale(easeOutBack(seg(T, flagAt, flagAt + 0.4)) * 0.85))
        flashCard(c.card, bump(seg(T, flagAt, flagAt + 0.8)) * 0.5)
        c.halo.material.opacity = smooth(seg(T, flagAt, flagAt + 0.4)) * (0.22 + 0.1 * Math.sin(T * 5))
        burst(flagAt, c.spec.x + 1.9, CHECK_Y + 1.35, 0.9, cRed, 2.0, 0.9)
      }
    })
    finalGlow.material.opacity = bump(seg(T, 14.9, 15.8)) * 0.3
    burst(15.0, -5.5, CHECK_Y - 1.7, 0.9, cCyan, 2.4, 1)
    burst(15.05, 5.5, CHECK_Y - 1.7, 0.9, cCyan, 2.4, 1)

    bursts.update(T, events)
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize, dispose }
}
