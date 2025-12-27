import React, { useState, useEffect } from 'react';
import { ArrowRight, FileText, Download, Target, TrendingUp, Flame , Calendar, BarChart3, Plus, Search, Bell, Trophy, Menu } from 'lucide-react';
import { useNavigate } from 'react-router';
import {useUser} from "../context/userContext"
import axios from 'axios';
import SideBar from './SideBar';

export default function Dashboard() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [allExams, setAllExams] = useState([]);

  const {user} = useUser()
  
  useEffect(()=>{
    const generatedExams = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/exam`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        )
        const exams = res.data.data;
        const sortedExams = exams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setAllExams(sortedExams)
        console.log(res.data)
      } catch (error) {
        console.error(error)
      }
    }
    generatedExams()
  },[])

  const recentTests = allExams.slice(0,3)

  const upcomingTests = [
    { id: 1, exam: 'JEE Main Mock Test #25', date: 'Today, 4:00 PM', duration: '180 min' },
    { id: 2, exam: 'NEET Biology', date: 'Tomorrow, 10:00 AM', duration: '120 min' },
  ];

  const dateTimeExtract = (isoString)=>{
    const dateObj = new Date(isoString);
    const dateTime = dateObj.toLocaleString("en-IN"); 
    return dateTime
  } 
  
  const performanceData = [
    { subject: 'Physics', score: 85, total: 100, trend: 'up' },
    { subject: 'Chemistry', score: 72, total: 100, trend: 'up' },
    { subject: 'Mathematics', score: 68, total: 100, trend: 'down' },
    { subject: 'Biology', score: 90, total: 100, trend: 'up' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Generate New Paper', color: 'bg-blue-600', action: 'generate' },
    { icon: FileText, label: 'My Test History', color: 'bg-gray-700', action: 'history' },
    { icon: BarChart3, label: 'View Analytics', color: 'bg-gray-700', action: 'analytics' },
    { icon: Download, label: 'Download Reports', color: 'bg-gray-700', action: 'reports' },
  ];

  const handleQuickAction = (actionType)=>{
    setActiveTab(actionType)
    switch (actionType) {
        case 'overview':
          navigate("/");
          break;

        case 'generate':
          navigate("/tool");
          break;

        case 'history':
          navigate("/history");
          break;

        case 'analytics':
        console.log("Viewing analytics...");
        // navigate("/analytics");
        break;

        case 'reports':
        console.log("Downloading reports...");
        // Trigger file download logic here
        break;

        default:
        console.log("Unknown action");
    }
  }

  const achievements = [
    { icon: '🔥', title: '7 Day Streak', desc: 'Keep it up!', unlocked: true },
    { icon: '🎯', title: 'Perfect Score', desc: '100% in a test', unlocked: true },
    { icon: '⚡', title: 'Speed Master', desc: 'Complete in <60% time', unlocked: false },
    { icon: '🏆', title: 'Top 100', desc: 'Rank in top 100', unlocked: false },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab}/>
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
                <p className="text-gray-600 text-sm">Ready to ace your next exam?</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tests..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-64"
                />
              </div>
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Tests Taken</span>
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{allExams?.length}</div>
              <div className="text-sm text-green-600 mt-2">+3 this week</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Current Streak</span>
                <Target className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{user.streak || 5} days</div>
              <div className="text-sm text-blue-600 mt-2"><Flame className='inline h-4 w-4'/> Keep going!</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Avg. Score</span>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900">78%</div>
              <div className="text-sm text-green-600 mt-2">+5% from last month</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Time Taken</span>
                <Trophy className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900">20 hrs</div>
              <div className="text-sm text-green-600 mt-2">Practice time</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  className={`${action.color} text-white rounded-xl p-6 hover:opacity-90 transition-all transform hover:scale-105 flex flex-col items-center gap-3`}
                >
                  <action.icon className="w-8 h-8" />
                  <span className="font-semibold text-center">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Tests */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Tests</h2>
                <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {recentTests.map((test) => (
                  <div key={test._id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-600 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{test.exam.title}</div>
                      <div className="text-sm text-gray-600">Created at : {dateTimeExtract(test.createdAt)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{test.score}/{test.exam.totalMarks}</div>
                      <div className="text-sm text-gray-600">{Math.round((test.score/test.exam.totalMarks)*100)}%</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      test.exam.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      test.exam.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {test.exam.difficulty}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance by Subject */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Performance</h2>
              <div className="space-y-4">
                {performanceData.map((subject, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{subject.subject}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{subject.score}%</span>
                        {subject.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${subject.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upcoming Tests */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Scheduled Tests</h2>
              <div className="space-y-3">
                {upcomingTests.map((test) => (
                  <div key={test.id} className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{test.exam}</div>
                      <div className="text-sm text-gray-600">{test.date} • {test.duration}</div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Start
                    </button>
                  </div>
                ))}
                <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Schedule New Test
                </button>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.unlocked
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <div className="font-semibold text-gray-900 text-sm">{achievement.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{achievement.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Study Recommendation */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Need some practice? 🎯</h3>
                <p className="text-blue-100 mb-4">Based on your performance, we recommend focusing on Mathematics</p>
                <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center gap-2">
                  Generate Math Paper
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="hidden md:block text-6xl">📚</div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}