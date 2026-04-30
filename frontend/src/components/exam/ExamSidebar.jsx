import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Send } from 'lucide-react';

const ExamSidebar = ({ questions, current, onNavigate, getButtonColor, onSubmit }) => {
  const legendItems = [
    { label: 'Answered', bg: 'bg-emerald-500' },
    { label: 'Marked', bg: 'bg-amber-400' },
    { label: 'Answered & Marked', bg: 'bg-indigo-600' },
    { label: 'Visited but skipped', bg: 'bg-red-200 dark:bg-red-900/30' },
    { label: 'Unvisited', bg: 'bg-slate-100 dark:bg-slate-800' },
  ];

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col shadow-sm relative z-20 transition-colors duration-300"
    >
      <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
          <Layout className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Navigator</h2>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Section A: General Ability</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        <div className="grid grid-cols-4 gap-3 mb-10">
          {questions.map((q, index) => (
            <button
              key={q._id}
              onClick={() => onNavigate(index)}
              className={`h-11 rounded-xl text-xs font-black transition-all ${getButtonColor(
                q._id,
                index,
              )}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-slate-800">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            Legend
          </h3>
          {legendItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-md ${item.bg}`}></div>
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onSubmit}
          className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
        >
          <Send className="w-4 h-4" /> Final Submission
        </button>
      </div>
    </motion.aside>
  );
};

export default ExamSidebar;
