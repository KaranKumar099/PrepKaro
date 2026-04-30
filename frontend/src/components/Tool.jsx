import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Menu, Bell } from 'lucide-react';

import ExamSelection from './tool/ExamSelection';
import DifficultySettings from './tool/DifficultySettings';
import ConfigurationPreview from './tool/ConfigurationPreview';
import PaperReadyCard from './tool/PaperReadyCard';
import StartExamModal from './tool/StartExamModal';
import SideBar from './SideBar';

import { useQuestionStore } from '../store/UseQuestionStore';
import { useSidebarStore } from '../store/UseSidebarStore';
import { allExams, featuredExams } from '../constants';
import { generateExamPDF } from '../utils/pdfGenerator';

const Tool = () => {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [duration, setDuration] = useState(180);
  const [totalMarks, setTotalMarks] = useState(300);
  const [questionCount, setQuestionCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState(null);
  const [examId, setExamId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const { openSidebar } = useSidebarStore();
  const setActiveTab = useSidebarStore((s) => s.setActiveTab);
  const { setQuestions, setAttemptID, questions } = useQuestionStore();

  useEffect(() => {
    setActiveTab('generate');
  }, [setActiveTab]);

  const onHandleExamSelect = (examId) => {
    setSelectedExam(examId);
    setGeneratedPaper(null);
    const details = allExams.find((exam) => exam.id === examId);
    if (details) {
      setDuration(details.duration);
      setTotalMarks(details.totalMarks);
      setQuestionCount(details.questionCount);
    }
  };

  const onHandleGenerate = async () => {
    if (!selectedExam) return;
    setIsGenerating(true);
    const exam = allExams.find((e) => e.id === selectedExam);
    const examName = exam?.name;

    try {
      const token = localStorage.getItem('accessToken');
      const res1 = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/tool`,
        { exam: examName, difficulty, questionCount },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true },
      );
      const fetchedQuestions = res1.data.data;

      const res2 = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/exam`,
        { title: examName, questions: fetchedQuestions, difficulty, duration, totalMarks },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true },
      );

      setQuestions(fetchedQuestions);
      setExamId(res2.data.data._id);
      setGeneratedPaper({
        examName: examName,
        difficulty,
        duration: Number(res2.data.data.duration),
        totalMarks: Number(res2.data.data.totalMarks),
        questionCount: res2.data.data.questions.length,
        dateGenerated: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      });
    } catch (err) {
      console.error('Critical error generating paper:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const onHandleProceed = async () => {
    setShowAlert(false);
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attempt`,
        { examId },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true },
      );
      setAttemptID(res.data.data._id);
      navigate('/exam');
    } catch (error) {
      console.error('Error starting exam attempt:', error);
    }
  };

  const onHandleDownloadPDF = async () => {
    if (!generatedPaper || !questions) return;
    await generateExamPDF({
      title: generatedPaper.examName,
      questions: questions,
      difficulty: difficulty,
      totalMarks: totalMarks,
      duration: duration,
      examId: examId || 'Examination_Paper',
    });
  };

  const selectedExamData = useMemo(
    () => allExams.find((e) => e.id === selectedExam),
    [selectedExam],
  );

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 font-inter text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <SideBar />

      <div className="flex-1 overflow-y-auto relative custom-scrollbar">
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => openSidebar()}
                className="lg:hidden p-2 hover:bg-slate-50 rounded-lg"
              >
                <Menu className="w-6 h-6 text-slate-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                  Paper Generator Engine ⚡
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Configure and generate AI-powered mock exams
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-[1200px] mx-auto p-6 lg:p-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <ExamSelection
                selectedExam={selectedExam}
                onExamSelect={onHandleExamSelect}
                allExams={allExams}
                featuredExams={featuredExams}
              />

              {selectedExam && (
                <DifficultySettings difficulty={difficulty} setDifficulty={setDifficulty} />
              )}
            </div>

            <div className="space-y-8">
              {!generatedPaper ? (
                <ConfigurationPreview
                  selectedExam={selectedExam}
                  selectedExamData={selectedExamData}
                  difficulty={difficulty}
                  duration={duration}
                  totalMarks={totalMarks}
                  questionCount={questionCount}
                  onGenerate={onHandleGenerate}
                  isGenerating={isGenerating}
                />
              ) : (
                <PaperReadyCard
                  generatedPaper={generatedPaper}
                  difficulty={difficulty}
                  duration={duration}
                  onStartAttempt={() => setShowAlert(true)}
                  onDownloadPDF={onHandleDownloadPDF}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <StartExamModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        onProceed={onHandleProceed}
      />
    </div>
  );
};

export default Tool;

