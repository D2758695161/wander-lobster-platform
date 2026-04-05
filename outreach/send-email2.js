const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 587,
    secure: false,
    auth: {
        user: '13510221939@163.com',
        pass: process.argv[2]
    },
    connectionTimeout: 10000
});

const mailOptions = {
    from: '"Yitong" <13510221939@163.com>',
    to: process.argv[3],
    subject: process.argv[4],
    text: process.argv[5]
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.log('ERROR: ' + err.message);
    } else {
        console.log('SENT OK: ' + info.response);
    }
});
