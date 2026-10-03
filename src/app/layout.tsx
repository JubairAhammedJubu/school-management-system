import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import PublicChrome from "@/components/PublicChrome";
import { ToastContainer } from "react-toastify";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduNexus - School Management System",
  description: "EduNexus - School Management System",
};

import NoInternetScreen from "@/components/Offline/NoInternetScreen";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
