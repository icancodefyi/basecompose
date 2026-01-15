import Link from "next/link";
import { NavMetrics } from "./NavMetrics";
import { UserMenu } from "./UserMenu";

export function NavHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-neutral-800">
      <nav className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
            L
          </div>
          <span className="text-white font-semibold">Layered</span>
        </Link>

        <div className="flex items-center gap-4">
          <NavMetrics />
          <UserMenu />
        </div>
      </nav>
    </header>
  );
}
