import StaticPage from "@/components/StaticPage/StaticPage";

export default function TermsPage() {
  return (
    <StaticPage title="Terms of Service">
      <p>Last updated: May 20, 2026</p>
      <section className="mt-8 space-y-6">
        <h2 className="text-2xl font-bold text-black">1. Acceptance of Terms</h2>
        <p>By accessing or using Readme, you agree to be bound by these terms.</p>
        
        <h2 className="text-2xl font-bold text-black">2. Content Ownership</h2>
        <p>You retain all ownership rights to the content you publish on Readme. However, you grant us a license to host and share your content.</p>
        
        <h2 className="text-2xl font-bold text-black">3. Prohibited Conduct</h2>
        <p>You agree not to engage in any conduct that violates these terms or our community guidelines.</p>
      </section>
    </StaticPage>
  );
}
