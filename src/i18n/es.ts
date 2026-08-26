import type { Translations } from './types.js';

export const es: Translations = {
  common: {
    fileNotFound: (p) => `\u274C Archivo no encontrado: ${p}`,
    dirNotFound: (p) => `\u274C Directorio no encontrado: ${p}`,
    pathNotFound: (p) => `\u274C Ruta no encontrada: ${p}`,
    error: (msg) => `\u274C Error: ${msg}`,
    errorGeneric: (msg) => `\u274C Error: ${msg}`,
    pathIsDirectory: (p) => `\u274C La ruta es un directorio: ${p}`,
    pathIsNotDirectory: (p) => `\u274C La ruta no es un directorio: ${p}`,
    pathIsDirectoryUseListDir: (p) => `\u274C La ruta es un directorio: ${p}. Usa fc_list_directory.`,
    pathIsNotDirUseReadFile: (p) => `\u274C La ruta no es un directorio: ${p}. Usa fc_read_file.`,
    pathIsDirectoryUseDeleteDir: `\u274C La ruta es un directorio. Usa fc_delete_directory.`,
    sourceNotFound: (p) => `\u274C Origen no encontrado: ${p}`,
    weekdays: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  },

  fc_read_file: {
    moreLines: (count) => `\n\n... (${count} líneas más)`,
    fileHeader: (name, size) => `\uD83D\uDCC4 **${name}** (${size})`,
    readError: (msg) => `\u274C Error al leer el archivo: ${msg}`,
  },

  fc_write_file: {
    actionAppended: 'anexado',
    actionWritten: 'escrito',
    success: (action, p) => `\u2705 Archivo ${action}: ${p}`,
    sizeLabel: (size) => `\uD83D\uDCCA Tamaño: ${size}`,
    writeError: (msg) => `\u274C Error al escribir el archivo: ${msg}`,
  },

  fc_list_directory: {
    dirHeader: (p) => `\uD83D\uDCC2 **${p}**`,
    emptyDir: '(El directorio está vacío)',
    listError: (msg) => `\u274C Error al listar el directorio: ${msg}`,
  },

  fc_create_directory: {
    alreadyExists: (p) => `\u2139\uFE0F El directorio ya existe: ${p}`,
    created: (p) => `\u2705 Directorio creado: ${p}`,
    createError: (msg) => `\u274C Error al crear el directorio: ${msg}`,
  },

  fc_delete_file: {
    deleted: (p) => `\u2705 Archivo eliminado: ${p}`,
    deleteError: (msg) => `\u274C Error al eliminar el archivo: ${msg}`,
  },

  fc_delete_directory: {
    deleted: (p) => `\u2705 Directorio eliminado: ${p}`,
    notEmpty: `\u274C El directorio no está vacío. Usa recursive=true para eliminar todo el contenido.`,
    deleteError: (msg) => `\u274C Error al eliminar el directorio: ${msg}`,
  },

  fc_move: {
    moved: (source, dest) => `\u2705 Movido:\n  \uD83D\uDCE4 ${source}\n  \uD83D\uDCE5 ${dest}`,
    movedViaFallback: (source, dest) => `\u2705 Movido (mediante copiar+eliminar; bloqueo de nube evitado):\n  \uD83D\uDCE4 ${source}\n  \uD83D\uDCE5 ${dest}`,
    moveError: (msg) => `\u274C Error al mover: ${msg}`,
  },

  fc_copy: {
    copied: (source, dest) => `\u2705 Copiado:\n  \uD83D\uDCE4 ${source}\n  \uD83D\uDCE5 ${dest}`,
    copyError: (msg) => `\u274C Error al copiar: ${msg}`,
  },

  fc_file_info: {
    header: (name) => `\uD83D\uDCCB **Información: ${name}**`,
    typeDirectory: 'Directorio',
    typeFile: 'Archivo',
    typeOther: 'Otro',
    propType: 'Tipo',
    propSize: 'Tamaño',
    propCreated: 'Creado',
    propModified: 'Modificado',
    propAccessed: 'Accedido',
    propPath: 'Ruta',
  },

  fc_search_files: {
    noResults: (pattern) => `\uD83D\uDD0D No se encontraron archivos para: "${pattern}"`,
    resultsHeader: (pattern) => `\uD83D\uDD0D **Resultados de búsqueda para "${pattern}"**`,
    inDir: (dir) => `\uD83D\uDCC1 En: ${dir}`,
    found: (count) => `\uD83D\uDCCA Encontrados: ${count}`,
    maxReached: '(máximo alcanzado)',
    searchError: (msg) => `\u274C Error de búsqueda: ${msg}`,
  },

  fc_search_content: {
    description: 'Busca texto únicamente en los archivos proporcionados explícitamente. Búsqueda literal por defecto, expresiones regulares opcionales, salida JSON determinista y limitada, errores parciales por archivo, omisión de binarios, líneas de contexto y censura de secretos. No expande globs ni recorre directorios.',
    invalidRegex: '\u274C Sintaxis de expresión regular no válida.',
    missing: 'Archivo no encontrado.',
    notFile: 'La ruta no es un archivo normal.',
    permissionDenied: 'Permiso denegado.',
    cloudUnavailable: 'El archivo en la nube no está disponible o está bloqueado.',
    encodingError: 'El archivo no contiene texto UTF-8 válido.',
    readError: 'No se pudo leer el archivo.',
    tooLarge: 'El archivo supera el límite de búsqueda de 10 MB.',
    binary: 'Archivo binario omitido.',
    globalLimitReached: 'Omitido porque se alcanzó el límite global de resultados.',
  },

  fc_start_search: {
    started: (id, dir, pattern) => `\uD83D\uDD0D **Búsqueda iniciada**\n\n| | |\n|---|---|\n| ID de búsqueda | \`${id}\` |\n| Directorio | ${dir} |\n| Patrón | ${pattern} |`,
    useGetResults: `Usa \`fc_get_search_results\` para obtener resultados.`,
    startError: (msg) => `\u274C Error al iniciar la búsqueda: ${msg}`,
  },

  fc_get_search_results: {
    notFound: (id) => `\u274C Búsqueda no encontrada: ${id}`,
    useListSearches: `Usa fc_list_searches para ver búsquedas activas.`,
    statusRunning: '\uD83D\uDD04 En ejecución',
    statusDone: '\u2705 Completada',
    header: (status) => `\uD83D\uDD0D **Resultados de búsqueda** (${status})`,
    labelPattern: 'Patrón',
    labelDirectory: 'Directorio',
    labelScannedDirs: 'Directorios examinados',
    labelFound: (count) => `${count} archivos`,
    labelRuntime: (seconds) => `${seconds}s`,
    resultsRange: (from, to, total) => `**Resultados ${from}-${to} de ${total}:**`,
    moreResults: (id, offset) => `\uD83D\uDCCC Más resultados: \`fc_get_search_results("${id}", offset=${offset})\``,
  },

  fc_stop_search: {
    notFound: (id) => `\u274C Búsqueda no encontrada: ${id}`,
    alreadyDone: (count) => `\u2139\uFE0F La búsqueda ya terminó. ${count} resultados encontrados.`,
    stopped: (id) => `\u23F9\uFE0F Búsqueda detenida: ${id}`,
    resultsSoFar: (count) => `\uD83D\uDCCA ${count} resultados encontrados hasta ahora.`,
  },

  fc_list_searches: {
    noSearches: `\uD83D\uDCCB No hay búsquedas activas.`,
    useStartSearch: `Inicia una nueva con \`fc_start_search\`.`,
    header: (count) => `\uD83D\uDCCB **Búsquedas** (${count})`,
    colStatus: 'Estado',
    colSearchId: 'ID de búsqueda',
    colPattern: 'Patrón',
    colResults: 'Resultados',
    colRuntime: 'Tiempo',
  },

  fc_clear_search: {
    notFound: (id) => `\u274C Búsqueda no encontrada: ${id}`,
    cleared: (count) => `\uD83E\uDDF9 ${count} búsquedas completadas eliminadas.`,
    stillRunning: `\u26A0\uFE0F La búsqueda sigue en ejecución. Usa fc_stop_search primero.`,
    useStopFirst: `Usa fc_stop_search primero.`,
    removed: (id) => `\u2705 Búsqueda eliminada: ${id}`,
  },

  fc_safe_delete: {
    typeDirectory: 'Directorio',
    typeFile: 'Archivo',
    movedToTrash: `\uD83D\uDDD1\uFE0F **Movido a la papelera**`,
    propType: 'Tipo',
    propPath: 'Ruta',
    propOriginal: 'Original',
    propTrash: 'Papelera',
    canRestore: `\u2705 Puede restaurarse desde la papelera.`,
    trashError: (msg) => `\u274C Error al mover a la papelera: ${msg}`,
  },

  fc_execute_command: {
    commandLabel: (cmd) => `\u26A1 **Comando:** \`${cmd}\``,
    outputLabel: '**Salida:**',
    stderrLabel: '**Salida de error:**',
    noOutput: `\u2705 Comando ejecutado (sin salida)`,
    execError: (msg) => `\u274C Error al ejecutar el comando:\n${msg}`,
  },

  fc_start_process: {
    started: (program, args) => `\uD83D\uDE80 Proceso iniciado: ${program}${args}`,
    pidLabel: (pid) => `\uD83D\uDCCB PID: ${pid}`,
    startError: (msg) => `\u274C Error al iniciar el proceso: ${msg}`,
  },

  fc_open_path: {
    description: 'Abre un archivo o directorio local existente con la aplicación predeterminada del sistema operativo.',
    launchRequested: (targetPath, platform) => `\uD83D\uDE80 Solicitud de apertura iniciada: ${targetPath} (plataforma: ${platform})`,
    noVisibleConfirmation: 'El iniciador nativo aceptó la solicitud; no se confirma automáticamente que la aplicación de destino se haya abierto de forma visible.',
    notFound: (targetPath) => `\u274C Ruta no encontrada: ${targetPath}`,
    unsupportedTarget: (targetPath) => `\u274C La ruta no es un archivo normal ni un directorio: ${targetPath}`,
    unsupportedPlatform: (platform) => `\u274C Plataforma no compatible: ${platform}`,
    launchError: (msg) => `\u274C Error al iniciar la solicitud de apertura: ${msg}`,
  },

  fc_get_time: {
    header: `\uD83D\uDD50 **Hora actual del sistema**`,
    labelDate: 'Fecha',
    labelTime: 'Hora',
    labelWeekday: 'Día de la semana',
    labelISO: 'ISO',
    labelTimezone: 'Zona horaria',
  },

  fc_read_multiple_files: {
    notFound: 'No encontrado',
    isDirectory: 'Es un directorio',
    moreLines: (count) => `... (${count} líneas más)`,
    summary: (success, errors) => `\uD83D\uDCCA **Resultado:** ${success} leídos, ${errors} errores`,
  },

  fc_edit_file: {
    invalidStartLine: (line, total) => `\u274C Línea inicial ${line} no válida. El archivo tiene ${total} líneas.`,
    invalidEndLine: (line) => `\u274C Línea final ${line} no válida.`,
    contentRequired: (op) => `\u274C Se requiere 'content' para la operación ${op}.`,
    unknownOperation: (op) => `\u274C Operación desconocida: ${op}`,
    replacedLines: (start, end, count) => `Líneas ${start}-${end} reemplazadas por ${count} líneas`,
    insertedLines: (count, after) => `${count} líneas insertadas después de la línea ${after}`,
    deletedLines: (start, end) => `Líneas ${start}-${end} eliminadas`,
    edited: (name) => `\u2705 **${name}** editado`,
    lineChange: (before, after) => `\uD83D\uDCCA ${before} \u2192 ${after} líneas`,
    editError: (msg) => `\u274C Error al editar el archivo: ${msg}`,
  },

  fc_str_replace: {
    pathIsDirectory: (p) => `\u274C La ruta es un directorio: ${p}`,
    notFoundInFile: (name) => `\u274C Cadena no encontrada en ${name}.`,
    searchedFor: '**Se buscó:**',
    fileStart: '**Inicio del archivo:**',
    multipleOccurrences: (count) => `\u274C La cadena aparece ${count} veces (debe ser única).`,
    mustBeUnique: 'debe ser única',
    tip: `\uD83D\uDCA1 Consejo: amplía la cadena de búsqueda con más contexto.`,
    replaced: (name) => `\u2705 **${name}** - Cadena reemplazada`,
    sameLineCount: 'mismo número de líneas',
    addedLines: (count) => `+${count} líneas`,
    removedLines: (count) => `${count} líneas`,
    labelChange: 'Cambio',
    labelFile: 'Archivo',
    contextLabel: '**Contexto:**',
    replaceError: (msg) => `\u274C Error al reemplazar la cadena: ${msg}`,
  },

  fc_list_processes: {
    noProcesses: (filter) => `\uD83D\uDD0D No se encontraron procesos${filter ? ` para "${filter}"` : ''}.`,
    header: (filter) => `\uD83D\uDCCB **Procesos en ejecución**${filter ? ` (Filtro: ${filter})` : ''}`,
    colName: 'Nombre',
    colPid: 'PID',
    colMemory: 'Memoria',
    listError: (msg) => `\u274C Error al listar procesos: ${msg}`,
  },

  fc_kill_process: {
    pidOrNameRequired: `\u274C Debe indicarse 'pid' o 'name'.`,
    killed: (target) => `\u2705 Proceso terminado: ${target}`,
    killError: (msg) => `\u274C Error al terminar el proceso: ${msg}`,
  },

  fc_start_session: {
    started: (id, command, pid, cwd) => `\uD83D\uDE80 **Sesión iniciada**\n\n| | |\n|---|---|\n| ID de sesión | \`${id}\` |\n| Comando | ${command} |\n| PID | ${pid} |\n| Directorio | ${cwd} |`,
    useReadAndSend: `Usa \`fc_read_output\` y \`fc_send_input\` para interactuar.`,
    startError: (msg) => `\u274C Error al iniciar la sesión: ${msg}`,
    processExited: (code) => `\n[El proceso terminó con código ${code}]`,
    processError: (msg) => `\n[Error: ${msg}]`,
  },

  fc_read_output: {
    notFound: (id) => `\u274C Sesión no encontrada: ${id}`,
    useListSessions: `Usa fc_list_sessions para ver sesiones activas.`,
    statusRunning: '\uD83D\uDFE2 En ejecución',
    statusEnded: '\uD83D\uDD34 Finalizada',
    header: (status) => `\uD83D\uDCE4 **Salida de sesión** (${status})`,
    noOutput: '(sin salida)',
  },

  fc_send_input: {
    notFound: (id) => `\u274C Sesión no encontrada: ${id}`,
    sessionEnded: `\u274C La sesión ha finalizado. Inicia una nueva con fc_start_session.`,
    useStartSession: 'Inicia una nueva con fc_start_session.',
    sent: (id) => `\uD83D\uDCE5 Entrada enviada a ${id}:`,
    useReadOutput: `Usa \`fc_read_output\` para leer la respuesta.`,
    sendError: (msg) => `\u274C Error al enviar la entrada: ${msg}`,
  },

  fc_list_sessions: {
    noSessions: `\uD83D\uDCCB No hay sesiones disponibles.`,
    useStartSession: `Inicia una nueva con \`fc_start_session\`.`,
    header: (count) => `\uD83D\uDCCB **Sesiones activas** (${count})`,
    colStatus: 'Estado',
    colSessionId: 'ID de sesión',
    colCommand: 'Comando',
    colPid: 'PID',
    colRuntime: 'Tiempo',
  },

  fc_close_session: {
    notFound: (id) => `\u274C Sesión no encontrada: ${id}`,
    closed: (id) => `\u2705 Sesión terminada y eliminada: ${id}`,
    closeError: (msg) => `\u274C Error al cerrar la sesión: ${msg}`,
  },

  fc_fix_json: {
    alreadyValid: (name) => `\u2705 ${name} ya es JSON válido.`,
    fixBom: 'BOM UTF-8 eliminado',
    fixNul: 'Bytes NUL eliminados',
    fixSingleLineComments: 'Comentarios de una línea eliminados',
    fixMultiLineComments: 'Comentarios multilínea eliminados',
    fixTrailingCommas: 'Comas finales eliminadas',
    fixSingleQuotes: 'Comillas simples \u2192 comillas dobles',
    analysisHeader: (name) => `\uD83D\uDD0D **Análisis JSON: ${name}**`,
    foundProblems: '**Problemas encontrados:**',
    noAutoFixable: 'No hay problemas reparables automáticamente.',
    afterFixValid: `\u2705 Después de reparar: JSON válido`,
    afterFixInvalid: (error) => `\u26A0\uFE0F Después de reparar sigue inválido: ${error}`,
    repairedHeader: (name) => `\u2705 **JSON reparado: ${name}**`,
    validJson: `\u2705 JSON válido`,
    stillInvalid: (error) => `\u26A0\uFE0F Sigue inválido: ${error}`,
    backupCreated: (p) => `\uD83D\uDCCB Copia de seguridad: ${p}`,
  },

  fc_validate_json: {
    validHeader: (name) => `\u2705 **JSON válido: ${name}**`,
    typeArray: (count) => `Array (${count} elementos)`,
    typeObject: (count) => `Objeto (${count} claves)`,
    propType: 'Tipo',
    propSize: 'Tamaño',
    propBom: 'BOM',
    propBomYes: '\u26A0\uFE0F Sí',
    propBomNo: 'No',
    propEncoding: 'Codificación',
    invalidHeader: (name) => `\u274C **JSON inválido: ${name}**`,
    errorLabel: '**Error:**',
    errorPosition: (line, col) => `**Posición del error:** Línea ${line}, Columna ${col}`,
    useFcFixJson: `\uD83D\uDCA1 Usa \`fc_fix_json\` para reparación automática.`,
  },

  fc_cleanup_file: {
    noCleanupNeeded: (count) => `\u2705 No se necesita limpieza. ${count} archivos revisados.`,
    previewHeader: '\uD83D\uDD0D **Vista previa**',
    cleanedHeader: '\u2705 **Limpieza realizada**',
    cleanedCount: (fixed, total) => `${fixed}/${total} archivos`,
  },

  fc_fix_encoding: {
    noErrors: (name) => `\u2705 No se encontraron errores de codificación en ${name}.`,
    analysisHeader: (name) => `\uD83D\uDD0D **Análisis de codificación: ${name}**`,
    foundMojibake: '**Patrones mojibake encontrados:**',
    repairedHeader: (name) => `\u2705 **Codificación reparada: ${name}**`,
    backupCreated: (p) => `\uD83D\uDCCB Copia de seguridad: ${p}`,
  },

  fc_folder_diff: {
    firstSnapshot: (name) => `\uD83D\uDCF8 **Primera instantánea creada: ${name}**`,
    labelFiles: 'Archivos',
    labelSnapshot: 'Instantánea',
    nextCallInfo: 'Los cambios se detectarán en la siguiente llamada.',
    noChanges: (name, count) => `\u2705 Sin cambios en ${name}. ${count} archivos revisados.`,
    diffHeader: (name) => `\uD83D\uDCCA **Diff de directorio: ${name}**`,
    catNew: 'Archivos nuevos',
    catModified: 'Modificados',
    catDeleted: 'Eliminados',
    catUnchanged: 'Sin cambios',
    newFiles: '**Archivos nuevos:**',
    modifiedFiles: '**Archivos modificados:**',
    deletedFiles: '**Archivos eliminados:**',
    andMore: (count) => `... y ${count} más`,
  },

  fc_batch_rename: {
    noMatchingFiles: (dir) => `\uD83D\uDD0D No hay archivos coincidentes en ${dir}`,
    noCommonPattern: (count) => `\uD83D\uDD0D No se detectó un patrón común en ${count} archivos.`,
    autoDetectHeader: (count) => `\uD83D\uDD0D **Detección automática: ${count} archivos**`,
    detectedPatterns: (patterns) => `Patrones detectados: ${patterns}`,
    suggestedRename: (prefix) => `**Cambio sugerido (quitar prefijo "${prefix}"):**`,
    andMore: (count) => `... y ${count} más`,
    useTip: (prefix) => `\uD83D\uDCA1 Usa \`mode="remove_prefix", pattern="${prefix}", dry_run=false\` para ejecutar.`,
    patternRequired: (mode) => `\u274C Se requiere 'pattern' para el modo "${mode}".`,
    noFilesMatchPattern: (pattern) => `\uD83D\uDD0D Ningún archivo coincide con el patrón "${pattern}".`,
    previewHeader: (count) => `\uD83D\uDD0D **Vista previa: ${count} renombres**`,
    setDryRunFalse: `\uD83D\uDCA1 Establece \`dry_run=false\` para ejecutar.`,
    renamed: (success, total) => `\u2705 **${success}/${total} archivos renombrados**`,
  },

  fc_convert_format: {
    sourceNotFound: (p) => `\u274C Archivo de origen no encontrado: ${p}`,
    csvNeedsRows: `\u274C CSV necesita al menos una cabecera y 1 fila de datos.`,
    csvNeedsArray: `\u274C La exportación CSV requiere un array JSON de objetos.`,
    iniNeedsObject: `\u274C La exportación INI requiere un objeto JSON.`,
    unsupportedFormat: (format) => `\u274C Formato no soportado: ${format}`,
    converted: (from, to) => `\u2705 **Convertido: ${from} \u2192 ${to}**`,
    labelSource: 'Origen',
    labelTarget: 'Destino',
    labelSize: 'Tamaño',
  },

  fc_detect_duplicates: {
    noDuplicates: (files, hashed) => `\u2705 No se encontraron duplicados. ${files} archivos revisados, ${hashed} con hash.`,
    header: `\uD83D\uDD0D **Duplicados encontrados**`,
    labelChecked: 'Archivos revisados',
    labelGroups: 'Grupos duplicados',
    labelDuplicates: 'Duplicados totales',
    labelWasted: 'Espacio desperdiciado',
    groupHeader: (index, size) => `**Grupo ${index}** (${size}):`,
    andMoreGroups: (count) => `... y ${count} grupos más`,
    useSafeDelete: `\uD83D\uDCA1 Usa \`fc_safe_delete\` para eliminar duplicados de forma segura.`,
  },

  fc_md_to_html: {
    converted: (name) => `\u2705 **Markdown \u2192 HTML: ${name}**`,
    labelSource: 'Origen',
    labelTarget: 'Destino',
    labelSize: 'Tamaño',
    openInBrowser: `\uD83D\uDCA1 Abre el archivo HTML en un navegador e imprímelo como PDF.`,
  },

  fc_md_to_pdf: {
    converted: (name) => `\u2705 **Markdown \u2192 PDF: ${name}**`,
    labelSource: 'Origen',
    labelTarget: 'Destino',
    labelSize: 'Tamaño',
    noBrowser: 'No se encontró navegador (Edge/Chrome). Se creó un archivo HTML en su lugar.',
    browserUsed: (name) => `PDF creado con ${name}`,
  },

  fc_ocr: {
    description: 'Extrae texto de imágenes (JPG/PNG/BMP/TIFF) mediante OCR (Tesseract).',
    notInstalled: '\u274C tesseract.js no está instalado. Instálalo con: npm install tesseract.js',
    unsupportedFormat: (ext) => `\u274C Formato de archivo no soportado para OCR: ${ext}`,
    pdfNotYetSupported: '\u274C OCR de PDF todavía no está soportado. Convierte primero las páginas PDF a imágenes.',
    header: (filename) => `\uD83D\uDD0D **Resultado OCR: ${filename}**`,
    labelLanguage: 'Idioma',
    labelConfidence: 'Confianza',
    labelChars: 'Caracteres',
    labelSaved: 'Guardado en',
  },

  fc_archive: {
    description: 'Crea, extrae y lista archivos ZIP.',
    created: (p) => `\u2705 **Archivo ZIP creado:** ${p}`,
    extracted: (archive, target) => `\u2705 **Extraído:** ${archive} \u2192 ${target}`,
    listHeader: (p) => `\uD83D\uDCC2 **Contenido del archivo: ${p}**`,
    labelSize: 'Tamaño',
    labelFiles: 'Archivos',
  },

  fc_checksum: {
    description: 'Calcula checksums (MD5/SHA1/SHA256/SHA512) de archivos.',
    header: (filename) => `\uD83D\uDD10 **Checksum: ${filename}**`,
    labelAlgorithm: 'Algoritmo',
    labelHash: 'Hash',
    match: '\u2705 ¡Los checksums coinciden!',
    mismatch: '\u274C ¡Los checksums NO coinciden!',
  },

  fc_set_safe_mode: {
    description: 'Activa/desactiva Safe Mode. Cuando está activo, todas las operaciones de borrado (fc_delete_file, fc_delete_directory) se redirigen a la papelera.',
    enabled: '\uD83D\uDEE1\uFE0F **Safe Mode activado.** Todas las operaciones de borrado usan ahora la papelera.',
    disabled: '\u26A0\uFE0F **Safe Mode desactivado.** Las operaciones de borrado ahora son permanentes.',
    redirected: (originalAction) => `\uD83D\uDEE1\uFE0F Safe Mode activo: ${originalAction} se redirigió a la papelera.`,
  },

  fc_check_cloud_lock: {
    description: 'Comprueba si una ruta puede estar bloqueada por un filtro de sincronización en la nube (cldflt.sys). Solo Windows.',
    notApplicable: '\u2139\uFE0F La comprobación de bloqueo de nube solo es relevante en Windows. No aplica en este sistema.',
    header: (p) => `\u2601\uFE0F **Diagnóstico de bloqueo de nube: ${p}**`,
    labelDriver: 'Controlador cldflt.sys',
    driverActive: '\uD83D\uDFE1 Activo (cargado)',
    driverInactive: '\uD83D\uDFE2 No cargado',
    labelInSyncFolder: 'En carpeta sincronizada',
    notInSyncFolder: '\u2014 No',
    labelRisk: 'Riesgo de bloqueo',
    riskHigh: '\uD83D\uDD34 Alto \u2014 las operaciones de renombrado pueden bloquearse',
    riskMedium: '\uD83D\uDFE1 Medio \u2014 condición parcial detectada',
    riskLow: '\uD83D\uDFE2 Bajo \u2014 no se espera conflicto con sincronización en la nube',
    advice: '\uD83D\uDCA1 fc_move usa automáticamente un fallback copiar+eliminar cuando el filtro de nube bloquea.',
    checkError: (msg) => `\u274C Error al comprobar el bloqueo de nube: ${msg}`,
  },

  fc_web_fetch: {
    description: 'Obtiene una página web y devuelve contenido según el modo: extract (texto principal limpio), raw (cuerpo HTTP, truncado), links, forms o headers. Herramienta de red de solo lectura; los destinos internos/privados están bloqueados por defecto (usa allow_private para permitirlos).',
  },

  server: {
    started: '\uD83D\uDE80 Servidor MCP FileCommander iniciado',
    languageSet: (lang) => `Idioma establecido en: ${lang}`,
    languageGet: (lang, supported) => `Idioma actual: ${lang} (Soportados: ${supported.join(', ')})`,
  },
};
