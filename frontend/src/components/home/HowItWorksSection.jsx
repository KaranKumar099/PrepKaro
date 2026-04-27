import React from 'react';
import { ShieldCheck } from 'lucide-react';

const HowItWorksSection = ({ steps, onHandleNav }) => {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 bg-slate-900 text-white rounded-2xl mx-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">
            The Process
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-6">How PrepKaro Elevates You</h3>
        </div>

        <div className="grid md:grid-cols-4 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-20 right-20 h-0.5 bg-slate-800 z-0"></div>
          {steps.map((s, i) => (
            <div key={i} className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-900/40">
                <s.icon className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-4">
                {i + 1}. {s.title}
              </h4>
              <p className="text-slate-400 font-dm-sans">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 bg-slate-800/50 rounded-3xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-lg font-medium">Join over 5,000 students starting today</p>
          </div>
          <button
            onClick={() => onHandleNav('/auth')}
            className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all"
          >
            Initialize My Prep
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
