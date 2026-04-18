const tls = require('tls');

const options = {
    host: 'smtp.163.com',
    port: 465,
    rejectUnauthorized: false
};

const socket = tls.connect(options, () => {
    console.log('CONNECTED');
});

let response = '';
socket.setEncoding('utf8');

socket.on('data', (data) => {
    response += data;
    console.log('S:', data.trim());
    if (data.includes('220')) {
        socket.write('EHLO test\r\n');
    }
    if (data.includes('250')) {
        socket.write('AUTH LOGIN\r\n');
    }
    if (response.includes('334')) {
        const creds = process.argv[1]; // base64 username
        socket.write(Buffer.from('13510221939@163.com').toString('base64') + '\r\n');
    }
});

socket.on('data', (data) => {
    const lines = data.split('\r\n');
    for (const line of lines) {
        if (line.includes('334')) {
            console.log('AUTH username prompt');
            socket.write(Buffer.from('13510221939@163.com').toString('base64') + '\r\n');
        } else if (line.trim() && !line.includes('250') && !line.includes('220') && !line.includes('EHLO')) {
            if (line.includes('334')) {
                // Password prompt
            } else if (line.includes('235') || line.includes('Authentication successful')) {
                console.log('AUTH OK');
            } else if (line.includes('535')) {
                console.log('AUTH FAIL: ' + line);
            }
        }
    }
});

socket.on('close', () => {
    console.log('CLOSED');
});

socket.on('error', (e) => {
    console.log('ERROR:', e.message);
});

setTimeout(() => {
    console.log('TIMEOUT');
    socket.destroy();
    process.exit(0);
}, 15000);
