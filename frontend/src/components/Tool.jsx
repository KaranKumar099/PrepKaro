import React, { useState, useEffect } from "react";
import { Download, Clock, Target, CheckCircle, Sparkles, TrendingUp, RefreshCw, Menu, Bell} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useQuestionStore } from "../store/UseQuestionStore"; 
import axios from "axios"
import { useSidebarStore } from "../store/UseSideBarStore";
import SideBar from "./SideBar";

export default function Tool() {
  const [selectedExam, setSelectedExam] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [duration, setDuration] = useState(180);
  const [totalMarks, setTotalMarks] = useState(300);
  const [questionCount, setQuestionCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState(null);

  const {openSidebar, closeSidebar, isSidebarOpen} = useSidebarStore();
  const setActiveTab = useSidebarStore((s) => s.setActiveTab);
  useEffect(() => {
    setActiveTab("generate");
  }, []);

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

  const handleExamSelect = (examId) => {
    setSelectedExam(examId);
    setGeneratedPaper(null);
    const details = allExams.find((exam)=>exam.id===examId);
    console.log("selected : ", details)
    setDuration(details.duration);
    setTotalMarks(details.totalMarks);
    setQuestionCount(details.questionCount)
  };

  const {setQuestions, setAttemptID} = useQuestionStore();
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

      const payloadSize = new Blob([JSON.stringify(fetchedQuestions)]).size;
      console.log('Payload size:', payloadSize, 'bytes');
      console.log('Payload size:', (payloadSize / 1024 / 1024).toFixed(2), 'MB');

      const testData = { questions: fetchedQuestions };
      const testRes = await axios.post(
          'http://localhost:8000/api/test-large',
          testData
      );
      console.log("Test result:", testRes.data);

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
      console.error("=== ERROR in res2 ===");
      console.error("Status:", err.response?.status);
      console.error("Status Text:", err.response?.statusText);
      console.error("Error data:", err.response?.data);
      console.error("Request URL:", err.config?.url);
      console.error("Request data size:", JSON.stringify(err.config?.data).length);
      setIsGenerating(false);
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
      setAttemptID(res.data.data._id)
      navigate("/exam")
    } catch (error) {
      console.error("Error in creating Mock Exam : ", error)
    }
  }

  const selectedExamData = allExams.find((e) => e.id === selectedExam);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <SideBar/>

      <div className="bg-gray-50 w-full">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button onClick={() => openSidebar()} className="lg:hidden">
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Generate Your Exam Paper</h1>
                <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">
                  Customize difficulty, duration and generate a practice exam
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-3 gap-6 m-6">
            {/* LEFT PANEL */}
            <div className="md:col-span-3 lg:col-span-2 space-y-6">

            {/* ───── Select Exam ───── */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" /> Select Exam
                </h2>

                <select
                value={selectedExam}
                onChange={(e) => handleExamSelect(e.target.value)}
                className="w-full mt-4 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-400"
                >
                <option value="">-- Select an Exam --</option>
                {allExams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                    {exam.name}
                    </option>
                ))}
                </select>

                <h3 className="text-lg font-semibold mt-6">
                Popular Exams
                </h3>

                <div className="flex md:grid md:grid-cols-3 gap-4 mt-3 overflow-x-auto pb-2 no-scrollbar">
                {exams.map((exam) => (
                    <button
                    key={exam.id}
                    onClick={() => handleExamSelect(exam.id)}
                    className={`min-w-[150px] p-4 rounded-xl text-left transition-all ${
                        selectedExam === exam.id
                        ? "bg-blue-50 border-2 border-blue-600"
                        : "border border-gray-200 hover:bg-gray-50"
                    }`}
                    >
                    <div className="text-3xl">{exam.icon}</div>
                    <p className="text-sm font-medium mt-1">{exam.name}</p>
                    </button>
                ))}
                </div>
            </div>

            {/* ───── Difficulty & Settings ───── */}
            {selectedExam && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" /> Difficulty
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    {["easy", "medium", "hard"].map((level) => (
                    <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                        difficulty === level
                            ? "bg-blue-50 border-blue-600"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                        <span className="font-semibold capitalize">{level}</span>
                        <p className="text-xs text-gray-500 mt-1">
                        {level === "easy" && "60% Easy, 30% Medium, 10% Hard"}
                        {level === "medium" && "30% Easy, 50% Medium, 20% Hard"}
                        {level === "hard" && "20% Easy, 30% Medium, 50% Hard"}
                        </p>
                    </button>
                    ))}
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

            {/* ───── Summary Panel ───── */}
            <div className="md:col-span-2 lg:col-span-1">
            {!generatedPaper ? (
                <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-24">
                <h2 className="text-lg font-bold">Paper Summary</h2>

                {selectedExam ? (
                    <div className="space-y-4 mt-4 text-sm">
                    {[
                        { label: "Exam", value: selectedExamData?.name },
                        { label: "Difficulty", value: difficulty },
                        { label: "Duration", value: `${duration} min` },
                        { label: "Total Marks", value: totalMarks },
                        { label: "Questions", value: questionCount },
                    ].map((item, index) => (
                        <div
                        key={index}
                        className="flex justify-between border-b pb-2"
                        >
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-semibold">{item.value}</span>
                        </div>
                    ))}

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className={`w-full py-3 rounded-xl mt-4 flex items-center justify-center gap-2 ${
                        isGenerating
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                    >
                        {isGenerating ? (
                        <>
                            <RefreshCw className="w-5 h-5 animate-spin" /> Generating...
                        </>
                        ) : (
                        <>
                            <Sparkles className="w-5 h-5" /> Generate Paper
                        </>
                        )}
                    </button>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-6">
                    📋 Select an exam to begin
                    </p>
                )}
                </div>
            ) : (
                <div className="bg-blue-600 text-white rounded-2xl p-6">
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">
                    Paper Generated Successfully!
                    </h3>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                    {[
                    { label: "Exam", value: generatedPaper.examName },
                    { label: "Questions", value: questionCount },
                    { label: "Marks", value: totalMarks },
                    { label: "Duration", value: `${duration} min` },
                    { label: "Generated", value: generatedPaper.dateGenerated },
                    ].map((i, idx) => (
                    <div key={idx} className="flex justify-between">
                        <span className="text-blue-200">{i.label}</span>
                        <span className="font-semibold">{i.value}</span>
                    </div>
                    ))}
                </div>

                <div className="mt-4 space-y-3">
                    <button
                    onClick={handleStartTest}
                    className="w-full py-3 bg-white text-blue-600 rounded-xl hover:bg-gray-100 flex items-center justify-center gap-2"
                    >
                    <Clock className="w-5 h-5" /> Start Online Test
                    </button>
                    <button
                    onClick={handleDownload}
                    className="w-full py-3 bg-blue-800 rounded-xl hover:bg-blue-900 flex items-center justify-center gap-2"
                    >
                    <Download className="w-5 h-5" /> Download PDF
                    </button>
                </div>
                </div>
            )}
            </div>
        </div>

        {/* RESPONSIVE MODAL FIX */}
        <AnimatePresence>
            {showAlert && (
            <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                <motion.div className="bg-white rounded-xl p-6 w-full max-w-sm">
                <h2 className="text-xl font-bold mb-2">Start Mock Exam?</h2>
                <p className="text-gray-600 text-sm mb-4">
                    Timer will begin instantly and cannot be paused.
                </p>
                <div className="flex gap-3">
                    <button
                    onClick={() => setShowAlert(false)}
                    className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                    Cancel
                    </button>
                    <button
                    onClick={handleProceed}
                    className="flex-1 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                    >
                    Proceed
                    </button>
                </div>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => closeSidebar()}
        ></div>
      )}
    </div>
  );
}
