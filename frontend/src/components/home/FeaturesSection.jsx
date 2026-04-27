import React from 'react';
import { motion } from 'framer-motion';

const FeaturesSection = ({ features }) => {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">
            Powerful Features
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-6">Built for Serious Aspirants</h3>
          <p className="text-lg text-slate-600">
            Our platform goes beyond simple questions. We provide a complete ecosystem for
            exam-readiness.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="group p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <f.icon className={`w-7 h-7 text-blue-600`} />
              </div>
              <h4 className="text-xl font-bold mb-4">{f.title}</h4>
              <p className="text-slate-600 leading-relaxed font-dm-sans opacity-80">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
