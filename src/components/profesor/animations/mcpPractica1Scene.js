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
 * Escena “Activar los conectores y abrir la hoja” (Sesión 3, Práctica 1).
 * Loop de 16 s en 5 fases de 3,2 s:
 *   0 entrar a claude.ai con @unal · 1 activar Drive y Gmail · 2 activar Canva ·
 *   3 abrir la hoja de notas (E01–E25) · 4 hacer una copia en su Drive.
 * `draw(t)` es una función pura del tiempo dentro del loop.
 */
export const MCP_PRACTICA1_DURATION = 16

const GREEN = 0x3be09a
const CYAN = 0x7fdcff

const PY = 3.1 // altura común de los paneles
const BROWSER = { w: 9, h: 5.2 }
const CONN = { w: 8, h: 4.4 }
const CANVA = { w: 8, h: 3.8 }
const SHEET = { w: 9, h: 5.2 }
const SHEET_SMALL = { x: -3.9, s: 0.72 }
const MENU = { x: 1.4, y: 4.4, w: 3.4, h: 2.2 }
const FOLDER = { x: 5.2, y: 2.9, w: 3.8, h: 3.0 }
const HUD_Y = 6.95
const HUD_X = [-5.4, -1.8, 1.8, 5.4]

/* puntos del cursor: [tiempo, x, y] (la punta de la flecha) */
const BUTTON = { x: 0, y: PY + (0.5 - 0.68) * BROWSER.h }
const TOGGLE_X = (0.86 - 0.5) * CONN.w
const DRIVE_Y = PY + (0.5 - 0.38) * CONN.h
const GMAIL_Y = PY + (0.5 - 0.6) * CONN.h
const CANVA_BTN = { x: (0.8 - 0.5) * CANVA.w, y: PY + (0.5 - 0.55) * CANVA.h }
const COPY_ITEM = { x: MENU.x - 0.2, y: MENU.y + (0.5 - 0.55) * MENU.h }
const CURSOR_PATH = [
  [0.9, 4.6, 1.2],
  [2.0, BUTTON.x, BUTTON.y],
  [2.4, BUTTON.x, BUTTON.y],
  [4.1, TOGGLE_X, DRIVE_Y],
  [4.5, TOGGLE_X, DRIVE_Y],
  [5.2, TOGGLE_X, GMAIL_Y],
  [5.6, TOGGLE_X, GMAIL_Y],
  [7.6, CANVA_BTN.x, CANVA_BTN.y],
  [8.6, CANVA_BTN.x, CANVA_BTN.y],
  [9.6, 3.5, 1.5],
  [12.6, 3.5, 1.5],
  [14.0, COPY_ITEM.x, COPY_ITEM.y],
  [14.5, COPY_ITEM.x, COPY_ITEM.y],
  [15.3, 4.6, 0.6],
]
const CLICKS = [2.1, 4.3, 5.3, 8.4, 14.2]

/** Posición del cursor en T: tramos suavizados entre puntos. */
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

/* ------------------------------------------------------------------ */
/* Texturas                                                            */
/* ------------------------------------------------------------------ */

function line(ctx, x, y, width, color = 'rgba(4,35,97,0.2)', height = 14) {
  ctx.fillStyle = color
  roundRectPath(ctx, x, y, width, height, height / 2)
  ctx.fill()
}

function windowBar(ctx, w, h, title, color) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = color
  ctx.fillRect(0, 0, w, h * 0.13)
  ;['#ff6b5e', '#f4cb18', '#3be09a'].forEach((c, i) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(w * 0.04 + i * w * 0.035, h * 0.065, h * 0.018, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.fillStyle = 'rgba(255,255,255,0.18)'
  roundRectPath(ctx, w * 0.17, h * 0.03, w * 0.5, h * 0.07, 14)
  ctx.fill()
  fitText(ctx, title, w * 0.2, h * 0.082, { weight: 500, size: h * 0.045, family: FONT_MONO, maxWidth: w * 0.44, color: '#ffffff' })
}

function drawBrowser(ctx, w, h) {
  windowBar(ctx, w, h, 'claude.ai', '#34425f')
  fitText(ctx, 'Claude', w / 2, h * 0.36, { weight: 800, size: h * 0.12, maxWidth: w * 0.5, color: '#c4602d', align: 'center' })
  fitText(ctx, 'Inicie sesión con su cuenta institucional', w / 2, h * 0.47, { weight: 500, size: h * 0.05, family: FONT_BODY, maxWidth: w * 0.7, color: 'rgba(4,35,97,0.7)', align: 'center' })
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(4,35,97,0.3)'
  ctx.lineWidth = 4
  roundRectPath(ctx, w * 0.3, h * 0.6, w * 0.4, h * 0.16, 24)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#4285f4'
  ctx.beginPath()
  ctx.arc(w * 0.345, h * 0.68, h * 0.03, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, 'Continuar con Google', w * 0.53, h * 0.69, { weight: 700, size: h * 0.052, maxWidth: w * 0.27, color: '#042361', align: 'center' })
}

function drawToggleRow(ctx, w, h, y, name, hint) {
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(4,35,97,0.14)'
  ctx.lineWidth = 3
  roundRectPath(ctx, w * 0.05, h * (y - 0.09), w * 0.9, h * 0.18, 22)
  ctx.fill()
  ctx.stroke()
  fitText(ctx, name, w * 0.1, h * (y + 0.015), { weight: 800, size: h * 0.075, maxWidth: w * 0.5, color: '#042361' })
  fitText(ctx, hint, w * 0.1, h * (y + 0.065), { weight: 500, size: h * 0.04, family: FONT_BODY, maxWidth: w * 0.55, color: 'rgba(4,35,97,0.6)' })
}

function drawConnectors(ctx, w, h) {
  windowBar(ctx, w, h, 'claude.ai / chat nuevo', '#34425f')
  fitText(ctx, 'Conectores', w * 0.06, h * 0.25, { weight: 800, size: h * 0.075, maxWidth: w * 0.6, color: '#042361' })
  drawToggleRow(ctx, w, h, 0.38, 'Google Drive', 'Cuenta @unal')
  drawToggleRow(ctx, w, h, 0.6, 'Gmail', 'Cuenta @unal')
  fitText(ctx, '+ Añadir conectores', w * 0.06, h * 0.86, { weight: 600, size: h * 0.052, family: FONT_BODY, maxWidth: w * 0.6, color: '#4574b9' })
}

function drawCanva(ctx, w, h) {
  windowBar(ctx, w, h, 'Configuración → Conectores', '#34425f')
  fitText(ctx, 'Conectores disponibles', w * 0.06, h * 0.28, { weight: 800, size: h * 0.085, maxWidth: w * 0.7, color: '#042361' })
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(4,35,97,0.14)'
  ctx.lineWidth = 3
  roundRectPath(ctx, w * 0.05, h * 0.42, w * 0.9, h * 0.26, 22)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#00c4cc'
  ctx.beginPath()
  ctx.arc(w * 0.12, h * 0.55, h * 0.075, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, 'C', w * 0.12, h * 0.595, { weight: 800, size: h * 0.1, color: '#ffffff', align: 'center' })
  fitText(ctx, 'Canva', w * 0.21, h * 0.54, { weight: 800, size: h * 0.09, maxWidth: w * 0.3, color: '#042361' })
  fitText(ctx, 'Su cuenta de Canva (la gratuita sirve)', w * 0.21, h * 0.62, { weight: 500, size: h * 0.045, family: FONT_BODY, maxWidth: w * 0.45, color: 'rgba(4,35,97,0.6)' })
  ctx.fillStyle = '#4574b9'
  roundRectPath(ctx, w * 0.7, h * 0.47, w * 0.2, h * 0.16, 20)
  ctx.fill()
  fitText(ctx, 'Conectar', w * 0.8, h * 0.575, { weight: 800, size: h * 0.06, maxWidth: w * 0.17, color: '#ffffff', align: 'center' })
}

const GRADES = [
  ['E01', '3.8', '4.1', '4.5', '4.2'],
  ['E02', '2.9', '3.2', '3.6', '3.3'],
  ['E03', '4.4', '4.0', '4.7', '4.4'],
  ['E04', '1.8', '2.4', '3.0', '2.5'],
]

function drawSheetTable(ctx, w, h, top, rowH) {
  const cols = [0.06, 0.3, 0.46, 0.62, 0.78]
  const heads = ['Estudiante', 'Parcial 1', 'Parcial 2', 'Taller', 'Final']
  ctx.fillStyle = '#e3f3ea'
  ctx.fillRect(w * 0.03, top, w * 0.94, rowH)
  heads.forEach((text, i) => fitText(ctx, text, w * cols[i], top + rowH * 0.68, { weight: 800, size: rowH * 0.52, maxWidth: w * 0.15, color: '#14633f' }))
  const rows = [...GRADES, null, ['E25', '3.5', '3.9', '4.2', '3.9']]
  rows.forEach((row, r) => {
    const y = top + rowH * (r + 1)
    ctx.strokeStyle = 'rgba(4,35,97,0.14)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(w * 0.03, y)
    ctx.lineTo(w * 0.97, y)
    ctx.stroke()
    if (!row) {
      fitText(ctx, '⋮', w * cols[0] + 20, y + rowH * 0.72, { weight: 800, size: rowH * 0.6, color: 'rgba(4,35,97,0.5)' })
      return
    }
    row.forEach((text, i) =>
      fitText(ctx, text, w * cols[i], y + rowH * 0.68, { weight: i === 0 ? 700 : 500, size: rowH * 0.5, family: FONT_MONO, maxWidth: w * 0.15, color: '#042361' }),
    )
  })
}

function drawSheet(ctx, w, h) {
  windowBar(ctx, w, h, 'Notas del curso (ficticio)', '#1f8a5b')
  drawSheetTable(ctx, w, h, h * 0.2, h * 0.115)
}

function drawCopy(ctx, w, h) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#1f8a5b'
  ctx.fillRect(0, 0, w, h * 0.22)
  fitText(ctx, 'Copia de Notas (ficticio)', w * 0.06, h * 0.15, { weight: 800, size: h * 0.12, maxWidth: w * 0.88, color: '#ffffff' })
  for (let i = 0; i < 5; i += 1) line(ctx, w * 0.06, h * (0.33 + i * 0.13), w * (i % 2 ? 0.6 : 0.85), 'rgba(4,35,97,0.2)', 12)
}

function drawMenu(ctx, w, h) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#34425f'
  ctx.fillRect(0, 0, w, h * 0.17)
  fitText(ctx, 'Archivo', w * 0.07, h * 0.12, { weight: 800, size: h * 0.1, maxWidth: w * 0.6, color: '#ffffff' })
  ctx.fillStyle = '#ffeaa0'
  ctx.fillRect(0, h * 0.42, w, h * 0.26)
  ;[
    ['Compartir', 0.34],
    ['Hacer una copia', 0.57],
    ['Descargar', 0.8],
  ].forEach(([text, y]) => fitText(ctx, text, w * 0.07, h * (y + 0.04), { weight: text === 'Hacer una copia' ? 800 : 500, size: h * 0.095, family: FONT_BODY, maxWidth: w * 0.86, color: '#042361' }))
}

function drawFolder(ctx, w, h) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#2f6fe0'
  ctx.fillRect(0, 0, w, h * 0.17)
  fitText(ctx, 'Mi unidad · Drive', w * 0.07, h * 0.12, { weight: 800, size: h * 0.1, maxWidth: w * 0.86, color: '#ffffff' })
  ctx.fillStyle = 'rgba(4,35,97,0.1)'
  roundRectPath(ctx, w * 0.07, h * 0.28, w * 0.86, h * 0.64, 20)
  ctx.fill()
}

function drawChip(ctx, w, h, text, fill, ink = '#042361') {
  ctx.fillStyle = fill
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fill()
  ctx.strokeStyle = ink
  ctx.lineWidth = h * 0.09
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(h * 0.3, h * 0.52)
  ctx.lineTo(h * 0.43, h * 0.67)
  ctx.lineTo(h * 0.7, h * 0.34)
  ctx.stroke()
  fitText(ctx, text, h * 0.9 + (w - h * 0.9) / 2, h * 0.67, { weight: 800, size: h * 0.46, maxWidth: (w - h * 1.1) * 0.95, color: ink, align: 'center' })
}

function drawPill(ctx, w, h) {
  ctx.fillStyle = '#fff'
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fill()
}

function drawKnob(ctx, w, h) {
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2)
  ctx.fill()
}

/* ------------------------------------------------------------------ */

export default function createMcpPractica1Scene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: MCP_PRACTICA1_DURATION,
    frame: { wideHalfW: 8.7, narrowHalfW: 6.2, halfH: 4.45, camY: 5.0, lookY: 3.3 },
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 10, perBurst: 18, seed: 31 })
  scene.add(bursts.points)
  const greenColor = new THREE.Color(GREEN)
  const cyanColor = new THREE.Color(CYAN)
  const offColor = new THREE.Color(0x8892aa)

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

  const browser = makeCard(BROWSER.w, BROWSER.h, 1350, 780, drawBrowser)
  const connectors = makeCard(CONN.w, CONN.h, 1200, 660, drawConnectors)
  const canva = makeCard(CANVA.w, CANVA.h, 1200, 570, drawCanva)
  const sheet = makeCard(SHEET.w, SHEET.h, 1350, 780, drawSheet)
  const menu = makeCard(MENU.w, MENU.h, 680, 440, drawMenu, { emissive: '#f4cb18' })
  const copy = makeCard(3.0, 1.9, 600, 380, drawCopy, { emissive: '#3be09a' })
  const folder = makeCard(FOLDER.w, FOLDER.h, 760, 600, drawFolder, { emissive: '#3be09a' })
  ;[browser, connectors, canva, sheet, menu, copy, folder].forEach((card) => scene.add(card.group))

  const accountChip = makeTextPlane(3.2, 0.78, makeTex(640, 156, (ctx, w, h) => drawChip(ctx, w, h, 'Cuenta @unal', '#9fe8ff'), invalidate))
  const driveChip = makeTextPlane(3.2, 0.78, makeTex(640, 156, (ctx, w, h) => drawChip(ctx, w, h, 'Drive', '#ffd04b'), invalidate))
  const gmailChip = makeTextPlane(3.2, 0.78, makeTex(640, 156, (ctx, w, h) => drawChip(ctx, w, h, 'Gmail', '#ffb3aa'), invalidate))
  const canvaChip = makeTextPlane(3.2, 0.78, makeTex(640, 156, (ctx, w, h) => drawChip(ctx, w, h, 'Canva', '#8ff0f4'), invalidate))
  const hud = [accountChip, driveChip, gmailChip, canvaChip]
  hud.forEach((chip, i) => {
    chip.position.set(HUD_X[i], HUD_Y, 0.3)
    scene.add(chip)
  })

  const connectedPill = makeTextPlane(1.7, 0.62, makeTex(340, 124, (ctx, w, h) => drawChip(ctx, w, h, 'Conectado', '#3be09a', '#042361'), invalidate))
  scene.add(connectedPill)
  const stampChip = makeTextPlane(5.6, 0.72, makeTex(1120, 144, (ctx, w, h) => drawChip(ctx, w, h, '25 estudiantes ficticios · E01–E25', '#ffd04b'), invalidate))
  scene.add(stampChip)
  const ownChip = makeTextPlane(2.6, 0.62, makeTex(520, 124, (ctx, w, h) => drawChip(ctx, w, h, 'Su copia', '#3be09a'), invalidate))
  scene.add(ownChip)

  /* interruptores de Drive y Gmail */
  const pillTex = makeTex(190, 100, drawPill, invalidate)
  const knobTex = makeTex(96, 96, drawKnob, invalidate)
  const toggles = [DRIVE_Y, GMAIL_Y].map((y) => {
    const track = makeTextPlane(0.95, 0.5, pillTex)
    const knob = makeTextPlane(0.4, 0.4, knobTex)
    track.renderOrder = 5
    knob.renderOrder = 6
    scene.add(track, knob)
    return { track, knob, y }
  })

  const cursor = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: makeCursorTexture(), transparent: true, depthWrite: false, depthTest: false }),
  )
  cursor.renderOrder = 20
  cursor.scale.setScalar(1.0)
  scene.add(cursor)

  const clickRing = makeShockRing(CYAN)
  scene.add(clickRing)

  function place(card, x, y, z, s, opacity) {
    card.group.position.set(x, y, z)
    card.group.scale.setScalar(safeScale(s))
    setCardOpacity(card, opacity)
  }

  function fade(chip, k) {
    chip.material.opacity = k
    chip.visible = k > 0.01
  }

  function draw(t) {
    const T = t * MCP_PRACTICA1_DURATION
    const events = []

    stage.update(T, 0)
    stage.spot.position.set(0, 4.6, 5.5)

    /* ---------- cursor y clics ---------- */
    const c = cursorAt(T)
    const clickK = CLICKS.reduce((sum, at) => sum + bump(seg(T, at, at + 0.25)), 0)
    cursor.position.set(c.x + 0.31, c.y - 0.41, 2.0)
    cursor.scale.setScalar(1 - clickK * 0.1)
    cursor.material.opacity = smooth(seg(T, 0.9, 1.2)) * (1 - smooth(seg(T, 15.3, 15.8)))
    cursor.visible = cursor.material.opacity > 0.01
    let ringAge = -1
    CLICKS.forEach((at) => {
      if (T >= at && T < at + 0.9) {
        ringAge = T - at
      }
    })
    setShockRing(clickRing, ringAge, 0.9, 1.0)
    clickRing.position.set(c.x, c.y, 1.9)
    CLICKS.forEach((at) => {
      if (T >= at - 0.05 && T < at + 1) events.push({ t: at, x: cursorAt(at).x, y: cursorAt(at).y, z: 1.2, color: cyanColor, speed: 1.4, life: 0.8 })
    })

    /* ---------- paso 0: claude.ai con @unal ---------- */
    const bIn = smooth(seg(T, 0.1, 0.7))
    const bOut = smooth(seg(T, 3.0, 3.5))
    place(browser, 0, PY - bOut * 0.5, 0, lerp(0.94, 1, easeOutCubic(seg(T, 0.1, 0.7))) * (1 - bOut * 0.06), bIn * (1 - bOut))
    flashCard(browser, bump(seg(T, 2.1, 2.7)) * 0.5)
    fade(accountChip, smooth(seg(T, 2.5, 2.9)))

    /* ---------- paso 1: Drive y Gmail ---------- */
    const cIn = smooth(seg(T, 3.3, 3.9))
    const cOut = smooth(seg(T, 6.0, 6.5))
    const cOpacity = cIn * (1 - cOut)
    const cY = PY - cOut * 0.5 - (1 - cIn) * 0.4
    place(connectors, 0, cY, 0, lerp(0.94, 1, easeOutCubic(seg(T, 3.3, 3.9))), cOpacity)
    const toggleAt = [4.3, 5.3]
    toggles.forEach((toggle, i) => {
      const on = easeOutCubic(seg(T, toggleAt[i], toggleAt[i] + 0.35))
      toggle.track.position.set(TOGGLE_X, toggle.y + (cY - PY), 0.3)
      toggle.track.material.color.copy(offColor).lerp(greenColor, on)
      toggle.track.material.opacity = cOpacity
      toggle.track.visible = cOpacity > 0.01
      toggle.knob.position.set(TOGGLE_X + lerp(-0.225, 0.225, on), toggle.y + (cY - PY), 0.32)
      toggle.knob.material.opacity = cOpacity
      toggle.knob.visible = cOpacity > 0.01
    })
    fade(driveChip, smooth(seg(T, 4.5, 4.9)))
    fade(gmailChip, smooth(seg(T, 5.5, 5.9)))

    /* ---------- paso 2: Canva ---------- */
    const vIn = smooth(seg(T, 6.4, 7.0))
    const vOut = smooth(seg(T, 9.3, 9.8))
    const vY = PY - vOut * 0.5 - (1 - vIn) * 0.4
    place(canva, 0, vY, 0, lerp(0.94, 1, easeOutCubic(seg(T, 6.4, 7.0))), vIn * (1 - vOut))
    const connected = smooth(seg(T, 8.5, 8.85))
    connectedPill.position.set(CANVA_BTN.x, vY + (CANVA_BTN.y - PY), 0.3)
    connectedPill.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 8.5, 9.0)))))
    fade(connectedPill, connected * vIn * (1 - vOut))
    flashCard(canva, bump(seg(T, 8.5, 9.3)) * 0.4)
    fade(canvaChip, smooth(seg(T, 9.0, 9.4)))

    /* ---------- paso 3: hoja de notas ---------- */
    const sIn = smooth(seg(T, 9.7, 10.4))
    const shrink = easeInOutCubic(seg(T, 12.6, 13.3))
    const sX = lerp(0, SHEET_SMALL.x, shrink)
    const sS = lerp(1, SHEET_SMALL.s, shrink) * lerp(0.94, 1, easeOutCubic(seg(T, 9.7, 10.4)))
    const sY = PY - (1 - sIn) * 0.4
    place(sheet, sX, sY, 0, sS, sIn)
    flashCard(sheet, bump(seg(T, 10.6, 11.5)) * 0.35)
    stampChip.position.set(sX, sY - (SHEET.h * sS) / 2 - 0.5, 0.3)
    stampChip.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 10.9, 11.5))) * lerp(1, 0.9, shrink)))
    fade(stampChip, smooth(seg(T, 10.9, 11.3)))

    /* ---------- paso 4: hacer una copia ---------- */
    const mIn = easeOutBack(seg(T, 13.0, 13.5))
    const mOut = smooth(seg(T, 14.5, 14.9))
    place(menu, MENU.x, MENU.y, 0.6, mIn * (1 - mOut * 0.1), smooth(seg(T, 13.0, 13.3)) * (1 - mOut))
    flashCard(menu, bump(seg(T, 14.1, 14.6)) * 0.6)

    const fIn = easeOutBack(seg(T, 13.6, 14.2))
    place(folder, FOLDER.x, FOLDER.y, 0, fIn, smooth(seg(T, 13.6, 14.0)))
    const fly = easeInOutCubic(seg(T, 14.5, 15.3))
    const landX = FOLDER.x
    const landY = FOLDER.y - 0.25
    const copyX = lerp(sX, landX, fly)
    const copyY = lerp(sY, landY, fly) + Math.sin(fly * Math.PI) * 1.2
    const copyS = lerp(0.8, 1, fly) * easeOutBack(seg(T, 14.5, 14.8))
    place(copy, copyX, copyY, 0.5, copyS, smooth(seg(T, 14.5, 14.7)))
    flashCard(copy, bump(seg(T, 15.2, 15.9)) * 0.7)
    ownChip.position.set(FOLDER.x, FOLDER.y - 1.35, 0.4)
    ownChip.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 15.3, 15.8)))))
    fade(ownChip, smooth(seg(T, 15.3, 15.6)))
    if (T > 15.25 && T < 16) events.push({ t: 15.3, x: landX, y: landY, z: 1.0, color: greenColor, speed: 2.4, life: 0.9 })

    bursts.update(T, events)
    return Math.min(4, Math.floor(T / 3.2))
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize: stage.resize, dispose }
}
