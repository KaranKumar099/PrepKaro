import React from "react";
import { ArrowLeft, User, Mail, Shield, Calendar, LogOut, Edit3, Camera, Bell, Settings } from "lucide-react";
import { useUserStore } from "../store/UseUserStore"; 
import { useNavigate } from "react-router";
import { getDate } from "../constants";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const UserProfile = () => {
  const { user, logout, updateProfile } = useUserStore()
  const joinedOn = user ? getDate(user.createdAt) : "";
  const navigate = useNavigate()
  const fileInputRef = React.useRef(null);

  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
    targetExam: user?.targetExam || "GATE",
  });
  const [loading, setLoading] = React.useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate upload or handle via API
    setLoading(true);
    const data = new FormData();
    data.append("avatar", file);
    
    try {
      // Assuming a backend endpoint exists to handle this
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/user/update-avatar`, data, {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      // Refresh user data if needed or update local store
      window.location.reload(); 
    } catch (error) {
      console.error("Avatar upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      // Map frontend state keys to backend expected keys
      const payload = {
        newName: formData.name,
        newEmail: formData.email,
        newUsername: formData.username,
        newTargetExam: formData.targetExam
      };
      
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/user/update-profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setIsEditing(false);
      // Assuming store has a way to refresh or manual update
      window.location.reload();
    } catch (error) {
      console.error("Profile update failed:", error);
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
            onClick={() => navigate("/auth")}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
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
          {/* Left Panel: Profile */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-12"
          >
            <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-[80px]"></div>
              
              <AnimatePresence mode="wait">
                {!isEditing ? (
                  <motion.div 
                    key="view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col md:flex-row items-center gap-10"
                  >
                    {/* Avatar Section */}
                    <div className="relative group">
                      <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-xl p-1.5 bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl shadow-blue-100 transition-transform group-hover:scale-105">
                        <img
                          src={user.avatar}
                          alt="profile"
                          className="w-full h-full rounded-lg object-cover border-4 border-white"
                        />
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                      />
                      <button 
                        onClick={onAvatarClick}
                        className="absolute -bottom-2 -right-2 p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-blue-600 shadow-xl transition-all scale-0 group-hover:scale-100"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Identity Info */}
                    <div className="flex-1 text-center md:text-left">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-3">
                        Preparing for {user?.targetExam || 'GATE'}
                      </span>
                      <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 truncate">
                        {user.name}
                      </h1>
                      <p className="text-slate-400 font-bold mb-8 flex items-center justify-center md:justify-start gap-2">
                        <Mail className="w-4 h-4" /> {user.email}
                      </p>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="px-6 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" /> Edit Profile
                        </button>
                        <button 
                          onClick={logout}
                          className="px-6 py-3.5 bg-white border border-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="edit"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSubmit}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                         <input 
                           name="name"
                           value={formData.name}
                           onChange={handleInputChange}
                           className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold focus:border-blue-200 outline-none transition-all"
                           placeholder="Enter your name"
                         />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                         <input 
                           name="email"
                           value={formData.email}
                           onChange={handleInputChange}
                           className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold focus:border-blue-200 outline-none transition-all"
                           placeholder="your@email.com"
                         />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                         <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                            <input 
                              name="username"
                              value={formData.username}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold focus:border-blue-200 outline-none transition-all"
                              placeholder="johndoe"
                            />
                         </div>
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Goal / Exam</label>
                         <select 
                           name="targetExam"
                           value={formData?.targetExam}
                           onChange={handleInputChange}
                           className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold focus:border-blue-200 outline-none transition-all appearance-none"
                         >
                           <option value="GATE">GATE (Engineering)</option>
                           <option value="JEE">JEE (Main/Advanced)</option>
                           <option value="UPSC">UPSC Civil Services</option>
                           <option value="CAT">CAT (Management)</option>
                           <option value="GRE">GRE / GMAT</option>
                         </select>
                       </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center gap-2"
                      >
                        {loading ? "Saving Changes..." : "Secure Save"}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-8 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                      >
                        Discard
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Detail Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-10 border-t border-slate-50">
                {[
                  { label: "Account Username", val: user.username, icon: User, color: "blue" },
                  { label: "Preparation Focus", val: user?.targetExam || "None Set", icon: Shield, color: "indigo" },
                  { label: "Academic Journey Since", val: joinedOn, icon: Calendar, color: "violet" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-5">
                    <div className={`p-4 bg-${item.color}-50 rounded-xl`}>
                      <item.icon className={`w-6 h-6 text-${item.color}-600`} />
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

