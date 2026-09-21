'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { getSafeUser } from '@/app/lib/supabase/auth';
import {
  createCommunity,
  slugifyCommunityName,
} from '@/app/lib/supabase/communities';
import { revalidateCommunities } from '@/app/lib/revalidateCommunities';
import '../communities.css';

export default function CreateCommunityPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const user = await getSafeUser();
      if (cancelled) return;
      if (!user) {
        router.replace('/login?next=/communities/new');
        return;
      }
      setAuthChecked(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const previewSlug = useMemo(() => {
    if (slugTouched) return slugifyCommunityName(slug);
    return slugifyCommunityName(name);
  }, [name, slug, slugTouched]);

  const handleNameChange = (value) => {
    setName(value);
    if (!slugTouched) {
      setSlug(slugifyCommunityName(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setMessage('');

    try {
      const community = await createCommunity({
        name,
        slug: slugTouched ? slug : previewSlug,
        description,
      });
      await revalidateCommunities();
      router.push(`/communities/${community.slug}/dashboard`);
      router.refresh();
    } catch (err) {
      setMessage(err.message || 'Could not create community.');
      setSubmitting(false);
    }
  };

  if (!authChecked) {
    return (
      <main className="communities-page communities-page--plain">
        <Navbar />
        <div className="communities-page__inner">
          <p className="communities-create__loading">Checking sign-in…</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="communities-page communities-page--plain">
      <Navbar />
      <div className="communities-page__inner communities-create">
        <Link href="/communities" className="communities-create__back">
          ← Back to communities
        </Link>

        <header className="communities-page__header">
          <p className="communities-page__eyebrow">Onboard</p>
          <h1>Create a community</h1>
          <p>
            Set up a shared space for your group. You become the admin and can
            invite members, publish together, and run a newsletter.
          </p>
        </header>

        <form className="communities-create__form" onSubmit={handleSubmit}>
          <label className="communities-create__field">
            <span>Community name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Flutter Kanpur"
              maxLength={80}
              required
              autoFocus
            />
          </label>

          <label className="communities-create__field">
            <span>URL slug</span>
            <input
              type="text"
              value={slugTouched ? slug : previewSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="flutter-kanpur"
              maxLength={64}
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              title="Lowercase letters, numbers, and hyphens only"
            />
            <small className="communities-create__hint">
              /blogs/communities/{previewSlug || 'your-slug'}
            </small>
          </label>

          <label className="communities-create__field">
            <span>Description (optional)</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this community about?"
              maxLength={500}
              rows={4}
            />
          </label>

          {message ? (
            <p className="communities-create__error" role="alert">
              {message}
            </p>
          ) : null}

          <div className="communities-create__actions">
            <button
              type="submit"
              className="community-profile__btn community-profile__btn--primary"
              disabled={submitting || !name.trim()}
            >
              {submitting ? 'Creating…' : 'Create community'}
            </button>
            <Link href="/communities" className="community-profile__btn community-profile__btn--secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </main>
  );
}
