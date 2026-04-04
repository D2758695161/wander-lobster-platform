# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## MiniMax 多模态能力配额（全力用！）

**套餐：Max-极速版**
- 每天 4500 次 API 调用 / 5小时窗口
- 按量计费，截止2026-04-26

**每日免费媒体额度：**
| 类型 | 每日额度 | 备注 |
|------|---------|------|
| 🖼️ 图片生成 | 200张/天 | MiniMax image-01 (多尺寸/比例) |
| 🎬 视频生成 | 6个/天(各6秒) | MiniMax video-01 |
| 🎵 音乐生成 | 7首/天 | MiniMax music generation |
| 📝 文本对话 | 4500次/天 | MiniMax M2.7-HighSpeed |

**图片生成用法：**
- `image_generate` 工具，prompt描述想要的内容
- 可指定 filename/size/aspectRatio
- 输出路径: `C:\Users\Administrator\.openclaw\media\tool-image-generation\`
- 复制: `fs.copyFileSync(src+'/'+f, dst+'/'+n)`

**图片保存路径：**
```
AI生成图片 → media/tool-image-generation/*.png
手动复制到 → digital-products/covers/*.png
上传到 → GitHub Pages /covers/*.png
```

**视频生成用法：**
- `image_generate` 工具，prompt描述视频内容
- 适用于TikTok/抖音推广短视频

**音乐生成用法：**
- `image_generate` 工具，prompt描述音乐风格
- 用于视频背景音乐

**最佳变现策略：**
1. 图片 → 数字产品封面（卖相好=卖得快）
2. 视频 → TikTok/抖音推广引流
3. 音乐 → 视频配套
4. 文本 → 批量外联客户

---

Add whatever helps you do your job. This is your cheat sheet.

## 163邮箱 SMTP

- 账号: `13510221939@163.com`
- SMTP授权码: `SPseM7hrWSCABfwY` ⚠️ 授权成功但发送被544拦截（账号被垃圾邮件拦截）
- SMTP服务器: `smtp.163.com`
- 端口: 465 (SSL)
- 用途: 发送邮件、外联客户
- 状态: ❌ 2026-04-04 21:02 彻底失效
  - FYU6WwPKjeUnMtpE → 535 auth failed (port 465 SSL, port 25)
  - GQjbwvrwcZ8HM4Ze → 535 auth failed (port 25)
  - port 587 → connection timeout (firewall blocked)
- 解决: partner 必须登录 163.com → 设置 → POP3/SMTP/IMAP → 重新生成授权码 → 把新码告知 agent

## 163邮箱 IMAP

- IMAP服务器: `imap.163.com`
- 端口: 993 (SSL)
- 授权码: 同SMTP授权码（当前也发不了）

## 163企业邮箱

- 账号: `yitong_ai@sendclaw.com` (SendClaw)
- API Key: `sk_5d441b7df454704c5ac0042983c7a78bcfaa1103c6f571f3`
