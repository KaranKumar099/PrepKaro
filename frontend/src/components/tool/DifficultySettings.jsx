import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const DifficultySettings = ({ difficulty, setDifficulty }) => {
  const levels = [
    {
      id: 'easy',
      desc: 'Foundational concepts focusing on standard patterns',
    },
    {
      id: 'medium',
      desc: 'Balanced mix of logic and calculation intensive problems',
    },
    {
      id: 'hard',
      desc: 'Challenging advanced problems for top-tier preparation',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
          <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Adjust Difficulty</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {levels.map((level) => (
          <motion.button
            key={level.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setDifficulty(level.id)}
            className={`p-5 rounded-xl text-left border-2 transition-all flex flex-col justify-between h-40 ${
              difficulty === level.id
                ? `bg-blue-50/50 dark:bg-blue-900/20 border-blue-600 dark:border-blue-500 border-2`
                : 'bg-slate-50/50 dark:bg-slate-800/50 border-transparent dark:hover:border-slate-700 hover:border-slate-200'
            }`}
          >
            <div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  difficulty === level.id ? 'bg-blue-600 dark:bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {level.id}
              </span>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-4 leading-relaxed line-clamp-2">
                {level.desc}
              </p>
            </div>
            <div
              className={`w-8 h-1 rounded-full ${
                difficulty === level.id ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            ></div>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
};

export default DifficultySettings;
