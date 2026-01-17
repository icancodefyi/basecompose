import Link from "next/link";
import Image from "next/image";
import { getBlogBySlug, getAllBlogs } from "@/lib/blog";
import { ArrowLeft, Share2, Bookmark, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const blogs = getAllBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Post not found | BaseCompose",
    };
  }

  return {
    title: `${blog.title} | BaseCompose Blog`,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  const allBlogs = getAllBlogs();
  const relatedBlogs = allBlogs
    .filter((b) => b.slug !== slug)
    .slice(0, 3);

  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black" style={{ fontFamily: "var(--font-inter)" }}>
      {/* Navigation Bar */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-neutral-800/30 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Featured Image */}
        {blog.image && (
          <div className="w-full h-80 relative overflow-hidden rounded-lg mb-12 bg-neutral-900">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Date */}
        <div className="text-sm text-neutral-400 mb-4">
          <time dateTime={blog.date}>
            {new Date(blog.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Description */}
        <p className="text-lg text-neutral-300 mb-8 leading-relaxed">
          {blog.description}
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 pb-8 border-b border-neutral-800/30 mb-12">
          {blog.authorImage && (
            <Image
              src={blog.authorImage}
              alt={blog.author}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <p className="text-white font-medium">{blog.author}</p>
            <p className="text-sm text-neutral-400">5 min read</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-3xl font-bold text-white mt-12 mb-6 first:mt-0 leading-tight"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-2xl font-bold text-white mt-10 mb-5 leading-tight"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-xl font-bold text-white mt-8 mb-4"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p
                  className="text-base text-neutral-300 leading-relaxed mb-6"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc list-inside text-neutral-300 mb-6 space-y-2"
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="list-decimal list-inside text-neutral-300 mb-6 space-y-2"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li className="text-base text-neutral-300" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-emerald-500 pl-4 py-1 mb-6 italic text-neutral-400 text-sm"
                  {...props}
                />
              ),
              code: ({ inline, ...props }: any) =>
                inline ? (
                  <code
                    className="bg-neutral-900 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-sm"
                    {...props}
                  />
                ) : (
                  <code className="bg-neutral-900 text-neutral-200 block p-4 rounded-lg overflow-x-auto mb-6 font-mono text-sm border border-neutral-800" {...props} />
                ),
              pre: ({ node, ...props }) => (
                <pre
                  className="bg-neutral-900 rounded-lg p-4 mb-6 overflow-x-auto border border-neutral-800"
                  {...props}
                />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="text-emerald-400 hover:text-emerald-300 underline"
                  {...props}
                />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-bold text-white" {...props} />
              ),
              em: ({ node, ...props }) => (
                <em className="italic text-neutral-300" {...props} />
              ),
              table: ({ node, ...props }) => (
                <table
                  className="w-full border-collapse border border-neutral-700 mb-6 text-sm"
                  {...props}
                />
              ),
              th: ({ node, ...props }) => (
                <th
                  className="bg-neutral-900 border border-neutral-700 px-3 py-2 text-left text-white font-bold text-sm"
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td
                  className="border border-neutral-700 px-3 py-2 text-neutral-300 text-sm"
                  {...props}
                />
              ),
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 py-16 border-t border-neutral-800/30">
          <h2 className="text-2xl font-bold text-white mb-10">More Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedBlogs.map((relatedBlog) => (
              <Link
                key={relatedBlog.slug}
                href={`/blog/${relatedBlog.slug}`}
                className="group"
              >
                <article className="pb-8 border-b border-neutral-800/30 hover:border-neutral-700 transition-colors">
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                    <Calendar className="w-3 h-3" />
                    <time dateTime={relatedBlog.date}>
                      {new Date(relatedBlog.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors leading-tight">
                    {relatedBlog.title}
                  </h3>
                  <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                    {relatedBlog.description}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="p-8 rounded-xl bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 border border-emerald-500/20 text-center">
          <h2 className="text-lg font-bold text-white mb-2">
            Ready to start building?
          </h2>
          <p className="text-neutral-400 mb-6 text-sm">
            Experience the power of instant environment setup with BaseCompose
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}
