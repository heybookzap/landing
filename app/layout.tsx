"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "@/app/components/SplashScreen";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  return (
    <html lang="ko">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <meta name="theme-color" content="#0A0A0A" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap" rel="stylesheet" />
        <title>ONE BLANK 엘리트 시스템</title>
        <meta name="description" content="상위 0.1%를 위한 명료한 실행 시스템입니다." />
      </head>
      <body className="antialiased bg-[#0A0A0A] overflow-x-hidden">
        <AnimatePresence mode="wait">
          {loading ? (
            <SplashScreen key="splash" onComplete={() => setLoading(false)} />
          ) : (
            <main key="content" className="min-h-screen">
              {children}
            </main>
          )}
        </AnimatePresence>
      </body>
    </html>
  );
}
