import React from 'react';
import { motion } from 'framer-motion';

const SidebarNavItem = ({ item, isActive, onClick }) => {
  return (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <item.icon
        className={`w-5 h-5 transition-transform group-hover:scale-110 ${
          isActive ? 'text-white' : ''
        }`}
      />
      <span className="font-bold text-sm tracking-tight">{item.label}</span>
      {isActive && (
        <motion.div
          layoutId="active-pill"
          className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"
        />
      )}
    </button>
  );
};

export default SidebarNavItem;
