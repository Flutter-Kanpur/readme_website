import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ArticleCard from "@/app/components/HomepageComponents/ArticleCard";
import {
  getCommunityBySlug,
  getCommunityPublishedBlogs,
  getCommunityMemberCount,
} from "@/app/lib/supabase/communities";
import { sanitizeCoverImage, buildExcerpt } from "@/app/lib/supabase/queries";
import "../communities.css";

export const revalidate = 60;

export default async function CommunityProfilePage({ params }) {
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);

  if (!community) notFound();

  const [blogs, memberCount] = await Promise.all([
    getCommunityPublishedBlogs(community.id),
    getCommunityMemberCount(community.id),
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
    <main className="communities-page">
      <Navbar />
      <div className="community-profile__inner">
        <header className="community-profile__hero">
          {community.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={community.logo_url} alt="" className="community-profile__logo" />
          ) : (
            <div className="community-profile__logo community-profile__logo--placeholder">
              {community.name?.charAt(0) ?? "C"}
            </div>
          )}
          <div>
            <h1>{community.name}</h1>
            {community.description && <p>{community.description}</p>}
            <p className="community-profile__meta">
              {memberCount} member{memberCount === 1 ? "" : "s"} · {articles.length} published
            </p>
            <div className="community-profile__actions">
              <Link href={`/communities/${slug}/dashboard`} className="community-profile__btn">
                Community dashboard
              </Link>
              <Link href="/write" className="community-profile__btn community-profile__btn--secondary">
                Write for community
              </Link>
            </div>
          </div>
        </header>

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
