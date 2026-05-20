import StaticPage from "@/components/StaticPage/StaticPage";

export default function WritersPage() {
  return (
    <StaticPage title="For Writers">
      <p className="text-xl text-gray-500 mb-12">Readme is a reader-first community focused on learning, building, and growing together through articles.</p>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-black mb-4">Reach Your Audience</h2>
          <p>Join a community of thousands of developers, designers, and creators looking for quality content.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-black mb-4">Powerful Tools</h2>
          <p>Our minimalist editor allows you to focus on what matters: your ideas.</p>
        </div>
      </section>
    </StaticPage>
  );
}
