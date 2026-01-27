import Navbar from "./Navbar";
import Hero from "./Hero";
import Footer from "./Footer";
import ArticlesSection from "./Articles";
export default function HomeLayout() {
  return (
    <main className="grid-background min-h-screen">
      <Navbar />
      <Hero />
      <ArticlesSection />
      <Footer/>
    </main>
  );
}
