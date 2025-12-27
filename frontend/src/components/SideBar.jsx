import {Zap, X, Settings, LogOut, Activity, Plus, FileText, BarChart3, Calendar, Trophy} from "lucide-react"
import { useUser } from '../context/userContext'
import axios from "axios";
import { useNavigate } from "react-router";

function SideBar({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) {
    const navigate = useNavigate()
    const {user, loading, setUser} = useUser()
    if(loading) return null

    const sidebarItems = [
        { id: 'overview', icon: Activity, label: 'Overview' },
        { id: 'generate', icon: Plus, label: 'Generate Paper' },
        { id: 'history', icon: FileText, label: 'Test History' },
        { id: 'analytics', icon: BarChart3, label: 'Analytics' },
        { id: 'schedule', icon: Calendar, label: 'Schedule' },
        { id: 'achievements', icon: Trophy, label: 'Achievements' },
      ];

  const handleNavAction = (actionType)=>{
    setActiveTab(actionType)
    switch (actionType) {
        case 'overview':
          navigate("/");
          break;

        case 'generate':
          navigate("/tool");
          break;

        case 'history':
          navigate("/history");
          break;

        case 'analytics':
        console.log("Viewing analytics...");
        // navigate("/analytics");
        break;

        case 'reports':
        console.log("Downloading reports...");
        // Trigger file download logic here
        break;

        default:
        console.log("Unknown action");
    }
  }

    const handleLogout=async()=>{
        try {
            const token=localStorage.getItem("accessToken")
            const res= await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/logout`,
                {},
                {  
                    headers: {Authorization: `Bearer ${token}`},
                    withCredentials: true,
                }
            )
            console.log(res)
            setUser(null)
            localStorage.removeItem("accessToken")
        } catch (error) {
            console.log("Error in logging out : ", error)
        }
    }
  return (
    <>
    {
        loading 
        ? <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="flex flex-col h-full">
                {/* Logo Skeleton */}
                <div className="p-6 pb-7 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-lg" />
                    <div className="h-5 w-24 bg-gray-300 animate-pulse rounded-md" />
                    </div>
                    <div className="lg:hidden w-6 h-6 bg-gray-300 animate-pulse rounded-full" />
                </div>
                </div>

                {/* Navigation Skeleton */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-200 animate-pulse">
                    <div className="w-5 h-5 bg-gray-300 rounded" />
                    <div className="h-4 flex-1 bg-gray-300 rounded-md" />
                    </div>
                ))}
                </nav>

                {/* User Profile Skeleton */}
                <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-200 animate-pulse">
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                    <div className="h-3 bg-gray-300 rounded w-1/2" />
                    </div>
                </div>
                <div className="flex gap-2 mt-3">
                    <div className="flex-1 h-8 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="flex-1 h-8 bg-gray-200 rounded-lg animate-pulse" />
                </div>
                </div>
            </div>
        </aside>
        : <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 pb-7 border-b border-gray-200">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 p-1 rounded-lg flex items-center justify-center">
                        <img src="../../logo.png" alt="logo" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">PrepKaro</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                    <X className="w-6 h-6 text-gray-600" />
                </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {sidebarItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => handleNavAction(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                </button>
                ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-10 h-10 bg-blue-600 rounded-full overflow-hidden">
                    <img src={user?.avatar} alt="" className='h-full w-full object-cover'/>
                </div>
                <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                    <div className="text-xs text-gray-600">View Profile</div>
                </div>
                </div>
                <div className="flex gap-2 mt-3">
                <button className="flex-1 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 mx-auto" />
                </button>
                <button onClick={handleLogout}
                className="flex-1 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <LogOut className="w-5 h-5 mx-auto" />
                </button>
                </div>
            </div>
            </div>
        </aside>
    }
    </>
  )
}

export default SideBar