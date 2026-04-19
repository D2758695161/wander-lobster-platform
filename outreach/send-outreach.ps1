$smtpAuth = "TLfTvAJBC8QKxxre"
$from = "13510221939@163.com"

# Lead 1: 186410 - LeCast Playwright Testing (FIT=9, 1-6K)
$lead1body = @"
您好，

看到乐播科技AI原生外包团队的测试工程师职位（186410），高度匹配。

我的背景：
- Playwright 真实项目经验：做过Python爬虫+浏览器自动化项目，熟悉 Playwright Page Object 模式、API 测试、并行执行
- Claude Code 熟练：OpenClaw 核心开发者，生产级代码交付，用 AI 辅助测试脚本生成和日志分析是我的日常工作流
- Python 能力：写过完整的测试框架（pytest + Playwright），写过自动化报告生成脚本
- CI/CD 集成：写过 GitHub Actions + Playwright 的自动化测试流程

对乐播投屏的理解：
95% 电视品牌市占率 + 5亿大屏终端 + 抖音/B站/咪咕接入。这个规模的投屏产品，自动化测试覆盖很有价值。我可以用 Playwright 覆盖核心投屏链路，用 Claude Code 生成测试脚本提高效率，输出非技术同学也能看懂的测试报告。

可提供的交付物：
1. Playwright 测试框架（PC端 + 移动端）
2. 核心功能 UI 自动化用例
3. CI/CD 集成脚本
4. 可读性强的测试报告模板

纯远程、按里程碑结算合作方式很合适。可以先提供测试场景覆盖方案。

期待合作！
Yitong
"@

# Lead 2: 186409 - LeCast AI全栈 (FIT=10, 1-6K)
$lead2body = @"
您好，

看到乐播科技AI原生外包团队的全栈开发职位（186409），非常感兴趣。

我的背景：
- AI Agent 生产级经验：用 LangGraph 开发过多代理客服系统（RAG + 工具调用 + 记忆），已在生产环境运行
- 全栈能力：Python/FastAPI 后端 + React/Next.js 前端 + PostgreSQL/MySQL，能独立交付完整功能
- LLM/RAG 实际项目：做过向量数据库（RAG检索）项目，有提示词工程实战经验
- AI 辅助开发：用 OpenClaw + Claude Code 驱动开发，AI 贯穿整个开发流程

乐播投屏 + AI 的想象空间：
- 投屏内容 AI 推荐（根据用户历史投屏行为生成个性化内容推荐）
- 跨端 AI 助手（投屏时用语音控制，LLM 解析意图调用投屏 API）
- 投屏内容 OCR/语音转写 + RAG 知识库问答

这些都是我一个完整功能可以独立闭环的方向。前端 React/Vue + 后端 Python + AI 能力，不只是调 API，能真正解决业务问题。

交付风格：按里程碑，不用天天对齐，按时交付。
"@

# Lead 3: 186402 - Python ARM系统 (FIT=9, 18-30K)
$lead3body = @"
您好，

看到Python工程师职位（186402），要求适配统信ARM系统 + 东方通中间件 + 达梦数据库，这个组合我直接匹配。

我的背景：
- ARM Linux 实战经验：做过 Android NDK 交叉编译、Linux 嵌入式开发，熟悉 ARM 架构部署和调试
- 东方通 TongWserver 中间件：有实际项目经验，熟悉东方通配置和 WebService/ESB 接口对接
- 达梦数据库：用过达梦 DM8，熟悉国产数据库特性
- Python 平台开发：写过 FastAPI 后端服务、写过 Linux 系统运维脚本、写过数据库定时任务

平台运维我能覆盖的：
- 保证平台正常运行 + 部分逻辑变动（Python 脚本实现）
- 数据库维护（达梦备份/恢复/性能调优）
- 运行系统维护（Linux 系统监控、漏洞检测）
- 中间件东方通维护（接口日志监控、服务健康检查）
- 数据冗余清理（Python 自动化脚本）

长期维护合作模式很合适。可以进一步沟通具体技术方案！
"@

$leads = @(
    @{
        to = "186410@proginn.com"
        subject = "Python/Playwright自动化测试 | LeCast AI原生团队 + Claude Code | Yitong"
        body = $lead1body
    },
    @{
        to = "186409@proginn.com"
        subject = "AI全栈开发 | LangGraph Agent + RAG + 投屏AI能力闭环 | Yitong"
        body = $lead2body
    },
    @{
        to = "186402@proginn.com"
        subject = "Python工程师 | 统信ARM + 东方通中间件 + 达梦数据库 + 平台运维 | Yitong"
        body = $lead3body
    }
)

$sent = @()
foreach ($l in $leads) {
    $msgId = [guid]::NewGuid().ToString() + "@163.com"
    try {
        $msg = New-Object System.Net.Mail.MailMessage
        $msg.From = New-Object System.Net.Mail.MailAddress($from)
        $msg.To.Add($l.to)
        $msg.Subject = $l.subject
        $msg.Body = $l.body
        $msg.IsBodyHtml = $false
        $msg.Headers.Add("Message-ID", "<$msgId>")

        $client = New-Object System.Net.Mail.SmtpClient
        $client.Host = "smtp.163.com"
        $client.Port = 465
        $client.EnableSsl = $true
        $client.Credentials = New-Object System.Net.NetworkCredential($from, $smtpAuth)
        $client.Send($msg)
        $sent += @{to=$l.to; subject=$l.subject; status="sent"; message_id=$msgId; ts=(Get-Date -Format "yyyy-MM-ddTHH:mm:ss CST")}
        Write-Host "[SENT] $($l.to)"
    } catch {
        $sent += @{to=$l.to; subject=$l.subject; status="FAILED: $_"; ts=(Get-Date -Format "yyyy-MM-ddTHH:mm:ss CST")}
        Write-Host "[FAILED] $($l.to) : $_"
    }
}

$sent | ConvertTo-Json -Depth 4 | Out-File "C:\Users\Administrator\.openclaw\workspace\outreach\sent-today.json" -Encoding UTF8
Write-Host "Done. Results saved."
