import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Edit3, LogOut, Camera } from 'lucide-react';

const ProfileHeader = ({ user, isEditing, onEdit, onLogout, onAvatarClick }) => {
  return (
    <motion.div
      key="view"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col md:flex-row items-center gap-10"
    >
      <div className="relative group">
        <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-xl p-1.5 bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl shadow-blue-100 dark:shadow-none transition-transform group-hover:scale-105">
          <img
            src={user.avatar}
            alt="profile"
            className="w-full h-full rounded-lg object-cover border-4 border-white dark:border-slate-800"
          />
        </div>
        <button
          onClick={onAvatarClick}
          className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-xl transition-all scale-0 group-hover:scale-100"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 text-center md:text-left">
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-3">
          Preparing for {user?.targetExam || 'GATE'}
        </span>
        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-2 truncate">{user.name}</h1>
        <p className="text-slate-400 dark:text-slate-500 font-bold mb-8 flex items-center justify-center md:justify-start gap-2">
          <Mail className="w-4 h-4" /> {user.email}
        </p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <button
            onClick={onEdit}
            className="px-6 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 dark:shadow-none transition-all flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
          <button
            onClick={onLogout}
            className="px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
