import React from 'react';
import { Settings, LogOut, ChevronRight } from 'lucide-react';

const UserPanel = ({ user, onLogout, onProfileClick }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100/50 dark:border-slate-700/50">
      <div
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer group shadow-transparent hover:shadow-sm"
        onClick={onProfileClick}
      >
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold ring-2 ring-white dark:ring-slate-700 shadow-sm overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} className="w-full h-full object-cover" alt="" />
          ) : (
            user?.name?.[0] || 'U'
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{user?.name}</h4>
          <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Premium Student
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
      </div>

      <div className="flex gap-2 mt-4 px-1">
        <button className="flex-1 py-2.5 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-100 dark:hover:border-blue-900 transition-all shadow-sm">
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={onLogout}
          className="flex-1 py-2.5 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-900 transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default UserPanel;
