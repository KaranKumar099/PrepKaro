import React from 'react';

const StatsSection = ({ statsCounter }) => {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="text-center md:border-r border-slate-100 dark:border-slate-800 px-4">
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
              {statsCounter.students.toLocaleString()}+
            </p>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Global Learners</p>
          </div>
          <div className="text-center md:border-r border-slate-100 dark:border-slate-800 px-4">
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
              {statsCounter.papers.toLocaleString()}+
            </p>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Papers Generated</p>
          </div>
          <div className="text-center md:border-r border-slate-100 dark:border-slate-800 px-4">
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{statsCounter.success}%</p>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Rank Improvement</p>
          </div>
          <div className="text-center px-4">
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">24/7</p>
            <p className="text-slate-500 dark:text-slate-400 font-medium">AI Support</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
