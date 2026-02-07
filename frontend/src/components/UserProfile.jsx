import { ArrowBigLeft } from "lucide-react";
import { useUserStore } from "../store/UseUserStore"; 
import { useNavigate } from "react-router";
import { getDate } from "../constants";

const UserProfile = () => {
    const { user, logout } = useUserStore()
  const joinedOn = getDate(user.createdAt)
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-md w-full border border-emerald-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            You’re not logged in
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access your user dashboard.
          </p>
          <button
            onClick={()=>navigate("/auth")}
            className="px-5 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
        <button className="absolute top-8 left-8 cursor-pointer p-2 rounded-full hover:bg-gray-300" onClick={()=>navigate("/")}><ArrowBigLeft /></button>
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[380px]">
        
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src={user.avatar}
            alt="profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
          />
          <h2 className="text-xl font-semibold mt-4">{user.username}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        {/* Divider */}
        <div className="border-t my-6"></div>

        {/* User Info */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Full Name</span>
            <span>{user.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Role</span>
            <span>{user?.role || "Student"}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Joined</span>
            <span>{joinedOn}</span>
          </div>
        </div>

        {/* Button */}
        <button className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
