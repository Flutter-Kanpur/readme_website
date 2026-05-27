'use client';

import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { getSafeUser } from '@/app/lib/supabase/auth';
import {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getMyNewsletterSubscription,
} from '@/app/lib/supabase/communities';

export default function NewsletterSubscribe({
  communityId,
  communityName,
  initialSubscriberCount = 0,
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subscriberCount, setSubscriberCount] = useState(initialSubscriberCount);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const safeUser = await getSafeUser();
      if (cancelled) return;
      setUser(safeUser);
      if (safeUser && communityId) {
        const sub = await getMyNewsletterSubscription(communityId);
        if (!cancelled) setSubscription(sub);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [communityId]);

  const handleSubscribe = async (e) => {
    e?.preventDefault?.();
    if (submitting) return;
    setSubmitting(true);
    setMessage('');

    try {
      const email = user?.email || guestEmail;
      const result = await subscribeToNewsletter(communityId, email);
      if (user) {
        const sub = await getMyNewsletterSubscription(communityId);
        setSubscription(sub);
      }
      setGuestEmail('');
      setSubscriberCount((n) => n + (result.alreadySubscribed ? 0 : 1));
      setMessage(
        result.alreadySubscribed
          ? `You're already subscribed${communityName ? ` to ${communityName}` : ''}.`
          : `Subscribed${communityName ? ` to ${communityName}` : ''}! Watch your inbox each month.`,
      );
    } catch (err) {
      setMessage(err.message || 'Could not subscribe. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (submitting || !user) return;
    setSubmitting(true);
    setMessage('');
    try {
      await unsubscribeFromNewsletter(communityId);
      setSubscription(null);
      setSubscriberCount((n) => Math.max(0, n - 1));
      setMessage('Unsubscribed.');
    } catch (err) {
      setMessage(err.message || 'Could not unsubscribe.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="newsletter-card" aria-label="Monthly newsletter">
      <div className="newsletter-card__header">
        <div className="newsletter-card__icon" aria-hidden="true">
          <Mail size={20} />
        </div>
        <div className="newsletter-card__heading">
          <h3>Monthly newsletter</h3>
          <p>
            Get a monthly recap from {communityName ?? 'this community'} —
            highlights, new posts, and what's next.
          </p>
        </div>
      </div>

      {!loading && user && subscription && (
        <div className="newsletter-card__row">
          <span className="newsletter-card__status">
            Subscribed as <strong>{subscription.email}</strong>
          </span>
          <button
            type="button"
            onClick={handleUnsubscribe}
            disabled={submitting}
            className="newsletter-card__btn newsletter-card__btn--ghost"
          >
            {submitting ? 'Working…' : 'Unsubscribe'}
          </button>
        </div>
      )}

      {!loading && user && !subscription && (
        <form onSubmit={handleSubscribe} className="newsletter-card__row">
          <span className="newsletter-card__status">
            Subscribe with <strong>{user.email}</strong>
          </span>
          <button
            type="submit"
            disabled={submitting}
            className="newsletter-card__btn newsletter-card__btn--primary"
          >
            {submitting ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
      )}

      {!loading && !user && (
        <form onSubmit={handleSubscribe} className="newsletter-card__row newsletter-card__row--guest">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            className="newsletter-card__input"
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={submitting || !guestEmail}
            className="newsletter-card__btn newsletter-card__btn--primary"
          >
            {submitting ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
      )}

      <p className="newsletter-card__meta">
        {subscriberCount} subscriber{subscriberCount === 1 ? '' : 's'}
      </p>

      {message && <p className="newsletter-card__message">{message}</p>}
    </section>
  );
}
