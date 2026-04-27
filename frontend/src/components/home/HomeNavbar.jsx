import React from 'react';
import { GraduationCap } from 'lucide-react';

const HomeNavbar = ({ isScrolled, user, onNav, onScrollTo, menuOpen, setMenuOpen }) => {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNav('/')}>
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
            PrepKaro
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {['Features', 'How It Works', 'Exams'].map((item) => (
            <button
              key={item}
              onClick={() => onScrollTo(`#${item.toLowerCase().replace(/\s+/g, '-')}`)}
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors border-b-2 border-transparent hover:border-blue-200 py-1"
            >
              {item}
            </button>
          ))}

          <div className="flex items-center gap-4 ml-4">
            {user ? (
              <button
                onClick={() => onNav('/user')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-100 hover:bg-blue-100 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white">
                  {user.name?.[0] || 'U'}
                </div>
                <span className="font-semibold text-sm">Dashboard</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNav('/auth')}
                  className="text-slate-700 font-semibold px-4 hover:text-blue-600"
                >
                  Log In
                </button>
                <button
                  onClick={() => onNav('/auth')}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all"
                >
                  Start Free
                </button>
              </>
            )}
          </div>
        </div>

        <button className="md:hidden text-slate-800" onClick={() => setMenuOpen(!menuOpen)}>
          <div
            className={`w-6 h-0.5 bg-current transition-all ${
              menuOpen ? 'rotate-45 translate-y-1' : ''
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-current my-1 transition-all ${menuOpen ? 'opacity-0' : ''}`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-current transition-all ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          ></div>
        </button>
      </div>
    </nav>
  );
};

export default HomeNavbar;
