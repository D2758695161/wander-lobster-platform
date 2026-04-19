const nodemailer = require('nodemailer');

const codes = ['DKpWFJySX2RjTCQc', 'FYU6WwPKjeUnMtpE'];
const ports = [465, 587];

async function testConfig(host, port, secure, code) {
  try {
    const transporter = nodemailer.createTransport({
      host, port, secure,
      auth: { user: '13510221939@163.com', pass: code }
    });
    await transporter.verify();
    console.log('WORKS:', host, port, secure, code);
    return true;
  } catch(e) {
    console.log('FAIL:', host, port, secure, code, '-', e.message.split('\n')[0]);
    return false;
  }
}

async function main() {
  for (const port of ports) {
    for (const code of codes) {
      await testConfig('smtp.163.com', port, port === 465, code);
    }
  }
}

main().catch(console.error);
