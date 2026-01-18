import type { Metadata } from "next";
import { Lora, Geist_Mono, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers";
import { Analytics } from "@vercel/analytics/next"

const lora = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-lora",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BaseCompose - Instant App Environment Setup",
  description: "Instantly set up dev or production environments with databases, authentication, and essential add-ons.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }} className={`${lora.variable} ${geistMono.variable} ${inter.variable}`}>
      <body className={`${geistMono.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
