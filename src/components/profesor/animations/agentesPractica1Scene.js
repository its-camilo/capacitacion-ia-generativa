import * as THREE from 'three'
import { bump, easeInOutCubic, easeOutBack, easeOutCubic, lerp, roundRectPath, seg, smooth } from './threeKit'
import {
  FONT_BODY,
  FONT_MONO,
  createBurstSystem,
  createStage,
  fitText,
  flashCard,
  makeArcTube,
  makeBeam,
  makeCursorTexture,
  makeShockRing,
  makeSlabCard,
  makeTex,
  makeTextPlane,
  safeScale,
  setArcProgress,
  setBeam,
  setCardOpacity,
  setShockRing,
  window01,
} from './stageKit'

/**
 * Escena “Ver un agente trabajar” (Sesión 4, Práctica 1: demo de Deep Research).
 * Loop de 16 s en 5 fases de 3,2 s:
 *   0 la ruta real: botón +, Más herramientas y Deep Research, con la cuenta @unal ·
 *   1 aparece el plan de investigación con tres pasos ·
 *   2 Modificar plan acota las fuentes de 80 sitios a 12 sitios ·
 *   3 la investigación corre: reloj de 30 a 60 minutos y barra de progreso ·
 *   4 dos fuentes verificadas (OpenStax y DANE), un vacío anotado e informe guardado.
 * `draw(t)` es una función pura del tiempo dentro del loop.
 */
export const AGENTES_PRACTICA1_DURATION = 16

const AMBER = 0xf4cb18
const CYAN = 0x7fdcff
const GREEN = 0x3be09a

const PY = 3.1
const PHASE = 3.2
const TEX_PER_UNIT = 150

/* paso 0: compositor, menú y submenú */
const COMPOSER = { x: 0, y: 1.3, w: 7.6, h: 1.3 }
const MENU = { x: -2.4, y: 4.1, w: 3.8, h: 2.4 }
const SUBMENU = { x: 1.7, y: 4.1, w: 3.8, h: 2.4 }
const MENU_ROWS_V = [0.3, 0.55, 0.8]
const MENU_ITEMS = ['Subir archivos', 'Agregar desde Drive', 'Más herramientas']
const SUB_ITEMS = ['Deep Research', 'Canvas', 'Crear imágenes']
const PLUS_U = 0.07
const ACCOUNT = { x: 4.3, y: 6.7, w: 3.0, h: 0.7 }

/* pasos 1 y 2: plan y contador de fuentes */
const PLAN = { x: 0, y: PY, w: 7.0, h: 4.6 }
const PLAN_X2 = -1.75
const PLAN_S2 = 0.86
const PLAN_STEPS = ['Investigar sitios web', 'Analizar resultados', 'Crear informe']
const PLAN_ROWS_V = [0.4, 0.56, 0.72]
const BTN_EDIT = { u: 0.25, v: 0.885, w: 0.36, h: 0.11 }
const BTN_START = { u: 0.7, v: 0.885, w: 0.46, h: 0.11 }
const COUNTER = { x: 4.3, y: PY, w: 3.4, h: 3.2 }

/* paso 3: investigación y reloj */
const RESEARCH = { x: -1.7, y: PY, w: 6.6, h: 4.4 }
const SITES = ['openstax.org', 'dane.gov.co', 'banrep.gov.co']
const SITE_ROWS_V = [0.36, 0.5, 0.64]
const CLOCK = { x: 4.3, y: PY, w: 3.2, h: 3.8 }
const DIAL_Y = 0.35
const DIAL_R = 1.05

/* paso 4: revisión e informe */
const REPORT = { x: -1.8, y: PY, w: 6.8, h: 4.4 }
const REPORT_ROWS_V = [0.36, 0.53, 0.72]
const SAVED = { x: 4.4, y: PY, w: 3.3, h: 2.4 }

/* coordenadas (u, v) de una tarjeta → mundo, con traslado y escala */
const wx = (box, u, x = box.x, s = 1) => x + (u - 0.5) * box.w * s
const wy = (box, v, y = box.y, s = 1) => y + (0.5 - v) * box.h * s
/* coordenadas (u, v) → locales del grupo de la tarjeta */
const lx = (box, u) => (u - 0.5) * box.w
const ly = (box, v) => (0.5 - v) * box.h

/* cursor: fotogramas clave [tiempo, x, y] y clics */
const CLICK_PLUS = 0.7
const CLICK_MORE = 1.45
const CLICK_DR = 2.2
const CLICK_EDIT = 7.4
const CLICK_START = 8.9
const PLUS_POS = [wx(COMPOSER, PLUS_U), wy(COMPOSER, 0.5)]
const MORE_POS = [wx(MENU, 0.5), wy(MENU, MENU_ROWS_V[2])]
const DR_POS = [wx(SUBMENU, 0.5), wy(SUBMENU, MENU_ROWS_V[0])]
const EDIT_POS = [wx(PLAN, BTN_EDIT.u, PLAN_X2, PLAN_S2), wy(PLAN, BTN_EDIT.v, PLAN.y, PLAN_S2)]
const START_POS = [wx(PLAN, BTN_START.u, PLAN_X2, PLAN_S2), wy(PLAN, BTN_START.v, PLAN.y, PLAN_S2)]
const CURSOR_PATH = [
  [0.2, 1.6, -0.2],
  [0.62, PLUS_POS[0], PLUS_POS[1]],
  [0.8, PLUS_POS[0], PLUS_POS[1]],
  [1.35, MORE_POS[0], MORE_POS[1]],
  [1.55, MORE_POS[0], MORE_POS[1]],
  [2.1, DR_POS[0], DR_POS[1]],
  [2.9, DR_POS[0], DR_POS[1]],
  [6.6, 1.4, -0.3],
  [7.3, EDIT_POS[0], EDIT_POS[1]],
  [8.0, EDIT_POS[0], EDIT_POS[1]],
  [8.8, START_POS[0], START_POS[1]],
  [9.5, START_POS[0], START_POS[1]],
]
const CLICKS = [
  { t: CLICK_PLUS, pos: PLUS_POS, color: CYAN },
  { t: CLICK_MORE, pos: MORE_POS, color: CYAN },
  { t: CLICK_DR, pos: DR_POS, color: AMBER },
  { t: CLICK_EDIT, pos: EDIT_POS, color: AMBER },
  { t: CLICK_START, pos: START_POS, color: GREEN },
]

function cursorAt(T) {
  const first = CURSOR_PATH[0]
  if (T <= first[0]) return { x: first[1], y: first[2] }
  for (let i = 1; i < CURSOR_PATH.length; i += 1) {
    const a = CURSOR_PATH[i - 1]
    const b = CURSOR_PATH[i]
    if (T <= b[0]) {
      const k = easeInOutCubic(seg(T, a[0], b[0]))
      return { x: lerp(a[1], b[1], k), y: lerp(a[2], b[2], k) }
    }
  }
  const last = CURSOR_PATH[CURSOR_PATH.length - 1]
  return { x: last[1], y: last[2] }
}

function phaseOpacity(T, i) {
  const a = i * PHASE
  const b = a + PHASE
  return smooth(seg(T, a + 0.1, a + 0.5)) * (1 - smooth(seg(T, b - 0.35, b)))
}

/* ------------------------------------------------------------------ */
/* Texturas                                                            */
/* ------------------------------------------------------------------ */

function header(ctx, w, h, title, color = '#042361', band = 0.14) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = color
  ctx.fillRect(0, 0, w, h * band)
  fitText(ctx, title, w * 0.05, h * band * 0.7, { weight: 800, size: h * band * 0.52, maxWidth: w * 0.9, color: '#ffffff' })
}

function line(ctx, x, y, width, height = 12, color = 'rgba(4,35,97,0.2)') {
  ctx.fillStyle = color
  roundRectPath(ctx, x, y, width, height, height / 2)
  ctx.fill()
}

function drawChip(ctx, w, h, text, fill, ink = '#042361') {
  ctx.fillStyle = fill
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fill()
  fitText(ctx, text, w / 2, h * 0.67, { weight: 800, size: h * 0.46, maxWidth: w * 0.9, color: ink, align: 'center' })
}

function drawAccount(ctx, w, h) {
  ctx.fillStyle = 'rgba(4,35,97,0.92)'
  ctx.strokeStyle = '#7fdcff'
  ctx.lineWidth = 4
  roundRectPath(ctx, 2, 2, w - 4, h - 4, (h - 4) / 2)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#3be09a'
  ctx.beginPath()
  ctx.arc(h * 0.5, h * 0.5, h * 0.32, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, 'U', h * 0.5, h * 0.66, { weight: 800, size: h * 0.4, color: '#042361', align: 'center' })
  fitText(ctx, 'cuenta @unal', h * 0.98, h * 0.66, { weight: 800, size: h * 0.42, maxWidth: w - h * 1.15, color: '#ffffff' })
}

function drawComposer(ctx, w, h) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#042361'
  const cx = w * PLUS_U
  const cy = h * 0.5
  ctx.beginPath()
  ctx.arc(cx, cy, h * 0.3, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = h * 0.07
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx - h * 0.14, cy)
  ctx.lineTo(cx + h * 0.14, cy)
  ctx.moveTo(cx, cy - h * 0.14)
  ctx.lineTo(cx, cy + h * 0.14)
  ctx.stroke()
  fitText(ctx, 'Escriba su tema de investigación…', w * 0.39, h * 0.6, { weight: 500, size: h * 0.24, family: FONT_BODY, maxWidth: w * 0.5, color: 'rgba(4,35,97,0.5)' })
  ctx.fillStyle = 'rgba(4,35,97,0.12)'
  ctx.beginPath()
  ctx.arc(w * 0.94, cy, h * 0.27, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#042361'
  ctx.beginPath()
  ctx.moveTo(w * 0.94 - h * 0.1, cy + h * 0.11)
  ctx.lineTo(w * 0.94, cy - h * 0.13)
  ctx.lineTo(w * 0.94 + h * 0.1, cy + h * 0.11)
  ctx.closePath()
  ctx.fill()
}

function drawMenu(ctx, w, h, items, title) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  fitText(ctx, title, w * 0.07, h * 0.13, { weight: 700, size: h * 0.075, family: FONT_BODY, maxWidth: w * 0.86, color: 'rgba(4,35,97,0.55)' })
  items.forEach((item, i) => {
    const v = MENU_ROWS_V[i]
    ctx.fillStyle = ['#7fdcff', '#3be09a', '#f4cb18'][i]
    roundRectPath(ctx, w * 0.07, h * (v - 0.07), h * 0.14, h * 0.14, h * 0.04)
    ctx.fill()
    fitText(ctx, item, w * 0.07 + h * 0.22, h * (v + 0.035), { weight: 700, size: h * 0.095, maxWidth: w * 0.7, color: '#042361' })
  })
}

function drawPlan(ctx, w, h) {
  header(ctx, w, h, 'Plan de investigación', '#042361', 0.13)
  fitText(ctx, 'Tema: Oferta, demanda y equilibrio · Microeconomía I', w * 0.06, h * 0.24, { weight: 700, size: h * 0.05, family: FONT_BODY, maxWidth: w * 0.88, color: 'rgba(4,35,97,0.75)' })
  line(ctx, w * 0.06, h * 0.29, w * 0.88, 3, 'rgba(4,35,97,0.12)')
  drawButton(ctx, w, h, BTN_EDIT, 'Modificar plan', '#e3e9f6', '#042361')
  drawButton(ctx, w, h, BTN_START, 'Empezar la investigación', '#042361', '#ffffff')
}

function drawButton(ctx, w, h, b, text, fill, ink) {
  ctx.fillStyle = fill
  roundRectPath(ctx, w * (b.u - b.w / 2), h * (b.v - b.h / 2), w * b.w, h * b.h, h * b.h * 0.5)
  ctx.fill()
  fitText(ctx, text, w * b.u, h * (b.v + 0.018), { weight: 800, size: h * 0.048, maxWidth: w * b.w * 0.88, color: ink, align: 'center' })
}

function drawStepRow(ctx, w, h, index, text) {
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(4,35,97,0.16)'
  ctx.lineWidth = 4
  roundRectPath(ctx, 3, 3, w - 6, h - 6, h * 0.25)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#f4cb18'
  ctx.beginPath()
  ctx.arc(h * 0.55, h / 2, h * 0.3, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, String(index + 1), h * 0.55, h * 0.64, { weight: 800, size: h * 0.38, color: '#042361', align: 'center' })
  fitText(ctx, text, h * 1.1, h * 0.64, { weight: 800, size: h * 0.38, maxWidth: w * 0.55, color: '#042361' })
  line(ctx, w * 0.68, h * 0.44, w * 0.27, 12)
}

function drawCounter(ctx, w, h) {
  header(ctx, w, h, 'Fuentes', '#34425f', 0.16)
  fitText(ctx, 'sitios a consultar', w * 0.5, h * 0.3, { weight: 600, size: h * 0.07, family: FONT_BODY, maxWidth: w * 0.86, color: 'rgba(4,35,97,0.65)', align: 'center' })
}

function drawResearch(ctx, w, h) {
  header(ctx, w, h, 'Deep Research · investigando', '#042361', 0.13)
  fitText(ctx, 'Consultando 12 sitios según el plan', w * 0.06, h * 0.24, { weight: 600, size: h * 0.05, family: FONT_BODY, maxWidth: w * 0.88, color: 'rgba(4,35,97,0.7)' })
  fitText(ctx, 'Progreso', w * 0.07, h * 0.8, { weight: 700, size: h * 0.045, family: FONT_BODY, maxWidth: w * 0.4, color: 'rgba(4,35,97,0.6)' })
  ctx.fillStyle = '#7fdcff'
  ctx.beginPath()
  ctx.arc(w * 0.9, h * 0.065, h * 0.03, 0, Math.PI * 2)
  ctx.fill()
}

function drawSiteRow(ctx, w, h, site) {
  ctx.fillStyle = '#eaf6ff'
  roundRectPath(ctx, 0, 0, w, h, h * 0.25)
  ctx.fill()
  ctx.strokeStyle = '#2b8fd6'
  ctx.lineWidth = h * 0.07
  ctx.beginPath()
  ctx.arc(h * 0.5, h / 2, h * 0.24, 0, Math.PI * 2)
  ctx.moveTo(h * 0.26, h / 2)
  ctx.lineTo(h * 0.74, h / 2)
  ctx.moveTo(h * 0.5, h * 0.26)
  ctx.quadraticCurveTo(h * 0.32, h / 2, h * 0.5, h * 0.74)
  ctx.moveTo(h * 0.5, h * 0.26)
  ctx.quadraticCurveTo(h * 0.68, h / 2, h * 0.5, h * 0.74)
  ctx.stroke()
  fitText(ctx, site, h * 0.95, h * 0.63, { weight: 700, size: h * 0.38, family: FONT_MONO, maxWidth: w * 0.45, color: '#042361' })
  line(ctx, w * 0.6, h * 0.42, w * 0.32, 12, 'rgba(4,35,97,0.16)')
}

function drawClock(ctx, w, h) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  fitText(ctx, 'Tiempo estimado', w / 2, h * 0.09, { weight: 700, size: h * 0.055, family: FONT_BODY, maxWidth: w * 0.86, color: 'rgba(4,35,97,0.65)', align: 'center' })
  const cx = w / 2
  const cy = h * (0.5 - DIAL_Y / CLOCK.h)
  const r = DIAL_R * TEX_PER_UNIT
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = '#042361'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  // franja de 30 a 60 minutos (de las 6 a las 12 en la esfera)
  ctx.fillStyle = 'rgba(244,203,24,0.35)'
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.arc(cx, cy, r - 6, Math.PI / 2, Math.PI * 1.5)
  ctx.closePath()
  ctx.fill()
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2
    const inner = i % 3 === 0 ? r * 0.78 : r * 0.86
    ctx.strokeStyle = '#042361'
    ctx.lineWidth = i % 3 === 0 ? 6 : 3
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner)
    ctx.lineTo(cx + Math.cos(a) * (r - 8), cy + Math.sin(a) * (r - 8))
    ctx.stroke()
  }
  fitText(ctx, '30', cx, cy + r * 0.62, { weight: 800, size: r * 0.2, color: '#042361', align: 'center' })
  fitText(ctx, '60', cx, cy - r * 0.48, { weight: 800, size: r * 0.2, color: '#042361', align: 'center' })
  fitText(ctx, '30 a 60 minutos', w / 2, h * 0.9, { weight: 800, size: h * 0.07, maxWidth: w * 0.9, color: '#042361', align: 'center' })
}

function drawReport(ctx, w, h) {
  header(ctx, w, h, 'Informe · revisión de fuentes', '#1f8a5b', 0.13)
  fitText(ctx, 'Abra cada fuente y confirme el dato antes de usarlo', w * 0.06, h * 0.24, { weight: 600, size: h * 0.048, family: FONT_BODY, maxWidth: w * 0.88, color: 'rgba(4,35,97,0.7)' })
}

function drawSourceRow(ctx, w, h, name, detail) {
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(31,138,91,0.45)'
  ctx.lineWidth = 4
  roundRectPath(ctx, 3, 3, w - 6, h - 6, h * 0.22)
  ctx.fill()
  ctx.stroke()
  fitText(ctx, name, w * 0.04, h * 0.62, { weight: 800, size: h * 0.38, maxWidth: w * 0.3, color: '#042361' })
  fitText(ctx, detail, w * 0.3, h * 0.62, { weight: 500, size: h * 0.3, family: FONT_BODY, maxWidth: w * 0.55, color: 'rgba(4,35,97,0.7)' })
}

function drawGapRow(ctx, w, h) {
  ctx.fillStyle = '#fff3c4'
  ctx.strokeStyle = '#f4cb18'
  ctx.lineWidth = 5
  roundRectPath(ctx, 3, 3, w - 6, h - 6, h * 0.22)
  ctx.fill()
  ctx.stroke()
  // lápiz
  ctx.save()
  ctx.translate(h * 0.5, h * 0.5)
  ctx.rotate(-Math.PI / 4)
  ctx.fillStyle = '#042361'
  ctx.fillRect(-h * 0.26, -h * 0.07, h * 0.4, h * 0.14)
  ctx.beginPath()
  ctx.moveTo(h * 0.14, -h * 0.07)
  ctx.lineTo(h * 0.26, 0)
  ctx.lineTo(h * 0.14, h * 0.07)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
  fitText(ctx, 'Vacío anotado:', h * 0.95, h * 0.62, { weight: 800, size: h * 0.36, maxWidth: w * 0.3, color: '#042361' })
  fitText(ctx, 'faltan ejemplos aplicados a Colombia', w * 0.42, h * 0.62, { weight: 600, size: h * 0.32, family: FONT_BODY, maxWidth: w * 0.54, color: 'rgba(4,35,97,0.8)' })
}

function drawSaved(ctx, w, h) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#1f8a5b'
  ctx.fillRect(0, 0, w, h * 0.06)
  drawCheck(ctx, w * 0.5, h * 0.36, h * 0.18)
  fitText(ctx, 'Informe guardado', w / 2, h * 0.7, { weight: 800, size: h * 0.12, maxWidth: w * 0.88, color: '#042361', align: 'center' })
  fitText(ctx, 'En su cuenta @unal', w / 2, h * 0.86, { weight: 600, size: h * 0.075, family: FONT_BODY, maxWidth: w * 0.88, color: 'rgba(4,35,97,0.65)', align: 'center' })
}

function drawCheck(ctx, cx, cy, r) {
  ctx.fillStyle = '#3be09a'
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#042361'
  ctx.lineWidth = r * 0.28
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(cx - r * 0.44, cy + r * 0.04)
  ctx.lineTo(cx - r * 0.12, cy + r * 0.36)
  ctx.lineTo(cx + r * 0.48, cy - r * 0.32)
  ctx.stroke()
}

const plainTex = (invalidate) =>
  makeTex(16, 16, (ctx, w, h) => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, w, h)
  }, invalidate)

/* ------------------------------------------------------------------ */

export default function createAgentesPractica1Scene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: AGENTES_PRACTICA1_DURATION,
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
      texture: makeTex(Math.round(size.w * TEX_PER_UNIT), Math.round(size.h * TEX_PER_UNIT), draw, invalidate),
      ...extra,
    })
    scene.add(card.group)
    return card
  }

  const flat = plainTex(invalidate)
  const makeBar = (color, parent = scene) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: flat, color, transparent: true, depthWrite: false, toneMapped: false }),
    )
    mesh.renderOrder = 4
    parent.add(mesh)
    return mesh
  }
  const plane = (w, h, draw, parent = scene, order = 5) => {
    const mesh = makeTextPlane(w, h, makeTex(Math.round(w * 200), Math.round(h * 200), draw, invalidate))
    mesh.renderOrder = order
    parent.add(mesh)
    return mesh
  }
  const shown = (obj, k) => {
    obj.material.opacity = k
    obj.visible = k > 0.01
  }
  const checkPlane = (parent) => plane(0.56, 0.56, (ctx, w, h) => drawCheck(ctx, w / 2, h / 2, w / 2 - 3), parent, 6)
  const beam = (color) => {
    const mesh = makeBeam(color, 0.8)
    scene.add(mesh)
    return mesh
  }

  /* ---------------- paso 0: ruta real ---------------- */
  const composer = makeCard(COMPOSER, drawComposer, { radius: 0.4, emissive: '#7fdcff' })
  const menu = makeCard(MENU, (ctx, w, h) => drawMenu(ctx, w, h, MENU_ITEMS, 'Botón +'), { emissive: '#7fdcff' })
  const submenu = makeCard(SUBMENU, (ctx, w, h) => drawMenu(ctx, w, h, SUB_ITEMS, 'Más herramientas'), { emissive: '#f4cb18' })
  const zFace = composer.thickness / 2 + 0.02
  const moreBar = makeBar(CYAN, menu.group)
  moreBar.position.set(0, ly(MENU, MENU_ROWS_V[2]), zFace)
  moreBar.scale.set(MENU.w - 0.3, 0.5, 1)
  const drBar = makeBar(AMBER, submenu.group)
  drBar.position.set(0, ly(SUBMENU, MENU_ROWS_V[0]), zFace)
  drBar.scale.set(SUBMENU.w - 0.3, 0.5, 1)
  const drChip = plane(2.3, 0.56, (ctx, w, h) => drawChip(ctx, w, h, 'Deep Research', '#f4cb18'), composer.group, 6)
  drChip.position.set(lx(COMPOSER, 0.2), 0, zFace + 0.01)
  const account = plane(ACCOUNT.w, ACCOUNT.h, drawAccount)
  const accountRing = makeShockRing(CYAN)
  scene.add(accountRing)

  /* ---------------- pasos 1 y 2: plan ---------------- */
  const plan = makeCard(PLAN, drawPlan, { emissive: '#7fdcff' })
  const stepRows = PLAN_STEPS.map((text, i) => {
    const mesh = plane(PLAN.w * 0.88, 0.56, (ctx, w, h) => drawStepRow(ctx, w, h, i, text), plan.group)
    return mesh
  })
  const editGlow = makeBar(AMBER, plan.group)
  editGlow.position.set(lx(PLAN, BTN_EDIT.u), ly(PLAN, BTN_EDIT.v), zFace - 0.01)
  editGlow.scale.set(PLAN.w * BTN_EDIT.w + 0.22, PLAN.h * BTN_EDIT.h + 0.2, 1)
  editGlow.renderOrder = 3
  const startGlow = makeBar(GREEN, plan.group)
  startGlow.position.set(lx(PLAN, BTN_START.u), ly(PLAN, BTN_START.v), zFace - 0.01)
  startGlow.scale.set(PLAN.w * BTN_START.w + 0.22, PLAN.h * BTN_START.h + 0.2, 1)
  startGlow.renderOrder = 3
  const scopeChip = plane(5.2, 0.62, (ctx, w, h) => drawChip(ctx, w, h, 'Plan acotado: fuentes abiertas y oficiales', '#f4cb18'))

  const counter = makeCard(COUNTER, drawCounter, { emissive: '#3be09a' })
  const num80 = plane(2.8, 0.9, (ctx, w, h) => fitText(ctx, '80 sitios', w / 2, h * 0.76, { weight: 800, size: h * 0.7, maxWidth: w * 0.96, color: '#2b8fd6', align: 'center' }), counter.group)
  const num12 = plane(2.8, 0.9, (ctx, w, h) => fitText(ctx, '12 sitios', w / 2, h * 0.76, { weight: 800, size: h * 0.7, maxWidth: w * 0.96, color: '#1f8a5b', align: 'center' }), counter.group)
  const COUNTER_BAR_W = COUNTER.w - 0.6
  const counterTrack = makeBar(0xdbe3f2, counter.group)
  counterTrack.position.set(0, ly(COUNTER, 0.8), zFace)
  counterTrack.scale.set(COUNTER_BAR_W, 0.22, 1)
  const counterFill = makeBar(CYAN, counter.group)
  counterFill.renderOrder = 5
  const editBeam = beam(AMBER)

  /* ---------------- paso 3: investigación ---------------- */
  const research = makeCard(RESEARCH, drawResearch, { emissive: '#7fdcff' })
  const siteRows = SITES.map((site, i) => {
    const mesh = plane(RESEARCH.w * 0.88, 0.5, (ctx, w, h) => drawSiteRow(ctx, w, h, site), research.group)
    mesh.position.set(0, ly(RESEARCH, SITE_ROWS_V[i]), zFace)
    return mesh
  })
  const siteBeams = SITES.map(() => beam(CYAN))
  const BAR_W = RESEARCH.w * 0.86
  const progTrack = makeBar(0xdbe3f2, research.group)
  progTrack.position.set(0, ly(RESEARCH, 0.88), zFace)
  progTrack.scale.set(BAR_W, 0.22, 1)
  const progFill = makeBar(CYAN, research.group)
  progFill.renderOrder = 5

  const clock = makeCard(CLOCK, drawClock, { emissive: '#f4cb18' })
  const dial = new THREE.Group()
  dial.position.set(0, DIAL_Y, zFace + 0.01)
  clock.group.add(dial)
  const hand = new THREE.Group()
  dial.add(hand)
  const handBar = makeBar(0x042361, hand)
  handBar.scale.set(0.07, DIAL_R * 0.8, 1)
  handBar.position.set(0, DIAL_R * 0.4, 0.01)
  handBar.renderOrder = 6
  const hub = makeBar(AMBER, dial)
  hub.scale.set(0.16, 0.16, 1)
  hub.position.z = 0.02
  hub.renderOrder = 7
  const arcPoints = []
  for (let i = 0; i <= 64; i += 1) {
    const a = Math.PI / 2 - (i / 64) * Math.PI * 2
    arcPoints.push(new THREE.Vector3(Math.cos(a) * (DIAL_R + 0.13), Math.sin(a) * (DIAL_R + 0.13), 0))
  }
  const arc = makeArcTube(new THREE.CatmullRomCurve3(arcPoints), 0.045, CYAN, 0.9, 64)
  dial.add(arc)

  /* ---------------- paso 4: revisión e informe ---------------- */
  const report = makeCard(REPORT, drawReport, { emissive: '#3be09a' })
  const sourceRows = [
    ['OpenStax', 'Libro abierto de economía'],
    ['DANE', 'Datos oficiales de Colombia'],
  ].map(([name, detail], i) => {
    const mesh = plane(REPORT.w * 0.88, 0.62, (ctx, w, h) => drawSourceRow(ctx, w, h, name, detail), report.group)
    mesh.position.set(0, ly(REPORT, REPORT_ROWS_V[i]), zFace)
    return mesh
  })
  const checks = sourceRows.map((row, i) => {
    const mesh = checkPlane(report.group)
    mesh.position.set(lx(REPORT, 0.88), ly(REPORT, REPORT_ROWS_V[i]), zFace + 0.02)
    return mesh
  })
  const gapRow = plane(REPORT.w * 0.88, 0.62, drawGapRow, report.group)
  gapRow.position.set(0, ly(REPORT, REPORT_ROWS_V[2]), zFace)
  const saved = makeCard(SAVED, drawSaved, { edge: '#3be09a', emissive: '#3be09a' })
  const saveBeam = beam(GREEN)
  const savedRing = makeShockRing(GREEN)
  scene.add(savedRing)
  const checkRings = checks.map(() => {
    const ring = makeShockRing(GREEN)
    scene.add(ring)
    return ring
  })

  /* ---------------- cursor y clics ---------------- */
  const cursor = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: makeCursorTexture(), transparent: true, depthWrite: false, depthTest: false }),
  )
  cursor.renderOrder = 20
  scene.add(cursor)
  const clickRings = CLICKS.map((click) => {
    const ring = makeShockRing(click.color)
    ring.position.set(click.pos[0], click.pos[1], 1.9)
    scene.add(ring)
    return ring
  })

  const pA = new THREE.Vector3()
  const pB = new THREE.Vector3()
  const pC = new THREE.Vector3()

  function place(card, x, y, s, opacity, z = 0) {
    card.group.position.set(x, y, z)
    card.group.scale.setScalar(safeScale(s))
    setCardOpacity(card, opacity)
  }
  const enter = (T, a) => ({
    drop: (1 - smooth(seg(T, a, a + 0.5))) * 0.4,
    scale: lerp(0.94, 1, easeOutCubic(seg(T, a, a + 0.5))),
  })
  const pop = (T, a, d = 0.4) => easeOutBack(seg(T, a, a + d))
  const fillBar = (bar, full, k, y) => {
    const w = full * k
    bar.position.set(-full / 2 + w / 2, y, zFace + 0.005)
    bar.scale.set(safeScale(w), 0.22, 1)
  }

  function draw(t) {
    const T = t * AGENTES_PRACTICA1_DURATION
    const events = []
    stage.update(T, 0)
    stage.spot.position.set(0, 4.6, 5.5)
    const op = [0, 1, 2, 3, 4].map((i) => phaseOpacity(T, i))

    /* ---------- paso 0: botón +, Más herramientas, Deep Research ---------- */
    const e0 = enter(T, 0.1)
    place(composer, COMPOSER.x, COMPOSER.y - e0.drop, e0.scale, op[0])
    flashCard(composer, bump(seg(T, CLICK_PLUS, CLICK_PLUS + 0.5)) * 0.4)
    const menuK = pop(T, CLICK_PLUS + 0.05)
    place(menu, MENU.x, MENU.y, menuK, op[0] * smooth(seg(T, CLICK_PLUS + 0.05, CLICK_PLUS + 0.25)), 0.3)
    shown(moreBar, op[0] * 0.4 * smooth(seg(T, CLICK_MORE - 0.1, CLICK_MORE + 0.1)))
    const subK = pop(T, CLICK_MORE + 0.05)
    place(submenu, SUBMENU.x, SUBMENU.y, subK, op[0] * smooth(seg(T, CLICK_MORE + 0.05, CLICK_MORE + 0.25)), 0.4)
    shown(drBar, op[0] * 0.5 * smooth(seg(T, CLICK_DR - 0.1, CLICK_DR + 0.1)))
    flashCard(submenu, bump(seg(T, CLICK_DR, CLICK_DR + 0.6)) * 0.5)
    drChip.scale.setScalar(safeScale(pop(T, CLICK_DR + 0.2)))
    shown(drChip, op[0] * smooth(seg(T, CLICK_DR + 0.2, CLICK_DR + 0.35)))

    const accK = pop(T, 0.3, 0.5)
    account.position.set(ACCOUNT.x, ACCOUNT.y, 0.4)
    account.scale.setScalar(safeScale(accK * (1 + 0.04 * bump(seg(T, 1.0, 1.6)))))
    shown(account, op[0] * smooth(seg(T, 0.3, 0.55)))
    accountRing.position.set(ACCOUNT.x - ACCOUNT.w / 2 + ACCOUNT.h / 2, ACCOUNT.y, 0.45)
    setShockRing(accountRing, T - 0.55, 0.9, 0.8)

    /* ---------- pasos 1 y 2: plan de investigación ---------- */
    const e1 = enter(T, 3.3)
    const planOp = window01(T, 3.3, 3.75, 9.25, 9.6)
    const planMove = easeInOutCubic(seg(T, 6.5, 7.0))
    const planX = lerp(PLAN.x, PLAN_X2, planMove)
    const planS = lerp(1, PLAN_S2, planMove) * e1.scale
    place(plan, planX, PLAN.y - e1.drop, planS, planOp)
    flashCard(plan, bump(seg(T, 3.5, 4.3)) * 0.35 + bump(seg(T, CLICK_EDIT, CLICK_EDIT + 0.7)) * 0.35)
    stepRows.forEach((row, i) => {
      const a = 3.9 + i * 0.5
      const k = easeOutCubic(seg(T, a, a + 0.45))
      row.position.set(lerp(-0.8, 0, k), ly(PLAN, PLAN_ROWS_V[i]), zFace)
      shown(row, planOp * smooth(seg(T, a, a + 0.25)))
      if (T >= a && T < a + 1) events.push({ t: a, x: wx(PLAN, 0.1), y: wy(PLAN, PLAN_ROWS_V[i]), z: 0.8, color: amberColor, speed: 1.2, life: 0.8 })
    })
    const pulse = 0.3 + 0.2 * Math.sin(T * 6)
    shown(editGlow, planOp * (bump(seg(T, 5.5, 6.3)) * 0.4 + (T < CLICK_EDIT ? pulse * smooth(seg(T, 6.8, 7.1)) : 0.6 * (1 - smooth(seg(T, CLICK_EDIT + 0.3, CLICK_EDIT + 0.9))))))
    shown(startGlow, planOp * (bump(seg(T, 5.7, 6.4)) * 0.4 + (T < CLICK_START ? pulse * smooth(seg(T, 8.2, 8.5)) : 0.7)))
    flashCard(plan, plan.edgeMat.emissiveIntensity + bump(seg(T, CLICK_START, CLICK_START + 0.5)) * 0.5)

    const scopeK = pop(T, CLICK_EDIT + 0.3, 0.5)
    scopeChip.position.set(PLAN_X2, PLAN.y + (PLAN.h / 2) * PLAN_S2 + 0.5, 0.4)
    scopeChip.scale.setScalar(safeScale(lerp(0.85, 1, scopeK)))
    shown(scopeChip, op[2] * smooth(seg(T, CLICK_EDIT + 0.3, CLICK_EDIT + 0.55)))

    /* contador de fuentes: 80 sitios → 12 sitios */
    const e2 = enter(T, 6.6)
    place(counter, COUNTER.x, COUNTER.y - e2.drop, e2.scale, op[2])
    const roll = easeInOutCubic(seg(T, 7.6, 8.2))
    num80.position.set(0, ly(COUNTER, 0.52) + roll * 0.5, zFace)
    shown(num80, op[2] * (1 - roll))
    num12.position.set(0, ly(COUNTER, 0.52) - (1 - roll) * 0.5, zFace)
    shown(num12, op[2] * roll)
    fillBar(counterFill, COUNTER_BAR_W, lerp(1, 0.15, roll), ly(COUNTER, 0.8))
    counterFill.material.color.copy(cyanColor).lerp(greenColor, roll)
    shown(counterFill, op[2])
    shown(counterTrack, op[2])
    flashCard(counter, bump(seg(T, 8.0, 8.8)) * 0.5)
    if (T >= 8.1 && T < 9.1) events.push({ t: 8.1, x: COUNTER.x, y: wy(COUNTER, 0.52), z: 0.9, color: greenColor, speed: 1.6, life: 0.9 })

    pA.set(EDIT_POS[0], EDIT_POS[1], 0.4)
    pB.set(COUNTER.x - COUNTER.w / 2, wy(COUNTER, 0.52), 0.4)
    const editTravel = easeInOutCubic(seg(T, CLICK_EDIT + 0.05, CLICK_EDIT + 0.6))
    pC.copy(pA).lerp(pB, editTravel)
    setBeam(editBeam, pA, pC, 0.035)
    editBeam.material.opacity = 0.8 * (1 - smooth(seg(T, 8.3, 8.8)))
    if (editTravel < 0.001 || T > 8.8) editBeam.visible = false

    /* ---------- cursor ---------- */
    const c = cursorAt(T)
    let clickK = 0
    CLICKS.forEach((click, i) => {
      clickK = Math.max(clickK, bump(seg(T, click.t, click.t + 0.22)))
      setShockRing(clickRings[i], T - click.t, 0.85, 1.0)
      if (T >= click.t && T < click.t + 1) {
        events.push({ t: click.t, x: click.pos[0], y: click.pos[1], z: 1.2, color: new THREE.Color(click.color), speed: 1.4, life: 0.8 })
      }
    })
    cursor.position.set(c.x + 0.31, c.y - 0.41 - clickK * 0.06, 2.0)
    cursor.scale.setScalar(1 - clickK * 0.1)
    cursor.material.opacity = Math.max(window01(T, 0.2, 0.4, 2.6, 2.9), window01(T, 6.6, 6.85, 9.2, 9.5))
    cursor.visible = cursor.material.opacity > 0.01

    /* ---------- paso 3: la investigación corre ---------- */
    const e3 = enter(T, 9.7)
    const rY = RESEARCH.y - e3.drop
    place(research, RESEARCH.x, rY, e3.scale, op[3])
    place(clock, CLOCK.x, CLOCK.y - e3.drop, e3.scale, op[3])
    const progress = easeInOutCubic(seg(T, 9.9, 12.5))
    fillBar(progFill, BAR_W, progress, ly(RESEARCH, 0.88))
    shown(progFill, op[3])
    shown(progTrack, op[3])
    const turn = progress * 0.75
    hand.rotation.z = -turn * Math.PI * 2
    shown(handBar, op[3])
    shown(hub, op[3])
    setArcProgress(arc, turn)
    arc.material.opacity = 0.9 * op[3]
    if (op[3] < 0.01) arc.visible = false
    flashCard(clock, bump(seg(T, 12.0, 12.7)) * 0.4)
    siteRows.forEach((row, i) => {
      const a = 10.1 + i * 0.6
      shown(row, op[3] * smooth(seg(T, a, a + 0.3)))
      row.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, a, a + 0.4)))))
      pA.set(wx(RESEARCH, 0.9), wy(RESEARCH, 0.065, rY), 0.35)
      pB.set(wx(RESEARCH, 0.9), wy(RESEARCH, SITE_ROWS_V[i], rY), 0.35)
      const travel = easeOutCubic(seg(T, a - 0.25, a + 0.1))
      pC.copy(pA).lerp(pB, travel)
      setBeam(siteBeams[i], pA, pC, 0.03)
      siteBeams[i].material.opacity = op[3] * lerp(0.85, 0.25, smooth(seg(T, a + 0.2, a + 0.8)))
      if (travel < 0.001 || op[3] < 0.01) siteBeams[i].visible = false
      if (T >= a && T < a + 1) events.push({ t: a, x: wx(RESEARCH, 0.9), y: wy(RESEARCH, SITE_ROWS_V[i], rY), z: 0.8, color: cyanColor, speed: 1.1, life: 0.7 })
    })

    /* ---------- paso 4: revisar fuentes y guardar ---------- */
    const e4 = enter(T, 12.9)
    const repY = REPORT.y - e4.drop
    place(report, REPORT.x, repY, e4.scale, op[4])
    sourceRows.forEach((row, i) => {
      const a = 13.2 + i * 0.4
      shown(row, op[4] * smooth(seg(T, a, a + 0.3)))
      const ck = 13.7 + i * 0.5
      checks[i].scale.setScalar(safeScale(pop(T, ck)))
      shown(checks[i], op[4] * smooth(seg(T, ck, ck + 0.12)))
      checkRings[i].position.set(wx(REPORT, 0.88), wy(REPORT, REPORT_ROWS_V[i], repY), 0.4)
      setShockRing(checkRings[i], T - ck, 0.8, 0.8)
      if (T >= ck && T < ck + 1) events.push({ t: ck, x: wx(REPORT, 0.88), y: wy(REPORT, REPORT_ROWS_V[i], repY), z: 0.8, color: greenColor, speed: 1.2, life: 0.8 })
    })
    const gapA = 14.6
    gapRow.position.set(lerp(-0.6, 0, easeOutCubic(seg(T, gapA, gapA + 0.4))), ly(REPORT, REPORT_ROWS_V[2]), zFace)
    shown(gapRow, op[4] * smooth(seg(T, gapA, gapA + 0.25)))
    if (T >= gapA && T < gapA + 1) events.push({ t: gapA + 0.1, x: wx(REPORT, 0.12), y: wy(REPORT, REPORT_ROWS_V[2], repY), z: 0.8, color: amberColor, speed: 1.0, life: 0.7 })

    const saveA = 15.0
    pA.set(REPORT.x + REPORT.w / 2, repY, 0.35)
    pB.set(SAVED.x - SAVED.w / 2, SAVED.y, 0.35)
    const saveTravel = easeInOutCubic(seg(T, saveA - 0.25, saveA + 0.15))
    pC.copy(pA).lerp(pB, saveTravel)
    setBeam(saveBeam, pA, pC, 0.04)
    saveBeam.material.opacity = 0.85 * op[4]
    if (saveTravel < 0.001 || op[4] < 0.01) saveBeam.visible = false
    place(saved, SAVED.x, SAVED.y, pop(T, saveA + 0.1, 0.5), op[4] * smooth(seg(T, saveA + 0.1, saveA + 0.3)), 0.2)
    flashCard(saved, bump(seg(T, saveA + 0.3, saveA + 0.9)) * 0.6)
    savedRing.position.set(SAVED.x, SAVED.y, 0.4)
    setShockRing(savedRing, T - (saveA + 0.2), 0.9, 2.0)
    if (T >= saveA + 0.2 && T < saveA + 1.2) events.push({ t: saveA + 0.2, x: SAVED.x, y: SAVED.y, z: 0.9, color: greenColor, speed: 2.0, life: 0.9 })

    bursts.update(T, events)
    return Math.min(4, Math.floor(T / PHASE))
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize: stage.resize, dispose }
}
