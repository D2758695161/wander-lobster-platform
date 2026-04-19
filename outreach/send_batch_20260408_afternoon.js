const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 465,
  secure: true,
  auth: { user: '13510221939@163.com', pass: 'CWqQZdJvkz8u5Ed3' },
  connectionTimeout: 10000, socketTimeout: 10000
});

const delay = ms => new Promise(r => setTimeout(r, ms));

const leads = [
  {
    to: '185406@proginn.com',
    subject: 'MT5交易数据抓取 | React/ECharts前端+Python后端',
    body: `您好，

看到MT5交易数据抓取+图表展示项目（#185406），有兴趣。

我的相关经验：
- 金融市场数据：股票/外汇/加密货币API集成，实时数据流处理
- ECharts/TradingView：专业K线图、成交量、技术指标可视化
- MT4/MT5：MQL5策略、EA自动化、平台集成经验
- 前端：React+TypeScript，D3.js自定义图表，WebSocket实时数据
- Python后端：FastAPI/Flask，数据清洗，数据库存储

¥1-6K范围可以灵活，欢迎沟通细节。

Yitong`
  },
  {
    to: '42451@proginn.com',
    subject: '体育直播/视频网站 | React+Video.js+HLS流媒体',
    body: `您好，

看到体育直播/视频网站项目（#42451），有兴趣。

我的经验：
- 视频流：HLS/DASH协议，Video.js/MediaElement.js集成
- 体育直播平台：实时比分、赔率展示、直播信号接入
- React前端：SSR/SSG，响应式设计，PWA支持
- 后端：Node.js流媒体服务，WebSocket实时聊天/弹幕
- CDN/存储：AWS CloudFront，七牛云等视频分发

¥18-500K/月高薪，可先了解需求细节再谈合作模式。

Yitong`
  },
  {
    to: '42439@proginn.com',
    subject: 'Python二次开发 | Django/DRF+Vue全栈经验',
    body: `您好，

看到Python产品二次开发项目（#42439），有兴趣。

我的背景：
- Django/DRF：RESTful API设计，认证系统，后台管理
- 数据库：PostgreSQL/MySQL，Redis缓存，性能优化
- 前端Vue：Vue3+TypeScript，Element Plus/Vuetify组件库
- 产品开发经验：电商、CRM、数据分析平台
- Python工具：爬虫、自动化脚本、数据处理

¥6-12K/月范围，可根据需求灵活调整。

Yitong`
  },
  {
    to: '185384@proginn.com',
    subject: 'Python工程师 | 爬虫+数据处理+AI集成',
    body: `您好，

看到Python工程师项目（#185384），有兴趣。

我有以下Python经验：
- 爬虫/数据采集：Scrapy/Playwright，反爬策略，代理池
- 数据处理：Pandas/NumPy，数据清洗，ETL流程
- AI集成：LangChain/RAG，LLM API，智能客服/数据分析
- Web开发：Django/FastAPI，REST API，异步任务
- 自动化：Selenium/Celery，定时任务，监控告警

¥1-6K/月，可以按项目或按月合作。

Yitong`
  },
  {
    to: '185375@proginn.com',
    subject: '前端二次开发 | React+Vue+TypeScript',
    body: `您好，

看到前端产品二次开发项目（#185375），有兴趣。

我的前端经验：
- React/Vue：Vue3+TypeScript，React18+Hooks，组件化开发
- UI框架：Element Plus，Ant Design，Tailwind CSS
- 集成能力：第三方SDK，支付API，地图/图表组件
- 性能优化：Webpack/Vite，代码分割，SEO优化
- 二次开发经验：ERP/CRM系统，电商后台，SaaS平台

¥6-12K/月，欢迎沟通需求细节。

Yitong`
  },
  {
    to: '42433@proginn.com',
    subject: 'Go开发 | 高并发+微服务+云原生',
    body: `您好，

看到Go开发项目（#42433），有兴趣。

我有以下Go经验：
- Go并发：goroutine/channel，并发控制，锁优化
- 微服务：gRPC/Protobuf，Docker/K8s部署，Istio服务网格
- Web框架：Gin/Echo，RESTful API，JWT认证
- 数据库：PostgreSQL/MySQL，Redis，消息队列Kafka
- 云原生：AWS/GCP，Terraform，CI/CD流水线

¥18-30K/月，可按项目或长期合作。

Yitong`
  }
];

async function main() {
  console.log('Sending', leads.length, 'cold emails...');
  let sent = 0;
  for (const email of leads) {
    try {
      await transporter.sendMail({
        from: '13510221939@163.com',
        to: email.to,
        subject: email.subject,
        text: email.body
      });
      console.log('SENT:', email.to);
      sent++;
    } catch(e) {
      console.log('FAIL:', email.to, e.message);
    }
    await delay(3000);
  }
  console.log('\nDone:', sent, '/', leads.length, 'sent');
}

main().catch(e => { console.error(e); process.exit(1); });
