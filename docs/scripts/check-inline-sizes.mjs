import fs from 'fs';
import path from 'path';

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === 'dist') continue;
      walk(p, a);
    } else if (/\.(tsx|jsx)$/.test(e.name)) a.push(p);
  }
  return a;
}

const files = walk('src/presentation');
let bareFont = 0;
let pxBracket = 0;
let fontRem = 0;
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  bareFont += (t.match(/fontSize:\s*\d+(?!\.)/g) || []).length;
  pxBracket += (t.match(/\[\d+(?:\.\d+)?px\]/g) || []).length;
  fontRem += (t.match(/fontSize:\s*'[\d.]+rem'/g) || []).length;
}
console.log({ bareFont, pxBracket, fontRem });
