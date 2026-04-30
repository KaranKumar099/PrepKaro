import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ExamsSection = ({ exams }) => {
  return (
    <section id="exams" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">
              Exam Coverage
            </h2>
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white">Supported Competitions</h3>
          </div>
          <p className="max-w-md text-slate-600 dark:text-slate-400">
            We cover the most rigorous competitive exams with fresh questions added daily by our AI
            engine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {exams.map((exam, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg dark:hover:shadow-none transition-all text-center group cursor-pointer"
            >
              <div className="text-4xl mb-6 bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform">
                {exam.logo}
              </div>
              <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{exam.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-4">
                {exam.desc}
              </p>
              <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                View Papers <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExamsSection;
