import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Calendar, Clock, Layout, Eye, BarChart3, Download, Plus } from 'lucide-react';
import { formatShortDate } from '../../utils/dateUtils';
import { generateExamPDF } from '../../utils/pdfGenerator';

const HistoryListItem = ({ exam, index }) => {
  const navigate = useNavigate();
  const isCompleted = !!exam.answers;
  const title = isCompleted ? exam.exam.title : exam.title;
  const difficulty = isCompleted ? exam.exam.difficulty : exam.difficulty;
  const duration = isCompleted ? exam.exam.duration : 'N/A';

  const onHandleGeneratePDF = (e) => {
    e.stopPropagation();
    generateExamPDF({
      title: exam.exam.title,
      questions: exam.exam.questions,
      difficulty: exam.exam.difficulty,
      totalMarks: exam.exam.totalMarks,
      duration: exam.exam.duration,
      examId: exam.exam._id,
    });
  };

  const scorePercentage = isCompleted
    ? Math.round((Math.max(exam.score, 0) / (exam.exam.totalMarks || 1)) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => isCompleted && navigate(`/attempt/${exam._id}`)}
      className={`p-6 sm:p-8 hover:bg-slate-50 transition-all flex flex-col md:flex-row items-center gap-8 group ${
        isCompleted ? 'cursor-pointer' : ''
      }`}
    >
      <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
        <Layout className={`w-8 h-8 ${isCompleted ? 'text-blue-600' : 'text-slate-400'}`} />
      </div>

      <div className="flex-1 min-w-0 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-1 truncate">{title}</h3>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {formatShortDate(exam.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {duration} min
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                difficulty === 'easy'
                  ? 'bg-green-50 text-green-600'
                  : difficulty === 'medium'
                  ? 'bg-yellow-50 text-yellow-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {difficulty}
            </span>
            {isCompleted && (
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900 leading-none">
                  {scorePercentage}%
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">
                  {exam.score} / {exam.exam.totalMarks} Marks
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          {isCompleted ? (
            <>
              <button
                onClick={() => navigate(`/attempt/${exam._id}`)}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-black shadow-lg shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
              >
                <Eye className="w-4 h-4" /> Preview
              </button>
              <button className="p-2.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm">
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={onHandleGeneratePDF}
                className="p-2.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button className="flex-1 sm:flex-none px-6 py-2.5 bg-amber-500 text-white rounded-lg text-xs font-black shadow-lg shadow-amber-100 flex items-center justify-center gap-2 hover:bg-amber-600 transition-all">
              <Plus className="w-4 h-4" /> Resume Test
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryListItem;
