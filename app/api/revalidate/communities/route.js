import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

/** Called after creating a community so the list page refreshes. */
export async function POST() {
  try {
    revalidatePath('/communities');
    revalidatePath('/sitemap.xml');
    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.error('revalidate communities error:', error);
    return NextResponse.json(
      { revalidated: false, error: error?.message ?? 'Failed' },
      { status: 500 },
    );
  }
}
