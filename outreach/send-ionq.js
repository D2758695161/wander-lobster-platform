const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 465,
  secure: true,
  auth: { user: '13510221939@163.com', pass: 'TLfTvAJBC8QKxxre' }
});

const emails = [
  {
    to: 'careers@ionq.com',
    subject: 'Senior IAM Engineer | Identity Platform + Cloud Security + Automation | DAUNTLESS #RMTYzLjEyNS4xNjguNTU=',
    body: `Hi IonQ team,

Your Senior IAM Engineer posting for quantum computing infrastructure caught my attention — identity platform engineering + cloud security + Python automation at a quantum computing company is a compelling combination.

A bit about my fit:
- Identity/SSO: SAML, OAuth2, OIDC, LDAP integration patterns for platform identity
- Cloud security: AWS IAM policies, RBAC, least-privilege design, security hardening
- Python automation: IAM policy-as-code, automated access reviews, audit logging
- Security engineering mindset: threat modeling, access control design, zero-trust patterns
- Cloud-native platform work: container identity, service accounts, workload identity

IonQ's quantum computing mission is extraordinary — the infrastructure you build today directly enables breakthroughs in drug discovery, materials science, and optimization. The intersection of cutting-edge compute and security-sensitive workloads is exactly where I do my best work.

I'm based in Asia but can overlap US Pacific hours. Can we chat this week?

Best,
Yitong

DAUNTLESS #RMTYzLjEyNS4xNjguNTU=`
  }
];

emails.forEach(e => {
  transporter.sendMail({ from: '13510221939@163.com', to: e.to, subject: e.subject, body: e.body }, (err, info) => {
    if (err) console.log('ERROR:', e.to, err.message);
    else console.log('SENT:', e.to, info.response);
  });
});
