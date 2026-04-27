import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Activity, Target, Brain, Zap } from 'lucide-react';

const AnalysisTab = ({ detailedAnalysis }) => {
  return (
    <motion.div
      key="analysis"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-12"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Chapter Proficiency Matrix</h3>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            Accuracy vs Speed
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {detailedAnalysis.chapters.map((chapter, i) => (
            <div
              key={i}
              className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 hover:bg-white hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-base font-black text-slate-800 mb-1">{chapter.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {chapter.total} Questions Sampled
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                    chapter.accuracy >= 80
                      ? 'bg-green-100 text-green-700'
                      : chapter.accuracy >= 50
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {chapter.accuracy >= 80 ? 'Mastery' : chapter.accuracy >= 50 ? 'Developing' : 'Critical Focus'}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Accuracy</span>
                    <span>{chapter.accuracy}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        chapter.accuracy >= 70 ? 'bg-green-500' : chapter.accuracy >= 40 ? 'bg-blue-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${chapter.accuracy}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs pt-2">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      Avg Speed:{' '}
                      <span className="font-black text-slate-800">{chapter.avgTime}s / question</span>
                    </span>
                  </div>
                  <div
                    className={`${
                      chapter.avgTime > 120 ? 'text-orange-600 font-bold' : 'text-green-600 font-bold'
                    }`}
                  >
                    {chapter.avgTime > 120 ? 'Slow' : 'Fast'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm h-full">
            <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
              <Activity className="w-5 h-5 text-indigo-600" /> Time Investment Logic
            </h4>
            <div className="space-y-6">
              <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <p className="text-sm font-medium text-slate-700 leading-relaxed mb-4">
                  <span className="font-black text-indigo-600">Observation:</span> You spent the most
                  time on{' '}
                  <span className="font-black text-slate-900">
                    {detailedAnalysis.chapters.sort((a, b) => b.time - a.time)[0]?.name || 'N/A'}
                  </span>
                  .
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      detailedAnalysis.chapters.sort((a, b) => b.time - a.time)[0]?.accuracy >= 70
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  ></div>
                  <span className="text-xs font-bold text-slate-500">
                    {detailedAnalysis.chapters.sort((a, b) => b.time - a.time)[0]?.accuracy >= 70
                      ? 'This investment was highly effective.'
                      : 'High time cost with low yield. Potential conceptual gap.'}
                  </span>
                </div>
              </div>

              <div>
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Error Pattern Identity
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50/50 rounded-xl border border-red-100">
                    <div className="text-xs font-black text-red-600 mb-1 uppercase tracking-wider">
                      Conceptual Errors
                    </div>
                    <p className="text-[11px] font-medium text-slate-600">
                      Frequent in High Difficulty items.
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                    <div className="text-xs font-black text-amber-600 mb-1 uppercase tracking-wider">
                      Time Mismanagement
                    </div>
                    <p className="text-[11px] font-medium text-slate-600">
                      Last 10Q accuracy dropped by 30%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[32px] p-8 text-white">
            <h4 className="text-lg font-black mb-6 flex items-center gap-3">
              <Target className="w-5 h-5 text-blue-400" /> Top Focus Items
            </h4>
            <ul className="space-y-4">
              {detailedAnalysis.focusAreas.map((area, i) => (
                <li key={i} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center font-black text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    {i + 1}
                  </div>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-all">
                    {area.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white rounded-[40px] p-8 lg:p-12 relative overflow-hidden shadow-2xl shadow-blue-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-2xl"></div>
        <h4 className="text-2xl font-black mb-8 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          Tactical Strategy Recommendations
        </h4>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {detailedAnalysis.recommendations.map((rec, i) => (
            <div
              key={i}
              className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-default"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Zap className="text-blue-200 w-5 h-5" />
              </div>
              <h5 className="text-lg font-black mb-2">{rec.title}</h5>
              <p className="text-blue-100 text-sm font-medium leading-relaxed">{rec.text}</p>
            </div>
          ))}
          <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/20 transition-all">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 font-black">
              ?
            </div>
            <h5 className="text-lg font-black mb-2">Strategy Comparison</h5>
            <p className="text-blue-100 text-sm font-medium leading-relaxed">
              Top performers spend 15s less on 1-mark NATs than your current avg.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisTab;
