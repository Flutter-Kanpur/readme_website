export default function TopWriters({ writers = [] }) {
  return (
    <aside className="bg-white border border-gray-100 rounded-2xl p-5">
     <h3 className="text-xs font-semibold tracking-widest text-black mb-6 uppercase">
              TOP WRITERS
            </h3>
      <div className="space-y-5">
        {writers.length === 0 ? (
          <>
            <WriterSkeleton />
            <WriterSkeleton />
            <WriterSkeleton />
          </>
        ) : (
          writers.map((writer, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200">
                  {writer.avatar && (
                    <img
                      src={writer.avatar}
                      alt={writer.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-black">
                    {writer.name}
                  </p>
                  <p className="text-xs text-gray-400 uppercase">
                    {writer.role}
                  </p>
                </div>
              </div>

              <button className="text-xs font-semibold text-blue-600 hover:underline">
                FOLLOW
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

function WriterSkeleton() {
  return (
    <div className="flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-200" />
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-2 w-16 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="h-3 w-12 bg-gray-200 rounded" />
    </div>
  );
}
