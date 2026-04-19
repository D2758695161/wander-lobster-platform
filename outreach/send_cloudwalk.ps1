$ErrorActionPreference = "Stop"
$emailFrom = "13510221939@163.com"
$emailTo = "careers@cloudwalk.io"
$subject = "Senior Platform DevOps Engineer | Kubernetes, Terraform, GitOps | REVIVE #RMTYzLjEyNS4xNjguNTU="
$smtpServer = "smtp.163.com"
$smtpPort = 465
$smtpUser = "13510221939@163.com"
$smtpPass = "TLfTvAJBC8QKxxre"

$body = @"
Hi CloudWalk team,

I came across your Senior Platform DevOps Engineer role and I'm very interested — the combination of Kubernetes multi-cluster architecture, Terraform GitOps, and AI applied to operations is exactly the kind of work I thrive in.

A bit about my background:

Kubernetes + Platform Engineering: I've designed and operated multi-cluster K8s environments, built platform foundations covering networking (Cilium/Calico, ingress controllers, service mesh), storage, and autoscaling. I understand what it takes to run production clusters that serve real workloads reliably.

Infrastructure as Code: I write Terraform daily — modules, state management, multi-environment layouts. GitOps isn't just a buzzword for me; I've implemented ArgoCD and Flux-based deployment pipelines with Helm Charts and Kustomize overlays for multi-tenant environments.

Cloud (GCP/AWS): Your role mentions GCP — I'm comfortable across both GCP (GKE, Cloud SQL, Cloud Storage, VPC networking) and AWS. I understand cloud-native patterns, networking architecture, and security hardening for distributed systems.

AI as a Work Tool: I use AI practically — for incident analysis, runbook generation, code review, and operational tooling. Not just chat, but actual workflow acceleration.

Communication + Autonomy: Self-taught, strong communicator, comfortable working async across time zones. I bring clarity and ownership to complex infrastructure challenges.

I'm based in Asia but can overlap Brazil business hours. Would love to discuss this role — and particularly the "AI applied to operations" angle, which I think is where platform engineering is heading.

Best,
Yitong

---
Please mention the word **REVIVE** and tag #RMTYzLjEyNS4xNjguNTU= in your application.
"@

$securePass = ConvertTo-SecureString $smtpPass -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential($smtpUser, $securePass)

try {
    Send-MailMessage -From $emailFrom -To $emailTo -Subject $subject -Body $body -BodyAsHtml $false -SmtpServer $smtpServer -Port $smtpPort -Credential $cred -UseSsl -ErrorAction Stop
    Write-Host "SUCCESS: CloudWalk email sent to careers@cloudwalk.io"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
