import React, { useRef, useState, useEffect } from "react";
import { useQuestions } from "../context/questionsContext";
import axios from "axios"
import { useNavigate } from "react-router";
import ExamTimer from "./ExamTimer";

const Exam = () => {
  const navigate = useNavigate()
  const {questions, attemptId} = useQuestions()

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [visited, setVisited] = useState({});

  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [current]);

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
    if (current === index) return "text-gray-400 border-4 border-orange-400"; // current
    if (answers[qId] !== undefined && marked[qId]) return "text-white bg-blue-500"; // answered + marked
    if (answers[qId] !== undefined) return "text-white bg-green-500"; // answered
    if (marked[qId]) return "text-white bg-purple-500"; // marked only
    if (visited[qId]) return "text-white bg-red-500"; // visited but not answered
    return "text-white bg-gray-300"; // not visited
  };

  const handleAutoSubmit=()=>{

  }

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
<div className="flex min-h-screen bg-gray-100 font-sans">
  {/* LEFT PANEL */}
  <div className="w-1/4 bg-white border-r p-4 flex flex-col justify-between h-screen">
    <div className="overflow-auto">
      <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
        Question Navigator
      </h2>

      <div className="grid grid-cols-5 gap-4">
        {questions.map((q, index) => (
          <button
            key={q._id}
            onClick={() => handleNavigate(index)}
            className={`w-12 h-12 rounded-md text-sm font-medium ${getButtonColor(
              q._id,
              index
            )}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>

    {/* LEGEND */}
    <div className="mt-4 overflow-auto">
      <h3 className="font-semibold mb-2">Legend:</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div> Not Visited
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div> Not Answered
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div> Answered
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div> Marked for Review
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div> Answered & Marked
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-4 border-orange-400 rounded"></div> Current
        </div>
      </div>
    </div>
  </div>

  {/* MAIN PANEL */}
  <div className="flex-1 px-6 py-4 flex flex-col h-screen overflow-hidden">
    {/* TIMER / PROGRESS BAR */}
    <div className="flex justify-between items-center mb-2">
      <div className="w-full bg-gray-300 h-2 rounded-full mr-4">
        <div className="bg-green-500 h-2 rounded-full w-[60%]"></div>
      </div>
      <ExamTimer durationInMinutes={180} onTimeUp={handleAutoSubmit}/>
      {/* <h3 className="text-xl">180:00</h3> */}
    </div>

    {/* QUESTION CARD */}
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between flex-grow overflow-auto">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Q{current + 1}. {currentQ.questionText}
        </h3>
        <img src={currentQ.picture} className="max-h-100 w-auto object-contain mb-4" />
        <div className="space-y-3">
          {
          currentQ.questionType === 'NAT'
          ? <div>
            <label>Answer : </label>
            <input type="number" name="answer" className="border-1 p-1 ml-4 rounded-sm" />
          </div>
          : currentQ.options.map((opt, idx) => (
            <label
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer ${
                answers[currentQ._id] === idx
                  ? "bg-green-50 border-green-400"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleOptionClick(currentQ._id, idx)}
            >
              <input
                type="radio"
                checked={answers[currentQ._id] === idx}
                onChange={() => handleOptionClick(currentQ._id, idx)}
                className="accent-green-600"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-6 flex justify-between">
        <button
          className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          onClick={() => current > 0 && handleNavigate(current - 1)}
        >
          Previous
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => handleMarkForReview(currentQ._id)}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          >
            {marked[currentQ._id] ? "Unmark" : "Mark for Review"}
          </button>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={() =>
              current < questions.length - 1
                ? handleNavigate(current + 1)
                : handleSubmit()
            }
          >
            {current < questions.length - 1 ? "Next" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default Exam;
