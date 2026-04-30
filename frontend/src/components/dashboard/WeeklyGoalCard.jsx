import React from 'react';
import { ArrowRight } from 'lucide-react';

const WeeklyGoalCard = ({ onAction }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-200/50 dark:shadow-none">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-2">Weekly Goal 🎯</h3>
        <p className="text-blue-100 text-sm mb-6 leading-relaxed">
          You're 2 tests away from hitting your weekly productivity target!
        </p>
        <button
          onClick={onAction}
          className="w-full py-4 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-lg"
        >
          Start Challenge
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default WeeklyGoalCard;
