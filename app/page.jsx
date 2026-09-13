import HomeLayout from "./pages/home/HomeLayout";
import { getHomeFeed } from "./lib/data/feed";

export const revalidate = 30;

export default async function HomePage() {
  const initialBlogs = await getHomeFeed();

  return <HomeLayout initialBlogs={initialBlogs ?? []} />;
}
