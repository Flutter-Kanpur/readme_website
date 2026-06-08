import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import {
  getCommunityBySlug,
  getCommunityNewsletter,
} from "@/app/lib/supabase/communities";
import { isPdfUrl, formatFileSize } from "@/app/lib/uploadCommunityNewsletter";
import "../../../communities.css";

export const revalidate = 60;

export default async function CommunityNewsletterPage({ params }) {
  const { slug, newsletterId } = await params;

  const [community, issue] = await Promise.all([
    getCommunityBySlug(slug),
    getCommunityNewsletter(newsletterId),
  ]);

  if (!community || !issue || issue.community_id !== community.id) {
    notFound();
  }

  return (
    <main className="communities-page communities-page--plain no-bottom-nav">
      <Navbar hideBottomNav plain />
      <article className="newsletter-detail">
        <Link
          href={`/communities/${slug}`}
          className="community-profile__back"
        >
          ← Back to {community.name}
        </Link>

        <header className="newsletter-detail__header">
          <p className="newsletter-detail__eyebrow">
            {community.name} · Newsletter
          </p>
          <h1>{issue.title}</h1>
          <p className="newsletter-detail__meta">
            {new Date(issue.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {issue.author?.name ? ` · by ${issue.author.name}` : ""}
          </p>
        </header>

        {issue.body && (
          <div className="newsletter-detail__body">
            {issue.body.split(/\n{2,}/).map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        )}

        {issue.file_url && (
          <div className="newsletter-attachment">
            <div className="newsletter-attachment__row">
              <div className="newsletter-attachment__info">
                <span className="newsletter-attachment__icon" aria-hidden="true">
                  📎
                </span>
                <div>
                  <p className="newsletter-attachment__name">
                    {issue.file_name || "Newsletter attachment"}
                  </p>
                  {issue.file_size_bytes ? (
                    <p className="newsletter-attachment__size">
                      {formatFileSize(issue.file_size_bytes)}
                    </p>
                  ) : null}
                </div>
              </div>
              <a
                href={issue.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="community-profile__btn community-profile__btn--primary"
              >
                Download
              </a>
            </div>

            {isPdfUrl(issue.file_url) && (
              <object
                data={issue.file_url}
                type="application/pdf"
                className="newsletter-attachment__pdf"
                aria-label={issue.file_name || "Newsletter PDF"}
              >
                <p className="newsletter-attachment__fallback">
                  Your browser can't preview PDFs inline.{" "}
                  <a
                    href={issue.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Open the PDF in a new tab
                  </a>
                  .
                </p>
              </object>
            )}

            {!isPdfUrl(issue.file_url) &&
              /\.(png|jpg|jpeg|webp)$/i.test(issue.file_url.split("?")[0]) && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={issue.file_url}
                  alt={issue.file_name || ""}
                  className="newsletter-attachment__image"
                />
              )}
          </div>
        )}
      </article>
      <Footer />
    </main>
  );
}
