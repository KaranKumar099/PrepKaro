import React from 'react';
import { motion } from 'framer-motion';

const ProfileForm = ({ formData, onInputChange, onSubmit, onCancel, loading }) => {
  return (
    <motion.form
      key="edit"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={onSubmit}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
            Full Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={onInputChange}
            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-bold focus:border-blue-200 dark:focus:border-blue-900 outline-none transition-all dark:text-white"
            placeholder="Enter your name"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
            Email Address
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={onInputChange}
            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-bold focus:border-blue-200 dark:focus:border-blue-900 outline-none transition-all dark:text-white"
            placeholder="your@email.com"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
            Username
          </label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
              @
            </span>
            <input
              name="username"
              value={formData.username}
              onChange={onInputChange}
              className="w-full pl-10 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-bold focus:border-blue-200 dark:focus:border-blue-900 outline-none transition-all dark:text-white"
              placeholder="johndoe"
            />
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
            Primary Goal / Exam
          </label>
          <select
            name="targetExam"
            value={formData.targetExam}
            onChange={onInputChange}
            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-bold focus:border-blue-200 dark:focus:border-blue-900 outline-none transition-all dark:text-white"
          >
            <option value="GATE">GATE (Engineering)</option>
            <option value="JEE">JEE (Main/Advanced)</option>
            <option value="UPSC">UPSC Civil Services</option>
            <option value="CAT">CAT (Management)</option>
            <option value="GRE">GRE / GMAT</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 dark:shadow-none transition-all flex items-center gap-2"
        >
          {loading ? 'Saving Changes...' : 'Secure Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          Discard
        </button>
      </div>
    </motion.form>
  );
};

export default ProfileForm;
