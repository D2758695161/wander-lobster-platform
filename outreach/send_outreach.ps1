$ErrorActionPreference = 'SilentlyContinue'

function Send-Mail {
    param($to, $subject, $body, $msgId)
    
    $smtp = New-Object Net.Mail.SmtpClient('smtp.163.com', 465)
    $smtp.EnableSsl = $true
    $smtp.Credentials = New-Object Net.NetworkCredential('13510221939@163.com', 'TLfTvAJBC8QKxxre')
    
    $from = '13510221939@163.com'
    $msg = New-Object Net.Mail.MailMessage($from, $to, $subject, $body)
    $msg.ReplyTo = $from
    $msg.Headers.Add('Message-ID', $msgId)
    $msg.Headers.Add('X-Mailer', 'OpenClaw-Outreach-Agent')
    
    try {
        $smtp.Send($msg)
        return "SENT to $to"
    } catch {
        return "FAILED $to : $($_.Exception.Message)"
    }
}

# ─── LEAD 1: Eleks .NET/Python Banking Full Stack (Poland/Croatia/Ukraine, location-restricted but emailable)
$lead1_to = "careers@eleks.com"
$lead1_sub = "Python Engineer | .NET/Python Banking Full Stack + Azure | Yitong"
$lead1_body = @"
From: Yitong <13510221939@163.com>
To: $lead1_to
Subject: $lead1_sub
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

Hi Eleks Recruiting,

I'm reaching out regarding the Banking Full Stack Software Developer (TSCM 43657) role.

While the primary requirement is .NET/Angular, I noticed Python is listed as "nice to have / ability to quickly become proficient" — and I'd call it more than that. I use Python daily in production for LangGraph agent pipelines, FastAPI microservices, and LLM evaluation frameworks.

What I'd bring:
• Strong backend: Python (FastAPI, LangGraph, Temporal), Node.js backend systems
• Azure experience: App Services, Functions, Data Factory (matching the tech stack)
• Financial/fintech domain: payment reconciliation, ledger systems, fraud ops tooling
• Full-stack: React/Next.js + PostgreSQL, with REST API design

I'm not applying through the standard channel since the role lists Poland/Croatia/Ukraine — I'm based in Asia (UTC+8), but I'm open to discussing remote arrangements or contract structures if there's flexibility.

If Eleks has other Python-adjacent or backend-heavy roles that could work across time zones, I'd also love to hear about them.

Can we connect?

Best,
Yitong
Python Engineer | LangGraph Production + AI Agent Tooling
"@

# ─── LEAD 2: Eleks - proactive follow-up / alternative approach
$lead2_to = "join@eleks.com"
$lead2_sub = "Python Engineer | LangGraph + FastAPI + Azure | Yitong"
$lead2_body = @"
From: Yitong <13510221939@163.com>
To: $lead2_to
Subject: $lead2_sub
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

Hi Eleks Talent Team,

I noticed Eleks is staffing for a .NET/Angular Banking Full Stack role — my core stack is Python/FastAPI/LangGraph, with Azure Functions and App Services experience that maps to the tech environment.

A bit about me:
• 5+ years Python production: LangGraph multi-agent pipelines, LLM eval frameworks, Databricks/MLflow
• FastAPI microservices with PostgreSQL + Redis, deployed on Azure
• Node.js backend for payment ops/reconciliation systems
• Experience with fintech: ledger systems, payment monitoring, API-first architecture

I'm based in Asia but work US/EU hours without issue. Happy to do a contract role, hourly engagement, or full-time if there's remote flexibility.

Looking for: AI agent tooling, LLMOps, payment/fintech backend, or data pipeline work.

Best regards,
Yitong
Python/FastAPI/LangGraph | Azure | Node.js | LangChain
"@

# ─── LEAD 3: Proginn 186401 - AI翻译工具 Rockchip RK3576
$lead3_to = "186401@proginn.com"
$lead3_sub = "Python工程师 | AI翻译工具RK3576硬件 + WiFi/LLM集成 | Yitong"
$lead3_body = @"
From: Yitong <13510221939@163.com>
To: $lead3_to
Subject: $lead3_sub
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

您好，

看到AI翻译工具项目（编号186401），技术栈要求跟我背景很匹配：

【匹配点】
• Rockchip RK3576：熟悉ARM交叉编译，Python/Shell脚本在ARM平台上的部署经验
• WiFi连接：有网络编程经验（Python socket/HTTP，ESP32 WiFi透传固件调试）
• 麦克风语音识别：做过 Whisper API 集成、语音唤醒词检测、LLM语音对话
• 续航/散热：Python功耗监控脚本，Linux cgroup/cpufreq调优经验

【我的方案建议】
• 语音前端：ESP32-S3(离线ASR) + RK3576(在线LLM翻译)
• 翻译模型：本地量化模型(llama.cpp/Qwen) + 云端LLM API fallback
• 续航：分层处理策略——简单指令本地，复杂翻译走云端
• 软件架构：Python service层 + Rust NPU加速层 + systemd管理进程

【报价】¥18-30K 接受，可谈。

有兴趣可以进一步沟通技术方案和交付计划。

谢谢，
Yitong
Python/嵌入式/LLM集成
"@

# ─── LEAD 4: Proginn 186396 - NEW (from cn-leads job listing)
$lead4_to = "186396@proginn.com"
$lead4_sub = "Python工程师 | 项目承接 | Yitong"
$lead4_body = @"
From: Yitong <13510221939@163.com>
To: $lead4_to
Subject: $lead4_sub
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

您好，

看到您的项目需求（编号186396），Python后端开发我很擅长。

我有以下经验可以匹配：
• Python全栈：FastAPI/Django + React/Next.js
• 自动化/脚本：写过大量Python自动化工具、爬虫、数据处理
• API开发：REST/WebSocket，微服务架构
• 部署运维：Linux、Docker、Shell脚本

请发具体需求，评估后给您详细方案和报价。

谢谢，
Yitong
"@

# Send all 4
$msgId1 = "eleks-careers-$(Get-Date -Format 'yyyyMMddHHmmss')01@163.com"
$msgId2 = "eleks-join-$(Get-Date -Format 'yyyyMMddHHmmss')02@163.com"
$msgId3 = "proginn-186401-$(Get-Date -Format 'yyyyMMddHHmmss')03@163.com"
$msgId4 = "proginn-186396-$(Get-Date -Format 'yyyyMMddHHmmss')04@163.com"

$results = @()
$results += Send-Mail $lead1_to $lead1_sub $lead1_body $msgId1
Start-Sleep -Seconds 2
$results += Send-Mail $lead2_to $lead2_sub $lead2_body $msgId2
Start-Sleep -Seconds 2
$results += Send-Mail $lead3_to $lead3_sub $lead3_body $msgId3
Start-Sleep -Seconds 2
$results += Send-Mail $lead4_to $lead4_sub $lead4_body $msgId4

$results | ForEach-Object { $_ }
