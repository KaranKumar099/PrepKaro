import React, { useState, useEffect } from 'react';
import { FileText, Download, Clock, Target, Calendar, BarChart3, Search, Bell, Trophy, Menu, SlidersHorizontal, Eye, ChevronDown, Activity, Plus, Layout } from 'lucide-react';
import SideBar from './SideBar';
import axios from 'axios';
import { useSidebarStore } from '../store/UseSidebarStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { timeDifference } from '../constants';
import { generateExamPDF } from '../utils/pdfGenerator';

export default function ExamHistory() {
  const navigate = useNavigate();
  const [filterExam, setFilterExam] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [allExams, setAllExams] = useState([]);

  const { openSidebar, closeSidebar, isSidebarOpen } = useSidebarStore();
  const setActiveTab = useSidebarStore((s) => s.setActiveTab);

  useEffect(() => {
    setActiveTab("history");
  }, []);
  
  useEffect(() => {
    const generatedExams = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/exam`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        const exams = res.data.data;
        const sortedExams = exams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllExams(sortedExams);
      } catch (error) {
        console.error(error);
      }
    };
    generatedExams();
  }, []);

  const filteredexams = allExams.filter(exam => {
    if (!exam.answers) return false;
    if (filterExam !== 'all' && exam.title !== filterExam) return false;
    if (filterDifficulty !== 'all' && (exam.answers ? exam.exam.difficulty : exam.difficulty) !== filterDifficulty) return false;
    if (filterStatus !== 'all') {
        const status = exam.answers ? 'completed' : 'pending';
        if (status !== filterStatus) return false;
    }
    return true;
  });

  const sortedExams = [...filteredexams].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'score') {
        const scoreA = a.answers ? (a.score / a.exam.totalMarks) : 0;
        const scoreB = b.answers ? (b.score / b.exam.totalMarks) : 0;
        return scoreB - scoreA;
    }
    return 0;
  });

  const stats = {
    totalExams: filteredexams.length,
    avgScore: allExams.length > 0 ? Math.round(allExams.reduce((acc, exam) => {
      if (exam.answers && exam.exam) {
        return acc + (exam.score / exam.exam.totalMarks * 100);
      }
      return acc;
    }, 0) / (allExams.filter(exam => exam.answers).length || 1)) : 0,
    bestScore: allExams.length > 0 ? Math.max(...allExams.filter(exam => exam.answers && exam.exam).map(exam => Math.round(exam.score / exam.exam.totalMarks * 100)), 0) : 0,
    totalTime: allExams.reduce((acc, exam) => {
      const { hours, minutes } = timeDifference(exam?.endTime, exam?.startTime)
      return acc + (hours || 0) * 60 + (minutes || 0);
    }, 0),
  };

  const dateTimeExtract = (isoString) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#F8FAFC] font-inter text-slate-800">
      <SideBar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        {/* Header Section */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => openSidebar()} className="lg:hidden p-2 hover:bg-slate-50 rounded-lg">
                <Menu className="w-6 h-6 text-slate-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                  Performance History
                </h1>
                <p className="text-slate-500 text-sm font-medium">Analyze your journey and identify strengths</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto p-6 space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Tests', val: stats.totalExams, icon: FileText, color: 'blue', sub: 'Completed & Pending' },
              { label: 'Average Score', val: `${stats.avgScore}%`, icon: Activity, color: 'indigo', sub: 'Performance across all' },
              { label: 'Personal Best', val: `${stats.bestScore}%`, icon: Trophy, color: 'orange', sub: 'High watermark' },
              { label: 'Learning Time', val: stats.totalTime < 60 ? `${stats.totalTime} mins` : `${(stats.totalTime / 60).toFixed(1)}h`, icon: Clock, color: 'violet', sub: 'Focus time spent' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[1.5px]">{stat.label}</span>
                </div>
                <div className="text-3xl font-black text-slate-900 mb-1">{stat.val}</div>
                <div className="text-xs font-bold text-slate-500">{stat.sub}</div>
              </motion.div>
            ))}
          </div>

          {/* Filtering Header */}
          <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search specific exams by name..."
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm border-2 transition-all ${
                    showFilters ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-50 text-slate-600'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-5 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm text-slate-600 appearance-none focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="score">Sort by Score</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-slate-600" />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-50 overflow-hidden"
                >
                  {[
                    { label: 'Exam Category', val: filterExam, set: setFilterExam, opts: ['all', 'JEE Main', 'JEE Advanced', 'NEET', 'SSC CGL'] },
                    { label: 'Complexity', val: filterDifficulty, set: setFilterDifficulty, opts: ['all', 'easy', 'medium', 'hard'] },
                    { label: 'Status', val: filterStatus, set: setFilterStatus, opts: ['all', 'completed'] },
                  ].map((field, idx) => (
                    <div key={idx} className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                      <select
                        value={field.val}
                        onChange={(e) => field.set(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm text-slate-600 focus:outline-none capitalize transition-all"
                      >
                        {field.opts.map(opt => <option key={opt} value={opt} className="capitalize">{opt}</option>)}
                      </select>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Test List Container */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-3">
                Recent Sessions <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-black">{sortedExams.length}</span>
              </h2>
              <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <Download className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-slate-50">
              {sortedExams.length > 0 ? sortedExams.map((exam, idx) => (
                <motion.div 
                  key={exam._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => navigate(`/attempt/${exam._id}`)}
                  className="p-6 sm:p-8 hover:bg-slate-50 transition-all flex flex-col md:flex-row items-center gap-8 group"
                >
                  {/* Visual Token */}
                  <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Layout className={`w-8 h-8 ${exam.answers ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                  
                  {/* Details Core */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 mb-1 truncate">
                          {exam.answers ? exam.exam.title : exam.title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {dateTimeExtract(exam.createdAt)}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {(exam.answers ? exam.exam.duration : 'N/A')} min</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          (exam.answers ? exam.exam.difficulty : exam.difficulty) === 'easy' ? 'bg-green-50 text-green-600' :
                          (exam.answers ? exam.exam.difficulty : exam.difficulty) === 'medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {exam.answers ? exam.exam.difficulty : exam.difficulty}
                        </span>
                        {exam.answers && (
                          <div className="text-right">
                            <div className="text-2xl font-black text-slate-900 leading-none">
                              {Math.round(((exam.score>0 ? exam.score : 0) / (exam.exam.totalMarks || 1)) * 100)}%
                            </div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">
                              {exam.score} / {exam.exam.totalMarks} Marks
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Palette */}
                    <div className="flex gap-3 mt-6">
                      {exam.answers ? (
                        <>
                          <button className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-black shadow-lg shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                            <Eye className="w-4 h-4" /> Preview
                          </button>
                          <button className="p-2.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm">
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              generateExamPDF({
                                title: exam.exam.title,
                                questions: exam.exam.questions,
                                difficulty: exam.exam.difficulty,
                                totalMarks: exam.exam.totalMarks,
                                duration: exam.exam.duration,
                                examId: exam.exam._id
                              });
                            }}
                            className="p-2.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="flex-1 sm:flex-none px-6 py-2.5 bg-amber-500 text-white rounded-lg text-xs font-black shadow-lg shadow-amber-100 flex items-center justify-center gap-2 hover:bg-amber-600 transition-all">
                            <Plus className="w-4 h-4" /> Resume Test
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="py-24 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-slate-200" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">No results matching filters</h4>
                  <p className="text-slate-500 font-medium">Try adjusting your search or category selections</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
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