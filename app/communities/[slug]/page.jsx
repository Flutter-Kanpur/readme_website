import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ArticleCard from "@/app/components/HomepageComponents/ArticleCard";
import NewsletterSubscribe from "@/app/components/NewsletterSubscribe";
import {
  getCommunityBySlug,
  getCommunityPublishedBlogs,
  getCommunityMemberCount,
  getCommunityNewsletters,
  getCommunityNewsletterSubscriberCount,
} from "@/app/lib/supabase/communities";
import { getCommunityFollowerCount } from "@/app/lib/supabase/communityFollows";
import { sanitizeCoverImage, buildExcerpt } from "@/app/lib/supabase/queries";
import CommunityProfileHero from "./CommunityProfileHero";
import "../communities.css";

export const revalidate = 60;

function buildNewsletterPreview(issue) {
  if (issue.body) {
    const stripped = issue.body.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    return stripped.length > 220 ? `${stripped.slice(0, 220)}…` : stripped;
  }
  if (issue.file_name) {
    return `Attached file · ${issue.file_name}`;
  }
  return "View this issue";
}

export default async function CommunityProfilePage({ params }) {
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);

  if (!community) notFound();

  const [blogs, memberCount, newsletters, subscriberCount, followerCount] =
    await Promise.all([
    getCommunityPublishedBlogs(community.id),
    getCommunityMemberCount(community.id),
    getCommunityNewsletters(community.id, { limit: 6 }),
    getCommunityNewsletterSubscriberCount(community.id),
    getCommunityFollowerCount(community.id),
  ]);

  const articles = blogs.map((blog) => ({
    blog_id: blog.blog_id,
    title: blog.title,
    created_at: blog.created_at,
    cover_image: sanitizeCoverImage(blog.cover_image),
    category: blog.category,
    profiles: blog.profiles,
    communities: {
      id: community.id,
      name: community.name,
      slug: community.slug,
      logo_url: community.logo_url,
    },
    blog_coauthors: blog.blog_coauthors ?? [],
    excerpt: buildExcerpt(blog.content),
  }));

  return (
    <main className="communities-page communities-page--plain no-bottom-nav">
      <Navbar hideBottomNav />
      <div className="community-profile__inner">
        <Link href="/communities" className="community-profile__back">
          ← Back to Communities
        </Link>
        <CommunityProfileHero
          community={community}
          slug={slug}
          contributorCount={memberCount}
          initialFollowerCount={followerCount}
          publishedCount={articles.length}
        />

        <NewsletterSubscribe
          communityId={community.id}
          communityName={community.name}
          initialSubscriberCount={subscriberCount}
        />

        {newsletters.length > 0 && (
          <section className="newsletter-archive">
            <div className="newsletter-archive__header">
              <h2>Newsletter archive</h2>
              <p>Past monthly issues from {community.name}.</p>
            </div>
            <ul className="newsletter-archive__list">
              {newsletters.map((issue) => (
                <li key={issue.id}>
                  <Link
                    href={`/communities/${slug}/newsletters/${issue.id}`}
                    className="newsletter-archive__item"
                  >
                    <div className="newsletter-archive__meta">
                      <span className="newsletter-archive__date">
                        {new Date(issue.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      {issue.author?.name && (
                        <span className="newsletter-archive__author">
                          by {issue.author.name}
                        </span>
                      )}
                      {issue.file_url && (
                        <span className="newsletter-archive__attachment">
                          📎 attachment
                        </span>
                      )}
                    </div>
                    <h3>{issue.title}</h3>
                    <p>{buildNewsletterPreview(issue)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold mb-4">Published articles</h2>
          {articles.length === 0 ? (
            <p className="communities-page__empty">No published community posts yet.</p>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <ArticleCard key={article.blog_id} article={article} />
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}
