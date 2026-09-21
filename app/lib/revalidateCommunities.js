import { withBasePath } from '@/app/lib/basePath';

/** Fire-and-forget communities list cache invalidation after create. */
export async function revalidateCommunities() {
  try {
    await fetch(withBasePath('/api/revalidate/communities'), {
      method: 'POST',
      cache: 'no-store',
    });
  } catch (error) {
    console.warn('revalidateCommunities failed:', error);
  }
}
