"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div className="h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0088ff]">Layered</h1>
          <p className="text-sm md:text-base text-[#999999]">
            AI-Powered Stack Generator
          </p>
        </div>

        {/* Sign In Card */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold">Welcome Back</h2>
            <p className="text-xs md:text-sm text-[#666666]">
              Sign in to unlock unlimited chats and downloads
            </p>
          </div>

          {/* Google Sign In Button */}
          <Button
            onClick={() =>
              signIn("google", {
                callbackUrl,
                redirect: true,
              })
            }
            className="w-full bg-white text-black hover:bg-gray-100 h-11 md:h-12 font-medium"
          >
            <svg
              className="w-5 h-5 mr-3"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </Button>

          {/* Benefits */}
          <div className="space-y-3 pt-6 border-t border-[#2a2a2a]">
            <p className="text-xs text-[#666666] font-medium uppercase tracking-wider">
              When you sign in, you get:
            </p>
            <ul className="space-y-2">
              {[
                "Unlimited chats and stack generation",
                "Download your projects anytime",
                "Save your project history",
                "Export and share stacks",
              ].map((benefit) => (
                <li
                  key={benefit}
                  className="text-xs md:text-sm text-[#d0d0d0] flex items-start gap-2"
                >
                  <svg
                    className="w-4 h-4 text-[#0088ff] shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[#666666]">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}
