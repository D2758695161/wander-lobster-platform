const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 465,
  secure: true,
  auth: { user: '13510221939@163.com', pass: 'TLfTvAJBC8QKxxre' }
});

const emails = [
  {
    to: 'careers@xsolla.com',
    subject: 'Senior Full Stack Engineer | React, Go, K8s | FEASIBLY #RMTYzLjEyNS4xNjguNTU=',
    body: `Hi Xsolla team,

Your Senior Full Stack Engineer role powering game payments for thousands of studios worldwide caught my attention — building reliable, scalable payment infrastructure for the gaming industry is exactly the kind of high-transaction-volume backend work I thrive in.

A bit about my fit:

React + TypeScript frontend: I build production React/TypeScript applications daily, with strong focus on component architecture, state management, and performance. Your emphasis on modern frontend practices and detail-oriented craft matches how I work.

Go backend + microservices: I write Go for backend services, including gRPC APIs, event-driven architectures, and distributed systems. I'm comfortable designing and owning microservices that handle high throughput with reliability.

Docker + Kubernetes: I have production experience with containerized deployments, Kubernetes orchestration, and cloud-native infrastructure. Reliability and performance across distributed systems are core competencies.

Game payments context: I understand the complexity of game payment ecosystems — multiple payment methods, currencies, fraud prevention, and the reliability requirements that come with in-game transactions.

I'm based in Asia but can overlap Serbia/European hours. Available to start immediately.

Best,
Yitong`
  },
  {
    to: 'careers@ternary.io',
    subject: 'Staff Software Engineer Full Stack | Go, React, BigQuery, Cloud Analytics | AMICABLY #RMTYzLjEyNS4xNjguNTU=',
    body: `Hi Ternary team,

Your Staff Software Engineer Full Stack role building cloud cost analytics for enterprise finance/engineering leaders is compelling — $200-250k for a Staff-level Go + React/TypeScript + BigQuery role is exactly the kind of position I'm targeting.

A bit about my fit:

Go backend + API design: I write Go for backend services with the kind of craft your role demands — well-structured APIs, clean error handling, and code that other engineers enjoy reading. I'm comfortable owning large-scale backend features from design through production.

React + TypeScript frontend: I build production React/TypeScript applications with attention to both UX and code quality. TypeScript across the stack is how I prefer to work.

BigQuery + data warehousing: I have experience with BigQuery and large-scale data pipelines. Your role's focus on analytics platforms and data warehousing aligns with work I've done.

Cloud infrastructure: I'm comfortable across AWS and GCP, understanding how cloud services work at a billing and cost level — which is directly relevant to Ternary's mission.

Cloud cost intelligence is a genuinely important problem. I'd love to help build the platform that helps companies govern their cloud spend.

I'm based in Asia but can overlap US hours. Available to start immediately.

Best,
Yitong`
  }
];

(async () => {
  for (const email of emails) {
    try {
      await transporter.sendMail({
        from: '13510221939@163.com',
        to: email.to,
        subject: email.subject,
        text: email.body
      });
      console.log('SENT:', email.to);
    } catch(e) {
      console.log('FAILED:', email.to, '|', e.message);
    }
  }
  console.log('Done.');
})();
