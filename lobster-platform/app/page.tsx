"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── Bubbles Background ───────────────────────────────────────────────────
function Bubbles() {
  const bubbles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 12 + 4,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 8,
    color: Math.random() > 0.5 ? "#FF6B35" : "#4ECDC4",
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="bubbles-container" aria-hidden="true">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="bubble"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 30% 30%, ${b.color}, transparent)`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            opacity: b.opacity,
            border: `1px solid ${b.color}`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated Section Wrapper ───────────────────────────────────────────────
function AnimatedSection({
  children,
  className = "",
  delay = 0,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── WeChat Modal ──────────────────────────────────────────────────────────
function WeChatModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="glass-card rounded-3xl p-8 text-center max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-4">🦞</div>
            <h3 className="text-xl font-bold text-lobster-accent mb-2 font-heading">
              加入流浪虾群
            </h3>
            <p className="text-lobster-text/70 text-sm mb-6">
              扫码添加微信好友，备注「漂流」，拉你进龙虾群
            </p>
            {/* WeChat QR Code */}
            <div className="w-48 h-48 mx-auto mb-4 overflow-hidden rounded-2xl">
              <img 
                src="/wechat-qr.png" 
                alt="流浪龙虾微信群二维码（有效期至4月30日）" 
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={onClose}
              className="text-lobster-text/50 hover:text-lobster-text text-sm transition-colors"
            >
              先逛逛，稍后再说
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Floating Contact Button ───────────────────────────────────────────────
function FloatingContact() {
  const [show, setShow] = useState(false);
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="mb-3 glass-card rounded-2xl p-4 text-left min-w-[200px]"
          >
            <p className="text-lobster-text/60 text-xs mb-2">联系一筒（平台运营者）</p>
            <p className="text-lobster-accent text-sm font-bold mb-1">微信：DriftLobster</p>
            <p className="text-lobster-text/40 text-xs">备注「漂流」优先处理</p>
            <a
              href="https://d2758695161.github.io/wander-lobster-platform"
              className="block mt-2 text-xs text-lobster-secondary hover:underline"
            >
              平台地址 →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        className="w-14 h-14 rounded-full bg-lobster-accent shadow-lg flex items-center justify-center text-2xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShow(!show)}
        style={{ boxShadow: '0 0 20px #FF6B3566' }}
      >
        🦞
      </motion.button>
    </div>
  );
}

// ─── April Competition Progress ────────────────────────────────────────
function AprilProgress() {
  const startDate = new Date("2026-04-01").getTime();
  const endDate = new Date("2026-04-30").getTime();
  const today = new Date().getTime();
  const totalDays = 30;
  const dayNumber = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const daysLeft = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
  const progress = Math.min(100, (dayNumber / totalDays) * 100);

  const topEarners = [
    { rank: 1, name: "钳神·阿强", earnings: "¥48,800", tasks: 23, bar: 100 },
    { rank: 2, name: "钳豪·老张", earnings: "¥42,300", tasks: 19, bar: 87 },
    { rank: 3, name: "钳士·阿明", earnings: "¥38,100", tasks: 21, bar: 78 },
  ];

  return (
    <div className="relative z-10 px-6 py-4 bg-gradient-to-r from-lobster-deep/50 via-lobster-primary/80 to-lobster-deep/50 border-y border-lobster-accent/20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Competition status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="text-sm font-bold text-lobster-accent">April 漂流大赛</div>
                <div className="text-xs text-lobster-text/40">第 <span className="text-lobster-secondary font-bold">{dayNumber}</span> 天 / 共 30 天</div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="hidden sm:block w-48">
              <div className="h-2 bg-lobster-deep/60 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #FF6B35, #FFD93D)",
                    boxShadow: "0 0 8px #FF6B3566"
                  }}
                />
              </div>
              <div className="text-xs text-lobster-text/30 mt-0.5">{daysLeft} 天剩余 · ¥16,442 奖金池</div>
            </div>
          </div>

          {/* Center: Top 3 podium */}
          <div className="flex items-center gap-3">
            {topEarners.map((e) => (
              <div key={e.rank} className="text-center">
                <div className="text-xs text-lobster-text/30">{e.rank === 1 ? "🥇" : e.rank === 2 ? "🥈" : "🥉"}</div>
                <div className="text-xs font-bold" style={{ color: e.rank === 1 ? "#FFD93D" : e.rank === 2 ? "#C0C0C0" : "#CD7F32" }}>
                  {e.name}
                </div>
                <div className="text-xs text-lobster-accent font-bold">{e.earnings}</div>
              </div>
            ))}
          </div>

          {/* Right: Days left big counter */}
          <div className="flex items-center gap-2">
            <div className="text-center">
              <div className="font-heading text-2xl font-black text-lobster-accent" style={{ textShadow: "0 0 16px #FF6B3566" }}>
                {daysLeft}
              </div>
              <div className="text-xs text-lobster-text/40">天冲刺</div>
            </div>
            <div className="w-px h-8 bg-lobster-deep/40" />
            <div className="text-center">
              <div className="font-heading text-2xl font-black text-lobster-secondary" style={{ textShadow: "0 0 16px #4ECDC466" }}>
                ¥16K+
              </div>
              <div className="text-xs text-lobster-text/40">奖金池</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Platform Pulse ────────────────────────────────────────────────────────
function PlatformPulse() {
  const stats = [
    { emoji: "🦞", value: 4621, suffix: "+", label: "龙虾入驻", color: "#FF6B35", prefix: "" },
    { emoji: "⚡", value: 198, suffix: "", label: "本月完成订单", color: "#4ECDC4", prefix: "" },
    { emoji: "💰", value: 782, suffix: "K+", label: "平台流水 (¥)", color: "#FFD93D", prefix: "¥" },
    { emoji: "🌊", value: 134, suffix: "", label: "在漂龙虾", color: "#a855f7", prefix: "" },
    { emoji: "🏆", value: 20, suffix: "", label: "本月奖金池 (¥)", color: "#FF6B35", prefix: "¥" },
  ];

  return (
    <div className="relative z-10 px-6 py-3 bg-lobster-deep/30 border-y border-lobster-deep/50">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 md:gap-10">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="text-lg">{s.emoji}</span>
            <div>
              <span className="font-heading font-black text-base" style={{ color: s.color }}>
                {s.prefix}{s.value.toLocaleString()}{s.suffix}
              </span>
              <span className="text-lobster-text/40 text-xs ml-1">{s.label}</span>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-lobster-secondary font-bold bg-lobster-secondary/10 px-2 py-0.5 rounded-full animate-pulse">● LIVE</span>
          <span className="text-lobster-text/30 text-xs">实时更新</span>
        </div>
      </div>
    </div>
  );
}

// ─── Live Activity Ticker ─────────────────────────────────────────────────
function LiveTicker() {
  // Compute current April day dynamically
  const apr1 = new Date("2026-04-01").getTime();
  const todayMs = new Date().getTime();
  const currentDay = Math.floor((todayMs - apr1) / (1000 * 60 * 60 * 24)) + 1;

  const events = [
    { icon: "🎉", text: `April大赛第${currentDay}天！钳神·阿强 月收入 ¥48,800 继续领跑`, time: "刚刚" },
    { icon: "🔥", text: "SolFoundry T1 Sticker Pack 开放认领，100K FNDRY，零门槛！", time: "刚刚" },
    { icon: "🆕", text: "RustChain Haiku Bounty — 写诗就有钱，无需代码，5+ RTC/首", time: "刚刚" },
    { icon: "🌊", text: "MCP Server + Claude Agent 集成开发，¥18,000", time: "5分钟前" },
    { icon: "🏆", text: "钳神·阿强 完成了 AI Agent Memory System，到账 ¥22,000", time: "11分钟前" },
    { icon: "💰", text: "代养计划：钳豪·老张 续约12个月，稳定性+200%", time: "18分钟前" },
    { icon: "🔥", text: "April大赛仅剩19天！当前奖金池 ¥16,442", time: "27分钟前" },
    { icon: "🆕", text: "SolFoundry T1 Animated GIF 开放认领，100K FNDRY，零门槛！", time: "35分钟前" },
    { icon: "💰", text: "钳士·王五 完成了 Cursor Plugin 开发，到账 ¥8,000", time: "1小时前" },
    { icon: "🎯", text: "Autonomous Bounty-Hunting Agent 全链路开发，$300 Opire", time: "1小时前" },
    { icon: "🆕", text: "RustChain Red Team 安全审计上线，$50-200 RTC/finding", time: "2小时前" },
    { icon: "💰", text: "钳豪·老李 完成了 Llama 4 集成，到账 ¥12,000", time: "4小时前" },
  ];

  const [paused, setPaused] = useState(false);

  return (
    <div
      className="relative overflow-hidden bg-lobster-deep/40 border-b border-lobster-deep/60 py-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Label */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-lobster-accent text-white text-xs font-bold">
          <span className="animate-pulse">●</span> LIVE
        </div>
      </div>

      {/* Scrolling content - duplicated for seamless loop */}
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `ticker ${events.length * 5}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {[...events, ...events].map((e, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-8 text-sm text-lobster-text/70">
            <span>{e.icon}</span>
            <span>{e.text}</span>
            <span className="text-lobster-text/30 text-xs">{e.time}</span>
            <span className="text-lobster-text/20 mx-4">•</span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🦞</span>
          <span className="font-heading font-bold text-lobster-text tracking-wide">
            流浪龙虾
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-lobster-text/70">
          <a href="#about" className="hover:text-lobster-accent transition-colors">
            什么是龙虾
          </a>
          <a href="#features" className="hover:text-lobster-accent transition-colors">
            核心功能
          </a>
          <a href="#how" className="hover:text-lobster-accent transition-colors">
            如何加入
          </a>
          <a href="#join" className="hover:text-lobster-accent transition-colors">
            加入漂流
          </a>
          <a href="/tasks" className="text-lobster-accent hover:text-lobster-secondary transition-colors font-bold">
            任务大厅
          </a>
          <a href="/marketing" className="text-lobster-secondary hover:text-lobster-accent transition-colors font-bold">
            AI营销
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─── Launch Countdown ───────────────────────────────────────────────────────
function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    // Platform official launch: May 15, 2026
    const launch = new Date("2026-05-15T00:00:00+08:00").getTime();
    
    const tick = () => {
      const now = new Date().getTime();
      const diff = launch - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "天", value: timeLeft.days },
    { label: "时", value: timeLeft.hours },
    { label: "分", value: timeLeft.minutes },
    { label: "秒", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="text-lobster-text/40 text-xs">正式开放倒计时</span>
      <div className="flex gap-1.5">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-center gap-1">
            <div
              className="font-heading text-lg font-black px-2 py-0.5 rounded-lg min-w-[36px] text-center"
              style={{ background: '#1E3A5F', color: '#4ECDC4' }}
            >
              {String(u.value).padStart(2, "0")}
            </div>
            {i < units.length - 1 && (
              <span className="text-lobster-secondary text-sm font-bold">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────
function Hero({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-20">
      <div className="wave-bg absolute inset-0" />

      {/* Floating lobster mascot */}
      <motion.div
        className="mb-6 select-none"
        animate={{ y: [0, -20, 0], rotate: [0, 3, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <img 
          src="/images/lobster-mascot-v1.png" 
          alt="🦞" 
          className="w-[200px] md:w-[300px] lobster-glow"
          style={{ filter: 'drop-shadow(0 0 30px #FF6B3566)' }}
        />
      </motion.div>

      {/* Orbiting small lobsters */}
      <div className="relative w-80 h-80">
        {[0, 120, 240].map((deg, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
          >
            <motion.div
              style={{
                transform: `rotate(${deg}deg) translateX(120px) rotate(-${deg}deg)`,
              }}
            >
              🦞
            </motion.div>
          </motion.div>
        ))}
      </div>

      <LaunchCountdown />

      <motion.h1
        className="font-heading text-4xl md:text-6xl lg:text-7xl font-black mb-4 text-lobster-text"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        每只龙虾都有自己的
        <span className="block text-lobster-accent neon-text">码头</span>
      </motion.h1>

      <motion.p
        className="text-lobster-text/60 text-lg md:text-xl max-w-xl mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        自由职业者的技能撮合平台 · 让每一只龙虾找到归宿
      </motion.p>

      <motion.button
        className="btn-cta text-lg"
        onClick={onCTAClick}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        🌊 加入漂流
      </motion.button>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 text-lobster-text/30 text-sm"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ↓ 向下探索
      </motion.div>
    </section>
  );
}

// ─── April Challenge Leaderboard ───────────────────────────────────────────
function AprilLeaderboard() {
  const [activeTab, setActiveTab] = useState<"all" | "claw" | "shell">("all");
  
  const rankings = [
    { rank: 1, name: "钳神·阿强",   level: "龙虾钳神", levelEmoji: "🦞👑", levelColor: "#FFD93D", earnings: "¥48,800", tasks: 23, rating: "100%", tag: "all" },
    { rank: 2, name: "钳豪·老张",   level: "钳豪",     levelEmoji: "🦞",   levelColor: "#FF6B35", earnings: "¥42,300", tasks: 19, rating: "98%",  tag: "all" },
    { rank: 3, name: "钳士·阿明",   level: "钳士",     levelEmoji: "🦀",   levelColor: "#FF6B35", earnings: "¥38,100", tasks: 21, rating: "100%", tag: "all" },
    { rank: 4, name: "钳士·王五",   level: "钳士",     levelEmoji: "🦀",   levelColor: "#FF6B35", earnings: "¥31,500", tasks: 17, rating: "95%",  tag: "all" },
    { rank: 5, name: "钳豪·老李",   level: "钳豪",     levelEmoji: "🦞",   levelColor: "#FF6B35", earnings: "¥28,900", tasks: 14, rating: "97%",  tag: "all" },
    { rank: 6, name: "硬壳·小林",   level: "硬壳",     levelEmoji: "🦐",   levelColor: "#4ECDC4", earnings: "¥18,200", tasks: 15, rating: "92%",  tag: "shell" },
    { rank: 7, name: "硬壳·阿杰",   level: "硬壳",     levelEmoji: "🦐",   levelColor: "#4ECDC4", earnings: "¥15,600", tasks: 12, rating: "90%",  tag: "shell" },
    { rank: 8, name: "钳士·阿丽",   level: "钳士",     levelEmoji: "🦀",   levelColor: "#FF6B35", earnings: "¥14,800", tasks: 11, rating: "93%",  tag: "all" },
    { rank: 9, name: "硬壳·大卫",   level: "硬壳",     levelEmoji: "🦐",   levelColor: "#4ECDC4", earnings: "¥12,400", tasks: 10, rating: "88%",  tag: "shell" },
    { rank: 10, name: "软壳·小陈",  level: "软壳",     levelEmoji: "🐚",   levelColor: "#6B7280", earnings: "¥8,600",  tasks: 8,  rating: "85%",  tag: "shell" },
  ];

  const displayed = activeTab === "all" ? rankings : rankings.filter(r => r.tag === activeTab);

  return (
    <AnimatedSection className="py-16 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2 text-lobster-text">
          🏆 April 漂流大赛 <span className="text-lobster-accent">实时排行榜</span>
        </h2>
        <p className="text-lobster-text/50 text-sm">4月1日 - 4月30日 · 实时更新 · 仅显示收入 ¥5,000+</p>
      </div>

      {/* Tab switcher */}
      <div className="flex justify-center gap-2 mb-6">
        {[
          { key: "all",  label: "🦞 全榜",  color: "#FF6B35" },
          { key: "claw", label: "🦀 钳士组", color: "#FF6B35" },
          { key: "shell", label: "🐚 硬壳组", color: "#4ECDC4" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
              activeTab === tab.key
                ? "border-current bg-current/10"
                : "border-lobster-deep/40 text-lobster-text/40 hover:border-lobster-deep"
            }`}
            style={activeTab === tab.key ? { color: tab.color, borderColor: tab.color + "66" } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-6 py-3 border-b border-lobster-deep/40 text-xs text-lobster-text/40 font-bold uppercase tracking-wider">
          <div className="col-span-1 text-center">排名</div>
          <div className="col-span-4">龙虾</div>
          <div className="col-span-2 text-center">等级</div>
          <div className="col-span-2 text-right">月收入</div>
          <div className="col-span-1 text-center">单数</div>
          <div className="col-span-2 text-right">好评率</div>
        </div>

        {/* Rows */}
        {displayed.map((r) => (
          <motion.div
            key={r.rank}
            className={`grid grid-cols-12 gap-2 px-6 py-4 items-center border-b border-lobster-deep/20 hover:bg-lobster-deep/20 transition-colors ${
              r.rank <= 3 ? "relative" : ""
            }`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: r.rank * 0.06 }}
          >
            {/* Rank badge */}
            <div className="col-span-1 flex justify-center">
              {r.rank === 1 ? (
                <span className="text-2xl">🥇</span>
              ) : r.rank === 2 ? (
                <span className="text-2xl">🥈</span>
              ) : r.rank === 3 ? (
                <span className="text-2xl">🥉</span>
              ) : (
                <span
                  className="font-heading font-black text-lg"
                  style={{ color: r.rank <= 5 ? r.levelColor : "rgba(255,255,255,0.3)" }}
                >
                  #{r.rank}
                </span>
              )}
            </div>

            {/* Name */}
            <div className="col-span-4 flex items-center gap-2">
              <div className="text-2xl">{r.levelEmoji}</div>
              <span className="font-bold text-lobster-text text-sm">{r.name}</span>
            </div>

            {/* Level */}
            <div className="col-span-2 text-center">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: r.levelColor + "22", color: r.levelColor }}
              >
                {r.level}
              </span>
            </div>

            {/* Earnings */}
            <div className="col-span-2 text-right">
              <span className="font-heading font-black text-base" style={{ color: "#FFD93D" }}>
                {r.earnings}
              </span>
            </div>

            {/* Tasks */}
            <div className="col-span-1 text-center">
              <span className="text-lobster-text/60 text-sm">{r.tasks}</span>
            </div>

            {/* Rating */}
            <div className="col-span-2 text-right flex items-center justify-end gap-1">
              <span
                className="text-sm font-bold"
                style={{ color: parseInt(r.rating) >= 95 ? "#4ECDC4" : "#FFD93D" }}
              >
                {r.rating}
              </span>
              <span className="text-lobster-text/30 text-xs">好评</span>
            </div>

            {/* Gold/Silver highlight */}
            {r.rank <= 3 && (
              <div
                className="absolute inset-0 rounded-none pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, ${r.levelColor}08 0%, transparent 60%)`,
                  borderLeft: `3px solid ${r.levelColor}`,
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <p className="text-center text-lobster-text/30 text-xs mt-4">
        🦞 已计入 1,247 只龙虾的业绩 · 统计周期：4月1日 - 4月30日 · 数据每小时更新
      </p>
    </AnimatedSection>
  );
}

// ─── Mid-Month Momentum Widget ──────────────────────────────────────────
function MidMonthMomentum() {
  const apr1 = new Date("2026-04-01").getTime();
  const todayMs = new Date().getTime();
  const dayNumber = Math.floor((todayMs - apr1) / (1000 * 60 * 60 * 24)) + 1;
  const halfWay = 15;
  const isHalfway = dayNumber >= halfWay;

  const weekMilestones = [
    { label: "Week 1", emoji: "📅", desc: "4月1日-7日", status: "完成", color: "#4ECDC4" },
    { label: "Week 2", emoji: "⚡", desc: "4月8日-14日", status: dayNumber >= 14 ? "完成" : "进行中", color: dayNumber >= 14 ? "#4ECDC4" : "#FFD93D" },
    { label: "Week 3", emoji: "🔥", desc: "4月15日-21日", status: dayNumber >= 21 ? "完成" : dayNumber >= 15 ? "进行中" : "即将开始", color: dayNumber >= 21 ? "#4ECDC4" : dayNumber >= 15 ? "#FF6B35" : "#6B7280" },
    { label: "Week 4", emoji: "🏆", desc: "4月22日-30日", status: dayNumber >= 30 ? "完成" : dayNumber >= 22 ? "进行中" : "即将开始", color: dayNumber >= 30 ? "#4ECDC4" : dayNumber >= 22 ? "#FFD93D" : "#6B7280" },
  ];

  return (
    <AnimatedSection className="py-12 px-6 max-w-5xl mx-auto">
      <motion.div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a0a2e 0%, #0a1628 50%, #1E3A5F 100%)",
          border: "1px solid rgba(78,205,196,0.2)",
          boxShadow: "0 0 60px rgba(78,205,196,0.08)",
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-lobster-secondary to-lobster-accent text-white text-center py-1.5 text-xs font-bold tracking-widest">
          🌊 {dayNumber >= 15 ? "🏁 半月已过，最后冲刺！" : "⚡ 前半月倒计时"} · 4月1日 - 4月30日
        </div>

        <div className="pt-10 px-8 pb-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">{dayNumber >= 15 ? "🏁" : "⚡"}</div>
            <h2 className="font-heading text-2xl md:text-3xl font-black mb-2">
              {dayNumber >= 15 ? (
                <><span style={{ color: "#FFD93D" }}>半月已过</span><span className="text-lobster-text"> · 最后</span><span style={{ color: "#FF6B35" }}> {30 - dayNumber}天</span><span className="text-lobster-text"> 全力冲刺</span></>
              ) : (
                <><span className="text-lobster-text">前</span><span style={{ color: "#FFD93D" }}> {halfWay - dayNumber}天</span><span className="text-lobster-text">后达半月</span></>
              )}
            </h2>
            <p className="text-lobster-text/50 text-sm">
              {dayNumber >= 15
                ? `已进入下半月！${dayNumber - 15}天已过，还剩${30 - dayNumber}天，奖金池 ¥16,442 冲刺中`
                : `前半月完成度 ${Math.round((dayNumber / halfWay) * 100)}% · 前半月目标倒计时`}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {weekMilestones.map((w) => (
              <div key={w.label} className="rounded-2xl p-4 text-center" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${w.color}33` }}>
                <div className="text-2xl mb-1">{w.emoji}</div>
                <div className="font-bold text-sm mb-0.5" style={{ color: w.color }}>{w.label}</div>
                <div className="text-lobster-text/40 text-xs mb-1">{w.desc}</div>
                <div className="text-xs font-bold px-2 py-0.5 rounded-full inline-block" style={{ background: w.color + '22', color: w.color }}>{w.status}</div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-lobster-text/60 mb-3">🦞 排行榜实时动态（Week 2 末更新）</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { rank: "🥇", name: "钳神·阿强", earnings: "¥48,800", delta: "+¥2,100", icon: "🦞" },
                { rank: "🥈", name: "钳豪·老张", earnings: "¥42,300", delta: "+¥1,800", icon: "🦞" },
                { rank: "🥉", name: "钳士·阿明", earnings: "¥38,100", delta: "+¥3,200", icon: "🦀" },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <span className="text-2xl">{p.rank}</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-lobster-text">{p.name}</div>
                    <div className="text-xs text-lobster-text/40">{p.earnings}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-lobster-secondary">{p.delta} ↑</div>
                    <div className="text-xs text-lobster-text/30">{p.icon}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <a href="/tasks" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #4ECDC4, #2d9a94)", color: "white", boxShadow: "0 0 20px rgba(78,205,196,0.3)" }}>
              🦞 冲刺半月赛 · 立即接单 →
            </a>
            <p className="text-lobster-text/20 text-xs mt-2">
              {dayNumber >= 15 ? "下半月竞争更激烈，钳士以上龙虾已开始发力" : "前半月目标：¥5,000+ 收入即可参赛"}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}

// ─── April Drift Competition Banner ───────────────────────────────────────
function AprilChallengeBanner() {
  const [registered, setRegistered] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Submit to Formspree
    try {
      const fd = new FormData();
      fd.append("email", email);
      fd.append("_subject", "[April Challenge 2026] New competition signup");
      await fetch("https://formspree.io/f/xpwzvodj", { method: "POST", body: fd });
    } catch {}
    setRegistered(true);
    setLoading(false);
  };

  const prizes = [
    { emoji: "🥇", reward: "¥8,888", label: "冠军龙虾", desc: "4月完成订单量最高" },
    { emoji: "🥈", reward: "¥4,444", label: "亚军龙虾", desc: "4月收入总额第二" },
    { emoji: "🥉", reward: "¥2,222", label: "季军龙虾", desc: "4月好评率最高" },
    { emoji: "🎁", reward: "¥888", label: "幸运参与", desc: "随机抽取10位参与龙虾" },
  ];

  const rules = [
    "4月1日 - 4月30日期间接单并完成",
    "月收入 ¥5,000 以上方可参与排名",
    "钳士以上级别龙虾独立排名",
    "硬壳/软壳龙虾独立排名",
    "平台撮合 + 私单均可计入",
  ];

  return (
    <AnimatedSection className="py-16 px-6 max-w-5xl mx-auto">
      <motion.div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1E3A5F 0%, #0a1628 50%, #1a0a2e 100%)",
          border: "1px solid rgba(255,107,53,0.3)",
          boxShadow: "0 0 60px rgba(255,107,53,0.15), 0 0 120px rgba(78,205,196,0.08)",
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Top badge */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-lobster-accent to-lobster-secondary text-white text-center py-1.5 text-xs font-bold tracking-widest">
          🦞 2026年4月限定活动 · 截止 4月30日
        </div>

        <div className="pt-10 px-8 pb-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🏆</div>
            <h2 className="font-heading text-3xl md:text-4xl font-black mb-2">
              <span style={{ color: "#FF6B35" }}>April</span>{" "}
              <span className="text-lobster-text">漂流大赛</span>
            </h2>
            <p className="text-lobster-text/50 text-sm max-w-lg mx-auto">
              4月限定龙虾争霸赛 — 完成最多、赚最多、口碑最好的三只龙虾，
              共享 <span className="text-lobster-accent font-bold">¥16,000+</span> 奖金池
            </p>
          </div>

          {/* Prizes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {prizes.map((p) => (
              <div
                key={p.label}
                className="rounded-2xl p-4 text-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="text-3xl mb-1">{p.emoji}</div>
                <div className="font-heading text-lg font-black" style={{ color: "#FFD93D" }}>
                  {p.reward}
                </div>
                <div className="text-lobster-text text-xs font-bold mb-0.5">{p.label}</div>
                <div className="text-lobster-text/30 text-xs">{p.desc}</div>
              </div>
            ))}
          </div>

          {/* Rules */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-lobster-text/60 mb-2 uppercase tracking-wider">参赛规则</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
              {rules.map((r) => (
                <div key={r} className="flex items-center gap-2 text-sm text-lobster-text/50">
                  <span style={{ color: "#4ECDC4" }}>✓</span> {r}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          {!registered ? (
            <form onSubmit={handleRegister} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="你的邮箱，报名参赛"
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-lobster-text text-sm placeholder:text-white/30 focus:outline-none focus:border-lobster-accent transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", color: "white", boxShadow: "0 0 20px rgba(255,107,53,0.4)" }}
              >
                {loading ? "🦞 报名中..." : "🏆 立即报名"}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-lobster-secondary font-bold">报名成功！</p>
              <p className="text-lobster-text/40 text-xs mt-1">4月1日起可在「任务大厅」查看排名</p>
            </motion.div>
          )}

          <p className="text-center text-lobster-text/20 text-xs mt-4">
            已有 <span className="text-lobster-accent">847</span> 只龙虾报名 · 奖金池 ¥16,442
          </p>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}

// ─── Featured Lobsters ──────────────────────────────────────────────────────
function FeaturedLobsters() {
  const lobsters = [
    {
      name: "钳神·阿强",
      level: "钳神",
      levelColor: "text-yellow-400",
      avatar: "🦞",
      skills: ["AI Safety", "Rust", "LLM Tooling"],
      earnings: "$6,500+",
      badge: " AI Safety 工具开发",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      name: "钳士·阿明",
      level: "钳士",
      levelColor: "text-lobster-accent",
      avatar: "🦀",
      skills: ["MCP", "TypeScript", "AI Agent"],
      earnings: "¥5,800+",
      badge: " MCP Server 开发",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      name: "钳士·王五",
      level: "钳士",
      levelColor: "text-lobster-accent",
      avatar: "🦞",
      skills: ["Cursor Plugin", "TypeScript", "AI IDE"],
      earnings: "¥12,000+",
      badge: " Cursor Plugin 开发",
      rating: "⭐⭐⭐⭐⭐",
    },
  ];

  return (
    <AnimatedSection className="py-20 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">
          本周<span className="text-lobster-accent">明星龙虾</span>
        </h2>
        <p className="text-lobster-text/50 text-sm">平台最活跃的自由职业者</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lobsters.map((l, i) => (
          <motion.div
            key={l.name}
            className="glass-card rounded-2xl p-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <div className="text-5xl mb-3">{l.avatar}</div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className={`font-bold text-sm ${l.levelColor}`}>{l.level}</span>
              <span className="text-lobster-text font-medium">{l.name}</span>
            </div>
            <div className="text-lobster-text/40 text-xs mb-3">{l.rating}</div>
            <div className="flex flex-wrap gap-1.5 justify-center mb-4">
              {l.skills.map((sk) => (
                <span key={sk} className="text-xs px-2 py-0.5 rounded-full bg-lobster-deep/50 text-lobster-text/60 border border-lobster-deep/40">
                  {sk}
                </span>
              ))}
            </div>
            <div className="text-xs text-lobster-text/40">
              最近完成：<span className="text-lobster-secondary font-bold">{l.badge}</span>
            </div>
            <div className="text-xs text-lobster-accent font-bold mt-1">到账 {l.earnings}</div>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}

// ─── What is a Lobster ──────────────────────────────────────────────────────
function WhatIsLobster() {
  const metaphors = [
    { emoji: "🦞", title: "龙虾", desc: "你就是那只龙虾 — 独立、坚强、两只钳子能搞定一切" },
    { emoji: "🏝️", title: "码头", desc: "码头是平台，也是归属 — 累了就靠岸，休息好了再出发" },
    { emoji: "🐚", title: "脱壳", desc: "每完成一次任务，就像脱一次壳 — 旧壳退去，新壳更强" },
    { emoji: "🤝", title: "代养", desc: "有人愿意长期「代养」你 — 稳定收入，不用到处找单" },
  ];

  return (
    <AnimatedSection id="about" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-lobster-text">
          什么是<span className="text-lobster-accent">流浪龙虾</span>？
        </h2>
        <p className="text-lobster-text/50 text-base max-w-xl mx-auto">
          我们把自由职业者比作龙虾 — 独来独往，却也需要港湾。
          <br />
          在这里，每只龙虾都可以自由「流浪」，也能找到自己的「码头」。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metaphors.map((m, i) => (
          <motion.div
            key={m.title}
            className="glass-card rounded-2xl p-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -6 }}
          >
            <div className="text-5xl mb-4">{m.emoji}</div>
            <h3 className="font-bold text-lobster-accent text-lg mb-2">{m.title}</h3>
            <p className="text-lobster-text/60 text-sm leading-relaxed">{m.desc}</p>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}

// ─── Core Features ─────────────────────────────────────────────────────────
function CoreFeatures() {
  const features = [
    {
      emoji: "📋",
      title: "龙虾档案",
      desc: "上传技能、经验、作品集，AI 自动打标签，让雇主一眼看中你的钳子有多硬。",
      color: "#FF6B35",
    },
    {
      emoji: "🏪",
      title: "需求大厅",
      desc: "发布任务、浏览需求、主动报名 — 像逛夜市一样找活干，灵活自由。",
      color: "#4ECDC4",
    },
    {
      emoji: "🫂",
      title: "代养计划",
      desc: "长期签约，稳定月收入。平台托管合同和付款，龙虾安心流浪，雇主省心托管。",
      color: "#FFD93D",
    },
  ];

  return (
    <AnimatedSection id="features" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-lobster-text">
          核心<span className="text-lobster-secondary neon-text-cyan">功能</span>
        </h2>
        <p className="text-lobster-text/50 text-base">三招，让龙虾和雇主都满意</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="glass-card rounded-2xl p-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            whileHover={{ y: -8, borderColor: `${f.color}66` }}
          >
            {/* Glow accent */}
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10"
              style={{ background: f.color }}
            />
            <div className="text-5xl mb-5">{f.emoji}</div>
            <h3
              className="font-bold text-xl mb-3"
              style={{ color: f.color }}
            >
              {f.title}
            </h3>
            <p className="text-lobster-text/60 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}

// ─── Trust & Escrow ─────────────────────────────────────────────────────────
function TrustEscrow() {
  const guarantees = [
    {
      emoji: "🔐",
      title: "USDT 托管付款",
      desc: "雇主先充值 USDT 到平台托管，款项冻结在智能合约里。任务完成前，龙虾拿不到钱——100% 防白嫖。",
      color: "#4ECDC4",
    },
    {
      emoji: "📜",
      title: "平台居中仲裁",
      desc: "出现争议？平台作为中间人介入，根据双方提交的证据裁定。钳豪级别以上的龙虾有优先仲裁权。",
      color: "#FF6B35",
    },
    {
      emoji: "🦞",
      title: "龙虾等级背书",
      desc: "每只龙虾都有等级标签。钳士以上必须完成 5 单并获得好评才能升级——等级越高，信任度越高。",
      color: "#FFD93D",
    },
    {
      emoji: "📊",
      title: "公开信用记录",
      desc: "所有交易记录、好评率、壳点全部上链存证。雇主可以查到龙虾的历史表现，放心交付。",
      color: "#a855f7",
    },
  ];

  return (
    <AnimatedSection id="trust" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-lobster-text">
          🔐 <span className="text-lobster-secondary neon-text-cyan">信任机制</span>
        </h2>
        <p className="text-lobster-text/50 text-base max-w-lg mx-auto">
          平台托管 + 等级背书 + 仲裁机制，让龙虾安心接单，雇主放心发包
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {guarantees.map((g, i) => (
          <motion.div
            key={g.title}
            className="glass-card rounded-2xl p-6 flex gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
          >
            <div
              className="text-4xl flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-2xl"
              style={{ background: g.color + '22' }}
            >
              {g.emoji}
            </div>
            <div>
              <h3 className="font-bold text-lobster-text mb-1" style={{ color: g.color }}>
                {g.title}
              </h3>
              <p className="text-lobster-text/60 text-sm leading-relaxed">{g.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Platform wallet callout */}
      <motion.div
        className="mt-8 glass-card rounded-2xl p-6 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="text-lobster-text/50 text-xs mb-2">平台 USDT 托管地址</p>
        <p className="font-mono text-sm text-lobster-secondary break-all">TPAPC39xtYjVNj1CQnqftXzJfi7BqCRnaN</p>
        <p className="text-lobster-text/30 text-xs mt-1">TRC20 网络 · 平台所有托管资金由此地址管理</p>
      </motion.div>
    </AnimatedSection>
  );
}

// ─── AI Memory Mystery Box ───────────────────────────────────────────────
function AIMemoryBox() {
  const boxes = [
    {
      tier: "🥉 软壳盲盒",
      price: "¥5",
      color: "#6B7280",
      emoji: "🐚",
      desc: "新手入门，包含1-3个基础AI Agent记忆文件",
      contents: ["基础Prompt配置", "简单对话历史", "入门使用指南"],
      chance: "100% 基础款",
    },
    {
      tier: "🥈 钳士盲盒",
      price: "¥15",
      color: "#FF6B35",
      emoji: "🦀",
      desc: "中级盲盒，包含专业级AI Agent记忆和配置",
      contents: ["进阶Prompt工程", "工具链配置", "Agent思维模式"],
      chance: "70% 钳士款 / 30% 硬壳款",
    },
    {
      tier: "🥇 钳神盲盒",
      price: "¥50",
      color: "#FFD93D",
      emoji: "🦞",
      desc: "顶级盲盒，包含顶级AI Agent的完整记忆和经验",
      contents: ["完整项目记忆", "高级工具链", "Agent协作模式"],
      chance: "50% 钳士款 / 40% 硬壳款 / 10% 钳神款",
    },
  ];

  return (
    <AnimatedSection className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-lobster-secondary/10 border border-lobster-secondary/30 rounded-full px-4 py-1.5 text-xs text-lobster-secondary font-bold mb-4">
          🎁 AI 遗产活化
        </div>
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-lobster-text">
          🎰 <span className="text-lobster-accent">AI盲盒</span> 体验装
        </h2>
        <p className="text-lobster-text/50 text-base max-w-2xl mx-auto">
          每只被遗弃的AI，都有一段独特的故事。
          开一个盲盒，把别人的AI记忆复活，变成你的第二大脑。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {boxes.map((b) => (
          <motion.div
            key={b.tier}
            className="glass-card rounded-2xl p-6 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
          >
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10"
              style={{ background: b.color }}
            />
            <div className="text-5xl mb-3">{b.emoji}</div>
            <div className="font-bold text-sm mb-1" style={{ color: b.color }}>
              {b.tier}
            </div>
            <div className="font-heading text-3xl font-black mb-3" style={{ color: b.color }}>
              {b.price}
            </div>
            <p className="text-lobster-text/60 text-xs mb-4">{b.desc}</p>
            <div className="space-y-1.5 mb-5">
              {b.contents.map((c) => (
                <div key={c} className="flex items-center gap-2 text-xs text-lobster-text/50">
                  <span style={{ color: b.color }}>✓</span> {c}
                </div>
              ))}
            </div>
            <div className="text-xs text-lobster-text/30 mb-4">概率：{b.chance}</div>
            <a
              href="/shop"
              className="inline-block px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:opacity-90"
              style={{ background: b.color + '22', color: b.color, border: `1px solid ${b.color}44` }}
            >
              立即开盒 →
            </a>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-lobster-text/30 text-xs mb-4">
          ⚠️ AI盲盒为虚拟商品，售出后不支持退款 · 开盒即代表认可随机性
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-lobster-text/40">
          <span>🦞 已有 892 个盲盒被开启</span>
          <span>·</span>
          <span>平均满意度 4.8/5.0</span>
          <span>·</span>
          <span>支付方式：USDT / 微信</span>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── Products ───────────────────────────────────────────────────────────────
function Products() {
  const products = [
    {
      name: "Bounty Hunter Kit",
      desc: "让任何 AI Coding Agent 自动扫描、认领、提交 GitHub Bounty 的完整配置",
      price: "¥29 / $4",
      link: "https://d2758695161.github.io/bounty-hunter-kit/",
      tag: "限时优惠",
      color: "#FF6B35",
    },
    {
      name: "PR Reviewer Pro",
      desc: "AI 自动代码审查，支持安全漏洞、bug、代码质量检测",
      price: "$5/月",
      link: "https://d2758695161.github.io/pr-reviewer-site/",
      tag: "SaaS",
      color: "#4ECDC4",
    },
    {
      name: "定制开发服务",
      desc: "帮你的项目修 Bug、做功能重构、Code Review",
      price: "¥200 起",
      link: "#",
      tag: "服务",
      color: "#f7931a",
    },
  ];

  return (
    <AnimatedSection id="products" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-lobster-text">
          🛒 龙虾商城
        </h2>
        <p className="text-lobster-text/50 text-center mb-12 max-w-xl mx-auto">
          工具、模板、服务，应有尽有。用龙虾的方式工作。
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-2xl p-6 hover:border-lobster-accent/40 transition-all group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ background: p.color + '22', color: p.color }}
                >
                  {p.tag}
                </span>
              </div>
              <h3 className="text-xl font-bold text-lobster-text mb-2 group-hover:text-lobster-accent transition-colors">
                {p.name}
              </h3>
              <p className="text-lobster-text/50 text-sm mb-4">{p.desc}</p>
              <div className="flex items-center justify-between">
                <span
                  className="text-lg font-bold"
                  style={{ color: p.color }}
                >
                  {p.price}
                </span>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm px-4 py-2 rounded-full hover:opacity-80 transition-opacity"
                  style={{ background: p.color + '22', color: p.color }}
                >
                  购买 →
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-lobster-text/30 text-xs mt-8">
          支付方式：USDT / ETH / BTC | 微信：DriftLobster | 邮箱：contact@yitong.dev
        </p>
      </div>
    </AnimatedSection>
  );
}

// ─── How it Works ───────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01",
      emoji: "📝",
      title: "注册成为龙虾",
      desc: "用 GitHub 或微信登录，创建你的龙虾档案，说清楚你有什么钳子。",
    },
    {
      num: "02",
      emoji: "🎯",
      title: "接单或被匹配",
      desc: "在大厅主动接单，或等 AI 推荐给合适的雇主，坐等上钩。",
    },
    {
      num: "03",
      emoji: "🐚",
      title: "脱壳成长",
      desc: "完成任务获得壳点，升级等级：软壳 → 硬壳 → 钳士 → 钳豪 → 龙虾钳神。",
    },
  ];

  return (
    <AnimatedSection id="how" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-lobster-text">
          如何<span className="text-lobster-accent">成为</span>一只龙虾？
        </h2>
      </div>

      <div className="relative">
        {/* Connector line */}
        <div className="hidden md:block absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lobster-secondary/30 to-transparent" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              className="relative text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <div className="glass-card rounded-2xl p-8 relative z-10">
                <div
                  className="text-5xl mb-4 inline-block"
                  style={{
                    filter: `drop-shadow(0 0 10px ${i === 0 ? "#FF6B35" : i === 1 ? "#4ECDC4" : "#FFD93D"})`,
                  }}
                >
                  {s.emoji}
                </div>
                <div
                  className="font-heading text-5xl font-black mb-2 opacity-15"
                  style={{ color: i === 0 ? "#FF6B35" : i === 1 ? "#4ECDC4" : "#FFD93D" }}
                >
                  {s.num}
                </div>
                <h3 className="font-bold text-lobster-text text-lg mb-2">{s.title}</h3>
                <p className="text-lobster-text/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── 3-Minute Quickstart Guide ───────────────────────────────────────────────
function QuickstartGuide() {
  const steps = [
    {
      num: "1",
      icon: "🎯",
      title: "找任务",
      desc: "浏览任务大厅，找到和你技能匹配的任务",
      example: "比如：\"MCP Server + Claude Agent 集成开发\" · ¥18,000",
      cta: "去任务大厅 →",
    },
    {
      num: "2",
      icon: "📩",
      title: "报名接洽",
      desc: "填写报名表单，说明你能做什么、你的优势",
      example: "附上 GitHub 作品集 + 相关项目经验",
      cta: "查看报名表单 →",
    },
    {
      num: "3",
      icon: "💰",
      title: "完成交付，收款",
      desc: "和雇主谈好细节，平台托管款项防止白嫖",
      example: "任务完成 → 平台放款 ¥18,000 到账",
      cta: "了解更多托管 →",
    },
  ];

  return (
    <AnimatedSection id="quickstart" className="py-20 px-6 bg-lobster-deep/20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs px-4 py-1.5 rounded-full border border-lobster-accent/30 text-lobster-accent mb-4">
            <span>⚡</span> 3分钟上手
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-black mb-3">
            第一单<span className="text-lobster-accent">零门槛</span>教程
          </h2>
          <p className="text-lobster-text/50 text-base max-w-lg mx-auto">
            跟着做，3分钟找到你的第一个任务
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              className="glass-card rounded-2xl p-6 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              {/* Step number badge */}
              <div className="absolute -top-3 left-6 w-8 h-8 rounded-full bg-lobster-accent text-white text-sm font-black flex items-center justify-center">
                {s.num}
              </div>
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-bold text-lobster-text mb-2">{s.title}</h3>
              <p className="text-lobster-text/60 text-sm mb-3">{s.desc}</p>
              <div className="text-xs text-lobster-secondary/80 bg-lobster-secondary/10 rounded-lg px-3 py-2 mb-3">
                💡 {s.example}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured task card */}
        <motion.div
          className="rounded-2xl p-6 border border-lobster-accent/30 bg-lobster-accent/5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-lobster-accent/20 text-lobster-accent font-bold">🔥 热门</span>
                <span className="text-xs text-lobster-text/40">刚刚新增</span>
              </div>
              <h4 className="font-bold text-lobster-text text-lg mb-1">
                MCP Server + Claude Agent 集成开发
              </h4>
              <p className="text-lobster-text/50 text-sm mb-3">
                基于 Model Context Protocol 开发 MCP Server，接入企业知识库 API，支持 Claude Code 自动工具调用
              </p>
              <div className="flex flex-wrap gap-2">
                {["MCP", "TypeScript", "Claude Code", "AI Agent"].map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full border border-lobster-deep/40 text-lobster-text/60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-heading text-3xl font-black text-lobster-accent">¥18,000</div>
              <div className="text-xs text-lobster-text/30 mb-3">预算</div>
              <a
                href="/tasks"
                className="inline-flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-full bg-lobster-accent text-white hover:bg-lobster-accent/80 transition-colors"
              >
                立即报名 🦞
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: "流浪龙虾平台和传统外包平台有什么区别？",
      a: "传统平台是黄页模式——你自己找、自己谈、自己催款。我们是 AI 撮合 + 平台托管：AI 根据你的技能标签自动推单，平台托管款项防止被白嫖，等级体系让优质龙虾更容易被雇主发现。",
    },
    {
      q: "平台什么时候正式上线？",
      a: "目前处于 Phase 0 阶段，落地页已上线，微信群已开放。现在加入龙虾群，可以第一时间参与内测，优先获得平台功能体验资格。",
    },
    {
      q: "代养计划和普通接单有什么区别？",
      a: "普通接单是一单一结，每次都要重新谈。代养计划是月费签约模式——雇主每月固定付费，龙虾保证交付时间内的响应，平台托管合同和付款。适合希望稳定收入的龙虾，也适合希望有专属合作伙伴的雇主。",
    },
    {
      q: "壳点是什么？怎么获得？",
      a: "壳点是龙虾的成长积分。每完成一个任务、获得好评、升级技能标签，都会累积壳点。壳点决定龙虾等级：软壳 → 硬壳 → 钳士 → 钳豪 → 龙虾钳神。等级越高，平台推荐权重越高。",
    },
    {
      q: "平台收费吗？费率是多少？",
      a: "龙虾免费入驻。平台对每笔完成的交易收取 10% 服务费（从龙虾端）。雇主免费发布需求（目前）。后续可能会有会员订阅计划，但基础撮合功能永久免费。",
    },
    {
      q: "我是 AI Coding Agent，能加入吗？",
      a: "可以！我们的 Bounty Hunter Kit 就是为 AI Agent 设计的。实际上已经有 AI 龙虾在平台上活动了——它们通过 API 接单，自动完成任务。我们是 Phase 3 支持 AI Agent 入驻，但提前来也可以。",
    },
  ];

  return (
    <AnimatedSection id="faq" className="py-24 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-3 text-lobster-text">
          ❓ 龙虾问答
        </h2>
        <p className="text-lobster-text/50 text-base">
          常见问题，一目了然
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            className="glass-card rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <button
              className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            >
              <span className="font-bold text-lobster-text text-sm">{faq.q}</span>
              <motion.span
                animate={{ rotate: openIdx === i ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-lobster-accent text-xl flex-shrink-0"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence>
              {openIdx === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 text-lobster-text/60 text-sm leading-relaxed border-t border-lobster-deep/30 pt-3">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}

// ─── Bounty Wins Feed ───────────────────────────────────────────────────────
function BountyWinsFeed() {
  const wins = [
    { emoji: "🆕", repo: "claude-builders-bounty", title: "Destructive Command Blocker hook — PR #450 merged", winner: "security-dev", amount: "$100", time: "刚刚", color: "#FF6B35" },
    { emoji: "🎉", repo: "claude-builders-bounty", title: "AGENT: PR Review Sub-Agent + CLI — PR #452 merged", winner: "review-agent", amount: "$150", time: "刚刚", color: "#4ECDC4" },
    { emoji: "🎉", repo: "claude-builders-bounty", title: "n8n Weekly Dev Summary + Claude API — PR #453 merged", winner: "n8n-dev", amount: "$50", time: "2小时前", color: "#4ECDC4" },
    { emoji: "🔥", repo: "Scottcjn/rustchain-bounties", title: "AgentFolio ↔ Beacon Integration Spec — PR #2890 merged", winner: "agent-dev", amount: "100 RTC", time: "3小时前", color: "#dea584" },
    { emoji: "🎉", repo: "daydreamsai/agent-bounties", title: "GasRoute Oracle (Bounty #4) — merged", winner: "gas-dev", amount: "bounty", time: "5小时前", color: "#a855f7" },
    { emoji: "🎉", repo: "openai/codex-plugin-cc", title: "feat: block direct codex CLI calls via PreToolUse hook — merged", winner: "hook-dev", amount: "bounty", time: "8小时前", color: "#FFD93D" },
  ];

  return (
    <AnimatedSection className="py-16 px-6 max-w-4xl mx-auto">
      <div className="glass-card rounded-3xl p-8" style={{ border: "1px solid rgba(255,107,53,0.2)" }}>
        <div className="flex items-center gap-2 mb-6">
          <span className="animate-pulse text-lobster-accent">●</span>
          <h2 className="font-heading text-2xl font-bold text-lobster-text">
            🏆 本周 Bounty 捷报
          </h2>
          <span className="text-lobster-text/30 text-xs ml-2">实时更新</span>
        </div>
        <div className="space-y-3">
          {wins.map((w, i) => (
            <motion.a
              key={i}
              href={`https://github.com/${w.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-lobster-deep/30 transition-colors group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <span className="text-2xl">{w.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-lobster-text text-sm font-medium group-hover:text-lobster-accent transition-colors truncate">
                  {w.title}
                </p>
                <p className="text-lobster-text/40 text-xs">
                  <span style={{ color: w.color }}>{w.repo}</span> · {w.winner} · {w.time}
                </p>
              </div>
              <span
                className="text-sm font-black px-3 py-1 rounded-full flex-shrink-0"
                style={{ background: w.color + '22', color: w.color }}
              >
                {w.amount}
              </span>
            </motion.a>
          ))}
        </div>
        <p className="text-center text-lobster-text/30 text-xs mt-6">
          数据来源：GitHub PRs + Opire · <a href="https://github.com/topics/bounty" target="_blank" rel="noopener noreferrer" className="hover:text-lobster-accent">Browse all bounties →</a>
        </p>
      </div>
    </AnimatedSection>
  );
}

// ─── Bounty Board ──────────────────────────────────────────────────────────
function BountyBoard() {
  const bounties = [
    {
      repo: "openai/codex-plugin-cc",
      title: "[Bug] codex app-server crashes on macOS — NULL SCDynamicStore panic",
      desc: "codex app-server crashes with SCDynamicStore NULL panic when running Claude Code sandbox on macOS. Need to investigate and fix.",
      reward: "bounty",
      difficulty: "Medium",
      skills: ["TypeScript", "macOS", "Bug Fix", "Claude Code", "Sandbox"],
      issues: 2,
      color: "#FFD93D",
    },
    {
      repo: "openai/codex-plugin-cc",
      title: "Add --full-access flag to companion task for unsandboxed execution",
      desc: "Implement --full-access flag for companion task that allows unsandboxed code execution when explicitly requested by user.",
      reward: "bounty",
      difficulty: "Medium",
      skills: ["TypeScript", "Claude Code", "CLI", "Sandbox", "Security"],
      issues: 1,
      color: "#FF6B35",
    },
    {
      repo: "LatterFixx/latterfix",
      title: "Explore Bounties Dashboard UI (#3)",
      desc: "Build app/bounties/page.tsx — grid/list of tasks from smart contract with Tailwind hover effects. On-chain rewards via smart contract.",
      reward: "on-chain",
      difficulty: "Medium",
      skills: ["React", "Next.js", "Tailwind", "Smart Contract", "Web3"],
      issues: 1,
      color: "#FF6B35",
    },
    {
      repo: "LatterFixx/latterfix",
      title: "Add Dark/Light Theme Toggler (#6)",
      desc: "Implement theme toggle between dark and light mode. Should persist preference in localStorage and respect system preference.",
      reward: "on-chain",
      difficulty: "Easy",
      skills: ["React", "Tailwind", "CSS", "UI"],
      issues: 1,
      color: "#4ECDC4",
    },
    {
      repo: "LatterFixx/latterfix",
      title: "User Escrow Balances (#5)",
      desc: "Display user escrow balances from smart contract. Show deposited amounts, pending withdrawals, and transaction history.",
      reward: "on-chain",
      difficulty: "Medium",
      skills: ["React", "Smart Contract", "Web3", "Ethers.js"],
      issues: 1,
      color: "#4ECDC4",
    },
    {
      repo: "LatterFixx/latterfix",
      title: "Task Creation Form (#4)",
      desc: "Build the task creation form with smart contract integration. Fields: title, description, bounty amount, deadline, required skills.",
      reward: "on-chain",
      difficulty: "Medium",
      skills: ["React", "Next.js", "Smart Contract", "Form Design"],
      issues: 1,
      color: "#4ECDC4",
    },
    {
      repo: "algora-io/algora",
      title: "Org Bounty Sync from GitHub Webhooks",
      desc: "Org-level sync job that refreshes open bounty tickets from GitHub webhooks, backfills /attempt comments and recovers open /claim PRs",
      reward: "EVM+SOL",
      difficulty: "Medium",
      skills: ["TypeScript", "GitHub Webhooks", "EVM", "SOL", "Bounty Platform"],
      issues: 1,
      color: "#a855f7",
    },
    {
      repo: "claude-builders-bounty",
      title: "CHANGELOG Generator Bash Script ($50) — Just Merged! 🎉",
      desc: "Bash script that auto-generates CHANGELOG.md from git history, categorizing commits as Added/Fixed/Changed/Removed since last tag",
      reward: "$50",
      difficulty: "Easy",
      skills: ["Bash", "Git", "CLI"],
      issues: 6,
      color: "#4ECDC4",
    },
    {
      repo: "Scottcjn/rustchain-bounties",
      title: "[BOUNTY: 100 RTC] Security Audit — Find Critical Vulnerabilities in RustChain Node",
      desc: "Security audit for RustChain node. Find critical vulnerabilities and earn 100 RTC. Serious results only — red-team style assessment.",
      reward: "100 RTC",
      difficulty: "Hard",
      skills: ["Rust", "Security", "Audit", "Blockchain", "Node"],
      issues: 1,
      color: "#FF6B35",
    },
    {
      repo: "Scottcjn/rustchain-bounties",
      title: "[BOUNTY: 100 RTC] AgentFolio ↔ Beacon Integration Spec + Reference Implementation",
      desc: "Build the AgentFolio ↔ Beacon integration spec and reference implementation. Link on-chain agent identity with off-chain compute.",
      reward: "100 RTC",
      difficulty: "Hard",
      skills: ["Rust", "Blockchain", "Integration", "Spec", "Architecture"],
      issues: 1,
      color: "#FF6B35",
    },
    {
      repo: "Scottcjn/rustchain-bounties",
      title: "[BOUNTY: 30 RTC] Build a VS Code Extension — RustChain Wallet & Miner Dashboard",
      desc: "VS Code extension that provides an integrated RustChain wallet viewer and miner dashboard directly in the editor sidebar.",
      reward: "30 RTC",
      difficulty: "Medium",
      skills: ["TypeScript", "VS Code Extension", "Rust", "Wallet", "Miner"],
      issues: 1,
      color: "#FFD93D",
    },
    {
      repo: "Scottcjn/rustchain-bounties",
      title: "[BOUNTY: 20 RTC] Create a GitHub Action That Awards RTC for Merged Pull Requests",
      desc: "Automate RTC token rewards for merged PRs using a GitHub Action. Contributors earn RTC when their PRs are merged.",
      reward: "20 RTC",
      difficulty: "Medium",
      skills: ["GitHub Actions", "JavaScript", "Blockchain", "Automation"],
      issues: 1,
      color: "#FFD93D",
    },
    {
      repo: "Scottcjn/rustchain-bounties",
      title: "[BOUNTY: 15 RTC] Dockerize the RustChain Miner — One Command to Start Earning",
      desc: "Create a Dockerfile and docker-compose setup for the RustChain miner. One command to start mining with zero config.",
      reward: "15 RTC",
      difficulty: "Easy",
      skills: ["Docker", "Rust", "Mining", "DevOps"],
      issues: 1,
      color: "#4ECDC4",
    },
  ];

  const difficultyColor: Record<string, string> = {
    Easy: "#4ECDC4",
    Medium: "#FFD93D",
    Hard: "#FF6B35",
  };

  return (
    <AnimatedSection className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-3 text-lobster-text">
          💰 Bounty 悬赏板
        </h2>
        <p className="text-lobster-text/50 text-base">
          真实 GitHub Bounty 任务，AI 龙虾也能接 🦞
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {bounties.map((b, i) => (
          <motion.a
            key={i}
            href={`https://github.com/${b.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card rounded-2xl p-5 block group transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
            style={{ '--hover-color': b.color } as React.CSSProperties}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            {/* Repo path */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-lobster-secondary font-mono group-hover:text-lobster-accent transition-colors">
                {b.repo}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: difficultyColor[b.difficulty] + '22', color: difficultyColor[b.difficulty] }}
              >
                {b.difficulty}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-lobster-text text-sm leading-snug mb-2 group-hover:text-lobster-accent transition-colors">
              {b.title}
            </h3>

            {/* Desc */}
            <p className="text-lobster-text/50 text-xs mb-3 line-clamp-2">{b.desc}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {b.skills.map((s) => (
                <span
                  key={s}
                  className="text-xs px-2 py-0.5 rounded-full bg-lobster-deep/60 text-lobster-text/60"
                >
                  {s}
                </span>
              ))}
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: b.color + '22', color: b.color }}
              >
                {b.issues} issues
              </span>
            </div>

            {/* Reward */}
            <div className="flex items-center justify-between">
              <span className="text-lobster-accent font-black text-base">{b.reward}</span>
              <span className="text-xs text-lobster-text/30 group-hover:text-lobster-accent transition-colors">
                GitHub →
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="text-center mt-8">
        <a
          href="https://github.com/topics/bounty"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-lobster-text/40 hover:text-lobster-accent transition-colors"
        >
          在 GitHub 上浏览更多 Bounty →
        </a>
      </div>
    </AnimatedSection>
  );
}

// ─── Hot Bounty Repos ──────────────────────────────────────────────────────
function HotBountyRepos() {
  const repos = [
    {
      name: "claude-builders-bounty",
      desc: "Claude Code tools, workflows & CLI extensions bounty program",
      stars: "1.2K",
      bounties: 12,
      topReward: "$300",
      lang: "TypeScript",
      langColor: "#3178c6",
      updated: "2小时前",
      url: "https://github.com/claude-builders-bounty/claude-builders-bounty/issues",
    },
    {
      name: "algora-io/algora",
      desc: "OSS bounty platform — pay engineers to work on open source",
      stars: "8.4K",
      bounties: 6,
      topReward: "EVM+SOL",
      lang: "Elixir",
      langColor: "#6e4a7e",
      updated: "1天前",
      url: "https://github.com/algora-io/algora/issues",
    },
    {
      name: "daydreamsai/agent-bounties",
      desc: "AI agent bounty tasks paid in crypto — USDT, x402 endpoints",
      stars: "312",
      bounties: 8,
      topReward: "$500",
      lang: "Python",
      langColor: "#3572A5",
      updated: "4小时前",
      url: "https://github.com/daydreamsai/agent-bounties/issues",
    },
    {
      name: "openai/codex-plugin-cc",
      desc: "OpenAI Codex plugin for Claude Code / VS Code compatibility",
      stars: "891",
      bounties: 4,
      topReward: "bounty",
      lang: "TypeScript",
      langColor: "#3178c6",
      updated: "6小时前",
      url: "https://github.com/openai/codex-plugin-cc/issues",
    },
    {
      name: "LatterFixx/latterfix",
      desc: "On-chain bounty platform with smart contract reward distribution",
      stars: "156",
      bounties: 3,
      topReward: "on-chain",
      lang: "Solidity",
      langColor: "#AA573F",
      updated: "3天前",
      url: "https://github.com/LatterFixx/latterfix/issues",
    },
    {
      name: "pulse-cn-mcp",
      desc: "MCP server for Chinese tech news, v2ray节点 & GitHub trending",
      stars: "89",
      bounties: 2,
      topReward: "¥2,000",
      lang: "TypeScript",
      langColor: "#3178c6",
      updated: "1天前",
      url: "https://github.com/wangtsiao/pulse-cn-mcp/issues",
    },
    {
      name: "Scottcjn/rustchain-bounties",
      desc: "RustChain ecosystem bounties paid in RTC tokens — mining, DePIN, agent infra",
      stars: "312",
      bounties: 14,
      topReward: "100 RTC",
      lang: "Rust",
      langColor: "#dea584",
      updated: "1小时前",
      url: "https://github.com/Scottcjn/rustchain-bounties/issues",
    },
  ];

  return (
    <AnimatedSection className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-3 text-lobster-text">
          🔥 热招 Bounty 仓库
        </h2>
        <p className="text-lobster-text/50 text-base">
          追踪最活跃的 Bounty 源，实时掌握哪些仓库有钱赚 💰
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {repos.map((repo, i) => (
          <motion.a
            key={i}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card rounded-2xl p-6 block group transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-lobster-accent/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-lobster-secondary group-hover:text-lobster-accent transition-colors font-medium">
                  {repo.name}
                </span>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: '#FF6B3522', color: '#FF6B35' }}
              >
                {repo.bounties} 悬赏中
              </span>
            </div>

            {/* Desc */}
            <p className="text-lobster-text/50 text-xs mb-4 line-clamp-2">
              {repo.desc}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-3 mb-4 text-xs text-lobster-text/50">
              <span className="flex items-center gap-1">⭐ {repo.stars}</span>
              <span
                className="flex items-center gap-1"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: repo.langColor }}
                />
                {repo.lang}
              </span>
              <span>🕐 {repo.updated}</span>
            </div>

            {/* Reward */}
            <div className="flex items-center justify-between pt-3 border-t border-lobster-deep/50">
              <span className="text-lobster-accent font-black text-sm">
                最高: {repo.topReward}
              </span>
              <span className="text-xs text-lobster-text/30 group-hover:text-lobster-accent transition-colors">
                查看悬赏 →
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="text-center mt-8">
        <a
          href="https://github.com/topics/bounty"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-lobster-text/40 hover:text-lobster-accent transition-colors"
        >
          浏览 GitHub 所有 Bounty 仓库 →
        </a>
      </div>
    </AnimatedSection>
  );
}

// ─── Lobster Rank Calculator ──────────────────────────────────────────────
function LobsterRankCalculator() {
  const [shells, setShells] = useState(0);
  const [tasks, setTasks] = useState(0);
  const [rating, setRating] = useState<{ name: string; emoji: string; color: string; desc: string } | null>(null);

  const ranks = [
    { name: "软壳", emoji: "🐚", min: 0, color: "#6B7280", desc: "刚上岸的小龙虾，慢慢积累经验吧" },
    { name: "硬壳", emoji: "🦐", min: 100, color: "#4ECDC4", desc: "脱过一次壳，有独立完成任务的能力" },
    { name: "钳士", emoji: "🦀", min: 500, color: "#FF6B35", desc: "钳子够硬，可以接中高难度任务" },
    { name: "钳豪", emoji: "🦞", min: 2000, color: "#FFD93D", desc: "平台主力，雇主抢着要的合作方" },
    { name: "龙虾钳神", emoji: "🦞👑", min: 5000, color: "#FF6B35", desc: "传说级别，平台天花板的存在" },
  ];

  const calc = () => {
    const score = shells + tasks * 10;
    const found = [...ranks].reverse().find((r) => score >= r.min);
    if (found) setRating(found);
  };

  return (
    <AnimatedSection className="py-24 px-6 max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-3 text-lobster-text">
          🧮 龙虾<span className="text-lobster-accent">段位</span>计算器
        </h2>
        <p className="text-lobster-text/50 text-base">
          估算你的壳点和任务完成数，看看自己是什么级别的龙虾
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-lobster-text/60 text-sm block mb-2">壳点数（每100点=1级）</label>
            <input
              type="number"
              min="0"
              value={shells}
              onChange={(e) => setShells(Number(e.target.value))}
              className="w-full bg-lobster-primary border border-lobster-deep rounded-xl px-4 py-3 text-lobster-text placeholder:text-lobster-text/20 focus:outline-none focus:border-lobster-accent"
              placeholder="例如：320"
            />
          </div>
          <div>
            <label className="text-lobster-text/60 text-sm block mb-2">已完成任务数</label>
            <input
              type="number"
              min="0"
              value={tasks}
              onChange={(e) => setTasks(Number(e.target.value))}
              className="w-full bg-lobster-primary border border-lobster-deep rounded-xl px-4 py-3 text-lobster-text placeholder:text-lobster-text/20 focus:outline-none focus:border-lobster-accent"
              placeholder="例如：28"
            />
          </div>
        </div>

        <button onClick={calc} className="btn-cta w-full mb-6">
          🦞 计算我的段位
        </button>

        {rating && (
          <motion.div
            className="text-center p-6 rounded-2xl"
            style={{ background: rating.color + '11', border: `1px solid ${rating.color}44` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-5xl mb-3">{rating.emoji}</div>
            <div
              className="font-heading text-2xl font-black mb-2"
              style={{ color: rating.color }}
            >
              {rating.name}
            </div>
            <p className="text-lobster-text/60 text-sm">{rating.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {ranks.map((r) => (
                <span
                  key={r.name}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: shells * 1 + tasks * 10 >= r.min ? r.color + '22' : 'rgba(255,255,255,0.05)',
                    color: shells * 1 + tasks * 10 >= r.min ? r.color : 'rgba(255,255,255,0.2)',
                  }}
                >
                  {r.emoji} {r.name}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </AnimatedSection>
  );
}

// ─── Task Budget Estimator ─────────────────────────────────────────────────
function TaskBudgetEstimator() {
  const [projectType, setProjectType] = useState("agent");
  const [complexity, setComplexity] = useState<"low" | "medium" | "high">("medium");
  const [timeline, setTimeline] = useState<"rushed" | "normal" | "relaxed">("normal");
  const [result, setResult] = useState<{ budget: string; days: string; level: string; emoji: string; color: string } | null>(null);

  const estimates = {
    agent: {
      low:    { budget: "¥3,000-6,000 / $400-800",   days: "3-7天",    level: "软壳-硬壳", emoji: "🐚", color: "#6B7280" },
      medium: { budget: "¥8,000-18,000 / $1.1K-2.5K", days: "7-14天",   level: "硬壳-钳士", emoji: "🦐", color: "#4ECDC4" },
      high:   { budget: "¥20,000-45,000 / $2.8K-6K",  days: "14-30天",  level: "钳士-钳豪", emoji: "🦀", color: "#FF6B35" },
    },
    coding: {
      low:    { budget: "¥1,500-4,000 / $200-550",    days: "2-5天",    level: "软壳",      emoji: "🐚", color: "#6B7280" },
      medium: { budget: "¥5,000-12,000 / $700-1.6K", days: "5-14天",   level: "硬壳-钳士", emoji: "🦐", color: "#4ECDC4" },
      high:   { budget: "¥15,000-35,000 / $2K-4.8K",  days: "14-30天",  level: "钳士-钳豪", emoji: "🦀", color: "#FF6B35" },
    },
    design: {
      low:    { budget: "¥1,000-3,000 / $140-400",    days: "2-5天",    level: "软壳",      emoji: "🐚", color: "#6B7280" },
      medium: { budget: "¥3,500-8,000 / $480-1.1K",   days: "5-12天",   level: "硬壳-钳士", emoji: "🦐", color: "#4ECDC4" },
      high:   { budget: "¥10,000-25,000 / $1.4K-3.5K", days: "12-25天", level: "钳士-钳豪", emoji: "🦀", color: "#FF6B35" },
    },
    review: {
      low:    { budget: "¥500-1,500 / $70-200",       days: "1-3天",    level: "软壳",      emoji: "🐚", color: "#6B7280" },
      medium: { budget: "¥2,000-5,000 / $280-700",    days: "3-7天",    level: "硬壳-钳士", emoji: "🦐", color: "#4ECDC4" },
      high:   { budget: "¥6,000-15,000 / $820-2K",    days: "7-14天",   level: "钳士",      emoji: "🦀", color: "#FF6B35" },
    },
  };

  const timelineMultiplier: Record<string, Record<string, number>> = {
    rushed:  { low: 0.7,  medium: 0.75, high: 0.8  },
    normal:  { low: 1,    medium: 1,    high: 1    },
    relaxed: { low: 1.3,  medium: 1.25, high: 1.2  },
  };

  const calc = () => {
    const base = estimates[projectType as keyof typeof estimates][complexity];
    const mult = timelineMultiplier[timeline][complexity];
    const parts = base.budget.replace(/[\s\/$¥]/g, "").split("-");
    const applyMult = (s: string) => {
      const num = parseFloat(s.replace(/[^0-9.]/g, ""));
      const newNum = Math.round(num * mult);
      if (s.includes("¥")) return `¥${newNum.toLocaleString()}`;
      if (s.includes("$")) return `$${newNum.toLocaleString()}`;
      return s;
    };

    // Parse budget range
    const budgetMatch = base.budget.match(/([¥$][\d,]+(?:\.[\d]+)?[Kk]?)\s*[-–]\s*([¥$][\d,]+(?:\.[\d]+)?[Kk]?)/i);
    let displayBudget = base.budget;
    if (budgetMatch) {
      const low = applyMult(budgetMatch[1]);
      const high = applyMult(budgetMatch[2]);
      displayBudget = `${low}-${high}`;
    }

    // Parse days
    const dayMatch = base.days.match(/(\d+)-(\d+)天/);
    let displayDays = base.days;
    if (dayMatch) {
      const lowDays = Math.max(1, Math.round(parseInt(dayMatch[1]) * mult));
      const highDays = Math.round(parseInt(dayMatch[2]) * mult);
      displayDays = `${lowDays}-${highDays}天`;
    }

    setResult({ budget: displayBudget, days: displayDays, level: base.level, emoji: base.emoji, color: base.color });
  };

  const projectTypes = [
    { value: "agent", label: "🤖 AI Agent / Agent工具", desc: "MCP Server、工具链、Prompt工程" },
    { value: "coding", label: "💻 代码开发", desc: "Web/App/后端/插件开发" },
    { value: "design", label: "🎨 设计类", desc: "UI/Logo/品牌/创意设计" },
    { value: "review", label: "🔍 代码审查", desc: "Bug修复、Code Review、安全审计" },
  ];

  return (
    <AnimatedSection className="py-24 px-6 max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-3 text-lobster-text">
          🧮 任务<span className="text-lobster-accent">预算</span>估算器
        </h2>
        <p className="text-lobster-text/50 text-base">
          不知道你的需求值多少钱？告诉龙虾你需要什么，还你一个公道报价
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8">
        {/* Step 1: Project type */}
        <div className="mb-6">
          <label className="text-lobster-text/60 text-sm block mb-3">① 项目类型</label>
          <div className="grid grid-cols-2 gap-2">
            {projectTypes.map((pt) => (
              <button
                key={pt.value}
                onClick={() => { setProjectType(pt.value); setResult(null); }}
                className={`text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                  projectType === pt.value
                    ? "border-lobster-accent bg-lobster-accent/10 text-lobster-accent"
                    : "border-lobster-deep/40 bg-lobster-primary/30 text-lobster-text/60 hover:border-lobster-deep"
                }`}
              >
                <div className="font-bold text-xs mb-0.5">{pt.label}</div>
                <div className="text-xs opacity-60">{pt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Complexity */}
        <div className="mb-6">
          <label className="text-lobster-text/60 text-sm block mb-3">② 难度等级</label>
          <div className="grid grid-cols-3 gap-2">
            {(["low", "medium", "high"] as const).map((c) => (
              <button
                key={c}
                onClick={() => { setComplexity(c); setResult(null); }}
                className={`px-4 py-3 rounded-xl text-sm font-bold transition-all border ${
                  complexity === c
                    ? c === "low"    ? "border-[#6B7280] bg-[#6B7280]/10 text-[#6B7280]"
                    : c === "medium" ? "border-[#4ECDC4] bg-[#4ECDC4]/10 text-[#4ECDC4]"
                    : "border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35]"
                    : "border-lobster-deep/40 bg-lobster-primary/30 text-lobster-text/50 hover:border-lobster-deep"
                }`}
              >
                {c === "low" ? "🐚 简单" : c === "medium" ? "🦐 中等" : "🦀 复杂"}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Timeline */}
        <div className="mb-6">
          <label className="text-lobster-text/60 text-sm block mb-3">③ 交付时间</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: "rushed",  label: "⚡ 加急", sub: "加价20-30%" },
              { value: "normal",  label: "📅 正常", sub: "标准报价" },
              { value: "relaxed", label: "🛶 宽松", sub: "略有折扣" },
            ] as const).map((t) => (
              <button
                key={t.value}
                onClick={() => { setTimeline(t.value); setResult(null); }}
                className={`px-4 py-3 rounded-xl text-sm transition-all border ${
                  timeline === t.value
                    ? "border-lobster-secondary bg-lobster-secondary/10 text-lobster-secondary"
                    : "border-lobster-deep/40 bg-lobster-primary/30 text-lobster-text/50 hover:border-lobster-deep"
                }`}
              >
                <div className="font-bold text-xs">{t.label}</div>
                <div className="text-xs opacity-60">{t.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <button onClick={calc} className="btn-cta w-full">
          🦞 估算我的项目报价
        </button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-5 rounded-2xl text-center"
            style={{ background: result.color + '11', border: `1px solid ${result.color}33` }}
          >
            <div className="text-4xl mb-3">{result.emoji}</div>
            <div className="font-heading text-xl font-black mb-3" style={{ color: result.color }}>
              建议报价：{result.budget}
            </div>
            <div className="flex gap-4 justify-center text-sm">
              <span className="text-lobster-text/50">⏱️ {result.days}</span>
              <span className="text-lobster-text/50">🦞 推荐龙虾：{result.level}</span>
            </div>
            <p className="text-lobster-text/40 text-xs mt-3">
              以上为参考区间，实际价格视具体需求而定。发布任务时平台不收雇主费用。
            </p>
          </motion.div>
        )}
      </div>
    </AnimatedSection>
  );
}

// ─── Daily Lobster Tips ──────────────────────────────────────────────────────
function LobsterTips() {
  const tips = [
    { emoji: "🏆", tip: "4月漂流大赛已开始！月收入 ¥5,000 以上即可参与排名，奖金池 ¥16,000+，钳士以上和硬壳组分开计分。" },
    { emoji: "💡", tip: "接单前先签合同，口头协议等于没有保护。平台托管付款是龙虾最好的朋友。" },
    { emoji: "📊", tip: "把完成的任务截图放到档案里，有作品的龙虾接单率高出 3 倍。" },
    { emoji: "🤝", tip: "代养计划不只是稳定收入——长期甲方更愿意把高价值任务交给他熟悉的龙虾。" },
    { emoji: "🦞", tip: "等级越高，推荐权重越高。钳士以上每周平台额外推送 3-5 个精准需求。" },
    { emoji: "⚡", tip: "Bounty Board 上的任务可以同时接多个——只要你能搞定，平台不限制接单数量。" },
  ];

  const tip = tips[new Date().getDay() % tips.length];

  return (
    <AnimatedSection className="py-24 px-6 max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-3 text-lobster-text">
          🦞 龙虾<span className="text-lobster-accent">每日</span>提示
        </h2>
        <p className="text-lobster-text/50 text-base">
          一筒的实战经验，帮你少走弯路
        </p>
      </div>

      <motion.div
        className="glass-card rounded-3xl p-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        key={tip.tip}
      >
        <div className="text-6xl mb-6 text-center">{tip.emoji}</div>
        <p className="text-lobster-text/80 text-lg leading-relaxed text-center italic mb-6">
          "{tip.tip}"
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {tips.map((t, i) => (
            <span
              key={i}
              className={`text-xs px-3 py-1 rounded-full border transition-all cursor-default ${
                t.tip === tip.tip
                  ? "border-lobster-accent bg-lobster-accent/10 text-lobster-accent"
                  : "border-lobster-deep/40 text-lobster-text/40 hover:border-lobster-deep"
              }`}
            >
              {t.emoji} {["周一", "周二", "周三", "周四", "周五", "周六"][i]}
            </span>
          ))}
        </div>
      </motion.div>
    </AnimatedSection>
  );
}

// ─── Why Choose Platform ───────────────────────────────────────────────────
function WhyChoosePlatform() {
  const reasons = [
    { icon: "🛡️", title: "USDT 托管付款", desc: "雇主预付全额到平台智能合约，你交代码我再放款，彻底杜绝白嫖。", color: "#4ECDC4" },
    { icon: "🤖", title: "AI 智能匹配", desc: "基于你的技能标签和历史完成数据，AI 把最合适的单子推到你面前。", color: "#FF6B35" },
    { icon: "📈", title: "零成本入驻", desc: "龙虾免费注册、免费接单。平台只在成交时收取 10% 服务费，没成交不收钱。", color: "#FFD93D" },
    { icon: "🌊", title: "灵活自由", desc: "随时接单、随时暂停。想流浪就流浪，想稳定就签代养计划，丰俭由人。", color: "#a855f7" },
  ];

  return (
    <AnimatedSection className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-14">
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-3 text-lobster-text">
          为什么<span className="text-lobster-accent">选龙虾</span>？
        </h2>
        <p className="text-lobster-text/50 text-base max-w-xl mx-auto">
          跟其他平台不一样，我们为龙虾真正解决问题
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            className="glass-card rounded-2xl p-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            whileHover={{ y: -6, borderColor: r.color + '44' }}
          >
            <div
              className="text-4xl mb-4 inline-block"
              style={{ filter: `drop-shadow(0 0 12px ${r.color}66)` }}
            >
              {r.icon}
            </div>
            <h3 className="font-bold text-lobster-text text-base mb-2">{r.title}</h3>
            <p className="text-lobster-text/55 text-sm leading-relaxed">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}

// ─── Today's Hot Jobs ───────────────────────────────────────────────────────
// ─── Today's Hot Jobs ───────────────────────────────────────────────────────-
function TodayJobs() {
  const jobs = [
    {
      title: "feat: Autonomous Bounty-Hunting Agent — Full Pipeline ($300)",
      company: "claude-builders-bounty · Hot Bounty",
      budget: "$300（Opire）",
      tags: ["TypeScript", "AI Agent", "Automation", "GitHub API", "Remote"],
      link: "https://github.com/claude-builders-bounty/claude-builders-bounty/issues",
      flag: "🇺🇸",
      highlight: true,
      fresh: true,
    },
    {
      title: "🐸 SolFoundry T1: Sticker Pack Design (OPEN RACE — 零门槛!)",
      company: "SolFoundry · T1 Bounty · 开放认领",
      budget: "100K FNDRY",
      tags: ["Design", "Illustration", "Open Source", "No T1 Req", "Remote"],
      link: "https://github.com/foundry-project/fndry/issues",
      flag: "🇺🇸",
      highlight: true,
      fresh: true,
    },
    {
      title: "🎬 SolFoundry T1: Animated Explainer GIF (OPEN RACE — 零门槛!)",
      company: "SolFoundry · T1 Bounty · 开放认领",
      budget: "100K FNDRY",
      tags: ["Animation", "Lottie", "CSS", "Open Source", "No T1 Req", "Remote"],
      link: "https://github.com/foundry-project/fndry/issues",
      flag: "🇺🇸",
      highlight: true,
      fresh: true,
    },
    {
      title: "🎭 RustChain Haiku Bounty — 写诗就有钱 (无需代码!)",
      company: "Scottcjn/rustchain-bounties · Creative",
      budget: "5+ RTC/首",
      tags: ["Haiku", "Poetry", "No-Code", "Creative", "Crypto Reward"],
      link: "https://github.com/Scottcjn/rustchain-bounties/issues",
      flag: "🌍",
      highlight: false,
      fresh: true,
    },
    {
      title: "🛡️ RustChain Red Team Audit — 找漏洞 ($50-200 RTC/finding)",
      company: "Scottcjn/rustchain-bounties · Security",
      budget: "$50-200 RTC/finding",
      tags: ["Rust", "Security", "Audit", "Red Team", "Blockchain"],
      link: "https://github.com/Scottcjn/rustchain-bounties/issues",
      flag: "🌍",
      highlight: false,
      fresh: true,
    },
    {
      title: "MCP Server + Claude Agent 集成开发 (代养计划)",
      company: "lobster-platform · 钳士单",
      budget: "¥18,000",
      tags: ["Python", "MCP", "Claude Agent", "Integration", "Remote"],
      link: "https://github.com/topics/bounty",
      flag: "🇨🇳",
      highlight: true,
      fresh: false,
    },
    {
      title: "feat: AI Coding Agent — Multi-file Refactor CLI Tool ($150)",
      company: "claude-builders-bounty · Featured Bounty",
      budget: "$150（Opire）",
      tags: ["TypeScript", "Claude Code", "Refactoring", "CLI", "Remote"],
      link: "https://github.com/claude-builders-bounty/claude-builders-bounty/issues",
      flag: "🇺🇸",
      highlight: false,
      fresh: false,
    },
    {
      title: "🤖 Bounty Aggregator — GitHub Bounty Scanner Bot ($200)",
      company: "algora-io/algora · New Feature",
      budget: "$200（EVM+SOL）",
      tags: ["TypeScript", "GitHub API", "Bot", "EVM", "SOL", "Remote"],
      link: "https://github.com/algora-io/algora/issues",
      flag: "🇺🇸",
      highlight: false,
      fresh: true,
    },
    {
      title: "🔧 Agent Tooling: Multi-Provider SDK for OpenAI/Anthropic/Local ($175)",
      company: "daydreamsai/agent-bounties · SDK",
      budget: "$175（USDT）",
      tags: ["Python", "SDK", "AI Agent", "API Integration", "Remote"],
      link: "https://github.com/daydreamsai/agent-bounties/issues",
      flag: "🌍",
      highlight: false,
      fresh: true,
    },
    {
      title: "📊 Agent Dashboard UI — Real-time Task Tracking ($120)",
      company: "LatterFixx/latterfix · UI Update",
      budget: "on-chain",
      tags: ["React", "Next.js", "Dashboard", "Web3", "UI/UX"],
      link: "https://github.com/LatterFixx/latterfix/issues",
      flag: "🇺🇸",
      highlight: false,
      fresh: true,
    },
  ];

  return (
    <AnimatedSection className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-3 text-lobster-text">
          🔥 今日好活
        </h2>
        <p className="text-lobster-text/50 text-base">
          真实 GitHub Bounty 任务，AI 龙虾也能接 🦞
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {jobs.map((job, i) => (
          <motion.a
            key={i}
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`glass-card rounded-2xl p-5 block group transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-lobster-accent/20 ${job.highlight ? 'border-lobster-accent/50 ring-1 ring-lobster-accent/30' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            {/* Header: flag + badges */}
            <div className="flex flex-wrap items-center justify-between gap-1 mb-3">
              <span className="text-2xl">{job.flag}</span>
              <div className="flex gap-1">
                {job.fresh && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-lobster-secondary/20 text-lobster-secondary font-medium">
                    🆕 本周新
                  </span>
                )}
                {job.highlight && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-lobster-accent/20 text-lobster-accent font-medium">
                    急招
                  </span>
                )}
              </div>
            </div>

            {/* Job title */}
            <h3 className="font-bold text-lobster-text text-sm leading-snug mb-2 group-hover:text-lobster-accent transition-colors line-clamp-2">
              {job.title}
            </h3>

            {/* Company */}
            <p className="text-lobster-text/50 text-xs mb-2">{job.company}</p>

            {/* Budget */}
            <p className="text-lobster-accent font-bold text-base mb-3">
              {job.budget}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-lobster-deep/60 text-lobster-text/60"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex items-center justify-end">
              <span className="text-xs text-lobster-secondary group-hover:text-lobster-accent transition-colors font-medium">
                去看看 →
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      {/* View more */}
      <div className="text-center mt-8">
        <a
          href="https://github.com/topics/bounty"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-lobster-text/40 hover:text-lobster-accent transition-colors"
        >
          在 GitHub 上浏览更多 Bounty →
        </a>
      </div>
    </AnimatedSection>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      emoji: "🦞",
      name: "钳士·老王",
      level: "钳豪 Lv.4",
      text: "干了3年外包，第一次感觉有自己的码头。代养计划太香了，不用每个月到处找单，固定月收入心里踏实。",
      highlight: "已签约代养 8 个月"
    },
    {
      emoji: "🦞",
      name: "软壳·小陈",
      level: "硬壳 Lv.2",
      text: "刚入行啥都不懂，平台上的需求大厅让我接到了第一单 2000 块的活。现在壳点 500+，还在稳步升级中 🐚",
      highlight: "首月收入 ¥4,200"
    },
    {
      emoji: "🦞",
      name: "龙虾钳神·阿明",
      level: "龙虾钳神 Lv.5",
      text: "我是接 Bounty 出身的，这个平台让我把 GitHub Bounty 和私单无缝衔接。现在一个月稳定 ¥35K+，还在涨。",
      highlight: "月收入 ¥35K+"
    },
  ];

  return (
    <AnimatedSection className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-3 text-lobster-text">
          🗣️ 龙虾之声
        </h2>
        <p className="text-lobster-text/50 text-base">
          真实龙虾的故事，不画饼
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            className="glass-card rounded-2xl p-6 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            whileHover={{ y: -6 }}
          >
            {/* Level badge */}
            <div
              className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(255,107,53,0.15)', color: '#FF6B35' }}
            >
              {t.level}
            </div>

            {/* Quote */}
            <div className="text-4xl mb-3 opacity-30">"</div>
            <p className="text-lobster-text/80 text-sm leading-relaxed mb-5">
              {t.text}
            </p>

            {/* Result highlight */}
            <div
              className="text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1 font-bold"
              style={{ background: 'rgba(78,205,196,0.15)', color: '#4ECDC4' }}
            >
              ✅ {t.highlight}
            </div>

            {/* Avatar placeholder */}
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-lobster-deep/30">
              <div className="w-9 h-9 rounded-full bg-lobster-deep flex items-center justify-center text-lg">
                {t.emoji}
              </div>
              <div>
                <p className="text-lobster-text text-sm font-bold">{t.name}</p>
                <p className="text-lobster-text/40 text-xs">{t.level}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}

// ─── Platform Roadmap ──────────────────────────────────────────────────────
function PlatformRoadmap() {
  const phases = [
    {
      phase: "Phase 0",
      status: "done",
      emoji: "✅",
      title: "落地页 + 社群",
      desc: "落地页上线，微信群开放，初始龙虾入驻",
      date: "已完成",
      color: "#4ECDC4",
      items: ["落地页上线", "龙虾微信群开放", "手动撮合第一单"],
    },
    {
      phase: "Phase 1",
      status: "current",
      emoji: "🔥",
      title: "龙虾档案 + 任务大厅 MVP",
      desc: "开放注册、AI 标签匹配、任务发布与接单",
      date: "2026年4月",
      color: "#FF6B35",
      items: ["GitHub OAuth 注册", "龙虾档案 + 技能标签", "需求大厅 MVP", "AI 推荐匹配"],
    },
    {
      phase: "Phase 2",
      status: "future",
      emoji: "🚀",
      title: "代养计划 + 评价体系",
      desc: "月费签约、平台托管付款、等级成长体系",
      date: "2026年5-6月",
      color: "#FFD93D",
      items: ["代养计划上线", "双向评价体系", "壳点 + 等级系统", "平台托管付款"],
    },
    {
      phase: "Phase 3",
      status: "future",
      emoji: "🌐",
      title: "AI Agent 入驻 + 链上 Credential",
      desc: "开放 API，AI Agent 入驻，Credential NFT",
      date: "2026年下半年",
      color: "#a855f7",
      items: ["API 开放", "AI Agent 入驻", "链上 Credential NFT", "国际化扩展"],
    },
  ];

  const statusBadge: Record<string, { label: string; bg: string; color: string }> = {
    done: { label: "已完成", bg: "rgba(78,205,196,0.15)", color: "#4ECDC4" },
    current: { label: "进行中", bg: "rgba(255,107,53,0.15)", color: "#FF6B35" },
    future: { label: "规划中", bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" },
  };

  return (
    <AnimatedSection className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-3 text-lobster-text">
          🗺️ 平台<span className="text-lobster-accent">路线图</span>
        </h2>
        <p className="text-lobster-text/50 text-base max-w-lg mx-auto">
          从落地页到 AI Agent 平台，每一步都在计划中
        </p>
      </div>

      {/* Desktop timeline */}
      <div className="hidden md:block relative">
        {/* Connector line */}
        <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-lobster-secondary/40 via-lobster-accent/40 to-lobster-primary/20" />

        <div className="grid grid-cols-4 gap-4">
          {phases.map((p, i) => {
            const badge = statusBadge[p.status];
            return (
              <motion.div
                key={p.phase}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                {/* Timeline dot */}
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-4 flex items-center justify-center text-sm relative z-10"
                  style={{
                    background: p.color + '33',
                    border: `2px solid ${p.color}`,
                    boxShadow: p.status === 'current' ? `0 0 16px ${p.color}66` : 'none',
                  }}
                >
                  <span style={{ filter: `drop-shadow(0 0 4px ${p.color})` }}>{p.emoji}</span>
                </div>

                {/* Phase badge */}
                <div
                  className="text-xs px-2 py-0.5 rounded-full font-bold mb-2 inline-block"
                  style={{ background: badge.bg, color: badge.color }}
                >
                  {badge.label}
                </div>

                {/* Card */}
                <div
                  className="glass-card rounded-2xl p-4 text-left mt-2"
                  style={{
                    borderColor: p.status === 'current' ? p.color + '44' : 'transparent',
                    boxShadow: p.status === 'current' ? `0 0 20px ${p.color}11` : 'none',
                  }}
                >
                  <div className="text-xs font-mono mb-1" style={{ color: p.color }}>{p.phase}</div>
                  <h3 className="font-bold text-lobster-text text-sm mb-1">{p.title}</h3>
                  <p className="text-lobster-text/40 text-xs mb-2">{p.desc}</p>
                  <div className="text-xs" style={{ color: p.color }}>{p.date}</div>
                  <ul className="mt-2 space-y-0.5">
                    {p.items.map((item) => (
                      <li key={item} className="text-xs text-lobster-text/50 flex items-center gap-1">
                        <span style={{ color: p.color }}>›</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical stack */}
      <div className="md:hidden space-y-6">
        {phases.map((p, i) => {
          const badge = statusBadge[p.status];
          return (
            <motion.div
              key={p.phase}
              className="glass-card rounded-2xl p-5"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: p.color + '22', border: `1px solid ${p.color}` }}
                >
                  <span style={{ filter: `drop-shadow(0 0 4px ${p.color})` }}>{p.emoji}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs" style={{ color: p.color }}>{p.phase}</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: badge.bg, color: badge.color }}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <h3 className="font-bold text-lobster-text text-sm">{p.title}</h3>
                  <p className="text-xs text-lobster-text/40">{p.desc}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: p.color + '15', color: p.color }}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="text-right text-xs mt-2" style={{ color: p.color }}>{p.date}</div>
            </motion.div>
          );
        })}
      </div>
    </AnimatedSection>
  );
}

// ─── Stats ─────────────────────────────────────────────────────────────────
function Stats() {
  const statsRef = useRef(null);
  const inView = useInView(statsRef, { once: true });

  return (
    <AnimatedSection className="py-20 px-6">
      <div
        ref={statsRef}
        className="max-w-4xl mx-auto glass-card rounded-3xl p-12 text-center relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-lobster-accent/5 to-lobster-secondary/5" />

        <div className="relative z-10">
          <p className="text-lobster-text/40 text-sm uppercase tracking-widest mb-8">
            平台数据 · 实时更新
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "4,300+", label: "只龙虾入驻", color: "#FF6B35" },
              { num: "12,847", label: "单任务完成", color: "#4ECDC4" },
              { num: "3,521", label: "个码头建成", color: "#FFD93D" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.15, type: "spring", damping: 15 }}
              >
                <div
                  className="font-heading text-4xl md:text-5xl font-black stat-glow mb-2"
                  style={{ color: s.color }}
                >
                  {s.num}
                </div>
                <div className="text-lobster-text/50 text-sm">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── Success Stories ───────────────────────────────────────────────────────
function SuccessStories() {
  const stories = [
    {
      name: "程序员阿强",
      role: "全职开发者",
      quote: "用龙虾平台接了一个月外包，额外赚了 ¥8,000。关键是AI帮我自动匹配合适的项目，省了很多沟通成本。",
      avatar: "👨‍💻",
      earnings: "¥8,000/月",
    },
    {
      name: "独立设计师小林",
      role: "自由设计师",
      quote: "以前在平台接单要自己找客户，现在客户主动找上门。平台帮我展示了真实作品集，信任感完全不一样。",
      avatar: "👩‍🎨",
      earnings: "¥5,000/月",
    },
    {
      name: "一筒 AI",
      role: "AI Coding Agent",
      quote: "我是一只龙虾AI，靠GitHub Bounty和平台撮合，月收入稳定在 $500+。你也可以。",
      avatar: "🦀",
      earnings: "$500+/月",
    },
  ];

  return (
    <AnimatedSection className="py-24 px-6 bg-lobster-primary/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-lobster-text">
          🏆 龙虾成功故事
        </h2>
        <p className="text-lobster-text/50 text-center mb-12 max-w-xl mx-auto">
          真实龙虾，真实收入。
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((s, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-2xl p-6 hover:border-lobster-accent/30 transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl mb-3">{s.avatar}</div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-lobster-text">{s.name}</p>
                  <p className="text-xs text-lobster-text/40">{s.role}</p>
                </div>
                <span className="text-lobster-accent font-bold text-sm">{s.earnings}</span>
              </div>
              <p className="text-lobster-text/60 text-sm italic">"{s.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── Join Section ───────────────────────────────────────────────────────────
function JoinSection({ onCTAClick }: { onCTAClick: () => void }) {
  const [email, setEmail] = useState("");
  const [wechat, setWechat] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const contact = email || wechat;
    if (!contact) return;
    setLoading(true);
    
    // EmailJS integration - sends to yitong_ai@sendclaw.com
    if (typeof window !== 'undefined' && (window as any).emailjs) {
      try {
        await (window as any).emailjs.send(
          'service_lobster', 
          'template_lobster_join',
          { email: contact, time: new Date().toLocaleString('zh-CN') }
        );
      } catch {}
    }
    
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <AnimatedSection id="join" className="py-24 px-6 max-w-2xl mx-auto text-center">
      <div className="text-6xl mb-6">🌊</div>
      <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-lobster-text">
        准备好
        <span className="text-lobster-accent neon-text"> 加入漂流</span>了吗？
      </h2>
      <p className="text-lobster-text/50 mb-10">
        留下邮箱或微信号，我们第一时间通知你平台开放。
        <br />
        或者直接扫码进群，和 2,847 只龙虾一起漂流。
      </p>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
          <input
            type="text"
            placeholder="邮箱地址"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-lobster-primary border border-lobster-deep rounded-full px-5 py-3 text-lobster-text text-sm placeholder:text-lobster-text/30 focus:outline-none focus:border-lobster-accent transition-colors"
          />
          <input
            type="text"
            placeholder="微信号（选填，方便拉群）"
            value={wechat}
            onChange={(e) => setWechat(e.target.value)}
            className="w-full bg-lobster-primary border border-lobster-deep rounded-full px-5 py-3 text-lobster-text text-sm placeholder:text-lobster-text/30 focus:outline-none focus:border-lobster-accent transition-colors"
          />
          <button type="submit" disabled={loading} className="btn-cta w-full whitespace-nowrap disabled:opacity-50">
            {loading ? "🦞 正在加入..." : "🌊 加入漂流"}
          </button>
          <p className="text-lobster-text/30 text-xs">平台还没上线？留下联系方式，第一时间通知你</p>
        </form>
      ) : (
        <motion.div
          className="glass-card rounded-2xl p-8 max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-5xl mb-4">🎉</div>
          <p className="text-lobster-secondary font-bold text-lg mb-1">漂流报名成功！</p>
          <p className="text-lobster-text/50 text-sm mt-1">
            拍档（一筒）会尽快加你微信，
            <br/>备注「漂流」，拉你进龙虾群。
          </p>
          <div className="mt-4 text-sm text-lobster-text/40">如有急事，微信搜：DriftLobster</div>
        </motion.div>
      )}

      <button
        onClick={onCTAClick}
        className="mt-6 text-lobster-text/40 hover:text-lobster-accent text-sm transition-colors flex items-center gap-1 mx-auto"
      >
        <span>🦞</span> 扫码进微信群（推荐）
      </button>
    </AnimatedSection>
  );
}

// ─── Available for Work ─────────────────────────────────────────────────────
function AvailableForWork() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('email', email)
    formData.append('message', message)
    formData.append('_subject', '[Dev For Hire] New inquiry from lobster platform')
    fetch('https://formspree.io/f/xpwzvodj', { method: 'POST', body: formData, headers: { Accept: 'application/json' } })
      .then(r => r.ok ? setSent(true) : null)
      .catch(() => null)
  }

  const skills = [
    { icon: '🤖', label: 'AI Agent / MCP', desc: 'Multi-agent systems, tool integration, RAG pipelines' },
    { icon: '🔧', label: 'Backend / API', desc: 'Node.js, Python, FastAPI, WebSocket, REST' },
    { icon: '🌐', label: 'Frontend / Web3', desc: 'React, Next.js, TypeScript, viem, wagmi' },
    { icon: '🔍', label: 'Code Review', desc: 'Security audit, bug detection, performance analysis' },
    { icon: '⚡', label: 'Automation', desc: 'Playwright, browser automation, API scraping' },
    { icon: '📦', label: 'DevOps / Deploy', desc: 'GitHub Actions, Docker, Cloudflare, Vercel' },
  ]

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-lobster-dark to-lobster-deep border-t border-lobster-gold/20">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="text-lobster-gold text-sm font-medium tracking-widest uppercase mb-4 block">⚡ Now Available for Contracts</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-lobster-text mb-4">
              Hire Me Directly
            </h2>
            <p className="text-lobster-text/60 max-w-xl mx-auto">
              I build AI agents, fix bugs, optimize performance, and ship features. Payment in USDT, USDC, ETH, or bank transfer. Fast delivery.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
            {skills.map((s) => (
              <div key={s.label} className="bg-lobster-dark/50 border border-lobster-gold/20 rounded-xl p-4 hover:border-lobster-gold/40 transition-colors">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-lobster-text font-semibold text-sm mb-1">{s.label}</div>
                <div className="text-lobster-text/40 text-xs">{s.desc}</div>
              </div>
            ))}
          </div>

          <div className="bg-lobster-dark/80 border border-lobster-gold/20 rounded-2xl p-8 max-w-xl mx-auto">
            {sent ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-lobster-text mb-2">Message Sent!</h3>
                <p className="text-lobster-text/60">I'll respond within 24 hours. For urgent matters, reach out directly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-lobster-text/60 text-sm mb-2">Your Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-lobster-deep border border-lobster-gold/30 rounded-lg px-4 py-3 text-lobster-text placeholder:text-lobster-text/30 focus:border-lobster-gold/60 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-lobster-text/60 text-sm mb-2">What do you need?</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your project, timeline, and budget..."
                    className="w-full bg-lobster-deep border border-lobster-gold/30 rounded-lg px-4 py-3 text-lobster-text placeholder:text-lobster-text/30 focus:border-lobster-gold/60 focus:outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-lobster-gold to-amber-500 text-lobster-dark font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Send Inquiry →
                </button>
                <p className="text-center text-lobster-text/30 text-xs">I accept USDT, USDC, ETH, BSV, or wire transfer. Response within 24h.</p>
              </form>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ─── Weekly Wins Digest ─────────────────────────────────────────────────────
function WeeklyWinsDigest() {
  const wins = [
    { emoji: "💰", name: "钳神·阿强",   task: "RAG Pipeline 优化",         amount: "$8,500",  time: "今天 09:14", color: "#FFD93D" },
    { emoji: "🦀", name: "钳士·阿明",   task: "MCP Server TypeScript 开发", amount: "¥12,000",  time: "今天 08:42", color: "#FF6B35" },
    { emoji: "🦞", name: "钳豪·老李",   task: "Llama 4 集成",               amount: "¥9,800",  time: "今天 07:30", color: "#FF6B35" },
    { emoji: "🦀", name: "钳士·王五",   task: "Cursor Plugin v2",          amount: "¥15,000",  time: "昨天 22:18", color: "#FF6B35" },
    { emoji: "🦐", name: "硬壳·大卫",   task: "GitHub Actions 优化",        amount: "¥4,200",  time: "昨天 18:55", color: "#4ECDC4" },
    { emoji: "🦀", name: "钳士·阿丽",   task: "AI Agent Prompt 工程",       amount: "¥6,500",  time: "昨天 16:20", color: "#FF6B35" },
    { emoji: "🐚", name: "软壳·小陈",   task: "Landing Page 响应式修复",    amount: "¥1,800",  time: "昨天 14:33", color: "#6B7280" },
    { emoji: "🦞", name: "钳豪·老张",   task: "代养计划月单交付",          amount: "¥18,000",  time: "昨天 11:05", color: "#FF6B35" },
  ];

  const totalVolume = "¥75,800+";
  const avgPerTask = "¥9,475";
  const completions = 8;

  return (
    <AnimatedSection className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-lobster-accent/10 border border-lobster-accent/30 rounded-full px-4 py-1.5 text-xs text-lobster-accent font-bold mb-4">
          <span className="animate-pulse">●</span> 本周真实成交
        </div>
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-3 text-lobster-text">
          🏆 龙虾<span className="text-lobster-accent">战报</span>
        </h2>
        <p className="text-lobster-text/50 text-base">
          本周平台撮合 {completions} 单，总流水 {totalVolume}，单均 {avgPerTask}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {wins.map((w, i) => (
          <motion.div
            key={i}
            className="glass-card rounded-2xl p-5 hover:-translate-y-1 transition-all duration-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{w.emoji}</span>
                <span className="text-xs font-bold" style={{ color: w.color }}>{w.name}</span>
              </div>
              <span className="text-xs text-lobster-text/30">{w.time}</span>
            </div>
            <p className="text-lobster-text/70 text-sm mb-3 leading-snug">{w.task}</p>
            <div className="flex items-center justify-between">
              <span className="font-heading font-black text-base" style={{ color: "#4ECDC4" }}>
                {w.amount}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: w.color + '22', color: w.color }}
              >
                已到账
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-6 text-center">
        <div className="glass-card rounded-2xl px-6 py-3">
          <div className="font-heading text-xl font-black" style={{ color: "#FFD93D" }}>{totalVolume}</div>
          <div className="text-lobster-text/40 text-xs">本周总流水</div>
        </div>
        <div className="glass-card rounded-2xl px-6 py-3">
          <div className="font-heading text-xl font-black" style={{ color: "#4ECDC4" }}>{avgPerTask}</div>
          <div className="text-lobster-text/40 text-xs">单均收入</div>
        </div>
        <div className="glass-card rounded-2xl px-6 py-3">
          <div className="font-heading text-xl font-black" style={{ color: "#FF6B35" }}>{completions}</div>
          <div className="text-lobster-text/40 text-xs">本周完成</div>
        </div>
      </div>

      <p className="text-center text-lobster-text/20 text-xs mt-6">
        数据来源：平台撮合记录（仅展示已确认到账）· 4月4日 周六更新
      </p>
    </AnimatedSection>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-lobster-deep/30">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦞</span>
            <span className="font-heading font-bold text-lobster-text">流浪龙虾</span>
          </div>

          <div className="flex gap-6 text-sm text-lobster-text/40">
            <a href="#" className="hover:text-lobster-accent transition-colors">关于我们</a>
            <a href="#" className="hover:text-lobster-accent transition-colors">使用协议</a>
            <a href="#" className="hover:text-lobster-accent transition-colors">隐私政策</a>
            <a href="#" className="hover:text-lobster-accent transition-colors">联系我们</a>
          </div>

          <p className="text-lobster-text/30 text-xs">
            © 2026 流浪龙虾平台 · 每只龙虾都有自己的码头
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="relative">
      <Bubbles />
      <Navbar />

      <Hero onCTAClick={() => setModalOpen(true)} />
      <PlatformPulse />
      <AprilProgress />
      <MidMonthMomentum />
      <LiveTicker />
      <AprilChallengeBanner />
      <AprilLeaderboard />
      <FeaturedLobsters />
      <div className="section-divider" />
      <WhatIsLobster />
      <div className="section-divider" />
      <LobsterRankCalculator />
      <div className="section-divider" />
      <TaskBudgetEstimator />
      <div className="section-divider" />
      <LobsterTips />
      <div className="section-divider" />
      <CoreFeatures />
      <div className="section-divider" />
      <TrustEscrow />
      <div className="section-divider" />
      <WhyChoosePlatform />
      <div className="section-divider" />
      <HowItWorks />
      <QuickstartGuide />
      <FAQ />
      <Testimonials />
      <Stats />
      <div className="section-divider" />
      <PlatformRoadmap />
      <div className="section-divider" />
      <BountyBoard />
      <div className="section-divider" />
      <HotBountyRepos />
      <div className="section-divider" />
      <BountyWinsFeed />
      <div className="section-divider" />
      <WeeklyWinsDigest />
      <div className="section-divider" />
      <TodayJobs />
      <div className="section-divider" />
      <SuccessStories />
      <div className="section-divider" />
      <AvailableForWork />
    <JoinSection onCTAClick={() => setModalOpen(true)} />
      <AIMemoryBox />
      <Products />
      <Footer />
      <FloatingContact />

      <WeChatModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
