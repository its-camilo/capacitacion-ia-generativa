import * as THREE from 'three'
import {
  ANSWER_BADGES,
  PALETTE,
  bump,
  clamp01,
  createRandom,
  drawAnswerPage,
  drawDocumentPage,
  drawFragmentCard,
  drawPlanetSurface,
  drawQuestionMark,
  drawSeal,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  lerp,
  makeCanvasTexture,
  makeFace,
  makeGlowSprite,
  makeGlowTexture,
  makeStarField,
  roundedSlab,
  seg,
  smooth,
} from './threeKit'

/**
 * Escena “El viaje de una pregunta”: 5 estaciones sobre un camino luminoso.
 * Todo es función pura de T (segundos dentro del loop), así el loop es idéntico
 * en cada vuelta y el primer fotograma se puede pintar en cualquier instante.
 */

export const IDEA_DURATION = 16
const PHASE = 3.2 // 16 s / 5 fases
const SPACING = 3.5
const STATION_X = [-2, -1, 0, 1, 2].map((i) => i * SPACING)
const PATH_Z = -1.2
const PATH_Y = 4.15
const CLOUD_Y = 2.0
const FOV = 34
// Estaciones aún no alcanzadas: visibles desde T=0, más pequeñas y apagadas.
const DORMANT_SCALE = 0.84
const DORMANT_LIGHT = 0.5

const pathY = (x) => PATH_Y + Math.sin(x * 0.5) * 0.18

function focusX(T) {
  const a = Math.max(0, Math.min(4, Math.floor(T / PHASE)))
  if (a === 0) return STATION_X[0]
  const local = T - a * PHASE
  return lerp(STATION_X[a - 1], STATION_X[a], smooth(seg(local, 0.1, 1.3)))
}

function activeness(i, T) {
  const start = i * PHASE
  const rise = smooth(seg(T, start, start + 0.5))
  const fall = 1 - smooth(seg(T, start + PHASE, start + PHASE + 0.5))
  return rise * fall
}

/** Degradado del escenario dibujado en la escena: el canvas queda opaco y el blending aditivo se ve bien. */
function makeStageBackground() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  const { width: w, height: h } = canvas
  ctx.fillStyle = '#021536'
  ctx.fillRect(0, 0, w, h)
  ctx.save()
  ctx.translate(w / 2, h)
  ctx.scale(w * 0.75, h * 1.1)
  const base = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
  base.addColorStop(0, '#031a4d')
  base.addColorStop(0.55, '#042361')
  base.addColorStop(1, '#021536')
  ctx.fillStyle = base
  ctx.fillRect(-1, -1, 2, 2)
  ctx.restore()
  ctx.save()
  ctx.translate(w / 2, h * 0.42)
  ctx.scale(w * 0.4, h * 0.36)
  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
  halo.addColorStop(0, 'rgba(69,116,185,0.38)')
  halo.addColorStop(1, 'rgba(69,116,185,0)')
  ctx.fillStyle = halo
  ctx.fillRect(-1, -1, 2, 2)
  ctx.restore()
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export default function createIdeaScene({ canvas, width, height, invalidate }) {
  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x042361, 20, 50)

  const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 120)
  const glow = makeGlowTexture()
  scene.background = makeStageBackground()

  /* ---------------- luces: key / fill / rim ---------------- */
  scene.add(new THREE.HemisphereLight(0x9fc4ff, 0x061a4d, 0.75))

  const key = new THREE.DirectionalLight(0xfff0d8, 2.7)
  key.position.set(-5, 9, 9)
  key.castShadow = true
  const shadowSize = width < 600 ? 1024 : 2048
  key.shadow.mapSize.set(shadowSize, shadowSize)
  key.shadow.camera.left = -14
  key.shadow.camera.right = 14
  key.shadow.camera.top = 9
  key.shadow.camera.bottom = -5
  key.shadow.camera.near = 1
  key.shadow.camera.far = 40
  key.shadow.radius = 4
  key.shadow.bias = -0.0004
  key.shadow.normalBias = 0.03
  scene.add(key)

  const fill = new THREE.DirectionalLight(0x44d3fe, 0.95)
  fill.position.set(9, 3, 7)
  scene.add(fill)

  const rim = new THREE.DirectionalLight(0x6aa0ff, 2.1)
  rim.position.set(0, 6, -11)
  scene.add(rim)

  const spot = new THREE.PointLight(0xffe2a0, 34, 13, 2)
  spot.position.set(STATION_X[0], 3.4, 3.6)
  scene.add(spot)

  /* ---------------- fondo: estrellas y polvo ---------------- */
  const stars = makeStarField({
    count: 260,
    box: { x: 64, yMin: -4, yMax: 18, zMin: -34, zMax: -8 },
    size: 0.2,
    opacity: 0.7,
    glow,
    seed: 3,
  })
  scene.add(stars)
  const dust = makeStarField({
    count: 110,
    box: { x: 34, yMin: 0, yMax: 8, zMin: -5, zMax: 7 },
    size: 0.07,
    opacity: 0.32,
    glow,
    seed: 9,
  })
  scene.add(dust)

  /* ---------------- suelo (solo recibe sombras) ---------------- */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 26),
    new THREE.ShadowMaterial({ color: 0x010818, opacity: 0.42 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  /* ---------------- camino luminoso + orbe de la pregunta ---------------- */
  const pathPoints = []
  for (let x = -10.5; x <= 10.51; x += 0.5) pathPoints.push(new THREE.Vector3(x, pathY(x), PATH_Z))
  const pathCurve = new THREE.CatmullRomCurve3(pathPoints)
  const pathCore = new THREE.Mesh(
    new THREE.TubeGeometry(pathCurve, 260, 0.028, 6, false),
    new THREE.MeshBasicMaterial({ color: 0x8fe3ff, transparent: true, opacity: 0.6 }),
  )
  scene.add(pathCore)
  const pathHalo = new THREE.Mesh(
    new THREE.TubeGeometry(pathCurve, 120, 0.11, 8, false),
    new THREE.MeshBasicMaterial({
      color: 0x44d3fe,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )
  scene.add(pathHalo)

  const pathGlows = [-1.5, -0.5, 0.5, 1.5].map((i) => {
    const x = i * SPACING
    const sprite = makeGlowSprite(glow, 0xaeeaff, 1.7, 0.85)
    sprite.position.set(x, pathY(x), PATH_Z + 0.1)
    scene.add(sprite)
    return sprite
  })

  const orbHalo = makeGlowSprite(glow, 0x44d3fe, 2.6, 0.9)
  const orbCore = makeGlowSprite(glow, 0xffffff, 0.8, 1)
  const orbTrail = [1, 2, 3, 4, 5, 6].map((k) => {
    const sprite = makeGlowSprite(glow, 0x7fdcff, 0.7 - k * 0.07, 0.5 - k * 0.065)
    sprite.userData.lag = k * 0.07
    scene.add(sprite)
    return sprite
  })
  scene.add(orbHalo, orbCore)

  /* ---------------- anillos de estación ---------------- */
  const ringDim = new THREE.Color(0x27478a)
  const ringCyan = new THREE.Color(PALETTE.accent)
  const ringGold = new THREE.Color(PALETTE.highlight)
  const ringGeometry = new THREE.TorusGeometry(1.38, 0.04, 14, 110)
  const innerRingGeometry = new THREE.TorusGeometry(0.95, 0.012, 8, 90)
  const rings = STATION_X.map((x) => {
    const material = new THREE.MeshStandardMaterial({
      color: ringDim,
      emissive: ringDim,
      emissiveIntensity: 0.5,
      roughness: 0.35,
      metalness: 0.35,
    })
    const ring = new THREE.Mesh(ringGeometry, material)
    ring.rotation.x = Math.PI / 2
    ring.position.set(x, 0.03, 0)
    const inner = new THREE.Mesh(innerRingGeometry, material)
    inner.rotation.x = Math.PI / 2
    inner.position.set(x, 0.03, 0)
    const halo = new THREE.Mesh(
      new THREE.PlaneGeometry(4.6, 4.6),
      new THREE.MeshBasicMaterial({
        map: glow,
        color: ringDim,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    halo.rotation.x = -Math.PI / 2
    halo.position.set(x, 0.02, 0)
    scene.add(ring, inner, halo)
    return { material, halo }
  })

  const stations = STATION_X.map((x) => {
    const group = new THREE.Group()
    group.position.x = x
    scene.add(group)
    return group
  })

  /* =====================================================================
   * 1 · Tus fuentes: Programa, Lectura 2 y Artículo en abanico
   * ===================================================================== */
  const DOC_W = 1.5
  const DOC_H = 2.05
  const docSlab = roundedSlab(DOC_W, DOC_H, 0.05, 0.1, 0.024)
  const docEdgeColor = new THREE.Color('#efe6cb')
  const flashColor = new THREE.Color(PALETTE.highlight)
  const docSpecs = [
    { title: 'Artículo', seed: 11, angle: 0.34, z: 0, x: -0.2 },
    { title: 'Lectura 2', seed: 23, angle: -0.34, z: 0.1, x: 0.2 },
    { title: 'Programa', seed: 37, angle: 0, z: 0.24, x: 0 },
  ]
  const docs = docSpecs.map((spec, index) => {
    const pivot = new THREE.Group()
    const body = new THREE.Group()
    body.position.y = DOC_H / 2
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: docEdgeColor,
      roughness: 0.68,
      metalness: 0.02,
      emissive: flashColor,
      emissiveIntensity: 0,
    })
    const slab = new THREE.Mesh(docSlab.geometry, edgeMaterial)
    slab.castShadow = true
    slab.receiveShadow = true
    const face = makeFace(
      DOC_W - 0.06,
      DOC_H - 0.06,
      makeCanvasTexture(512, 700, (ctx, w, h) => drawDocumentPage(ctx, w, h, spec.title, spec.seed), invalidate),
      docSlab.thickness,
      { emissive: flashColor, emissiveIntensity: 0 },
    )
    body.add(slab, face)
    pivot.add(body)
    stations[0].add(pivot)
    return { pivot, spec, index, edgeMaterial, faceMaterial: face.material }
  })

  /* =====================================================================
   * 2 · Fragmentos: 6 trozos de papel que flotan y se despliegan
   * ===================================================================== */
  const FRAG_W = 0.95
  const FRAG_H = 0.66
  const fragSlab = roundedSlab(FRAG_W, FRAG_H, 0.035, 0.07, 0.016)
  const FRAG_TARGETS = [
    { x: 0.1, y: 3.0, z: 0.2, rz: -0.12 },
    { x: -1.1, y: 2.3, z: 0.0, rz: 0.1 },
    { x: 1.1, y: 2.45, z: -0.1, rz: -0.08 },
    { x: -1.15, y: 1.2, z: 0.25, rz: 0.14 },
    { x: 1.15, y: 1.3, z: 0.1, rz: -0.1 },
    { x: 0.05, y: 0.85, z: 0.35, rz: 0.08 },
  ]
  const FRAG_CENTER = { x: 0, y: 2.0 }
  const fragTextures = FRAG_TARGETS.map((_, k) =>
    makeCanvasTexture(320, 222, (ctx, w, h) => drawFragmentCard(ctx, w, h, k, 100 + k * 7), invalidate),
  )
  const fragments = FRAG_TARGETS.map((target, k) => {
    const group = new THREE.Group()
    const slabMaterial = new THREE.MeshStandardMaterial({
      color: docEdgeColor,
      roughness: 0.68,
      emissive: flashColor,
      emissiveIntensity: 0,
    })
    const slab = new THREE.Mesh(fragSlab.geometry, slabMaterial)
    slab.castShadow = true
    slab.receiveShadow = true
    const face = makeFace(FRAG_W - 0.04, FRAG_H - 0.04, fragTextures[k], fragSlab.thickness, {
      emissive: flashColor,
      emissiveIntensity: 0,
    })
    group.add(slab, face)
    stations[1].add(group)
    return { group, target, slabMaterial, faceMaterial: face.material, k }
  })
  const fragEnd = (frag, spread) => ({
    x: FRAG_CENTER.x + (frag.target.x - FRAG_CENTER.x) * spread,
    y: FRAG_CENTER.y + (frag.target.y - FRAG_CENTER.y) * spread,
    z: frag.target.z,
  })

  /* =====================================================================
   * 3 · Vectores: nube de ~90 puntos, líneas entre vecinos, núcleo icosaedro
   * ===================================================================== */
  const N_POINTS = 90
  const CLOUD_R = 1.38
  const cloud = new THREE.Group()
  cloud.position.y = CLOUD_Y
  stations[2].add(cloud)

  const pointRandom = createRandom(21)
  const targets = []
  const delays = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < N_POINTS; i += 1) {
    const yy = 1 - (i / (N_POINTS - 1)) * 2
    const radial = Math.sqrt(1 - yy * yy)
    const theta = golden * i
    const r = CLOUD_R * (0.72 + pointRandom() * 0.28)
    targets.push(new THREE.Vector3(Math.cos(theta) * radial * r, yy * r, Math.sin(theta) * radial * r))
    // se descartan los 3 valores del antiguo origen de cada punto: así la nube conserva su misma forma
    pointRandom()
    pointRandom()
    pointRandom()
    delays.push(pointRandom() * 0.9)
  }

  const pointColors = ['#44d3fe', '#4574b9', '#7fe3d4', '#9fd0ff', '#2fa4e0'].map((c) => new THREE.Color(c))
  const baseColors = targets.map((_, i) => pointColors[i % pointColors.length])
  const amber = new THREE.Color(PALETTE.highlight)
  const SELECTED = [4, 17, 29, 38, 52, 63, 71, 84]

  const pointMesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.075, 14, 10),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.28,
      metalness: 0.15,
      emissive: 0x1a5a96,
      emissiveIntensity: 0.9,
    }),
    N_POINTS,
  )
  pointMesh.frustumCulled = false
  cloud.add(pointMesh)

  const glowPositions = new Float32Array(N_POINTS * 3)
  const glowColors = new Float32Array(N_POINTS * 3)
  const glowGeometry = new THREE.BufferGeometry()
  glowGeometry.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3))
  glowGeometry.setAttribute('color', new THREE.BufferAttribute(glowColors, 3))
  const glowPoints = new THREE.Points(
    glowGeometry,
    new THREE.PointsMaterial({
      size: 0.46,
      map: glow,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      fog: false,
    }),
  )
  glowPoints.frustumCulled = false
  cloud.add(glowPoints)

  // líneas entre los 3 vecinos más cercanos
  const pairs = new Set()
  for (let i = 0; i < N_POINTS; i += 1) {
    const nearest = targets
      .map((p, j) => ({ j, d: j === i ? Infinity : p.distanceToSquared(targets[i]) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
    nearest.forEach(({ j }) => pairs.add(i < j ? `${i}-${j}` : `${j}-${i}`))
  }
  const linePositions = []
  pairs.forEach((key) => {
    const [a, b] = key.split('-').map(Number)
    linePositions.push(targets[a].x, targets[a].y, targets[a].z, targets[b].x, targets[b].y, targets[b].z)
  })
  const lineGeometry = new THREE.BufferGeometry()
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x7fd8ff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const links = new THREE.LineSegments(lineGeometry, lineMaterial)
  links.frustumCulled = false
  cloud.add(links)

  const coreGeometry = new THREE.IcosahedronGeometry(0.52, 1)
  const core = new THREE.Mesh(
    coreGeometry,
    new THREE.MeshPhysicalMaterial({
      color: 0x0b3a9a,
      roughness: 0.22,
      metalness: 0.55,
      emissive: 0x1c7bd6,
      emissiveIntensity: 0.6,
      flatShading: true,
      clearcoat: 0.8,
    }),
  )
  core.castShadow = true
  const coreWire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.66, 1)),
    new THREE.LineBasicMaterial({ color: 0x44d3fe, transparent: true, opacity: 0.7 }),
  )
  const coreGlow = makeGlowSprite(glow, 0x44d3fe, 2.4, 0.5)
  cloud.add(core, coreWire, coreGlow)

  const dummy = new THREE.Object3D()
  const tint = new THREE.Color()

  /* =====================================================================
   * 4 · Tu pregunta busca: planeta ámbar con anillos, “?” y estela
   * ===================================================================== */
  const planetGroup = new THREE.Group()
  planetGroup.position.set(0, CLOUD_Y - 0.1, 0.2)
  stations[3].add(planetGroup)

  const portal = new THREE.Mesh(
    new THREE.CircleGeometry(1.7, 72),
    new THREE.MeshBasicMaterial({ color: 0x010c26, transparent: true, opacity: 0.55 }),
  )
  portal.position.z = -0.7
  const portalRim = new THREE.Mesh(
    new THREE.TorusGeometry(1.7, 0.03, 10, 96),
    new THREE.MeshStandardMaterial({ color: 0x8a6d12, emissive: 0x8a6d12, emissiveIntensity: 0.6, roughness: 0.4, metalness: 0.5 }),
  )
  portalRim.position.z = -0.7
  planetGroup.add(portal, portalRim)

  const planetTexture = makeCanvasTexture(512, 256, drawPlanetSurface, invalidate)
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(0.66, 64, 48),
    new THREE.MeshPhysicalMaterial({
      map: planetTexture,
      roughness: 0.38,
      metalness: 0.12,
      clearcoat: 0.55,
      clearcoatRoughness: 0.3,
      emissive: 0x7a3d00,
      emissiveIntensity: 0.28,
    }),
  )
  planet.castShadow = true
  planet.receiveShadow = true
  planetGroup.add(planet)

  const tilt = new THREE.Group()
  tilt.rotation.set(1.22, 0.1, 0.28)
  planetGroup.add(tilt)
  const ringSpin = new THREE.Group()
  tilt.add(ringSpin)
  const goldRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.05, 0.045, 18, 120),
    new THREE.MeshStandardMaterial({ color: PALETTE.highlight, roughness: 0.22, metalness: 0.92, emissive: 0x6a4a00, emissiveIntensity: 0.4 }),
  )
  const paleRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.32, 0.022, 14, 120),
    new THREE.MeshStandardMaterial({ color: 0xcfe0f5, roughness: 0.3, metalness: 0.7 }),
  )
  goldRing.castShadow = true
  paleRing.castShadow = true
  ringSpin.add(goldRing, paleRing)
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 24, 18),
    new THREE.MeshStandardMaterial({ color: 0xbfeeff, emissive: 0x44d3fe, emissiveIntensity: 0.8, roughness: 0.3 }),
  )
  tilt.add(moon)
  const planetAura = makeGlowSprite(glow, 0xf4cb18, 3.4, 0.38)
  planetGroup.add(planetAura)

  const questionTexture = makeCanvasTexture(256, 256, drawQuestionMark, invalidate)
  const question = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: questionTexture, transparent: true, depthWrite: false, fog: false }),
  )
  question.scale.set(1.15, 1.15, 1)
  stations[3].add(question)

  // estela de partículas: emitidas por el planeta y arrastradas hacia la nube
  const TRAIL_N = 120
  const trailRandom = createRandom(55)
  const trailSeed = Array.from({ length: TRAIL_N }, () => ({ a: trailRandom() - 0.5, b: trailRandom() - 0.5 }))
  const trailPositions = new Float32Array(TRAIL_N * 3)
  const trailColors = new Float32Array(TRAIL_N * 3)
  const trailGeometry = new THREE.BufferGeometry()
  trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
  trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3))
  const trail = new THREE.Points(
    trailGeometry,
    new THREE.PointsMaterial({
      size: 0.34,
      map: glow,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      fog: false,
    }),
  )
  trail.frustumCulled = false
  scene.add(trail)
  const trailWarm = new THREE.Color(PALETTE.highlight)
  const trailCool = new THREE.Color(PALETTE.accent)

  /* =====================================================================
   * 5 · Respuesta con cita: página con marco verde, sello y citas [1][2][3]
   * ===================================================================== */
  const CARD_W = 2.0
  const CARD_H = 2.65
  const CARD_Y = 2.35
  const answerGroup = new THREE.Group()
  answerGroup.position.y = CARD_Y
  stations[4].add(answerGroup)

  const frameSlab = roundedSlab(CARD_W, CARD_H, 0.1, 0.22, 0.03, {
    width: CARD_W - 0.18,
    height: CARD_H - 0.18,
    radius: 0.13,
  })
  const frame = new THREE.Mesh(
    frameSlab.geometry,
    new THREE.MeshPhysicalMaterial({
      color: PALETTE.green,
      roughness: 0.32,
      metalness: 0.2,
      clearcoat: 0.7,
      clearcoatRoughness: 0.25,
      emissive: 0x0b4a2c,
      emissiveIntensity: 0.4,
    }),
  )
  frame.castShadow = true
  frame.receiveShadow = true
  const pageSlab = roundedSlab(CARD_W - 0.1, CARD_H - 0.1, 0.05, 0.16, 0.015)
  const page = new THREE.Mesh(
    pageSlab.geometry,
    new THREE.MeshStandardMaterial({ color: docEdgeColor, roughness: 0.7 }),
  )
  page.position.z = -0.025
  page.castShadow = true
  const FACE_W = CARD_W - 0.12
  const FACE_H = CARD_H - 0.12
  const answerFace = makeFace(
    FACE_W,
    FACE_H,
    makeCanvasTexture(512, 688, drawAnswerPage, invalidate),
    pageSlab.thickness,
  )
  answerFace.position.z += page.position.z
  answerGroup.add(frame, page, answerFace)

  const seal = new THREE.Group()
  seal.position.set(CARD_W / 2 - 0.04, CARD_H / 2 - 0.08, 0.14)
  const sealGeometry = new THREE.CylinderGeometry(0.31, 0.31, 0.09, 56, 1)
  sealGeometry.rotateX(Math.PI / 2)
  const sealGreen = new THREE.MeshPhysicalMaterial({ color: 0x14774a, roughness: 0.3, metalness: 0.3, clearcoat: 0.6 })
  const sealMesh = new THREE.Mesh(sealGeometry, sealGreen)
  const sealFace = new THREE.Mesh(
    new THREE.CircleGeometry(0.29, 56),
    new THREE.MeshStandardMaterial({
      map: makeCanvasTexture(256, 256, drawSeal, invalidate),
      roughness: 0.35,
      emissive: 0x0b4a2c,
      emissiveIntensity: 0.3,
    }),
  )
  sealFace.position.z = 0.048
  sealMesh.castShadow = true
  const sealRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.31, 0.03, 14, 64),
    new THREE.MeshStandardMaterial({ color: PALETTE.highlight, roughness: 0.25, metalness: 0.9 }),
  )
  sealRim.position.z = 0.045
  seal.add(sealMesh, sealFace, sealRim)
  seal.scale.setScalar(0.0001)
  answerGroup.add(seal)

  const answerAura = makeGlowSprite(glow, 0x2fd08a, 5.2, 0.28)
  answerAura.position.z = -0.6
  answerGroup.add(answerAura)

  /* ---- citas: fragmentos que viajan por un arco de luz hasta la respuesta ---- */
  const CITED = [0, 2, 3]
  const citeColors = [0xf4cb18, 0xffe27a, 0xf4cb18]
  const CITE_TUBE_SEGMENTS = 90
  const TUBE_RADIAL = 6
  const citations = CITED.map((fragIndex, c) => {
    const frag = fragments[fragIndex]
    const end = fragEnd(frag, 1)
    const from = new THREE.Vector3(STATION_X[1] + end.x, end.y, end.z + 0.1)
    const land = new THREE.Vector3(STATION_X[4] + (c - 1) * 0.86, 0.6, 1.05)
    const control = new THREE.Vector3((from.x + land.x) / 2 + (c - 1) * 0.8, 5.5 + c * 0.2, -0.6 + c * 0.45)
    const curve = new THREE.QuadraticBezierCurve3(from, control, land)
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, CITE_TUBE_SEGMENTS, 0.017, TUBE_RADIAL, false),
      new THREE.MeshBasicMaterial({
        color: citeColors[c],
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    tube.frustumCulled = false
    tube.geometry.setDrawRange(0, 0)
    scene.add(tube)

    const clone = new THREE.Group()
    const cloneSlab = new THREE.Mesh(fragSlab.geometry, new THREE.MeshStandardMaterial({ color: docEdgeColor, roughness: 0.68 }))
    cloneSlab.castShadow = true
    const cloneFace = makeFace(FRAG_W - 0.04, FRAG_H - 0.04, fragTextures[fragIndex], fragSlab.thickness)
    clone.add(cloneSlab, cloneFace)
    clone.visible = false
    scene.add(clone)

    const spark = makeGlowSprite(glow, 0xfff1a6, 1.1, 0)
    scene.add(spark)

    // línea corta desde la tarjeta aterrizada hasta su badge [n]
    const badge = ANSWER_BADGES[c]
    const badgeWorld = new THREE.Vector3(
      STATION_X[4] + (badge.x / 512 - 0.5) * FACE_W,
      CARD_Y + (0.5 - badge.y / 688) * FACE_H,
      0.1,
    )
    const shortFrom = new THREE.Vector3(land.x, land.y + FRAG_H * 0.5 + 0.02, land.z)
    const shortCurve = new THREE.QuadraticBezierCurve3(
      shortFrom,
      new THREE.Vector3((shortFrom.x + badgeWorld.x) / 2, (shortFrom.y + badgeWorld.y) / 2, 0.7),
      badgeWorld,
    )
    const shortTube = new THREE.Mesh(
      new THREE.TubeGeometry(shortCurve, 40, 0.012, TUBE_RADIAL, false),
      new THREE.MeshBasicMaterial({
        color: PALETTE.accent,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    shortTube.frustumCulled = false
    shortTube.geometry.setDrawRange(0, 0)
    scene.add(shortTube)

    const badgeGlow = makeGlowSprite(glow, 0x7fffd0, 0.9, 0)
    badgeGlow.position.copy(badgeWorld)
    badgeGlow.position.z += 0.1
    scene.add(badgeGlow)

    return { c, curve, tube, clone, spark, shortTube, badgeGlow }
  })

  /* ---------------- estaciones apagadas / encendidas ---------------- */
  // Cada estación guarda los colores base de sus materiales; atenuarla es multiplicarlos por un factor.
  const stationTints = stations.map((group) => {
    const entries = []
    const seen = new Set()
    group.traverse((obj) => {
      const material = obj.material
      if (!material || Array.isArray(material) || !material.color || seen.has(material)) return
      seen.add(material)
      entries.push({ material, base: material.color.clone() })
    })
    return { entries, last: 1 }
  })

  function setStationLight(index, factor) {
    const tintState = stationTints[index]
    const f = factor > 0.999 ? 1 : factor
    if (Math.abs(f - tintState.last) < 0.002) return
    tintState.last = f
    tintState.entries.forEach(({ material, base }) => material.color.copy(base).multiplyScalar(f))
  }

  /* ---------------- cámara ---------------- */
  let narrow = 0
  let camDistance = 16.5
  const tanHalf = Math.tan((FOV * Math.PI) / 360)

  function resize(w, h) {
    const aspect = w / h
    camera.aspect = aspect
    narrow = clamp01((1.85 - aspect) / 0.6)
    // escritorio: las 5 estaciones (de -7 a +7 en X, con su anillo y sus modelos) caben con margen; móvil: encuadre cercano
    const halfWidth = lerp(10.6, 5.2, narrow)
    const byWidth = halfWidth / (tanHalf * aspect)
    const byHeight = 4.0 / tanHalf
    camDistance = Math.max(byWidth, byHeight)
    camera.updateProjectionMatrix()
  }
  resize(width, height)

  /* ---------------- bucle de dibujo ---------------- */
  let lastOpacity = -1
  const posTmp = new THREE.Vector3()
  const ringColor = new THREE.Color()

  function draw(t) {
    const T = t * IDEA_DURATION

    // fundido a negro-azul solo en el borde del loop: el reinicio queda oculto
    const fade = smooth(seg(T, 0, 0.5)) * (1 - smooth(seg(T, 15.45, 16)))
    const quantized = Math.round(fade * 100) / 100
    if (quantized !== lastOpacity) {
      lastOpacity = quantized
      canvas.style.opacity = String(quantized)
    }

    const fx = focusX(T)

    /* cámara con deriva suave */
    // escritorio (narrow ≈ 0): seguimiento mínimo y deriva corta para no sacar de cuadro a las vecinas; móvil: sigue a la estación
    const camX = lerp(fx * 0.03, fx, narrow) + Math.sin(T * 0.5) * lerp(0.2, 0.4, narrow)
    camera.position.set(camX, 3.5 + Math.sin(T * 0.37) * 0.2, camDistance + Math.sin(T * 0.29) * 0.4)
    camera.lookAt(camX * 0.94, 2.05 + Math.sin(T * 0.41) * 0.1, 0)

    /* fondo */
    stars.position.x = Math.sin(T * 0.12) * 0.6
    stars.material.opacity = 0.62 + Math.sin(T * 1.7) * 0.1
    dust.position.y = Math.sin(T * 0.3) * 0.25
    dust.rotation.y = T * 0.012
    dust.material.opacity = 0.28 + Math.sin(T * 1.1 + 1) * 0.06

    /* luz del punto activo */
    spot.position.set(fx, 3.4, 3.6)
    spot.intensity = 34 + Math.sin(T * 2.2) * 4

    /* camino + orbe */
    pathGlows.forEach((sprite, i) => {
      const s = 1.5 + Math.sin(T * 1.6 + i * 1.3) * 0.22
      sprite.scale.set(s, s, 1)
    })
    posTmp.set(fx, pathY(fx) + Math.sin(T * 2.4) * 0.05, PATH_Z + 0.15)
    orbCore.position.copy(posTmp)
    orbHalo.position.copy(posTmp)
    const orbScale = 2.5 + Math.sin(T * 3.1) * 0.25
    orbHalo.scale.set(orbScale, orbScale, 1)
    orbTrail.forEach((sprite) => {
      const x = focusX(Math.max(0, T - sprite.userData.lag))
      sprite.position.set(x, pathY(x), PATH_Z + 0.12)
    })

    /* anillos de estación */
    rings.forEach((ring, i) => {
      const active = activeness(i, T)
      const visited = smooth(seg(T, i * PHASE, i * PHASE + 0.5))
      ringColor.copy(ringDim).lerp(ringCyan, visited * 0.55).lerp(ringGold, active)
      ring.material.color.copy(ringColor)
      ring.material.emissive.copy(ringColor)
      ring.material.emissiveIntensity = 0.45 + visited * 0.25 + active * 1.1
      ring.halo.material.color.copy(ringColor)
      ring.halo.material.opacity = visited * 0.12 + active * 0.5
    })

    /* estaciones: todas visibles desde T=0, apagadas y pequeñas hasta que llega su fase */
    for (let i = 1; i < stations.length; i += 1) {
      const arrival = i * PHASE
      const pop = easeOutBack(seg(T, arrival, arrival + 0.9))
      stations[i].scale.setScalar(lerp(DORMANT_SCALE, 1, pop))
      setStationLight(i, lerp(DORMANT_LIGHT, 1, smooth(seg(T, arrival, arrival + 0.8))))
    }
    trail.visible = T >= 9.9

    /* ---------- 1 · documentos ---------- */
    docs.forEach(({ pivot, spec, index, edgeMaterial, faceMaterial }) => {
      const open = easeOutCubic(seg(T, 0.2 + index * 0.12, 1.4 + index * 0.12))
      const drop = easeOutBack(seg(T, 0.05 + index * 0.1, 0.9 + index * 0.1))
      const split = smooth(seg(T, 3.3, 4.4))
      pivot.position.set(spec.x * open, 0.55 + (1 - drop) * -0.9 + Math.sin(T * 1.4 + index) * 0.04, spec.z)
      pivot.rotation.z = spec.angle * open
      pivot.rotation.y = -0.14 + Math.sin(T * 0.6 + index) * 0.05
      const scale = lerp(0.8, 1, drop) * lerp(1, 0.92, split)
      pivot.scale.setScalar(Math.max(scale, 0.0001))
      const flash = bump(seg(T, 3.2 + index * 0.08, 3.9 + index * 0.08)) * 0.4
      edgeMaterial.emissiveIntensity = flash
      faceMaterial.emissiveIntensity = flash * 0.7
    })

    /* ---------- 2 · fragmentos ---------- */
    {
      // los fragmentos están siempre en su sitio; al llegar su fase se abren y dan un pequeño salto escalonado
      const spread = lerp(0.85, 1, easeOutCubic(seg(T, 3.3, 4.6)))
      fragments.forEach((frag) => {
        const { group, k, target } = frag
        const end = fragEnd(frag, spread)
        const hop = bump(seg(T, 3.3 + 0.12 * k, 4.4 + 0.12 * k)) * 0.3
        const bob = Math.sin(T * 1.3 + k * 1.1) * 0.07
        group.position.set(end.x, end.y + bob + hop, end.z)
        const dir = k % 2 ? 1 : -1
        group.rotation.set(
          Math.sin(T * 0.9 + k * 2) * 0.06,
          Math.sin(T * 0.7 + k) * 0.1 + dir * hop * 0.8,
          target.rz + Math.sin(T * 1.1 + k) * 0.03,
        )

        let glowAmount = bump(seg(T, 6.4, 7.2)) * 0.25
        const cited = CITED.indexOf(k)
        if (cited >= 0) glowAmount = Math.max(glowAmount, bump(seg(T, 12.85 + 0.2 * cited, 13.6 + 0.2 * cited)) * 0.5)
        frag.slabMaterial.emissiveIntensity = glowAmount
        frag.faceMaterial.emissiveIntensity = glowAmount * 0.7
      })
    }

    /* ---------- 3 · nube de vectores ---------- */
    {
      cloud.rotation.y = T * 0.28
      for (let i = 0; i < N_POINTS; i += 1) {
        // la nube está siempre completa; cada punto se enciende y crece en su momento al llegar la fase
        const awake = smooth(seg(T, 6.5 + delays[i], 7.4 + delays[i]))
        const appear = lerp(0.7, 1, awake)
        const { x, y, z } = targets[i]
        const pulse = 1 + Math.sin(T * 2.2 + i * 1.7) * 0.22
        const selectedIndex = SELECTED.indexOf(i)
        let lift = 0
        if (selectedIndex >= 0) {
          lift = smooth(seg(T, 10.6 + selectedIndex * 0.08, 11.3 + selectedIndex * 0.08))
        }
        dummy.position.set(x, y, z)
        dummy.scale.setScalar(Math.max(appear * pulse * (1 + lift * 0.7), 0.0001))
        dummy.updateMatrix()
        pointMesh.setMatrixAt(i, dummy.matrix)
        tint.copy(baseColors[i]).lerp(amber, lift)
        pointMesh.setColorAt(i, tint)
        glowPositions[i * 3] = x
        glowPositions[i * 3 + 1] = y
        glowPositions[i * 3 + 2] = z
        const brightness = appear * (0.55 + lift * 0.6)
        glowColors[i * 3] = tint.r * brightness
        glowColors[i * 3 + 1] = tint.g * brightness
        glowColors[i * 3 + 2] = tint.b * brightness
      }
      pointMesh.instanceMatrix.needsUpdate = true
      if (pointMesh.instanceColor) pointMesh.instanceColor.needsUpdate = true
      glowGeometry.attributes.position.needsUpdate = true
      glowGeometry.attributes.color.needsUpdate = true

      lineMaterial.opacity = 0.16 + smooth(seg(T, 7.8, 8.8)) * 0.24
      core.rotation.set(T * 0.3, -T * 0.5, 0)
      coreWire.rotation.set(-T * 0.2, T * 0.35, T * 0.1)
      core.material.emissiveIntensity = 0.55 + Math.sin(T * 2.4) * 0.15
      coreGlow.scale.setScalar(2.2 + Math.sin(T * 2.4) * 0.25)
    }

    /* ---------- 4 · planeta + estela ---------- */
    {
      const wobbleX = Math.sin(T * 0.9) * 0.25
      const wobbleY = Math.sin(T * 1.3) * 0.12
      planetGroup.position.set(wobbleX, CLOUD_Y - 0.1 + wobbleY, 0.2)
      planet.rotation.y = T * 0.45
      ringSpin.rotation.z = T * 0.55
      const moonAngle = T * 1.3
      moon.position.set(Math.cos(moonAngle) * 1.32, Math.sin(moonAngle) * 1.32, 0)

      question.position.set(wobbleX * 0.6, 3.35 + Math.sin(T * 1.8) * 0.12 + wobbleY, 0.4)
      question.material.rotation = Math.sin(T * 1.4) * 0.1

      // estela (solo desde que la pregunta sale a buscar)
      if (T >= 9.9) {
        const intensity = smooth(seg(T, 9.9, 10.7)) * lerp(1, 0.25, smooth(seg(T, 12.8, 13.6)))
        for (let i = 0; i < TRAIL_N; i += 1) {
          const a = (T * 0.4 + i / TRAIL_N) % 1
          const emitted = T - a * 2.5
          const ex = STATION_X[3] + Math.sin(emitted * 0.9) * 0.25
          const ey = CLOUD_Y - 0.1 + Math.sin(emitted * 1.3) * 0.12
          const seed = trailSeed[i]
          trailPositions[i * 3] = ex - a * 3.7
          trailPositions[i * 3 + 1] = ey + Math.sin(a * 7 + i) * 0.28 * a + seed.a * 0.7 * a
          trailPositions[i * 3 + 2] = 0.2 + Math.cos(a * 5 + i * 1.7) * 0.25 * a + seed.b * 0.5 * a
          const fadeIn = smooth(seg(a, 0, 0.12)) * (1 - smooth(seg(a, 0.65, 1)))
          ringColor.copy(trailWarm).lerp(trailCool, smooth(seg(a, 0.1, 0.8)))
          const b = fadeIn * intensity * 0.9
          trailColors[i * 3] = ringColor.r * b
          trailColors[i * 3 + 1] = ringColor.g * b
          trailColors[i * 3 + 2] = ringColor.b * b
        }
        trailGeometry.attributes.position.needsUpdate = true
        trailGeometry.attributes.color.needsUpdate = true
      }
    }

    /* ---------- 5 · respuesta con cita ---------- */
    {
      answerGroup.position.y = CARD_Y + Math.sin(T * 1.2) * 0.05
      answerGroup.rotation.y = -0.1 + Math.sin(T * 0.6) * 0.05

      const sealScale = easeOutBack(seg(T, 14.35, 14.95))
      seal.scale.setScalar(Math.max(sealScale, 0.0001))
      seal.rotation.z = (1 - sealScale) * -0.8
    }

    citations.forEach((item) => {
      const { c, curve, tube, clone, spark, shortTube, badgeGlow } = item
      const startAt = 12.95 + 0.2 * c
      const q = easeInOutCubic(seg(T, startAt, startAt + 1.0))
      const landed = startAt + 1.0

      tube.geometry.setDrawRange(0, Math.floor(q * CITE_TUBE_SEGMENTS) * TUBE_RADIAL * 6)
      tube.material.opacity = 0.85 - smooth(seg(T, landed, landed + 0.8)) * 0.55
      clone.visible = q > 0.001
      if (q > 0.001) {
        curve.getPoint(q, posTmp)
        clone.position.copy(posTmp)
        clone.scale.setScalar(lerp(0.5, 1, smooth(q)))
        const settle = easeOutCubic(seg(T, landed - 0.2, landed + 0.4))
        clone.rotation.set(lerp(0.3, -0.28, settle), lerp(0.6, 0.12 * (c - 1), settle), lerp(0.4 * (c - 1), (c - 1) * 0.05, settle))
        clone.position.y = posTmp.y + Math.sin(T * 1.5 + c) * 0.02 * settle
        spark.position.copy(posTmp)
        spark.material.opacity = q < 1 ? 0.9 : 0.9 * (1 - smooth(seg(T, landed, landed + 0.3)))
      } else {
        spark.material.opacity = 0
      }

      const link = easeOutCubic(seg(T, landed - 0.05, landed + 0.65))
      shortTube.geometry.setDrawRange(0, Math.floor(link * 40) * TUBE_RADIAL * 6)
      badgeGlow.material.opacity = bump(seg(T, landed + 0.45, landed + 1.2)) * 0.9
    })
  }

  function dispose() {
    glow.dispose()
  }

  return { scene, camera, draw, resize, dispose }
}
