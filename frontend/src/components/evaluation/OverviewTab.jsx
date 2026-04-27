import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, Share2 } from 'lucide-react';

const OverviewTab = ({ examData }) => {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="p-8 space-y-10"
    >
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" /> Administrative Metadata
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: 'Subject ID', val: examData.examName },
            { label: 'Attempt Timestamp', val: examData.date },
            { label: 'Complexity Level', val: examData.difficulty.toUpperCase() },
            { label: 'Allocated Time', val: `${examData.duration} Minutes` },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100/50"
            >
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {item.label}
              </span>
              <span className="font-black text-slate-900">{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-50">
        <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200">
          <Download className="w-5 h-5" /> Download Full Transcript
        </button>
        <button className="flex-1 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm">
          <Share2 className="w-5 h-5" /> Distribute Results
        </button>
      </div>
    </motion.div>
  );
};

export default OverviewTab;
