import type { Metadata } from "next";
import { ReactNode } from "react";

import { MainShell, SiteFooter, SiteHeader } from "@/components/shell";

import "./globals.css";

export const metadata: Metadata = {
  title: "POLARIS IRT Core",
  description: "基于 IRT + CAT 的大语言模型自适应能力评测平台。"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <MainShell>
          <SiteHeader />
          {children}
          <SiteFooter />
        </MainShell>
      </body>
    </html>
  );
}
