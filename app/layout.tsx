import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CPC Academy | Medical Coding Learning",
  description: "Medical terminology, anatomy, clinical documentation, and U.S. medical coding study.",
  applicationName: "CPC Academy",
  manifest: "/manifest.json",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "CPC Academy" },
};

export const viewport: Viewport = {
  themeColor: "#f5f7fb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
