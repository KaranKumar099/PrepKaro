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
  { name: "Computer Science and Information Technology", code: "CS" },
  { name: "Production and Industrial Engineering", code: "PI" },
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

const featuredExams = [
  { id: "jee-main", name: "JEE Mains", icon: "🎯" },
  { id: "jee-advanced", name: "JEE Advanced", icon: "🚀" },
  { id: "neet", name: "NEET", icon: "⚕️" },
  { id: "ssc", name: "SSC CGL", icon: "📚" },
  { id: "upsc", name: "UPSC Prelims", icon: "🏛️" },
  { id: "gate-CS-1", name: "GATE CSE", icon: "💻" },
];

export {gate_exams, ssc_exams, allExams, featuredExams, examDetails}