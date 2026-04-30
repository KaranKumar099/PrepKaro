import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Trophy } from 'lucide-react';

const TopicAnalysis = ({ topicStats, isLoading }) => {
  const avgAccuracy = Math.round(
    topicStats.reduce((acc, curr) => acc + curr.score, 0) / (topicStats.length || 1)
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
      <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-900 dark:text-white">
        <TrendingUp className="w-5 h-5 text-indigo-500" /> Topic Analysis
      </h3>

      <div className="relative h-48 w-48 mx-auto mb-10 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-50 dark:text-slate-800"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="251.2"
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: 251.2 - (251.2 * avgAccuracy) / 100 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
            className="text-blue-600"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-slate-900 dark:text-white">{avgAccuracy}%</span>
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Avg Accuracy
          </span>
        </div>

        <div className="absolute -top-2 -right-2 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center border border-slate-50 dark:border-slate-700 animate-bounce-slow">
          <Trophy className="w-5 h-5 text-amber-500" />
        </div>
      </div>

      <div className="space-y-6">
        {topicStats.map((subject, index) => (
          <div key={index} className="group cursor-default">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full bg-${subject.color}-500 shadow-sm shadow-${subject.color}-200`}
                ></div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors uppercase tracking-tight">
                  {subject.subject}
                </span>
              </div>
              <span className={`text-sm font-black text-${subject.color}-600`}>
                {subject.score}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100/50 dark:border-slate-700/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${subject.score}%` }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: index * 0.1 }}
                className={`h-full bg-${subject.color}-500 rounded-full transition-all group-hover:brightness-110 shadow-[0_0_8px_rgba(var(--${subject.color}-rgb),0.3)]`}
              ></motion.div>
            </div>
          </div>
        ))}
        {topicStats.length === 0 && !isLoading && (
          <div className="text-center py-10">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">
              Initialize your journey to
              <br />
              unlock deep analytics
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicAnalysis;
