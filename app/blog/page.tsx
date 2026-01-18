import Link from "next/link";
import Image from "next/image";
import { getAllBlogs } from "@/lib/blog";
import { ArrowRight, Calendar, User } from "lucide-react";
import { SubscribeCTA } from "./subscribe-cta";
import { NavHeader } from "../components/landing/nav-header";
import Footer from "../components/landing/footer/footer";
import FinalCTA from "../components/landing/final-cta/final-cta";
export const metadata = {
  title: "Blog | BaseCompose",
  description: "Latest articles about development, architecture, and tools",
};

export default function BlogPage() {
  const blogs = getAllBlogs();

  return (
    <main className="min-h-screen bg-black" style={{ fontFamily: "var(--font-inter)" }}>
      {/* Header */}
      <NavHeader/>
      <section className="pt-32 pb-16 px-6 relative overflow-hidden border-b border-neutral-800/20">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-5xl font-bold text-white mb-3 leading-tight">
            Welcome, world.
          </h1>
          <p className="text-base text-neutral-400 leading-relaxed">
            Notes on BaseCompose development, releases, and design decisions and your answer to <i>why it is like this?</i>.
          </p>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 lg:border-r border-neutral-800/20 lg:pr-8">
            <div className="sticky top-32">
              <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Popular Posts</h3>
              <nav className="space-y-4">
                {blogs.slice(0, 3).map((blog) => (
                  <Link
                    key={blog.slug}
                    href={`/blog/${blog.slug}`}
                    className="group block"
                  >
                    <p className="text-sm text-neutral-400 group-hover:text-emerald-400 transition-colors leading-relaxed line-clamp-2">
                      {blog.title}
                    </p>
                  </Link>
                ))}
              </nav>

              {/* Subscribe CTA */}
              <SubscribeCTA />
            </div>
          </aside>

          {/* Blog Posts Grid */}
          <section className="lg:col-span-3">
            {blogs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-neutral-400 text-base">
                  No blog posts yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {blogs.map((blog) => (
                  <Link
                    key={blog.slug}
                    href={`/blog/${blog.slug}`}
                    className="group block"
                  >
                    <article className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-neutral-800/20 hover:border-neutral-700/50 transition-colors">
                      {/* Image */}
                      {blog.image && (
                        <div className="flex-shrink-0 w-full sm:w-48 h-48 sm:h-40 relative overflow-hidden rounded-lg bg-neutral-800">
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        {/* Metadata */}
                        <div>
                          <time className="text-xs text-neutral-500">
                            {new Date(blog.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                          
                          {/* Title */}
                          <h2 className="text-xl font-bold text-white mt-2 mb-2 group-hover:text-emerald-400 transition-colors leading-snug">
                            {blog.title}
                          </h2>

                          {/* Description */}
                          <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors line-clamp-2">
                            {blog.description}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm mt-4 group-hover:gap-3 transition-all">
                          <span>Read More</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <FinalCTA/>
<Footer/>

    </main>
  );
}
