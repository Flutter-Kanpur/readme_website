import { supabase } from './index';
import { getSafeUser } from './auth';

export const COMMUNITY_ROLES = ['admin', 'editor', 'contributor'];
export const COMMUNITY_REQUEST_ROLES = ['contributor', 'editor'];

export function canPublishInCommunity(role) {
  return role === 'admin' || role === 'editor';
}

export function isCommunitiesUnavailable(error) {
  if (!error) return false;
  const code = error.code;
  const msg = (error.message || '').toLowerCase();
  return (
    code === 'PGRST205' ||
    code === '42P01' ||
    msg.includes('communities') && msg.includes('schema cache') ||
    msg.includes('community_join_requests')
  );
}

export async function getCommunityBySlug(slug) {
  if (!slug) return null;

  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listCommunities() {
  const { data, error } = await supabase
    .from('communities')
    .select('id, slug, name, description, logo_url, created_at')
    .order('name');

  if (error) throw error;
  return data ?? [];
}

export async function getUserCommunities(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('community_members')
    .select(`
      role,
      communities (
        id,
        slug,
        name,
        description,
        logo_url
      )
    `)
    .eq('user_id', userId);

  if (error) {
    if (isCommunitiesUnavailable(error)) return [];
    throw error;
  }

  return (data ?? [])
    .filter((row) => row.communities)
    .map((row) => ({
      ...row.communities,
      role: row.role,
    }));
}

export async function getCommunityMemberRole(communityId, userId) {
  if (!communityId || !userId) return null;

  const { data, error } = await supabase
    .from('community_members')
    .select('role')
    .eq('community_id', communityId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data?.role ?? null;
}

/** Request to join — admin must approve before membership is granted. */
export async function requestToJoinCommunity(communityId, requestedRole = 'contributor') {
  const user = await getSafeUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');

  if (!COMMUNITY_REQUEST_ROLES.includes(requestedRole)) {
    throw new Error('Join requests can only ask for contributor or editor role.');
  }

  const existingRole = await getCommunityMemberRole(communityId, user.id);
  if (existingRole) throw new Error('You are already a member of this community.');

  const pending = await getPendingJoinRequest(communityId, user.id);
  if (pending) throw new Error('You already have a pending join request.');

  const { error } = await supabase.from('community_join_requests').insert({
    community_id: communityId,
    user_id: user.id,
    requested_role: requestedRole,
    status: 'pending',
  });

  if (error) throw error;
  return requestedRole;
}

export async function getPendingJoinRequest(communityId, userId) {
  if (!communityId || !userId) return null;

  const { data, error } = await supabase
    .from('community_join_requests')
    .select('id, requested_role, status, created_at')
    .eq('community_id', communityId)
    .eq('user_id', userId)
    .eq('status', 'pending')
    .maybeSingle();

  if (error) {
    if (isCommunitiesUnavailable(error)) return null;
    throw error;
  }
  return data;
}

export async function getCommunityJoinRequests(communityId) {
  if (!communityId) return [];

  const { data, error } = await supabase
    .from('community_join_requests')
    .select(`
      id,
      requested_role,
      status,
      created_at,
      profiles (
        id,
        name,
        avatar_url,
        headline
      )
    `)
    .eq('community_id', communityId)
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) {
    if (isCommunitiesUnavailable(error)) return [];
    throw error;
  }

  return (data ?? []).map((row) => ({
    requestId: row.id,
    requestedRole: row.requested_role,
    status: row.status,
    createdAt: row.created_at,
    profile: row.profiles,
  }));
}

export async function approveJoinRequest(requestId, role) {
  const user = await getSafeUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');

  const { data: request, error: fetchError } = await supabase
    .from('community_join_requests')
    .select('id, community_id, user_id, requested_role, status')
    .eq('id', requestId)
    .eq('status', 'pending')
    .single();

  if (fetchError) throw fetchError;

  const finalRole = role || request.requested_role;
  if (!COMMUNITY_ROLES.includes(finalRole) || finalRole === 'admin') {
    throw new Error('Approved role must be contributor or editor.');
  }

  const existingRole = await getCommunityMemberRole(request.community_id, request.user_id);
  if (!existingRole) {
    await addCommunityMember(request.community_id, request.user_id, finalRole);
  }

  const { error: updateError } = await supabase
    .from('community_join_requests')
    .update({
      status: 'approved',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', requestId)
    .eq('status', 'pending');

  if (updateError) throw updateError;
  return finalRole;
}

export async function rejectJoinRequest(requestId) {
  const user = await getSafeUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');

  const { error } = await supabase
    .from('community_join_requests')
    .update({
      status: 'rejected',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', requestId)
    .eq('status', 'pending');

  if (error) throw error;
}

export async function cancelJoinRequest(requestId) {
  const user = await getSafeUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');

  const { error } = await supabase
    .from('community_join_requests')
    .delete()
    .eq('id', requestId)
    .eq('user_id', user.id)
    .eq('status', 'pending');

  if (error) throw error;
}

/** If user created the community but isn't a member yet, add as admin. */
export async function ensureCreatorAdminMembership(community) {
  const user = await getSafeUser();
  if (!user || !community?.id || community.created_by !== user.id) return null;

  const existing = await getCommunityMemberRole(community.id, user.id);
  if (existing) return existing;

  const { error } = await supabase.from('community_members').insert({
    community_id: community.id,
    user_id: user.id,
    role: 'admin',
  });

  if (error) {
    if (error.code === '23505') return 'admin';
    throw error;
  }
  return 'admin';
}

export async function getCommunityMembers(communityId) {
  if (!communityId) return [];

  const { data, error } = await supabase
    .from('community_members')
    .select(`
      id,
      role,
      joined_at,
      profiles (
        id,
        name,
        avatar_url,
        headline
      )
    `)
    .eq('community_id', communityId)
    .order('joined_at');

  if (error) throw error;

  return (data ?? []).map((row) => ({
    membershipId: row.id,
    role: row.role,
    joinedAt: row.joined_at,
    profile: row.profiles,
  }));
}

export async function getCommunityPublishedBlogs(communityId) {
  if (!communityId) return [];

  const { data, error } = await supabase
    .from('blogs')
    .select(`
      blog_id,
      title,
      created_at,
      cover_image,
      category,
      author_id,
      profiles ( name, avatar_url ),
      blog_coauthors (
        user_id,
        profiles ( id, name, avatar_url )
      )
    `)
    .eq('community_id', communityId)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getCommunityDrafts(communityId) {
  if (!communityId) return [];

  const { data, error } = await supabase
    .from('blogs')
    .select(`
      blog_id,
      title,
      created_at,
      author_id,
      profiles ( name, avatar_url )
    `)
    .eq('community_id', communityId)
    .eq('is_published', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getCommunityMemberCount(communityId) {
  if (!communityId) return 0;

  const { count, error } = await supabase
    .from('community_members')
    .select('*', { count: 'exact', head: true })
    .eq('community_id', communityId);

  if (error) throw error;
  return count ?? 0;
}

export async function addCommunityMember(communityId, userId, role = 'contributor') {
  const { error } = await supabase.from('community_members').insert({
    community_id: communityId,
    user_id: userId,
    role,
  });

  if (error) throw error;
}

export async function updateCommunityMemberRole(membershipId, role) {
  const { error } = await supabase
    .from('community_members')
    .update({ role })
    .eq('id', membershipId);

  if (error) throw error;
}

export async function removeCommunityMember(membershipId) {
  const { error } = await supabase
    .from('community_members')
    .delete()
    .eq('id', membershipId);

  if (error) throw error;
}

/** Find profile by exact name match (MVP invite — replace with email lookup later). */
export async function findProfileByName(name) {
  const trimmed = name?.trim();
  if (!trimmed) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, avatar_url')
    .ilike('name', trimmed)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function syncBlogCoauthors(blogId, coAuthorIds, authorId) {
  if (!blogId) return;

  const unique = [
    ...new Set((coAuthorIds ?? []).filter((id) => id && id !== authorId)),
  ];

  const { error: deleteError } = await supabase
    .from('blog_coauthors')
    .delete()
    .eq('blog_id', blogId);

  if (deleteError) throw deleteError;

  if (unique.length === 0) return;

  const { error: insertError } = await supabase.from('blog_coauthors').insert(
    unique.map((user_id) => ({ blog_id: blogId, user_id })),
  );

  if (insertError) throw insertError;
}

export async function getBlogCoauthorIds(blogId) {
  if (!blogId) return [];

  const { data, error } = await supabase
    .from('blog_coauthors')
    .select('user_id')
    .eq('blog_id', blogId);

  if (error) {
    if (isCommunitiesUnavailable(error)) return [];
    throw error;
  }

  return (data ?? []).map((row) => row.user_id);
}

export async function getCurrentUserCommunityRole(communityId) {
  const user = await getSafeUser();
  if (!user || !communityId) return null;
  return getCommunityMemberRole(communityId, user.id);
}
