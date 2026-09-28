# Universal AI Onboarding — Checkpoints, Rationale & Bootstrap Prompt

**Audience:** Humans and AI agents setting up AI onboarding on **any** software project.  
**Origin:** Distilled from the BR24 Frontend implementation (`docs/ai-context/`, Graphify, `docs/ai-work/`, `AGENTS.md`, IDE pointers).  
**Rule:** Projects differ in stack and folder names. These **checkpoints** should still exist in every project — adapt paths and depth, do not skip the *purpose*.

---

## 1. What BR24 implemented (end-to-end map)

Read this as a **reference inventory**, not a mandate to copy BR24 names blindly.

| # | Layer | What exists in BR24 | Core job |
|---|--------|---------------------|----------|
| 1 | Agent entry | Root `AGENTS.md` | First file a new AI reads; recovery checklist |
| 2 | Onboarding package | `docs/ai-context/` | How the system works before coding |
| 3 | Reading order | `docs/ai-context/README.md` | Mandatory sequence so agents don’t skip context |
| 4 | System architecture | `system-architecture.md` (+ `docs/architecture/` Mermaid) | End-to-end picture |
| 5 | Area docs | `frontend.md`, `backend.md`, `database.md` | Layer-specific truth |
| 6 | API surface | `api-catalog.md` | HTTP contracts index |
| 7 | Universal rules | `ai-development-guidelines.md` | Tool-independent operating contract |
| 8 | Doc hygiene | `knowledge-maintenance.md` | When/how to update docs + graph after changes |
| 9 | Knowledge graph | `docs/knowledge-graph/` (nodes, relationships, business-domain, viewer, extract script) | Structural impact analysis (“Graphify”) |
| 10 | Continuity | `docs/ai-work/` (ACTIVE, SESSION_CHECKPOINT, history) | Survive long chats / context loss |
| 11 | ADRs | `docs/adr/` | Lasting decisions beyond one task |
| 12 | Ownership rule | Guidelines §1.1 Frontend-only | Who may edit what; ask → FE → offer BE/DB prompts |
| 13 | Continuity protocols | Guidelines §13 | Recover, checkpoint, preserve logic, complete tasks |
| 14 | IDE pointers | `.cursor/rules/*`, `CLAUDE.md`, optional fn- commands | Short reminders — **not** the SoT |
| 15 | Optional scaffolds | `fn-newpage` / `fn-review` prompt copies | Repeatable FE workflows |

**Hard principle carried forward:** Conversation history is temporary. The **repository** must hold enough state for a new agent to continue safely.

---

## 2. Checkpoint catalog (keep these on every project)

Use this as the **acceptance checklist**.  
**Must** = every serious AI-assisted repo. **Adapt** = same purpose, different shape. **Optional** = nice-to-have once Must/Adapt are solid.

### CP-01 — Root agent entry (`AGENTS.md` or equivalent)

| | |
|--|--|
| **Why keep** | New sessions need one obvious door. Without it, agents invent their own starting point or ask the human to re-narrate. |
| **Must contain** | Links to guidelines, knowledge docs, work-state, graph, ADRs; **new-session recovery** steps; ownership one-liner. |
| **BR24** | `AGENTS.md` |
| **Tier** | **Must** |

### CP-02 — Onboarding README + reading order

| | |
|--|--|
| **Why keep** | Prevents “jump straight into code.” Forces architecture → area → graph → rules. |
| **Must contain** | Numbered reading order; stack snapshot; hard rules; pointers to IDE files (short). |
| **BR24** | `docs/ai-context/README.md` |
| **Tier** | **Must** |

### CP-03 — System / architecture narrative

| | |
|--|--|
| **Why keep** | Agents need the whole-system mental model (auth, layers, deploy boundaries) before local edits. |
| **Adapt** | One app vs monorepo; depth matches complexity. Diagrams optional but high value. |
| **BR24** | `docs/ai-context/system-architecture.md`, `docs/architecture/*.md` |
| **Tier** | **Must** (narrative) · **Adapt** (diagram set) |

### CP-04 — Area docs (per real layer)

| | |
|--|--|
| **Why keep** | “Frontend.md” vs “backend.md” stops cross-layer guessing. Only document layers that exist. |
| **Adapt** | Mobile, data pipelines, infra — name by *your* layers. Skip empty fake layers. |
| **BR24** | `frontend.md`, `backend.md`, `database.md` |
| **Tier** | **Must** for each owned/edited layer · **Adapt** for context-only layers |

### CP-05 — API / contract catalog (if the project has APIs)

| | |
|--|--|
| **Why keep** | FE/BE/agents share one index of routes/contracts; reduces invented endpoints. |
| **Adapt** | OpenAPI link, generated table, or hand table — one canonical place. |
| **BR24** | `docs/ai-context/api-catalog.md` (+ extractor) |
| **Tier** | **Must** if HTTP/RPC exists · else N/A |

### CP-06 — Universal AI development guidelines (tool-independent)

| | |
|--|--|
| **Why keep** | Cursor/Claude/Copilot all obey the **same** contract. Vendor features must not be the only memory. |
| **Must include** | Read-before-code; exact names; unknowns; no secrets; plan vs direct; inconsistency standing rule; safety rules; definition of done; **continuity section** (see CP-12). |
| **BR24** | `docs/ai-context/ai-development-guidelines.md` |
| **Tier** | **Must** |

### CP-07 — Knowledge / doc maintenance process

| | |
|--|--|
| **Why keep** | Docs rot unless “what to update when” is explicit. Ties code change → docs → graph. |
| **BR24** | `docs/ai-context/knowledge-maintenance.md` |
| **Tier** | **Must** |

### CP-08 — Knowledge graph (Graphify or equivalent)

| | |
|--|--|
| **Why keep** | Narrative docs don’t scale for impact analysis. Nodes/edges answer “what else breaks?” |
| **Must contain** | Machine-readable nodes + relationships with file locations; business/domain narrative link; regenerate guidance. |
| **Adapt** | JSON, DB, or existing graph tool — **one** graph home (don’t create parallel `docs/graphify` + `docs/knowledge-graph`). |
| **BR24** | `docs/knowledge-graph/` + `docs/scripts/extract-knowledge.mjs` + optional 3D viewer |
| **Tier** | **Must** for non-trivial codebases · **Adapt** format/tooling · Viewer **Optional** |

### CP-09 — Business / domain narrative

| | |
|--|--|
| **Why keep** | Code names ≠ business meaning. Invariants and workflows belong here so agents don’t “optimize away” rules. |
| **Adapt** | Separate `docs/domain/` **or** `business-domain.md` next to the graph — don’t duplicate both. |
| **BR24** | `docs/knowledge-graph/business-domain.md` |
| **Tier** | **Must** |

### CP-10 — Workspace ownership / edit boundaries

| | |
|--|--|
| **Why keep** | Stops agents from editing sibling repos or DB “because the page needs an API.” |
| **Must define** | What this workspace may edit; what is context-only; ask-before-assuming contracts; optional handoff prompt packs for other owners. |
| **BR24** | Guidelines §1.1 Frontend-only |
| **Tier** | **Must** (wording adapts: FE-only, BE-only, full-stack, etc.) |

### CP-11 — AI work-state / continuity folder

| | |
|--|--|
| **Why keep** | Long chats compact; machines restart; another agent takes over. Without this, prior work is tribal knowledge. |
| **Must contain** | See CP-11a–c below. |
| **BR24** | `docs/ai-work/` |
| **Tier** | **Must** |

#### CP-11a — `ACTIVE.md` (single current task or idle)

| | |
|--|--|
| **Why keep** | Exactly one “now” state. Prevents stale multi-task confusion. |
| **Must sections** | Identity, objective, requirements, scope, state, completed, WIP, remaining, decisions, invariants, files/APIs/DB, tests, issues, risks, last verified, last commit, **one Next Action**. |
| **Tier** | **Must** |

#### CP-11b — `SESSION_CHECKPOINT.md`

| | |
|--|--|
| **Why keep** | Fast resume after interrupt; lighter than full history but fresher than idle ACTIVE. |
| **Update when** | Milestones, business-rule changes, stage switches, tests done, before ending long sessions, context-risk. |
| **Tier** | **Must** |

#### CP-11c — `history/TASK-*.md` (append-only)

| | |
|--|--|
| **Why keep** | Permanent record of significant work without chat transcripts. Later agents learn what was intentional. |
| **Rules** | No full chats; don’t rewrite old history — supersede via new task/ADR. Skip trivial one-liners. |
| **Tier** | **Must** · Template **Must** |

### CP-12 — Continuity protocols inside universal guidelines

| | |
|--|--|
| **Why keep** | Files alone aren’t enough — agents must be **ordered** to checkpoint, recover, and preserve logic. |
| **Must protocols** | Long-conversation checkpoint; new-session recovery; before-modify existing logic; anti logic-loss; completion; crash recovery; git as verification; meaningful-events-only; page vs module doc rule. |
| **BR24** | Guidelines §13 |
| **Tier** | **Must** |

### CP-13 — ADR folder (convention)

| | |
|--|--|
| **Why keep** | Some decisions outlive tasks. ADRs prevent re-litigating “why did we choose X?” |
| **Rule** | Not every task gets an ADR. Link ADR ↔ task history when used. |
| **BR24** | `docs/adr/README.md` |
| **Tier** | **Must** (folder + README) · Individual ADRs **as needed** |

### CP-14 — IDE / tool pointers (short only)

| | |
|--|--|
| **Why keep** | Remind agents in-IDE to open docs — but **never** replace `docs/` + `AGENTS.md`. |
| **Adapt** | Cursor rules, Claude `CLAUDE.md`, Copilot instructions — project toolset. |
| **BR24** | `.cursor/rules/br24-ai-onboarding.mdc`, path rules, `CLAUDE.md` |
| **Tier** | **Adapt** (strongly recommended) |

### CP-15 — Optional workflow shortcuts

| | |
|--|--|
| **Why keep** | Repeating scaffolds/reviews become consistent (e.g. new page + route). |
| **BR24** | `fn-newpage`, `fn-review` |
| **Tier** | **Optional** |

### CP-16 — Secrets & exact-name hygiene

| | |
|--|--|
| **Why keep** | Stops invented tables/routes and leaked credentials in docs/commits. |
| **Where** | Guidelines + README hard rules |
| **Tier** | **Must** |

### CP-17 — Standing inconsistency rule

| | |
|--|--|
| **Why keep** | Legacy codebases have multiple patterns. Silent “majority wins” encodes bugs as standards. |
| **Behavior** | List variants + paths → ask human → follow for *new* code only. |
| **Tier** | **Must** |

### CP-18 — Context-loss validation gate

| | |
|--|--|
| **Why keep** | Proves continuity works. If answers aren’t recoverable from repo alone, the system has a gap. |
| **Questions** | Active task? Done? Invariants? Files? Decisions? Tests? Remaining? Next action? |
| **Tier** | **Must** (run after bootstrap and after major tasks) |

---

## 3. Implementation checklist (new project)

Copy and tick. Order matters.

### Phase 0 — Inspect (always first)

- [ ] Inventory existing `docs/`, `AGENTS.md`, ADRs, graphs, agent rules
- [ ] Reuse/improve — **do not** duplicate parallel trees
- [ ] Decide workspace ownership (what AI may edit)
- [ ] Confirm: **no app/business source changes** for bootstrap-only work

### Phase 1 — Knowledge base

- [ ] CP-02 Onboarding README + reading order
- [ ] CP-03 Architecture narrative (+ diagrams if useful)
- [ ] CP-04 Area docs for real layers
- [ ] CP-05 API catalog if applicable
- [ ] CP-06 Universal guidelines (core sections)
- [ ] CP-07 Knowledge-maintenance
- [ ] CP-10 Ownership / edit boundaries
- [ ] CP-16 Exact names + secrets
- [ ] CP-17 Inconsistency standing rule

### Phase 2 — Graph + domain

- [ ] CP-08 Knowledge graph (or map to existing)
- [ ] CP-09 Business/domain narrative
- [ ] Optional extractor script (does not modify app source)
- [ ] Optional graph viewer

### Phase 3 — Continuity

- [ ] CP-01 `AGENTS.md`
- [ ] CP-11 / 11a / 11b / 11c `docs/ai-work/`
- [ ] CP-12 Continuity protocols in guidelines
- [ ] CP-13 `docs/adr/` README
- [ ] Seed history task for this bootstrap; set ACTIVE idle (or real product task)
- [ ] CP-18 Context-loss simulation — fix gaps

### Phase 4 — Tooling polish

- [ ] CP-14 Short IDE pointers
- [ ] CP-15 Optional commands/skills
- [ ] Link everything from `docs/README.md` (or repo docs index)

---

## 4. What NOT to do (anti-checkpoints)

| Don’t | Why |
|-------|-----|
| Treat chat as SoT | Context dies; next agent is blind |
| Duplicate Graphify into ai-work or ADRs | Triple maintenance, drift |
| Full conversation transcripts in history | Noise; privacy; useless for coding |
| AI activity log on every page click | Over-doc; use task history + module docs |
| Parallel folders for the same purpose (`docs/graphify` vs `docs/knowledge-graph`) | Agents pick the wrong one |
| Put full guidelines only in Cursor rules | Other tools / humans miss them |
| Edit Backend/DB “to unblock FE” without explicit re-validation | Ownership breach |
| Rewrite old TASK history when decisions change | Lie about the past — add new task/ADR |
| Bootstrap by mass-refactoring app code | Out of scope; high regression risk |

---

## 5. Bootstrap prompt (feed to any AI on any project)

Copy everything in the block below into an Agent session at the **target repo root**.

```markdown
# Bootstrap: Universal AI Onboarding + Continuity

Implement AI onboarding for THIS repository using the checkpoint model below.
Projects differ — **adapt paths and stack** — but every **Must** checkpoint’s *purpose* must exist.

## Authority document in the source repo (if available)

If this workspace already has a file like:
`docs/ai-onboarding-checkpoints.md` or BR24’s equivalent,
follow its checkpoint catalog (CP-01 … CP-18). Otherwise use the checklist embedded here.

## Hard constraints

1. **Inspect first.** Find existing docs, AGENTS.md, graphs, ADRs, ai-work, IDE rules. **Reuse and improve** — never duplicate equivalent systems.
2. **Docs/workflow only** unless the user explicitly asks for product code changes.
3. Canonical rules stay **tool-independent** under `docs/`. IDE files are short pointers only.
4. Conversation is **never** source of truth. Persist work-state for a fresh agent.
5. Do not over-document: no chat dumps, no source paste, no second knowledge graph, no per-click page AI logs.
6. Exact names from the codebase only; mark unknowns; never put secrets in docs.

## Checkpoints to satisfy

### Must
- CP-01 Root `AGENTS.md` with new-session recovery
- CP-02 Onboarding README + reading order
- CP-03 System/architecture narrative
- CP-04 Area docs for each real layer (owned + context-only as needed)
- CP-05 API/contract catalog if APIs exist
- CP-06 Universal `ai-development-guidelines.md` (tool-independent)
- CP-07 Knowledge-maintenance process
- CP-08 Knowledge graph (or documented map to an existing graph) for non-trivial repos
- CP-09 Business/domain narrative (single home)
- CP-10 Workspace ownership / edit boundaries
- CP-11 `docs/ai-work/` with ACTIVE.md, SESSION_CHECKPOINT.md, history/_TEMPLATE.md
- CP-12 Continuity protocols inside guidelines (checkpoint, recovery, preserve logic, completion, git verify)
- CP-13 `docs/adr/` convention README
- CP-16 Exact-name + secrets rules
- CP-17 Inconsistency standing rule (list variants → ask human)
- CP-18 Context-loss validation after bootstrap

### Adapt
- CP-14 IDE pointers (Cursor/Claude/etc.)
- Graph format, area doc names, diagram tool
- Ownership wording (FE-only vs full-stack vs BE-only)

### Optional
- CP-15 Workflow shortcuts (newpage/review/etc.)
- Graph 3D/HTML viewer
- Extractor script (must not modify application source)

## ACTIVE.md required sections

Task identity, objective, requirements, scope, current state, completed, WIP, remaining, decisions, invariants, files/APIs/DB changed, tests, issues, risks, last verified, last commit, **exactly one Next Action**. Idle when no task.

## Continuity protocols to encode in guidelines

1. Long conversation / context risk → update ACTIVE + SESSION_CHECKPOINT + history; verify git; continue from repo.
2. New session recovery: AGENTS → git → ACTIVE → checkpoint → task history → graph → domain → ADRs → source → verify → Next Action. Do not ask the user to re-explain recoverable prior AI work.
3. Before modifying existing logic: discover current behavior, rules, APIs, BE/DB context, tests, prior tasks, unfinished work; label EXISTING vs INTENTIONALLY CHANGED.
4. Conflict between new requirement and existing business logic + unclear intent → STOP and ask.
5. Completion: verify requirements, tests, git diff, finalize history, idle ACTIVE, update domain/arch/graph as needed.
6. Record meaningful events only (what/why/changed/preserve/remains).

## Ownership pattern (adapt)

If this workspace should not own Backend/DB (or another boundary):
- Context docs OK; edits forbidden unless user explicitly re-validates.
- Gaps → ask user first → agree contract → implement only owned layer → offer copy-paste prompts/requirements for other owners when asked.

## Execution order

Phase 0 Inspect → Phase 1 Knowledge base → Phase 2 Graph + domain → Phase 3 Continuity → Phase 4 IDE polish → CP-18 validation.

## Deliverables

1. Short inventory: reused vs created  
2. All Must checkpoints satisfied (or N/A with reason)  
3. Bootstrap recorded in `docs/ai-work/history/TASK-*.md`; ACTIVE idle or real product task  
4. Answers to CP-18 recovery questions written in the task history or checkpoint  
5. No unnecessary app source changes  

Start with Phase 0 and report the inventory before creating files when unclear what already exists.
```

---

## 6. Micro-prompts (after onboarding exists)

### New chat / resume

```text
Follow AGENTS.md recovery. Read ACTIVE.md + SESSION_CHECKPOINT.md + relevant TASK history. Continue from Next Action. Do not ask me to re-explain work recoverable from the repo.
```

### Context risk / long session

```text
Checkpoint now: update ACTIVE.md, SESSION_CHECKPOINT.md, and the current TASK history. Verify git status/diff. Then continue from repository state only.
```

### Start significant work

```text
Open a new docs/ai-work task (ACTIVE + history/TASK-*.md). If another layer (API/DB/etc.) is required beyond this workspace’s ownership, ask me first with the assumed contract before coding.
```

### Audit onboarding health

```text
Audit this repo against docs/ai-onboarding-checkpoints.md (CP-01…CP-18). List missing Must checkpoints and the smallest fix for each. Do not recreate systems that already exist under another path — map them.
```

---

## 7. BR24 path quick index

| Checkpoint | BR24 path |
|------------|-----------|
| CP-01 | `AGENTS.md` |
| CP-02–07, 10, 12, 16–17 | `docs/ai-context/` |
| CP-08–09 | `docs/knowledge-graph/` (+ `docs/scripts/extract-knowledge.mjs`) |
| CP-11 | `docs/ai-work/` |
| CP-13 | `docs/adr/` |
| CP-14–15 | `.cursor/rules/`, `CLAUDE.md`, fn- prompts |
| Package index | `docs/README.md` |
| This file | `docs/ai-onboarding-checkpoints.md` |

---

*Port this file to other repos as the checkpoint SoT for AI onboarding. Keep project-specific architecture detail in that project’s `docs/ai-context/` — not by forking endless copies of product docs into this checklist.*
