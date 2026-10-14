/**
 * Read-only extractor: scans FE + BE sources and writes docs/knowledge-graph + api-catalog seed.
 * Does not modify application source.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FE_ROOT = path.resolve(__dirname, '../..');
const BE_ROOT = path.resolve(FE_ROOT, '../../Backend/BR24_Backend');
const OUT_KG = path.join(FE_ROOT, 'docs/knowledge-graph');
const OUT_AI = path.join(FE_ROOT, 'docs/ai-context');

const nodes = new Map();
const relationships = [];

function addNode(id, name, type, location, description) {
  if (nodes.has(id)) return;
  nodes.set(id, { id, name, type, location, description });
}

function addRel(source, relationship, target, evidence) {
  relationships.push({ source, relationship, target, evidence });
}

function walk(dir, filter, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (['node_modules', 'bin', 'obj', 'dist', '.git'].includes(ent.name)) continue;
      walk(p, filter, acc);
    } else if (filter(ent.name, p)) acc.push(p);
  }
  return acc;
}

function relPath(abs, root) {
  return path.relative(root, abs).split(path.sep).join('/');
}

// --- Applications / projects ---
addNode('app:frontend:react-vite-ts', 'react-vite-ts', 'Application', FE_ROOT, 'React 18 + Vite + TypeScript frontend (package.json name)');
addNode('app:backend:BR24.Api', 'BR24.Api', 'Application', path.join(BE_ROOT, 'BR24.Api'), 'ASP.NET Core net7.0 Web API host');

const beProjects = [
  ['BR24.Api', 'Project', 'ASP.NET Core API host: Controllers, Middleware, Program.cs'],
  ['BR24.Application', 'Project', 'Features (MediatR), services, contracts, DTOs, mapping'],
  ['BR24.Domain', 'Project', 'Domain entities only'],
  ['BR24.Persistence', 'Project', 'EF Core ApplicationDbContext, repositories, migrations'],
  ['BR24.Infrastructure', 'Project', 'Email, logging, IdentityServer config, ApiClient'],
];
for (const [name, type, desc] of beProjects) {
  const id = `be:project:${name}`;
  addNode(id, name, type, path.join(BE_ROOT, name), desc);
}
addRel('app:backend:BR24.Api', 'maps_to', 'be:project:BR24.Api', 'BR24.sln host project');
addRel('be:project:BR24.Api', 'depends_on', 'be:project:BR24.Application', 'BR24.Api.csproj ProjectReference');
addRel('be:project:BR24.Api', 'depends_on', 'be:project:BR24.Infrastructure', 'BR24.Api.csproj ProjectReference');
addRel('be:project:BR24.Api', 'depends_on', 'be:project:BR24.Persistence', 'BR24.Api.csproj ProjectReference');
addRel('be:project:BR24.Persistence', 'depends_on', 'be:project:BR24.Application', 'BR24.Persistence.csproj ProjectReference');
addRel('be:project:BR24.Infrastructure', 'depends_on', 'be:project:BR24.Application', 'BR24.Infrastructure.csproj ProjectReference');
addRel('be:project:BR24.Application', 'depends_on', 'be:project:BR24.Domain', 'BR24.Application.csproj ProjectReference');
addRel('app:frontend:react-vite-ts', 'communicates_with', 'app:backend:BR24.Api', 'window.API_BASE_URL RTK Query / axios');

// --- FE layers ---
const feLayers = [
  ['src/presentation', 'Module', 'UI pages, components, mainFiles'],
  ['src/application', 'Module', 'Redux store and slices'],
  ['src/domain', 'Module', 'TypeScript interfaces (DTOs)'],
  ['src/infrastructure', 'Module', 'RTK Query API slices and JWT auth'],
  ['src/Configs', 'Module', 'apiConfig.json copy'],
];
for (const [loc, type, desc] of feLayers) {
  const id = `fe:folder:${loc.replace(/\//g, '.')}`;
  addNode(id, loc, type, path.join(FE_ROOT, loc), desc);
  addRel('app:frontend:react-vite-ts', 'depends_on', id, loc);
}

// Pages
const pagesDir = path.join(FE_ROOT, 'src/presentation/pages');
for (const d of fs.readdirSync(pagesDir, { withFileTypes: true }).filter((x) => x.isDirectory())) {
  const id = `fe:page:${d.name}`;
  addNode(id, d.name, 'Page', path.join(pagesDir, d.name), `Frontend page module folder ${d.name}`);
  addRel('fe:folder:src.presentation', 'depends_on', id, `src/presentation/pages/${d.name}`);
}

// API slices
const apiDir = path.join(FE_ROOT, 'src/infrastructure/api');
const sliceFiles = walk(apiDir, (n) => n.endsWith('ApiSlice.ts') || n.endsWith('ApiSlice copy.ts') || n.endsWith('Trans.ts'));
const controllerNameRe = /(?:const\s+controllerName\s*=\s*['"]([^'"]+)['"]|baseUrl:\s*`\$\{API_BASE_URL\}\/([^/`$]+))/;
for (const f of sliceFiles) {
  const name = path.basename(f, '.ts');
  const id = `fe:api:${name}`;
  const text = fs.readFileSync(f, 'utf8');
  let controller = null;
  const m = text.match(/const\s+controllerName\s*=\s*['"]([^'"]+)['"]/);
  if (m) controller = m[1].replace(/\/$/, '');
  addNode(id, name, 'API', f, controller ? `RTK Query slice targeting controller ${controller}` : 'RTK Query API slice');
  addRel('fe:folder:src.infrastructure', 'depends_on', id, relPath(f, FE_ROOT));
  if (controller) {
    const ctrlId = `be:controller:${controller}Controller`;
    // controller node may be added later; still add relationship
    addRel(id, 'communicates_with', ctrlId, `${relPath(f, FE_ROOT)} controllerName=${controller}`);
  }
}

// Domain interfaces
const ifaceDir = path.join(FE_ROOT, 'src/domain/interfaces');
if (fs.existsSync(ifaceDir)) {
  for (const f of walk(ifaceDir, (n) => n.endsWith('.ts'))) {
    const name = path.basename(f, '.ts');
    const id = `fe:dto:${name}`;
    addNode(id, name, 'DTO', f, 'Frontend TypeScript interface/DTO');
    addRel('fe:folder:src.domain', 'depends_on', id, relPath(f, FE_ROOT));
  }
}

// --- Controllers & endpoints ---
const ctrlDir = path.join(BE_ROOT, 'BR24.Api/Controllers');
const ctrlFiles = walk(ctrlDir, (n) => n.endsWith('Controller.cs'));
const apiCatalog = [];

for (const f of ctrlFiles) {
  const text = fs.readFileSync(f, 'utf8');
  const classMatch = text.match(/class\s+(\w+Controller)/);
  if (!classMatch) continue;
  const className = classMatch[1];
  const id = `be:controller:${className}`;
  const routeMatch = text.match(/\[Route\("([^"]+)"\)\]/);
  const baseRoute = routeMatch ? routeMatch[1].replace('[controller]', className.replace(/Controller$/, '')) : 'unknown';
  const hasAuthorize = /\[Authorize\]/.test(text);
  addNode(id, className, 'Controller', f, `API controller base route ${baseRoute}; class Authorize=${hasAuthorize}`);
  addRel('be:project:BR24.Api', 'depends_on', id, relPath(f, BE_ROOT));

  // Feature service usings / fields
  const svcMatches = [...text.matchAll(/I(\w+Service)\s+_?\w+/g)];
  for (const sm of svcMatches) {
    const svc = sm[1];
    const svcId = `be:service:${svc}`;
    addNode(svcId, svc, 'Service', `BR24.Application/Features (I${svc})`, `Application service contract I${svc}`);
    addRel(id, 'calls', svcId, relPath(f, BE_ROOT));
  }

  // Parse endpoints - line by line for Http attributes
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const hm = lines[i].match(/\[Http(Get|Post|Put|Delete|Patch)(?:\("([^"]*)"\))?\]/);
    if (!hm) continue;
    const method = hm[1].toUpperCase();
    const actionRoute = hm[2] ?? '';
    // find method signature within next 8 lines
    let sig = null;
    for (let j = i + 1; j < Math.min(i + 12, lines.length); j++) {
      const sm = lines[j].match(/public\s+(?:async\s+)?(?:Task<)?([\w.<>,\s\[\]]+?)>?\s+(\w+)\s*\(([^)]*)\)/);
      if (sm) {
        sig = { ret: sm[1].trim(), name: sm[2], params: sm[3].trim() };
        break;
      }
    }
    const fullPath = actionRoute
      ? `${baseRoute}/${actionRoute}`.replace(/\/+/g, '/')
      : baseRoute;
    const actionName = sig?.name ?? 'unknown';
    const epId = `be:api:${className}.${actionName}`;
    addNode(epId, `${method} ${fullPath}`, 'API', f, `Action ${actionName}; return ${sig?.ret ?? 'unknown'}`);
    addRel(id, 'creates', epId, `${relPath(f, BE_ROOT)}:${i + 1}`);
    apiCatalog.push({
      method,
      path: fullPath.startsWith('api/') ? fullPath : `api/${fullPath}`,
      controller: className,
      action: actionName,
      request: sig?.params || '(none)',
      response: sig?.ret || 'unknown',
      auth: hasAuthorize ? 'Authorize (class-level; check AllowAnonymous on action)' : 'no class-level Authorize',
    });
  }
}

// --- Features ---
const featuresDir = path.join(BE_ROOT, 'BR24.Application/Features');
if (fs.existsSync(featuresDir)) {
  for (const d of fs.readdirSync(featuresDir, { withFileTypes: true }).filter((x) => x.isDirectory())) {
    const id = `be:feature:${d.name}`;
    addNode(id, d.name, 'Module', path.join(featuresDir, d.name), `Application feature module ${d.name}`);
    addRel('be:project:BR24.Application', 'depends_on', id, `BR24.Application/Features/${d.name}`);
  }
}

// --- Repositories ---
const repoDir = path.join(BE_ROOT, 'BR24.Persistence/Repositories');
for (const f of walk(repoDir, (n) => n.endsWith('Repository.cs') || n === 'UnitOfWork.cs')) {
  const name = path.basename(f, '.cs');
  const id = `be:repository:${name}`;
  addNode(id, name, 'Repository', f, 'Persistence repository');
  addRel('be:project:BR24.Persistence', 'depends_on', id, relPath(f, BE_ROOT));
  if (name !== 'GenericRepository' && name !== 'UnitOfWork') {
    const iface = `I${name}`;
    const ifaceId = `be:repository:${iface}`;
    addNode(ifaceId, iface, 'Repository', path.join(BE_ROOT, 'BR24.Application/Contracts/Persistence', `${iface}.cs`), 'Repository contract');
    addRel(id, 'implements', ifaceId, relPath(f, BE_ROOT));
  }
}

// --- Entities ---
const entDir = path.join(BE_ROOT, 'BR24.Domain/Entities');
const entityFiles = walk(entDir, (n) => n.endsWith('.cs'));
for (const f of entityFiles) {
  const text = fs.readFileSync(f, 'utf8');
  const cm = text.match(/(?:public\s+)?(?:partial\s+)?class\s+(\w+)/);
  const name = cm ? cm[1] : path.basename(f, '.cs');
  const id = `be:entity:${name}`;
  let kind = 'Entity';
  let desc = `Domain entity ${name}`;
  if (/^(temp_|tmp_|tmp)/i.test(name)) desc = `Temp/report-style entity ${name}`;
  if (/^vw_/i.test(name) || /^vw[A-Z]/.test(name)) desc = `View-style entity ${name}`;
  addNode(id, name, 'Entity', f, desc);
  addRel('be:project:BR24.Domain', 'depends_on', id, relPath(f, BE_ROOT));
}

// DbContext maps_to
const dbCtxPath = path.join(BE_ROOT, 'BR24.Persistence/DbContexts/ApplicationDbContext.cs');
if (fs.existsSync(dbCtxPath)) {
  addNode('be:dbcontext:ApplicationDbContext', 'ApplicationDbContext', 'DatabaseObject', dbCtxPath, 'EF Core DbContext; command timeout 7200s');
  addRel('be:project:BR24.Persistence', 'depends_on', 'be:dbcontext:ApplicationDbContext', relPath(dbCtxPath, BE_ROOT));
  const dbText = fs.readFileSync(dbCtxPath, 'utf8');
  for (const m of dbText.matchAll(/DbSet<(\w+)>\s+(\w+)/g)) {
    const ent = m[1];
    const set = m[2];
    const eid = `be:entity:${ent}`;
    addRel('be:dbcontext:ApplicationDbContext', 'maps_to', eid, `DbSet<${ent}> ${set}`);
  }
}

// Write outputs
fs.mkdirSync(OUT_KG, { recursive: true });
fs.mkdirSync(OUT_AI, { recursive: true });

const nodeArr = [...nodes.values()].sort((a, b) => a.id.localeCompare(b.id));
fs.writeFileSync(path.join(OUT_KG, 'nodes.json'), JSON.stringify(nodeArr, null, 2));
fs.writeFileSync(path.join(OUT_KG, 'relationships.json'), JSON.stringify(relationships, null, 2));

// API catalog markdown
let md = `# BR24 API Catalog

Generated from \`BR24.Api/Controllers\`. Exact controller and action names from source.

**Base URL (frontend):** \`window.API_BASE_URL\` (typically includes \`/api\`, e.g. \`https://localhost:44389/api\`).

**Auth:** Most controllers use \`[Authorize]\` (JWT Bearer). Check individual actions for \`[AllowAnonymous]\`.

**Total endpoints extracted:** ${apiCatalog.length}

| Method | Path | Controller | Action | Request params | Response | Auth note |
|--------|------|------------|--------|----------------|----------|-----------|
`;
for (const e of apiCatalog.sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method))) {
  const req = e.request.replace(/\|/g, '\\|').replace(/\n/g, ' ');
  const res = e.response.replace(/\|/g, '\\|');
  md += `| ${e.method} | \`${e.path}\` | ${e.controller} | ${e.action} | \`${req}\` | \`${res}\` | ${e.auth} |\n`;
}
md += `\n## Related business flows\n\n- Many write operations use \`POST .../process\` with a composite Commands VM (create/update/delete command lists).\n- Login JWT issuance: \`LoginController\` actions \`login\`, \`request-otp\`, \`verify-otp\`.\n- Chain/workflow: \`BiznessEventProcessConfiguration\`, \`SA_ChainMenu\`, \`SA_NextEvent\`, \`BiznessEvent_PCTrack\`.\n- Tender/costing: \`ProcurementTender\` including \`getTenderCosting\` / \`processTenderCosting\`.\n- Third-party: \`GlobalAPIController\` GUID-obfuscated routes.\n`;
fs.writeFileSync(path.join(OUT_AI, 'api-catalog.md'), md);

// meta
fs.writeFileSync(
  path.join(OUT_KG, 'extraction-meta.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      feRoot: FE_ROOT,
      beRoot: BE_ROOT,
      nodeCount: nodeArr.length,
      relationshipCount: relationships.length,
      endpointCount: apiCatalog.length,
      entityFileCount: entityFiles.length,
      controllerCount: ctrlFiles.length,
    },
    null,
    2
  )
);

console.log(
  JSON.stringify(
    {
      nodes: nodeArr.length,
      relationships: relationships.length,
      endpoints: apiCatalog.length,
      entities: entityFiles.length,
      controllers: ctrlFiles.length,
    },
    null,
    2
  )
);
