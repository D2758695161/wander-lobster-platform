const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = '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';
const OWNER = 'D2758695161';
const REPO = 'bounty-hunter-kit';
const BASE = 'C:/Users/Administrator/.openclaw/workspace/bounty-hunter-kit';

function api(method, urlPath, body) {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : undefined;
        const opts = {
            hostname: 'api.github.com',
            path: urlPath,
            method,
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'yitong'
            }
        };
        if (data) opts.headers['Content-Length'] = Buffer.byteLength(data);
        
        const req = https.request(opts, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => {
                try { resolve(JSON.parse(d)); }
                catch { resolve(d); }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function uploadFile(relPath, content) {
    const absPath = path.join(BASE, relPath);
    if (!fs.existsSync(absPath)) {
        console.log('[SKIP]', relPath, '- not found');
        return;
    }
    
    const data = fs.readFileSync(absPath);
    const base64 = data.toString('base64');
    
    let sha = null;
    try {
        const ex = await api('GET', `/repos/${OWNER}/${REPO}/contents/${relPath}`);
        if (ex.sha) sha = ex.sha;
    } catch {}
    
    const body = { message: `Add ${relPath}`, content: base64 };
    if (sha) body.sha = sha;
    
    const r = await api('PUT', `/repos/${OWNER}/${REPO}/contents/${relPath}`, body);
    if (r.content) console.log('[OK]', relPath);
    else if (r.message) console.log('[FAIL]', relPath, ':', r.message.substring(0, 80));
}

async function main() {
    const files = [];
    const walk = (dir, prefix = '') => {
        fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
            const fp = path.join(dir, e.name);
            const rp = path.join(prefix, e.name);
            if (e.isFile()) files.push({ abs: fp, rel: rp });
            else if (e.isDirectory() && e.name !== 'node_modules') walk(fp, rp);
        });
    };
    
    walk(BASE);
    console.log(`Uploading ${files.length} files...`);
    
    for (const f of files) {
        await uploadFile(f.rel.replace(/\\/g, '/'), f.abs);
        await new Promise(r => setTimeout(r, 200));
    }
    console.log('\nDone!');
}

main().catch(console.error);
