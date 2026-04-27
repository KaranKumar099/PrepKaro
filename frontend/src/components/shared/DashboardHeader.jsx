import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Activity, Search, Bell } from 'lucide-react';
import { useNavigate } from 'react-router';

const DashboardHeader = ({ user, onOpenSidebar }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onOpenSidebar} className="lg:hidden p-2 hover:bg-slate-50 rounded-lg">
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Welcome, {user.name.split(' ')[0]}
            </h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <Activity className="w-4 h-4 text-green-500" />
              <span>You're in the top 15% of students this month</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Find tests or resources..."
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 w-64 transition-all text-sm font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/user')}
              className="w-10 h-10 bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 rounded-full overflow-hidden cursor-pointer border-2 border-white"
            >
              {user?.avatar ? (
                <img src={user?.avatar} className="w-full h-full object-cover" alt="User avatar" />
              ) : (
                user?.name?.[0] || 'U'
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
