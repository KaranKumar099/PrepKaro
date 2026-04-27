import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AtSign } from 'lucide-react';
import { useUserStore } from '../../store/UseUserStore';

const AuthForm = ({ isLogin, setIsLogin }) => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const onHandleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const endpoint = `${import.meta.env.VITE_BACKEND_URL}/user/${isLogin ? 'login' : 'register'}`;
      const response = await axios.post(endpoint, submitData);

      const { accessToken, user } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      setUser(user);
      navigate('/');
    } catch (err) {
      console.error('Error in authorization:', err);
    }
  };

  return (
    <div className="w-full max-w-md">
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

      <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
            isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Log In
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
            !isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={onHandleSubmit} className="space-y-4">
        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    onChange={onHandleChange}
                    value={formData.name}
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
                    onChange={onHandleChange}
                    value={formData.username}
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
              type={isLogin ? 'text' : 'email'}
              name="email"
              onChange={onHandleChange}
              value={formData.email}
              placeholder={isLogin ? 'Enter email or username' : 'name@company.com'}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-bold text-slate-700">Password</label>
            {isLogin && (
              <button
                type="button"
                className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot Password?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="password"
              name="password"
              onChange={onHandleChange}
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
        <p>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-bold hover:underline underline-offset-4"
          >
            {isLogin ? 'Create for free' : 'Sign in here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
