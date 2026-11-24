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
  makeArcTube,
  makeBeam,
  makeCursorTexture,
  makeShockRing,
  makeSlabCard,
  makeTex,
  makeTextPlane,
  safeScale,
  setArcProgress,
  setBeam,
  setCardOpacity,
  setShockRing,
  window01,
} from './stageKit'

/**
 * Escena “De chatbot a agente, sin perder el control” (Sesión 4, Idea).
 * Loop de 16 s en 5 fases de 3,2 s:
 *   0 un chatbot que solo responde texto · 1 el agente planea los pasos ·
 *   2 usa herramientas en la nube (Drive, Gmail, Canva) desde el celular ·
 *   3 maneja el navegador como una persona ·
 *   4 ciclo planear, ejecutar, revisar y volver a intentar, con revisión humana.
 * `draw(t)` es una función pura del tiempo dentro del loop.
 */
export const AGENTES_IDEA_DURATION = 16

const AMBER = 0xf4cb18
const CYAN = 0x7fdcff
const GREEN = 0x3be09a

const PHASE = 3.2
const Y = 3.4

/* paso 0: globos de chat */
const USER_BUBBLE = { x: 1.7, y: 5.45, w: 4.8, h: 1.05 }
const REPLY = { x: -0.9, y: 3.25, w: 6.2, h: 2.5 }

/* paso 1: plan */
const AGENT_SIDE_X = -3.1
const PLAN = { x: 2.5, y: Y, w: 4.9, h: 4.1 }
const PLAN_STEPS = ['Leer la tarea', 'Buscar los datos', 'Redactar el borrador', 'Revisar el resultado']
const PLAN_ROWS_V = [0.34, 0.52, 0.7, 0.88]
const CHECK_AT = [4.55, 5.0, 5.45, 5.9]

/* paso 2: conectores en órbita y celular */
const ORBIT = { rx: 3.5, ry: 1.5, rz: 1.4, speed: 0.75 }
const TILE_W = 2.4
const TILE_H = 1.05
const TOOLS = [
  { kind: 'drive', name: 'Drive', color: 0x4f9bff, at: 6.9 },
  { kind: 'gmail', name: 'Gmail', color: 0xff6b5e, at: 7.2 },
  { kind: 'canva', name: 'Canva', color: 0x44d3fe, at: 7.5 },
]
const PHONE = { x: 6.0, y: 3.2, w: 1.9, h: 3.5 }
const CLOUD = { x: 0, y: 6.45 }

/* paso 3: navegador */
const AGENT_BROWSER_X = -5.2
const BROWSER = { x: 1.2, y: Y, w: 7.6, h: 4.6 }
const FIELD_1 = { u: 0.5, v: 0.44, w: 0.84, h: 0.1 }
const FIELD_2 = { u: 0.5, v: 0.63, w: 0.84, h: 0.1 }
const BTN = { u: 0.76, v: 0.83, w: 0.32, h: 0.11 }
const bx = (u) => BROWSER.x + (u - 0.5) * BROWSER.w
const by = (v) => BROWSER.y + (0.5 - v) * BROWSER.h
const CLICKS = [10.55, 11.15, 11.95]
const CURSOR_PATH = [
  [9.9, bx(0.98), by(1.05)],
  [10.5, bx(0.2), by(FIELD_1.v)],
  [10.6, bx(0.2), by(FIELD_1.v)],
  [11.1, bx(0.2), by(FIELD_2.v)],
  [11.2, bx(0.2), by(FIELD_2.v)],
  [11.9, bx(BTN.u), by(BTN.v)],
]

/* paso 4: ciclo */
const CYCLE = { x: 0, y: 3.6, rx: 3.6, ry: 2.1 }
const NODE_W = 3.0
const NODE_H = 0.9
const NODES = [
  { label: 'Planear', angle: Math.PI / 2 },
  { label: 'Ejecutar', angle: 0 },
  { label: 'Revisar', angle: -Math.PI / 2, human: true },
  { label: 'Volver a intentar', angle: -Math.PI },
]
const ARC_GAP = 0.42
const PULSE_START = 14.1
const PULSE_SPEED = 3.0
const REVIEW_HIT = PULSE_START + Math.PI / PULSE_SPEED

const cycleX = (a) => CYCLE.x + Math.cos(a) * CYCLE.rx
const cycleY = (a) => CYCLE.y + Math.sin(a) * CYCLE.ry

/** Arco de elipse en el plano XY, en sentido horario de a0 a a1. */
class EllipseArc extends THREE.Curve {
  constructor(a0, a1) {
    super()
    this.a0 = a0
    this.a1 = a1
  }

  getPoint(t, target = new THREE.Vector3()) {
    const a = lerp(this.a0, this.a1, t)
    return target.set(cycleX(a), cycleY(a), 0.15)
  }
}

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

function line(ctx, x, y, width, height = 14, color = 'rgba(4,35,97,0.2)') {
  ctx.fillStyle = color
  roundRectPath(ctx, x, y, width, height, height / 2)
  ctx.fill()
}

function header(ctx, w, h, title, color, size = 0.075) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = color
  ctx.fillRect(0, 0, w, h * 0.14)
  fitText(ctx, title, w * 0.05, h * 0.1, { weight: 800, size: h * size, maxWidth: w * 0.9, color: '#ffffff' })
}

function drawUserBubble(ctx, w, h) {
  ctx.fillStyle = '#dbe6ff'
  ctx.fillRect(0, 0, w, h)
  fitText(ctx, '¿Me ayuda a organizar la semana?', w * 0.06, h * 0.6, { weight: 700, size: h * 0.34, family: FONT_BODY, maxWidth: w * 0.88, color: '#042361' })
}

function drawReply(ctx, w, h) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#34425f'
  ctx.beginPath()
  ctx.arc(w * 0.08, h * 0.2, h * 0.09, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, 'IA', w * 0.08, h * 0.235, { weight: 800, size: h * 0.09, color: '#ffffff', align: 'center' })
  fitText(ctx, 'Claro. Aquí tiene un plan:', w * 0.16, h * 0.24, { weight: 800, size: h * 0.1, maxWidth: w * 0.78, color: '#042361' })
  ;['Lunes: preparar la clase', 'Miércoles: calificar ensayos', 'Viernes: publicar notas'].forEach((text, i) => {
    const y = h * (0.46 + i * 0.17)
    ctx.fillStyle = '#4574b9'
    ctx.beginPath()
    ctx.arc(w * 0.18, y - h * 0.03, h * 0.022, 0, Math.PI * 2)
    ctx.fill()
    fitText(ctx, text, w * 0.21, y, { weight: 500, size: h * 0.085, family: FONT_BODY, maxWidth: w * 0.72, color: 'rgba(4,35,97,0.8)' })
  })
}

function drawPlan(ctx, w, h) {
  header(ctx, w, h, 'Plan del agente', '#2a2f7a')
  PLAN_STEPS.forEach((text, i) => {
    const v = PLAN_ROWS_V[i]
    const y = h * v
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = 'rgba(4,35,97,0.14)'
    ctx.lineWidth = 3
    roundRectPath(ctx, w * 0.04, y - h * 0.075, w * 0.92, h * 0.15, 18)
    ctx.fill()
    ctx.stroke()
    ctx.strokeStyle = '#2a2f7a'
    ctx.lineWidth = 5
    roundRectPath(ctx, w * 0.07, y - h * 0.04, h * 0.08, h * 0.08, 8)
    ctx.stroke()
    fitText(ctx, `${i + 1}. ${text}`, w * 0.2, y + h * 0.022, { weight: 700, size: h * 0.06, maxWidth: w * 0.74, color: '#042361' })
  })
}

function drawTool(ctx, w, h, tool) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  const s = h * 0.52
  const x = w * 0.09
  const y = h * 0.24
  if (tool.kind === 'drive') {
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
  } else if (tool.kind === 'gmail') {
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
  fitText(ctx, tool.name, w * 0.4, h * 0.63, { weight: 800, size: h * 0.32, maxWidth: w * 0.54, color: '#042361' })
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

function drawPhone(ctx, w, h) {
  ctx.fillStyle = '#111a33'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#f6f8ff'
  roundRectPath(ctx, w * 0.07, h * 0.06, w * 0.86, h * 0.88, 26)
  ctx.fill()
  ctx.fillStyle = '#111a33'
  roundRectPath(ctx, w * 0.36, h * 0.075, w * 0.28, h * 0.022, 6)
  ctx.fill()
  ctx.fillStyle = '#2a2f7a'
  ctx.fillRect(w * 0.07, h * 0.12, w * 0.86, h * 0.08)
  fitText(ctx, 'Agente', w / 2, h * 0.178, { weight: 800, size: h * 0.045, maxWidth: w * 0.7, color: '#ffffff', align: 'center' })
  ctx.fillStyle = '#dbe6ff'
  roundRectPath(ctx, w * 0.2, h * 0.24, w * 0.68, h * 0.13, 16)
  ctx.fill()
  fitText(ctx, 'Prepare la', w * 0.25, h * 0.295, { weight: 600, size: h * 0.034, family: FONT_BODY, maxWidth: w * 0.6, color: '#042361' })
  fitText(ctx, 'clase del lunes', w * 0.25, h * 0.345, { weight: 600, size: h * 0.034, family: FONT_BODY, maxWidth: w * 0.6, color: '#042361' })
  ;[
    ['Drive', '#1fa463'],
    ['Gmail', '#d93a3a'],
    ['Canva', '#00c4cc'],
  ].forEach(([name, color], i) => {
    const y = h * (0.47 + i * 0.12)
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = 'rgba(4,35,97,0.12)'
    ctx.lineWidth = 3
    roundRectPath(ctx, w * 0.12, y - h * 0.045, w * 0.76, h * 0.09, 14)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(w * 0.22, y, h * 0.018, 0, Math.PI * 2)
    ctx.fill()
    fitText(ctx, name, w * 0.3, y + h * 0.013, { weight: 700, size: h * 0.036, maxWidth: w * 0.5, color: '#042361' })
  })
  line(ctx, w * 0.14, h * 0.85, w * 0.72, h * 0.03, 'rgba(68,211,254,0.35)')
}

function drawBrowser(ctx, w, h) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#34425f'
  ctx.fillRect(0, 0, w, h * 0.14)
  ;['#ff6b5e', '#f4cb18', '#3be09a'].forEach((c, i) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(w * 0.035 + i * w * 0.03, h * 0.07, h * 0.018, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.fillStyle = '#f6f8ff'
  roundRectPath(ctx, w * 0.14, h * 0.025, w * 0.24, h * 0.115, 12)
  ctx.fill()
  fitText(ctx, 'Aula virtual', w * 0.16, h * 0.1, { weight: 700, size: h * 0.045, maxWidth: w * 0.2, color: '#042361' })
  ctx.fillStyle = '#e3e9f6'
  roundRectPath(ctx, w * 0.04, h * 0.165, w * 0.92, h * 0.07, h * 0.035)
  ctx.fill()
  fitText(ctx, 'aula.colegio.edu/tareas/nueva', w * 0.07, h * 0.215, { weight: 500, size: h * 0.04, family: FONT_MONO, maxWidth: w * 0.8, color: 'rgba(4,35,97,0.65)' })
  fitText(ctx, 'Nueva tarea', w * 0.08, h * 0.32, { weight: 800, size: h * 0.06, maxWidth: w * 0.6, color: '#042361' })
  ;[
    ['Título', FIELD_1],
    ['Instrucciones', FIELD_2],
  ].forEach(([label, f]) => {
    fitText(ctx, label, w * 0.08, h * (f.v - f.h / 2 - 0.015), { weight: 600, size: h * 0.035, family: FONT_BODY, maxWidth: w * 0.4, color: 'rgba(4,35,97,0.6)' })
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = 'rgba(4,35,97,0.22)'
    ctx.lineWidth = 3
    roundRectPath(ctx, w * (f.u - f.w / 2), h * (f.v - f.h / 2), w * f.w, h * f.h, 12)
    ctx.fill()
    ctx.stroke()
  })
  ctx.fillStyle = '#1f8a5b'
  roundRectPath(ctx, w * (BTN.u - BTN.w / 2), h * (BTN.v - BTN.h / 2), w * BTN.w, h * BTN.h, 14)
  ctx.fill()
  fitText(ctx, 'Guardar borrador', w * BTN.u, h * (BTN.v + 0.017), { weight: 800, size: h * 0.045, maxWidth: w * BTN.w * 0.86, color: '#ffffff', align: 'center' })
}

function drawNode(ctx, w, h, index, label, human) {
  ctx.fillStyle = human ? '#fff4c2' : '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = human ? '#f4cb18' : '#2a2f7a'
  ctx.beginPath()
  ctx.arc(h * 0.5, h * 0.5, h * 0.3, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, String(index + 1), h * 0.5, h * 0.62, { weight: 800, size: h * 0.32, color: human ? '#042361' : '#ffffff', align: 'center' })
  fitText(ctx, label, h * 0.95, h * 0.62, { weight: 800, size: h * 0.34, maxWidth: w - h * 1.1, color: '#042361' })
}

function drawChip(ctx, w, h, text, fill, ink = '#042361') {
  ctx.fillStyle = fill
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fill()
  fitText(ctx, text, w / 2, h * 0.67, { weight: 800, size: h * 0.48, maxWidth: w * 0.88, color: ink, align: 'center' })
}

function drawCheck(ctx, w, h) {
  ctx.fillStyle = '#3be09a'
  ctx.beginPath()
  ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#042361'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = w * 0.14
  ctx.beginPath()
  ctx.moveTo(w * 0.28, h * 0.52)
  ctx.lineTo(w * 0.44, h * 0.68)
  ctx.lineTo(w * 0.74, h * 0.34)
  ctx.stroke()
}

function drawLabel(ctx, w, h, text) {
  fitText(ctx, text, w / 2, h * 0.72, { weight: 800, size: h * 0.62, maxWidth: w * 0.96, color: '#e6f8ff', align: 'center' })
}

function drawFooter(ctx, w, h, text) {
  fitText(ctx, text, w / 2, h * 0.7, { weight: 600, size: h * 0.6, family: FONT_MONO, maxWidth: w * 0.96, color: '#9fc4ff', align: 'center' })
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

export default function createAgentesIdeaScene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: AGENTES_IDEA_DURATION,
    frame: { wideHalfW: 8.7, narrowHalfW: 6.2, halfH: 4.45, camY: 5.0, lookY: 3.3 },
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 10, perBurst: 18, seed: 71 })
  scene.add(bursts.points)
  const amberColor = new THREE.Color(AMBER)
  const greenColor = new THREE.Color(GREEN)
  const cyanColor = new THREE.Color(CYAN)

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
  const chip = (w, h, text, fill, ink) => {
    const mesh = makeTextPlane(w, h, makeTex(Math.round(w * 200), Math.round(h * 200), (ctx, cw, ch) => drawChip(ctx, cw, ch, text, fill, ink), invalidate))
    mesh.renderOrder = 8
    scene.add(mesh)
    return mesh
  }
  const shown = (obj, k) => {
    obj.material.opacity = k
    obj.visible = k > 0.01
  }

  /* ---------------- paso 0: chatbot ---------------- */
  const userBubble = makeCard(USER_BUBBLE, drawUserBubble, { radius: 0.4, edge: '#b9c9ee' })
  const reply = makeCard(REPLY, drawReply, { radius: 0.4 })
  scene.add(userBubble.group, reply.group)
  const dotMat = new THREE.MeshBasicMaterial({ color: 0x9fc4ff, transparent: true, depthWrite: false, toneMapped: false })
  const dotGeo = new THREE.CircleGeometry(0.13, 24)
  const dots = [0, 1, 2].map(() => {
    const mesh = new THREE.Mesh(dotGeo, dotMat)
    scene.add(mesh)
    return mesh
  })
  const copyChip = chip(1.7, 0.62, 'Copiar', '#ffd04b')
  const textOnly = chip(4.2, 0.66, 'Solo responde texto', '#9fe8ff')
  textOnly.position.set(-0.4, 1.15, 0.3)

  /* ---------------- agente ---------------- */
  const agent = new THREE.Group()
  scene.add(agent)
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.62, 48, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x1a4fa8,
      emissive: CYAN,
      emissiveIntensity: 0.32,
      roughness: 0.25,
      metalness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    }),
  )
  core.castShadow = true
  agent.add(core)
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })
  const eyes = [-0.2, 0.2].map((x) => {
    const eye = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.12, 6, 12), eyeMat)
    eye.position.set(x, 0.08, 0.6)
    agent.add(eye)
    return eye
  })
  const ringOuter = new THREE.Mesh(
    new THREE.TorusGeometry(0.98, 0.045, 14, 96),
    new THREE.MeshStandardMaterial({ color: AMBER, metalness: 0.75, roughness: 0.28, emissive: AMBER, emissiveIntensity: 0.25 }),
  )
  ringOuter.castShadow = true
  agent.add(ringOuter)
  const ringInner = new THREE.Mesh(
    new THREE.TorusGeometry(0.8, 0.025, 10, 80),
    new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }),
  )
  agent.add(ringInner)
  const agentGlow = addGlow(agent, glow, CYAN, 3.4, 0.5)
  const agentLabel = makeTextPlane(1.8, 0.42, makeTex(360, 84, (ctx, w, h) => drawLabel(ctx, w, h, 'Agente'), invalidate))
  agentLabel.position.set(0, -1.35, 0.2)
  agent.add(agentLabel)
  const agentRing = makeShockRing(CYAN)
  scene.add(agentRing)

  /* ---------------- paso 1: plan ---------------- */
  const plan = makeCard(PLAN, drawPlan, { emissive: '#3be09a' })
  scene.add(plan.group)
  const checkTex = makeTex(128, 128, drawCheck, invalidate)
  const checks = PLAN_STEPS.map(() => {
    const mesh = makeTextPlane(0.42, 0.42, checkTex)
    mesh.renderOrder = 6
    scene.add(mesh)
    return mesh
  })
  const planBeam = makeBeam(CYAN, 0.8)
  scene.add(planBeam)

  /* ---------------- paso 2: herramientas ---------------- */
  const cloud = makeTextPlane(3.2, 1.4, makeTex(640, 280, drawCloud, invalidate))
  cloud.position.set(CLOUD.x, CLOUD.y, -0.6)
  scene.add(cloud)
  const cloudBeam = makeBeam(CYAN, 0.5)
  scene.add(cloudBeam)
  const tools = TOOLS.map((tool) => {
    const card = makeCard({ w: TILE_W, h: TILE_H }, (ctx, w, h) => drawTool(ctx, w, h, tool), { radius: 0.26, emissive: '#ffffff' })
    scene.add(card.group)
    const beam = makeBeam(tool.color, 0.8)
    scene.add(beam)
    return { ...tool, card, beam }
  })
  const phone = makeCard(PHONE, drawPhone, { radius: 0.3, edge: '#1b2440', emissive: '#44d3fe' })
  scene.add(phone.group)
  const phoneBeam = makeBeam(CYAN, 0.6)
  scene.add(phoneBeam)
  const packet = addGlow(scene, glow, CYAN, 0.9, 0)

  /* ---------------- paso 3: navegador ---------------- */
  const browser = makeCard(BROWSER, drawBrowser, { emissive: '#3be09a' })
  scene.add(browser.group)
  const flat = plainTex(invalidate)
  const typeBars = [FIELD_1, FIELD_2].map(() => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: flat, color: 0x4574b9, transparent: true, depthWrite: false, toneMapped: false }),
    )
    mesh.renderOrder = 5
    scene.add(mesh)
    return mesh
  })
  const cursor = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: makeCursorTexture(), transparent: true, depthWrite: false, depthTest: false }),
  )
  cursor.renderOrder = 20
  scene.add(cursor)
  const clickRings = CLICKS.map(() => {
    const ring = makeShockRing(CYAN)
    scene.add(ring)
    return ring
  })
  const cursorBeam = makeBeam(CYAN, 0.55)
  scene.add(cursorBeam)
  const savedChip = chip(3.6, 0.62, 'Borrador guardado', '#3be09a')
  savedChip.position.set(bx(BTN.u) - 0.3, by(1) - 0.55, 0.4)

  /* ---------------- paso 4: ciclo con revisión ---------------- */
  const nodes = NODES.map((node, i) => {
    const card = makeCard({ w: NODE_W, h: NODE_H }, (ctx, w, h) => drawNode(ctx, w, h, i, node.label, node.human), {
      radius: 0.3,
      edge: node.human ? '#f4cb18' : '#cfd8ea',
      emissive: node.human ? '#f4cb18' : '#7fdcff',
    })
    scene.add(card.group)
    const next = NODES[(i + 1) % NODES.length].angle
    const a0 = node.angle - ARC_GAP
    const a1 = (i === NODES.length - 1 ? next - Math.PI * 2 : next) + ARC_GAP
    const curve = new EllipseArc(a0, a1)
    const arc = makeArcTube(curve, 0.05, CYAN, 0.85, 48)
    scene.add(arc)
    const head = new THREE.Mesh(
      new THREE.ConeGeometry(0.17, 0.4, 18),
      new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, depthWrite: false, toneMapped: false }),
    )
    const tip = curve.getPoint(1)
    head.position.copy(tip)
    head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), curve.getTangent(1).normalize())
    scene.add(head)
    return { ...node, card, arc, head }
  })
  const review = nodes[2]
  const reviewGlow = addGlow(scene, glow, AMBER, 4.2, 0)
  reviewGlow.position.set(cycleX(review.angle), cycleY(review.angle), -0.6)
  const reviewRing = makeShockRing(AMBER)
  reviewRing.position.set(cycleX(review.angle), cycleY(review.angle), 0.2)
  scene.add(reviewRing)
  const reviewLight = new THREE.PointLight(AMBER, 0, 9, 2)
  reviewLight.position.set(cycleX(review.angle), cycleY(review.angle) + 0.4, 2.2)
  scene.add(reviewLight)
  const humanChip = chip(3.8, 0.66, 'Usted revisa aquí', '#f4cb18')
  humanChip.position.set(cycleX(review.angle), cycleY(review.angle) - 0.95, 0.4)
  const cyclePulse = addGlow(scene, glow, CYAN, 1.1, 0)
  const footerPlane = makeTextPlane(11, 0.62, makeTex(1760, 100, (ctx, w, h) => drawFooter(ctx, w, h, 'De chatbot a agente, sin perder el control'), invalidate))
  footerPlane.position.set(0, -0.55, 0.2)
  scene.add(footerPlane)

  const pA = new THREE.Vector3()
  const pB = new THREE.Vector3()
  const pC = new THREE.Vector3()

  function place(card, x, y, z, s, opacity) {
    card.group.position.set(x, y, z)
    card.group.scale.setScalar(safeScale(s))
    setCardOpacity(card, opacity)
  }
  const enter = (T, i) => {
    const a = i * PHASE + 0.1
    return { drop: (1 - smooth(seg(T, a, a + 0.5))) * 0.4, scale: lerp(0.94, 1, easeOutCubic(seg(T, a, a + 0.5))) }
  }

  /** Posición y escala del agente según la fase (continuo entre fases). */
  function agentPose(T) {
    let x = 0
    x = lerp(x, AGENT_SIDE_X, easeInOutCubic(seg(T, 4.0, 4.6)))
    x = lerp(x, 0, easeInOutCubic(seg(T, 6.4, 7.0)))
    x = lerp(x, AGENT_BROWSER_X, easeInOutCubic(seg(T, 9.6, 10.2)))
    x = lerp(x, CYCLE.x, easeInOutCubic(seg(T, 12.8, 13.4)))
    let s = 1
    s = lerp(s, 0.62, easeInOutCubic(seg(T, 9.6, 10.2)))
    s = lerp(s, 0.6, easeInOutCubic(seg(T, 12.8, 13.4)))
    const y = lerp(Y, CYCLE.y, easeInOutCubic(seg(T, 12.8, 13.4)))
    return { x, y, s: s * easeOutBack(seg(T, 3.3, 3.95)) }
  }

  function draw(t) {
    const T = t * AGENTES_IDEA_DURATION
    const events = []
    const fx = 1.0 * window01(T, 6.4, 7.0, 9.4, 10.0)
    stage.update(T, fx)
    stage.spot.position.set(fx, 4.6, 5.5)
    const op = [0, 1, 2, 3, 4].map((i) => phaseOpacity(T, i))
    const e = [0, 1, 2, 3, 4].map((i) => enter(T, i))

    /* ---------- paso 0: el chatbot solo responde texto ---------- */
    const userIn = easeOutBack(seg(T, 0.15, 0.7))
    place(userBubble, USER_BUBBLE.x, USER_BUBBLE.y - e[0].drop, 0, userIn, op[0])
    dots.forEach((dot, i) => {
      dot.position.set(REPLY.x - REPLY.w / 2 + 0.5 + i * 0.4, REPLY.y + 0.6 + Math.abs(Math.sin(T * 9 - i * 0.7)) * 0.12, 0.2)
      dot.visible = T > 0.6 && T < 1.35
    })
    dotMat.opacity = smooth(seg(T, 0.6, 0.75)) * (1 - smooth(seg(T, 1.2, 1.35)))
    const replyIn = easeOutBack(seg(T, 1.25, 1.8))
    place(reply, REPLY.x, REPLY.y - e[0].drop, 0, replyIn, op[0] * smooth(seg(T, 1.25, 1.5)))
    flashCard(reply, bump(seg(T, 1.5, 2.2)) * 0.35)
    const copyK = easeInOutCubic(seg(T, 1.85, 2.75))
    copyChip.position.set(lerp(REPLY.x + 1.8, 7.0, copyK), REPLY.y - 0.3 + Math.sin(copyK * Math.PI) * 1.2, 1.2)
    shown(copyChip, smooth(seg(T, 1.85, 2.0)) * (1 - smooth(seg(T, 2.6, 2.8))))
    textOnly.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 1.6, 2.1)))))
    shown(textOnly, op[0] * smooth(seg(T, 1.6, 1.9)))

    /* ---------- agente ---------- */
    const pose = agentPose(T)
    agent.position.set(pose.x, pose.y + Math.sin(T * 2.1) * 0.08, 0.2)
    agent.scale.setScalar(safeScale(pose.s))
    agent.visible = T > 3.3
    ringOuter.rotation.set(1.15 + Math.sin(T * 0.9) * 0.15, T * 0.8, 0)
    ringInner.rotation.set(-0.4, 0.9 + T * -1.3, 0)
    core.rotation.y = Math.sin(T * 0.7) * 0.25
    const blink = bump(seg((T % 2.7) / 2.7, 0.9, 0.96))
    eyes.forEach((eye) => eye.scale.set(1, safeScale(1 - blink * 0.85), 1))
    agentGlow.material.opacity = 0.45 + 0.1 * Math.sin(T * 3)
    agentLabel.material.opacity = smooth(seg(T, 3.6, 4.0)) * (1 - window01(T, 6.3, 6.7, 9.6, 10.0))
    agentLabel.visible = agentLabel.material.opacity > 0.01
    setShockRing(agentRing, T - 3.45, 1.0, 2.2)
    agentRing.position.set(0, Y, 0.1)
    if (T >= 3.4 && T < 4.4) events.push({ t: 3.45, x: 0, y: Y, z: 0.8, color: cyanColor, speed: 2.4, life: 1.0 })

    /* ---------- paso 1: el agente planea ---------- */
    place(plan, PLAN.x, PLAN.y - e[1].drop, 0, easeOutBack(seg(T, 4.2, 4.75)) * e[1].scale, op[1] * smooth(seg(T, 4.2, 4.5)))
    let target = -1
    checks.forEach((mesh, i) => {
      const at = CHECK_AT[i]
      const rowY = PLAN.y + (0.5 - PLAN_ROWS_V[i]) * PLAN.h
      mesh.position.set(PLAN.x + (0.07 + (0.04 * PLAN.h) / PLAN.w - 0.5) * PLAN.w, rowY, 0.2)
      mesh.scale.setScalar(safeScale(easeOutBack(seg(T, at, at + 0.35))))
      shown(mesh, op[1] * smooth(seg(T, at, at + 0.1)))
      if (target < 0 && T < at + 0.05) target = i
      if (T >= at && T < at + 0.9) events.push({ t: at, x: mesh.position.x, y: rowY, z: 0.8, color: greenColor, speed: 1.2, life: 0.8 })
    })
    if (target >= 0 && T > 4.3 && T < 6.2) {
      const rowY = PLAN.y + (0.5 - PLAN_ROWS_V[target]) * PLAN.h
      pA.set(pose.x + 0.9 * pose.s, pose.y, 0.3)
      pB.set(PLAN.x - PLAN.w / 2, rowY, 0.3)
      const k = easeOutCubic(seg(T, CHECK_AT[target] - 0.42, CHECK_AT[target] - 0.1))
      pC.copy(pA).lerp(pB, k)
      setBeam(planBeam, pA, pC, 0.03)
      planBeam.material.opacity = 0.75 * op[1]
      if (k < 0.001) planBeam.visible = false
    } else {
      planBeam.visible = false
    }
    flashCard(plan, bump(seg(T, 5.9, 6.4)) * 0.4)

    /* ---------- paso 2: herramientas desde la nube ---------- */
    cloud.scale.setScalar(safeScale(lerp(0.85, 1, easeOutBack(seg(T, 6.6, 7.1)))))
    shown(cloud, op[2] * smooth(seg(T, 6.6, 6.9)))
    pA.set(pose.x, pose.y + 0.9, 0)
    pB.set(CLOUD.x, CLOUD.y - 0.45, -0.4)
    pC.copy(pA).lerp(pB, easeOutCubic(seg(T, 6.8, 7.2)))
    setBeam(cloudBeam, pA, pC, 0.025)
    cloudBeam.material.opacity = 0.5 * op[2]
    if (T < 6.8 || op[2] < 0.01) cloudBeam.visible = false

    tools.forEach((tool, i) => {
      const angle = T * ORBIT.speed + (i * Math.PI * 2) / 3 + 0.4
      const x = pose.x + Math.cos(angle) * ORBIT.rx
      const y = Y - Math.sin(angle) * ORBIT.ry
      const z = Math.sin(angle) * ORBIT.rz
      const k = easeOutBack(seg(T, tool.at, tool.at + 0.5))
      place(tool.card, x, y, z, k, op[2] * smooth(seg(T, tool.at, tool.at + 0.25)))
      flashCard(tool.card, bump(seg(T, tool.at + 0.2, tool.at + 1.0)) * 0.5)
      if (T >= tool.at + 0.15 && T < tool.at + 1.0) events.push({ t: tool.at + 0.2, x, y, z: z + 0.6, color: cyanColor, speed: 1.6, life: 0.8 })
      pA.set(pose.x, pose.y, 0)
      pB.set(x, y, z)
      pC.copy(pA).lerp(pB, easeOutCubic(seg(T, tool.at + 0.1, tool.at + 0.5)))
      setBeam(tool.beam, pA, pC, 0.03 + 0.012 * Math.sin(T * 6 + i))
      tool.beam.material.opacity = 0.7 * op[2]
      if (T < tool.at + 0.1 || op[2] < 0.01) tool.beam.visible = false
    })

    const phoneK = easeOutCubic(seg(T, 7.0, 7.6))
    place(phone, lerp(PHONE.x + 3, PHONE.x, phoneK), PHONE.y, 0.3, easeOutBack(seg(T, 7.0, 7.6)), op[2] * smooth(seg(T, 7.0, 7.3)))
    flashCard(phone, bump(seg(T, 7.6, 8.3)) * 0.4)
    pA.set(PHONE.x - PHONE.w / 2, PHONE.y + 0.3, 0.3)
    pB.set(pose.x + 0.9, pose.y, 0.3)
    const phoneTravel = easeInOutCubic(seg(T, 7.7, 8.1))
    pC.copy(pA).lerp(pB, phoneTravel)
    setBeam(phoneBeam, pA, pC, 0.028)
    phoneBeam.material.opacity = 0.55 * op[2]
    if (phoneTravel < 0.001 || op[2] < 0.01) phoneBeam.visible = false
    const packetK = ((T - 8.1) / 0.8) % 1
    packet.position.copy(pA).lerp(pB, packetK < 0 ? 0 : packetK)
    packet.position.z = 0.5
    packet.material.opacity = T > 8.1 ? 0.9 * op[2] * bump(packetK) : 0

    /* ---------- paso 3: maneja el navegador ---------- */
    place(browser, BROWSER.x, BROWSER.y - e[3].drop, 0, e[3].scale, op[3])
    flashCard(browser, bump(seg(T, CLICKS[2], CLICKS[2] + 0.7)) * 0.45)
    ;[FIELD_1, FIELD_2].forEach((f, i) => {
      const a = CLICKS[i] + 0.1
      const k = easeOutCubic(seg(T, a, a + (i === 0 ? 0.4 : 0.6)))
      const full = BROWSER.w * f.w * (i === 0 ? 0.42 : 0.7)
      const w = full * k
      const bar = typeBars[i]
      bar.position.set(bx(f.u - f.w / 2) + 0.2 + w / 2, by(f.v), 0.12)
      bar.scale.set(safeScale(w), 0.16, 1)
      shown(bar, op[3] * 0.75 * smooth(seg(T, a, a + 0.05)))
    })
    const c = cursorAt(T)
    const clickK = CLICKS.reduce((acc, at) => Math.max(acc, bump(seg(T, at, at + 0.22))), 0)
    cursor.position.set(c.x + 0.31, c.y - 0.41, 1.7)
    cursor.scale.setScalar(1 - clickK * 0.1)
    cursor.material.opacity = smooth(seg(T, 9.85, 10.1)) * (1 - smooth(seg(T, 12.4, 12.7)))
    cursor.visible = cursor.material.opacity > 0.01
    CLICKS.forEach((at, i) => {
      setShockRing(clickRings[i], T - at, 0.8, i === 2 ? 1.3 : 0.9)
      const pos = i === 0 ? [bx(0.2), by(FIELD_1.v)] : i === 1 ? [bx(0.2), by(FIELD_2.v)] : [bx(BTN.u), by(BTN.v)]
      clickRings[i].position.set(pos[0], pos[1], 1.5)
      if (i === 2 && T >= at && T < at + 1) events.push({ t: at, x: pos[0], y: pos[1], z: 1.2, color: greenColor, speed: 1.8, life: 0.9 })
    })
    pA.set(pose.x + 0.6, pose.y, 0.3)
    pB.set(c.x, c.y, 1.2)
    setBeam(cursorBeam, pA, pB, 0.022)
    cursorBeam.material.opacity = 0.5 * op[3] * smooth(seg(T, 10.1, 10.4))
    if (cursorBeam.material.opacity < 0.01) cursorBeam.visible = false
    savedChip.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 12.05, 12.45)))))
    shown(savedChip, op[3] * smooth(seg(T, 12.05, 12.3)))

    /* ---------- paso 4: ciclo con revisión humana ---------- */
    const pulseAngle = Math.PI / 2 - (T - PULSE_START) * PULSE_SPEED
    nodes.forEach((node, i) => {
      const at = 13.0 + i * 0.25
      place(node.card, cycleX(node.angle), cycleY(node.angle), 0.15, easeOutBack(seg(T, at, at + 0.45)), op[4] * smooth(seg(T, at, at + 0.2)))
      const arcAt = 13.25 + i * 0.22
      setArcProgress(node.arc, op[4] > 0.01 ? easeInOutCubic(seg(T, arcAt, arcAt + 0.4)) : 0)
      node.arc.material.opacity = 0.85 * op[4]
      node.head.material.opacity = op[4] * smooth(seg(T, arcAt + 0.35, arcAt + 0.45))
      node.head.visible = node.head.material.opacity > 0.01
      // el pulso ilumina cada nodo al pasar
      const hitAt = PULSE_START + (Math.PI / 2 - node.angle) / PULSE_SPEED
      const hit = bump(seg(T, hitAt - 0.2, hitAt + 0.35))
      if (node.human) {
        flashCard(node.card, (0.1 + 0.06 * Math.sin(T * 5)) * smooth(seg(T, 13.8, 14.2)) + hit * 0.15)
      } else {
        flashCard(node.card, hit * 0.45)
      }
    })
    const reviewOn = op[4] * smooth(seg(T, 13.8, 14.3))
    reviewGlow.material.opacity = reviewOn * (0.38 + 0.1 * Math.sin(T * 4))
    reviewLight.intensity = reviewOn * (3 + 0.8 * Math.sin(T * 5))
    setShockRing(reviewRing, T > 13.9 ? (T - 13.9) % 1.3 : -1, 1.3, 2.0)
    reviewRing.material.opacity *= op[4]
    humanChip.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 13.9, 14.4)))))
    shown(humanChip, op[4] * smooth(seg(T, 13.9, 14.2)))
    if (T >= REVIEW_HIT && T < REVIEW_HIT + 1) {
      events.push({ t: REVIEW_HIT, x: cycleX(review.angle), y: cycleY(review.angle), z: 0.9, color: amberColor, speed: 2.0, life: 0.9 })
    }

    cyclePulse.position.set(cycleX(pulseAngle), cycleY(pulseAngle), -0.25)
    const nearReview = 1 - Math.min(1, Math.abs(pulseAngle - review.angle) / 0.6)
    cyclePulse.material.color.copy(cyanColor).lerp(amberColor, nearReview)
    cyclePulse.material.opacity = T > PULSE_START ? op[4] * smooth(seg(T, PULSE_START, PULSE_START + 0.2)) : 0
    cyclePulse.scale.setScalar(1.1 + nearReview * 0.2)
    cyclePulse.material.opacity *= 1 - nearReview * 0.5

    footerPlane.material.opacity = smooth(seg(T, 14.6, 15.0)) * (1 - smooth(seg(T, 15.7, 16)))
    footerPlane.visible = footerPlane.material.opacity > 0.01

    bursts.update(T, events)
    return Math.min(4, Math.floor(T / PHASE))
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize: stage.resize, dispose }
}
