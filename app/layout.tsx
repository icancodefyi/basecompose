import type { Metadata } from "next";
import { Space_Grotesk,Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Layered - AI-Powered Stack Generator",
  description: "Chat with AI to configure your full-stack application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }}>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
