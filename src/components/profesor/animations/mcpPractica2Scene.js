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
 * Escena “Analizar el grupo” (Sesión 3, Práctica 2).
 * Loop de 16 s en 5 fases de 3,2 s:
 *   0 promedios por corte · 1 distribución del grupo · 2 estudiantes en riesgo ·
 *   3 gráfico en el chat · 4 lista de riesgo (solo códigos).
 * `draw(t)` es una función pura del tiempo dentro del loop.
 */
export const MCP_PRACTICA2_DURATION = 16

const GREEN = 0x3be09a
const CYAN = 0x7fdcff
const RED = 0xff6b5e

const PY = 3.1
const CARD = { w: 8, h: 4.6 }
const PHASE = 3.2

/* conteos ilustrativos de la distribución (25 estudiantes) */
const BINS = [1, 4, 12, 8]
const BIN_LABELS = ['1–2', '2–3', '3–4', '4–5']
const BIN_X = [-3, -1, 1, 3]
const DOT_BASE_Y = PY - 1.35
const CHART_BASE_Y = PY - 1.5
const AT_RISK = [9, 11, 15, 25]
const GRID = { u0: 0.1, du: 0.1, v0: 0.25, dv: 0.14 }

const toX = (u) => (u - 0.5) * CARD.w
const toY = (v) => PY + (0.5 - v) * CARD.h

/** Ventana de aparición de una fase: entra al inicio y sale al final. */
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

function drawAverages(ctx, w, h) {
  header(ctx, w, h, 'Promedios por corte')
  ;[
    ['Corte 1', '3,61', 0.38],
    ['Corte 2', '3,44', 0.64],
  ].forEach(([name, value, v]) => {
    fitText(ctx, name, w * 0.06, h * (v + 0.03), { weight: 800, size: h * 0.075, maxWidth: w * 0.2, color: '#042361' })
    ctx.fillStyle = 'rgba(4,35,97,0.1)'
    roundRectPath(ctx, w * 0.26, h * (v - 0.045), w * 0.5, h * 0.11, h * 0.055)
    ctx.fill()
    fitText(ctx, value, w * 0.94, h * (v + 0.04), { weight: 800, size: h * 0.12, family: FONT_MONO, maxWidth: w * 0.16, color: '#042361', align: 'right' })
  })
  fitText(ctx, 'Promedio, mediana y desviación por corte', w * 0.06, h * 0.9, { weight: 500, size: h * 0.052, family: FONT_BODY, maxWidth: w * 0.88, color: 'rgba(4,35,97,0.65)' })
}

function drawDistribution(ctx, w, h) {
  header(ctx, w, h, 'Distribución del grupo · 25 estudiantes')
  ctx.strokeStyle = 'rgba(4,35,97,0.35)'
  ctx.lineWidth = 4
  const y = h * (0.5 + (PY - DOT_BASE_Y) / CARD.h) + 6
  ctx.beginPath()
  ctx.moveTo(w * 0.06, y)
  ctx.lineTo(w * 0.94, y)
  ctx.stroke()
  BIN_X.forEach((x, i) =>
    fitText(ctx, BIN_LABELS[i], (x / CARD.w + 0.5) * w, y + h * 0.085, { weight: 700, size: h * 0.06, family: FONT_MONO, color: '#042361', align: 'center' }),
  )
}

function drawRisk(ctx, w, h) {
  header(ctx, w, h, 'Estudiantes en riesgo', '#8a2c2c')
  for (let n = 0; n < 25; n += 1) {
    const x = (GRID.u0 + GRID.du * (n % 5)) * w
    const y = (GRID.v0 + GRID.dv * Math.floor(n / 5)) * h
    ctx.fillStyle = '#e3e9f6'
    ctx.beginPath()
    ctx.arc(x, y, h * 0.052, 0, Math.PI * 2)
    ctx.fill()
    fitText(ctx, `E${String(n + 1).padStart(2, '0')}`, x, y + h * 0.017, { weight: 700, size: h * 0.043, family: FONT_MONO, color: '#042361', align: 'center' })
  }
  fitText(ctx, 'Riesgo si:', w * 0.64, h * 0.34, { weight: 800, size: h * 0.07, maxWidth: w * 0.32, color: '#042361' })
  fitText(ctx, 'promedio < 3,0', w * 0.64, h * 0.46, { weight: 600, size: h * 0.06, family: FONT_BODY, maxWidth: w * 0.32, color: '#042361' })
  fitText(ctx, 'o asistencia < 70 %', w * 0.64, h * 0.56, { weight: 600, size: h * 0.06, family: FONT_BODY, maxWidth: w * 0.34, color: '#042361' })
}

function drawChart(ctx, w, h) {
  header(ctx, w, h, 'Gráfico en el chat · distribución')
  ctx.strokeStyle = 'rgba(4,35,97,0.35)'
  ctx.lineWidth = 4
  const y = h * (0.5 + (PY - CHART_BASE_Y) / CARD.h)
  ctx.beginPath()
  ctx.moveTo(w * 0.06, y)
  ctx.lineTo(w * 0.94, y)
  ctx.stroke()
  BIN_X.forEach((x, i) =>
    fitText(ctx, BIN_LABELS[i], (x / CARD.w + 0.5) * w, y + h * 0.085, { weight: 700, size: h * 0.06, family: FONT_MONO, color: '#042361', align: 'center' }),
  )
}

function drawList(ctx, w, h) {
  header(ctx, w, h, 'Lista de riesgo', '#8a2c2c')
  fitText(ctx, 'Solo códigos, sin nombres', w * 0.05, h * 0.93, { weight: 500, size: h * 0.052, family: FONT_BODY, maxWidth: w * 0.9, color: 'rgba(4,35,97,0.65)' })
}

function drawDisc(ctx, w, h, text, fill) {
  ctx.fillStyle = fill
  ctx.beginPath()
  ctx.arc(w / 2, h / 2, w / 2 - 3, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, text, w / 2, h * 0.62, { weight: 800, size: h * 0.3, family: FONT_MONO, color: '#ffffff', align: 'center' })
}

function drawRow(ctx, w, h, code) {
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(138,44,44,0.45)'
  ctx.lineWidth = 6
  roundRectPath(ctx, 4, 4, w - 8, h - 8, h / 2.4)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#ff6b5e'
  ctx.beginPath()
  ctx.arc(h * 0.5, h / 2, h * 0.17, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, code, w * 0.2, h * 0.68, { weight: 800, size: h * 0.5, family: FONT_MONO, maxWidth: w * 0.3, color: '#042361' })
  fitText(ctx, 'en riesgo', w * 0.9, h * 0.66, { weight: 600, size: h * 0.36, family: FONT_BODY, maxWidth: w * 0.4, color: '#8a2c2c', align: 'right' })
}

function drawChip(ctx, w, h, text, fill, ink = '#042361') {
  ctx.fillStyle = fill
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fill()
  fitText(ctx, text, w / 2, h * 0.67, { weight: 800, size: h * 0.46, maxWidth: w * 0.9, color: ink, align: 'center' })
}

const plainTex = (invalidate) => makeTex(16, 16, (ctx, w, h) => {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, w, h)
}, invalidate)

/* ------------------------------------------------------------------ */

export default function createMcpPractica2Scene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: MCP_PRACTICA2_DURATION,
    frame: { wideHalfW: 8.7, narrowHalfW: 6.2, halfH: 4.45, camY: 5.0, lookY: 3.3 },
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 10, perBurst: 18, seed: 47 })
  scene.add(bursts.points)
  const greenColor = new THREE.Color(GREEN)
  const cyanColor = new THREE.Color(CYAN)
  const redColor = new THREE.Color(RED)

  const makeCard = (draw, extra = {}) =>
    makeSlabCard({
      w: CARD.w,
      h: CARD.h,
      depth: 0.1,
      radius: 0.22,
      bevel: 0.03,
      edge: '#cfd8ea',
      roughness: 0.8,
      inset: 0.04,
      texture: makeTex(1200, 690, draw, invalidate),
      ...extra,
    })

  const cards = [
    makeCard(drawAverages),
    makeCard(drawDistribution),
    makeCard(drawRisk, { emissive: '#ff6b5e' }),
    makeCard(drawChart, { emissive: '#7fdcff' }),
    makeCard(drawList, { emissive: '#ff6b5e' }),
  ]
  cards.forEach((card) => scene.add(card.group))

  const flat = plainTex(invalidate)
  const makeBar = (color) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: flat, color, transparent: true, depthWrite: false, toneMapped: false }),
    )
    mesh.renderOrder = 5
    scene.add(mesh)
    return mesh
  }
  /** Barra anclada a la izquierda (horizontal) o a la base (vertical). */
  const setBar = (bar, x, y, w, h, opacity) => {
    bar.position.set(x + w / 2, y + h / 2, 0.15)
    bar.scale.set(safeScale(w), safeScale(h), 1)
    bar.material.opacity = opacity
    bar.visible = opacity > 0.01 && w > 0.001 && h > 0.001
  }

  /* fase 0: barras de promedio */
  const avgBars = [makeBar(0x4574b9), makeBar(0xa98bff)]
  const AVG_ROWS = [
    { v: 0.38, value: 3.61 },
    { v: 0.64, value: 3.44 },
  ]
  const AVG_X0 = toX(0.26)
  const AVG_LEN = CARD.w * 0.5

  /* fase 1: 25 puntos que caen sobre su rango */
  const dotTex = makeTex(64, 64, (ctx, w, h) => {
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2)
    ctx.fill()
  }, invalidate)
  const dots = []
  BINS.forEach((count, b) => {
    for (let i = 0; i < count; i += 1) {
      const mesh = makeTextPlane(0.32, 0.32, dotTex)
      mesh.material.color.set(0x4574b9)
      mesh.renderOrder = 5
      scene.add(mesh)
      dots.push({
        mesh,
        x: BIN_X[b] + ((i % 3) - 1) * 0.4,
        y: DOT_BASE_Y + 0.25 + Math.floor(i / 3) * 0.38,
        order: dots.length,
      })
    }
  })

  /* fase 2: discos rojos sobre los cuatro códigos en riesgo */
  const riskDiscs = AT_RISK.map((code) => {
    const n = code - 1
    const mesh = makeTextPlane(0.62, 0.62, makeTex(128, 128, (ctx, w, h) => drawDisc(ctx, w, h, `E${String(code).padStart(2, '0')}`, '#e5483b'), invalidate))
    mesh.renderOrder = 5
    scene.add(mesh)
    return { mesh, x: toX(GRID.u0 + GRID.du * (n % 5)), y: toY(GRID.v0 + GRID.dv * Math.floor(n / 5)) }
  })
  const riskChip = makeTextPlane(2.6, 0.66, makeTex(520, 132, (ctx, w, h) => drawChip(ctx, w, h, '4 en riesgo', '#ffb3aa'), invalidate))
  riskChip.position.set(toX(0.8), toY(0.78), 0.3)
  scene.add(riskChip)

  /* fase 3: barras del gráfico */
  const chartBars = BINS.map(() => makeBar(0x4574b9))
  const CHART_UNIT = 0.27

  /* fase 4: filas de la lista */
  const rows = AT_RISK.map((code, i) => {
    const mesh = makeTextPlane(5.2, 0.78, makeTex(780, 117, (ctx, w, h) => drawRow(ctx, w, h, `E${String(code).padStart(2, '0')}`), invalidate))
    mesh.renderOrder = 5
    scene.add(mesh)
    return { mesh, y: PY + 0.95 - i * 0.92 }
  })

  const shown = (obj, k) => {
    obj.material.opacity = k
    obj.visible = k > 0.01
  }

  function place(card, y, s, opacity) {
    card.group.position.set(0, y, 0)
    card.group.scale.setScalar(safeScale(s))
    setCardOpacity(card, opacity)
  }

  function draw(t) {
    const T = t * MCP_PRACTICA2_DURATION
    const events = []
    stage.update(T, 0)
    stage.spot.position.set(0, 4.6, 5.5)

    const op = [0, 1, 2, 3, 4].map((i) => phaseOpacity(T, i))
    cards.forEach((card, i) => {
      const a = i * PHASE
      place(card, PY - (1 - smooth(seg(T, a + 0.1, a + 0.6))) * 0.4, lerp(0.94, 1, easeOutCubic(seg(T, a + 0.1, a + 0.6))), op[i])
    })

    /* ---------- paso 0: promedios ---------- */
    avgBars.forEach((bar, i) => {
      const a = 0.7 + i * 0.4
      const len = (AVG_ROWS[i].value / 5) * AVG_LEN * easeOutCubic(seg(T, a, a + 1.0))
      setBar(bar, AVG_X0, toY(AVG_ROWS[i].v) - 0.2, len, 0.4, op[0])
    })
    flashCard(cards[0], bump(seg(T, 2.0, 2.8)) * 0.3)

    /* ---------- paso 1: distribución ---------- */
    dots.forEach((dot) => {
      const a = 3.9 + dot.order * 0.06
      const k = seg(T, a, a + 0.5)
      const fall = 1 - easeOutBack(k)
      dot.mesh.position.set(dot.x, dot.y + fall * 3.0, 0.2)
      shown(dot.mesh, op[1] * smooth(seg(T, a, a + 0.12)))
    })

    /* ---------- paso 2: riesgo ---------- */
    riskDiscs.forEach((d, i) => {
      const a = 7.3 + i * 0.4
      const k = easeOutBack(seg(T, a, a + 0.45))
      d.mesh.position.set(d.x, d.y, 0.2)
      d.mesh.scale.setScalar(safeScale(k))
      shown(d.mesh, op[2] * smooth(seg(T, a, a + 0.15)))
      if (T >= a && T < a + 1) events.push({ t: a, x: d.x, y: d.y, z: 0.9, color: redColor, speed: 1.3, life: 0.8 })
    })
    riskChip.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 9.0, 9.5)))))
    shown(riskChip, op[2] * smooth(seg(T, 9.0, 9.4)))

    /* ---------- paso 3: gráfico ---------- */
    chartBars.forEach((bar, i) => {
      const a = 10.2 + i * 0.3
      const hgt = BINS[i] * CHART_UNIT * easeOutCubic(seg(T, a, a + 0.9))
      setBar(bar, BIN_X[i] - 0.5, CHART_BASE_Y, 1.0, hgt, op[3])
    })
    if (T > 11.4 && T < 12.4) events.push({ t: 11.4, x: 1, y: CHART_BASE_Y + 3.2, z: 0.9, color: cyanColor, speed: 1.4, life: 0.8 })

    /* ---------- paso 4: lista ---------- */
    rows.forEach((row, i) => {
      const a = 13.5 + i * 0.35
      const k = easeOutCubic(seg(T, a, a + 0.5))
      row.mesh.position.set(lerp(-1.2, 0, k), row.y, 0.2)
      shown(row.mesh, op[4] * smooth(seg(T, a, a + 0.25)))
    })
    flashCard(cards[4], bump(seg(T, 14.9, 15.5)) * 0.25)
    if (T > 14.9 && T < 15.9) events.push({ t: 14.9, x: 0, y: PY + 0.2, z: 0.9, color: greenColor, speed: 1.6, life: 0.8 })

    bursts.update(T, events)
    return Math.min(4, Math.floor(T / PHASE))
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize: stage.resize, dispose }
}
