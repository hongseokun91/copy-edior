import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Font logic for another time
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trendstream Enterprise",
  description: "Advanced Creative Intelligence System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto h-screen bg-slate-950">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
