import React, { useRef, useState, useEffect } from "react";
import { useQuestionStore } from "../store/UseQuestionStore"; 
import axios from "axios"
import { useNavigate } from "react-router";
import ExamTimer from "./ExamTimer";
import { ChevronLeft, ChevronRight, Bookmark, CheckCircle2, AlertCircle, Clock, Flag, Layout, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Exam = () => {
  const navigate = useNavigate()
  const { questions, attemptID } = useQuestionStore()

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [visited, setVisited] = useState({});

  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [current]);

  useEffect(() => {
    const fetchAttemptData = async () => {
      if (!attemptID) return;
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptID}`,
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        const attemptData = response.data.data;
        
        const existingAnswers = {};
        const existingMarked = {};
        attemptData.answers.forEach(ans => {
          const qId = ans.question._id || ans.question;
          const q = questions.find(question => question._id === qId);
          
          if (q?.questionType?.toUpperCase() === 'MSQ') {
            existingAnswers[qId] = ans.userAnswer ? ans.userAnswer.split(',').map(Number) : [];
          } else if (q?.questionType?.toUpperCase() === 'NAT' ) {
            existingAnswers[qId] = ans.userAnswer;
          } else {
            existingAnswers[qId] = ans.userAnswer ? parseInt(ans.userAnswer) : undefined;
          }
          
          existingMarked[qId] = ans.markedForReview;
        });
        
        setAnswers(existingAnswers);
        setMarked(existingMarked);
      } catch (error) {
        console.error("Error fetching attempt data:", error);
      }
    };

    if (questions.length > 0) {
      fetchAttemptData();
    }
  }, [attemptID, questions]);

  const saveTimeSpent = async (qId) => {
    const now = Date.now();
    const timeSpentSeconds = Math.floor((now - startTimeRef.current) / 1000);
    startTimeRef.current = now;

    if (timeSpentSeconds > 0) {
      try {
        const token = localStorage.getItem("accessToken");
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptID}/timespent`,
          { questionId: qId, timeSpent: timeSpentSeconds },
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
      } catch (error) {
        console.error("Error saving time:", error);
      }
    }
  };

  const handleOptionClick = async (qId, optIndex) => {
    await saveTimeSpent(qId);
    
    const question = questions.find(q => q._id === qId);
    const isMSQ = question?.questionType?.toUpperCase() === 'MSQ';
    let nextAnswer;

    if (isMSQ) {
      const currentSelection = Array.isArray(answers[qId]) ? answers[qId] : [];
      if (currentSelection.includes(optIndex)) {
        nextAnswer = currentSelection.filter(idx => idx !== optIndex);
      } else {
        nextAnswer = [...currentSelection, optIndex];
      }
    } else {
      // Allow unselecting MCQ
      nextAnswer = answers[qId] === optIndex ? undefined : optIndex;
    }

    setAnswers({ ...answers, [qId]: nextAnswer });
    const token = localStorage.getItem("accessToken")
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptID}/answer`,
        {
          questionId : qId,
          userAnswer : nextAnswer,
          markedForReview : marked[qId]
        },
        {
          headers: {Authorization: `Bearer ${token}`},
          withCredentials: true,
        }
      )
    } catch (error) {
      console.error("Error in saving answer of questions : ", error)
    }
  };

  const handleNATChange = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
  };

  const handleNATBlur = async (qId) => {
    await saveTimeSpent(qId);
    const value = answers[qId];
    // Allow saving empty string to clear the answer, but skip if undefined
    if (value === undefined) return;

    const token = localStorage.getItem("accessToken");
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptID}/answer`,
        {
          questionId: qId,
          userAnswer: value,
          markedForReview: marked[qId]
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error in saving NAT answer: ", error);
    }
  };

  const handleMarkForReview = async (qId) => {
    await saveTimeSpent(qId);
    const newMarkedState = !marked[qId];
    setMarked({ ...marked, [qId]: newMarkedState });
    const token = localStorage.getItem("accessToken")
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptID}/answer`,
        {
          questionId : qId,
          markedForReview : newMarkedState
        },
        {
          headers: {Authorization: `Bearer ${token}`},
          withCredentials: true,
        }
      )
    } catch (error) {
      console.error("Error in saving mark for review : ", error)
    }
  };

  const handleNavigate = async (index) => {
    const currentQId = questions[current]._id;
    
    // Save NAT answer if current question is NAT
    if (questions[current]?.questionType?.toUpperCase() === 'NAT') {
      await handleNATBlur(currentQId);
    }
    
    await saveTimeSpent(currentQId);

    setVisited({ ...visited, [questions[index]._id]: true });
    setCurrent(index);
  };

  const isAnswered = (qId) => {
    const ans = answers[qId];
    if (ans === undefined || ans === null || ans === "") return false;
    if (Array.isArray(ans)) return ans.length > 0;
    return true;
  };

  const getButtonColor = (qId, index) => {
    const answered = isAnswered(qId);
    if (current === index) return "ring-4 ring-blue-500/20 border-2 border-blue-600 bg-white text-blue-600"; 
    if (answered && marked[qId]) return "bg-indigo-600 text-white shadow-lg shadow-indigo-100"; 
    if (answered) return "bg-emerald-500 text-white shadow-lg shadow-emerald-100";
    if (marked[qId]) return "bg-amber-400 text-white shadow-lg shadow-amber-100";
    if (visited[qId]) return "bg-red-50 text-red-500 border border-red-100";
    return "bg-slate-50 text-slate-400 border border-slate-100";
  };

  const handleSubmit = async () => {
    const currentQId = questions[current]._id;
    // Save NAT answer if current question is NAT before submitting
    if (questions[current]?.questionType?.toUpperCase() === 'NAT') {
      await handleNATBlur(currentQId);
    }

    const token = localStorage.getItem("accessToken")
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptID}/submit`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      )
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
      navigate(`/attempt/${attemptID}`)
    } catch (error) {
      console.error("Error in submitting : ", error)
    }
  }

  const currentQ = questions[current];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-inter overflow-hidden">
      {/* Sidebar Navigator */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 bg-white border-r border-slate-100 flex flex-col shadow-sm relative z-20"
      >
        <div className="p-6 border-b border-slate-50 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Layout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Navigator</h2>
            <p className="text-[10px] font-bold text-slate-400">Section A: General Ability</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="grid grid-cols-4 gap-3 mb-10">
            {questions.map((q, index) => (
              <button
                key={q._id}
                onClick={() => handleNavigate(index)}
                className={`h-11 rounded-xl text-xs font-black transition-all ${getButtonColor(q._id, index)}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-50">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Legend</h3>
            {[
              { label: "Answered", bg: "bg-emerald-500" },
              { label: "Marked", bg: "bg-amber-400" },
              { label: "Answered & Marked", bg: "bg-indigo-600" },
              { label: "Visited but skipped", bg: "bg-red-200" },
              { label: "Unvisited", bg: "bg-slate-100" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-md ${item.bg}`}></div>
                <span className="text-[11px] font-bold text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
           <button 
             onClick={handleSubmit}
             className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
           >
             <Send className="w-4 h-4" /> Final Submission
           </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between relative z-10 shadow-sm">
          <div className="flex items-center gap-6">
             <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Test Context</span>
                <span className="text-xs font-bold text-slate-700">Engineering Proficiency Exam</span>
             </div>
             <div className="h-8 w-px bg-slate-100"></div>
             <div className="flex items-center gap-2 text-slate-400">
                <Flag className="w-4 h-4" />
                <span className="text-xs font-bold">Question {current + 1} of {questions.length}</span>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 px-6 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl">
                <Clock className="w-5 h-5 text-blue-600" />
                <ExamTimer durationInMinutes={180} onTimeUp={handleSubmit} />
             </div>
          </div>
        </header>

        {/* Question Area */}
        <div className="flex-1 overflow-y-auto p-12 relative">
           <AnimatePresence mode="wait">
             <motion.div 
               key={current}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="max-w-4xl mx-auto space-y-12 pb-32"
             >
                <div className="space-y-6">
                   <div className="flex items-start gap-4">
                      <span className="w-10 h-10 bg-slate-900 border-4 border-slate-200 text-white rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">
                         {current + 1}
                      </span>
                      <h1 className="text-2xl font-bold text-slate-800 leading-relaxed pt-1">
                        {currentQ?.questionText}
                      </h1>
                   </div>
                   
                   {currentQ?.picture && (
                     <div className="p-4 bg-white border border-slate-100 rounded-[32px] inline-block shadow-sm">
                        <img src={currentQ?.picture} className="max-h-[400px] w-auto rounded-2xl object-contain" />
                     </div>
                   )}
                </div>

                <div className="grid gap-4">
                  {currentQ?.questionType?.toUpperCase() === 'NAT' ? (
                    <div key={`nat-container-${currentQ?._id}`} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Input Your Numerical Response</label>
                      <input 
                        type="number" 
                        id={`nat-input-${currentQ?._id}`}
                        name={`nat-${currentQ?._id}`}
                        placeholder="Enter value..."
                        value={answers[currentQ?._id] !== undefined ? answers[currentQ?._id] : ""}
                        onChange={(e) => handleNATChange(currentQ?._id, e.target.value)}
                        onBlur={() => handleNATBlur(currentQ?._id)}
                        className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 text-xl font-bold text-blue-600 focus:border-blue-200 focus:outline-none transition-all" 
                      />
                    </div>
                  ) : (
                    currentQ?.options?.map((opt, idx) => {
                      const isSelected = Array.isArray(answers[currentQ?._id]) 
                        ? answers[currentQ?._id].includes(idx)
                        : (answers[currentQ?._id] !== undefined && parseInt(answers[currentQ?._id]) === idx);

                      return (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(currentQ?._id, idx)}
                          className={`group flex items-center gap-4 p-5 rounded-[24px] border-2 transition-all text-left ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200"
                              : "bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50/50"
                          }`}
                        >
                          <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${
                            isSelected ? "bg-white text-blue-600" : "bg-slate-50 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600"
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-lg font-bold">{opt}</span>
                          {isSelected && (
                            <CheckCircle2 className="w-6 h-6 text-white ml-auto" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Floating Controls */}
        <div className="absolute bottom-10 left-12 right-12 z-10">
           <div className="max-w-4xl mx-auto bg-white/50 backdrop-blur-xl border border-white/50 p-4 rounded-[32px] shadow-2xl flex items-center justify-between">
              <button
                onClick={() => current > 0 && handleNavigate(current - 1)}
                disabled={current === 0}
                className="h-14 px-8 rounded-2xl font-black text-sm text-slate-600 bg-white border border-slate-100 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>

              <div className="flex gap-4">
                 <button
                   onClick={() => handleMarkForReview(currentQ?._id)}
                   className={`h-14 px-8 rounded-2xl font-black text-sm border-2 transition-all flex items-center gap-2 ${
                     marked[currentQ?._id] 
                       ? "bg-amber-500 border-amber-500 text-white" 
                       : "bg-white border-slate-100 text-slate-600 hover:border-amber-200"
                   }`}
                 >
                   <Bookmark className={`w-5 h-5 ${marked[currentQ?._id] ? "fill-white" : ""}`} />
                   {marked[currentQ?._id] ? "Review Marked" : "Mark for Review"}
                 </button>

                 <button
                   onClick={() => current < questions.length - 1 ? handleNavigate(current + 1) : handleSubmit()}
                   className="h-14 px-10 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-2"
                 >
                   {current < questions.length - 1 ? (
                     <>Next Question <ChevronRight className="w-5 h-5" /></>
                   ) : (
                     <>Final Submit <Send className="w-5 h-5" /></>
                   )}
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default Exam;

