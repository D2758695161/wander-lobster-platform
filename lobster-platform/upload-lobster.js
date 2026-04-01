const token = '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';
const owner = 'D2758695161';
const repo = 'wander-lobster-platform';
const outDir = './out';
const fs = require('fs');
const path = require('path');

async function uploadFile(filePath, content) {
  const relativePath = path.relative(outDir, filePath).replace(/\\/g, '/');
  const contentBase64 = Buffer.from(content).toString('base64');

  let sha = null;
  try {
    const existing = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${relativePath}`, {
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
    }).then(r => r.json());
    if (existing.sha) sha = existing.sha;
  } catch {}

  const body = { message: `Update ${relativePath}`, content: contentBase64 };
  if (sha) body.sha = sha;

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${relativePath}`, {
    method: 'PUT',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    console.log(`[OK] ${relativePath}`);
  } else {
    const err = await res.text();
    console.log(`[FAIL] ${relativePath}: ${err}`);
  }
}

async function run() {
  const files = [];
  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) walk(full);
      else files.push(full);
    }
  }
  walk(outDir);

  for (const file of files) {
    const content = fs.readFileSync(file);
    await uploadFile(file, content);
  }
  console.log(`\nDone! ${files.length} files uploaded.`);
  console.log('Site: https://d2758695161.github.io/wander-lobster-platform/');
}

run().catch(console.error);
