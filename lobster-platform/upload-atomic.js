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

async function createBlob(filePath) {
  const content = fs.readFileSync(filePath);
  const encoded = content.toString('base64');
  const relativePath = path.relative(outDir, filePath).replace(/\\/g, '/');

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
    method: 'POST',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/vnd.github.v3+json' },
    body: JSON.stringify({ content: encoded, encoding: 'base64' })
  });
  const blob = await res.json();
  if (!res.ok) {
    console.log(`[BLOB FAIL] ${relativePath}: ${JSON.stringify(blob)}`);
    return null;
  }
  return { path: relativePath, sha: blob.sha, mode: '100644', type: 'blob' };
}

async function run() {
  // 1. Get current main SHA
  const mainRef = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/main`, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
  }).then(r => r.json());
  const baseSha = mainRef.object.sha;
  console.log('Base SHA:', baseSha);

  // 2. Get current commit tree SHA
  const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits/${baseSha}`, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
  });
  const baseCommit = await commitRes.json();
  const baseTreeSha = baseCommit.tree.sha;
  console.log('Base tree SHA:', baseTreeSha);

  // 3. Collect all files
  const allFiles = await getFiles(outDir);
  const smallFiles = allFiles.filter(f => {
    const size = fs.statSync(f).size;
    return size <= MAX_SIZE;
  });
  console.log(`Total files: ${allFiles.length}, small enough: ${smallFiles.length}`);

  // 4. Create all blobs in parallel
  const blobs = [];
  for (let i = 0; i < smallFiles.length; i += CONCURRENCY) {
    const batch = smallFiles.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(createBlob));
    blobs.push(...results.filter(Boolean));
    console.log(`Blobs: ${i + batch.length}/${smallFiles.length}`);
  }
  console.log(`Created ${blobs.length} blobs`);

  // 5. Create new tree
  const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/vnd.github.v3+json' },
    body: JSON.stringify({ tree: blobs, base_tree: baseTreeSha })
  });
  const newTree = await treeRes.json();
  console.log('New tree:', newTree.sha);

  // 6. Create commit
  const dateStr = new Date().toISOString().slice(0, 10);
  const commitRes2 = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/vnd.github.v3+json' },
    body: JSON.stringify({
      message: `Deploy: landing page v2 [${dateStr}]`,
      tree: newTree.sha,
      parents: [baseSha]
    })
  });
  const newCommit = await commitRes2.json();
  if (!commitRes2.ok) {
    console.error('Commit failed:', JSON.stringify(newCommit));
    process.exit(1);
  }
  console.log('New commit:', newCommit.sha);

  // 7. Update main ref
  await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`, {
    method: 'PATCH',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/vnd.github.v3+json' },
    body: JSON.stringify({ sha: newCommit.sha })
  });

  console.log(`\n✅ Deployed ${blobs.length} files!`);
  console.log(`Site: https://d2758695161.github.io/wander-lobster-platform/`);
}

run().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
