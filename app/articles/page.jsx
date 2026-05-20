import Navbar from "../components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ArticlesSection from "../components/HomepageComponents/ArticleSection";
import { getLatestArticle } from "../lib/supabase/queries";

export default async function ArticlesPage() {
  const initialBlogs = await getLatestArticle("for_you");

  return (
    <main className="grid-background min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-24 pb-12 px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-12">
          <div className="max-w-2xl">
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: '700', lineHeight: '1.1', color: '#000', marginBottom: '16px' }}>
              Explore Articles
            </h1>
            <p className="text-gray-500 text-lg">
              Discover stories, thinking, and expertise from writers across the community.
            </p>
          </div>
        </div>
      </div>

      <section className="pb-24">
        <ArticlesSection initialBlogs={initialBlogs} />
      </section>

      <Footer />
    </main>
  );
}
