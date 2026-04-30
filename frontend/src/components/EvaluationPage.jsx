import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertCircle, Home, GraduationCap } from 'lucide-react';

import StatCard from './shared/StatCard.jsx';
import HeroScoreBanner from './evaluation/HeroScoreBanner.jsx';
import OverviewTab from './evaluation/OverviewTab.jsx';
import QuestionsTab from './evaluation/QuestionsTab.jsx';
import AnalysisTab from './evaluation/AnalysisTab.jsx';

import { formatShortDate, getTimeDifference } from '../utils/dateUtils';

export default function ExamEvaluation() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [performanceData, setPerformanceData] = useState(null);
  const [performanceLoading, setPerformanceLoading] = useState(false);
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
    correctQues: [],
    incorrectQues: [],
    unattemptedQues: [],
    difficulty: 'medium',
  });

  // Fetch attempt details
  useEffect(() => {
    if (!attemptId) return;
    const fetchAttempt = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const attemptData = response.data.data;
        const { minutes, seconds } = getTimeDifference(attemptData.endTime, attemptData.startTime);
        const timeSpent = `${minutes} min ${seconds} sec`;
        const date = formatShortDate(attemptData.startTime);
        setQuestions(attemptData.answers);
        setExamData((prev) => ({
          ...prev,
          examName: attemptData.exam.title,
          duration: attemptData.exam.duration,
          difficulty: attemptData.exam.difficulty,
          totalMarks: attemptData.exam.totalMarks,
          startTime: attemptData.startTime,
          endTime: attemptData.endTime,
          timeSpent,
          date,
        }));
      } catch (error) {
        console.error('Error in getting attempt details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [attemptId]);

  // Fetch backend performance analysis
  useEffect(() => {
    if (!attemptId) return;
    const fetchPerformanceAnalysis = async () => {
      setPerformanceLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptId}/analysis`,
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true },
        );
        setPerformanceData(response.data.data);
      } catch (error) {
        console.error('Error fetching performance analysis:', error);
      } finally {
        setPerformanceLoading(false);
      }
    };
    fetchPerformanceAnalysis();
  }, [attemptId]);

  // Derive score breakdown from questions array
  useEffect(() => {
    if (!questions || questions.length === 0) return;
    const correctQues = [];
    const incorrectQues = [];
    const unattemptedQues = [];
    let positive = 0;
    let negative = 0;
    let totalTimeSpent = 0;
    questions.forEach((ques) => {
      totalTimeSpent += ques.timespent;
      if (ques.status === 'unattempted') {
        unattemptedQues.push(ques);
      } else if (ques.status === 'correct') {
        correctQues.push(ques);
        positive += ques.question.score;
      } else {
        incorrectQues.push(ques);
        if (ques.question.questionType?.toUpperCase() === 'MCQ') {
          negative += ques.question.score / 4;
        }
      }
    });
    setExamData((prev) => ({
      ...prev,
      correctQues,
      incorrectQues,
      unattemptedQues,
      positiveMarks: positive,
      negativeMarks: negative,
      score: positive - negative,
      avgTimeSpent: totalTimeSpent / (questions.length || 1),
    }));
  }, [questions]);

  const percentage = Math.round((Math.max(examData.score, 0) / (examData.totalMarks || 1)) * 100);
  const accuracy = Math.round((examData.correctQues.length / (questions.length || 1)) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">Processing Results...</p>
        </div>
      </div>
    );
  }

  const metricCards = [
    { label: 'CORRECT ATTEMPTS', val: examData.correctQues?.length || 0, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', sub: `+${examData.positiveMarks} marks gained` },
    { label: 'CRITICAL ERRORS', val: examData.incorrectQues?.length || 0, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', sub: `-${examData.negativeMarks} penalty applied` },
    { label: 'SKIPPED ITEMS', val: examData.unattemptedQues?.length || 0, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50', sub: 'Zero impact on score' },
    { label: 'AVG VELOCITY', val: `${Math.round(examData.avgTimeSpent)}s`, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', sub: 'Per question duration' },
  ];

  const tabs = ['overview', 'questions', 'performance'];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-inter text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1">Results Analytics</h1>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">PrepKaro Engine ⚡</p>
            </div>
          </div>
          <button
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-10">
        <HeroScoreBanner examData={examData} percentage={percentage} accuracy={accuracy} />

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {metricCards.map((card, i) => (
            <StatCard key={i} label={card.label} value={card.val} subText={card.sub} icon={card.icon} bgColor={card.bg} textColor={card.color} />
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="border-b border-slate-50 dark:border-slate-800 px-8 bg-slate-50/30 dark:bg-slate-800/30">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-6 border-b-4 transition-all capitalize font-black text-sm tracking-widest whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {tab === 'performance' ? 'Performance' : tab}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <OverviewTab key="overview" examData={examData} />}
            {activeTab === 'questions' && <QuestionsTab key="questions" questions={questions} />}
            {activeTab === 'performance' && (
              performanceLoading ? (
                <motion.div
                  key="perf-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-24 gap-4"
                >
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">Loading analysis...</p>
                </motion.div>
              ) : (
                <AnalysisTab key="performance" performanceData={performanceData} examData={examData} />
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
