import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, subText, icon: Icon, bgColor, textColor }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColor} dark:bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">{value}</div>
      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{subText}</div>
    </motion.div>
  );
};

export default StatCard;
