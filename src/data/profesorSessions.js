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
      'Se plantea como «IA integrada a las herramientas de trabajo», con el mismo ejercicio en Google Workspace y en Microsoft 365. Se dicta con la suite que esté habilitada y queda un plan B con cuentas gratuitas.',
  },
  {
    title: 'La sesión 4 se recorta a un piloto',
    description:
      'Datos, agentes, app de clase y flujo automatizado no caben completos en 2 horas. Se elige un camino por mesa (app interactiva o flujo automatizado) y se entrega un piloto, no un sistema terminado.',
  },
  {
    title: 'PDF a Markdown entra como truco de contexto',
    description:
      'MarkItDown (Microsoft) convierte PDF, Word o PowerPoint a Markdown limpio antes de pasarlos a Claude o ChatGPT. Menos tokens, menos ruido de tablas y columnas. Se usa en la sesión 2 para bibliografía y en la 4 para insumos.',
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
    tools: 'Gemini · ChatGPT · Claude · Copilot · Moodle',
    tag: 'Prompting aplicado',
  },
  {
    session: '02',
    slug: 'rag',
    label: 'NotebookLM',
    title: 'RAG sin código: el cuaderno del curso',
    focus:
      'Responder con sus documentos y citar la fuente. Cuaderno con programa, lecturas y artículos; material derivado y bibliografía sistematizada.',
    deliverable: 'Cuaderno compartido con estudiantes + guía de estudio + bibliografía normalizada.',
    tools: 'NotebookLM · Zotero · MarkItDown · Scopus (si hay acceso)',
    tag: 'RAG sin código',
  },
  {
    session: '03',
    slug: 'mcp',
    label: 'Herramientas',
    title: 'IA dentro de las herramientas de trabajo',
    focus:
      'La IA donde ya trabaja: documentos, hojas, correo y presentaciones. Mismo caso en Google Workspace y en Microsoft 365, según licencia.',
    deliverable: 'Hoja analizada con datos ficticios + 3 retroalimentaciones en borrador + presentación corta.',
    tools: 'Gemini en Workspace · Copilot en Microsoft 365 · Conectores de Claude',
    tag: 'Workspace y Microsoft',
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
  { label: 'Navegador y cuenta UNAL', detail: 'Gemini, NotebookLM, ChatGPT, Claude y Copilot con sesión iniciada en la cuenta @unal.edu.co.' },
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

export const pendingConfirmations = [
  'NotebookLM habilitado en las cuentas @unal.edu.co (las Habilidades de Gemini ya funcionan).',
  'Licencia de Google Workspace con Gemini y, si existe, Microsoft 365 Copilot.',
  'Acceso a Scopus para el MCP de bibliografía.',
  'Permisos de importación en los cursos de Moodle de cada profe.',
  'Sede y horario: viernes 4–6 pm tiene el mejor promedio; jueves 6–8 pm es el más elegido de primero.',
]

const toolLinks = [
  { label: 'Gemini', url: 'https://gemini.google.com', provider: 'Google' },
  { label: 'ChatGPT', url: 'https://chatgpt.com', provider: 'OpenAI' },
  { label: 'Claude', url: 'https://claude.ai', provider: 'Anthropic' },
  { label: 'Copilot', url: 'https://copilot.microsoft.com', provider: 'Microsoft' },
]

const moodleLinks = [
  { label: 'Formato GIFT', url: 'https://docs.moodle.org/en/GIFT_format', provider: 'Moodle' },
  { label: 'Formato Aiken', url: 'https://docs.moodle.org/en/Aiken_format', provider: 'Moodle' },
]

export const profesorSessions = {
  fundamentos: {
    session: '01',
    title: 'Formular tareas, evaluar respuestas, elegir herramienta',
    lead:
      'La IA no llega a reemplazar el criterio docente: llega a producir borradores. Esta sesión entrena cuatro gestos que sirven con cualquier modelo: convertir una intención en una tarea clara, darle contexto del curso, revisar lo que vuelve y elegir la herramienta según la tarea.',
    meta: [
      { label: 'Duración', value: '2 horas' },
      { label: 'Formato', value: '15 idea · 90 práctica · 15 entregable' },
      { label: 'Requiere', value: 'Portátil y sesión iniciada con la cuenta @unal en Gemini, ChatGPT, Claude y Copilot' },
      { label: 'Traer', value: 'Programa de su asignatura y un parcial o guía previa' },
    ],
    agenda: [
      { time: '15 min', label: 'Idea', detail: 'Qué hace un LLM, qué no subir, fórmula de tarea, evaluación y elección de herramienta.' },
      { time: '10 min', label: 'Práctica 1', detail: 'Reescribir una tarea real que ya haya hecho con IA.' },
      { time: '25 min', label: 'Práctica 2', detail: 'Parcial con rúbrica y clave a partir del programa.' },
      { time: '15 min', label: 'Práctica 3', detail: 'Pasar las preguntas a Moodle en GIFT o Aiken.' },
      { time: '20 min', label: 'Práctica 4', detail: 'Construir la habilidad «Asistente de mi curso».' },
      { time: '20 min', label: 'Práctica 5', detail: 'Revisión cruzada con otro profe y ajuste del asistente.' },
      { time: '15 min', label: 'Entregable', detail: 'Socializar el asistente y el parcial; cerrar con la lista de verificación.' },
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
        eyebrow: 'Idea · 15 min',
        title: 'Lo que hay que entender antes de escribir un prompt',
        blocks: [
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
              ['Escribir o editar dentro del documento', 'Gemini en Docs o Copilot en Word, según licencia', 'No hay que copiar y pegar; respeta el formato.'],
              ['Razonamiento largo, código o análisis de datos', 'Claude o ChatGPT', 'Mejor manejo de contextos extensos y de archivos.'],
              ['Búsqueda con fuentes actuales', 'ChatGPT, Gemini o Claude con búsqueda web', 'Verifique siempre los enlaces antes de citar.'],
              ['Trabajar con hojas de cálculo', 'Gemini en Sheets o Copilot en Excel', 'Escribe fórmulas y explica el paso a paso.'],
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
        eyebrow: 'Práctica 1 · 10 min',
        title: 'Reescribir una tarea real',
        blocks: [
          {
            type: 'p',
            text: 'Elija una tarea que ya haya hecho con IA esta semana: un correo, una guía, un parcial, una retroalimentación. Péguela tal como la escribió. No la mejore todavía.',
          },
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
        eyebrow: 'Práctica 2 · 25 min',
        title: 'Parcial con rúbrica y clave',
        blocks: [
          {
            type: 'p',
            text: 'Use el programa de su asignatura y un corte real. La IA puede proponer el parcial, pero usted decide qué entra y con qué nivel. Adjunte el programa y, si tiene, un parcial anterior como ejemplo de formato.',
          },
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
        eyebrow: 'Práctica 4 · 20 min',
        title: 'El asistente que conoce mi curso',
        blocks: [
          {
            type: 'p',
            text: 'Una **habilidad** en Gemini o en Claude, o un **Proyecto** en ChatGPT o Copilot, son la misma idea: instrucciones que se quedan guardadas y archivos que el modelo usa en cada conversación. Deja de repetir el contexto del curso y empieza a tener un asistente estable.',
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
              'En Claude: **Configuración → Personalización → Skills → Agregar Skill → Crear una Skill** (o **Crear con Claude**).',
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
            text: '**Archivos que valen la pena.** Programa, lecturas obligatorias, parciales anteriores con su clave, rúbricas y acuerdos del curso. **No** suba listas de notas, trabajos de estudiantes ni exámenes sin aplicar.',
          },
          {
            type: 'p',
            text: 'Pruebe el asistente con tres preguntas: una conceptual, una de nota y una fuera del programa. La tercera es la más importante: debe reconocer que no está en los materiales.',
          },
          {
            type: 'note',
            text: 'Si el PDF no sube dentro de la habilidad, adjúntelo en el chat o pegue en las instrucciones los acuerdos del curso y la lista de temas. En Claude las Skills no reciben archivos del computador: pegue el texto.',
          },
          {
            type: 'note',
            text: 'Las habilidades de Gemini no se comparten con enlace: use **⋯ → Descargar** y pase el archivo, que el colega sube con **Sustituir habilidad** o al crear la suya. En Claude Free, compartir Skills exige plan Team. Compartir un Proyecto no siempre comparte los archivos: pruebe con otra cuenta.',
          },
          { type: 'links', items: toolLinks },
        ],
      },
      {
        id: 'practica-5',
        eyebrow: 'Práctica 5 · 20 min',
        title: 'Revisión cruzada y ajuste',
        blocks: [
          {
            type: 'p',
            text: 'Intercambie el asistente y el parcial con un colega. Cada uno busca fallas en el trabajo del otro con la lista de verificación. La IA se evalúa como se evalúa un borrador: con criterios y con evidencia.',
          },
          {
            type: 'table',
            headers: ['Falla típica', 'Qué ajustar'],
            rows: [
              ['Respuestas correctas pero genéricas', 'Falta contexto: agregue programa, nivel y un ejemplo de lo que espera.'],
              ['Cita una fuente que no dice eso', 'Pida la cita textual y verifique el archivo. Si no aparece, elimine la referencia.'],
              ['Inventa un acuerdo del curso', 'Refuerce la restricción y suba el documento donde está el acuerdo.'],
              ['Califica con una rúbrica distinta', 'Adjunte la rúbrica y pida que explique criterio por criterio antes de la nota.'],
              ['Responde con demasiado texto', 'Fije formato y extensión; pida tabla o lista, no ensayo.'],
            ],
          },
          {
            type: 'note',
            text: 'Registre los errores que encontró. Es el insumo del entregable y la mejor evidencia de que aprendió a evaluar, no solo a pedir.',
          },
        ],
      },
      {
        id: 'entregable',
        eyebrow: 'Entregable · 15 min',
        title: 'Lo que se lleva',
        blocks: [
          {
            type: 'list',
            items: [
              'Su habilidad o Proyecto «Asistente de mi curso», con instrucciones y archivos cargados (enlace o archivo descargado).',
              'Un parcial con tabla de especificaciones, clave y rúbrica, revisado por usted.',
              'El archivo GIFT o Aiken importado en Moodle, con captura del banco de preguntas.',
              'Un registro breve de 3 errores encontrados y cómo los corrigió.',
            ],
          },
          {
            type: 'checklist',
            items: [
              'El asistente responde con el programa del curso y reconoce lo que no está en los archivos.',
              'El parcial tiene clave coherente y rúbrica utilizable.',
              'Las preguntas importaron en Moodle sin errores de tildes ni de respuesta correcta.',
              'Puedo explicar por qué cada ítem está en el examen.',
            ],
          },
        ],
        criteria: [
          { title: 'Tarea bien formulada', description: 'La instrucción tiene contexto, solicitud, formato y restricciones verificables.' },
          { title: 'Evaluación real', description: 'Se identifican errores concretos y se corrigen; no se acepta la respuesta por apariencia.' },
          { title: 'Uso del curso', description: 'El parcial y el asistente se apoyan en el programa y los acuerdos de la asignatura.' },
          { title: 'Moodle funcionando', description: 'Las preguntas se importan, se califican y conservan tildes y opciones.' },
        ],
      },
      {
        id: 'notas',
        eyebrow: 'Para el docente',
        title: 'Por confirmar y advertencias',
        blocks: [
          { type: 'callout', tone: 'warn', title: 'Por confirmar antes de dictar', text: 'Que cada profe pueda iniciar sesión con la cuenta @unal en Gemini, ChatGPT, Claude y Copilot, y que tenga permisos de edición en su curso de Moodle para importar preguntas.' },
          { type: 'note', text: 'La encuesta ubicó al grupo en 2–3 de 5: el repaso de fundamentos debe ser corto, con ejemplos de su asignatura, no una clase de teoría.' },
          { type: 'note', text: 'Si el grupo no trae programa, entregue un programa ficticio de una asignatura común para que la práctica no se detenga.' },
          { type: 'note', text: 'La comparación entre modelos va al final y con fecha: cualquier tabla de «cuál es mejor» queda vieja en semanas.' },
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
      { time: '20 min', label: 'Práctica 3', detail: 'Preguntar con citas y detectar huecos.' },
      { time: '15 min', label: 'Práctica 4', detail: 'Convertir el cuaderno en guía, mapa, audio y video.' },
      { time: '15 min', label: 'Práctica 5', detail: 'Compartirlo como tutor del curso.' },
      { time: '15 min', label: 'Práctica 6', detail: 'Sistematizar la bibliografía: Zotero, Scopus y PDF a Markdown.' },
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
            text: 'No suba exámenes sin aplicar, datos de estudiantes ni material de terceros sin permiso. Compartir un cuaderno es publicar sus fuentes.',
          },
        ],
      },
      {
        id: 'practica-1',
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
              'La norma de citación de su facultad (opcional, pero útil para la práctica 6).',
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
        eyebrow: 'Práctica 2 · 15 min',
        title: 'Crear el cuaderno y cargar',
        blocks: [
          {
            type: 'numbered',
            items: [
              'Entre a notebooklm.google.com con la cuenta de la universidad.',
              'Cree un cuaderno y póngale el nombre del curso y el periodo.',
              'Suba las fuentes una por una; espere a que cada una quede procesada.',
              'Confirme que el número de fuentes y los títulos coinciden con lo que subió.',
              'Si una fuente quedó ilegible, vuelva a subirla en PDF con texto u otro formato.',
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
          { type: 'links', items: [{ label: 'NotebookLM', url: 'https://notebooklm.google.com', provider: 'Google' }] },
        ],
      },
      {
        id: 'practica-3',
        eyebrow: 'Práctica 3 · 20 min',
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
              '«Resume la lectura 2 en cinco ideas y cita la página de cada una».',
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
        eyebrow: 'Práctica 4 · 15 min',
        title: 'Convertirlo en material de estudio',
        blocks: [
          {
            type: 'p',
            text: 'El cuaderno no es solo un chat: genera material a partir de las mismas fuentes. Elija dos salidas y revíselas como revisaría un borrador de un monitor.',
          },
          {
            type: 'cards',
            items: [
              { title: 'Guía de estudio', description: 'Ideas clave, preguntas y vacíos por unidad. La salida más útil para Moodle.', tag: 'Texto' },
              { title: 'Mapa mental', description: 'Relaciones entre conceptos. Sirve para abrir o cerrar una unidad.', tag: 'Visual' },
              { title: 'Tarjetas y cuestionario', description: 'Repaso espaciado y autoevaluación. Verifique cada respuesta.', tag: 'Práctica' },
              { title: 'Audio overview', description: 'Dos voces discutiendo el material. Bueno para estudiantes que escuchan; malo si el guion no se revisa.', tag: 'Audio' },
              { title: 'Video overview', description: 'Resumen visual con diapositivas. Útil como repaso, no como clase nueva.', tag: 'Video' },
              { title: 'Informe', description: 'Documento estructurado con citas, listo para adaptar a una guía o a una presentación.', tag: 'Texto' },
            ],
          },
          {
            type: 'numbered',
            items: [
              'Genere la salida con una instrucción concreta: tema, extensión, nivel y uso.',
              'Revise datos, tildes y citas antes de descargar.',
              'Ajuste el texto o regenere con instrucciones más específicas; el audio no se edita, se vuelve a generar.',
              'Descargue o copie el resultado y súbalo a Moodle como material de la unidad.',
            ],
          },
          {
            type: 'note',
            text: 'El podcast y el video son borradores. Escúchelos completos antes de compartirlos: un error de tono o de dato se nota más en audio que en texto.',
          },
        ],
      },
      {
        id: 'practica-5',
        eyebrow: 'Práctica 5 · 15 min',
        title: 'Compartirlo como tutor del curso',
        blocks: [
          {
            type: 'numbered',
            items: [
              'Abra Compartir y revise los permisos: ver o editar; quién puede preguntar.',
              'Decida si comparte con el dominio de la universidad o solo con el enlace.',
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
            text: 'Revise si su cuenta permite compartir fuera del dominio y si los estudiantes pueden ver las fuentes. Si no, comparta la guía de estudio como documento y reserve el cuaderno para su preparación.',
          },
        ],
      },
      {
        id: 'practica-6',
        eyebrow: 'Práctica 6 · 15 min',
        title: 'Bibliografía sistematizada (si el tiempo alcanza)',
        blocks: [
          {
            type: 'p',
            text: 'Este paso es opcional y se puede dejar como tarea. Hay tres caminos, de menor a mayor complejidad:',
          },
          {
            type: 'cards',
            items: [
              { title: 'Zotero', description: 'Gestor de referencias gratuito. Guarda, organiza y exporta en APA, BibTeX o RIS. Es el piso mínimo.', tag: 'Gestor', url: 'https://www.zotero.org' },
              { title: 'MCP de Scopus', description: 'Si la universidad tiene acceso, un conector consulta metadatos y DOIs sin salir del chat. Depende de la licencia y del conector.', tag: 'Conector' },
              { title: 'MarkItDown', description: 'Herramienta de Microsoft que convierte PDF, Word o PowerPoint a Markdown limpio. Menos tokens y menos ruido de tablas.', tag: 'Contexto', url: 'https://github.com/microsoft/markitdown' },
            ],
          },
          {
            type: 'p',
            text: 'Un flujo realista: bajar los PDF del curso, convertirlos a Markdown con MarkItDown, pasarlos a Claude o ChatGPT con el programa y pedir una tabla de referencias normalizada. Después se importa esa tabla a Zotero.',
          },
          {
            type: 'prompt',
            label: 'Normalizar la bibliografía',
            text: `Te paso el programa y las referencias del curso en Markdown.

1. Normaliza cada referencia en APA 7.
2. Elimina duplicados y marca los que no tengan datos completos como «verificar».
3. Clasifica por unidad del programa y por tipo (libro, artículo, capítulo, norma).
4. Devuelve una tabla con: autor, año, título, tipo, unidad, DOI o URL y estado.
5. No inventes DOI, editoriales ni años. Si no está en el texto, escribe «verificar».`,
          },
          {
            type: 'note',
            text: 'MarkItDown no resume el PDF: lo convierte a texto limpio. Úselo cuando el PDF tenga tablas o columnas y el copiar y pegar salga desordenado. Así también gasta menos tokens al pasarlo a Claude.',
          },
          {
            type: 'note',
            text: 'Si no hay acceso a Scopus, use Google Scholar y Zotero. El flujo es el mismo; cambia la fuente de los metadatos.',
          },
        ],
      },
      {
        id: 'entregable',
        eyebrow: 'Entregable · 15 min',
        title: 'Lo que se lleva',
        blocks: [
          {
            type: 'list',
            items: [
              'El enlace al cuaderno del curso, con las fuentes cargadas y los permisos definidos.',
              'Una guía de estudio descargada y revisada, lista para Moodle.',
              'Una tabla de bibliografía normalizada, con los datos faltantes marcados.',
              'Tres citas verificadas: pregunta, respuesta y fuente abierta.',
            ],
          },
          {
            type: 'checklist',
            items: [
              'El cuaderno responde solo con las fuentes del curso.',
              'Cada respuesta que voy a usar tiene una cita que abrí y verifiqué.',
              'La guía de estudio no contiene datos inventados ni referencias falsas.',
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
      {
        id: 'notas',
        eyebrow: 'Para el docente',
        title: 'Por confirmar y advertencias',
        blocks: [
          { type: 'callout', tone: 'warn', title: 'Por confirmar antes de dictar', text: 'Que NotebookLM esté habilitado en las cuentas @unal.edu.co, si se puede compartir fuera del dominio y si la universidad tiene acceso a Scopus para el MCP de bibliografía.' },
          { type: 'note', text: 'Los límites de fuentes y de cuadernos cambian. Revise la cifra vigente el día anterior y ajuste el número de documentos de la práctica.' },
          { type: 'note', text: 'Si no hay acceso a Scopus, la práctica 6 se hace con Zotero y Google Scholar; el entregable no cambia.' },
          { type: 'note', text: 'MarkItDown requiere instalación local. Si el grupo no tiene Python, muestre el resultado ya convertido y deje el enlace como recurso.' },
        ],
      },
    ],
    next: { label: 'Sesión 03 · Herramientas', slug: 'mcp' },
  },

  mcp: {
    session: '03',
    title: 'IA dentro de las herramientas de trabajo',
    lead:
      'El mismo caso de aula, resuelto dos veces: una con Google Workspace y otra con Microsoft 365. La sesión se adapta a la licencia que haya. Si no hay licencia, el ejercicio se hace con cuentas gratuitas y se pierde la edición dentro de la herramienta, no el aprendizaje.',
    meta: [
      { label: 'Duración', value: '2 horas' },
      { label: 'Formato', value: '15 idea · 90 práctica · 15 entregable' },
      { label: 'Requiere', value: 'Cuenta @unal y la suite que esté licenciada' },
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
            headers: ['Tarea docente', 'Google Workspace', 'Microsoft 365'],
            rows: [
              ['Analizar notas y hacer un gráfico', 'Gemini en Sheets', 'Copilot en Excel'],
              ['Escribir retroalimentación y borradores de correo', 'Gemini en Gmail', 'Copilot en Outlook'],
              ['Convertir apuntes en presentación', 'Docs a Slides con Gemini', 'Word a PowerPoint con Copilot'],
              ['Resumir una reunión o clase', 'Meet y Docs', 'Teams y Word'],
              ['Buscar en los archivos del curso', 'Drive', 'OneDrive y SharePoint'],
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
        eyebrow: 'Práctica 2 · 25 min',
        title: 'Analizar el grupo',
        blocks: [
          {
            type: 'p',
            text: 'Abra la hoja y use el panel de IA de la suite (Gemini en Sheets o Copilot en Excel). Si no lo tiene, descargue la hoja como CSV y súbala al chat; el análisis es el mismo.',
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
        eyebrow: 'Práctica 5 · 15 min',
        title: 'Conectores de un clic y plan B',
        blocks: [
          {
            type: 'p',
            text: 'Si su cuenta no tiene Gemini en Workspace ni Copilot, hay tres caminos gratuitos para el mismo ejercicio:',
          },
          {
            type: 'cards',
            items: [
              { title: 'Claude con conectores', description: 'Conecte Google Drive o Gmail desde la configuración de Claude y pídale leer una carpeta o un documento. Revise qué carpeta autoriza.', tag: 'Gratis', url: 'https://claude.ai' },
              { title: 'Gemini web con archivos', description: 'Descargue la hoja como CSV o Excel y súbala al chat. El análisis y los correos se pueden hacer igual.', tag: 'Gratis', url: 'https://gemini.google.com' },
              { title: 'Copilot web', description: 'Versión gratuita para probar el flujo de Microsoft sin licencia institucional. Los límites de uso son distintos.', tag: 'Gratis', url: 'https://copilot.microsoft.com' },
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
      {
        id: 'notas',
        eyebrow: 'Para el docente',
        title: 'Por confirmar y advertencias',
        blocks: [
          { type: 'callout', tone: 'warn', title: 'Por confirmar antes de dictar', text: 'Qué suite tiene licencia la universidad, si Gemini está habilitado en Workspace for Education y si hay Microsoft 365 Copilot. Sin esa respuesta, la sesión se dicta con el plan B.' },
          { type: 'note', text: 'Si hay licencia de una sola suite, prepare la práctica con esa y deje la otra como demostración de 10 minutos. No divida al grupo en dos flujos completos.' },
          { type: 'note', text: 'Las funciones de IA dentro de las suites cambian por plan y por país. Verifique el día anterior qué botón existe realmente en la cuenta de clase.' },
          { type: 'note', text: 'Nunca use notas reales de estudiantes en la demostración. Prepare la hoja ficticia antes de la sesión.' },
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
      { time: '30 min', label: 'Camino B', detail: 'Flujo automatizado: Forms, hoja y borradores de correo; o PDF a Markdown.' },
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
              ['Exámenes sin aplicar', 'No', 'Riesgo de filtración; use un examen viejo o inventado.'],
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
        eyebrow: 'Práctica 3 · Camino B · 30 min',
        title: 'Flujo automatizado de retroalimentación',
        blocks: [
          {
            type: 'p',
            text: 'Elija este camino si quiere ahorrar tiempo recurrente: un formulario que recibe una entrega, una hoja que la organiza y un borrador de retroalimentación que usted revisa. Sin enviar nada automáticamente.',
          },
          {
            type: 'p',
            text: '**Ruta mínima con herramientas de la universidad:** Google Forms → hoja de respuestas → borrador de correo. Se puede hacer con Apps Script o con un automatizador como Make o Zapier.',
          },
          {
            type: 'numbered',
            items: [
              'Cree un formulario con: código del estudiante, unidad, tres preguntas de reflexión y un enlace al trabajo.',
              'Conecte las respuestas a una hoja de cálculo.',
              'Defina la plantilla de retroalimentación: logro, dificultad, acción y plazo.',
              'Genere el borrador con la plantilla y los datos de la fila; déjelo en Borradores, no en Enviados.',
              'Pruebe con dos respuestas ficticias y revise el resultado antes de invitar al grupo.',
            ],
          },
          {
            type: 'prompt',
            label: 'Plantilla del borrador',
            text: `Eres asistente del curso [asignatura]. Con esta fila de la hoja:
[código, unidad, respuestas, enlace]

Escribe un borrador de correo de máximo 120 palabras:
- Reconoce un aspecto concreto de la respuesta.
- Señala una dificultad y por qué importa.
- Propone una acción para la próxima entrega con plazo.
- Tono respetuoso, sin comparar con otros estudiantes.
No inventes datos. Si falta algo, escribe [verificar]. Devuelve solo asunto y cuerpo.`,
          },
          {
            type: 'callout',
            tone: 'warn',
            title: 'El flujo no envía solo',
            text: 'El último paso siempre es una persona. Un flujo que envía notas o retroalimentación sin revisión es un riesgo de privacidad y de errores difíciles de revertir.',
          },
          {
            type: 'p',
            text: '**Variante PDF a Markdown.** Si el cuello de botella son los PDF largos, conviértalos con MarkItDown antes de pasarlos a Claude: menos tokens, tablas ordenadas y contexto más limpio. Úselo para el material del curso, no para trabajos de estudiantes sin permiso.',
          },
          {
            type: 'note',
            text: 'Si no hay tiempo para automatizar, el piloto puede ser el flujo manual: formulario, hoja y plantilla de correo. Lo que se evalúa es el diseño del flujo, no la herramienta.',
          },
          { type: 'links', items: [{ label: 'Google Forms', url: 'https://forms.google.com', provider: 'Google' }, { label: 'Make', url: 'https://www.make.com', provider: 'Make' }, { label: 'MarkItDown', url: 'https://github.com/microsoft/markitdown', provider: 'Microsoft' }] },
        ],
      },
      {
        id: 'cierre',
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
      {
        id: 'notas',
        eyebrow: 'Para el docente',
        title: 'Por confirmar y advertencias',
        blocks: [
          { type: 'callout', tone: 'warn', title: 'La sesión más apretada', text: 'Si el grupo va lento, el camino B se demuestra y se deja como plantilla. El entregable mínimo es un camino terminado y la ficha, no los dos.' },
          { type: 'note', text: 'La socialización de la sesión 3 es opcional y dura 5 minutos. Si se salta, ese tiempo pasa al entregable.' },
          { type: 'note', text: 'Verifique el día anterior que Claude Artifacts y Gemini Canvas estén disponibles en las cuentas gratuitas del grupo. Si no, el camino A se hace con las preguntas en un documento y se muestra la app ya construida.' },
          { type: 'note', text: 'La tabla de datos es una guía de conversación. Antes de afirmar algo sobre una herramienta, revise su política vigente y la normativa de la universidad.' },
        ],
      },
    ],
    next: { label: 'Volver al resumen', slug: null },
  },
}
