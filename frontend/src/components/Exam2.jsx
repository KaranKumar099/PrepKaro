import React, { useRef, useState, useEffect } from "react";
import { useQuestionStore } from "../store/UseQuestionStore"; 
import axios from "axios"
import { useNavigate } from "react-router";

export default function ExamApp() {
  const navigate = useNavigate()
  const {questions, attemptID} = useQuestionStore()

  const [examName, setExamName] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [visited, setVisited] = useState({});
  const [time, setTime] = useState(60 * 60); // 1 hour

  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const t = setInterval(() => setTime(prev => prev - 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(()=>{
    const fetchAttemptDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        const attemptData = res.data.data;
        setTime(attemptData.exam.duration * 60);
        setExamName(attemptData.exam.title);

        // Load existing answers
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
        console.error("Error fetching attempt details:", error);
      }
    };

    if (attemptID && questions.length > 0) {
      fetchAttemptDetails();
    }
  }, [attemptID, questions])

  const saveTimeSpent = async (qId) => {
    const now = Date.now();
    const timeSpentSeconds = Math.floor((now - startTimeRef.current) / 1000);
    startTimeRef.current = now; // Reset for next time

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
      const response = await axios.post(
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
      console.log("Answer updated : ", response.data)
    } catch (error) {
      console.error("Error in saving answer : ", error)
    }
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
    setMarked({ ...marked, [qId]: !marked[qId] });
    const token = localStorage.getItem("accessToken")
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptID}/answer`,
        {
          questionId : qId,
          markedForReview : marked[qId]
        },
        {
          headers: {Authorization: `Bearer ${token}`},
          withCredentials: true,
        }
      )
      console.log("Answer updated : ", response.data)
    } catch (error) {
      console.error("Error in saving answer of questions : ", error)
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
    if (current === index) return "bg-blue-500 text-white"; // current
    if (answered && marked[qId]) return "text-white bg-blue-500"; // answered + marked
    if (answered) return "text-blue-500 border-blue-500 bg-blue-200"; // answered
    if (marked[qId]) return "text-purple-500 bg-purple-200 border-purple-500"; // marked only
    return "bg-blue-50"; // not visited or skipped (now both same)
  };

  const formatTime = () => {
    const m = Math.floor(time / 60).toString().padStart(2, "0");
    const s = (time % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmit = async () => {
    const currentQId = questions[current]._id;
    
    // Save NAT answer if current question is NAT
    if (questions[current]?.questionType?.toUpperCase() === 'NAT') {
      await handleNATBlur(currentQId);
    }

    const token = localStorage.getItem("accessToken")
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptID}/submit`,
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
          withCredentials: true,
        }
      )
      if(document.fullscreenElement){
        document.exitFullscreen()
      }
      navigate(`/attempt/${attemptID}`)
    } catch (error) {
      console.error("Error in submitting : ", error)
    }
  }

  const currentQ = questions[current];

  return (
    <div className="p-6 bg-gray-50 h-screen overflow-hidden flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center bg-white px-6 py-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold">{examName}</h2>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 font-semibold">
            <span className="text-xl">⏱</span>
            <span>{formatTime()}</span>
          </div>

          <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          onClick={()=> handleSubmit()}>
            Submit Exam
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="mt-6 grid grid-cols-4 gap-6 flex-1 overflow-hidden">


        {/* Sidebar */}
        <div className="bg-white rounded-xl shadow border p-6 overflow-y-auto">

          <h3 className="font-semibold text-lg">Exam Progress</h3>

          <div className="mt-3 space-y-1 text-sm">
            <p>Answered: {Object.keys(answers).length}</p>
            <p>
              marked: {Object.values(marked).filter(v => v).length}
            </p>
            <p>
              Remaining: {questions.length - Object.keys(answers).length}
            </p>
          </div>

          <div className="grid grid-cols-5 gap-3 mt-4">
            {questions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleNavigate(i)}
                className={`w-10 h-10 rounded-lg border ${getButtonColor(q._id, i)}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        
        {/* Question Card */}
        <div className="bg-white rounded-xl shadow border p-6 col-span-3 overflow-y-auto">
          <div className="flex justify-between mb-2">
            <p className="text-sm font-medium">
              Question {current + 1} of {questions.length}
            </p>
            <div className="flex gap-4 text-sm text-gray-600 mb-3 justify-between">
              <span className="px-2 py-1 bg-blue-50 rounded">
                Type: {currentQ.questionType}
              </span>

              <span className="px-2 py-1 bg-green-50 rounded">
                Appeared in : {currentQ.exam.year || "—"}
              </span>
            </div>
          </div>

          <h3 className="text-lg font-semibold whitespace-pre-line">
            {questions[current].questionText}
          </h3>
          <img src={currentQ.picture} className="max-h-100 w-auto object-contain mb-4" />
          <div className="mt-4 space-y-3">
            {
            currentQ.questionType?.toUpperCase() === 'NAT'
            ? <div key={`nat-container-${currentQ?._id}`}>
              <label>Answer : </label>
              <input 
                type="number" 
                key={`nat-input-${currentQ?._id}`}
                name={`nat-${currentQ?._id}`} 
                className="border-1 p-1 ml-4 rounded-sm"
                value={answers[currentQ?._id] !== undefined ? answers[currentQ?._id] : ""}
                onChange={(e) => setAnswers({ ...answers, [currentQ?._id]: e.target.value })}
                onBlur={() => handleNATBlur(currentQ?._id)}
              />
            </div>
            : questions[current].options.map((option, idx) => {
              const isSelected = Array.isArray(answers[currentQ._id]) 
                ? answers[currentQ._id].includes(idx)
                : (answers[currentQ._id] !== undefined && parseInt(answers[currentQ._id]) === idx);

              return (
                <label
                  key={idx}
                  className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                    isSelected ? "bg-blue-100 border-blue-500" : ""
                  }`}
                  onClick={() => handleOptionClick(currentQ._id, idx)}
                >
                  <input
                    type={isSelected ? "checkbox" : "radio"}
                    checked={isSelected}
                    readOnly
                  />
                  {option}
                </label>
              );
            })}
          </div>

          <div className="flex justify-between mt-6">
            <button
              disabled={current === 0}
              onClick={() => setCurrent(current - 1)}
              className="px-4 py-2 rounded border disabled:opacity-50"
            >
              Previous
            </button>

            <button 
              onClick={() => handleMarkForReview(currentQ._id)}
              className={`px-4 py-2 rounded border transition-all ${
                marked[currentQ?._id] 
                ? "bg-purple-600 text-white border-purple-600" 
                : "border-purple-600 text-purple-600 hover:bg-purple-50"
              }`}
            >Flag</button>

            <button
              onClick={() => 
                current < questions.length - 1
                ? handleNavigate(current + 1)
                : handleSubmit()
              }
              className="px-4 py-2 rounded bg-blue-700 text-white disabled:opacity-50"
            >
              {current < questions.length - 1 ? "Next" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
