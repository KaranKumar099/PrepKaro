import { useState, useEffect } from 'react';
import { ArrowRight, FileText, Target, TrendingUp, Flame, Calendar, Plus, Search, Bell, Trophy, Menu, Layout, BookOpen, Clock, ChevronRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useUserStore } from '../store/UseUserStore'; 
import axios from 'axios';
import SideBar from './SideBar';
import { useSidebarStore } from '../store/UseSideBarStore';
import { quickActions, timeDifference } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const navigate = useNavigate();
  const [allExams, setAllExams] = useState([]);
  const { user } = useUserStore();
  const { openSidebar, closeSidebar, isSidebarOpen } = useSidebarStore();
  const setActiveTab = useSidebarStore((s) => s.setActiveTab);

  useEffect(() => {
    setActiveTab("overview");
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

  const recentTests = allExams.slice(0, 4);
  let avgScore = 0;
  if (allExams.length) {
    const totalScore = allExams.reduce((sum, exam) => sum + (exam.score || 0), 0);
    avgScore = totalScore / allExams.length;
  }

  let totalPracticeTime = 0;
  if (allExams.length > 0) {
    totalPracticeTime = allExams.reduce((sum, exam) => {
      const { hours } = timeDifference(exam?.endTime, exam?.startTime)
      if (hours) sum += hours;
      return sum
    }, 0)
  }

  const dateTimeExtract = (isoString) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const performanceData = [
    { subject: 'Physics', score: 85, color: 'blue' },
    { subject: 'Chemistry', score: 72, color: 'indigo' },
    { subject: 'Mathematics', score: 68, color: 'violet' },
    { subject: 'Biology', score: 90, color: 'sky' },
  ];

  const handleQuickAction = (actionType) => {
    setActiveTab(actionType);
    switch (actionType) {
      case 'generate': navigate("/tool"); break;
      case 'history': navigate("/history"); break;
      default: console.log("Action triggered:", actionType);
    }
  };

  // const achievements = [
  //   { icon: '🔥', title: '7 Day Streak', desc: 'Consistency is key!', unlocked: true },
  //   { icon: '🎯', title: 'Perfect Score', desc: 'Ace performance', unlocked: true },
  //   { icon: '⚡', title: 'Speed Master', desc: '<60% time used', unlocked: false },
  //   { icon: '🏆', title: 'Top 100', desc: 'Ranking high', unlocked: false },
  // ];

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
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 w-64 transition-all text-sm font-medium"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
                </button>
                <div className="w-10 h-10 bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 rounded-full overflow-hidden cursor-pointer">
                  {user?.avatar ? (
                    <img src={user?.avatar} className="w-full h-full object-cover" alt="" />
                  ) : (
                    user?.name?.[0] || 'U'
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto p-6 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              { label: 'Total Tests', val: allExams?.length, icon: FileText, sub: '+2 this week', bg: 'bg-blue-50', text: 'text-blue-600' },
              { label: 'Current Streak', val: `${user.streak || 5} Days`, icon: Flame, sub: 'Leveling up!', bg: 'bg-orange-50', text: 'text-orange-600' },
              { label: 'Average Score', val: `${avgScore.toFixed(1)}%`, icon: TrendingUp, sub: 'Improving consistently', bg: 'bg-green-50', text: 'text-green-600' },
              { label: 'Practice Time', val: `${totalPracticeTime} hrs`, icon: Clock, sub: 'Time well spent', bg: 'bg-violet-50', text: 'text-violet-600' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.text}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">{stat.val}</div>
                <div className="text-xs font-semibold text-slate-500">{stat.sub}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              {/* Quick Actions Panel */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all flex flex-col items-center gap-3 text-center"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${action.color} text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    <h2 className="text-xl font-bold">Recent Mock Exams</h2>
                  </div>
                  <button onClick={() => navigate("/history")} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                    View History <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                <div className="grid gap-4">
                  {recentTests.length > 0 ? recentTests.map((test) => (
                    <div
                      key={test._id}
                      onClick={() => navigate(`/attempt/${test._id}`)}
                      className="group flex items-center gap-6 p-4 rounded-3xl border border-slate-50 hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer"
                    >
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Layout className="w-7 h-7 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 truncate mb-1">{test.exam?.title}</h4>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {dateTimeExtract(test.createdAt)}</span>
                          <span className={`px-2 py-0.5 rounded-full ${
                            test.exam?.difficulty === 'easy' ? 'bg-green-50 text-green-600' :
                            test.exam?.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {test.exam?.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-xl font-black text-slate-900">
                          {test.score}<span className="text-slate-300 font-medium text-sm">/{test.exam?.totalMarks}</span>
                        </div>
                        <div className="text-xs font-bold text-blue-600">
                          {Math.round((test.score / test.exam?.totalMarks) * 100)}% Match
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12 text-slate-400 font-medium italic border-2 border-dashed border-slate-100 rounded-3xl">
                      No exams taken yet. Start practicing today!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Side Panel: Performance */}
            <div className="space-y-8">
              {/* Performance Section */}
              <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-500" /> Topic Analysis
                </h3>
                <div className="space-y-6">
                  {performanceData.map((subject, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-slate-700">{subject.subject}</span>
                        <span className="text-sm font-black text-slate-900">{subject.score}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${subject.score}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-full bg-${subject.color}-500 rounded-full`}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Goal Banner */}
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-200/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Weekly Goal 🎯</h3>
                  <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                    You're 2 tests away from hitting your weekly productivity target!
                  </p>
                  <button 
                    onClick={() => navigate("/tool")}
                    className="w-full py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group shadow-lg"
                  >
                    Start Challenge
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
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
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
