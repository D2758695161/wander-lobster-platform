import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lobster: {
          bg: "#050D18",
          primary: "#0A1628",
          accent: "#FF6B35",
          secondary: "#4ECDC4",
          text: "#E8F4FD",
          deep: "#1E3A5F",
        },
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans SC", "sans-serif"],
        heading: ["Orbitron", "Noto Sans SC", "sans-serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "bubble-rise": "bubble-rise 8s linear infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
        },
        "glow-pulse": {
          "0%, 100%": {
            filter: "drop-shadow(0 0 20px #FF6B35) drop-shadow(0 0 40px #FF6B35)",
            transform: "scale(1)",
          },
          "50%": {
            filter: "drop-shadow(0 0 40px #FF6B35) drop-shadow(0 0 80px #FF6B35)",
            transform: "scale(1.05)",
          },
        },
        "bubble-rise": {
          "0%": { transform: "translateY(100vh) scale(0)", opacity: "0" },
          "10%": { opacity: "0.6" },
          "100%": { transform: "translateY(-100vh) scale(1)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
