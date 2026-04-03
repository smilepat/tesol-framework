import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/layout/main-nav";
import { StepSidebar } from "@/components/layout/step-sidebar";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "App Dev Framework - 영어교사를 위한 앱 개발 가이드",
  description:
    "5단계 Standard Framework으로 배우는 교육 앱 개발 입문 가이드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <AuthProvider>
          <MainNav />
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex gap-6">
              <StepSidebar />
              <main className="flex-1 min-w-0">{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
