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
| `/fundamentos` | Sesión 1 — Fundamentos |
| `/practica-mcp` | Sesión 2 — Práctica MCP |
| `/practica-rag` | Sesión 3 — Práctica RAG |
| `/hackathon-agentes` | Sesión 4 — Hackathon Agentes |

## Estructura

```
├── src/
│   ├── components/   # Layout, Header, PhaseBar
│   ├── pages/        # Una página por módulo
│   └── data/         # Configuración de navegación
├── public/
└── dist/             # Build de producción
```
