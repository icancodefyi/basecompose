"use client";

import { Suspense, useState, useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signIn, isAuthenticated, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/chat";

  // Redirect if already authenticated using useEffect
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push(callbackUrl);
    }
  }, [isAuthenticated, loading, callbackUrl, router]);

  if (isAuthenticated && !loading) {
    return null;
  }

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSigningIn(true);
    
    try {
      const result = await signIn("google", {
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setIsSigningIn(false);
      } else if (result?.ok) {
        // Success - redirect will happen automatically
        router.push(callbackUrl);
      }
    } catch (err) {
      setError("Sign in failed. Please try again.");
      setIsSigningIn(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setError(null);
    setIsSigningIn(true);
    
    try {
      const result = await signIn("github", {
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setIsSigningIn(false);
      } else if (result?.ok) {
        // Success - redirect will happen automatically
        router.push(callbackUrl);
      }
    } catch (err) {
      setError("Sign in failed. Please try again.");
      setIsSigningIn(false);
    }
  };

  return (
    <div className="h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-normal text-emerald-600 leading-[1.3]">BaseCompose.</h1>
          <p className="text-sm md:text-base text-gray-400 font-light">
            Infrastructure Engineering Platform
          </p>
        </div>

        {/* Sign In Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-normal leading-[1.3]">Welcome Back</h2>
            <p className="text-xs md:text-sm text-gray-500 font-light">
              Sign in to unlock unlimited chats and downloads
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn || loading}
            className="w-full bg-white text-black hover:bg-gray-100 h-11 md:h-12 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
            {isSigningIn ? "Signing in..." : "Sign in with Google"}
          </Button>

          {/* GitHub Sign In Button */}
          <Button
            onClick={handleGitHubSignIn}
            disabled={isSigningIn || loading}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white h-11 md:h-12 font-medium border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            {isSigningIn ? "Signing in..." : "Sign in with GitHub"}
          </Button>

          {/* Benefits */}
          <div className="space-y-3 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
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
                  className="text-xs md:text-sm text-gray-300 flex items-start gap-2"
                >
                  <svg
                    className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
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
        <div className="text-center text-xs text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-background flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
