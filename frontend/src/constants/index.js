import {Plus, FileText, BarChart3, Download, Brain, Target, Zap, GraduationCap, Play, Star} from "lucide-react"

const gate_exams = [
  { name: "Computer Science and Information Technology", code: "CS" },
  { name: "Electronics and Communication Engineering", code: "EC" },
  { name: "Mechanical Engineering", code: "ME" },
  { name: "Chemical Engineering", code: "CH" },
  { name: "Civil Engineering", code: "CE" },
  { name: "Electrical Engineering", code: "EE" },
  { name: "Mathematics", code: "MA" },
  { name: "Physics", code: "PH" },
  { name: "Chemistry", code: "CY" },
  { name: "Data Science and Artificial Intelligence", code: "DA" },
  { name: "Statistics", code: "ST" },
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
    name: `Gate ${exam.name}`,
    ...examDetails[`gate`]
  })),

  // SSC Exams
  ...ssc_exams.map(exam => ({
    id: `ssc-${exam.code}`,
    name: `SSC ${exam.name}`,
    ...examDetails[`ssc`]
  }))
];

const featuredExams = [
  { id: "jee-main", name: "JEE Mains", icon: "🎯" },
  { id: "jee-advanced", name: "JEE Advanced", icon: "🚀" },
  { id: "neet", name: "NEET", icon: "⚕️" },
  { id: "ssc", name: "SSC CGL", icon: "📚" },
  { id: "upsc", name: "UPSC Prelims", icon: "🏛️" },
  { id: "gate-CS-1", name: "GATE CSE", icon: "💻" },
];


const exams = [
  { name: 'JEE Main', logo: '🎯', desc: 'Engineering Entrance' },
  { name: 'JEE Advanced', logo: '🚀', desc: 'IIT Admission' },
  { name: 'NEET', logo: '⚕️', desc: 'Medical Entrance' },
  { name: 'SSC', logo: '📊', desc: 'Staff Selection' },
  { name: 'UPSC', logo: '🏛️', desc: 'Civil Services' }
];

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Generation',
    description: 'Smart algorithms that understand exam weightage and difficulty levels.',
    color: 'blue'
  },
  {
    icon: Target,
    title: 'Real Exam Simulation',
    description: 'Experience actual exam pressure with our simulated testing environment.',
    color: 'indigo'
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Identify your weak points with topic-wise performance breakdown.',
    color: 'sky'
  },
  {
    icon: Download,
    title: 'Offline Ready',
    description: 'Generate and download unlimited PDF papers for practice anywhere.',
    color: 'blue'
  }
];

const steps = [
  { title: 'Choose Path', desc: 'Select your target exam', icon: GraduationCap },
  { title: 'AI Generate', desc: 'Custom paper in seconds', icon: Zap },
  { title: 'Practice', desc: 'Simulated environment', icon: Play },
  { title: 'Master', desc: 'Analyze & Improve', icon: Star }
];

const quickActions = [
  { icon: Plus, label: 'Generate New Paper', color: 'bg-blue-600', action: 'generate' },
  { icon: FileText, label: 'My Test History', color: 'bg-gray-600', action: 'history' },
  { icon: BarChart3, label: 'View Analytics', color: 'bg-gray-600', action: 'analytics' },
  { icon: Download, label: 'Download Reports', color: 'bg-gray-600', action: 'reports' },
];

const timeDifference = (endTimeString, startTimeString)=>{
  const endTime = new Date(endTimeString);
  const startTime = new Date(startTimeString);
  const diffMs = endTime - startTime;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
  const seconds = Math.floor(diffMs / 1000) % 60;
  return { hours, minutes, seconds};
}

const getDate = (startTimeString)=>{
  const dateObj = new Date(startTimeString);
  const dayNumber = String(dateObj.getUTCDate()).padStart(2, "0");
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const year = dateObj.getUTCFullYear();
  const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
  const date = `${dayNumber}-${month}-${year}, ${weekday}`
  return date
}

export {gate_exams, ssc_exams, allExams, featuredExams, examDetails, quickActions, timeDifference, getDate, exams, features, steps}