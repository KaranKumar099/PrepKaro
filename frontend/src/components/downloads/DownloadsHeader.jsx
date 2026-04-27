import React from 'react';
import { Layout, FolderDown, HardDrive } from 'lucide-react';

const DownloadsHeader = ({ openSidebar, paperCount }) => {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={openSidebar} className="lg:hidden p-2 hover:bg-slate-50 rounded-lg">
            <Layout className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FolderDown className="w-6 h-6 text-blue-600" /> Download Center
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Your Offline Study Library
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
            <HardDrive className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-black text-slate-600">{paperCount} Available Papers</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DownloadsHeader;
