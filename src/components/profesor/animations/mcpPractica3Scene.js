import * as THREE from 'three'
import { bump, easeInOutCubic, easeOutBack, easeOutCubic, lerp, roundRectPath, seg, smooth } from './threeKit'
import {
  FONT_BODY,
  FONT_MONO,
  createBurstSystem,
  createStage,
  fitText,
  flashCard,
  makeCursorTexture,
  makeShockRing,
  makeSlabCard,
  makeTex,
  makeTextPlane,
  safeScale,
  setCardOpacity,
  setShockRing,
} from './stageKit'

/**
 * Escena “Retroalimentación personalizada, sin enviar” (Sesión 3, Práctica 3).
 * Loop de 16 s en 5 fases de 3,2 s:
 *   0 datos de E04, E11 y E19 + rúbrica · 1 tres borradores en Gmail ·
 *   2 autorizar «Permitir una vez» · 3 revisar los tres sin enviar ·
 *   4 nunca «Permitir siempre» para enviar.
 * `draw(t)` es una función pura del tiempo dentro del loop.
 */
export const MCP_PRACTICA3_DURATION = 16

const GREEN = 0x3be09a
const CYAN = 0x7fdcff
const RED = 0xff6b5e

const PY = 3.1
const PHASE = 3.2
const CODES = ['E04', 'E11', 'E19']
const SHEET = { x: -2.8, w: 4.8, h: 3.8 }
const RUBRIC = { x: 2.9, w: 3.4, h: 3.8 }
const MAIL = { w: 8, h: 4.6 }
const DIALOG = { w: 6.6, h: 4.0 }
const SHEET_ROWS_V = [0.4, 0.6, 0.8]
const ROW_W = 5.6
const ROW_H = 0.8
const ROW_Y = [PY + 0.95, PY, PY - 0.95]

/* botones del diálogo (coordenadas u,v de la tarjeta) */
const BTN_ONCE = { u: 0.29, v: 0.76, w: 0.4, h: 0.16 }
const BTN_ALWAYS = { u: 0.72, v: 0.76, w: 0.4, h: 0.16 }
const dialogX = (u) => (u - 0.5) * DIALOG.w
const dialogY = (v) => PY + (0.5 - v) * DIALOG.h
const CLICK_AT = 7.9
const CURSOR_PATH = [
  [6.6, 3.2, 1.0],
  [7.7, dialogX(BTN_ONCE.u), dialogY(BTN_ONCE.v)],
  [8.2, dialogX(BTN_ONCE.u), dialogY(BTN_ONCE.v)],
  [9.2, 3.4, 1.2],
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
  header(ctx, w, h, 'Notas del curso (ficticio)', '#1f8a5b')
  ctx.fillStyle = '#e3f3ea'
  ctx.fillRect(w * 0.03, h * 0.2, w * 0.94, h * 0.1)
  ;['Código', 'Corte 1', 'Corte 2', 'Obs.'].forEach((text, i) =>
    fitText(ctx, text, w * [0.06, 0.3, 0.5, 0.7][i], h * 0.275, { weight: 800, size: h * 0.06, maxWidth: w * 0.18, color: '#14633f' }),
  )
  ;[0.4, 0.5, 0.6, 0.7, 0.8].forEach((v, r) => {
    if (r % 2 === 1) {
      fitText(ctx, '⋮', w * 0.07, h * (v + 0.045), { weight: 800, size: h * 0.09, color: 'rgba(4,35,97,0.5)' })
      return
    }
    fitText(ctx, CODES[r / 2], w * 0.06, h * (v + 0.03), { weight: 700, size: h * 0.075, family: FONT_MONO, maxWidth: w * 0.2, color: '#042361' })
    ;[0.3, 0.5, 0.7].forEach((u, i) => line(ctx, w * u, h * (v - 0.005), w * (i === 2 ? 0.24 : 0.12), 14))
  })
}

function drawRubric(ctx, w, h) {
  header(ctx, w, h, '04 Rúbrica de desarrollo', '#7a5ac8')
  for (let i = 0; i < 4; i += 1) {
    const y = h * (0.24 + i * 0.17)
    ctx.strokeStyle = '#7a5ac8'
    ctx.lineWidth = 5
    roundRectPath(ctx, w * 0.07, y, w * 0.08, w * 0.08, 6)
    ctx.stroke()
    line(ctx, w * 0.2, y + 2, w * 0.7, 14)
    line(ctx, w * 0.2, y + 28, w * 0.5, 12, 'rgba(4,35,97,0.12)')
  }
}

function drawMail(ctx, w, h, title) {
  header(ctx, w, h, title, '#c0392b')
  fitText(ctx, 'Gmail', w * 0.95, h * 0.1, { weight: 800, size: h * 0.075, color: '#ffffff', align: 'right' })
}

function drawDialog(ctx, w, h) {
  header(ctx, w, h, 'Claude pide permiso', '#34425f')
  fitText(ctx, 'Usar la herramienta', w * 0.06, h * 0.3, { weight: 500, size: h * 0.06, family: FONT_BODY, maxWidth: w * 0.88, color: 'rgba(4,35,97,0.7)' })
  fitText(ctx, 'Create draft email', w * 0.06, h * 0.45, { weight: 800, size: h * 0.11, family: FONT_MONO, maxWidth: w * 0.88, color: '#042361' })
  fitText(ctx, 'Crea borradores en su Gmail; no envía nada.', w * 0.06, h * 0.58, { weight: 500, size: h * 0.055, family: FONT_BODY, maxWidth: w * 0.88, color: 'rgba(4,35,97,0.7)' })
  drawButton(ctx, w, h, BTN_ONCE, 'Permitir una vez', '#3be09a', '#042361')
  drawButton(ctx, w, h, BTN_ALWAYS, 'Permitir siempre', '#e3e9f6', 'rgba(4,35,97,0.55)')
}

function drawButton(ctx, w, h, b, text, fill, ink) {
  ctx.fillStyle = fill
  roundRectPath(ctx, w * (b.u - b.w / 2), h * (b.v - b.h / 2), w * b.w, h * b.h, h * 0.05)
  ctx.fill()
  fitText(ctx, text, w * b.u, h * (b.v + 0.02), { weight: 800, size: h * 0.065, maxWidth: w * b.w * 0.9, color: ink, align: 'center' })
}

function drawWarn(ctx, w, h) {
  header(ctx, w, h, 'Autorice crear, no enviar', '#8a2c2c')
  ;[
    ['Crear borradores', 'Permitir una vez', 0.38],
    ['Enviar correos', 'Permitir siempre', 0.66],
  ].forEach(([what, how, v]) => {
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = 'rgba(4,35,97,0.16)'
    ctx.lineWidth = 3
    roundRectPath(ctx, w * 0.05, h * (v - 0.1), w * 0.9, h * 0.2, 18)
    ctx.fill()
    ctx.stroke()
    fitText(ctx, what, w * 0.09, h * (v + 0.02), { weight: 800, size: h * 0.075, maxWidth: w * 0.4, color: '#042361' })
    fitText(ctx, how, w * 0.76, h * (v + 0.02), { weight: 700, size: h * 0.06, family: FONT_BODY, maxWidth: w * 0.3, color: 'rgba(4,35,97,0.7)', align: 'center' })
  })
  fitText(ctx, 'Un envío equivocado es un problema de privacidad.', w * 0.06, h * 0.92, { weight: 500, size: h * 0.05, family: FONT_BODY, maxWidth: w * 0.88, color: 'rgba(4,35,97,0.65)' })
}

function drawDraftRow(ctx, w, h, code) {
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(192,57,43,0.4)'
  ctx.lineWidth = 6
  roundRectPath(ctx, 4, 4, w - 8, h - 8, h / 4)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#c0392b'
  roundRectPath(ctx, w * 0.03, h * 0.3, w * 0.17, h * 0.4, h * 0.2)
  ctx.fill()
  fitText(ctx, 'Borrador', w * 0.115, h * 0.6, { weight: 800, size: h * 0.26, maxWidth: w * 0.15, color: '#ffffff', align: 'center' })
  fitText(ctx, code, w * 0.24, h * 0.64, { weight: 800, size: h * 0.42, family: FONT_MONO, maxWidth: w * 0.14, color: '#042361' })
  line(ctx, w * 0.42, h * 0.3, w * 0.5, 14)
  line(ctx, w * 0.42, h * 0.56, w * 0.34, 12, 'rgba(4,35,97,0.12)')
}

function drawChip(ctx, w, h, text, fill, ink = '#042361') {
  ctx.fillStyle = fill
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fill()
  fitText(ctx, text, w / 2, h * 0.67, { weight: 800, size: h * 0.46, maxWidth: w * 0.9, color: ink, align: 'center' })
}

function drawGlyph(ctx, w, h, kind) {
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = w * 0.14
  if (kind === 'check') {
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
  } else {
    ctx.fillStyle = '#e5483b'
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.beginPath()
    ctx.moveTo(w * 0.32, h * 0.32)
    ctx.lineTo(w * 0.68, h * 0.68)
    ctx.moveTo(w * 0.68, h * 0.32)
    ctx.lineTo(w * 0.32, h * 0.68)
    ctx.stroke()
  }
}

const plainTex = (invalidate) => makeTex(16, 16, (ctx, w, h) => {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, w, h)
}, invalidate)

/* ------------------------------------------------------------------ */

export default function createMcpPractica3Scene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: MCP_PRACTICA3_DURATION,
    frame: { wideHalfW: 8.7, narrowHalfW: 6.2, halfH: 4.45, camY: 5.0, lookY: 3.3 },
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 10, perBurst: 18, seed: 59 })
  scene.add(bursts.points)
  const greenColor = new THREE.Color(GREEN)
  const cyanColor = new THREE.Color(CYAN)
  const redColor = new THREE.Color(RED)

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

  const sheet = makeCard(SHEET, drawSheet)
  const rubric = makeCard(RUBRIC, drawRubric)
  const mailA = makeCard(MAIL, (ctx, w, h) => drawMail(ctx, w, h, 'Borradores'), { emissive: '#ff6b5e' })
  const dialog = makeCard(DIALOG, drawDialog, { emissive: '#3be09a' })
  const mailB = makeCard(MAIL, (ctx, w, h) => drawMail(ctx, w, h, 'Borradores · revisión'), { emissive: '#3be09a' })
  const warn = makeCard(DIALOG, drawWarn, { emissive: '#ff6b5e' })
  const allCards = [sheet, rubric, mailA, dialog, mailB, warn]
  allCards.forEach((card) => scene.add(card.group))

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

  /* fase 0: resaltado de las tres filas y chip */
  const highlights = SHEET_ROWS_V.map(() => makeBar(0xffd04b))
  const dataChip = makeTextPlane(4.6, 0.7, makeTex(920, 140, (ctx, w, h) => drawChip(ctx, w, h, 'E04 · E11 · E19 + rúbrica', '#ffd04b'), invalidate))
  dataChip.position.set(0, PY - 2.65, 0.3)
  scene.add(dataChip)

  /* fases 1 y 3: filas de borrador */
  const makeRows = () =>
    CODES.map((code, i) => {
      const mesh = makeTextPlane(ROW_W, ROW_H, makeTex(840, 120, (ctx, w, h) => drawDraftRow(ctx, w, h, code), invalidate))
      mesh.renderOrder = 5
      scene.add(mesh)
      return { mesh, y: ROW_Y[i] }
    })
  const draftRows = makeRows()
  const reviewRows = makeRows()
  const toChip = makeTextPlane(3.6, 0.62, makeTex(720, 124, (ctx, w, h) => drawChip(ctx, w, h, 'Para: usted mismo', '#ffb3aa'), invalidate))
  toChip.position.set(0, PY - 2.65, 0.3)
  scene.add(toChip)

  const glyph = (kind) => {
    const mesh = makeTextPlane(0.5, 0.5, makeTex(128, 128, (ctx, w, h) => drawGlyph(ctx, w, h, kind), invalidate))
    mesh.renderOrder = 6
    scene.add(mesh)
    return mesh
  }
  const checks = CODES.map(() => glyph('check'))
  const noSend = makeTextPlane(3.0, 0.66, makeTex(600, 132, (ctx, w, h) => drawChip(ctx, w, h, 'Sin enviar', '#3be09a'), invalidate))
  noSend.position.set(0, PY - 2.65, 0.3)
  scene.add(noSend)

  /* fase 2: resaltado de «Permitir una vez» y cursor */
  const onceGlow = makeBar(0x3be09a)
  const cursor = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: makeCursorTexture(), transparent: true, depthWrite: false, depthTest: false }),
  )
  cursor.renderOrder = 20
  scene.add(cursor)
  const clickRing = makeShockRing(CYAN)
  scene.add(clickRing)

  /* fase 4: cruz sobre «Permitir siempre» para enviar */
  const cross = glyph('cross')
  const warnChip = makeTextPlane(5.2, 0.66, makeTex(1040, 132, (ctx, w, h) => drawChip(ctx, w, h, 'Nunca «Permitir siempre» para enviar', '#ffb3aa'), invalidate))
  warnChip.position.set(0, PY - 2.65, 0.3)
  scene.add(warnChip)

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
    const T = t * MCP_PRACTICA3_DURATION
    const events = []
    stage.update(T, 0)
    stage.spot.position.set(0, 4.6, 5.5)
    const op = [0, 1, 2, 3, 4].map((i) => phaseOpacity(T, i))
    const e = [0, 1, 2, 3, 4].map((i) => enter(T, i))

    /* ---------- paso 0: datos de la hoja y rúbrica ---------- */
    place(sheet, SHEET.x, PY - e[0].drop, e[0].scale, op[0])
    place(rubric, RUBRIC.x, PY - e[0].drop, e[0].scale, op[0])
    highlights.forEach((bar, i) => {
      const a = 0.9 + i * 0.4
      const k = easeOutCubic(seg(T, a, a + 0.4))
      const w = (SHEET.w - 0.4) * k
      bar.position.set(SHEET.x - (SHEET.w - 0.4) / 2 + w / 2, PY + (0.5 - (SHEET_ROWS_V[i] + 0.035)) * SHEET.h, 0.12)
      bar.scale.set(safeScale(w), 0.46, 1)
      shown(bar, op[0] * 0.35 * smooth(seg(T, a, a + 0.15)))
    })
    flashCard(rubric, bump(seg(T, 2.0, 2.8)) * 0.3)
    dataChip.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 2.2, 2.8)))))
    shown(dataChip, op[0] * smooth(seg(T, 2.2, 2.6)))

    /* ---------- paso 1: tres borradores en Gmail ---------- */
    place(mailA, 0, PY - e[1].drop, e[1].scale, op[1])
    draftRows.forEach((row, i) => {
      const a = 4.0 + i * 0.5
      const k = easeOutCubic(seg(T, a, a + 0.5))
      row.mesh.position.set(lerp(-1.4, 0, k), row.y, 0.2)
      shown(row.mesh, op[1] * smooth(seg(T, a, a + 0.25)))
      if (T >= a && T < a + 1) events.push({ t: a, x: 2.9, y: row.y, z: 0.9, color: redColor, speed: 1.2, life: 0.8 })
    })
    toChip.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 5.7, 6.2)))))
    shown(toChip, op[1] * smooth(seg(T, 5.7, 6.1)))

    /* ---------- paso 2: Permitir una vez ---------- */
    place(dialog, 0, PY - e[2].drop, e[2].scale, op[2])
    const pulse = 0.25 + 0.15 * Math.sin(T * 6)
    onceGlow.position.set(dialogX(BTN_ONCE.u), dialogY(BTN_ONCE.v), 0.12)
    onceGlow.scale.set(DIALOG.w * BTN_ONCE.w + 0.2, DIALOG.h * BTN_ONCE.h + 0.2, 1)
    shown(onceGlow, op[2] * (T < CLICK_AT ? pulse * smooth(seg(T, 7.0, 7.4)) : 0.55 * (1 - smooth(seg(T, 8.6, 9.2)))))
    flashCard(dialog, bump(seg(T, CLICK_AT, CLICK_AT + 0.7)) * 0.5)

    const c = cursorAt(T)
    const clickK = bump(seg(T, CLICK_AT, CLICK_AT + 0.25))
    cursor.position.set(c.x + 0.31, c.y - 0.41, 2.0)
    cursor.scale.setScalar(1 - clickK * 0.1)
    cursor.material.opacity = smooth(seg(T, 6.6, 6.9)) * (1 - smooth(seg(T, 9.0, 9.4)))
    cursor.visible = cursor.material.opacity > 0.01
    setShockRing(clickRing, T >= CLICK_AT && T < CLICK_AT + 0.9 ? T - CLICK_AT : -1, 0.9, 1.0)
    clickRing.position.set(dialogX(BTN_ONCE.u), dialogY(BTN_ONCE.v), 1.9)
    if (T >= CLICK_AT - 0.05 && T < CLICK_AT + 1) events.push({ t: CLICK_AT, x: dialogX(BTN_ONCE.u), y: dialogY(BTN_ONCE.v), z: 1.2, color: cyanColor, speed: 1.4, life: 0.8 })

    /* ---------- paso 3: revisar sin enviar ---------- */
    place(mailB, 0, PY - e[3].drop, e[3].scale, op[3])
    reviewRows.forEach((row, i) => {
      row.mesh.position.set(0, row.y, 0.2)
      shown(row.mesh, op[3] * smooth(seg(T, 9.7, 10.1)))
      const a = 10.5 + i * 0.6
      checks[i].position.set(3.35, row.y, 0.3)
      checks[i].scale.setScalar(safeScale(easeOutBack(seg(T, a, a + 0.4))))
      shown(checks[i], op[3] * smooth(seg(T, a, a + 0.12)))
      if (T >= a && T < a + 1) events.push({ t: a, x: 3.35, y: row.y, z: 0.9, color: greenColor, speed: 1.2, life: 0.8 })
    })
    noSend.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 12.0, 12.5)))))
    shown(noSend, op[3] * smooth(seg(T, 12.0, 12.4)))

    /* ---------- paso 4: nunca «Permitir siempre» para enviar ---------- */
    place(warn, 0, PY - e[4].drop, e[4].scale, op[4])
    const crossK = easeOutBack(seg(T, 13.6, 14.1))
    cross.position.set(2.55, dialogY(0.66), 0.3)
    cross.scale.setScalar(safeScale(crossK))
    shown(cross, op[4] * smooth(seg(T, 13.6, 13.8)))
    flashCard(warn, bump(seg(T, 13.6, 14.4)) * 0.4)
    warnChip.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 14.4, 14.9)))))
    shown(warnChip, op[4] * smooth(seg(T, 14.4, 14.8)))
    if (T >= 13.6 && T < 14.6) events.push({ t: 13.6, x: 2.55, y: dialogY(0.66), z: 0.9, color: redColor, speed: 1.6, life: 0.8 })

    bursts.update(T, events)
    return Math.min(4, Math.floor(T / PHASE))
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize: stage.resize, dispose }
}
