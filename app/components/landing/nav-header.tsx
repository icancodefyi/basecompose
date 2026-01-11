"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function NavHeader() {
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
            <div className="w-8 h-8 bg-gradient-to-br from-[#0088ff] to-[#0055aa] rounded-lg flex items-center justify-center font-bold text-white">
              L
            </div>
            <span className="text-lg font-bold text-foreground group-hover:text-[#0088ff] transition-colors">
              Layered
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[#999999] hover:text-foreground transition-colors"
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
                <Button
                  onClick={() => (window.location.href = "/chat")}
                  className="bg-[#0088ff] hover:bg-[#0066cc] text-white"
                >
                  Go to App
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => signIn("google", { callbackUrl: "/chat" })}
                    variant="outline"
                    className="border-[#2a2a2a] hover:bg-[#1a1a1a] text-sm"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => signIn("google", { callbackUrl: "/chat" })}
                    className="bg-[#0088ff] hover:bg-[#0066cc] text-white text-sm"
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
          <div className="md:hidden border-t border-[#2a2a2a] bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-[#999999] hover:bg-[#1a1a1a] hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}

              {/* Mobile Auth */}
              <div className="pt-4 px-3 space-y-2 border-t border-[#2a2a2a]">
                {session?.user ? (
                  <Button
                    onClick={() => (window.location.href = "/chat")}
                    className="w-full bg-[#0088ff] hover:bg-[#0066cc] text-white"
                  >
                    Go to App
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => signIn("google", { callbackUrl: "/chat" })}
                      variant="outline"
                      className="w-full border-[#2a2a2a] hover:bg-[#1a1a1a]"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => signIn("google", { callbackUrl: "/chat" })}
                      className="w-full bg-[#0088ff] hover:bg-[#0066cc] text-white"
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
