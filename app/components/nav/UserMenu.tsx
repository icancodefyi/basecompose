"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return (
      <Button
        size="sm"
        onClick={() => signIn("google")}
        className="bg-white text-black hover:bg-neutral-200"
      >
        Login
      </Button>
    );
  }

  return (
    <div className="relative group">
      <img
        src={session.user?.image || ""}
        className="w-9 h-9 rounded-full border border-neutral-700 cursor-pointer"
      />

      <div className="absolute right-0 mt-2 w-40 rounded-xl bg-neutral-900 border border-neutral-800 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
        <button
          onClick={() => router.push("/chat")}
          className="w-full px-4 py-2 text-sm hover:bg-neutral-800"
        >
          Go to App
        </button>
        <button
          onClick={() => signOut()}
          className="w-full px-4 py-2 text-sm text-red-400 hover:bg-neutral-800"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
