import React, { useRef, useState, useEffect } from "react";
import { useQuestions } from "../context/questionsContext";
import axios from "axios"
import { useNavigate } from "react-router";
import ExamTimer from "./ExamTimer";

export default function ExamApp() {
  const navigate = useNavigate()
  const {questions, attemptId} = useQuestions()

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

  const saveTimeSpent = async (qId) => {
    const now = Date.now();
    const timeSpentSeconds = Math.floor((now - startTimeRef.current) / 1000);
    startTimeRef.current = now; // Reset for next time

    if (timeSpentSeconds > 0) {
      try {
        const token = localStorage.getItem("accessToken");
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptId}/timespent`,
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
    setAnswers({ ...answers, [qId]: optIndex });
    const token = localStorage.getItem("accessToken")
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptId}/answer`,
        {
          questionId : qId,
          userAnswer : optIndex,
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

  const handleMarkForReview = async (qId) => {
    await saveTimeSpent(qId);
    setMarked({ ...marked, [qId]: !marked[qId] });
    const token = localStorage.getItem("accessToken")
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptId}/answer`,
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
    await saveTimeSpent(currentQId);

    setVisited({ ...visited, [questions[index]._id]: true });
    setCurrent(index);
  };

  const getButtonColor = (qId, index) => {
    if (current === index) return "bg-blue-500"; // current
    if (answers[qId] !== undefined && marked[qId]) return "text-white bg-blue-500"; // answered + marked
    if (answers[qId] !== undefined) return "text-blue-500 border-blue-500 bg-blue-200"; // answered
    if (marked[qId]) return "text-purple-500 bg-purple-200 border-purple-500"; // marked only
    if (visited[qId]) return "text-red-500 bg-red-200 border-red-500"; // visited but not answered
    return "bg-blue-50"; // not visited
  };

  const formatTime = () => {
    const m = Math.floor(time / 60).toString().padStart(2, "0");
    const s = (time % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmit =async ()=>{
    console.log("answers: ", answers)
    const token = localStorage.getItem("accessToken")
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptId}/submit`,
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
          withCredentials: true,
        }
      )
      console.log("Attempt submitted : ", response.data)
      if(document.fullscreenElement){
        document.exitFullscreen()
      }
      navigate(`/attempt/${attemptId}`)
    } catch (error) {
      console.error("Error in submitting : ", error)
    }
  }

  const currentQ = questions[current];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-white px-6 py-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold">GATE Mathematics</h2>

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
      <div className="mt-6 grid grid-cols-4 gap-6">
        
        {/* Question Card */}
        <div className="bg-white rounded-xl shadow border p-6 col-span-3">
          <div className="flex justify-between mb-2">
            <p className="text-sm font-medium">
              Question {current + 1} of {questions.length}
            </p>

            <button
              onClick={() => handleMarkForReview(currentQ._id)}
            >
              {marked[current] ? "🚩" : "⚑"}
            </button>
          </div>

          <h3 className="text-lg font-semibold">
            {questions[current].questionText}
          </h3>
          <img src={currentQ.picture} className="max-h-100 w-auto object-contain mb-4" />
          <div className="mt-4 space-y-3">
            {
            currentQ.questionType === 'NAT'
            ? <div>
              <label>Answer : </label>
              <input type="number" name="answer" className="border-1 p-1 ml-4 rounded-sm" />
            </div>
            : questions[current].options.map((option, idx) => (
              <label
                key={idx}
                className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 ${answers[currentQ._id] === idx
                  ? "bg-blue-100 border-blue-500"
                  : ""
              }`}
                onClick={() => handleOptionClick(currentQ._id, idx)}
              >
                <input
                  type="radio"
                  name="answer"
                  checked={answers[current] === option}
                  onChange={() => handleOptionClick(currentQ._id, idx)}
                />
                {option}
              </label>
            ))}
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

        {/* Sidebar */}
        <div className="bg-white rounded-xl shadow border p-6">
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
      </div>
    </div>
  );
}
