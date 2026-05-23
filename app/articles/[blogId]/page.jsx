import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ArticleCardAuthorInfo from "@/components/ArticleCardAuthorInfo/ArticleCardAuthorInfo";
import { getArticleWithAuthor } from "@/app/lib/supabase/queries";
import RelatedArticlesSection from "./RelatedArticlesSection";
import RelatedArticlesSidebarSkeleton from "./RelatedArticlesSidebarSkeleton";
import AuthorCardSection from "./AuthorCardSection";
import SideBannerAd from "./SideBannerAd";
import "./styles.css";

export const revalidate = 60;

export default async function ArticlePage({ params }) {
  const { blogId } = await params;
  const data = await getArticleWithAuthor(blogId);

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
        <SideBannerAd position="left" />
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
            <Suspense fallback={<RelatedArticlesSidebarSkeleton />}>
              <RelatedArticlesSection
                authorId={blog.author_id}
                blogId={blog.blog_id}
              />
            </Suspense>
          </aside>
        </div>
        <SideBannerAd position="right" />
      </div>
      <Footer />
    </div>
  );
}
