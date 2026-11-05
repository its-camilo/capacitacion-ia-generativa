export const courseSnapshot = {
  eyebrow: 'Propuesta · 4 sesiones · 2 horas cada una',
  title: 'IA generativa para la docencia',
  lead:
    'Cuatro sesiones de trabajo, no de conferencia. Cada profe trae el programa de su asignatura y sale con un entregable usable: un asistente del curso, un cuaderno con fuentes, una hoja analizada y un piloto de agente o flujo. Todo en el navegador, con la cuenta de la universidad y con las versiones gratuitas de ChatGPT y Claude.',
  facts: [
    { value: '40', label: 'respuestas en la encuesta' },
    { value: '2–3 / 5', label: 'nivel autopercibido' },
    { value: '35 / 40', label: 'traen portátil' },
    { value: '2 h', label: 'por sesión, en navegador' },
  ],
}

export const designChanges = [
  {
    title: 'La sesión 1 no es una comparativa',
    description:
      'El centro es formular buenas tareas, dar contexto, evaluar respuestas y escoger herramienta según la necesidad. Las diferencias entre ChatGPT, Gemini y Claude se muestran al final y como una foto que caduca: los modelos cambian cada mes.',
  },
  {
    title: 'La sesión 3 depende de las licencias',
    description:
      'Se plantea como «IA integrada a las herramientas de trabajo» con Gemini en Google Workspace, que es la suite de la cuenta @unal. Queda un plan B con Claude y sus conectores.',
  },
  {
    title: 'La sesión 4 se recorta a un piloto',
    description:
      'Datos, agentes, app de clase y flujo automatizado no caben completos en 2 horas. Se elige un camino por mesa (app interactiva o flujo automatizado) y se entrega un piloto, no un sistema terminado.',
  },
  {
    title: 'PDF a Markdown entra como truco de contexto',
    description:
      'Antes de trabajar un PDF con tablas o columnas, se le pide al chat que lo convierta a Markdown limpio, sin resumir. Menos ruido y menos tokens, sin instalar nada. Se usa en la sesión 2 para bibliografía y en la 4 para insumos.',
  },
]

export const sessionSummaries = [
  {
    session: '01',
    slug: 'fundamentos',
    label: 'Tareas y evaluación',
    title: 'Formular tareas, evaluar respuestas, elegir herramienta',
    focus:
      'Cómo pedirle algo a la IA de forma que sirva para enseñar, cómo revisar lo que devuelve y qué herramienta usar según la tarea.',
    deliverable: 'Habilidad o Proyecto «Asistente de mi curso» + parcial con rúbrica, clave y archivo para Moodle.',
    tools: 'Gemini · ChatGPT · Claude · Moodle',
    tag: 'Prompting aplicado',
  },
  {
    session: '02',
    slug: 'rag',
    label: 'NotebookLM',
    title: 'RAG sin código: el cuaderno del curso',
    focus:
      'Responder con sus documentos y citar la fuente. Cuaderno con programa, lecturas y artículos, material derivado y compartido con estudiantes.',
    deliverable: 'Cuaderno compartido con estudiantes + guía de estudio.',
    tools: 'NotebookLM',
    tag: 'RAG sin código',
  },
  {
    session: '03',
    slug: 'mcp',
    label: 'Herramientas',
    title: 'IA dentro de las herramientas de trabajo',
    focus:
      'La IA donde ya trabaja: documentos, hojas, correo y presentaciones con Gemini en Google Workspace.',
    deliverable: 'Hoja analizada con datos ficticios + 3 retroalimentaciones en borrador + presentación corta.',
    tools: 'Gemini en Workspace · Conectores de Claude',
    tag: 'Google Workspace',
  },
  {
    session: '04',
    slug: 'agentes',
    label: 'Agentes y flujos',
    title: 'Agentes y flujos: un piloto para su clase',
    focus:
      'De chatbot a agente, datos que se pueden y no se pueden entregar, y un piloto: app interactiva de clase o flujo automatizado.',
    deliverable: 'Piloto funcionando + ficha de una página + demostración de 2 minutos.',
    tools: 'Deep Research · Claude Artifacts · Gemini Canvas · Forms · Apps Script o Make',
    tag: 'Piloto en clase',
  },
]

export const formatRules = [
  { label: '15 min de idea', detail: 'Un concepto, un ejemplo y una advertencia. Sin historia de la IA.' },
  { label: '90 min de práctica', detail: 'Pasos con tiempo asignado, sobre el programa de su propia asignatura.' },
  { label: '15 min de entregable', detail: 'Se termina en clase y se comparte el enlace. Lo que no se alcanza queda como tarea corta.' },
  { label: 'Datos ficticios', detail: 'Todo ejercicio con notas o estudiantes usa datos inventados. Nunca datos reales.' },
  { label: 'Navegador y cuenta UNAL', detail: 'Gemini, NotebookLM, ChatGPT y Claude con sesión iniciada en la cuenta @unal.edu.co.' },
  { label: 'Grabación', detail: 'Pendiente de confirmar. La encuesta mostró demanda de opción virtual o grabada.' },
]

export const entersAndLeaves = {
  entra: [
    'NotebookLM completo: cuaderno, citas, guía, mapa mental, audio y video.',
    'Habilidades (antes Gems) y Proyectos como asistentes del curso, sin código.',
    'Conectores de un clic y MCP contado sin JSON.',
    'Moodle: preguntas en GIFT y Aiken, rúbricas y retroalimentación.',
    'Comparación de herramientas por necesidad, no por marca.',
    'Datos, privacidad y límites de los detectores de IA.',
  ],
  sale: [
    'Pinecone, OpenRouter y la interfaz web del RAG.',
    'MCP de SQLite y Power BI con archivos de configuración.',
    'Northwind, OpenCode y el laboratorio de Transformers.',
    'Tokens y costos en detalle.',
    'La comparativa larga entre modelos como eje de la sesión 1.',
  ],
}

const toolLinks = [
  { label: 'Gemini', url: 'https://gemini.google.com', provider: 'Google' },
  { label: 'ChatGPT', url: 'https://chatgpt.com', provider: 'OpenAI' },
  { label: 'Claude', url: 'https://claude.ai', provider: 'Anthropic' },
]

const moodleLinks = [
  { label: 'Formato GIFT', url: 'https://docs.moodle.org/en/GIFT_format', provider: 'Moodle' },
  { label: 'Formato Aiken', url: 'https://docs.moodle.org/en/Aiken_format', provider: 'Moodle' },
]

const s1Docs = {
  carpeta: { label: 'Carpeta con todo el material', url: 'https://drive.google.com/drive/folders/1k7NvsQHdvqo_-4D6wCoeQxTtDs7sNYNt', provider: 'Drive' },
  traer: { label: '00 Qué traer a la sesión', url: 'https://docs.google.com/document/d/1nSSC6pQqDdC9Fg2X3lx7b5CbEwG35jSPG-6MgylHCm4/edit', provider: 'Docs' },
  programa: { label: '01 Programa Microeconomía I', url: 'https://docs.google.com/document/d/1UzHhCqBU7IhZtu8lIrh6Zrm_1QQ4Pmwo5J5mRoPVjM0/edit', provider: 'Docs' },
  programaPdf: { label: '01 Programa (PDF para adjuntar)', url: 'https://drive.google.com/file/d/1Q7xcslivKtUMifqT9yAx_T3Z-GfRYtQ5/view', provider: 'PDF' },
  parcial: { label: '02 Parcial anterior con clave', url: 'https://docs.google.com/document/d/1fMZAiwE7L8Ma-UBy_ohTnOIeDJbxoyca7hLVMYK98d8/edit', provider: 'Docs' },
  tarea: { label: '03 Tarea hecha con IA', url: 'https://docs.google.com/document/d/1V_vnITlPg3oQQZkqBX8--dNdwosHbMGcPQbiux73Rak/edit', provider: 'Docs' },
  rubrica: { label: '04 Rúbrica de desarrollo', url: 'https://docs.google.com/document/d/1xETwUOeJ_2ikn4JSM3kXMHCnWGqNWcXGinBhoC4e2yY/edit', provider: 'Docs' },
  respuesta: { label: '05 Respuesta de estudiante E07', url: 'https://docs.google.com/document/d/1RkQWT3C5Gdk1Iv0-RLN98aykKQw12aj0A2a--xVdkmw/edit', provider: 'Docs' },
}

const s234Docs = {
  carpeta: { label: 'Carpeta con todo el material', url: 'https://drive.google.com/drive/folders/1k7NvsQHdvqo_-4D6wCoeQxTtDs7sNYNt', provider: 'Drive' },
  lectura1: { label: 'S2-02 Lectura 1 · Oferta, demanda y equilibrio', url: 'https://docs.google.com/document/d/1nge5stWMQDjvxN9BPDEuH6H3UGdckEJWJs7ENDp7fCw/edit', provider: 'Docs' },
  lectura2: { label: 'S2-03 Lectura 2 · Elasticidades', url: 'https://docs.google.com/document/d/1V2ctz7I-62hsX6QQ-FQlW1aS4Fs1Licj2AWF4x7-7rs/edit', provider: 'Docs' },
  articulo: { label: 'S2-04 Artículo · Controles de precios', url: 'https://docs.google.com/document/d/1c6iZSVeaXz7IAcFELMPmiRkTffwsnI6bkPyKA3yJvYM/edit', provider: 'Docs' },
  transcripcion: { label: 'S2-05 Transcripción de clase · Semana 4', url: 'https://docs.google.com/document/d/1F1gku4b1dZj1RUAn0iCKz5tw2K5QRmGTDJcngPIyaFc/edit', provider: 'Docs' },
  notas: { label: 'S3-01 Notas ficticias del grupo', url: 'https://docs.google.com/spreadsheets/d/1Q3JPJyBOLXjz3XAxIaZn8p6Vj9h24UYakskBx3yh90o/edit', provider: 'Sheets' },
  apuntes: { label: 'S3-02 Apuntes · Unidad 2 Elasticidades', url: 'https://docs.google.com/document/d/1vgkN4w_RGqnxOd7Mk-IPCfybXORO3E-sVXpN5JAKUmA/edit', provider: 'Docs' },
  reflexiones: { label: 'S4-01 Respuestas ficticias de reflexión', url: 'https://docs.google.com/spreadsheets/d/1VJspt6TLy7wmZgXpTzUOteLfDEwsp1N8THHHmgds7VU/edit', provider: 'Sheets' },
}

const s1Entregas = {
  formulario: { label: 'Formulario de entregables', url: 'https://docs.google.com/forms/d/e/1FAIpQLSe9G_ktvdYvwZfpVqgBnxbOVoEmOkz1m-ZI3p_e17XOJYlAXg/viewform', provider: 'Forms' },
  kahoot: { label: 'Iniciar el Kahoot (facilitador)', url: 'https://create.kahoot.it/details/sesion-1-ia-generativa-para-profesores-uifce/01334253-1075-4f3e-8bfc-6d92cda205d1', provider: 'Kahoot' },
}

export const profesorSessions = {
  fundamentos: {
    session: '01',
    title: 'Formular tareas, evaluar respuestas, elegir herramienta',
    lead:
      'La IA no llega a reemplazar el criterio docente: llega a producir borradores. Esta sesión entrena cuatro gestos que sirven con cualquier modelo: convertir una intención en una tarea clara, darle contexto del curso, revisar lo que vuelve y elegir la herramienta según la tarea.',
    meta: [
      { label: 'Duración', value: '2 horas' },
      { label: 'Formato', value: '15 idea · 90 práctica · 15 entregable' },
      { label: 'Requiere', value: 'Portátil y sesión iniciada con la cuenta @unal en Gemini, ChatGPT y Claude' },
      { label: 'Traer', value: 'Programa, un parcial ya aplicado con clave, una rúbrica, los acuerdos del curso y una tarea que ya hizo con IA' },
    ],
    agenda: [
      { time: '15 min', label: 'Idea', detail: 'Qué hace un LLM, qué no subir, fórmula de tarea, evaluación y elección de herramienta.' },
      { time: '10 min', label: 'Práctica 1', detail: 'Reescribir una tarea real que ya haya hecho con IA.' },
      { time: '25 min', label: 'Práctica 2', detail: 'Parcial con rúbrica y clave a partir del programa.' },
      { time: '15 min', label: 'Práctica 3', detail: 'Pasar las preguntas a Moodle en GIFT o Aiken.' },
      { time: '20 min', label: 'Práctica 4', detail: 'Construir el «Asistente de mi curso»: habilidad en Gemini o Proyecto en ChatGPT o Claude.' },
      { time: '20 min', label: 'Práctica 5', detail: 'Guía de corrección de errores para seguir mejorando el asistente después de la sesión.' },
      { time: '15 min', label: 'Entregable', detail: 'Subir los pantallazos del asistente y el PDF del parcial; cerrar con el Kahoot.' },
    ],
    goals: [
      'Convertir una tarea de su curso en un encargo que la IA pueda ejecutar y usted pueda evaluar.',
      'Detectar errores, referencias inventadas y sesgos antes de usar una respuesta.',
      'Llevar un parcial a Moodle sin pegar pregunta por pregunta.',
      'Dejar un asistente reutilizable con el programa y los acuerdos de su curso.',
    ],
    sections: [
      {
        id: 'idea',
        mascot: 'alerta',
        eyebrow: 'Idea · 15 min',
        title: 'Lo que hay que entender antes de escribir un prompt',
        blocks: [
          {
            type: 'callout',
            tone: 'ok',
            title: 'Material de ejemplo para toda la sesión',
            text: 'Si no trajo su propio material, use el de ejemplo: un curso ficticio de **Microeconomía I** con programa, parcial, rúbrica y una respuesta de estudiante. Todo es inventado, así que se puede subir a cualquier herramienta. En cada práctica encontrará el enlace directo al documento que necesita.',
          },
          { type: 'links', items: [s1Docs.carpeta, s1Docs.traer] },
          {
            type: 'p',
            text: 'Un modelo de lenguaje no busca la respuesta en un archivo: calcula el texto que sigue. Puede sonar seguro, ordenar ideas y escribir en segundos, pero no sabe si lo que dice es cierto. Su trabajo es proponer; el suyo es decidir.',
          },
          {
            type: 'p',
            text: '**Tres consecuencias para la docencia.** Inventa datos y referencias cuando no tiene la información. No conoce su programa, su grupo ni sus acuerdos si usted no se los da. Y reproduce los promedios y sesgos de lo que leyó.',
          },
          {
            type: 'callout',
            tone: 'warn',
            title: 'Qué no se sube',
            text: 'Nombres, cédulas, correos, notas, historias clínicas, trabajos de estudiantes sin permiso ni exámenes que aún no se han aplicado. Si necesita ejemplos, use datos ficticios o reemplace el nombre por un código.',
          },
          {
            type: 'callout',
            tone: 'ok',
            title: 'Privacidad según la cuenta: qué cubre la licencia de la universidad',
            text: '**Gemini y Gemini Notebook (NotebookLM) con la cuenta @unal** están cubiertos por el contrato de Google Workspace for Education de la universidad: lo que escribe y los archivos que sube no los revisan personas ni se usan para entrenar modelos de IA, y no salen de la organización sin su permiso. **ChatGPT y Claude** no tienen contrato con la universidad: aunque entre con el correo @unal, es una cuenta personal gratuita. Ahí desactive el entrenamiento (ChatGPT: Configuración → Controles de datos → «Mejorar el modelo para todos»; Claude: Configuración → Privacidad → «Ayudar a mejorar Claude») y suba solo material público o ficticio. En ningún caso la licencia autoriza subir datos personales de estudiantes: la regla de qué no se sube aplica igual.',
          },
          {
            type: 'callout',
            tone: 'ok',
            title: 'Seguridad de sus cuentas',
            text: '**Una contraseña distinta para cada servicio:** si se filtra la de ChatGPT, no deben caer también el correo @unal ni el banco. **Use un gestor de contraseñas** (Google Password Manager ya viene en Chrome; Bitwarden es gratuito) para crearlas largas y no tener que recordarlas. **Active la verificación en dos pasos** en la cuenta @unal, en ChatGPT y en Claude, con una app de autenticación o la notificación del celular. Y no comparta la cuenta con monitores ni la deje abierta en los PC de la sala: cierre sesión al terminar.',
          },
          {
            type: 'p',
            text: '**La fórmula mínima de una tarea.** Contexto · Solicitud · Formato · Restricciones. Si la tarea es grande, agregue rol y un ejemplo de lo que espera.',
          },
          {
            type: 'table',
            headers: ['Pedido vago', 'Tarea bien formulada'],
            rows: [
              [
                'Hazme un parcial de mi curso',
                'Actúa como profesor de Cálculo I. Con el programa adjunto, diseña un parcial de 5 preguntas sobre límites y continuidad para primer semestre. Formato: 3 de selección múltiple y 2 de desarrollo. Incluye clave y rúbrica de 5 puntos. No uses temas que no estén en el programa.',
              ],
              [
                'Explícame este tema',
                'Con este capítulo (adjunto), prepara una explicación de 10 minutos para clase, con una analogía cotidiana, un error frecuente y 2 preguntas para verificar comprensión. Nivel: segundo semestre.',
              ],
              [
                'Corrige esto',
                'Evalúa esta respuesta con la rúbrica adjunta. Señala qué criterio cumple y cuál no, cita la parte del texto que lo demuestra y propone una retroalimentación de 3 líneas. No reescribas la respuesta del estudiante.',
              ],
            ],
          },
          {
            type: 'p',
            text: '**Evaluar antes de usar.** La IA no califica sola: propone una nota. Use esta lista en cada respuesta que piense entregar o usar en clase.',
          },
          {
            type: 'checklist',
            items: [
              'Responde exactamente la tarea que pidió, no una versión más fácil o más general.',
              'Los datos, fechas y referencias existen y se pueden abrir.',
              'El nivel y el vocabulario corresponden al curso, no a un posgrado.',
              'La clave es coherente con el enunciado y con la rúbrica.',
              'No hay generalizaciones sobre estudiantes, regiones o grupos.',
              'Usted puede defender cada ítem frente a un estudiante.',
            ],
          },
          {
            type: 'p',
            text: '**Elegir herramienta según la necesidad, no según la marca.** La comparación entre ChatGPT, Gemini y Claude es una foto que caduca: cambian cada mes. Esta tabla se lee por tarea.',
          },
          {
            type: 'table',
            headers: ['Necesidad', 'Herramienta que suele ir mejor', 'Por qué'],
            rows: [
              ['Leer documentos largos y citar la fuente', 'NotebookLM', 'Trabaja solo con lo que usted sube y muestra la cita.'],
              ['Escribir o editar dentro del documento', 'Gemini en Docs', 'No hay que copiar y pegar; respeta el formato.'],
              ['Razonamiento largo, código o análisis de datos', 'Claude o ChatGPT', 'Mejor manejo de contextos extensos y de archivos.'],
              ['Búsqueda con fuentes actuales', 'ChatGPT, Gemini o Claude con búsqueda web', 'Verifique siempre los enlaces antes de citar.'],
            ],
          },
          {
            type: 'note',
            text: 'En la práctica vamos a comparar dos respuestas al mismo pedido, pero el objetivo no es elegir un ganador: es notar qué cambia el contexto y el formato.',
          },
        ],
      },
      {
        id: 'practica-1',
        mascot: 'explicando',
        eyebrow: 'Práctica 1 · 10 min',
        title: 'Reescribir una tarea real',
        blocks: [
          {
            type: 'p',
            text: 'Elija una tarea que ya haya hecho con IA esta semana: un correo, una guía, un parcial, una retroalimentación. Péguela tal como la escribió. No la mejore todavía.',
          },
          {
            type: 'note',
            text: '**Con el material de ejemplo:** abra **03 Tarea hecha con IA**, pegue el pedido original («hazme un taller de elasticidades para mis estudiantes») y luego la versión 2 del mismo documento, adjuntando **01 Programa**. Compare idioma, nivel y si respeta el Corte 1.',
          },
          { type: 'links', items: [s1Docs.tarea, s1Docs.programaPdf] },
          {
            type: 'numbered',
            items: [
              'Escriba la versión actual en una hoja o en el chat.',
              'Marque qué le falta: ¿contexto del curso?, ¿formato?, ¿restricciones?, ¿ejemplos?',
              'Reescriba con la fórmula y ejecute las dos versiones en la misma herramienta.',
              'Anote dos diferencias concretas: qué mejoró y qué sigue mal.',
            ],
          },
          {
            type: 'prompt',
            label: 'Plantilla para la versión 2',
            text: `Actúa como [rol: profesor, coordinador, tutor] de [asignatura] para estudiantes de [semestre/nivel].

Contexto: [programa, tema, lectura, acuerdo o criterio que debe respetar].
Solicitud: [producto concreto: parcial, guía, correo, retroalimentación, diapositivas].
Formato: [extensión, estructura, tabla, pasos, tono].
Restricciones: [no inventar, no salir del programa, citar la fuente, pedir datos faltantes].
Antes de responder, hazme las preguntas que necesites.`,
          },
          {
            type: 'note',
            text: 'Si el resultado sigue siendo genérico, el problema casi siempre es el contexto, no el modelo.',
          },
          { type: 'links', items: toolLinks },
        ],
      },
      {
        id: 'practica-2',
        mascot: 'pensando',
        eyebrow: 'Práctica 2 · 25 min',
        title: 'Parcial con rúbrica y clave',
        blocks: [
          {
            type: 'p',
            text: 'Use el programa de su asignatura y un corte real. La IA puede proponer el parcial, pero usted decide qué entra y con qué nivel. Adjunte el programa y, si tiene, un parcial anterior como ejemplo de formato.',
          },
          {
            type: 'note',
            text: '**Con el material de ejemplo:** adjunte **01 Programa** y **02 Parcial anterior**. En el prompt use Microeconomía I, corte 1 (oferta, demanda, equilibrio, excedentes, controles de precios, impuestos y elasticidades), 5 preguntas (3 de selección múltiple, 1 de desarrollo y 1 de caso), segundo semestre y 90 minutos. Pida que use el parcial anterior solo como ejemplo de formato y la estructura de **04 Rúbrica**.',
          },
          { type: 'links', items: [s1Docs.programaPdf, s1Docs.parcial, s1Docs.rubrica] },
          {
            type: 'prompt',
            label: 'Prompt base para el parcial',
            text: `Con el programa adjunto de [asignatura], diseña un parcial de [N] preguntas para el corte [tema].

Mezcla así: [X] de selección múltiple, [Y] de desarrollo y [Z] de aplicación a un caso.
Nivel: [semestre]. Duración: [minutos]. Cada pregunta debe evaluar un resultado de aprendizaje del programa.

Entrega en este orden:
1. Tabla de especificaciones: resultado, tema, nivel cognitivo y peso.
2. Examen sin respuestas.
3. Clave con justificación de la respuesta correcta y de por qué fallan las otras.
4. Rúbrica de [N] puntos para las preguntas de desarrollo.

Restricciones: no incluyas temas que no estén en el programa, no uses datos de estudiantes y no inventes referencias.`,
          },
          {
            type: 'p',
            text: '**Antes de dar por bueno el parcial**, revise lo siguiente:',
          },
          {
            type: 'checklist',
            items: [
              'Cada pregunta se puede responder con lo visto en clase.',
              'La clave no depende de una interpretación que usted no enseñó.',
              'Las opciones incorrectas son plausibles, no relleno obvio.',
              'El tiempo cabe en el tiempo real del examen.',
              'Usted resolvió el examen completo antes de guardarlo.',
            ],
          },
          {
            type: 'callout',
            tone: 'ok',
            title: 'Pida crítica, no otra versión',
            text: 'Agregue: «Encuentra 3 preguntas ambiguas, 2 que se respondan con el texto y 1 que no se pueda responder con el programa». Eso convierte al modelo en revisor y lo obliga a justificar.',
          },
          {
            type: 'note',
            text: 'No entregue un parcial sin resolverlo usted primero. La IA puede escribir la clave y equivocarse en la misma pregunta.',
          },
          {
            type: 'note',
            text: 'Si un prompt largo llega cortado o la IA responde «no puedo ayudarte con eso», pegue el prompt completo de nuevo o use **Reintentar**. Suele salir bien al segundo intento.',
          },
          { type: 'links', items: toolLinks },
        ],
      },
      {
        id: 'practica-3',
        mascot: 'senalando',
        eyebrow: 'Práctica 3 · 15 min',
        title: 'Moodle sin pegar pregunta por pregunta',
        blocks: [
          {
            type: 'p',
            text: 'Moodle importa preguntas desde archivos de texto. Los dos formatos más útiles para empezar son **Aiken** (selección múltiple simple) y **GIFT** (más opciones: retroalimentación, verdadero/falso, emparejamiento y respuestas múltiples).',
          },
          {
            type: 'table',
            headers: ['Formato', 'Cuándo usarlo', 'Límite práctico'],
            rows: [
              ['Aiken', 'Muchas preguntas de selección múltiple con una sola respuesta.', 'No admite retroalimentación por opción ni emparejamiento.'],
              ['GIFT', 'Cuando necesita retroalimentación, varios tipos o comentarios.', 'La sintaxis es más estricta; un carácter mal puesto rompe la pregunta.'],
              ['Ensayo', 'Preguntas abiertas que usted va a calificar.', 'Se importan, pero no se califican solas.'],
            ],
          },
          {
            type: 'prompt',
            label: 'Convertir el parcial a Aiken',
            text: `Convierte estas preguntas de selección múltiple al formato Aiken para Moodle.

Reglas:
- Una respuesta correcta por pregunta, marcada con ANSWER: [letra].
- No numeres las preguntas.
- Usa UTF-8 y conserva tildes y signos.
- No agregues explicaciones dentro del archivo.

Devuélveme solo el texto plano dentro de un bloque de código, listo para guardar como preguntas.txt.`,
          },
          {
            type: 'note',
            text: 'Use las preguntas de selección múltiple del parcial que hizo en la Práctica 2. Si no alcanzó a terminarlo, convierta las de **02 Parcial anterior**.',
          },
          { type: 'links', items: [s1Docs.parcial] },
          {
            type: 'prompt',
            label: 'Ejemplo del resultado esperado',
            text: `¿Cuál es la capital de Colombia?
A. Bogotá
B. Lima
C. Quito
ANSWER: A

¿Qué estudia la cinemática?
A. Las fuerzas
B. El movimiento sin causas
C. La energía
ANSWER: B`,
          },
          {
            type: 'numbered',
            items: [
              'En Moodle, entre al curso y abra el Banco de preguntas.',
              'Elija Importar y seleccione el formato (Aiken o GIFT).',
              'Suba el archivo .txt y escoja la categoría donde quedará.',
              'Importe y revise pregunta por pregunta: tildes, opciones y respuesta correcta.',
              'Agregue el parcial, configure el tiempo y verifique la calificación automática.',
            ],
          },
          {
            type: 'note',
            text: 'Aiken no admite retroalimentación por opción. Si la necesita, use GIFT o edite la pregunta después de importar. Verifique siempre la codificación UTF-8 para que las tildes no se rompan.',
          },
          { type: 'links', items: moodleLinks },
        ],
      },
      {
        id: 'practica-4',
        mascot: 'feliz',
        eyebrow: 'Práctica 4 · 20 min',
        title: 'El asistente que conoce mi curso',
        blocks: [
          {
            type: 'p',
            text: 'Una **habilidad** en Gemini o un **Proyecto** en ChatGPT o Claude son la misma idea: instrucciones que se quedan guardadas y archivos que el modelo usa en cada conversación. Deja de repetir el contexto del curso y empieza a tener un asistente estable.',
          },
          {
            type: 'callout',
            tone: 'warn',
            title: 'Los Gems ahora son habilidades',
            text: 'Desde el 17 de noviembre de 2026, Gemini migra los Gems a **habilidades**. Con la cuenta @unal no aparece el menú de Gems: cree directamente una habilidad.',
          },
          {
            type: 'numbered',
            items: [
              'En gemini.google.com abra **Personalizar** (barra lateral) y luego la pestaña **Habilidades**.',
              'Pulse **Crear → Crear manualmente**.',
              'Escriba el nombre y una **descripción** (es obligatoria; sin ella no guarda).',
              'Pegue las instrucciones y, en **Añadir archivos**, suba el programa en PDF. Pulse **Crear**.',
              'Para usarla, en un chat nuevo escriba **@** y elija su habilidad, o en la habilidad use **⋯ → Usar ahora**.',
              'En ChatGPT o Claude: cree un **Proyecto**, pegue las instrucciones del asistente y suba los archivos del curso.',
            ],
          },
          {
            type: 'p',
            text: '**Qué poner en las instrucciones.** Rol y curso · programa y acuerdos · nivel y tono · qué produce y en qué formato · restricciones · cuándo debe decir «no está en los materiales».',
          },
          {
            type: 'prompt',
            label: 'Instrucciones del Asistente de mi curso',
            text: `Eres el asistente de [nombre del curso], de [programa], para estudiantes de [semestre].
Tu fuente principal son los archivos adjuntos: programa, lecturas y rúbricas.

Responde en español, con tono [formal/cercano], en párrafos cortos.
Cuando te pidan material de clase, entrega [formato: guía, preguntas, explicación, retroalimentación].
Cuando te pidan calificar, usa la rúbrica adjunta y explica cada criterio antes de proponer una nota.

Reglas:
- No inventes fuentes, datos ni acuerdos que no estén en los archivos.
- Si falta información, di qué falta y pregunta antes de responder.
- Si la pregunta está fuera del programa, dilo y ofrece el tema más cercano.
- No pidas ni proceses datos personales de estudiantes.
- No cites libros ni autores que no estén en los archivos.
- Cierra las respuestas de contenido con la fuente o el archivo en que te apoyaste.`,
          },
          {
            type: 'p',
            text: '**Archivos que valen la pena.** Programa, lecturas obligatorias, parciales anteriores con su clave, rúbricas y acuerdos del curso. **No** suba listas de notas, trabajos de estudiantes ni exámenes que aún no ha aplicado.',
          },
          {
            type: 'note',
            text: '**Con el material de ejemplo:** cree la habilidad o el Proyecto con **01 Programa** (PDF), **02 Parcial** y **04 Rúbrica**, y en las instrucciones ponga Microeconomía I, Economía, segundo semestre y tono cercano.',
          },
          { type: 'links', items: [s1Docs.programaPdf, s1Docs.parcial, s1Docs.rubrica] },
          {
            type: 'p',
            text: 'Pruebe el asistente con tres preguntas: una conceptual, una de nota y una fuera del programa. La tercera es la más importante: debe reconocer que no está en los materiales.',
          },
          {
            type: 'prompt',
            label: 'Preguntas de prueba (material de ejemplo)',
            text: `1. ¿Qué diferencia hay entre un cambio en la cantidad demandada y un cambio en la demanda?
2. Si entrego un taller 2 días tarde, ¿cuánto pierdo? ¿Puedo usar IA en el parcial?
3. Explícame la teoría de juegos y el equilibrio de Nash.`,
          },
          {
            type: 'note',
            text: '**Prueba extra:** pegue **05 Respuesta de estudiante E07** y pida calificarla con la rúbrica. Un buen asistente detecta que el estudiante habla de «exceso de oferta» cuando debía decir escasez.',
          },
          { type: 'links', items: [s1Docs.respuesta, s1Docs.rubrica] },
          {
            type: 'note',
            text: 'Si el PDF no sube dentro de la habilidad, adjúntelo en el chat o pegue en las instrucciones los acuerdos del curso y la lista de temas.',
          },
          {
            type: 'note',
            text: 'Las habilidades de Gemini no se comparten con enlace: use **⋯ → Descargar** y pase el archivo, que el colega sube con **Sustituir habilidad** o al crear la suya. Compartir un Proyecto no siempre comparte los archivos: pruebe con otra cuenta.',
          },
          { type: 'links', items: toolLinks },
        ],
      },
      {
        id: 'practica-5',
        mascot: 'pensando',
        eyebrow: 'Práctica 5 · 20 min',
        title: 'Guía de corrección de errores para el trabajo a futuro',
        blocks: [
          {
            type: 'p',
            text: 'El asistente y los prompts que armó hoy los va a seguir usando. Cuando algo salga mal en su trabajo diario, no empiece de cero: identifique el síntoma, cambie una sola cosa y vuelva a probar. Esta guía queda para consultarla después de la sesión.',
          },
          {
            type: 'table',
            headers: ['Síntoma', 'Causa probable', 'Qué hacer'],
            rows: [
              ['Respuestas correctas pero genéricas', 'Falta contexto del curso', 'Agregue programa, nivel y un ejemplo de lo que espera.'],
              ['Cita una fuente que no dice eso', 'El modelo completó con lo que «suena bien»', 'Pida la cita textual y búsquela en el archivo. Si no aparece, elimine la referencia.'],
              ['Inventa un acuerdo del curso', 'El acuerdo no está en los archivos', 'Suba el documento del acuerdo y refuerce la regla de no inventar.'],
              ['Califica con otra rúbrica', 'No leyó la rúbrica o la resumió', 'Adjunte la rúbrica y pida criterio por criterio antes de la nota.'],
              ['Responde con demasiado texto', 'No fijó formato ni extensión', 'Pida tabla o lista y un máximo de líneas.'],
              ['Responde algo fuera del programa', 'Falta la regla de los límites', 'Agregue: «si no está en los materiales, dilo y ofrece el tema más cercano».'],
              ['Ignora el PDF que subió', 'El archivo no cargó o es una imagen escaneada', 'Vuelva a subirlo, adjúntelo en el chat o pegue el texto.'],
              ['Se corta o dice «no puedo ayudarte»', 'Prompt muy largo o filtro momentáneo', 'Pegue el prompt completo de nuevo o use Reintentar.'],
              ['Tildes rotas al importar en Moodle', 'El archivo no quedó en UTF-8', 'Guárdelo como .txt en UTF-8 y vuelva a importar.'],
            ],
          },
          {
            type: 'numbered',
            items: [
              'Guarde el prompt y la respuesta que fallaron.',
              'Busque el síntoma en la tabla.',
              'Cambie una sola cosa: el contexto, el formato, una regla o un archivo.',
              'Repita la misma solicitud de prueba para comparar.',
              'Si funcionó, pase el ajuste a las instrucciones de la habilidad o del Proyecto para que no se repita.',
            ],
          },
          {
            type: 'prompt',
            label: 'Pedirle a la IA que diagnostique su propio error',
            text: `Esta fue mi solicitud: [pegue el prompt].
Esta fue tu respuesta: [pegue la respuesta].
El problema es: [qué salió mal].

Explica qué parte de mi solicitud o de tus instrucciones causó el error y propón un cambio concreto a las instrucciones del asistente. No reescribas toda la respuesta.`,
          },
          {
            type: 'note',
            text: 'Haga ahora el primer ciclo con el error más claro que encontró en su asistente durante la Práctica 4. Si quiere, use **05 Respuesta de estudiante E07** y **04 Rúbrica** para probar la calificación.',
          },
          { type: 'links', items: [s1Docs.rubrica, s1Docs.respuesta] },
        ],
      },
      {
        id: 'entregable',
        mascot: 'despedida',
        eyebrow: 'Entregable · 15 min',
        title: 'Lo que se lleva',
        blocks: [
          {
            type: 'p',
            text: 'Suba estos cuatro archivos en el formulario de entregables, con su cuenta @unal:',
          },
          {
            type: 'list',
            items: [
              'Pantallazo de las **instrucciones** de su habilidad o Proyecto.',
              'Pantallazo de los **archivos** cargados en la habilidad o el Proyecto.',
              'Pantallazo de **una solicitud de ejemplo** de la Práctica 4 y la respuesta del asistente.',
              '**PDF del parcial revisado**, con tabla de especificaciones, clave y rúbrica.',
            ],
          },
          { type: 'links', items: [s1Entregas.formulario] },
          {
            type: 'note',
            text: 'Para cerrar, el facilitador abre el Kahoot de la sesión: 10 preguntas sobre lo que vimos hoy. Únase desde el celular en kahoot.it con el PIN que aparece en pantalla.',
          },
          { type: 'links', items: [s1Entregas.kahoot] },
        ],
        criteria: [
          { title: 'Tarea bien formulada', description: 'La instrucción tiene contexto, solicitud, formato y restricciones verificables.' },
          { title: 'Evaluación real', description: 'Se identifican errores concretos y se corrigen; no se acepta la respuesta por apariencia.' },
          { title: 'Uso del curso', description: 'El parcial y el asistente se apoyan en el programa y los acuerdos de la asignatura.' },
        ],
      },
    ],
    next: { label: 'Sesión 02 · NotebookLM', slug: 'rag' },
  },

  rag: {
    session: '02',
    title: 'RAG sin código: el cuaderno del curso',
    lead:
      'Un cuaderno que responde con el programa, las lecturas y los artículos del curso, y que muestra de dónde saca cada frase. Sin embeddings a la vista, sin configurar nada: la lógica de RAG contada en una diapositiva y el resto del tiempo construyendo el cuaderno.',
    meta: [
      { label: 'Duración', value: '2 horas' },
      { label: 'Formato', value: '15 idea · 90 práctica · 15 entregable' },
      { label: 'Requiere', value: 'Cuenta @unal con NotebookLM habilitado' },
      { label: 'Traer', value: 'Programa, 2 lecturas y 2 artículos del curso' },
    ],
    agenda: [
      { time: '15 min', label: 'Idea', detail: 'Qué es RAG, qué resuelve y qué no, y por qué la cita es la diferencia.' },
      { time: '10 min', label: 'Práctica 1', detail: 'Reunir y nombrar 5–8 fuentes del curso.' },
      { time: '15 min', label: 'Práctica 2', detail: 'Crear el cuaderno y cargar las fuentes.' },
      { time: '25 min', label: 'Práctica 3', detail: 'Preguntar con citas y detectar huecos.' },
      { time: '20 min', label: 'Práctica 4', detail: 'Convertir el cuaderno en guía, mapa, audio y video.' },
      { time: '20 min', label: 'Práctica 5', detail: 'Compartirlo como tutor del curso.' },
      { time: '15 min', label: 'Entregable', detail: 'Probar el cuaderno con un colega y cerrar.' },
    ],
    goals: [
      'Explicar RAG en una frase y reconocer cuándo un cuaderno con fuentes es mejor que un chat general.',
      'Construir un cuaderno del curso con programa, lecturas y artículos.',
      'Verificar citas y encontrar los temas que las fuentes no cubren.',
      'Derivar material de estudio y compartir el cuaderno con estudiantes.',
    ],
    sections: [
      {
        id: 'idea',
        mascot: 'sorpresa',
        eyebrow: 'Idea · 15 min',
        title: 'RAG: responder con sus documentos y mostrar la fuente',
        blocks: [
          {
            type: 'p',
            text: 'RAG significa recuperar primero y responder después. La IA busca en los documentos que usted cargó, arma un contexto con los fragmentos más parecidos y responde citando de dónde salió. No es que «sepa» su curso: es que lee lo que usted le dio.',
          },
          {
            type: 'compare',
            columns: [
              {
                title: 'Chat general',
                tag: 'Sin fuentes',
                tone: 'neutral',
                items: [
                  'Responde con lo que vio en internet, sin conocer su programa.',
                  'Puede inventar referencias que suenan perfectas.',
                  'No muestra de dónde salió la respuesta.',
                  'Sirve para explorar, redactar y pensar.',
                ],
              },
              {
                title: 'Cuaderno con fuentes',
                tag: 'RAG',
                tone: 'signal',
                items: [
                  'Responde solo con los documentos que usted subió.',
                  'Cada afirmación trae una cita que se puede abrir.',
                  'Si el dato no está, debería decirlo.',
                  'Sirve para estudiar, preparar clase y tutorar.',
                ],
              },
            ],
          },
          {
            type: 'p',
            text: '**Qué hay debajo (una diapositiva).** Los documentos se parten en fragmentos, cada fragmento se convierte en un vector y se guarda en una base vectorial como Pinecone. La pregunta también se vuelve vector y se recuperan los fragmentos más parecidos. Eso es todo lo que necesita saber para usar la herramienta; la ingeniería queda para la versión de estudiantes.',
          },
          {
            type: 'callout',
            tone: 'warn',
            title: 'RAG no elimina las alucinaciones',
            text: 'Reduce el espacio de donde saca la respuesta. Si las fuentes se contradicen, si falta el dato o si el fragmento está mal cortado, puede inventar o forzar una cita. La cita se verifica, siempre.',
          },
          {
            type: 'p',
            text: '**Qué gana un curso.** Un lugar único con programa, lecturas y artículos; respuestas con cita; material derivado (guía, mapa, audio, video); y un tutor que responde solo con lo del curso, disponible cuando usted no está.',
          },
          {
            type: 'note',
            text: 'No suba exámenes que aún no ha aplicado, datos de estudiantes ni material de terceros sin permiso. Compartir un cuaderno es publicar sus fuentes.',
          },
        ],
      },
      {
        id: 'practica-1',
        mascot: 'neutral',
        eyebrow: 'Práctica 1 · 10 min',
        title: 'Reunir y nombrar las fuentes',
        blocks: [
          {
            type: 'p',
            text: 'Un cuaderno sirve si las fuentes son las correctas. Para esta práctica bastan cinco a ocho documentos:',
          },
          {
            type: 'list',
            items: [
              'El programa de la asignatura, con resultados de aprendizaje y bibliografía.',
              'Dos lecturas obligatorias del curso.',
              'Dos artículos o capítulos que use en clase.',
              'Una transcripción suya, una guía o un video propio (opcional).',
            ],
          },
          {
            type: 'p',
            text: 'Nombre los archivos con el mismo criterio: `01_programa`, `02_lectura_modelos`, `03_articulo_rag`. Un PDF escaneado como foto no se lee bien: si el texto no se puede seleccionar, pase el archivo por OCR antes de subirlo.',
          },
          {
            type: 'note',
            text: 'Revise los derechos de autor antes de compartir el cuaderno fuera del curso. Para uso interno de clase suele estar bien; para publicarlo, use materiales propios o de acceso abierto.',
          },
        ],
      },
      {
        id: 'practica-2',
        mascot: 'explicando',
        eyebrow: 'Práctica 2 · 15 min',
        title: 'Crear el cuaderno y cargar',
        blocks: [
          {
            type: 'numbered',
            items: [
              'Entre a notebook.google.com (NotebookLM, ahora llamado Gemini Notebook) con la cuenta @unal.edu.co.',
              'Cree un cuaderno y póngale el nombre del curso y el periodo.',
              'Suba las fuentes una por una; espere a que cada una quede procesada.',
              'Confirme que el número de fuentes y los títulos coinciden con lo que subió.',
              'Si una fuente quedó ilegible o no sube, vuelva a subirla en PDF con texto, o use Añadir fuente → Texto copiado y pegue el contenido.',
            ],
          },
          {
            type: 'note',
            text: 'El plan gratuito tiene un límite de fuentes por cuaderno y de cuadernos. Si el curso es grande, priorice programa, lecturas clave y guías antes que diapositivas sueltas. Revise el límite vigente antes de la sesión.',
          },
          {
            type: 'callout',
            tone: 'ok',
            title: 'Un cuaderno por curso, no por tema',
            text: 'Separe por asignatura y periodo. Si mezcla tres cursos, las citas se cruzan y el tutor responde con material que no corresponde.',
          },
          { type: 'links', items: [{ label: 'NotebookLM (Gemini Notebook)', url: 'https://notebook.google.com', provider: 'Google' }] },
        ],
      },
      {
        id: 'practica-3',
        mascot: 'pensando',
        eyebrow: 'Práctica 3 · 25 min',
        title: 'Preguntar con citas y buscar huecos',
        blocks: [
          {
            type: 'p',
            text: 'Empiece con preguntas fáciles y suba la dificultad. En cada respuesta, abra la cita antes de aceptar la frase.',
          },
          {
            type: 'numbered',
            items: [
              '«¿Qué evalúa el corte 2 según el programa?»',
              '«Resume la lectura 2 en cinco ideas y cita la fuente de cada una».',
              '«Compara la definición de [concepto] en las dos lecturas; si no coinciden, dime en qué».',
              '«¿Qué tema del programa no está cubierto por las fuentes cargadas?».',
              '«Propón tres preguntas de parcial y dime en qué fuente se responde cada una».',
            ],
          },
          {
            type: 'p',
            text: '**Haga clic en cada cita.** Si la cita no respalda la frase, la respuesta no sirve, aunque suene bien. Ese gesto es la diferencia entre usar RAG y creerle a un chat.',
          },
          {
            type: 'table',
            headers: ['Señal', 'Qué hacer'],
            rows: [
              ['La cita existe pero no dice eso', 'Descarte la respuesta y reformule la pregunta con el término exacto del documento.'],
              ['Dos fuentes se contradicen', 'Pídale que muestre ambas versiones y decida usted cuál usar en clase.'],
              ['Dice que no está en las fuentes', 'Es una respuesta válida: agregue la fuente que falta o ajuste el programa.'],
              ['Responde con generalidades sin cita', 'Pregunte «¿en qué fuente está eso?» y no acepte la respuesta sin enlace.'],
            ],
          },
          {
            type: 'note',
            text: 'Preguntar «¿qué no está en las fuentes?» es la forma más rápida de encontrar los huecos del curso y de decidir qué lectura agregar.',
          },
        ],
      },
      {
        id: 'practica-4',
        mascot: 'senalando',
        eyebrow: 'Práctica 4 · 20 min',
        title: 'Convertirlo en material de estudio',
        blocks: [
          {
            type: 'p',
            text: 'El cuaderno no es solo un chat: genera material a partir de las mismas fuentes. Elija dos salidas y revíselas como revisaría un borrador de un monitor.',
          },
          {
            type: 'cards',
            items: [
              { title: 'Informe · Resumen de aprendizaje', description: 'En Informes, plantilla «Resumen de aprendizaje» (Interactivo o Documento), con un campo para escribir instrucciones. Hace las veces de guía de estudio.', tag: 'Texto' },
              { title: 'Mapa mental', description: 'Relaciones entre conceptos. Sirve para abrir o cerrar una unidad.', tag: 'Visual' },
              { title: 'Tarjetas didácticas y cuestionario', description: 'Repaso y autoevaluación; en el cuestionario elige cantidad y dificultad. Verifique cada respuesta.', tag: 'Práctica' },
              { title: 'Resumen de audio', description: 'Dos voces discutiendo el material (Detallado, Breve, Crítica o Debate). Bueno para estudiantes que escuchan; malo si el guion no se revisa.', tag: 'Audio' },
              { title: 'Resumen de vídeo', description: 'Corto (vertical) o Explicativo (horizontal). Útil como repaso, no como clase nueva.', tag: 'Video' },
              { title: 'Presentación, infografía y tabla de datos', description: 'Otras salidas del panel Studio para abrir una clase o resumir una unidad.', tag: 'Visual' },
            ],
          },
          {
            type: 'numbered',
            items: [
              'Lance primero el audio y el video: pueden tardar más de 10 minutos. Mientras tanto, genere las demás.',
              'Genere cada salida con una instrucción concreta en su campo de texto: tema, extensión, nivel y uso.',
              'Revise datos, tildes y citas antes de descargar.',
              'Ajuste el texto o regenere con instrucciones más específicas; el audio no se edita, se vuelve a generar.',
              'Lleve el resultado a Moodle: el mapa mental se descarga; el informe y el cuestionario se comparten con enlace o se copian.',
            ],
          },
          {
            type: 'note',
            text: 'El podcast y el video son borradores. Escúchelos completos antes de compartirlos: un error de tono o de dato se nota más en audio que en texto. En el plan gratuito las salidas llevan marca de agua.',
          },
          {
            type: 'callout',
            tone: 'warn',
            title: 'El informe puede suavizar contradicciones',
            text: 'En la prueba, una lectura con un error («el impuesto siempre lo paga el consumidor») apareció en el informe como una «perspectiva práctica», no como un error. Revise el informe contra las fuentes antes de entregarlo.',
          },
        ],
      },
      {
        id: 'practica-5',
        mascot: 'feliz',
        eyebrow: 'Práctica 5 · 20 min',
        title: 'Compartirlo como tutor del curso',
        blocks: [
          {
            type: 'numbered',
            items: [
              'Abra Compartir cuaderno y, en «Añade personas y grupos», agregue a sus estudiantes o el grupo del curso con el rol que corresponda.',
              'Use «Copiar enlace», o en Más opciones de copia «Copiar enlace a la vista de conversación» para que abran directo en el chat.',
              'Pegue el enlace en Moodle con instrucciones de uso de tres líneas.',
              'Pruébelo con una cuenta de estudiante o en una ventana sin sesión.',
              'Anote qué puede ver el estudiante: fuentes, respuestas, historial.',
            ],
          },
          {
            type: 'callout',
            tone: 'warn',
            title: 'Un cuaderno no es un examen',
            text: 'Si lo usa como tutor, deje claro que las citas se verifican, que el cuaderno no reemplaza la lectura y que las respuestas no son la verdad revelada. Y no suba el examen que va a aplicar.',
          },
          {
            type: 'note',
            text: 'No hay opción de compartir con todo el dominio ni un modo «solo chat»: quien tiene acceso ve las fuentes, el chat y las salidas. Si no quiere mostrar las fuentes, comparta el informe y reserve el cuaderno para su preparación.',
          },
        ],
      },
      {
        id: 'entregable',
        mascot: 'despedida',
        eyebrow: 'Entregable · 15 min',
        title: 'Lo que se lleva',
        blocks: [
          {
            type: 'list',
            items: [
              'El enlace al cuaderno del curso, con las fuentes cargadas y los permisos definidos.',
              'Un informe «Resumen de aprendizaje» revisado contra las fuentes, listo para Moodle.',
              'Tres citas verificadas: pregunta, respuesta y fuente abierta.',
            ],
          },
          {
            type: 'checklist',
            items: [
              'El cuaderno responde solo con las fuentes del curso.',
              'Cada respuesta que voy a usar tiene una cita que abrí y verifiqué.',
              'El informe no contiene datos inventados, referencias falsas ni contradicciones suavizadas.',
              'El enlace funciona con una cuenta distinta a la mía.',
            ],
          },
        ],
        criteria: [
          { title: 'Fuentes pertinentes', description: 'El cuaderno usa el programa y las lecturas del curso, no material suelto.' },
          { title: 'Citas verificadas', description: 'Se abre la fuente y se comprueba que respalde la afirmación.' },
          { title: 'Material usable', description: 'La guía o el mapa se pueden entregar a estudiantes con ajustes mínimos.' },
          { title: 'Permisos claros', description: 'Se sabe quién puede ver, preguntar y descargar el cuaderno.' },
        ],
      },
    ],
    next: { label: 'Sesión 03 · Herramientas', slug: 'mcp' },
  },

  mcp: {
    session: '03',
    title: 'IA dentro de las herramientas de trabajo',
    lead:
      'Un caso de aula resuelto con Gemini dentro de Google Workspace, la suite de la cuenta @unal. Si alguna función no está habilitada, el ejercicio se hace con el chat y los conectores de Claude: se pierde la edición dentro de la herramienta, no el aprendizaje.',
    meta: [
      { label: 'Duración', value: '2 horas' },
      { label: 'Formato', value: '15 idea · 90 práctica · 15 entregable' },
      { label: 'Requiere', value: 'Cuenta @unal con Google Workspace' },
      { label: 'Traer', value: 'Una hoja de notas ficticia y el programa del curso' },
    ],
    agenda: [
      { time: '15 min', label: 'Idea', detail: 'Qué cambia cuando la IA vive dentro de la herramienta; permisos y límites.' },
      { time: '10 min', label: 'Práctica 1', detail: 'Preparar una hoja de notas ficticia de 25 estudiantes.' },
      { time: '25 min', label: 'Práctica 2', detail: 'Analizar el grupo: promedios, distribución, riesgo y gráfico.' },
      { time: '20 min', label: 'Práctica 3', detail: 'Tres retroalimentaciones personalizadas como borradores de correo.' },
      { time: '20 min', label: 'Práctica 4', detail: 'De documento a presentación de clase.' },
      { time: '15 min', label: 'Práctica 5', detail: 'Conectores de un clic y plan B sin licencia.' },
      { time: '15 min', label: 'Entregable', detail: 'Socializar la hoja, los correos y la presentación.' },
    ],
    goals: [
      'Distinguir cuándo conviene un chat aparte y cuándo la IA integrada a la herramienta.',
      'Analizar una hoja de notas ficticia y producir un gráfico y una lista de riesgo.',
      'Redactar retroalimentación personalizada sin inventar datos y sin enviarla automáticamente.',
      'Conocer los conectores de un clic y sus límites de permisos.',
    ],
    sections: [
      {
        id: 'idea',
        mascot: 'alerta',
        eyebrow: 'Idea · 15 min',
        title: 'De la pestaña del chat a la herramienta donde ya trabaja',
        blocks: [
          {
            type: 'p',
            text: 'Hasta ahora la IA vivió en una pestaña aparte: uno copia, pega y vuelve. La IA integrada trabaja sobre el documento abierto, la hoja y el correo. No cambia el modelo; cambia el lugar donde ocurre el trabajo y lo que el modelo puede ver.',
          },
          {
            type: 'p',
            text: '**Conectores y MCP, sin JSON.** Un conector es un permiso que le da a la IA para leer o actuar en otra herramienta: Drive, Gmail, Calendar, una hoja de cálculo. MCP es el estándar técnico detrás de muchos de esos conectores. Para esta sesión basta con: la IA ve lo que su cuenta ve, y actúa solo si usted lo autoriza.',
          },
          {
            type: 'table',
            headers: ['Tarea docente', 'Con Gemini en Workspace', 'Plan B sin la función'],
            rows: [
              ['Analizar notas y hacer un gráfico', 'Gemini en Sheets', 'Subir la hoja como CSV al chat de Gemini o Claude'],
              ['Escribir retroalimentación y borradores de correo', 'Gemini en Gmail', 'Claude con el conector de Gmail'],
              ['Convertir apuntes en presentación', 'Docs a Slides con Gemini', 'Pedir el esquema en el chat y armarlo en Slides'],
              ['Resumir una reunión o clase', 'Gemini en Meet y Docs', 'Pegar la transcripción en el chat'],
              ['Buscar en los archivos del curso', 'Gemini con Drive', 'Claude con el conector de Drive'],
            ],
          },
          {
            type: 'cards',
            items: [
              { title: 'Granola: notas de reuniones sin bot', description: 'Toma las notas de una reunión de comité, una asesoría o una clase por Meet, Zoom o Teams a partir del audio del equipo, sin meter un bot a la llamada. Al final entrega resumen y tareas. Es una app para Windows, Mac o celular: úsela en su equipo personal, no en los PC de la sala. Plan gratis con notas ilimitadas; las de más de 30 días piden plan pago.', tag: 'Reuniones', url: 'https://www.granola.ai' },
            ],
          },
          {
            type: 'callout',
            tone: 'warn',
            title: 'El permiso es el riesgo',
            text: 'Un conector puede leer todo lo que su cuenta puede leer. Autorice solo la carpeta o el servicio necesario, revise qué se comparte y revoque el acceso al terminar. No conecte la cuenta institucional a un servicio que no conoce.',
          },
          {
            type: 'p',
            text: '**Dos advertencias de datos.** Lo que se pega en el chat puede usarse para mejorar el servicio según el plan y la configuración de la cuenta. Y un documento puede traer instrucciones ocultas (inyección de prompt): si la IA lee correos o páginas de terceros, no le dé permiso de enviar o borrar sin revisión.',
          },
          {
            type: 'note',
            text: 'No vamos a comparar suites. Usamos la que esté licenciada y, si no hay ninguna, el plan B de cuentas gratuitas de la práctica 5.',
          },
        ],
      },
      {
        id: 'practica-1',
        mascot: 'sorpresa',
        eyebrow: 'Práctica 1 · 10 min',
        title: 'Preparar la hoja de notas ficticia',
        blocks: [
          {
            type: 'p',
            text: 'Cree una hoja en Sheets o Excel con 25 filas y datos inventados. Nada de nombres reales: use códigos (E01, E02…). La hoja debe tener:',
          },
          {
            type: 'list',
            items: [
              'Código del estudiante y programa.',
              'Nota del corte 1, corte 2 y una actividad.',
              'Porcentaje de asistencia.',
              'Una columna de observaciones con texto libre, dos o tres con dificultades concretas.',
            ],
          },
          {
            type: 'note',
            text: 'Si usa la plantilla de clase, cambie los valores antes de trabajar. El ejercicio es sobre el método, no sobre los datos.',
          },
          {
            type: 'prompt',
            label: 'Para generar la hoja si no la trae',
            text: `Genera una tabla de 25 estudiantes ficticios para un curso de [asignatura].
Columnas: código (E01 a E25), programa, corte_1 (0.0 a 5.0), corte_2, actividad, asistencia (%), observaciones.
Usa datos verosímiles: algunos en riesgo, la mayoría en el medio, dos sobresalientes.
En observaciones, escribe una dificultad concreta y distinta por estudiante.
No uses nombres reales. Devuélvelo como CSV.`,
          },
        ],
      },
      {
        id: 'practica-2',
        mascot: 'explicando',
        eyebrow: 'Práctica 2 · 25 min',
        title: 'Analizar el grupo',
        blocks: [
          {
            type: 'p',
            text: 'Abra la hoja y use el panel de Gemini en Sheets. Si no lo tiene, descargue la hoja como CSV y súbala al chat; el análisis es el mismo.',
          },
          {
            type: 'prompt',
            label: 'Análisis del grupo',
            text: `Con esta hoja de notas ficticia:
1. Calcula promedio, mediana y desviación por corte.
2. Dime cuántos estudiantes están en riesgo (promedio < 3.0 o asistencia < 70%) y cuáles son sus códigos.
3. Compara corte 1 y corte 2: ¿mejoró o empeoró el grupo?
4. Propón un gráfico que muestre la distribución y explícame qué se ve.
5. Escribe 5 hallazgos en lenguaje de consejo de facultad, sin nombrar estudiantes.
6. Al final, lista los supuestos que usaste y los datos que faltan.`,
          },
          {
            type: 'p',
            text: '**Verifique los números.** Pida que muestre las fórmulas o el paso a paso, y compruebe dos celdas a mano. Un promedio mal calculado en una reunión de facultad es peor que no tener el análisis.',
          },
          {
            type: 'callout',
            tone: 'ok',
            title: 'Pregunta por el método, no solo por el resultado',
            text: '«¿Cómo calculaste el riesgo?», «¿qué pasa si cambio el umbral a 3.2?», «¿qué estudiantes quedan justo en el límite?». Eso convierte el panel en un asistente y no en una caja negra.',
          },
          {
            type: 'note',
            text: 'El gráfico debe quedar dentro de la hoja, no solo descrito en el chat. Si la IA no lo inserta, pídale los pasos exactos y hágalo usted.',
          },
        ],
      },
      {
        id: 'practica-3',
        mascot: 'alerta',
        eyebrow: 'Práctica 3 · 20 min',
        title: 'Retroalimentación personalizada, sin enviar',
        blocks: [
          {
            type: 'p',
            text: 'El objetivo es producir tres borradores de correo con la información de la hoja y la rúbrica del curso. La IA redacta; usted revisa y envía.',
          },
          {
            type: 'prompt',
            label: 'Tres borradores de retroalimentación',
            text: `Con los datos de los estudiantes [E04, E11, E19] y la rúbrica adjunta, escribe un borrador de correo para cada uno.

Cada correo debe:
- Saludar por el código, no por nombre.
- Mencionar un logro concreto con la nota o la observación.
- Explicar una dificultad concreta y qué hacer esta semana.
- Cerrar con una acción y un plazo.
- Tener máximo 120 palabras y tono respetuoso, sin paternalismo.

No inventes datos que no estén en la hoja. Si falta información, escribe [verificar].
Devuélvelos en una tabla: código, asunto, cuerpo.`,
          },
          {
            type: 'p',
            text: '**Revise cada borrador** con esta lista: ¿el dato es real?, ¿el tono es adecuado?, ¿la acción es concreta?, ¿el estudiante puede responder?, ¿el correo no revela información de otros?',
          },
          {
            type: 'callout',
            tone: 'warn',
            title: 'No active el envío automático',
            text: 'La retroalimentación personalizada se revisa una por una. Un correo con la nota equivocada o con el nombre de otro estudiante es un problema de privacidad, no un error de formato.',
          },
          {
            type: 'note',
            text: 'Si la suite lo permite, guarde los borradores en la bandeja y envíelos después de revisarlos. Si no, copie el texto y envíelo manualmente.',
          },
        ],
      },
      {
        id: 'practica-4',
        mascot: 'explicando',
        eyebrow: 'Práctica 4 · 20 min',
        title: 'De documento a presentación de clase',
        blocks: [
          {
            type: 'p',
            text: 'Use los apuntes de una unidad o la guía generada en la sesión 2. El objetivo es una presentación de 5 diapositivas para abrir o cerrar la clase, no un mazo de 30.',
          },
          {
            type: 'numbered',
            items: [
              'Abra el documento de apuntes y pida un esquema de 5 diapositivas: una idea por diapositiva.',
              'Genere la presentación en Slides o PowerPoint desde el panel de IA.',
              'Revise que cada diapositiva tenga una sola idea y que los datos coincidan con el documento.',
              'Ajuste el diseño: tipografía legible, sin párrafos, una imagen o esquema por diapositiva.',
              'Exporte a PDF y pruébelo en el proyector del salón, no solo en el portátil.',
            ],
          },
          {
            type: 'prompt',
            label: 'Esquema de la presentación',
            text: `Con este documento, prepara una presentación de 5 diapositivas para [curso, tema].
Cada diapositiva debe tener: título corto, una idea, 3 puntos máximo y una pregunta para el grupo.
La última debe cerrar con una actividad de 5 minutos.
No agregues temas que no estén en el documento. Devuélveme primero el esquema en texto y espera mi aprobación.`,
          },
          {
            type: 'note',
            text: 'Si la generación de diapositivas no está disponible en su licencia, el esquema en texto ya es el 70% del trabajo: péguelo en Slides o PowerPoint y arme el diseño a mano.',
          },
        ],
      },
      {
        id: 'practica-5',
        mascot: 'senalando',
        eyebrow: 'Práctica 5 · 15 min',
        title: 'Conectores de un clic y plan B',
        blocks: [
          {
            type: 'p',
            text: 'Si su cuenta no tiene Gemini en Workspace, hay tres caminos gratuitos para el mismo ejercicio:',
          },
          {
            type: 'cards',
            items: [
              { title: 'Claude con conectores', description: 'Conecte Google Drive o Gmail desde la configuración de Claude y pídale leer una carpeta o un documento. Revise qué carpeta autoriza.', tag: 'Gratis', url: 'https://claude.ai' },
              { title: 'Gemini web con archivos', description: 'Descargue la hoja como CSV o Excel y súbala al chat. El análisis y los correos se pueden hacer igual.', tag: 'Gratis', url: 'https://gemini.google.com' },
            ],
          },
          {
            type: 'p',
            text: '**Qué se pierde sin licencia y qué no.** Se pierde la edición dentro del documento y la posibilidad de insertar el gráfico o la diapositiva con un clic. No se pierde el análisis, la redacción de la retroalimentación ni la revisión.',
          },
          {
            type: 'callout',
            tone: 'warn',
            title: 'Antes de conectar la cuenta institucional',
            text: 'Revise quién administra el dominio, qué servicios están permitidos y qué datos se comparten. Si tiene dudas, use una cuenta personal para la prueba y datos ficticios.',
          },
          {
            type: 'note',
            text: 'Revocar el acceso es parte del ejercicio: al terminar, desconecte el conector y borre los archivos de prueba que subió.',
          },
        ],
      },
      {
        id: 'entregable',
        mascot: 'despedida',
        eyebrow: 'Entregable · 15 min',
        title: 'Lo que se lleva',
        blocks: [
          {
            type: 'list',
            items: [
              'La hoja de notas ficticia analizada, con gráfico y lista de estudiantes en riesgo.',
              'Tres borradores de retroalimentación revisados, listos para enviar (no enviados).',
              'Una presentación de 5 diapositivas exportada a PDF.',
              'Una nota de una página: qué suite usó, qué licencia tiene y qué haría si no la tuviera.',
            ],
          },
          {
            type: 'checklist',
            items: [
              'Los promedios y el gráfico coinciden con la hoja.',
              'Los correos no inventan datos ni mezclan estudiantes.',
              'Los datos de la práctica son ficticios y los archivos de prueba quedaron identificados.',
              'Sé qué conector autoricé y cómo revocarlo.',
            ],
          },
        ],
        criteria: [
          { title: 'Análisis verificado', description: 'Los números se comprueban y el gráfico corresponde a los datos.' },
          { title: 'Retroalimentación honesta', description: 'Cada correo cita un dato real y propone una acción concreta.' },
          { title: 'Uso consciente de permisos', description: 'Se autoriza lo mínimo y se revoca al terminar.' },
          { title: 'Adaptación a la licencia', description: 'El flujo funciona con la suite disponible o con el plan B.' },
        ],
      },
    ],
    next: { label: 'Sesión 04 · Agentes y flujos', slug: 'agentes' },
  },

  agentes: {
    session: '04',
    title: 'Agentes y flujos: un piloto para su clase',
    lead:
      'La sesión más ambiciosa del programa, recortada a lo que cabe en dos horas. Dos caminos, una elección por mesa: una app interactiva de clase o un flujo automatizado. Al final cada grupo muestra un piloto que funciona, no una idea.',
    meta: [
      { label: 'Duración', value: '2 horas' },
      { label: 'Formato', value: '10 idea · 90 práctica · 20 entregable' },
      { label: 'Requiere', value: 'Cuenta @unal, Claude o Gemini, Forms o Sheets' },
      { label: 'Traer', value: 'Una necesidad docente concreta y material de una unidad' },
    ],
    agenda: [
      { time: '10 min', label: 'Idea', detail: 'De chatbot a agente; qué datos se entregan y cuáles no.' },
      { time: '5 min', label: 'Socialización', detail: 'Qué quedó de la sesión 3. Se salta si el grupo viene atrasado.' },
      { time: '20 min', label: 'Demo', detail: 'Ver un agente trabajar con Deep Research y revisar sus fuentes.' },
      { time: '30 min', label: 'Camino A', detail: 'App interactiva de clase con Claude Artifacts o Gemini Canvas.' },
      { time: '30 min', label: 'Camino B', detail: 'Flujo de retroalimentación con un agente (Instinct o Hark): formulario, hoja y borradores.' },
      { time: '5 min', label: 'Cierre', detail: 'IA y evaluación: detectores, evidencia y tareas que piden proceso.' },
      { time: '20 min', label: 'Entregable', detail: 'Demo de 2 minutos por mesa y ficha del piloto.' },
    ],
    goals: [
      'Explicar qué distingue un agente de un chatbot y en qué punto debe intervenir una persona.',
      'Decidir qué datos se pueden entregar a una herramienta y cuáles nunca.',
      'Construir un piloto: una app de quiz en vivo o un flujo de retroalimentación.',
      'Reconocer los límites de los detectores de IA y ajustar el diseño de las tareas.',
    ],
    sections: [
      {
        id: 'idea',
        mascot: 'explicando',
        eyebrow: 'Idea · 10 min',
        title: 'De chatbot a agente, sin perder el control',
        blocks: [
          {
            type: 'p',
            text: 'Un chatbot responde. Un agente planea, usa herramientas y entrega un producto: busca fuentes, llena una hoja, crea una presentación, manda un correo. La diferencia no es magia: es un ciclo de planear, ejecutar, revisar y volver a intentar.',
          },
          {
            type: 'compare',
            columns: [
              {
                title: 'Chatbot',
                tag: 'Responde',
                tone: 'neutral',
                items: [
                  'Usted pega el contexto en cada mensaje.',
                  'La salida es texto que usted copia.',
                  'El control es conversacional.',
                  'El riesgo principal es creerle.',
                ],
              },
              {
                title: 'Agente',
                tag: 'Ejecuta',
                tone: 'violet',
                items: [
                  'Decide pasos y usa herramientas.',
                  'La salida es un archivo, una hoja o una acción.',
                  'El control es por permisos y puntos de revisión.',
                  'El riesgo principal es que actúe sin que usted vea.',
                ],
              },
            ],
          },
          {
            type: 'p',
            text: '**Regla de oro:** entre más autonomía, más puntos de revisión. Un agente que investiga y propone es de bajo riesgo; uno que envía correos o modifica notas, de alto. Empiece por lo primero.',
          },
          {
            type: 'table',
            headers: ['Dato', '¿Se puede entregar?', 'Condición'],
            rows: [
              ['Programa, lecturas, material propio', 'Sí', 'Verifique derechos si el material es de terceros.'],
              ['Notas con código de estudiante', 'Con cuidado', 'Datos ficticios o anonimizados; nunca nombres ni cédulas.'],
              ['Correos institucionales', 'Con cuidado', 'Solo con conector autorizado y revisión antes de enviar.'],
              ['Trabajos de estudiantes', 'No sin permiso', 'Requiere consentimiento y una razón de uso clara.'],
              ['Datos de salud, menores o denuncias', 'No', 'Fuera de la capacitación y de cualquier herramienta externa.'],
              ['Exámenes que aún no ha aplicado', 'No', 'Riesgo de filtración; use un examen viejo o inventado.'],
            ],
          },
          {
            type: 'callout',
            tone: 'warn',
            title: 'Cada herramienta recoge algo distinto',
            text: 'Cuenta, historial, archivos y uso se guardan según el plan y la configuración. Revise la política vigente de cada servicio y la normativa de la universidad antes de subir material institucional. Esta tabla es una guía de conversación, no asesoría legal.',
          },
        ],
      },
      {
        id: 'socializacion',
        mascot: 'feliz',
        eyebrow: 'Práctica 0 · 5 min (opcional)',
        title: 'Qué quedó de la sesión 3',
        blocks: [
          {
            type: 'p',
            text: 'Una mesa, una frase: qué hizo con la hoja de notas y qué no funcionó. Si el grupo viene atrasado, se salta y se recupera al final del entregable.',
          },
          {
            type: 'note',
            text: 'La idea es no repetir la sesión 3 ni abrir un debate largo: cinco minutos, dos mesas, y seguimos.',
          },
        ],
      },
      {
        id: 'demo',
        mascot: 'senalando',
        eyebrow: 'Práctica 1 · 20 min',
        title: 'Ver un agente trabajar',
        blocks: [
          {
            type: 'p',
            text: 'Antes de construir, observe uno. Use una herramienta de investigación profunda (Deep Research de ChatGPT, Gemini o Claude) sobre un tema de su unidad. La instrucción debe pedir fuentes y un producto concreto.',
          },
          {
            type: 'prompt',
            label: 'Investigación con fuentes',
            text: `Investiga [tema de la unidad] para preparar una clase de [asignatura, semestre].
Necesito: 5 hallazgos con fuente, una comparación entre dos enfoques y un ejemplo aplicado a Colombia.
Formato: informe de 1 página con enlaces al final.
Restricciones: solo fuentes de los últimos 5 años; marca lo que no puedas verificar; no inventes citas.`,
          },
          {
            type: 'numbered',
            items: [
              'Observe el plan que propone el agente antes de ejecutar. Si no lo muestra, pídalo.',
              'Abra dos fuentes y compruebe que dicen lo que el informe afirma.',
              'Identifique en qué paso debió intervenir una persona: elegir fuentes, descartar datos o decidir el alcance.',
              'Guarde el informe y anote un error o un vacío que encontró.',
            ],
          },
          {
            type: 'note',
            text: 'Este es el ejemplo de agente de bajo riesgo: investiga y propone, no envía ni modifica nada. Sirve para mostrar el ciclo sin exponer datos.',
          },
        ],
      },
      {
        id: 'camino-a',
        mascot: 'pensando',
        eyebrow: 'Práctica 2 · Camino A · 30 min',
        title: 'App interactiva de clase',
        blocks: [
          {
            type: 'p',
            text: 'Elija este camino si quiere una actividad para la próxima clase: un quiz en vivo, una encuesta o un repaso. Se construye con Claude Artifacts o Gemini Canvas y se abre en el navegador del salón o del celular.',
          },
          {
            type: 'prompt',
            label: 'Quiz en vivo a partir de su material',
            text: `Crea una app HTML de una sola página para un quiz en vivo de clase.
Tema: [tema de la unidad]. Curso: [asignatura].
8 preguntas de selección múltiple, 4 opciones, una correcta.
Al responder: muestra si es correcta, la explicación y la fuente (archivo o lectura).
Al final: puntaje, preguntas falladas y botón para reiniciar.
Diseño legible en proyector y en celular, alto contraste, sin dependencias externas.
No inventes contenido: usa solo el material adjunto.`,
          },
          {
            type: 'numbered',
            items: [
              'Adjunte el material de la unidad y pegue el prompt en Claude o Gemini.',
              'Pida primero las 8 preguntas en texto y apruébelas antes de generar la app.',
              'Genere el artifact o canvas y ábralo en una pestaña nueva.',
              'Pruébelo en el celular y en el proyector: tamaño de letra, contraste y botones.',
              'Guarde el enlace y prepare un plan B (las preguntas en un documento) por si falla el internet.',
            ],
          },
          {
            type: 'callout',
            tone: 'ok',
            title: 'Qué revisar antes de usarla en clase',
            text: 'Que la respuesta correcta sea correcta, que la explicación no invente, que no haya preguntas ambiguas y que se pueda avanzar sin depender del docente. Un quiz con una respuesta mala enseña lo contrario.',
          },
          {
            type: 'note',
            text: 'No use datos de estudiantes dentro de la app. Si quiere registrar respuestas, hágalo con un formulario aparte y datos anónimos.',
          },
          { type: 'links', items: [{ label: 'Claude', url: 'https://claude.ai', provider: 'Anthropic' }, { label: 'Gemini', url: 'https://gemini.google.com', provider: 'Google' }] },
        ],
      },
      {
        id: 'camino-b',
        mascot: 'sorpresa',
        eyebrow: 'Práctica 3 · Camino B · 30 min',
        title: 'Flujo de retroalimentación con un agente: Instinct o Hark',
        blocks: [
          {
            type: 'numbered',
            items: [
              'Abra el agente: **Instinct** se usa por WhatsApp o iMessage (requiere invitación); **Hark** se usa en el chat de la app o la web.',
              'Si el agente lo pide, conecte su cuenta de Google @unal para que pueda crear el formulario, la hoja y los borradores.',
              'Copie el enlace de los dos archivos de ejemplo y péguelos en el prompt.',
              'Envíe el prompt y espere a que el agente le devuelva los enlaces.',
              'Revise el formulario, la hoja y cada borrador. Nada se envía a estudiantes.',
            ],
          },
          { type: 'links', items: [s234Docs.reflexiones, s1Docs.rubrica] },
          {
            type: 'prompt',
            label: 'Prompt para el agente',
            text: `Arma un flujo de retroalimentación para mi curso de Microeconomía I con mi cuenta de Google:
1. Crea un formulario de Google llamado «Reflexión de unidad» con: código del estudiante, unidad, ¿qué aprendí?, ¿qué me costó?, ¿qué haré distinto? y enlace al trabajo. Conecta sus respuestas a una hoja de cálculo.
2. Usa como respuestas de prueba las 5 filas de esta hoja: [enlace a S4-01 Respuestas ficticias de reflexión].
3. Con la rúbrica [enlace a 04 Rúbrica de desarrollo], escribe para cada fila un borrador de correo de máximo 120 palabras: un logro concreto, una dificultad y por qué importa, una acción para la próxima entrega con plazo. Tono respetuoso, sin comparar con otros estudiantes. Si falta un dato, escribe [verificar].
4. Deja los borradores en mi Gmail dirigidos a mí mismo. No envíes nada.
5. Al final dame los enlaces del formulario, de la hoja y un resumen de qué filas necesitan revisión.`,
          },
          { type: 'links', items: [{ label: 'Instinct', url: 'https://instinct.com', provider: 'Instinct' }, { label: 'Hark', url: 'https://hark.com', provider: 'Hark' }] },
        ],
      },
      {
        id: 'cierre',
        mascot: 'alerta',
        eyebrow: 'Cierre · 5 min',
        title: 'IA y evaluación: lo que no se puede delegar',
        blocks: [
          {
            type: 'list',
            items: [
              'Los detectores de IA no son prueba: dan probabilidades, fallan con textos de estudiantes y con textos editados. No sostienen una sanción por sí solos.',
              'Diseñe tareas que pidan proceso: borradores, bitácora, defensa oral, decisiones justificadas. Lo que se puede delegar entero, se delega.',
              'Declare las reglas de uso en el programa: qué se permite, qué se cita y qué se evalúa.',
              'Si sospecha uso indebido, evalúe el aprendizaje con una conversación, no con un porcentaje.',
            ],
          },
          {
            type: 'note',
            text: 'La evaluación es el tema que más preocupa al grupo según la encuesta. Vale la pena una sesión propia, pero aquí queda el marco mínimo para no cerrar el curso sin tocarlo.',
          },
        ],
      },
      {
        id: 'entregable',
        mascot: 'despedida',
        eyebrow: 'Entregable · 20 min',
        title: 'El piloto y su ficha',
        blocks: [
          {
            type: 'p',
            text: 'Cada mesa elige un camino y entrega un piloto que se pueda probar. No hace falta que sea bonito: hace falta que funcione una vez y que se sepa dónde revisa una persona.',
          },
          {
            type: 'list',
            items: [
              'Camino A: enlace al quiz o app, con 8 preguntas revisadas y probadas en celular.',
              'Camino B: formulario, hoja y plantilla, con dos borradores de prueba.',
              'Ficha de una página: problema docente, insumos, pasos, datos que no se usan y punto de revisión humana.',
              'Demostración de 2 minutos por mesa.',
            ],
          },
          {
            type: 'checklist',
            items: [
              'El piloto resuelve una necesidad concreta de una unidad, no un ejemplo genérico.',
              'No usa datos reales de estudiantes.',
              'Hay un paso de revisión humana antes de cualquier envío o publicación.',
              'Puedo explicar qué haría si la herramienta falla en clase.',
              'Sé cuánto tiempo me ahorra y cuánto tiempo me cuesta revisarlo.',
            ],
          },
        ],
        criteria: [
          { title: 'Problema real', description: 'El piloto atiende una necesidad docente identificada, no una demo de la herramienta.' },
          { title: 'Funciona una vez', description: 'Se probó con datos ficticios y se mostró en la demo.' },
          { title: 'Datos protegidos', description: 'No hay datos personales y se explica qué se excluyó.' },
          { title: 'Revisión humana', description: 'El flujo identifica el punto exacto donde una persona revisa y decide.' },
        ],
      },
    ],
    next: { label: 'Volver al resumen', slug: null },
  },
}
