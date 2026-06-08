"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 md:mt-12 px-6">
      <div className="flex items-center gap-2 sm:gap-3 bg-white border border-gray-200 rounded-full pl-4 pr-2 sm:pl-6 sm:pr-3 py-2 sm:py-3 shadow-sm min-w-0">
        <Search
          size={18}
          className="text-gray-400 shrink-0"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Search articles, topics, writers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="shrink-0 px-4 sm:px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </div>
  );
}
