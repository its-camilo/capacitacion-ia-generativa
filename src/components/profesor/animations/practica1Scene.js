import * as THREE from 'three'
import {
  bump,
  createRandom,
  drawDocumentPage,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  lerp,
  roundRectPath,
  seg,
  smooth,
} from './threeKit'
import {
  FONT_MONO,
  addGlow,
  createBurstSystem,
  createStage,
  drawNotebookCover,
  fitText,
  flashCard,
  makeBeam,
  makeMagnifier,
  makeShockRing,
  makeSlabCard,
  makeSpiral,
  makeTex,
  makeTextPlane,
  safeScale,
  setBeam,
  setShockRing,
  window01,
} from './stageKit'

/**
 * Práctica 1 · Reunir y nombrar las fuentes
 *  1 Archivos sueltos · 2 Se renombran solos · 3 Caen en su lugar
 *  4 PDF escaneado · 5 Cobertura completa
 */

export const PRACTICA1_DURATION = 16

const MESSY_NAMES = ['programa FINAL (2)', 'Copia de lect_2 nueva', 'scan_0042']
const CLEAN_NAMES = ['01_programa', '02_lectura_modelos', '03_articulo_rag']
const DOC_TITLES = ['Programa', 'Lectura 2', 'Artículo']
const RENAME_AT = [3.75, 4.4, 5.05]

const MESSY = [
  { x: -5.4, y: 3.9, z: 0.3, rx: -0.15, ry: 0.5, rz: 0.34 },
  { x: 0.3, y: 4.6, z: -0.6, rx: 0.2, ry: -0.45, rz: -0.26 },
  { x: 5.3, y: 3.5, z: 0.5, rx: 0.1, ry: 0.6, rz: 0.2 },
]

/* geometría del cuaderno abierto */
const BOOK_W = 15.6
const BOOK_H = 6.7
const BOOK_POS = { x: 0, y: 3.35, z: -0.5 }
const SLOT_X = [-4.5, 0, 4.5]
const SLOT_DOC_Y = 0.6 // altura del documento dentro del cuaderno
const PAGE_Z = 0.3 // adelanto del documento sobre la hoja

/* mapa de temas del programa */
const TOPICS = [
  { name: 'Oferta y demanda', x: 0, y: 5.95, covered: true },
  { name: 'Equilibrio', x: -5.4, y: 4.6, covered: true },
  { name: 'Elasticidades', x: -5.4, y: 2.2, covered: true },
  { name: 'Controles de precios', x: 0, y: 0.85, covered: true },
  { name: 'Impuestos', x: 5.4, y: 4.6, covered: true },
  { name: 'Tema sin cubrir', x: 5.4, y: 2.2, covered: false },
]
const TILE_W = 4.5
const TILE_H = 1.15
const CORE = { x: 0, y: 3.45, z: 0.2 }

function drawTag(ctx, w, h, text, clean) {
  ctx.fillStyle = clean ? '#3be09a' : '#f59a3c'
  ctx.beginPath()
  ctx.arc(h * 0.5, h / 2, h * 0.14, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, text, h * 0.85, h * 0.65, {
    weight: 500,
    size: h * 0.52,
    family: FONT_MONO,
    maxWidth: w - h * 1.1,
    color: clean ? '#ffffff' : '#ffd7a8',
  })
}

function drawBookPage(ctx, w, h) {
  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, '#fbf6e6')
  bg.addColorStop(1, '#eee3c6')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = 'rgba(69,116,185,0.16)'
  ctx.lineWidth = 2
  for (let y = 70; y < h; y += 46) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }
  ctx.strokeStyle = 'rgba(224,90,90,0.4)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(w * 0.045, 0)
  ctx.lineTo(w * 0.045, h)
  ctx.stroke()
  // casillas de las fuentes: 3 llenas y 2 abiertas para “5 a 8 fuentes”
  const ppu = w / (BOOK_W - 0.7)
  SLOT_X.forEach((x) => {
    const cx = w / 2 + x * ppu
    const cy = h / 2 - (SLOT_DOC_Y - 0.5) * ppu
    ctx.setLineDash([16, 12])
    ctx.strokeStyle = 'rgba(31,138,91,0.55)'
    ctx.lineWidth = 4
    roundRectPath(ctx, cx - 1.95 * ppu, cy - 2.2 * ppu, 3.9 * ppu, 4.4 * ppu, 26)
    ctx.stroke()
    ctx.setLineDash([])
  })
  fitText(ctx, 'Cuaderno del curso', w * 0.075, h * 0.1, {
    weight: 800,
    size: 40,
    maxWidth: w * 0.3,
    color: 'rgba(4,35,97,0.4)',
  })
}

function drawScan(ctx, w, h) {
  const rand = createRandom(404)
  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, '#d7d2c1')
  bg.addColorStop(1, '#bdb8a6')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  ctx.save()
  ctx.translate(w / 2, h / 2)
  ctx.rotate(-0.045)
  ctx.translate(-w / 2, -h / 2)
  ctx.filter = 'blur(2.2px)'
  ctx.fillStyle = 'rgba(55,62,78,0.78)'
  roundRectPath(ctx, w * 0.12, h * 0.09, w * 0.5, 30, 12)
  ctx.fill()
  for (let i = 0; i < 17; i += 1) {
    const width = i % 6 === 5 ? w * (0.3 + rand() * 0.2) : w * (0.72 + rand() * 0.17)
    ctx.fillStyle = 'rgba(70,78,94,0.62)'
    roundRectPath(ctx, w * 0.12, h * 0.19 + i * 33 + (i > 5 ? 26 : 0), width, 15, 7)
    ctx.fill()
  }
  ctx.filter = 'none'
  ctx.restore()
  for (let i = 0; i < 1500; i += 1) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)'
    ctx.fillRect(rand() * w, rand() * h, 2, 2)
  }
  const shade = ctx.createLinearGradient(0, 0, w * 0.22, 0)
  shade.addColorStop(0, 'rgba(40,36,24,0.5)')
  shade.addColorStop(1, 'rgba(40,36,24,0)')
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, w * 0.22, h)
  const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.75)
  vignette.addColorStop(0, 'rgba(0,0,0,0)')
  vignette.addColorStop(1, 'rgba(30,25,15,0.5)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, w, h)
  const thumb = ctx.createRadialGradient(w * 0.93, h * 0.97, 4, w * 0.93, h * 0.97, w * 0.28)
  thumb.addColorStop(0, 'rgba(30,22,12,0.7)')
  thumb.addColorStop(1, 'rgba(30,22,12,0)')
  ctx.fillStyle = thumb
  ctx.fillRect(0, 0, w, h)
}

function drawSearchPanel(ctx, w, h) {
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#0f2c70')
  bg.addColorStop(1, '#0a2058')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  fitText(ctx, 'Buscar en el PDF', w * 0.07, h * 0.28, { weight: 700, size: 38, maxWidth: w * 0.8, color: '#9fc4ff' })
  ctx.fillStyle = '#f6f8ff'
  roundRectPath(ctx, w * 0.07, h * 0.4, w * 0.86, h * 0.34, 22)
  ctx.fill()
  fitText(ctx, 'elasticidad', w * 0.12, h * 0.62, { weight: 500, size: 52, family: FONT_MONO, maxWidth: w * 0.6, color: '#042361' })
  ctx.strokeStyle = '#4574b9'
  ctx.lineWidth = 8
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(w * 0.84, h * 0.55, 20, 0, Math.PI * 2)
  ctx.moveTo(w * 0.84 + 14, h * 0.55 + 14)
  ctx.lineTo(w * 0.84 + 30, h * 0.55 + 30)
  ctx.stroke()
}

function drawResultChip(ctx, w, h) {
  ctx.fillStyle = '#d93a3a'
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fill()
  fitText(ctx, '0 coincidencias', w / 2, h * 0.67, { weight: 800, size: h * 0.5, maxWidth: w * 0.88, color: '#ffffff', align: 'center' })
}

function drawBadge(ctx, w, h, kind) {
  const c = w / 2
  ctx.fillStyle = kind === 'x' ? '#d93a3a' : kind === 'check' ? '#ffffff' : '#f4cb18'
  ctx.beginPath()
  ctx.arc(c, c, c - 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = kind === 'x' ? '#ffffff' : '#042361'
  ctx.lineWidth = w * 0.11
  ctx.lineCap = 'round'
  ctx.beginPath()
  if (kind === 'x') {
    ctx.moveTo(w * 0.32, h * 0.32)
    ctx.lineTo(w * 0.68, h * 0.68)
    ctx.moveTo(w * 0.68, h * 0.32)
    ctx.lineTo(w * 0.32, h * 0.68)
  } else if (kind === 'check') {
    ctx.strokeStyle = '#1f8a5b'
    ctx.moveTo(w * 0.28, h * 0.53)
    ctx.lineTo(w * 0.44, h * 0.68)
    ctx.lineTo(w * 0.73, h * 0.34)
  } else {
    ctx.moveTo(c, h * 0.26)
    ctx.lineTo(c, h * 0.58)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(c, h * 0.74, w * 0.06, 0, Math.PI * 2)
    ctx.fillStyle = '#042361'
    ctx.fill()
    return
  }
  ctx.stroke()
}

function drawTopic(ctx, w, h, text, color) {
  fitText(ctx, text, w * 0.06, h * 0.62, { weight: 800, size: 50, maxWidth: w * 0.92, color, minSize: 32 })
}

function drawTagLabel(ctx, w, h, text) {
  fitText(ctx, text, w / 2, h * 0.66, { weight: 700, size: h * 0.5, maxWidth: w * 0.9, color: '#ffffff', align: 'center' })
}

export default function createPractica1Scene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: PRACTICA1_DURATION,
    frame: { wideHalfW: 8.7, narrowHalfW: 6.2, halfH: 4.45, camY: 5.0, lookY: 3.3 },
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 14, perBurst: 18, seed: 11 })
  scene.add(bursts.points)
  const burstGreen = new THREE.Color(0x3be09a)
  const burstAmber = new THREE.Color(0xf4cb18)
  const burstCyan = new THREE.Color(0x7fdcff)

  /* ---------------- cuaderno abierto ---------------- */
  const book = new THREE.Group()
  scene.add(book)
  const cover = makeSlabCard({
    w: BOOK_W,
    h: BOOK_H,
    depth: 0.24,
    radius: 0.4,
    bevel: 0.06,
    edge: '#0b2a66',
    faceColor: '#123a82',
    roughness: 0.55,
    metalness: 0.15,
  })
  book.add(cover.group)
  const pageTex = makeTex(1500, 640, drawBookPage, invalidate)
  const page = makeSlabCard({
    w: BOOK_W - 0.7,
    h: BOOK_H - 0.7,
    depth: 0.06,
    radius: 0.25,
    bevel: 0.03,
    texture: pageTex,
    roughness: 0.85,
    inset: 0.04,
  })
  page.group.position.z = cover.thickness / 2 + page.thickness / 2 + 0.01
  book.add(page.group)
  const spiral = makeSpiral(15, 0.46, 0.22)
  spiral.position.set(-BOOK_W / 2 + 0.2, 0, cover.thickness / 2 + page.thickness / 2 + 0.05)
  book.add(spiral)
  const ribbon = makeSlabCard({ w: 0.42, h: 2.4, depth: 0.03, radius: 0.08, bevel: 0.012, edge: '#f4cb18', faceColor: '#f4cb18', roughness: 0.5 })
  ribbon.group.position.set(5.9, BOOK_H / 2 - 0.9, page.group.position.z + 0.09)
  book.add(ribbon.group)
  book.scale.setScalar(0.0001)

  const slotGlows = SLOT_X.map((x) => {
    const g = addGlow(book, glow, 0x3be09a, 5.4, 0)
    g.position.set(x, SLOT_DOC_Y - 0.5, page.group.position.z + 0.05)
    return g
  })

  /* ---------------- documentos con su etiqueta ---------------- */
  const edgeColor = '#efe6cb'
  const docs = MESSY.map((pose, k) => {
    const root = new THREE.Group()
    scene.add(root)
    const pivot = new THREE.Group()
    root.add(pivot)
    const card = makeSlabCard({
      w: 2.0,
      h: 2.7,
      depth: 0.06,
      radius: 0.12,
      bevel: 0.026,
      edge: edgeColor,
      texture: makeTex(512, 690, (ctx, w, h) => drawDocumentPage(ctx, w, h, DOC_TITLES[k], 11 + k * 12), invalidate),
    })
    pivot.add(card.group)
    addGlow(root, glow, 0x44d3fe, 5.6, 0.16).position.z = -0.6

    const tagRoot = new THREE.Group()
    tagRoot.position.set(0, -1.95, 0.1)
    root.add(tagRoot)
    const tagBase = makeSlabCard({
      w: 3.8,
      h: 0.68,
      depth: 0.08,
      radius: 0.15,
      bevel: 0.03,
      edge: '#3a6bc4',
      faceColor: '#0a2457',
      roughness: 0.5,
      emissive: '#3be09a',
    })
    tagRoot.add(tagBase.group)
    const tagZ = tagBase.thickness / 2 + 0.014
    const oldFace = makeTextPlane(3.66, 0.56, makeTex(1024, 156, (ctx, w, h) => drawTag(ctx, w, h, MESSY_NAMES[k], false), invalidate))
    const newFace = makeTextPlane(3.66, 0.56, makeTex(1024, 156, (ctx, w, h) => drawTag(ctx, w, h, CLEAN_NAMES[k], true), invalidate))
    oldFace.position.z = tagZ
    newFace.position.z = tagZ + 0.001
    newFace.material.opacity = 0
    tagRoot.add(oldFace, newFace)
    const sweep = makeTextPlane(0.5, 0.9, null)
    sweep.material.dispose()
    sweep.material = new THREE.MeshBasicMaterial({
      map: glow,
      color: 0x9ff7d0,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    sweep.position.z = tagZ + 0.02
    tagRoot.add(sweep)
    return { root, pivot, card, tagRoot, tagBase, oldFace, newFace, sweep, pose, k }
  })

  const edgeMessy = new THREE.Color('#3a6bc4')
  const edgeClean = new THREE.Color('#1f8a5b')
  const scratch = new THREE.Color()

  /* ---------------- PDF escaneado, lupa y buscador ---------------- */
  const scanRoot = new THREE.Group()
  scene.add(scanRoot)
  const scan = makeSlabCard({
    w: 3.4,
    h: 4.6,
    depth: 0.05,
    radius: 0.1,
    bevel: 0.022,
    edge: '#cfc9b6',
    texture: makeTex(600, 812, drawScan, invalidate),
    roughness: 0.95,
  })
  scanRoot.add(scan.group)
  addGlow(scanRoot, glow, 0xffb35a, 6.4, 0.12).position.z = -0.6
  const scanTagTex = makeTex(640, 120, (ctx, w, h) => {
    ctx.fillStyle = '#7a3e0c'
    roundRectPath(ctx, 0, 0, w, h, h / 2)
    ctx.fill()
    drawTagLabel(ctx, w, h, 'PDF escaneado = foto')
  }, invalidate)
  const scanTag = makeTextPlane(3.5, 0.66, scanTagTex)
  scanTag.position.set(0, -2.75, 0.12)
  scanRoot.add(scanTag)
  scanRoot.position.set(1.6, 3.7, 0.4)
  scanRoot.scale.setScalar(0.0001)

  const lens = makeMagnifier({ radius: 0.85 })
  lens.group.visible = false
  scene.add(lens.group)
  const lensGlow = addGlow(lens.group, glow, 0x9fe8ff, 3.6, 0.35)

  const selectTex = makeTex(512, 96, (ctx, w, h) => {
    ctx.setLineDash([22, 14])
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 6
    roundRectPath(ctx, 6, 6, w - 12, h - 12, 18)
    ctx.stroke()
  }, invalidate)
  const selectBox = makeTextPlane(2.7, 0.5, selectTex)
  selectBox.position.set(0, 0.5, 0.1)
  selectBox.visible = false
  scanRoot.add(selectBox)

  const xBadge = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: makeTex(128, 128, (ctx, w, h) => drawBadge(ctx, w, h, 'x'), invalidate), transparent: true, depthWrite: false }),
  )
  xBadge.position.set(1.15, -1.25, 0.5)
  xBadge.scale.setScalar(0.0001)
  scanRoot.add(xBadge)

  const searchRoot = new THREE.Group()
  scene.add(searchRoot)
  const search = makeSlabCard({
    w: 4.9,
    h: 2.3,
    depth: 0.1,
    radius: 0.22,
    bevel: 0.04,
    edge: '#3a6bc4',
    texture: makeTex(784, 368, drawSearchPanel, invalidate),
    roughness: 0.5,
    metalness: 0.1,
  })
  searchRoot.add(search.group)
  const caret = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.5), new THREE.MeshBasicMaterial({ color: 0x042361 }))
  caret.position.set(-0.55, -0.38, 0.1)
  searchRoot.add(caret)
  const resultChip = makeTextPlane(3.4, 0.74, makeTex(544, 118, drawResultChip, invalidate))
  resultChip.position.set(0, -1.6, 0.2)
  resultChip.scale.setScalar(0.0001)
  searchRoot.add(resultChip)
  searchRoot.position.set(5.7, 4.4, 0.3)
  searchRoot.scale.setScalar(0.0001)

  /* ---------------- mapa de temas ---------------- */
  const mapRoot = new THREE.Group()
  scene.add(mapRoot)

  const coreRoot = new THREE.Group()
  coreRoot.position.set(CORE.x, CORE.y, CORE.z)
  mapRoot.add(coreRoot)
  const coreBook = makeSlabCard({
    w: 2.3,
    h: 3.0,
    depth: 0.3,
    radius: 0.2,
    bevel: 0.05,
    edge: '#0b2a66',
    texture: makeTex(460, 600, (ctx, w, h) => drawNotebookCover(ctx, w, h, { title: 'Fuentes', subtitle: 'Microeconomía I' }), invalidate),
    roughness: 0.55,
    metalness: 0.12,
  })
  coreRoot.add(coreBook.group)
  const coreSpiral = makeSpiral(7, 0.4, 0.17)
  coreSpiral.position.set(-1.15, 0, 0.1)
  coreRoot.add(coreSpiral)
  const coreGlow = addGlow(coreRoot, glow, 0x44d3fe, 5.5, 0.5)
  coreGlow.position.z = -0.3
  const coreWave = makeShockRing(0x7fdcff)
  coreWave.material.opacity = 0
  coreWave.position.set(CORE.x, CORE.y, CORE.z - 0.1)
  mapRoot.add(coreWave)

  const checkTex = makeTex(128, 128, (ctx, w, h) => drawBadge(ctx, w, h, 'check'), invalidate)
  const warnTex = makeTex(128, 128, (ctx, w, h) => drawBadge(ctx, w, h, 'warn'), invalidate)

  const tiles = TOPICS.map((topic, i) => {
    const group = new THREE.Group()
    group.position.set(topic.x, topic.y, 0)
    mapRoot.add(group)
    const base = makeSlabCard({
      w: TILE_W,
      h: TILE_H,
      depth: 0.16,
      radius: 0.3,
      bevel: 0.04,
      edge: '#3a6bc4',
      faceColor: '#16356f',
      roughness: 0.5,
      metalness: 0.1,
      emissive: topic.covered ? '#3be09a' : '#f4cb18',
    })
    group.add(base.group)
    const fillGeometry = new THREE.PlaneGeometry(1, 1)
    fillGeometry.translate(0.5, 0, 0)
    const fillMat = new THREE.MeshStandardMaterial({
      color: topic.covered ? 0x1f8a5b : 0xf4b81c,
      roughness: 0.45,
      metalness: 0.05,
      emissive: topic.covered ? 0x1f8a5b : 0xf4b81c,
      emissiveIntensity: 0.25,
    })
    const fill = new THREE.Mesh(fillGeometry, fillMat)
    const fillW = TILE_W - 0.14
    fill.position.set(-fillW / 2, 0, base.thickness / 2 + 0.01)
    fill.scale.set(0.0001, TILE_H - 0.14, 1)
    group.add(fill)
    const labelWhite = makeTextPlane(TILE_W - 1.1, TILE_H - 0.3, makeTex(760, 190, (ctx, w, h) => drawTopic(ctx, w, h, topic.name, '#e9f1ff'), invalidate))
    labelWhite.position.set(-0.3, 0, base.thickness / 2 + 0.03)
    group.add(labelWhite)
    let labelDark = null
    if (!topic.covered) {
      labelDark = makeTextPlane(TILE_W - 1.1, TILE_H - 0.3, makeTex(760, 190, (ctx, w, h) => drawTopic(ctx, w, h, topic.name, '#042361'), invalidate))
      labelDark.position.copy(labelWhite.position)
      labelDark.position.z += 0.001
      labelDark.material.opacity = 0
      group.add(labelDark)
    }
    const icon = new THREE.Sprite(new THREE.SpriteMaterial({ map: topic.covered ? checkTex : warnTex, transparent: true, depthWrite: false }))
    icon.position.set(TILE_W / 2 - 0.55, 0, base.thickness / 2 + 0.2)
    icon.scale.setScalar(0.0001)
    group.add(icon)
    const tileGlow = addGlow(group, glow, topic.covered ? 0x3be09a : 0xf4cb18, 6, 0)
    tileGlow.position.z = -0.2
    const beam = makeBeam(topic.covered ? 0x7fffc4 : 0xf4cb18, 0.7)
    mapRoot.add(beam)
    const spark = addGlow(mapRoot, glow, topic.covered ? 0xb6ffe0 : 0xffe28a, 0.9, 0)
    return { group, base, fill, fillMat, fillW, labelWhite, labelDark, icon, tileGlow, beam, spark, topic, i }
  })
  const amberTile = tiles[5]
  const amberWave = makeShockRing(0xf4cb18)
  amberWave.position.set(amberTile.topic.x, amberTile.topic.y, 0.2)
  mapRoot.add(amberWave)
  const amberSpot = new THREE.PointLight(0xffc43a, 0, 9, 2)
  amberSpot.position.set(amberTile.topic.x, amberTile.topic.y, 3)
  scene.add(amberSpot)

  /* ---------------- helpers de pose ---------------- */
  const bookState = { x: 0, y: 0, s: 0 }
  function slotWorld(k, out) {
    out.x = bookState.x + bookState.s * SLOT_X[k]
    out.y = bookState.y + bookState.s * (SLOT_DOC_Y + 0.0)
    out.z = BOOK_POS.z + bookState.s * (cover.thickness / 2 + page.thickness + PAGE_Z)
    return out
  }
  const slot = { x: 0, y: 0, z: 0 }
  const target = { x: 0, y: 0, z: 0 }

  const sparkA = new THREE.Vector3()
  const sparkB = new THREE.Vector3()
  const lensPos = new THREE.Vector3()
  const beamEnd = new THREE.Vector3()

  function resize(w, h) {
    stage.resize(w, h)
  }

  function draw(t, _dt, _elapsed) {
    const T = t * PRACTICA1_DURATION
    const phase = Math.min(4, Math.floor(T / 3.2))
    const exit4 = smooth(seg(T, 12.45, 13.05))

    /* cámara: sigue la acción en pantallas estrechas */
    const fx = 2.4 * window01(T, 9.8, 10.5, 12.3, 13.0)
    stage.update(T, fx)
    stage.spot.position.set(fx, 4.6, 5.5)

    /* ---------- cuaderno ---------- */
    const bookIn = easeOutBack(seg(T, 6.3, 7.1))
    const compress = easeInOutCubic(seg(T, 9.6, 10.4))
    bookState.s = bookIn * lerp(1, 0.46, compress) * (1 - exit4)
    bookState.x = lerp(BOOK_POS.x, -5.0, compress)
    bookState.y = lerp(BOOK_POS.y - (1 - bookIn) * 1.2, 3.55, compress)
    book.position.set(bookState.x, bookState.y, BOOK_POS.z)
    book.scale.setScalar(safeScale(bookState.s))
    book.visible = bookState.s > 0.002
    book.rotation.y = Math.sin(T * 0.4) * 0.03 * (1 - compress)
    ribbon.group.rotation.z = Math.sin(T * 1.3) * 0.03

    /* ---------- documentos + etiquetas ---------- */
    const events = []
    docs.forEach((doc) => {
      const { k, pose, root, pivot, tagRoot, tagBase, oldFace, newFace, sweep, card } = doc

      // renombrado: barrido de luz sobre la etiqueta
      const r0 = RENAME_AT[k]
      const rp = seg(T, r0, r0 + 0.75)
      const swap = smooth(seg(T, r0 + 0.25, r0 + 0.5))
      oldFace.material.opacity = 1 - swap
      newFace.material.opacity = swap
      const sweepK = easeInOutCubic(rp)
      sweep.position.x = lerp(-2.1, 2.1, sweepK)
      sweep.material.opacity = bump(rp) * 0.95
      scratch.copy(edgeMessy).lerp(edgeClean, smooth(seg(T, r0 + 0.2, r0 + 0.7)))
      tagBase.edgeMat.color.copy(scratch)
      flashCard(tagBase, bump(seg(T, r0 + 0.25, r0 + 1.15)) * 0.85)
      if (T > r0 && T < r0 + 1.2) events.push({ t: r0 + 0.3, x: pose.x, y: pose.y - 1.9, z: pose.z + 0.4, color: burstGreen, speed: 2.2, life: 1.0 })

      // pose: suelta -> fila del cuaderno
      const tidy = smooth(seg(T, r0 + 0.2, r0 + 1.4)) * 0.45
      const flyStart = 6.9 + k * 0.5
      const fly = easeInOutCubic(seg(T, flyStart, flyStart + 1.15))
      const landT = flyStart + 1.15
      const bob = Math.sin(T * 0.9 + k * 2.1) * 0.18 * (1 - fly)
      const sway = Math.sin(T * 0.6 + k * 1.7) * 0.06 * (1 - fly)
      slotWorld(k, slot)
      const arc = Math.sin(fly * Math.PI) * 1.4
      target.x = lerp(pose.x, slot.x, fly)
      target.y = lerp(pose.y + bob, slot.y, fly) + arc
      target.z = lerp(pose.z, slot.z, fly)
      const landed = T >= landT
      if (landed) {
        target.x = slot.x
        target.y = slot.y
        target.z = slot.z
      }
      const settle = landed ? Math.exp(-(T - landT) * 6) * Math.cos((T - landT) * 16) * 0.08 : 0
      root.position.set(target.x, target.y + settle, target.z)
      const freeness = (1 - tidy) * (1 - fly)
      pivot.rotation.set(pose.rx * freeness + sway, pose.ry * freeness, pose.rz * freeness)
      tagRoot.rotation.z = pose.rz * 0.35 * freeness
      const s = lerp(1, bookState.s, fly) * (landed ? 1 : 1)
      const appear = easeOutBack(seg(T, 0.05 + k * 0.1, 0.7 + k * 0.1))
      root.scale.setScalar(safeScale(s * appear))
      root.visible = root.scale.x > 0.002
      flashCard(card, bump(seg(T, landT, landT + 0.5)) * 0.5)
      if (T > landT && T < landT + 1.0) events.push({ t: landT, x: slot.x, y: slot.y - 0.2, z: slot.z + 0.4, color: burstCyan, speed: 2.0, life: 0.9 })
      const gl = slotGlows[k]
      gl.material.opacity = bump(seg(T, landT, landT + 1.3)) * 0.8
    })

    /* ---------- escaneo ---------- */
    const scanIn = easeOutBack(seg(T, 9.9, 10.7))
    const scanS = scanIn * (1 - exit4)
    scanRoot.scale.setScalar(safeScale(scanS))
    scanRoot.visible = scanS > 0.002
    scanRoot.position.set(1.2, 3.7 + (1 - scanIn) * -1.0 + Math.sin(T * 1.1) * 0.08, 0.4)
    scanRoot.rotation.set(0, -0.12 + Math.sin(T * 0.5) * 0.05, -0.04 + (1 - scanIn) * 0.3)

    const searchIn = easeOutBack(seg(T, 10.6, 11.2))
    const searchS = searchIn * (1 - exit4)
    searchRoot.scale.setScalar(safeScale(searchS * 0.92))
    searchRoot.visible = searchS > 0.002
    searchRoot.position.y = 4.4 + Math.sin(T * 1.0 + 1) * 0.08
    caret.visible = Math.floor(T * 2.2) % 2 === 0 && T > 10.8
    const chipK = easeOutBack(seg(T, 12.0, 12.4))
    resultChip.scale.setScalar(safeScale(chipK))

    // lupa recorriendo la hoja sin encontrar nada
    const sweepP = seg(T, 10.9, 12.4)
    const lensOn = smooth(seg(T, 10.8, 11.2)) * (1 - exit4)
    lens.group.visible = lensOn > 0.01 && T < 13.1
    lensPos.set(
      scanRoot.position.x + Math.sin(sweepP * Math.PI * 2.2) * 1.0,
      scanRoot.position.y + 1.4 - sweepP * 2.9,
      scanRoot.position.z + 1.1,
    )
    lens.group.position.copy(lensPos)
    lens.group.rotation.z = Math.sin(T * 2.6) * 0.1
    lens.group.scale.setScalar(safeScale(lensOn))
    lensGlow.material.opacity = 0.3 + Math.sin(T * 5) * 0.08

    // intento de selección: arrastre sin resaltado
    const dragP = seg(T, 11.15, 11.75)
    const dragged = easeOutCubic(dragP)
    selectBox.visible = T > 11.1 && T < 12.05
    selectBox.scale.set(safeScale(dragged), 1, 1)
    selectBox.position.x = -1.35 + dragged * 1.35
    selectBox.position.y = 0.55 - dragP * 0.2
    selectBox.material.opacity = T < 11.75 ? 0.9 : 0.9 * (1 - smooth(seg(T, 11.75, 12.05)))
    xBadge.scale.setScalar(safeScale(easeOutBack(seg(T, 11.9, 12.3)) * 1.0))

    /* ---------- mapa de temas ---------- */
    const mapIn = seg(T, 12.9, 13.6)
    coreRoot.scale.setScalar(safeScale(easeOutBack(seg(T, 12.9, 13.5))))
    coreRoot.position.y = CORE.y + Math.sin(T * 1.2) * 0.08
    coreRoot.rotation.y = -0.2 + Math.sin(T * 0.7) * 0.15
    coreGlow.material.opacity = 0.4 + Math.sin(T * 2) * 0.1
    coreWave.position.y = CORE.y
    setShockRing(coreWave, T - 13.3, 1.2, 4.2)

    tiles.forEach((tile) => {
      const { group, base, fill, labelWhite, labelDark, icon, tileGlow, beam, spark, topic, i } = tile
      const enter = easeOutBack(seg(T, 12.95 + i * 0.07, 13.55 + i * 0.07))
      group.scale.setScalar(safeScale(enter))
      group.visible = enter > 0.002
      group.position.y = topic.y + Math.sin(T * 1.1 + i) * 0.05

      const start = topic.covered ? 13.4 + i * 0.28 : 14.75
      const dur = topic.covered ? 0.55 : 0.45
      const p = easeOutCubic(seg(T, start, start + dur))
      fill.scale.x = safeScale(p * tile.fillW)
      tile.fillMat.emissiveIntensity = 0.25 + bump(seg(T, start + dur, start + dur + 0.8)) * 0.6
      icon.scale.setScalar(safeScale(easeOutBack(seg(T, start + dur - 0.1, start + dur + 0.35)) * 0.78))
      flashCard(base, bump(seg(T, start + dur - 0.1, start + dur + 0.7)) * 0.6)

      if (topic.covered) {
        // haz de luz del cuaderno al tema
        const travel = easeInOutCubic(seg(T, start - 0.25, start + 0.25))
        sparkA.set(CORE.x, CORE.y, CORE.z)
        sparkB.set(topic.x, topic.y, 0.3)
        beamEnd.copy(sparkA).lerp(sparkB, travel)
        setBeam(beam, sparkA, beamEnd, 0.035)
        beam.material.opacity = 0.75 * (1 - smooth(seg(T, start + 0.3, start + 0.9)))
        beam.visible = beam.visible && beam.material.opacity > 0.01 && travel > 0.001
        spark.position.copy(beamEnd)
        spark.material.opacity = travel > 0.001 && travel < 0.999 ? 0.9 : 0
        tileGlow.material.opacity = bump(seg(T, start + dur - 0.1, start + dur + 0.9)) * 0.6
        if (T > start && T < start + 1.4) events.push({ t: start + dur - 0.05, x: topic.x, y: topic.y, z: 0.5, color: burstGreen, speed: 1.8, life: 0.9 })
      } else {
        // el tema sin fuente se enciende en ámbar y late
        const warn = smooth(seg(T, start, start + dur))
        labelWhite.material.opacity = 1 - warn
        labelDark.material.opacity = warn
        const pulse = 0.5 + 0.5 * Math.sin((T - start) * 5)
        tileGlow.material.opacity = warn * (0.45 + pulse * 0.35)
        tile.fillMat.emissiveIntensity = 0.3 + warn * pulse * 0.6
        beam.visible = false
        spark.material.opacity = 0
        group.scale.setScalar(safeScale(enter * (1 + warn * pulse * 0.04)))
        if (T > start && T < start + 1.4) events.push({ t: start + dur - 0.05, x: topic.x, y: topic.y, z: 0.5, color: burstAmber, speed: 2.4, life: 1.1 })
      }
    })
    setShockRing(amberWave, T - 15.05, 1.0, 3.0)
    amberSpot.intensity = smooth(seg(T, 14.75, 15.3)) * 26 * (0.8 + 0.2 * Math.sin(T * 5))
    mapRoot.visible = mapIn > 0.001

    bursts.update(T, events)
    return phase
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize, dispose }
}
