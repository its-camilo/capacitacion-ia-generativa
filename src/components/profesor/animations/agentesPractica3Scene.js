import * as THREE from 'three'
import { bump, easeInOutCubic, easeOutBack, easeOutCubic, lerp, roundRectPath, seg, smooth } from './threeKit'
import {
  FONT_BODY,
  FONT_MONO,
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
 * Escena “Flujo de retroalimentación con un agente: Hark” (Sesión 4, Práctica 3, Camino B).
 * Loop de 16 s en 5 fases de 3,2 s:
 *   0 se pegan en el chat de Hark los enlaces de la hoja S4-01 y la rúbrica 04 ·
 *   1 Hark reutiliza el formulario «Reflexión de unidad» (6 preguntas) y conecta la hoja ·
 *   2 cinco borradores en Gmail, uno por fila (E03, E08, E15, E19, E21), dirigidos a uno mismo ·
 *   3 revisión: [verificar] en E15 y E19 y aviso de que la rúbrica puede no haberse usado ·
 *   4 los borradores quedan en el Gmail @unal, nada se envía; se cambia de cuenta para verlos.
 * `draw(t)` es una función pura del tiempo dentro del loop.
 */
export const AGENTES_PRACTICA3_DURATION = 16

const AMBER = 0xf4cb18
const CYAN = 0x7fdcff
const GREEN = 0x3be09a

const PY = 3.1
const PHASE = 3.2
const CHIP_Y = PY - 2.78

const SHEET_LINK = 'S4-01 Respuestas ficticias de reflexión'
const RUBRIC_LINK = '04 Rúbrica de desarrollo'
const CODES = ['E03', 'E08', 'E15', 'E19', 'E21']
const VERIFY = {
  E15: 'sin logro ni enlace válido',
  E19: 'el −0,4 reconstruido',
}

/* fase 0 */
const CHAT = { x: 1.7, w: 5.6, h: 4.4 }
const LINKS = [
  { kind: 'sheet', text: SHEET_LINK, tag: 'Hoja', color: '#1f8a5b', y: PY + 0.95, v: 0.36, t: 0.7 },
  { kind: 'rubric', text: RUBRIC_LINK, tag: 'Rúbrica', color: '#7a5ac8', y: PY - 0.95, v: 0.56, t: 1.4 },
]
const LINK_CARD = { x: -5.0, w: 3.6, h: 1.5 }
const BUBBLE = { w: 3.9, h: 0.62 }
const chatX = (u) => CHAT.x + (u - 0.5) * CHAT.w
const chatY = (v) => PY + (0.5 - v) * CHAT.h
const BUBBLE_X = chatX(0.62)
const SEND = { u: 0.86, v: 0.86 }
const SEND_AT = 2.3

/* fase 1 */
const FORM = { x: -2.7, w: 4.6, h: 4.4 }
const SHEET = { x: 3.1, w: 4.0, h: 3.6 }
const QUESTION_V = [0.33, 0.43, 0.53, 0.63, 0.73, 0.83]

/* fases 2 a 4 */
const MAIL = { w: 7.8, h: 4.6 }
const ROW_W = 6.9
const ROW_H = 0.52
const ROW_Y = [PY + 1.22, PY + 0.6, PY - 0.02, PY - 0.64, PY - 1.26]
const TAG = { w: 3.3, h: 0.44, x: 1.55 }

/* fase 4: selector de cuenta */
const mailX = (u) => (u - 0.5) * MAIL.w
const mailY = (v) => PY + (0.5 - v) * MAIL.h
const ACCOUNT = { u: 0.25, v: 0.47, w: 0.36, h: 0.13 }
const FOLDER = { u: 0.72, v: 0.3, w: 0.44, h: 0.12 }
const SWITCH_AT = 13.9

const CURSOR_PATHS = [
  [
    [1.7, chatX(0.6), chatY(1.15)],
    [2.15, chatX(SEND.u), chatY(SEND.v)],
    [2.5, chatX(SEND.u), chatY(SEND.v)],
    [3.0, chatX(1.05), chatY(1.1)],
  ],
  [
    [13.1, mailX(0.62), mailY(1.05)],
    [13.75, mailX(ACCOUNT.u), mailY(ACCOUNT.v)],
    [14.1, mailX(ACCOUNT.u), mailY(ACCOUNT.v)],
    [14.6, mailX(FOLDER.u), mailY(FOLDER.v)],
  ],
]

function cursorAt(path, T) {
  const first = path[0]
  if (T <= first[0]) return { x: first[1], y: first[2] }
  for (let i = 1; i < path.length; i += 1) {
    const a = path[i - 1]
    const b = path[i]
    if (T <= b[0]) {
      const k = easeInOutCubic(seg(T, a[0], b[0]))
      return { x: lerp(a[1], b[1], k), y: lerp(a[2], b[2], k) }
    }
  }
  const last = path[path.length - 1]
  return { x: last[1], y: last[2] }
}

function phaseOpacity(T, i) {
  const a = i * PHASE
  const b = a + PHASE
  return smooth(seg(T, a + 0.1, a + 0.6)) * (1 - smooth(seg(T, b - 0.35, b)))
}

/* ------------------------------------------------------------------ */
/* Texturas                                                            */
/* ------------------------------------------------------------------ */

function header(ctx, w, h, title, color = '#042361', right = '') {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = color
  ctx.fillRect(0, 0, w, h * 0.14)
  fitText(ctx, title, w * 0.05, h * 0.1, { weight: 800, size: h * 0.075, maxWidth: w * (right ? 0.68 : 0.9), color: '#ffffff' })
  if (right) fitText(ctx, right, w * 0.95, h * 0.1, { weight: 800, size: h * 0.07, maxWidth: w * 0.22, color: '#ffffff', align: 'right' })
}

function line(ctx, x, y, width, height = 12, color = 'rgba(4,35,97,0.2)') {
  ctx.fillStyle = color
  roundRectPath(ctx, x, y, width, height, height / 2)
  ctx.fill()
}

function drawLinkCard(ctx, w, h, link) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = link.color
  ctx.fillRect(0, 0, w * 0.05, h)
  ctx.fillStyle = link.color
  roundRectPath(ctx, w * 0.1, h * 0.14, w * 0.3, h * 0.26, h * 0.13)
  ctx.fill()
  fitText(ctx, link.tag, w * 0.25, h * 0.33, { weight: 800, size: h * 0.17, maxWidth: w * 0.26, color: '#ffffff', align: 'center' })
  fitText(ctx, 'Drive · enlace', w * 0.93, h * 0.33, { weight: 600, size: h * 0.14, family: FONT_BODY, maxWidth: w * 0.45, color: 'rgba(4,35,97,0.55)', align: 'right' })
  fitText(ctx, link.text, w * 0.1, h * 0.7, { weight: 800, size: h * 0.2, maxWidth: w * 0.84, color: '#042361' })
}

function drawChat(ctx, w, h) {
  header(ctx, w, h, 'Hark', '#042361', 'Agente')
  fitText(ctx, 'Pegue aquí los enlaces de la hoja y la rúbrica.', w * 0.06, h * 0.23, {
    weight: 500,
    size: h * 0.045,
    family: FONT_BODY,
    maxWidth: w * 0.88,
    color: 'rgba(4,35,97,0.6)',
  })
  // caja de entrada y botón de enviar
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(4,35,97,0.2)'
  ctx.lineWidth = 4
  roundRectPath(ctx, w * 0.05, h * 0.8, w * 0.74, h * 0.12, h * 0.06)
  ctx.fill()
  ctx.stroke()
  fitText(ctx, 'Escriba a Hark…', w * 0.09, h * 0.875, { weight: 500, size: h * 0.045, family: FONT_BODY, maxWidth: w * 0.6, color: 'rgba(4,35,97,0.4)' })
  ctx.fillStyle = '#f4cb18'
  ctx.beginPath()
  ctx.arc(w * SEND.u, h * SEND.v, h * 0.06, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#042361'
  ctx.beginPath()
  ctx.moveTo(w * SEND.u - h * 0.022, h * SEND.v - h * 0.028)
  ctx.lineTo(w * SEND.u + h * 0.03, h * SEND.v)
  ctx.lineTo(w * SEND.u - h * 0.022, h * SEND.v + h * 0.028)
  ctx.closePath()
  ctx.fill()
}

function drawBubble(ctx, w, h, link) {
  ctx.fillStyle = '#dbe8ff'
  roundRectPath(ctx, 2, 2, w - 4, h - 4, h * 0.3)
  ctx.fill()
  ctx.fillStyle = link.color
  ctx.beginPath()
  ctx.arc(h * 0.5, h * 0.5, h * 0.24, 0, Math.PI * 2)
  ctx.fill()
  // eslabón de enlace
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = h * 0.06
  ctx.beginPath()
  ctx.arc(h * 0.44, h * 0.5, h * 0.08, Math.PI * 0.5, Math.PI * 1.5)
  ctx.moveTo(h * 0.56, h * 0.42)
  ctx.arc(h * 0.56, h * 0.5, h * 0.08, -Math.PI * 0.5, Math.PI * 0.5)
  ctx.stroke()
  fitText(ctx, link.text, h * 0.9, h * 0.62, { weight: 700, size: h * 0.34, maxWidth: w - h * 1.1, color: '#042361' })
}

function drawForm(ctx, w, h) {
  header(ctx, w, h, 'Reflexión de unidad', '#673ab7', 'Formulario')
  fitText(ctx, '6 preguntas', w * 0.06, h * 0.23, { weight: 700, size: h * 0.05, family: FONT_BODY, maxWidth: w * 0.5, color: 'rgba(4,35,97,0.6)' })
  QUESTION_V.forEach((v, i) => {
    ctx.fillStyle = '#673ab7'
    ctx.beginPath()
    ctx.arc(w * 0.1, h * v, h * 0.032, 0, Math.PI * 2)
    ctx.fill()
    fitText(ctx, String(i + 1), w * 0.1, h * (v + 0.017), { weight: 800, size: h * 0.042, color: '#ffffff', align: 'center' })
    line(ctx, w * 0.18, h * v - 10, w * (i % 2 ? 0.58 : 0.7), 14)
    line(ctx, w * 0.18, h * v + 12, w * 0.42, 10, 'rgba(4,35,97,0.1)')
  })
}

function drawSheet(ctx, w, h) {
  header(ctx, w, h, SHEET_LINK, '#1f8a5b')
  ctx.fillStyle = '#e3f3ea'
  ctx.fillRect(w * 0.03, h * 0.19, w * 0.94, h * 0.1)
  ;['Código', 'Respuestas'].forEach((text, i) =>
    fitText(ctx, text, w * [0.07, 0.34][i], h * 0.265, { weight: 800, size: h * 0.06, maxWidth: w * 0.3, color: '#14633f' }),
  )
  CODES.forEach((code, r) => {
    const v = 0.38 + r * 0.12
    fitText(ctx, code, w * 0.07, h * (v + 0.025), { weight: 700, size: h * 0.065, family: FONT_MONO, maxWidth: w * 0.2, color: '#042361' })
    line(ctx, w * 0.34, h * v - 6, w * (r % 2 ? 0.44 : 0.56), 14)
  })
}

function drawMail(ctx, w, h, title) {
  header(ctx, w, h, title, '#c0392b', 'Gmail')
}

function drawAccountMail(ctx, w, h) {
  header(ctx, w, h, 'Gmail · cuenta @unal', '#c0392b')
  // menú para cambiar de cuenta
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(4,35,97,0.18)'
  ctx.lineWidth = 4
  roundRectPath(ctx, w * 0.05, h * 0.22, w * 0.4, h * 0.5, 18)
  ctx.fill()
  ctx.stroke()
  fitText(ctx, 'Cambiar de cuenta', w * 0.08, h * 0.3, { weight: 800, size: h * 0.055, maxWidth: w * 0.34, color: '#042361' })
  ctx.fillStyle = '#fde9e6'
  roundRectPath(ctx, w * (ACCOUNT.u - ACCOUNT.w / 2), h * (ACCOUNT.v - ACCOUNT.h / 2), w * ACCOUNT.w, h * ACCOUNT.h, 14)
  ctx.fill()
  ctx.fillStyle = '#c0392b'
  ctx.beginPath()
  ctx.arc(w * 0.11, h * ACCOUNT.v, h * 0.035, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, '@unal', w * 0.15, h * (ACCOUNT.v + 0.02), { weight: 800, size: h * 0.06, family: FONT_MONO, maxWidth: w * 0.25, color: '#042361' })
  ctx.fillStyle = 'rgba(4,35,97,0.25)'
  ctx.beginPath()
  ctx.arc(w * 0.11, h * 0.62, h * 0.035, 0, Math.PI * 2)
  ctx.fill()
  line(ctx, w * 0.15, h * 0.62 - 7, w * 0.22, 14, 'rgba(4,35,97,0.15)')
  // carpeta de borradores
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(4,35,97,0.18)'
  roundRectPath(ctx, w * 0.5, h * 0.22, w * 0.45, h * 0.7, 18)
  ctx.fill()
  ctx.stroke()
  fitText(ctx, 'Borradores', w * 0.54, h * (FOLDER.v + 0.02), { weight: 800, size: h * 0.06, maxWidth: w * 0.26, color: '#042361' })
  ctx.fillStyle = '#c0392b'
  roundRectPath(ctx, w * 0.85, h * (FOLDER.v - 0.035), w * 0.07, h * 0.07, h * 0.035)
  ctx.fill()
  fitText(ctx, '5', w * 0.885, h * (FOLDER.v + 0.02), { weight: 800, size: h * 0.05, color: '#ffffff', align: 'center' })
  CODES.forEach((code, i) => {
    const v = 0.43 + i * 0.1
    fitText(ctx, code, w * 0.55, h * (v + 0.018), { weight: 700, size: h * 0.05, family: FONT_MONO, maxWidth: w * 0.1, color: '#042361' })
    line(ctx, w * 0.67, h * v - 6, w * 0.22, 12)
  })
  fitText(ctx, 'Para: usted mismo', w * 0.08, h * 0.84, { weight: 600, size: h * 0.05, family: FONT_BODY, maxWidth: w * 0.36, color: 'rgba(4,35,97,0.6)' })
}

function drawDraftRow(ctx, w, h, code) {
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(192,57,43,0.4)'
  ctx.lineWidth = 5
  roundRectPath(ctx, 4, 4, w - 8, h - 8, h / 4)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#c0392b'
  roundRectPath(ctx, w * 0.025, h * 0.25, w * 0.14, h * 0.5, h * 0.25)
  ctx.fill()
  fitText(ctx, 'Borrador', w * 0.095, h * 0.6, { weight: 800, size: h * 0.3, maxWidth: w * 0.12, color: '#ffffff', align: 'center' })
  fitText(ctx, code, w * 0.19, h * 0.66, { weight: 800, size: h * 0.46, family: FONT_MONO, maxWidth: w * 0.11, color: '#042361' })
  fitText(ctx, 'Para: usted mismo', w * 0.32, h * 0.63, { weight: 600, size: h * 0.32, family: FONT_BODY, maxWidth: w * 0.22, color: 'rgba(4,35,97,0.6)' })
  line(ctx, w * 0.57, h * 0.34, w * 0.33, 12)
  line(ctx, w * 0.57, h * 0.56, w * 0.22, 10, 'rgba(4,35,97,0.12)')
}

function drawTag(ctx, w, h, note) {
  ctx.fillStyle = '#fff5cc'
  ctx.strokeStyle = '#f4cb18'
  ctx.lineWidth = 5
  roundRectPath(ctx, 3, 3, w - 6, h - 6, h * 0.3)
  ctx.fill()
  ctx.stroke()
  fitText(ctx, '[verificar]', w * 0.04, h * 0.64, { weight: 800, size: h * 0.42, family: FONT_MONO, maxWidth: w * 0.36, color: '#8a6a00' })
  fitText(ctx, note, w * 0.43, h * 0.63, { weight: 700, size: h * 0.36, family: FONT_BODY, maxWidth: w * 0.54, color: '#042361' })
}

function drawChip(ctx, w, h, text, fill, ink = '#042361') {
  ctx.fillStyle = fill
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fill()
  fitText(ctx, text, w / 2, h * 0.67, { weight: 800, size: h * 0.46, maxWidth: w * 0.9, color: ink, align: 'center' })
}

function drawTitle(ctx, w, h) {
  fitText(ctx, 'Flujo de retroalimentación con un agente: Hark', w / 2, h * 0.68, {
    weight: 800,
    size: h * 0.55,
    maxWidth: w * 0.96,
    color: '#ffffff',
    align: 'center',
  })
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

const plainTex = (invalidate) =>
  makeTex(
    16,
    16,
    (ctx, w, h) => {
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, w, h)
    },
    invalidate,
  )

/* ------------------------------------------------------------------ */

export default function createAgentesPractica3Scene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: AGENTES_PRACTICA3_DURATION,
    frame: { wideHalfW: 8.7, narrowHalfW: 6.2, halfH: 4.45, camY: 5.0, lookY: 3.3 },
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 10, perBurst: 18, seed: 73 })
  scene.add(bursts.points)
  const amberColor = new THREE.Color(AMBER)
  const cyanColor = new THREE.Color(CYAN)
  const greenColor = new THREE.Color(GREEN)

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

  const flat = plainTex(invalidate)
  const makeBar = (color) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: flat, color, transparent: true, depthWrite: false, toneMapped: false }),
    )
    mesh.renderOrder = 4
    scene.add(mesh)
    return mesh
  }
  const shown = (obj, k) => {
    obj.material.opacity = k
    obj.visible = k > 0.01
  }
  const chip = (w, text, fill) => {
    const mesh = makeTextPlane(w, 0.64, makeTex(Math.round(w * 200), 128, (ctx, cw, ch) => drawChip(ctx, cw, ch, text, fill), invalidate))
    mesh.position.set(0, CHIP_Y, 0.3)
    mesh.renderOrder = 6
    scene.add(mesh)
    return mesh
  }
  const showChip = (mesh, T, a, opacity) => {
    mesh.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, a, a + 0.5)))))
    shown(mesh, opacity * smooth(seg(T, a, a + 0.4)))
  }

  /* título fijo */
  const title = makeTextPlane(10.5, 0.62, makeTex(2100, 124, drawTitle, invalidate))
  title.position.set(0, PY + 3.05, 0.1)
  scene.add(title)

  /* ---------- fase 0: enlaces y chat de Hark ---------- */
  const chat = makeCard(CHAT, drawChat, { emissive: '#7fdcff' })
  scene.add(chat.group)
  const links = LINKS.map((link) => {
    const card = makeCard(LINK_CARD, (ctx, w, h) => drawLinkCard(ctx, w, h, link), { emissive: '#f4cb18' })
    scene.add(card.group)
    const bubble = makeTextPlane(BUBBLE.w, BUBBLE.h, makeTex(780, 124, (ctx, w, h) => drawBubble(ctx, w, h, link), invalidate))
    bubble.renderOrder = 5
    scene.add(bubble)
    const beam = makeBeam(AMBER, 0.8)
    scene.add(beam)
    return { ...link, card, bubble, beam }
  })
  const sendRing = makeShockRing(CYAN)
  scene.add(sendRing)
  const pasteChip = chip(4.6, 'Dos enlaces en el chat de Hark', '#7fdcff')

  /* ---------- fase 1: formulario y hoja ---------- */
  const form = makeCard(FORM, drawForm, { emissive: '#3be09a' })
  const sheet = makeCard(SHEET, drawSheet, { emissive: '#7fdcff' })
  scene.add(form.group)
  scene.add(sheet.group)
  const questionBar = makeBar(0xb39ddb)
  const reuseBadge = makeTextPlane(2.6, 0.5, makeTex(520, 100, (ctx, w, h) => drawChip(ctx, w, h, 'Ya existe: se reutiliza', '#3be09a'), invalidate))
  reuseBadge.renderOrder = 6
  scene.add(reuseBadge)
  const reuseRing = makeShockRing(GREEN)
  scene.add(reuseRing)
  const linkBeam = makeBeam(CYAN, 0.85)
  scene.add(linkBeam)
  const reuseChip = chip(6.4, 'Reutiliza el formulario; no crea uno nuevo', '#3be09a')

  /* ---------- fases 2 y 3: borradores ---------- */
  const mailA = makeCard(MAIL, (ctx, w, h) => drawMail(ctx, w, h, 'Borradores'), { emissive: '#f4cb18' })
  const mailB = makeCard(MAIL, (ctx, w, h) => drawMail(ctx, w, h, 'Borradores · revisión'), { emissive: '#f4cb18' })
  scene.add(mailA.group)
  scene.add(mailB.group)
  const makeRows = () =>
    CODES.map((code, i) => {
      const mesh = makeTextPlane(ROW_W, ROW_H, makeTex(1104, 84, (ctx, w, h) => drawDraftRow(ctx, w, h, code), invalidate))
      mesh.renderOrder = 5
      scene.add(mesh)
      return { code, mesh, y: ROW_Y[i] }
    })
  const draftRows = makeRows()
  const reviewRows = makeRows()
  const toChip = chip(5.2, 'Uno por fila, dirigidos a usted mismo', '#ffd98a')

  const checkTex = makeTex(128, 128, drawCheck, invalidate)
  const tags = reviewRows.map((row) => {
    const note = VERIFY[row.code]
    let mesh
    if (note) {
      mesh = makeTextPlane(TAG.w, TAG.h, makeTex(792, 106, (ctx, w, h) => drawTag(ctx, w, h, note), invalidate))
    } else {
      mesh = makeTextPlane(0.42, 0.42, checkTex)
    }
    mesh.renderOrder = 7
    scene.add(mesh)
    const ring = makeShockRing(note ? AMBER : GREEN)
    scene.add(ring)
    return { mesh, ring, verify: Boolean(note) }
  })
  const rubricChip = chip(6.2, 'Atención: la rúbrica puede no haberse usado', '#f4cb18')

  /* ---------- fase 4: Gmail @unal ---------- */
  const account = makeCard(MAIL, drawAccountMail, { emissive: '#3be09a' })
  scene.add(account.group)
  const accountGlow = makeBar(0xff8a70)
  const folderGlow = makeBar(GREEN)
  const switchRing = makeShockRing(CYAN)
  scene.add(switchRing)
  const noSendChip = chip(6.6, 'Nada se envía; cambie a la cuenta @unal para verlos', '#3be09a')

  const cursor = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: makeCursorTexture(), transparent: true, depthWrite: false, depthTest: false }),
  )
  cursor.renderOrder = 20
  scene.add(cursor)

  const pA = new THREE.Vector3()
  const pB = new THREE.Vector3()
  const pC = new THREE.Vector3()

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
    const T = t * AGENTES_PRACTICA3_DURATION
    const events = []
    stage.update(T, 0)
    stage.spot.position.set(0, 4.6, 5.5)
    const op = [0, 1, 2, 3, 4].map((i) => phaseOpacity(T, i))
    const e = [0, 1, 2, 3, 4].map((i) => enter(T, i))

    title.material.opacity = 0.92
    title.visible = true

    /* ---------- paso 0: pegar los dos enlaces ---------- */
    place(chat, CHAT.x, PY - e[0].drop, e[0].scale, op[0])
    flashCard(chat, bump(seg(T, SEND_AT, SEND_AT + 0.7)) * 0.4)
    links.forEach((link) => {
      place(link.card, LINK_CARD.x, link.y - e[0].drop, e[0].scale, op[0])
      flashCard(link.card, bump(seg(T, link.t, link.t + 0.6)) * 0.5)
      const by = chatY(link.v)
      const travel = easeInOutCubic(seg(T, link.t, link.t + 0.5))
      pA.set(LINK_CARD.x + LINK_CARD.w / 2, link.y, 0.25)
      pB.set(BUBBLE_X - BUBBLE.w / 2, by, 0.25)
      pC.copy(pA).lerp(pB, travel)
      setBeam(link.beam, pA, pC, 0.035)
      link.beam.material.opacity = 0.8 * op[0] * (1 - smooth(seg(T, link.t + 0.7, link.t + 1.1)))
      if (travel < 0.001 || link.beam.material.opacity < 0.01) link.beam.visible = false
      const k = easeOutCubic(seg(T, link.t + 0.4, link.t + 0.8))
      link.bubble.position.set(BUBBLE_X + (1 - k) * 0.5, by, 0.2)
      shown(link.bubble, op[0] * smooth(seg(T, link.t + 0.4, link.t + 0.6)))
      if (T >= link.t + 0.4 && T < link.t + 1.3) events.push({ t: link.t + 0.45, x: BUBBLE_X - BUBBLE.w / 2, y: by, z: 0.8, color: amberColor, speed: 1.2, life: 0.8 })
    })
    setShockRing(sendRing, T - SEND_AT, 0.8, 0.9)
    sendRing.position.set(chatX(SEND.u), chatY(SEND.v), 0.4)
    if (T >= SEND_AT && T < SEND_AT + 1) events.push({ t: SEND_AT, x: chatX(SEND.u), y: chatY(SEND.v), z: 0.9, color: cyanColor, speed: 1.4, life: 0.8 })
    showChip(pasteChip, T, 2.4, op[0])

    /* ---------- paso 1: formulario existente + hoja ---------- */
    place(form, FORM.x, PY - e[1].drop, e[1].scale, op[1])
    place(sheet, SHEET.x, PY - e[1].drop, e[1].scale, op[1])
    const qK = seg(T, 3.8, 5.0) * QUESTION_V.length
    const qIndex = Math.min(QUESTION_V.length - 1, Math.floor(qK))
    questionBar.position.set(FORM.x, PY + (0.5 - QUESTION_V[qIndex]) * FORM.h - e[1].drop, 0.1)
    questionBar.scale.set(FORM.w - 0.3, 0.4, 1)
    shown(questionBar, op[1] * 0.3 * smooth(seg(T, 3.8, 4.0)) * (1 - smooth(seg(T, 5.0, 5.3))))
    const badgeK = easeOutBack(seg(T, 4.2, 4.7))
    reuseBadge.position.set(FORM.x + 0.7, PY + FORM.h / 2 - 0.95, 0.3)
    reuseBadge.scale.setScalar(safeScale(badgeK))
    shown(reuseBadge, op[1] * smooth(seg(T, 4.2, 4.4)))
    setShockRing(reuseRing, T - 4.25, 0.9, 1.4)
    reuseRing.position.set(FORM.x + 0.7, PY + FORM.h / 2 - 0.95, 0.35)
    flashCard(form, bump(seg(T, 4.2, 5.0)) * 0.4)
    if (T >= 4.25 && T < 5.2) events.push({ t: 4.25, x: FORM.x + 0.7, y: PY + FORM.h / 2 - 0.95, z: 0.8, color: greenColor, speed: 1.3, life: 0.8 })
    const lTravel = easeInOutCubic(seg(T, 5.0, 5.6))
    pA.set(FORM.x + FORM.w / 2, PY, 0.25)
    pB.set(SHEET.x - SHEET.w / 2, PY, 0.25)
    pC.copy(pA).lerp(pB, lTravel)
    setBeam(linkBeam, pA, pC, 0.04 + 0.01 * Math.sin(T * 7))
    linkBeam.material.opacity = 0.85 * op[1]
    if (lTravel < 0.001 || op[1] < 0.01) linkBeam.visible = false
    flashCard(sheet, bump(seg(T, 5.5, 6.2)) * 0.4)
    if (T >= 5.6 && T < 6.4) events.push({ t: 5.6, x: SHEET.x - SHEET.w / 2, y: PY, z: 0.8, color: cyanColor, speed: 1.3, life: 0.8 })
    showChip(reuseChip, T, 5.4, op[1])

    /* ---------- paso 2: cinco borradores ---------- */
    place(mailA, 0, PY - e[2].drop, e[2].scale, op[2])
    draftRows.forEach((row, i) => {
      const a = 7.0 + i * 0.35
      const k = easeOutCubic(seg(T, a, a + 0.45))
      row.mesh.position.set(lerp(-1.4, 0, k), row.y, 0.2)
      shown(row.mesh, op[2] * smooth(seg(T, a, a + 0.25)))
      if (T >= a && T < a + 0.9) events.push({ t: a, x: ROW_W / 2 - 0.3, y: row.y, z: 0.9, color: amberColor, speed: 1.1, life: 0.7 })
    })
    showChip(toChip, T, 8.9, op[2])

    /* ---------- paso 3: revisar ---------- */
    place(mailB, 0, PY - e[3].drop, e[3].scale, op[3])
    reviewRows.forEach((row, i) => {
      row.mesh.position.set(0, row.y, 0.2)
      shown(row.mesh, op[3] * smooth(seg(T, 9.9, 10.3)))
      const tag = tags[i]
      const a = tag.verify ? (row.code === 'E15' ? 10.5 : 11.0) : 10.4 + i * 0.12
      const x = tag.verify ? TAG.x : ROW_W / 2 - 0.4
      tag.mesh.position.set(x, row.y, 0.3)
      tag.mesh.scale.setScalar(safeScale(easeOutBack(seg(T, a, a + 0.4))))
      shown(tag.mesh, op[3] * smooth(seg(T, a, a + 0.12)))
      setShockRing(tag.ring, tag.verify ? T - a : -1, 0.9, 1.6)
      tag.ring.position.set(x, row.y, 0.35)
      if (tag.verify && T >= a && T < a + 0.9) events.push({ t: a, x, y: row.y, z: 0.9, color: amberColor, speed: 1.3, life: 0.8 })
    })
    flashCard(mailB, bump(seg(T, 11.5, 12.3)) * 0.35)
    showChip(rubricChip, T, 11.6, op[3])

    /* ---------- paso 4: Gmail @unal, nada se envía ---------- */
    place(account, 0, PY - e[4].drop, e[4].scale, op[4])
    const ax = mailX(ACCOUNT.u)
    const ay = mailY(ACCOUNT.v)
    accountGlow.position.set(ax, ay, 0.1)
    accountGlow.scale.set(MAIL.w * ACCOUNT.w + 0.15, MAIL.h * ACCOUNT.h + 0.12, 1)
    const pulse = 0.2 + 0.12 * Math.sin(T * 6)
    shown(accountGlow, op[4] * (T < SWITCH_AT ? pulse * smooth(seg(T, 13.2, 13.5)) : 0.45 * (1 - smooth(seg(T, 14.4, 14.9)))))
    setShockRing(switchRing, T - SWITCH_AT, 0.9, 1.0)
    switchRing.position.set(ax, ay, 0.4)
    if (T >= SWITCH_AT && T < SWITCH_AT + 1) events.push({ t: SWITCH_AT, x: ax, y: ay, z: 1.0, color: cyanColor, speed: 1.3, life: 0.8 })
    folderGlow.position.set(mailX(FOLDER.u), mailY(FOLDER.v), 0.1)
    folderGlow.scale.set(MAIL.w * FOLDER.w, MAIL.h * FOLDER.h, 1)
    shown(folderGlow, op[4] * 0.35 * smooth(seg(T, 14.3, 14.7)))
    flashCard(account, bump(seg(T, 14.3, 15.1)) * 0.35)
    if (T >= 14.4 && T < 15.3) events.push({ t: 14.4, x: mailX(FOLDER.u), y: mailY(FOLDER.v), z: 0.9, color: greenColor, speed: 1.3, life: 0.8 })
    showChip(noSendChip, T, 14.5, op[4])

    /* ---------- cursor (pegar/enviar y cambiar de cuenta) ---------- */
    const inFirst = T < 6
    const path = inFirst ? CURSOR_PATHS[0] : CURSOR_PATHS[1]
    const clickAt = inFirst ? SEND_AT : SWITCH_AT
    const c = cursorAt(path, T)
    const clickK = bump(seg(T, clickAt, clickAt + 0.25))
    cursor.position.set(c.x + 0.31, c.y - 0.41 - clickK * 0.06, 2.0)
    cursor.scale.setScalar(1 - clickK * 0.1)
    cursor.material.opacity = inFirst
      ? smooth(seg(T, 1.7, 1.95)) * (1 - smooth(seg(T, 2.8, 3.05)))
      : smooth(seg(T, 13.1, 13.35)) * (1 - smooth(seg(T, 15.0, 15.4)))
    cursor.visible = cursor.material.opacity > 0.01

    bursts.update(T, events)
    return Math.min(4, Math.floor(T / PHASE))
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize: stage.resize, dispose }
}
