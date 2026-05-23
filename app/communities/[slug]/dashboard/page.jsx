'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { getSafeUser } from '@/app/lib/supabase/auth';
import {
  getCommunityBySlug,
  getCommunityMembers,
  getCommunityDrafts,
  getCommunityMemberRole,
  getCommunityJoinRequests,
  getPendingJoinRequest,
  ensureCreatorAdminMembership,
  requestToJoinCommunity,
  approveJoinRequest,
  rejectJoinRequest,
  cancelJoinRequest,
  addCommunityMember,
  updateCommunityMemberRole,
  removeCommunityMember,
  findProfileByName,
  COMMUNITY_ROLES,
  COMMUNITY_REQUEST_ROLES,
} from '@/app/lib/supabase/communities';
import '../../communities.css';

export default function CommunityDashboardPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [myRole, setMyRole] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [tab, setTab] = useState('drafts');
  const [loading, setLoading] = useState(true);
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('contributor');
  const [requestRole, setRequestRole] = useState('contributor');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = myRole === 'admin';

  async function reload(communityId, admin) {
    const [memberRows, draftRows, requestRows] = await Promise.all([
      getCommunityMembers(communityId),
      getCommunityDrafts(communityId),
      admin ? getCommunityJoinRequests(communityId) : Promise.resolve([]),
    ]);
    setMembers(memberRows);
    setDrafts(draftRows);
    setJoinRequests(requestRows);
  }

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      setMessage('');
      try {
        const user = await getSafeUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const data = await getCommunityBySlug(slug);
        if (!data) {
          setMessage('Community not found.');
          return;
        }

        setCommunity(data);

        let role = await ensureCreatorAdminMembership(data);
        if (!role) {
          role = await getCommunityMemberRole(data.id, user.id);
        }

        if (!role) {
          const pending = await getPendingJoinRequest(data.id, user.id);
          setPendingRequest(pending);
          setMyRole(null);
          return;
        }

        setMyRole(role);
        setPendingRequest(null);
        await reload(data.id, role === 'admin');
      } catch (err) {
        console.error(err);
        setMessage(err.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, router]);

  const handleRequestJoin = async () => {
    if (!community) return;
    setSubmitting(true);
    setMessage('');
    try {
      await requestToJoinCommunity(community.id, requestRole);
      const pending = await getPendingJoinRequest(community.id, (await getSafeUser())?.id);
      setPendingRequest(pending);
      setMessage('Join request sent. An admin will review it soon.');
    } catch (err) {
      setMessage(err.message || 'Could not send join request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!pendingRequest) return;
    setSubmitting(true);
    setMessage('');
    try {
      await cancelJoinRequest(pendingRequest.id);
      setPendingRequest(null);
      setMessage('Join request cancelled.');
    } catch (err) {
      setMessage(err.message || 'Could not cancel request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveRequest = async (requestId, role) => {
    if (!community || !isAdmin) return;
    setMessage('');
    try {
      await approveJoinRequest(requestId, role);
      await reload(community.id, true);
      setMessage('Join request approved.');
    } catch (err) {
      setMessage(err.message || 'Could not approve request.');
    }
  };

  const handleRejectRequest = async (requestId) => {
    if (!community || !isAdmin) return;
    setMessage('');
    try {
      await rejectJoinRequest(requestId);
      await reload(community.id, true);
      setMessage('Join request rejected.');
    } catch (err) {
      setMessage(err.message || 'Could not reject request.');
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!community || !isAdmin) return;
    setMessage('');
    try {
      const profile = await findProfileByName(inviteName);
      if (!profile) {
        setMessage('No user found with that exact name.');
        return;
      }
      await addCommunityMember(community.id, profile.id, inviteRole);
      setInviteName('');
      await reload(community.id, true);
      setMessage(`Added ${profile.name} as ${inviteRole}.`);
    } catch (err) {
      setMessage(err.message || 'Invite failed.');
    }
  };

  const handleRoleChange = async (membershipId, role) => {
    if (!community || !isAdmin) return;
    try {
      await updateCommunityMemberRole(membershipId, role);
      await reload(community.id, true);
    } catch (err) {
      setMessage(err.message || 'Could not update role.');
    }
  };

  const handleRemove = async (membershipId) => {
    if (!community || !isAdmin) return;
    if (!confirm('Remove this member?')) return;
    try {
      await removeCommunityMember(membershipId);
      await reload(community.id, true);
    } catch (err) {
      setMessage(err.message || 'Could not remove member.');
    }
  };

  if (loading) {
    return (
      <main className="communities-page">
        <Navbar />
        <div className="community-profile__inner"><p>Loading dashboard…</p></div>
      </main>
    );
  }

  return (
    <main className="communities-page">
      <Navbar />
      <div className="community-profile__inner">
        <header className="mb-6">
          <Link href={`/communities/${slug}`} className="text-sm text-blue-600 hover:underline">
            ← Back to {community?.name ?? 'community'}
          </Link>
          <h1 className="text-2xl font-bold mt-2">{community?.name} dashboard</h1>
          <p className="text-gray-500 text-sm">Your role: {myRole ?? 'none'}</p>
        </header>

        {message && (
          <p className="mb-4 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            {message}
          </p>
        )}

        {!myRole && community && !pendingRequest && (
          <div className="community-dashboard__panel">
            <p className="text-gray-600 text-sm mb-4">
              Request to join {community.name}. An admin must approve before you can write or
              publish as this community.
            </p>
            <div className="community-dashboard__request-form">
              <label htmlFor="request-role" className="text-sm text-gray-600">
                Requested role
              </label>
              <select
                id="request-role"
                value={requestRole}
                onChange={(e) => setRequestRole(e.target.value)}
                className="text-sm border rounded-lg px-2 py-1"
              >
                {COMMUNITY_REQUEST_ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleRequestJoin}
                disabled={submitting}
                className="community-profile__btn community-profile__btn--primary"
              >
                {submitting ? 'Sending…' : 'Request to join'}
              </button>
            </div>
          </div>
        )}

        {!myRole && community && pendingRequest && (
          <div className="community-dashboard__panel">
            <p className="text-gray-600 text-sm mb-2">
              Your request to join as <strong>{pendingRequest.requested_role}</strong> is pending
              admin approval.
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Requested on {new Date(pendingRequest.created_at).toLocaleString()}
            </p>
            <button
              type="button"
              onClick={handleCancelRequest}
              disabled={submitting}
              className="community-profile__btn community-profile__btn--secondary"
            >
              {submitting ? 'Cancelling…' : 'Cancel request'}
            </button>
          </div>
        )}

        {!myRole ? null : (
          <>
            <div className="community-dashboard__tabs">
              <button
                type="button"
                className={`community-dashboard__tab${tab === 'drafts' ? ' community-dashboard__tab--active' : ''}`}
                onClick={() => setTab('drafts')}
              >
                Drafts
              </button>
              {isAdmin && (
                <>
                  <button
                    type="button"
                    className={`community-dashboard__tab${tab === 'requests' ? ' community-dashboard__tab--active' : ''}`}
                    onClick={() => setTab('requests')}
                  >
                    Requests{joinRequests.length > 0 ? ` (${joinRequests.length})` : ''}
                  </button>
                  <button
                    type="button"
                    className={`community-dashboard__tab${tab === 'members' ? ' community-dashboard__tab--active' : ''}`}
                    onClick={() => setTab('members')}
                  >
                    Members
                  </button>
                </>
              )}
            </div>

            {tab === 'drafts' && (
              <div className="community-dashboard__panel">
                <h2 className="font-semibold mb-3">Community drafts</h2>
                {drafts.length === 0 ? (
                  <p className="text-gray-500 text-sm">No drafts for this community.</p>
                ) : (
                  <ul className="list-none p-0 m-0">
                    {drafts.map((draft) => (
                      <li key={draft.blog_id} className="community-dashboard__row">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{draft.title || 'Untitled'}</p>
                          <p className="text-xs text-gray-500">
                            {draft.profiles?.name ?? 'Unknown'} ·{' '}
                            {new Date(draft.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Link href={`/edit/${draft.blog_id}`} className="community-profile__btn community-profile__btn--secondary">
                          Edit
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {tab === 'requests' && isAdmin && (
              <div className="community-dashboard__panel">
                <h2 className="font-semibold mb-3">Pending join requests</h2>
                {joinRequests.length === 0 ? (
                  <p className="text-gray-500 text-sm">No pending requests.</p>
                ) : (
                  joinRequests.map(({ requestId, requestedRole, createdAt, profile }) => (
                    <div key={requestId} className="community-dashboard__row community-dashboard__row--stack">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{profile?.name ?? 'Unknown user'}</p>
                        <p className="text-xs text-gray-500">
                          Wants to join as {requestedRole} ·{' '}
                          {new Date(createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="community-dashboard__request-actions">
                        <select
                          defaultValue={requestedRole}
                          id={`approve-role-${requestId}`}
                          className="text-sm border rounded-lg px-2 py-1"
                        >
                          {COMMUNITY_REQUEST_ROLES.map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const select = document.getElementById(`approve-role-${requestId}`);
                            handleApproveRequest(requestId, select?.value || requestedRole);
                          }}
                          className="community-profile__btn community-profile__btn--primary"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectRequest(requestId)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'members' && isAdmin && (
              <div className="community-dashboard__panel">
                <h2 className="font-semibold mb-3">Members</h2>
                {members.map(({ membershipId, role, profile }) => (
                  <div key={membershipId} className="community-dashboard__row">
                    <span className="flex-1">{profile?.name ?? 'Unknown'}</span>
                    <select
                      value={role}
                      onChange={(e) => handleRoleChange(membershipId, e.target.value)}
                      className="text-sm border rounded-lg px-2 py-1"
                    >
                      {COMMUNITY_ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemove(membershipId)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <form onSubmit={handleInvite} className="community-dashboard__invite">
                  <input
                    type="text"
                    placeholder="Exact profile name to invite"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    required
                  />
                  <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                    {COMMUNITY_ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <button type="submit">Invite</button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}
