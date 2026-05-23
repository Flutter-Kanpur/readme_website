import RelatedArticles from "@/components/RelatedArticles/RelatedArticles";
import { getRelatedArticlesByAuthorId } from "@/app/lib/supabase/queries";

export default async function RelatedArticlesSection({ authorId, blogId }) {
  if (!authorId) return null;

  const related = await getRelatedArticlesByAuthorId(authorId, blogId);
  return <RelatedArticles articles={related ?? []} />;
}
