/**
 * Convert inline style/sx px sizes → rem so they track html { font-size: 80% }.
 *
 * - '12px' / "12px" on size props → rem
 * - Bare numbers only where MUI treats them as px (NOT spacing units)
 * - Tailwind arbitrary [12px] → [0.75rem]
 *
 * Skips non-CSS numeric configs (re-run guards: already-rem, tsparticles density).
 *
 * Usage: node docs/scripts/convert-inline-px-to-rem.mjs [--dry]
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('src/presentation');
const DRY = process.argv.includes('--dry');

const PX_STRING_PROPS = [
  'fontSize',
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingInline',
  'paddingBlock',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginInline',
  'marginBlock',
  'gap',
  'rowGap',
  'columnGap',
  'top',
  'left',
  'right',
  'bottom',
  'letterSpacing',
  'lineHeight',
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
];

const BARE_PX_PROPS = [
  'fontSize',
  'letterSpacing',
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'top',
  'left',
  'right',
  'bottom',
];

function pxToRem(px) {
  const n = Number(px);
  if (!Number.isFinite(n)) return null;
  if (n === 0) return null; // leave 0 as numeric 0 — never stringify for non-CSS configs
  if (Math.abs(n) > 0 && Math.abs(n) < 1.5) return `${n}px`;
  const rem = n / 16;
  const s = Number(rem.toFixed(4)).toString();
  return `${s}rem`;
}

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === 'dist') continue;
      walk(p, out);
    } else if (/\.(tsx|jsx)$/.test(ent.name)) {
      out.push(p);
    }
  }
  return out;
}

function convertFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  for (const prop of PX_STRING_PROPS) {
    const re = new RegExp(
      `(${prop}\\s*:\\s*)(['"\`])(\\d+(?:\\.\\d+)?)px\\2`,
      'g'
    );
    src = src.replace(re, (full, prefix, quote, num) => {
      const rem = pxToRem(num);
      if (!rem || rem.endsWith('px')) return full;
      changes += 1;
      return `${prefix}${quote}${rem}${quote}`;
    });
  }

  for (const prop of BARE_PX_PROPS) {
    const re = new RegExp(
      `(${prop}\\s*:\\s*)(\\d+(?:\\.\\d+)?)(?!\\s*[a-zA-Z%]|\\.|\\d)`,
      'g'
    );
    src = src.replace(re, (full, prefix, num) => {
      const n = Number(num);
      if (prop === 'fontSize' && !Number.isInteger(n)) return full;
      if (n > 96 && prop === 'fontSize') return full;
      // Skip tsparticles / canvas density-like dimensions
      if ((prop === 'width' || prop === 'height') && (n === 1920 || n === 1080)) {
        return full;
      }
      if (n > 2000) return full;
      if (n > 0 && n < 3 && prop !== 'fontSize' && prop !== 'letterSpacing') {
        return full;
      }
      const rem = pxToRem(num);
      if (!rem || rem.endsWith('px')) return full;
      changes += 1;
      return `${prefix}'${rem}'`;
    });
  }

  src = src.replace(/(\[)(\d+(?:\.\d+)?)px(\])/g, (full, open, num, close) => {
    const rem = pxToRem(num);
    if (!rem || rem.endsWith('px')) return full;
    changes += 1;
    return `${open}${rem}${close}`;
  });

  if (changes > 0 && !DRY) {
    fs.writeFileSync(filePath, src, 'utf8');
  }
  return { filePath, changes };
}

const files = walk(ROOT);
let totalChanges = 0;
let filesChanged = 0;
const sample = [];

for (const f of files) {
  const r = convertFile(f);
  if (r.changes > 0) {
    filesChanged += 1;
    totalChanges += r.changes;
    if (sample.length < 20) {
      sample.push(`${path.relative(process.cwd(), f)}: ${r.changes}`);
    }
  }
}

console.log(DRY ? '[DRY RUN]' : '[APPLIED]');
console.log(`Files changed: ${filesChanged}`);
console.log(`Replacements: ${totalChanges}`);
console.log('Sample:');
sample.forEach((s) => console.log(' ', s));
