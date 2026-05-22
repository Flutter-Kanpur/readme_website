import Navbar from "../components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ArticlesSection from "../components/HomepageComponents/ArticleSection";
import { getLatestArticle } from "../lib/supabase/queries";

export default async function ArticlesPage() {
  const initialBlogs = await getLatestArticle("for_you");

  return (
    <main className="grid-background min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-10 pb-24">
        <header className="mb-8 md:mb-10">
          <p className="text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.25em] text-gray-700 uppercase mb-4 font-semibold opacity-70">
            Browse the library
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black tracking-tight leading-[1.1] mb-4">
            Explore Articles
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl leading-relaxed">
            Discover stories, thinking, and expertise from writers across the
            community.
          </p>
        </header>

        <ArticlesSection initialBlogs={initialBlogs} showTitle={false} />
      </div>

      <Footer />
    </main>
  );
}
