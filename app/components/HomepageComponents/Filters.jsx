const getButtonClasses = (isActive) =>
  `px-5 py-2 rounded-full text-sm transition-all ${
    isActive
      ? "bg-black text-white"
      : "border border-gray-300 text-black hover:bg-gray-100"
  }`;
export default function ArticleFilters({ filters, activeFilter, onChange }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-black">
        Latest Articles
      </h2>

      <div className="flex gap-3 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={`px-5 py-2 rounded-full text-sm transition-all ${
              activeFilter === filter.value
                ? "bg-black text-white"
                : "border border-gray-300 text-black hover:bg-gray-100"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
