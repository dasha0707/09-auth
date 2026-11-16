// Apply the focused HW09 corrections on top of the existing project.
// Does not delete pages or alter .env.local, app/@modal, notes or user content.
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const fixDir = path.join(root, 'fix');
if (!fs.existsSync(path.join(root, 'package.json')) || !fs.existsSync(path.join(root, 'app'))) {
  console.error('ERROR: Extract into the existing 09-auth folder (next to package.json).');
  process.exit(1);
}
if (!fs.existsSync(fixDir)) {
  console.error('ERROR: The fix folder must be copied next to this script.');
  process.exit(1);
}
const contents = [
  'app/api/auth/register/route.ts',
  'app/api/auth/login/route.ts',
  'app/api/auth/logout/route.ts',
  'app/api/auth/session/route.ts',
  'app/api/notes/route.ts',
  'app/api/notes/[id]/route.ts',
  'app/api/users/me/route.ts',
  'lib/api/serverApi.ts',
  'proxy.ts',
  'app/(auth routes)/layout.tsx',
  'app/(private routes)/profile/edit/page.tsx',
];
let updated = 0;
for (const relative of contents) {
  const source = path.join(fixDir, relative);
  const destination = path.join(root, relative);
  if (!fs.existsSync(source) || !fs.existsSync(destination)) {
    console.error(`ERROR: Missing existing or patch file: ${relative}. No other files will be removed.`);
    process.exit(1);
  }
}
for (const relative of contents) {
  fs.copyFileSync(path.join(fixDir, relative), path.join(root, relative));
  updated += 1;
}
// This exact file, and ONLY this file, was explicitly rejected by the grader.
const legacyApi = path.join(root, 'lib', 'api.ts');
if (fs.existsSync(legacyApi)) {
  fs.rmSync(legacyApi);
  console.log('Removed obsolete lib/api.ts (explicit grader requirement).');
}
console.log(`Applied ${updated} corrected files; notes, @modal and .env.local untouched.`);
