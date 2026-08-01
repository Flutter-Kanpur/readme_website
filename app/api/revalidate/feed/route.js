import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

/**
 * Client publish flows call this so ISR feed pages refresh.
 * Paths are app-router paths (basePath is applied by Next automatically).
 */
export async function POST() {
  try {
    revalidatePath('/');
    revalidatePath('/articles');
    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.error('revalidate feed error:', error);
    return NextResponse.json(
      { revalidated: false, error: error?.message ?? 'Failed' },
      { status: 500 },
    );
  }
}
