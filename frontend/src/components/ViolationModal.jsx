import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';

const ViolationModal = ({ isOpen, violationCount, maxViolations, onClose }) => {
  if (!isOpen) return null;

  const isLastWarning = violationCount === maxViolations;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 dark:border-slate-800"
        >
          <div className={`p-8 text-center ${isLastWarning ? 'bg-red-50 dark:bg-red-950/30' : 'bg-amber-50 dark:bg-amber-950/30'}`}>
            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-lg ${isLastWarning ? 'bg-red-600 shadow-red-200' : 'bg-amber-500 shadow-amber-200'}`}>
              {isLastWarning ? <ShieldAlert className="w-10 h-10 text-white" /> : <AlertTriangle className="w-10 h-10 text-white" />}
            </div>
            <h2 className={`text-2xl font-black mb-2 ${isLastWarning ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
              {isLastWarning ? 'Final Warning!' : 'Violation Detected'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
              Tab switching or exiting full screen is strictly prohibited during the examination.
            </p>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Warning Status</span>
              <div className="flex gap-1.5">
                {[...Array(maxViolations + 1)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-8 h-2 rounded-full transition-all duration-500 ${
                      i < violationCount ? 'bg-red-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                You have used <span className="text-red-600 dark:text-red-400 font-black">{violationCount}</span> of <span className="text-slate-900 dark:text-white font-black">{maxViolations + 1}</span> chances. 
                {isLastWarning ? ' One more violation will result in IMMEDIATE automatic submission.' : ' Please focus on your exam to avoid disqualification.'}
              </p>
              
              <button
                onClick={onClose}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl ${
                  isLastWarning 
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-100 dark:shadow-none' 
                    : 'bg-slate-900 dark:bg-blue-600 text-white hover:bg-slate-800 dark:hover:bg-blue-700 shadow-slate-200 dark:shadow-none'
                }`}
              >
                I Understand, Resume Test
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ViolationModal;
