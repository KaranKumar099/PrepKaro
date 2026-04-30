import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, TrendingUp, Flame, Clock } from 'lucide-react';

import SideBar from './SideBar';
import DashboardHeader from './shared/DashboardHeader.jsx';
import StatCard from './shared/StatCard.jsx';
import TopicAnalysis from './shared/TopicAnalysis.jsx';
import QuickActionsGrid from './dashboard/QuickActionsGrid';
import RecentExamsList from './dashboard/RecentExamsList';
import WeeklyGoalCard from './dashboard/WeeklyGoalCard';

import { useUserStore } from '../store/UseUserStore';
import { useSidebarStore } from '../store/UseSidebarStore';
import { getTimeDifference } from '../utils/dateUtils';
import { generateExamPDF } from '../utils/pdfGenerator';

const COLORS = ['blue', 'indigo', 'violet', 'emerald', 'amber', 'rose', 'cyan', 'fuchsia'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { isSidebarOpen, openSidebar, closeSidebar, setActiveTab } = useSidebarStore();

  const [allExams, setAllExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicStats, setTopicStats] = useState([]);

  useEffect(() => {
    setActiveTab('overview');
  }, [setActiveTab]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/exam`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const exams = response.data.data || [];
        setAllExams(exams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const stats = useMemo(() => {
    const recentTests = allExams.filter((exam) => exam.answers).slice(0, 4);
    const totalScore = allExams.reduce((sum, exam) => sum + (exam.score || 0), 0);
    const avgScore = allExams.length ? totalScore / allExams.length : 0;

    const totalPracticeTimeMins = allExams.reduce((sum, exam) => {
      const { hours, minutes } = getTimeDifference(exam?.endTime, exam?.startTime);
      return sum + (hours || 0) * 60 + (minutes || 0);
    }, 0);

    const currentStreak = (() => {
      if (!allExams.length) return 0;
      const dates = [
        ...new Set(
          allExams.map((exam) => {
            const d = new Date(exam.createdAt);
            return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
          }),
        ),
      ].sort((a, b) => b - a);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dates[0] < today.getTime() - 86400000) return 0;

      let count = 1;
      for (let i = 0; i < dates.length - 1; i++) {
        if (dates[i] - dates[i + 1] === 86400000) count++;
        else break;
      }
      return count;
    })();

    return { recentTests, avgScore, totalPracticeTimeMins, currentStreak };
  }, [allExams]);

  useEffect(() => {
    if (!allExams.length) {
      const defaultChapters =
        user.targetExam === 'GATE'
          ? [
              { subject: 'Operating Systems', score: 0, color: 'blue' },
              { subject: 'Algorithms', score: 0, color: 'indigo' },
              { subject: 'Databases', score: 0, color: 'violet' },
              { subject: 'Networks', score: 0, color: 'emerald' },
            ]
          : [
              { subject: 'Quantitative', score: 0, color: 'blue' },
              { subject: 'Reasoning', score: 0, color: 'indigo' },
              { subject: 'English', score: 0, color: 'violet' },
              { subject: 'General Awareness', score: 0, color: 'emerald' },
            ];
      setTopicStats(defaultChapters);
      return;
    }

    const chapterMap = {};
    allExams.forEach((exam) => {
      if (exam.answers && Array.isArray(exam.answers)) {
        exam.answers.forEach((ans) => {
          if (ans.question) {
            const chap = ans.question.chapter || 'General';
            if (!chapterMap[chap]) chapterMap[chap] = { correct: 0, total: 0 };
            chapterMap[chap].total++;
            if (ans.status === 'correct') chapterMap[chap].correct++;
          }
        });
      }
    });

    const statsArray = Object.keys(chapterMap)
      .map((chap, index) => ({
        subject: chap,
        score: Math.round((chapterMap[chap].correct / chapterMap[chap].total) * 100),
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setTopicStats(
      statsArray.length
        ? statsArray
        : [
            { subject: 'Foundational Knowledge', score: 0, color: 'blue' },
            { subject: 'Problem Solving', score: 0, color: 'indigo' },
            { subject: 'Analytical Skills', score: 0, color: 'violet' },
            { subject: 'Domain Expertise', score: 0, color: 'emerald' },
          ],
    );
  }, [allExams, user.targetExam]);

  const onHandleQuickAction = (actionType) => {
    setActiveTab(actionType);
    if (actionType === 'generate') navigate('/tool');
    else if (actionType === 'history') navigate('/history');
  };

  const onHandleDownloadPDF = (e, exam) => {
    e.stopPropagation();
    generateExamPDF({
      title: exam.exam.title,
      questions: exam.exam.questions,
      difficulty: exam.exam.difficulty,
      totalMarks: exam.exam.totalMarks,
      duration: exam.exam.duration,
      examId: exam.exam._id,
    });
  };

  const statCards = [
    {
      label: 'Total Tests',
      val: allExams.length,
      icon: FileText,
      sub: '+2 this week',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Current Streak',
      val: `${stats.currentStreak || 1} Day${(stats.currentStreak || 1) > 1 ? 's' : ''}`,
      icon: Flame,
      sub: stats.currentStreak > 0 ? 'Keep it up!' : 'Start your streak!',
      bg: 'bg-orange-50 dark:bg-orange-950/20',
      text: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Average Score',
      val: `${stats.avgScore.toFixed(1)}%`,
      icon: TrendingUp,
      sub: 'Improving consistently',
      bg: 'bg-green-50 dark:bg-green-950/20',
      text: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Practice Time',
      val:
        stats.totalPracticeTimeMins < 60
          ? `${stats.totalPracticeTimeMins} mins`
          : `${(stats.totalPracticeTimeMins / 60).toFixed(1)} hrs`,
      icon: Clock,
      sub: 'Time well spent',
      bg: 'bg-violet-50 dark:bg-violet-950/20',
      text: 'text-violet-600 dark:text-violet-400',
    },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 font-inter text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <SideBar />

      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        <DashboardHeader user={user} onOpenSidebar={openSidebar} />

        <div className="max-w-[1600px] mx-auto p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {statCards.map((stat, i) => (
              <StatCard
                key={i}
                label={stat.label}
                value={stat.val}
                subText={stat.sub}
                icon={stat.icon}
                bgColor={stat.bg}
                textColor={stat.text}
              />
            ))}
          </div>

          <div className="grid xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
            <div className="lg:hidden">
              <QuickActionsGrid onAction={onHandleQuickAction} />
            </div>

              <RecentExamsList
                exams={stats.recentTests}
                loading={loading}
                onNavigateHistory={() => navigate('/history')}
                onNavigateAttempt={(id) => navigate(`/attempt/${id}`)}
                onDownloadPDF={onHandleDownloadPDF}
                onNavigateTool={() => navigate('/tool')}
              />
              
              <WeeklyGoalCard onAction={() => navigate('/tool')} />
            </div>

            <div className="space-y-8">
              <TopicAnalysis topicStats={topicStats} isLoading={loading} />
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
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;

