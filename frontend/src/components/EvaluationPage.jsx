import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, Download, Share2, ChevronDown, ChevronUp, AlertCircle, Trophy, Brain, ArrowRight, Home } from 'lucide-react';
import axios from "axios"
import { useNavigate, useParams } from 'react-router';
import { getDate, timeDifference } from '../constants';

export default function ExamEvaluation() {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [examData, setExamData] = useState({
    examName: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: '',
    timeSpent: '',
    avgTimeSpent: 0,
    totalMarks: 0,
    positiveMarks: 0,
    negativeMarks: 0,
    score: 0,
    totalQuestions: 0,
    correctQues: 0,
    incorrectQues: 0,
    unattemptedQues: 0,
    difficulty: 'medium'
  });
  const {attemptId} = useParams()
  console.log("attempt: ", attemptId)
  const navigate = useNavigate()

  // const subjectWisePerformance = [
  //   { subject: 'Physics', total: 100, scored: 85, correct: 21, incorrect: 3, unattempted: 1, avgTime: '2:15' },
  //   { subject: 'Chemistry', total: 100, scored: 80, correct: 20, incorrect: 4, unattempted: 1, avgTime: '2:05' },
  //   { subject: 'Mathematics', total: 100, scored: 80, correct: 21, incorrect: 3, unattempted: 1, avgTime: '2:30' }
  // ];

  useEffect(() => {
    if (!attemptId) return;
    setLoading(true)

    const getAttempt = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/attempt/${attemptId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        const attemptData = response.data.data
        console.log("Attempt data:", response.data);

        const {minutes, seconds} = timeDifference(attemptData.endTime, attemptData.startTime);
        const timeSpent = `${minutes} min ${seconds} sec`

        const date = getDate(attemptData.startTime)

        setQuestions(attemptData.answers);
        setExamData({
          ...examData,
          examName: attemptData.exam.title,
          duration: attemptData.exam.duration,
          difficulty: attemptData.exam.difficulty,
          totalMarks: attemptData.exam.totalMarks,
          startTime: attemptData.startTime,
          endTime: attemptData.endTime,
          timeSpent, date
        })
        setLoading(false);
        console.log("Questions: ", response.data.data.answers)
      } catch (error) {
        console.error("Error in getting attempt details:", error);
        setLoading(false);
      }
    };
    getAttempt();
  }, [attemptId]);

  useEffect(() => {
    if (!questions || questions.length === 0) return;

    const correctQues = [];
    const incorrectQues = [];
    const unattemptedQues = [];
    let positive=0;
    let negative=0;
    let time = 0;

    questions.forEach((ques) => {
      time += ques.timespent
      if (ques.status === "unattempted") unattemptedQues.push(ques);
      else if (ques.status === "correct"){
        correctQues.push(ques);
        positive += ques.question.score;
      }
      else{
        incorrectQues.push(ques);
        negative += ques.question.score/4;
      }
    });

    setExamData({
      ...examData,
      correctQues,
      incorrectQues,
      unattemptedQues,
      positiveMarks: positive,
      negativeMarks: negative,
      score: positive - negative,
      avgTimeSpent: time/questions.length
    })

    // console.log("Correct:", correctQues);
    // console.log("Incorrect:", incorrectQues);
    // console.log("Unattempted:", unattemptedQues);
    // console.log("positive:", positive);
    // console.log("negative:", negative);
    // console.log("score:", positive - negative);
  }, [questions]);
 

  const percentage = Math.round((examData.score / examData.totalMarks) * 100);
  const accuracy = Math.round((examData.correctQues.length / (examData.correctQues.length + examData.incorrectQues.length)) * 100);

  const toggleQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const getStatusColor = (status) => {
    if (status === 'correct') return 'bg-gray-900 text-white';
    if (status === 'incorrect') return 'bg-gray-600 text-white';
    return 'bg-gray-300 text-gray-700';
  };

  const getStatusIcon = (status) => {
    if (status === 'correct') return <CheckCircle className="w-5 h-5" />;
    if (status === 'incorrect') return <XCircle className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 p-1 rounded-lg flex items-center justify-center">
              <img src="../../logo.png" alt="" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PrepKaro</h1>
              <p className="text-xs text-gray-600">Test Evaluation</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={()=>navigate('/')}>
            <Home className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-gray-900" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Test Completed!</h2>
                  <p className="text-gray-300">Great job on completing the exam</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Your Score</div>
                  <div className="text-3xl font-bold">{examData.score}/{examData.totalMarks}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Percentage</div>
                  <div className="text-3xl font-bold">{percentage}%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Accuracy</div>
                  <div className="text-3xl font-bold">{accuracy}%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Time Spent</div>
                  <div className="text-3xl font-bold">{examData.timeSpent}</div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block text-8xl">🎉</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Correct Answers</span>
              <CheckCircle className="w-5 h-5 text-gray-900" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{examData.correctQues.length}</div>
            <div className="text-sm text-gray-600 mt-1">+{examData.positiveMarks} marks</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Incorrect Answers</span>
              <XCircle className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{examData.incorrectQues.length}</div>
            <div className="text-sm text-gray-600 mt-1">-{examData.negativeMarks} marks</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Unattempted</span>
              <AlertCircle className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{examData.unattemptedQues.length}</div>
            <div className="text-sm text-gray-600 mt-1">Missed questions</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Avg. Time/Question</span>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{examData.avgTimeSpent.toFixed(2)} sec</div>
            <div className="text-sm text-gray-600 mt-1">Per question</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="border-b border-gray-200 px-6">
            <div className="flex gap-6">
              {['overview', 'questions', 'analysis'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 border-b-2 transition-colors capitalize font-medium ${
                    activeTab === tab
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              {/* Exam Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Exam Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Exam Name</span>
                    <span className="font-semibold text-gray-900">{examData.examName}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Subject</span>
                    <span className="font-semibold text-gray-900">{examData.subject}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Date</span>
                    <span className="font-semibold text-gray-900">{examData.date}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold text-gray-900">{examData.duration} min</span>
                  </div>
                </div>
              </div>

              {/* Subject-wise Performance */}
              {/* <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Subject-wise Performance</h3>
                <div className="space-y-4">
                  {subjectWisePerformance.map((subject, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-900">{subject.subject}</h4>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">{subject.scored}/{subject.total}</div>
                          <div className="text-sm text-gray-600">{Math.round((subject.scored/subject.total)*100)}%</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                          className="bg-gray-900 h-2 rounded-full transition-all"
                          style={{ width: `${(subject.scored/subject.total)*100}%` }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Correct</span>
                          <div className="font-bold text-gray-900">{examData.correctQues.length}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Incorrect</span>
                          <div className="font-bold text-gray-900">{examData.incorrectQues.length}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Unattempted</span>
                          <div className="font-bold text-gray-900">{examData.unattemptedQues.length}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Avg Time</span>
                          <div className="font-bold text-gray-900">{subject.avgTime}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Actions */}
              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Report
                </button>
                <button className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share Results
                </button>
              </div>
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Question-wise Analysis</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">All</button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Correct</button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Incorrect</button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Unattempted</button>
                </div>
              </div>

              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question._id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleQuestion(question._id)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(question.status)}`}>
                          {getStatusIcon(question.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-gray-900">Question {index+1}</span>
                            <span className="text-sm text-gray-600">• {question.question.topic}</span>
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-1">{question.question.questionText}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className={`px-2 py-2 text-center w-20 rounded text-xs font-medium ${
                          question.question.difficultyLvl === 'Easy' ? 'bg-gray-200 text-gray-700' :
                          question.question.difficultyLvl === 'Medium' ? 'bg-gray-400 text-white' :
                          'bg-gray-900 text-white'
                        }`}>
                          {question.question.difficultyLvl}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Time Spent</div>
                          <div className="font-bold text-gray-900">{question.timespent} sec</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Marks</div>
                          <div className="font-bold text-gray-900">{question.status === 'correct' ? `+${question.question.score}` : question.status === 'incorrect' ? '-1' : '0'}</div>
                        </div>
                        {expandedQuestion === question._id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedQuestion === question._id && (
                      <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Question:</h4>
                          <p className="text-gray-700">{question.question}</p>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <h4 className="font-semibold text-gray-900">Options:</h4>
                          {question.question.options.map((option, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border-2 ${
                                index === question.question.answer
                                  ? 'border-gray-900 bg-gray-100'
                                  : index === question.userAnswer
                                  ? 'border-gray-600 bg-gray-100'
                                  : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700">{String.fromCharCode(65 + index)}. {option}</span>
                                {index === question.correctAnswer && (
                                  <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" />
                                    Correct Answer
                                  </span>
                                )}
                                {index === question.userAnswer && index !== question.correctAnswer && (
                                  <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                    <XCircle className="w-4 h-4" />
                                    Your Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                          {question.userAnswer === null && (
                            <div className="p-3 bg-gray-200 rounded-lg text-center text-gray-700 font-medium">
                              You did not attempt this question
                            </div>
                          )}
                        </div>

                        <div className="flex gap-4">
                          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                            View Explanation
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                            Report Issue
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Detailed Analysis</h3>
              
              {/* Time Analysis */}
              <div className="mb-8">
                <h4 className="font-bold text-gray-900 mb-4">Time Management</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Total Time</div>
                    <div className="text-2xl font-bold text-gray-900">{examData.duration} min</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Time Used</div>
                    <div className="text-2xl font-bold text-gray-900">{examData.timeSpent}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Time Saved</div>
                    <div className="text-2xl font-bold text-gray-900">15 min</div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-gray-900 text-white rounded-lg p-6">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  AI Recommendations
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-gray-900 text-sm font-bold">1</span>
                    </div>
                    <p className="text-gray-100">Focus more on Chemistry - Your accuracy in this subject can be improved by 15%</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-gray-900 text-sm font-bold">2</span>
                    </div>
                    <p className="text-gray-100">Reduce time on Mathematics - You're spending 30% more time than optimal</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-gray-900 text-sm font-bold">3</span>
                    </div>
                    <p className="text-gray-100">Practice more hard-difficulty questions to boost your score by 20 marks</p>
                  </div>
                </div>
                <button className="mt-6 px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                  Generate Practice Paper
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}