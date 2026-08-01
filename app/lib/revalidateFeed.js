import { withBasePath } from '@/app/lib/basePath';

/** Fire-and-forget feed cache invalidation after publish. */
export async function revalidateFeed() {
  try {
    await fetch(withBasePath('/api/revalidate/feed'), {
      method: 'POST',
      cache: 'no-store',
    });
  } catch (error) {
    console.warn('revalidateFeed failed:', error);
  }
}
