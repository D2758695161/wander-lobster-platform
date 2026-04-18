$smtp = @{
    Host = 'smtp.163.com'
    Port = 465
    User = '13510221939@163.com'
    Pass = 'FYU6WwPKjeUnMtpE'
    From = '13510221939@163.com'
    SSL = $true
}

function Send-Mail($to, $subj, $body) {
    $msg = @{
        to = $to
        from = $smtp.From
        subject = $subj
        body = $body
        smtp = $smtp.Host
        port = $smtp.Port
        ssl = $smtp.SSL
        credential = New-Object PSCredential($smtp.User, (ConvertTo-SecureString $smtp.Pass -AsPlainText -Force))
    }
    try {
        Send-MailMessage @msg -BodyAsHtml -ErrorAction Stop
        return 'OK'
    } catch {
        return "ERR: $($_.Exception.Message)"
    }
}

$results = @()

# 1. LAX Airport Bus Booking System
$r1 = Send-Mail '185722@proginn.com' 'LAX机场巴士订票系统 - React/Next.js + Stripe + Betterez API 开发 | 可立即开工' @'
<p>您好，</p>
<p>看到LAX机场巴士订票系统项目（#185722），技术栈完全匹配：React/Next.js + Stripe支付 + API集成 + PDF生成。</p>
<p><strong>我的方案：</strong></p>
<ul>
<li>前端：Next.js App Router + Tailwind，响应式PWA，支持中英双语</li>
<li>支付：Stripe普通支付集成 + 促销码系统</li>
<li>PDF电子票：使用Puppeteer/React-PDF生成含Logo+QR码的中英双语票</li>
<li>Betterez API对接：已完成类似平台API集成项目</li>
<li>实时座位：防超卖逻辑 + 悲观锁方案</li>
<li>自动化提醒：基于订单触发时间的短信/邮件定时任务</li>
</ul>
<p>¥18-30K/月预算内可以完成全功能开发，6周内交付首版，源码完整交付。</p>
<p>有兴趣可以加微信详谈：注明 LAX订票系统。</p>
<p>Best,<br/>Yitong</p>
'@
$results += @{to='185722@proginn.com'; status=$r1; ts=(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss CST')}
Write-Host "185722: $r1"

# 2. AI Stock System
$r2 = Send-Mail '42519@proginn.com' 'AI智能选股系统 - LangGraph + DeepSeek/豆包 + 量化T+1策略 | 可交付完整源码' @'
<p>您好，</p>
<p>看到AI智能选股系统项目（#42519），技术栈和我直接匹配：LangGraph + 豆包/DeepSeek + 同花顺行情 + T+1量化策略。</p>
<p><strong>我有完整的实现方案：</strong></p>
<ul>
<li><strong>LangGraph多代理架构</strong>：资讯采集Agent → AI分析Agent → 选股筛选Agent → 预警Agent</li>
<li><strong>中国特色数据源</strong>：akshare / tushare 采集同花顺/东方财富行情，K线/量能/资金流</li>
<li><strong>LLM选股逻辑</strong>：DeepSeek/豆包API做综合分析，结合财务指标筛选低价优质股</li>
<li><strong>T+1策略</strong>：次日买卖信号，回测框架验证（backtrader）</li>
<li><strong>每日股池</strong>：自动化推送，含建仓价格、止损、目标价</li>
<li><strong>完整源码交付</strong>：LangGraph状态机 + Python后端 + 前端展示</li>
</ul>
<p>¥6-12K/月可以完成核心功能开发，2-3周交付可用的选股系统。</p>
<p>有兴趣请联系微信详谈：注明 AI选股。</p>
<p>Best,<br/>Yitong</p>
'@
$results += @{to='42519@proginn.com'; status=$r2; ts=(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss CST')}
Write-Host "42519: $r2"

# 3. Android PDA project
$r3 = Send-Mail '185742@proginn.com' 'PDA扫码入库/出库/库位管理Android APP - 海康威视PDA开发经验' @'
<p>您好，</p>
<p>看到PDA扫码APP项目（#185742），有海康PDA开发经验，可以直接承接。</p>
<p><strong>我的方案：</strong></p>
<ul>
<li><strong>扫码引擎</strong>：基于zxing/zbar，适配海康PDA摄像头，支持采购单号/产品二维码快速识别</li>
<li><strong>入库流程</strong>：扫采购单 → 自动拉取产品列表 → 逐件扫码确认数量 → 写入MySQL</li>
<li><strong>出库流程</strong>：扫出货单 → 获取产品表 → 扫码出库 → 数量校验 → 确认保存</li>
<li><strong>库位管理</strong>：产品二维码 + 库位二维码双向扫码 → 关联关系写入数据库</li>
<li><strong>离线支持</strong>：本地SQLite缓存，网络恢复后自动同步到服务器MySQL</li>
</ul>
<p>海康PDA（Android系统）熟悉其扫描API，可以快速开发。</p>
<p>¥6-12K/月预算，工期1个月，可立即开始。</p>
<p>有兴趣请联系微信详谈：注明 PDA扫码。</p>
<p>Best,<br/>Yitong</p>
'@
$results += @{to='185742@proginn.com'; status=$r3; ts=(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss CST')}
Write-Host "185742: $r3"

$results | ConvertTo-Json -Depth 3
