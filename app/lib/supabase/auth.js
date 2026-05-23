import { supabase } from './index';

export function isInvalidRefreshTokenError(error) {
  if (!error?.message) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes('invalid refresh token') ||
    message.includes('refresh token not found') ||
    message.includes('already used')
  );
}

/** Clear broken local auth state without requiring a valid refresh token. */
export async function clearStaleAuthSession() {
  if (typeof window === 'undefined') return;
  try {
    await supabase.auth.signOut({ scope: 'local' });
  } catch {
    // Session may already be gone locally.
  }
}

let pendingGetUser = null;

/**
 * getUser() wrapper that clears stale tokens and dedupes concurrent calls
 * (avoids "Refresh Token Already Used" from parallel refresh attempts).
 */
export async function getSafeUser() {
  if (pendingGetUser) return pendingGetUser;

  pendingGetUser = (async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      if (isInvalidRefreshTokenError(error)) {
        await clearStaleAuthSession();
        return null;
      }
      throw error;
    }

    return data.user ?? null;
  })();

  try {
    return await pendingGetUser;
  } finally {
    pendingGetUser = null;
  }
}

let pendingGetSession = null;

export async function getSafeSession() {
  if (pendingGetSession) return pendingGetSession;

  pendingGetSession = (async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      if (isInvalidRefreshTokenError(error)) {
        await clearStaleAuthSession();
        return null;
      }
      throw error;
    }

    return data.session ?? null;
  })();

  try {
    return await pendingGetSession;
  } finally {
    pendingGetSession = null;
  }
}

let authRecoveryInitialized = false;

/** On startup, clear corrupt local tokens so refresh errors stop spamming the console. */
export function initAuthRecovery() {
  if (typeof window === 'undefined' || authRecoveryInitialized) return;
  authRecoveryInitialized = true;

  void getSafeSession().catch(async (error) => {
    if (isInvalidRefreshTokenError(error)) {
      await clearStaleAuthSession();
    }
  });
}
