# Module Dependency Diagram

High-level dependencies between solution projects and major FE modules. Exact edges also live in `../knowledge-graph/relationships.json`.

```mermaid
flowchart TB
  FE[app_frontend_react-vite-ts]
  Api[be_project_BR24.Api]
  App[be_project_BR24.Application]
  Dom[be_project_BR24.Domain]
  Per[be_project_BR24.Persistence]
  Inf[be_project_BR24.Infrastructure]
  FE -->|communicates_with| Api
  Api --> App
  Api --> Per
  Api --> Inf
  Per --> App
  Inf --> App
  App --> Dom
```

## Selected business module dependencies

```mermaid
flowchart LR
  Login[Login]
  Chain[BiznessEventProcessConfiguration]
  SA[SA_ChainMenu_SA_NextEvent]
  Track[BiznessEvent_PCTrack]
  Sales[SalesOrder]
  Tender[ProcurementTender]
  Target[Team_Region_Target]
  Login --> SA
  Chain --> SA
  SA --> Track
  Sales --> Track
  Tender --> Track
  Target --> Sales
```
