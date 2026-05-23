import Link from "next/link";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { listCommunities } from "@/app/lib/supabase/communities";
import "./communities.css";

export default async function CommunitiesPage() {
  let communities = [];
  try {
    communities = await listCommunities();
  } catch (err) {
    console.error("listCommunities error:", err);
  }

  return (
    <main className="communities-page">
      <Navbar />
      <div className="communities-page__inner">
        <header className="communities-page__header">
          <p className="communities-page__eyebrow">Communities</p>
          <h1>Write together</h1>
          <p>Join a community, co-author posts, and publish under a shared brand.</p>
        </header>

        {communities.length === 0 ? (
          <p className="communities-page__empty">
            No communities yet. Run the communities migration in Supabase to seed Flutter Kanpur.
          </p>
        ) : (
          <ul className="communities-page__grid">
            {communities.map((community) => (
              <li key={community.id}>
                <Link href={`/communities/${community.slug}`} className="communities-page__card">
                  {community.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={community.logo_url} alt="" className="communities-page__logo" />
                  ) : (
                    <div className="communities-page__logo communities-page__logo--placeholder">
                      {community.name?.charAt(0) ?? "C"}
                    </div>
                  )}
                  <div>
                    <h2>{community.name}</h2>
                    <p>{community.description || "Community blog"}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </main>
  );
}
