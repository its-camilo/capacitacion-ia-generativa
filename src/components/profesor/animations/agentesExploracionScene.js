import * as THREE from 'three'
import { bump, easeInOutCubic, easeOutBack, easeOutCubic, lerp, roundRectPath, seg, smooth } from './threeKit'
import {
  FONT_BODY,
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
} from './stageKit'

/**
 * Escena “Otras alternativas para explorar” (Sesión 4, Exploración).
 * Loop de 16 s en 5 fases de 3,2 s:
 *   0 Hark no es el único agente: Hark al centro y aparecen otras 6 fichas ·
 *   1 las 7 fichas con solo logo y nombre ·
 *   2 las fichas orbitan alrededor de un celular y una nube ·
 *   3 las fichas se ordenan en una fila como un mapa del panorama ·
 *   4 cierre: «Mírelos como un mapa del panorama, no como una tarea».
 * En esta escena solo importan los logos: cada ficha lleva la marca y el nombre.
 * `draw(t)` es una función pura del tiempo dentro del loop.
 */
export const AGENTES_EXPLORACION_DURATION = 16

const PHASE = 3.2
const AMBER = 0xf4cb18
const CYAN = 0x7fdcff
const GREEN = 0x3be09a

const BRANDS = [
  { name: 'Muse', mark: 'letter', letter: 'M', color: '#b05cff' },
  { name: 'Grok Bot', mark: 'slash', color: '#141a2e' },
  { name: 'Hermes Agent', mark: 'wing', color: '#e0a100' },
  { name: 'OpenAI Dots', mark: 'dots', color: '#10a37f' },
  { name: 'Claude Duet', mark: 'burst', color: '#d97757' },
  { name: 'Gemini Tasks', mark: 'sparkle', color: '#4285f4', color2: '#9b72cb' },
  { name: 'Instinct', mark: 'bolt', color: '#ff5a5f' },
]

/* geometría (unidades de escena) */
const CY = 3.3
const CARD = { w: 2.0, h: 2.3 }
const HARK = { w: 2.4, h: 2.7 }
const HEX = { rx: 4.6, ry: 2.1, scale: 0.85 }
const HEX_ANGLES = [120, 60, 0, 300, 240, 180].map((d) => (d * Math.PI) / 180)
const GRID = [
  { x: -4.5, y: 4.9 },
  { x: -1.5, y: 4.9 },
  { x: 1.5, y: 4.9 },
  { x: 4.5, y: 4.9 },
  { x: -3.0, y: 1.75 },
  { x: 0, y: 1.75 },
  { x: 3.0, y: 1.75 },
]
const ORBIT = { cy: 3.2, rx: 5.2, ry: 0.9, rz: 1.6, speed: 0.55, scale: 0.72, from: 6.4 }
const PHONE = { x: 0, y: 3.2, w: 1.6, h: 3.0 }
const CLOUD = { x: 0, y: 6.35, w: 3.6, h: 1.9 }
const ROW = { y: 3.0, gap: 2.05, scale: 0.85 }
const MAP_Y = ROW.y - 1.4
const rowX = (i) => (i - 3) * ROW.gap

/** Momento en que aparece cada ficha (las 6 primeras en la fase 0, Instinct en la 1). */
const APPEAR = [0, 1, 2, 3, 4, 5].map((i) => 1.0 + i * 0.3).concat([4.4])

/* ------------------------------------------------------------------ */
/* Logos (marcas simples dibujadas en canvas)                          */
/* ------------------------------------------------------------------ */

function drawMark(ctx, cx, cy, r, brand) {
  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = '#ffffff'
  switch (brand.mark) {
    case 'letter':
      fitText(ctx, brand.letter, cx, cy + r * 0.5, { weight: 900, size: r * 1.45, color: '#ffffff', align: 'center' })
      break
    case 'slash':
      ctx.lineWidth = r * 0.14
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.66, Math.PI * 0.32, Math.PI * 1.32)
      ctx.stroke()
      ctx.lineWidth = r * 0.2
      ctx.beginPath()
      ctx.moveTo(cx - r * 0.5, cy + r * 0.62)
      ctx.lineTo(cx + r * 0.5, cy - r * 0.62)
      ctx.stroke()
      break
    case 'wing':
      fitText(ctx, 'H', cx, cy + r * 0.38, { weight: 900, size: r * 1.05, color: '#ffffff', align: 'center' })
      ctx.lineWidth = r * 0.1
      ;[-1, 1].forEach((side) => {
        for (let k = 0; k < 3; k += 1) {
          const x0 = cx + side * r * 0.52
          const y0 = cy - r * 0.2 + k * r * 0.22
          ctx.beginPath()
          ctx.moveTo(x0, y0)
          ctx.quadraticCurveTo(x0 + side * r * 0.25, y0 - r * 0.3, x0 + side * r * (0.5 - k * 0.1), y0 - r * 0.42)
          ctx.stroke()
        }
      })
      break
    case 'dots':
      for (let k = 0; k < 6; k += 1) {
        const a = (k / 6) * Math.PI * 2 - Math.PI / 2
        ctx.beginPath()
        ctx.arc(cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.55, r * 0.15, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.17, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'burst':
      ctx.lineWidth = r * 0.16
      for (let k = 0; k < 8; k += 1) {
        const a = (k / 8) * Math.PI * 2
        const len = k % 2 === 0 ? 0.72 : 0.56
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(a) * r * 0.16, cy + Math.sin(a) * r * 0.16)
        ctx.lineTo(cx + Math.cos(a) * r * len, cy + Math.sin(a) * r * len)
        ctx.stroke()
      }
      break
    case 'sparkle': {
      const s = r * 0.74
      ctx.beginPath()
      ctx.moveTo(cx, cy - s)
      ctx.quadraticCurveTo(cx, cy, cx + s, cy)
      ctx.quadraticCurveTo(cx, cy, cx, cy + s)
      ctx.quadraticCurveTo(cx, cy, cx - s, cy)
      ctx.quadraticCurveTo(cx, cy, cx, cy - s)
      ctx.fill()
      break
    }
    case 'bolt':
      ctx.beginPath()
      ctx.moveTo(cx + r * 0.12, cy - r * 0.72)
      ctx.lineTo(cx - r * 0.42, cy + r * 0.1)
      ctx.lineTo(cx - r * 0.02, cy + r * 0.1)
      ctx.lineTo(cx - r * 0.14, cy + r * 0.72)
      ctx.lineTo(cx + r * 0.44, cy - r * 0.12)
      ctx.lineTo(cx + r * 0.04, cy - r * 0.12)
      ctx.closePath()
      ctx.fill()
      break
    default:
      break
  }
  ctx.restore()
}

function drawBrandCard(ctx, w, h, brand) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = brand.color
  ctx.fillRect(0, 0, w, h * 0.03)
  const size = w * 0.56
  const bx = (w - size) / 2
  const by = h * 0.14
  if (brand.color2) {
    const g = ctx.createLinearGradient(bx, by, bx + size, by + size)
    g.addColorStop(0, brand.color)
    g.addColorStop(1, brand.color2)
    ctx.fillStyle = g
  } else {
    ctx.fillStyle = brand.color
  }
  roundRectPath(ctx, bx, by, size, size, size * 0.24)
  ctx.fill()
  drawMark(ctx, w / 2, by + size / 2, size * 0.42, brand)
  fitText(ctx, brand.name, w / 2, h * 0.87, { weight: 800, size: h * 0.1, maxWidth: w * 0.86, color: '#042361', align: 'center' })
}

function drawHarkCard(ctx, w, h) {
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#0b3a7a')
  bg.addColorStop(1, '#042361')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#f4cb18'
  ctx.fillRect(0, 0, w, h * 0.03)
  const cx = w / 2
  const cy = h * 0.4
  const r = w * 0.26
  ctx.fillStyle = '#f4cb18'
  ctx.beginPath()
  ctx.arc(cx - r * 0.55, cy, r * 0.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#f4cb18'
  ctx.lineCap = 'round'
  ctx.lineWidth = r * 0.16
  for (let k = 1; k <= 3; k += 1) {
    ctx.globalAlpha = 1 - (k - 1) * 0.22
    ctx.beginPath()
    ctx.arc(cx - r * 0.55, cy, r * (0.2 + k * 0.38), -Math.PI / 3.2, Math.PI / 3.2)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
  fitText(ctx, 'Hark', w / 2, h * 0.87, { weight: 800, size: h * 0.13, maxWidth: w * 0.8, color: '#ffffff', align: 'center' })
}

/* ------------------------------------------------------------------ */
/* Celular, nube y textos                                              */
/* ------------------------------------------------------------------ */

function drawPhone(ctx, w, h) {
  ctx.fillStyle = '#111a33'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#f6f8ff'
  roundRectPath(ctx, w * 0.07, h * 0.05, w * 0.86, h * 0.9, 24)
  ctx.fill()
  ctx.fillStyle = '#111a33'
  roundRectPath(ctx, w * 0.36, h * 0.065, w * 0.28, h * 0.022, 6)
  ctx.fill()
  ctx.fillStyle = '#042361'
  ctx.fillRect(w * 0.07, h * 0.11, w * 0.86, h * 0.08)
  fitText(ctx, 'Su agente', w / 2, h * 0.165, { weight: 800, size: h * 0.045, maxWidth: w * 0.7, color: '#ffffff', align: 'center' })
  ctx.fillStyle = '#dbe6ff'
  roundRectPath(ctx, w * 0.3, h * 0.25, w * 0.56, h * 0.1, 16)
  ctx.fill()
  ctx.fillStyle = '#e8ecf5'
  roundRectPath(ctx, w * 0.14, h * 0.4, w * 0.6, h * 0.14, 16)
  ctx.fill()
  ctx.fillStyle = 'rgba(4,35,97,0.3)'
  ;[0.45, 0.49].forEach((v, i) => {
    roundRectPath(ctx, w * 0.19, h * v, w * (i ? 0.32 : 0.48), h * 0.018, 5)
    ctx.fill()
  })
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(4,35,97,0.2)'
  ctx.lineWidth = 3
  roundRectPath(ctx, w * 0.12, h * 0.84, w * 0.76, h * 0.06, 18)
  ctx.fill()
  ctx.stroke()
  fitText(ctx, 'Escriba aquí…', w * 0.18, h * 0.88, { weight: 500, size: h * 0.03, family: FONT_BODY, maxWidth: w * 0.6, color: 'rgba(4,35,97,0.45)' })
}

function drawCloud(ctx, w, h) {
  ctx.fillStyle = 'rgba(127,220,255,0.22)'
  ctx.strokeStyle = 'rgba(159,232,255,0.85)'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(w * 0.18, h * 0.86)
  ctx.arc(w * 0.18, h * 0.62, h * 0.24, Math.PI / 2, Math.PI * 1.5)
  ctx.arc(w * 0.38, h * 0.38, h * 0.26, Math.PI, Math.PI * 1.85)
  ctx.arc(w * 0.62, h * 0.34, h * 0.3, Math.PI * 1.1, Math.PI * 1.95)
  ctx.arc(w * 0.82, h * 0.62, h * 0.24, Math.PI * 1.5, Math.PI / 2)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  fitText(ctx, 'En la nube', w / 2, h * 0.7, { weight: 800, size: h * 0.2, maxWidth: w * 0.6, color: '#e6f8ff', align: 'center' })
}

function drawTitle(ctx, w, h) {
  fitText(ctx, 'Otras alternativas para explorar', w / 2, h * 0.62, { weight: 800, size: h * 0.56, maxWidth: w * 0.94, color: '#ffffff', align: 'center' })
  ctx.fillStyle = '#f4cb18'
  roundRectPath(ctx, w * 0.42, h * 0.8, w * 0.16, h * 0.08, h * 0.04)
  ctx.fill()
}

function drawChip(ctx, w, h, text, fill) {
  ctx.fillStyle = fill
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fill()
  fitText(ctx, text, w / 2, h * 0.67, { weight: 800, size: h * 0.48, maxWidth: w * 0.88, color: '#042361', align: 'center' })
}

function drawClosing(ctx, w, h) {
  ctx.fillStyle = 'rgba(4,35,97,0.72)'
  roundRectPath(ctx, 0, 0, w, h, h * 0.22)
  ctx.fill()
  ctx.strokeStyle = 'rgba(244,203,24,0.75)'
  ctx.lineWidth = 4
  roundRectPath(ctx, 2, 2, w - 4, h - 4, h * 0.22)
  ctx.stroke()
  fitText(ctx, 'Mírelos como un mapa del panorama,', w / 2, h * 0.44, { weight: 800, size: h * 0.27, maxWidth: w * 0.9, color: '#ffffff', align: 'center' })
  fitText(ctx, 'no como una tarea', w / 2, h * 0.8, { weight: 800, size: h * 0.27, maxWidth: w * 0.9, color: '#f4cb18', align: 'center' })
}

/* ------------------------------------------------------------------ */

export default function createAgentesExploracionScene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: AGENTES_EXPLORACION_DURATION,
    frame: { wideHalfW: 8.7, narrowHalfW: 7.3, halfH: 4.45, camY: 5.0, lookY: 3.3 },
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 10, perBurst: 18, seed: 41 })
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
      texture: makeTex(Math.round(size.w * 200), Math.round(size.h * 200), draw, invalidate),
      ...extra,
    })

  const shown = (obj, k) => {
    obj.material.opacity = k
    obj.visible = k > 0.01
  }

  /* ---------------- fichas ---------------- */
  const hark = makeCard(HARK, drawHarkCard, { edge: '#0b3a7a', emissive: '#f4cb18' })
  scene.add(hark.group)
  const harkRing = makeShockRing(AMBER)
  scene.add(harkRing)

  const cards = BRANDS.map((brand) => {
    const card = makeCard(CARD, (ctx, w, h) => drawBrandCard(ctx, w, h, brand), { emissive: brand.color })
    scene.add(card.group)
    const beam = makeBeam(CYAN, 0.7)
    scene.add(beam)
    const ring = makeShockRing(CYAN)
    scene.add(ring)
    const nodeRing = makeShockRing(AMBER)
    scene.add(nodeRing)
    const node = addGlow(scene, glow, AMBER, 0.7, 0)
    return { brand, card, beam, ring, nodeRing, node }
  })

  /* ---------------- celular y nube ---------------- */
  const phone = makeCard(PHONE, drawPhone, { radius: 0.24, edge: '#1b2747', emissive: '#7fdcff' })
  scene.add(phone.group)
  const phoneRing = makeShockRing(CYAN)
  scene.add(phoneRing)
  const cloud = makeTextPlane(CLOUD.w, CLOUD.h, makeTex(720, 380, drawCloud, invalidate))
  cloud.renderOrder = 3
  scene.add(cloud)
  const cloudGlow = addGlow(scene, glow, CYAN, 4.2, 0)
  cloudGlow.position.set(CLOUD.x, CLOUD.y, -0.3)
  const upBeam = makeBeam(CYAN, 0.8)
  scene.add(upBeam)
  const packet = addGlow(scene, glow, CYAN, 0.7, 0)

  /* ---------------- mapa ---------------- */
  const mapLine = makeBeam(AMBER, 0.75)
  scene.add(mapLine)

  /* ---------------- textos ---------------- */
  const title = makeTextPlane(9.6, 0.9, makeTex(1536, 144, drawTitle, invalidate))
  title.position.set(0, 7.05, 0.2)
  scene.add(title)
  const mapChip = makeTextPlane(4.4, 0.7, makeTex(880, 140, (ctx, w, h) => drawChip(ctx, w, h, 'Mapa del panorama', '#ffd04b'), invalidate))
  mapChip.position.set(0, 5.75, 0.3)
  scene.add(mapChip)
  const closing = makeTextPlane(10.4, 1.6, makeTex(1664, 256, drawClosing, invalidate))
  closing.position.set(0, 5.95, 0.4)
  closing.renderOrder = 8
  scene.add(closing)

  const cursor = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: makeCursorTexture(), transparent: true, depthWrite: false, depthTest: false }),
  )
  cursor.renderOrder = 20
  scene.add(cursor)

  const pA = new THREE.Vector3()
  const pB = new THREE.Vector3()
  const pC = new THREE.Vector3()

  function draw(t) {
    const T = t * AGENTES_EXPLORACION_DURATION
    const events = []
    stage.update(T, 0)
    stage.spot.position.set(0, 4.6, 5.5)

    /* ---------- título ---------- */
    const titleK = smooth(seg(T, 0.3, 0.9)) * (1 - smooth(seg(T, 5.9, 6.5)))
    shown(title, titleK)
    title.scale.setScalar(safeScale(lerp(0.92, 1, titleK)))

    /* ---------- Hark al centro (fase 0) ---------- */
    const harkIn = easeOutBack(seg(T, 0.2, 0.8))
    const harkOut = smooth(seg(T, 3.3, 4.1))
    hark.group.position.set(0, CY + harkOut * 0.4, -harkOut * 2.2)
    hark.group.scale.setScalar(safeScale(harkIn * (1 - harkOut * 0.6)))
    hark.group.rotation.y = Math.sin(T * 0.8) * 0.05
    setCardOpacity(hark, smooth(seg(T, 0.2, 0.55)) * (1 - harkOut))
    flashCard(hark, bump(seg(T, 0.5, 1.3)) * 0.5)
    setShockRing(harkRing, T - 0.5, 1.1, 2.6)
    harkRing.position.set(0, CY, 0.3)
    if (T > 0.5 && T < 1.4) events.push({ t: 0.5, x: 0, y: CY + 0.6, z: 0.8, color: amberColor, speed: 2.0, life: 0.9 })

    /* ---------- fichas ---------- */
    const p2 = smooth(seg(T, 7.1, 7.6)) * (1 - smooth(seg(T, 9.6, 10.1)))
    const p4 = smooth(seg(T, 12.8, 13.4))
    const cursorK = easeInOutCubic(seg(T, 11.0, 12.6))
    const cursorX = lerp(rowX(0) - 1.4, rowX(6) + 1.4, cursorK)
    const cursorOn = smooth(seg(T, 10.8, 11.1)) * (1 - smooth(seg(T, 12.5, 12.8)))

    cards.forEach((item, i) => {
      const { card, beam, ring, nodeRing, node } = item
      const start = APPEAR[i]
      const isLate = i === 6

      // fase 0 → 1: del centro al hexágono y del hexágono a la cuadrícula
      const grid = GRID[i]
      let x
      let y
      let z = 0
      let s
      if (isLate) {
        const rise = easeOutCubic(seg(T, start, start + 0.6))
        x = grid.x
        y = grid.y - (1 - rise) * 0.6
        s = easeOutBack(seg(T, start, start + 0.6))
      } else {
        const a = HEX_ANGLES[i]
        const out = easeOutCubic(seg(T, start, start + 0.6))
        const hx = Math.cos(a) * HEX.rx
        const hy = CY + Math.sin(a) * HEX.ry
        const k1 = easeInOutCubic(seg(T, 3.4 + i * 0.06, 4.3 + i * 0.06))
        x = lerp(hx * out, grid.x, k1)
        y = lerp(lerp(CY, hy, out), grid.y, k1)
        s = lerp(HEX.scale, 1, k1) * easeOutBack(seg(T, start, start + 0.6))
      }

      // fase 2: órbita alrededor del celular
      const k2 = easeInOutCubic(seg(T, 6.4 + i * 0.05, 7.3 + i * 0.05))
      const theta = -Math.PI / 2 + (i / 7) * Math.PI * 2 + ORBIT.speed * Math.max(0, T - ORBIT.from)
      const ox = Math.cos(theta) * ORBIT.rx
      const oz = Math.sin(theta) * ORBIT.rz
      const oy = ORBIT.cy - Math.sin(theta) * ORBIT.ry
      x = lerp(x, ox, k2)
      y = lerp(y, oy, k2)
      z = lerp(z, oz, k2)
      s = lerp(s, s * ORBIT.scale, k2)

      // fase 3: fila del mapa
      const k3 = easeInOutCubic(seg(T, 9.6 + i * 0.08, 10.5 + i * 0.08))
      x = lerp(x, rowX(i), k3)
      y = lerp(y, ROW.y, k3)
      z = lerp(z, 0, k3)
      s = lerp(s, ROW.scale, k3)

      // fase 4: respiración suave
      y += Math.sin(T * 2 + i * 0.9) * 0.06 * p4

      card.group.position.set(x, y, z)
      card.group.scale.setScalar(safeScale(s))
      card.group.rotation.y = Math.sin(T * 0.6 + i) * 0.05 - Math.cos(theta) * 0.22 * k2 * (1 - k3)
      setCardOpacity(card, smooth(seg(T, start, start + 0.3)))

      // brillo: aparición, repaso de logos, cursor y barrido final
      const hover = cursorOn * Math.max(0, 1 - Math.abs(cursorX - rowX(i)) / 0.9)
      const flash =
        bump(seg(T, start + 0.2, start + 0.9)) * 0.45 +
        bump(seg(T, 5.0 + i * 0.18, 5.5 + i * 0.18)) * 0.5 +
        hover * 0.55 +
        bump(seg(T, 13.6 + i * 0.15, 14.2 + i * 0.15)) * 0.5
      flashCard(card, Math.min(flash, 0.8))

      setShockRing(ring, T - (start + 0.2), 0.9, 1.6)
      ring.position.set(x, y, z + 0.3)
      if (T > start + 0.15 && T < start + 1.1) {
        events.push({ t: start + 0.2, x, y, z: z + 0.6, color: isLate ? amberColor : cyanColor, speed: isLate ? 2.0 : 1.5, life: 0.9 })
      }

      // haces: Hark → ficha (fase 0) y nube → ficha (fase 2)
      const a0 = smooth(seg(T, start + 0.1, start + 0.4)) * (1 - smooth(seg(T, 3.2, 3.7))) * (isLate ? 0 : 1)
      if (a0 >= p2) {
        pA.set(0, CY, 0.2)
      } else {
        pA.set(CLOUD.x, CLOUD.y - 0.4, -0.1)
      }
      pB.set(x, y, z)
      const travel = a0 >= p2 ? easeOutCubic(seg(T, start, start + 0.6)) : 1
      pC.copy(pA).lerp(pB, travel)
      const beamK = Math.max(a0, p2 * 0.6)
      if (beamK > 0.01 && travel > 0.001) {
        setBeam(beam, pA, pC, 0.022 + 0.01 * Math.sin(T * 5 + i))
        beam.material.opacity = beamK * 0.7
        beam.material.color.set(a0 >= p2 ? CYAN : 0x9fe8ff)
      } else {
        beam.visible = false
      }

      // nodos del mapa (fase 3 y 4)
      const nodeAt = 10.7 + i * 0.12
      node.position.set(rowX(i), MAP_Y, 0.25)
      node.material.opacity = smooth(seg(T, nodeAt, nodeAt + 0.25)) * (0.7 + 0.2 * Math.sin(T * 3 + i))
      node.visible = node.material.opacity > 0.01
      setShockRing(nodeRing, T - nodeAt, 0.8, 0.8)
      nodeRing.position.set(rowX(i), MAP_Y, 0.25)
    })

    /* ---------- celular y nube (fase 2) ---------- */
    const phoneIn = easeOutBack(seg(T, 6.5, 7.1))
    const phoneOut = smooth(seg(T, 9.6, 10.1))
    phone.group.position.set(PHONE.x, PHONE.y - phoneOut * 0.5, 0)
    phone.group.scale.setScalar(safeScale(phoneIn * (1 - phoneOut * 0.4)))
    phone.group.rotation.y = Math.sin(T * 0.9) * 0.08
    setCardOpacity(phone, smooth(seg(T, 6.5, 6.8)) * (1 - phoneOut))
    flashCard(phone, bump(seg(T, 7.2, 7.9)) * 0.4)
    const pulseAge = T >= 7.4 && T < 9.4 ? (T - 7.4) % 1.0 : -1
    setShockRing(phoneRing, pulseAge, 1.0, 2.2)
    phoneRing.position.set(PHONE.x, PHONE.y, 0.2)

    const cloudK = smooth(seg(T, 6.8, 7.4)) * (1 - phoneOut)
    shown(cloud, cloudK)
    cloud.position.set(CLOUD.x, CLOUD.y + Math.sin(T * 1.3) * 0.08, 0)
    cloud.scale.setScalar(safeScale(lerp(0.85, 1, easeOutBack(seg(T, 6.8, 7.4)))))
    cloudGlow.material.opacity = cloudK * 0.45 * (0.85 + 0.15 * Math.sin(T * 2.4))

    // haz celular → nube con un paquete que sube
    const upK = smooth(seg(T, 7.2, 7.6)) * (1 - phoneOut)
    pA.set(PHONE.x, PHONE.y + PHONE.h / 2, 0.1)
    pB.set(CLOUD.x, CLOUD.y - 0.55, 0.1)
    if (upK > 0.01) {
      setBeam(upBeam, pA, pB, 0.04)
      upBeam.material.opacity = upK * 0.8
    } else {
      upBeam.visible = false
    }
    const packetK = (T - 7.4) % 0.8
    packet.position.copy(pA).lerp(pB, easeInOutCubic(Math.max(0, packetK) / 0.8))
    packet.material.opacity = T > 7.4 ? upK * bump(Math.max(0, packetK) / 0.8) : 0
    packet.visible = packet.material.opacity > 0.01
    if (T > 7.3 && T < 8.2) events.push({ t: 7.3, x: CLOUD.x, y: CLOUD.y, z: 0.5, color: cyanColor, speed: 1.8, life: 0.9 })

    /* ---------- mapa del panorama (fase 3) ---------- */
    const lineK = easeInOutCubic(seg(T, 10.5, 11.4))
    const half = rowX(6) + 1.0
    pA.set(-half, MAP_Y, 0.2)
    pB.set(lerp(-half, half, lineK), MAP_Y, 0.2)
    if (lineK > 0.001) {
      setBeam(mapLine, pA, pB, 0.03)
      mapLine.material.opacity = 0.75 * smooth(seg(T, 10.5, 10.8))
    } else {
      mapLine.visible = false
    }
    const chipK = smooth(seg(T, 10.8, 11.3)) * (1 - smooth(seg(T, 12.4, 12.9)))
    shown(mapChip, chipK)
    mapChip.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 10.8, 11.4)))))

    // cursor que recorre el mapa (mirar, no hacer clic)
    cursor.position.set(cursorX + 0.31, MAP_Y - 0.15 - 0.41 + Math.sin(T * 4) * 0.05, 1.6)
    cursor.scale.setScalar(0.9)
    cursor.material.opacity = cursorOn
    cursor.visible = cursorOn > 0.01

    /* ---------- cierre (fase 4) ---------- */
    const closeK = smooth(seg(T, 13.0, 13.6))
    shown(closing, closeK)
    closing.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 13.0, 13.7)))))
    if (T > 13.6 && T < 14.6) events.push({ t: 13.6, x: 0, y: 5.95, z: 0.8, color: amberColor, speed: 2.6, life: 1.0 })
    if (T > 14.6 && T < 15.6) events.push({ t: 14.6, x: 0, y: ROW.y, z: 0.8, color: greenColor, speed: 2.2, life: 1.0 })

    bursts.update(T, events)
    return Math.min(4, Math.floor(T / PHASE))
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize: stage.resize, dispose }
}
