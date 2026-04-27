import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const QuestionDisplay = ({
  current,
  currentQ,
  answers,
  onOptionClick,
  onNATChange,
  onNATBlur,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-12 relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="max-w-4xl mx-auto space-y-12 pb-32"
        >
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-2">
                <span className="w-10 h-10 bg-slate-900 border-4 border-slate-200 text-white rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">
                  {current + 1}
                </span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[8px] font-black uppercase tracking-wider border border-blue-100">
                  {currentQ?.questionType}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 leading-relaxed pt-1">
                {currentQ?.questionText}
              </h1>
            </div>

            {currentQ?.picture && (
              <div className="p-4 bg-white border border-slate-100 rounded-[32px] inline-block shadow-sm">
                <img
                  src={currentQ?.picture}
                  className="max-h-[400px] w-auto rounded-2xl object-contain"
                />
              </div>
            )}
          </div>

          <div className="grid gap-4">
            {currentQ?.questionType?.toUpperCase() === 'NAT' ? (
              <div
                key={`nat-container-${currentQ?._id}`}
                className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4"
              >
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Input Your Numerical Response
                </label>
                <input
                  type="number"
                  id={`nat-input-${currentQ?._id}`}
                  name={`nat-${currentQ?._id}`}
                  placeholder="Enter value..."
                  value={answers[currentQ?._id] !== undefined ? answers[currentQ?._id] : ''}
                  onChange={(e) => onNATChange(currentQ?._id, e.target.value)}
                  onBlur={() => onNATBlur(currentQ?._id)}
                  className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 text-xl font-bold text-blue-600 focus:border-blue-200 focus:outline-none transition-all"
                />
              </div>
            ) : (
              currentQ?.options?.map((opt, idx) => {
                const isSelected = Array.isArray(answers[currentQ?._id])
                  ? answers[currentQ?._id].includes(idx)
                  : answers[currentQ?._id] !== undefined && parseInt(answers[currentQ?._id]) === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => onOptionClick(currentQ?._id, idx)}
                    className={`group flex items-center gap-4 p-5 rounded-[24px] border-2 transition-all text-left ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200'
                        : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50/50'
                    }`}
                  >
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${
                        isSelected
                          ? 'bg-white text-blue-600'
                          : 'bg-slate-50 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-lg font-bold">{opt}</span>
                    {isSelected && <CheckCircle2 className="w-6 h-6 text-white ml-auto" />}
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuestionDisplay;
