# TASK-20260928-ai-continuity

## Meta

| Field | Value |
|-------|-------|
| Task ID | TASK-20260928-ai-continuity |
| Title | Persistent AI work-state / long-running continuity |
| Started | 2026-09-28 |
| Completed | 2026-09-28 |
| Status | completed |
| Related commits | _(uncommitted at write time; HEAD was `6b43cd80ead9ced4d5ab968fa50540e5bf973e3f`)_ |
| Related PR | — |

## Objective

Add repository-persistent AI task state and session checkpointing so a new agent can continue work after context loss — without recreating onboarding, Graphify, or architecture docs.

## Requirements / acceptance criteria

- Conversation never treated as SoT; repo holds task state
- `ACTIVE.md`, `SESSION_CHECKPOINT.md`, `history/TASK-*.md`
- Long-conversation, pre-modify, anti-logic-loss, completion, recovery protocols in universal guidelines
- No application/business source changes
- No duplication of existing ai-context / Graphify / architecture systems
- Context-loss simulation recoverable from repo files

## Investigation findings

- No prior `docs/ai-work/`, `AGENTS.md`, or `docs/adr/`
- Graphify already at `docs/knowledge-graph/`
- Business domain at `docs/knowledge-graph/business-domain.md` (no `docs/domain/`)
- Onboarding + guidelines + Cursor/Claude pointers already exist

## Implementation plan

1. Scaffold `docs/ai-work/`
2. Add `AGENTS.md` + ADR folder convention
3. Extend guidelines §13
4. Wire short pointers only
5. Record this task; leave ACTIVE idle

## Important discoveries

- Uncommitted TenderCosting FE files existed outside any work-state tracker (pre-system gap)

## Important decisions

| Decision | Why | Supersedes |
|----------|-----|------------|
| Continuity lives under `docs/ai-work/` only | Avoid duplicating architecture/Graphify | — |
| Map “graphify/domain” recovery paths to existing folders | Spec names ≠ repo folders; do not create parallel trees | — |
| ADRs optional under `docs/adr/` | Lasting decisions; not every task | — |
| Idle ACTIVE after this task | Continuity setup is complete | — |

## Business logic affected / invariants preserved

- No app business logic touched
- Preserved: Frontend-only §1.1, Graphify location, ai-context as architecture SoT

## Files changed

- `docs/ai-work/**` (new)
- `AGENTS.md` (new)
- `docs/adr/README.md` (new)
- `docs/ai-context/ai-development-guidelines.md` (§13)
- `docs/ai-context/README.md`, `docs/ai-context/knowledge-maintenance.md`
- `docs/README.md`
- `.cursor/rules/br24-ai-onboarding.mdc`
- `CLAUDE.md`

## APIs changed

- None

## Database changes

- None

## Tests

- Manual recovery simulation (see below) — pass for continuity docs
- No automated FE/BE tests (out of scope)

## Problems encountered

- Spec mentioned `docs/graphify/` and `docs/domain/` — mapped to existing paths instead of duplicating

## Intentionally NOT changed

- `src/**` application code
- Graphify extractor / nodes regeneration (no structural app change)
- Existing architecture narratives (except pointer/links)

## Final result

Continuity system installed and linked from universal guidelines + `AGENTS.md`. ACTIVE idle.

## Remaining issues

- Human should open a dedicated ACTIVE task before continuing TenderCosting (or other) uncommitted work
- Commit this docs package when ready so checkpoints survive clones

## Notes for next agent

Follow `AGENTS.md` § New session recovery. Do not ask the user what this continuity task did — read this file.

## Context-loss simulation (validation)

Using only repo artifacts (no chat):

| Question | Recoverable answer |
|----------|-------------------|
| Active task? | None — `ACTIVE.md` idle |
| Already implemented? | Continuity files + guidelines §13; see this history |
| Business logic to preserve? | App logic untouched; §1.1 FE-only still applies |
| Files changed? | Listed above |
| Decisions? | This file + checkpoint |
| Tests? | Manual simulation only |
| Incomplete? | Optional: commit docs; track TenderCosting separately |
| Next action? | `ACTIVE.md` / `SESSION_CHECKPOINT.md` → wait for human task or open new ACTIVE |
