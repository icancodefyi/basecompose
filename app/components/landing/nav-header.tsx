"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavMetrics } from "../nav/NavMetrics";
import { UserMenu } from "../nav/UserMenu";
import GooeyNav from "@/components/GooeyNav";

const navItems = [
  { label: "Docs", href: "https://basecompose-docs.vercel.app" },
  { label: "Blog", href: "/blog" },
  { label: "Changelogs", href: "/changelogs" },
];

export function NavHeader() {
  const pathname = usePathname();
  
  // Determine active index based on current route
  const getActiveIndex = () => {
    if (pathname.startsWith("/blog")) return 1;
    if (pathname.startsWith("/changelogs")) return 2;
    if (pathname.startsWith("/docs")) return 0;
    return 0;
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between gap-12">
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-white font-bold">
            <Image src="/logo.svg" alt="L" width={32} height={32} />
          </div>
          <span className="text-white font-semibold text-sm">BaseCompose.</span>
        </Link>

        <div className="flex-1 flex justify-center">
          <GooeyNav items={navItems} initialActiveIndex={getActiveIndex()} />
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <NavMetrics />
          <div className="h-5 w-px bg-neutral-700/60" />
          <UserMenu />
        </div>
      </nav>
    </header>
  );
}
