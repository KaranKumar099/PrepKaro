import React, { useState } from 'react';
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useUser } from "../context/userContext";

export default function Login() {
    const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const {setUser} = useUser()
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(`${import.meta.env.VITE_BACKEND_URL}/user/${isLogin ? "login" : "register"}`)
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/${isLogin ? "login" : "register"}`,
        formData
      )
      localStorage.setItem("accessToken", response.data.data.accessToken)
      setUser(response.data.data.user)
      // console.log(response)
      navigate("/");
    } catch (err) {
      console.error("Error in authorization", err)
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Animated Background */}
      <div className="relative w-full lg:w-1/2 overflow-hidden">

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-12">
          <div>
            <h1 className="text-4xl font-bold">PrepKaro</h1>
          </div>

          <div className="flex justify-center items-center">
            <img src='src/assets/avatar6.jpg' className='h-100 w-100'></img>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold leading-tight">
              Practice Smarter, Score Higher.
            </h2>
            <h3 className="text-lg font-semibold leading-tight text-gray-400">
              Generate AI-driven exams and track your performance effortlessly.
            </h3>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {isLogin ? 'Log In' : 'Sign Up'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                  placeholder="Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            )}

            <div>
              <input
                type="text"
                name="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              {isLogin ? 'Log in' : 'Sign up'}
            </button>
          </form>


          <div className="mt-6 text-center text-sm">
            {isLogin ? (
              <>
                <button className="text-gray-700 underline hover:text-gray-900">
                  Reset password
                </button>
                <span className="mx-2 text-gray-500">|</span>
                <span className="text-gray-500">New user? </span>
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-gray-700 underline hover:text-gray-900"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-500">Already have an account? </span>
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-gray-700 underline hover:text-gray-900"
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}