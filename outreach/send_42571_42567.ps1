$smtp = New-Object System.Net.Mail.SmtpClient
$smtp.Host = "smtp.163.com"
$smtp.Port = 465
$smtp.EnableSsl = $true
$smtp.Credentials = New-Object System.Net.NetworkCredential("13510221939@163.com", "DKpWFJySX2RjTCQc")

function Send-Email($to, $subject, $body) {
    $msg = New-Object System.Net.Mail.MailMessage
    $msg.From = "13510221939@163.com"
    $msg.To.Add($to)
    $msg.Subject = $subject
    $msg.Body = $body
    $msg.IsBodyHtml = $false
    try {
        $smtp.Send($msg)
        Write-Host "[SENT] $to"
        Write-Host "  Subject: $subject"
    } catch {
        Write-Host "[FAILED] $to : $_"
    }
}

# New Proginn listing: 42571 - 台球房智能管理系统 (Y12-18K/month)
Send-Email -to "42571@proginn.com" -subject "台球房智能管理系统 | Java SpringBoot+Vue3+硬件对接 可完整交付" -body @"
您好，

看到您的台球房智能管理系统项目（42571），技术要求我完全匹配：

我的方案：
- 后端：Java SpringBoot + MySQL + Redis（缓存/会话）
- 前端：Vue3 + Element Plus（球房端大屏/管理后台）
- 支付：微信/支付宝原生支付对接
- 硬件对接：RS232/485串口通信（优泽等台球系统兼容）
- 收银计费：计时计费/套餐核销/会员管理/库存管理

我有完整交付经验：
- 收银计费系统 + 硬件驱动（硬币机/投币器/刷卡器）
- 多设备联动（串口协议解析+状态监控）
- 广告屏控制 + 后台管理SaaS

21工作日周期可按阶段验收，Y12-18K预算可谈。

有兴趣可以进一步沟通技术方案和交付节点。

期待合作！
Yitong
"@

# New Proginn listing: 42567 - K8S/DevOps (Y1-6K/month)
Send-Email -to "42567@proginn.com" -subject "K8S+Linux+DevOps 运维工程师 | 官网/云服务器部署+安全防护 可快速到岗" -body @"
您好，

看到您的运维工程师职位（42567），我的背景直接匹配：

核心技能：
- K8S + Docker：集群部署、Pod管理、Helm Chart
- Linux：Ubuntu/CentOS系统管理、Nginx/Apache配置
- Jenkins：CI/CD流水线、自动化构建部署
- 云服务器：阿里云/腾讯云/华为云环境配置
- 安全防护：防火墙/SSL/数据备份/漏洞排查
- Python/Node.js运行环境部署

我有完整的网站/应用部署经验：
- 从测试到生产的全流程迁移
- Nginx反向代理 + SSL证书 + 域名解析
- 7*24监控 + 故障应急响应
- 部署文档和运维手册编写

1个月工期，Y1-6K可协商。随时可以开始。

有兴趣可以详聊具体需求！

Yitong
"@

$smtp.Dispose()
