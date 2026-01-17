import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogsDirectory = path.join(process.cwd(), "content", "blog");

export interface BlogMetadata {
  title: string;
  slug: string;
  date: string;
  author: string;
  authorImage: string;
  description: string;
  image: string;
  featured?: boolean;
}

export interface BlogPost extends BlogMetadata {
  content: string;
}

export function getAllBlogs(): BlogMetadata[] {
  const fileNames = fs.readdirSync(blogsDirectory);

  const blogs = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const fullPath = path.join(blogsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      // Check if local image exists, otherwise use frontmatter or default
      const localImagePath = path.join(process.cwd(), "public", "blogs", `${data.slug}.png`);
      const hasLocalImage = fs.existsSync(localImagePath);
      const imageUrl = hasLocalImage 
        ? `/blogs/${data.slug}.png`
        : data.image ;

      return {
        title: data.title,
        slug: data.slug,
        date: data.date,
        author: data.author || "Zaid Rakhange",
        authorImage: data.authorImage || "https://github.com/icancodefyi.png",
        description: data.description,
        image: imageUrl,
        featured: data.featured || false,
      };
    });

  // Sort by date, newest first
  return blogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBlogBySlug(slug: string): BlogPost | null {
  try {
    const fileNames = fs.readdirSync(blogsDirectory);
    const fileName = fileNames.find((name) => {
      const fullPath = path.join(blogsDirectory, name);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return data.slug === slug;
    });

    if (!fileName) return null;

    const fullPath = path.join(blogsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Check if local image exists, otherwise use frontmatter or default
    const localImagePath = path.join(process.cwd(), "public", "blogs", `${data.slug}.png`);
    const hasLocalImage = fs.existsSync(localImagePath);
    const imageUrl = hasLocalImage 
      ? `/blogs/${data.slug}.png`
      : data.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop";

    return {
      title: data.title,
      slug: data.slug,
      date: data.date,
      author: data.author || "Zaid Rakhange",
      authorImage: data.authorImage || "https://github.com/icancodefyi.png",
      description: data.description,
      image: imageUrl,
      featured: data.featured || false,
      content,
    };
  } catch {
    return null;
  }
}

export function getFeaturedBlogs(): BlogMetadata[] {
  return getAllBlogs().filter((blog) => blog.featured).slice(0, 3);
}
