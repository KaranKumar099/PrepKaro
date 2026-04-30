import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Activity, Zap, Clock, ArrowUpRight } from 'lucide-react';

const HeroScoreBanner = ({ examData, percentage, accuracy }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] p-8 lg:p-12 text-white overflow-hidden shadow-2xl shadow-blue-100 dark:shadow-none transition-colors duration-300"
    >
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-[28px] flex items-center justify-center">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-4xl font-black mb-1">Benchmark Achieved!</h2>
              <p className="text-slate-400 font-medium">{examData.examName} • Detailed Report</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6">
            {[
              { label: 'NET SCORE', val: `${examData.score} / ${examData.totalMarks}`, icon: Target },
              { label: 'PERCENTAGE', val: `${percentage}%`, icon: Activity },
              { label: 'ACCURACY', val: `${accuracy}%`, icon: Zap },
              { label: 'ENGAGEMENT', val: examData.timeSpent, icon: Clock },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <stat.icon className="w-3.5 h-3.5" /> {stat.label}
                </div>
                <div className="text-2xl font-black">{stat.val}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex w-48 h-48 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full items-center justify-center relative">
          <div className="text-center">
            <div className="text-6xl font-black text-white">{percentage}%</div>
            <div className="text-[10px] font-black text-slate-400 tracking-widest">RANK SCORE</div>
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/50">
            <ArrowUpRight className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroScoreBanner;
