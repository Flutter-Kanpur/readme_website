import HomeLayout from "./pages/home/HomeLayout";
import { getLatestArticle } from "./lib/supabase/queries";

export default async function HomePage() {
  const initialBlogs = await getLatestArticle("for_you");

  return <HomeLayout initialBlogs={initialBlogs} />;
}
