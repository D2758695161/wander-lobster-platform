$SMTPServer = "smtp.163.com"
$SMTPPort = 465
$Username = "13510221939@163.com"
$Password = "GQjbwvrwcZ8HM4Ze"
$SecurePass = ConvertTo-SecureString $Password -AsPlainText -Force
$Cred = New-Object System.Management.Automation.PSCredential ($Username, $SecurePass)

# Email 1: MoonPay
$params1 = @{
    From = $Username
    To = "talent@moonpay.com"
    Subject = "Product Security Manager Role - Python/Automation Engineer Perspective"
    Body = @"Hi MoonPay team,

I saw your Product Security Manager role and I'm very interested - though I want to be upfront about my profile.

I'm a Python/backend engineer with strong security automation skills: I've built CI/CD security tooling (SAST/DAST integration), vulnerability triage workflows, and automated scanning pipelines. I have hands-on experience with Python for security tooling, Cloudflare WAF configuration, and Bug Bounty triage automation.

What draws me to MoonPay is your focus on securing AI-enabled features - that's the intersection I find most interesting right now. I can contribute immediately to your automation frameworks and tooling, particularly around Python-based security scanning and vulnerability management workflows.

I'm aware this is a manager-level role, but I believe the technical foundation matters most. I'd welcome a conversation about how I can contribute to your security mission - whether in an IC or leadership capacity.

Available to start immediately. Happy to share examples of my security automation work.

Best regards
"@
    SmtpServer = $SMTPServer
    Port = $SMTPPort
    Credential = $Cred
    UseSsl = $true
    ErrorAction = Stop
}
try {
    Send-MailMessage @params1
    Write-Host "Sent to talent@moonpay.com"
} catch {
    Write-Host "Failed: $_"
}

# Email 2: Fullscript
$params2 = @{
    From = $Username
    To = "careers@fullscript.com"
    Subject = "Staff ML Engineer - Follow-up + Production LangChain/LangGraph Experience"
    Body = @"Hi Fullscript team,

Following up on your Staff ML Engineer role - I sent an initial note and wanted to reinforce my interest.

I'm a Python engineer with direct production experience using LangChain and LangGraph for multi-turn conversational AI systems. Key relevant experience:

- Built production LLM agent pipelines with tool calling, memory, and multi-turn reasoning
- Implemented evaluation frameworks for LLM outputs (accuracy, hallucination detection, edge case coverage)
- Hands-on with MCP agent orchestration and RAG systems at scale
- Python backend services powering AI workflows with observability and CI/CD

Your focus on clinically useful AI - where correctness and safety are non-negotiable - resonates strongly. I've worked in similarly high-trust domains where bad outputs have real consequences, and I understand the rigor that requires.

Can we schedule a call this week? I'm flexible across US/Eastern time zones.

Best regards
"@
    SmtpServer = $SMTPServer
    Port = $SMTPPort
    Credential = $Cred
    UseSsl = $true
    ErrorAction = Stop
}
try {
    Send-MailMessage @params2
    Write-Host "Sent to careers@fullscript.com"
} catch {
    Write-Host "Failed: $_"
}
