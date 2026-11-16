// One-time installer: preserves the NoteHub project and previous route modal.
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const app = path.join(root, 'app');
const source = path.join(root, 'patch');
if (!fs.existsSync(path.join(root, 'package.json')) || !fs.existsSync(app)) {
  console.error('Extract this ZIP into the existing HW08 project folder first.');
  process.exit(1);
}

const fromNotes = path.join(app, 'notes');
const toNotes = path.join(app, '(private routes)', 'notes');
if (fs.existsSync(fromNotes)) {
  if (fs.existsSync(toNotes)) {
    console.error('Both old and new note folders exist. No changes made.');
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(toNotes), { recursive: true });
  fs.renameSync(fromNotes, toNotes);
  console.log('Moved existing notes pages to app/(private routes)/notes');
} else if (!fs.existsSync(toNotes)) {
  console.error('Cannot find the HW08 notes folder. No changes made.');
  process.exit(1);
}

function copyFiles(fromDir, targetDir) {
  for (const entry of fs.readdirSync(fromDir, { withFileTypes: true })) {
    const from = path.join(fromDir, entry.name);
    const to = path.join(targetDir, entry.name);
    if (entry.isDirectory()) { fs.mkdirSync(to, { recursive: true }); copyFiles(from, to); }
    else fs.copyFileSync(from, to);
  }
}
copyFiles(source, root);

// Old pages remain intact. Only imports are switched from legacy token API.
for (const top of ['app', 'components']) {
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const target = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(target); continue; }
      if (!/\.(tsx?|jsx?)$/.test(entry.name)) continue;
      if (target.includes(path.join('app', 'api'))) continue;
      let body = fs.readFileSync(target, 'utf8');
      if (!body.includes('@/lib/api') && !body.includes("from '../../../lib/api'")) continue;
      const isClient = /^\s*['"]use client['"]/.test(body);
      const newModule = isClient ? '@/lib/api/clientApi' : '@/lib/api/serverApi';
      const updated = body
        .replace(/(['"])@\/lib\/api\1/g, `'${newModule}'`)
        .replace(/(['"])@\/lib\/api\/clientApi\1/g, "'@/lib/api/clientApi'")
        .replace(/(['"])@\/lib\/api\/serverApi\1/g, "'@/lib/api/serverApi'");
      if (updated !== body) fs.writeFileSync(target, updated);
    }
  };
  walk(path.join(root, top));
}

const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.dependencies = { ...(pkg.dependencies ?? {}), cookie: '^1.1.1', zustand: '^5.0.8' };
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// Preserve user's existing .env.local (not committed). Only update URL if necessary.
const env = path.join(root, '.env.local');
if (fs.existsSync(env)) {
  let val = fs.readFileSync(env, 'utf8');
  if (!/^\s*NEXT_PUBLIC_API_URL=/m.test(val)) val += '\nNEXT_PUBLIC_API_URL=http://localhost:3000\n';
  fs.writeFileSync(env, val);
} else {
  fs.writeFileSync(env, 'NEXT_PUBLIC_API_URL=http://localhost:3000\n');
}
console.log('HW09 installed. Original app/@modal and .env.local preserved.');
