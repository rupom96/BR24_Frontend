# BR24 — Claude Code pointer

This file is a **short pointer** only. Full AI onboarding lives in `docs/`. Start at [`AGENTS.md`](AGENTS.md).

## Before coding

1. **New session:** [`AGENTS.md`](AGENTS.md) → [`docs/ai-work/ACTIVE.md`](docs/ai-work/ACTIVE.md) + [`SESSION_CHECKPOINT.md`](docs/ai-work/SESSION_CHECKPOINT.md)
2. Read [`docs/ai-context/README.md`](docs/ai-context/README.md)
3. Use Graphify: [`docs/knowledge-graph/`](docs/knowledge-graph/) (`nodes.json`, `relationships.json`, `business-domain.md`)
4. Follow [`docs/ai-context/ai-development-guidelines.md`](docs/ai-context/ai-development-guidelines.md) — **§1.1** + **§13**
5. Area docs as needed: `frontend.md`, `backend.md`, `database.md`, `api-catalog.md`

## Continuity (hard rule)

- Chat is not SoT — use `docs/ai-work/` for active task / checkpoints / history.
- Long context risk → update ACTIVE + SESSION_CHECKPOINT before continuing.
- Do not ask the user to re-explain recoverable prior AI work.

## Frontend-only (hard rule)

- Default: edit **Frontend** only. Backend/DB docs = understanding + handoff.
- Never touch Backend or Database unless the user **explicitly re-validates**.
- FE needs API/DB → **ask first** → agree contract → build FE only → after done, **offer** BE/DB prompts + requirements if user wants them.

## Plan vs direct

- Single file, clear scope → direct execution.
- Multi-file, new feature/page, API/contract, or multiple approaches → plan first.

## Standing rule — inconsistencies

If the same kind of thing exists in more than one way, **do not assume** the standard. List variants with paths, ask which to follow for **new** code, then proceed. Do not mass-refactor legacy files unless asked. Never copy known typos/bugs as conventions.

## Hard rules

- Exact project names only — do not invent modules, tables, endpoints, or SPs
- Mark unknowns instead of guessing
- Do not paste secrets from `appsettings.json`
- After structural changes: update docs + regenerate Graphify via `node docs/scripts/extract-knowledge.mjs` (see `docs/ai-context/knowledge-maintenance.md`)

## Locations

- Frontend (this repo): `react-vite-ts` — **edit here**
- Backend: `E:\WORKING_FOLDER\BR24\Backend\BR24_Backend` (`BR24.sln`) — context / prompts only unless re-validated

3D Graphify viewer: `docs/knowledge-graph/graphify-3d.html` (serve that folder over HTTP).

## Cursor fn- commands

| Trigger | Purpose |
|---------|---------|
| `fn-newpage {FeatureName}` | Scaffold Frontend page + route |
| `fn-review` / `fn-review {FeatureName}` | Frontend review checklist |

Files: `.cursor/commands/fn-newpage.md`, `.cursor/commands/fn-review.md`
