import { NextResponse } from 'next/server';
import { withBasePath } from '@/app/lib/basePath';
import { createSupabaseServerClient } from '@/app/lib/supabase/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const authError =
    searchParams.get('error_description') || searchParams.get('error');

  const loginPath = withBasePath('/login');
  const homePath = withBasePath('/');

  if (authError) {
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set('error', authError);
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set(
      'error',
      'Could not establish a session. Please try again.',
    );
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set('error', error.message);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(homePath, request.url));
}
