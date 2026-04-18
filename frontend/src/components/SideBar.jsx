import { X, Settings, LogOut, Activity, Plus, FileText, BarChart3, Calendar, Trophy, User, GraduationCap, ChevronRight, LayoutDashboard, Download, DownloadIcon } from "lucide-react"
import { useUserStore } from "../store/UseUserStore"; 
import axios from "axios";
import { useNavigate } from "react-router";
import { useSidebarStore } from "../store/UseSideBarStore";
import { motion, AnimatePresence } from "framer-motion";

function SideBar() {
    const navigate = useNavigate();
    const { user, loading, setUser } = useUserStore();
    const { isSidebarOpen, activeTab, setActiveTab, toggleSidebar, closeSidebar } = useSidebarStore();

    if (loading && !user) return null;

    const sidebarItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'generate', icon: Plus, label: 'New Mock Test' },
        { id: 'history', icon: FileText, label: 'Test History' },
        { id: 'downloads', icon: DownloadIcon, label: 'Downloads' },
        { id: 'analytics', icon: BarChart3, label: 'Performance' },
        { id: 'schedule', icon: Calendar, label: 'Study Plan' },
        { id: 'achievements', icon: Trophy, label: 'Achievements' },
    ];

    const handleNavAction = (actionType) => {
        setActiveTab(actionType);
        switch (actionType) {
            case 'overview': navigate("/"); break;
            case 'generate': navigate("/tool"); break;
            case 'history': navigate("/history"); break;
            case 'downloads': navigate("/downloads"); break;
            default: console.log("Navigating to:", actionType);
        }
        if (window.innerWidth < 1024) closeSidebar();
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/logout`,
                {},
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );
            setUser(null);
            localStorage.removeItem("accessToken");
            navigate("/auth");
        } catch (error) {
            console.log("Error in logging out:", error);
        }
    };

    const Skeleton = () => (
        <aside className="fixed lg:static h-full w-72 bg-white border-r border-slate-100 flex flex-col p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                <div className="h-6 w-24 bg-slate-100 rounded-md"></div>
            </div>
            <div className="flex-1 space-y-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-12 bg-slate-50 rounded-2xl w-full"></div>
                ))}
            </div>
        </aside>
    );

    if (loading) return <Skeleton />;

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeSidebar}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
                <div className="flex flex-col h-full">
                    {/* Header/Logo */}
                    <div className="p-8 pb-10">
                        <div className="flex items-center justify-between">
                            <div 
                                className="flex items-center gap-3 cursor-pointer group" 
                                onClick={() => { navigate("/"); closeSidebar(); }}
                            >
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                                    <GraduationCap className="text-white w-6 h-6" />
                                </div>
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                                    PrepKaro
                                </span>
                            </div>
                            <button onClick={closeSidebar} className="lg:hidden p-2 hover:bg-slate-50 rounded-lg">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mb-4">Main Menu</p>
                        {sidebarItems.map((item) => {
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavAction(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative ${
                                        isActive 
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                    {isActive && (
                                        <motion.div 
                                            layoutId="active-pill" 
                                            className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full" 
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer / User Profile */}
                    <div className="p-4 mt-auto">
                        <div className="bg-slate-50 rounded-[32px] p-4 border border-slate-100/50">
                            <div 
                                className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white transition-all cursor-pointer group shadow-transparent hover:shadow-sm"
                                onClick={() => { navigate("/user"); closeSidebar(); }}
                            >
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold ring-2 ring-white shadow-sm overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        user?.name?.[0] || 'U'
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-900 text-sm truncate">{user?.name}</h4>
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Premium Student</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                            </div>

                            <div className="flex gap-2 mt-4 px-1">
                                <button className="flex-1 py-2.5 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                                    <Settings className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="flex-1 py-2.5 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-500 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default SideBar;
