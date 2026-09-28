# AI work-state (continuity)

**Purpose:** Persist enough task state that a **new** AI session can continue unfinished work without the previous conversation.

**Not the source of truth for architecture.** That stays in `docs/ai-context/`, `docs/architecture/`, and Graphify (`docs/knowledge-graph/`).  
**Not a substitute for Git.** Commits remain the record of what code actually changed.

Conversation history is temporary. These files are not.

## Files

| Path | Role |
|------|------|
| [ACTIVE.md](./ACTIVE.md) | **Only** the currently active task (or “none”) |
| [SESSION_CHECKPOINT.md](./SESSION_CHECKPOINT.md) | Latest recoverable session snapshot |
| [history/](./history/) | One file per significant task — append-only |
| [history/_TEMPLATE.md](./history/_TEMPLATE.md) | Copy when starting a new task history file |

## When to update

| Event | Update |
|-------|--------|
| Start a significant task | `ACTIVE.md` + new `history/TASK-*.md` + checkpoint |
| Milestone / stage change / before context risk | `ACTIVE.md` + `SESSION_CHECKPOINT.md` |
| Important decision / invariant discovered | `ACTIVE.md` + history file (+ `docs/adr/` if architectural) |
| Task completed | Finalize history → clear/reset `ACTIVE.md` → refresh checkpoint |
| Trivial one-liner (typo, tiny UI) | Usually **skip** — do not spam history |

## What to record

Meaningful events only: decisions, invariants, implementations, API/DB assumptions, bugs, tests, rejections, remaining work.  
**Do not** dump prompts, full transcripts, or duplicate source/Graphify.

## Page vs module

Default: **module-level** context in existing domain docs (`business-domain.md`, `frontend.md`, page `*.md` only when already used for complex pages).  
AI activity → **task history**, not a new log per page click.

## Path map (this repo)

| Spec name | Actual path |
|-----------|-------------|
| Graphify | `docs/knowledge-graph/` |
| Domain / business | `docs/knowledge-graph/business-domain.md` (+ area docs) |
| ADRs | `docs/adr/` (create ADR files when a lasting decision needs one) |
| Agent entry | root `AGENTS.md` |

Full protocols: `docs/ai-context/ai-development-guidelines.md` §13.
