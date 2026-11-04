# Capacitación IA Generativa

Sitio del curso de capacitación en IA generativa de la UIFCE (UNAL).

## Inicio rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Sitio publicado

[https://its-camilo.github.io/capacitacion-ia-generativa/](https://its-camilo.github.io/capacitacion-ia-generativa/)

El deploy se hace automáticamente con GitHub Actions al hacer push a `main`.

## Rutas

| Ruta | Módulo |
|------|--------|
| `/estudiantes/fundamentos` | Sesión 1 — Fundamentos para estudiantes |
| `/estudiantes/practica-mcp` | Sesión 2 — Práctica MCP para estudiantes |
| `/estudiantes/practica-rag` | Sesión 3 — Práctica RAG para estudiantes |
| `/estudiantes/practica-agentes` | Sesión 4 — Práctica Agentes para estudiantes |
| `/profesores` | Propuesta para profesores: resumen de las cuatro sesiones |
| `/profesores/fundamentos` | Sesión 1 — Tareas, contexto y evaluación |
| `/profesores/rag` | Sesión 2 — RAG sin código con NotebookLM |
| `/profesores/mcp` | Sesión 3 — IA dentro de las herramientas de trabajo |
| `/profesores/agentes` | Sesión 4 — Agentes y flujos: un piloto para su clase |

## Contenido de las sesiones de profesores

El contenido vive en `src/data/profesorSessions.js` y se edita sin tocar JSX. Cada sesión
tiene metadatos, agenda, objetivos y secciones con bloques:

| Bloque | Para qué sirve |
|--------|----------------|
| `p` | Párrafo. Admite `**negrita**`, `` `código` `` y `[enlaces](https://…)`. |
| `list` / `numbered` | Listas con viñeta o numeradas. |
| `checklist` | Lista de verificación con casillas. |
| `table` | Tabla de comparación (`headers` + `rows`). |
| `compare` | Dos columnas enfrentadas (`columns` con `title`, `tag`, `tone`, `items`). |
| `cards` | Tarjetas con título, descripción, etiqueta y enlace opcional. |
| `prompt` | Bloque de prompt con botón de copiar. |
| `callout` | Aviso (`tone: 'ok'` o `'warn'`). |
| `note` | Nota al margen. |
| `links` | Lista de enlaces con proveedor. |

Para agregar una sesión nueva: cree la entrada en `profesorSessions`, añada la ruta en
`src/App.jsx` y el segmento en `professorPhases` (`src/data/navigation.js`).

## Estructura

```
├── src/
│   ├── components/   # Layout, Header, PhaseBar, renderizadores por módulo
│   ├── pages/        # Una página por módulo
│   └── data/         # Navegación y contenido de las sesiones
├── public/
└── dist/             # Build de producción
```
