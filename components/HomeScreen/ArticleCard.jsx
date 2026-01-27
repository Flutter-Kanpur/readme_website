export default function ArticleCard({ article }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 flex justify-between items-center gap-6">
      
      <div className="flex-1">
      
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>

        <div className="h-6 w-3/4 bg-gray-200 rounded mb-3" />

        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 rounded" />
          <div className="h-3 w-5/6 bg-gray-200 rounded" />
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="w-[160px] h-[120px] bg-gray-200 rounded-xl" />  
    </div>
  );
}
