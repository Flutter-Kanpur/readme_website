export default function ArticleFilters({ filters, activeFilter, onChange }) {
  return (
    
    <div className="flex gap-3 flex-wrap mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-black">
            Latest Articles
          </h2>
      {filters.map((item, index) => (
        <button
          key={index}
          onClick={() => onChange(item)}
          className={`px-5 py-2 rounded-full text-sm transition-all ${
            activeFilter === item
              ? "bg-black text-white"
              : "border border-gray-300 text-black hover:bg-gray-100"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
