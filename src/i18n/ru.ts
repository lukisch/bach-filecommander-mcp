import type { Translations } from './types.js';

export const ru: Translations = {
  common: {
    fileNotFound: (p) => `\u274C Файл не найден: ${p}`,
    dirNotFound: (p) => `\u274C Каталог не найден: ${p}`,
    pathNotFound: (p) => `\u274C Путь не найден: ${p}`,
    error: (msg) => `\u274C Ошибка: ${msg}`,
    errorGeneric: (msg) => `\u274C Ошибка: ${msg}`,
    pathIsDirectory: (p) => `\u274C Путь является каталогом: ${p}`,
    pathIsNotDirectory: (p) => `\u274C Путь не является каталогом: ${p}`,
    pathIsDirectoryUseListDir: (p) => `\u274C Путь является каталогом: ${p}. Используйте fc_list_directory.`,
    pathIsNotDirUseReadFile: (p) => `\u274C Путь не является каталогом: ${p}. Используйте fc_read_file.`,
    pathIsDirectoryUseDeleteDir: `\u274C Путь является каталогом. Используйте fc_delete_directory.`,
    sourceNotFound: (p) => `\u274C Источник не найден: ${p}`,
    weekdays: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
  },

  fc_read_file: {
    moreLines: (count) => `\n\n... (ещё ${count} строк)`,
    fileHeader: (name, size) => `\uD83D\uDCC4 **${name}** (${size})`,
    readError: (msg) => `\u274C Ошибка чтения файла: ${msg}`,
  },

  fc_write_file: {
    actionAppended: 'дополнен',
    actionWritten: 'записан',
    success: (action, p) => `\u2705 Файл ${action}: ${p}`,
    sizeLabel: (size) => `\uD83D\uDCCA Размер: ${size}`,
    writeError: (msg) => `\u274C Ошибка записи файла: ${msg}`,
  },

  fc_list_directory: {
    dirHeader: (p) => `\uD83D\uDCC2 **${p}**`,
    emptyDir: '(Каталог пуст)',
    listError: (msg) => `\u274C Ошибка вывода каталога: ${msg}`,
  },

  fc_create_directory: {
    alreadyExists: (p) => `\u2139\uFE0F Каталог уже существует: ${p}`,
    created: (p) => `\u2705 Каталог создан: ${p}`,
    createError: (msg) => `\u274C Ошибка создания каталога: ${msg}`,
  },

  fc_delete_file: {
    deleted: (p) => `\u2705 Файл удалён: ${p}`,
    deleteError: (msg) => `\u274C Ошибка удаления файла: ${msg}`,
  },

  fc_delete_directory: {
    deleted: (p) => `\u2705 Каталог удалён: ${p}`,
    notEmpty: `\u274C Каталог не пуст. Установите recursive=true, чтобы удалить всё содержимое.`,
    deleteError: (msg) => `\u274C Ошибка удаления каталога: ${msg}`,
  },

  fc_move: {
    moved: (source, dest) => `\u2705 Перемещено:\n  \uD83D\uDCE4 ${source}\n  \uD83D\uDCE5 ${dest}`,
    movedViaFallback: (source, dest) => `\u2705 Перемещено (через copy+delete, облачная блокировка обойдена):\n  \uD83D\uDCE4 ${source}\n  \uD83D\uDCE5 ${dest}`,
    moveError: (msg) => `\u274C Ошибка перемещения: ${msg}`,
  },

  fc_copy: {
    copied: (source, dest) => `\u2705 Скопировано:\n  \uD83D\uDCE4 ${source}\n  \uD83D\uDCE5 ${dest}`,
    copyError: (msg) => `\u274C Ошибка копирования: ${msg}`,
  },

  fc_file_info: {
    header: (name) => `\uD83D\uDCCB **Информация: ${name}**`,
    typeDirectory: 'Каталог',
    typeFile: 'Файл',
    typeOther: 'Другое',
    propType: 'Тип',
    propSize: 'Размер',
    propCreated: 'Создан',
    propModified: 'Изменён',
    propAccessed: 'Открыт',
    propPath: 'Путь',
  },

  fc_search_files: {
    noResults: (pattern) => `\uD83D\uDD0D Файлы не найдены для: "${pattern}"`,
    resultsHeader: (pattern) => `\uD83D\uDD0D **Результаты поиска для "${pattern}"**`,
    inDir: (dir) => `\uD83D\uDCC1 В: ${dir}`,
    found: (count) => `\uD83D\uDCCA Найдено: ${count}`,
    maxReached: '(достигнут максимум)',
    searchError: (msg) => `\u274C Ошибка поиска: ${msg}`,
  },

  fc_search_content: {
    description: 'Ищет текст только в явно переданных файлах. По умолчанию используется буквальный поиск, дополнительно доступны регулярные выражения. Результат — детерминированный ограниченный JSON с частичными ошибками по файлам, пропуском двоичных файлов, строками контекста и скрытием секретов. Шаблоны путей не раскрываются, каталоги рекурсивно не обходятся.',
    invalidRegex: '\u274C Некорректный синтаксис регулярного выражения.',
    missing: 'Файл не найден.',
    notFile: 'Путь не указывает на обычный файл.',
    permissionDenied: 'Доступ запрещён.',
    cloudUnavailable: 'Облачный файл недоступен или заблокирован.',
    encodingError: 'Файл не является корректным текстом UTF-8.',
    readError: 'Не удалось прочитать файл.',
    tooLarge: 'Файл превышает лимит поиска 10 МБ.',
    binary: 'Двоичный файл пропущен.',
    globalLimitReached: 'Пропущено из-за достижения общего лимита результатов.',
  },

  fc_start_search: {
    started: (id, dir, pattern) => `\uD83D\uDD0D **Поиск запущен**\n\n| | |\n|---|---|\n| ID поиска | \`${id}\` |\n| Каталог | ${dir} |\n| Шаблон | ${pattern} |`,
    useGetResults: `Используйте \`fc_get_search_results\`, чтобы получить результаты.`,
    startError: (msg) => `\u274C Ошибка запуска поиска: ${msg}`,
  },

  fc_get_search_results: {
    notFound: (id) => `\u274C Поиск не найден: ${id}`,
    useListSearches: `Используйте fc_list_searches для активных поисков.`,
    statusRunning: '\uD83D\uDD04 Выполняется',
    statusDone: '\u2705 Завершён',
    header: (status) => `\uD83D\uDD0D **Результаты поиска** (${status})`,
    labelPattern: 'Шаблон',
    labelDirectory: 'Каталог',
    labelScannedDirs: 'Просканированные каталоги',
    labelFound: (count) => `${count} файлов`,
    labelRuntime: (seconds) => `${seconds}с`,
    resultsRange: (from, to, total) => `**Результаты ${from}-${to} из ${total}:**`,
    moreResults: (id, offset) => `\uD83D\uDCCC Ещё результаты: \`fc_get_search_results("${id}", offset=${offset})\``,
  },

  fc_stop_search: {
    notFound: (id) => `\u274C Поиск не найден: ${id}`,
    alreadyDone: (count) => `\u2139\uFE0F Поиск уже завершён. Найдено результатов: ${count}.`,
    stopped: (id) => `\u23F9\uFE0F Поиск остановлен: ${id}`,
    resultsSoFar: (count) => `\uD83D\uDCCA Найдено результатов на данный момент: ${count}.`,
  },

  fc_list_searches: {
    noSearches: `\uD83D\uDCCB Активных поисков нет.`,
    useStartSearch: `Запустите новый через \`fc_start_search\`.`,
    header: (count) => `\uD83D\uDCCB **Поиски** (${count})`,
    colStatus: 'Статус',
    colSearchId: 'ID поиска',
    colPattern: 'Шаблон',
    colResults: 'Результаты',
    colRuntime: 'Время',
  },

  fc_clear_search: {
    notFound: (id) => `\u274C Поиск не найден: ${id}`,
    cleared: (count) => `\uD83E\uDDF9 Удалено завершённых поисков: ${count}.`,
    stillRunning: `\u26A0\uFE0F Поиск ещё выполняется. Сначала используйте fc_stop_search.`,
    useStopFirst: `Сначала используйте fc_stop_search.`,
    removed: (id) => `\u2705 Поиск удалён: ${id}`,
  },

  fc_safe_delete: {
    typeDirectory: 'Каталог',
    typeFile: 'Файл',
    movedToTrash: `\uD83D\uDDD1\uFE0F **Перемещено в корзину**`,
    propType: 'Тип',
    propPath: 'Путь',
    propOriginal: 'Исходный путь',
    propTrash: 'Корзина',
    canRestore: `\u2705 Можно восстановить из корзины.`,
    trashError: (msg) => `\u274C Ошибка перемещения в корзину: ${msg}`,
  },

  fc_execute_command: {
    commandLabel: (cmd) => `\u26A1 **Команда:** \`${cmd}\``,
    outputLabel: '**Вывод:**',
    stderrLabel: '**Вывод ошибок:**',
    noOutput: `\u2705 Команда выполнена (без вывода)`,
    execError: (msg) => `\u274C Ошибка выполнения команды:\n${msg}`,
  },

  fc_start_process: {
    started: (program, args) => `\uD83D\uDE80 Процесс запущен: ${program}${args}`,
    pidLabel: (pid) => `\uD83D\uDCCB PID: ${pid}`,
    startError: (msg) => `\u274C Ошибка запуска процесса: ${msg}`,
  },

  fc_open_path: {
    description: 'Запускает системное приложение по умолчанию для существующего локального файла или каталога. Структурированный вывод разделяет launcher_accepted и user_visible=unknown и указывает удалённый резервный вариант.',
    launchRequested: (targetPath, platform) => `\uD83D\uDE80 Запрос на открытие запущен: ${targetPath} (платформа: ${platform})`,
    noVisibleConfirmation: 'Системный механизм запуска принял запрос; видимое открытие целевого приложения автоматически не подтверждается.',
    fallbackRecommended: (fallback) => `Удалённый/headless резервный вариант: ${fallback}`,
    notFound: (targetPath) => `\u274C Путь не найден: ${targetPath}`,
    unsupportedTarget: (targetPath) => `\u274C Путь не является обычным файлом или каталогом: ${targetPath}`,
    unsupportedPlatform: (platform) => `\u274C Неподдерживаемая платформа: ${platform}`,
    launchError: (msg) => `\u274C Ошибка запуска запроса на открытие: ${msg}`,
  },

  fc_preview_file: {
    description: 'Сначала возвращает MIME-тип, размер и возможность предпросмотра. Содержимое возвращается только после include_content=true и только в пределах фиксированного лимита как стандартный MCP-текст, изображение или ресурс.',
    metadataOnly: (targetPath, mimeType, sizeBytes, reason) => `Метаданные файла: ${targetPath} (${mimeType}, ${sizeBytes} байт; ${reason}).`,
    contentIncluded: (targetPath, mimeType, sizeBytes) => `Встроенное содержимое: ${targetPath} (${mimeType}, ${sizeBytes} байт).`,
    previewError: (targetPath, msg) => `\u274C Ошибка предпросмотра ${targetPath}: ${msg}`,
  },

  fc_get_time: {
    header: `\uD83D\uDD50 **Текущее системное время**`,
    labelDate: 'Дата',
    labelTime: 'Время',
    labelWeekday: 'День недели',
    labelISO: 'ISO',
    labelTimezone: 'Часовой пояс',
  },

  fc_read_multiple_files: {
    notFound: 'Не найдено',
    isDirectory: 'Это каталог',
    moreLines: (count) => `... (ещё ${count} строк)`,
    summary: (success, errors) => `\uD83D\uDCCA **Результат:** прочитано ${success}, ошибок ${errors}`,
  },

  fc_edit_file: {
    invalidStartLine: (line, total) => `\u274C Начальная строка ${line} недопустима. В файле ${total} строк.`,
    invalidEndLine: (line) => `\u274C Конечная строка ${line} недопустима.`,
    contentRequired: (op) => `\u274C Для операции ${op} требуется 'content'.`,
    unknownOperation: (op) => `\u274C Неизвестная операция: ${op}`,
    replacedLines: (start, end, count) => `Строки ${start}-${end} заменены на ${count} строк`,
    insertedLines: (count, after) => `${count} строк вставлено после строки ${after}`,
    deletedLines: (start, end) => `Строки ${start}-${end} удалены`,
    edited: (name) => `\u2705 **${name}** отредактирован`,
    lineChange: (before, after) => `\uD83D\uDCCA ${before} \u2192 ${after} строк`,
    editError: (msg) => `\u274C Ошибка редактирования файла: ${msg}`,
  },

  fc_str_replace: {
    pathIsDirectory: (p) => `\u274C Путь является каталогом: ${p}`,
    notFoundInFile: (name) => `\u274C Строка не найдена в ${name}.`,
    searchedFor: '**Искали:**',
    fileStart: '**Начало файла:**',
    multipleOccurrences: (count) => `\u274C Строка встречается ${count} раз(а) и должна быть уникальной.`,
    mustBeUnique: 'должна быть уникальной',
    tip: `\uD83D\uDCA1 Совет: расширьте строку поиска дополнительным контекстом.`,
    replaced: (name) => `\u2705 **${name}** - строка заменена`,
    sameLineCount: 'то же число строк',
    addedLines: (count) => `+${count} строк`,
    removedLines: (count) => `${count} строк`,
    labelChange: 'Изменение',
    labelFile: 'Файл',
    contextLabel: '**Контекст:**',
    replaceError: (msg) => `\u274C Ошибка замены строки: ${msg}`,
  },

  fc_list_processes: {
    noProcesses: (filter) => `\uD83D\uDD0D Процессы не найдены${filter ? ` для "${filter}"` : ''}.`,
    header: (filter) => `\uD83D\uDCCB **Запущенные процессы**${filter ? ` (Фильтр: ${filter})` : ''}`,
    colName: 'Имя',
    colPid: 'PID',
    colMemory: 'Память',
    listError: (msg) => `\u274C Ошибка вывода процессов: ${msg}`,
  },

  fc_kill_process: {
    pidOrNameRequired: `\u274C Нужно указать 'pid' или 'name'.`,
    killed: (target) => `\u2705 Процесс завершён: ${target}`,
    killError: (msg) => `\u274C Ошибка завершения процесса: ${msg}`,
  },

  fc_start_session: {
    started: (id, command, pid, cwd) => `\uD83D\uDE80 **Сессия запущена**\n\n| | |\n|---|---|\n| ID сессии | \`${id}\` |\n| Команда | ${command} |\n| PID | ${pid} |\n| Каталог | ${cwd} |`,
    useReadAndSend: `Используйте \`fc_read_output\` и \`fc_send_input\` для взаимодействия.`,
    startError: (msg) => `\u274C Ошибка запуска сессии: ${msg}`,
    processExited: (code) => `\n[Процесс завершился с кодом ${code}]`,
    processError: (msg) => `\n[Ошибка: ${msg}]`,
  },

  fc_read_output: {
    notFound: (id) => `\u274C Сессия не найдена: ${id}`,
    useListSessions: `Используйте fc_list_sessions для активных сессий.`,
    statusRunning: '\uD83D\uDFE2 Выполняется',
    statusEnded: '\uD83D\uDD34 Завершена',
    header: (status) => `\uD83D\uDCE4 **Вывод сессии** (${status})`,
    noOutput: '(нет вывода)',
  },

  fc_send_input: {
    notFound: (id) => `\u274C Сессия не найдена: ${id}`,
    sessionEnded: `\u274C Сессия завершена. Запустите новую через fc_start_session.`,
    useStartSession: 'Запустите новую через fc_start_session.',
    sent: (id) => `\uD83D\uDCE5 Ввод отправлен в ${id}:`,
    useReadOutput: `Используйте \`fc_read_output\`, чтобы прочитать ответ.`,
    sendError: (msg) => `\u274C Ошибка отправки ввода: ${msg}`,
  },

  fc_list_sessions: {
    noSessions: `\uD83D\uDCCB Доступных сессий нет.`,
    useStartSession: `Запустите новую через \`fc_start_session\`.`,
    header: (count) => `\uD83D\uDCCB **Активные сессии** (${count})`,
    colStatus: 'Статус',
    colSessionId: 'ID сессии',
    colCommand: 'Команда',
    colPid: 'PID',
    colRuntime: 'Время',
  },

  fc_close_session: {
    notFound: (id) => `\u274C Сессия не найдена: ${id}`,
    closed: (id) => `\u2705 Сессия завершена и удалена: ${id}`,
    closeError: (msg) => `\u274C Ошибка закрытия сессии: ${msg}`,
  },

  fc_fix_json: {
    alreadyValid: (name) => `\u2705 ${name} уже является корректным JSON.`,
    fixBom: 'UTF-8 BOM удалён',
    fixNul: 'NUL-байты удалены',
    fixSingleLineComments: 'Однострочные комментарии удалены',
    fixMultiLineComments: 'Многострочные комментарии удалены',
    fixTrailingCommas: 'Конечные запятые удалены',
    fixSingleQuotes: 'Одинарные кавычки \u2192 двойные кавычки',
    analysisHeader: (name) => `\uD83D\uDD0D **Анализ JSON: ${name}**`,
    foundProblems: '**Найденные проблемы:**',
    noAutoFixable: 'Нет проблем, которые можно исправить автоматически.',
    afterFixValid: `\u2705 После восстановления: корректный JSON`,
    afterFixInvalid: (error) => `\u26A0\uFE0F После восстановления всё ещё некорректно: ${error}`,
    repairedHeader: (name) => `\u2705 **JSON восстановлен: ${name}**`,
    validJson: `\u2705 Корректный JSON`,
    stillInvalid: (error) => `\u26A0\uFE0F Всё ещё некорректно: ${error}`,
    backupCreated: (p) => `\uD83D\uDCCB Резервная копия: ${p}`,
  },

  fc_validate_json: {
    validHeader: (name) => `\u2705 **Корректный JSON: ${name}**`,
    typeArray: (count) => `Массив (${count} элементов)`,
    typeObject: (count) => `Объект (${count} ключей)`,
    propType: 'Тип',
    propSize: 'Размер',
    propBom: 'BOM',
    propBomYes: '\u26A0\uFE0F Да',
    propBomNo: 'Нет',
    propEncoding: 'Кодировка',
    invalidHeader: (name) => `\u274C **Некорректный JSON: ${name}**`,
    errorLabel: '**Ошибка:**',
    errorPosition: (line, col) => `**Позиция ошибки:** строка ${line}, столбец ${col}`,
    useFcFixJson: `\uD83D\uDCA1 Используйте \`fc_fix_json\` для автоматического восстановления.`,
  },

  fc_cleanup_file: {
    noCleanupNeeded: (count) => `\u2705 Очистка не требуется. Проверено файлов: ${count}.`,
    previewHeader: '\uD83D\uDD0D **Предпросмотр**',
    cleanedHeader: '\u2705 **Очищено**',
    cleanedCount: (fixed, total) => `${fixed}/${total} файлов`,
  },

  fc_fix_encoding: {
    noErrors: (name) => `\u2705 Ошибки кодировки в ${name} не найдены.`,
    analysisHeader: (name) => `\uD83D\uDD0D **Анализ кодировки: ${name}**`,
    foundMojibake: '**Найдены шаблоны mojibake:**',
    repairedHeader: (name) => `\u2705 **Кодировка восстановлена: ${name}**`,
    backupCreated: (p) => `\uD83D\uDCCB Резервная копия: ${p}`,
  },

  fc_folder_diff: {
    firstSnapshot: (name) => `\uD83D\uDCF8 **Создан первый снимок: ${name}**`,
    labelFiles: 'Файлы',
    labelSnapshot: 'Снимок',
    nextCallInfo: 'Изменения будут обнаружены при следующем вызове.',
    noChanges: (name, count) => `\u2705 Изменений в ${name} нет. Проверено файлов: ${count}.`,
    diffHeader: (name) => `\uD83D\uDCCA **Разница каталога: ${name}**`,
    catNew: 'Новые файлы',
    catModified: 'Изменённые',
    catDeleted: 'Удалённые',
    catUnchanged: 'Без изменений',
    newFiles: '**Новые файлы:**',
    modifiedFiles: '**Изменённые файлы:**',
    deletedFiles: '**Удалённые файлы:**',
    andMore: (count) => `... и ещё ${count}`,
  },

  fc_batch_rename: {
    noMatchingFiles: (dir) => `\uD83D\uDD0D В ${dir} нет подходящих файлов`,
    noCommonPattern: (count) => `\uD83D\uDD0D Общий шаблон не найден в ${count} файлах.`,
    autoDetectHeader: (count) => `\uD83D\uDD0D **Автоопределение: ${count} файлов**`,
    detectedPatterns: (patterns) => `Обнаруженные шаблоны: ${patterns}`,
    suggestedRename: (prefix) => `**Предложенное переименование (удалить префикс "${prefix}"):**`,
    andMore: (count) => `... и ещё ${count}`,
    useTip: (prefix) => `\uD83D\uDCA1 Для выполнения используйте \`mode="remove_prefix", pattern="${prefix}", dry_run=false\`.`,
    patternRequired: (mode) => `\u274C Для режима "${mode}" требуется 'pattern'.`,
    noFilesMatchPattern: (pattern) => `\uD83D\uDD0D Нет файлов, соответствующих шаблону "${pattern}".`,
    previewHeader: (count) => `\uD83D\uDD0D **Предпросмотр: ${count} переименований**`,
    setDryRunFalse: `\uD83D\uDCA1 Установите \`dry_run=false\` для выполнения.`,
    renamed: (success, total) => `\u2705 **Переименовано файлов: ${success}/${total}**`,
  },

  fc_convert_format: {
    sourceNotFound: (p) => `\u274C Исходный файл не найден: ${p}`,
    csvNeedsRows: `\u274C CSV нужен минимум заголовок и 1 строка данных.`,
    csvNeedsArray: `\u274C Для экспорта CSV нужен JSON-массив объектов.`,
    iniNeedsObject: `\u274C Для экспорта INI нужен JSON-объект.`,
    unsupportedFormat: (format) => `\u274C Неподдерживаемый формат: ${format}`,
    converted: (from, to) => `\u2705 **Преобразовано: ${from} \u2192 ${to}**`,
    labelSource: 'Источник',
    labelTarget: 'Цель',
    labelSize: 'Размер',
  },

  fc_detect_duplicates: {
    noDuplicates: (files, hashed) => `\u2705 Дубликаты не найдены. Проверено файлов: ${files}, хешировано: ${hashed}.`,
    header: `\uD83D\uDD0D **Найдены дубликаты**`,
    labelChecked: 'Проверено файлов',
    labelGroups: 'Группы дубликатов',
    labelDuplicates: 'Всего дубликатов',
    labelWasted: 'Потерянное место',
    groupHeader: (index, size) => `**Группа ${index}** (${size}):`,
    andMoreGroups: (count) => `... и ещё ${count} групп`,
    useSafeDelete: `\uD83D\uDCA1 Используйте \`fc_safe_delete\`, чтобы безопасно удалить дубликаты.`,
  },

  fc_md_to_html: {
    converted: (name) => `\u2705 **Markdown \u2192 HTML: ${name}**`,
    labelSource: 'Источник',
    labelTarget: 'Цель',
    labelSize: 'Размер',
    openInBrowser: `\uD83D\uDCA1 Откройте HTML-файл в браузере и напечатайте как PDF.`,
  },

  fc_md_to_pdf: {
    converted: (name) => `\u2705 **Markdown \u2192 PDF: ${name}**`,
    labelSource: 'Источник',
    labelTarget: 'Цель',
    labelSize: 'Размер',
    noBrowser: 'Браузер (Edge/Chrome) не найден. Вместо этого создан HTML-файл.',
    browserUsed: (name) => `PDF создан с помощью ${name}`,
  },

  fc_ocr: {
    description: 'Извлекает текст из изображений (JPG/PNG/BMP/TIFF) с помощью OCR (Tesseract).',
    notInstalled: '\u274C tesseract.js не установлен. Установите: npm install tesseract.js',
    unsupportedFormat: (ext) => `\u274C Неподдерживаемый формат файла для OCR: ${ext}`,
    pdfNotYetSupported: '\u274C OCR для PDF пока не поддерживается. Сначала преобразуйте страницы PDF в изображения.',
    header: (filename) => `\uD83D\uDD0D **Результат OCR: ${filename}**`,
    labelLanguage: 'Язык',
    labelConfidence: 'Уверенность',
    labelChars: 'Символы',
    labelSaved: 'Сохранено в',
  },

  fc_archive: {
    description: 'Создаёт, извлекает и показывает ZIP-архивы.',
    created: (p) => `\u2705 **ZIP-архив создан:** ${p}`,
    extracted: (archive, target) => `\u2705 **Извлечено:** ${archive} \u2192 ${target}`,
    listHeader: (p) => `\uD83D\uDCC2 **Содержимое архива: ${p}**`,
    labelSize: 'Размер',
    labelFiles: 'Файлы',
  },

  fc_checksum: {
    description: 'Вычисляет контрольные суммы (MD5/SHA1/SHA256/SHA512) для файлов.',
    header: (filename) => `\uD83D\uDD10 **Контрольная сумма: ${filename}**`,
    labelAlgorithm: 'Алгоритм',
    labelHash: 'Хеш',
    match: '\u2705 Контрольные суммы совпадают!',
    mismatch: '\u274C Контрольные суммы НЕ совпадают!',
  },

  fc_set_safe_mode: {
    description: 'Включает/отключает Safe Mode. Когда он активен, все операции удаления (fc_delete_file, fc_delete_directory) перенаправляются в корзину.',
    enabled: '\uD83D\uDEE1\uFE0F **Safe Mode включён.** Все операции удаления теперь используют корзину.',
    disabled: '\u26A0\uFE0F **Safe Mode отключён.** Операции удаления теперь необратимы.',
    redirected: (originalAction) => `\uD83D\uDEE1\uFE0F Safe Mode активен: ${originalAction} перенаправлено в корзину.`,
  },

  fc_check_cloud_lock: {
    description: 'Проверяет, может ли путь быть заблокирован фильтром облачной синхронизации (cldflt.sys). Только Windows.',
    notApplicable: '\u2139\uFE0F Проверка облачной блокировки актуальна только для Windows. На этой системе не применяется.',
    header: (p) => `\u2601\uFE0F **Диагностика облачной блокировки: ${p}**`,
    labelDriver: 'Драйвер cldflt.sys',
    driverActive: '\uD83D\uDFE1 Активен (загружен)',
    driverInactive: '\uD83D\uDFE2 Не загружен',
    labelInSyncFolder: 'В папке синхронизации',
    notInSyncFolder: '\u2014 Нет',
    labelTargetState: 'Состояние цели',
    targetMissing: 'Отсутствует (активная блокировка не обнаружена)',
    targetFile: 'Существующий файл',
    targetDirectory: 'Существующая папка',
    targetReparse: 'Существующая точка повторного анализа / символьная ссылка',
    targetOther: 'Существующий специальный объект файловой системы',
    targetUnavailable: (message) => 'Не проверено: ' + message,
    labelCloudState: 'Гидратация Cloud Files',
    notCheckedCloudState: 'Не проверено: Node не предоставляет переносимый API без повышения прав для атрибутов Cloud Files',
    labelProcessLock: 'Блокировка дескриптора процесса',
    notCheckedProcessLock: 'Не проверено: переносимая проверка дескрипторов без повышения прав недоступна',
    labelConclusion: 'Вывод диагностики',
    staticOnly: 'static_risk_only - активная блокировка переименования не обнаружена',
    labelRisk: 'Риск блокировки',
    riskHigh: '\uD83D\uDD34 Высокий \u2014 операции переименования могут быть заблокированы',
    riskMedium: '\uD83D\uDFE1 Средний \u2014 выполнена часть условий',
    riskLow: '\uD83D\uDFE2 Низкий \u2014 конфликт с облачной синхронизацией не ожидается',
    advice: '\uD83D\uDCA1 fc_move автоматически использует fallback copy+delete, если облачный фильтр блокирует операцию.',
    checkError: (msg) => `\u274C Ошибка проверки облачной блокировки: ${msg}`,
  },

  fc_web_fetch: {
    description: 'Загружает веб-страницу и возвращает содержимое в зависимости от режима: extract (чистый основной текст), raw (тело HTTP, усечённое), links, forms или headers. Сетевой инструмент только для чтения; внутренние/приватные адреса заблокированы по умолчанию (allow_private для обхода).',
  },

  server: {
    started: '\uD83D\uDE80 MCP-сервер FileCommander запущен',
    languageSet: (lang) => `Язык установлен: ${lang}`,
    languageGet: (lang, supported) => `Текущий язык: ${lang} (Поддерживаемые: ${supported.join(', ')})`,
  },
};
