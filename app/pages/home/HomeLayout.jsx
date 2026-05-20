import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/HomepageComponents/Hero";
import SearchBar from "../../components/HomepageComponents/SearchBar";
import Footer from "@/components/Footer/Footer";
import ArticlesSection from "../../components/HomepageComponents/ArticleSection";
export default function HomeLayout({ initialBlogs }) {
  return (
    <main className="grid-background min-h-screen">
      <Navbar />
      <Hero />
      <SearchBar />
      <section id="latest-articles">
        <ArticlesSection initialBlogs={initialBlogs} />
      </section>
      <Footer/>
    </main>
  );
}
