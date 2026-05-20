import StaticPage from "@/components/StaticPage/StaticPage";

export default function StatusPage() {
  return (
    <StaticPage title="System Status">
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-12 flex items-center gap-4">
        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
        <p className="text-green-800 font-medium m-0">All Systems Operational</p>
      </div>

      <section className="space-y-6">
        <div className="flex justify-between items-center py-4 border-b border-gray-100">
          <span className="text-black">API & Content Delivery</span>
          <span className="text-green-600 font-medium">Operational</span>
        </div>
        <div className="flex justify-between items-center py-4 border-b border-gray-100">
          <span className="text-black">User Authentication</span>
          <span className="text-green-600 font-medium">Operational</span>
        </div>
        <div className="flex justify-between items-center py-4 border-b border-gray-100">
          <span className="text-black">Image Upload Service</span>
          <span className="text-green-600 font-medium">Operational</span>
        </div>
      </section>
    </StaticPage>
  );
}
