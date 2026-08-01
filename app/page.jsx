import HomeLayout from "./pages/home/HomeLayout";
import { getFeed } from "./lib/data/feed";

export const revalidate = 30;

export default async function HomePage() {
  const initialBlogs = await getFeed("for_you");

  return <HomeLayout initialBlogs={initialBlogs ?? []} />;
}
