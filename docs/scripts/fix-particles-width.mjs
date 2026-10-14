import fs from 'fs';

const files = [
  'ForgotPasswordCompanyLocationSelect.tsx',
  'LoginPasswordLayer copy.tsx',
  'LoginPasswordLayer.tsx',
  'LoginUsernameLayer copy.tsx',
  'LoginUsernameLayer.tsx',
  'ResetPassword.tsx',
  'SecretQuestion.tsx',
].map((f) => `src/presentation/pages/Login/${f}`);

for (const f of files) {
  let t = fs.readFileSync(f, 'utf8');
  const o = t;
  // tsparticles config uses numeric width, not CSS rem
  t = t.replace(/width:\s*'0'/g, 'width: 0');
  if (t !== o) {
    fs.writeFileSync(f, t);
    console.log('fixed', f);
  }
}
