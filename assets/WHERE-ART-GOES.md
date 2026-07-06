# Where real art goes

**Drop finished art HERE, in `assets\`, mirroring the placeholder tree — NOT into `assets\_placeholders\`.**

- ✅ `assets\characters\gary\portrait_neutral.png`
- ❌ `assets\_placeholders\characters\gary\portrait_neutral.png` — this folder is GENERATED and DISPOSABLE. It is gitignored and tools may rewrite it.

The game always tries the real path first and only falls back to `_placeholders\`, so a correctly named file in `assets\` appears immediately — no code changes, no restarts needed in dev.

The complete list of expected filenames and sizes = the tree under `assets\_placeholders\`. Match the relative path and filename exactly.

Specs per asset type: see `docs/gary-gibbons-art-bible.md` (v1.2 addendum covers portrait transparency and scene-composite overlays).
