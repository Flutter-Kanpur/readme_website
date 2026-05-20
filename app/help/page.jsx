import StaticPage from "@/components/StaticPage/StaticPage";

export default function HelpPage() {
  return (
    <StaticPage title="Help Center">
      <p>Welcome to the Readme Help Center. How can we assist you today?</p>
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-black mb-2">Getting Started</h2>
          <p>Learn how to create your account, set up your profile, and start writing your first article.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-black mb-2">Writing Articles</h2>
          <p>Our editor supports rich text, images, and more. Find tips on how to make your articles stand out.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-black mb-2">Community Guidelines</h2>
          <p>Read about our standards for a healthy and productive community.</p>
        </div>
      </section>
    </StaticPage>
  );
}
