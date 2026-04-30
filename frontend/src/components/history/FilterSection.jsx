import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';

const FilterSection = ({
  showFilters,
  setShowFilters,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filters,
  onFilterChange,
}) => {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search specific exams by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm dark:text-white"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm border-2 transition-all ${
              showFilters
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <div className="relative group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-5 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400 appearance-none focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Score</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-slate-600 dark:group-hover:text-slate-300" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-50 dark:border-slate-800 overflow-hidden"
          >
            {[
              {
                label: 'Exam Category',
                val: filters.exam,
                key: 'exam',
                opts: ['all', 'JEE Main', 'JEE Advanced', 'NEET', 'SSC CGL'],
              },
              {
                label: 'Complexity',
                val: filters.difficulty,
                key: 'difficulty',
                opts: ['all', 'easy', 'medium', 'hard'],
              },
              {
                label: 'Status',
                val: filters.status,
                key: 'status',
                opts: ['all', 'completed'],
              },
            ].map((field, idx) => (
              <div key={idx} className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                  {field.label}
                </label>
                <select
                  value={field.val}
                  onChange={(e) => onFilterChange(field.key, e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400 focus:outline-none capitalize transition-all"
                >
                  {field.opts.map((opt) => (
                    <option key={opt} value={opt} className="capitalize">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FilterSection;
