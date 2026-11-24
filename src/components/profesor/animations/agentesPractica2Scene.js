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
} from './stageKit'

/**
 * Escena “App interactiva de clase” (Sesión 4, Práctica 2, Camino A: quiz en vivo con Claude).
 * Loop de 16 s en 5 fases de 3,2 s:
 *   0 los dos archivos entran por Drive (botón +, Subir o agregar archivos, Desde Drive) ·
 *   1 salen las 8 preguntas y se marca la del equilibrio (P = 30 y Q = 80) ·
 *   2 se construye el artefacto: la app en una ventana, con celular y proyector ·
 *   3 vista previa: correcta, explicación y fuente; puntaje solo al final ·
 *   4 se avanza con clics en Siguiente, no con Enter; sin responder cuenta como fallada; plan B.
 * `draw(t)` es una función pura del tiempo dentro del loop.
 */
export const AGENTES_PRACTICA2_DURATION = 16

const AMBER = 0xf4cb18
const CYAN = 0x7fdcff
const GREEN = 0x3be09a

const PY = 3.1
const PHASE = 3.2
const APP_TITLE = 'App interactiva de clase'
const FILES = [
  { code: 'S2-02', title: 'Lectura 1 Oferta, demanda y equilibrio' },
  { code: 'S2-04', title: 'Artículo Controles de precios' },
]
const EQ_TEXT = 'Equilibrio: P = 30 y Q = 80'

/* fase 0 */
const CHAT = { x: -1.6, y: PY, w: 6.8, h: 4.4 }
const PLUS = { u: 0.065, v: 0.89 }
const plusX = CHAT.x + (PLUS.u - 0.5) * CHAT.w
const plusY = CHAT.y + (0.5 - PLUS.v) * CHAT.h
const MENU = { x: -2.9, y: PY - 0.95, w: 3.9, h: 0.72 }
const SUBMENU = { x: 0.55, y: PY - 0.95, w: 2.6, h: 0.72 }
const DRIVE = { x: 4.4, y: PY + 0.9, w: 2.4, h: 1.5 }
const FILE = { w: 5.6, h: 0.95 }
const FILE_Y = [PY + 0.85, PY - 0.25]
const CLICKS0 = [0.9, 1.35, 1.75]

/* fase 1 */
const QCARD = { x: 0, y: PY, w: 7.4, h: 4.6 }
const ROW_W = 6.6
const ROW_H = 0.38
const ROW_Y = Array.from({ length: 8 }, (_, i) => PY + 1.25 - i * 0.44)
const EQ_ROW = 2
const EQ_AT = 4.9

/* fase 2 */
const BUILD = { x: 0, y: PY + 0.2, w: 5.6, h: 3.9 }
const BLOCKS = [
  { kind: 'question', x: 0, y: BUILD.y + 0.85, w: 4.8, h: 0.8, at: 7.0 },
  { kind: 'options', x: 0, y: BUILD.y - 0.25, w: 4.8, h: 1.1, at: 7.4 },
  { kind: 'next', x: 1.5, y: BUILD.y - 1.25, w: 1.6, h: 0.45, at: 7.8 },
]
const PHONE = { x: -4.7, y: PY, w: 1.5, h: 2.9 }
const PROJ = { x: 4.7, y: PY + 0.5, w: 2.5, h: 1.7 }

/* fase 3 */
const PREV = { x: -2.3, y: PY, w: 5.8, h: 4.2 }
const OPT_A = { u: 0.29, v: 0.56, w: 0.4, h: 0.15 }
const prevX = (u) => PREV.x + (u - 0.5) * PREV.w
const prevY = (v) => PREV.y + (0.5 - v) * PREV.h
const FEED = { x: 3.6, y: PY + 1.05, w: 3.8, h: 2.0 }
const SCORE = { x: 3.6, y: PY - 1.2, w: 3.8, h: 2.3 }
const ANSWER_AT = 10.3
const SCORE_AT = 11.4

/* fase 4 */
const NEXTW = { x: -2.6, y: PY + 0.35, w: 5.6, h: 3.8 }
const BTN_NEXT = { u: 0.78, v: 0.86, w: 0.3, h: 0.13 }
const nextX = NEXTW.x + (BTN_NEXT.u - 0.5) * NEXTW.w
const nextY = NEXTW.y + (0.5 - BTN_NEXT.v) * NEXTW.h
const DOT_Y = PY - 1.95
const dotX = (i) => NEXTW.x + (i - 3.5) * 0.5
const CLICKS4 = [13.5, 14.1]
const ENTER = { x: 1.3, y: PY + 0.9, w: 1.6, h: 1.0 }
const PLANB = { x: 4.0, y: PY + 0.4, w: 3.0, h: 3.4 }
const PLANB_AT = 14.5

const CURSOR_PATH = [
  [0.35, -3.2, PY - 2.9],
  [0.85, plusX, plusY],
  [0.95, plusX, plusY],
  [1.3, MENU.x + 0.2, MENU.y],
  [1.4, MENU.x + 0.2, MENU.y],
  [1.7, SUBMENU.x, SUBMENU.y],
  [1.8, SUBMENU.x, SUBMENU.y],
  [2.5, 2.4, PY - 2.4],
  [9.8, prevX(0.5), prevY(1.05)],
  [10.25, prevX(OPT_A.u), prevY(OPT_A.v)],
  [10.4, prevX(OPT_A.u), prevY(OPT_A.v)],
  [11.1, prevX(0.6), prevY(1.0)],
  [13.0, nextX - 1.4, nextY - 1.0],
  [13.45, nextX, nextY],
  [13.6, nextX, nextY],
  [13.85, nextX - 0.3, nextY - 0.25],
  [14.05, nextX, nextY],
  [14.2, nextX, nextY],
  [14.9, nextX + 0.9, nextY - 0.9],
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

function header(ctx, w, h, title, color = '#042361', band = 0.14) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = color
  ctx.fillRect(0, 0, w, h * band)
  ;['#7fdcff', '#f4cb18', '#3be09a'].forEach((c, i) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(w * 0.04 + i * h * 0.05, h * band * 0.5, h * band * 0.15, 0, Math.PI * 2)
    ctx.fill()
  })
  fitText(ctx, title, w * 0.04 + h * 0.17, h * band * 0.68, { weight: 800, size: h * band * 0.5, maxWidth: w * 0.75, color: '#ffffff' })
}

function line(ctx, x, y, width, height = 12, color = 'rgba(4,35,97,0.2)') {
  ctx.fillStyle = color
  roundRectPath(ctx, x, y, width, height, height / 2)
  ctx.fill()
}

function pill(ctx, x, y, w, h, fill, text, ink, size) {
  ctx.fillStyle = fill
  roundRectPath(ctx, x, y, w, h, h / 2)
  ctx.fill()
  if (text) fitText(ctx, text, x + w / 2, y + h * 0.66, { weight: 800, size: size || h * 0.48, maxWidth: w * 0.88, color: ink, align: 'center' })
}

function drawChip(ctx, w, h, text, fill, ink = '#042361') {
  pill(ctx, 0, 0, w, h, fill, text, ink, h * 0.46)
}

function drawDocIcon(ctx, x, y, s, color = '#4f9bff') {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + s * 0.55, y)
  ctx.lineTo(x + s * 0.78, y + s * 0.23)
  ctx.lineTo(x + s * 0.78, y + s)
  ctx.lineTo(x, y + s)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  for (let i = 0; i < 3; i += 1) ctx.fillRect(x + s * 0.13, y + s * (0.42 + i * 0.16), s * 0.5, s * 0.06)
}

function drawDriveLogo(ctx, x, y, s) {
  ctx.fillStyle = '#3be09a'
  ctx.beginPath()
  ctx.moveTo(x + s * 0.3, y)
  ctx.lineTo(x + s * 0.7, y)
  ctx.lineTo(x + s, y + s * 0.7)
  ctx.lineTo(x + s * 0.8, y + s)
  ctx.lineTo(x, y + s * 0.3)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#f4cb18'
  ctx.beginPath()
  ctx.moveTo(x + s * 0.7, y)
  ctx.lineTo(x + s, y + s * 0.7)
  ctx.lineTo(x + s * 0.55, y + s * 0.7)
  ctx.lineTo(x + s * 0.15, y)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#4f9bff'
  ctx.beginPath()
  ctx.moveTo(x + s * 0.2, y + s)
  ctx.lineTo(x + s * 0.8, y + s)
  ctx.lineTo(x + s, y + s * 0.62)
  ctx.lineTo(x + s * 0.4, y + s * 0.62)
  ctx.closePath()
  ctx.fill()
}

function drawChat(ctx, w, h) {
  header(ctx, w, h, 'Claude')
  // barra de entrada con el botón +
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(4,35,97,0.22)'
  ctx.lineWidth = 4
  roundRectPath(ctx, w * 0.025, h * 0.82, w * 0.95, h * 0.14, h * 0.07)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#042361'
  ctx.beginPath()
  ctx.arc(w * PLUS.u, h * PLUS.v, h * 0.045, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = h * 0.012
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(w * PLUS.u - h * 0.022, h * PLUS.v)
  ctx.lineTo(w * PLUS.u + h * 0.022, h * PLUS.v)
  ctx.moveTo(w * PLUS.u, h * PLUS.v - h * 0.022)
  ctx.lineTo(w * PLUS.u, h * PLUS.v + h * 0.022)
  ctx.stroke()
  line(ctx, w * 0.12, h * 0.88, w * 0.4, 14, 'rgba(4,35,97,0.15)')
}

function drawMenu(ctx, w, h, text, withDrive) {
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(4,35,97,0.25)'
  ctx.lineWidth = 4
  roundRectPath(ctx, 3, 3, w - 6, h - 6, h * 0.25)
  ctx.fill()
  ctx.stroke()
  if (withDrive) drawDriveLogo(ctx, h * 0.25, h * 0.24, h * 0.52)
  else drawDocIcon(ctx, h * 0.3, h * 0.22, h * 0.56, '#042361')
  fitText(ctx, text, h * 1.0, h * 0.64, { weight: 700, size: h * 0.4, maxWidth: w - h * 1.3, color: '#042361' })
}

function drawDrive(ctx, w, h) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(0, 0, w, h)
  drawDriveLogo(ctx, w * 0.1, h * 0.26, h * 0.48)
  fitText(ctx, 'Drive', w * 0.42, h * 0.6, { weight: 800, size: h * 0.26, maxWidth: w * 0.52, color: '#042361' })
}

function drawFile(ctx, w, h, file) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#7fdcff'
  ctx.fillRect(0, 0, w * 0.015, h)
  drawDocIcon(ctx, w * 0.04, h * 0.2, h * 0.6)
  fitText(ctx, file.code, w * 0.13, h * 0.62, { weight: 800, size: h * 0.32, family: FONT_MONO, maxWidth: w * 0.16, color: '#042361' })
  fitText(ctx, file.title, w * 0.3, h * 0.62, { weight: 600, size: h * 0.28, family: FONT_BODY, maxWidth: w * 0.66, color: 'rgba(4,35,97,0.85)' })
}

function drawQuestions(ctx, w, h) {
  header(ctx, w, h, 'Claude · 8 preguntas')
}

function drawRow(ctx, w, h, highlighted) {
  if (highlighted) {
    ctx.fillStyle = '#f4cb18'
    roundRectPath(ctx, 0, 0, w, h, h / 2)
    ctx.fill()
    fitText(ctx, EQ_TEXT, w * 0.08, h * 0.7, { weight: 800, size: h * 0.56, maxWidth: w * 0.84, color: '#042361' })
  } else {
    line(ctx, w * 0.08, h * 0.32, w * 0.52, h * 0.32)
    line(ctx, w * 0.64, h * 0.32, w * 0.2, h * 0.32, 'rgba(4,35,97,0.12)')
  }
  ctx.fillStyle = highlighted ? '#042361' : '#7fdcff'
  ctx.beginPath()
  ctx.arc(w * 0.035, h / 2, h * 0.22, 0, Math.PI * 2)
  ctx.fill()
}

function drawWindow(ctx, w, h, title) {
  header(ctx, w, h, title)
}

function drawBlock(ctx, w, h, kind) {
  if (kind === 'question') {
    ctx.fillStyle = '#e4efff'
    roundRectPath(ctx, 0, 0, w, h, h * 0.2)
    ctx.fill()
    line(ctx, w * 0.05, h * 0.3, w * 0.7, h * 0.16, 'rgba(4,35,97,0.45)')
    line(ctx, w * 0.05, h * 0.58, w * 0.45, h * 0.14, 'rgba(4,35,97,0.25)')
  } else if (kind === 'options') {
    ;[0, 1].forEach((r) =>
      [0, 1].forEach((c) => {
        const x = c * w * 0.52
        const y = r * h * 0.54
        ctx.fillStyle = '#ffffff'
        ctx.strokeStyle = 'rgba(4,35,97,0.25)'
        ctx.lineWidth = 4
        roundRectPath(ctx, x + 2, y + 2, w * 0.48 - 4, h * 0.44 - 4, h * 0.1)
        ctx.fill()
        ctx.stroke()
        line(ctx, x + w * 0.04, y + h * 0.17, w * 0.3, h * 0.1)
      }),
    )
  } else {
    pill(ctx, 0, 0, w, h, '#042361', 'Siguiente', '#ffffff')
  }
}

function drawMiniQuiz(ctx, x, y, w, h) {
  ctx.fillStyle = '#f6f8ff'
  ctx.fillRect(x, y, w, h)
  ctx.fillStyle = '#042361'
  ctx.fillRect(x, y, w, h * 0.12)
  ctx.fillStyle = '#e4efff'
  roundRectPath(ctx, x + w * 0.08, y + h * 0.2, w * 0.84, h * 0.18, 8)
  ctx.fill()
  for (let i = 0; i < 4; i += 1) {
    ctx.strokeStyle = 'rgba(4,35,97,0.3)'
    ctx.lineWidth = 3
    roundRectPath(ctx, x + w * 0.08, y + h * (0.44 + i * 0.1), w * 0.84, h * 0.07, 6)
    ctx.stroke()
  }
  ctx.fillStyle = '#042361'
  roundRectPath(ctx, x + w * 0.52, y + h * 0.86, w * 0.4, h * 0.08, h * 0.04)
  ctx.fill()
}

function drawPhone(ctx, w, h) {
  ctx.fillStyle = '#0b1530'
  ctx.fillRect(0, 0, w, h)
  drawMiniQuiz(ctx, w * 0.07, h * 0.06, w * 0.86, h * 0.88)
}

function drawProjector(ctx, w, h) {
  ctx.fillStyle = '#0b1530'
  ctx.fillRect(0, 0, w, h)
  drawMiniQuiz(ctx, w * 0.04, h * 0.05, w * 0.92, h * 0.9)
}

function drawPreview(ctx, w, h) {
  header(ctx, w, h, `${APP_TITLE} · vista previa`)
  fitText(ctx, '¿Cuál es el equilibrio?', w * 0.06, h * 0.3, { weight: 800, size: h * 0.075, maxWidth: w * 0.88, color: '#042361' })
  ;[0, 1].forEach((r) =>
    [0, 1].forEach((c) => {
      const u = [0.29, 0.72][c]
      const v = [0.56, 0.76][r]
      ctx.fillStyle = '#ffffff'
      ctx.strokeStyle = 'rgba(4,35,97,0.25)'
      ctx.lineWidth = 4
      roundRectPath(ctx, w * (u - OPT_A.w / 2), h * (v - OPT_A.h / 2), w * OPT_A.w, h * OPT_A.h, h * 0.04)
      ctx.fill()
      ctx.stroke()
      if (r === 0 && c === 0) fitText(ctx, 'P = 30 y Q = 80', w * u, h * (v + 0.022), { weight: 800, size: h * 0.06, maxWidth: w * OPT_A.w * 0.85, color: '#042361', align: 'center' })
      else line(ctx, w * (u - 0.12), h * (v - 0.012), w * 0.24, h * 0.025)
    }),
  )
}

function drawOptionOk(ctx, w, h) {
  ctx.fillStyle = '#3be09a'
  roundRectPath(ctx, 0, 0, w, h, h * 0.27)
  ctx.fill()
  fitText(ctx, 'P = 30 y Q = 80', w / 2, h * 0.64, { weight: 800, size: h * 0.4, maxWidth: w * 0.85, color: '#042361', align: 'center' })
}

function drawCheck(ctx, x, y, r) {
  ctx.fillStyle = '#3be09a'
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#042361'
  ctx.lineWidth = r * 0.28
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(x - r * 0.45, y + r * 0.02)
  ctx.lineTo(x - r * 0.12, y + r * 0.35)
  ctx.lineTo(x + r * 0.48, y - r * 0.32)
  ctx.stroke()
}

function drawFeedback(ctx, w, h) {
  header(ctx, w, h, 'Al responder', '#1f8a5b', 0.18)
  drawCheck(ctx, w * 0.1, h * 0.33, h * 0.075)
  fitText(ctx, 'Correcta', w * 0.18, h * 0.37, { weight: 800, size: h * 0.11, maxWidth: w * 0.7, color: '#14633f' })
  fitText(ctx, 'Explicación', w * 0.06, h * 0.56, { weight: 700, size: h * 0.075, family: FONT_BODY, maxWidth: w * 0.4, color: '#042361' })
  line(ctx, w * 0.42, h * 0.52, w * 0.5, h * 0.04)
  line(ctx, w * 0.06, h * 0.62, w * 0.86, h * 0.04, 'rgba(4,35,97,0.12)')
  fitText(ctx, 'Fuente: S2-02 Lectura 1', w * 0.06, h * 0.84, { weight: 700, size: h * 0.075, family: FONT_MONO, maxWidth: w * 0.88, color: '#1f6fb5' })
}

function drawScore(ctx, w, h) {
  header(ctx, w, h, 'Puntaje al completar las 8', '#042361', 0.16)
  fitText(ctx, 'Preguntas falladas', w * 0.06, h * 0.3, { weight: 700, size: h * 0.07, family: FONT_BODY, maxWidth: w * 0.88, color: '#042361' })
  for (let i = 0; i < 2; i += 1) {
    ctx.fillStyle = '#f4cb18'
    ctx.beginPath()
    ctx.arc(w * 0.08, h * (0.4 + i * 0.12), h * 0.025, 0, Math.PI * 2)
    ctx.fill()
    line(ctx, w * 0.13, h * (0.385 + i * 0.12), w * (i ? 0.5 : 0.66), h * 0.035)
  }
  pill(ctx, w * 0.22, h * 0.7, w * 0.56, h * 0.18, '#f4cb18', 'Reiniciar quiz', '#042361', h * 0.075)
}

function drawNextWindow(ctx, w, h) {
  header(ctx, w, h, APP_TITLE)
  ctx.fillStyle = '#e4efff'
  roundRectPath(ctx, w * 0.06, h * 0.2, w * 0.88, h * 0.18, h * 0.04)
  ctx.fill()
  line(ctx, w * 0.1, h * 0.25, w * 0.6, h * 0.035, 'rgba(4,35,97,0.45)')
  line(ctx, w * 0.1, h * 0.31, w * 0.4, h * 0.03, 'rgba(4,35,97,0.25)')
  for (let i = 0; i < 4; i += 1) {
    const x = w * (0.06 + (i % 2) * 0.46)
    const y = h * (0.44 + Math.floor(i / 2) * 0.17)
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = 'rgba(4,35,97,0.25)'
    ctx.lineWidth = 4
    roundRectPath(ctx, x, y, w * 0.42, h * 0.13, h * 0.03)
    ctx.fill()
    ctx.stroke()
    line(ctx, x + w * 0.04, y + h * 0.05, w * 0.24, h * 0.03)
  }
  pill(ctx, w * (BTN_NEXT.u - BTN_NEXT.w / 2), h * (BTN_NEXT.v - BTN_NEXT.h / 2), w * BTN_NEXT.w, h * BTN_NEXT.h, '#042361', 'Siguiente', '#ffffff')
}

function drawEnterKey(ctx, w, h) {
  ctx.fillStyle = '#c9d2e6'
  roundRectPath(ctx, 0, 0, w, h, h * 0.16)
  ctx.fill()
  ctx.fillStyle = '#e3e9f6'
  roundRectPath(ctx, w * 0.06, h * 0.06, w * 0.88, h * 0.78, h * 0.12)
  ctx.fill()
  fitText(ctx, 'Enter', w / 2, h * 0.54, { weight: 700, size: h * 0.3, maxWidth: w * 0.8, color: 'rgba(4,35,97,0.45)', align: 'center' })
}

function drawPlanB(ctx, w, h) {
  header(ctx, w, h, 'Plan B', '#1f8a5b', 0.12)
  drawDocIcon(ctx, w * 0.08, h * 0.19, h * 0.13)
  fitText(ctx, 'Preguntas en', w * 0.3, h * 0.24, { weight: 800, size: h * 0.06, maxWidth: w * 0.64, color: '#042361' })
  fitText(ctx, 'un documento', w * 0.3, h * 0.31, { weight: 800, size: h * 0.06, maxWidth: w * 0.64, color: '#042361' })
  for (let i = 0; i < 8; i += 1) {
    ctx.fillStyle = '#7fdcff'
    ctx.beginPath()
    ctx.arc(w * 0.1, h * (0.42 + i * 0.07), h * 0.014, 0, Math.PI * 2)
    ctx.fill()
    line(ctx, w * 0.16, h * (0.41 + i * 0.07), w * (i % 3 === 1 ? 0.5 : 0.7), h * 0.022)
  }
}

function drawLabel(ctx, w, h, text, color = '#9fc4ff') {
  fitText(ctx, text, w / 2, h * 0.7, { weight: 600, size: h * 0.6, family: FONT_MONO, maxWidth: w * 0.96, color, align: 'center' })
}

function drawDot(ctx, w, h) {
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2)
  ctx.fill()
}

/* ------------------------------------------------------------------ */

export default function createAgentesPractica2Scene({ canvas, width, height, invalidate }) {
  const stage = createStage({
    canvas,
    width,
    height,
    invalidate,
    duration: AGENTES_PRACTICA2_DURATION,
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
  const plane = (w, h, draw, order = 5) => {
    const mesh = makeTextPlane(w, h, makeTex(Math.round(w * 200), Math.round(h * 200), draw, invalidate))
    mesh.renderOrder = order
    scene.add(mesh)
    return mesh
  }
  const chip = (w, text, fill, ink) => plane(w, 0.64, (ctx, cw, ch) => drawChip(ctx, cw, ch, text, fill, ink), 6)
  const label = (w, text, color) => plane(w, 0.4, (ctx, cw, ch) => drawLabel(ctx, cw, ch, text, color), 6)
  const shown = (obj, k) => {
    obj.material.opacity = k
    obj.visible = k > 0.01
  }

  /* ---------------- fase 0: archivos por Drive ---------------- */
  const chat = makeCard(CHAT, drawChat, { emissive: '#7fdcff' })
  const drive = makeCard(DRIVE, drawDrive, { radius: 0.28, emissive: '#3be09a' })
  const files = FILES.map((file) => makeCard(FILE, (ctx, w, h) => drawFile(ctx, w, h, file), { radius: 0.16, emissive: '#7fdcff' }))
  const menu = plane(MENU.w, MENU.h, (ctx, w, h) => drawMenu(ctx, w, h, 'Subir o agregar archivos', false), 7)
  const submenu = plane(SUBMENU.w, SUBMENU.h, (ctx, w, h) => drawMenu(ctx, w, h, 'Desde Drive', true), 7)
  menu.position.set(MENU.x, MENU.y, 0.7)
  submenu.position.set(SUBMENU.x, SUBMENU.y, 0.75)
  const fileBeams = FILES.map(() => {
    const beam = makeBeam(CYAN, 0.8)
    scene.add(beam)
    return beam
  })
  const driveGlow = addGlow(scene, glow, GREEN, 4.2, 0)
  driveGlow.position.set(DRIVE.x, DRIVE.y, -0.3)

  /* ---------------- fase 1: ocho preguntas ---------------- */
  const qcard = makeCard(QCARD, drawQuestions, { emissive: '#7fdcff' })
  const rows = ROW_Y.map((y) => {
    const mesh = plane(ROW_W, ROW_H, (ctx, w, h) => drawRow(ctx, w, h, false))
    return { mesh, y }
  })
  const eqRow = plane(ROW_W + 0.2, ROW_H + 0.1, (ctx, w, h) => drawRow(ctx, w, h, true), 6)
  const eqRing = makeShockRing(AMBER)
  scene.add(eqRing)
  const eqChip = chip(5.2, 'La del equilibrio: P = 30 y Q = 80', '#f4cb18')
  eqChip.position.set(0, PY - 3.1, 0.3)

  /* ---------------- fase 2: se construye la app ---------------- */
  const build = makeCard(BUILD, (ctx, w, h) => drawWindow(ctx, w, h, APP_TITLE), { emissive: '#7fdcff' })
  const blocks = BLOCKS.map((b) => ({ ...b, mesh: plane(b.w, b.h, (ctx, w, h) => drawBlock(ctx, w, h, b.kind)) }))
  const phone = makeCard(PHONE, drawPhone, { radius: 0.24, edge: '#1b2747', emissive: '#7fdcff' })
  const proj = makeCard(PROJ, drawProjector, { radius: 0.12, edge: '#1b2747', emissive: '#7fdcff' })
  const phoneLabel = label(2.4, 'Celular')
  phoneLabel.position.set(PHONE.x, PHONE.y - PHONE.h / 2 - 0.35, 0.2)
  const projLabel = label(2.6, 'Proyector')
  projLabel.position.set(PROJ.x, PROJ.y - PROJ.h / 2 - 0.35, 0.2)
  const liveChip = chip(4.2, 'El quiz en vivo', '#7fdcff')
  liveChip.position.set(0, PY - 2.5, 0.3)
  const deviceBeams = [0, 1].map(() => {
    const beam = makeBeam(CYAN, 0.8)
    scene.add(beam)
    return beam
  })
  const buildRings = BLOCKS.map(() => {
    const ring = makeShockRing(CYAN)
    scene.add(ring)
    return ring
  })

  /* ---------------- fase 3: vista previa ---------------- */
  const preview = makeCard(PREV, drawPreview, { emissive: '#3be09a' })
  const optOk = plane(PREV.w * OPT_A.w, PREV.h * OPT_A.h, drawOptionOk, 6)
  optOk.position.set(prevX(OPT_A.u), prevY(OPT_A.v), 0.12)
  const feed = makeCard(FEED, drawFeedback, { emissive: '#3be09a' })
  const score = makeCard(SCORE, drawScore, { emissive: '#f4cb18' })
  const scoreRing = makeShockRing(AMBER)
  scene.add(scoreRing)
  const finalChip = chip(4.4, 'Puntaje solo al final', '#f4cb18')
  finalChip.position.set(PREV.x, PY - 2.65, 0.3)

  /* ---------------- fase 4: clics, falladas y plan B ---------------- */
  const nextWin = makeCard(NEXTW, drawNextWindow, { emissive: '#7fdcff' })
  const dotTex = makeTex(64, 64, drawDot, invalidate)
  const dots = Array.from({ length: 8 }, (_, i) => {
    const mesh = makeTextPlane(0.3, 0.3, dotTex)
    mesh.renderOrder = 6
    mesh.position.set(dotX(i), DOT_Y, 0.2)
    scene.add(mesh)
    return mesh
  })
  const dotRings = [6, 7].map(() => {
    const ring = makeShockRing(AMBER)
    scene.add(ring)
    return ring
  })
  const enterKey = makeCard(ENTER, drawEnterKey, { radius: 0.16, edge: '#aab6cf', emissive: '#ffffff' })
  const enterLabel = label(2.6, 'no con Enter', '#c9d2e6')
  enterLabel.position.set(ENTER.x, ENTER.y - ENTER.h / 2 - 0.35, 0.2)
  const missChip = chip(5.0, 'Sin responder cuenta como fallada', '#f4cb18')
  missChip.position.set(NEXTW.x, PY - 2.65, 0.3)
  const planB = makeCard(PLANB, drawPlanB, { emissive: '#3be09a' })
  const planBChip = chip(2.8, 'Plan B listo', '#3be09a')
  planBChip.position.set(PLANB.x, PY - 2.65, 0.3)
  const planBRing = makeShockRing(GREEN)
  scene.add(planBRing)
  const greyDot = new THREE.Color(0x8796b8)

  /* ---------------- cursor ---------------- */
  const cursor = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: makeCursorTexture(), transparent: true, depthWrite: false, depthTest: false }),
  )
  cursor.renderOrder = 20
  scene.add(cursor)
  const clickRing = makeShockRing(CYAN)
  scene.add(clickRing)
  const CLICKS = [
    ...CLICKS0.map((t, i) => ({ t, x: [plusX, MENU.x + 0.2, SUBMENU.x][i], y: [plusY, MENU.y, SUBMENU.y][i] })),
    { t: ANSWER_AT, x: prevX(OPT_A.u), y: prevY(OPT_A.v) },
    ...CLICKS4.map((t) => ({ t, x: nextX, y: nextY })),
  ]

  const allCards = [chat, drive, ...files, qcard, build, phone, proj, preview, feed, score, nextWin, enterKey, planB]
  allCards.forEach((card) => scene.add(card.group))

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
  const popIn = (T, a, d = 0.45) => easeOutBack(seg(T, a, a + d))

  function draw(t) {
    const T = t * AGENTES_PRACTICA2_DURATION
    const events = []
    stage.update(T, 0)
    stage.spot.position.set(0, 4.6, 5.5)
    const op = [0, 1, 2, 3, 4].map((i) => phaseOpacity(T, i))
    const e = [0, 1, 2, 3, 4].map((i) => enter(T, i))

    /* ---------- fase 0: botón +, Subir o agregar archivos, Desde Drive ---------- */
    place(chat, CHAT.x, CHAT.y - e[0].drop, 0, e[0].scale, op[0])
    flashCard(chat, bump(seg(T, 2.5, 3.0)) * 0.35)
    const driveIn = popIn(T, 0.3, 0.5)
    place(drive, DRIVE.x, DRIVE.y, 0.1, driveIn, op[0])
    flashCard(drive, bump(seg(T, 1.8, 2.3)) * 0.6)
    driveGlow.material.opacity = op[0] * 0.5 * bump(seg(T, 1.75, 2.7))

    const menuK = smooth(seg(T, 0.95, 1.1)) * (1 - smooth(seg(T, 2.05, 2.3)))
    menu.scale.setScalar(safeScale(lerp(0.85, 1, easeOutBack(seg(T, 0.95, 1.25)))))
    shown(menu, op[0] * menuK)
    const subK = smooth(seg(T, 1.4, 1.55)) * (1 - smooth(seg(T, 2.05, 2.3)))
    submenu.scale.setScalar(safeScale(lerp(0.85, 1, easeOutBack(seg(T, 1.4, 1.7)))))
    shown(submenu, op[0] * subK)

    files.forEach((card, i) => {
      const a = 2.0 + i * 0.25
      const k = easeInOutCubic(seg(T, a, a + 0.6))
      const x = lerp(DRIVE.x, CHAT.x, k)
      const y = lerp(DRIVE.y, FILE_Y[i], k) + Math.sin(k * Math.PI) * 0.6
      place(card, x, y, 0.35, lerp(0.3, 1, k), op[0] * smooth(seg(T, a, a + 0.15)))
      flashCard(card, bump(seg(T, a + 0.5, a + 1.0)) * 0.5)
      pA.set(DRIVE.x - DRIVE.w / 2, DRIVE.y, 0.3)
      pB.set(x + (FILE.w / 2) * lerp(0.3, 1, k), y, 0.3)
      const beamK = smooth(seg(T, a, a + 0.2)) * (1 - smooth(seg(T, a + 0.6, a + 0.9)))
      if (beamK > 0.01 && pB.x < pA.x) {
        setBeam(fileBeams[i], pB, pA, 0.03)
        fileBeams[i].material.opacity = 0.7 * beamK * op[0]
      } else fileBeams[i].visible = false
      if (T >= a + 0.55 && T < a + 1.4) events.push({ t: a + 0.6, x: CHAT.x + FILE.w / 2 - 0.3, y: FILE_Y[i], z: 0.8, color: cyanColor, speed: 1.4, life: 0.8 })
    })

    /* ---------- fase 1: 8 preguntas y la del equilibrio ---------- */
    place(qcard, QCARD.x, QCARD.y - e[1].drop, 0, e[1].scale, op[1])
    rows.forEach((row, i) => {
      const a = 3.7 + i * 0.12
      const k = easeOutCubic(seg(T, a, a + 0.35))
      row.mesh.position.set(lerp(-0.8, 0, k), row.y - e[1].drop, 0.12)
      shown(row.mesh, op[1] * smooth(seg(T, a, a + 0.2)))
    })
    const eqK = easeOutCubic(seg(T, EQ_AT, EQ_AT + 0.4))
    eqRow.position.set(-(ROW_W + 0.2) / 2 * (1 - eqK), ROW_Y[EQ_ROW], 0.16)
    eqRow.scale.set(safeScale(eqK), 1, 1)
    shown(eqRow, op[1] * smooth(seg(T, EQ_AT, EQ_AT + 0.1)))
    setShockRing(eqRing, T - (EQ_AT + 0.35), 0.9, 2.2)
    eqRing.position.set(0, ROW_Y[EQ_ROW], 0.3)
    if (T >= EQ_AT + 0.3 && T < EQ_AT + 1.3) events.push({ t: EQ_AT + 0.35, x: 2.4, y: ROW_Y[EQ_ROW], z: 0.8, color: amberColor, speed: 1.6, life: 0.9 })
    flashCard(qcard, bump(seg(T, EQ_AT + 0.2, EQ_AT + 0.9)) * 0.3)
    eqChip.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 5.3, 5.8)))))
    shown(eqChip, op[1] * smooth(seg(T, 5.3, 5.7)))

    /* ---------- fase 2: el artefacto en una ventana, celular y proyector ---------- */
    place(build, BUILD.x, BUILD.y - e[2].drop, 0, e[2].scale, op[2])
    blocks.forEach((b, i) => {
      const k = popIn(T, b.at)
      b.mesh.position.set(b.x, b.y - e[2].drop, 0.14)
      b.mesh.scale.setScalar(safeScale(lerp(0.6, 1, k)))
      shown(b.mesh, op[2] * smooth(seg(T, b.at, b.at + 0.15)))
      setShockRing(buildRings[i], T - b.at, 0.7, 1.4)
      buildRings[i].position.set(b.x, b.y, 0.3)
      if (T >= b.at && T < b.at + 0.9) events.push({ t: b.at + 0.05, x: b.x, y: b.y, z: 0.7, color: cyanColor, speed: 1.3, life: 0.7 })
    })
    flashCard(build, bump(seg(T, 7.9, 8.5)) * 0.4)
    const devK = [popIn(T, 8.1, 0.5), popIn(T, 8.3, 0.5)]
    place(phone, PHONE.x, PHONE.y, 0.1, devK[0], op[2] * smooth(seg(T, 8.1, 8.3)))
    place(proj, PROJ.x, PROJ.y, 0.1, devK[1], op[2] * smooth(seg(T, 8.3, 8.5)))
    flashCard(phone, bump(seg(T, 8.6, 9.2)) * 0.5)
    flashCard(proj, bump(seg(T, 8.8, 9.4)) * 0.5)
    shown(phoneLabel, op[2] * smooth(seg(T, 8.4, 8.7)))
    shown(projLabel, op[2] * smooth(seg(T, 8.6, 8.9)))
    ;[
      [BUILD.x - BUILD.w / 2, PHONE.x + PHONE.w / 2, PHONE.y, 8.1],
      [BUILD.x + BUILD.w / 2, PROJ.x - PROJ.w / 2, PROJ.y, 8.3],
    ].forEach(([fromX, toX, toY, a], i) => {
      const travel = easeInOutCubic(seg(T, a, a + 0.5))
      pA.set(fromX, BUILD.y, 0.3)
      pB.set(toX, toY, 0.3)
      pC.copy(pA).lerp(pB, travel)
      setBeam(deviceBeams[i], pA, pC, 0.035 + 0.01 * Math.sin(T * 6 + i))
      deviceBeams[i].material.opacity = 0.75 * op[2]
      if (travel < 0.001 || op[2] < 0.01) deviceBeams[i].visible = false
    })
    liveChip.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 8.7, 9.2)))))
    shown(liveChip, op[2] * smooth(seg(T, 8.7, 9.1)))

    /* ---------- fase 3: correcta, explicación, fuente; puntaje al final ---------- */
    place(preview, PREV.x, PREV.y - e[3].drop, 0, e[3].scale, op[3])
    optOk.scale.setScalar(safeScale(lerp(0.85, 1, easeOutBack(seg(T, ANSWER_AT, ANSWER_AT + 0.35)))))
    shown(optOk, op[3] * smooth(seg(T, ANSWER_AT, ANSWER_AT + 0.12)))
    flashCard(preview, bump(seg(T, ANSWER_AT, ANSWER_AT + 0.6)) * 0.4)
    if (T >= ANSWER_AT && T < ANSWER_AT + 1) events.push({ t: ANSWER_AT + 0.05, x: prevX(OPT_A.u), y: prevY(OPT_A.v), z: 0.8, color: greenColor, speed: 1.5, life: 0.8 })
    const feedIn = popIn(T, ANSWER_AT + 0.25, 0.5)
    place(feed, lerp(FEED.x + 1.0, FEED.x, easeOutCubic(seg(T, ANSWER_AT + 0.25, ANSWER_AT + 0.75))), FEED.y, 0.1, feedIn, op[3] * smooth(seg(T, ANSWER_AT + 0.25, ANSWER_AT + 0.45)))
    flashCard(feed, bump(seg(T, ANSWER_AT + 0.6, ANSWER_AT + 1.2)) * 0.4)
    const scoreIn = popIn(T, SCORE_AT, 0.5)
    place(score, lerp(SCORE.x + 1.0, SCORE.x, easeOutCubic(seg(T, SCORE_AT, SCORE_AT + 0.5))), SCORE.y, 0.1, scoreIn, op[3] * smooth(seg(T, SCORE_AT, SCORE_AT + 0.2)))
    flashCard(score, bump(seg(T, SCORE_AT + 0.4, SCORE_AT + 1.0)) * 0.5)
    setShockRing(scoreRing, T - (SCORE_AT + 0.35), 0.9, 2.4)
    scoreRing.position.set(SCORE.x, SCORE.y, 0.3)
    if (T >= SCORE_AT + 0.3 && T < SCORE_AT + 1.3) events.push({ t: SCORE_AT + 0.35, x: SCORE.x, y: SCORE.y + 0.6, z: 0.8, color: amberColor, speed: 1.8, life: 0.9 })
    finalChip.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 11.8, 12.3)))))
    shown(finalChip, op[3] * smooth(seg(T, 11.8, 12.2)))

    /* ---------- fase 4: clics en Siguiente, falladas y plan B ---------- */
    place(nextWin, NEXTW.x, NEXTW.y - e[4].drop, 0, e[4].scale, op[4])
    flashCard(nextWin, Math.max(...CLICKS4.map((c) => bump(seg(T, c, c + 0.4)))) * 0.35)
    dots.forEach((dot, i) => {
      dot.position.y = DOT_Y - e[4].drop
      const skipAt = i === 6 ? CLICKS4[0] : i === 7 ? CLICKS4[1] : null
      const skipped = skipAt !== null && T >= skipAt + 0.05
      dot.material.color.copy(skipAt === null ? cyanColor : skipped ? amberColor : greyDot)
      const pop = skipAt !== null ? 1 + 0.35 * bump(seg(T, skipAt + 0.05, skipAt + 0.4)) : 1
      dot.scale.setScalar(safeScale(pop * smooth(seg(T, 13.0 + i * 0.05, 13.3 + i * 0.05))))
      shown(dot, op[4])
    })
    dotRings.forEach((ring, i) => {
      setShockRing(ring, T - (CLICKS4[i] + 0.05), 0.8, 0.9)
      ring.position.set(dotX(6 + i), DOT_Y, 0.3)
    })
    const enterIn = popIn(T, 13.1, 0.5)
    place(enterKey, ENTER.x, ENTER.y, 0.1, enterIn * 0.95, op[4] * 0.6 * smooth(seg(T, 13.1, 13.3)))
    shown(enterLabel, op[4] * smooth(seg(T, 13.3, 13.6)))
    missChip.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 14.3, 14.8)))))
    shown(missChip, op[4] * smooth(seg(T, 14.3, 14.7)))
    const planIn = popIn(T, PLANB_AT, 0.5)
    place(planB, lerp(PLANB.x + 1.0, PLANB.x, easeOutCubic(seg(T, PLANB_AT, PLANB_AT + 0.5))), PLANB.y, 0.1, planIn, op[4] * smooth(seg(T, PLANB_AT, PLANB_AT + 0.2)))
    flashCard(planB, bump(seg(T, PLANB_AT + 0.4, PLANB_AT + 1.0)) * 0.5)
    setShockRing(planBRing, T - (PLANB_AT + 0.4), 0.9, 2.4)
    planBRing.position.set(PLANB.x, PLANB.y, 0.3)
    if (T >= PLANB_AT + 0.35 && T < PLANB_AT + 1.3) events.push({ t: PLANB_AT + 0.4, x: PLANB.x, y: PLANB.y + 1.0, z: 0.8, color: greenColor, speed: 1.8, life: 0.9 })
    planBChip.scale.setScalar(safeScale(lerp(0.9, 1, easeOutBack(seg(T, 14.9, 15.3)))))
    shown(planBChip, op[4] * smooth(seg(T, 14.9, 15.2)))

    /* ---------- cursor y clics ---------- */
    const c = cursorAt(T)
    const active = CLICKS.find((k) => T >= k.t && T < k.t + 0.7)
    const clickK = active ? bump(seg(T, active.t, active.t + 0.25)) : 0
    cursor.position.set(c.x + 0.31, c.y - 0.41, 2.0)
    cursor.scale.setScalar(1 - clickK * 0.1)
    const cursorK =
      smooth(seg(T, 0.35, 0.6)) * (1 - smooth(seg(T, 2.3, 2.6))) +
      smooth(seg(T, 9.8, 10.0)) * (1 - smooth(seg(T, 10.9, 11.2))) +
      smooth(seg(T, 13.0, 13.2)) * (1 - smooth(seg(T, 14.6, 14.9)))
    cursor.material.opacity = cursorK
    cursor.visible = cursorK > 0.01
    setShockRing(clickRing, active ? T - active.t : -1, 0.7, 0.9)
    if (active) clickRing.position.set(active.x, active.y, 1.9)

    bursts.update(T, events)
    return Math.min(4, Math.floor(T / PHASE))
  }

  function dispose() {
    stage.dispose()
  }

  return { scene, camera: stage.camera, draw, resize: stage.resize, dispose }
}
