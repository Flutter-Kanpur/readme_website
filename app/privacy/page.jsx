import StaticPage from "@/components/StaticPage/StaticPage";

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy">
      <p>Last updated: May 20, 2026</p>
      <section className="mt-8 space-y-6">
        <h2 className="text-2xl font-bold text-black">1. Information We Collect</h2>
        <p>We collect information you provide directly to us when you create an account, publish content, or communicate with us.</p>
        
        <h2 className="text-2xl font-bold text-black">2. How We Use Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you.</p>
        
        <h2 className="text-2xl font-bold text-black">3. Sharing of Information</h2>
        <p>We do not share your private personal information with third parties except as required by law or to provide our services.</p>
      </section>
    </StaticPage>
  );
}
