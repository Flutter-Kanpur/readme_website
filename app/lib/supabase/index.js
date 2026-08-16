import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local in the project root. Restart the dev server after adding them.',
  );
}

/** Browser client — stores PKCE verifier in cookies (required for OAuth callback). */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

if (typeof window !== 'undefined') {
  import('./auth').then(({ initAuthRecovery }) => initAuthRecovery());
}
