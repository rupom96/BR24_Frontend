# BR24 Universal AI Development Guidelines

**Audience:** Any AI coding agent (Cursor, Claude Code, GitHub Copilot, ChatGPT coding agents, and future assistants).  
**Authority:** Follow this document for every coding task on BR24. It is **tool-independent** — do not rely on vendor-specific features, slash-commands, or IDE plugins to understand the project.

**Related docs:**

| Doc | Role |
|-----|------|
| [README.md](./README.md) | Onboarding entry + reading order |
| [system-architecture.md](./system-architecture.md) | End-to-end architecture |
| [frontend.md](./frontend.md) / [backend.md](./backend.md) / [database.md](./database.md) | Area detail |
| [api-catalog.md](./api-catalog.md) | HTTP surface |
| [knowledge-maintenance.md](./knowledge-maintenance.md) | Doc update checklist |
| [../knowledge-graph/](../knowledge-graph/) | **Graphify** knowledge graph |
| [../ai-work/](../ai-work/) | **Active task / session checkpoint / task history** (continuity) |
| [../../AGENTS.md](../../AGENTS.md) | Repo entry + new-session recovery |
| [../adr/](../adr/) | Architecture Decision Records (when needed) |

---

## 1. Purpose and scope

This file defines **how** an AI agent must:

1. Understand the project before writing code  
2. Use the **Graphify** knowledge graph  
3. Perform impact analysis  
4. Create an implementation plan  
5. Maintain documentation  
6. Update the knowledge graph after changes  
7. Obey coding, database, and API safety rules  
8. Persist **work-state** so long-running tasks survive context loss (§13)  

**Repositories:**

| App | Location | Role in this workspace |
|-----|----------|------------------------|
| Frontend | `E:\WORKING_FOLDER\BR24\Frontend\BR24 Frontend` (package `react-vite-ts`) | **Primary** — code changes live here |
| Backend | `E:\WORKING_FOLDER\BR24\Backend\BR24_Backend` (`BR24.sln`) | **Context only** — another teammate owns implementation |
| Database | SQL Server / entities / SPs (see `database.md`) | **Context only** — another teammate owns schema & SPs |

### 1.1 Frontend-only ownership (hard rule)

This repo’s AI workflow is **Frontend-first**. Backend and Database docs (`backend.md`, `database.md`, Graphify BE nodes, API catalog) exist so agents **understand** contracts — **not** so they edit Backend or Database by default.

| Default | Allowed only after **explicit user re-validation** |
|---------|-----------------------------------------------------|
| Read BE/DB docs + Graphify for understanding | Edit Backend source under `BR24_Backend` |
| Build/modify Frontend against agreed contracts | Change DB schema, entities, SPs, migrations, or triggers |
| Produce copy-paste **prompts + requirements** for the BE/DB teammate when asked | “Just implement the API/SP while you’re at it” without a clear yes |

**When a Frontend page/feature needs Backend or Database work:**

```text
1. ASK the user first — list what BE/DB would need (endpoints, payloads, tables/SPs, auth).
2. Wait for agree / alternate suggestion. Do not invent the contract silently.
3. Build/modify Frontend only, assuming that agreed contract (mock/stub only if user asks).
4. Do NOT open or edit the Backend repo or Database scripts.
5. After FE work: ASK whether they want exact prompts + requirements for Backend (if any) and DB (if any).
6. If yes → deliver copy-paste prompts any AI/teammate can feed to implement BE/DB correctly.
```

**Never** treat “page needs an API” as permission to code Backend/DB. Silence or docs context ≠ authorization.

---

## 2. Mandatory workflow (every task)

```text
0. RECOVER ai-work (new session) →  1. READ docs  →  2. GRAPHIFY impact  →  3. PLAN
→  4. IMPLEMENT  →  5. VERIFY  →  6. UPDATE DOCS + GRAPHIFY + ai-work
```

Do **not** skip to implementation. If the human asks for a quick fix, still do a minimal read + Graphify impact pass before editing.  
**New conversations:** follow §13.3 recovery before coding. **Long chats / milestones:** checkpoint per §13.2.

### Plan mode vs direct execution

| Situation | Mode |
|-----------|------|
| Single file, clear scope (typo, small UI tweak, one validation) | **Direct execution** |
| Multi-file, new page/feature, API/contract change, architecture, or multiple valid approaches | **Plan first**, then implement after agreement |

Do not use plan mode for trivial one-liners; do not skip planning for exploratory or convention-setting work.

### Standing rule — inconsistencies (do not assume)

The BR24 codebase has **legacy inconsistencies** (e.g. duplicate/`copy` pages, mixed PrivateRoute usage, DTO vs VM naming on backend, Command/Handler file layout variants).

When you find **more than one pattern** for the same kind of thing:

1. **Do not** pick a “majority” pattern silently and encode it as the standard.  
2. **Tell the human** what variants you found (with paths).  
3. **Ask** which variant should be the standard for *new* code.  
4. Only then document/follow that standard. Do **not** mass-refactor old files unless asked.  
5. Treat known typos/bugs as bugs — never copy them as conventions.

This rule applies to every phase of work, not only onboarding.

### Step checklist

| Step | Required action | Done when |
|------|-----------------|-----------|
| 0. Recover | New session: `AGENTS.md` + `docs/ai-work/` + git (§13.3) | Next Action known from repo, not chat |
| 1. Understand | Read §3 materials for the task scope; open/update `ACTIVE.md` for significant work | You can name the exact modules involved |
| 2. Graphify | Query nodes + relationships (§4–§5) | Impacted node IDs listed |
| 3. Plan | Write plan (§6) when multi-file / ambiguous; else minimal impact note | Human can approve or you proceed with clear blast radius |
| 4. Code | Follow patterns + safety rules (§8–§10); **FE-only** unless §1.1 re-validated; preserve existing logic (§13.4–§13.5) | Only planned **Frontend** files changed (default) |
| 5. Verify | Build/lint/tests as available; spot-check call sites; `git diff` | No invented names; no secret leaks |
| 6. Maintain | Update docs + Graphify (§7) + ai-work checkpoint/history (§13); offer BE/DB prompt pack if gaps | Docs + ACTIVE/checkpoint match reality |

---

## 3. How to understand the project before coding

### 3.1 Always start here

1. `docs/ai-context/README.md`  
2. `docs/ai-context/system-architecture.md`  
3. Area docs matching the task:
   - UI / routes / RTK → `frontend.md`
   - Controllers / Features / DI → `backend.md`
   - Entities / SPs / triggers → `database.md`
   - HTTP contracts → `api-catalog.md`
4. Business meaning → `docs/knowledge-graph/business-domain.md`  
5. This guidelines file  
6. Then open **source files** at paths found in Graphify `location` fields  

### 3.2 Trust order (conflict resolution)

1. **Source code** (controllers, services, entities, pages) — highest truth  
2. **Graphify** (`nodes.json` / `relationships.json`) — structural index; may lag until regenerated  
3. **Narrative docs** under `docs/ai-context/` — intent and conventions  
4. If still unclear → mark **unknown** and ask the human. **Never invent** module, table, class, route, or SP names.

### 3.3 What “understood” means

Before coding you must be able to state:

- Which **application** you will **edit** (default: **Frontend only** — see §1.1)  
- Exact **names**: page, ApiSlice; plus any **assumed** controller/feature/entity names from docs (do not invent)  
- Whether the change is **read**, **write (`process`)**, **API contract assumption**, or **docs-only**  
- Auth implications (JWT / PrivateRoute; BE `[Authorize]` only as context)  
- Whether BE/DB gaps require an **ask + later prompt pack** (§1.1) — not silent BE/DB edits  

---

## 4. How to use the Graphify knowledge graph

**Graphify** is the project’s permanent, AI-readable knowledge graph. It is **not** tied to any IDE.

### 4.1 Location

```text
docs/knowledge-graph/
  nodes.json              # all nodes
  relationships.json      # all edges with evidence
  business-domain.md      # business modules and workflows
  extraction-meta.json    # last extraction counts / timestamp
```

Regenerator (optional after structural edits):

```bash
node docs/scripts/extract-knowledge.mjs
```

Runs from the frontend repo; reads Frontend + Backend sources; writes only under `docs/`. Does **not** modify application source.

### 4.2 Node schema

Each node:

```json
{
  "id": "be:controller:SalesOrderController",
  "name": "SalesOrderController",
  "type": "Controller",
  "location": "<absolute or repo path>",
  "description": "<short purpose>"
}
```

### 4.3 Relationship schema

Each edge:

```json
{
  "source": "fe:api:SalesOrderApiSlice",
  "relationship": "communicates_with",
  "target": "be:controller:SalesOrderController",
  "evidence": "<file path or extraction note>"
}
```

Common `relationship` values: `imports`, `calls`, `depends_on`, `inherits`, `implements`, `creates`, `updates`, `reads`, `writes`, `maps_to`, `communicates_with`.

### 4.4 Node ID prefixes (search keys)

| Prefix | Meaning |
|--------|---------|
| `app:frontend:` / `app:backend:` | Applications |
| `be:project:` | Solution projects (`BR24.Api`, …) |
| `be:controller:` | API controllers |
| `be:api:` | Endpoint actions |
| `be:feature:` | Application Features |
| `be:service:` | Application services |
| `be:repository:` | Repositories / contracts |
| `be:entity:` | Domain entities |
| `be:dbcontext:` | EF DbContext |
| `fe:page:` | Frontend page folders |
| `fe:api:` | RTK Query ApiSlices |
| `fe:dto:` | Frontend interfaces |
| `fe:folder:` | FE layer folders |

### 4.5 How to query Graphify (tool-independent)

Any agent can:

1. **Search by name** in `nodes.json` (e.g. `ProcurementTender`, `TenderCosting`, `SalesOrder`).  
2. **Take the node `id` and `location`** — open that file next.  
3. **Search `relationships.json`** for that `id` as `source` **or** `target`.  
4. **Walk neighbors** one hop (direct), then two hops if the change is cross-cutting (API + entity + page).  
5. **Read `evidence`** — confirm the edge is still valid in source if the task is risky.  
6. Use `business-domain.md` for workflow context after structural neighbors are known.

Do not require a graph UI, MCP, or proprietary plugin. Plain text search over the JSON files is enough.

### 4.6 When Graphify and code disagree

- Prefer **code**.  
- After the task, **regenerate or hand-fix** Graphify so they converge.  

---

## 5. How to perform impact analysis

### 5.1 Procedure

1. Identify the **seed** (user request → primary symbol or path).  
2. Resolve seed to Graphify node(s).  
3. Collect **direct** neighbors from `relationships.json`.  
4. Classify neighbors:

| Class | Examples | Usually must update? |
|-------|----------|----------------------|
| Contract | Controller action, DTO, ApiSlice endpoint | Yes, if signature/route changes |
| Behavior | Feature Service, Command/Query handlers | Yes, if logic changes |
| Persistence | Repository, Entity, SP name | Yes, if data shape/rules change |
| UI | Page, route in `App.tsx`, components | Yes, if UX/API consumption changes |
| Docs | `api-catalog`, area md, Graphify | Yes after structural change |
| Unrelated | Same prefix but no edge | No — do not drive-by edit |

5. List **risks**: auth, multi-tenant `companyId`/`locationId`, `process` composite writes, SP side effects, DB triggers.  
6. Produce an **Impact summary** (required in the plan):

```text
Seed: <node id>
Direct impacts: <ids>
Secondary impacts: <ids>
Out of scope: <ids or areas>
Risks: <auth | data | API break | SP | trigger | unknown>
```

### 5.2 Cross-stack rules

- Changing a **controller action** → check FE `fe:api:*` with `communicates_with` + any axios call sites.  
- Changing an **entity / DbSet** → check repositories, Features, SPs, and FE interfaces that mirror fields.  
- Changing **Login / JWT / CORS** → treat as system-wide; read `system-architecture.md` first.  
- Changing **BiznessEvent / SA_ChainMenu / SA_NextEvent** → expect menu, chain UI, and email side effects.

### 5.3 Stop conditions

- If impact fan-out exceeds a clear boundary and the human asked for a small change → **narrow scope** or ask before expanding.  
- If a neighbor’s purpose is **unknown** → do not “fix inventively”; read the file or ask.

---

## 6. How to create implementation plans

Every non-trivial task needs a short plan **before** edits. Tool-independent template:

```markdown
## Goal
<one sentence>

## Graphify impact
- Seed: …
- Direct: …
- Secondary: …
- Out of scope: …

## Approach
1. …
2. …

## Files to touch (exact paths)
- Frontend only (default). Backend/DB paths only if §1.1 re-validated.
- …

## API / DB / Auth effects (assumptions — not BE/DB edits)
- Endpoints needed (assumed): add | change | remove | none
- Schema / SP / trigger (assumed): yes/no/unknown
- Auth: unchanged | must review
- User asked / agreed on BE/DB contract? yes | pending ask | N/A
- Offer BE/DB prompt pack after FE? yes | no | ask at end

## Test plan
- [ ] …
- [ ] …

## Doc / Graphify updates
- [ ] …
```

### Plan quality rules

- Use **exact** project names from Graphify / source.  
- Prefer **smallest** change that satisfies the request.  
- Match existing patterns (`process` VM, RTK slice) — do not propose a parallel architecture.  
- Call out **assumed** API/DB needs and **ask the user** before coding FE against them (§1.1).  
- If blocked by **unknown**, list questions — do not guess schema or implement BE/DB to “unblock.”

---

## 7. How to maintain documentation and update Graphify

### 7.1 Documentation after implementation

Update only what changed. Checklist:

| If you changed… | Update… |
|-----------------|---------|
| HTTP endpoint / DTO contract | `api-catalog.md` (+ regenerate Graphify) |
| FE page / route | `frontend.md` |
| ApiSlice / `controllerName` | `frontend.md` slice map + Graphify |
| Feature / service / repo | `backend.md` |
| Entity / DbSet / SP / trigger | `database.md` |
| Workflow / module dependency | `business-domain.md` |
| Auth / pipeline / DI / externals | `system-architecture.md` |
| Conventions in this file | this file |
| Diagrams | `docs/architecture/*.md` |

Detail also lives in [knowledge-maintenance.md](./knowledge-maintenance.md).

### 7.2 Updating Graphify after changes

**Prefer regeneration** when any of these occurred:

- Added/removed/renamed: controller, action, Feature folder, repository, entity file, FE page folder, ApiSlice  
- Changed `controllerName` or project references  

```bash
node docs/scripts/extract-knowledge.mjs
```

Then spot-check: new symbols appear in `nodes.json`; `extraction-meta.json` timestamp updated.

**Hand-edit Graphify only when:**

- Regeneration is unavailable, **or**  
- You need a temporary edge with clear `evidence` until the next extract  

Never invent nodes without a real `location` in the repo.

### 7.3 Generated vs hand-maintained

| Artifact | Primary maintenance |
|----------|---------------------|
| `nodes.json`, `relationships.json`, `api-catalog.md` (table) | Extractor |
| Architecture / FE / BE / DB / business / guidelines | Hand-edit; keep names exact |

### 7.4 Secrets in docs

Document **setting names only** (`ConnectionStrings:DefaultConnection`, `Jwt:Key`, `SmtpSettings`, …).  
Never copy passwords, API keys, or connection strings into `/docs` or chat logs intended for commit.

---

## 8. Coding safety rules

### 8.1 General

- Do not invent names for modules, tables, classes, files, routes, or SPs.  
- Do not modify unrelated files (“drive-by” refactors).  
- Do not delete `* copy*`, `*Backup*`, `*Golden*` files unless explicitly asked.  
- Do not commit secrets; do not print secrets into docs.  
- If docs and code conflict, fix docs after trusting code.  
- Mark gaps as **unknown** instead of fabricating behavior.

### 8.2 Frontend

- Layers: `presentation` / `application` / `domain` / `infrastructure` — do not invent new top-level roots.  
- State: Redux Toolkit + RTK Query is standard — do not add Zustand/Context global stores without human approval.  
- HTTP: `window.API_BASE_URL` from `apiConfig.json`; Bearer via `getToken()`.  
- Register new ApiSlices in `store.ts`.  
- Add routes in `App.tsx`; use `PrivateRoute` unless the route is intentionally public.  
- UI stack: MUI + Tailwind + material-react-table; match nearby screens.  
- Do not hardcode API hosts.  
- Prefer extending existing `*ApiSlice` over parallel clients.

### 8.3 Backend (context + prompt pack only unless §1.1)

**Default:** do **not** edit Backend. Use these rules when writing **requirements/prompts** for the BE teammate, or when the user has **explicitly** re-validated Backend work.

- Keep controllers thin; business logic in `Features/{Name}/BusinessLogic` services and Commands/Queries.  
- Entities live in `BR24.Domain/Entities`; persist via `ApplicationDbContext` + repositories.  
- Register new services/repos in the existing DI extension methods.  
- Prefer existing verbs: `get*`, `process`.  
- Do not adopt Hangfire or IdentityServer for new work — they are not on the live Api pipeline.  
- Do not introduce a second ORM as the default path (EF Core + SP helper is standard).  
- Respect `[Authorize]` defaults; use `[AllowAnonymous]` only with explicit justification.

### 8.4 Naming (follow existing)

**FE:** `presentation/pages/{Feature}/`, `I*` interfaces, `{Name}ApiSlice.ts`, `*Slice.ts`  
**BE:** `{Name}Controller`, `I{Name}Service`, `I{Name}Repository`, `Get{X}Dto`, `Create|Update|Delete{X}Command`, `{Name}CommandsVM`, `SP_*`

### 8.5 End-to-end feature recipe (Frontend agent)

**This agent implements Frontend only** (unless §1.1 re-validated):

1. **Ask** if BE/DB gaps exist → agree assumed contract  
2. **Frontend:** Interface → ApiSlice + `store.ts` → Page → `App.tsx` route → (optional) menu/`SA_ChainMenu` → docs/Graphify  
3. **Offer** BE/DB prompt pack describing the assumed contract  

**Backend recipe** (for prompt pack / authorized BE work only): Entity (+ DbSet) → Repository + DI → Feature Commands/Queries/DTOs → Service + DI → Controller → (optional) AutoMapper/validation → docs/Graphify  

---

## 9. Database safety rules

**Default:** do **not** change Database. Use this section for understanding and for **prompt/requirements** text (or after §1.1 re-validation).

- **Do not** rename tables/columns/entities “for cleanliness” without an explicit migration plan and human approval.  
- **Do not** invent table or SP names — discover from `BR24.Domain/Entities`, `ApplicationDbContext`, repositories, or `database.md`.  
- Prefer existing repository methods and `CallStoredProcedure*` helpers over ad-hoc SQL scattered in controllers.  
- New raw SQL / SPs: document the **exact** SP name in requirements/`database.md` context; the DB owner deploys.  
- Be aware of EF-wired triggers (`TR_AUTO_SETTLEMENT_*`) — updates to Collection / SalesReturn / SalesOrder / OpeningBalance paths may have side effects.  
- `ApplicationDbContext` command timeout is large (7200s) — do not “fix” timeouts casually; understand why long ops exist.  
- Entity file count ≠ DbSet count — an entity file without `DbSet` may be unused; verify before building on it.  
- No `.sql` scripts in repo for most SPs — assume DB objects may exist only on the server; confirm before depending on a new SP.  
- Never paste production connection strings into docs, issues, or commits.  
- Multi-tenant style filters: preserve `companyId` / `locationId` (and related) constraints already used by the feature.

---

## 10. API change rules

**Default for this workspace:** Frontend consumes APIs; agents **document assumed contracts** and update FE types/slices. Implementing or changing Backend controllers is **out of scope** unless §1.1 re-validated. The rules below guide prompt packs and authorized BE work.

### 10.1 Compatibility

| Change | Rule |
|--------|------|
| Add new endpoint | Allowed; document in `api-catalog.md`; add FE slice endpoint if needed |
| Add optional request field | Prefer backward compatible |
| Rename route / action | **Breaking** — require human approval; update all FE call sites (RTK + axios) |
| Remove endpoint | **Breaking** — require approval; prove no FE/legacy consumers |
| Change response shape | Treat as breaking unless strictly additive optional fields |
| Change auth (`Authorize` ↔ `AllowAnonymous`) | Security-sensitive — require explicit human approval |

### 10.2 Conventions

- Base route: `api/[controller]` unless documenting special cases (`GlobalAPIController` GUID routes — **do not “simplify”** those paths).  
- FE base URL already includes `/api` (`window.API_BASE_URL`).  
- Composite writes: prefer `POST .../process` + Commands VM consistent with sibling features.  
- Keep DTO / Query / Command names aligned with existing Feature folders.  
- After any contract change: update `api-catalog.md`, FE types/slices, and regenerate Graphify.

### 10.3 Third-party / Global API

- `GlobalAPIController` uses opaque GUID routes for external integrators.  
- Do not rename GUID segments.  
- Any change requires explicit approval and consumer notification planning.

### 10.4 Legacy bridges

- `BR2_URL` / `BR3_API_URL` / `BR3_FN_URL` are legacy.  
- Do not route **new** primary features through them unless the task is explicitly an integration with those apps.

---

## 11. Definition of done (agent)

A task is done only when:

1. Frontend code follows existing architecture and naming  
2. Impacted **Frontend** call sites updated; BE/DB left untouched unless §1.1  
3. If BE/DB was needed: user was asked up front; after FE, asked about **prompt pack**  
4. No secrets introduced into docs or source incorrectly  
5. Relevant `docs/ai-context/*` updated (FE-facing)  
6. Graphify regenerated or accurately hand-updated if **FE** structure changed  
7. `docs/ai-work/` updated (history finalized; ACTIVE idle or accurate; checkpoint current) — §13.7  
8. Unknowns remaining are listed for the human  

---

## 12. Quick reference — do / don’t

| Do | Don’t |
|----|-------|
| Read docs + Graphify first | Code from memory of other projects |
| Edit **Frontend** by default | Touch Backend/DB without explicit re-validation (§1.1) |
| Ask before assuming new API/DB | Invent controllers/tables/SPs or silently implement them |
| Plan when multi-file / ambiguous | Plan every one-line tweak |
| Direct-exec clear single-file fixes | Skip planning on architecture/API work |
| Ask when multiple patterns exist | Assume majority = standard |
| Match `process` / RTK patterns | New frameworks without approval |
| Offer BE/DB prompts after FE when gaps | Leave teammate guessing the contract |
| Update docs + Graphify after | Leave catalog/graph stale |
| Mark unknown + ask | Guess schema or auth |
| Tool-agnostic file reads | Depend on one vendor’s memory |
| Use `fn-newpage` / `fn-review` for FE scaffold/review | Invent ad-hoc page layout each time |
| Persist milestones in `docs/ai-work/` | Treat chat as SoT or dump full transcripts |
| Recover from ACTIVE + checkpoint + git | Ask user to re-narrate prior AI work recoverable from repo |

### fn- shortcuts (Cursor)

| Trigger | Does |
|---------|------|
| `fn-newpage {FeatureName}` | Empty page under `presentation/pages` + `App.tsx` route (PrivateRoute default) |
| `fn-review` / `fn-review {FeatureName}` | Frontend checklist report (routing, API, docs) |

Commands live in `.cursor/commands/fn-newpage.md` and `fn-review.md`.

---

## 13. Long-running continuity (AI work-state)

**Principle:** The AI conversation is **never** the project’s source of truth. Context can be compacted or lost. The repository must hold enough state for a **new** agent to continue safely.

| Persist in repo | Do not rely on chat for |
|-----------------|-------------------------|
| `docs/ai-work/ACTIVE.md` | “What were we doing?” |
| `docs/ai-work/SESSION_CHECKPOINT.md` | “What just finished?” |
| `docs/ai-work/history/TASK-*.md` | Decisions, invariants, remaining work |
| Git commits / diff | Actual code changes |
| `docs/ai-context/` + Graphify | Architecture and structure |

Full folder guide: [../ai-work/README.md](../ai-work/README.md). Entry checklist: [../../AGENTS.md](../../AGENTS.md).

### 13.1 What belongs in ai-work

Record **meaningful** events only: architecture/business decisions, implementations, logic changes, API/DB assumptions, bugs, regressions, test results, rejected alternatives, limitations, unfinished work.

For each event capture: **what / why / what changed / what must be preserved / what remains**.

**Do not:** save every prompt/response; paste large source dumps; duplicate Graphify; create a log per trivial edit; create page-level AI activity files by default (use module docs + **task** history; page `*.md` only when the page already warrants deep business docs).

### 13.2 Long conversation / checkpoint protocol

If any of these are true:

- conversation is very long  
- many files changed  
- context may be compacted  
- task spans multiple stages  
- chat holds a large amount of historical detail  

then **do not** continue from memory alone. Before proceeding further:

1. Update `ACTIVE.md` (state, completed, remaining, files, decisions, invariants, **one** Next Action).  
2. Update `SESSION_CHECKPOINT.md`.  
3. Append important decisions / discoveries to the task history file.  
4. Record tests/results and known issues.  
5. Verify with `git status` / `git diff`.  
6. Continue from **repository** state.

Milestone triggers (non-exhaustive): after a major step; after a business-rule change; after FE (or authorized BE) slice complete; after tests; before switching areas; before ending a long session.

### 13.3 New session recovery protocol (mandatory)

When starting work in a **new** AI conversation:

1. Read `/AGENTS.md`.  
2. Check git status (and relevant diff).  
3. Read `/docs/ai-work/ACTIVE.md`.  
4. Read `/docs/ai-work/SESSION_CHECKPOINT.md`.  
5. Read the relevant `history/TASK-*.md`.  
6. Query Graphify for the area (`docs/knowledge-graph/`).  
7. Read business/domain context (`business-domain.md` + area docs).  
8. Read relevant ADRs under `docs/adr/` if any.  
9. Inspect actual source.  
10. Verify documented state vs code + git.  
11. Perform the safest **Next Action** from ACTIVE/checkpoint.

Do **not** ask the user to explain what the previous AI did if that information is recoverable from the repo.

### 13.4 Before modifying existing logic

Before changing an existing feature/page/module, determine:

1. Current behavior  
2. Existing business rules / invariants  
3. APIs involved  
4. Backend logic involved (context; §1.1)  
5. Database logic involved (context; §1.1)  
6. Tests covering the behavior  
7. Prior AI tasks that touched the area (`docs/ai-work/history/`)  
8. Unfinished related work (`ACTIVE.md`, git)

Check: Graphify, domain docs, task history, ADRs, source, tests, git.

Explicitly distinguish:

- **EXISTING BEHAVIOR** (preserve unless asked to change)  
- **INTENTIONALLY CHANGED BEHAVIOR** (this task only)

### 13.5 Prevent accidental logic loss

When adding a requirement on an existing feature:

1. Identify existing behavior.  
2. Identify the new requirement.  
3. Decide whether they conflict.  
4. Preserve compatible existing behavior.  
5. Change **only** what was explicitly required.  
6. Add/update tests for the changed behavior when tests exist or are requested.  
7. Record the change in task history.

If the new requirement conflicts with existing business logic and intent is unclear: **STOP and ask**. Do not silently pick one side.

Do **not** assume: “the new requirement is different, so old logic can be replaced.”

### 13.6 Crash / interruption recovery

If Cursor closes, the session ends, context is lost, the machine restarts, or another agent takes over: the next agent uses §13.3. From ai-work + git they must recover: active task, completed vs partial work, files changed, logic introduced, tests, remaining work, exact next action.

### 13.7 Completion protocol

When a task is done:

1. Verify requirements / acceptance criteria.  
2. Run appropriate tests.  
3. Review `git diff` for unintended changes.  
4. Update `ACTIVE.md` then finalize `history/TASK-*.md`.  
5. Update `SESSION_CHECKPOINT.md`.  
6. Update domain/architecture docs if behavior or structure changed.  
7. Refresh Graphify if structural (§7).  
8. Record commit/PR when available.  
9. Mark task completed; reset `ACTIVE.md` to **no active task** (do not leave stale WIP).

### 13.8 Git as verification

Git is the authoritative record of **code** changes. Task logs **reference** commits; they do not replace git. Before claiming complete: inspect diff, tests, and requirements.

### 13.9 Starting a significant task

1. Copy `docs/ai-work/history/_TEMPLATE.md` → `TASK-<unique-id>.md`.  
2. Fill `ACTIVE.md` with full sections (identity, objective, requirements, scope, state, etc.).  
3. Seed `SESSION_CHECKPOINT.md`.  
4. Then plan/implement per §2–§12.

Trivial single-file fixes may skip ai-work updates unless the session is already long or the change is risky.

---

*This document is the universal operating contract for AI agents on BR24. Keep it updated when conventions change.*
