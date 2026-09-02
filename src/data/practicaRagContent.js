export const sectionNav = [
  { id: 'paso-1', label: 'Bases de datos SQLite' },
  { id: 'paso-2', label: 'Cuenta y MCP Pinecone' },
  { id: 'paso-3', label: 'API Key OpenRouter' },
  { id: 'mcp-sqlite', label: 'MCP SQLite (configuración)' },
  { id: 'paso-4', label: 'Crear el RAG' },
  { id: 'paso-5', label: 'Chat web con el RAG' },
  { id: 'paso-6', label: 'MCP Power BI' },
  { id: 'entregables', label: 'Entregables' },
  { id: 'cierre', label: 'Cierre: quitar MCP Pinecone' },
]

export const sampleDatabases = [
  {
    id: 'northwind',
    label: 'jpwhite3/northwind-SQLite3',
    url: 'https://github.com/jpwhite3/northwind-SQLite3',
    fileName: 'northwind.db',
    downloadUrl:
      'https://raw.githubusercontent.com/jpwhite3/northwind-SQLite3/main/dist/northwind.db',
    description:
      'Catálogo de productos, clientes y órdenes comerciales.',
  },
  {
    id: 'chinook',
    label: 'lerocha/chinook-database',
    url: 'https://github.com/lerocha/chinook-database',
    fileName: 'chinook.db',
    downloadUrl:
      'https://raw.githubusercontent.com/lerocha/chinook-database/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite',
    description:
      'Tienda de música con canciones, artistas, géneros y ventas.',
  },
  {
    id: 'sakila',
    label: 'siara-cc/sakila_sqlite3',
    url: 'https://github.com/siara-cc/sakila_sqlite3',
    fileName: 'sakila.db',
    downloadUrl:
      'https://raw.githubusercontent.com/siara-cc/sakila_sqlite3/master/sakila.db',
    description:
      'Sistema de alquiler de películas con descripciones, reparto y categorías.',
  },
  {
    id: 'world',
    label: 'factbook/factbook.sql',
    url: 'https://github.com/factbook/factbook.sql',
    fileName: 'factbook.db',
    downloadUrl:
      'https://github.com/factbook/factbook.sql/releases/download/v0.1/factbook.db',
    description:
      'Datos demográficos con países, ciudades, idiomas y poblaciones.',
  },
  {
    id: 'imdb',
    label: 'hamzafoy/imdb_sqlite3_sequelize',
    url: 'https://github.com/hamzafoy/imdb_sqlite3_sequelize',
    fileName: 'movies.db',
    downloadUrl:
      'https://raw.githubusercontent.com/hamzafoy/imdb_sqlite3_sequelize/master/movies.db',
    description:
      'Metadatos de películas, directores, actores y valoraciones.',
  },
  {
    id: 'classicmodels',
    label: 'Yash-Kavaiya/Chatwithsql',
    url: 'https://github.com/Yash-Kavaiya/Chatwithsql',
    fileName: 'ClassicModels.db',
    downloadUrl:
      'https://raw.githubusercontent.com/Yash-Kavaiya/Chatwithsql/main/ClassicModels.db',
    description:
      'Empresa de venta de modelos a escala, clientes, pagos y empleados.',
  },
  {
    id: 'salesco',
    label: 'EAName/Database-Systems-and-Data-Preparation',
    url: 'https://github.com/EAName/Database-Systems-and-Data-Preparation',
    fileName: 'SalesCO.db',
    downloadUrl:
      'https://raw.githubusercontent.com/EAName/Database-Systems-and-Data-Preparation/main/data/sample/SalesCO.db',
    description:
      'Ventas comerciales con clientes, productos y territorios; esquema relacional amplio para practicar.',
  },
]

export const pineconeLinks = {
  signup: 'https://app.pinecone.io/',
  apiKeys: 'https://app.pinecone.io/',
}

export const pineconeMcpConfig = `{
  "mcpServers": {
    "pinecone": {
      "command": "npx",
      "args": [
        "-y",
        "@pinecone-database/mcp"
      ],
      "env": {
        "PINECONE_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}`

export const sqliteMcpConfig = `{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-server-sqlite-npx",
        "/ruta/a/tu/northwind.db"
      ]
    }
  }
}`

export const openRouterLinks = {
  signup: 'https://openrouter.ai/',
  apiKeys: 'https://openrouter.ai/keys',
  mcpDocs: 'https://openrouter.ai/docs/guides/overview/mcp-server',
}

export const openRouterMcpConfigOpencode = `{
  "mcp": {
    "openrouter": {
      "type": "remote",
      "url": "https://mcp.openrouter.ai/mcp",
      "enabled": true
    }
  }
}`

export const openRouterMcpConfigCursor = `{
  "mcpServers": {
    "openrouter": {
      "url": "https://mcp.openrouter.ai/mcp"
    }
  }
}`

export const ragSetupPrompt = `Tengo bases SQLite en la carpeta ~/datos/rag/ (ajusta la ruta si la tuya es distinta).
Elige una de ellas, léela usando el MCP de SQLite para explorar las tablas.
Convierte filas relevantes en chunks de texto y súbelos a Pinecone en un índice nuevo.
El nombre del índice lo eliges tú según la base y lo que indexaste.

IMPORTANTE: Para no superar el free tier de Pinecone, sube como máximo 1000 registros
de la base de datos. Selecciona las filas más representativas o relevantes.

Al crear este RAG, usa el MCP de OpenRouter con un fallback de 3 modelos gratuitos
(si uno falla, prueba el siguiente). Para embeddings, usa también un modelo gratuito si hace falta.
Documenta el nombre del índice, qué tablas indexaste y cuántos chunks subiste.`

export const chatUiPrompt = `En la carpeta ./rag-chat/ crea una página web mínima: solo un chat que consulte
el índice Pinecone que acabamos de crear (usa el nombre que definimos al armar el RAG).

Requisitos:
- HTML + CSS + JS vanilla (o el stack más simple posible).
- Campo de texto, botón enviar e historial de mensajes.
- Al preguntar, recupera chunks relevantes de Pinecone y responde con el contexto recuperado.
- Muestra en consola (o en un panel colapsable) los chunks usados como contexto.

No hagas login ni backend complejo: basta un servidor estático y llamadas desde el front
o un mini proxy local si lo necesitas.`

export const powerBiMcpConfig = `{
  "mcpServers": {
    "powerbi": {
      "command": "/RUTA/AL/PROYECTO/tools/pbix-mcp-venv/bin/pbix-mcp-server",
      "args": []
    }
  }
}`

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

export const mcpConfigPaths = [
  '.cursor/mcp.json',
  '.cursor/mcp.jsonc',
  '~/.config/opencode/opencode.json',
  'mcp.json',
  'mcp.jsonc',
  'Claude Desktop: claude_desktop_config.json',
]
