# pi-session-intent-note

A pi extension that lets you attach a short note to your session, showing the current intent in the footer status bar.

## Why

After many turns, it is easy to forget why you opened pi in this session. This extension adds a persistent note that survives restarts and shows a truncated preview in the footer.

## Install

Add to your pi settings or use the extension path directly:

```bash
# Via settings.json (recommended)
{
  "extensions": [
    "~/git/playground/pi-session-intent-note"
  ]
}

# Or via CLI for quick testing
pi -e ~/git/playground/pi-session-intent-note/index.ts
```

## Usage

- `/intent refactor auth module` — set inline
- `/intent` — open interactive prompt to edit or clear
- `Ctrl+G` — keyboard shortcut to edit the intent

The footer shows a truncated preview (15 chars) like `Intent: refactor auth…`.

## How it works

- State is persisted via `pi.appendEntry("session-intent", { text })` in the session log
- On `session_start`, the extension scans session entries and restores the latest intent
- The truncated text is rendered in the footer via `ctx.ui.setStatus()`
