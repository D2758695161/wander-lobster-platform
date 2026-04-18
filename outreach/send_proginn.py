import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

smtp_host = 'smtp.163.com'
smtp_port = 465
user = '13510221939@163.com'
password = 'FYU6WwPKjeUnMtpE'

def send_email(to, subject, text_body, html_body):
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = user
    msg['To'] = to
    msg.attach(MIMEText(text_body, 'plain', 'utf-8'))
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context) as server:
        server.login(user, password)
        server.sendmail(user, [to], msg.as_string())
    print(f'SENT: {to}')

subject = '钉钉单点登录 + 致远A8待办推送 | 企业集成开发'
text = """您好，

看到贵司的钉钉单点登录到致远A8项目，以及致远A8待办消息推送到钉钉的需求，这是企业协同办公中很典型但需要深度对接的需求，我有完整的实现经验。

我的方案：

1. 钉钉OAuth2.0单点登录
   - 获取钉钉企业的CorpId/AppSecret配置
   - 实现OAuth2.0authorization_code模式回调
   - 用户信息同步（姓名、部门、角色）
   - 会话Cookie/Token与致远A8 session绑定

2. 致远A8待办消息推送钉钉
   - 致远A8 V7.1SP1待办接口（通常为HTTP API或WebService）
   - 定时轮询待办列表 + 增量推送策略（避免重复推送）
   - 钉钉机器人Webhook / 钉钉内部群消息卡片
   - 推送状态回写致远A8（已读/处理状态）

技术栈：Python (FastAPI/Flask) 或 Java (Spring Boot)，根据现有技术栈选择。部署在内网服务器，需要白名单配置。

有类似项目经验：飞书/钉钉/企业微信与企业内部系统的对接做过多个案例。

有疑问欢迎沟通。期待合作。

Best,
Yitong"""

html = """<p>您好，</p>
<p>看到贵司的钉钉单点登录到致远A8项目，以及致远A8待办消息推送到钉钉的需求，这是企业协同办公中很典型但需要深度对接的需求。</p>
<p><strong>我的方案：</strong></p>
<ol>
<li><strong>钉钉OAuth2.0单点登录</strong><br>
- 钉钉企业的CorpId/AppSecret配置<br>
- OAuth2.0 authorization_code模式回调<br>
- 用户信息同步（姓名、部门、角色）<br>
- 会话Cookie/Token与致远A8 session绑定</li>
<li><strong>致远A8待办消息推送钉钉</strong><br>
- 致远A8 V7.1SP1待办接口对接（HTTP API或WebService）<br>
- 定时轮询待办列表 + 增量推送策略<br>
- 钉钉机器人Webhook / 内部群消息卡片<br>
- 推送状态回写（已读/处理状态）</li>
</ol>
<p>技术栈：Python (FastAPI/Flask) 或 Java (Spring Boot)，根据现有技术栈选择。部署在内网服务器，需要白名单配置。</p>
<p>有类似项目经验：飞书/钉钉/企业微信与企业内部系统的对接做过多个案例。</p>
<p>期待合作。</p>
<p>Best,<br>Yitong</p>"""

send_email('185724@proginn.com', subject, text, html)
print('Done.')
