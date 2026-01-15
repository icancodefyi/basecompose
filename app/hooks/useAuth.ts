"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export interface UseAuthReturn {
  session: any;
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (provider: string, options?: any) => Promise<any>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

/**
 * Hook for managing authentication state
 * Provides session, user data, and auth methods with proper error handling
 * Includes automatic session refresh to prevent stale data
 */
export function useAuth(): UseAuthReturn {
  const { data: session, status, update: updateSession } = useSession();
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());
  const loading = status === "loading";
  const isAuthenticated = status === "authenticated";

  // Auto-refresh session every 30 seconds to ensure fresh data
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isAuthenticated) {
        try {
          await updateSession();
          setLastRefresh(Date.now());
        } catch (error) {
          console.error("Session refresh failed:", error);
        }
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, updateSession]);

  const handleSignIn = useCallback(
    async (provider: string, options?: any) => {
      try {
        const result = await signIn(provider, {
          redirect: false,
          ...options,
        });
        
        if (result?.error) {
          console.error(`Sign in error: ${result.error}`);
          return { error: result.error };
        }

        // Force session update after successful sign in
        if (result?.ok) {
          setTimeout(() => updateSession(), 500);
        }
        
        return result;
      } catch (error) {
        console.error("Sign in failed:", error);
        throw error;
      }
    },
    [updateSession]
  );

  const handleSignOut = useCallback(async () => {
    try {
      await signOut({ redirect: false });
      setLastRefresh(Date.now());
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    }
  }, []);

  const handleRefreshSession = useCallback(async () => {
    try {
      await updateSession();
      setLastRefresh(Date.now());
    } catch (error) {
      console.error("Session refresh failed:", error);
      throw error;
    }
  }, [updateSession]);

  return {
    session,
    user: session?.user || null,
    loading,
    isAuthenticated,
    signIn: handleSignIn,
    signOut: handleSignOut,
    refreshSession: handleRefreshSession,
  };
}
