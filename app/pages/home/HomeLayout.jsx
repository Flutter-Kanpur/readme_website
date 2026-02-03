import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/homepageComponents/Hero";
import SearchBar from "../../components/HomepageComponents/SearchBar";
import Footer from "../../components/Footer/Footer";
import ArticlesSection from "../../components/homepageComponents/ArticleSection";
export default function HomeLayout() {
  return (
    <main className="grid-background min-h-screen">
      <Navbar />
      <Hero />
      <SearchBar />
      <ArticlesSection />
      <Footer/>
    </main>
  );
}
