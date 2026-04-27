import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

import ExamHeader from './exam/ExamHeader';
import ExamSidebar from './exam/ExamSidebar';
import QuestionDisplay from './exam/QuestionDisplay';
import ExamControls from './exam/ExamControls';
import ViolationModal from './ViolationModal';

import { useQuestionStore } from '../store/UseQuestionStore';

const Exam2 = () => {
  const navigate = useNavigate();
  const { questions, attemptID } = useQuestionStore();

  const [examName, setExamName] = useState('');
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
    const fetchAttemptDetails = async () => {
      if (!attemptID) {
        navigate('/');
        return;
      }
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptID}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const attemptData = res.data.data;

        if (attemptData.status === 'submitted') {
          navigate(`/attempt/${attemptID}`, { replace: true });
          return;
        }

        // Request fullscreen only if not submitted
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch((e) => console.error(e));
        }

        setExamName(attemptData.exam.title);

        // Load existing answers
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
        console.error('Error fetching attempt details:', error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    if (questions.length > 0) {
      fetchAttemptDetails();
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
      console.error('Error in saving answer : ', error);
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
      console.error('Error in saving answer of questions : ', error);
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
    if (current === index) return 'bg-blue-500 text-white';
    if (answered && marked[qId]) return 'text-white bg-blue-500';
    if (answered) return 'text-blue-500 border-blue-500 bg-blue-200';
    if (marked[qId]) return 'text-purple-500 bg-purple-200 border-purple-500';
    return 'bg-blue-50';
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
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
            Validating Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-inter overflow-hidden p-6 bg-gray-50">
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
          examName={examName}
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

export default Exam2;
