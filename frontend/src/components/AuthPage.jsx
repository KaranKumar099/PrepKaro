import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { GraduationCap, CheckCircle } from 'lucide-react';

import AuthForm from './shared/AuthForm.jsx';
import AuthBranding from './auth/AuthBranding';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const onNavigateHome = () => navigate('/');

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-inter">
      <AuthBranding onNavigateHome={onNavigateHome} />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Mobile Logo */}
        <div
          className="absolute top-8 left-8 lg:hidden flex items-center gap-2 cursor-pointer"
          onClick={onNavigateHome}
        >
          <GraduationCap className="text-blue-600 w-8 h-8" />
          <span className="text-xl font-bold text-slate-800">PrepKaro</span>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <AuthForm isLogin={isLogin} setIsLogin={setIsLogin} />

          <div className="mt-12 flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest justify-center">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" /> Secure Encryption
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" /> Privacy Focused
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;

