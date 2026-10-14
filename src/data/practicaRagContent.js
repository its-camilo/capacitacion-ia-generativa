export const sectionNav = [
  { id: 'paso-1', label: 'Todos los MCP' },
  { id: 'paso-2', label: 'API Key OpenRouter' },
  { id: 'paso-3', label: 'Crear el RAG' },
  { id: 'paso-4', label: 'Chat web con el RAG' },
  { id: 'paso-5', label: 'Reporte Power BI directo' },
  { id: 'entregables', label: 'Entregables' },
  { id: 'cierre', label: 'Cierre: eliminar interfaz del RAG' },
]

export const assetUrl = (path) => `${import.meta.env.BASE_URL}${String(path).replace(/^\//, '')}`

export const classFiles = {
  ragChat: 'sesion-3/rag-chat-index.html',
  pbix: 'sesion-3/northwind.pbix',
  pbixZip: 'sesion-3/northwind-powerbi-entregable.zip',
}

export const allMcpConfigOpencode = `{
  "mcp": {
    "servers": {
      "sqlite-northwind": {
        "type": "remote",
        "url": "http://129.213.100.174:8080/sqlite/mcp",
        "oauth": false,
        "headers": {
          "Authorization": "Bearer 377314"
        }
      },
      "pinecone": {
        "type": "remote",
        "url": "http://129.213.100.174:8080/pinecone/mcp",
        "oauth": false,
        "headers": {
          "Authorization": "Bearer 377314"
        }
      },
      "openrouter": {
        "type": "remote",
        "url": "https://mcp.openrouter.ai/mcp"
      },
      "powerbi": {
        "type": "remote",
        "url": "http://129.213.100.174:8080/powerbi/mcp",
        "oauth": false,
        "headers": {
          "Authorization": "Bearer 377314"
        }
      }
    }
  }
}`

export const allMcpConfigCursor = `{
  "mcpServers": {
    "sqlite-northwind": {
      "url": "http://129.213.100.174:8080/sqlite/mcp",
      "headers": { "Authorization": "Bearer 377314" }
    },
    "pinecone": {
      "url": "http://129.213.100.174:8080/pinecone/mcp",
      "headers": { "Authorization": "Bearer 377314" }
    },
    "openrouter": {
      "url": "https://mcp.openrouter.ai/mcp"
    },
    "powerbi": {
      "url": "http://129.213.100.174:8080/powerbi/mcp",
      "headers": { "Authorization": "Bearer 377314" }
    }
  }
}`
export const openRouterLinks = {
  signup: 'https://openrouter.ai/',
  apiKeys: 'https://openrouter.ai/keys',
  mcpDocs: 'https://openrouter.ai/docs/guides/overview/mcp-server',
}

export const ragSetupPrompt = `Usa las herramientas MCP de SQLite, Pinecone y OpenRouter que ya están conectadas. No ejecutes comandos de terminal, no instales paquetes y no crees scripts para ejecutar.

Explora la base SQLite disponible mediante el MCP de SQLite. Elige las tablas más útiles, convierte filas representativas en chunks de texto legibles por sí solos y crea un índice nuevo en Pinecone. No superes 1000 registros/chunks para esta demostración. Usa un modelo gratuito de embeddings compatible con Pinecone y, si necesitas generar embeddings mediante OpenRouter, prueba hasta 3 modelos gratuitos en orden si alguno falla.

No inventes resultados: confirma con las herramientas que el índice se creó y que los vectores se subieron. Al terminar, informa el nombre del índice, las tablas consultadas, el número de chunks cargados, el modelo de embeddings y cualquier limitación encontrada. Si alguna operación no está disponible mediante MCP, explica el bloqueo; no intentes resolverlo ejecutando comandos.`
export const chatUiPrompt = `Crea un único archivo llamado index.html, autocontenido, con HTML, CSS y JavaScript vanilla. No uses React, Vite, npm, Node.js, paquetes, compilación, backend, servidor local ni comandos de terminal. La página debe poder guardarse y abrirse en un navegador moderno.

Construye una interfaz de chat que consulte el índice Pinecone que ya creamos y use OpenRouter para redactar respuestas:
- Incluye campos editables para la API key de Pinecone, la región/host del índice, el nombre del índice y la API key de OpenRouter.
- Permite escribir preguntas, enviar con un botón o Enter y ver el historial.
- Recupera de Pinecone los chunks relevantes para cada pregunta y pásalos como contexto a un modelo gratuito de OpenRouter.
- Muestra la respuesta y un panel desplegable con los chunks recuperados; deja claro cuándo no se recuperó contexto.
- Incluye estados de carga, errores legibles y botón para limpiar la conversación.
- Usa únicamente APIs HTTP desde el navegador; no dependas de archivos externos ni de librerías.
- No simules respuestas ni afirmes que la consulta funcionó si la API devuelve un error.

Es una demostración didáctica: las claves introducidas en el HTML/navegador pueden ser vistas por quien use la página. No reutilices claves personales o de producción. Usa claves temporales de prueba con permisos mínimos y revócalas al terminar. Si CORS o las restricciones del proveedor impiden las llamadas desde el navegador, explica que el acceso directo no es viable en ese entorno; no añadas un backend ni solicites ejecutar comandos.`
export const powerBiPrompt = `## Contexto

Tengo la base SQLite **Northwind** (\`northwind.db\`) y los MCP ya configurados:

- \`sqlite\` → apunta a mi archivo \`northwind.db\`
- \`powerbi\` → servidor \`pbix-mcp-server\` (paquete \`pbix-mcp\`, NO usar otros MCP de Power BI)

Quiero generar un **reporte Power BI (.pbix)** listo para abrir en Power BI Desktop en Windows,
con el tablero **ya construido** (no vacío).

## Objetivo del entregable

Crear en mi carpeta de proyecto:

  mi-proyecto/
    build_powerbi_report.py
    tools/pbix-mcp-venv/          # venv Python 3.12 con pbix-mcp instalado
    powerbi/
      northwind.pbix              # reporte final (~30-50 KB)
      northwind-powerbi-entregable.zip
      POWERBI_MANIFEST.json
      data/                       # CSVs agregados (opcional, para auditoría)

El zip debe contener solo \`northwind.pbix\` (datos embebidos).

## Restricciones CRÍTICAS (no negociables)

### 1. Límite de 10 MB en Power Query

**NO** cargar la tabla \`Order Details\` completa (~609.000 filas) al modelo.
Power BI Desktop falla con:
  "No se pueden actualizar las consultas porque superan el límite de 10 MB de tamaño."

**Solución obligatoria:** agregar los datos en SQLite **antes** de construir el PBIX.

### 2. Modelo agregado (máx. ~100 filas por tabla de hechos)

Usar exactamente estas 3 tablas:

| Tabla | Filas aprox. | Origen |
|-------|--------------|--------|
| \`Totales\` | 1 | KPIs globales |
| \`VentasCategoria\` | 8 | ventas agrupadas por categoría |
| \`VentasProducto\` | 77 | ventas agrupadas por producto |

### 3. Consultas SQL obligatorias

**Totales** (1 fila):
\`\`\`sql
SELECT
    ROUND(SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)), 2) AS TotalVentas,
    COUNT(DISTINCT od.OrderID) AS TotalPedidos,
    SUM(od.Quantity) AS TotalUnidades
FROM "Order Details" od
\`\`\`

**VentasCategoria** (8 filas):
\`\`\`sql
SELECT
    c.CategoryID,
    c.CategoryName,
    ROUND(SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)), 2) AS TotalVentas,
    COUNT(DISTINCT od.OrderID) AS NumPedidos,
    SUM(od.Quantity) AS Unidades
FROM "Order Details" od
JOIN Products p ON p.ProductID = od.ProductID
JOIN Categories c ON c.CategoryID = p.CategoryID
GROUP BY c.CategoryID, c.CategoryName
ORDER BY TotalVentas DESC
\`\`\`

**VentasProducto** (77 filas):
\`\`\`sql
SELECT
    p.ProductID,
    p.ProductName,
    c.CategoryName,
    ROUND(SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)), 2) AS TotalVentas,
    SUM(od.Quantity) AS Unidades
FROM "Order Details" od
JOIN Products p ON p.ProductID = od.ProductID
LEFT JOIN Categories c ON c.CategoryID = p.CategoryID
GROUP BY p.ProductID, p.ProductName, c.CategoryName
ORDER BY TotalVentas DESC
\`\`\`

### 4. NO usar PBIP/TMDL manual

No generar \`.pbip\` a mano ni editar \`model.tmdl\` / \`database.tmdl\`.
Usar **\`pbix-mcp\`** (\`PBIXBuilder\` + API de servidor) para crear un \`.pbix\` nativo.

### 5. Visuales con campos enlazados

Los visuales no pueden quedar vacíos ("Seleccione o arrastre campos...").
Cada visual debe tener \`projections\` + \`query\` compilados.

**Medidas DAX** (nombres distintos a las columnas):
- \`KPI Ventas\` = \`MAX(Totales[TotalVentas])\` — formato \`$#,0.00\`
- \`KPI Pedidos\` = \`MAX(Totales[TotalPedidos])\` — formato \`#,0\`
- \`Ventas Categoria\` = \`SUM(VentasCategoria[TotalVentas])\` — formato \`$#,0.00\`

**Página:** \`Northwind Dashboard\` con 4 visuales:

| Visual | Tipo | Posición | Enlace |
|--------|------|----------|---------|
| KPI ventas | \`card\` | 20,20 — 300×120 | medida \`KPI Ventas\` |
| KPI pedidos | \`card\` | 340,20 — 300×120 | medida \`KPI Pedidos\` |
| Ventas por categoría | \`clusteredBarChart\` | 20,160 — 600×520 | eje: \`VentasCategoria[CategoryName]\`, valor: \`Ventas Categoria\` |
| Top productos | \`tableEx\` | 640,160 — 620×520 | columnas: CategoryName, ProductName, TotalVentas, Unidades de \`VentasProducto\` |

### 6. Herramienta y Python

- Instalar: \`pip install pbix-mcp\` en un **venv con Python 3.12** (3.14 puede fallar).
- Comando MCP en tu archivo de configuración de MCPs:
\`\`\`json
"powerbi": {
  "command": "/RUTA/AL/PROYECTO/tools/pbix-mcp-venv/bin/pbix-mcp-server",
  "args": []
}
\`\`\`
- Regenerar con:
\`\`\`bash
/RUTA/AL/PROYECTO/tools/pbix-mcp-venv/bin/python build_powerbi_report.py
\`\`\`

## Flujo de implementación que debes seguir

1. Crear \`tools/pbix-mcp-venv\` con Python 3.12 e instalar \`pbix-mcp\`.
2. Crear \`build_powerbi_report.py\` que:
   - Exporte las 3 tablas agregadas desde SQLite a CSV.
   - Construya el modelo con \`PBIXBuilder\` (página vacía).
   - Abra el PBIX con \`pbix_open\`.
   - Agregue los 4 visuales con \`compile_visual_binding\` (enlaces explícitos).
   - Guarde con \`pbix_save\`.
   - Valide que los 4 visuales tengan \`projections\` y \`query\`.
   - Genere \`northwind-powerbi-entregable.zip\`.
   - Escriba \`POWERBI_MANIFEST.json\`.
3. Ejecutar el script y confirmar tamaños:
   - \`northwind.pbix\` < 500 KB (esperado ~35 KB)
   - zip < 1 MB

## Criterios de aceptación

- El \`.pbix\` abre en Power BI Desktop **sin errores**.
- No aparece el error de límite de 10 MB.
- En vista **Informe** se ven los 4 visuales con datos.
- Tarjeta de ventas muestra un valor en millones (ej. ~$1.2M).
- Gráfico de barras muestra 8 categorías.
- Tabla muestra 77 productos.
- Vista **Modelo** tiene 3 tablas y 3 medidas.
- Zip entregable listo para enviar.

## Rutas a adaptar

- Base de datos: ruta absoluta a tu \`northwind.db\`
- Proyecto: ruta absoluta a tu carpeta de proyecto

## Lo que NO debes hacer

- No embeber 600k+ filas de \`Order Details\`.
- No generar PBIP con TMDL manual.
- No poner \`ref database\` vacío en TMDL.
- No usar nombres de medida iguales a columnas.
- No entregar un PBIX sin validar que los visuales tengan \`query\` enlazado.

Ejecuta todo tú mismo, crea los archivos, corre el script y entrégame las rutas finales
del \`.pbix\` y del \`.zip\`.`
export const powerBiRemotePrompt = `## Alternativa: construir el PBIX con el MCP remoto (sin Python local)

Este prompt complementa el prompt original de arriba; no lo reemplaza. Conserva sus tres consultas SQL, agregaciones, medidas DAX, página, cuatro visuales, posiciones y criterios de validación.

Usa únicamente los MCP remotos de SQLite Northwind y powerbi (pbix-mcp) ya conectados. No ejecutes comandos de terminal, no instales paquetes, no crees ni ejecutes scripts Python y no pidas acceso a Tailscale. El servidor pbix-mcp puede usar Python internamente en la VPS; los equipos de capacitación no deben instalarlo localmente.

1. Ejecuta por el MCP SQLite las tres consultas SQL del prompt original y recupera únicamente sus resultados agregados. No cargues la tabla completa Order Details. Comprueba que Totales tenga 1 fila, VentasCategoria 8 y VentasProducto 77.
2. Usa las herramientas de Power BI MCP directamente: crea el archivo con pbix_create usando exactamente las tres tablas, columnas, filas y las tres medidas del prompt original. No construyas un PBIP ni edites TMDL a mano.
3. Crea la página Northwind Dashboard y añade las cuatro visuales especificadas. En cada llamada a pbix_add_visual, proporciona enlaces explícitos de campos, projections y prototypeQuery; deja que el servidor compile query y dataTransforms. Inspecciona las cuatro visuales con las herramientas MCP y confirma que cada una tenga la consulta compilada. No entregues visuales vacías.
4. Guarda el PBIX con pbix_save en una ruta del servidor MCP que esté disponible para escritura, con un nombre único para el equipo. Valida el modelo, las medidas y el tamaño con las herramientas MCP disponibles.
5. No afirmes que entregaste archivos descargables si el MCP solo devuelve una ruta interna de la VPS. Si no hay una herramienta MCP para crear el ZIP o un enlace HTTPS de descarga, informa ese bloqueo explícitamente; no intentes resolverlo con Python local, terminal, Tailscale ni scripts.

Al final informa los resultados SQL, las filas por tabla, la validación de los cuatro visuales, el tamaño y la ruta real del PBIX, y si el PBIX/ZIP quedó accesible para descargar. No inventes ni simules resultados.`

export const deliverables = [
  'Un proyecto de Power BI (.pbix) comprimido en ZIP donde representen los datos que quieran de la base elegida.',
  'Una captura de pantalla de una respuesta del RAG que muestre claramente en qué chunks se basó la respuesta.',
]

export const gradingCriteria = [
  {
    title: 'Visualización en Power BI',
    description:
      '¿El reporte responde una pregunta clara sobre la base elegida? ¿Las medidas y gráficos tienen sentido?',
  },
  {
    title: 'RAG funcional',
    description:
      '¿El chat recupera contexto real de Pinecone y la respuesta cita información verificable de los chunks?',
  },
  {
    title: 'Evidencia de chunks',
    description:
      '¿La captura muestra la pregunta, la respuesta y los fragmentos (chunks) que alimentaron el contexto?',
  },
]

