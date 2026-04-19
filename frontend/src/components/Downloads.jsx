import React, { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Clock, Search, FolderDown, ArrowRight, Layout, Filter, Trash2, HardDrive, Share2 } from 'lucide-react';
import SideBar from './SideBar';
import axios from 'axios';
import { useSidebarStore } from '../store/UseSidebarStore';
import { motion, AnimatePresence } from 'framer-motion';
import { generateExamPDF } from '../utils/pdfGenerator';

export default function Downloads() {
  const [allExams, setAllExams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { openSidebar } = useSidebarStore();
  const setActiveTab = useSidebarStore((s) => s.setActiveTab);

  useEffect(() => {
    setActiveTab("downloads");
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/exam`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      const exams = res.data.data;
      setAllExams(exams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Error fetching exams for downloads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (exam) => {
    // Determine exam data from the structure (sometimes it's under exam property if it's an attempted session)
    const examData = exam.exam ? exam.exam : exam;
    
    await generateExamPDF({
      title: examData.title || "Exam Paper",
      questions: examData.questions,
      difficulty: examData.difficulty,
      totalMarks: examData.totalMarks,
      duration: examData.duration,
      examId: examData._id
    });
  };

  const filteredExams = allExams.filter(exam => {
    if (!!exam.answers) return false;
    const title = exam.exam ? exam.exam.title : exam.title;
    return title?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const dateTimeExtract = (isoString) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#F8FAFC] font-inter text-slate-800">
      <SideBar />
      
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        {/* Header Section */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => openSidebar()} className="lg:hidden p-2 hover:bg-slate-50 rounded-lg">
                <Layout className="w-6 h-6 text-slate-600" />
              </button>
              <div>
                <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <FolderDown className="w-6 h-6 text-blue-600" /> Download Center
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Offline Study Library</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                  <HardDrive className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-black text-slate-600">{filteredExams.length} Available Papers</span>
               </div>
            </div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto p-6 lg:p-8 space-y-8">
          
          {/* Action Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="relative flex-1 group">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources by exam name or description..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
              />
            </div>
            
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          {/* Grid Layout for Downloads */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredExams.map((exam, idx) => {
                const examData = exam.exam ? exam.exam : exam;
                const isAttempted = !!exam.answers;

                return (
                  <motion.div
                    key={exam._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white rounded-2xl border border-slate-100 p-1 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-default overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-500">
                          <FileText className={`w-7 h-7 ${isAttempted ? 'text-blue-600' : 'text-slate-400'}`} />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                examData.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-600' :
                                examData.difficulty === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                            }`}>
                                {examData.difficulty}
                            </span>
                            {isAttempted && (
                                <span className="mt-2 text-[10px] font-black text-slate-300 uppercase tracking-tighter italic">Last Attempted {dateTimeExtract(exam.createdAt)}</span>
                            )}
                            <p className="text-xs text-right font-bold text-slate-400 opacity-80">REF: {examData._id.toUpperCase()}</p>
                        </div>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 mb-0 truncate group-hover:text-blue-600 transition-colors">
                        {examData.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-6">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {dateTimeExtract(exam.createdAt)}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {examData.duration} min</span>
                      </div>

                      <div className="space-y-3 pt-6 border-t border-slate-50">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 italic">Paper Format</span>
                            <span className="text-xs font-black text-slate-700">Premium PDF (HD)</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 italic">Total Marks</span>
                            <span className="text-xs font-black text-slate-700">{examData.totalMarks} Marks</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50/50 flex gap-2">
                        <button 
                            onClick={() => handleDownload(exam)}
                            className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-100 transition-all group/btn"
                        >
                            <Download className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" /> Download PDF
                        </button>
                        <button className="p-3.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-blue-600 hover:border-blue-200 transition-all">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {allExams.length === 0 && !isLoading && (
            <div className="py-32 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderDown className="w-12 h-12 text-slate-200" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">No generated papers yet</h4>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">Generate your first mock test to see it here for offline download.</p>
              <button 
                onClick={() => navigate('/tool')}
                className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
              >
                Go Create Now <ArrowRight className="w-4 h-4 inline-block ml-2" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
