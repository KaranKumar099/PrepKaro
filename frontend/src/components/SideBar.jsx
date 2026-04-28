import React from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  FileText,
  BarChart3,
  Calendar,
  GraduationCap,
  LayoutDashboard,
  DownloadIcon,
  Book,
} from 'lucide-react';

import SidebarNavItem from './sidebar/SidebarNavItem';
import UserPanel from './sidebar/UserPanel';

import { useUserStore } from '../store/UseUserStore';
import { useSidebarStore } from '../store/UseSidebarStore';

const SideBar = () => {
  const navigate = useNavigate();
  const { user, loading, setUser } = useUserStore();
  const { isSidebarOpen, activeTab, setActiveTab, closeSidebar } = useSidebarStore();

  if (loading && !user) return null;

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'generate', icon: Plus, label: 'New Mock Test' },
    { id: 'history', icon: FileText, label: 'Test History' },
    { id: 'downloads', icon: DownloadIcon, label: 'Downloads' },
    { id: 'analytics', icon: BarChart3, label: 'Performance' },
    { id: 'schedule', icon: Calendar, label: 'Study Plan' },
    { id: 'questionBank', icon: Book, label: 'Question Bank' },
  ];

  const onHandleNavAction = (id) => {
    setActiveTab(id);
    switch (id) {
      case 'overview':
        navigate('/');
        break;
      case 'generate':
        navigate('/tool');
        break;
      case 'history':
        navigate('/history');
        break;
      case 'downloads':
        navigate('/downloads');
        break;
      case 'analytics':
        navigate('/performance');
        break;
      default:
        console.log('Navigating to:', id);
    }
    if (window.innerWidth < 1024) closeSidebar();
  };


  const onHandleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
      setUser(null);
      localStorage.removeItem('accessToken');
      navigate('/auth');
    } catch (error) {
      console.error('Error in logging out:', error);
    }
  };

  const onHandleProfileClick = () => {
    navigate('/user');
    closeSidebar();
  };

  const Skeleton = () => (
    <aside className="fixed lg:static h-full w-72 bg-white border-r border-slate-100 flex flex-col p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
        <div className="h-6 w-24 bg-slate-100 rounded-md"></div>
      </div>
      <div className="flex-1 space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-12 bg-slate-50 rounded-xl w-full"></div>
        ))}
      </div>
    </aside>
  );

  if (loading) return <Skeleton />;

  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-8 pb-10">
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => {
                  navigate('/');
                  closeSidebar();
                }}
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                  <GraduationCap className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                  PrepKaro
                </span>
              </div>
              <button onClick={closeSidebar} className="lg:hidden p-2 hover:bg-slate-50 rounded-lg">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mb-4">
              Main Menu
            </p>
            {sidebarItems.map((item) => (
              <SidebarNavItem
                key={item.id}
                item={item}
                isActive={activeTab === item.id}
                onClick={onHandleNavAction}
              />
            ))}
          </nav>

          <div className="p-4 mt-auto">
            <UserPanel
              user={user}
              onLogout={onHandleLogout}
              onProfileClick={onHandleProfileClick}
            />
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;