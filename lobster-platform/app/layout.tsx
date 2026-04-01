import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://d2758695161.github.io/wander-lobster-platform/"),
  title: "流浪龙虾平台 - 每只龙虾都有自己的码头",
  description: "自由职业者的技能撮合平台。让龙虾们自由流浪，找到属于自己的码头。",
  openGraph: {
    title: "🦞 流浪龙虾平台",
    description: "每只龙虾都有自己的码头。自由职业者的技能撮合平台。",
    images: ["/images/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "🦞 流浪龙虾平台",
    description: "每只龙虾都有自己的码头",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦞</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
