# Graphify — visual shape (readable slice)

The full Graphify store is **1,580 nodes / 2,507 edges** (mostly entities). Below is the **architecture spine** and a **SalesOrder neighborhood** — the same idea agents walk when doing impact analysis.

## Architecture spine

```mermaid
flowchart TB
  FE[app:frontend:react-vite-ts]
  ApiApp[app:backend:BR24.Api]
  Api[be:project:BR24.Api]
  App[be:project:BR24.Application]
  Per[be:project:BR24.Persistence]
  Dom[be:project:BR24.Domain]
  Inf[be:project:BR24.Infrastructure]
  Db[be:dbcontext:ApplicationDbContext]
  FE -->|communicates_with| ApiApp
  ApiApp -->|maps_to| Api
  Api -->|depends_on| App
  Api -->|depends_on| Per
  Api -->|depends_on| Inf
  Per -->|depends_on| App
  Inf -->|depends_on| App
  App -->|depends_on| Dom
  Per -->|depends_on| Db
```

## SalesOrder neighborhood (example walk)

```mermaid
flowchart LR
  Page[fe:page:SalesOrderEdit]
  Slice[fe:api:SalesOrderApiSlice]
  DTO[fe:dto:SalesOrderInterface]
  Ctrl[be:controller:SalesOrderController]
  Svc[be:service:SalesOrderService]
  Feat[be:feature:SalesOrder]
  Repo[be:repository:SalesOrderRepository]
  IRepo[be:repository:ISalesOrderRepository]
  Proc[be:api:SalesOrderController.Process]
  Page --> Slice
  Page --> DTO
  Slice -.->|HTTP JWT| Ctrl
  Ctrl -->|calls| Svc
  Ctrl -->|creates| Proc
  Svc --> Feat
  Repo -->|implements| IRepo
```

## Composition by node type

| Type | Count |
|------|------:|
| Entity | 960 |
| API | 227 |
| Repository | 116 |
| Module | 69 |
| DTO | 53 |
| Controller | 50 |
| Page | 49 |
| Service | 48 |
| Project | 5 |
| Application | 2 |
| DatabaseObject | 1 |

Raw data: [`nodes.json`](./nodes.json), [`relationships.json`](./relationships.json).

## 3D viewer

Open [`graphify-3d.html`](./graphify-3d.html) via a local HTTP server (browsers block `file://` fetch of JSON):

```bash
npx --yes serve "docs/knowledge-graph" -p 5500
```

Then visit [http://localhost:5500/graphify-3d.html](http://localhost:5500/graphify-3d.html).

Presets: Architecture · Modules · No entities · Tender neighborhood · SalesOrder neighborhood · All.

