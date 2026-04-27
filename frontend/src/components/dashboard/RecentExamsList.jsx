import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Calendar, Clock, Eye, BarChart3, Download, ChevronRight, FileText } from 'lucide-react';
import { formatShortDate } from '../../utils/dateUtils';

const RecentExamsList = ({ 
  exams, 
  loading, 
  onNavigateHistory, 
  onNavigateAttempt, 
  onDownloadPDF,
  onNavigateTool
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Gathering your achievements...</p>
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-50">
          <FileText className="w-10 h-10 text-slate-200" />
        </div>
        <h4 className="text-lg font-black text-slate-900 mb-2">Adventure Awaits!</h4>
        <p className="text-slate-500 font-medium px-8">
          You haven't taken any exams yet. Ready to test your knowledge?
        </p>
        <button
          onClick={onNavigateTool}
          className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          Take First Test
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
          <h2 className="text-xl font-bold">Recent Mock Exams</h2>
        </div>
        <button
          onClick={onNavigateHistory}
          className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
        >
          View History{' '}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-4">
        {exams.map((exam, idx) => (
          <motion.div
            key={exam._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onNavigateAttempt(exam._id)}
            className="group relative flex items-center gap-4 p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/80 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-300">
              <Layout className={`w-6 h-6 ${exam.answers ? 'text-blue-600' : 'text-amber-500'}`} />
            </div>

            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 mb-0.5 truncate group-hover:text-blue-600 transition-colors">
                  {exam.answers ? exam.exam.title : exam.title}
                </h3>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatShortDate(exam.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {exam.answers ? exam.exam.duration : exam.duration || 'N/A'} min
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <span
                    className={`hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                      (exam.answers ? exam.exam.difficulty : exam.difficulty) === 'easy'
                        ? 'bg-green-50 text-green-600 border-green-100'
                        : (exam.answers ? exam.exam.difficulty : exam.difficulty) === 'medium'
                        ? 'bg-yellow-50 text-yellow-600 border-yellow-100'
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}
                  >
                    {exam.answers ? exam.exam.difficulty : exam.difficulty}
                  </span>

                  {exam.answers && (
                    <div className="text-right">
                      <div className="text-xl font-black text-slate-900 leading-none">
                        {Math.round(((exam.score || 0) / (exam.exam.totalMarks || 1)) * 100)}%
                      </div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                        {exam.score}/{exam.exam.totalMarks}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  {exam.answers ? (
                    <>
                      <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-2 bg-white text-slate-500 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100 shadow-sm">
                        <BarChart3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => onDownloadPDF(e, exam)}
                        className="p-2 bg-white text-slate-500 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all border border-slate-100 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button className="px-3 py-2 bg-amber-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-md shadow-amber-100 hover:bg-amber-600 transition-all">
                      Resume
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentExamsList;
