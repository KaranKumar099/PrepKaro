import React from 'react'
import {Sparkles} from "lucide-react"

function Header2() {
  return (
      <nav className="text-white relative z-50 px-6 py-4 flex justify-between items-center backdrop-blur-sm bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">PrepKaro</span>
        </div>
        <div className="flex gap-6 items-center">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How it Works</a>
          <a href="#exams" className="hover:text-cyan-400 transition-colors">Exams</a>
          <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105">
            Get Started
          </button>
        </div>
      </nav>
  )
}

export default Header2