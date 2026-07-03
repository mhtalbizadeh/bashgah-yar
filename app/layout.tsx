import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const vazir = localFont({
  src: "./fonts/Vazir.ttf",
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: "باشگاه‌یار",
  description: "سامانه مدیریت باشگاه بدنسازی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
