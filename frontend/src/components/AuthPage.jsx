import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserStore } from '../store/UseUserStore';
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, GraduationCap, CheckCircle, AtSign } from 'lucide-react';
import heroImg from '../assets/hero.png';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const { setUser } = useUserStore();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a copy of the formData to avoid unwanted fields in either mode
      const submitData = isLogin 
        ? { email: formData.email, password: formData.password } // Assuming backend handles email/username in one field
        : formData;

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/${isLogin ? "login" : "register"}`,
        submitData
      );
      localStorage.setItem("accessToken", response.data.data.accessToken);
      setUser(response.data.data.user);
      navigate("/");
    } catch (err) {
      console.error("Error in authorization", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-inter">
      {/* Left Side - Visual & Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-between">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[20%] left-[-10%] w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
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

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
          <GraduationCap className="text-blue-600 w-8 h-8" />
          <span className="text-xl font-bold text-slate-800">PrepKaro</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-slate-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-slate-500">
              {isLogin 
                ? 'Please enter your details to sign in.' 
                : 'Enter your credentials to start your journey.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        onChange={handleChange}
                        value={formData.name || ""}
                        placeholder="Enter your full name"
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                        required={!isLogin}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        name="username"
                        onChange={handleChange}
                        value={formData.username || ""}
                        placeholder="Choose a unique username"
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                {isLogin ? 'Email or Username' : 'Email Address'}
              </label>
              <div className="relative">
                {isLogin ? (
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                ) : (
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                )}
                <input
                  type={isLogin ? "text" : "email"}
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder={isLogin ? "Enter email or username" : "name@company.com"}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                  required
                />
              </div>
            </div>


            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                {isLogin && (
                  <button type="button" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="group w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center text-slate-500 font-medium">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 font-bold hover:underline underline-offset-4"
                >
                  Create for free
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 font-bold hover:underline underline-offset-4"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

          <div className="mt-12 flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest justify-center">
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> Secure Encryption</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> Privacy Focused</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
