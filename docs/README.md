# BR24 Documentation Package

AI onboarding package for the BR24 **Frontend** workspace (Backend/DB docs included for understanding + handoff only — see `ai-context/ai-development-guidelines.md` §1.1).

**Start here:** [ai-context/README.md](./ai-context/README.md) · Agent entry: [`../AGENTS.md`](../AGENTS.md)  
**Portable onboarding checklist (any project):** [ai-onboarding-checkpoints.md](./ai-onboarding-checkpoints.md)

| Folder | Contents |
|--------|----------|
| `ai-context/` | Architecture, FE/BE/DB docs, API catalog, coding guidelines, maintenance process |
| `ai-work/` | **Continuity** — ACTIVE task, session checkpoint, task history (not architecture SoT) |
| `adr/` | Architecture Decision Records (when a lasting decision needs one) |
| `knowledge-graph/` | **Graphify** — `nodes.json`, `relationships.json`, `business-domain.md`, **3D viewer** `graphify-3d.html` |
| `architecture/` | Mermaid diagrams |
| `scripts/` | `extract-knowledge.mjs` — regenerate KG + API catalog |
| *(root of docs)* | [ai-onboarding-checkpoints.md](./ai-onboarding-checkpoints.md) — universal CP catalog + bootstrap prompt |

**IDE pointers (short; not the full manual):**

- Cursor: `.cursor/rules/br24-ai-onboarding.mdc` (`alwaysApply`) + path rules `fe-api-slices.mdc`, `fe-pages.mdc`, `fe-domain-interfaces.mdc`
- Cursor fn- commands: `.cursor/commands/fn-newpage.md`, `.cursor/commands/fn-review.md` — chat: `fn-newpage {Name}` / `fn-review {Name}` (or `/` menu)
- Claude Code: `CLAUDE.md` (+ `.claude/README.md`)

No application source was modified to produce these docs.
