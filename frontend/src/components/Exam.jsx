import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

import ExamHeader from './exam/ExamHeader';
import ExamSidebar from './exam/ExamSidebar';
import QuestionDisplay from './exam/QuestionDisplay';
import ExamControls from './exam/ExamControls';
import ViolationModal from './ViolationModal';

import { useQuestionStore } from '../store/UseQuestionStore';

const Exam = () => {
  const navigate = useNavigate();
  const { questions, attemptID } = useQuestionStore();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [visited, setVisited] = useState({});
  const [violations, setViolations] = useState(0);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const MAX_VIOLATIONS = 2;

  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [current]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        triggerViolation();
      }
    };

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        triggerViolation();
      }
    };

    const triggerViolation = () => {
      setViolations((prev) => {
        const newCount = prev + 1;
        if (newCount > MAX_VIOLATIONS) {
          onHandleSubmit(); // Auto-submit on 3rd violation
          return newCount;
        }
        setShowViolationModal(true);
        return newCount;
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    const fetchAttemptData = async () => {
      if (!attemptID) {
        navigate('/');
        return;
      }
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptID}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const attemptData = response.data.data;

        if (attemptData.status === 'submitted') {
          navigate(`/attempt/${attemptID}`, { replace: true });
          return;
        }

        // Request fullscreen only if not submitted
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch((e) => console.error(e));
        }

        const existingAnswers = {};
        const existingMarked = {};
        attemptData.answers.forEach((ans) => {
          const qId = ans.question._id || ans.question;
          const q = questions.find((question) => question._id === qId);

          if (q?.questionType?.toUpperCase() === 'MSQ') {
            existingAnswers[qId] = ans.userAnswer ? ans.userAnswer.split(',').map(Number) : [];
          } else if (q?.questionType?.toUpperCase() === 'NAT') {
            existingAnswers[qId] = ans.userAnswer;
          } else {
            existingAnswers[qId] = ans.userAnswer ? parseInt(ans.userAnswer) : undefined;
          }

          existingMarked[qId] = ans.markedForReview;
        });

        setAnswers(existingAnswers);
        setMarked(existingMarked);
      } catch (error) {
        console.error('Error fetching attempt data:', error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    if (questions.length > 0) {
      fetchAttemptData();
    }
  }, [attemptID, questions, navigate]);

  const saveTimeSpent = async (qId) => {
    const now = Date.now();
    const timeSpentSeconds = Math.floor((now - startTimeRef.current) / 1000);
    startTimeRef.current = now;

    if (timeSpentSeconds > 0) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptID}/timespent`,
          { questionId: qId, timeSpent: timeSpentSeconds },
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true },
        );
      } catch (error) {
        console.error('Error saving time:', error);
      }
    }
  };

  const onHandleOptionClick = async (qId, optIndex) => {
    await saveTimeSpent(qId);

    const question = questions.find((q) => q._id === qId);
    const isMSQ = question?.questionType?.toUpperCase() === 'MSQ';
    let nextAnswer;

    if (isMSQ) {
      const currentSelection = Array.isArray(answers[qId]) ? answers[qId] : [];
      if (currentSelection.includes(optIndex)) {
        nextAnswer = currentSelection.filter((idx) => idx !== optIndex);
      } else {
        nextAnswer = [...currentSelection, optIndex];
      }
    } else {
      nextAnswer = answers[qId] === optIndex ? undefined : optIndex;
    }

    setAnswers({ ...answers, [qId]: nextAnswer });
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptID}/answer`,
        {
          questionId: qId,
          userAnswer: nextAnswer,
          markedForReview: marked[qId],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error('Error in saving answer of questions : ', error);
    }
  };

  const onHandleNATChange = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
  };

  const onHandleNATBlur = async (qId) => {
    await saveTimeSpent(qId);
    const value = answers[qId];
    if (value === undefined) return;

    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptID}/answer`,
        {
          questionId: qId,
          userAnswer: value,
          markedForReview: marked[qId],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error('Error in saving NAT answer: ', error);
    }
  };

  const onHandleMarkForReview = async (qId) => {
    await saveTimeSpent(qId);
    const newMarkedState = !marked[qId];
    setMarked({ ...marked, [qId]: newMarkedState });
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptID}/answer`,
        {
          questionId: qId,
          markedForReview: newMarkedState,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error('Error in saving mark for review : ', error);
    }
  };

  const onHandleNavigate = async (index) => {
    const currentQId = questions[current]._id;

    if (questions[current]?.questionType?.toUpperCase() === 'NAT') {
      await onHandleNATBlur(currentQId);
    }

    await saveTimeSpent(currentQId);

    setVisited({ ...visited, [questions[index]._id]: true });
    setCurrent(index);
  };

  const isAnswered = (qId) => {
    const ans = answers[qId];
    if (ans === undefined || ans === null || ans === '') return false;
    if (Array.isArray(ans)) return ans.length > 0;
    return true;
  };

  const getButtonColor = (qId, index) => {
    const answered = isAnswered(qId);
    const isDark = document.documentElement.classList.contains('dark');

    if (current === index)
      return 'ring-4 ring-blue-500/20 border-2 border-blue-600 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400';
    if (answered && marked[qId]) return 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none';
    if (answered) return 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-none';
    if (marked[qId]) return 'bg-amber-400 text-white shadow-lg shadow-amber-100 dark:shadow-none';
    if (visited[qId]) return 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border border-red-100 dark:border-red-800';
    return 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800';
  };

  const onHandleViolationClose = () => {
    setShowViolationModal(false);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
  };

  const onHandleSubmit = async () => {
    const currentQId = questions[current]._id;
    if (questions[current]?.questionType?.toUpperCase() === 'NAT') {
      await onHandleNATBlur(currentQId);
    }

    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptID}/submit`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      navigate(`/attempt/${attemptID}`);
    } catch (error) {
      console.error('Error in submitting : ', error);
    }
  };

  const currentQ = questions[current];

  if (isCheckingStatus) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
            Validating Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-950 font-inter overflow-hidden transition-colors duration-300">
      <ExamSidebar
        questions={questions}
        current={current}
        onNavigate={onHandleNavigate}
        getButtonColor={getButtonColor}
        onSubmit={onHandleSubmit}
      />

      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <ExamHeader
          current={current}
          total={questions.length}
          onSubmit={onHandleSubmit}
        />

        <QuestionDisplay
          current={current}
          currentQ={currentQ}
          answers={answers}
          onOptionClick={onHandleOptionClick}
          onNATChange={onHandleNATChange}
          onNATBlur={onHandleNATBlur}
        />

        <ExamControls
          current={current}
          total={questions.length}
          onNavigate={onHandleNavigate}
          onMarkForReview={() => onHandleMarkForReview(currentQ?._id)}
          onSubmit={onHandleSubmit}
          isMarked={marked[currentQ?._id]}
        />
      </main>

      <ViolationModal
        isOpen={showViolationModal}
        violationCount={violations}
        maxViolations={MAX_VIOLATIONS}
        onClose={onHandleViolationClose}
      />
    </div>
  );
};

export default Exam;

