import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import {
  FileText,
  Clock,
  Trophy,
  Menu,
  Activity,
  Bell,
  Download,
  Search,
} from 'lucide-react';

import SideBar from './SideBar';
import StatCard from './shared/StatCard.jsx';
import FilterSection from './history/FilterSection.jsx';
import HistoryListItem from './history/HistoryListItem.jsx';

import { useSidebarStore } from '../store/UseSidebarStore';
import { getTimeDifference } from '../utils/dateUtils';

export default function ExamHistory() {
  const navigate = useNavigate();
  const { openSidebar, isSidebarOpen, closeSidebar } = useSidebarStore();
  const setActiveTab = useSidebarStore((s) => s.setActiveTab);

  const [loading, setLoading] = useState(false);
  const [allExams, setAllExams] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filters, setFilters] = useState({
    exam: 'all',
    difficulty: 'all',
    status: 'all',
  });

  useEffect(() => {
    setActiveTab('history');
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/exam`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const exams = res.data.data || [];
      const sorted = exams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllExams(sorted);
    } catch (error) {
      console.error('Failed to fetch exam history:', error);
    } finally {
      setLoading(false);
    }
  };

  const onHandleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredExams = useMemo(() => {
    return allExams.filter((exam) => {
      const title = exam.answers ? exam.exam.title : exam.title;
      const difficulty = exam.answers ? exam.exam.difficulty : exam.difficulty;
      const status = exam.answers ? 'completed' : 'pending';

      if (searchTerm && !title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filters.exam !== 'all' && title !== filters.exam) return false;
      if (filters.difficulty !== 'all' && difficulty !== filters.difficulty) return false;
      if (filters.status !== 'all' && status !== filters.status) return false;

      return true;
    });
  }, [allExams, filters, searchTerm]);

  const sortedExams = useMemo(() => {
    return [...filteredExams].sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'score') {
        const scoreA = a.answers ? a.score / (a.exam.totalMarks || 1) : 0;
        const scoreB = b.answers ? b.score / (b.exam.totalMarks || 1) : 0;
        return scoreB - scoreA;
      }
      return 0;
    });
  }, [filteredExams, sortBy]);

  const stats = useMemo(() => {
    const completedExams = allExams.filter((e) => e.answers);
    const totalTimeMinutes = allExams.reduce((acc, exam) => {
      const { hours, minutes } = getTimeDifference(exam?.endTime, exam?.startTime);
      return acc + (hours || 0) * 60 + (minutes || 0);
    }, 0);

    const avgScore = completedExams.length
      ? Math.round(
          completedExams.reduce((acc, e) => acc + (e.score / e.exam.totalMarks) * 100, 0) /
            completedExams.length
        )
      : 0;

    const bestScore = completedExams.length
      ? Math.max(...completedExams.map((e) => Math.round((e.score / e.exam.totalMarks) * 100)))
      : 0;

    return {
      total: allExams.length,
      avgScore,
      bestScore,
      totalTime: totalTimeMinutes,
    };
  }, [allExams]);

  const statCards = [
    {
      label: 'Total Tests',
      val: stats.total,
      icon: FileText,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      sub: 'Completed & Pending',
    },
    {
      label: 'Average Score',
      val: `${stats.avgScore}%`,
      icon: Activity,
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      sub: 'Performance across all',
    },
    {
      label: 'Personal Best',
      val: `${stats.bestScore}%`,
      icon: Trophy,
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      sub: 'High watermark',
    },
    {
      label: 'Learning Time',
      val: stats.totalTime < 60 ? `${stats.totalTime} mins` : `${(stats.totalTime / 60).toFixed(1)}h`,
      icon: Clock,
      bgColor: 'bg-violet-50 dark:bg-violet-950/20',
      textColor: 'text-violet-600 dark:text-violet-400',
      sub: 'Focus time spent',
    },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 font-inter text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <SideBar />

      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => openSidebar()}
                className="lg:hidden p-2 hover:bg-slate-50 rounded-lg"
              >
                <Menu className="w-6 h-6 text-slate-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                  Performance History
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Analyze your journey and identify strengths
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, i) => (
              <StatCard
                key={i}
                label={stat.label}
                value={stat.val}
                subText={stat.sub}
                icon={stat.icon}
                bgColor={stat.bgColor}
                textColor={stat.textColor}
              />
            ))}
          </div>

          <FilterSection
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filters={filters}
            onFilterChange={onHandleFilterChange}
          />

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                Recent Sessions{' '}
                <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-xs font-black">
                  {sortedExams.length}
                </span>
              </h2>
              <button className="p-3 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all">
                <Download className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading ? (
                <div className="py-24 text-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                    Retrieving History...
                  </p>
                </div>
              ) : sortedExams.length > 0 ? (
                sortedExams.map((exam, idx) => (
                  <HistoryListItem key={exam._id} exam={exam} index={idx} />
                ))
              ) : (
                <div className="py-24 text-center">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-slate-200 dark:text-slate-700" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                    No results matching filters
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Try adjusting your search or category selections
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => closeSidebar()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}