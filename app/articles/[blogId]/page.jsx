import { Suspense } from "react";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ArticleCardAuthorInfo from "@/components/ArticleCardAuthorInfo/ArticleCardAuthorInfo";
import { getArticle } from "@/app/lib/data/article";
import {
  buildArticleJsonLd,
  getArticleShareFields,
  serializeJsonLd,
} from "@/app/lib/articleSeo";
import { getArticlePath, isBlogUuid } from "@/app/lib/blogSlug";
import { resolveShareImageUrl } from "@/app/lib/ogImageUrl";
import { parseLikeCount } from "@/app/lib/supabase/likes";
import { parseViewCount } from "@/app/lib/supabase/views";
import RelatedArticlesSection from "./RelatedArticlesSection";
import RelatedArticlesSidebarSkeleton from "./RelatedArticlesSidebarSkeleton";
import AuthorCardSection from "./AuthorCardSection";
// import SidebarAd from "./SidebarAd";
import ArticleEngagement from "./ArticleEngagement";
import ArticleResponsesSection from "./ArticleResponsesSection";
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

  const { title, description, cover, url, publishedTime, modifiedTime } =
    getArticleShareFields(blog);
  const shareImage = cover ? resolveShareImageUrl(cover) : null;
  const authorName = data.author?.name;

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
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authorName ? { authors: [authorName] } : {}),
      ...(shareImage
        ? {
            images: [
              {
                url: shareImage,
                width: 1200,
                height: 630,
                alt: title,
                type: "image/jpeg",
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: shareImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(shareImage ? { images: [shareImage] } : {}),
    },
  };
}

export default async function ArticlePage({ params }) {
  const { blogId: identifier } = await params;
  const data = await getArticle(identifier);

  if (!data?.blog) {
    notFound();
  }

  const { blog, author, coauthors = [], community } = data;

  if (isBlogUuid(identifier) && blog.slug) {
    permanentRedirect(getArticlePath(blog));
  }

  const allAuthors = [author, ...coauthors].filter(
    (profile, index, list) =>
      profile?.authorId &&
      list.findIndex((item) => item.authorId === profile.authorId) === index,
  );

  const articleJsonLd = buildArticleJsonLd({
    blog,
    author,
    coauthors,
  });

  return (
    <div className="article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(articleJsonLd),
        }}
      />
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

            <ArticleResponsesSection blogId={blog.blog_id} />
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
