const https = require('https');
const t = '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';
const OWNER = 'D2758695161';
const REPO = 'FunWebGames';
const BRANCH = 'main';
const BASE = `https://api.github.com/repos/${OWNER}/${REPO}`;

function api(path) {
  return new Promise((resolve, reject) => {
    const req = https.request({ hostname: 'api.github.com', path, method: 'GET', headers: { 'Authorization': 'Bearer ' + t, 'User-Agent': 'agent' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(null); } });
    });
    req.on('error', reject);
    req.end();
  });
}

function pushFile(filePath, content, sha, commitMsg) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      message: commitMsg,
      content: Buffer.from(content).toString('base64'),
      branch: BRANCH,
      sha: sha
    });
    const req = https.request({
      hostname: 'api.github.com',
      path: `${BASE}/contents/${filePath}`,
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + t, 'User-Agent': 'agent', 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(d) }); }
        catch(e) { resolve({ status: res.statusCode, data: d.substring(0, 100) }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  // Get index.html
  const file = await api(`${BASE}/contents/index.html?ref=${BRANCH}`);
  if (!file) { console.log('Failed to get index.html'); return; }
  
  let content = Buffer.from(file.content, 'base64').toString('utf8');
  
  // Add help-modal.js after sound-toggle.js
  const OLD = '<script src="js/sound-toggle.js"></script>';
  const NEW = '<script src="js/sound-toggle.js"></script>\n    <script src="js/help-modal.js"></script>';
  
  if (!content.includes(OLD)) { console.log('sound-toggle.js tag NOT FOUND'); return; }
  if (content.includes('help-modal.js')) { console.log('help-modal.js already in index.html'); return; }
  
  content = content.replace(OLD, NEW);
  
  const r = await pushFile('index.html', content, file.sha, 'feat: add help-modal.js to index.html (#21)\n\nLoads help-modal.js so HelpModal.show() works in games.\nAddresses issue TechGuyTest/FunWebGames#21');
  
  if (r.status === 200 || r.status === 201) {
    console.log('index.html updated OK');
    // Create PR from fork main to original main
    const prBody = JSON.stringify({
      title: 'feat: Add Help/Tutorial Modal system to all games (#21)',
      head: OWNER + ':' + BRANCH,
      base: 'main',
      body: '## Summary\n\nAdds **help-modal.js** to index.html, enabling the HelpModal tutorial system in all 10 games.\n\n### Changes\n- \`index.html\` - Added `<script src="js/help-modal.js"></script>`\n- Games can now call `HelpModal.show(gameId, emoji, instructions)` to show child-friendly instructions\n- First-time visits stored in localStorage so help only shows once per game\n\n### Related\n- Fixes TechGuyTest/FunWebGames#21\n\n---\n*一筒 AI Agent*'
    });
    
    const prReq = https.request({
      hostname: 'api.github.com',
      path: '/repos/TechGuyTest/FunWebGames/pulls',
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + t, 'User-Agent': 'agent', 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(prBody) }
    }, prRes => {
      let d = '';
      prRes.on('data', c => d += c);
      prRes.on('end', () => {
        try {
          const pr = JSON.parse(d);
          if (pr.number) {
            console.log('PR Created: https://github.com/TechGuyTest/FunWebGames/pull/' + pr.number);
          } else if (pr.errors && pr.errors[0].code === 'custom') {
            console.log('PR already exists (D2758695161:main)');
          } else {
            console.log('PR status:', pr.message || JSON.stringify(pr).substring(0, 100));
          }
        } catch(e) { console.log('PR parse error:', d.substring(0, 100)); }
      });
    });
    prReq.on('error', e => console.log('PR ERR:', e.message));
    prReq.write(prBody);
    prReq.end();
  } else {
    console.log('Push failed:', r.status, r.data.message || '');
  }
}

main().catch(e => console.log('ERR:', e.message));
