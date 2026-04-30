import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';

const EvaluationQuestionCard = ({
  question,
  index,
  isExpanded,
  onToggle,
}) => {
  const { status, timespent, question: qData, userAnswer } = question;

  const getStatusStyles = () => {
    switch (status) {
      case 'correct':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'incorrect':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500';
    }
  };

  const getScoreDisplay = () => {
    if (status === 'correct') return `+${qData.score}`;
    if (status === 'incorrect' && qData.questionType?.toUpperCase() === 'MCQ')
      return `-${qData.score / 4}`;
    return '0';
  };

  const getScoreColor = () => {
    if (status === 'correct') return 'text-green-600 dark:text-green-400';
    if (status === 'incorrect') return 'text-red-600 dark:text-red-400';
    return 'text-slate-400 dark:text-slate-500';
  };

  return (
    <div className="group border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden hover:border-blue-200 dark:hover:border-blue-900 transition-all bg-slate-50/30 dark:bg-slate-800/30 transition-colors duration-300">
      <div
        className="p-5 flex flex-col lg:flex-row items-center justify-between cursor-pointer group-hover:bg-white dark:group-hover:bg-slate-800 transition-all gap-6"
        onClick={onToggle}
      >
        <div className="flex items-center gap-6 flex-1 w-full">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 ${getStatusStyles()}`}
          >
            {status === 'correct' ? (
              <CheckCircle className="w-7 h-7" />
            ) : status === 'incorrect' ? (
              <XCircle className="w-7 h-7" />
            ) : (
              <AlertCircle className="w-7 h-7" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-black text-slate-900 dark:text-white">Q. {index + 1}</span>
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                {qData.chapter || qData.topic}
              </span>
            </div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
              {qData.questionText}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 dark:border-slate-800">
          <div className="text-center px-4">
            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
              LATENCY
            </div>
            <div className="font-extrabold text-slate-900 dark:text-white">{timespent}s</div>
          </div>
          <div className="text-center px-4">
            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
              SCORE
            </div>
            <div className={`font-extrabold ${getScoreColor()}`}>{getScoreDisplay()}</div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-300 dark:text-slate-700" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="bg-white dark:bg-slate-900 px-8 pb-8 pt-6 border-t border-slate-50 dark:border-slate-800 space-y-8"
          >
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl">
              <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                Core Statement
              </h4>
              <p className="text-slate-700 dark:text-slate-300 font-bold leading-relaxed">{qData.questionText}</p>
            </div>

            <div className="grid gap-3">
              <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                Response Details
              </h4>
              {qData.questionType?.toUpperCase() === 'NAT' ? (
                <div className="space-y-4">
                  <div
                    className={`p-5 rounded-2xl border-2 ${
                      status === 'correct'
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900'
                        : status === 'incorrect'
                        ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Your Entry
                      </span>
                      <span
                        className={`font-black ${
                          status === 'correct'
                            ? 'text-green-600'
                            : status === 'incorrect'
                            ? 'text-red-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {userAnswer || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200/50 dark:border-slate-800">
                      <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Correct Solution
                      </span>
                      <span className="font-black text-green-600">{qData.answer[0]}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {qData.options.map((option, idx) => {
                    const correctIndices = qData.answer.map((a) => a.charCodeAt(0) - 65);
                    const userIndices =
                      userAnswer
                        ?.split(',')
                        .filter((x) => x !== '')
                        .map(Number) || [];

                    const isCorrect = correctIndices.includes(idx);
                    const isUserChoice = userIndices.includes(idx);

                    let borderColor = 'border-slate-100 dark:border-slate-800';
                    let bgColor = 'bg-white dark:bg-slate-900';
                    let textColor = 'text-slate-600 dark:text-slate-400';

                    if (isCorrect) {
                      borderColor = 'border-green-200 dark:border-green-900';
                      bgColor = 'bg-green-50 dark:bg-green-950/20';
                      textColor = 'text-green-900 dark:text-green-100';
                    } else if (isUserChoice) {
                      borderColor = 'border-red-200 dark:border-red-900';
                      bgColor = 'bg-red-50 dark:bg-red-950/20';
                      textColor = 'text-red-900 dark:text-red-100';
                    }

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${borderColor} ${bgColor} ${textColor}`}
                      >
                        <span className="font-bold flex items-center gap-3 text-slate-800 dark:text-slate-200">
                          <span className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center font-black text-xs">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {option}
                        </span>
                        {isCorrect && (
                          <div className="px-3 py-1 bg-green-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <CheckCircle className="w-3 h-3" /> VERIFIED KEY
                          </div>
                        )}
                        {isUserChoice && !isCorrect && (
                          <div className="px-3 py-1 bg-red-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <XCircle className="w-3 h-3" /> YOUR MARK
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none flex items-center gap-2">
                <Zap className="w-4 h-4" /> Comprehensive Explanation
              </button>
              <button className="px-6 py-3 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Dispute Metadata
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EvaluationQuestionCard;
