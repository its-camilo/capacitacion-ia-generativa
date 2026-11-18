import * as THREE from 'three'
import { bump, easeOutBack, easeOutCubic, lerp, roundRectPath, seg, smooth } from './threeKit'
import {
  FONT_BODY,
  FONT_MONO,
  createBurstSystem,
  createStage,
  fitText,
  flashCard,
  makeSlabCard,
  makeTex,
  makeTextPlane,
  safeScale,
  setCardOpacity,
} from './stageKit'

/**
 * Escena “Lo que se lleva” (Sesión 3, Entregable).
 * Loop de 16 s en 3 fases de ~5,33 s, con los 3 pasos:
 *   0 hoja analizada con gráfico y lista de riesgo · 1 tres borradores revisados, no enviados ·
 *   2 presentación de 5 diapositivas exportada a PDF.
 * `draw(t)` es una función pura del tiempo dentro del loop.
 */
export const MCP_ENTREGABLE_DURATION = 16

const GREEN = 0x3be09a
const CYAN = 0x7fdcff
const AMBER = 0xffd04b

const PY = 3.1
const PHASE = 16 / 3
const SHEET = { x: -5.0, w: 3.4, h: 3.8 }
const CHART = { x: -0.9, w: 4.2, h: 3.8 }
const RISK = { x: 3.7, w: 3.0, h: 3.8 }
const MAIL = { w: 7.6, h: 4.4 }
const DRAFT_CODES = ['E04', 'E11', 'E19']
const DRAFT_Y = [PY + 0.8, PY - 0.1, PY - 1.0]
const SLIDE_X = [-5.4, -4.1, -2.8, -1.5, -0.2]
const PDF = { x: 3.6, w: 2.8, h: 3.4 }
const BARS = [
  { label: 'Corte 1', value: 3.61 },
  { label: 'Corte 2', value: 3.44 },
]
const BAR_BASE = PY - 1.2
const BAR_MAX_H = 2.4
const BAR_X = [CHART.x - 0.95, CHART.x + 0.95]
const RISK_CODES = ['E09', 'E11', 'E15', 'E25']

function phaseOpacity(T, i) {
  const a = i * PHASE
  const b = a + PHASE
  return smooth(seg(T, a + 0.1, a + 0.6)) * (1 - smooth(seg(T, b - 0.35, b)))
}

/* ------------------------------------------------------------------ */
/* Texturas                                                            */
/* ------------------------------------------------------------------ */

function header(ctx, w, h, title, color = '#34425f') {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = color
  ctx.fillRect(0, 0, w, h * 0.14)
  fitText(ctx, title, w * 0.05, h * 0.1, { weight: 800, size: h * 0.075, maxWidth: w * 0.9, color: '#ffffff' })
}

function line(ctx, x, y, width, height = 12, color = 'rgba(4,35,97,0.2)') {
  ctx.fillStyle = color
  roundRectPath(ctx, x, y, width, height, height / 2)
  ctx.fill()
}

function drawSheet(ctx, w, h) {
  header(ctx, w, h, 'Notas (ficticio)', '#1f8a5b')
  for (let i = 0; i < 6; i += 1) {
    line(ctx, w * 0.08, h * (0.24 + i * 0.12), w * 0.3, 13, 'rgba(4,35,97,0.25)')
    line(ctx, w * 0.46, h * (0.24 + i * 0.12), w * 0.2, 13)
    line(ctx, w * 0.72, h * (0.24 + i * 0.12), w * 0.2, 13)
  }
}

function drawChart(ctx, w, h) {
  header(ctx, w, h, 'Gráfico · promedio por corte', '#2f6fd0')
  ctx.fillStyle = 'rgba(4,35,97,0.35)'
  ctx.fillRect(w * 0.08, h * 0.84, w * 0.84, 4)
}

function drawRisk(ctx, w, h) {
  header(ctx, w, h, 'Estudiantes en riesgo', '#c0392b')
}

function drawBarLabel(ctx, w, h, label, value) {
  fitText(ctx, value, w / 2, h * 0.42, { weight: 800, size: h * 0.4, family: FONT_MONO, maxWidth: w * 0.95, color: '#042361', align: 'center' })
  fitText(ctx, label, w / 2, h * 0.92, { weight: 700, size: h * 0.3, family: FONT_BODY, maxWidth: w * 0.95, color: 'rgba(4,35,97,0.7)', align: 'center' })
}

function drawCode(ctx, w, h, code) {
  ctx.fillStyle = '#ffe3df'
  ctx.strokeStyle = '#c0392b'
  ctx.lineWidth = 5
  roundRectPath(ctx, 3, 3, w - 6, h - 6, h / 3)
  ctx.fill()
  ctx.stroke()
  fitText(ctx, code, w / 2, h * 0.68, { weight: 800, size: h * 0.5, family: FONT_MONO, maxWidth: w * 0.85, color: '#042361', align: 'center' })
}

function drawMail(ctx, w, h) {
  header(ctx, w, h, 'Gmail · Borradores', '#c0392b')
}

function drawDraftRow(ctx, w, h, code) {
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(192,57,43,0.4)'
  ctx.lineWidth = 6
  roundRectPath(ctx, 4, 4, w - 8, h - 8, h / 4)
  ctx.fill()
  ctx.stroke()
  fitText(ctx, code, w * 0.05, h * 0.64, { weight: 800, size: h * 0.42, family: FONT_MONO, maxWidth: w * 0.14, color: '#042361' })
  fitText(ctx, 'revisado · no enviado', w * 0.95, h * 0.64, { weight: 700, size: h * 0.34, family: FONT_BODY, maxWidth: w * 0.5, color: 'rgba(4,35,97,0.7)', align: 'right' })
}

function drawSlide(ctx, w, h, n) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = n === 5 ? '#c89200' : '#2f6fd0'
  ctx.fillRect(0, 0, w, h * 0.22)
  fitText(ctx, String(n), w * 0.5, h * 0.18, { weight: 800, size: h * 0.17, maxWidth: w * 0.4, color: '#ffffff', align: 'center' })
  line(ctx, w * 0.15, h * 0.5, w * 0.7, 10)
  line(ctx, w * 0.15, h * 0.65, w * 0.5, 10, 'rgba(4,35,97,0.12)')
}

function drawPdf(ctx, w, h) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#d93025'
  ctx.fillRect(0, 0, w, h * 0.3)
  fitText(ctx, 'PDF', w * 0.5, h * 0.22, { weight: 800, size: h * 0.18, maxWidth: w * 0.8, color: '#ffffff', align: 'center' })
  fitText(ctx, '5 diapositivas', w * 0.5, h * 0.55, { weight: 800, size: h * 0.1, maxWidth: w * 0.88, color: '#042361', align: 'center' })
  fitText(ctx, 'exportado', w * 0.5, h * 0.7, { weight: 500, size: h * 0.08, family: FONT_BODY, maxWidth: w * 0.88, color: 'rgba(4,35,97,0.65)', align: 'center' })
}

function drawChip(ctx, w, h, text, fill, ink = '#042361') {
  ctx.fillStyle = fill
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fill()
  fitText(ctx, text, w / 2, h * 0.67, { weight: 800, size: h * 0.46, maxWidth: w * 0.92, color: ink, align: 'center' })
}

function drawCheck(ctx, w, h) {
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = w * 0.14
  ctx.fillStyle = '#3be09a'
  ctx.beginPath()
  ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#042361'
  ctx.beginPath()
  ctx.moveTo(w * 0.28, h * 0.52)
  ctx.lineTo(w * 0.44, h * 0.68)
  ctx.lineTo(w * 0.74, h * 0.34)
  ctx.stroke()
}

/* ------------------------------------------------------------------ */

export default function createMcpEntregableScene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: MCP_ENTREGABLE_DURATION,
    frame: { wideHalfW: 8.7, narrowHalfW: 6.2, halfH: 4.45, camY: 5.0, lookY: 3.3 },
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 10, perBurst: 18, seed: 71 })
  scene.add(bursts.points)
  const greenColor = new THREE.Color(GREEN)
  const cyanColor = new THREE.Color(CYAN)
  const amberColor = new THREE.Color(AMBER)

  const makeCard = (size, draw, extra = {}) =>
    makeSlabCard({
      w: size.w,
      h: size.h,
      depth: 0.1,
      radius: 0.22,
      bevel: 0.03,
      edge: '#cfd8ea',
      roughness: 0.8,
      inset: 0.04,
      texture: makeTex(Math.round(size.w * 150), Math.round(size.h * 150), draw, invalidate),
      ...extra,
    })
  const makePlane = (w, h, px, draw, order = 5) => {
    const mesh = makeTextPlane(w, h, makeTex(Math.round(w * px), Math.round(h * px), draw, invalidate))
    mesh.renderOrder = order
    scene.add(mesh)
    return mesh
  }
  const shown = (obj, k) => {
    obj.material.opacity = k
    obj.visible = k > 0.01
  }

  const sheet = makeCard(SHEET, drawSheet)
  const chart = makeCard(CHART, drawChart, { emissive: '#7fdcff' })
  const risk = makeCard(RISK, drawRisk, { emissive: '#ff6b5e' })
  const mail = makeCard(MAIL, drawMail, { emissive: '#3be09a' })
  const slideCards = [1, 2, 3, 4, 5].map((n) =>
    makeCard({ w: 1.2, h: 1.6 }, (ctx, w, h) => drawSlide(ctx, w, h, n), { emissive: '#7fdcff' }),
  )
  const pdf = makeCard(PDF, drawPdf, { emissive: '#ff6b5e' })
  const allCards = [sheet, chart, risk, mail, ...slideCards, pdf]
  allCards.forEach((card) => scene.add(card.group))

  /* paso 0: barras y códigos de riesgo */
  const bars = BARS.map(() => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: 0x2f6fd0, transparent: true, depthWrite: false, toneMapped: false }),
    )
    mesh.renderOrder = 4
    scene.add(mesh)
    return mesh
  })
  const barLabels = BARS.map((b) =>
    makePlane(1.5, 0.9, 160, (ctx, w, h) => drawBarLabel(ctx, w, h, b.label, b.value.toFixed(2).replace('.', ',')), 6),
  )
  const riskChips = RISK_CODES.map((code) => makePlane(1.6, 0.52, 160, (ctx, w, h) => drawCode(ctx, w, h, code)))

  /* paso 1 */
  const draftRows = DRAFT_CODES.map((code) => makePlane(6.4, 0.7, 150, (ctx, w, h) => drawDraftRow(ctx, w, h, code)))
  const draftChecks = DRAFT_CODES.map(() => makePlane(0.5, 0.5, 128, drawCheck, 6))

  const chip = (text, fill, wd) => {
    const mesh = makePlane(wd, 0.66, 200, (ctx, w, h) => drawChip(ctx, w, h, text, fill), 6)
    mesh.position.set(0, PY - 2.65, 0.3)
    return mesh
  }
  const chips = [
    chip('Hoja analizada · gráfico · lista de riesgo', '#9fe8ff', 6.6),
    chip('Tres borradores revisados, no enviados', '#3be09a', 6.2),
    chip('Presentación exportada a PDF', '#ffb59f', 4.8),
  ]

  function place(card, x, y, s, opacity) {
    card.group.position.set(x, y, 0)
    card.group.scale.setScalar(safeScale(s))
    setCardOpacity(card, opacity)
  }
  const enter = (T, i) => {
    const a = i * PHASE + 0.1
    return { drop: (1 - smooth(seg(T, a, a + 0.5))) * 0.4, scale: lerp(0.94, 1, easeOutCubic(seg(T, a, a + 0.5))) }
  }
  const popChip = (mesh, T, a, k) => {
    mesh.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, a, a + 0.5)))))
    shown(mesh, k * smooth(seg(T, a, a + 0.4)))
  }

  function draw(t) {
    const T = t * MCP_ENTREGABLE_DURATION
    const events = []
    stage.update(T, 0)
    stage.spot.position.set(0, 4.6, 5.5)
    const op = [0, 1, 2].map((i) => phaseOpacity(T, i))
    const e = [0, 1, 2].map((i) => enter(T, i))

    /* ---------- paso 0: hoja, gráfico y lista de riesgo ---------- */
    place(sheet, SHEET.x, PY - e[0].drop, e[0].scale, op[0])
    place(chart, CHART.x, PY - e[0].drop, e[0].scale, op[0])
    place(risk, RISK.x, PY - e[0].drop, e[0].scale, op[0])
    BARS.forEach((b, i) => {
      const a = 0.9 + i * 0.4
      const k = easeOutCubic(seg(T, a, a + 0.7))
      const hgt = (b.value / 5) * BAR_MAX_H * 1.4 * k
      bars[i].position.set(BAR_X[i], BAR_BASE + hgt / 2, 0.12)
      bars[i].scale.set(0.9, safeScale(hgt), 1)
      shown(bars[i], op[0] * smooth(seg(T, a, a + 0.2)))
      barLabels[i].position.set(BAR_X[i], BAR_BASE + hgt + 0.55, 0.2)
      shown(barLabels[i], op[0] * smooth(seg(T, a + 0.5, a + 0.8)))
      if (T >= a + 0.6 && T < a + 1.6) events.push({ t: a + 0.6, x: BAR_X[i], y: BAR_BASE + hgt, z: 0.9, color: cyanColor, speed: 1.1, life: 0.7 })
    })
    riskChips.forEach((chipMesh, i) => {
      const a = 1.9 + i * 0.3
      chipMesh.position.set(RISK.x, PY + 0.8 - i * 0.7, 0.2)
      chipMesh.scale.setScalar(safeScale(easeOutBack(seg(T, a, a + 0.4))))
      shown(chipMesh, op[0] * smooth(seg(T, a, a + 0.15)))
    })
    flashCard(risk, bump(seg(T, 1.9, 3.0)) * 0.3)
    popChip(chips[0], T, 2.4, op[0])

    /* ---------- paso 1: tres borradores revisados, no enviados ---------- */
    place(mail, 0, PY - e[1].drop, e[1].scale, op[1])
    draftRows.forEach((row, i) => {
      const a = 6.033 + i * 0.5
      row.position.set(lerp(-1.2, 0, easeOutCubic(seg(T, a, a + 0.5))), DRAFT_Y[i], 0.2)
      shown(row, op[1] * smooth(seg(T, a, a + 0.25)))
      const c = a + 1.3
      draftChecks[i].position.set(3.45, DRAFT_Y[i], 0.3)
      draftChecks[i].scale.setScalar(safeScale(easeOutBack(seg(T, c, c + 0.4))))
      shown(draftChecks[i], op[1] * smooth(seg(T, c, c + 0.12)))
      if (T >= c && T < c + 1) events.push({ t: c, x: 3.45, y: DRAFT_Y[i], z: 0.9, color: greenColor, speed: 1.2, life: 0.8 })
    })
    popChip(chips[1], T, 8.133, op[1])

    /* ---------- paso 2: cinco diapositivas a PDF ---------- */
    slideCards.forEach((card, i) => {
      const a = 11.267 + i * 0.3
      const toPdf = easeOutCubic(seg(T, 12.867, 13.567))
      const x = lerp(SLIDE_X[i], PDF.x, toPdf)
      const y = PY + 0.2 - (1 - easeOutCubic(seg(T, a, a + 0.4))) * 0.4
      place(card, x, y, safeScale(easeOutBack(seg(T, a, a + 0.4)) * lerp(1, 0.6, toPdf)), op[2] * smooth(seg(T, a, a + 0.2)) * (1 - smooth(seg(T, 13.267, 13.667))))
    })
    place(pdf, PDF.x, PY - e[2].drop, safeScale(e[2].scale * easeOutBack(seg(T, 13.267, 13.867))), op[2] * smooth(seg(T, 13.267, 13.567)))
    flashCard(pdf, bump(seg(T, 13.367, 14.167)) * 0.45)
    if (T >= 13.367 && T < 14.367) events.push({ t: 13.367, x: PDF.x, y: PY, z: 1.0, color: amberColor, speed: 1.4, life: 0.8 })
    popChip(chips[2], T, 13.267, op[2])

    bursts.update(T, events)
    return Math.min(2, Math.floor(T / PHASE))
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize: stage.resize, dispose }
}
