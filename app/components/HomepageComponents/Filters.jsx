"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

export default function ArticleFilters({ filters, activeFilter, onChange }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Find active filter label for the mobile display
  const activeLabel = filters.find(f => f.value === activeFilter)?.label || "All";

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-black tracking-tight mb-6">
        Latest Articles
      </h2>

      {/* Desktop: Show all chips in a wrapping row */}
      <div className="hidden md:flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === filter.value
                ? "bg-black text-white shadow-md"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Mobile: Show active filter + "Filter" button */}
      <div className="flex md:hidden items-center gap-3">
        <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            className="px-5 py-2.5 rounded-full text-sm font-medium bg-black text-white whitespace-nowrap shrink-0"
          >
            {activeLabel}
          </button>
        </div>

        <button
          onClick={() => setIsSheetOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 whitespace-nowrap shrink-0 active:scale-95 transition-transform cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Bottom Sheet */}
      <div 
        className={`fixed inset-0 z-[10000] md:hidden transition-all duration-300 ${isSheetOpen ? 'visible' : 'invisible pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isSheetOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsSheetOpen(false)}
        />

        {/* Sheet */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[28px] shadow-2xl transition-transform duration-400 ease-out transform ${isSheetOpen ? 'translate-y-0' : 'translate-y-full'}`}
          style={{ backgroundColor: 'white' }}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4">
            <h3 className="text-lg font-bold text-black">Choose a Category</h3>
            <button 
              onClick={() => setIsSheetOpen(false)}
              className="p-1.5 bg-gray-100 rounded-full text-gray-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Grid */}
          <div className="px-6 pb-10 max-h-[50vh] overflow-y-auto">
            <div className="flex flex-wrap gap-2.5">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    onChange(filter.value);
                    setIsSheetOpen(false);
                  }}
                  className={`px-5 py-3 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    activeFilter === filter.value
                      ? "bg-black text-white shadow-md"
                      : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
