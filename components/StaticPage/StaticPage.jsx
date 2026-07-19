import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function StaticPage({ title, children }) {
  return (
    <div className="page bg-white min-h-dvh flex flex-col">
      <Navbar plain />
      <main className="max-w-4xl w-full mx-auto px-6 py-20 flex-1">
        <h1 className="text-4xl font-bold mb-8 text-black">{title}</h1>
        <div className="prose prose-lg text-gray-600 max-w-none">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
