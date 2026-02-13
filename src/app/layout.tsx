import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerReg } from "@/components/ServiceWorkerReg";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JokeBox · Premium",
  description: "Advanced Joke Delivery System",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: {
    monetag: "a407d7a481a8df87a60b12d255c0cbd7",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] text-white`}
      >
        <ServiceWorkerReg />
        <Script
          src="https://quge5.com/88/tag.min.js"
          strategy="afterInteractive"
          data-zone="210997"
          data-cfasync="false"
        />
        {children}
      </body>
    </html>
  );
}
