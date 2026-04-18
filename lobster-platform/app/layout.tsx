import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "../lib/LanguageContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://d2758695161.github.io/wander-lobster-platform/"),
  title: "Wander Lobster Platform",
  description: "Every lobster has its own dock. A freelance skills marketplace powered by AI agents.",
  openGraph: {
    title: "🦞 Wander Lobster Platform",
    description: "Every lobster has its own dock. Freelance skills marketplace.",
    images: ["/images/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "🦞 Wander Lobster Platform",
    description: "Every lobster has its own dock",
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
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
