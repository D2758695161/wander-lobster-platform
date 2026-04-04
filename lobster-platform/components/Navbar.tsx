"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { supabase, DEMO_MODE } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Check auth state on mount
  useState(() => {
    if (!DEMO_MODE) {
      supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }
  });

  const handleLogout = async () => {
    if (!DEMO_MODE) {
      await supabase.auth.signOut();
    }
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "首页" },
    { href: "/tasks", label: "任务大厅" },
    { href: "/services", label: "💼 接单", accent: true },
    { href: "/shop", label: "🛒 商店" },
    { href: "/dashboard", label: "我的面板", protected: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🦞</span>
          <span className="font-heading font-bold text-lobster-text tracking-wide">
            流浪龙虾
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm text-lobster-text/70">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-lobster-accent transition-colors ${
                link.accent
                  ? "text-lobster-accent bg-lobster-accent/10 px-3 py-1 rounded-full border border-lobster-accent/30 font-bold"
                  : pathname === link.href
                  ? "text-lobster-accent font-bold"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          {DEMO_MODE ? (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-lobster-text/60 hover:text-lobster-accent transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="text-sm px-4 py-2 rounded-full bg-lobster-accent/20 border border-lobster-accent/40 text-lobster-accent hover:bg-lobster-accent/30 transition-all"
              >
                注册
              </Link>
            </div>
          ) : (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="text-sm text-lobster-secondary hover:text-lobster-accent transition-colors"
                  >
                    我的面板
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-lobster-text/40 hover:text-lobster-text/60 transition-colors"
                  >
                    退出
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-sm text-lobster-text/60 hover:text-lobster-accent transition-colors"
                  >
                    登录
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm px-4 py-2 rounded-full bg-lobster-accent/20 border border-lobster-accent/40 text-lobster-accent hover:bg-lobster-accent/30 transition-all"
                  >
                    注册
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-lobster-text/70"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-lobster-primary/95 backdrop-blur-lg border-t border-lobster-deep/40 mt-4 rounded-2xl overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-lobster-text/70 hover:text-lobster-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-lobster-deep/40 flex gap-3">
                <Link
                  href="/login"
                  className="flex-1 text-center py-2 text-sm text-lobster-text/60 border border-lobster-deep/40 rounded-full"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center py-2 text-sm text-lobster-accent border border-lobster-accent/40 rounded-full bg-lobster-accent/10"
                >
                  注册
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
