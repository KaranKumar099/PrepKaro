import React, { useState, useEffect } from 'react';
import { FileText, Download, Clock, Target, Calendar, BarChart3, Search, Bell, Trophy,  Menu, SlidersHorizontal, Eye, ChevronDown } from 'lucide-react';
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
        console.log("history: ", res.data)
      } catch (error) {
        console.error(error)
      }
    }
    generatedExams()
  },[])

//   const allExams = [
//     { id: 1, exam: 'JEE Main', subject: 'Physics & Chemistry', date: '2024-10-24', time: '14:30', score: 245, total: 300, duration: '180 min', difficulty: 'medium', status: 'completed', questions: 75, correct: 62, incorrect: 10, unattempted: 3 },
//     { id: 2, exam: 'NEET', subject: 'Biology', date: '2024-10-23', time: '10:00', score: 520, total: 720, duration: '180 min', difficulty: 'hard', status: 'completed', questions: 180, correct: 130, incorrect: 35, unattempted: 15 },
//     { id: 3, exam: 'JEE Advanced', subject: 'Mathematics', date: '2024-10-21', time: '16:00', score: 180, total: 360, duration: '180 min', difficulty: 'hard', status: 'completed', questions: 60, correct: 30, incorrect: 20, unattempted: 10 },
//     { id: 4, exam: 'JEE Main', subject: 'Mathematics', date: '2024-10-20', time: '09:00', score: 280, total: 300, duration: '180 min', difficulty: 'easy', status: 'completed', questions: 75, correct: 70, incorrect: 3, unattempted: 2 },
//     { id: 5, exam: 'SSC CGL', subject: 'Quantitative Aptitude', date: '2024-10-19', time: '11:30', score: 85, total: 100, duration: '60 min', difficulty: 'medium', status: 'completed', questions: 25, correct: 21, incorrect: 3, unattempted: 1 },
//     { id: 6, exam: 'NEET', subject: 'Physics & Chemistry', date: '2024-10-18', time: '14:00', score: 340, total: 360, duration: '120 min', difficulty: 'medium', status: 'completed', questions: 90, correct: 85, incorrect: 4, unattempted: 1 },
//     { id: 7, exam: 'JEE Main', subject: 'Full Test', date: '2024-10-17', time: '10:00', score: 265, total: 300, duration: '180 min', difficulty: 'hard', status: 'completed', questions: 75, correct: 66, incorrect: 7, unattempted: 2 },
//     { id: 8, exam: 'NEET', subject: 'Biology', date: '2024-10-16', time: '15:30', score: 420, total: 720, duration: '180 min', difficulty: 'easy', status: 'completed', questions: 180, correct: 105, incorrect: 50, unattempted: 25 },
//   ];


  const filteredexams = allExams.filter(exam => {
    if (filterExam !== 'all' && exam.title !== filterExam) return false;
    if (filterDifficulty !== 'all' && exam.difficulty !== filterDifficulty) return false;
    if (filterStatus !== 'all' && exam.status !== filterStatus) return false;
    return true;
  });

  const sortedExams = [...filteredexams].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'score') return (b.score / b.total) - (a.score / a.total);
    if (sortBy === 'exam') return a.exam.localeCompare(b.exam);
    return 0;
  });

  const stats = {
    totalExams: allExams.length,
    avgScore: Math.round(allExams.reduce((acc, exam) => acc + (exam.score / exam.total * 100), 0) / allExams.length),
    bestScore: Math.max(...allExams.map(exam => Math.round(exam.score / exam.total * 100))),
    totalTime: allExams.reduce((acc, exam) => acc + parseInt(exam.duration), 0),
  };

  const dateTimeExtract = (isoString)=>{
    const dateObj = new Date(isoString);
    const dateTime = dateObj.toLocaleString("en-IN"); 
    return dateTime
  }

  const goToEvaluationPage = async () => {
    
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Test History</h1>
                <p className="text-gray-600 text-sm">Track your progress and review past performances</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Total Tests</span>
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{allExams.length}</div>
              <div className="text-sm text-gray-500 mt-2">All time</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Average Score</span>
                <Target className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.avgScore}%</div>
              <div className="text-sm text-gray-500 mt-2">Across all tests</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Best Score</span>
                <Trophy className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.bestScore}%</div>
              <div className="text-sm text-gray-500 mt-2">Personal best</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Total Time</span>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{Math.round(stats.totalTime / 60)}h</div>
              <div className="text-sm text-gray-500 mt-2">Practice time</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 relative w-full md:w-auto">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by exam name, subject..."
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 w-full"
                />
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="font-medium">Filters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="date">Sort by Date</option>
                  <option value="score">Sort by Score</option>
                  <option value="exam">Sort by Exam</option>
                </select>
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                  <select
                    value={filterExam}
                    onChange={(e) => setFilterExam(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="all">All Exams</option>
                    <option value="JEE Main">JEE Main</option>
                    <option value="JEE Advanced">JEE Advanced</option>
                    <option value="NEET">NEET</option>
                    <option value="SSC CGL">SSC CGL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="all">All Levels</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
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
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  All Tests ({sortedExams.length})
                </h2>
                <button className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Export All
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {sortedExams.map((exam) => (
                <div key={exam._id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                      <FileText className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          {
                            exam.answers
                            ? <h3 className="text-lg font-bold text-gray-900">{exam.exam.title}</h3>
                            : <h3 className="text-lg font-bold text-gray-900">{exam.title}</h3>
                          }
                          {/* <p className="text-sm text-gray-600">{exam.subject}</p> */}
                        </div>
                        <div className="flex items-center gap-3">
                          {
                            exam.answers
                            ? <div className='px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800'>{exam.exam.difficulty}</div>
                            : <div className='px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800'>{exam.difficulty}</div>
                          }
                          {exam.answers && <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">{Math.round((exam.score/exam.exam.totalMarks)*100)}%</div>
                            <div className="text-xs text-gray-600">{exam?.score}/{exam.exam.totalMarks}</div>
                          </div>}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{dateTimeExtract(exam.createdAt)}</span>
                        </div>
                        {exam.answers && <div className="flex items-end gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{exam.exam.duration} min</span>
                        </div>}
                      </div>

                      {/* <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">{exam.correct} Correct</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">{exam.incorrect} Incorrect</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-gray-400"></span>
                          <span className="text-sm text-gray-700">{exam.unattempted} Unattempted</span>
                        </div>
                      </div> */}
                      {exam.answers
                        ? <div className="flex gap-3">
                          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Download Report
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                          onClick={()=>goToEvaluationPage(exam._id)}>
                            <BarChart3 className="w-4 h-4" />
                            View Analysis
                          </button>
                        </div>
                        : <div className="flex gap-3">
                          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            View PDF
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Download PDF
                          </button>
                        </div>
                      }
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
          className="fixed inset-0 bg-black/30 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}