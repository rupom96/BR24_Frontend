# TASK-20260928-ai-onboarding-checkpoints

## Meta

| Field | Value |
|-------|-------|
| Task ID | TASK-20260928-ai-onboarding-checkpoints |
| Title | Portable AI onboarding checkpoints + bootstrap prompt |
| Started | 2026-09-28 |
| Completed | 2026-09-28 |
| Status | completed |
| Related commits | _(may be uncommitted)_ |
| Related PR | — |

## Objective

Document everything implemented for AI onboarding as reusable checkpoints (with why) plus a feedable bootstrap prompt for any project.

## Requirements / acceptance criteria

- Observe BR24 onboarding end-to-end
- Checklist/checkpoints with descriptions of why each should exist
- Must / Adapt / Optional tiers
- Full bootstrap prompt + micro-prompts
- File under `docs/`

## Final result

- Created `docs/ai-onboarding-checkpoints.md`
- Linked from `docs/README.md`
- ACTIVE remains idle

## Intentionally NOT changed

- Application `src/`
- Existing ai-context / Graphify content (only indexed)

## Notes for next agent

Use §5 of that file when bootstrapping another repo. Use §6 micro-prompts for day-to-day continuity.
