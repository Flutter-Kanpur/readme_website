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
    <div className="w-full max-w-3xl mx-auto mt-12">
      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-5 py-3 shadow-sm">
        <Search size={18} className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Search for articles, topics, or writers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="ml-3 px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition"
        >
          Search
        </button>
      </div>
    </div>
  );
}
