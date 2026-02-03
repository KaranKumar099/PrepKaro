import { useUserStore } from "../store/UseUserStore"; 
import { useNavigate } from "react-router";

const UserPage = () => {
  const { user, logout } = useUserStore()
  const navigate = useNavigate()
  const goToAuthPage = ()=>{
    navigate("/auth")
  }

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
            onClick={goToAuthPage}
            className="px-5 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8 max-w-lg w-full">
        {/* Header */}
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Welcome, <span className="text-emerald-600">{user.name}</span> 👋
        </h1>

        {/* User Info */}
        <div className="space-y-4 text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Name:</span>
            <span>{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Role:</span>
            <span>{user.role || "Student"}</span>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-emerald-100" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={logout}
            className="px-5 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-all"
          >
            Logout
          </button>
          <button
            onClick={() => alert('Profile editing coming soon!')}
            className="px-5 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium hover:bg-emerald-200 transition-all"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
