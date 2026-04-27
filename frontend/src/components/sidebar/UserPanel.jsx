import React from 'react';
import { Settings, LogOut, ChevronRight } from 'lucide-react';

const UserPanel = ({ user, onLogout, onProfileClick }) => {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50">
      <div
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-all cursor-pointer group shadow-transparent hover:shadow-sm"
        onClick={onProfileClick}
      >
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold ring-2 ring-white shadow-sm overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} className="w-full h-full object-cover" alt="" />
          ) : (
            user?.name?.[0] || 'U'
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 text-sm truncate">{user?.name}</h4>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            Premium Student
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
      </div>

      <div className="flex gap-2 mt-4 px-1">
        <button className="flex-1 py-2.5 flex items-center justify-center bg-white border border-slate-100 rounded-lg text-slate-500 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={onLogout}
          className="flex-1 py-2.5 flex items-center justify-center bg-white border border-slate-100 rounded-lg text-slate-500 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default UserPanel;
