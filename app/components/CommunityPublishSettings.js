'use client';

import { useEffect, useState } from 'react';
import {
  getCommunityMembers,
  canPublishInCommunity,
} from '@/app/lib/supabase/communities';
import './CommunityPublishSettings.css';

export default function CommunityPublishSettings({
  communities = [],
  communityId,
  coAuthorIds = [],
  onChange,
}) {
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const selectedCommunity = communities.find((c) => c.id === communityId);
  const canPublish = !communityId || canPublishInCommunity(selectedCommunity?.role);

  useEffect(() => {
    if (!communityId) {
      setMembers([]);
      return;
    }

    let cancelled = false;
    setLoadingMembers(true);

    getCommunityMembers(communityId)
      .then((data) => {
        if (!cancelled) setMembers(data);
      })
      .catch((err) => {
        console.error('Failed to load community members:', err);
        if (!cancelled) setMembers([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingMembers(false);
      });

    return () => {
      cancelled = true;
    };
  }, [communityId]);

  const handleCommunityChange = (value) => {
    const nextId = value || null;
    onChange?.({ communityId: nextId, coAuthorIds: [] });
  };

  const toggleCoAuthor = (userId) => {
    const next = coAuthorIds.includes(userId)
      ? coAuthorIds.filter((id) => id !== userId)
      : [...coAuthorIds, userId];
    onChange?.({ communityId, coAuthorIds: next });
  };

  return (
    <div className="community-publish-settings">
      <h3 className="community-publish-settings__title">PUBLISH AS</h3>

      <div className="community-publish-settings__section">
        <label className="community-publish-settings__label" htmlFor="publish-as">
          Account
        </label>
        <select
          id="publish-as"
          value={communityId ?? ''}
          onChange={(e) => handleCommunityChange(e.target.value || null)}
          className="community-publish-settings__select"
        >
          <option value="">Personal (just me)</option>
          {communities.map((community) => (
            <option key={community.id} value={community.id}>
              {community.name} ({community.role})
            </option>
          ))}
        </select>
      </div>

      {communityId && !canPublish && (
        <p className="community-publish-settings__hint community-publish-settings__hint--warn">
          Contributors can save drafts for this community. An editor or admin must publish.
        </p>
      )}

      {communityId && (
        <div className="community-publish-settings__section">
          <label className="community-publish-settings__label">Co-authors</label>
          {loadingMembers ? (
            <p className="community-publish-settings__hint">Loading members…</p>
          ) : members.length === 0 ? (
            <p className="community-publish-settings__hint">No other members yet.</p>
          ) : (
            <ul className="community-publish-settings__members">
              {members.map(({ profile, role }) => {
                if (!profile) return null;
                const checked = coAuthorIds.includes(profile.id);
                return (
                  <li key={profile.id}>
                    <label className="community-publish-settings__member">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCoAuthor(profile.id)}
                      />
                      <span>{profile.name || 'Unnamed'}</span>
                      <span className="community-publish-settings__role">{role}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
