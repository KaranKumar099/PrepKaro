import React from "react";
import { ArrowLeft, User, Mail, Shield, Calendar, LogOut, Edit3, Camera, Bell, Settings } from "lucide-react";
import { useUserStore } from "../store/UseUserStore"; 
import { useNavigate } from "react-router";
import { getDate } from "../constants";
import { motion, AnimatePresence } from "framer-motion";

const UserProfile = () => {
  const { user, logout } = useUserStore()
  const joinedOn = user ? getDate(user.createdAt) : "";
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] shadow-2xl shadow-blue-100 p-12 text-center max-w-md w-full border border-slate-100"
        >
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Identity Required</h2>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            Please authenticate your session to access your personal dashboard and academic records.
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
          >
            Authenticate Now <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter text-slate-800 p-6 lg:p-12 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full -mr-64 -mt-64 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -ml-64 -mb-64 blur-3xl opacity-50"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate("/")}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-4">
             <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                <Bell className="w-5 h-5" />
             </button>
             <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                <Settings className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Panel: Profile */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-12"
          >
            <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-[80px]"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-10">
                {/* Avatar Section */}
                <div className="relative group">
                  <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-[48px] p-1.5 bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl shadow-blue-100">
                    <img
                      src={user.avatar}
                      alt="profile"
                      className="w-full h-full rounded-[42px] object-cover border-4 border-white"
                    />
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-blue-600 shadow-xl transition-all">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>

                {/* Identity Info */}
                <div className="flex-1 text-center md:text-left">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-3">
                    Verified {user.role || 'Student'}
                  </span>
                  <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 truncate">
                    {user.name}
                  </h1>
                  <p className="text-slate-400 font-bold mb-8 flex items-center justify-center md:justify-start gap-2">
                    <Mail className="w-4 h-4" /> {user.email}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <button className="px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center gap-2">
                      <Edit3 className="w-4 h-4" /> Edit Profile
                    </button>
                    <button 
                      onClick={logout}
                      className="px-6 py-3.5 bg-white border border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-10 border-t border-slate-50">
                {[
                  { label: "Account Username", val: user.username, icon: User, color: "blue" },
                  { label: "Membership Tier", val: user.role || "Elite Plan", icon: Shield, color: "indigo" },
                  { label: "Academic Journey Since", val: joinedOn, icon: Calendar, color: "violet" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-5">
                    <div className={`p-4 bg-${item.color}-50 rounded-2xl`}>
                      <item.icon className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
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

