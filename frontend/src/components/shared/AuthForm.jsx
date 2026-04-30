import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AtSign, KeyRound, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useUserStore } from '../../store/UseUserStore';

const AuthForm = ({ isLogin, setIsLogin }) => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  
  // Views: 'auth' (login/register), 'forgot' (email request), 'reset' (otp + new pass)
  const [view, setView] = useState('auth');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    otp: '',
    newPassword: '',
  });

  const onHandleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (view === 'auth') {
        const submitData = isLogin
          ? { email: formData.email, password: formData.password }
          : formData;

        const endpoint = `${import.meta.env.VITE_BACKEND_URL}/user/${isLogin ? 'login' : 'register'}`;
        const response = await axios.post(endpoint, submitData);

        const { accessToken, user } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        setUser(user);
        navigate('/');
      } else if (view === 'forgot') {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/forgot-password`, { email: formData.email });
        setSuccess('Reset code sent! Check your email (and console for demo).');
        setView('reset');
      } else if (view === 'reset') {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/reset-password`, {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        });
        setSuccess('Password updated successfully! You can now sign in.');
        setView('auth');
        setIsLogin(true);
      }
    } catch (err) {
      console.error('Error in authorization:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (loginMode) => {
    setIsLogin(loginMode);
    setError('');
    setSuccess('');
    setView('auth');
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          {view === 'forgot' ? 'Reset Password' : 
           view === 'reset' ? 'Enter OTP' :
           isLogin ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {view === 'forgot' ? 'Enter your email to receive a reset code.' :
           view === 'reset' ? 'We sent a 6-digit code to your email.' :
           isLogin ? 'Please enter your details to sign in.' : 'Enter your credentials to start your journey.'}
        </p>
      </div>

      {view === 'auth' && (
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-8">
          <button
            type="button"
            onClick={() => toggleMode(true)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              isLogin ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => toggleMode(false)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              !isLogin ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Sign Up
          </button>
        </div>
      )}

      <form onSubmit={onHandleSubmit} className="space-y-4">
        <AnimatePresence mode="wait">
          {view === 'auth' && !isLogin && (
            <motion.div
              key="register-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    onChange={onHandleChange}
                    value={formData.name}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium dark:text-white"
                    required={!isLogin && view === 'auth'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Username</label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                  <input
                    type="text"
                    name="username"
                    onChange={onHandleChange}
                    value={formData.username}
                    placeholder="Choose a unique username"
                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium dark:text-white"
                    required={!isLogin && view === 'auth'}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {view === 'auth' && (
            <motion.div key="auth-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                  {isLogin ? 'Email or Username' : 'Email Address'}
                </label>
                <div className="relative">
                  {isLogin ? <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" /> : <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />}
                  <input
                    type={isLogin ? 'text' : 'email'}
                    name="email"
                    onChange={onHandleChange}
                    value={formData.email}
                    placeholder={isLogin ? 'Enter email or username' : 'name@company.com'}
                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => { setView('forgot'); setError(''); setSuccess(''); }}
                      className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                  <input
                    type="password"
                    name="password"
                    onChange={onHandleChange}
                    value={formData.password}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium dark:text-white"
                    required={view === 'auth'}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {view === 'forgot' && (
            <motion.div key="forgot-fields" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    onChange={onHandleChange}
                    value={formData.email}
                    placeholder="Enter your registered email"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setView('auth')}
                className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors ml-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Login
              </button>
            </motion.div>
          )}

          {view === 'reset' && (
            <motion.div key="reset-fields" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">6-Digit Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    name="otp"
                    maxLength={6}
                    onChange={onHandleChange}
                    value={formData.otp}
                    placeholder="Enter 6-digit OTP"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium tracking-[0.5em] text-center"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="password"
                    name="newPassword"
                    onChange={onHandleChange}
                    value={formData.newPassword}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setView('forgot')}
                className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors ml-1"
              >
                <ChevronLeft className="w-4 h-4" /> Use different email
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-2xl flex items-center justify-center gap-3 text-red-600 text-sm"
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-red-100">
                <span className="text-xs">!</span>
              </div>
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-2xl flex items-center justify-center gap-3 text-emerald-600 text-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={loading}
          className="group w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 dark:shadow-blue-900/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {view === 'forgot' ? 'Send Reset Code' : view === 'reset' ? 'Reset Password' : isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {view === 'auth' && (
        <div className="mt-8 text-center text-slate-500 font-medium">
          <p>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => toggleMode(!isLogin)}
              className="text-blue-600 font-bold hover:underline underline-offset-4"
            >
              {isLogin ? 'Create for free' : 'Sign in here'}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthForm;

