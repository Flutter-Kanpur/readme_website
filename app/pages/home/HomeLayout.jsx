import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/HomepageComponents/Hero";
import SearchBar from "../../components/HomepageComponents/SearchBar";
import Footer from "@/components/Footer/Footer";
import HomeArticleSection from "../../components/HomepageComponents/HomeArticleSection";

export default function HomeLayout({ initialBlogs }) {
  return (
    <main className="grid-background min-h-screen">
      <Navbar />
      <Hero />
      <SearchBar />
      <section id="latest-articles" className="py-16 px-4 sm:px-6">
        <HomeArticleSection initialBlogs={initialBlogs} />
      </section>
      <Footer />
    </main>
  );
}
