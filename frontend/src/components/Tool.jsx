import React, { useState } from "react";
import { Download, Clock, Target, CheckCircle, Sparkles, TrendingUp, RefreshCw} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useQuestions } from "../context/questionsContext.jsx";
import axios from "axios"

export default function Tool() {
  const [selectedExam, setSelectedExam] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [duration, setDuration] = useState(180);
  const [totalMarks, setTotalMarks] = useState(300);
  const [questionCount, setQuestionCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState(null);

  const gate_exams = [
    { name: "Aerospace Engineering", code: "AE" },
    { name: "Instrumentation Engineering", code: "IN" },
    { name: "Agricultural Engineering", code: "AG" },
    { name: "Mathematics", code: "MA" },
    { name: "Architecture and Planning", code: "AR" },
    { name: "Mechanical Engineering", code: "ME" },
    { name: "Biomedical Engineering", code: "BM" },
    { name: "Mining Engineering", code: "MN" },
    { name: "Biotechnology", code: "BT" },
    { name: "Metallurgical Engineering", code: "MT" },
    { name: "Civil Engineering", code: "CE-1" },
    { name: "Naval Architecture and Marine Engineering", code: "NM" },
    { name: "Civil Engineering", code: "CE-2" },
    { name: "Petroleum Engineering", code: "PE" },
    { name: "Chemical Engineering", code: "CH" },
    { name: "Physics", code: "PH" },
    { name: "Computer Science and Information Technology", code: "CS-1" },
    { name: "Production and Industrial Engineering", code: "PI" },
    { name: "Computer Science and Information Technology", code: "CS-2" },
    { name: "Statistics", code: "ST" },
    { name: "Chemistry", code: "CY" },
    { name: "Textile Engineering and Fibre Science", code: "TF" },
    { name: "Data Science and Artificial Intelligence", code: "DA" },
    { name: "Engineering Sciences", code: "XE" },
    { name: "Electronics and Communication Engineering", code: "EC" },
    { name: "Electrical Engineering", code: "EE" },
    { name: "Environmental Science & Engineering", code: "ES" },
    { name: "Ecology and Evolution", code: "EY" },
    { name: "Geomatics Engineering", code: "GE" },
    { name: "Geology and Geophysics - Geology", code: "GG-1" },
    { name: "Geology and Geophysics - Geophysics", code: "GG-2" },
    { name: "Humanities & Social Sciences - Economics", code: "XH-C1" },
    { name: "Humanities & Social Sciences - English", code: "XH-C2" },
    { name: "Humanities & Social Sciences - Linguistics", code: "XH-C3" },
    { name: "Humanities & Social Sciences - Philosophy", code: "XH-C4" },
    { name: "Humanities & Social Sciences - Psychology", code: "XH-C5" },
    { name: "Humanities & Social Sciences - Sociology", code: "XH-C6" },
    { name: "Life Sciences", code: "XL" }
  ];

  const ssc_exams = [
    { name: "Combined Graduate Level", code: "CGL" },
    { name: "Combined Higher Secondary Level", code: "CHSL" },
    { name: "Multitasking", code: "MT" },
    { name: "Stenographers", code: "Steno" },
    { name: "Central Police Organization", code: "CPO" },
    { name: "Junior Engineer", code: "JE" }
  ];

  const examDetails = {
    "jee-main": { duration: 180, totalMarks: 300, questionCount: 75 },
    "jee-advanced": { duration: 180, totalMarks: 372, questionCount: 54 },
    "neet": { duration: 200, totalMarks: 720, questionCount: 180 },
    "upsc": { duration: 120, totalMarks: 200, questionCount: 100 },
    "gate": { duration: 180, totalMarks: 100, questionCount: 65 },
    "ssc": { duration: 60, totalMarks: 200, questionCount: 100 },
    default: { duration: 180, totalMarks: 300, questionCount: 75 },
  };

  const allExams = [
    { id: "jee-main", name: "JEE Main", ...examDetails["jee-main"] },
    { id: "jee-advanced", name: "JEE Advanced", ...examDetails["jee-advanced"] },
    { id: "neet", name: "NEET", ...examDetails["neet"] },
    { id: "upsc", name: "UPSC Prelims", ...examDetails["upsc"] },

    // GATE Exams
    ...gate_exams.map(exam => ({
      id: `gate-${exam.code}`,
      name: `GATE ${exam.name}`,
      ...examDetails[`gate`]
    })),

    // SSC Exams
    ...ssc_exams.map(exam => ({
      id: `ssc-${exam.code}`,
      name: `SSC ${exam.name}`,
      ...examDetails[`ssc`]
    }))
  ];

  const exams = [
    { id: "jee-main", name: "JEE Mains", icon: "🎯" },
    { id: "jee-advanced", name: "JEE Advanced", icon: "🚀" },
    { id: "neet", name: "NEET", icon: "⚕️" },
    { id: "ssc", name: "SSC CGL", icon: "📚" },
    { id: "upsc", name: "UPSC Prelims", icon: "🏛️" },
    { id: "gate-CS-1", name: "GATE CSE", icon: "💻" },
  ];

  // const customSelectStyles = {
  //   control: (base, state) => ({
  //     ...base,
  //     borderColor: state.isFocused ? "#10b981" : "#d1d5db",
  //     padding: "0.15rem",
  //     boxShadow: state.isFocused ? "0 0 0 2px #a7f3d0" : "none",
  //     "&:hover": { borderColor: "#10b981" },
  //   }),
  //   menu: (base) => ({
  //     ...base,
  //     zIndex: 50,
  //     overflow: "hidden",
  //   }),
  //   option: (base, state) => ({
  //     ...base,
  //     backgroundColor: state.isSelected
  //       ? "#10b981"
  //       : state.isFocused
  //       ? "#d1fae5"
  //       : "white",
  //     color: state.isSelected ? "white" : "#1f2937",
  //     cursor: "pointer",
  //     padding: "10px 15px",
  //     transition: "all 0.2s ease",
  //     "&:active": {
  //       backgroundColor: "#059669",
  //     },
  //   }),
  //   menuList: (base) => ({
  //     ...base,
  //     maxHeight: "250px",
  //     "&::-webkit-scrollbar": {
  //       width: "6px",
  //     },
  //     "&::-webkit-scrollbar-thumb": {
  //       backgroundColor: "#10b981",
  //       borderRadius: "10px",
  //     },
  //   }),
  // };

  const handleExamSelect = (examId) => {
    setSelectedExam(examId);
    setGeneratedPaper(null);
    const details = allExams.find((exam)=>exam.id===examId);
    console.log("selected : ", details)
    setDuration(details.duration);
    setTotalMarks(details.totalMarks);
    setQuestionCount(details.questionCount)
  };

  const {setQuestions, setAttemptId} = useQuestions();
  const [examId, setExamId] = useState(null);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!selectedExam) return;

    setIsGenerating(true);
    const exam = allExams.find((e) => e.id === selectedExam);
    const examName = exam?.name
    console.log("Selected Exam:", examName);
    console.log("Selected Difficulty:", difficulty);
    try {
      const token= localStorage.getItem("accessToken")
      const res1 = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/tool`,
        {exam: examName, difficulty, questionCount},
        {  
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        }
      )
      const fetchedQuestions = res1.data.data
      console.log("fetchedQuestions : ", fetchedQuestions)
      console.log("duration : ", duration)
      console.log("totalMarks : ", totalMarks)

      const res2 = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/exam`,
        {title: examName, questions: fetchedQuestions, difficulty, duration, totalMarks},
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        }
      )
      console.log("Exam : ", res2)
      setQuestions(fetchedQuestions)
      setExamId(res2.data.data._id)
      setGeneratedPaper({
        examName: examName,
        difficulty,
        duration: Number(res2.data.data.duration),
        totalMarks: Number(res2.data.data.totalMarks),
        questionCount: res2.data.data.questions.length,
        dateGenerated: new Date().toLocaleString(),
      });
      setIsGenerating(false);
    } catch (err) {
      console.error(err)
    }
  };

  const [showAlert, setShowAlert] = useState(false)
  const handleDownload = () => alert("PDF download would start here!");
  const handleStartTest = () => setShowAlert(true);

  const handleProceed = async () => {
    setShowAlert(false);
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    try {
      const token = localStorage.getItem("accessToken")
      const res= await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attempt`,
        {examId},
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        }
      )
      console.log("Attempt : ", res)
      setAttemptId(res.data.data._id)
      navigate("/exam")
    } catch (error) {
      console.error("Error in creating Mock Exam : ", error)
    }
  }

  const selectedExamData = allExams.find((e) => e.id === selectedExam);

  return (
    <div className="min-h-screen bg-gray-50 max-w-7xl mx-auto px-6 py-12 mt-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Generate Your Exam Paper
        </h1>
        <p className="text-gray-600">
          Customize difficulty, duration, and create practice exam
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Exam Selection */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              Select Exam
            </h2>

            <select
              value={selectedExam}
              onChange={(e) => {
                const examId = e.target.value
                handleExamSelect(examId)
              }}
              className="w-full my-5 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
            >
              <option value="">-- Select an Exam --</option>
              {allExams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Some Popular Exams
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {exams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => handleExamSelect(exam.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedExam === exam.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-4xl mb-2">{exam.icon}</div>
                  <div className="font-bold text-gray-900">{exam.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Settings */}
          {selectedExam && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Difficulty & Duration
              </h2>

              <div className="space-y-6">
                {/* Difficulty Buttons */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {["easy", "medium", "hard"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          difficulty === level
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-bold text-gray-900 capitalize">
                          {level}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {level === "easy" && "60% Easy, 30% Medium, 10% Hard"}
                          {level === "medium" && "30% Easy, 50% Medium, 20% Hard"}
                          {level === "hard" && "20% Easy, 30% Medium, 50% Hard"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration & Marks */}
                {/* <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      disabled={isGenerating}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      min="30"
                      max="240"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Total Marks
                    </label>
                    <input
                      type="number"
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(e.target.value)}
                      disabled={isGenerating}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      min="50"
                      max="500"
                    />
                  </div>
                </div> */}
              </div>
            </div>
          )}
        </div>

        {/* Summary Panel */}
        <div className="space-y-6">
          {!generatedPaper && 
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Paper Summary
              </h2>

              {selectedExam ? (
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Exam</span>
                    <span className="font-semibold text-gray-900">
                      {selectedExamData?.name || "Custom Exam"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Difficulty</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold text-gray-900">
                      {duration} min
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Marks</span>
                    <span className="font-semibold text-gray-900">
                      {totalMarks}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Questions</span>
                    <span className="font-semibold text-gray-900">
                      {questionCount}
                    </span>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`w-full py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                      isGenerating
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Paper
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  📋 Select an exam to begin
                </div>
              )}
            </div>
          }

          {/* Generated Paper */}
          {generatedPaper && (
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6" />
                <h3 className="text-xl font-bold">Paper Generated!</h3>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-blue-100">Exam</span>
                  <span className="font-semibold">{generatedPaper.examName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Questions</span>
                  <span className="font-semibold">{questionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Total Marks</span>
                  <span className="font-semibold">{totalMarks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Duration</span>
                  <span className="font-semibold">{duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Generated</span>
                  <span className="font-semibold text-sm">
                    {generatedPaper.dateGenerated}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleStartTest}
                  className="w-full py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                >
                  <Clock className="w-5 h-5" />
                  Start Online Test
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAlert && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Start Mock Exam?
              </h2>
              <p className="text-gray-600 mb-6">
                Once started, the timer will begin and you won’t be able to pause the test.
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowAlert(false)}
                  className="px-5 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800 font-semibold transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleProceed}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-white font-semibold shadow-md transition"
                >
                  Proceed
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
