import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flyer Copy Maker - AI 전단지 문구 생성기",
  description: "AI가 식당, 뷰티, 학원 등 다양한 업종의 전단지/이벤트 문구를 3초 만에 만들어줍니다.",
  openGraph: {
    title: "Flyer Copy Maker - AI 전단지 문구 생성기",
    description: "고민되는 홍보 문구, AI에게 맡기세요. 3초 만에 매력적인 카피가 완성됩니다.",
    url: "https://copy-editor.vercel.app",
    siteName: "Flyer Copy Maker",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flyer Copy Maker",
    description: "AI 전단지 문구 생성기",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}
