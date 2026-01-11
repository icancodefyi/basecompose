"use client";

import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <section className="relative min-h-[calc(100vh-4rem)] pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col items-center justify-center">
      {/* Subtle background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-0 w-80 h-80 bg-emerald-700/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto w-full text-center">
        {/* Top Badge */}
        <div className="mb-8 flex justify-center">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-900/30 hover:bg-gray-900/50 transition-colors group">
            <span className="text-xs sm:text-sm text-gray-300">Layered - AI Stack Generator</span>
            <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Headline */}
        <div className="mb-6 space-y-2">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Build in a weekend
          </h1>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-emerald-500">
            Scale to millions
          </h2>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          Layered is the AI-powered development platform. Chat with AI to configure your stack, get production-ready Docker files, authentication, databases, and instant deployment.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Button
            onClick={() =>
              session?.user
                ? router.push("/chat")
                : signIn("google", { callbackUrl: "/chat" })
            }
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg shadow-emerald-600/20 cursor-pointer"
          >
            {session?.user ? "Open Layered" : "Start your project"}
          </Button>

          <Button
            onClick={() => {
              const featuresSection = document.getElementById("features");
              featuresSection?.scrollIntoView({ behavior: "smooth" });
            }}
            variant="outline"
            className="border border-gray-700 hover:bg-gray-900/30 hover:border-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition-all"
          >
            Request a demo
          </Button>
        </div>

        {/* Social Proof - Company Logos */}
        <div className="mb-12 space-y-6 border-t border-gray-800 pt-12">
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <div className="text-gray-500 text-sm font-medium">Betashares</div>
            <div className="text-gray-500 text-sm font-medium">Vercel</div>
            <div className="text-gray-500 text-sm font-medium">GitHub</div>
            <div className="text-gray-500 text-sm font-medium">Mozilla</div>
            <div className="text-gray-500 text-sm font-medium">Stripe</div>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            Trusted by fast-growing companies worldwide
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature Card 1 */}
          <div className="rounded-xl border border-gray-800 bg-linear-to-br from-gray-900/50 to-gray-950 p-8 text-left hover:border-emerald-600/40 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mb-6">
              <span className="text-xl">🗄️</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">MongoDB Database</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Every project is a full MongoDB database, the world's most trusted relational database.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="rounded-xl border border-gray-800 bg-linear-to-br from-gray-900/50 to-gray-950 p-8 text-left hover:border-emerald-600/40 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mb-6">
              <span className="text-xl">🔐</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Authentication</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Add user sign ups and logins, keeping your data with Row Level Security.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="rounded-xl border border-gray-800 bg-linear-to-br from-gray-900/50 to-gray-950 p-8 text-left hover:border-emerald-600/40 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mb-6">
              <span className="text-xl">⚡</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Docker Functions</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Easily write custom code without deploying or scaling servers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
