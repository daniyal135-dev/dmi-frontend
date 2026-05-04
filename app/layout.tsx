import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "./components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DMI+ · Deepfake Media Intelligence",
  description: "Multimodal deepfake detection — images, video, and AI-generated text.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-app-bg text-app-text antialiased`}
        suppressHydrationWarning={true}
      >
        <Script id="dmi-theme-init" strategy="beforeInteractive">
          {`(function(){try{var k='dmi-theme',t=localStorage.getItem(k);if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);else{document.documentElement.setAttribute('data-theme','light');localStorage.setItem(k,'light');}}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`}
        </Script>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}