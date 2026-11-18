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
 * Escena “De apuntes a presentación de clase” (Sesión 3, Práctica 4).
 * Loop de 16 s en 5 fases de 3,2 s:
 *   0 esquema con Gemini dentro del documento · 1 Vía 1: archivo PowerPoint de Claude ·
 *   2 Vía 2: diseño editable en Canva · 3 cinco diapositivas, una idea cada una ·
 *   4 revisar que los datos coincidan con los apuntes.
 * `draw(t)` es una función pura del tiempo dentro del loop.
 */
export const MCP_PRACTICA4_DURATION = 16

const GREEN = 0x3be09a
const CYAN = 0x7fdcff
const AMBER = 0xffd04b

const PY = 3.1
const PHASE = 3.2
const DOC = { x: -3.0, w: 4.6, h: 3.8 }
const GEM = { x: 2.6, w: 3.8, h: 3.8 }
const CLAUDE = { x: -3.2, w: 4.0, h: 3.4 }
const PPTX = { x: 3.0, w: 3.2, h: 3.4 }
const CANVA = { w: 7.6, h: 4.2 }
const SLIDE = { w: 1.5, h: 1.9 }
const SLIDE_X = [-3.4, -1.7, 0, 1.7, 3.4]
const CMP = { w: 3.8, h: 3.4 }
const CMP_X = 2.55
const OUTLINE = ['Diapositiva 1', 'Diapositiva 2', 'Diapositiva 3', 'Diapositiva 4', 'Diapositiva 5 · actividad de 5 min']
const OUTLINE_Y = [0, 1, 2, 3, 4].map((i) => PY + 0.9 - i * 0.55)
const CMP_Y = [PY + 0.7, PY, PY - 0.7]

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

function drawDoc(ctx, w, h) {
  header(ctx, w, h, 'Apuntes · Unidad 2 Elasticidades', '#2f6fd0')
  fitText(ctx, 'Google Docs · ícono de Gemini', w * 0.06, h * 0.24, { weight: 500, size: h * 0.05, family: FONT_BODY, maxWidth: w * 0.88, color: 'rgba(4,35,97,0.6)' })
  for (let i = 0; i < 7; i += 1) line(ctx, w * 0.07, h * (0.32 + i * 0.09), w * (i % 3 === 2 ? 0.5 : 0.86), 13)
}

function drawGemini(ctx, w, h) {
  header(ctx, w, h, 'Gemini · esquema', '#7a5ac8')
  fitText(ctx, '5 diapositivas', w * 0.06, h * 0.2, { weight: 500, size: h * 0.05, family: FONT_BODY, maxWidth: w * 0.88, color: 'rgba(4,35,97,0.6)' })
}

function drawOutlineRow(ctx, w, h, text, last) {
  ctx.fillStyle = last ? '#fff3c9' : '#ffffff'
  ctx.strokeStyle = last ? 'rgba(200,150,0,0.6)' : 'rgba(122,90,200,0.4)'
  ctx.lineWidth = 5
  roundRectPath(ctx, 3, 3, w - 6, h - 6, h / 3)
  ctx.fill()
  ctx.stroke()
  fitText(ctx, text, w * 0.05, h * 0.64, { weight: 800, size: h * 0.42, maxWidth: w * 0.9, color: '#042361' })
}

function drawClaude(ctx, w, h) {
  header(ctx, w, h, 'Claude · presentación', '#c8643a')
  fitText(ctx, 'Prompt con el esquema de Gemini', w * 0.06, h * 0.28, { weight: 500, size: h * 0.06, family: FONT_BODY, maxWidth: w * 0.88, color: 'rgba(4,35,97,0.65)' })
  for (let i = 0; i < 4; i += 1) line(ctx, w * 0.07, h * (0.38 + i * 0.12), w * (i === 3 ? 0.45 : 0.86), 13)
}

function drawFile(ctx, w, h) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#d24726'
  ctx.fillRect(0, 0, w, h * 0.3)
  fitText(ctx, 'PowerPoint', w * 0.5, h * 0.2, { weight: 800, size: h * 0.12, maxWidth: w * 0.8, color: '#ffffff', align: 'center' })
  fitText(ctx, 'presentación.pptx', w * 0.5, h * 0.52, { weight: 800, size: h * 0.09, family: FONT_MONO, maxWidth: w * 0.88, color: '#042361', align: 'center' })
  fitText(ctx, 'archivo descargable', w * 0.5, h * 0.68, { weight: 500, size: h * 0.07, family: FONT_BODY, maxWidth: w * 0.88, color: 'rgba(4,35,97,0.65)', align: 'center' })
  line(ctx, w * 0.2, h * 0.8, w * 0.6, 12)
}

function drawCanva(ctx, w, h) {
  header(ctx, w, h, 'Canva · diseño editable', '#00a0b0')
  ctx.fillStyle = '#e8eef9'
  ctx.fillRect(w * 0.04, h * 0.2, w * 0.2, h * 0.74)
  for (let i = 0; i < 4; i += 1) line(ctx, w * 0.06, h * (0.26 + i * 0.17), w * 0.16, h * 0.12, 'rgba(0,160,176,0.35)')
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(4,35,97,0.2)'
  ctx.lineWidth = 4
  ctx.fillRect(w * 0.28, h * 0.2, w * 0.68, h * 0.74)
  ctx.strokeRect(w * 0.28, h * 0.2, w * 0.68, h * 0.74)
  line(ctx, w * 0.33, h * 0.58, w * 0.4, 14)
  line(ctx, w * 0.33, h * 0.68, w * 0.3, 12, 'rgba(4,35,97,0.12)')
}

function drawEditable(ctx, w, h) {
  ctx.fillStyle = '#fff3c9'
  ctx.strokeStyle = '#00a0b0'
  ctx.setLineDash([14, 10])
  ctx.lineWidth = 5
  roundRectPath(ctx, 4, 4, w - 8, h - 8, h / 4)
  ctx.fill()
  ctx.stroke()
  fitText(ctx, 'Título', w * 0.5, h * 0.66, { weight: 800, size: h * 0.46, maxWidth: w * 0.85, color: '#042361', align: 'center' })
}

function drawSlide(ctx, w, h, n) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = n === 5 ? '#c89200' : '#2f6fd0'
  ctx.fillRect(0, 0, w, h * 0.2)
  fitText(ctx, String(n), w * 0.1, h * 0.15, { weight: 800, size: h * 0.14, maxWidth: w * 0.2, color: '#ffffff' })
  fitText(ctx, n === 5 ? 'Actividad' : '1 idea', w * 0.5, h * 0.45, { weight: 800, size: h * 0.15, maxWidth: w * 0.84, color: '#042361', align: 'center' })
  if (n === 5) {
    fitText(ctx, '5 min', w * 0.5, h * 0.7, { weight: 800, size: h * 0.2, family: FONT_MONO, maxWidth: w * 0.84, color: '#c89200', align: 'center' })
  } else {
    line(ctx, w * 0.15, h * 0.62, w * 0.7, 10)
    line(ctx, w * 0.15, h * 0.74, w * 0.5, 10, 'rgba(4,35,97,0.12)')
  }
}

function drawCompare(ctx, w, h, title, color, labels) {
  header(ctx, w, h, title, color)
  labels.forEach((text, i) => {
    line(ctx, w * 0.07, h * (0.3 + i * 0.205), w * 0.86, 14, 'rgba(4,35,97,0.2)')
    fitText(ctx, text, w * 0.07, h * (0.27 + i * 0.205), { weight: 700, size: h * 0.06, family: FONT_BODY, maxWidth: w * 0.86, color: '#042361' })
  })
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

export default function createMcpPractica4Scene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: MCP_PRACTICA4_DURATION,
    frame: { wideHalfW: 8.7, narrowHalfW: 6.2, halfH: 4.45, camY: 5.0, lookY: 3.3 },
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 10, perBurst: 18, seed: 61 })
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

  const doc = makeCard(DOC, drawDoc)
  const gemini = makeCard(GEM, drawGemini, { emissive: '#a98bff' })
  const claude = makeCard(CLAUDE, drawClaude)
  const pptx = makeCard(PPTX, drawFile, { emissive: '#ff8a70' })
  const canva = makeCard(CANVA, drawCanva, { emissive: '#7fdcff' })
  const slideCards = [1, 2, 3, 4, 5].map((n) => makeCard(SLIDE, (ctx, w, h) => drawSlide(ctx, w, h, n), { emissive: n === 5 ? '#ffd04b' : '#7fdcff' }))
  const slidesCmp = makeCard(CMP, (ctx, w, h) => drawCompare(ctx, w, h, 'Presentación', '#2f6fd0', ['Diapositiva 1', 'Diapositiva 2', 'Diapositiva 3']))
  const notesCmp = makeCard(CMP, (ctx, w, h) => drawCompare(ctx, w, h, 'Apuntes', '#1f8a5b', ['Unidad 2', 'Elasticidades', 'Datos del documento']), { emissive: '#3be09a' })
  const allCards = [doc, gemini, claude, pptx, canva, ...slideCards, slidesCmp, notesCmp]
  allCards.forEach((card) => scene.add(card.group))

  const outlineRows = OUTLINE.map((text, i) => makePlane(3.3, 0.46, 200, (ctx, w, h) => drawOutlineRow(ctx, w, h, text, i === 4)))
  const chip = (text, fill, wd = 5.6) => {
    const mesh = makePlane(wd, 0.66, 200, (ctx, w, h) => drawChip(ctx, w, h, text, fill), 6)
    mesh.position.set(0, PY - 2.65, 0.3)
    return mesh
  }
  const chips = [
    chip('Esquema con Gemini dentro del documento', '#cdb9ff', 6.4),
    chip('Vía 1 · archivo PowerPoint que entrega Claude', '#ffb59f', 6.8),
    chip('Vía 2 · diseño editable en Canva', '#9fe8ff', 5.2),
    chip('5 diapositivas · una idea cada una', '#ffd04b', 5.4),
    chip('Que los datos coincidan con los apuntes', '#3be09a', 6.0),
  ]
  const editable = makePlane(2.4, 0.5, 200, drawEditable)
  const checks = CMP_Y.map(() => makePlane(0.5, 0.5, 128, drawCheck, 6))
  const links = CMP_Y.map(() => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, depthWrite: false, toneMapped: false }),
    )
    mesh.renderOrder = 4
    scene.add(mesh)
    return mesh
  })

  function place(card, x, y, s, opacity) {
    card.group.position.set(x, y, 0)
    card.group.scale.setScalar(safeScale(s))
    setCardOpacity(card, opacity)
  }
  const enter = (T, i) => {
    const a = i * PHASE + 0.1
    return { drop: (1 - smooth(seg(T, a, a + 0.5))) * 0.4, scale: lerp(0.94, 1, easeOutCubic(seg(T, a, a + 0.5))) }
  }

  function draw(t) {
    const T = t * MCP_PRACTICA4_DURATION
    const events = []
    stage.update(T, 0)
    stage.spot.position.set(0, 4.6, 5.5)
    const op = [0, 1, 2, 3, 4].map((i) => phaseOpacity(T, i))
    const e = [0, 1, 2, 3, 4].map((i) => enter(T, i))

    /* ---------- paso 0: esquema con Gemini en el documento ---------- */
    place(doc, DOC.x, PY - e[0].drop, e[0].scale, op[0])
    place(gemini, GEM.x, PY - e[0].drop, e[0].scale, op[0])
    outlineRows.forEach((row, i) => {
      const a = 0.9 + i * 0.42
      const k = easeOutCubic(seg(T, a, a + 0.4))
      row.position.set(GEM.x + lerp(0.6, 0, k), OUTLINE_Y[i] - 0.1, 0.15)
      shown(row, op[0] * smooth(seg(T, a, a + 0.2)))
      if (T >= a && T < a + 1) events.push({ t: a, x: GEM.x + 1.6, y: OUTLINE_Y[i] - 0.1, z: 0.8, color: i === 4 ? amberColor : cyanColor, speed: 1.1, life: 0.7 })
    })
    flashCard(gemini, bump(seg(T, 0.5, 1.3)) * 0.35)
    chips[0].scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 2.5, 3.0)))))
    shown(chips[0], op[0] * smooth(seg(T, 2.5, 2.9)))

    /* ---------- paso 1: Vía 1, PowerPoint ---------- */
    place(claude, CLAUDE.x, PY - e[1].drop, e[1].scale, op[1])
    const fileK = easeOutBack(seg(T, 4.6, 5.3))
    place(pptx, PPTX.x, PY - e[1].drop, safeScale(e[1].scale * fileK), op[1] * smooth(seg(T, 4.6, 4.9)))
    flashCard(pptx, bump(seg(T, 4.7, 5.5)) * 0.45)
    if (T >= 4.7 && T < 5.7) events.push({ t: 4.7, x: PPTX.x, y: PY, z: 1.0, color: amberColor, speed: 1.4, life: 0.8 })
    chips[1].scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 5.7, 6.2)))))
    shown(chips[1], op[1] * smooth(seg(T, 5.7, 6.1)))

    /* ---------- paso 2: Vía 2, Canva ---------- */
    place(canva, 0, PY - e[2].drop, e[2].scale, op[2])
    const drag = easeOutCubic(seg(T, 8.2, 9.0))
    editable.position.set(lerp(-2.6, -0.4, drag), lerp(PY - 0.25, PY + 0.55, drag), 0.2)
    editable.scale.setScalar(safeScale(1 + bump(seg(T, 8.2, 9.2)) * 0.08))
    shown(editable, op[2] * smooth(seg(T, 7.7, 8.1)))
    flashCard(canva, bump(seg(T, 8.9, 9.5)) * 0.3)
    chips[2].scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 9.0, 9.4)))))
    shown(chips[2], op[2] * smooth(seg(T, 9.0, 9.4)))

    /* ---------- paso 3: cinco diapositivas ---------- */
    slideCards.forEach((card, i) => {
      const a = 10.0 + i * 0.4
      const k = easeOutBack(seg(T, a, a + 0.45))
      place(card, SLIDE_X[i], PY + 0.2 - (1 - easeOutCubic(seg(T, a, a + 0.45))) * 0.4, safeScale(k), op[3] * smooth(seg(T, a, a + 0.2)))
      if (T >= a && T < a + 1) events.push({ t: a, x: SLIDE_X[i], y: PY + 0.2, z: 1.0, color: i === 4 ? amberColor : cyanColor, speed: 1.1, life: 0.7 })
    })
    flashCard(slideCards[4], bump(seg(T, 12.0, 12.8)) * 0.5)
    chips[3].scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 12.0, 12.5)))))
    shown(chips[3], op[3] * smooth(seg(T, 12.0, 12.4)))

    /* ---------- paso 4: datos contra apuntes ---------- */
    place(slidesCmp, -CMP_X, PY - e[4].drop, e[4].scale, op[4])
    place(notesCmp, CMP_X, PY - e[4].drop, e[4].scale, op[4])
    CMP_Y.forEach((y, i) => {
      const a = 13.2 + i * 0.45
      const k = easeOutCubic(seg(T, a, a + 0.4))
      const gap = CMP_X * 2 - CMP.w
      const rowY = PY + (0.5 - (0.3 + i * 0.205 + 0.03)) * CMP.h
      links[i].position.set(0, rowY, 0.12)
      links[i].scale.set(safeScale(gap * k), 0.06, 1)
      shown(links[i], op[4] * 0.8 * smooth(seg(T, a, a + 0.15)))
      checks[i].position.set(0, rowY, 0.3)
      checks[i].scale.setScalar(safeScale(easeOutBack(seg(T, a + 0.3, a + 0.7))))
      shown(checks[i], op[4] * smooth(seg(T, a + 0.3, a + 0.45)))
      if (T >= a + 0.3 && T < a + 1.3) events.push({ t: a + 0.3, x: 0, y: rowY, z: 0.9, color: greenColor, speed: 1.2, life: 0.8 })
    })
    flashCard(notesCmp, bump(seg(T, 13.2, 14.4)) * 0.3)
    chips[4].scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 14.6, 15.1)))))
    shown(chips[4], op[4] * smooth(seg(T, 14.6, 15.0)))

    bursts.update(T, events)
    return Math.min(4, Math.floor(T / PHASE))
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize: stage.resize, dispose }
}
