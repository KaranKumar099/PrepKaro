import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Download } from 'lucide-react';

const PaperReadyCard = ({
  generatedPaper,
  difficulty,
  duration,
  onStartAttempt,
  onDownloadPDF,
}) => {
  const summaryItems = [
    { label: 'EXAM', value: generatedPaper.examName },
    { label: 'DIFFICULTY', value: difficulty.toUpperCase() },
    { label: 'DURATION', value: `${duration} MIN` },
    { label: 'TIMESTAMP', value: generatedPaper.dateGenerated },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="sticky top-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-2xl shadow-blue-200"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold">Paper Ready! ✅</h3>
      </div>

      <div className="space-y-4 mb-10">
        {summaryItems.map((i, idx) => (
          <div key={idx} className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-black text-white/50 tracking-[1px] uppercase">
              {i.label}
            </span>
            <span className="font-black text-sm">{i.value}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <button
          onClick={onStartAttempt}
          className="w-full py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <Clock className="w-5 h-5" /> Start Live Attempt
        </button>
        <button
          onClick={onDownloadPDF}
          className="w-full py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" /> Export as PDF
        </button>
      </div>
    </motion.div>
  );
};

export default PaperReadyCard;
