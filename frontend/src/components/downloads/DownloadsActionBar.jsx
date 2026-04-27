import React from 'react';
import { Search, Filter } from 'lucide-react';

const DownloadsActionBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
      <div className="relative flex-1 group">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search resources by exam name or description..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
        />
      </div>

      <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
        <Filter className="w-4 h-4" /> Filters
      </button>
    </div>
  );
};

export default DownloadsActionBar;
