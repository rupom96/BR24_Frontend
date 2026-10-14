# AGENTS.md — BR24 Frontend

Tool-independent entry for any AI coding agent.

**Canonical rules:** [`docs/ai-context/ai-development-guidelines.md`](docs/ai-context/ai-development-guidelines.md)  
**Onboarding start:** [`docs/ai-context/README.md`](docs/ai-context/README.md)  
**Work-state (continuity):** [`docs/ai-work/`](docs/ai-work/)  
**Portable onboarding checklist:** [`docs/ai-onboarding-checkpoints.md`](docs/ai-onboarding-checkpoints.md)  
**Graphify:** [`docs/knowledge-graph/`](docs/knowledge-graph/)  
**Architecture diagrams:** [`docs/architecture/`](docs/architecture/)  
**ADRs:** [`docs/adr/`](docs/adr/)

This workspace is **Frontend-first** (guidelines §1.1). Do not edit Backend/Database unless the user explicitly re-validates.

---

## New session recovery (mandatory)

Before coding in a **new** conversation:

1. Read this file (`AGENTS.md`).
2. Check `git status` / relevant `git diff`.
3. Read [`docs/ai-work/ACTIVE.md`](docs/ai-work/ACTIVE.md).
4. Read [`docs/ai-work/SESSION_CHECKPOINT.md`](docs/ai-work/SESSION_CHECKPOINT.md).
5. Read the relevant [`docs/ai-work/history/TASK-*.md`](docs/ai-work/history/) if an active or related task exists.
6. Query Graphify (`docs/knowledge-graph/nodes.json` + `relationships.json`) for the area.
7. Read business/domain context (`docs/knowledge-graph/business-domain.md` + area docs).
8. Read relevant [`docs/adr/`](docs/adr/) entries if any.
9. Inspect actual source code.
10. Verify documented work-state against code + git.
11. Take the **Next Action** from ACTIVE / checkpoint — or ask only what the repo cannot answer.

**Do not** ask the user to re-explain what a previous AI did if it is recoverable from `docs/ai-work/` + git + source.

---

## Long conversation / context risk

If the chat is long, many files changed, or context may compact: update `ACTIVE.md` + `SESSION_CHECKPOINT.md` (+ history) and continue from **repository state**, not chat memory. Details: guidelines §13.

---

## Cursor / Claude pointers

- Cursor alwaysApply: `.cursor/rules/br24-ai-onboarding.mdc`
- Claude: `CLAUDE.md`
