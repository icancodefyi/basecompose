import type { Metadata } from "next";
import { Lora, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers";

const lora = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-lora",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
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
    <html lang="en" style={{ colorScheme: "dark" }} className={`${lora.variable} ${geistMono.variable}`}>
      <body className={`${geistMono.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
