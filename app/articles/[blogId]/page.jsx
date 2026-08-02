import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ArticleCardAuthorInfo from "@/components/ArticleCardAuthorInfo/ArticleCardAuthorInfo";
import { getArticle } from "@/app/lib/data/article";
import {
  buildExcerpt,
  sanitizeCoverImage,
} from "@/app/lib/supabase/queries";
import { parseLikeCount } from "@/app/lib/supabase/likes";
import { parseViewCount } from "@/app/lib/supabase/views";
import RelatedArticlesSection from "./RelatedArticlesSection";
import RelatedArticlesSidebarSkeleton from "./RelatedArticlesSidebarSkeleton";
import AuthorCardSection from "./AuthorCardSection";
// import SidebarAd from "./SidebarAd";
import ArticleEngagement from "./ArticleEngagement";
import "./styles.css";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { blogId } = await params;
  const data = await getArticle(blogId);
  const blog = data?.blog;

  if (!blog) {
    return {
      title: "Article not found",
      description: "This article may have been removed or is unavailable.",
    };
  }

  const title = blog.title?.trim() || "Untitled";
  const description =
    (typeof blog.excerpt === "string" && blog.excerpt.trim()) ||
    buildExcerpt(blog.content, 160) ||
    "Read this story on Readme.";
  const cover = sanitizeCoverImage(blog.cover_image);
  // Absolute URL must include basePath (/blogs). metadataBase does not add it.
  const url = `https://readme.flutterkanpur.in/blogs/articles/${blog.blog_id || blogId}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: "Readme",
      ...(cover
        ? {
            images: [
              {
                url: cover,
                width: 1200,
                height: 630,
                alt: title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: cover ? "summary_large_image" : "summary",
      title,
      description,
      ...(cover ? { images: [cover] } : {}),
    },
  };
}

export default async function ArticlePage({ params }) {
  const { blogId } = await params;
  const data = await getArticle(blogId);

  if (!data?.blog) {
    notFound();
  }

  const { blog, author, coauthors = [], community } = data;

  const allAuthors = [author, ...coauthors].filter(
    (profile, index, list) =>
      profile?.authorId &&
      list.findIndex((item) => item.authorId === profile.authorId) === index,
  );

  return (
    <div className="article-page">
      <Navbar />
      <div className="article-page-layout">
        <div className="article-container">
          <article className="article-main">
            <h1 className="article-title">{blog.title}</h1>

            {author && (
              <ArticleCardAuthorInfo
                author={author}
                coauthors={coauthors}
                community={community}
                createdAt={blog.created_at}
              />
            )}

            <ArticleEngagement
              blogId={blog.blog_id}
              initialLikeCount={parseLikeCount(blog)}
              initialViewCount={parseViewCount(blog)}
            />

            {blog.cover_image && (
              <div className="article-cover">
                <Image
                  src={blog.cover_image}
                  alt={blog.title}
                  width={1200}
                  height={630}
                  className="cover-image"
                  priority
                />
              </div>
            )}

            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          <aside className="article-sidebar">
            <AuthorCardSection authors={allAuthors} />
            {/* <SidebarAd /> */}
            <Suspense fallback={<RelatedArticlesSidebarSkeleton />}>
              <RelatedArticlesSection
                authorId={blog.author_id}
                blogId={blog.blog_id}
              />
            </Suspense>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
