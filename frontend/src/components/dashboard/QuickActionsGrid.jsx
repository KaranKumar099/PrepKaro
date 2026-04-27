import React from 'react';
import { quickActions } from '../../constants';

const QuickActionsGrid = ({ onAction }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {quickActions.map((action, index) => (
        <button
          key={index}
          onClick={() => onAction(action.action)}
          className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all flex flex-col items-center gap-3 text-center"
        >
          <div
            className={`w-12 h-12 rounded-xl ${action.color} text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}
          >
            <action.icon className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-slate-700">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActionsGrid;
