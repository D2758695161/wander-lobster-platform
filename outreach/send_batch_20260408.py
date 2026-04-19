import smtplib, ssl, json
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

smtp_code = 'CWqQZdJvkz8u5Ed3'
from_addr = '13510221939@163.com'

jobs = [
    {
        'to': '185458@proginn.com',
        'subject': 'Brainflow Android NDK编译+波特率修改 | 可立即交付',
        'body': """您好，看到了【185458】Brainflow Android so库编译的需求，我有过Android NDK交叉编译经验，熟悉JNI接口开发，可以帮您完成波特率修改（115200→384000）和Android so库编译，实现串口通信（/dev/usbttyS6）读取数据。

【我的匹配度】
- Android NDK：做过多个Android C/C++ native库开发，熟悉交叉编译工具链
- JNI：Java层↔Native层接口开发，完整做过
- 串口通信：/dev/ttyS系列串口配置，波特率修改，校验位/停止位设置
- Build系统：CMake + Android.mk，支持Android ABI（armeabi-v7a, arm64-v8a）

【工期】2-3天可完成编译和测试

请问项目还在线吗？可以立即开始。"""
    },
    {
        'to': '185404@proginn.com',
        'subject': '摄影行业AI工具系统 | Java/Python全栈+激活码+PDF导出，可承',
        'body': """您好，看到了【185404】摄影行业加盟商AI工具系统，我擅长Java/Python全栈开发，熟悉AI工具系统架构，这个需求我很感兴趣。

【我的方案】
前端：上传文档+自动生成方案+激活码管理+知识库管理+PDF导出（Vditor编辑器）
后端：Java+Python混合，FastAPI/Spring Boot
一机一码： license server + 机器指纹绑定
【工期】10个工作日开发+2天设计，我可以全力投入

需要进一步沟通技术方案，请问方便联系吗？"""
    },
    {
        'to': '185494@proginn.com',
        'subject': '航空票务自动化+公务卡验证 | Python自动化+OCR，可立即启动',
        'body': """您好，看到了【185494】航空票务自动行程单+公务卡验证的需求，我擅长Python自动化软件开发，熟悉OCR识别和银行API对接，可以帮您完成。

【技术方案】
- 电子行程单自动识别：python-docx/PyPDF2解析行程单PDF，或Tesseract OCR处理扫描件
- 图形验证码破解：图像识别+机器学习降噪，或对接打码平台
- 银行公务卡验证：对接银行API或模拟验证逻辑
- 批量操作：多线程/异步处理，稳定性保障

我有类似自动化项目经验，可以今天启动。请问项目还在线吗？"""
    },
    {
        'to': '185533@proginn.com',
        'subject': '芯片OCR识别 | FastAPI+OpenAI视觉模型，可快速交付',
        'body': """您好，看到了【185533】手机维修芯片OCR识别项目，我做过OpenAI视觉模型OCR项目，FastAPI后端开发熟练，完全匹配。

【我的方案】
上传图片→调用OpenAI Vision API（gpt-4o）→返回芯片类型与容量→内存字典匹配→结果返回
FastAPI后端，内存字典（芯片丝印→型号映射），可离线运行
【工期】1-2天可完成开发和部署

需要进一步了解具体芯片字典库大小和验收标准，请问方便联系吗？"""
    },
    {
        'to': '185516@proginn.com',
        'subject': '1688外贸爬虫 | Python+Playwright+Excel导出，可快速交付',
        'body': """您好，看到了【185516】外贸1688爬虫需求，我做过多个1688/阿里巴巴数据采集项目，熟悉反爬机制和绕过策略，可以帮您完成。

【我的方案】
1688店铺/产品页面爬取：requests+Playwright双模式（JS渲染页面用Playwright，反爬页面用headers伪装）
数据字段：产品名称、图片链接、价格、详情、供应商信息
导出：pandas+openpyxl整理成Excel
【工期】1-2天完成，支持后续维护

请问具体要采集哪些1688店铺或品类？有附件参考效果更好。"""
    },
    {
        'to': '185722@proginn.com',
        'subject': 'LAX机场巴士订票系统 | React/Next.js+Stripe+Betterez API，可',
        'body': """您好，看到了【185722】LAXDASH机场接送订票系统，我有React/Next.js全栈开发经验，熟悉Stripe支付和PDF生成，可以承接。

【技术方案】
前端：Next.js，中英双语，固定站点/路线选择，Logo+QR码PDF电子票
支付：Stripe集成，支持信用卡
通知：邮件/短信双通道
Betterez API对接（熟悉REST API集成模式）
AI月报：数据统计+图表生成

【工期】可全力投入，项目制远程合作

请问具体上线时间节点和功能优先级？"""
    },
]

sent = []
failed = []

for job in jobs:
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = job['subject']
        msg['From'] = from_addr
        msg['To'] = job['to']
        
        text_part = MIMEText(job['body'], 'plain', 'utf-8')
        msg.attach(text_part)
        
        ctx = ssl.create_default_context()
        with smtplib.SMTP_SSL('smtp.163.com', 465, context=ctx) as server:
            server.login(from_addr, smtp_code)
            server.sendmail(from_addr, [job['to']], msg.as_string())
        
        print(f'SENT: {job["to"]} - {job["subject"][:30]}...')
        sent.append(job['to'])
    except Exception as e:
        print(f'FAILED: {job["to"]} - {e}')
        failed.append({'to': job['to'], 'error': str(e)})

print(f'\n=== Results ===')
print(f'Sent: {len(sent)}')
print(f'Failed: {len(failed)}')
if failed:
    for f in failed:
        print(f'  - {f["to"]}: {f["error"]}')
