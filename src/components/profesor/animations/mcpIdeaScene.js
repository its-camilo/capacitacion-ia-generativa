import * as THREE from 'three'
import { bump, easeInOutCubic, easeOutBack, easeOutCubic, lerp, roundRectPath, seg, smooth } from './threeKit'
import {
  FONT_BODY,
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
  window01,
} from './stageKit'

/**
 * Escena “De la pestaña del chat a la herramienta donde ya trabaja” (Sesión 3).
 * Loop de 16 s en 5 fases de 3,2 s:
 *   0 chat aparte con copiar y pegar · 1 la IA dentro de la herramienta ·
 *   2 conectores Drive, Gmail y Canva · 3 el permiso es el riesgo ·
 *   4 la IA actúa solo si usted autoriza.
 * `draw(t)` es una función pura del tiempo dentro del loop.
 */
export const MCP_IDEA_DURATION = 16

const AMBER = 0xf4cb18
const CYAN = 0x7fdcff
const GREEN = 0x3be09a

/* geometría (unidades de escena) */
const Y = 3.4
const CHAT = { x: -4.6, w: 5.4, h: 4.2 }
const DOC_FROM = 4.6
const DOC_MID = -3.4
const DOC_SMALL = -5.9
const DOC_SMALL_S = 0.62
const PANEL_X = 2.4
const PANEL_SMALL_X = -1.2
const TILE_X = 5.0
const TILE_W = 3.0
const TILE_H = 1.7
const TILES = [
  { kind: 'drive', name: 'Google Drive', y: 5.5, color: 0x4f9bff },
  { kind: 'gmail', name: 'Gmail', y: 3.4, color: 0xff6b5e },
  { kind: 'canva', name: 'Canva', y: 1.3, color: 0x44d3fe },
]
const DIALOG = { x: 0, y: 3.3, w: 6.4, h: 3.5 }

/* ------------------------------------------------------------------ */
/* Texturas                                                            */
/* ------------------------------------------------------------------ */

function windowFrame(ctx, w, h, title, headerColor) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = headerColor
  ctx.fillRect(0, 0, w, h * 0.15)
  ;['#ff6b5e', '#f4cb18', '#3be09a'].forEach((c, i) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(w * 0.05 + i * w * 0.045, h * 0.075, h * 0.021, 0, Math.PI * 2)
    ctx.fill()
  })
  fitText(ctx, title, w * 0.22, h * 0.098, { weight: 700, size: h * 0.06, maxWidth: w * 0.72, color: '#ffffff' })
}

function line(ctx, x, y, width, color = 'rgba(4,35,97,0.2)', height = 14) {
  ctx.fillStyle = color
  roundRectPath(ctx, x, y, width, height, height / 2)
  ctx.fill()
}

function drawChat(ctx, w, h) {
  windowFrame(ctx, w, h, 'Chat de IA · pestaña aparte', '#34425f')
  ctx.fillStyle = '#dbe6ff'
  roundRectPath(ctx, w * 0.32, h * 0.22, w * 0.62, h * 0.2, 24)
  ctx.fill()
  line(ctx, w * 0.37, h * 0.28, w * 0.5, 'rgba(4,35,97,0.45)')
  line(ctx, w * 0.37, h * 0.35, w * 0.36, 'rgba(4,35,97,0.3)')
  ctx.fillStyle = '#e8ecf5'
  roundRectPath(ctx, w * 0.06, h * 0.5, w * 0.66, h * 0.24, 24)
  ctx.fill()
  line(ctx, w * 0.1, h * 0.56, w * 0.54, 'rgba(4,35,97,0.4)')
  line(ctx, w * 0.1, h * 0.63, w * 0.44, 'rgba(4,35,97,0.28)')
  line(ctx, w * 0.1, h * 0.69, w * 0.3, 'rgba(4,35,97,0.2)')
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(4,35,97,0.25)'
  ctx.lineWidth = 3
  roundRectPath(ctx, w * 0.05, h * 0.83, w * 0.9, h * 0.1, 26)
  ctx.fill()
  ctx.stroke()
  fitText(ctx, 'Pegue aquí su texto…', w * 0.09, h * 0.895, { weight: 500, size: h * 0.045, family: FONT_BODY, maxWidth: w * 0.7, color: 'rgba(4,35,97,0.45)' })
}

function drawDoc(ctx, w, h) {
  windowFrame(ctx, w, h, 'Su documento', '#1f8a5b')
  fitText(ctx, 'Notas del curso', w * 0.08, h * 0.3, { weight: 800, size: h * 0.08, maxWidth: w * 0.8, color: '#042361' })
  for (let i = 0; i < 6; i += 1) {
    line(ctx, w * 0.08, h * (0.4 + i * 0.085), w * (i % 3 === 2 ? 0.5 : 0.84), 'rgba(4,35,97,0.2)')
  }
}

function drawAssistant(ctx, w, h) {
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#2a2f7a')
  bg.addColorStop(1, '#14194f')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#f4cb18'
  ctx.beginPath()
  const cx = w * 0.12
  const cy = h * 0.12
  const r = h * 0.06
  ctx.moveTo(cx, cy - r)
  ctx.quadraticCurveTo(cx, cy, cx + r, cy)
  ctx.quadraticCurveTo(cx, cy, cx, cy + r)
  ctx.quadraticCurveTo(cx, cy, cx - r, cy)
  ctx.quadraticCurveTo(cx, cy, cx, cy - r)
  ctx.fill()
  fitText(ctx, 'Asistente de IA', w * 0.22, h * 0.14, { weight: 700, size: h * 0.07, maxWidth: w * 0.7, color: '#ffffff' })
  ctx.fillStyle = 'rgba(255,255,255,0.14)'
  roundRectPath(ctx, w * 0.07, h * 0.25, w * 0.86, h * 0.3, 22)
  ctx.fill()
  line(ctx, w * 0.12, h * 0.32, w * 0.7, 'rgba(255,255,255,0.7)')
  line(ctx, w * 0.12, h * 0.4, w * 0.55, 'rgba(255,255,255,0.45)')
  line(ctx, w * 0.12, h * 0.47, w * 0.4, 'rgba(255,255,255,0.3)')
  ctx.fillStyle = 'rgba(68,211,254,0.25)'
  roundRectPath(ctx, w * 0.07, h * 0.62, w * 0.86, h * 0.14, 22)
  ctx.fill()
  fitText(ctx, 'Ve el documento abierto', w * 0.5, h * 0.715, { weight: 600, size: h * 0.052, family: FONT_BODY, maxWidth: w * 0.78, color: '#9fe8ff', align: 'center' })
}

function drawTile(ctx, w, h, tile) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  const s = h * 0.5
  const x = w * 0.08
  const y = h * 0.25
  if (tile.kind === 'drive') {
    ctx.fillStyle = '#1fa463'
    ctx.beginPath()
    ctx.moveTo(x + s * 0.3, y)
    ctx.lineTo(x + s * 0.7, y)
    ctx.lineTo(x + s, y + s * 0.7)
    ctx.lineTo(x + s * 0.8, y + s)
    ctx.lineTo(x, y + s * 0.3)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#ffd04b'
    ctx.beginPath()
    ctx.moveTo(x + s * 0.7, y)
    ctx.lineTo(x + s, y + s * 0.7)
    ctx.lineTo(x + s * 0.55, y + s * 0.7)
    ctx.lineTo(x + s * 0.15, y)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#4285f4'
    ctx.beginPath()
    ctx.moveTo(x + s * 0.2, y + s)
    ctx.lineTo(x + s * 0.8, y + s)
    ctx.lineTo(x + s, y + s * 0.62)
    ctx.lineTo(x + s * 0.4, y + s * 0.62)
    ctx.closePath()
    ctx.fill()
  } else if (tile.kind === 'gmail') {
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#d93a3a'
    ctx.lineWidth = 7
    roundRectPath(ctx, x, y + s * 0.1, s * 1.1, s * 0.8, 10)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x + 5, y + s * 0.18)
    ctx.lineTo(x + s * 0.55, y + s * 0.6)
    ctx.lineTo(x + s * 1.1 - 5, y + s * 0.18)
    ctx.stroke()
  } else {
    ctx.fillStyle = '#00c4cc'
    ctx.beginPath()
    ctx.arc(x + s * 0.5, y + s * 0.5, s * 0.5, 0, Math.PI * 2)
    ctx.fill()
    fitText(ctx, 'C', x + s * 0.5, y + s * 0.72, { weight: 800, size: s * 0.7, color: '#ffffff', align: 'center' })
  }
  fitText(ctx, tile.name, w * 0.4, h * 0.6, { weight: 800, size: h * 0.22, maxWidth: w * 0.56, color: '#042361' })
}

function drawLock(ctx, w, h) {
  ctx.fillStyle = '#f4cb18'
  ctx.beginPath()
  ctx.arc(w / 2, h / 2, w / 2 - 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#042361'
  ctx.lineWidth = w * 0.07
  ctx.beginPath()
  ctx.arc(w / 2, h * 0.42, w * 0.14, Math.PI, 0)
  ctx.stroke()
  ctx.fillStyle = '#042361'
  roundRectPath(ctx, w * 0.28, h * 0.42, w * 0.44, h * 0.3, 8)
  ctx.fill()
}

function drawChip(ctx, w, h, text, color) {
  ctx.fillStyle = color
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fill()
  fitText(ctx, text, w / 2, h * 0.68, { weight: 800, size: h * 0.52, maxWidth: w * 0.86, color: '#042361', align: 'center' })
}

function drawBanner(ctx, w, h) {
  ctx.fillStyle = 'rgba(244,203,24,0.95)'
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fill()
  fitText(ctx, 'Ve todo lo que su cuenta ve', w / 2, h * 0.67, { weight: 800, size: h * 0.5, maxWidth: w * 0.9, color: '#042361', align: 'center' })
}

function drawDialog(ctx, w, h) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#f4cb18'
  ctx.fillRect(0, 0, w, h * 0.06)
  fitText(ctx, '¿Permitir que la IA acceda a Gmail?', w * 0.07, h * 0.26, { weight: 800, size: h * 0.095, maxWidth: w * 0.86, color: '#042361' })
  fitText(ctx, 'Podrá crear borradores. No envía nada sin su revisión.', w * 0.07, h * 0.42, { weight: 500, size: h * 0.065, family: FONT_BODY, maxWidth: w * 0.86, color: 'rgba(4,35,97,0.75)' })
  ctx.fillStyle = '#e8ecf5'
  roundRectPath(ctx, w * 0.07, h * 0.66, w * 0.38, h * 0.23, 20)
  ctx.fill()
  fitText(ctx, 'Cancelar', w * 0.26, h * 0.8, { weight: 700, size: h * 0.075, maxWidth: w * 0.32, color: '#042361', align: 'center' })
  ctx.fillStyle = '#1f8a5b'
  roundRectPath(ctx, w * 0.56, h * 0.66, w * 0.37, h * 0.23, 20)
  ctx.fill()
  fitText(ctx, 'Autorizar', w * 0.745, h * 0.8, { weight: 800, size: h * 0.075, maxWidth: w * 0.3, color: '#ffffff', align: 'center' })
}

function drawDraft(ctx, w, h) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#d93a3a'
  ctx.fillRect(0, 0, w * 0.025, h)
  fitText(ctx, 'Borrador en su Gmail', w * 0.06, h * 0.36, { weight: 800, size: h * 0.26, maxWidth: w * 0.62, color: '#042361' })
  fitText(ctx, 'Usted lo revisa y lo envía', w * 0.06, h * 0.72, { weight: 500, size: h * 0.22, family: FONT_BODY, maxWidth: w * 0.62, color: 'rgba(4,35,97,0.75)' })
  ctx.fillStyle = '#1f8a5b'
  roundRectPath(ctx, w * 0.74, h * 0.28, w * 0.22, h * 0.44, 18)
  ctx.fill()
  fitText(ctx, 'Revisar', w * 0.85, h * 0.57, { weight: 800, size: h * 0.2, maxWidth: w * 0.18, color: '#ffffff', align: 'center' })
}

function drawFooter(ctx, w, h, text) {
  fitText(ctx, text, w / 2, h * 0.7, { weight: 600, size: h * 0.6, family: FONT_MONO, maxWidth: w * 0.96, color: '#9fc4ff', align: 'center' })
}

/* ------------------------------------------------------------------ */

export default function createMcpIdeaScene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: MCP_IDEA_DURATION,
    frame: { wideHalfW: 8.7, narrowHalfW: 6.2, halfH: 4.45, camY: 5.0, lookY: 3.3 },
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 10, perBurst: 18, seed: 23 })
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

  /* ---------------- paso 0: chat y documento ---------------- */
  const chat = makeCard(CHAT.w, CHAT.h, 810, 630, drawChat)
  scene.add(chat.group)
  const doc = makeCard(5.4, 4.2, 810, 630, drawDoc)
  scene.add(doc.group)

  const copyChip = makeTextPlane(1.7, 0.62, makeTex(340, 124, (ctx, w, h) => drawChip(ctx, w, h, 'Copiar', '#ffd04b'), invalidate))
  const pasteChip = makeTextPlane(1.7, 0.62, makeTex(340, 124, (ctx, w, h) => drawChip(ctx, w, h, 'Pegar', '#9fe8ff'), invalidate))
  scene.add(copyChip, pasteChip)

  /* ---------------- paso 1: asistente integrado ---------------- */
  const panel = makeCard(4.6, 4.2, 690, 630, drawAssistant, { edge: '#2a2f7a', emissive: '#44d3fe' })
  scene.add(panel.group)
  const panelGlow = addGlow(scene, glow, 0x44d3fe, 7.5, 0)
  panelGlow.position.set(PANEL_X, Y, -0.4)

  /* ---------------- paso 2: conectores ---------------- */
  const tiles = TILES.map((tile) => {
    const card = makeCard(TILE_W, TILE_H, 600, 340, (ctx, w, h) => drawTile(ctx, w, h, tile), { radius: 0.3, emissive: '#ffffff' })
    scene.add(card.group)
    const beam = makeBeam(tile.color, 0.8)
    scene.add(beam)
    const lock = makeTextPlane(0.62, 0.62, makeTex(128, 128, drawLock, invalidate))
    lock.renderOrder = 6
    scene.add(lock)
    const ring = makeShockRing(tile.color)
    scene.add(ring)
    return { ...tile, card, beam, lock, ring }
  })

  /* ---------------- paso 3: advertencia ---------------- */
  const banner = makeTextPlane(6.4, 0.82, makeTex(1280, 164, drawBanner, invalidate))
  scene.add(banner)
  const amberWash = new THREE.PointLight(AMBER, 0, 18, 2)
  amberWash.position.set(0, 4.5, 4)
  scene.add(amberWash)

  /* ---------------- paso 4: autorización ---------------- */
  const dialog = makeCard(DIALOG.w, DIALOG.h, 960, 525, drawDialog, { edge: '#f4cb18', emissive: '#f4cb18' })
  scene.add(dialog.group)
  const draft = makeCard(5.2, 1.3, 1040, 260, drawDraft, { radius: 0.2, emissive: '#3be09a' })
  scene.add(draft.group)
  const draftBeam = makeBeam(GREEN, 0.85)
  scene.add(draftBeam)
  const footerPlane = makeTextPlane(11, 0.62, makeTex(1760, 100, (ctx, w, h) => drawFooter(ctx, w, h, 'La IA actúa solo si usted autoriza'), invalidate))
  footerPlane.position.set(0, -0.55, 0.2)
  scene.add(footerPlane)

  const cursor = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: makeCursorTexture(), transparent: true, depthWrite: false, depthTest: false }),
  )
  cursor.renderOrder = 20
  cursor.scale.setScalar(1.0)
  scene.add(cursor)

  const okRing = makeShockRing(GREEN)
  scene.add(okRing)

  const pA = new THREE.Vector3()
  const pB = new THREE.Vector3()
  const pC = new THREE.Vector3()

  function place(card, x, y, z, s, opacity) {
    card.group.position.set(x, y, z)
    card.group.scale.setScalar(safeScale(s))
    setCardOpacity(card, opacity)
  }

  function draw(t) {
    const T = t * MCP_IDEA_DURATION
    const events = []

    const fx = 1.6 * window01(T, 6.0, 7.0, 15.2, 16)
    stage.update(T, fx)
    stage.spot.position.set(fx, 4.6, 5.5)

    /* ---------- chat ---------- */
    const chatIn = easeOutBack(seg(T, 0.2, 0.9))
    const chatOut = smooth(seg(T, 3.4, 4.3))
    place(chat, CHAT.x - chatOut * 1.4, Y, 0, chatIn, (1 - chatOut) * smooth(seg(T, 0.2, 0.6)))
    flashCard(chat, bump(seg(T, 2.5, 3.1)) * 0.5)

    /* ---------- documento: derecha → centro-izquierda → compacto ---------- */
    const docIn = easeOutBack(seg(T, 0.1, 0.8))
    const docShift = easeInOutCubic(seg(T, 3.3, 4.2))
    const docShrink = easeInOutCubic(seg(T, 6.3, 7.1))
    const docX = lerp(lerp(DOC_FROM, DOC_MID, docShift), DOC_SMALL, docShrink)
    const docS = lerp(1, DOC_SMALL_S, docShrink) * docIn
    place(doc, docX, Y, 0.05, docS, smooth(seg(T, 0.1, 0.5)))
    flashCard(doc, bump(seg(T, 1.6, 2.2)) * 0.4)

    /* ---------- copiar / pegar entre pestañas ---------- */
    const copyK = easeInOutCubic(seg(T, 0.95, 1.85))
    copyChip.position.set(lerp(DOC_FROM, CHAT.x, copyK), Y + 0.2 + Math.sin(copyK * Math.PI) * 1.5, 1.3)
    copyChip.material.opacity = smooth(seg(T, 0.95, 1.15)) * (1 - smooth(seg(T, 1.8, 1.95)))
    copyChip.visible = copyChip.material.opacity > 0.01
    const pasteK = easeInOutCubic(seg(T, 2.0, 2.9))
    pasteChip.position.set(lerp(CHAT.x, DOC_FROM, pasteK), Y - 0.2 + Math.sin(pasteK * Math.PI) * 1.5, 1.3)
    pasteChip.material.opacity = smooth(seg(T, 2.0, 2.2)) * (1 - smooth(seg(T, 2.85, 3.0)))
    pasteChip.visible = pasteChip.material.opacity > 0.01

    /* ---------- asistente integrado ---------- */
    const panelIn = easeOutBack(seg(T, 3.9, 4.6))
    const panelMove = easeInOutCubic(seg(T, 6.3, 7.1))
    const panelX = lerp(lerp(PANEL_X + 1.2, PANEL_X, easeOutCubic(seg(T, 3.9, 4.6))), PANEL_SMALL_X, panelMove)
    const panelS = panelIn * lerp(1, DOC_SMALL_S, panelMove)
    place(panel, panelX, Y, 0.1, panelS, smooth(seg(T, 3.9, 4.3)))
    flashCard(panel, bump(seg(T, 4.4, 5.4)) * 0.5)
    panelGlow.position.x = panelX
    panelGlow.material.opacity = smooth(seg(T, 4.2, 5.0)) * 0.55 * (0.85 + 0.15 * Math.sin(T * 3))
    if (T > 4.4 && T < 5.4) events.push({ t: 4.45, x: panelX, y: Y + 1.2, z: 0.8, color: cyanColor, speed: 2.2, life: 1.0 })

    /* ---------- conectores y haces ---------- */
    const permission = smooth(seg(T, 9.9, 10.6)) * (1 - smooth(seg(T, 15.0, 15.6)))
    const authorized = smooth(seg(T, 14.3, 14.7))
    pA.set(panelX + 1.5 * panelS, Y, 0.3)
    tiles.forEach((tile, i) => {
      const start = 7.2 + i * 0.55
      const enter = easeOutBack(seg(T, start, start + 0.6))
      const x = lerp(TILE_X + 3.5, TILE_X, easeOutCubic(seg(T, start, start + 0.6)))
      const isGmail = tile.kind === 'gmail'
      place(tile.card, x, tile.y, 0.1, enter, smooth(seg(T, start, start + 0.3)))
      flashCard(tile.card, bump(seg(T, start + 0.3, start + 1.2)) * 0.5)
      if (T > start + 0.2 && T < start + 1) events.push({ t: start + 0.25, x: TILE_X, y: tile.y, z: 0.8, color: cyanColor, speed: 1.8, life: 0.9 })

      // haz panel → conector; ámbar y pulsante en el paso 3, verde solo en Gmail al autorizar
      const travel = easeInOutCubic(seg(T, start + 0.3, start + 1.0))
      pB.set(x - TILE_W / 2, tile.y, 0.3)
      pC.copy(pA).lerp(pB, travel)
      setBeam(tile.beam, pA, pC, 0.035 + permission * 0.03 * (0.5 + 0.5 * Math.sin(T * 6 + i)))
      const warn = permission * (1 - (isGmail ? authorized : 0))
      const good = isGmail ? authorized : 0
      tile.beam.material.color.copy(cyanColor).lerp(amberColor, warn).lerp(greenColor, good)
      tile.beam.material.opacity = 0.75 * smooth(seg(T, start + 0.3, start + 0.6)) * (1 - smooth(seg(T, 15.0, 15.7)))
      if (travel < 0.001) tile.beam.visible = false

      // candado ámbar sobre cada conector durante el paso 3
      const lockK = easeOutBack(seg(T, 9.9 + i * 0.25, 10.5 + i * 0.25)) * (1 - smooth(seg(T, 13.0, 13.4)))
      tile.lock.position.set(x + TILE_W / 2 - 0.25, tile.y + TILE_H / 2 - 0.1, 0.55)
      tile.lock.scale.setScalar(safeScale(lockK))
      tile.lock.visible = lockK > 0.002
      tile.lock.material.opacity = 1
      setShockRing(tile.ring, T - (10.0 + i * 0.25), 1.0, 1.7)
      tile.ring.position.set(x, tile.y, 0.3)
      tile.ring.material.color.set(AMBER)
    })

    /* ---------- advertencia ---------- */
    const bannerK = smooth(seg(T, 9.7, 10.3)) * (1 - smooth(seg(T, 12.7, 13.2)))
    banner.position.set(-0.4, 6.95, 0.4)
    banner.material.opacity = bannerK
    banner.scale.setScalar(safeScale(lerp(0.9, 1, bannerK)))
    banner.visible = bannerK > 0.01
    amberWash.intensity = bannerK * 14 * (0.85 + 0.15 * Math.sin(T * 5))

    /* ---------- diálogo de autorización ---------- */
    const dialogIn = easeOutBack(seg(T, 12.9, 13.5))
    const dialogOut = smooth(seg(T, 14.5, 14.95))
    place(dialog, DIALOG.x, DIALOG.y, 1.4, dialogIn * (1 - dialogOut * 0.15), smooth(seg(T, 12.9, 13.25)) * (1 - dialogOut))
    flashCard(dialog, bump(seg(T, 14.1, 14.6)) * 0.6)

    // cursor: entra, va al botón «Autorizar» y hace clic
    const btnX = DIALOG.x + (0.745 - 0.5) * DIALOG.w
    const btnY = DIALOG.y + (0.5 - 0.775) * DIALOG.h
    const cMove = easeInOutCubic(seg(T, 13.4, 14.1))
    const click = bump(seg(T, 14.1, 14.35))
    const cx = lerp(btnX + 2.2, btnX, cMove)
    const cy = lerp(btnY - 1.4, btnY, cMove) - click * 0.08
    cursor.position.set(cx + 0.31, cy - 0.41, 1.7)
    cursor.scale.setScalar(1 - click * 0.1)
    cursor.material.opacity = smooth(seg(T, 13.3, 13.55)) * (1 - smooth(seg(T, 14.5, 14.8)))
    cursor.visible = cursor.material.opacity > 0.01
    setShockRing(okRing, T - 14.15, 0.8, 1.2)
    okRing.position.set(btnX, btnY, 1.6)
    if (T > 14.15 && T < 15) events.push({ t: 14.2, x: btnX, y: btnY, z: 1.8, color: greenColor, speed: 2.2, life: 1.0 })

    /* ---------- borrador (acción autorizada) ---------- */
    const draftIn = easeOutBack(seg(T, 14.6, 15.2))
    const draftY = 0.75
    place(draft, -1.2, draftY, 0.2, draftIn, smooth(seg(T, 14.6, 14.95)))
    flashCard(draft, bump(seg(T, 15.0, 15.8)) * 0.6)
    const gmail = tiles[1]
    pA.set(TILE_X - TILE_W / 2, gmail.y - TILE_H / 2 + 0.2, 0.3)
    pB.set(-1.2 + 2.6, draftY + 0.4, 0.3)
    const dTravel = easeInOutCubic(seg(T, 14.5, 15.1))
    pC.copy(pA).lerp(pB, dTravel)
    setBeam(draftBeam, pA, pC, 0.035)
    draftBeam.material.opacity = 0.8 * smooth(seg(T, 14.5, 14.7)) * (1 - smooth(seg(T, 15.3, 15.9)))
    if (dTravel < 0.001) draftBeam.visible = false

    footerPlane.material.opacity = smooth(seg(T, 14.7, 15.2)) * (1 - smooth(seg(T, 15.7, 16)))
    footerPlane.visible = footerPlane.material.opacity > 0.01

    bursts.update(T, events)
    return Math.min(4, Math.floor(T / 3.2))
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize: stage.resize, dispose }
}
