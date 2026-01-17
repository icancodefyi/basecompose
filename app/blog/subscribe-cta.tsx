"use client";

import { useRef, useState } from "react";

export function SubscribeCTA() {
  const [subStatus, setSubStatus] = useState<null | "success" | "error">(null);
  const [subLoading, setSubLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubStatus(null);
    setSubLoading(true);
    const email = emailRef.current?.value;
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubStatus("success");
        if (emailRef.current) emailRef.current.value = "";
      } else {
        setSubStatus("error");
      }
    } catch {
      setSubStatus("error");
    } finally {
      setSubLoading(false);
    }
  }

  return (
    <div className="mt-12 pt-8 border-t border-neutral-800/20">
      <h4 className="text-sm font-semibold text-white mb-2">Subscribe</h4>
      <p className="text-xs text-neutral-500 mb-4">
        Get new articles delivered to your inbox.
      </p>
      <form className="space-y-2" onSubmit={handleSubscribe}>
        <input
          ref={emailRef}
          type="email"
          placeholder="zaid@impiclabs.com"
          className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
          required
        />
        <button
          type="submit"
          className="w-full px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors disabled:opacity-50"
          disabled={subLoading}
        >
          {subLoading ? "Subscribing..." : "Subscribe"}
        </button>
        {subStatus === "success" && (
          <p className="text-xs text-emerald-400 mt-1">Subscribed!</p>
        )}
        {subStatus === "error" && (
          <p className="text-xs text-red-400 mt-1">Something went wrong. Try again.</p>
        )}
      </form>
    </div>
  );
}
