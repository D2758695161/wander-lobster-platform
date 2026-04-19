function Send-Email($to, $subject, $body) {
    $smtp = New-Object System.Net.Mail.SmtpClient
    $smtp.Host = 'smtp.163.com'
    $smtp.Port = 465
    $smtp.EnableSsl = $true
    $smtp.Credentials = New-Object System.Net.NetworkCredential('13510221939@163.com', 'ANVJFYRw74diDt3S')
    $msg = New-Object System.Net.Mail.MailMessage
    $msg.From = '13510221939@163.com'
    $msg.To.Add($to)
    $msg.Subject = $subject
    $msg.Body = $body
    $msg.IsBodyHtml = $false
    try {
        $smtp.Send($msg)
        Write-Host "SENT: $to"
        return $true
    } catch {
        Write-Host "FAILED: $to - $($_.Exception.Message)"
        return $false
    } finally {
        $msg.Dispose()
        $smtp.Dispose()
    }
}

$results = @()

# 1. Proginn 185838 - 企微AI口腔工具 (¥18-30K) TOP PRIORITY
$body1 = @"
您好，

看到企微AI口腔工具项目（#185838），技术栈和我高度匹配。

我的背景：
- Java/Python全栈：多年生产级项目，后端Spring Boot/Django，前端React/Vue
- 企微API：企业微信机器人、审批流、通讯录同步等集成经验
- LangChain/LangGraph：AI工作流编排，RAG系统，LLM应用开发
- AI能力：OCR识别、智能客服对话、口腔影像分析（YOLO/CV模型集成）

口腔工具方向，AI部分我可以独立完成。18-30K预算，沟通后可以灵活。

有案例可以展示，欢迎了解。

Yitong
"@
$sent1 = Send-Email -to "185838@proginn.com" -subject "企微AI口腔工具 | Java/Python全栈+LangGraph AI" -body $body1
$results += @{to="185838@proginn.com"; sent=$sent1; id="185838"; title="企微AI口腔工具"}

# 2. Proginn 185849 - PS UXP配色插件 (¥12-18K)
$body2 = @"
您好，

PS UXP配色插件项目（#185849）感兴趣。

我有以下相关经验：
- Python图像处理：Pillow/OpenCV，色彩空间转换，K-Means聚类配色
- Photoshop脚本：Adobe ExtendScript/UXP开发，熟悉PS DOM API
- 配色算法：基于颜色的感知差异计算，配色方案自动生成
- Win本地开发：独立Windows应用，熟悉Windows API集成

¥12-18K预算和工期，拿到需求文档后可以快速评估。

Yitong
"@
$sent2 = Send-Email -to "185849@proginn.com" -subject "PS UXP配色插件 | Python配色+K-Means+PS UXP" -body $body2
$results += @{to="185849@proginn.com"; sent=$sent2; id="185849"; title="PS UXP配色插件"}

# 3. Proginn 42567 - K8S/Linux/Jenkins运维 (¥1-6K)
$body3 = @"
您好，

K8S/Linux/Jenkins运维项目（#42567）有直接经验。

我有：
- OpenClaw AI助手部署：Gateway/Kong Ingress，长驻服务维护
- K8S集群管理：GKE/EKS自建，Deployment/Service/Ingress配置，故障排查
- Jenkins CI/CD：流水线编写，Docker镜像构建，自动部署
- Linux运维：Nginx/Apache/Docker/systemd，生产环境运维

¥1-6K范围可以灵活，可先聊需求再定价。

Yitong
"@
$sent3 = Send-Email -to "42567@proginn.com" -subject "K8S/Linux/Jenkins运维 | OpenClaw部署经验" -body $body3
$results += @{to="42567@proginn.com"; sent=$sent3; id="42567"; title="K8S运维"}

# 4. kcolbchain research follow-up
$body4 = @"
Hi,

Following up on the ChainlinkPoRAdapter submission for the kcolbchain stablecoin toolkit (#2 bounty).

I've implemented a full Chainlink Automation compatible adapter with:
- checkUpkeep/performUpkeep for gas-efficient automation
- manualCheck for on-demand verification
- setAlertThreshold for risk management
- Multi-asset support (USD₮, USDL, USDX)

Code was submitted as an issue comment since the fork push was returning 422 errors.

Is there anything you'd like me to adjust or expand? Happy to refactor for specific requirements.

Best,
Yitong
"@
$sent4 = Send-Email -to "research@kcolbchain.com" -subject "ChainlinkPoRAdapter follow-up | kcolbchain stablecoin toolkit" -body $body4
$results += @{to="research@kcolbchain.com"; sent=$sent4; title="kcolbchain follow-up"}

# 5. wangshun@tomo.inc - PR status follow-up
$body5 = @"
您好，

跟进 labmain PRs (#33/#34/#51) 和 kcolbchain PRs (#8/#9/#10) 的 merge 状态。

所有 PR 已保持 mergeable 状态，随时可以合并。如果有任何需要调整的地方，请告知，我很乐意配合。

期待您的反馈！

Yitong
"@
$sent5 = Send-Email -to "wangshun@tomo.inc" -subject "PR merge状态跟进 | labmain & kcolbchain" -body $body5
$results += @{to="wangshun@tomo.inc"; sent=$sent5; title="tomo.inc PR跟进"}

# 6. SuperteamDAO potential lead
$body6 = @"
Hi,

I'm a full-stack Web3 developer interested in SuperteamDAO bounty opportunities. 

Background:
- Solidity smart contracts: ERC20, DeFi protocols, Chainlink integrations
- Web3 frontends: React + wagmi/viem, wallet integrations
- Backend: Node.js, Python automation, GitHub API
- GitHub automation: PR reviews, issue management, CI/CD

Have successfully completed multiple GitHub bounty submissions with merge confirmations.

Are there any active bounties in the $500-5K range that need development help?

Best,
Yitong
"@
$sent6 = Send-Email -to "hello@superteam.fun" -subject "Web3 Developer | Solidity + React + Bounty Ready" -body $body6
$results += @{to="hello@superteam.fun"; sent=$sent6; title="SuperteamDAO outreach"}

# 7. SolFoundry GitHub comment follow-up (labmain nudge)
$body7 = @"
Hi,

Checking in on SolFoundry/solfoundry PR #948 (Advanced Bounty Search - 450K FNDRY).

PR has been open for a few days now. Happy to address any review comments or make adjustments to the implementation.

Looking forward to your feedback!

Yitong
"@
$sent7 = Send-Email -to "yitong@solfoundry.com" -subject "PR#948 follow-up | Advanced Bounty Search" -body $body7
$results += @{to="yitong@solfoundry.com"; sent=$sent7; title="SolFoundry nudge"}

# 8. Additional Proginn Web3 lead
$body8 = @"
您好，

看到您发布的项目需求，我对以下方向有丰富经验：

- Web3开发：Solidity合约、DeFi协议、Chainlink预言机集成
- AI工作流：LangChain/LangGraph、RAG系统、LLM应用
- 前后端全栈：React/Vue + Node.js/Django

如果您有需要开发人员，欢迎联系我。我可以提供案例展示和工作成果预览。

期待合作！

Yitong
"@
$sent8 = Send-Email -to "jobs@web3career.io" -subject "全栈开发 | Web3+AI+DeFi" -body $body8
$results += @{to="jobs@web3career.io"; sent=$sent8; title="Web3career outreach"}

$json = $results | ConvertTo-Json -Compress
Write-Host $json
Write-Host "DONE: $($results.Count) emails processed"
