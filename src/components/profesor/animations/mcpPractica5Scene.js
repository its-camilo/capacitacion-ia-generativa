import * as THREE from 'three'
import { bump, easeOutBack, easeOutCubic, lerp, roundRectPath, seg, smooth } from './threeKit'
import {
  FONT_BODY,
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
 * Escena “Revisar permisos y desconectar” (Sesión 3, Práctica 5).
 * Loop de 16 s en 5 fases de 3,2 s:
 *   0 Configuración → Conectores: qué quedó conectado · 1 desconectar Gmail y Canva ·
 *   2 dejar Drive solo si se necesita · 3 borrar los borradores de prueba de Gmail ·
 *   4 borrar la copia de la hoja en Drive.
 * `draw(t)` es una función pura del tiempo dentro del loop.
 */
export const MCP_PRACTICA5_DURATION = 16

const GREEN = 0x3be09a
const CYAN = 0x7fdcff
const RED = 0xff6b5e
const AMBER = 0xffd04b

const PY = 3.1
const PHASE = 3.2
const SET = { w: 7.4, h: 4.2 }
const MAIL = { w: 7.4, h: 4.2 }
const DRIVE = { w: 7.4, h: 4.2 }
const CONNECTORS = ['Gmail', 'Canva', 'Drive']
const ROW_V = [0.4, 0.58, 0.76]
const rowY = (v) => PY + (0.5 - v) * SET.h
const TOGGLE_X = 2.5
const DRAFTS = ['Borrador de prueba 1', 'Borrador de prueba 2', 'Borrador de prueba 3']
const DRAFT_Y = [PY + 0.8, PY - 0.1, PY - 1.0]
const SETTINGS_END = 3 * PHASE

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

function drawSettings(ctx, w, h) {
  header(ctx, w, h, 'Configuración → Conectores', '#34425f')
  CONNECTORS.forEach((name, i) => {
    const y = h * ROW_V[i]
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = 'rgba(4,35,97,0.16)'
    ctx.lineWidth = 3
    roundRectPath(ctx, w * 0.04, y - h * 0.075, w * 0.92, h * 0.15, 16)
    ctx.fill()
    ctx.stroke()
    fitText(ctx, name, w * 0.08, y + h * 0.03, { weight: 800, size: h * 0.075, maxWidth: w * 0.4, color: '#042361' })
  })
}

function drawMail(ctx, w, h) {
  header(ctx, w, h, 'Gmail · Borradores', '#c0392b')
}

function drawDrive(ctx, w, h) {
  header(ctx, w, h, 'Drive', '#1f8a5b')
}

function drawToggle(ctx, w, h, on) {
  ctx.fillStyle = on ? '#3be09a' : '#c9d1e3'
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fill()
  fitText(ctx, on ? 'Conectado' : 'Desconectado', on ? w * 0.42 : w * 0.58, h * 0.66, { weight: 800, size: h * 0.36, maxWidth: w * 0.62, color: on ? '#042361' : 'rgba(4,35,97,0.6)', align: 'center' })
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(on ? w - h / 2 : h / 2, h / 2, h * 0.38, 0, Math.PI * 2)
  ctx.fill()
}

function drawRow(ctx, w, h, text, color) {
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = color
  ctx.lineWidth = 6
  roundRectPath(ctx, 4, 4, w - 8, h - 8, h / 4)
  ctx.fill()
  ctx.stroke()
  fitText(ctx, text, w * 0.05, h * 0.64, { weight: 800, size: h * 0.4, maxWidth: w * 0.9, color: '#042361' })
}

function drawFileRow(ctx, w, h) {
  ctx.fillStyle = '#e3f3ea'
  ctx.strokeStyle = '#1f8a5b'
  ctx.lineWidth = 6
  roundRectPath(ctx, 4, 4, w - 8, h - 8, h / 4)
  ctx.fill()
  ctx.stroke()
  fitText(ctx, 'Copia de la hoja de notas', w * 0.05, h * 0.64, { weight: 800, size: h * 0.4, family: FONT_BODY, maxWidth: w * 0.9, color: '#042361' })
}

function drawChip(ctx, w, h, text, fill, ink = '#042361') {
  ctx.fillStyle = fill
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fill()
  fitText(ctx, text, w / 2, h * 0.67, { weight: 800, size: h * 0.46, maxWidth: w * 0.92, color: ink, align: 'center' })
}

function drawGlyph(ctx, w, h, kind) {
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = w * 0.14
  ctx.fillStyle = kind === 'check' ? '#3be09a' : '#e5483b'
  ctx.beginPath()
  ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  if (kind === 'check') {
    ctx.strokeStyle = '#042361'
    ctx.moveTo(w * 0.28, h * 0.52)
    ctx.lineTo(w * 0.44, h * 0.68)
    ctx.lineTo(w * 0.74, h * 0.34)
  } else {
    ctx.strokeStyle = '#ffffff'
    ctx.moveTo(w * 0.32, h * 0.32)
    ctx.lineTo(w * 0.68, h * 0.68)
    ctx.moveTo(w * 0.68, h * 0.32)
    ctx.lineTo(w * 0.32, h * 0.68)
  }
  ctx.stroke()
}

/* ------------------------------------------------------------------ */

export default function createMcpPractica5Scene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: MCP_PRACTICA5_DURATION,
    frame: { wideHalfW: 8.7, narrowHalfW: 6.2, halfH: 4.45, camY: 5.0, lookY: 3.3 },
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 10, perBurst: 18, seed: 67 })
  scene.add(bursts.points)
  const greenColor = new THREE.Color(GREEN)
  const cyanColor = new THREE.Color(CYAN)
  const redColor = new THREE.Color(RED)
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

  const settings = makeCard(SET, drawSettings, { emissive: '#7fdcff' })
  const mail = makeCard(MAIL, drawMail, { emissive: '#ff6b5e' })
  const drive = makeCard(DRIVE, drawDrive, { emissive: '#3be09a' })
  const allCards = [settings, mail, drive]
  allCards.forEach((card) => scene.add(card.group))

  /* interruptores: dos texturas por conector que se funden */
  const toggles = CONNECTORS.map(() => ({
    on: makePlane(2.0, 0.5, 160, (ctx, w, h) => drawToggle(ctx, w, h, true)),
    off: makePlane(2.0, 0.5, 160, (ctx, w, h) => drawToggle(ctx, w, h, false)),
  }))
  const scan = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, depthWrite: false, toneMapped: false }),
  )
  scan.renderOrder = 4
  scene.add(scan)

  const chip = (text, fill, wd) => {
    const mesh = makePlane(wd, 0.66, 200, (ctx, w, h) => drawChip(ctx, w, h, text, fill), 6)
    mesh.position.set(0, PY - 2.65, 0.3)
    return mesh
  }
  const chips = [
    chip('Qué quedó conectado', '#ffd04b', 4.0),
    chip('Desconectar Gmail y Canva', '#ffb3aa', 4.8),
    chip('Drive: solo si se necesita', '#9fe8ff', 4.8),
    chip('Borrar los borradores de prueba', '#ffb3aa', 5.4),
    chip('Borrar la copia de la hoja', '#ffb3aa', 4.6),
  ]
  const driveBadge = makePlane(2.6, 0.5, 200, (ctx, w, h) => drawChip(ctx, w, h, 'Solo si lo necesita', '#9fe8ff'), 6)

  const draftRows = DRAFTS.map((text) => makePlane(5.6, 0.7, 150, (ctx, w, h) => drawRow(ctx, w, h, text, 'rgba(192,57,43,0.45)')))
  const trash = DRAFTS.map(() => makePlane(0.5, 0.5, 128, (ctx, w, h) => drawGlyph(ctx, w, h, 'cross'), 6))
  const fileRow = makePlane(5.6, 0.8, 150, drawFileRow)
  const fileTrash = makePlane(0.6, 0.6, 128, (ctx, w, h) => drawGlyph(ctx, w, h, 'cross'), 6)
  const keepCheck = makePlane(0.5, 0.5, 128, (ctx, w, h) => drawGlyph(ctx, w, h, 'check'), 6)

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
    const T = t * MCP_PRACTICA5_DURATION
    const events = []
    stage.update(T, 0)
    stage.spot.position.set(0, 4.6, 5.5)
    const op = [0, 1, 2, 3, 4].map((i) => phaseOpacity(T, i))
    const e = [0, 1, 2, 3, 4].map((i) => enter(T, i))

    /* ---------- pasos 0 a 2: la tarjeta de Conectores se mantiene ---------- */
    const settingsOp = smooth(seg(T, 0.1, 0.6)) * (1 - smooth(seg(T, SETTINGS_END - 0.35, SETTINGS_END)))
    place(settings, 0, PY - e[0].drop, e[0].scale, settingsOp)

    /* Gmail se apaga en 4,2 s; Canva, en 5,2 s; Drive nunca */
    const offAt = [4.2, 5.2, Infinity]
    toggles.forEach((pair, i) => {
      const off = Number.isFinite(offAt[i]) ? smooth(seg(T, offAt[i], offAt[i] + 0.35)) : 0
      pair.on.position.set(TOGGLE_X, rowY(ROW_V[i]), 0.15)
      pair.off.position.set(TOGGLE_X, rowY(ROW_V[i]), 0.16)
      shown(pair.on, settingsOp * (1 - off))
      shown(pair.off, settingsOp * off)
      if (Number.isFinite(offAt[i]) && T >= offAt[i] && T < offAt[i] + 1) {
        events.push({ t: offAt[i], x: TOGGLE_X, y: rowY(ROW_V[i]), z: 0.9, color: redColor, speed: 1.3, life: 0.8 })
      }
    })

    /* paso 0: barrido de revisión */
    const sweep = easeOutCubic(seg(T, 0.8, 2.6))
    scan.position.set(0, lerp(rowY(ROW_V[0]), rowY(ROW_V[2]), sweep), 0.1)
    scan.scale.set(SET.w * 0.92, 0.62, 1)
    shown(scan, 0.28 * smooth(seg(T, 0.8, 1.0)) * (1 - smooth(seg(T, 2.6, 3.0))) * op[0])
    popChip(chips[0], T, 2.4, op[0])

    /* paso 1 */
    flashCard(settings, bump(seg(T, 4.2, 5.8)) * 0.3)
    popChip(chips[1], T, 5.4, op[1])

    /* paso 2: Drive se queda */
    keepCheck.position.set(TOGGLE_X - 1.5, rowY(ROW_V[2]), 0.3)
    keepCheck.scale.setScalar(safeScale(easeOutBack(seg(T, 7.4, 7.9))))
    shown(keepCheck, op[2] * smooth(seg(T, 7.4, 7.6)))
    driveBadge.position.set(-1.4, rowY(ROW_V[2]), 0.3)
    driveBadge.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 7.4, 7.9)))))
    shown(driveBadge, op[2] * smooth(seg(T, 7.4, 7.8)))
    if (T >= 7.4 && T < 8.4) events.push({ t: 7.4, x: TOGGLE_X - 1.5, y: rowY(ROW_V[2]), z: 0.9, color: greenColor, speed: 1.2, life: 0.8 })
    popChip(chips[2], T, 8.6, op[2])

    /* ---------- paso 3: borrar los borradores de prueba ---------- */
    place(mail, 0, PY - e[3].drop, e[3].scale, op[3])
    draftRows.forEach((row, i) => {
      const del = 11.2 + i * 0.5
      const gone = smooth(seg(T, del, del + 0.45))
      row.position.set(lerp(0, 1.2, gone), DRAFT_Y[i], 0.2)
      row.scale.setScalar(safeScale(1 - gone * 0.15))
      shown(row, op[3] * smooth(seg(T, 9.9 + i * 0.15, 10.3 + i * 0.15)) * (1 - gone))
      trash[i].position.set(3.35, DRAFT_Y[i], 0.3)
      trash[i].scale.setScalar(safeScale(easeOutBack(seg(T, del - 0.3, del + 0.1))))
      shown(trash[i], op[3] * smooth(seg(T, del - 0.3, del - 0.1)) * (1 - smooth(seg(T, del + 0.5, del + 0.9))))
      if (T >= del && T < del + 1) events.push({ t: del, x: 0, y: DRAFT_Y[i], z: 0.9, color: redColor, speed: 1.5, life: 0.8 })
    })
    popChip(chips[3], T, 12.4, op[3])

    /* ---------- paso 4: borrar la copia de la hoja en Drive ---------- */
    place(drive, 0, PY - e[4].drop, e[4].scale, op[4])
    const delFile = 14.0
    const goneFile = smooth(seg(T, delFile, delFile + 0.5))
    fileRow.position.set(0, PY, 0.2)
    fileRow.scale.setScalar(safeScale(1 - goneFile * 0.2))
    shown(fileRow, op[4] * smooth(seg(T, 13.0, 13.4)) * (1 - goneFile))
    fileTrash.position.set(0, PY, 0.4)
    fileTrash.scale.setScalar(safeScale(easeOutBack(seg(T, 13.7, delFile + 0.1))))
    shown(fileTrash, op[4] * smooth(seg(T, 13.7, 13.9)) * (1 - smooth(seg(T, delFile + 0.5, delFile + 0.9))))
    flashCard(drive, bump(seg(T, delFile, delFile + 0.8)) * 0.3)
    if (T >= delFile && T < delFile + 1) events.push({ t: delFile, x: 0, y: PY, z: 0.9, color: cyanColor, speed: 1.6, life: 0.9 })
    if (T >= delFile && T < delFile + 1) events.push({ t: delFile + 0.05, x: 0, y: PY, z: 0.9, color: amberColor, speed: 1.0, life: 0.7 })
    popChip(chips[4], T, 14.5, op[4])

    bursts.update(T, events)
    return Math.min(4, Math.floor(T / PHASE))
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize: stage.resize, dispose }
}
