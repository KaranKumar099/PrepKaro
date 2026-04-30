import React from 'react';
import { Flag } from 'lucide-react';
import ExamTimer from '../ExamTimer';

const ExamHeader = ({ current, total, onSubmit }) => {
  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-8 flex items-center justify-between relative z-10 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-6">
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">
            Test Context
          </span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Engineering Proficiency Exam</span>
        </div>
        <div className="h-8 w-px bg-slate-100 dark:bg-slate-800"></div>
        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
          <Flag className="w-4 h-4" />
          <span className="text-xs font-bold dark:text-slate-400">
            Question {current + 1} of {total}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-6 py-2.5 rounded-2xl">
          <ExamTimer durationInMinutes={180} onTimeUp={onSubmit} />
        </div>
      </div>
    </header>
  );
};

export default ExamHeader;
