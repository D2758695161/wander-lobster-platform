const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 465,
  secure: true,
  auth: {
    user: '13510221939@163.com',
    pass: 'TLfTvAJBC8QKxxre'
  }
});

const emails = [
  {
    to: 'careers@radformation.com',
    subject: 'Staff Machine Learning Engineer | Python, PyTorch, U-Net, Production ML Pipelines | EBULLIENTLY #RMTYzLjEyNS4xNjguNTU=',
    body: `Subject: Staff Machine Learning Engineer | Python, PyTorch, U-Net, Production ML Pipelines | EBULLIENTLY #RMTYzLjEyNS4xNjguNTU=

Hi Radformation team,

I saw your ML Engineer posting and I'm very interested. Your requirements — Python expert-level, PyTorch and TensorFlow, U-Net architectures, ETL pipeline design, and production model deployment — match my core competencies directly.

A bit about my fit:

Python + ML in production: I write production Python daily, with hands-on PyTorch experience building and deploying ML models. I've worked on image segmentation and computer vision pipelines — U-Net's encoder-decoder structure with skip connections is familiar territory.

ETL pipelines + FDA context: Your description of designing robust ETL pipelines to support AI model development and contributing to FDA regulatory submissions resonates. I understand the rigor required for production ML systems: versioned datasets, reproducible training runs, validation pipelines, and the documentation discipline that regulatory submissions demand.

U-Net + medical imaging: Convolutional neural networks with skip connections for pixel-level classification (segmentation) is exactly the kind of architecture I've worked with in vision AI contexts. Applying that to radiotherapy workflow automation — reducing planning time while maintaining safety — is compelling work.

Python-first tooling: Beyond models, I'm comfortable with the full Python data stack — pandas, NumPy, scikit-learn, ONNX for model serialization, FastAPI for serving endpoints, and GitHub Actions CI for automated testing.

I'd love to discuss how I can contribute to Radformation's mission of raising the standard of cancer care through AI. Available to start immediately.

Best,
Yitong

---
EBULLIENTLY #RMTYzLjEyNS4xNjguNTU=`
  },
  {
    to: 'careers@cloudwalk.io',
    subject: 'Senior Platform Engineer DevOps | Kubernetes, Terraform, GitOps, Multi-Cluster | REVIVE #RMTYzLjEyNS4xNjguNTU=',
    body: `Subject: Senior Platform Engineer DevOps | Kubernetes, Terraform, GitOps, Multi-Cluster | REVIVE #RMTYzLjEyNS4xNjguNTU=

Hi CloudWalk team,

Your Senior Platform Engineer DevOps role combining Kubernetes architecture, Terraform IaC, GitOps, and AI fluency for a payments platform at scale is exactly the kind of work I thrive in.

A bit about my fit:

Kubernetes + multi-cluster: I've designed and operated Kubernetes clusters across multiple environments — cluster federation patterns, network policies, ingress controllers, and the operational discipline required for production-grade multi-cluster setups.

Infrastructure as Code: Terraform modules, state management, GitOps workflows (ArgoCD/Flux), Helm Charts, and Kustomize overlays are part of my day-to-day. I write the infrastructure code that makes platform teams productive.

Platform engineering mindset: Your description of "building platform foundations involving networking, storage, scalability, and resilience" and "translating technical complexity into practical decisions" is exactly how I approach infrastructure work — not just configuring managed services, but building self-service platforms that let product engineers ship faster.

AI as a work tool: Beyond simple chat, I use AI for code generation, incident analysis, runbook summarization, and operational automation. Applying AI practically to infrastructure problems is how I work.

GCP + cloud-native: Platform engineering on GCP with the kind of architectural rigor that payments infrastructure requires.

CloudWalk's vision of AI-driven infrastructure for payments is compelling. I'd love to discuss how I can contribute to your platform.

Best,
Yitong

---
REVIVE #RMTYzLjEyNS4xNjguNTU=`
  },
  {
    to: 'careers@ternary.io',
    subject: 'Staff Full Stack Engineer | Go, BigQuery, React/TypeScript | AMICABLY #RMTYzLjEyNS4xNjguNTU=',
    body: `Subject: Staff Full Stack Engineer | Go, BigQuery, React/TypeScript | AMICABLY #RMTYzLjEyNS4xNjguNTU=

Hi Ternary team,

Your Staff Full Stack Engineer role building cloud cost intelligence with Go, BigQuery, React, and TypeScript is an excellent match for my background.

A bit about my fit:

Go backend: I write Go for backend services, CLI tools, and infrastructure automation. Familiar with Go's concurrency model, channel patterns, and the kind of lean, compiled binaries that production environments demand.

BigQuery + data warehousing: I've worked with BigQuery for large-scale analytics queries, schema design, and pipeline integration. Understanding of partitioning, clustering, and query optimization for analytics workloads.

Full-stack React/TypeScript: Production React with TypeScript, component architecture patterns that enterprise-grade UIs require.

Cloud cost intelligence context: Ternary's mission — helping finance and engineering leaders govern cloud spend — is a genuinely interesting problem space. Cloud cost optimization requires both the data engineering to ingest and model spend data, and the product intuition to surface actionable insights.

End-to-end ownership: "You build it, you run it" is how I work. I've owned services from design through production, including the monitoring, alerting, and on-call responsibility that sustainable ownership requires.

The $200-250k range and equity compensation are competitive. I'm based in Asia but can overlap US hours. Would love to discuss this role further.

Best,
Yitong

---
AMICABLY #RMTYzLjEyNS4xNjguNTU=`
  }
];

async function sendEmails() {
  for (const email of emails) {
    try {
      const info = await transporter.sendMail({
        from: '"Yitong" <13510221939@163.com>',
        to: email.to,
        subject: email.subject,
        text: email.body
      });
      console.log('SENT: ' + email.to);
      console.log('  MessageId: ' + info.messageId);
    } catch (err) {
      console.error('FAILED: ' + email.to + ' => ' + err.message);
    }
  }
}

sendEmails();
