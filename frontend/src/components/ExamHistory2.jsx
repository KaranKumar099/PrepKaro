import React, { useState, useEffect } from 'react';
import { FileText, Download, Clock, Target, Calendar, BarChart3, Search, Bell, Trophy, Menu, SlidersHorizontal, Eye, ChevronDown } from 'lucide-react';
import SideBar from './SideBar';
import axios from 'axios';

export default function ExamHistory() {
  const [filterExam, setFilterExam] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('history');
  const [allExams, setAllExams] = useState([]);
  
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
        console.log("history: ", res.data);
      } catch (error) {
        console.error(error);
      }
    };
    generatedExams();
  }, []);

  const filteredexams = allExams.filter(exam => {
    if (filterExam !== 'all' && exam.title !== filterExam) return false;
    if (filterDifficulty !== 'all' && exam.difficulty !== filterDifficulty) return false;
    if (filterStatus !== 'all' && exam.status !== filterStatus) return false;
    return true;
  });

  const sortedExams = [...filteredexams].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'score') return (b.score / b.total) - (a.score / a.total);
    if (sortBy === 'exam') return a.exam?.localeCompare(b.exam);
    return 0;
  });

  const stats = {
    totalExams: allExams.length,
    avgScore: allExams.length > 0 ? Math.round(allExams.reduce((acc, exam) => {
      if (exam.answers && exam.exam) {
        return acc + (exam.score / exam.exam.totalMarks * 100);
      }
      return acc;
    }, 0) / allExams.filter(exam => exam.answers).length) : 0,
    bestScore: allExams.length > 0 ? Math.max(...allExams.filter(exam => exam.answers && exam.exam).map(exam => Math.round(exam.score / exam.exam.totalMarks * 100))) : 0,
    totalTime: allExams.reduce((acc, exam) => {
      if (exam.answers && exam.exam) {
        return acc + parseInt(exam.exam.duration || 0);
      }
      return acc;
    }, 0),
  };

  const dateTimeExtract = (isoString) => {
    const dateObj = new Date(isoString);
    const dateTime = dateObj.toLocaleString("en-IN");
    return dateTime;
  };

  const goToEvaluationPage = async () => {
    // Add navigation logic here
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Test History</h1>
                <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">
                  Track your progress and review past performances
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs sm:text-sm">Total Tests</span>
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{allExams.length}</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">All time</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs sm:text-sm">Average Score</span>
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.avgScore}%</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Across all tests</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs sm:text-sm">Best Score</span>
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.bestScore}%</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Personal best</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs sm:text-sm">Total Time</span>
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{Math.round(stats.totalTime / 60)}h</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Practice time</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Search Bar */}
              <div className="relative w-full">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by exam name..."
                  className="pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full text-sm sm:text-base"
                />
              </div>
              
              {/* Filter Buttons Row */}
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap text-sm sm:text-base"
                >
                  <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">Filters</span>
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base whitespace-nowrap"
                >
                  <option value="date">Sort by Date</option>
                  <option value="score">Sort by Score</option>
                  <option value="exam">Sort by Exam</option>
                </select>
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                  <select
                    value={filterExam}
                    onChange={(e) => setFilterExam(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
                  >
                    <option value="all">All Exams</option>
                    <option value="JEE Main">JEE Main</option>
                    <option value="JEE Advanced">JEE Advanced</option>
                    <option value="NEET">NEET</option>
                    <option value="SSC CGL">SSC CGL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
                  >
                    <option value="all">All Levels</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Test List */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  All Tests ({sortedExams.length})
                </h2>
                <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Export All</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {sortedExams.map((exam) => (
                <div key={exam._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    {/* Icon */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 w-full min-w-0">
                      {/* Title and Score Row */}
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="flex-1 min-w-0">
                          {exam.answers ? (
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                              {exam.exam.title}
                            </h3>
                          ) : (
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                              {exam.title}
                            </h3>
                          )}
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          {exam.answers ? (
                            <div className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              {exam.exam.difficulty}
                            </div>
                          ) : (
                            <div className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              {exam.difficulty}
                            </div>
                          )}
                          {exam.answers && (
                            <div className="text-right">
                              <div className="text-lg sm:text-2xl font-bold text-gray-900">
                                {Math.round((exam.score / exam.exam.totalMarks) * 100)}%
                              </div>
                              <div className="text-xs text-gray-600">
                                {exam?.score}/{exam.exam.totalMarks}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Date and Time Info */}
                      <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="truncate">{dateTimeExtract(exam.createdAt)}</span>
                        </div>
                        {exam.answers && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{exam.exam.duration} min</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {exam.answers ? (
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            View Details
                          </button>
                          <button className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Download Report</span>
                            <span className="sm:hidden">Report</span>
                          </button>
                          <button
                            className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            onClick={() => goToEvaluationPage(exam._id)}
                          >
                            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">View Analysis</span>
                            <span className="sm:hidden">Analysis</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            View PDF
                          </button>
                          <button className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                            Download PDF
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}