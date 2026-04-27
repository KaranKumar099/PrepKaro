import React from 'react';
import {
  Layout,
  GraduationCap,
  TrendingUp,
  Clock,
  Target,
  Activity,
  RefreshCw,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const ConfigurationPreview = ({
  selectedExam,
  selectedExamData,
  difficulty,
  duration,
  totalMarks,
  questionCount,
  onGenerate,
  isGenerating,
}) => {
  const configItems = [
    { label: 'Target Exam', value: selectedExamData?.name, icon: GraduationCap },
    { label: 'Complexity', value: difficulty.toUpperCase(), icon: TrendingUp },
    { label: 'Duration', value: `${duration} Minutes`, icon: Clock },
    { label: 'Total Scope', value: `${totalMarks} Marks`, icon: Target },
    { label: 'Question Density', value: `${questionCount} Qs`, icon: Activity },
  ];

  return (
    <div className="sticky top-24 space-y-6">
      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 blur-2xl"></div>
        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
          <Layout className="w-5 h-5 text-blue-600" /> Preview Configuration
        </h3>

        {selectedExam ? (
          <div className="space-y-6">
            <div className="grid gap-4">
              {configItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50">
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                    <item.icon className="w-3.5 h-3.5" /> {item.label}
                  </div>
                  <span className="font-bold text-slate-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className={`w-full py-5 rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                isGenerating
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
              }`}
            >
              {isGenerating ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-6 h-6" /> Generate Machine-Mock
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold text-sm">Select an exam to unlock generator</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigurationPreview;
