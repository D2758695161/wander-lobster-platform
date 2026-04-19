const https = require('https');
const fs = require('fs');

// Try the API endpoint
const url = 'https://api.proginn.com/project/list';
const postData = JSON.stringify({
  page: 1,
  pageSize: 20,
  tag: ''
});

const options = {
  hostname: 'api.proginn.com',
  path: '/project/list',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
    'Referer': 'https://job.proginn.com/project/list',
    'Origin': 'https://job.proginn.com'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('DATA:', data.substring(0, 3000));
    fs.writeFileSync('C:\\Users\\Administrator\\.openclaw\\workspace\\outreach\\proginn-api-response.json', data);
  });
});
req.on('error', e => console.error('ERROR:', e.message));
req.write(postData);
req.end();
