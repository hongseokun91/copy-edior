import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@next/third-parties/google";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
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
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased nebula-bg min-h-screen font-sans`}
      >
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            className: "purple-toast",
            classNames: {
              info: "purple-toast-info",
              success: "purple-toast-success",
              error: "purple-toast-error",
            }
          }}
        />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}
