import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page not found</h2>
        <p className="text-neutral-400 mb-8">
          Sorry, we couldn't find the page you're looking for.
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
            Back to Blog
          </Link>
        </div>
      </div>
    </main>
  );
}
