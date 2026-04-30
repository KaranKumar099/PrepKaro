import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Clock, Download, Share2 } from 'lucide-react';
import { formatShortDate } from '../../utils/dateUtils';

const DownloadCard = ({ exam, onDownload, index }) => {
  const examData = exam.exam ? exam.exam : exam;
  const isAttempted = !!exam.answers;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-1 shadow-sm hover:shadow-xl dark:hover:shadow-none hover:border-blue-100 dark:hover:border-blue-900 transition-all cursor-default overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-all duration-500">
            <FileText className={`w-7 h-7 ${isAttempted ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-600'}`} />
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                examData.difficulty === 'easy'
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                  : examData.difficulty === 'medium'
                  ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
                  : 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400'
              }`}
            >
              {examData.difficulty}
            </span>
            {isAttempted && (
              <span className="mt-2 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-tighter italic">
                Last Attempted {formatShortDate(exam.createdAt)}
              </span>
            )}
            <p className="text-xs text-right font-bold text-slate-400 dark:text-slate-500 opacity-80">
              REF: {examData._id.toUpperCase()}
            </p>
          </div>
        </div>

        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-0 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {examData.title}
        </h3>

        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 dark:text-slate-500 mb-6">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {formatShortDate(exam.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {examData.duration} min
          </span>
        </div>

        <div className="space-y-3 pt-6 border-t border-slate-50 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 italic">Paper Format</span>
            <span className="text-xs font-black text-slate-700 dark:text-slate-300">Premium PDF (HD)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 italic">Total Marks</span>
            <span className="text-xs font-black text-slate-700 dark:text-slate-300">{examData.totalMarks} Marks</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 flex gap-2">
        <button
          onClick={() => onDownload(exam)}
          className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 hover:shadow-lg shadow-blue-100 dark:shadow-none transition-all group/btn"
        >
          <Download className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />{' '}
          Download PDF
        </button>
        <button className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 rounded-xl hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900 transition-all">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default DownloadCard;
