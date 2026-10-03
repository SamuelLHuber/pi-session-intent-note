# Changelog

## 1.0.1 — 2026-10-03

- Restore intent from the active branch instead of all session entries.
- Restore/clear intent on tree navigation so unrelated branch intent cannot remain displayed.
- Use Pi's actual ExtensionContext type and test against Pi 1.0.0.

Verification: `npm run check`, `npm test`; real Pi 1.0 extension-loader smoke check.
