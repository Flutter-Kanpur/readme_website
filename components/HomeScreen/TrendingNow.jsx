export default function TrendingNow({ trends = [] }) {
  return (
      <div className="space-y-5">
        <h3 className="text-xs font-semibold tracking-widest text-black mb-6 uppercase">
              Trending Now
            </h3>
        {trends.length === 0 ? (
          <>
            <TrendingSkeleton />
            <TrendingSkeleton />
            <TrendingSkeleton />
          </>
        ) : (
          trends.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <span className="text-gray-300 font-bold text-lg">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <h4 className="text-sm font-semibold leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  {item.category} · {item.reads} reads
                </p>
              </div>
            </div>
          ))
        )}
      </div>
  );
}

function TrendingSkeleton() {
  return (
    <div className="flex items-start gap-4 animate-pulse">
      <div className="w-6 h-5 bg-gray-200 rounded" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}
