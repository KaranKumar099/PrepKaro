import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const StartExamModal = ({ isOpen, onClose, onProceed }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] px-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-slate-900 rounded-[24px] p-10 w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-800"
          >
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/30 rounded-xl flex items-center justify-center mb-8">
              <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Ready to Start?</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
              You are about to start a live mock attempt. The timer will begin immediately and the
              session cannot be paused.
            </p>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Go Back
              </button>
              <button
                onClick={onProceed}
                className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 dark:shadow-none transition-all"
              >
                Proceed
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartExamModal;
