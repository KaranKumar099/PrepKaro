import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, Download, Share2, ChevronDown, ChevronUp, AlertCircle, Trophy, Brain, ArrowRight, Home, Layout, Target, Activity, Zap, BookOpen, GraduationCap, ArrowUpRight } from 'lucide-react';
import axios from "axios"
import { useNavigate, useParams } from 'react-router';
import { getDate, timeDifference } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExamEvaluation() {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [examData, setExamData] = useState({
    examName: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: '',
    timeSpent: '',
    avgTimeSpent: 0,
    totalMarks: 0,
    positiveMarks: 0,
    negativeMarks: 0,
    score: 0,
    totalQuestions: 0,
    correctQues: 0,
    incorrectQues: 0,
    unattemptedQues: 0,
    difficulty: 'medium'
  });
  const { attemptId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!attemptId) return;
    setLoading(true)

    const getAttempt = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        const attemptData = response.data.data;

        const { minutes, seconds } = timeDifference(attemptData.endTime, attemptData.startTime);
        const timeSpent = `${minutes} min ${seconds} sec`;
        const date = getDate(attemptData.startTime);

        setQuestions(attemptData.answers);
        setExamData({
          ...examData,
          examName: attemptData.exam.title,
          duration: attemptData.exam.duration,
          difficulty: attemptData.exam.difficulty,
          totalMarks: attemptData.exam.totalMarks,
          startTime: attemptData.startTime,
          endTime: attemptData.endTime,
          timeSpent, date
        })
      } catch (error) {
        console.error("Error in getting attempt details:", error);
      } finally {
        setLoading(false);
      }
    };
    getAttempt();
  }, [attemptId]);

  useEffect(() => {
    if (!questions || questions.length === 0) return;

    const correctQues = [];
    const incorrectQues = [];
    const unattemptedQues = [];
    let positive = 0;
    let negative = 0;
    let time = 0;

    questions.forEach((ques) => {
      time += ques.timespent;
      if (ques.status === "unattempted") unattemptedQues.push(ques);
      else if (ques.status === "correct") {
        correctQues.push(ques);
        positive += ques.question.score;
      }
      else {
        incorrectQues.push(ques);
        // Only MCQ questions have negative marking
        if (ques.question.questionType?.toUpperCase() === "MCQ") {
          negative += ques.question.score / 4;
        }
      }
    });

    setExamData(prev => ({
      ...prev,
      correctQues,
      incorrectQues,
      unattemptedQues,
      positiveMarks: positive,
      negativeMarks: negative,
      score: positive - negative,
      avgTimeSpent: time / (questions.length || 1)
    }));
  }, [questions]);

  const [detailedAnalysis, setDetailedAnalysis] = useState({
    chapters: [],
    timeAnalysis: [],
    mistakes: [],
    recommendations: [],
    focusAreas: []
  });

  useEffect(() => {
    if (!questions || questions.length === 0) return;

    const chapterMap = {};
    questions.forEach(q => {
      const chapter = q.question.chapter || q.question.topic || 'General';
      if (!chapterMap[chapter]) chapterMap[chapter] = { correct: 0, total: 0, time: 0, unattempted: 0 };
      chapterMap[chapter].total++;
      chapterMap[chapter].time += q.timespent;
      if (q.status === 'correct') chapterMap[chapter].correct++;
      else if (q.status === 'unattempted') chapterMap[chapter].unattempted++;
    });

    const chaptersArr = Object.keys(chapterMap).map(name => {
      const stats = chapterMap[name];
      const accuracy = Math.round((stats.correct / (stats.total - stats.unattempted || 1)) * 100);
      const avgTime = Math.round(stats.time / stats.total);
      return { name, accuracy, avgTime, total: stats.total, time: stats.time };
    });

    const focusAreas = chaptersArr
      .filter(t => t.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);

    const timeWastedChapters = chaptersArr
      .filter(t => t.avgTime > examData.avgTimeSpent * 1.5 && t.accuracy < 50)
      .map(t => t.name);

    const recs = [];
    if (accuracy < 70) recs.push({ title: "Accuracy Focus", text: "Priority should be reducing silly mistakes. Slow down on individual questions." });
    if (examData.avgTimeSpent > 90) recs.push({ title: "Time Optimization", text: "You're spending too long per question. Practice with a timer on specific chapters." });
    if (examData.unattemptedQues.length > questions.length * 0.2) recs.push({ title: "Attempt Management", text: "Too many unattempted questions. Improve your scanning technique." });

    setDetailedAnalysis({
      chapters: chaptersArr,
      focusAreas,
      timeWastedChapters,
      recommendations: recs.length > 0 ? recs : [{ title: "Maintain Momentum", text: "Your strategy is solid. Continue practicing varied difficulty levels." }]
    });
  }, [questions, examData.avgTimeSpent]);

  const percentage = Math.round(((examData.score>0 ? examData.score : 0) / (examData.totalMarks || 1)) * 100);
  const accuracy = Math.round((examData.correctQues.length / ((examData.correctQues.length + examData.incorrectQues.length) || 1)) * 100);

  const toggleQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  if (loading) {
      return (
          <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
              <div className="text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Processing Results...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-none mb-1">Results Analytics</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PrepKaro Engine ⚡</p>
            </div>
          </div>
          <button 
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-10">
        {/* Hero Score Banner */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] p-8 lg:p-12 text-white overflow-hidden shadow-2xl shadow-blue-100"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-[28px] flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-4xl font-black mb-1">Benchmark Achieved!</h2>
                  <p className="text-slate-400 font-medium">{examData.examName} • Detailed Report</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6">
                {[
                  { label: "NET SCORE", val: `${examData.score} / ${examData.totalMarks}`, icon: Target },
                  { label: "PERCENTAGE", val: `${percentage}%`, icon: Activity },
                  { label: "ACCURACY", val: `${accuracy}%`, icon: Zap },
                  { label: "ENGAGEMENT", val: examData.timeSpent, icon: Clock },
                ].map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <stat.icon className="w-3.5 h-3.5" /> {stat.label}
                    </div>
                    <div className="text-2xl font-black">{stat.val}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="hidden lg:flex w-48 h-48 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full items-center justify-center relative">
                <div className="text-center">
                    <div className="text-6xl font-black text-white">{percentage}%</div>
                    <div className="text-[10px] font-black text-slate-400 tracking-widest">RANK SCORE</div>
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/50">
                    <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'CORRECT ATTEMPTS', val: examData.correctQues?.length || 0, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', sub: `+${examData.positiveMarks} marks gained` },
            { label: 'CRITICAL ERRORS', val: examData.incorrectQues?.length || 0, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', sub: `-${examData.negativeMarks} penalty applied` },
            { label: 'SKIPPED ITEMS', val: examData.unattemptedQues?.length || 0, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50', sub: 'Zero impact on score' },
            { label: 'AVG VELOCITY', val: `${Math.round(examData.avgTimeSpent)}s`, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', sub: 'Per question duration' },
          ].map((card, i) => (
            <motion.div 
               key={i}
               whileHover={{ y: -4 }}
               className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${card.bg}`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</span>
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{card.val}</div>
              <div className="text-xs font-bold text-slate-500">{card.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="border-b border-slate-50 px-8 bg-slate-50/30">
            <div className="flex gap-10">
              {['overview', 'questions', 'analysis'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-6 border-b-4 transition-all capitalize font-black text-sm tracking-widest ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="p-8 space-y-10"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" /> Administrative Metadata
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { label: "Subject ID", val: examData.examName },
                      { label: "Attempt Timestamp", val: examData.date },
                      { label: "Complexity Level", val: examData.difficulty.toUpperCase() },
                      { label: "Allocated Time", val: `${examData.duration} Minutes` },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100/50">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                        <span className="font-black text-slate-900">{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-50">
                  <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200">
                    <Download className="w-5 h-5" /> Download Full Transcript
                  </button>
                  <button className="flex-1 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm">
                    <Share2 className="w-5 h-5" /> Distribute Results
                  </button>
                </div>
              </motion.div>
            )}

            {/* Questions Tab Content */}
            {activeTab === 'questions' && (
              <motion.div 
                key="questions"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8"
              >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-slate-900">Per-Question Trace</h3>
                    <div className="flex p-1 bg-slate-50 rounded-2xl gap-1">
                        {['All', 'Correct', 'Incorrect'].map((filter) => (
                            <button key={filter} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${filter === 'All' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question._id} className="group border border-slate-100 rounded-3xl overflow-hidden hover:border-blue-200 transition-all bg-slate-50/30">
                      <div 
                        className="p-5 flex flex-col lg:flex-row items-center justify-between cursor-pointer group-hover:bg-white transition-all gap-6"
                        onClick={() => toggleQuestion(question._id)}
                      >
                        <div className="flex items-center gap-6 flex-1 w-full">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 ${
                            question.status === 'correct' ? 'bg-green-100 text-green-600' : 
                            question.status === 'incorrect' ? 'bg-red-100 text-red-600' : 
                            'bg-slate-100 text-slate-400'
                          }`}>
                            {question.status === 'correct' ? <CheckCircle className="w-7 h-7" /> : 
                             question.status === 'incorrect' ? <XCircle className="w-7 h-7" /> : 
                             <AlertCircle className="w-7 h-7" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-black text-slate-900">Q. {index + 1}</span>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-wider">{question.question.chapter || question.question.topic}</span>
                            </div>
                            <div className="text-sm font-medium text-slate-500 line-clamp-1">{question.question.questionText}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-8 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0">
                          <div className="text-center px-4">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">LATENCY</div>
                            <div className="font-extrabold text-slate-900">{question.timespent}s</div>
                          </div>
                          <div className="text-center px-4">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SCORE</div>
                            <div className={`font-extrabold ${question.status === 'correct' ? 'text-green-600' : question.status === 'incorrect' ? 'text-red-500' : 'text-slate-400'}`}>
                                {question.status === 'correct' ? `+${question.question.score}` : 
                                 (question.status === 'incorrect' && question.question.questionType?.toUpperCase() === 'MCQ') ? `-${question.question.score/4}` : '0'}
                            </div>
                          </div>
                          {expandedQuestion === question._id ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-slate-300" />}
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedQuestion === question._id && (
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="bg-white px-8 pb-8 pt-6 border-t border-slate-50 space-y-8"
                          >
                            <div className="bg-slate-50 p-6 rounded-3xl">
                              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Core Statement</h4>
                              <p className="text-slate-700 font-bold leading-relaxed">{question.question.questionText}</p>
                            </div>
                            
                            <div className="grid gap-3">
                              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Response Details</h4>
                              {question.question.questionType?.toUpperCase() === 'NAT' ? (
                                <div className="space-y-4">
                                   <div className={`p-5 rounded-2xl border-2 ${question.status === 'correct' ? 'bg-green-50 border-green-200' : question.status === 'incorrect' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                                      <div className="flex justify-between items-center mb-2">
                                         <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Your Entry</span>
                                         <span className={`font-black ${question.status === 'correct' ? 'text-green-600' : question.status === 'incorrect' ? 'text-red-600' : 'text-slate-400'}`}>
                                            {question.userAnswer || "N/A"}
                                         </span>
                                      </div>
                                      <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
                                         <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Correct Solution</span>
                                         <span className="font-black text-green-600">{question.question.answer[0]}</span>
                                      </div>
                                   </div>
                                </div>
                              ) : (
                                <>
                                  {question.question.options.map((option, idx) => {
                                    const correctIndices = question.question.answer.map(a => a.charCodeAt(0) - 65);
                                    const userIndices = question.userAnswer?.split(',').filter(x => x !== "").map(Number) || [];
                                    
                                    const isCorrect = correctIndices.includes(idx);
                                    const isUserChoice = userIndices.includes(idx);
                                    
                                    let borderColor = 'border-slate-100';
                                    let bgColor = 'bg-white';
                                    let textColor = 'text-slate-600';

                                    if (isCorrect) {
                                      borderColor = 'border-green-200';
                                      bgColor = 'bg-green-50';
                                      textColor = 'text-green-900';
                                    } else if (isUserChoice) {
                                      borderColor = 'border-red-200';
                                      bgColor = 'bg-red-50';
                                      textColor = 'text-red-900';
                                    }

                                    return (
                                      <div
                                        key={idx}
                                        className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${borderColor} ${bgColor} ${textColor}`}
                                      >
                                        <span className="font-bold flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-black text-xs">{String.fromCharCode(65 + idx)}</span>
                                            {option}
                                        </span>
                                        {isCorrect && (
                                          <div className="px-3 py-1 bg-green-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                            <CheckCircle className="w-3 h-3" /> VERIFIED KEY
                                          </div>
                                        )}
                                        {isUserChoice && !isCorrect && (
                                          <div className="px-3 py-1 bg-red-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                            <XCircle className="w-3 h-3" /> YOUR MARK
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </>
                              )}
                            </div>

                            <div className="flex gap-4 pt-4">
                              <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> Comprehensive Explanation
                              </button>
                              <button className="px-6 py-3 border border-slate-100 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Dispute Metadata
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Analysis Tab Content */}
            {activeTab === 'analysis' && (
              <motion.div 
                key="analysis"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 space-y-12"
              >
                {/* Chapter Proficiency Grid */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Chapter Proficiency Matrix</h3>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Accuracy vs Speed</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {detailedAnalysis.chapters.map((chapter, i) => (
                      <div key={i} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 hover:bg-white hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4 className="text-base font-black text-slate-800 mb-1">{chapter.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{chapter.total} Questions Sampled</p>
                          </div>
                          <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${chapter.accuracy >= 80 ? 'bg-green-100 text-green-700' : chapter.accuracy >= 50 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                            {chapter.accuracy >= 80 ? 'Mastery' : chapter.accuracy >= 50 ? 'Developing' : 'Critical Focus'}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                             <div className="flex justify-between text-xs font-bold text-slate-600">
                               <span>Accuracy</span>
                               <span>{chapter.accuracy}%</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                               <div className={`h-full rounded-full ${chapter.accuracy >= 70 ? 'bg-green-500' : chapter.accuracy >= 40 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${chapter.accuracy}%` }}></div>
                             </div>
                          </div>
                          <div className="flex justify-between items-center text-xs pt-2">
                            <div className="flex items-center gap-2 text-slate-500">
                               <Clock className="w-3.5 h-3.5" />
                               <span>Avg Speed: <span className="font-black text-slate-800">{chapter.avgTime}s / question</span></span>
                            </div>
                            <div className={`${chapter.avgTime > 120 ? 'text-orange-600 font-bold' : 'text-green-600 font-bold'}`}>
                              {chapter.avgTime > 120 ? 'Slow' : 'Fast'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strategy Insight Banner */}
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm h-full">
                       <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                         <Activity className="w-5 h-5 text-indigo-600" /> Time Investment Logic
                       </h4>
                       <div className="space-y-6">
                         <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                            <p className="text-sm font-medium text-slate-700 leading-relaxed mb-4">
                              <span className="font-black text-indigo-600">Observation:</span> You spent the most time on <span className="font-black text-slate-900">{detailedAnalysis.chapters.sort((a,b) => b.time - a.time)[0]?.name || 'N/A'}</span>.
                            </p>
                            <div className="flex items-center gap-3">
                               <div className={`w-2 h-2 rounded-full ${detailedAnalysis.chapters.sort((a,b) => b.time - a.time)[0]?.accuracy >= 70 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                               <span className="text-xs font-bold text-slate-500">
                                 {detailedAnalysis.chapters.sort((a,b) => b.time - a.time)[0]?.accuracy >= 70 ? 'This investment was highly effective.' : 'High time cost with low yield. Potential conceptual gap.'}
                               </span>
                            </div>
                         </div>
                         
                         <div>
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Error Pattern Identity</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <div className="p-4 bg-red-50/50 rounded-xl border border-red-100">
                                  <div className="text-xs font-black text-red-600 mb-1 uppercase tracking-wider">Conceptual Errors</div>
                                  <p className="text-[11px] font-medium text-slate-600">Frequent in High Difficulty items.</p>
                               </div>
                               <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                                  <div className="text-xs font-black text-amber-600 mb-1 uppercase tracking-wider">Time Mismanagement</div>
                                  <p className="text-[11px] font-medium text-slate-600">Last 10Q accuracy dropped by 30%.</p>
                               </div>
                            </div>
                         </div>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[32px] p-8 text-white">
                       <h4 className="text-lg font-black mb-6 flex items-center gap-3">
                         <Target className="w-5 h-5 text-blue-400" /> Top Focus Items
                       </h4>
                       <ul className="space-y-4">
                         {detailedAnalysis.focusAreas.map((area, i) => (
                           <li key={i} className="flex items-center gap-3 group">
                             <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center font-black text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                               {i+1}
                             </div>
                             <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-all">{area.name}</span>
                           </li>
                         ))}
                       </ul>
                    </div>
                  </div>
                </div>

                {/* AI Tactical Recommendations */}
                <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white rounded-[40px] p-8 lg:p-12 relative overflow-hidden shadow-2xl shadow-blue-100">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-2xl"></div>
                  <h4 className="text-2xl font-black mb-8 flex items-center gap-4">
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                        <Brain className="w-8 h-8 text-white" />
                    </div>
                    Tactical Strategy Recommendations
                  </h4>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {detailedAnalysis.recommendations.map((rec, i) => (
                      <div key={i} className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-default">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                           <Zap className="text-blue-200 w-5 h-5" />
                        </div>
                        <h5 className="text-lg font-black mb-2">{rec.title}</h5>
                        <p className="text-blue-100 text-sm font-medium leading-relaxed">{rec.text}</p>
                      </div>
                    ))}
                    <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/20 transition-all">
                       <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 font-black">?</div>
                       <h5 className="text-lg font-black mb-2">Strategy Comparison</h5>
                       <p className="text-blue-100 text-sm font-medium leading-relaxed">Top performers spend 15s less on 1-mark NATs than your current avg.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
