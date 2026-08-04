import { supabase } from './index';
import { getSafeUser } from './auth';

const COMMENT_SELECT = `
  id,
  blog_id,
  user_id,
  parent_id,
  body,
  like_count,
  created_at,
  profiles!blog_comments_user_id_fkey (
    id,
    name,
    avatar_url
  )
`;

function parseCommentRow(row) {
  const profile = row.profiles;
  return {
    id: row.id,
    blogId: row.blog_id,
    parentId: row.parent_id,
    body: row.body,
    likeCount: typeof row.like_count === 'number' ? row.like_count : parseInt(row.like_count, 10) || 0,
    createdAt: row.created_at,
    author: {
      id: profile?.id ?? row.user_id,
      name: profile?.name ?? 'Unknown',
      avatarUrl: profile?.avatar_url ?? null,
    },
    isLiked: false,
    replies: [],
  };
}

function groupComments(rows) {
  const topLevel = [];
  const repliesByParent = new Map();

  for (const row of rows) {
    const comment = parseCommentRow(row);
    if (!comment.parentId) {
      topLevel.push(comment);
    } else {
      const list = repliesByParent.get(comment.parentId) ?? [];
      list.push(comment);
      repliesByParent.set(comment.parentId, list);
    }
  }

  return topLevel.map((comment) => ({
    ...comment,
    replies: repliesByParent.get(comment.id) ?? [],
  }));
}

export async function fetchComments(blogId) {
  if (!blogId) return [];

  const { data, error } = await supabase
    .from('blog_comments')
    .select(COMMENT_SELECT)
    .eq('blog_id', blogId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return groupComments(data ?? []);
}

export async function fetchLikedCommentIds(commentIds, { user: providedUser } = {}) {
  if (!commentIds?.length) return new Set();

  const user = providedUser ?? (await getSafeUser());
  if (!user) return new Set();

  const { data, error } = await supabase
    .from('blog_comment_likes')
    .select('comment_id')
    .eq('user_id', user.id)
    .in('comment_id', commentIds);

  if (error) throw error;
  return new Set((data ?? []).map((row) => row.comment_id));
}

export async function postComment(blogId, body) {
  const user = await getSafeUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');

  const trimmed = body.trim();
  if (!trimmed) throw new Error('Comment cannot be empty');

  const { data, error } = await supabase
    .from('blog_comments')
    .insert({
      blog_id: blogId,
      user_id: user.id,
      body: trimmed,
    })
    .select(COMMENT_SELECT)
    .single();

  if (error) throw error;
  return parseCommentRow(data);
}

export async function postReply(blogId, parentId, body) {
  const user = await getSafeUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');

  const trimmed = body.trim();
  if (!trimmed) throw new Error('Reply cannot be empty');

  const { data, error } = await supabase
    .from('blog_comments')
    .insert({
      blog_id: blogId,
      parent_id: parentId,
      user_id: user.id,
      body: trimmed,
    })
    .select(COMMENT_SELECT)
    .single();

  if (error) throw error;
  return parseCommentRow(data);
}

export async function likeComment(commentId) {
  const user = await getSafeUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');

  const { error } = await supabase.from('blog_comment_likes').insert({
    comment_id: commentId,
    user_id: user.id,
  });

  if (error && error.code !== '23505') throw error;
}

export async function unlikeComment(commentId) {
  const user = await getSafeUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');

  const { error } = await supabase
    .from('blog_comment_likes')
    .delete()
    .eq('comment_id', commentId)
    .eq('user_id', user.id);

  if (error) throw error;
}

export function applyLikedState(comments, likedIds) {
  return comments.map((comment) => ({
    ...comment,
    isLiked: likedIds.has(comment.id),
    replies: comment.replies.map((reply) => ({
      ...reply,
      isLiked: likedIds.has(reply.id),
    })),
  }));
}

export function collectCommentIds(comments) {
  const ids = [];
  for (const comment of comments) {
    ids.push(comment.id);
    for (const reply of comment.replies) {
      ids.push(reply.id);
    }
  }
  return ids;
}
