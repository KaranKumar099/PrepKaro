import React, { useState, useEffect } from "react";
import { Download, Clock, Target, CheckCircle, Sparkles, TrendingUp, RefreshCw, Menu, Bell, BookOpen, ChevronRight, AlertCircle, Layout, Activity, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import { useQuestionStore } from "../store/UseQuestionStore"; 
import axios from "axios"
import { useSidebarStore } from "../store/UseSidebarStore";
import SideBar from "./SideBar";
import { allExams, featuredExams } from "../constants"
import { generateExamPDF } from "../utils/pdfGenerator";

export default function Tool() {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [duration, setDuration] = useState(180);
  const [totalMarks, setTotalMarks] = useState(300);
  const [questionCount, setQuestionCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState(null);
  const [examId, setExamId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const { openSidebar, closeSidebar, isSidebarOpen } = useSidebarStore();
  const setActiveTab = useSidebarStore((s) => s.setActiveTab);
  const { setQuestions, setAttemptID, questions } = useQuestionStore();

  useEffect(() => {
    setActiveTab("generate");
  }, []);

  const handleExamSelect = (examId) => {
    setSelectedExam(examId);
    setGeneratedPaper(null);
    const details = allExams.find((exam) => exam.id === examId);
    if (details) {
      setDuration(details.duration);
      setTotalMarks(details.totalMarks);
      setQuestionCount(details.questionCount);
    }
  };

  const handleGenerate = async () => {
    if (!selectedExam) return;
    setIsGenerating(true);
    const exam = allExams.find((e) => e.id === selectedExam);
    const examName = exam?.name;

    try {
      const token = localStorage.getItem("accessToken");
      const res1 = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/tool`,
          { exam: examName, difficulty, questionCount },
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      const fetchedQuestions = res1.data.data;

      const res2 = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/exam`,
          { title: examName, questions: fetchedQuestions, difficulty, duration, totalMarks },
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      setQuestions(fetchedQuestions);
      setExamId(res2.data.data._id);
      setGeneratedPaper({
        examName: examName,
        difficulty,
        duration: Number(res2.data.data.duration),
        totalMarks: Number(res2.data.data.totalMarks),
        questionCount: res2.data.data.questions.length,
        dateGenerated: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }),
      });
    } catch (err) {
      console.error("Critical error generating paper:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProceed = async () => {
    setShowAlert(false);
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/attempt`,
          { examId },
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setAttemptID(res.data.data._id);
      navigate("/exam");
    } catch (error) {
      console.error("Error starting exam attempt:", error);
    }
  };

  const selectedExamData = allExams.find((e) => e.id === selectedExam);

  const handleDownloadPDF = async () => {
    if (!generatedPaper || !questions) return;
    await generateExamPDF({
      title: generatedPaper.examName,
      questions: questions,
      difficulty: difficulty,
      totalMarks: totalMarks,
      duration: duration,
      examId: examId || "Examination_Paper"
    });
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#F8FAFC] font-inter text-slate-800">
      <SideBar />

      <div className="flex-1 overflow-y-auto relative custom-scrollbar">
        {/* Header section */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => openSidebar()} className="lg:hidden p-2 hover:bg-slate-50 rounded-lg">
                <Menu className="w-6 h-6 text-slate-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                  Paper Generator Engine ⚡
                </h1>
                <p className="text-slate-500 text-sm font-medium">Configure and generate AI-powered mock exams</p>
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

        <div className="max-w-[1200px] mx-auto p-6 lg:p-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Configuration */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Exam Selection */}
              <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold">Select Targeted Exam</h2>
                </div>

                <div className="relative group mb-10">
                  <select
                    value={selectedExam}
                    onChange={(e) => handleExamSelect(e.target.value)}
                    className="w-full pl-6 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="">Search or select from list...</option>
                    {allExams.map((exam) => (
                      <option key={exam.id} value={exam.id}>{exam.name}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none rotate-90" />
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[2px]">Featured Categories</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {featuredExams.map((exam) => (
                      <motion.button
                        key={exam.id}
                        whileHover={{ y: -4 }}
                        onClick={() => handleExamSelect(exam.id)}
                        className={`p-4 rounded-xl flex flex-col items-center gap-2 border-2 transition-all ${
                          selectedExam === exam.id
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                            : "bg-white border-slate-50 hover:border-blue-200 text-slate-600"
                        }`}
                      >
                        <span className="text-2xl">{exam.icon}</span>
                        <span className="text-xs font-bold whitespace-nowrap">{exam.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Difficulty Settings */}
              <AnimatePresence>
                {selectedExam && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-indigo-50 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h2 className="text-xl font-bold">Adjust Difficulty</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: "easy", color: "green", desc: "Foundational concepts focusing on standard patterns" },
                        { id: "medium", color: "blue", desc: "Balanced mix of logic and calculation intensive problems" },
                        { id: "hard", color: "red", desc: "Challenging advanced problems for top-tier preparation" }
                      ].map((level) => (
                        <motion.button
                          key={level.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setDifficulty(level.id)}
                          className={`p-5 rounded-xl text-left border-2 transition-all flex flex-col justify-between h-40 ${
                            difficulty === level.id
                              ? `bg-blue-50/50 border-blue-600 border-2`
                              : "bg-slate-50/50 border-transparent hover:border-slate-200"
                          }`}
                        >
                          <div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              difficulty === level.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}>
                              {level.id}
                            </span>
                            <p className="text-[11px] font-medium text-slate-500 mt-4 leading-relaxed line-clamp-2">
                              {level.desc}
                            </p>
                          </div>
                          <div className={`w-8 h-1 rounded-full ${difficulty === level.id ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Execution */}
            <div className="space-y-8">
              {!generatedPaper ? (
                <div className="sticky top-24 space-y-6">
                  <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                      <Layout className="w-5 h-5 text-blue-600" /> Preview Configuration
                    </h3>

                    {selectedExam ? (
                      <div className="space-y-6">
                        <div className="grid gap-4">
                          {[
                            { label: "Target Exam", value: selectedExamData?.name, icon: GraduationCap },
                            { label: "Complexity", value: difficulty.toUpperCase(), icon: TrendingUp },
                            { label: "Duration", value: `${duration} Minutes`, icon: Clock },
                            { label: "Total Scope", value: `${totalMarks} Marks`, icon: Target },
                            { label: "Question Density", value: `${questionCount} Qs`, icon: Activity },
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50">
                              <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                                <item.icon className="w-3.5 h-3.5" /> {item.label}
                              </div>
                              <span className="font-bold text-slate-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={handleGenerate}
                          disabled={isGenerating}
                          className={`w-full py-5 rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                            isGenerating
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
                          }`}
                        >
                          {isGenerating ? (
                            <RefreshCw className="w-6 h-6 animate-spin" />
                          ) : (
                            <>
                              <Sparkles className="w-6 h-6" /> Generate Machine-Mock
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <BookOpen className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold text-sm">Select an exam to unlock generator</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="sticky top-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-2xl shadow-blue-200"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">Paper Ready! ✅</h3>
                  </div>

                  <div className="space-y-4 mb-10">
                    {[
                      { label: "EXAM", value: generatedPaper.examName },
                      { label: "DIFFICULTY", value: difficulty.toUpperCase() },
                      { label: "DURATION", value: `${duration} MIN` },
                      { label: "TIMESTAMP", value: generatedPaper.dateGenerated },
                    ].map((i, idx) => (
                      <div key={idx} className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-[10px] font-black text-white/50 tracking-[1px] uppercase">{i.label}</span>
                        <span className="font-black text-sm">{i.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => setShowAlert(true)}
                      className="w-full py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Clock className="w-5 h-5" /> Start Live Attempt
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="w-full py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" /> Export as PDF
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showAlert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] px-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[24px] p-10 w-full max-w-md shadow-2xl"
            >
              <div className="w-16 h-16 bg-amber-50 rounded-xl flex items-center justify-center mb-8">
                <AlertCircle className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Ready to Start?</h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-10">
                You are about to start a live mock attempt. The timer will begin immediately and the session cannot be paused.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowAlert(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Go Back
                </button>
                <button
                  onClick={handleProceed}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                >
                  Proceed
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

