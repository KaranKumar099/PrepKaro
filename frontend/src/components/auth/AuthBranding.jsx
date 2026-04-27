import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import heroImg from '../../assets/hero.png';

const AuthBranding = ({ onNavigateHome }) => {
  return (
    <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-between">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
            <GraduationCap className="text-blue-600 w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">PrepKaro</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg mb-12"
        >
          <img src={heroImg} alt="Hero illustration" className="w-full h-auto drop-shadow-2xl" />
        </motion.div>

        <div className="text-center text-white max-w-md">
          <h2 className="text-3xl font-bold mb-4">Master Your Future</h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Join 50,000+ students already practicing with our AI-powered exam generation engine.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthBranding;
