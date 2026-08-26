import type { Translations } from './types.js';

export const zh: Translations = {
  common: {
    fileNotFound: (p) => `\u274C 未找到文件: ${p}`,
    dirNotFound: (p) => `\u274C 未找到目录: ${p}`,
    pathNotFound: (p) => `\u274C 未找到路径: ${p}`,
    error: (msg) => `\u274C 错误: ${msg}`,
    errorGeneric: (msg) => `\u274C 错误: ${msg}`,
    pathIsDirectory: (p) => `\u274C 路径是目录: ${p}`,
    pathIsNotDirectory: (p) => `\u274C 路径不是目录: ${p}`,
    pathIsDirectoryUseListDir: (p) => `\u274C 路径是目录: ${p}。请使用 fc_list_directory。`,
    pathIsNotDirUseReadFile: (p) => `\u274C 路径不是目录: ${p}。请使用 fc_read_file。`,
    pathIsDirectoryUseDeleteDir: `\u274C 路径是目录。请使用 fc_delete_directory。`,
    sourceNotFound: (p) => `\u274C 未找到源: ${p}`,
    weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  },

  fc_read_file: {
    moreLines: (count) => `\n\n...（还有 ${count} 行）`,
    fileHeader: (name, size) => `\uD83D\uDCC4 **${name}** (${size})`,
    readError: (msg) => `\u274C 读取文件时出错: ${msg}`,
  },

  fc_write_file: {
    actionAppended: '已追加',
    actionWritten: '已写入',
    success: (action, p) => `\u2705 文件${action}: ${p}`,
    sizeLabel: (size) => `\uD83D\uDCCA 大小: ${size}`,
    writeError: (msg) => `\u274C 写入文件时出错: ${msg}`,
  },

  fc_list_directory: {
    dirHeader: (p) => `\uD83D\uDCC2 **${p}**`,
    emptyDir: '（目录为空）',
    listError: (msg) => `\u274C 列出目录时出错: ${msg}`,
  },

  fc_create_directory: {
    alreadyExists: (p) => `\u2139\uFE0F 目录已存在: ${p}`,
    created: (p) => `\u2705 目录已创建: ${p}`,
    createError: (msg) => `\u274C 创建目录时出错: ${msg}`,
  },

  fc_delete_file: {
    deleted: (p) => `\u2705 文件已删除: ${p}`,
    deleteError: (msg) => `\u274C 删除文件时出错: ${msg}`,
  },

  fc_delete_directory: {
    deleted: (p) => `\u2705 目录已删除: ${p}`,
    notEmpty: `\u274C 目录非空。设置 recursive=true 可删除所有内容。`,
    deleteError: (msg) => `\u274C 删除目录时出错: ${msg}`,
  },

  fc_move: {
    moved: (source, dest) => `\u2705 已移动:\n  \uD83D\uDCE4 ${source}\n  \uD83D\uDCE5 ${dest}`,
    movedViaFallback: (source, dest) => `\u2705 已移动（通过复制+删除，已绕过云锁）:\n  \uD83D\uDCE4 ${source}\n  \uD83D\uDCE5 ${dest}`,
    moveError: (msg) => `\u274C 移动时出错: ${msg}`,
  },

  fc_copy: {
    copied: (source, dest) => `\u2705 已复制:\n  \uD83D\uDCE4 ${source}\n  \uD83D\uDCE5 ${dest}`,
    copyError: (msg) => `\u274C 复制时出错: ${msg}`,
  },

  fc_file_info: {
    header: (name) => `\uD83D\uDCCB **信息: ${name}**`,
    typeDirectory: '目录',
    typeFile: '文件',
    typeOther: '其他',
    propType: '类型',
    propSize: '大小',
    propCreated: '创建时间',
    propModified: '修改时间',
    propAccessed: '访问时间',
    propPath: '路径',
  },

  fc_search_files: {
    noResults: (pattern) => `\uD83D\uDD0D 未找到匹配文件: "${pattern}"`,
    resultsHeader: (pattern) => `\uD83D\uDD0D **"${pattern}" 的搜索结果**`,
    inDir: (dir) => `\uD83D\uDCC1 位于: ${dir}`,
    found: (count) => `\uD83D\uDCCA 找到: ${count}`,
    maxReached: '（已达到最大值）',
    searchError: (msg) => `\u274C 搜索错误: ${msg}`,
  },

  fc_search_content: {
    description: '仅在明确提供的文件中搜索文本。默认按字面量搜索，可选正则表达式；输出确定且有界的 JSON，逐文件报告部分错误，跳过二进制文件，支持上下文行并隐藏密钥。不展开通配符，也不递归目录。',
    invalidRegex: '\u274C 正则表达式语法无效。',
    missing: '文件不存在。',
    notFile: '路径不是普通文件。',
    permissionDenied: '权限被拒绝。',
    cloudUnavailable: '云文件不可用或已锁定。',
    encodingError: '文件不是有效的 UTF-8 文本。',
    readError: '无法读取文件。',
    tooLarge: '文件超过 10 MB 搜索限制。',
    binary: '已跳过二进制文件。',
    globalLimitReached: '因达到全局结果上限而跳过。',
  },

  fc_start_search: {
    started: (id, dir, pattern) => `\uD83D\uDD0D **搜索已启动**\n\n| | |\n|---|---|\n| 搜索 ID | \`${id}\` |\n| 目录 | ${dir} |\n| 模式 | ${pattern} |`,
    useGetResults: `使用 \`fc_get_search_results\` 获取结果。`,
    startError: (msg) => `\u274C 启动搜索时出错: ${msg}`,
  },

  fc_get_search_results: {
    notFound: (id) => `\u274C 未找到搜索: ${id}`,
    useListSearches: `使用 fc_list_searches 查看活动搜索。`,
    statusRunning: '\uD83D\uDD04 运行中',
    statusDone: '\u2705 已完成',
    header: (status) => `\uD83D\uDD0D **搜索结果** (${status})`,
    labelPattern: '模式',
    labelDirectory: '目录',
    labelScannedDirs: '已扫描目录',
    labelFound: (count) => `${count} 个文件`,
    labelRuntime: (seconds) => `${seconds}秒`,
    resultsRange: (from, to, total) => `**结果 ${from}-${to} / ${total}:**`,
    moreResults: (id, offset) => `\uD83D\uDCCC 更多结果: \`fc_get_search_results("${id}", offset=${offset})\``,
  },

  fc_stop_search: {
    notFound: (id) => `\u274C 未找到搜索: ${id}`,
    alreadyDone: (count) => `\u2139\uFE0F 搜索已完成。找到 ${count} 个结果。`,
    stopped: (id) => `\u23F9\uFE0F 搜索已停止: ${id}`,
    resultsSoFar: (count) => `\uD83D\uDCCA 到目前为止找到 ${count} 个结果。`,
  },

  fc_list_searches: {
    noSearches: `\uD83D\uDCCB 没有活动搜索。`,
    useStartSearch: `使用 \`fc_start_search\` 启动新的搜索。`,
    header: (count) => `\uD83D\uDCCB **搜索** (${count})`,
    colStatus: '状态',
    colSearchId: '搜索 ID',
    colPattern: '模式',
    colResults: '结果',
    colRuntime: '运行时间',
  },

  fc_clear_search: {
    notFound: (id) => `\u274C 未找到搜索: ${id}`,
    cleared: (count) => `\uD83E\uDDF9 已移除 ${count} 个已完成搜索。`,
    stillRunning: `\u26A0\uFE0F 搜索仍在运行。请先使用 fc_stop_search。`,
    useStopFirst: `请先使用 fc_stop_search。`,
    removed: (id) => `\u2705 搜索已移除: ${id}`,
  },

  fc_safe_delete: {
    typeDirectory: '目录',
    typeFile: '文件',
    movedToTrash: `\uD83D\uDDD1\uFE0F **已移至回收站**`,
    propType: '类型',
    propPath: '路径',
    propOriginal: '原始位置',
    propTrash: '回收站',
    canRestore: `\u2705 可从回收站恢复。`,
    trashError: (msg) => `\u274C 移至回收站时出错: ${msg}`,
  },

  fc_execute_command: {
    commandLabel: (cmd) => `\u26A1 **命令:** \`${cmd}\``,
    outputLabel: '**输出:**',
    stderrLabel: '**错误输出:**',
    noOutput: `\u2705 命令已执行（无输出）`,
    execError: (msg) => `\u274C 命令执行错误:\n${msg}`,
  },

  fc_start_process: {
    started: (program, args) => `\uD83D\uDE80 进程已启动: ${program}${args}`,
    pidLabel: (pid) => `\uD83D\uDCCB PID: ${pid}`,
    startError: (msg) => `\u274C 启动进程时出错: ${msg}`,
  },

  fc_get_time: {
    header: `\uD83D\uDD50 **当前系统时间**`,
    labelDate: '日期',
    labelTime: '时间',
    labelWeekday: '星期',
    labelISO: 'ISO',
    labelTimezone: '时区',
  },

  fc_read_multiple_files: {
    notFound: '未找到',
    isDirectory: '是目录',
    moreLines: (count) => `...（还有 ${count} 行）`,
    summary: (success, errors) => `\uD83D\uDCCA **结果:** 已读取 ${success} 个，错误 ${errors} 个`,
  },

  fc_edit_file: {
    invalidStartLine: (line, total) => `\u274C 起始行 ${line} 无效。文件共有 ${total} 行。`,
    invalidEndLine: (line) => `\u274C 结束行 ${line} 无效。`,
    contentRequired: (op) => `\u274C ${op} 操作需要 'content'。`,
    unknownOperation: (op) => `\u274C 未知操作: ${op}`,
    replacedLines: (start, end, count) => `第 ${start}-${end} 行已替换为 ${count} 行`,
    insertedLines: (count, after) => `${count} 行已插入到第 ${after} 行之后`,
    deletedLines: (start, end) => `第 ${start}-${end} 行已删除`,
    edited: (name) => `\u2705 **${name}** 已编辑`,
    lineChange: (before, after) => `\uD83D\uDCCA ${before} \u2192 ${after} 行`,
    editError: (msg) => `\u274C 编辑文件时出错: ${msg}`,
  },

  fc_str_replace: {
    pathIsDirectory: (p) => `\u274C 路径是目录: ${p}`,
    notFoundInFile: (name) => `\u274C 在 ${name} 中未找到字符串。`,
    searchedFor: '**搜索内容:**',
    fileStart: '**文件开头:**',
    multipleOccurrences: (count) => `\u274C 字符串出现 ${count} 次（必须唯一）。`,
    mustBeUnique: '必须唯一',
    tip: `\uD83D\uDCA1 提示：用更多上下文扩展搜索字符串。`,
    replaced: (name) => `\u2705 **${name}** - 字符串已替换`,
    sameLineCount: '行数不变',
    addedLines: (count) => `+${count} 行`,
    removedLines: (count) => `${count} 行`,
    labelChange: '变更',
    labelFile: '文件',
    contextLabel: '**上下文:**',
    replaceError: (msg) => `\u274C 替换字符串时出错: ${msg}`,
  },

  fc_list_processes: {
    noProcesses: (filter) => `\uD83D\uDD0D 未找到进程${filter ? `（过滤: "${filter}"）` : ''}。`,
    header: (filter) => `\uD83D\uDCCB **运行中的进程**${filter ? `（过滤: ${filter}）` : ''}`,
    colName: '名称',
    colPid: 'PID',
    colMemory: '内存',
    listError: (msg) => `\u274C 列出进程时出错: ${msg}`,
  },

  fc_kill_process: {
    pidOrNameRequired: `\u274C 必须指定 'pid' 或 'name'。`,
    killed: (target) => `\u2705 进程已终止: ${target}`,
    killError: (msg) => `\u274C 终止进程时出错: ${msg}`,
  },

  fc_start_session: {
    started: (id, command, pid, cwd) => `\uD83D\uDE80 **会话已启动**\n\n| | |\n|---|---|\n| 会话 ID | \`${id}\` |\n| 命令 | ${command} |\n| PID | ${pid} |\n| 目录 | ${cwd} |`,
    useReadAndSend: `使用 \`fc_read_output\` 和 \`fc_send_input\` 进行交互。`,
    startError: (msg) => `\u274C 启动会话时出错: ${msg}`,
    processExited: (code) => `\n[进程退出，代码 ${code}]`,
    processError: (msg) => `\n[错误: ${msg}]`,
  },

  fc_read_output: {
    notFound: (id) => `\u274C 未找到会话: ${id}`,
    useListSessions: `使用 fc_list_sessions 查看活动会话。`,
    statusRunning: '\uD83D\uDFE2 运行中',
    statusEnded: '\uD83D\uDD34 已结束',
    header: (status) => `\uD83D\uDCE4 **会话输出** (${status})`,
    noOutput: '（无输出）',
  },

  fc_send_input: {
    notFound: (id) => `\u274C 未找到会话: ${id}`,
    sessionEnded: `\u274C 会话已结束。请用 fc_start_session 启动新会话。`,
    useStartSession: '请用 fc_start_session 启动新会话。',
    sent: (id) => `\uD83D\uDCE5 输入已发送到 ${id}:`,
    useReadOutput: `使用 \`fc_read_output\` 读取响应。`,
    sendError: (msg) => `\u274C 发送输入时出错: ${msg}`,
  },

  fc_list_sessions: {
    noSessions: `\uD83D\uDCCB 没有可用会话。`,
    useStartSession: `使用 \`fc_start_session\` 启动新会话。`,
    header: (count) => `\uD83D\uDCCB **活动会话** (${count})`,
    colStatus: '状态',
    colSessionId: '会话 ID',
    colCommand: '命令',
    colPid: 'PID',
    colRuntime: '运行时间',
  },

  fc_close_session: {
    notFound: (id) => `\u274C 未找到会话: ${id}`,
    closed: (id) => `\u2705 会话已终止并移除: ${id}`,
    closeError: (msg) => `\u274C 关闭会话时出错: ${msg}`,
  },

  fc_fix_json: {
    alreadyValid: (name) => `\u2705 ${name} 已是有效 JSON。`,
    fixBom: '已移除 UTF-8 BOM',
    fixNul: '已移除 NUL 字节',
    fixSingleLineComments: '已移除单行注释',
    fixMultiLineComments: '已移除多行注释',
    fixTrailingCommas: '已移除尾随逗号',
    fixSingleQuotes: '单引号 \u2192 双引号',
    analysisHeader: (name) => `\uD83D\uDD0D **JSON 分析: ${name}**`,
    foundProblems: '**发现的问题:**',
    noAutoFixable: '没有可自动修复的问题。',
    afterFixValid: `\u2705 修复后: 有效 JSON`,
    afterFixInvalid: (error) => `\u26A0\uFE0F 修复后仍无效: ${error}`,
    repairedHeader: (name) => `\u2705 **JSON 已修复: ${name}**`,
    validJson: `\u2705 有效 JSON`,
    stillInvalid: (error) => `\u26A0\uFE0F 仍然无效: ${error}`,
    backupCreated: (p) => `\uD83D\uDCCB 备份: ${p}`,
  },

  fc_validate_json: {
    validHeader: (name) => `\u2705 **有效 JSON: ${name}**`,
    typeArray: (count) => `数组（${count} 个元素）`,
    typeObject: (count) => `对象（${count} 个键）`,
    propType: '类型',
    propSize: '大小',
    propBom: 'BOM',
    propBomYes: '\u26A0\uFE0F 是',
    propBomNo: '否',
    propEncoding: '编码',
    invalidHeader: (name) => `\u274C **无效 JSON: ${name}**`,
    errorLabel: '**错误:**',
    errorPosition: (line, col) => `**错误位置:** 第 ${line} 行，第 ${col} 列`,
    useFcFixJson: `\uD83D\uDCA1 使用 \`fc_fix_json\` 自动修复。`,
  },

  fc_cleanup_file: {
    noCleanupNeeded: (count) => `\u2705 无需清理。已检查 ${count} 个文件。`,
    previewHeader: '\uD83D\uDD0D **预览**',
    cleanedHeader: '\u2705 **已清理**',
    cleanedCount: (fixed, total) => `${fixed}/${total} 个文件`,
  },

  fc_fix_encoding: {
    noErrors: (name) => `\u2705 在 ${name} 中未发现编码错误。`,
    analysisHeader: (name) => `\uD83D\uDD0D **编码分析: ${name}**`,
    foundMojibake: '**发现 mojibake 模式:**',
    repairedHeader: (name) => `\u2705 **编码已修复: ${name}**`,
    backupCreated: (p) => `\uD83D\uDCCB 备份: ${p}`,
  },

  fc_folder_diff: {
    firstSnapshot: (name) => `\uD83D\uDCF8 **已创建第一份快照: ${name}**`,
    labelFiles: '文件',
    labelSnapshot: '快照',
    nextCallInfo: '下次调用时将检测变化。',
    noChanges: (name, count) => `\u2705 ${name} 无变化。已检查 ${count} 个文件。`,
    diffHeader: (name) => `\uD83D\uDCCA **目录差异: ${name}**`,
    catNew: '新文件',
    catModified: '已修改',
    catDeleted: '已删除',
    catUnchanged: '未变化',
    newFiles: '**新文件:**',
    modifiedFiles: '**已修改文件:**',
    deletedFiles: '**已删除文件:**',
    andMore: (count) => `... 以及另外 ${count} 个`,
  },

  fc_batch_rename: {
    noMatchingFiles: (dir) => `\uD83D\uDD0D ${dir} 中没有匹配文件`,
    noCommonPattern: (count) => `\uD83D\uDD0D 在 ${count} 个文件中未检测到共同模式。`,
    autoDetectHeader: (count) => `\uD83D\uDD0D **自动检测: ${count} 个文件**`,
    detectedPatterns: (patterns) => `检测到的模式: ${patterns}`,
    suggestedRename: (prefix) => `**建议重命名（移除前缀 "${prefix}"）:**`,
    andMore: (count) => `... 以及另外 ${count} 个`,
    useTip: (prefix) => `\uD83D\uDCA1 使用 \`mode="remove_prefix", pattern="${prefix}", dry_run=false\` 执行。`,
    patternRequired: (mode) => `\u274C 模式 "${mode}" 需要 'pattern'。`,
    noFilesMatchPattern: (pattern) => `\uD83D\uDD0D 没有文件匹配模式 "${pattern}"。`,
    previewHeader: (count) => `\uD83D\uDD0D **预览: ${count} 次重命名**`,
    setDryRunFalse: `\uD83D\uDCA1 设置 \`dry_run=false\` 执行。`,
    renamed: (success, total) => `\u2705 **已重命名 ${success}/${total} 个文件**`,
  },

  fc_convert_format: {
    sourceNotFound: (p) => `\u274C 未找到源文件: ${p}`,
    csvNeedsRows: `\u274C CSV 至少需要表头和 1 行数据。`,
    csvNeedsArray: `\u274C 导出 CSV 需要对象数组形式的 JSON。`,
    iniNeedsObject: `\u274C 导出 INI 需要 JSON 对象。`,
    unsupportedFormat: (format) => `\u274C 不支持的格式: ${format}`,
    converted: (from, to) => `\u2705 **已转换: ${from} \u2192 ${to}**`,
    labelSource: '源',
    labelTarget: '目标',
    labelSize: '大小',
  },

  fc_detect_duplicates: {
    noDuplicates: (files, hashed) => `\u2705 未找到重复文件。已检查 ${files} 个文件，已哈希 ${hashed} 个。`,
    header: `\uD83D\uDD0D **发现重复文件**`,
    labelChecked: '已检查文件',
    labelGroups: '重复组',
    labelDuplicates: '重复总数',
    labelWasted: '浪费空间',
    groupHeader: (index, size) => `**组 ${index}** (${size}):`,
    andMoreGroups: (count) => `... 以及另外 ${count} 个组`,
    useSafeDelete: `\uD83D\uDCA1 使用 \`fc_safe_delete\` 安全删除重复文件。`,
  },

  fc_md_to_html: {
    converted: (name) => `\u2705 **Markdown \u2192 HTML: ${name}**`,
    labelSource: '源',
    labelTarget: '目标',
    labelSize: '大小',
    openInBrowser: `\uD83D\uDCA1 在浏览器中打开 HTML 文件并打印为 PDF。`,
  },

  fc_md_to_pdf: {
    converted: (name) => `\u2705 **Markdown \u2192 PDF: ${name}**`,
    labelSource: '源',
    labelTarget: '目标',
    labelSize: '大小',
    noBrowser: '未找到浏览器（Edge/Chrome）。已改为创建 HTML 文件。',
    browserUsed: (name) => `PDF 已用 ${name} 创建`,
  },

  fc_ocr: {
    description: '使用 OCR（Tesseract）从图像（JPG/PNG/BMP/TIFF）中提取文本。',
    notInstalled: '\u274C 未安装 tesseract.js。安装命令: npm install tesseract.js',
    unsupportedFormat: (ext) => `\u274C OCR 不支持的文件格式: ${ext}`,
    pdfNotYetSupported: '\u274C 暂不支持 PDF OCR。请先将 PDF 页面转换为图像。',
    header: (filename) => `\uD83D\uDD0D **OCR 结果: ${filename}**`,
    labelLanguage: '语言',
    labelConfidence: '置信度',
    labelChars: '字符数',
    labelSaved: '保存到',
  },

  fc_archive: {
    description: '创建、解压并列出 ZIP 归档。',
    created: (p) => `\u2705 **ZIP 归档已创建:** ${p}`,
    extracted: (archive, target) => `\u2705 **已解压:** ${archive} \u2192 ${target}`,
    listHeader: (p) => `\uD83D\uDCC2 **归档内容: ${p}**`,
    labelSize: '大小',
    labelFiles: '文件',
  },

  fc_checksum: {
    description: '计算文件校验和（MD5/SHA1/SHA256/SHA512）。',
    header: (filename) => `\uD83D\uDD10 **校验和: ${filename}**`,
    labelAlgorithm: '算法',
    labelHash: '哈希',
    match: '\u2705 校验和匹配！',
    mismatch: '\u274C 校验和不匹配！',
  },

  fc_set_safe_mode: {
    description: '启用/禁用安全模式。启用后，所有删除操作（fc_delete_file、fc_delete_directory）都会重定向到回收站。',
    enabled: '\uD83D\uDEE1\uFE0F **安全模式已启用。** 所有删除操作现在都会使用回收站。',
    disabled: '\u26A0\uFE0F **安全模式已禁用。** 删除操作现在会永久删除。',
    redirected: (originalAction) => `\uD83D\uDEE1\uFE0F 安全模式已启用: ${originalAction} 已重定向到回收站。`,
  },

  fc_check_cloud_lock: {
    description: '检查路径是否可能被云同步筛选器（cldflt.sys）阻塞。仅限 Windows。',
    notApplicable: '\u2139\uFE0F 云锁检查仅与 Windows 相关。此系统不适用。',
    header: (p) => `\u2601\uFE0F **云锁诊断: ${p}**`,
    labelDriver: 'cldflt.sys 驱动',
    driverActive: '\uD83D\uDFE1 活动（已加载）',
    driverInactive: '\uD83D\uDFE2 未加载',
    labelInSyncFolder: '位于同步文件夹中',
    notInSyncFolder: '\u2014 否',
    labelRisk: '锁定风险',
    riskHigh: '\uD83D\uDD34 高 \u2014 重命名操作可能被阻塞',
    riskMedium: '\uD83D\uDFE1 中 \u2014 满足部分条件',
    riskLow: '\uD83D\uDFE2 低 \u2014 预计没有云同步冲突',
    advice: '\uD83D\uDCA1 当云筛选器阻塞时，fc_move 会自动使用复制+删除回退。',
    checkError: (msg) => `\u274C 检查云锁时出错: ${msg}`,
  },

  fc_web_fetch: {
    description: '获取网页并根据模式返回内容：extract（干净的正文）、raw（HTTP 正文，已截断）、links、forms 或 headers。只读网络工具；默认阻止内部/私有目标（设置 allow_private 可覆盖）。',
  },

  server: {
    started: '\uD83D\uDE80 FileCommander MCP 服务器已启动',
    languageSet: (lang) => `语言设置为: ${lang}`,
    languageGet: (lang, supported) => `当前语言: ${lang} (支持: ${supported.join(', ')})`,
  },
};
