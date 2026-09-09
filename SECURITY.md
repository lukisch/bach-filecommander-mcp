# Security Policy / Sicherheitsrichtlinie

[English](#english) | [Deutsch](#deutsch)

---

<a name="english"></a>
## English: Security Policy

### Important Security Notice

**This MCP server runs with the local permissions of the operating system user invoking it.**

By design, `ellmos-filecommander-mcp` provides AI assistants and MCP clients with powerful local filesystem and process management capabilities. Its MCP transport is **Local-First** stdio, emits no telemetry, and runs in unprivileged standard user mode. It is not an absolute zero-egress system: `fc_web_fetch` performs outbound HTTP(S) access when explicitly invoked.

### Tool Risk Classification

| Tool | Risk Level | Description & Mitigation |
|------|------------|--------------------------|
| `fc_execute_command` | **Critical** | Executes shell commands in the user environment. Client approval gates recommended. |
| `fc_start_session` / `fc_send_input` | **Critical** | Starts and controls arbitrary interactive commands. Client approval gates recommended. |
| `fc_start_process` | **High** | Spawns background processes. Monitored via process table. |
| `fc_open_path` | **Medium** | Invokes the OS-associated application for a validated existing local path. The fixed launcher does not interpolate the target into a shell command, but the associated application runs with user permissions. |
| `fc_preview_file` | **Low** | Read-only, metadata-first preview. Content requires explicit `include_content=true`; unsupported files and files above the fixed 1 MiB limit are never read or Base64-encoded inline. |
| `fc_kill_process` | **High** | Terminates processes by PID. Restricted to user-accessible processes. |
| `fc_delete_file` | **High** | Permanent file deletion (bypasses recycle bin unless Safety Mode is active). |
| `fc_delete_directory` | **High** | Recursive directory deletion. |
| `fc_safe_delete` | **Medium** | Safe deletion: routes items to OS Recycle Bin (Windows) or Trash (macOS/Linux). |
| `fc_write_file` / `fc_edit_file` | **Medium** | Atomic/in-place file write and modification within user permissions. |
| `fc_check_cloud_lock` | **Low** | Read-only detection of cloud synchronization locks (OneDrive, Dropbox, iCloud). |
| `fc_search_content` | **Low** | Bounded, read-only search across max 50 explicit files with automatic secret redaction. |
| `fc_checksum` | **Low** | Read-only SHA-256, SHA-512, MD5 hash calculation. |
| `fc_web_fetch` | **Medium** | Explicit outbound access to HTTP(S) targets. Private and loopback targets are blocked unless `allow_private` is explicitly enabled. |

### Core Safety Mechanisms

1. **Safety Mode (`fc_set_safe_mode`)**: When enabled, `fc_delete_file` and `fc_delete_directory` are redirected to `fc_safe_delete` (OS Recycle Bin / Trash). Safe mode does not sandbox `fc_execute_command`, `fc_start_session`, `fc_send_input`, or other process tools.
2. **Cloud-Lock Safe Operations**: Detects and mitigates cloud sync-filter file locking (e.g. OneDrive reparse points) with automatic fallback strategies.
3. **Secret Redaction**: Content search tools (`fc_search_content`) automatically identify and redact common API keys, tokens, and authorization credentials in preview output.
4. **Transport Isolation**: Operates exclusively over standard input/output (`stdio`). Does not bind to network ports or expose HTTP endpoints.
5. **Non-Elevation**: Designed to run as an unprivileged standard user process. Never requires administrative or root privileges.
6. **Explicit outbound access**: The server makes no automatic network requests in MCP operation. `fc_web_fetch` is the explicit egress boundary and performs an outbound request only when called by a client.
7. **Bounded inline preview**: `fc_preview_file` resolves a regular file and reports MIME/size metadata before content. Explicit content requests use standard MCP content blocks and are rejected before reading when the file exceeds 1 MiB or its media type is unsupported.

### Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly:
- **Email**: [security@open-bricks.org](mailto:security@open-bricks.org) (Umbrella Security), [security@ellmos.ai](mailto:security@ellmos.ai), [support@lukasgeiger.com](mailto:support@lukasgeiger.com), or [lukas@open-bricks.org](mailto:lukas@open-bricks.org)
- **GitHub**: [GitHub Security Advisories](https://github.com/ellmos-ai/ellmos-filecommander-mcp/security/advisories)

We commit to a binding initial response SLA within 48 hours and a formal triage assessment within 5 business days.

### Supported Versions

| Version | Supported |
|---------|-----------|
| 1.11.x  | :white_check_mark: Yes |
| < 1.11  | :x: No (Please upgrade) |

---

<a name="deutsch"></a>
## Deutsch: Sicherheitsrichtlinie

### Wichtiger Sicherheitshinweis

**Dieser MCP-Server arbeitet mit den Berechtigungen des lokalen Betriebssystem-Benutzers.**

`ellmos-filecommander-mcp` stellt KI-Assistenten und MCP-Clients erweiterte Dateisystem- und Prozessverwaltungsfunktionen bereit. Sein MCP-Transport arbeitet **Local-First** über stdio, übermittelt keine Telemetrie und läuft im unprivilegierten Standard-Benutzerkontext. Das System ist nicht vollständig egressfrei: `fc_web_fetch` führt nach einem ausdrücklichen Aufruf ausgehende HTTP(S)-Zugriffe aus.

### Risikoklassifizierung der Werkzeuge

| Werkzeug | Risikostufe | Beschreibung & Schutzmaßnahmen |
|----------|-------------|--------------------------------|
| `fc_execute_command` | **Kritisch** | Führt Shell-Befehle aus. Bestätigungsdialoge im MCP-Client empfohlen. |
| `fc_start_session` / `fc_send_input` | **Kritisch** | Startet und steuert beliebige interaktive Befehle. Bestätigungsdialoge im MCP-Client empfohlen. |
| `fc_start_process` | **Hoch** | Startet Hintergrundprozesse mit Benutzerrechten. |
| `fc_open_path` | **Mittel** | Startet für einen geprüften vorhandenen lokalen Pfad die zugeordnete Betriebssystem-Anwendung. Der feste Launcher setzt den Zielpfad nicht in einen Shell-Befehl ein; die zugeordnete Anwendung läuft jedoch mit Benutzerrechten. |
| `fc_preview_file` | **Niedrig** | Nur lesende, metadatenbasierte Vorschau. Inhalt erfordert ausdrücklich `include_content=true`; nicht unterstützte Dateien und Dateien über dem festen 1-MiB-Limit werden nie inline gelesen oder Base64-kodiert. |
| `fc_kill_process` | **Hoch** | Beendet Prozesse anhand der PID. |
| `fc_delete_file` | **Hoch** | Dauerhaftes Löschen von Dateien (umgeht Papierkorb, außer Safety Mode ist aktiv). |
| `fc_delete_directory` | **Hoch** | Rekursives Löschen von Verzeichnissen. |
| `fc_safe_delete` | **Mittel** | Sicheres Löschen: Verschiebt Dateien in den Papierkorb (Windows/macOS/Linux). |
| `fc_write_file` / `fc_edit_file` | **Mittel** | Schreibzugriffe innerhalb der bestehenden Dateisystemberechtigungen. |
| `fc_check_cloud_lock` | **Niedrig** | Lese-Diagnose für Cloud-Synchronisationssperren (OneDrive, Dropbox, iCloud). |
| `fc_search_content` | **Niedrig** | Bounded Read-Only Suche über max. 50 explizite Dateien mit Geheimnis-Redaktionsfilter. |
| `fc_checksum` | **Niedrig** | Lese-Prüfsummenberechnung (SHA-256, SHA-512, MD5). |
| `fc_web_fetch` | **Mittel** | Expliziter ausgehender Zugriff auf HTTP(S)-Ziele. Private Ziele und Loopback-Adressen sind gesperrt, sofern `allow_private` nicht ausdrücklich aktiviert wird. |

### Zentrale Schutzfunktionen

1. **Sicherheitsmodus (`fc_set_safe_mode`)**: Leitet `fc_delete_file` und `fc_delete_directory` bei Aktivierung über den System-Papierkorb (`fc_safe_delete`). Der Sicherheitsmodus beschränkt `fc_execute_command`, `fc_start_session`, `fc_send_input` oder andere Prozesswerkzeuge nicht.
2. **Cloud-Lock-Resilienz**: Erkennt Cloud-Sync-Filter-Sperren (z. B. OneDrive Platzhalter) und greift auf sichere Ersatzroutinen zurück.
3. **Automatische Schwärzung von Geheimnissen**: `fc_search_content` maskiert bekannte API-Schlüssel, Tokens und Zugangsdaten in Suchergebnissen.
4. **Transport-Isolation**: Ausschließliche Kommunikation über Standard-Ein-/Ausgabe (`stdio`). Keine Netzwerk-Ports, keine offenen Sockets.
5. **Keine Rechteerweiterung (Non-Elevation)**: Vollständiger Verzicht auf Administrator-/Root-Berechtigungen.
6. **Expliziter ausgehender Zugriff**: Im MCP-Betrieb erfolgen keine automatischen Netzwerkanfragen. `fc_web_fetch` ist die ausdrückliche Egress-Grenze und sendet nur nach einem Client-Aufruf eine ausgehende Anfrage.
7. **Begrenzte Inline-Vorschau**: `fc_preview_file` löst eine reguläre Datei auf und meldet zuerst MIME-/Größenmetadaten. Ausdrückliche Inhaltsnachforderungen verwenden Standard-MCP-Content-Blocks und werden vor dem Lesen abgewiesen, wenn die Datei größer als 1 MiB oder ihr Medientyp nicht unterstützt ist.

### Schwachstellen melden

Bitte melden Sie gefundene Sicherheitslücken direkt an:
- **E-Mail**: [security@open-bricks.org](mailto:security@open-bricks.org) (Dachorganisation Security), [security@ellmos.ai](mailto:security@ellmos.ai), [support@lukasgeiger.com](mailto:support@lukasgeiger.com) oder [lukas@open-bricks.org](mailto:lukas@open-bricks.org)
- **GitHub**: [GitHub Security Advisories](https://github.com/ellmos-ai/ellmos-filecommander-mcp/security/advisories)

Wir garantieren eine verbindliche Eingangsbestätigung (Initial Response SLA) innerhalb von 48 Stunden sowie eine strukturierte Triage-Rückmeldung innerhalb von 5 Werktagen.

### Unterstützte Versionen

| Version | Unterstützt |
|---------|-------------|
| 1.11.x  | :white_check_mark: Ja |
| < 1.11  | :x: Nein (Bitte aktualisieren) |
