import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';

import SideBar from './SideBar';
import DownloadCard from './shared/DownloadCard.jsx';
import DownloadsHeader from './downloads/DownloadsHeader';
import DownloadsActionBar from './downloads/DownloadsActionBar';
import EmptyDownloadsState from './downloads/EmptyDownloadsState';

import { useSidebarStore } from '../store/UseSidebarStore';
import { generateExamPDF } from '../utils/pdfGenerator';

const Downloads = () => {
  const navigate = useNavigate();
  const { openSidebar, setActiveTab } = useSidebarStore();

  const [allExams, setAllExams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setActiveTab('downloads');
    onFetchExams();
  }, [setActiveTab]);

  const onFetchExams = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/exam`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const exams = response.data.data || [];
      setAllExams(exams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error fetching exams for downloads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onHandleDownload = async (exam) => {
    const examData = exam.exam ? exam.exam : exam;
    await generateExamPDF({
      title: examData.title || 'Exam Paper',
      questions: examData.questions,
      difficulty: examData.difficulty,
      totalMarks: examData.totalMarks,
      duration: examData.duration,
      examId: examData._id,
    });
  };

  const filteredExams = useMemo(() => {
    return allExams.filter((exam) => {
      if (!!exam.answers) return false;
      const title = exam.exam ? exam.exam.title : exam.title;
      return title?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [allExams, searchQuery]);

  return (
    <div className="h-screen flex overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 font-inter text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <SideBar />

      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        <DownloadsHeader openSidebar={openSidebar} paperCount={filteredExams.length} />

        <div className="max-w-[1600px] mx-auto p-6 lg:p-8 space-y-8">
          <DownloadsActionBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredExams.map((exam, idx) => (
                <DownloadCard
                  key={exam._id}
                  exam={exam}
                  onDownload={onHandleDownload}
                  index={idx}
                />
              ))}
            </AnimatePresence>
          </div>

          {allExams.length === 0 && !isLoading && (
            <EmptyDownloadsState onNavigateToTool={() => navigate('/tool')} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Downloads;
