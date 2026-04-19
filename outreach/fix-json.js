const fs = require('fs');
const path = 'C:\\Users\\Administrator\\.openclaw\\workspace\\outreach\\intl-leads.json';
let d = fs.readFileSync(path, 'utf8');

// Fix: replace U+FFFD (replacement character) with \uFFFD escape
// Also escape any other invalid characters

let result = '';
for (let i = 0; i < d.length; i++) {
  const code = d.charCodeAt(i);
  if (code === 0xFFFD) {
    result += '\\uFFFD';
    continue;
  }
  // Escape special chars in strings
  if (code <= 0x1F && code !== 9) {
    // Control chars (except tab): escape as \uXXXX
    result += '\\u' + code.toString(16).padStart(4, '0');
    continue;
  }
  result += d[i];
}

fs.writeFileSync(path, result);

try {
  JSON.parse(result);
  console.log('JSON VALID! Length:', result.length);
} catch(e) {
  console.log('JSON INVALID:', e.message);
  const m = e.message.match(/position (\d+)/);
  if (m) {
    const pos = parseInt(m[1]);
    console.log('Around error:', JSON.stringify(result.substring(Math.max(0,pos-30), pos+30)));
  }
}
