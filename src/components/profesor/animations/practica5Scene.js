import * as THREE from 'three'
import {
  bump,
  clamp01,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  lerp,
  roundRectPath,
  seg,
  smooth,
} from './threeKit'
import {
  FONT_BODY,
  FONT_MONO,
  addGlow,
  clipRound,
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
  setShockRing,
  settleWobble,
} from './stageKit'

/**
 * Práctica 5 · Compartirlo como tutor
 *  1 Dos pantallas · 2 Compartir · 3 Solo chat no existe
 *  4 Todo el dominio no existe · 5 Enlace a Moodle
 */

export const PRACTICA5_DURATION = 16

const GREEN = '#1f8a5b'
const RED = '#d23a31'

/* ---------------- pantallas ---------------- */
const MON = { w: 6.6, h: 4.3, x: 4.7, y: 3.95, depth: 0.28 }
const SCREEN = { w: 6.1, h: 3.8 }
const PX = 150 // píxeles de textura por unidad
const HEAD = { h: 0.5, y: 1.65 }
const PANEL_Y = -0.24
const PANEL_H = 3.12
const PANELS = [
  { key: 'sources', w: 1.6, x: -2.175 },
  { key: 'chat', w: 2.55, x: 0 },
  { key: 'outputs', w: 1.6, x: 2.175 },
]
const SOURCE_ROWS = [
  { name: 'Programa', tone: '#4574b9' },
  { name: 'Lectura 1', tone: '#1f8a5b' },
  { name: 'Lectura 2', tone: '#1f8a5b' },
  { name: 'Artículo', tone: '#a07ad8' },
  { name: 'Transcripción', tone: '#e08a2c' },
]
const TILES = [
  { kind: 'report', name: 'Informe', tone: '#4574b9' },
  { kind: 'mind', name: 'Mapa mental', tone: '#a98bff' },
  { kind: 'cards', name: 'Tarjetas', tone: '#f4cb18' },
  { kind: 'quiz', name: 'Cuestionario', tone: '#3be09a' },
  { kind: 'audio', name: 'Audio', tone: '#ff8a70' },
  { kind: 'video', name: 'Video', tone: '#44d3fe' },
]

/* ---------------- interruptores ---------------- */
const SW = { x: 0, y: 3.95, z: 1.5, w: 2.9, h: 1.9 }
const KNOB_RANGE = 0.37
const SWITCHES = [
  { key: 'chat', label: 'Solo chat', sub: 'Que vea solo el chat', tone: '#44d3fe', icon: 'chat', start: 6.4 },
  { key: 'domain', label: 'Todo el dominio', sub: '@unal.edu.co', tone: '#a98bff', icon: 'globe', start: 9.6 },
]
// posición del botón (−1 apagado … +1 tope) a lo largo del intento: sube, rebota y se apaga
const KNOB_KEYS = [
  [0, -1],
  [1.05, -1],
  [1.5, 0.92],
  [1.68, 0.45],
  [1.86, 0.8],
  [2.04, 0.5],
  [2.55, -1],
]
const CROWD = 10

/* ---------------- enlaces y Moodle ---------------- */
const LINK_A = { x: -5.4, y: 5.0, w: 4.6, h: 1.7 }
const LINK_B = { x: -5.4, y: 2.6, w: 4.6, h: 1.7 }
const MOODLE = { x: 3.4, y: 3.6, w: 8.2, h: 5.4 }
const SLOT = { x: 3.4, y: 3.48 }
const CHIP = { w: 4.4, h: 0.8 }

/* ---------------- cámara: foco horizontal en pantallas estrechas ---------------- */
const FOCUS_KEYS = [
  [0, -2.4],
  [2.9, -2.4],
  [3.7, 0.2],
  [5.6, 1.6],
  [9.5, 1.2],
  [12.6, 1.2],
  [13.5, 1.0],
  [16, 1.0],
]

/** Interpolación por tramos con easeInOutCubic entre claves [t, valor]. */
function track(T, keys) {
  const first = keys[0]
  const last = keys[keys.length - 1]
  if (T <= first[0]) return first[1]
  if (T >= last[0]) return last[1]
  for (let i = 0; i < keys.length - 1; i += 1) {
    const a = keys[i]
    const b = keys[i + 1]
    if (T <= b[0]) return lerp(a[1], b[1], easeInOutCubic((T - a[0]) / (b[0] - a[0])))
  }
  return last[1]
}

/* ================================================================== */
/* Texturas                                                            */
/* ================================================================== */

function panelBase(ctx, w, h, title, badge) {
  clipRound(ctx, w, h, 16)
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#fffaf0')
  g.addColorStop(1, '#efe6cc')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  fitText(ctx, title, 18, 40, { weight: 800, size: 26, color: '#042361', maxWidth: w - 90 })
  if (badge) {
    ctx.fillStyle = 'rgba(69,116,185,0.16)'
    roundRectPath(ctx, w - 52, 17, 36, 28, 14)
    ctx.fill()
    fitText(ctx, badge, w - 34, 38, { weight: 800, size: 20, color: '#2a4f93', align: 'center', maxWidth: 30 })
  }
  ctx.fillStyle = 'rgba(4,35,97,0.12)'
  ctx.fillRect(14, 54, w - 28, 2)
}

function drawSourcesPanel(ctx, w, h) {
  ctx.save()
  panelBase(ctx, w, h, 'Fuentes', '5')
  SOURCE_ROWS.forEach((row, i) => {
    const y = 70 + i * 78
    ctx.fillStyle = '#ffffff'
    roundRectPath(ctx, 12, y, w - 24, 66, 12)
    ctx.fill()
    ctx.strokeStyle = 'rgba(4,35,97,0.1)'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = row.tone
    roundRectPath(ctx, 12, y, 9, 66, 4)
    ctx.fill()
    fitText(ctx, row.name, 32, y + 28, { weight: 700, size: 22, color: '#042361', maxWidth: w - 90 })
    ctx.fillStyle = 'rgba(46,70,128,0.4)'
    roundRectPath(ctx, 32, y + 40, w - 112, 7, 3.5)
    ctx.fill()
    roundRectPath(ctx, 32, y + 52, (w - 112) * 0.55, 7, 3.5)
    ctx.fill()
    ctx.fillStyle = GREEN
    ctx.beginPath()
    ctx.arc(w - 34, y + 33, 11, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(w - 39, y + 33)
    ctx.lineTo(w - 35, y + 38)
    ctx.lineTo(w - 28, y + 28)
    ctx.stroke()
  })
  ctx.restore()
}

function drawChatPanel(ctx, w, h) {
  ctx.save()
  panelBase(ctx, w, h, 'Chat', null)
  // pregunta del estudiante
  ctx.fillStyle = '#4574b9'
  roundRectPath(ctx, w - 266, 70, 250, 56, 16)
  ctx.fill()
  fitText(ctx, '¿Quién paga un impuesto?', w - 141, 106, { weight: 700, size: 22, color: '#ffffff', align: 'center', maxWidth: 226 })
  // respuesta con citas
  ctx.fillStyle = '#e6eefb'
  roundRectPath(ctx, 16, 146, 336, 222, 16)
  ctx.fill()
  ctx.strokeStyle = '#b9cdee'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fillStyle = 'rgba(46,70,128,0.5)'
  ;[178, 200, 222].forEach((y, i) => {
    roundRectPath(ctx, 34, y, i === 2 ? 190 : 298, 9, 4.5)
    ctx.fill()
  })
  ctx.fillStyle = 'rgba(244,203,24,0.88)'
  roundRectPath(ctx, 28, 244, 310, 30, 8)
  ctx.fill()
  ctx.fillStyle = 'rgba(4,35,97,0.8)'
  roundRectPath(ctx, 34, 254, 270, 10, 5)
  ctx.fill()
  ctx.fillStyle = 'rgba(46,70,128,0.5)'
  ;[292, 314].forEach((y, i) => {
    roundRectPath(ctx, 34, y, i === 1 ? 160 : 298, 9, 4.5)
    ctx.fill()
  })
  ;[1, 2].forEach((n, i) => {
    ctx.fillStyle = GREEN
    roundRectPath(ctx, 34 + i * 58, 332, 48, 26, 13)
    ctx.fill()
    fitText(ctx, `[${n}]`, 58 + i * 58, 351, { weight: 800, size: 17, color: '#ffffff', align: 'center', maxWidth: 40 })
  })
  // caja de pregunta
  ctx.fillStyle = '#ffffff'
  roundRectPath(ctx, 16, h - 66, w - 32, 46, 23)
  ctx.fill()
  ctx.strokeStyle = 'rgba(4,35,97,0.16)'
  ctx.stroke()
  fitText(ctx, 'Pregunta sobre las fuentes…', 36, h - 36, { weight: 500, size: 17, family: FONT_BODY, color: 'rgba(4,35,97,0.45)', maxWidth: w - 110 })
  ctx.fillStyle = '#4574b9'
  ctx.beginPath()
  ctx.arc(w - 40, h - 43, 15, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function tileGlyph(ctx, kind, cx, cy, tone) {
  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  if (kind === 'report') {
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = tone
    ctx.lineWidth = 3
    roundRectPath(ctx, cx - 18, cy - 22, 36, 44, 5)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = tone
    roundRectPath(ctx, cx - 11, cy - 14, 18, 5, 2.5)
    ctx.fill()
    ctx.fillStyle = 'rgba(46,70,128,0.45)'
    for (let i = 0; i < 3; i += 1) {
      roundRectPath(ctx, cx - 11, cy - 3 + i * 9, i === 2 ? 14 : 22, 4, 2)
      ctx.fill()
    }
  } else if (kind === 'mind') {
    const sats = [
      [-22, -14],
      [22, -14],
      [-20, 16],
      [22, 16],
    ]
    ctx.strokeStyle = tone
    ctx.lineWidth = 3
    sats.forEach(([x, y]) => {
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + x, cy + y)
      ctx.stroke()
    })
    ctx.fillStyle = '#ffffff'
    sats.forEach(([x, y]) => {
      ctx.beginPath()
      ctx.arc(cx + x, cy + y, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    })
    ctx.fillStyle = tone
    ctx.beginPath()
    ctx.arc(cx, cy, 11, 0, Math.PI * 2)
    ctx.fill()
  } else if (kind === 'cards') {
    ctx.strokeStyle = '#8a6d00'
    ctx.lineWidth = 3
    ;[
      { r: -0.18, dx: -7, fill: '#ffe9a0' },
      { r: 0.12, dx: 7, fill: '#ffffff' },
    ].forEach((card) => {
      ctx.save()
      ctx.translate(cx + card.dx, cy)
      ctx.rotate(card.r)
      ctx.fillStyle = card.fill
      roundRectPath(ctx, -17, -22, 34, 44, 5)
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    })
  } else if (kind === 'quiz') {
    for (let i = 0; i < 3; i += 1) {
      const y = cy - 18 + i * 18
      ctx.strokeStyle = '#14633f'
      ctx.lineWidth = 3
      ctx.fillStyle = i === 0 ? '#14633f' : '#ffffff'
      ctx.beginPath()
      ctx.arc(cx - 16, y, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = 'rgba(46,70,128,0.5)'
      roundRectPath(ctx, cx - 5, y - 3, 28, 6, 3)
      ctx.fill()
    }
  } else if (kind === 'audio') {
    ctx.fillStyle = '#d4573c'
    ;[12, 24, 38, 26, 44, 28, 16].forEach((hh, i) => {
      roundRectPath(ctx, cx - 31 + i * 10, cy - hh / 2, 6, hh, 3)
      ctx.fill()
    })
  } else if (kind === 'video') {
    ctx.fillStyle = '#0a2663'
    ctx.strokeStyle = '#1b8fc0'
    ctx.lineWidth = 3
    roundRectPath(ctx, cx - 30, cy - 21, 60, 42, 7)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#44d3fe'
    ctx.beginPath()
    ctx.moveTo(cx - 6, cy - 11)
    ctx.lineTo(cx + 13, cy)
    ctx.lineTo(cx - 6, cy + 11)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
}

function drawOutputsPanel(ctx, w, h) {
  ctx.save()
  panelBase(ctx, w, h, 'Salidas', '6')
  TILES.forEach((tile, i) => {
    const x = 12 + (i % 2) * 112
    const y = 68 + Math.floor(i / 2) * 132
    ctx.save()
    roundRectPath(ctx, x, y, 104, 120, 12)
    ctx.clip()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x, y, 104, 120)
    ctx.fillStyle = tile.tone
    ctx.fillRect(x, y, 104, 16)
    ctx.restore()
    ctx.strokeStyle = 'rgba(4,35,97,0.1)'
    ctx.lineWidth = 2
    roundRectPath(ctx, x, y, 104, 120, 12)
    ctx.stroke()
    tileGlyph(ctx, tile.kind, x + 52, y + 62, tile.tone)
    fitText(ctx, tile.name, x + 52, y + 108, { weight: 700, size: 16, color: '#042361', align: 'center', maxWidth: 94 })
  })
  ctx.restore()
}

function drawHeader(ctx, w, h, role) {
  ctx.save()
  clipRound(ctx, w, h, 14)
  const g = ctx.createLinearGradient(0, 0, w, 0)
  g.addColorStop(0, '#12388a')
  g.addColorStop(1, '#1d56b0')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  // cuaderno
  ctx.fillStyle = '#f6f0dc'
  roundRectPath(ctx, 18, 15, 32, 44, 5)
  ctx.fill()
  ctx.fillStyle = '#f4cb18'
  ctx.fillRect(18, 15, 8, 44)
  fitText(ctx, 'Cuaderno · Incidencia de los impuestos', 66, 48, { weight: 800, size: 28, color: '#ffffff', maxWidth: 560 })
  // rol
  const teacher = role === 'teacher'
  ctx.fillStyle = teacher ? '#f4cb18' : '#44d3fe'
  ctx.beginPath()
  ctx.arc(w - 232, h / 2, 21, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, teacher ? 'P' : 'E', w - 232, h / 2 + 10, { weight: 800, size: 28, color: '#042361', align: 'center', maxWidth: 28 })
  fitText(ctx, teacher ? 'Profesor' : 'Estudiante', w - 198, h / 2 + 8, { weight: 500, size: 25, family: FONT_MONO, color: '#dfeaff', maxWidth: 180 })
  ctx.restore()
}

function drawCover(ctx, w, h, locked) {
  ctx.save()
  clipRound(ctx, w, h, 14)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#0b1c45')
  g.addColorStop(1, '#040d24')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  // brillo diagonal del cristal apagado
  ctx.fillStyle = 'rgba(255,255,255,0.045)'
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(w * 0.46, 0)
  ctx.lineTo(w * 0.12, h)
  ctx.lineTo(0, h)
  ctx.closePath()
  ctx.fill()
  if (locked) {
    const cx = w / 2
    const cy = h / 2 - 22
    ctx.strokeStyle = '#2b4580'
    ctx.lineWidth = 12
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(cx, cy - 22, 36, Math.PI, 0)
    ctx.lineTo(cx + 36, cy - 6)
    ctx.moveTo(cx - 36, cy - 22)
    ctx.lineTo(cx - 36, cy - 6)
    ctx.stroke()
    ctx.fillStyle = '#243b72'
    roundRectPath(ctx, cx - 56, cy - 8, 112, 84, 16)
    ctx.fill()
    ctx.fillStyle = '#0b1c45'
    ctx.beginPath()
    ctx.arc(cx, cy + 28, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(cx - 4, cy + 28, 8, 24)
    fitText(ctx, 'SIN ACCESO', cx, cy + 128, { weight: 500, size: 28, family: FONT_MONO, color: '#344f8a', align: 'center', maxWidth: 360 })
  }
  ctx.restore()
}

function drawPill(ctx, w, h, text, tone) {
  ctx.fillStyle = 'rgba(4,35,97,0.92)'
  roundRectPath(ctx, 3, 3, w - 6, h - 6, (h - 6) / 2)
  ctx.fill()
  ctx.strokeStyle = tone
  ctx.lineWidth = 4
  ctx.stroke()
  ctx.fillStyle = tone
  ctx.beginPath()
  ctx.arc(h * 0.5, h / 2, h * 0.17, 0, Math.PI * 2)
  ctx.fill()
  fitText(ctx, text, h * 0.88, h * 0.66, { weight: 800, size: h * 0.46, color: '#ffffff', maxWidth: w - h * 1.1 })
}

function drawShareButton(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#ffe27a')
  g.addColorStop(1, '#f2b90f')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  // icono de compartir: tres nodos unidos
  const nodes = [
    [h * 0.7, h * 0.5],
    [h * 1.02, h * 0.3],
    [h * 1.02, h * 0.7],
  ]
  ctx.strokeStyle = '#042361'
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(nodes[1][0], nodes[1][1])
  ctx.lineTo(nodes[0][0], nodes[0][1])
  ctx.lineTo(nodes[2][0], nodes[2][1])
  ctx.stroke()
  ctx.fillStyle = '#042361'
  nodes.forEach(([x, y]) => {
    ctx.beginPath()
    ctx.arc(x, y, h * 0.1, 0, Math.PI * 2)
    ctx.fill()
  })
  fitText(ctx, 'Compartir', h * 1.3 + (w - h * 1.3) / 2, h * 0.64, { weight: 800, size: h * 0.36, color: '#042361', align: 'center', maxWidth: w - h * 1.45 })
}

function drawSwitchIcon(ctx, kind, cx, cy, tone) {
  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.fillStyle = tone
  ctx.beginPath()
  ctx.arc(cx, cy, 34, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#042361'
  ctx.lineWidth = 5
  if (kind === 'chat') {
    ctx.fillStyle = '#ffffff'
    roundRectPath(ctx, cx - 19, cy - 16, 38, 28, 9)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx - 7, cy + 12)
    ctx.lineTo(cx - 12, cy + 22)
    ctx.lineTo(cx + 2, cy + 12)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
  } else {
    ctx.beginPath()
    ctx.arc(cx, cy, 20, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(cx, cy, 9, 20, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx - 20, cy)
    ctx.lineTo(cx + 20, cy)
    ctx.stroke()
  }
  ctx.restore()
}

function drawSwitchCard(ctx, w, h, spec) {
  ctx.save()
  clipRound(ctx, w, h, 36)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#fffaf0')
  g.addColorStop(1, '#ece2c6')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = spec.tone
  ctx.fillRect(0, 0, w, 16)
  drawSwitchIcon(ctx, spec.icon, 62, 88, spec.tone)
  fitText(ctx, spec.label, 112, 92, { weight: 800, size: 38, color: '#042361', maxWidth: w - 134 })
  fitText(ctx, spec.sub, 112, 130, { weight: 500, size: 22, family: FONT_MONO, color: 'rgba(4,35,97,0.6)', maxWidth: w - 134 })
  fitText(ctx, 'OFF', 62, 236, { weight: 700, size: 24, family: FONT_MONO, color: 'rgba(4,35,97,0.5)', align: 'center', maxWidth: 80 })
  fitText(ctx, 'ON', w - 62, 236, { weight: 700, size: 24, family: FONT_MONO, color: 'rgba(4,35,97,0.5)', align: 'center', maxWidth: 80 })
  ctx.restore()
}

function drawStamp(ctx, w, h) {
  ctx.fillStyle = 'rgba(255,255,255,0.94)'
  roundRectPath(ctx, 5, 5, w - 10, h - 10, 18)
  ctx.fill()
  ctx.strokeStyle = RED
  ctx.lineWidth = 8
  ctx.stroke()
  fitText(ctx, 'NO EXISTE', w / 2, h * 0.67, { weight: 800, size: h * 0.46, color: RED, align: 'center', maxWidth: w - 40 })
}

function drawMark(ctx, w, h, kind) {
  const c = w / 2
  ctx.fillStyle = kind === 'ok' ? GREEN : RED
  ctx.beginPath()
  ctx.arc(c, c, c - 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = w * 0.1
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  if (kind === 'ok') {
    ctx.moveTo(w * 0.28, h * 0.53)
    ctx.lineTo(w * 0.44, h * 0.68)
    ctx.lineTo(w * 0.73, h * 0.34)
  } else {
    ctx.moveTo(w * 0.3, h * 0.3)
    ctx.lineTo(w * 0.7, h * 0.7)
    ctx.moveTo(w * 0.7, h * 0.3)
    ctx.lineTo(w * 0.3, h * 0.7)
  }
  ctx.stroke()
}

function drawPerson(ctx, w, h) {
  const c = w / 2
  const g = ctx.createRadialGradient(c * 0.8, c * 0.7, 4, c, c, c)
  g.addColorStop(0, '#d9c8ff')
  g.addColorStop(1, '#7a58d6')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(c, c, c - 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.lineWidth = 4
  ctx.stroke()
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(c, h * 0.37, h * 0.13, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(c, h * 0.82, h * 0.26, Math.PI, 0)
  ctx.closePath()
  ctx.fill()
}

function drawChain(ctx, cx, cy) {
  ctx.save()
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#042361'
  ;[-1, 1].forEach((side) => {
    ctx.save()
    ctx.translate(cx + side * 10, cy)
    ctx.rotate(-Math.PI / 4)
    roundRectPath(ctx, -17, -9, 34, 18, 9)
    ctx.stroke()
    ctx.restore()
  })
  ctx.restore()
}

function drawLinkCard(ctx, w, h, spec) {
  ctx.save()
  clipRound(ctx, w, h, 30)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#fffaf0')
  g.addColorStop(1, '#ece2c6')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = spec.tone
  ctx.fillRect(0, 0, 18, h)
  ctx.fillStyle = spec.tone
  ctx.beginPath()
  ctx.arc(94, h / 2, 42, 0, Math.PI * 2)
  ctx.fill()
  if (spec.icon === 'chain') {
    drawChain(ctx, 94, h / 2)
  } else {
    drawSwitchIcon(ctx, 'chat', 94, h / 2, spec.tone)
  }
  fitText(ctx, spec.label, 160, h / 2 - 6, { weight: 800, size: 40, color: '#042361', maxWidth: w - 190 })
  fitText(ctx, spec.sub, 160, h / 2 + 38, { weight: 500, size: 25, family: FONT_MONO, color: 'rgba(4,35,97,0.6)', maxWidth: w - 190 })
  ctx.restore()
}

function drawChip(ctx, w, h) {
  ctx.save()
  clipRound(ctx, w, h, h / 2)
  const g = ctx.createLinearGradient(0, 0, w, 0)
  g.addColorStop(0, '#ffe27a')
  g.addColorStop(1, '#f2b90f')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  drawChain(ctx, h * 0.62, h / 2)
  fitText(ctx, 'Vista de conversación', h * 1.05, h * 0.66, { weight: 800, size: h * 0.46, color: '#042361', maxWidth: w - h * 1.3 })
  ctx.restore()
}

function drawMoodle(ctx, w, h) {
  ctx.save()
  clipRound(ctx, w, h, 26)
  ctx.fillStyle = '#f4f6fa'
  ctx.fillRect(0, 0, w, h)
  // barra superior
  ctx.fillStyle = '#f98012'
  ctx.fillRect(0, 0, w, 74)
  fitText(ctx, 'moodle', 34, 52, { weight: 800, size: 40, color: '#ffffff', maxWidth: 200 })
  fitText(ctx, 'Mis cursos', 260, 48, { weight: 500, size: 24, family: FONT_BODY, color: 'rgba(255,255,255,0.88)', maxWidth: 160 })
  ctx.fillStyle = 'rgba(255,255,255,0.28)'
  ctx.beginPath()
  ctx.arc(w - 46, 37, 20, 0, Math.PI * 2)
  ctx.fill()
  // título del curso
  fitText(ctx, 'Economía · Grupo 1', 40, 128, { weight: 800, size: 38, color: '#042361', maxWidth: w - 80 })
  fitText(ctx, 'TUTOR DEL CURSO', 40, 172, { weight: 500, size: 22, family: FONT_MONO, color: '#f98012', maxWidth: 360 })
  ctx.fillStyle = 'rgba(4,35,97,0.12)'
  ctx.fillRect(40, 188, w - 80, 2)
  // hueco para el enlace
  ctx.setLineDash([16, 10])
  ctx.strokeStyle = 'rgba(249,128,18,0.7)'
  ctx.lineWidth = 4
  roundRectPath(ctx, 56, 232, w - 112, 100, 22)
  ctx.stroke()
  ctx.setLineDash([])
  fitText(ctx, 'Pegue aquí el enlace', w / 2, 290, { weight: 500, size: 26, family: FONT_MONO, color: 'rgba(4,35,97,0.4)', align: 'center', maxWidth: 420 })
  // instrucciones de uso (tres líneas)
  fitText(ctx, 'Cómo usarlo', 40, 392, { weight: 800, size: 26, color: '#042361', maxWidth: 300 })
  ctx.fillStyle = 'rgba(46,70,128,0.4)'
  ;[418, 446, 474].forEach((y, i) => {
    roundRectPath(ctx, 56, y, i === 2 ? 300 : w - 200, 10, 5)
    ctx.fill()
  })
  ctx.restore()
}

/* ================================================================== */

export default function createPractica5Scene({ canvas, width, height, invalidate }) {
  const DUR = PRACTICA5_DURATION
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: DUR,
    frame: { wideHalfW: 8.6, narrowHalfW: 6.4, halfH: 4.5, camY: 5.0, lookY: 3.45 },
  })
  const { scene, glow } = stage

  const bursts = createBurstSystem({ glow, maxBursts: 14, perBurst: 18, seed: 55 })
  scene.add(bursts.points)
  const cGreen = new THREE.Color(0x3be09a)
  const cCyan = new THREE.Color(0x7fdcff)
  const cGold = new THREE.Color(0xf4cb18)
  const cRed = new THREE.Color(0xff5a4d)
  const cViolet = new THREE.Color(0xa98bff)

  const markOk = makeTex(128, 128, (ctx, w, h) => drawMark(ctx, w, h, 'ok'), invalidate)
  const markBad = makeTex(128, 128, (ctx, w, h) => drawMark(ctx, w, h, 'bad'), invalidate)
  const makeSprite = (map, parent) => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false }))
    sprite.scale.setScalar(0.0001)
    parent.add(sprite)
    return sprite
  }

  /* ---------------- texturas compartidas de las pantallas ---------------- */
  const pw = (units) => Math.round(units * PX)
  const tex = {
    sources: makeTex(pw(PANELS[0].w), pw(PANEL_H), drawSourcesPanel, invalidate),
    chat: makeTex(pw(PANELS[1].w), pw(PANEL_H), drawChatPanel, invalidate),
    outputs: makeTex(pw(PANELS[2].w), pw(PANEL_H), drawOutputsPanel, invalidate),
  }

  /* ---------------- pantallas (profe y estudiante) ---------------- */
  const monitors = new THREE.Group()
  scene.add(monitors)

  const standMat = new THREE.MeshStandardMaterial({ color: 0x2a3f6e, metalness: 0.6, roughness: 0.35 })

  const makeMonitor = (role, x) => {
    const teacher = role === 'teacher'
    const group = new THREE.Group()
    group.position.set(x, MON.y, 0)
    monitors.add(group)

    const bezel = makeSlabCard({
      w: MON.w,
      h: MON.h,
      depth: MON.depth,
      radius: 0.3,
      bevel: 0.04,
      edge: '#1a2f5e',
      faceColor: '#0d2250',
      roughness: 0.4,
      metalness: 0.45,
      emissive: teacher ? '#f4cb18' : '#44d3fe',
    })
    group.add(bezel.group)
    const zf = bezel.thickness / 2

    // cuello y base
    const neckH = MON.y - MON.h / 2
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, neckH, 20), standMat)
    neck.position.set(0, -MON.h / 2 - neckH / 2 + 0.02, -0.05)
    neck.castShadow = true
    group.add(neck)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.2, 0.14, 40), standMat)
    foot.position.set(0, -MON.y + 0.07, 0.05)
    foot.castShadow = true
    foot.receiveShadow = true
    group.add(foot)

    // fondo de pantalla
    const back = new THREE.Mesh(
      new THREE.PlaneGeometry(SCREEN.w, SCREEN.h),
      new THREE.MeshBasicMaterial({ color: 0x0a1a40, toneMapped: false }),
    )
    back.position.z = zf + 0.01
    group.add(back)

    const flat = (w, h, map, z, order) => {
      const mesh = makeTextPlane(w, h, map)
      mesh.position.z = z
      mesh.renderOrder = order
      group.add(mesh)
      return mesh
    }

    const panels = PANELS.map((spec) => {
      const mesh = flat(spec.w, PANEL_H, tex[spec.key], zf + 0.03, 3)
      mesh.position.x = spec.x
      mesh.position.y = PANEL_Y
      mesh.material.opacity = 0
      mesh.visible = false
      return { mesh, key: spec.key }
    })

    const header = flat(
      SCREEN.w,
      HEAD.h,
      makeTex(pw(SCREEN.w), pw(HEAD.h), (ctx, w, h) => drawHeader(ctx, w, h, role), invalidate),
      zf + 0.03,
      3,
    )
    header.position.y = HEAD.y
    header.material.opacity = 0
    header.visible = false

    const cover = flat(
      SCREEN.w,
      SCREEN.h,
      makeTex(pw(SCREEN.w), pw(SCREEN.h), (ctx, w, h) => drawCover(ctx, w, h, !teacher), invalidate),
      zf + 0.02,
      2,
    )

    // piloto de encendido
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 10), new THREE.MeshBasicMaterial({ color: 0xff5a4d, toneMapped: false }))
    led.position.set(0, -MON.h / 2 + 0.13, zf + 0.03)
    group.add(led)
    const ledGlow = addGlow(group, glow, 0xff5a4d, 0.7, 0.6)
    ledGlow.position.copy(led.position)
    ledGlow.position.z += 0.05

    const halo = addGlow(group, glow, teacher ? 0xf4cb18 : 0x44d3fe, 13, 0)
    halo.position.z = -0.9

    group.scale.setScalar(0.0001)
    return { group, bezel, panels, header, cover, led, ledGlow, halo }
  }

  const teacher = makeMonitor('teacher', -MON.x)
  const student = makeMonitor('student', MON.x)

  // rótulos flotantes
  const makeLabel = (text, tone, w, x) => {
    const mesh = makeTextPlane(w, 0.76, makeTex(Math.round(w * 100), 76, (ctx, cw, ch) => drawPill(ctx, cw, ch, text, tone), invalidate))
    mesh.position.set(x, 6.78, 0.4)
    mesh.scale.setScalar(0.0001)
    monitors.add(mesh)
    return mesh
  }
  const labelTeacher = makeLabel('Pantalla del profe', '#f4cb18', 3.6, -MON.x)
  const labelStudent = makeLabel('Pantalla del estudiante', '#44d3fe', 4.5, MON.x)

  // botón Compartir
  const share = makeSlabCard({
    w: 2.6,
    h: 0.9,
    depth: 0.14,
    radius: 0.45,
    bevel: 0.035,
    edge: '#d9a40a',
    texture: makeTex(520, 180, drawShareButton, invalidate),
    roughness: 0.45,
    emissive: '#f4cb18',
  })
  share.group.position.set(0, 3.95, 0.7)
  share.group.scale.setScalar(0.0001)
  scene.add(share.group)
  const shareGlow = addGlow(share.group, glow, 0xf4cb18, 5, 0)
  shareGlow.position.z = -0.3
  const shareRing = makeShockRing(0xffe27a)
  shareRing.position.set(0, 3.95, 0.9)
  scene.add(shareRing)

  // cursor
  const cursor = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: makeCursorTexture(), transparent: true, depthWrite: false, depthTest: false }),
  )
  cursor.renderOrder = 20
  cursor.scale.setScalar(0.0001)
  scene.add(cursor)
  const setCursor = (x, y, z, opacity, press = 0) => {
    const size = 1.0 * (1 - press * 0.12)
    cursor.position.set(x + 0.31, y - 0.41, z)
    cursor.material.opacity = opacity
    cursor.scale.setScalar(safeScale(opacity > 0.003 ? size : 0))
  }

  // copias de los paneles que viajan del profe al estudiante
  const ghosts = PANELS.map((spec, i) => {
    const group = new THREE.Group()
    const mesh = makeTextPlane(spec.w, PANEL_H, tex[spec.key])
    mesh.material.opacity = 0
    mesh.renderOrder = 8
    group.add(mesh)
    const trail = addGlow(group, glow, [0x7fdcff, 0xf4cb18, 0x3be09a][i], 4.2, 0)
    trail.position.z = -0.2
    group.visible = false
    scene.add(group)
    return { group, mesh, trail, spec }
  })
  const bz = new THREE.Vector3()
  const bezier = (a, c, b, k, out) => {
    const m = 1 - k
    out.x = m * m * a.x + 2 * m * k * c.x + k * k * b.x
    out.y = m * m * a.y + 2 * m * k * c.y + k * k * b.y
    out.z = m * m * a.z + 2 * m * k * c.z + k * k * b.z
  }
  const gA = new THREE.Vector3()
  const gB = new THREE.Vector3()
  const gC = new THREE.Vector3()

  /* ---------------- interruptores ---------------- */
  const switches = SWITCHES.map((spec) => {
    const group = new THREE.Group()
    group.position.set(SW.x, SW.y, SW.z)
    group.scale.setScalar(0.0001)
    group.visible = false
    scene.add(group)

    const card = makeSlabCard({
      w: SW.w,
      h: SW.h,
      depth: 0.14,
      radius: 0.32,
      bevel: 0.035,
      edge: '#d8cda9',
      texture: makeTex(Math.round(SW.w * PX), Math.round(SW.h * PX), (ctx, w, h) => drawSwitchCard(ctx, w, h, spec), invalidate),
      roughness: 0.6,
      emissive: spec.tone,
    })
    group.add(card.group)
    const cz = card.thickness / 2

    const rail = makeSlabCard({
      w: 1.3,
      h: 0.56,
      depth: 0.08,
      radius: 0.28,
      bevel: 0.03,
      edge: '#6d7a99',
      faceColor: '#9aa8c4',
      roughness: 0.5,
      emissive: '#3be09a',
      inset: 0.02,
    })
    rail.group.position.set(0, -0.55, cz + 0.07)
    group.add(rail.group)
    const offColor = new THREE.Color('#9aa8c4')
    const onColor = new THREE.Color('#2fc489')

    const knob = new THREE.Mesh(
      new THREE.SphereGeometry(0.23, 28, 18),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1, emissive: 0xffffff, emissiveIntensity: 0.05 }),
    )
    knob.position.set(-KNOB_RANGE, -0.55, cz + 0.07 + 0.19)
    knob.castShadow = true
    group.add(knob)

    // tope rojo en el extremo ON
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.74, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xd23a31, roughness: 0.4, emissive: 0xff5a4d, emissiveIntensity: 0.2 }),
    )
    wall.position.set(0.74, -0.55, cz + 0.12)
    group.add(wall)
    const wallGlow = addGlow(group, glow, 0xff5a4d, 1.8, 0)
    wallGlow.position.set(0.74, -0.55, cz + 0.3)

    const bad = makeSprite(markBad, group)
    bad.position.set(SW.w / 2 - 0.15, SW.h / 2 - 0.15, cz + 0.3)

    const stamp = makeTextPlane(2.2, 0.66, makeTex(440, 132, drawStamp, invalidate))
    stamp.position.set(0.05, -SW.h / 2 - 0.55, 0.4)
    stamp.rotation.z = -0.09
    stamp.scale.setScalar(0.0001)
    stamp.renderOrder = 10
    group.add(stamp)

    const ring = makeShockRing(new THREE.Color(spec.tone))
    ring.position.set(0, 0, cz + 0.2)
    group.add(ring)

    const halo = addGlow(group, glow, new THREE.Color(spec.tone), 7, 0)
    halo.position.z = -0.5

    return { spec, group, card, rail, knob, wall, wallGlow, bad, stamp, ring, halo, offColor, onColor }
  })

  // multitud “todo el dominio”
  const personMap = makeTex(96, 96, drawPerson, invalidate)
  const crowd = Array.from({ length: CROWD }, (_, i) => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: personMap, transparent: true, depthWrite: false }))
    sprite.scale.setScalar(0.0001)
    sprite.renderOrder = 6
    scene.add(sprite)
    const a = (i / CROWD) * Math.PI * 2 + 0.3
    return { sprite, a, rx: 6.9 + (i % 2) * 0.5, ry: 3.1 + (i % 3) * 0.2 }
  })

  /* ---------------- enlaces y Moodle ---------------- */
  const rootLinks = new THREE.Group()
  rootLinks.visible = false
  scene.add(rootLinks)

  const makeLink = (spec, pos) => {
    const card = makeSlabCard({
      w: pos.w,
      h: pos.h,
      depth: 0.12,
      radius: 0.3,
      bevel: 0.035,
      edge: '#d8cda9',
      texture: makeTex(Math.round(pos.w * 130), Math.round(pos.h * 130), (ctx, w, h) => drawLinkCard(ctx, w, h, spec), invalidate),
      roughness: 0.62,
      emissive: spec.tone,
    })
    card.group.position.set(pos.x, pos.y, 0.3)
    card.group.scale.setScalar(0.0001)
    rootLinks.add(card.group)
    const halo = addGlow(rootLinks, glow, new THREE.Color(spec.tone), 8, 0)
    halo.position.set(pos.x, pos.y, -0.4)
    return { card, halo }
  }
  const linkA = makeLink({ label: 'Copiar enlace', sub: 'Abre el cuaderno completo', tone: '#44d3fe', icon: 'chain' }, LINK_A)
  const linkB = makeLink({ label: 'Vista de conversación', sub: 'Abre directo en el chat', tone: '#f4cb18', icon: 'chat' }, LINK_B)

  const moodle = makeSlabCard({
    w: MOODLE.w,
    h: MOODLE.h,
    depth: 0.12,
    radius: 0.34,
    bevel: 0.04,
    edge: '#c9bfa0',
    texture: makeTex(Math.round(MOODLE.w * 100), Math.round(MOODLE.h * 100), drawMoodle, invalidate),
    roughness: 0.65,
    emissive: '#f98012',
  })
  moodle.group.position.set(MOODLE.x, MOODLE.y, 0.1)
  moodle.group.scale.setScalar(0.0001)
  rootLinks.add(moodle.group)
  const moodleGlow = addGlow(rootLinks, glow, 0xf98012, 11, 0)
  moodleGlow.position.set(MOODLE.x, MOODLE.y, -0.6)

  const chip = makeSlabCard({
    w: CHIP.w,
    h: CHIP.h,
    depth: 0.1,
    radius: 0.4,
    bevel: 0.03,
    edge: '#d9a40a',
    texture: makeTex(Math.round(CHIP.w * 120), Math.round(CHIP.h * 120), drawChip, invalidate),
    roughness: 0.45,
    emissive: '#f4cb18',
  })
  chip.group.scale.setScalar(0.0001)
  rootLinks.add(chip.group)
  const chipGlow = addGlow(chip.group, glow, 0xffe27a, 6, 0)
  chipGlow.position.z = -0.3
  const slotRing = makeShockRing(0x3be09a)
  slotRing.position.set(SLOT.x, SLOT.y, 0.6)
  rootLinks.add(slotRing)
  const slotOk = makeSprite(markOk, rootLinks)
  slotOk.position.set(SLOT.x + CHIP.w / 2 + 0.05, SLOT.y + 0.35, 0.85)
  const slotGlow = addGlow(rootLinks, glow, 0x3be09a, 8, 0)
  slotGlow.position.set(SLOT.x, SLOT.y, 0.2)

  /* ---------------- utilidades de movimiento ---------------- */
  const setGroupScale = (group, s, pivotY) => {
    const k = safeScale(s)
    group.scale.setScalar(k)
    group.position.y = pivotY * (1 - k)
    group.visible = s > 0.004
  }

  const popPlane = (mesh, k, opacity = 1) => {
    mesh.visible = k > 0.003 && opacity > 0.003
    mesh.material.opacity = clamp01(k) * opacity
    mesh.scale.setScalar(safeScale(lerp(0.88, 1, easeOutCubic(k))))
  }

  function resize(w, h) {
    stage.resize(w, h)
  }

  // estado del interruptor activo en el instante T (0 si ninguno)
  const knobAt = (T, start) => track(T - start, KNOB_KEYS)

  function draw(t) {
    const T = t * DUR
    const fx = track(T, FOCUS_KEYS)
    stage.update(T, fx)
    stage.spot.position.set(fx, 4.6, 5.5)

    const events = []
    const burst = (t0, x, y, z, color, speed = 2.4, life = 0.9) => {
      if (T >= t0 && T <= t0 + life) events.push({ t: t0, x, y, z, color, speed, life })
    }

    /* ---------- 1 · dos pantallas ---------- */
    const rootOut = smooth(seg(T, 12.5, 13.05))
    setGroupScale(monitors, 1 - rootOut, MON.y)

    ;[
      [teacher, 0.2],
      [student, 0.5],
    ].forEach(([mon, at]) => {
      const k = easeOutBack(seg(T, at, at + 0.65))
      mon.group.scale.setScalar(safeScale(k))
      mon.group.position.y = MON.y * k
    })
    labelTeacher.scale.setScalar(safeScale(easeOutBack(seg(T, 0.85, 1.3))))
    labelStudent.scale.setScalar(safeScale(easeOutBack(seg(T, 1.1, 1.55))))

    // la pantalla del profe se enciende con todo
    teacher.cover.material.opacity = 1 - smooth(seg(T, 0.95, 1.3))
    teacher.cover.visible = teacher.cover.material.opacity > 0.003
    popPlane(teacher.header, seg(T, 1.1, 1.5))
    teacher.panels.forEach((panel, i) => popPlane(panel.mesh, seg(T, 1.3 + i * 0.28, 1.8 + i * 0.28)))
    teacher.led.material.color.set(0x3be09a)
    teacher.ledGlow.material.color.set(0x3be09a)
    teacher.halo.material.opacity = smooth(seg(T, 1.0, 1.8)) * 0.16
    burst(1.35, -MON.x, MON.y + 0.2, 0.9, cGold, 2.2, 0.9)

    /* ---------- 2 · compartir ---------- */
    const shareIn = easeOutBack(seg(T, 3.3, 3.8))
    const shareOut = smooth(seg(T, 5.9, 6.3))
    const clickPress = bump(seg(T, 4.0, 4.28))
    share.group.scale.setScalar(safeScale(shareIn * (1 - shareOut) * (1 - clickPress * 0.06)))
    share.group.position.z = 0.7 - clickPress * 0.12
    flashCard(share, clickPress * 0.6 + bump(seg(T, 3.5, 4.0)) * 0.1)
    shareGlow.material.opacity = (smooth(seg(T, 3.5, 3.9)) * 0.35 + clickPress * 0.5) * (1 - shareOut)
    setShockRing(shareRing, T - 4.1, 0.9, 2.4)

    // estudiante: rojo/apagado hasta que el profe comparte
    const power = smooth(seg(T, 4.3, 4.8))
    student.cover.material.opacity = 1 - power
    student.cover.visible = student.cover.material.opacity > 0.003
    student.led.material.color.set(0xff5a4d).lerp(cGreen, power)
    student.ledGlow.material.color.set(0xff5a4d).lerp(cGreen, power)
    student.ledGlow.material.opacity = T < 4.3 ? 0.35 + 0.3 * (0.5 + 0.5 * Math.sin(T * 3.2)) : 0.7
    student.halo.material.opacity = power * 0.2
    popPlane(student.header, seg(T, 4.5, 4.95))

    // copias que viajan por encima de las pantallas
    ghosts.forEach((ghost, i) => {
      const launch = 4.22 + i * 0.13
      const flight = seg(T, launch, launch + 0.95)
      const k = easeInOutCubic(flight)
      gA.set(-MON.x + ghost.spec.x, MON.y + PANEL_Y, 0.55)
      gB.set(MON.x + ghost.spec.x, MON.y + PANEL_Y, 0.55)
      gC.set(0, 9.3, 2.4)
      bezier(gA, gC, gB, k, bz)
      ghost.group.position.copy(bz)
      const pinch = Math.sin(k * Math.PI)
      ghost.group.scale.setScalar(safeScale(1 - 0.62 * pinch))
      ghost.group.rotation.z = pinch * 0.18 * (i - 1)
      ghost.group.visible = flight > 0 && flight < 1
      ghost.mesh.material.opacity = 1 - smooth(seg(flight, 0.88, 1))
      ghost.trail.material.opacity = pinch * 0.7
      const arrive = launch + 0.88
      burst(launch + 0.02, -MON.x + ghost.spec.x, MON.y + 0.6, 1.0, i === 1 ? cGold : i === 0 ? cCyan : cGreen, 1.8, 0.7)
      burst(arrive, MON.x + ghost.spec.x, MON.y + 0.2, 1.0, cGreen, 2.0, 0.8)
    })

    /* ---------- 3 y 4 · lo que no existe ---------- */
    let dimSources = 1
    let crowdOn = 0
    switches.forEach((sw, si) => {
      const local = T - SWITCHES[si].start
      const active = local > -0.001 && local < 3.2
      const pop = easeOutBack(seg(local, 0.1, 0.58)) * (1 - smooth(seg(local, 2.9, 3.2)))
      sw.group.visible = active && pop > 0.004
      sw.group.scale.setScalar(safeScale(pop))
      if (!active) return

      const knob = knobAt(T, sw.spec.start)
      const lean = clamp01((knob + 1) / 2) // 0 apagado, 1 tope
      const hit1 = bump(seg(local, 1.46, 1.7))
      const hit2 = bump(seg(local, 1.82, 2.04))
      const hits = Math.max(hit1, hit2 * 0.7)
      sw.knob.position.x = knob * KNOB_RANGE
      sw.knob.position.z = sw.card.thickness / 2 + 0.26 + hits * 0.02
      sw.rail.faceMat.color.copy(sw.offColor).lerp(sw.onColor, smooth(clamp01((lean - 0.3) / 0.6)))
      flashCard(sw.rail, lean * 0.18)
      sw.wall.material.emissiveIntensity = 0.2 + hits * 1.1
      sw.wallGlow.material.opacity = hits * 0.85
      sw.wall.scale.y = 1 + hits * 0.18
      sw.halo.material.opacity = pop * 0.3
      flashCard(sw.card, bump(seg(local, 0.1, 0.7)) * 0.2 + hits * 0.12)
      setShockRing(sw.ring, local - 1.5, 0.7, 2.2)

      // sacudida al chocar y al sellar
      const shake = settleWobble(local - 1.5, 38, 9) * 0.05 + settleWobble(local - 2.5, 34, 8) * 0.04
      sw.group.position.set(SW.x + shake, SW.y, SW.z)
      sw.group.rotation.z = shake * 0.4

      // cruz roja y sello: no existe
      sw.bad.scale.setScalar(safeScale(easeOutBack(seg(local, 2.35, 2.7)) * 0.62 * (1 - smooth(seg(local, 2.9, 3.2)))))
      const stampIn = easeOutBack(seg(local, 2.45, 2.85))
      sw.stamp.scale.setScalar(safeScale(stampIn * (1 - smooth(seg(local, 2.9, 3.2)))))
      burst(SWITCHES[si].start + 1.5, SW.x + 0.74, SW.y - 0.55, SW.z + 0.6, cRed, 1.8, 0.8)
      burst(SWITCHES[si].start + 1.86, SW.x + 0.74, SW.y - 0.55, SW.z + 0.6, cRed, 1.4, 0.7)
      burst(SWITCHES[si].start + 2.5, SW.x, SW.y - 1.5, SW.z + 0.6, cRed, 2.0, 0.9)

      if (si === 0) dimSources = 1 - 0.86 * smooth(clamp01((knob + 0.5) / 1.2))
      if (si === 1) crowdOn = smooth(clamp01((knob + 0.5) / 1.3))
    })

    // los paneles del estudiante aparecen al llegar; con “solo chat” perdería fuentes y salidas
    student.panels.forEach((panel, i) => {
      const arrive = 4.22 + i * 0.13 + 0.88
      popPlane(panel.mesh, seg(T, arrive, arrive + 0.45), panel.key === 'chat' ? 1 : dimSources)
    })

    // “todo el dominio”: aparece una multitud y rebota con el interruptor
    crowd.forEach((person, i) => {
      const k = crowdOn * (1 - 0.15 * ((i * 7) % 3) / 3)
      const wobble = Math.sin(T * 2.4 + i) * 0.08
      person.sprite.position.set(
        SW.x + Math.cos(person.a) * person.rx * crowdOn,
        SW.y + Math.sin(person.a) * person.ry * crowdOn + wobble,
        1.9,
      )
      person.sprite.scale.setScalar(safeScale(0.72 * k))
      person.sprite.material.opacity = Math.min(1, crowdOn * 1.4)
    })
    if (T >= 9.6 && T < 12.8) {
      burst(9.6 + 1.42, SW.x, SW.y, 2.0, cViolet, 3.4, 1.0)
    }

    /* ---------- cursor ---------- */
    if (T < 6.4) {
      const op = smooth(seg(T, 3.4, 3.65)) * (1 - smooth(seg(T, 4.45, 4.75)))
      setCursor(track(T, [[3.4, -2.8], [4.0, 0.12]]), track(T, [[3.4, 2.1], [4.0, 3.88]]), 1.6, op, clickPressAt(T, 4.0, 4.28))
    } else if (T < 12.8) {
      const si = T < 9.6 ? 0 : 1
      const local = T - SWITCHES[si].start
      const knob = Math.max(knobAt(T, SWITCHES[si].start), -1)
      const lead = local < 1.5 ? knob : 0.92
      const op = smooth(seg(local, 0.35, 0.6)) * (1 - smooth(seg(local, 1.55, 1.85)))
      const kx = track(local, [[0.35, -1.6 / KNOB_RANGE], [0.95, -1]])
      const ky = track(local, [[0.35, -1.3], [0.95, -0.6]])
      const onKnob = local >= 0.95
      const cx = onKnob ? SW.x + lead * KNOB_RANGE : SW.x + kx * KNOB_RANGE
      const cy = onKnob ? SW.y - 0.6 : SW.y + ky
      setCursor(cx, cy, SW.z + 0.9, op, clickPressAt(local, 0.95, 1.12))
    } else {
      setCursor(0, 0, 0, 0)
    }

    /* ---------- 5 · enlace a Moodle ---------- */
    rootLinks.visible = T > 12.9
    const aIn = easeOutBack(seg(T, 13.0, 13.55))
    const bIn = easeOutBack(seg(T, 13.25, 13.8))
    const mIn = easeOutBack(seg(T, 13.3, 13.95))
    linkA.card.group.scale.setScalar(safeScale(aIn))
    linkB.card.group.scale.setScalar(safeScale(bIn))
    moodle.group.scale.setScalar(safeScale(mIn))
    linkA.card.group.position.y = LINK_A.y + Math.sin(T * 1.2) * 0.05
    linkB.card.group.position.y = LINK_B.y + Math.sin(T * 1.2 + 1) * 0.05
    linkA.halo.material.opacity = smooth(seg(T, 13.2, 13.7)) * 0.2
    linkB.halo.material.opacity = smooth(seg(T, 13.4, 13.9)) * 0.22 + bump(seg(T, 14.05, 14.7)) * 0.3
    flashCard(linkB.card, bump(seg(T, 14.05, 14.6)) * 0.5)
    moodleGlow.material.opacity = smooth(seg(T, 13.5, 14.0)) * 0.18
    burst(13.45, LINK_A.x, LINK_A.y, 0.9, cCyan, 2.2, 0.8)
    burst(13.7, LINK_B.x, LINK_B.y, 0.9, cGold, 2.2, 0.8)

    // el enlace de la vista de conversación viaja hasta Moodle
    const fly = seg(T, 14.3, 15.15)
    const fk = easeInOutCubic(fly)
    gA.set(LINK_B.x + 0.4, LINK_B.y, 0.6)
    gB.set(SLOT.x, SLOT.y, 0.62)
    gC.set((gA.x + gB.x) / 2, 6.6, 2.0)
    bezier(gA, gC, gB, fk, bz)
    chip.group.position.copy(bz)
    const flyPinch = Math.sin(fk * Math.PI)
    chip.group.rotation.z = flyPinch * -0.12
    const landed = easeOutBack(seg(T, 15.1, 15.45))
    const chipScale = fly <= 0 ? 0 : (lerp(0.55, 1, fk) + flyPinch * 0.12 + (T > 15.1 ? (landed - 1) * 0.08 : 0)) * easeOutCubic(seg(fly, 0, 0.16))
    chip.group.scale.setScalar(safeScale(chipScale))
    chip.group.visible = fly > 0
    chipGlow.material.opacity = flyPinch * 0.6 + smooth(seg(T, 15.1, 15.4)) * 0.18
    setShockRing(slotRing, T - 15.1, 0.9, 3.0)
    slotGlow.material.opacity = smooth(seg(T, 15.1, 15.5)) * 0.4
    slotOk.scale.setScalar(safeScale(easeOutBack(seg(T, 15.3, 15.65)) * 0.62))
    flashCard(moodle, bump(seg(T, 15.1, 15.8)) * 0.14)
    burst(15.1, SLOT.x, SLOT.y, 1.0, cGreen, 2.8, 1.0)

    bursts.update(T, events)
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize, dispose }
}

/** Pulsación 0..1 entre a y b (sube y baja). */
function clickPressAt(T, a, b) {
  return bump(seg(T, a, b))
}
