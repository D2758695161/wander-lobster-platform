import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

code = 'FYU6WwPKjeUnMtpE'
from_addr = '13510221939@163.com'

jobs = [
    {
        'to': '185766@proginn.com',
        'subject': '蓝牙实时播放+ASR+RAG | 完整技术方案，可今天启动',
        'body': """您好，看到了【185766】蓝牙录音APP实时播放+ASR+RAG的需求，技术栈我完全匹配。

【我的匹配度】
- 蓝牙音频流处理：熟悉移动端音频采集、编解码、蓝牙协议栈
- ASR：做过腾讯/阿里ASR接口集成，实时流识别
- RAG：生产级LangChain RAG pipeline做过多个（文件解析-chunk-embedding-向量库-LLM推理-答案生成）
- Python后端：FastAPI异步框架，WebSocket长连接推送

【技术方案建议】
阶段1：蓝牙A2DP协议抓取音频流 -> PCM采集 -> WebSocket推送到Python后端
阶段2：Python后端调用ASR实时转写（腾讯云ASR流式API或阿里云）
阶段3：RAG知识库问答 - 录音内容切片+embedding，LLM推理回答用户提问

工期预估1个月，我可以全力投入。"""
    },
    {
        'to': '185767@proginn.com',
        'subject': '红果漫剧数据爬虫 | Python爬虫+Excel导出，可快速交付',
        'body': """您好，看到了【185767】爬取红果漫剧数据的需求，我做过类似的视频内容数据采集项目，可以快速交付。

【我的方案】
- 目标站点分析：确认红果短剧页面结构（H5/APP接口）
- 数据字段：漫剧名、上新时间、简介、作者名、总集数、时长、热度、下载地址
- 技术选型：Python + requests/aiohttp + Playwright（处理JS渲染）
- 输出：Excel/CSV，可直接用于报价

【工期】1-2天可完成第一版，支持后续维护。

有类似项目经验，爬虫+数据整理是我的常规定制项目之一。"""
    },
    {
        'to': '42551@proginn.com',
        'subject': '小程序核销码系统 | 全栈交付能力，微信生态集成经验',
        'body': """您好，看到了【42551】核销码系统需求，全栈开发完全可以承接。

【我的方案】
管理后台：React + Ant Design Pro，快速搭建增删改查管理界面，Excel导出（SheetJS）
小程序端：原生微信小程序，扫码（wx.scanCode）核销+扫码入库出库，扫码库位关联存储
后端：Python Flask/FastAPI，MySQL数据库，核销码生成逻辑（防伪码+时间戳+规则）
微信生态：支付（月卡）、激励视频广告对接经验

工期1个月可以完成核心功能，后续迭代持续合作。

有小程序+后端完整交付经验，可提供演示作品。"""
    }
]

ctx = ssl.create_default_context()
successes = []
for job in jobs:
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = job['subject']
        msg['From'] = from_addr
        msg['To'] = job['to']
        msg.attach(MIMEText(job['body'], 'plain', 'utf-8'))
        with smtplib.SMTP_SSL('smtp.163.com', 465, context=ctx) as s:
            s.login(from_addr, code)
            s.sendmail(from_addr, [job['to']], msg.as_string())
        successes.append(job['to'])
        print('SENT: ' + job['to'])
    except Exception as e:
        print('FAILED: ' + job['to'] + ' -> ' + str(e))

print('Total sent: ' + str(len(successes)))
