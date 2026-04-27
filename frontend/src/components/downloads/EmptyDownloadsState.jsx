import React from 'react';
import { FolderDown, ArrowRight } from 'lucide-react';

const EmptyDownloadsState = ({ onNavigateToTool }) => {
  return (
    <div className="py-32 text-center">
      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <FolderDown className="w-12 h-12 text-slate-200" />
      </div>
      <h4 className="text-xl font-black text-slate-900 mb-2">No generated papers yet</h4>
      <p className="text-slate-500 font-medium max-w-sm mx-auto">
        Generate your first mock test to see it here for offline download.
      </p>
      <button
        onClick={onNavigateToTool}
        className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
      >
        Go Create Now <ArrowRight className="w-4 h-4 inline-block ml-2" />
      </button>
    </div>
  );
};

export default EmptyDownloadsState;
