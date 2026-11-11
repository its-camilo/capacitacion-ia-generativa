import * as THREE from 'three'
import {
  bump,
  easeInOutCubic,
  easeOutBack,
  lerp,
  roundRectPath,
  seg,
  smooth,
} from './threeKit'
import {
  COURSE_COLORS,
  FONT_BODY,
  addGlow,
  createBurstSystem,
  createStage,
  drawNotebookCover,
  fitText,
  flashCard,
  makeBeam,
  makeCursorTexture,
  makeShockRing,
  makeSlabCard,
  makeSpiral,
  makeTex,
  makeTextPlane,
  safeScale,
  setBeam,
  setShockRing,
} from './stageKit'

/**
 * Práctica 2 · Crear el cuaderno y cargar
 *  1 Añadir fuente · 2 Desde Drive · 3 Procesando · 4 5 fuentes · 5 Un cuaderno por curso
 */

export const PRACTICA2_DURATION = 16

const WIN_W = 13.4
const WIN_H = 7.0
const WIN_POS = { x: 0, y: 3.55, z: 0 }

/* encuadre del escenario (el mismo que recibe createStage) */
const STAGE_FOV = 34
const FRAME = { wideHalfW: 8.6, narrowHalfW: 6.4, halfH: 4.5, camY: 5.0, lookY: 3.45 }
const STAGE_TAN_HALF = Math.tan((STAGE_FOV * Math.PI) / 360)
// deriva de cámara en X (±0.4) y margen vertical que se reservan para que el contador nunca quede cortado
const CAM_DRIFT_X = 0.4
const CAM_MARGIN_Y = 0.35
// ancho libre mínimo a cada lado de la ventana para poner allí el contador
const SIDE_BAND_MIN = 1.8
const COUNTER_SIZE = 0.8
const FILES = [
  { title: '01 Programa', tone: '#4574b9' },
  { title: 'Lectura 1 · Oferta y demanda', tone: '#1f8a5b' },
  { title: 'Lectura 2 · Elasticidades', tone: '#1f8a5b' },
  { title: 'Artículo · Controles de precios', tone: '#a07ad8' },
  { title: 'Transcripción · Semana 4', tone: '#e08a2c' },
]
const ROW_X = -4.45
const ROW_Y = [0.62, -0.24, -1.1, -1.96, -2.82] // relativo al centro de la ventana
const BTN = { x: -4.45, y: 1.55 }
const DRIVE = { x: 1.3, y: 0.55, z: 1.7 }

/* diálogo “Añadir fuentes” */
const DLG = { w: 7.0, h: 3.9, x: 0.7, y: 0.1, z: 1.0 }
const DLG_TILES = [
  { label: 'Google Drive', col: 0, row: 0 },
  { label: 'Subir archivos', col: 1, row: 0 },
  { label: 'Sitios web', col: 0, row: 1 },
  { label: 'Texto copiado', col: 1, row: 1 },
]
const tilePx = (t) => ({ x: 40 + t.col * 320, y: 112 + t.row * 138, w: 300, h: 118 })
const driveTile = tilePx(DLG_TILES[0])
const DRIVE_TILE_LOCAL = {
  x: (driveTile.x + driveTile.w / 2 - 350) / 100,
  y: (195 - (driveTile.y + driveTile.h / 2)) / 100,
}

/* cursos mezclados */
const COURSE_NAMES = ['Curso A', 'Curso B', 'Curso C']
const SEP_X = [-5.6, 0, 5.6]
const MIXED_POS = [
  { x: -6.0, y: 2.0 }, { x: -3.7, y: 4.1 }, { x: -2.1, y: 1.6 },
  { x: -0.5, y: 3.9 }, { x: 1.4, y: 1.7 }, { x: 3.3, y: 4.2 },
  { x: 5.0, y: 2.1 }, { x: -1.6, y: 2.9 }, { x: 6.2, y: 4.1 },
]
// documento (curso, índice dentro del curso) por posición del arreglo MIXED_POS
const DOC_DEFS = [
  { c: 0, j: 0 }, { c: 1, j: 0 }, { c: 2, j: 0 },
  { c: 0, j: 1 }, { c: 1, j: 1 }, { c: 2, j: 1 },
  { c: 0, j: 2 }, { c: 1, j: 2 }, { c: 2, j: 2 },
]
const docIndex = (c, j) => DOC_DEFS.findIndex((d) => d.c === c && d.j === j)

function drawWindow(ctx, w, h) {
  ctx.fillStyle = '#e8eef8'
  ctx.fillRect(0, 0, w, h)
  // barra superior
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, 74)
  ctx.fillStyle = '#d6e0f2'
  ctx.fillRect(0, 74, w, 3)
  ;['#ff6b6b', '#f4cb18', '#3be09a'].forEach((c, i) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(46 + i * 34, 37, 11, 0, Math.PI * 2)
    ctx.fill()
  })
  fitText(ctx, 'Microeconomía I', w / 2, 48, { weight: 800, size: 30, maxWidth: 420, color: '#042361', align: 'center' })
  const panels = [
    { x: 30, w: 390, title: 'Fuentes' },
    { x: 440, w: 460, title: 'Chat' },
    { x: 920, w: 390, title: 'Studio' },
  ]
  panels.forEach((p) => {
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = 'rgba(4,35,97,0.12)'
    ctx.shadowBlur = 14
    roundRectPath(ctx, p.x, 98, p.w, h - 128, 26)
    ctx.fill()
    ctx.shadowColor = 'transparent'
    fitText(ctx, p.title, p.x + 28, 150, { weight: 800, size: 30, maxWidth: 200, color: '#042361' })
  })
  // Fuentes: estado vacío
  ctx.fillStyle = '#c4d3ec'
  roundRectPath(ctx, 195, 520, 60, 76, 10)
  ctx.fill()
  fitText(ctx, 'Las fuentes guardadas', 225, 626, { weight: 500, size: 22, family: FONT_BODY, color: '#8497bb', align: 'center', maxWidth: 340 })
  // Chat: mensaje y campo
  ctx.fillStyle = '#eef3fb'
  roundRectPath(ctx, 470, h - 150, 400, 78, 39)
  ctx.fill()
  fitText(ctx, 'Empieza a escribir…', 505, h - 100, { weight: 500, size: 24, family: FONT_BODY, color: '#8497bb', maxWidth: 330 })
  ctx.fillStyle = '#d6e3f8'
  roundRectPath(ctx, 470, 200, 300, 26, 13)
  ctx.fill()
  roundRectPath(ctx, 470, 244, 360, 26, 13)
  ctx.fill()
  roundRectPath(ctx, 470, 288, 220, 26, 13)
  ctx.fill()
  // Studio: rejilla de salidas apagadas
  for (let i = 0; i < 6; i += 1) {
    ctx.fillStyle = '#e4ecfa'
    roundRectPath(ctx, 948 + (i % 2) * 176, 190 + Math.floor(i / 2) * 118, 160, 100, 18)
    ctx.fill()
    ctx.fillStyle = '#c4d3ec'
    ctx.beginPath()
    ctx.arc(948 + (i % 2) * 176 + 40, 190 + Math.floor(i / 2) * 118 + 50, 18, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawButton(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#5b8ad0')
  g.addColorStop(1, '#3b68ad')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(40, h / 2 - 4, 36, 8)
  ctx.fillRect(54, h / 2 - 18, 8, 36)
  fitText(ctx, 'Añadir fuente', 100, h * 0.66, { weight: 800, size: 40, maxWidth: w - 130, color: '#ffffff' })
}

function drawDriveLogo(ctx, cx, cy, s) {
  const pts = (arr) => {
    ctx.beginPath()
    arr.forEach(([x, y], i) => (i ? ctx.lineTo(cx + x * s, cy + y * s) : ctx.moveTo(cx + x * s, cy + y * s)))
    ctx.closePath()
  }
  ctx.fillStyle = '#1b6fe4'
  pts([[-0.5, 0.3], [-0.3, 0.62], [0.0, 0.62], [-0.2, 0.3]])
  ctx.fill()
  ctx.fillStyle = '#12a85a'
  pts([[-0.5, 0.3], [-0.0, -0.58], [0.2, -0.24], [-0.2, 0.3]])
  ctx.fill()
  ctx.fillStyle = '#f9b61c'
  pts([[0.0, -0.58], [0.3, -0.58], [0.62, 0.0], [0.4, 0.3], [0.2, -0.24]])
  ctx.fill()
  ctx.fillStyle = '#e8453c'
  pts([[-0.3, 0.62], [0.5, 0.62], [0.62, 0.3], [-0.2, 0.3]])
  ctx.fill()
}

function drawDialog(ctx, w, h) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  fitText(ctx, 'Añadir fuentes', 40, 74, { weight: 800, size: 36, maxWidth: 400, color: '#042361' })
  ctx.fillStyle = '#e2eaf7'
  ctx.fillRect(40, 90, w - 80, 3)
  DLG_TILES.forEach((tile, i) => {
    const p = tilePx(tile)
    ctx.fillStyle = i === 0 ? '#eaf2ff' : '#f2f5fb'
    roundRectPath(ctx, p.x, p.y, p.w, p.h, 20)
    ctx.fill()
    ctx.strokeStyle = i === 0 ? '#4574b9' : '#d6e0f2'
    ctx.lineWidth = i === 0 ? 4 : 2
    ctx.stroke()
    const cx = p.x + 62
    const cy = p.y + p.h / 2
    if (i === 0) {
      drawDriveLogo(ctx, cx, cy, 54)
    } else {
      ctx.strokeStyle = '#8497bb'
      ctx.lineWidth = 6
      ctx.lineCap = 'round'
      ctx.beginPath()
      if (i === 1) {
        ctx.moveTo(cx, cy + 22)
        ctx.lineTo(cx, cy - 22)
        ctx.moveTo(cx - 16, cy - 6)
        ctx.lineTo(cx, cy - 24)
        ctx.lineTo(cx + 16, cy - 6)
      } else if (i === 2) {
        ctx.arc(cx, cy, 24, 0, Math.PI * 2)
        ctx.moveTo(cx - 24, cy)
        ctx.lineTo(cx + 24, cy)
      } else {
        roundRectPath(ctx, cx - 18, cy - 24, 36, 48, 6)
      }
      ctx.stroke()
    }
    fitText(ctx, tile.label, p.x + 112, p.y + p.h / 2 + 11, { weight: 700, size: 30, maxWidth: p.w - 130, color: '#042361' })
  })
}

function drawDriveTile(ctx, w, h) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  drawDriveLogo(ctx, w / 2, h * 0.43, w * 0.46)
  fitText(ctx, 'Drive', w / 2, h * 0.9, { weight: 800, size: 46, maxWidth: w * 0.8, color: '#042361', align: 'center' })
}

function drawChip(ctx, w, h, file) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = file.tone
  roundRectPath(ctx, 26, h * 0.2, h * 0.5, h * 0.6, 8)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(38, h * 0.38, h * 0.26, 5)
  ctx.fillRect(38, h * 0.5, h * 0.26, 5)
  fitText(ctx, file.title, 26 + h * 0.5 + 24, h * 0.5, { weight: 700, size: 34, maxWidth: w - 150 - h * 0.5, color: '#042361' })
}

function drawCounter(ctx, w, h, state) {
  const c = w / 2
  ctx.fillStyle = state.count >= 5 ? '#1f8a5b' : '#4574b9'
  ctx.beginPath()
  ctx.arc(c, c, c - 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 6
  ctx.stroke()
  fitText(ctx, String(state.count), c, c * 1.4, { weight: 900, size: 92, maxWidth: w * 0.6, color: '#ffffff', align: 'center' })
}

function drawBadgeTick(ctx, w, h) {
  const c = w / 2
  ctx.fillStyle = '#1f8a5b'
  ctx.beginPath()
  ctx.arc(c, c, c - 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = w * 0.12
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(w * 0.28, h * 0.53)
  ctx.lineTo(w * 0.44, h * 0.68)
  ctx.lineTo(w * 0.73, h * 0.34)
  ctx.stroke()
}

function drawMiniDoc(ctx, w, h, color) {
  ctx.fillStyle = '#fbf6e6'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = color
  ctx.fillRect(0, 0, w, h * 0.16)
  ctx.fillStyle = 'rgba(46,70,128,0.55)'
  for (let i = 0; i < 6; i += 1) {
    roundRectPath(ctx, w * 0.14, h * (0.3 + i * 0.105), w * (i % 3 === 2 ? 0.45 : 0.72), h * 0.045, 6)
    ctx.fill()
  }
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(w * 0.82, h * 0.92, w * 0.07, 0, Math.PI * 2)
  ctx.fill()
}

function drawCitation(ctx, w, h, label, color) {
  ctx.fillStyle = color
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fill()
  fitText(ctx, label, w / 2, h * 0.68, { weight: 800, size: h * 0.55, maxWidth: w * 0.9, color: '#042361', align: 'center' })
}

export default function createPractica2Scene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: PRACTICA2_DURATION,
    fov: STAGE_FOV,
    frame: FRAME,
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 14, perBurst: 18, seed: 21 })
  scene.add(bursts.points)
  const colorGreen = new THREE.Color(0x3be09a)
  const colorCyan = new THREE.Color(0x7fdcff)
  const colorGold = new THREE.Color(0xf4cb18)

  /* ---------------- ventana (maqueta de NotebookLM) ---------------- */
  const windowRoot = new THREE.Group()
  windowRoot.position.set(WIN_POS.x, WIN_POS.y, WIN_POS.z)
  scene.add(windowRoot)

  const windowCard = makeSlabCard({
    w: WIN_W,
    h: WIN_H,
    depth: 0.2,
    radius: 0.4,
    bevel: 0.05,
    edge: '#16356f',
    texture: makeTex(1340, 700, drawWindow, invalidate),
    roughness: 0.6,
    metalness: 0.08,
    inset: 0.06,
  })
  windowRoot.add(windowCard.group)
  const frontZ = windowCard.thickness / 2

  // botón “Añadir fuente” (3D, se hunde al pulsarlo)
  const button = makeSlabCard({
    w: 3.4,
    h: 0.66,
    depth: 0.16,
    radius: 0.3,
    bevel: 0.04,
    edge: '#2f5aa0',
    texture: makeTex(680, 132, drawButton, invalidate),
    roughness: 0.4,
    metalness: 0.1,
    emissive: '#8fe3ff',
  })
  button.group.position.set(BTN.x, BTN.y, frontZ + 0.1)
  windowRoot.add(button.group)
  const buttonGlow = addGlow(windowRoot, glow, 0x44d3fe, 5.2, 0)
  buttonGlow.position.set(BTN.x, BTN.y, frontZ + 0.15)

  // diálogo
  const dialogRoot = new THREE.Group()
  dialogRoot.position.set(DLG.x, DLG.y, DLG.z)
  windowRoot.add(dialogRoot)
  const dialog = makeSlabCard({
    w: DLG.w,
    h: DLG.h,
    depth: 0.14,
    radius: 0.3,
    bevel: 0.04,
    edge: '#c8d6ee',
    texture: makeTex(700, 390, drawDialog, invalidate),
    roughness: 0.6,
    inset: 0.05,
  })
  dialogRoot.add(dialog.group)
  const driveSpot = addGlow(dialogRoot, glow, 0x7fb6ff, 3.6, 0)
  driveSpot.position.set(DRIVE_TILE_LOCAL.x, DRIVE_TILE_LOCAL.y, dialog.thickness / 2 + 0.1)
  dialogRoot.scale.setScalar(0.0001)

  // ficha de Drive
  const driveRoot = new THREE.Group()
  driveRoot.position.set(DRIVE.x, DRIVE.y, DRIVE.z)
  windowRoot.add(driveRoot)
  const driveCard = makeSlabCard({
    w: 2.5,
    h: 2.5,
    depth: 0.14,
    radius: 0.4,
    bevel: 0.05,
    edge: '#dfe8f8',
    texture: makeTex(500, 500, drawDriveTile, invalidate),
    roughness: 0.5,
  })
  driveRoot.add(driveCard.group)
  addGlow(driveRoot, glow, 0x9fc4ff, 6.2, 0.35).position.z = -0.4
  driveRoot.scale.setScalar(0.0001)

  // contador de fuentes
  const counterState = { count: 0 }
  const counterTex = makeTex(160, 160, (ctx, w, h) => drawCounter(ctx, w, h, counterState), invalidate)
  const counter = makeTextPlane(COUNTER_SIZE, COUNTER_SIZE, counterTex)
  windowRoot.add(counter)
  const counterGlow = addGlow(windowRoot, glow, 0x3be09a, 1, 0)
  const counterRing = makeShockRing(0x3be09a)
  windowRoot.add(counterRing)

  /**
   * El contador vive FUERA de la ventana, en aire libre (coordenadas locales de windowRoot).
   *  - Escritorio (escenario 2:1): a la derecha de la ventana, arriba, en la franja libre entre
   *    el borde de la ventana y el borde visible de la cámara.
   *  - Móvil (4:3): la ventana ya ocupa todo el ancho visible y el suelo queda debajo, así que
   *    va en la franja de aire sobre la ventana, en la esquina derecha, con el pop acotado a esa franja.
   * `clear` es la distancia del centro del contador al borde más cercano de la ventana:
   * el brillo y el anillo se limitan a ella para que tampoco invadan la ventana.
   */
  let counterLayout = null
  function placeCounter(w, h) {
    const aspect = w / h
    const narrow = stage.isNarrow()
    const halfW = lerp(FRAME.wideHalfW, FRAME.narrowHalfW, narrow)
    const dist = Math.max(halfW / (STAGE_TAN_HALF * aspect), FRAME.halfH / STAGE_TAN_HALF)
    const viewHalfW = dist * STAGE_TAN_HALF * aspect - CAM_DRIFT_X
    const viewTop = FRAME.lookY + dist * STAGE_TAN_HALF - CAM_MARGIN_Y
    const band = viewHalfW - WIN_W / 2
    let x
    let y
    let clear
    if (band >= SIDE_BAND_MIN) {
      clear = Math.min(band / 2, 1)
      x = WIN_W / 2 + clear
      y = 2.6
      counterLayout = { base: 1, popAmp: 0.2, peak: 1.3, maxScale: 1.45 }
    } else {
      const lane = viewTop - WIN_POS.y - WIN_H / 2
      clear = lane / 2
      x = viewHalfW - 0.55
      y = WIN_H / 2 + clear
      const maxScale = Math.max(0.4, (lane - 0.16) / COUNTER_SIZE)
      counterLayout = { base: 0.85, popAmp: 0.1, peak: maxScale * 0.95, maxScale }
    }
    counterLayout.ringMax = Math.max(0.1, clear - 0.04)
    const z = frontZ + 0.08
    counter.position.set(x, y, z)
    counterGlow.position.set(x, y, z)
    counterGlow.scale.set(counterLayout.ringMax * 2, counterLayout.ringMax * 2, 1)
    counterRing.position.set(x, y, z)
  }
  placeCounter(width, height)

  // chips de las 5 fuentes
  const checkTex = makeTex(128, 128, drawBadgeTick, invalidate)
  const chips = FILES.map((file, i) => {
    const group = new THREE.Group()
    windowRoot.add(group)
    const card = makeSlabCard({
      w: 3.5,
      h: 0.74,
      depth: 0.08,
      radius: 0.22,
      bevel: 0.03,
      edge: '#c9d6ee',
      texture: makeTex(700, 156, (ctx, w, h) => drawChip(ctx, w, h, file), invalidate),
      roughness: 0.55,
      emissive: '#3be09a',
    })
    group.add(card.group)
    const z = card.thickness / 2 + 0.014
    const track = new THREE.Mesh(
      new THREE.PlaneGeometry(2.9, 0.07),
      new THREE.MeshBasicMaterial({ color: 0xd5e0f3, transparent: true }),
    )
    track.position.set(-0.2, -0.28, z)
    const fillGeometry = new THREE.PlaneGeometry(1, 1)
    fillGeometry.translate(0.5, 0, 0)
    const fill = new THREE.Mesh(fillGeometry, new THREE.MeshBasicMaterial({ color: 0x2aa7f0, transparent: true }))
    fill.position.set(-0.2 - 1.45, -0.28, z + 0.002)
    fill.scale.set(0.0001, 0.07, 1)
    const spinner = new THREE.Mesh(
      new THREE.RingGeometry(0.13, 0.19, 28, 1, 0, 4.6),
      new THREE.MeshBasicMaterial({ color: 0x2aa7f0, side: THREE.DoubleSide, transparent: true }),
    )
    spinner.position.set(1.42, 0.02, z + 0.004)
    const check = new THREE.Sprite(new THREE.SpriteMaterial({ map: checkTex, transparent: true, depthWrite: false }))
    check.position.set(1.42, 0.02, z + 0.1)
    check.scale.setScalar(0.0001)
    group.add(track, fill, spinner, check)
    group.visible = false
    return { group, card, track, fill, spinner, check, i }
  })

  // tapa del cuaderno que cae
  const lidPivot = new THREE.Group()
  lidPivot.position.set(0, WIN_H / 2, frontZ + 0.3)
  windowRoot.add(lidPivot)
  const lid = makeSlabCard({
    w: WIN_W,
    h: WIN_H,
    depth: 0.3,
    radius: 0.4,
    bevel: 0.07,
    edge: '#0b2a66',
    texture: makeTex(1340, 700, (ctx, w, h) => drawNotebookCover(ctx, w, h, { title: 'Microeconomía I', subtitle: '5 fuentes · listo' }), invalidate),
    roughness: 0.5,
    metalness: 0.15,
    inset: 0.08,
  })
  lid.group.position.y = -WIN_H / 2
  lidPivot.add(lid.group)
  const lidSpiral = makeSpiral(26, 0.5, 0.2)
  lidSpiral.rotation.z = Math.PI / 2
  lidSpiral.position.set(0, -0.15, lid.thickness / 2 + 0.02)
  lidPivot.add(lidSpiral)
  lidPivot.visible = false
  const lidGlow = addGlow(windowRoot, glow, 0xf4cb18, 14, 0)
  lidGlow.position.set(0, 0, frontZ + 0.5)
  const impactRing = makeShockRing(0xf4cb18)
  impactRing.position.set(0, 0, frontZ + 0.7)
  windowRoot.add(impactRing)

  // cursor
  const cursor = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeCursorTexture(), transparent: true, depthWrite: false, depthTest: false }))
  cursor.renderOrder = 20
  cursor.scale.setScalar(1.0)
  windowRoot.add(cursor)

  /* ---------------- tres cursos ---------------- */
  const courseRoot = new THREE.Group()
  scene.add(courseRoot)
  const courseColors = COURSE_COLORS.map((c) => new THREE.Color(c))

  const docsC = DOC_DEFS.map((def, i) => {
    const group = new THREE.Group()
    courseRoot.add(group)
    const card = makeSlabCard({
      w: 1.25,
      h: 1.65,
      depth: 0.05,
      radius: 0.1,
      bevel: 0.02,
      edge: '#efe6cb',
      texture: makeTex(250, 330, (ctx, w, h) => drawMiniDoc(ctx, w, h, COURSE_COLORS[def.c]), invalidate),
    })
    group.add(card.group)
    const halo = addGlow(group, glow, courseColors[def.c], 3.2, 0.45)
    halo.position.z = -0.25
    return { group, card, def, i }
  })

  const covers = COURSE_NAMES.map((name, c) => {
    const group = new THREE.Group()
    group.position.set(SEP_X[c], 2.65, -0.5)
    courseRoot.add(group)
    const card = makeSlabCard({
      w: 4.5,
      h: 4.6,
      depth: 0.22,
      radius: 0.35,
      bevel: 0.05,
      edge: '#0b2a66',
      texture: makeTex(450, 460, (ctx, w, h) => {
        const g = ctx.createLinearGradient(0, 0, w, h)
        g.addColorStop(0, '#16356f')
        g.addColorStop(1, '#0c2557')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = COURSE_COLORS[c]
        ctx.fillRect(0, 0, w, 22)
        ctx.globalAlpha = 0.15
        ctx.fillRect(0, h - 120, w, 120)
        ctx.globalAlpha = 1
        fitText(ctx, name, w / 2, h - 36, { weight: 800, size: 44, maxWidth: w * 0.7, color: COURSE_COLORS[c], align: 'center' })
      }, invalidate),
      roughness: 0.55,
      metalness: 0.12,
    })
    group.add(card.group)
    const sp = makeSpiral(9, 0.5, 0.18)
    sp.position.set(-2.25, 0, card.thickness / 2)
    group.add(sp)
    const glowC = addGlow(group, glow, courseColors[c], 7, 0.3)
    glowC.position.z = -0.6
    group.scale.setScalar(0.0001)
    return { group, card, glowC, c }
  })

  const answers = COURSE_NAMES.map((_, c) => {
    const group = new THREE.Group()
    courseRoot.add(group)
    const chip = makeTextPlane(1.5, 0.75, makeTex(300, 150, (ctx, w, h) => drawCitation(ctx, w, h, `[${c + 1}]`, COURSE_COLORS[c]), invalidate))
    group.add(chip)
    addGlow(group, glow, courseColors[c], 3.4, 0.5).position.z = -0.1
    return { group, c }
  })

  // aristas chip → documento, cada una en dos mitades de color
  const edges = []
  for (let c = 0; c < 3; c += 1) {
    for (let j = 0; j < 3; j += 1) {
      edges.push({
        c,
        j,
        dSep: docIndex(c, j),
        dMix: j === 0 ? docIndex(c, 0) : docIndex((c + j) % 3, j),
        near: makeBeam(0xffffff, 0.9),
        far: makeBeam(0xffffff, 0.9),
      })
    }
  }
  edges.forEach((e) => {
    courseRoot.add(e.near)
    courseRoot.add(e.far)
  })
  courseRoot.visible = false

  const mixedPos = (k) => MIXED_POS[k]
  const sepPos = (k) => {
    const d = DOC_DEFS[k]
    return { x: SEP_X[d.c] + (d.j - 1) * 1.3, y: 2.7 }
  }
  const mixedChipX = (c) => (c - 1) * 4.6

  const pA = new THREE.Vector3()
  const pB = new THREE.Vector3()
  const pM = new THREE.Vector3()
  const pEnd = new THREE.Vector3()
  const tmpColor = new THREE.Color()

  function resize(w, h) {
    stage.resize(w, h)
    placeCounter(w, h)
  }

  const cursorPoint = (x, y, z) => ({ x: x + 0.31, y: y - 0.41, z })

  function draw(t) {
    const T = t * PRACTICA2_DURATION
    const exit4 = smooth(seg(T, 12.45, 13.05))
    stage.update(T, 0)
    stage.spot.position.set(0, 4.6, 6)

    const events = []

    /* ---------- ventana ---------- */
    const winScale = 1 - exit4
    windowRoot.scale.setScalar(safeScale(winScale))
    windowRoot.visible = winScale > 0.002
    const jolt = settleJolt(T - 11.45)
    windowRoot.position.set(WIN_POS.x, WIN_POS.y + jolt * 0.12 - exit4 * 0.6, WIN_POS.z)
    windowRoot.rotation.set(Math.sin(T * 0.45) * 0.015, Math.sin(T * 0.33) * 0.03, 0)

    /* ---------- 1 · Añadir fuente ---------- */
    const hover = seg(T, 0.45, 1.5)
    const press = bump(seg(T, 1.5, 1.85))
    button.group.position.z = frontZ + 0.1 - press * 0.1
    flashCard(button, 0.15 + press * 0.8 + bump(seg(T, 0.3, 1.4)) * 0.3)
    buttonGlow.material.opacity = (bump(seg(T, 0.35, 1.9)) * 0.55)

    // cursor
    let cx = lerp(-1.5, BTN.x + 0.8, easeInOutCubic(hover))
    let cy = lerp(0.2, BTN.y - 0.1, easeInOutCubic(hover))
    const toDrive = easeInOutCubic(seg(T, 2.3, 3.0))
    const dlgWorldX = DLG.x + DRIVE_TILE_LOCAL.x
    const dlgWorldY = DLG.y + DRIVE_TILE_LOCAL.y
    if (T > 1.85) {
      cx = lerp(BTN.x + 0.8, dlgWorldX + 0.4, toDrive)
      cy = lerp(BTN.y - 0.1, dlgWorldY - 0.1, toDrive)
    }
    const cursorOn = smooth(seg(T, 0.3, 0.6)) * (1 - smooth(seg(T, 3.3, 3.6)))
    const clickPress = Math.max(bump(seg(T, 1.5, 1.8)), bump(seg(T, 3.0, 3.3)))
    const cp = cursorPoint(cx, cy, 1.6 + 0.001)
    cursor.position.set(cp.x, cp.y, DLG.z + 0.9)
    cursor.scale.setScalar(safeScale(cursorOn * (1 - clickPress * 0.12)))

    // diálogo
    const dlgIn = easeOutBack(seg(T, 1.85, 2.45))
    const dlgOut = smooth(seg(T, 3.25, 3.65))
    dialogRoot.scale.setScalar(safeScale(dlgIn * (1 - dlgOut)))
    dialogRoot.visible = dialogRoot.scale.x > 0.002
    driveSpot.material.opacity = (smooth(seg(T, 2.5, 3.0)) * 0.5 + bump(seg(T, 3.0, 3.35)) * 0.4) * (1 - dlgOut)

    /* ---------- 2 · Desde Drive ---------- */
    const driveIn = easeOutBack(seg(T, 3.3, 3.95))
    const driveOut = smooth(seg(T, 6.6, 7.1))
    driveRoot.scale.setScalar(safeScale(driveIn * (1 - driveOut)))
    driveRoot.visible = driveRoot.scale.x > 0.002
    driveRoot.position.set(DRIVE.x, DRIVE.y + Math.sin(T * 1.3) * 0.1, DRIVE.z)
    driveRoot.rotation.y = Math.sin(T * 0.8) * 0.12
    if (T > 3.3 && T < 4.0) events.push({ t: 3.4, x: DRIVE.x + WIN_POS.x, y: DRIVE.y + WIN_POS.y, z: DRIVE.z + 0.6, color: colorCyan, speed: 3, life: 1 })

    /* ---------- chips: vuelo, carga y verificación ---------- */
    let count = 0
    chips.forEach((chip) => {
      const i = chip.i
      const fly0 = 3.95 + i * 0.36
      const fly = easeInOutCubic(seg(T, fly0, fly0 + 0.95))
      const land = fly0 + 0.95
      chip.group.visible = T > fly0 - 0.02
      const rowY = ROW_Y[i]
      const arc = Math.sin(fly * Math.PI) * 1.1
      chip.group.position.set(
        lerp(DRIVE.x, ROW_X, fly),
        lerp(DRIVE.y, rowY, fly) + arc,
        lerp(DRIVE.z, frontZ + 0.12, fly),
      )
      const free = 1 - fly
      chip.group.rotation.set(free * 0.5, free * -0.7, free * 0.5 * (i % 2 ? 1 : -1))
      chip.group.scale.setScalar(safeScale(lerp(0.35, 1, fly)))
      if (T > land && T < land + 0.9) events.push({ t: land, x: ROW_X + WIN_POS.x, y: rowY + WIN_POS.y, z: 0.8, color: colorCyan, speed: 1.6, life: 0.8 })

      // procesando
      const p0 = 6.5 + i * 0.28
      const prog = easeInOutCubic(seg(T, p0, p0 + 1.65))
      const done = p0 + 1.65
      chip.fill.scale.x = safeScale(prog * 2.9)
      chip.fill.material.color.set(T >= done ? 0x1f8a5b : 0x2aa7f0)
      const spinning = T >= land && T < done && T > p0 - 0.2
      chip.spinner.visible = spinning
      chip.spinner.rotation.z = -T * 6
      const checkK = easeOutBack(seg(T, done, done + 0.35))
      chip.check.scale.setScalar(safeScale(checkK * 0.52))
      // la pista solo se ve mientras carga
      const trackOn = smooth(seg(T, p0 - 0.2, p0)) * (1 - smooth(seg(T, done + 0.5, done + 0.9)))
      chip.track.material.opacity = trackOn
      chip.fill.visible = trackOn > 0.01
      chip.fill.material.opacity = trackOn
      if (T >= done) count += 1
      if (T > done && T < done + 0.9) events.push({ t: done, x: ROW_X + 1.4 + WIN_POS.x, y: rowY + WIN_POS.y, z: 0.9, color: colorGreen, speed: 1.4, life: 0.8 })
      // destello verde de todos al llegar a 5
      flashCard(chip.card, bump(seg(T, 9.7 + i * 0.1, 10.3 + i * 0.1)) * 0.7)
    })

    // contador: 0..5 y pop final
    if (counterState.count !== count) {
      counterState.count = count
      counterTex.userData.repaint()
    }
    const lastDone = 6.5 + 4 * 0.28 + 1.65
    const countPop = bump(seg(T, lastDone - 0.05, lastDone + 0.9))
    const bigPop = easeOutBack(seg(T, lastDone, lastDone + 0.45)) * (1 - smooth(seg(T, 10.5, 10.9)))
    counter.visible = count > 0
    const cl = counterLayout
    const counterScale = lerp(cl.base * (1 + countPop * cl.popAmp), cl.peak, bigPop)
    counter.scale.setScalar(safeScale(Math.min(counterScale, cl.maxScale)))
    counterGlow.material.opacity = bigPop * 0.8
    setShockRing(counterRing, T - lastDone, 1.2, cl.ringMax)
    if (T > lastDone && T < lastDone + 1) events.push({ t: lastDone, x: counter.position.x + WIN_POS.x, y: counter.position.y + WIN_POS.y, z: 1, color: colorGreen, speed: 2.6, life: 1 })

    /* ---------- 4 · la tapa se cierra ---------- */
    const lidVisible = T > 10.35 && T < 13.2
    lidPivot.visible = lidVisible
    const fall = seg(T, 10.55, 11.45)
    const age = T - 11.45
    let angle = -Math.PI * (1 - fall * fall)
    if (age > 0) angle = -0.13 * Math.exp(-age * 7) * Math.abs(Math.sin(age * 13))
    lidPivot.rotation.x = angle
    lidGlow.material.opacity = bump(seg(T, 11.4, 12.6)) * 0.35
    flashCard(lid, bump(seg(T, 11.45, 11.95)) * 0.55)
    setShockRing(impactRing, T - 11.45, 0.9, 7.5)
    if (T > 11.4 && T < 12.5) {
      events.push({ t: 11.45, x: -4 + WIN_POS.x, y: WIN_POS.y - 2.5, z: 1.5, color: colorGold, speed: 3, life: 1 })
      events.push({ t: 11.47, x: 4 + WIN_POS.x, y: WIN_POS.y - 2.5, z: 1.5, color: colorGold, speed: 3, life: 1 })
      events.push({ t: 11.5, x: WIN_POS.x, y: WIN_POS.y - 3, z: 1.5, color: colorCyan, speed: 3.4, life: 1 })
    }

    /* ---------- 5 · un cuaderno por curso ---------- */
    courseRoot.visible = T > 12.7
    const move = easeInOutCubic(seg(T, 13.95, 14.9))
    const rewire = smooth(seg(T, 14.15, 14.85))
    docsC.forEach((doc) => {
      const a = mixedPos(doc.i)
      const b = sepPos(doc.i)
      const enter = easeOutBack(seg(T, 12.9 + (doc.i % 5) * 0.06, 13.5 + (doc.i % 5) * 0.06))
      const x = lerp(a.x, b.x, move)
      const y = lerp(a.y, b.y, move) + Math.sin(T * 1.1 + doc.i) * 0.07 * (1 - move)
      doc.group.position.set(x, y, lerp((doc.i % 3) * 0.25, 0.35, move))
      doc.group.rotation.set(0, Math.sin(T * 0.7 + doc.i) * 0.2 * (1 - move), (doc.i % 2 ? 0.14 : -0.12) * (1 - move))
      doc.group.scale.setScalar(safeScale(enter * lerp(1, 0.88, move)))
      flashCard(doc.card, bump(seg(T, 14.6, 15.3)) * 0.35)
    })
    covers.forEach((cv) => {
      const k = easeOutBack(seg(T, 14.15 + cv.c * 0.1, 14.85 + cv.c * 0.1))
      cv.group.scale.setScalar(safeScale(k))
      cv.group.visible = k > 0.002
      cv.glowC.material.opacity = 0.2 + bump(seg(T, 14.8, 15.6)) * 0.35
    })
    answers.forEach((a) => {
      const enter = easeOutBack(seg(T, 13.1 + a.c * 0.08, 13.65 + a.c * 0.08))
      const x = lerp(mixedChipX(a.c), SEP_X[a.c], move)
      a.group.position.set(x, 6.1 + Math.sin(T * 1.3 + a.c) * 0.06, 0.5)
      a.group.scale.setScalar(safeScale(enter))
    })
    edges.forEach((e) => {
      const chipPos = answers[e.c].group.position
      const dm = docsC[e.dMix].group.position
      const ds = docsC[e.dSep].group.position
      pA.set(chipPos.x, chipPos.y - 0.4, 0.3)
      pB.set(lerp(dm.x, ds.x, rewire), lerp(dm.y, ds.y, rewire) + 0.75, 0.3)
      const grow = smooth(seg(T, 13.45 + e.j * 0.1 + e.c * 0.05, 13.95 + e.j * 0.1 + e.c * 0.05))
      pEnd.copy(pA).lerp(pB, grow)
      pM.copy(pA).lerp(pEnd, 0.5)
      setBeam(e.near, pA, pM, 0.045)
      setBeam(e.far, pM, pEnd, 0.045)
      // color de la mitad lejana: curso del documento citado
      const mixCourse = DOC_DEFS[e.dMix].c
      tmpColor.copy(courseColors[mixCourse]).lerp(courseColors[e.c], rewire)
      e.near.material.color.copy(courseColors[e.c])
      e.far.material.color.copy(tmpColor)
    })
    if (T > 14.7 && T < 15.7) {
      SEP_X.forEach((x, c) => events.push({ t: 14.85 + c * 0.08, x, y: 4.9, z: 0.8, color: courseColors[c], speed: 2.6, life: 1 }))
    }

    bursts.update(T, events)
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize, dispose }
}

/** Sacudida breve de la ventana tras el golpe de la tapa. */
function settleJolt(age) {
  if (age < 0) return 0
  return -Math.exp(-age * 9) * Math.abs(Math.cos(age * 16))
}
