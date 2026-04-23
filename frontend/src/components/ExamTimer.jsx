import { useEffect, useRef, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ExamTimer = ({ durationInMinutes, onTimeUp }) => {
  const totalDuration = durationInMinutes * 60 * 1000;
  const endTimeRef = useRef(Date.now() + totalDuration);

  const [timeLeft, setTimeLeft] = useState(endTimeRef.current - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = endTimeRef.current - Date.now();
      setTimeLeft(Math.max(0, remaining));

      if (remaining <= 0) {
        clearInterval(interval);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp]);

  const minutes = Math.floor(timeLeft / 1000 / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  const progress = (timeLeft / totalDuration) * 100;

  // Dynamic colors based on time remaining
  const isUrgent = timeLeft < 5 * 60 * 1000; // Less than 5 mins
  const isCritical = timeLeft < 1 * 60 * 1000; // Less than 1 min

  const getColorClass = () => {
    if (isCritical) return "text-red-600 bg-red-50 border-red-200 shadow-red-100";
    if (isUrgent) return "text-amber-600 bg-amber-50 border-amber-200 shadow-amber-100";
    return "text-blue-600 bg-blue-50 border-blue-200 shadow-blue-100";
  };

  const getProgressColor = () => {
    if (isCritical) return "bg-red-500";
    if (isUrgent) return "bg-amber-500";
    return "bg-blue-600";
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <motion.div 
        animate={isCritical ? { scale: [1, 1.02, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
        className={`flex items-center gap-3 px-4 py-2 rounded-2xl border shadow-sm transition-all duration-500 ${getColorClass()}`}
      >
        <div className="relative">
          <Clock className={`w-5 h-5 ${isCritical ? 'animate-pulse' : ''}`} />
          {isCritical && (
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <AlertCircle className="w-3 h-3 text-red-600 fill-red-600" />
            </motion.div>
          )}
        </div>
        
        <div className="flex items-baseline gap-1 font-mono">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black leading-none">
              {minutes.toString().padStart(2, "0")}
            </span>
            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Min</span>
          </div>
          <span className="text-xl font-black opacity-40 mb-2">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black leading-none">
              {seconds.toString().padStart(2, "0")}
            </span>
            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Sec</span>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner max-w-[140px]">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "linear" }}
          className={`h-full rounded-full ${getProgressColor()} shadow-[0_0_8px_rgba(var(--tw-shadow-color),0.5)]`}
        ></motion.div>
      </div>
      
      <AnimatePresence>
        {isUrgent && (
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-[10px] font-black uppercase tracking-wider ${isCritical ? 'text-red-500' : 'text-amber-500'}`}
          >
            {isCritical ? "Final Countdown!" : "Time is running out!"}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExamTimer;
