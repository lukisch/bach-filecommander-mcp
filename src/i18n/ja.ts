import type { Translations } from './types.js';

export const ja: Translations = {
  common: {
    fileNotFound: (p) => `\u274C ファイルが見つかりません: ${p}`,
    dirNotFound: (p) => `\u274C ディレクトリが見つかりません: ${p}`,
    pathNotFound: (p) => `\u274C パスが見つかりません: ${p}`,
    error: (msg) => `\u274C エラー: ${msg}`,
    errorGeneric: (msg) => `\u274C エラー: ${msg}`,
    pathIsDirectory: (p) => `\u274C パスはディレクトリです: ${p}`,
    pathIsNotDirectory: (p) => `\u274C パスはディレクトリではありません: ${p}`,
    pathIsDirectoryUseListDir: (p) => `\u274C パスはディレクトリです: ${p}。fc_list_directory を使ってください。`,
    pathIsNotDirUseReadFile: (p) => `\u274C パスはディレクトリではありません: ${p}。fc_read_file を使ってください。`,
    pathIsDirectoryUseDeleteDir: `\u274C パスはディレクトリです。fc_delete_directory を使ってください。`,
    sourceNotFound: (p) => `\u274C ソースが見つかりません: ${p}`,
    weekdays: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  },

  fc_read_file: {
    moreLines: (count) => `\n\n...（残り ${count} 行）`,
    fileHeader: (name, size) => `\uD83D\uDCC4 **${name}** (${size})`,
    readError: (msg) => `\u274C ファイル読み取りエラー: ${msg}`,
  },

  fc_write_file: {
    actionAppended: '追記しました',
    actionWritten: '書き込みました',
    success: (action, p) => `\u2705 ファイルを${action}: ${p}`,
    sizeLabel: (size) => `\uD83D\uDCCA サイズ: ${size}`,
    writeError: (msg) => `\u274C ファイル書き込みエラー: ${msg}`,
  },

  fc_list_directory: {
    dirHeader: (p) => `\uD83D\uDCC2 **${p}**`,
    emptyDir: '（ディレクトリは空です）',
    listError: (msg) => `\u274C ディレクトリ一覧エラー: ${msg}`,
  },

  fc_create_directory: {
    alreadyExists: (p) => `\u2139\uFE0F ディレクトリは既に存在します: ${p}`,
    created: (p) => `\u2705 ディレクトリを作成しました: ${p}`,
    createError: (msg) => `\u274C ディレクトリ作成エラー: ${msg}`,
  },

  fc_delete_file: {
    deleted: (p) => `\u2705 ファイルを削除しました: ${p}`,
    deleteError: (msg) => `\u274C ファイル削除エラー: ${msg}`,
  },

  fc_delete_directory: {
    deleted: (p) => `\u2705 ディレクトリを削除しました: ${p}`,
    notEmpty: `\u274C ディレクトリが空ではありません。すべて削除するには recursive=true を設定してください。`,
    deleteError: (msg) => `\u274C ディレクトリ削除エラー: ${msg}`,
  },

  fc_move: {
    moved: (source, dest) => `\u2705 移動しました:\n  \uD83D\uDCE4 ${source}\n  \uD83D\uDCE5 ${dest}`,
    movedViaFallback: (source, dest) => `\u2705 移動しました（コピー+削除でクラウドロックを回避）:\n  \uD83D\uDCE4 ${source}\n  \uD83D\uDCE5 ${dest}`,
    moveError: (msg) => `\u274C 移動エラー: ${msg}`,
  },

  fc_copy: {
    copied: (source, dest) => `\u2705 コピーしました:\n  \uD83D\uDCE4 ${source}\n  \uD83D\uDCE5 ${dest}`,
    copyError: (msg) => `\u274C コピーエラー: ${msg}`,
  },

  fc_file_info: {
    header: (name) => `\uD83D\uDCCB **情報: ${name}**`,
    typeDirectory: 'ディレクトリ',
    typeFile: 'ファイル',
    typeOther: 'その他',
    propType: '種類',
    propSize: 'サイズ',
    propCreated: '作成日時',
    propModified: '更新日時',
    propAccessed: 'アクセス日時',
    propPath: 'パス',
  },

  fc_search_files: {
    noResults: (pattern) => `\uD83D\uDD0D "${pattern}" に一致するファイルは見つかりません`,
    resultsHeader: (pattern) => `\uD83D\uDD0D **"${pattern}" の検索結果**`,
    inDir: (dir) => `\uD83D\uDCC1 場所: ${dir}`,
    found: (count) => `\uD83D\uDCCA 見つかった数: ${count}`,
    maxReached: '（上限に達しました）',
    searchError: (msg) => `\u274C 検索エラー: ${msg}`,
  },

  fc_search_content: {
    description: '明示的に指定されたファイルだけをテキスト検索します。既定はリテラル検索で、正規表現も選択可能です。決定的で上限付きのJSON出力、ファイル単位の部分エラー、バイナリのスキップ、コンテキスト行、秘密情報の伏せ字に対応します。glob展開やディレクトリ再帰は行いません。',
    invalidRegex: '\u274C 正規表現の構文が無効です。',
    missing: 'ファイルが見つかりません。',
    notFile: 'パスは通常ファイルではありません。',
    permissionDenied: 'アクセスが拒否されました。',
    cloudUnavailable: 'クラウドファイルを利用できないか、ロックされています。',
    encodingError: 'ファイルは有効なUTF-8テキストではありません。',
    readError: 'ファイルを読み取れませんでした。',
    tooLarge: 'ファイルが10 MBの検索上限を超えています。',
    binary: 'バイナリファイルをスキップしました。',
    globalLimitReached: '全体の結果上限に達したためスキップしました。',
  },

  fc_start_search: {
    started: (id, dir, pattern) => `\uD83D\uDD0D **検索を開始しました**\n\n| | |\n|---|---|\n| 検索 ID | \`${id}\` |\n| ディレクトリ | ${dir} |\n| パターン | ${pattern} |`,
    useGetResults: `結果を取得するには \`fc_get_search_results\` を使ってください。`,
    startError: (msg) => `\u274C 検索開始エラー: ${msg}`,
  },

  fc_get_search_results: {
    notFound: (id) => `\u274C 検索が見つかりません: ${id}`,
    useListSearches: `アクティブな検索は fc_list_searches で確認してください。`,
    statusRunning: '\uD83D\uDD04 実行中',
    statusDone: '\u2705 完了',
    header: (status) => `\uD83D\uDD0D **検索結果** (${status})`,
    labelPattern: 'パターン',
    labelDirectory: 'ディレクトリ',
    labelScannedDirs: 'スキャン済みディレクトリ',
    labelFound: (count) => `${count} ファイル`,
    labelRuntime: (seconds) => `${seconds}秒`,
    resultsRange: (from, to, total) => `**結果 ${from}-${to} / ${total}:**`,
    moreResults: (id, offset) => `\uD83D\uDCCC さらに結果を見る: \`fc_get_search_results("${id}", offset=${offset})\``,
  },

  fc_stop_search: {
    notFound: (id) => `\u274C 検索が見つかりません: ${id}`,
    alreadyDone: (count) => `\u2139\uFE0F 検索は既に完了しています。${count} 件の結果が見つかりました。`,
    stopped: (id) => `\u23F9\uFE0F 検索を停止しました: ${id}`,
    resultsSoFar: (count) => `\uD83D\uDCCA 現在までに ${count} 件の結果があります。`,
  },

  fc_list_searches: {
    noSearches: `\uD83D\uDCCB アクティブな検索はありません。`,
    useStartSearch: `\`fc_start_search\` で新しい検索を開始してください。`,
    header: (count) => `\uD83D\uDCCB **検索** (${count})`,
    colStatus: '状態',
    colSearchId: '検索 ID',
    colPattern: 'パターン',
    colResults: '結果',
    colRuntime: '実行時間',
  },

  fc_clear_search: {
    notFound: (id) => `\u274C 検索が見つかりません: ${id}`,
    cleared: (count) => `\uD83E\uDDF9 完了した検索を ${count} 件削除しました。`,
    stillRunning: `\u26A0\uFE0F 検索はまだ実行中です。先に fc_stop_search を使ってください。`,
    useStopFirst: `先に fc_stop_search を使ってください。`,
    removed: (id) => `\u2705 検索を削除しました: ${id}`,
  },

  fc_safe_delete: {
    typeDirectory: 'ディレクトリ',
    typeFile: 'ファイル',
    movedToTrash: `\uD83D\uDDD1\uFE0F **ごみ箱へ移動しました**`,
    propType: '種類',
    propPath: 'パス',
    propOriginal: '元の場所',
    propTrash: 'ごみ箱',
    canRestore: `\u2705 ごみ箱から復元できます。`,
    trashError: (msg) => `\u274C ごみ箱への移動エラー: ${msg}`,
  },

  fc_execute_command: {
    commandLabel: (cmd) => `\u26A1 **コマンド:** \`${cmd}\``,
    outputLabel: '**出力:**',
    stderrLabel: '**エラー出力:**',
    noOutput: `\u2705 コマンドを実行しました（出力なし）`,
    execError: (msg) => `\u274C コマンド実行エラー:\n${msg}`,
  },

  fc_start_process: {
    started: (program, args) => `\uD83D\uDE80 プロセスを開始しました: ${program}${args}`,
    pidLabel: (pid) => `\uD83D\uDCCB PID: ${pid}`,
    startError: (msg) => `\u274C プロセス開始エラー: ${msg}`,
  },

  fc_open_path: {
    description: '既存のローカルファイルまたはディレクトリに対してOSの既定アプリケーションを起動します。構造化出力は launcher_accepted と user_visible=unknown を区別し、リモート用フォールバックを示します。',
    launchRequested: (targetPath, platform) => `\uD83D\uDE80 開く要求を開始しました: ${targetPath}（プラットフォーム: ${platform}）`,
    noVisibleConfirmation: 'ネイティブランチャーが要求を受け付けました。対象アプリケーションが画面に表示されたことは自動的には確認されません。',
    fallbackRecommended: (fallback) => `リモート/ヘッドレス用フォールバック: ${fallback}`,
    notFound: (targetPath) => `\u274C パスが見つかりません: ${targetPath}`,
    unsupportedTarget: (targetPath) => `\u274C パスは通常ファイルでもディレクトリでもありません: ${targetPath}`,
    unsupportedPlatform: (platform) => `\u274C サポートされていないプラットフォーム: ${platform}`,
    launchError: (msg) => `\u274C 開く要求の開始エラー: ${msg}`,
  },

  fc_preview_file: {
    description: '最初にMIMEタイプ、サイズ、プレビュー可否を返します。include_content=true が指定され、固定インライン上限以内の場合だけ、標準MCPのテキスト、画像、またはリソースとして内容を返します。',
    metadataOnly: (targetPath, mimeType, sizeBytes, reason) => `ファイルメタデータ: ${targetPath} (${mimeType}, ${sizeBytes} バイト; ${reason})。`,
    contentIncluded: (targetPath, mimeType, sizeBytes) => `インライン内容: ${targetPath} (${mimeType}, ${sizeBytes} バイト)。`,
    previewError: (targetPath, msg) => `\u274C ${targetPath} のプレビューエラー: ${msg}`,
  },

  fc_get_time: {
    header: `\uD83D\uDD50 **現在のシステム時刻**`,
    labelDate: '日付',
    labelTime: '時刻',
    labelWeekday: '曜日',
    labelISO: 'ISO',
    labelTimezone: 'タイムゾーン',
  },

  fc_read_multiple_files: {
    notFound: '見つかりません',
    isDirectory: 'ディレクトリです',
    moreLines: (count) => `...（残り ${count} 行）`,
    summary: (success, errors) => `\uD83D\uDCCA **結果:** ${success} 件読み取り、${errors} 件エラー`,
  },

  fc_edit_file: {
    invalidStartLine: (line, total) => `\u274C 開始行 ${line} は無効です。ファイルは ${total} 行です。`,
    invalidEndLine: (line) => `\u274C 終了行 ${line} は無効です。`,
    contentRequired: (op) => `\u274C ${op} 操作には 'content' が必要です。`,
    unknownOperation: (op) => `\u274C 不明な操作: ${op}`,
    replacedLines: (start, end, count) => `${start}-${end} 行を ${count} 行で置換しました`,
    insertedLines: (count, after) => `${count} 行を ${after} 行目の後に挿入しました`,
    deletedLines: (start, end) => `${start}-${end} 行を削除しました`,
    edited: (name) => `\u2705 **${name}** を編集しました`,
    lineChange: (before, after) => `\uD83D\uDCCA ${before} \u2192 ${after} 行`,
    editError: (msg) => `\u274C ファイル編集エラー: ${msg}`,
  },

  fc_str_replace: {
    pathIsDirectory: (p) => `\u274C パスはディレクトリです: ${p}`,
    notFoundInFile: (name) => `\u274C ${name} に文字列が見つかりません。`,
    searchedFor: '**検索文字列:**',
    fileStart: '**ファイル先頭:**',
    multipleOccurrences: (count) => `\u274C 文字列が ${count} 回出現します（一意である必要があります）。`,
    mustBeUnique: '一意である必要があります',
    tip: `\uD83D\uDCA1 ヒント: 検索文字列にさらに文脈を追加してください。`,
    replaced: (name) => `\u2705 **${name}** - 文字列を置換しました`,
    sameLineCount: '行数は同じ',
    addedLines: (count) => `+${count} 行`,
    removedLines: (count) => `${count} 行`,
    labelChange: '変更',
    labelFile: 'ファイル',
    contextLabel: '**文脈:**',
    replaceError: (msg) => `\u274C 文字列置換エラー: ${msg}`,
  },

  fc_list_processes: {
    noProcesses: (filter) => `\uD83D\uDD0D プロセスは見つかりません${filter ? `（フィルター: "${filter}"）` : ''}。`,
    header: (filter) => `\uD83D\uDCCB **実行中のプロセス**${filter ? `（フィルター: ${filter}）` : ''}`,
    colName: '名前',
    colPid: 'PID',
    colMemory: 'メモリ',
    listError: (msg) => `\u274C プロセス一覧エラー: ${msg}`,
  },

  fc_kill_process: {
    pidOrNameRequired: `\u274C 'pid' または 'name' のどちらかを指定してください。`,
    killed: (target) => `\u2705 プロセスを終了しました: ${target}`,
    killError: (msg) => `\u274C プロセス終了エラー: ${msg}`,
  },

  fc_start_session: {
    started: (id, command, pid, cwd) => `\uD83D\uDE80 **セッションを開始しました**\n\n| | |\n|---|---|\n| セッション ID | \`${id}\` |\n| コマンド | ${command} |\n| PID | ${pid} |\n| ディレクトリ | ${cwd} |`,
    useReadAndSend: `対話には \`fc_read_output\` と \`fc_send_input\` を使ってください。`,
    startError: (msg) => `\u274C セッション開始エラー: ${msg}`,
    processExited: (code) => `\n[プロセスはコード ${code} で終了しました]`,
    processError: (msg) => `\n[エラー: ${msg}]`,
  },

  fc_read_output: {
    notFound: (id) => `\u274C セッションが見つかりません: ${id}`,
    useListSessions: `アクティブなセッションは fc_list_sessions で確認してください。`,
    statusRunning: '\uD83D\uDFE2 実行中',
    statusEnded: '\uD83D\uDD34 終了',
    header: (status) => `\uD83D\uDCE4 **セッション出力** (${status})`,
    noOutput: '（出力なし）',
  },

  fc_send_input: {
    notFound: (id) => `\u274C セッションが見つかりません: ${id}`,
    sessionEnded: `\u274C セッションは終了しています。fc_start_session で新しいセッションを開始してください。`,
    useStartSession: 'fc_start_session で新しいセッションを開始してください。',
    sent: (id) => `\uD83D\uDCE5 ${id} に入力を送信しました:`,
    useReadOutput: `応答を読むには \`fc_read_output\` を使ってください。`,
    sendError: (msg) => `\u274C 入力送信エラー: ${msg}`,
  },

  fc_list_sessions: {
    noSessions: `\uD83D\uDCCB 利用可能なセッションはありません。`,
    useStartSession: `\`fc_start_session\` で新しいセッションを開始してください。`,
    header: (count) => `\uD83D\uDCCB **アクティブなセッション** (${count})`,
    colStatus: '状態',
    colSessionId: 'セッション ID',
    colCommand: 'コマンド',
    colPid: 'PID',
    colRuntime: '実行時間',
  },

  fc_close_session: {
    notFound: (id) => `\u274C セッションが見つかりません: ${id}`,
    closed: (id) => `\u2705 セッションを終了し、削除しました: ${id}`,
    closeError: (msg) => `\u274C セッション終了エラー: ${msg}`,
  },

  fc_fix_json: {
    alreadyValid: (name) => `\u2705 ${name} は既に有効な JSON です。`,
    fixBom: 'UTF-8 BOM を削除しました',
    fixNul: 'NUL バイトを削除しました',
    fixSingleLineComments: '単一行コメントを削除しました',
    fixMultiLineComments: '複数行コメントを削除しました',
    fixTrailingCommas: '末尾のカンマを削除しました',
    fixSingleQuotes: '単一引用符 \u2192 二重引用符',
    analysisHeader: (name) => `\uD83D\uDD0D **JSON 分析: ${name}**`,
    foundProblems: '**見つかった問題:**',
    noAutoFixable: '自動修復できる問題はありません。',
    afterFixValid: `\u2705 修復後: 有効な JSON`,
    afterFixInvalid: (error) => `\u26A0\uFE0F 修復後も無効です: ${error}`,
    repairedHeader: (name) => `\u2705 **JSONを修復しました: ${name}**`,
    validJson: `\u2705 有効な JSON`,
    stillInvalid: (error) => `\u26A0\uFE0F まだ無効です: ${error}`,
    backupCreated: (p) => `\uD83D\uDCCB バックアップ: ${p}`,
  },

  fc_validate_json: {
    validHeader: (name) => `\u2705 **有効な JSON: ${name}**`,
    typeArray: (count) => `配列（${count} 要素）`,
    typeObject: (count) => `オブジェクト（${count} キー）`,
    propType: '種類',
    propSize: 'サイズ',
    propBom: 'BOM',
    propBomYes: '\u26A0\uFE0F はい',
    propBomNo: 'いいえ',
    propEncoding: 'エンコーディング',
    invalidHeader: (name) => `\u274C **無効な JSON: ${name}**`,
    errorLabel: '**エラー:**',
    errorPosition: (line, col) => `**エラー位置:** ${line} 行 ${col} 列`,
    useFcFixJson: `\uD83D\uDCA1 自動修復には \`fc_fix_json\` を使ってください。`,
  },

  fc_cleanup_file: {
    noCleanupNeeded: (count) => `\u2705 クリーンアップは不要です。${count} ファイルを確認しました。`,
    previewHeader: '\uD83D\uDD0D **プレビュー**',
    cleanedHeader: '\u2705 **クリーンアップ済み**',
    cleanedCount: (fixed, total) => `${fixed}/${total} ファイル`,
  },

  fc_fix_encoding: {
    noErrors: (name) => `\u2705 ${name} にエンコーディングエラーは見つかりませんでした。`,
    analysisHeader: (name) => `\uD83D\uDD0D **エンコーディング分析: ${name}**`,
    foundMojibake: '**見つかった文字化けパターン:**',
    repairedHeader: (name) => `\u2705 **エンコーディングを修復しました: ${name}**`,
    backupCreated: (p) => `\uD83D\uDCCB バックアップ: ${p}`,
  },

  fc_folder_diff: {
    firstSnapshot: (name) => `\uD83D\uDCF8 **最初のスナップショットを作成しました: ${name}**`,
    labelFiles: 'ファイル',
    labelSnapshot: 'スナップショット',
    nextCallInfo: '変更は次回の呼び出しで検出されます。',
    noChanges: (name, count) => `\u2705 ${name} に変更はありません。${count} ファイルを確認しました。`,
    diffHeader: (name) => `\uD83D\uDCCA **ディレクトリ差分: ${name}**`,
    catNew: '新規ファイル',
    catModified: '変更',
    catDeleted: '削除',
    catUnchanged: '未変更',
    newFiles: '**新規ファイル:**',
    modifiedFiles: '**変更されたファイル:**',
    deletedFiles: '**削除されたファイル:**',
    andMore: (count) => `... ほか ${count} 件`,
  },

  fc_batch_rename: {
    noMatchingFiles: (dir) => `\uD83D\uDD0D ${dir} に一致するファイルはありません`,
    noCommonPattern: (count) => `\uD83D\uDD0D ${count} ファイルに共通パターンは検出されませんでした。`,
    autoDetectHeader: (count) => `\uD83D\uDD0D **自動検出: ${count} ファイル**`,
    detectedPatterns: (patterns) => `検出されたパターン: ${patterns}`,
    suggestedRename: (prefix) => `**推奨リネーム（接頭辞 "${prefix}" を削除）:**`,
    andMore: (count) => `... ほか ${count} 件`,
    useTip: (prefix) => `\uD83D\uDCA1 実行するには \`mode="remove_prefix", pattern="${prefix}", dry_run=false\` を使ってください。`,
    patternRequired: (mode) => `\u274C モード "${mode}" には 'pattern' が必要です。`,
    noFilesMatchPattern: (pattern) => `\uD83D\uDD0D パターン "${pattern}" に一致するファイルはありません。`,
    previewHeader: (count) => `\uD83D\uDD0D **プレビュー: ${count} 件のリネーム**`,
    setDryRunFalse: `\uD83D\uDCA1 実行するには \`dry_run=false\` を設定してください。`,
    renamed: (success, total) => `\u2705 **${success}/${total} ファイルをリネームしました**`,
  },

  fc_convert_format: {
    sourceNotFound: (p) => `\u274C ソースファイルが見つかりません: ${p}`,
    csvNeedsRows: `\u274C CSV には少なくともヘッダーと 1 行のデータが必要です。`,
    csvNeedsArray: `\u274C CSV エクスポートにはオブジェクトの JSON 配列が必要です。`,
    iniNeedsObject: `\u274C INI エクスポートには JSON オブジェクトが必要です。`,
    unsupportedFormat: (format) => `\u274C サポートされていない形式: ${format}`,
    converted: (from, to) => `\u2705 **変換しました: ${from} \u2192 ${to}**`,
    labelSource: 'ソース',
    labelTarget: 'ターゲット',
    labelSize: 'サイズ',
  },

  fc_detect_duplicates: {
    noDuplicates: (files, hashed) => `\u2705 重複は見つかりませんでした。${files} ファイルを確認し、${hashed} 件をハッシュ化しました。`,
    header: `\uD83D\uDD0D **重複が見つかりました**`,
    labelChecked: '確認したファイル',
    labelGroups: '重複グループ',
    labelDuplicates: '重複合計',
    labelWasted: '無駄な容量',
    groupHeader: (index, size) => `**グループ ${index}** (${size}):`,
    andMoreGroups: (count) => `... ほか ${count} グループ`,
    useSafeDelete: `\uD83D\uDCA1 重複を安全に削除するには \`fc_safe_delete\` を使ってください。`,
  },

  fc_md_to_html: {
    converted: (name) => `\u2705 **Markdown \u2192 HTML: ${name}**`,
    labelSource: 'ソース',
    labelTarget: 'ターゲット',
    labelSize: 'サイズ',
    openInBrowser: `\uD83D\uDCA1 HTML ファイルをブラウザで開き、PDF として印刷してください。`,
  },

  fc_md_to_pdf: {
    converted: (name) => `\u2705 **Markdown \u2192 PDF: ${name}**`,
    labelSource: 'ソース',
    labelTarget: 'ターゲット',
    labelSize: 'サイズ',
    noBrowser: 'ブラウザ（Edge/Chrome）が見つかりません。代わりに HTML ファイルを作成しました。',
    browserUsed: (name) => `${name} で PDF を作成しました`,
  },

  fc_ocr: {
    description: 'OCR（Tesseract）を使用して画像（JPG/PNG/BMP/TIFF）からテキストを抽出します。',
    notInstalled: '\u274C tesseract.js がインストールされていません。インストール: npm install tesseract.js',
    unsupportedFormat: (ext) => `\u274C OCR でサポートされていないファイル形式: ${ext}`,
    pdfNotYetSupported: '\u274C PDF OCR はまだサポートされていません。先に PDF ページを画像に変換してください。',
    header: (filename) => `\uD83D\uDD0D **OCR 結果: ${filename}**`,
    labelLanguage: '言語',
    labelConfidence: '信頼度',
    labelChars: '文字数',
    labelSaved: '保存先',
  },

  fc_archive: {
    description: 'ZIP アーカイブを作成、展開、一覧表示します。',
    created: (p) => `\u2705 **ZIP アーカイブを作成しました:** ${p}`,
    extracted: (archive, target) => `\u2705 **展開しました:** ${archive} \u2192 ${target}`,
    listHeader: (p) => `\uD83D\uDCC2 **アーカイブ内容: ${p}**`,
    labelSize: 'サイズ',
    labelFiles: 'ファイル',
  },

  fc_checksum: {
    description: 'ファイルのチェックサム（MD5/SHA1/SHA256/SHA512）を計算します。',
    header: (filename) => `\uD83D\uDD10 **チェックサム: ${filename}**`,
    labelAlgorithm: 'アルゴリズム',
    labelHash: 'ハッシュ',
    match: '\u2705 チェックサムが一致しました！',
    mismatch: '\u274C チェックサムが一致しません！',
  },

  fc_set_safe_mode: {
    description: 'Safe Mode を有効/無効にします。有効な場合、すべての削除操作（fc_delete_file、fc_delete_directory）はごみ箱へリダイレクトされます。',
    enabled: '\uD83D\uDEE1\uFE0F **Safe Mode を有効にしました。** すべての削除操作はごみ箱を使用します。',
    disabled: '\u26A0\uFE0F **Safe Mode を無効にしました。** 削除操作は永久削除になります。',
    redirected: (originalAction) => `\uD83D\uDEE1\uFE0F Safe Mode が有効です: ${originalAction} はごみ箱へリダイレクトされました。`,
  },

  fc_check_cloud_lock: {
    description: 'パスがクラウド同期フィルター（cldflt.sys）でブロックされる可能性を確認します。Windows のみ。',
    notApplicable: '\u2139\uFE0F クラウドロック確認は Windows でのみ関連します。このシステムには適用されません。',
    header: (p) => `\u2601\uFE0F **クラウドロック診断: ${p}**`,
    labelDriver: 'cldflt.sys ドライバー',
    driverActive: '\uD83D\uDFE1 有効（読み込み済み）',
    driverInactive: '\uD83D\uDFE2 未読み込み',
    labelInSyncFolder: '同期フォルダー内',
    notInSyncFolder: '\u2014 いいえ',
    labelTargetState: '対象の状態',
    targetMissing: '存在しません（アクティブなロックは検出されませんでした）',
    targetFile: '既存のファイル',
    targetDirectory: '既存のディレクトリ',
    targetReparse: '既存の再解析ポイント / シンボリックリンク',
    targetOther: '既存の特殊ファイルシステムオブジェクト',
    targetUnavailable: (message) => '未確認：' + message,
    labelCloudState: 'Cloud Files のハイドレーション',
    notCheckedCloudState: '未確認：Node には Cloud Files 属性用のポータブルな非昇格 API がありません',
    labelProcessLock: 'プロセスハンドルロック',
    notCheckedProcessLock: '未確認：ポータブルな非昇格ハンドル検査は利用できません',
    labelConclusion: '診断結論',
    staticOnly: 'static_risk_only - アクティブなリネームロックは検出されませんでした',
    labelRisk: 'ロックリスク',
    riskHigh: '\uD83D\uDD34 高 \u2014 リネーム操作がブロックされる可能性があります',
    riskMedium: '\uD83D\uDFE1 中 \u2014 条件の一部に該当',
    riskLow: '\uD83D\uDFE2 低 \u2014 クラウド同期の競合は想定されません',
    advice: '\uD83D\uDCA1 クラウドフィルターがブロックした場合、fc_move は自動的にコピー+削除のフォールバックを使います。',
    checkError: (msg) => `\u274C クラウドロック確認エラー: ${msg}`,
  },

  fc_web_fetch: {
    description: 'ウェブページを取得し、モードに応じて内容を返します：extract（クリーンな本文）、raw（HTTP ボディ、切り詰め）、links、forms、headers。読み取り専用のネットワークツールです。内部／プライベートの宛先はデフォルトでブロックされます（allow_private で上書き）。',
  },

  server: {
    started: '\uD83D\uDE80 FileCommander MCPサーバーを起動しました',
    languageSet: (lang) => `言語を設定しました: ${lang}`,
    languageGet: (lang, supported) => `現在の言語: ${lang} (対応言語: ${supported.join(', ')})`,
  },
};
