import * as THREE from 'three'
import { bump, easeInOutCubic, easeOutBack, easeOutCubic, lerp, roundRectPath, seg, smooth } from './threeKit'
import {
  FONT_BODY,
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
 * Escena “El piloto y su ficha” (Sesión 4, Entregable).
 * Loop de 16 s en 5 fases de 3,2 s:
 *   0 cada mesa elige un camino: app de quiz o flujo automatizado ·
 *   1 Camino A: el enlace al artefacto de Claude ·
 *   2 Camino B: el formulario «Reflexión de unidad» con sus 6 preguntas ·
 *   3 un pantallazo de Hark trabajando ·
 *   4 los tres entregables juntos y la demo de 2 minutos.
 * `draw(t)` es una función pura del tiempo dentro del loop.
 */
export const AGENTES_ENTREGABLE_DURATION = 16

const NAVY = '#042361'
const AMBER_CSS = '#f4cb18'
const CYAN_CSS = '#7fdcff'
const GREEN_CSS = '#3be09a'
const AMBER = 0xf4cb18
const CYAN = 0x7fdcff
const GREEN = 0x3be09a

const PHASE = 3.2
const TEX = 150

/* fase 0 */
const PATH = { w: 4.6, h: 3.2, y: 4.0, x: 3.0 }
const MESA_Y = 0.85
/* fase 1 */
const ART = { w: 6.4, h: 4.2, y: 3.7 }
const OPTION_V = [0.6, 0.73, 0.86]
const PICK = 1
/* fase 2 */
const FORM = { w: 5.2, h: 4.6, y: 3.55 }
const ROW = { w: 4.6, h: 0.44, gap: 0.52 }
/* fase 3 */
const HARK = { w: 9.4, h: 4.8, y: 3.6 }
const NODE = { w: 1.45, h: 1.3, y: 3.25 }
const NODE_X = [0.05, 1.8, 3.55]
/* fase 4 */
const FINAL = { w: 3.3, h: 2.4, y: 4.45 }
const FINAL_X = [-3.8, 0, 3.8]
const DEMO = { x: 0, y: 0.18, z: 0.9, r: 1.9, h: 0.3 }

const artY = (v) => ART.y + (0.5 - v) * ART.h

function phaseOpacity(T, i) {
  const a = i * PHASE
  const b = a + PHASE
  return smooth(seg(T, a + 0.1, a + 0.55)) * (1 - smooth(seg(T, b - 0.35, b)))
}

/* ------------------------------------------------------------------ */
/* Texturas                                                            */
/* ------------------------------------------------------------------ */

function bar(ctx, x, y, width, height = 14, color = 'rgba(4,35,97,0.2)') {
  ctx.fillStyle = color
  roundRectPath(ctx, x, y, width, height, height / 2)
  ctx.fill()
}

function windowFrame(ctx, w, h, title, { color = NAVY, band = 0.13, dots = true } = {}) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = color
  ctx.fillRect(0, 0, w, h * band)
  let x = w * 0.05
  if (dots) {
    ;[AMBER_CSS, CYAN_CSS, GREEN_CSS].forEach((c, i) => {
      ctx.fillStyle = c
      ctx.beginPath()
      ctx.arc(w * 0.04 + i * h * 0.055, h * band * 0.5, h * band * 0.15, 0, Math.PI * 2)
      ctx.fill()
    })
    x = w * 0.04 + h * 0.2
  }
  fitText(ctx, title, x, h * band * 0.68, { weight: 800, size: h * band * 0.5, maxWidth: w - x - w * 0.04, color: '#ffffff' })
}

function iconQuiz(ctx, x, y, s) {
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = NAVY
  ctx.lineWidth = s * 0.05
  roundRectPath(ctx, x, y, s, s, s * 0.14)
  ctx.fill()
  ctx.stroke()
  fitText(ctx, '?', x + s * 0.5, y + s * 0.38, { weight: 800, size: s * 0.32, color: NAVY, align: 'center' })
  ;[0.5, 0.65, 0.8].forEach((v, i) => {
    bar(ctx, x + s * 0.16, y + s * v, s * 0.68, s * 0.1, i === 1 ? GREEN_CSS : 'rgba(4,35,97,0.2)')
  })
}

function iconFlow(ctx, x, y, s) {
  const nodes = [
    [0.18, 0.3, AMBER_CSS],
    [0.5, 0.72, CYAN_CSS],
    [0.82, 0.3, GREEN_CSS],
  ]
  ctx.strokeStyle = NAVY
  ctx.lineWidth = s * 0.05
  ctx.beginPath()
  ctx.moveTo(x + s * nodes[0][0], y + s * nodes[0][1])
  ctx.lineTo(x + s * nodes[1][0], y + s * nodes[1][1])
  ctx.lineTo(x + s * nodes[2][0], y + s * nodes[2][1])
  ctx.stroke()
  nodes.forEach(([u, v, c]) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(x + s * u, y + s * v, s * 0.15, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  })
}

function iconLink(ctx, cx, cy, s, color = NAVY) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(-Math.PI / 4)
  ctx.strokeStyle = color
  ctx.lineWidth = s * 0.13
  roundRectPath(ctx, -s * 0.62, -s * 0.2, s * 0.7, s * 0.4, s * 0.2)
  ctx.stroke()
  roundRectPath(ctx, -s * 0.08, -s * 0.2, s * 0.7, s * 0.4, s * 0.2)
  ctx.stroke()
  ctx.restore()
}

function iconForm(ctx, x, y, s) {
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = NAVY
  ctx.lineWidth = s * 0.05
  roundRectPath(ctx, x + s * 0.12, y, s * 0.76, s, s * 0.08)
  ctx.fill()
  ctx.stroke()
  ;[0.22, 0.47, 0.72].forEach((v) => {
    ctx.strokeStyle = AMBER_CSS
    ctx.lineWidth = s * 0.05
    ctx.strokeRect(x + s * 0.24, y + s * v, s * 0.12, s * 0.12)
    bar(ctx, x + s * 0.42, y + s * (v + 0.03), s * 0.34, s * 0.07)
  })
}

function iconSheet(ctx, x, y, s) {
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = '#1f8a5b'
  ctx.lineWidth = s * 0.05
  roundRectPath(ctx, x, y + s * 0.1, s, s * 0.8, s * 0.08)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = 'rgba(59,224,154,0.45)'
  ctx.fillRect(x + s * 0.03, y + s * 0.13, s * 0.94, s * 0.17)
  ctx.lineWidth = s * 0.03
  ctx.beginPath()
  ;[0.3, 0.5, 0.7].forEach((v) => {
    ctx.moveTo(x, y + s * v)
    ctx.lineTo(x + s, y + s * v)
  })
  ;[0.35, 0.68].forEach((u) => {
    ctx.moveTo(x + s * u, y + s * 0.1)
    ctx.lineTo(x + s * u, y + s * 0.9)
  })
  ctx.stroke()
}

function iconDraft(ctx, x, y, s) {
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = NAVY
  ctx.lineWidth = s * 0.06
  ctx.lineJoin = 'round'
  roundRectPath(ctx, x, y + s * 0.18, s, s * 0.64, s * 0.08)
  ctx.fill()
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x + s * 0.06, y + s * 0.24)
  ctx.lineTo(x + s * 0.5, y + s * 0.56)
  ctx.lineTo(x + s * 0.94, y + s * 0.24)
  ctx.stroke()
}

function iconShot(ctx, x, y, s) {
  ctx.fillStyle = '#e8eefc'
  roundRectPath(ctx, x + s * 0.1, y + s * 0.18, s * 0.8, s * 0.64, s * 0.06)
  ctx.fill()
  ctx.fillStyle = NAVY
  ctx.fillRect(x + s * 0.1, y + s * 0.18, s * 0.8, s * 0.12)
  bar(ctx, x + s * 0.18, y + s * 0.42, s * 0.3, s * 0.07)
  bar(ctx, x + s * 0.18, y + s * 0.56, s * 0.22, s * 0.07)
  ctx.fillStyle = GREEN_CSS
  roundRectPath(ctx, x + s * 0.56, y + s * 0.4, s * 0.26, s * 0.3, s * 0.04)
  ctx.fill()
  ctx.strokeStyle = AMBER_CSS
  ctx.lineWidth = s * 0.06
  ctx.lineCap = 'round'
  const c = s * 0.2
  ;[
    [0, 0, 1, 1],
    [1, 0, -1, 1],
    [0, 1, 1, -1],
    [1, 1, -1, -1],
  ].forEach(([u, v, dx, dy]) => {
    const px = x + s * u
    const py = y + s * v
    ctx.beginPath()
    ctx.moveTo(px + dx * c, py)
    ctx.lineTo(px, py)
    ctx.lineTo(px, py + dy * c)
    ctx.stroke()
  })
}

function drawPathCard(ctx, w, h, { letter, title, sub, accent, icon }) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = accent
  ctx.fillRect(0, 0, w, h * 0.05)
  ctx.beginPath()
  ctx.arc(w * 0.12, h * 0.2, h * 0.09, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, letter, w * 0.12, h * 0.245, { weight: 800, size: h * 0.12, color: NAVY, align: 'center' })
  fitText(ctx, `Camino ${letter}`, w * 0.22, h * 0.235, { weight: 700, size: h * 0.075, family: FONT_BODY, maxWidth: w * 0.7, color: 'rgba(4,35,97,0.65)' })
  const s = h * 0.36
  icon(ctx, w / 2 - s / 2, h * 0.33, s)
  fitText(ctx, title, w / 2, h * 0.84, { weight: 800, size: h * 0.11, maxWidth: w * 0.88, color: NAVY, align: 'center' })
  fitText(ctx, sub, w / 2, h * 0.94, { weight: 500, size: h * 0.06, family: FONT_BODY, maxWidth: w * 0.88, color: 'rgba(4,35,97,0.6)', align: 'center' })
}

function drawArtifact(ctx, w, h) {
  windowFrame(ctx, w, h, 'Artefacto de Claude')
  ctx.fillStyle = AMBER_CSS
  roundRectPath(ctx, w * 0.06, h * 0.19, w * 0.025, h * 0.15, 6)
  ctx.fill()
  fitText(ctx, 'Quiz en vivo: Oferta, demanda y equilibrio', w * 0.11, h * 0.3, { weight: 800, size: h * 0.075, maxWidth: w * 0.84, color: NAVY })
  bar(ctx, w * 0.06, h * 0.42, w * 0.7, h * 0.035, 'rgba(4,35,97,0.35)')
  bar(ctx, w * 0.06, h * 0.48, w * 0.45, h * 0.03, 'rgba(4,35,97,0.2)')
  OPTION_V.forEach((v) => {
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = 'rgba(4,35,97,0.2)'
    ctx.lineWidth = 3
    roundRectPath(ctx, w * 0.06, h * (v - 0.05), w * 0.88, h * 0.1, h * 0.03)
    ctx.fill()
    ctx.stroke()
    ctx.strokeStyle = 'rgba(4,35,97,0.45)'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(w * 0.1, h * v, h * 0.022, 0, Math.PI * 2)
    ctx.stroke()
    bar(ctx, w * 0.14, h * v - h * 0.014, w * 0.5, h * 0.028)
  })
}

function drawForm(ctx, w, h) {
  windowFrame(ctx, w, h, 'Formulario', { band: 0.11 })
  ctx.fillStyle = AMBER_CSS
  ctx.fillRect(0, h * 0.11, w, h * 0.015)
  fitText(ctx, 'Reflexión de unidad', w * 0.06, h * 0.23, { weight: 800, size: h * 0.075, maxWidth: w * 0.88, color: NAVY })
}

function drawQuestionRow(ctx, w, h, n) {
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(4,35,97,0.16)'
  ctx.lineWidth = 3
  roundRectPath(ctx, 2, 2, w - 4, h - 4, h * 0.25)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = AMBER_CSS
  ctx.beginPath()
  ctx.arc(h * 0.55, h / 2, h * 0.32, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, String(n), h * 0.55, h * 0.66, { weight: 800, size: h * 0.42, color: NAVY, align: 'center' })
  bar(ctx, h * 1.15, h * 0.26, w * (0.45 + ((n * 37) % 5) * 0.04), h * 0.16, 'rgba(4,35,97,0.4)')
  bar(ctx, h * 1.15, h * 0.58, w * 0.62, h * 0.14, 'rgba(127,220,255,0.45)')
}

function drawHark(ctx, w, h) {
  windowFrame(ctx, w, h, 'Hark', { band: 0.11 })
  fitText(ctx, 'Construyendo el flujo', w * 0.96, h * 0.075, { weight: 700, size: h * 0.045, family: FONT_BODY, maxWidth: w * 0.4, color: CYAN_CSS, align: 'right' })
  const colW = w * 0.36
  ctx.fillStyle = '#e8eefc'
  ctx.fillRect(0, h * 0.11, colW, h * 0.89)
  // mensaje del docente
  ctx.fillStyle = '#dbe6ff'
  roundRectPath(ctx, colW * 0.3, h * 0.17, colW * 0.64, h * 0.17, 20)
  ctx.fill()
  bar(ctx, colW * 0.36, h * 0.21, colW * 0.5, 12, 'rgba(4,35,97,0.45)')
  bar(ctx, colW * 0.36, h * 0.27, colW * 0.34, 12, 'rgba(4,35,97,0.3)')
  // respuesta de Hark
  ctx.fillStyle = '#ffffff'
  roundRectPath(ctx, colW * 0.06, h * 0.4, colW * 0.8, h * 0.4, 20)
  ctx.fill()
  ctx.fillStyle = AMBER_CSS
  ctx.beginPath()
  ctx.arc(colW * 0.14, h * 0.47, h * 0.025, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, 'Hark', colW * 0.2, h * 0.485, { weight: 800, size: h * 0.045, maxWidth: colW * 0.5, color: NAVY })
  fitText(ctx, 'Construyendo el flujo', colW * 0.11, h * 0.57, { weight: 700, size: h * 0.04, family: FONT_BODY, maxWidth: colW * 0.7, color: 'rgba(4,35,97,0.8)' })
  ;[
    ['Formulario', AMBER_CSS],
    ['Hoja', CYAN_CSS],
    ['Borradores', GREEN_CSS],
  ].forEach(([text, c], i) => {
    const y = h * (0.64 + i * 0.05)
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(colW * 0.14, y - h * 0.012, h * 0.012, 0, Math.PI * 2)
    ctx.fill()
    fitText(ctx, text, colW * 0.19, y, { weight: 500, size: h * 0.034, family: FONT_BODY, maxWidth: colW * 0.6, color: 'rgba(4,35,97,0.7)' })
  })
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(4,35,97,0.2)'
  ctx.lineWidth = 3
  roundRectPath(ctx, colW * 0.06, h * 0.87, colW * 0.88, h * 0.08, 18)
  ctx.fill()
  ctx.stroke()
  // lienzo del flujo
  ctx.fillStyle = 'rgba(4,35,97,0.12)'
  for (let x = colW + 30; x < w; x += 36) {
    for (let y = h * 0.11 + 30; y < h; y += 36) {
      ctx.fillRect(x, y, 4, 4)
    }
  }
  fitText(ctx, 'Flujo', colW + w * 0.04, h * 0.2, { weight: 800, size: h * 0.05, maxWidth: w * 0.3, color: 'rgba(4,35,97,0.55)' })
}

function drawNode(ctx, w, h, { name, icon, accent }) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = accent
  ctx.fillRect(0, 0, w, h * 0.08)
  const s = h * 0.46
  icon(ctx, w / 2 - s / 2, h * 0.18, s)
  fitText(ctx, name, w / 2, h * 0.86, { weight: 800, size: h * 0.15, maxWidth: w * 0.9, color: NAVY, align: 'center' })
}

function drawFinal(ctx, w, h, { kind, title, accent, icon }) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = accent
  ctx.fillRect(0, 0, w, h * 0.07)
  const s = h * 0.4
  icon(ctx, w / 2 - s / 2, h * 0.16, s)
  fitText(ctx, kind, w / 2, h * 0.73, { weight: 800, size: h * 0.12, maxWidth: w * 0.88, color: NAVY, align: 'center' })
  fitText(ctx, title, w / 2, h * 0.88, { weight: 500, size: h * 0.08, family: FONT_BODY, maxWidth: w * 0.88, color: 'rgba(4,35,97,0.65)', align: 'center' })
}

function drawChip(ctx, w, h, text, { fill = AMBER_CSS, ink = NAVY, link = false } = {}) {
  ctx.fillStyle = fill
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fill()
  if (link) {
    iconLink(ctx, h * 0.62, h / 2, h * 0.5, ink)
    fitText(ctx, text, (w + h * 0.9) / 2, h * 0.66, { weight: 800, size: h * 0.44, maxWidth: w - h * 1.4, color: ink, align: 'center' })
    return
  }
  fitText(ctx, text, w / 2, h * 0.66, { weight: 800, size: h * 0.44, maxWidth: w * 0.88, color: ink, align: 'center' })
}

function drawFrame(ctx, w, h) {
  ctx.clearRect(0, 0, w, h)
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 10
  ctx.lineCap = 'round'
  const c = Math.min(w, h) * 0.12
  const m = 8
  ;[
    [m, m, 1, 1],
    [w - m, m, -1, 1],
    [m, h - m, 1, -1],
    [w - m, h - m, -1, -1],
  ].forEach(([x, y, dx, dy]) => {
    ctx.beginPath()
    ctx.moveTo(x + dx * c, y)
    ctx.lineTo(x, y)
    ctx.lineTo(x, y + dy * c)
    ctx.stroke()
  })
}

const plainTex = (invalidate) =>
  makeTex(16, 16, (ctx, w, h) => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, w, h)
  }, invalidate)

/* ------------------------------------------------------------------ */

export default function createAgentesEntregableScene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: AGENTES_ENTREGABLE_DURATION,
    frame: { wideHalfW: 8.7, narrowHalfW: 6.2, halfH: 4.45, camY: 5.0, lookY: 3.3 },
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 10, perBurst: 18, seed: 71 })
  scene.add(bursts.points)
  const amberColor = new THREE.Color(AMBER)
  const cyanColor = new THREE.Color(CYAN)
  const greenColor = new THREE.Color(GREEN)

  const makeCard = (size, draw, extra = {}) => {
    const card = makeSlabCard({
      w: size.w,
      h: size.h,
      depth: 0.1,
      radius: 0.22,
      bevel: 0.03,
      edge: '#cfd8ea',
      roughness: 0.8,
      inset: 0.04,
      texture: makeTex(Math.round(size.w * TEX), Math.round(size.h * TEX), draw, invalidate),
      ...extra,
    })
    scene.add(card.group)
    return card
  }
  const plane = (w, h, draw, order = 5) => {
    const mesh = makeTextPlane(w, h, makeTex(Math.round(w * 200), Math.round(h * 200), draw, invalidate))
    mesh.renderOrder = order
    scene.add(mesh)
    return mesh
  }
  const shown = (obj, k) => {
    obj.material.opacity = k
    obj.visible = k > 0.01
  }
  const flat = plainTex(invalidate)

  /* ---------------- fase 0: dos caminos ---------------- */
  const title0 = plane(6.4, 0.7, (ctx, w, h) => drawChip(ctx, w, h, 'Cada mesa elige un camino'))
  title0.position.set(0, 6.65, 0.3)
  const pathA = makeCard(PATH, (ctx, w, h) =>
    drawPathCard(ctx, w, h, { letter: 'A', title: 'App de quiz', sub: 'Artefacto de Claude', accent: AMBER_CSS, icon: iconQuiz }),
  { emissive: AMBER_CSS })
  const pathB = makeCard(PATH, (ctx, w, h) =>
    drawPathCard(ctx, w, h, { letter: 'B', title: 'Flujo automatizado', sub: 'Formulario, hoja y borradores', accent: CYAN_CSS, icon: iconFlow }),
  { emissive: CYAN_CSS })
  const mesaChip = plane(2.0, 0.62, (ctx, w, h) => drawChip(ctx, w, h, 'Mesa', { fill: '#ffffff' }))
  mesaChip.position.set(0, MESA_Y, 0.4)
  const pathBeams = [makeBeam(AMBER, 0.8), makeBeam(CYAN, 0.8)]
  const pathRings = [makeShockRing(AMBER), makeShockRing(CYAN)]
  pathBeams.forEach((b) => scene.add(b))
  pathRings.forEach((r) => scene.add(r))

  /* ---------------- fase 1: artefacto de Claude ---------------- */
  const artifact = makeCard(ART, drawArtifact, { emissive: AMBER_CSS })
  const pickBar = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: flat, color: GREEN, transparent: true, depthWrite: false, toneMapped: false }),
  )
  pickBar.renderOrder = 4
  scene.add(pickBar)
  const linkChip = plane(4.4, 0.72, (ctx, w, h) => drawChip(ctx, w, h, 'Enlace al artefacto', { link: true }))
  const linkRing = makeShockRing(AMBER)
  const clickRing = makeShockRing(GREEN)
  scene.add(linkRing, clickRing)
  const cursor = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: makeCursorTexture(), transparent: true, depthWrite: false, depthTest: false }),
  )
  cursor.renderOrder = 20
  scene.add(cursor)

  /* ---------------- fase 2: formulario ---------------- */
  const form = makeCard(FORM, drawForm, { emissive: CYAN_CSS })
  const rows = [1, 2, 3, 4, 5, 6].map((n) => plane(ROW.w, ROW.h, (ctx, w, h) => drawQuestionRow(ctx, w, h, n)))
  const countChip = plane(2.8, 0.66, (ctx, w, h) => drawChip(ctx, w, h, '6 preguntas', { fill: CYAN_CSS }))
  countChip.position.set(0, 0.6, 0.4)

  /* ---------------- fase 3: Hark trabajando ---------------- */
  const hark = makeCard(HARK, drawHark, { emissive: CYAN_CSS })
  const harkGlow = addGlow(scene, glow, CYAN, 9, 0)
  harkGlow.position.set(0, HARK.y, -0.5)
  const NODES = [
    { name: 'Formulario', icon: iconForm, accent: AMBER_CSS, color: AMBER },
    { name: 'Hoja', icon: iconSheet, accent: CYAN_CSS, color: CYAN },
    { name: 'Borradores', icon: iconDraft, accent: GREEN_CSS, color: GREEN },
  ]
  const nodes = NODES.map((n) => {
    const card = makeCard(NODE, (ctx, w, h) => drawNode(ctx, w, h, n), { emissive: n.accent, radius: 0.14, depth: 0.08 })
    const ring = makeShockRing(n.color)
    scene.add(ring)
    return { ...n, card, ring }
  })
  const nodeBeams = [makeBeam(CYAN, 0.85), makeBeam(GREEN, 0.85)]
  nodeBeams.forEach((b) => scene.add(b))
  const shotFrame = plane(HARK.w + 0.5, HARK.h + 0.5, drawFrame, 7)
  shotFrame.position.set(0, HARK.y, 0.5)
  const flash = new THREE.Mesh(
    new THREE.PlaneGeometry(HARK.w, HARK.h),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
  )
  flash.renderOrder = 8
  flash.position.set(0, HARK.y, 0.45)
  scene.add(flash)
  const shotChip = plane(3.0, 0.66, (ctx, w, h) => drawChip(ctx, w, h, 'Pantallazo', { fill: GREEN_CSS }))
  shotChip.position.set(0, 0.6, 0.4)

  /* ---------------- fase 4: tres entregables y demo ---------------- */
  const title4 = plane(5.0, 0.7, (ctx, w, h) => drawChip(ctx, w, h, 'Tres entregables'))
  title4.position.set(0, 6.6, 0.3)
  const FINALS = [
    { kind: 'Enlace', title: 'Artefacto de Claude', accent: AMBER_CSS, color: AMBER, icon: (ctx, x, y, s) => iconLink(ctx, x + s / 2, y + s / 2, s * 0.8) },
    { kind: 'Formulario', title: 'Reflexión de unidad', accent: CYAN_CSS, color: CYAN, icon: iconForm },
    { kind: 'Pantallazo', title: 'Hark trabajando', accent: GREEN_CSS, color: GREEN, icon: iconShot },
  ]
  const finals = FINALS.map((f) => {
    const card = makeCard(FINAL, (ctx, w, h) => drawFinal(ctx, w, h, f), { emissive: f.accent })
    const beam = makeBeam(f.color, 0.7)
    scene.add(beam)
    return { ...f, card, beam }
  })
  const demoMat = new THREE.MeshStandardMaterial({ color: 0x0b3a7a, roughness: 0.5, metalness: 0.2, emissive: AMBER, emissiveIntensity: 0, transparent: true })
  const demo = new THREE.Mesh(new THREE.CylinderGeometry(DEMO.r, DEMO.r * 1.06, DEMO.h, 48), demoMat)
  demo.castShadow = true
  demo.receiveShadow = true
  scene.add(demo)
  const demoRim = new THREE.Mesh(
    new THREE.TorusGeometry(DEMO.r, 0.035, 8, 64),
    new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, depthWrite: false, toneMapped: false }),
  )
  demoRim.rotation.x = -Math.PI / 2
  scene.add(demoRim)
  const demoRing = makeShockRing(AMBER)
  demoRing.rotation.x = -Math.PI / 2
  scene.add(demoRing)
  const demoGlow = addGlow(scene, glow, AMBER, 5, 0)
  const demoLabel = plane(3.8, 0.72, (ctx, w, h) => drawChip(ctx, w, h, 'Demo, 2 minutos', { fill: NAVY, ink: AMBER_CSS }), 9)

  const pA = new THREE.Vector3()
  const pB = new THREE.Vector3()
  const pC = new THREE.Vector3()

  function place(card, x, y, z, s, opacity) {
    card.group.position.set(x, y, z)
    card.group.scale.setScalar(safeScale(s))
    setCardOpacity(card, opacity)
  }
  const enter = (T, a) => ({
    drop: (1 - smooth(seg(T, a, a + 0.5))) * 0.4,
    scale: lerp(0.94, 1, easeOutCubic(seg(T, a, a + 0.5))),
  })
  function beamTo(beam, a, b, k, opacity, radius = 0.035) {
    pC.copy(a).lerp(b, k)
    setBeam(beam, a, pC, radius)
    beam.material.opacity = opacity
    if (k < 0.001 || opacity < 0.01) beam.visible = false
  }

  function draw(t) {
    const T = t * AGENTES_ENTREGABLE_DURATION
    const events = []
    stage.update(T, 0)
    stage.spot.position.set(0, 4.6, 5.5)
    const op = [0, 1, 2, 3, 4].map((i) => phaseOpacity(T, i))

    /* ---------- fase 0: cada mesa elige un camino ---------- */
    shown(title0, op[0])
    title0.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 0.1, 0.6)))))
    shown(mesaChip, op[0] * smooth(seg(T, 0.2, 0.5)))
    ;[pathA, pathB].forEach((card, i) => {
      const a = 0.3 + i * 0.3
      const e = enter(T, a)
      const x = (i === 0 ? -1 : 1) * PATH.x
      place(card, x, PATH.y - e.drop, 0, e.scale, op[0] * smooth(seg(T, a, a + 0.4)))
      const b0 = 0.9 + i * 0.5
      pA.set(0, MESA_Y + 0.32, 0.3)
      pB.set(x * 0.92, PATH.y - PATH.h / 2, 0.3)
      beamTo(pathBeams[i], pA, pB, easeInOutCubic(seg(T, b0, b0 + 0.6)), 0.8 * op[0])
      const hit = b0 + 0.6
      flashCard(card, bump(seg(T, hit, hit + 0.8)) * 0.55)
      setShockRing(pathRings[i], T - hit, 0.9, 1.8)
      pathRings[i].position.set(x, PATH.y, 0.3)
      if (T >= hit && T < hit + 1) events.push({ t: hit, x: x * 0.92, y: PATH.y - PATH.h / 2, z: 0.8, color: i === 0 ? amberColor : cyanColor, speed: 1.6, life: 0.9 })
    })

    /* ---------- fase 1: Camino A, el enlace al artefacto ---------- */
    const e1 = enter(T, 3.3)
    place(artifact, 0, ART.y - e1.drop, 0, e1.scale, op[1])
    const optX = (0.09 - 0.5) * ART.w
    const optY = artY(OPTION_V[PICK])
    const CLICK = 4.6
    const cMove = easeInOutCubic(seg(T, 3.9, 4.5))
    const clickK = bump(seg(T, CLICK, CLICK + 0.25))
    const cx = lerp(2.6, optX + 0.6, cMove)
    const cy = lerp(0.9, optY, cMove) - clickK * 0.06
    cursor.position.set(cx + 0.31, cy - 0.41, 1.6)
    cursor.scale.setScalar(1 - clickK * 0.1)
    cursor.material.opacity = op[1] * smooth(seg(T, 3.8, 4.0)) * (1 - smooth(seg(T, 5.0, 5.3)))
    cursor.visible = cursor.material.opacity > 0.01
    const pickK = easeOutCubic(seg(T, CLICK, CLICK + 0.35))
    const pickW = ART.w * 0.88 * pickK
    pickBar.position.set(-ART.w * 0.44 + pickW / 2, optY - e1.drop, 0.12)
    pickBar.scale.set(safeScale(pickW), ART.h * 0.1, 1)
    shown(pickBar, op[1] * 0.4 * smooth(seg(T, CLICK, CLICK + 0.1)))
    setShockRing(clickRing, T - CLICK, 0.8, 0.9)
    clickRing.position.set(optX + 0.6, optY, 1.5)
    flashCard(artifact, bump(seg(T, CLICK, CLICK + 0.7)) * 0.35 + bump(seg(T, 5.1, 5.8)) * 0.35)
    if (T >= CLICK && T < CLICK + 1) events.push({ t: CLICK, x: optX + 0.6, y: optY, z: 1.2, color: greenColor, speed: 1.3, life: 0.8 })
    const linkK = easeOutBack(seg(T, 5.1, 5.6))
    linkChip.position.set(0, lerp(artY(0.9), 0.75, easeOutCubic(seg(T, 5.1, 5.6))), 0.6)
    linkChip.scale.setScalar(safeScale(lerp(0.6, 1, linkK)))
    shown(linkChip, op[1] * smooth(seg(T, 5.1, 5.3)))
    setShockRing(linkRing, T - 5.6, 1.0, 2.6)
    linkRing.position.set(0, 0.75, 0.5)
    if (T >= 5.6 && T < 6.5) events.push({ t: 5.6, x: 0, y: 0.75, z: 0.9, color: amberColor, speed: 2.0, life: 0.9 })

    /* ---------- fase 2: Camino B, el formulario ---------- */
    const e2 = enter(T, 6.5)
    const formY = FORM.y - e2.drop
    place(form, 0, formY, 0, e2.scale, op[2])
    const rowTop = formY + FORM.h / 2 - 1.42
    rows.forEach((row, i) => {
      const a = 7.0 + i * 0.28
      const k = easeOutCubic(seg(T, a, a + 0.4))
      row.position.set(lerp(-0.8, 0, k), rowTop - i * ROW.gap, 0.14)
      shown(row, op[2] * smooth(seg(T, a, a + 0.2)))
      if (T >= a + 0.2 && T < a + 1) events.push({ t: a + 0.2, x: -ROW.w / 2 + 0.25, y: rowTop - i * ROW.gap, z: 0.6, color: amberColor, speed: 0.9, life: 0.6 })
    })
    flashCard(form, bump(seg(T, 8.6, 9.3)) * 0.45)
    countChip.scale.setScalar(safeScale(lerp(0.85, 1, easeOutBack(seg(T, 8.7, 9.2)))))
    shown(countChip, op[2] * smooth(seg(T, 8.7, 9.0)))

    /* ---------- fase 3: pantallazo de Hark trabajando ---------- */
    const e3 = enter(T, 9.7)
    place(hark, 0, HARK.y - e3.drop, 0, e3.scale, op[3])
    harkGlow.material.opacity = op[3] * 0.35 * (0.85 + 0.15 * Math.sin(T * 3))
    nodes.forEach((node, i) => {
      const a = 10.2 + i * 0.55
      const k = easeOutBack(seg(T, a, a + 0.45))
      place(node.card, NODE_X[i], NODE.y - e3.drop, 0.2, k, op[3] * smooth(seg(T, a, a + 0.2)))
      flashCard(node.card, bump(seg(T, a + 0.2, a + 0.9)) * 0.6)
      setShockRing(node.ring, T - (a + 0.25), 0.8, 1.2)
      node.ring.position.set(NODE_X[i], NODE.y, 0.4)
      if (T >= a + 0.2 && T < a + 1) events.push({ t: a + 0.2, x: NODE_X[i], y: NODE.y, z: 0.8, color: new THREE.Color(node.color), speed: 1.3, life: 0.8 })
      if (i > 0) {
        const b0 = a - 0.3
        pA.set(NODE_X[i - 1] + NODE.w / 2, NODE.y, 0.3)
        pB.set(NODE_X[i] - NODE.w / 2, NODE.y, 0.3)
        beamTo(nodeBeams[i - 1], pA, pB, easeInOutCubic(seg(T, b0, b0 + 0.3)), 0.85 * op[3], 0.04)
      }
    })
    const SHOT = 12.0
    const frameK = smooth(seg(T, 11.75, 11.95))
    shotFrame.scale.setScalar(safeScale(lerp(1.06, 1, easeOutCubic(seg(T, 11.75, SHOT)))))
    shown(shotFrame, op[3] * frameK * 0.9)
    shown(flash, op[3] * bump(seg(T, SHOT, SHOT + 0.3)) * 0.55)
    shotChip.scale.setScalar(safeScale(lerp(0.85, 1, easeOutBack(seg(T, SHOT, SHOT + 0.4)))))
    shown(shotChip, op[3] * smooth(seg(T, SHOT, SHOT + 0.2)))
    if (T >= SHOT && T < SHOT + 0.8) events.push({ t: SHOT, x: 0, y: 0.6, z: 0.9, color: greenColor, speed: 1.8, life: 0.8 })

    /* ---------- fase 4: los tres entregables y la demo ---------- */
    shown(title4, op[4])
    title4.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 12.9, 13.4)))))
    finals.forEach((f, i) => {
      const a = 12.9 + i * 0.3
      const k = easeOutBack(seg(T, a, a + 0.5))
      place(f.card, FINAL_X[i], FINAL.y, 0, k, op[4] * smooth(seg(T, a, a + 0.25)))
      flashCard(f.card, bump(seg(T, a + 0.3, a + 1.0)) * 0.45 + bump(seg(T, 14.8, 15.5)) * 0.3)
      const b0 = 14.0 + i * 0.12
      pA.set(FINAL_X[i] * 0.95, FINAL.y - FINAL.h / 2, 0.3)
      pB.set(DEMO.x + (i - 1) * 0.9, DEMO.y + DEMO.h / 2 + 0.05, DEMO.z)
      beamTo(f.beam, pA, pB, easeInOutCubic(seg(T, b0, b0 + 0.5)), 0.7 * op[4])
      if (T >= a + 0.3 && T < a + 1.1) events.push({ t: a + 0.3, x: FINAL_X[i], y: FINAL.y, z: 0.8, color: new THREE.Color(f.color), speed: 1.4, life: 0.8 })
    })
    const demoK = easeOutBack(seg(T, 13.7, 14.2))
    const demoOp = op[4] * smooth(seg(T, 13.7, 13.95))
    demo.position.set(DEMO.x, DEMO.y, DEMO.z)
    demo.scale.set(safeScale(demoK), 1, safeScale(demoK))
    demoMat.opacity = demoOp
    demoMat.emissiveIntensity = 0.15 + bump(seg(T, 14.6, 15.4)) * 0.35
    demo.visible = demoOp > 0.01
    demoRim.position.set(DEMO.x, DEMO.y + DEMO.h / 2 + 0.01, DEMO.z)
    demoRim.scale.setScalar(safeScale(demoK))
    shown(demoRim, demoOp)
    setShockRing(demoRing, T - 14.6, 1.1, DEMO.r * 1.5)
    demoRing.position.set(DEMO.x, DEMO.y + DEMO.h / 2 + 0.02, DEMO.z)
    demoGlow.position.set(DEMO.x, DEMO.y + 0.8, DEMO.z - 0.2)
    demoGlow.material.opacity = demoOp * 0.45 * (0.85 + 0.15 * Math.sin(T * 4))
    const labelK = easeOutBack(seg(T, 14.3, 14.8))
    demoLabel.position.set(DEMO.x, DEMO.y + 1.05, DEMO.z + 0.9)
    demoLabel.scale.setScalar(safeScale(lerp(0.7, 1, labelK)))
    shown(demoLabel, op[4] * smooth(seg(T, 14.3, 14.55)))
    if (T >= 14.6 && T < 15.6) events.push({ t: 14.6, x: DEMO.x, y: DEMO.y + 0.6, z: DEMO.z + 0.5, color: amberColor, speed: 2.0, life: 1.0 })

    bursts.update(T, events)
    return Math.min(4, Math.floor(T / PHASE))
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize: stage.resize, dispose }
}
