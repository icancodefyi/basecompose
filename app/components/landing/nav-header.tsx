import Link from "next/link";
import Image from "next/image";
import { NavMetrics } from "../nav/NavMetrics";
import { UserMenu } from "../nav/UserMenu";

export function NavHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-neutral-800">
      <nav className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-white font-bold">
            <Image src="/logo.svg" alt="L" width={32} height={32} />
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
