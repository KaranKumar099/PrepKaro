import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Shield,
  Calendar,
  Bell,
  Settings,
} from 'lucide-react';

import ProfileHeader from './profile/ProfileHeader';
import ProfileForm from './profile/ProfileForm';

import { useUserStore } from '../store/UseUserStore';
import { formatShortDate } from '../utils/dateUtils';

const UserProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user, logout } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.username || '',
    targetExam: user?.targetExam || 'GATE',
  });

  const onHandleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onAvatarClick = () => {
    fileInputRef.current.click();
  };

  const onHandleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const data = new FormData();
    data.append('avatar', file);

    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/user/update-avatar`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      window.location.reload();
    } catch (error) {
      console.error('Avatar upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const payload = {
        newName: formData.name,
        newEmail: formData.email,
        newUsername: formData.username,
        newTargetExam: formData.targetExam,
      };

      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/user/update-profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl shadow-blue-100 p-12 text-center max-w-md w-full border border-slate-100"
        >
          <div className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-8">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Identity Required</h2>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            Please authenticate your session to access your personal dashboard and academic records.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
          >
            Authenticate Now <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </motion.div>
      </div>
    );
  }

  const profileStats = [
    {
      label: 'Account Username',
      val: user.username,
      icon: User,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Preparation Focus',
      val: user?.targetExam || 'None Set',
      icon: Shield,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      label: 'Academic Journey Since',
      val: formatShortDate(user.createdAt),
      icon: Calendar,
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter text-slate-800 p-6 lg:p-12 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full -mr-64 -mt-64 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -ml-64 -mb-64 blur-3xl opacity-50"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/')}
            className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-4">
            <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-12"
          >
            <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-[80px]"></div>

              <AnimatePresence mode="wait">
                {!isEditing ? (
                  <ProfileHeader
                    user={user}
                    onEdit={() => setIsEditing(true)}
                    onLogout={logout}
                    onAvatarClick={onAvatarClick}
                  />
                ) : (
                  <ProfileForm
                    formData={formData}
                    onInputChange={onHandleInputChange}
                    onSubmit={onHandleSubmit}
                    onCancel={() => setIsEditing(false)}
                    loading={loading}
                  />
                )}
              </AnimatePresence>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={onHandleAvatarChange}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-10 border-t border-slate-50">
                {profileStats.map((item, i) => (
                  <div key={i} className="flex items-center gap-5">
                    <div className={`p-4 ${item.bgColor} rounded-xl`}>
                      <item.icon className={`w-6 h-6 ${item.textColor}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        {item.label}
                      </p>
                      <p className="text-base font-bold text-slate-900">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

