import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EvaluationQuestionCard from './EvaluationQuestionCard';

const QuestionsTab = ({ questions }) => {
  const [questionFilter, setQuestionFilter] = useState('All');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const onHandleToggleQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const filteredQuestions = questions.filter((q) => {
    if (questionFilter === 'All') return true;
    if (questionFilter === 'Correct') return q.status === 'correct';
    if (questionFilter === 'Incorrect') return q.status === 'incorrect';
    if (questionFilter === 'Skipped') return q.status === 'unattempted';
    return true;
  });

  return (
    <motion.div
      key="questions"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-900">Per-Question Trace</h3>
        <div className="flex p-1 bg-slate-50 rounded-2xl gap-1">
          {['All', 'Correct', 'Incorrect', 'Skipped'].map((filter) => (
            <button
              key={filter}
              onClick={() => setQuestionFilter(filter)}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                questionFilter === filter
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <EvaluationQuestionCard
            key={question._id}
            question={question}
            index={questions.indexOf(question)}
            isExpanded={expandedQuestion === question._id}
            onToggle={() => onHandleToggleQuestion(question._id)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default QuestionsTab;
