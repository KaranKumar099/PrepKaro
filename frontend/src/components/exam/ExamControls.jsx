import React from 'react';
import { ChevronLeft, ChevronRight, Bookmark, Send } from 'lucide-react';

const ExamControls = ({
  current,
  total,
  onNavigate,
  onMarkForReview,
  onSubmit,
  isMarked,
}) => {
  return (
    <div className="absolute bottom-10 left-12 right-12 z-10">
      <div className="max-w-4xl mx-auto bg-white/50 backdrop-blur-xl border border-white/50 p-4 rounded-[32px] shadow-2xl flex items-center justify-between">
        <button
          onClick={() => current > 0 && onNavigate(current - 1)}
          disabled={current === 0}
          className="h-14 px-8 rounded-2xl font-black text-sm text-slate-600 bg-white border border-slate-100 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" /> Previous
        </button>

        <div className="flex gap-4">
          <button
            onClick={onMarkForReview}
            className={`h-14 px-8 rounded-2xl font-black text-sm border-2 transition-all flex items-center gap-2 ${
              isMarked
                ? 'bg-amber-500 border-amber-500 text-white'
                : 'bg-white border-slate-100 text-slate-600 hover:border-amber-200'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isMarked ? 'fill-white' : ''}`} />
            {isMarked ? 'Review Marked' : 'Mark for Review'}
          </button>

          <button
            onClick={() => (current < total - 1 ? onNavigate(current + 1) : onSubmit())}
            className="h-14 px-10 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-2"
          >
            {current < total - 1 ? (
              <>
                Next Question <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Final Submit <Send className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamControls;
