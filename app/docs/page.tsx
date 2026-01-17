import Link from "next/link";

export default function page() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-white mb-4">000</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page is under development</h2>
        <p className="text-neutral-400 mb-8">
          Documentation is under active development. to speed it up, please contribute on our <a
            className="text-emerald-400 hover:underline"
           href="https://github.com/icancodefyi/basecompose">GitHub</a>!
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/blog"
            className="px-6 py-2 rounded-lg border border-neutral-800 hover:bg-neutral-900 text-white font-semibold transition-colors"
          >
            Read our blogs
          </Link>
        </div>
      </div>
    </main>
  );
}
