// Post-build: restructure flat HTML files to subdirectory/index.html for clean GitHub Pages URLs
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'out');

function restructureDir(basename) {
  const flatHtml = path.join(outDir, basename + '.html');
  const flatTxt = path.join(outDir, basename + '.txt');
  const dirPath = path.join(outDir, basename);

  if (!fs.existsSync(flatHtml)) {
    console.log('[postbuild] ' + basename + '.html not found, skipping');
    return;
  }

  fs.mkdirSync(dirPath, { recursive: true });

  let html = fs.readFileSync(flatHtml, 'utf8');
  // Replace all references to /basename.html with /basename
  html = html.replace(new RegExp('/' + basename + '\\.html"', 'g'), '/' + basename + '"');
  html = html.replace(new RegExp('/' + basename + '\\.html#', 'g'), '/' + basename + '#');
  html = html.replace(new RegExp('href="/' + basename + '\\.html"', 'g'), 'href="/' + basename + '"');
  html = html.replace(new RegExp('"\\/' + basename + '\\.html"', 'g'), '"/' + basename + '"');

  fs.writeFileSync(path.join(dirPath, 'index.html'), html);
  console.log('[postbuild] Created ' + basename + '/index.html');

  if (fs.existsSync(flatTxt)) {
    let txt = fs.readFileSync(flatTxt, 'utf8');
    txt = txt.replace(new RegExp('/' + basename + '\\.html', 'g'), '/' + basename);
    fs.writeFileSync(path.join(dirPath, 'index.txt'), txt);
    console.log('[postbuild] Created ' + basename + '/index.txt');
    fs.unlinkSync(flatTxt);
  }

  fs.unlinkSync(flatHtml);
  console.log('[postbuild] Removed flat ' + basename + '.html');
}

// Handle all app directory routes
restructureDir('tasks');
restructureDir('marketing');

console.log('[postbuild] Done');
