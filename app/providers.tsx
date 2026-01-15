"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={30} // Refetch session every 30 seconds
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
      basePath="/api/auth"
      // Force session update on tab focus to catch account changes
      onUnauthenticated={() => {
        // Clear any stale session data
        if (typeof window !== "undefined") {
          sessionStorage.clear();
        }
      }}
    >
      {children}
    </SessionProvider>
  );
}
