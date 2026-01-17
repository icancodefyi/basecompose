"use client";

import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Orb from "@/components/Orb";
import { NextjsIcon, NodejsIcon, MongodbIcon, NextAuthIcon, RedisIcon } from "@/lib/icons";


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
      <div className="relative w-full max-w-5xl mx-auto z-10 py-8 sm:py-12 lg:py-16">
        {/* Top Badge */}
        <div className="mb-6 flex justify-center">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-gray-700/60 bg-gray-950/40 hover:bg-gray-900/60 transition-all duration-300 group backdrop-blur-sm">
            <span className="text-xs font-medium text-gray-300">
              Environment setup in minutes
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

        {/* Main Headline - Locked Hierarchy */}
        <div className="mb-8 text-center px-2">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal text-white leading-[1.2] tracking-tight">
           Set up your dev or prod environment <span className="text-emerald-600"> instantly.</span>
          </h1>
        </div>

        {/* Subheading - Concrete Benefit */}
        <p className="text-center text-xs sm:text-sm lg:text-base text-gray-300 max-w-2xl mx-auto px-2 leading-relaxed mb-8 font-light">
          BaseCompose configures databases, authentication, and essential add-ons so you can start building right away.
        </p>

        {/* CTA Buttons - Compact */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10 px-2">
          <Button
            onClick={() =>
              session?.user
                ? router.push("/chat")
                : signIn("google", { callbackUrl: "/chat" })
            }
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 sm:px-7 py-2.5 rounded-lg transition-all duration-300 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 cursor-pointer w-full sm:w-auto text-xs sm:text-sm"
          >
            {session?.user ? "Setup My Environment" : "Setup My environment"}
          </Button>

          <Button
            onClick={() => {
              const featuresSection = document.getElementById("features");
              featuresSection?.scrollIntoView({ behavior: "smooth" });
            }}
            variant="outline"
            className="border border-gray-700/60 hover:border-gray-600 hover:bg-gray-900/40 hover:text-gray-200 font-semibold px-7 py-2.5 rounded-lg transition-all duration-300 w-full sm:w-auto text-sm"
          >
            View examples
          </Button>
        </div>

        {/* Social Proof Section - Compact */}
        <div className="space-y-4 border-t border-gray-800/50 pt-10 mt-6">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-12 items-center px-2">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs sm:text-sm font-semibold tracking-wide hover:text-gray-300 transition-colors">
              <NextjsIcon className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="hidden sm:inline">Next.js</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs sm:text-sm font-semibold tracking-wide hover:text-gray-300 transition-colors">
              <NodejsIcon className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="hidden sm:inline">Node.js</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs sm:text-sm font-semibold tracking-wide hover:text-gray-300 transition-colors">
              <NextAuthIcon className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="hidden sm:inline">NextAuth</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs sm:text-sm font-semibold tracking-wide hover:text-gray-300 transition-colors">
              <MongodbIcon className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="hidden sm:inline">MongoDB</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs sm:text-sm font-semibold tracking-wide hover:text-gray-300 transition-colors">
              {/* Redis Icon */}
            <RedisIcon className="w-5 h-5" />
              Redis
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 font-light">
            Supports wide range of frameworks, databases, and addons.
          </p>
        </div>
      </div>
    </section>
  );
}
