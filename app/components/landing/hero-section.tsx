"use client";

import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Orb from "@/components/Orb";

export function HeroSection() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <section className="relative min-h-screen w-full px-4 sm:px-6 lg:px-8 overflow-hidden bg-black flex flex-col items-center justify-center">
      {/* Orb Background - Subtle */}
      <div className="absolute inset-0 w-full h-full opacity-40">
        <Orb
          hoverIntensity={0.12}
          rotateOnHover={true}
          forceHoverState={true}
          backgroundColor="#000000"
        />
      </div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black"></div>

      {/* Ambient Light Effects */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-emerald-600/6 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative w-full max-w-5xl mx-auto z-10 py-12 sm:py-16 lg:py-20">
        {/* Top Badge */}
        <div className="mb-6 flex justify-center">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-gray-700/60 bg-gray-950/40 hover:bg-gray-900/60 transition-all duration-300 group backdrop-blur-sm">
            <span className="text-xs font-medium text-gray-300">
              Layered - AI Stack Generator
            </span>
            <svg 
              className="w-3.5 h-3.5 text-gray-500 group-hover:translate-x-0.5 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </button>
        </div>

        {/* Main Headline - Compact Typography */}
        <div className="mb-6 text-center space-y-2">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
            Build in a weekend
          </h1>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent leading-[1.1] tracking-tight">
            Scale to millions
          </h2>
        </div>

        {/* Subheading - Concise */}
        <p className="text-center text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8 font-light">
          Layered is the AI-powered development platform. Chat with AI to configure your stack, get production-ready Docker files, authentication, databases, and instant deployment.
        </p>

        {/* CTA Buttons - Compact */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10">
          <Button
            onClick={() =>
              session?.user
                ? router.push("/chat")
                : signIn("google", { callbackUrl: "/chat" })
            }
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-7 py-2.5 rounded-lg transition-all duration-300 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 cursor-pointer w-full sm:w-auto text-sm"
          >
            {session?.user ? "Open Layered" : "Start your project"}
          </Button>

          <Button
            onClick={() => {
              const featuresSection = document.getElementById("features");
              featuresSection?.scrollIntoView({ behavior: "smooth" });
            }}
            variant="outline"
            className="border border-gray-700/60 hover:border-gray-600 hover:bg-gray-900/40 text-gray-200 font-semibold px-7 py-2.5 rounded-lg transition-all duration-300 w-full sm:w-auto text-sm"
          >
            Request a demo
          </Button>
        </div>

        {/* Social Proof Section - Compact */}
        <div className="space-y-4 border-t border-gray-800/50 pt-8">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 items-center">
            <div className="text-gray-500 text-xs font-semibold tracking-wide">Betashares</div>
            <div className="text-gray-500 text-xs font-semibold tracking-wide">Vercel</div>
            <div className="text-gray-500 text-xs font-semibold tracking-wide">GitHub</div>
            <div className="text-gray-500 text-xs font-semibold tracking-wide">Mozilla</div>
            <div className="text-gray-500 text-xs font-semibold tracking-wide">Stripe</div>
          </div>
          <p className="text-center text-xs text-gray-600 font-light">
            Trusted by fast-growing companies worldwide
          </p>
        </div>

        {/* Feature Cards Grid - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {/* Feature Card 1 */}
          <div className="group rounded-lg border border-gray-800/40 bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm p-6 text-left hover:border-emerald-500/40 transition-all duration-300">
            <div className="w-10 h-10 bg-emerald-600/15 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600/25 transition-colors duration-300">
              <span className="text-lg">🗄️</span>
            </div>
            <h3 className="text-white font-semibold text-sm mb-2 tracking-tight">MongoDB Database</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Every project is a full MongoDB database, the world's most trusted relational database.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="group rounded-lg border border-gray-800/40 bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm p-6 text-left hover:border-emerald-500/40 transition-all duration-300">
            <div className="w-10 h-10 bg-emerald-600/15 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600/25 transition-colors duration-300">
              <span className="text-lg">🔐</span>
            </div>
            <h3 className="text-white font-semibold text-sm mb-2 tracking-tight">Authentication</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Add user sign ups and logins, keeping your data with Row Level Security.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="group rounded-lg border border-gray-800/40 bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm p-6 text-left hover:border-emerald-500/40 transition-all duration-300">
            <div className="w-10 h-10 bg-emerald-600/15 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600/25 transition-colors duration-300">
              <span className="text-lg">⚡</span>
            </div>
            <h3 className="text-white font-semibold text-sm mb-2 tracking-tight">Docker Functions</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Easily write custom code without deploying or scaling servers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
