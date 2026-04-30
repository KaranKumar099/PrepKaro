import React from 'react';
import { motion } from 'framer-motion';
import { Target, ChevronRight } from 'lucide-react';

const ExamSelection = ({
  selectedExam,
  onExamSelect,
  allExams,
  featuredExams,
}) => {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Select Targeted Exam</h2>
      </div>

      <div className="relative group mb-10">
        <select
          value={selectedExam}
          onChange={(e) => onExamSelect(e.target.value)}
          className="w-full pl-6 pr-12 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700 dark:text-slate-200 appearance-none cursor-pointer"
        >
          <option value="" className="dark:bg-slate-900">Search or select from list...</option>
          {allExams.map((exam) => (
            <option key={exam.id} value={exam.id} className="dark:bg-slate-900">
              {exam.name}
            </option>
          ))}
        </select>
        <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none rotate-90" />
      </div>

      <div className="space-y-4">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[2px]">
          Featured Categories
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {featuredExams.map((exam) => (
            <motion.button
              key={exam.id}
              whileHover={{ y: -4 }}
              onClick={() => onExamSelect(exam.id)}
              className={`p-4 rounded-xl flex flex-col items-center gap-2 border-2 transition-all ${
                selectedExam === exam.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                  : 'bg-white dark:bg-slate-800/50 border-slate-50 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="text-2xl">{exam.icon}</span>
              <span className="text-xs font-bold whitespace-nowrap">{exam.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExamSelection;
