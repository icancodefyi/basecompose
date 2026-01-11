"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function NavHeader() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b border-[#2a2a2a] z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-linear-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center font-bold text-white">
              L
            </div>
            <span className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
              Layered
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side - Auth & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {session?.user ? (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-medium text-white">{session.user.name}</p>
                    <p className="text-xs text-gray-400">{session.user.email}</p>
                  </div>
                  <Button
                    onClick={() => router.push("/chat")}
                    className="bg-[#0088ff] hover:bg-[#0066cc] text-white"
                  >
                    Go to App
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    onClick={() => signIn("google", { callbackUrl: "/chat" })}
                    variant="outline"
                    className="border-gray-700 hover:bg-gray-900 text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => signIn("google", { callbackUrl: "/chat" })}
                    className="bg-white hover:bg-gray-100 text-black text-sm font-semibold"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[#1a1a1a] text-[#999999] hover:text-foreground transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}

              {/* Mobile Auth */}
              <div className="pt-4 px-3 space-y-2 border-t border-gray-800">
                {session?.user ? (
                  <>
                    <div className="mb-3 pb-3 border-b border-gray-800">
                      <p className="text-sm font-medium text-white">{session.user.name}</p>
                      <p className="text-xs text-gray-400">{session.user.email}</p>
                    </div>
                    <Button
                      onClick={() => router.push("/chat")}
                      className="w-full bg-white hover:bg-gray-100 text-black font-semibold"
                    >
                      Go to App
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => signIn("google", { callbackUrl: "/chat" })}
                      variant="outline"
                      className="w-full border-gray-700 hover:bg-gray-900 text-gray-300 hover:text-white transition-colors"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => signIn("google", { callbackUrl: "/chat" })}
                      className="w-full bg-white hover:bg-gray-100 text-black font-semibold"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
