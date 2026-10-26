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
| `/profesores/fundamentos` | Sesión 1 — Espacio para profesores (en preparación) |
| `/profesores/practica-rag` | Sesión 2 — Espacio para profesores (en preparación) |
| `/profesores/practica-mcp` | Sesión 3 — Espacio para profesores (en preparación) |
| `/profesores/practica-agentes` | Sesión 4 — Espacio para profesores (en preparación) |

## Estructura

```
├── src/
│   ├── components/   # Layout, Header, PhaseBar
│   ├── pages/        # Una página por módulo
│   └── data/         # Configuración de navegación
├── public/
└── dist/             # Build de producción
```
