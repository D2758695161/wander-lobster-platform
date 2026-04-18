const token = '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';
const owner = 'D2758695161';
const repo = 'wander-lobster-platform';
const outDir = require('path').join(__dirname, 'out');
const fs = require('fs');
const path = require('path');

const CONCURRENCY = 10;
const MAX_SIZE = 1024 * 1024;

async function getFiles(dir) {
  const files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      files.push(...await getFiles(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function uploadFile(filePath) {
  const relativePath = path.relative(outDir, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath);
  const contentBase64 = content.toString('base64');
  const size = content.length;

  if (size > MAX_SIZE) {
    console.log(`[SKIP LARGE] ${relativePath}`);
    return { path: relativePath, skipped: true };
  }

  let sha = null;
  try {
    const existing = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${relativePath}`, {
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
    }).then(r => r.json());
    if (existing.sha) sha = existing.sha;
  } catch {}

  const body = { message: `Deploy: update landing page + bounties [${new Date().toISOString().slice(0,10)}]`, content: contentBase64 };
  if (sha) body.sha = sha;

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${relativePath}`, {
    method: 'PUT',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    return { path: relativePath, ok: true };
  } else {
    const err = await res.text();
    return { path: relativePath, ok: false, error: err };
  }
}

async function run() {
  const allFiles = await getFiles(outDir);
  const total = allFiles.length;
  console.log(`Found ${total} files to upload`);

  let done = 0;
  let ok = 0;
  let fail = 0;
  let skip = 0;

  // Process in batches
  for (let i = 0; i < total; i += CONCURRENCY) {
    const batch = allFiles.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(uploadFile));
    for (const r of results) {
      done++;
      if (r.skipped) { skip++; console.log(`[SKIP] ${r.path}`); }
      else if (r.ok) { ok++; console.log(`[${done}/${total}] OK ${r.path}`); }
      else { fail++; console.log(`[FAIL] ${r.path}: ${r.error}`); }
    }
    console.log(`Progress: ${done}/${total} | OK:${ok} FAIL:${fail} SKIP:${skip}`);
  }

  console.log(`\nDone! OK:${ok} FAIL:${fail} SKIP:${skip}`);
  console.log(`Site: https://d2758695161.github.io/wander-lobster-platform/`);
}

run().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
