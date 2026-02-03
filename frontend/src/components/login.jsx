import React, { useState, useEffect } from 'react';
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useUserStore } from '../store/UseUserStore'; 

export default function Login() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [stars, setStars] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    // Generate random stars
    const newStars = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.5,
    }));
    setStars(newStars);
  }, []);

  const {setUser} = useUserStore()
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
      <div className="relative w-full lg:w-1/2 bg-black overflow-hidden">
        {/* Stars */}
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-12">
          <div>
            <h1 className="text-white text-4xl font-bold">PrepKaro</h1>
          </div>

          {/* Earth with Satellite */}
          <div className="flex justify-center items-center">
            <div className="relative">
              {/* Earth */}
              <div className="w-64 h-64 rounded-full flex items-center justify-center relative overflow-hidden">
                <img src='src/assets/earth.jpg'></img>
              </div>

              {/* Gravity equation */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded shadow-lg">
                <span className="text-sm font-mono">g = GM/r²</span>
              </div>

              {/* Satellite */}
              <div className="absolute -top-8 -right-16 transform rotate-45">
                <div className="relative">
                  {/* Satellite body */}
                  <div className="w-8 h-6 bg-yellow-500 rounded relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-600 rounded-full" />
                  </div>
                  {/* Solar panels */}
                  <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 w-5 h-8 bg-yellow-500 border-2 border-yellow-600"
                       style={{ 
                         backgroundImage: 'linear-gradient(90deg, transparent 45%, #000 45%, #000 55%, transparent 55%)',
                         backgroundSize: '100% 20%'
                       }}
                  />
                  <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 w-5 h-8 bg-yellow-500 border-2 border-yellow-600"
                       style={{ 
                         backgroundImage: 'linear-gradient(90deg, transparent 45%, #000 45%, #000 55%, transparent 55%)',
                         backgroundSize: '100% 20%'
                       }}
                  />
                  {/* Antenna */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-gray-400" />
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-yellow-500" />
                </div>
                {/* Velocity equation */}
                <div className="absolute -right-20 top-8 bg-white px-3 py-2 rounded shadow-lg whitespace-nowrap">
                  <span className="text-sm font-mono">v ≈ √(GM/r)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-white text-center">
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

          <div className="space-y-4">
            {!isLogin && <div>
              <input
                type="type"
                name="name"
                onChange={handleChange}
                value={formData.name}
                placeholder="Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>}

            <div>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
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
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              {isLogin ? 'Log in' : 'Sign up'}
            </button>
          </div>

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