import * as THREE from 'three'
import { bump, easeInOutCubic, easeOutBack, easeOutCubic, lerp, roundRectPath, seg, smooth } from './threeKit'
import {
  FONT_BODY,
  FONT_DISPLAY,
  FONT_MONO,
  addGlow,
  createBurstSystem,
  createStage,
  fitText,
  flashCard,
  makeBeam,
  makeCursorTexture,
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
 * Escena “IA y evaluación: lo que no se puede delegar” (Sesión 4, Cierre).
 * Loop de 16 s en 5 fases de 3,2 s:
 *   0 el detector marca una probabilidad (72 %), no una prueba ·
 *   1 ese porcentaje no sostiene una sanción ·
 *   2 la tarea pide proceso: borrador, bitácora y defensa oral ·
 *   3 las reglas se declaran en el programa ·
 *   4 se evalúa con una conversación, no con un porcentaje.
 * `draw(t)` es una función pura del tiempo dentro del loop.
 */
export const AGENTES_CIERRE_DURATION = 16

const NAVY = '#042361'
const AMBER = 0xf4cb18
const CYAN = 0x7fdcff
const GREEN = 0x3be09a

const PHASE = 3.2
const Y = 3.3
const PCT = 72

/* paso 0-1: detector y propuesta de sanción */
const DETECTOR = { w: 5.4, h: 4.0, xSide: -4.2, sSide: 0.78 }
const GAUGE_V = 0.66
const GAUGE_Y = (0.5 - GAUGE_V) * DETECTOR.h
const NUMBER_Y = (0.5 - 0.86) * DETECTOR.h
const SANCTION = { x: 3.5, w: 4.6, h: 4.0 }
const EVIDENCE_V = 0.6

/* paso 2: tarjetas de proceso */
const PROCESS = [
  { key: 'borrador', title: 'Borrador', sub: 'Versiones con cambios', x: -4.3, color: '#f4cb18' },
  { key: 'bitacora', title: 'Bitácora', sub: 'Qué pidió y qué decidió', x: 0, color: '#7fdcff' },
  { key: 'defensa', title: 'Defensa oral', sub: 'Explica sus decisiones', x: 4.3, color: '#3be09a' },
]
const PROC = { w: 3.6, h: 3.6 }

/* paso 3: programa del curso */
const PROGRAM = { w: 7.2, h: 4.6 }
const RULES = [
  { title: 'Qué se permite', text: 'Ideas y revisión de estilo con IA', v: 0.36 },
  { title: 'Qué se cita', text: 'La herramienta y los prompts usados', v: 0.585 },
  { title: 'Qué se evalúa', text: 'El proceso y la defensa oral', v: 0.81 },
]
const CHECK_U = 0.085
const checkX = (CHECK_U - 0.5) * PROGRAM.w
const ruleY = (v) => Y + (0.5 - v) * PROGRAM.h
const CLICKS = [10.7, 11.25, 11.8]
const CURSOR_PATH = [
  [10.1, 4.8, 0.6],
  [10.6, checkX, ruleY(RULES[0].v)],
  [10.75, checkX, ruleY(RULES[0].v)],
  [11.15, checkX, ruleY(RULES[1].v)],
  [11.3, checkX, ruleY(RULES[1].v)],
  [11.7, checkX, ruleY(RULES[2].v)],
  [11.9, checkX, ruleY(RULES[2].v)],
  [12.5, 4.6, 0.8],
]

/* paso 4: conversación */
const BUBBLE = { w: 5.4, h: 1.7 }
const BUBBLES = [
  { who: 'Docente', initial: 'D', text: '¿Por qué eligió esta fuente y no la otra?', x: -2.3, y: 4.55, accent: '#f4cb18', bg: '#ffffff', tail: -1 },
  { who: 'Estudiante', initial: 'E', text: 'Comparé las dos y descarté la que no citaba datos.', x: 2.3, y: 2.25, accent: '#3be09a', bg: '#e9f8ff', tail: 1 },
]

function cursorAt(T) {
  const first = CURSOR_PATH[0]
  if (T <= first[0]) return { x: first[1], y: first[2] }
  for (let i = 0; i < CURSOR_PATH.length - 1; i += 1) {
    const a = CURSOR_PATH[i]
    const b = CURSOR_PATH[i + 1]
    if (T <= b[0]) {
      const k = easeInOutCubic(seg(T, a[0], b[0]))
      return { x: lerp(a[1], b[1], k), y: lerp(a[2], b[2], k) }
    }
  }
  const last = CURSOR_PATH[CURSOR_PATH.length - 1]
  return { x: last[1], y: last[2] }
}

/* ------------------------------------------------------------------ */
/* Texturas                                                            */
/* ------------------------------------------------------------------ */

function line(ctx, x, y, width, color = 'rgba(4,35,97,0.2)', height = 14) {
  ctx.fillStyle = color
  roundRectPath(ctx, x, y, width, height, height / 2)
  ctx.fill()
}

function drawDetector(ctx, w, h) {
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#0d3a85')
  bg.addColorStop(1, '#042361')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  fitText(ctx, 'Detector de IA', w * 0.07, h * 0.13, { weight: 800, size: h * 0.075, maxWidth: w * 0.6, color: '#ffffff' })
  fitText(ctx, 'Ensayo final · análisis automático', w * 0.07, h * 0.2, { weight: 500, size: h * 0.045, family: FONT_BODY, maxWidth: w * 0.8, color: '#9fe8ff' })

  const cx = w / 2
  const cy = h * GAUGE_V
  const r = h * 0.36
  ctx.lineCap = 'round'
  ctx.lineWidth = 34
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.beginPath()
  ctx.arc(cx, cy, r, Math.PI, Math.PI * 2)
  ctx.stroke()
  const grad = ctx.createLinearGradient(cx - r, 0, cx + r, 0)
  grad.addColorStop(0, '#7fdcff')
  grad.addColorStop(0.6, '#f4cb18')
  grad.addColorStop(1, '#ffd96a')
  ctx.strokeStyle = grad
  ctx.lineWidth = 22
  ctx.beginPath()
  ctx.arc(cx, cy, r, Math.PI, Math.PI * 2)
  ctx.stroke()
  ctx.lineCap = 'butt'
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'
  ctx.lineWidth = 3
  for (let i = 0; i <= 10; i += 1) {
    const a = Math.PI + (i / 10) * Math.PI
    const r0 = r - 34
    const r1 = r - (i % 5 === 0 ? 58 : 46)
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0)
    ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1)
    ctx.stroke()
  }
  fitText(ctx, '0', cx - r, cy + 44, { weight: 600, size: 26, family: FONT_MONO, color: 'rgba(255,255,255,0.6)', align: 'center' })
  fitText(ctx, '100', cx + r, cy + 44, { weight: 600, size: 26, family: FONT_MONO, color: 'rgba(255,255,255,0.6)', align: 'center' })
}

function drawNumber(ctx, w, h, value) {
  fitText(ctx, `${value} %`, w / 2, h * 0.78, { weight: 800, size: h * 0.8, family: FONT_DISPLAY, maxWidth: w * 0.95, color: '#f4cb18', align: 'center' })
}

function drawChip(ctx, w, h, text, color, textColor = NAVY) {
  ctx.fillStyle = color
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fill()
  fitText(ctx, text, w / 2, h * 0.68, { weight: 800, size: h * 0.5, maxWidth: w * 0.88, color: textColor, align: 'center' })
}

function drawSanction(ctx, w, h) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#34425f'
  ctx.fillRect(0, 0, w, h * 0.16)
  fitText(ctx, 'Propuesta de sanción', w * 0.07, h * 0.105, { weight: 800, size: h * 0.065, maxWidth: w * 0.86, color: '#ffffff' })
  fitText(ctx, 'Estudiante: E07', w * 0.07, h * 0.29, { weight: 700, size: h * 0.055, family: FONT_BODY, maxWidth: w * 0.86, color: NAVY })
  fitText(ctx, 'Trabajo: ensayo final', w * 0.07, h * 0.4, { weight: 500, size: h * 0.05, family: FONT_BODY, maxWidth: w * 0.86, color: 'rgba(4,35,97,0.75)' })
  ctx.fillStyle = 'rgba(244,203,24,0.35)'
  roundRectPath(ctx, w * 0.05, h * (EVIDENCE_V - 0.07), w * 0.9, h * 0.12, 16)
  ctx.fill()
  fitText(ctx, 'Única evidencia: detector 72 %', w * 0.08, h * (EVIDENCE_V + 0.018), { weight: 700, size: h * 0.05, family: FONT_BODY, maxWidth: w * 0.84, color: NAVY })
  line(ctx, w * 0.07, h * 0.76, w * 0.8)
  line(ctx, w * 0.07, h * 0.83, w * 0.66)
  line(ctx, w * 0.07, h * 0.9, w * 0.5)
}

function drawStamp(ctx, w, h) {
  ctx.fillStyle = NAVY
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = '#f4cb18'
  ctx.lineWidth = 10
  roundRectPath(ctx, 14, 14, w - 28, h - 28, 26)
  ctx.stroke()
  ctx.lineWidth = 3
  roundRectPath(ctx, 34, 34, w - 68, h - 68, 16)
  ctx.stroke()
  fitText(ctx, 'NO SOSTIENE', w / 2, h * 0.47, { weight: 800, size: h * 0.26, maxWidth: w * 0.8, color: '#f4cb18', align: 'center' })
  fitText(ctx, 'UNA SANCIÓN', w / 2, h * 0.78, { weight: 800, size: h * 0.26, maxWidth: w * 0.8, color: '#f4cb18', align: 'center' })
}

function drawProcessIcon(ctx, kind, x, y, s, color) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 7
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  if (kind === 'borrador') {
    // hoja con líneas tachadas y una corrección
    ctx.strokeStyle = NAVY
    ctx.lineWidth = 5
    roundRectPath(ctx, x, y, s * 0.8, s, 10)
    ctx.stroke()
    for (let i = 0; i < 4; i += 1) line(ctx, x + s * 0.12, y + s * (0.2 + i * 0.2), s * (i === 1 ? 0.4 : 0.56), 'rgba(4,35,97,0.3)', 9)
    ctx.strokeStyle = '#e0a800'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(x + s * 0.08, y + s * 0.44)
    ctx.lineTo(x + s * 0.62, y + s * 0.44)
    ctx.stroke()
  } else if (kind === 'bitacora') {
    // cuaderno con fechas
    ctx.strokeStyle = NAVY
    ctx.lineWidth = 5
    roundRectPath(ctx, x, y, s * 0.85, s, 10)
    ctx.stroke()
    for (let i = 0; i < 3; i += 1) {
      ctx.fillStyle = '#2aa9d6'
      ctx.beginPath()
      ctx.arc(x + s * 0.18, y + s * (0.24 + i * 0.26), 8, 0, Math.PI * 2)
      ctx.fill()
      line(ctx, x + s * 0.3, y + s * (0.24 + i * 0.26) - 5, s * 0.42, 'rgba(4,35,97,0.3)', 10)
    }
  } else {
    // micrófono
    ctx.fillStyle = '#1f8a5b'
    roundRectPath(ctx, x + s * 0.28, y, s * 0.3, s * 0.58, s * 0.15)
    ctx.fill()
    ctx.strokeStyle = '#1f8a5b'
    ctx.lineWidth = 7
    ctx.beginPath()
    ctx.arc(x + s * 0.43, y + s * 0.4, s * 0.28, 0.1 * Math.PI, 0.9 * Math.PI)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x + s * 0.43, y + s * 0.68)
    ctx.lineTo(x + s * 0.43, y + s * 0.9)
    ctx.moveTo(x + s * 0.25, y + s * 0.92)
    ctx.lineTo(x + s * 0.61, y + s * 0.92)
    ctx.stroke()
  }
  ctx.lineCap = 'butt'
}

function drawProcess(ctx, w, h, item, index) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = item.color
  ctx.fillRect(0, 0, w, h * 0.06)
  ctx.fillStyle = NAVY
  ctx.beginPath()
  ctx.arc(w * 0.16, h * 0.18, h * 0.07, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, String(index + 1), w * 0.16, h * 0.205, { weight: 800, size: h * 0.08, color: '#ffffff', align: 'center' })
  drawProcessIcon(ctx, item.key, w * 0.3, h * 0.3, h * 0.36, item.color)
  fitText(ctx, item.title, w / 2, h * 0.8, { weight: 800, size: h * 0.1, maxWidth: w * 0.86, color: NAVY, align: 'center' })
  fitText(ctx, item.sub, w / 2, h * 0.9, { weight: 500, size: h * 0.055, family: FONT_BODY, maxWidth: w * 0.86, color: 'rgba(4,35,97,0.7)', align: 'center' })
}

function drawProgram(ctx, w, h) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = NAVY
  ctx.fillRect(0, 0, w, h * 0.2)
  ctx.fillStyle = '#f4cb18'
  ctx.fillRect(0, h * 0.2, w, 8)
  fitText(ctx, 'Programa del curso', w * 0.05, h * 0.1, { weight: 800, size: h * 0.065, maxWidth: w * 0.6, color: '#ffffff' })
  fitText(ctx, 'Uso de IA en esta asignatura', w * 0.05, h * 0.165, { weight: 500, size: h * 0.042, family: FONT_BODY, maxWidth: w * 0.7, color: '#9fe8ff' })
  RULES.forEach((rule) => {
    const top = h * (rule.v - 0.09)
    ctx.fillStyle = '#e8eef9'
    roundRectPath(ctx, w * 0.035, top, w * 0.93, h * 0.18, 20)
    ctx.fill()
    ctx.strokeStyle = 'rgba(4,35,97,0.45)'
    ctx.lineWidth = 4
    const box = h * 0.085
    roundRectPath(ctx, w * CHECK_U - box / 2, h * rule.v - box / 2, box, box, 10)
    ctx.stroke()
    fitText(ctx, rule.title, w * 0.15, h * (rule.v - 0.01), { weight: 800, size: h * 0.055, maxWidth: w * 0.78, color: NAVY })
    fitText(ctx, rule.text, w * 0.15, h * (rule.v + 0.055), { weight: 500, size: h * 0.045, family: FONT_BODY, maxWidth: w * 0.78, color: 'rgba(4,35,97,0.72)' })
  })
}

function drawCheck(ctx, w, h) {
  ctx.fillStyle = '#3be09a'
  roundRectPath(ctx, 4, 4, w - 8, h - 8, 18)
  ctx.fill()
  ctx.strokeStyle = NAVY
  ctx.lineWidth = w * 0.11
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(w * 0.25, h * 0.52)
  ctx.lineTo(w * 0.43, h * 0.7)
  ctx.lineTo(w * 0.76, h * 0.32)
  ctx.stroke()
}

function drawBubble(ctx, w, h, bubble) {
  ctx.fillStyle = bubble.bg
  ctx.fillRect(0, 0, w, h)
  const ax = bubble.tail < 0 ? w * 0.09 : w * 0.91
  ctx.fillStyle = bubble.accent
  ctx.beginPath()
  ctx.arc(ax, h * 0.5, h * 0.24, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, bubble.initial, ax, h * 0.6, { weight: 800, size: h * 0.26, color: NAVY, align: 'center' })
  const tx = bubble.tail < 0 ? w * 0.19 : w * 0.05
  fitText(ctx, bubble.who, tx, h * 0.33, { weight: 700, size: h * 0.15, family: FONT_MONO, maxWidth: w * 0.7, color: 'rgba(4,35,97,0.6)' })
  fitText(ctx, bubble.text, tx, h * 0.66, { weight: 700, size: h * 0.19, family: FONT_BODY, maxWidth: w * 0.75, color: NAVY })
}

function drawCaption(ctx, w, h, text, color = '#9fc4ff', family = FONT_MONO, weight = 600) {
  fitText(ctx, text, w / 2, h * 0.7, { weight, size: h * 0.6, family, maxWidth: w * 0.96, color, align: 'center' })
}

/* ------------------------------------------------------------------ */

export default function createAgentesCierreScene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: AGENTES_CIERRE_DURATION,
    frame: { wideHalfW: 8.7, narrowHalfW: 6.3, halfH: 4.5, camY: 5.0, lookY: 3.3 },
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 10, perBurst: 18, seed: 41 })
  scene.add(bursts.points)
  const amberColor = new THREE.Color(AMBER)
  const greenColor = new THREE.Color(GREEN)
  const cyanColor = new THREE.Color(CYAN)

  const makeCard = (w, h, texW, texH, draw, extra = {}) =>
    makeSlabCard({
      w,
      h,
      depth: 0.1,
      radius: 0.22,
      bevel: 0.03,
      edge: '#cfd8ea',
      roughness: 0.8,
      inset: 0.04,
      texture: makeTex(texW, texH, draw, invalidate),
      ...extra,
    })

  const fade = (mesh, opacity) => {
    mesh.material.opacity = opacity
    mesh.visible = opacity > 0.01
  }

  /* ---------------- título ---------------- */
  const title = makeTextPlane(
    10.5,
    0.6,
    makeTex(1680, 96, (ctx, w, h) => drawCaption(ctx, w, h, 'IA y evaluación: lo que no se puede delegar', '#ffffff', FONT_DISPLAY, 800), invalidate),
  )
  title.position.set(0, 7.05, 0)
  scene.add(title)

  /* ---------------- paso 0: detector ---------------- */
  const detector = makeCard(DETECTOR.w, DETECTOR.h, 810, 600, drawDetector, { edge: '#1a4c9c', emissive: '#f4cb18' })
  scene.add(detector.group)
  const faceZ = detector.thickness / 2 + 0.02
  const needleMat = new THREE.MeshStandardMaterial({ color: AMBER, emissive: AMBER, emissiveIntensity: 0.5, metalness: 0.4, roughness: 0.3, transparent: true })
  const needlePivot = new THREE.Group()
  needlePivot.position.set(0, GAUGE_Y, faceZ + 0.03)
  const needle = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.07, 0.04), needleMat)
  needle.position.x = 0.6
  needle.castShadow = true
  needlePivot.add(needle)
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.08, 28), needleMat)
  hub.rotation.x = Math.PI / 2
  needlePivot.add(hub)
  detector.group.add(needlePivot)

  let shownPct = -1
  const numberTex = makeTex(360, 120, (ctx, w, h) => drawNumber(ctx, w, h, Math.max(0, shownPct)), invalidate)
  const numberPlane = makeTextPlane(1.8, 0.6, numberTex)
  numberPlane.position.set(0, NUMBER_Y, faceZ)
  detector.group.add(numberPlane)

  const probChip = makeTextPlane(4.2, 0.66, makeTex(840, 132, (ctx, w, h) => drawChip(ctx, w, h, 'Probabilidad, no prueba', '#7fdcff'), invalidate))
  probChip.position.set(0, -DETECTOR.h / 2 - 0.55, 0.15)
  detector.group.add(probChip)

  const detectorGlow = addGlow(scene, glow, AMBER, 7, 0)
  const detectorRing = makeShockRing(AMBER)
  scene.add(detectorRing)

  /* ---------------- paso 1: sanción y sello ---------------- */
  const sanction = makeCard(SANCTION.w, SANCTION.h, 690, 600, drawSanction)
  scene.add(sanction.group)
  const evidenceBeam = makeBeam(AMBER, 0.8)
  scene.add(evidenceBeam)
  const flyChip = makeTextPlane(1.5, 0.56, makeTex(300, 112, (ctx, w, h) => drawChip(ctx, w, h, '72 %', '#f4cb18'), invalidate))
  flyChip.renderOrder = 5
  scene.add(flyChip)
  const stamp = makeCard(3.8, 1.5, 760, 300, drawStamp, { edge: '#f4cb18', emissive: '#f4cb18', radius: 0.18 })
  scene.add(stamp.group)
  const stampRing = makeShockRing(AMBER)
  scene.add(stampRing)
  const amberWash = new THREE.PointLight(AMBER, 0, 16, 2)
  amberWash.position.set(SANCTION.x, 4.5, 4)
  scene.add(amberWash)

  /* ---------------- paso 2: proceso ---------------- */
  const processHeader = makeTextPlane(
    9,
    0.6,
    makeTex(1440, 96, (ctx, w, h) => drawCaption(ctx, w, h, 'La tarea pide el proceso, no solo el producto', '#7fdcff'), invalidate),
  )
  processHeader.position.set(0, 6.05, 0.2)
  scene.add(processHeader)
  const processCards = PROCESS.map((item, i) => {
    const card = makeCard(PROC.w, PROC.h, 540, 540, (ctx, w, h) => drawProcess(ctx, w, h, item, i), { emissive: item.color })
    scene.add(card.group)
    const ring = makeShockRing(new THREE.Color(item.color).getHex())
    scene.add(ring)
    return { ...item, card, ring }
  })
  const processBeams = [makeBeam(CYAN, 0.8), makeBeam(GREEN, 0.8)]
  processBeams.forEach((beam) => scene.add(beam))

  /* ---------------- paso 3: programa ---------------- */
  const program = makeCard(PROGRAM.w, PROGRAM.h, 1080, 690, drawProgram, { edge: '#f4cb18', emissive: '#f4cb18' })
  scene.add(program.group)
  const checkTex = makeTex(128, 128, drawCheck, invalidate)
  const checks = RULES.map(() => {
    const mesh = makeTextPlane(0.42, 0.42, checkTex)
    mesh.renderOrder = 6
    scene.add(mesh)
    const ring = makeShockRing(GREEN)
    scene.add(ring)
    return { mesh, ring }
  })
  const cursor = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: makeCursorTexture(), transparent: true, depthWrite: false, depthTest: false }),
  )
  cursor.renderOrder = 20
  scene.add(cursor)

  /* ---------------- paso 4: conversación ---------------- */
  const ghost = makeTextPlane(2.2, 0.82, makeTex(300, 112, (ctx, w, h) => drawChip(ctx, w, h, '72 %', '#f4cb18'), invalidate))
  ghost.renderOrder = 5
  scene.add(ghost)
  const ghostRing = makeShockRing(CYAN)
  scene.add(ghostRing)

  const tailShape = new THREE.Shape()
  tailShape.moveTo(-0.28, 0)
  tailShape.lineTo(0.28, 0)
  tailShape.lineTo(-0.05, -0.5)
  tailShape.closePath()
  const tailGeometry = new THREE.ShapeGeometry(tailShape)
  const bubbles = BUBBLES.map((bubble) => {
    const card = makeCard(BUBBLE.w, BUBBLE.h, 1080, 340, (ctx, w, h) => drawBubble(ctx, w, h, bubble), {
      edge: bubble.accent,
      emissive: bubble.accent,
      radius: 0.4,
    })
    const tailMat = new THREE.MeshStandardMaterial({ color: bubble.bg, roughness: 0.8, transparent: true, side: THREE.DoubleSide })
    const tail = new THREE.Mesh(tailGeometry, tailMat)
    tail.position.set(bubble.tail * (BUBBLE.w / 2 - 0.9), -BUBBLE.h / 2 + 0.06, card.thickness / 2)
    tail.scale.x = -bubble.tail
    card.group.add(tail)
    scene.add(card.group)
    const ring = makeShockRing(new THREE.Color(bubble.accent).getHex())
    scene.add(ring)
    return { ...bubble, card, tail, ring }
  })
  const talkBeam = makeBeam(GREEN, 0.8)
  scene.add(talkBeam)
  const footer = makeTextPlane(
    11,
    0.62,
    makeTex(1760, 100, (ctx, w, h) => drawCaption(ctx, w, h, 'Evalúe con una conversación, no con un porcentaje'), invalidate),
  )
  footer.position.set(0, -0.45, 0.2)
  scene.add(footer)

  const pA = new THREE.Vector3()
  const pB = new THREE.Vector3()
  const pC = new THREE.Vector3()

  function place(card, x, y, z, s, opacity) {
    card.group.position.set(x, y, z)
    card.group.scale.setScalar(safeScale(s))
    setCardOpacity(card, opacity)
  }

  function draw(t) {
    const T = t * AGENTES_CIERRE_DURATION
    const events = []

    stage.update(T, 0)
    stage.spot.position.set(0, 4.6, 5.5)

    fade(title, 0.9 * smooth(seg(T, 0.2, 0.8)))

    /* ---------- detector: centro → lateral ---------- */
    const detIn = easeOutBack(seg(T, 0.15, 0.85))
    const detSide = easeInOutCubic(seg(T, 3.3, 4.0))
    const detOut = smooth(seg(T, 6.1, 6.7))
    const detX = lerp(0, DETECTOR.xSide, detSide)
    const detS = lerp(1, DETECTOR.sSide, detSide) * detIn * lerp(1, 0.85, detOut)
    const detOpacity = smooth(seg(T, 0.15, 0.5)) * (1 - detOut)
    place(detector, detX, Y - detOut * 0.6, 0, detS, detOpacity)
    flashCard(detector, bump(seg(T, 1.6, 2.4)) * 0.45)

    // aguja y porcentaje: suben hasta 72 % con un pequeño rebote
    const needleK = easeOutBack(seg(T, 0.6, 1.8))
    const pct = (PCT / 100) * needleK
    needlePivot.rotation.z = Math.PI * (1 - Math.min(1, pct))
    needleMat.opacity = detOpacity
    needlePivot.visible = detOpacity > 0.01
    const value = Math.round(Math.min(PCT, PCT * needleK))
    if (value !== shownPct) {
      shownPct = value
      numberTex.userData.repaint()
    }
    fade(numberPlane, detOpacity * smooth(seg(T, 0.6, 0.9)))
    fade(probChip, detOpacity * smooth(seg(T, 1.9, 2.4)))
    probChip.scale.setScalar(safeScale(lerp(0.85, 1, easeOutBack(seg(T, 1.9, 2.4)))))

    detectorGlow.position.set(detX, Y, -0.5)
    detectorGlow.material.opacity = 0.45 * smooth(seg(T, 0.6, 1.6)) * (1 - smooth(seg(T, 3.0, 3.8))) * (0.85 + 0.15 * Math.sin(T * 3))
    setShockRing(detectorRing, T - 1.85, 0.9, 2.6)
    detectorRing.position.set(0, Y + GAUGE_Y, 0.3)
    if (T > 1.85 && T < 2.8) events.push({ t: 1.9, x: 0, y: Y + GAUGE_Y + 0.8, z: 0.8, color: amberColor, speed: 2.0, life: 0.9 })

    /* ---------- propuesta de sanción ---------- */
    const sanIn = easeOutBack(seg(T, 3.6, 4.2))
    const sanOut = smooth(seg(T, 6.1, 6.7))
    const sanX = lerp(SANCTION.x + 2.5, SANCTION.x, easeOutCubic(seg(T, 3.6, 4.2)))
    place(sanction, sanX, Y - sanOut * 0.6, 0, sanIn * lerp(1, 0.85, sanOut), smooth(seg(T, 3.6, 3.9)) * (1 - sanOut))

    // haz: del porcentaje del detector a la «evidencia» del expediente
    const evidenceY = Y + (0.5 - EVIDENCE_V) * SANCTION.h
    pA.set(detX + (DETECTOR.w / 2) * detS, Y + NUMBER_Y * detS, 0.3)
    pB.set(SANCTION.x - SANCTION.w / 2, evidenceY, 0.3)
    const travel = easeInOutCubic(seg(T, 4.0, 4.6))
    pC.copy(pA).lerp(pB, travel)
    setBeam(evidenceBeam, pA, pC, 0.035)
    evidenceBeam.material.opacity = 0.8 * smooth(seg(T, 4.0, 4.2)) * (1 - smooth(seg(T, 5.0, 5.4)))
    if (travel < 0.001 || evidenceBeam.material.opacity < 0.01) evidenceBeam.visible = false
    flyChip.position.set(pC.x, pC.y + Math.sin(travel * Math.PI) * 0.6, 1.0)
    fade(flyChip, smooth(seg(T, 4.0, 4.15)) * (1 - smooth(seg(T, 4.55, 4.75))))

    // sello que cae sobre el expediente
    const stampK = easeInOutCubic(seg(T, 4.7, 5.1))
    const stampHit = 5.1
    const wobble = Math.exp(-Math.max(0, T - stampHit) * 6) * Math.sin(Math.max(0, T - stampHit) * 18) * 0.05
    place(
      stamp,
      SANCTION.x,
      Y + 0.15 - sanOut * 0.6,
      lerp(3.2, 0.25, stampK),
      lerp(1.8, 1, stampK) * (1 + wobble) * lerp(1, 0.85, sanOut),
      smooth(seg(T, 4.7, 4.85)) * (1 - sanOut),
    )
    stamp.group.rotation.z = -0.16
    flashCard(stamp, bump(seg(T, 5.05, 5.8)) * 0.7)
    flashCard(sanction, bump(seg(T, 5.05, 5.7)) * 0.3)
    setShockRing(stampRing, T - stampHit, 1.0, 3.2)
    stampRing.position.set(SANCTION.x, Y + 0.15, 0.35)
    if (T > stampHit && T < stampHit + 1.2) events.push({ t: stampHit + 0.02, x: SANCTION.x, y: Y + 0.15, z: 0.8, color: amberColor, speed: 2.8, life: 1.1 })
    amberWash.intensity = 16 * bump(seg(T, 5.0, 6.2))

    /* ---------- proceso: borrador, bitácora, defensa oral ---------- */
    const procOut = smooth(seg(T, 9.3, 9.9))
    const headerK = smooth(seg(T, 6.6, 7.1)) * (1 - procOut)
    fade(processHeader, headerK)
    processCards.forEach((item, i) => {
      const start = 6.7 + i * 0.5
      const enter = easeOutBack(seg(T, start, start + 0.6))
      const rise = (1 - easeOutCubic(seg(T, start, start + 0.6))) * -1.2
      place(item.card, item.x, Y + rise + procOut * 0.8, 0, enter * lerp(1, 0.85, procOut), smooth(seg(T, start, start + 0.3)) * (1 - procOut))
      flashCard(item.card, bump(seg(T, start + 0.3, start + 1.1)) * 0.5)
      setShockRing(item.ring, T - (start + 0.35), 0.9, 2.2)
      item.ring.position.set(item.x, Y, 0.3)
      if (T > start + 0.3 && T < start + 1.2) {
        events.push({ t: start + 0.35, x: item.x, y: Y + 1.2, z: 0.8, color: i === 2 ? greenColor : i === 0 ? amberColor : cyanColor, speed: 1.9, life: 0.9 })
      }
    })
    processBeams.forEach((beam, i) => {
      const from = processCards[i]
      const to = processCards[i + 1]
      const start = 7.3 + i * 0.5
      const k = easeInOutCubic(seg(T, start, start + 0.5))
      pA.set(from.x + PROC.w / 2, Y, 0.3)
      pB.set(to.x - PROC.w / 2, Y, 0.3)
      pC.copy(pA).lerp(pB, k)
      setBeam(beam, pA, pC, 0.04 + 0.01 * Math.sin(T * 6 + i))
      beam.material.opacity = 0.8 * smooth(seg(T, start, start + 0.2)) * (1 - procOut)
      if (k < 0.001 || beam.material.opacity < 0.01) beam.visible = false
    })

    /* ---------- programa con reglas declaradas ---------- */
    const progIn = easeOutBack(seg(T, 9.8, 10.4))
    const progOut = smooth(seg(T, 12.5, 13.0))
    const progOpacity = smooth(seg(T, 9.8, 10.1)) * (1 - progOut)
    place(program, 0, Y - progOut * 0.6, 0, progIn * lerp(1, 0.88, progOut), progOpacity)
    flashCard(program, bump(seg(T, 11.9, 12.6)) * 0.5)
    checks.forEach((check, i) => {
      const k = easeOutBack(seg(T, CLICKS[i], CLICKS[i] + 0.35))
      check.mesh.position.set(checkX * progIn, Y + (ruleY(RULES[i].v) - Y) * progIn - progOut * 0.6, 0.2)
      check.mesh.scale.setScalar(safeScale(k * progIn))
      fade(check.mesh, progOpacity * smooth(seg(T, CLICKS[i], CLICKS[i] + 0.15)))
      setShockRing(check.ring, T - CLICKS[i], 0.7, 0.9)
      check.ring.position.set(checkX, ruleY(RULES[i].v), 0.3)
      if (T > CLICKS[i] && T < CLICKS[i] + 0.9) events.push({ t: CLICKS[i] + 0.02, x: checkX, y: ruleY(RULES[i].v), z: 0.8, color: greenColor, speed: 1.5, life: 0.8 })
    })
    const c = cursorAt(T)
    const click = CLICKS.reduce((acc, at) => Math.max(acc, bump(seg(T, at - 0.05, at + 0.2))), 0)
    cursor.position.set(c.x + 0.31, c.y - 0.41 - click * 0.08, 1.7)
    cursor.scale.setScalar(1 - click * 0.1)
    fade(cursor, smooth(seg(T, 10.1, 10.35)) * (1 - smooth(seg(T, 12.2, 12.5))))

    /* ---------- conversación en vez de un número ---------- */
    const ghostIn = easeOutBack(seg(T, 12.9, 13.25))
    const ghostOut = easeInOutCubic(seg(T, 13.45, 13.8))
    ghost.position.set(0, Y + 0.1, 0.8)
    ghost.scale.setScalar(safeScale(ghostIn * (1 - ghostOut)))
    fade(ghost, smooth(seg(T, 12.9, 13.1)) * (1 - ghostOut))
    setShockRing(ghostRing, T - 13.6, 0.8, 1.8)
    ghostRing.position.set(0, Y + 0.1, 0.8)
    if (T > 13.55 && T < 14.4) events.push({ t: 13.6, x: 0, y: Y + 0.1, z: 0.9, color: cyanColor, speed: 2.4, life: 0.9 })

    bubbles.forEach((bubble, i) => {
      const start = 13.7 + i * 0.6
      const enter = easeOutBack(seg(T, start, start + 0.55))
      const slide = (1 - easeOutCubic(seg(T, start, start + 0.55))) * -bubble.tail * 1.6
      const opacity = smooth(seg(T, start, start + 0.3))
      place(bubble.card, bubble.x - slide, bubble.y, 0.2, enter, opacity)
      bubble.tail.material.opacity = opacity
      flashCard(bubble.card, bump(seg(T, start + 0.3, start + 1.1)) * 0.45)
      setShockRing(bubble.ring, T - (start + 0.35), 0.9, 2.0)
      bubble.ring.position.set(bubble.x, bubble.y, 0.3)
      if (T > start + 0.3 && T < start + 1.2) {
        events.push({ t: start + 0.35, x: bubble.x, y: bubble.y + 0.6, z: 0.8, color: i === 0 ? amberColor : greenColor, speed: 1.8, life: 0.9 })
      }
    })

    // haz entre docente y estudiante: el ida y vuelta de la conversación
    const talkK = easeInOutCubic(seg(T, 14.5, 15.0))
    pA.set(BUBBLES[0].x + 0.6, BUBBLES[0].y - BUBBLE.h / 2, 0.3)
    pB.set(BUBBLES[1].x - 0.6, BUBBLES[1].y + BUBBLE.h / 2, 0.3)
    pC.copy(pA).lerp(pB, talkK)
    setBeam(talkBeam, pA, pC, 0.035 + 0.01 * Math.sin(T * 7))
    talkBeam.material.opacity = 0.8 * smooth(seg(T, 14.5, 14.7))
    if (talkK < 0.001) talkBeam.visible = false

    fade(footer, smooth(seg(T, 14.6, 15.1)))

    bursts.update(T, events)
    return Math.min(4, Math.floor(T / PHASE))
  }

  function dispose() {
    stage.dispose()
    tailGeometry.dispose()
  }

  return { scene, camera: stage.camera, draw, resize: stage.resize, dispose }
}
