# Deferred Work

## From: spec-engineer-audience-redesign (2026-06-04)

### color-mix() fallbacks
`global.css` uses `color-mix(in srgb, ...)` in many places without a static fallback value. Safari <15.4 and Firefox <113 will silently drop these declarations, causing accent tints to disappear. Add a static fallback color before each `color-mix()` call on the same property.

### Playwright snapshot platform issue
Existing snapshots are named `*-chromium-win32.png`. If CI runs on Linux, all snapshot tests will fail needing a re-baseline on that platform. Regenerate snapshots on the target CI platform (Linux/chromium) once `npx playwright install` is supported (currently blocked: Playwright does not support ubuntu 26.04-x64 in this environment).

### Duplicate @keyframes blink (investigate)
The acceptance auditor reported a possible duplicate `@keyframes blink` definition in `global.css`. Verify and de-duplicate if confirmed.
