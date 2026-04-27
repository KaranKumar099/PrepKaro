import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';

import HomeNavbar from './home/HomeNavbar';
import HeroSection from './home/HeroSection';
import StatsSection from './home/StatsSection';
import FeaturesSection from './home/FeaturesSection';
import HowItWorksSection from './home/HowItWorksSection';
import ExamsSection from './home/ExamsSection';
import HomeFooter from './home/HomeFooter';

import { useUserStore } from '../store/UseUserStore';
import { exams, features, steps } from '../constants';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const [statsCounter, setStatsCounter] = useState({ students: 0, papers: 0, success: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const targetStats = { students: 50000, papers: 200000, success: 95 };
    const duration = 2000;
    const stepsCount = 60;
    const increment = {
      students: targetStats.students / stepsCount,
      papers: targetStats.papers / stepsCount,
      success: targetStats.success / stepsCount,
    };

    let currentStep = 0;
    const counterInterval = setInterval(() => {
      if (currentStep < stepsCount) {
        setStatsCounter({
          students: Math.floor(increment.students * currentStep),
          papers: Math.floor(increment.papers * currentStep),
          success: Math.floor(increment.success * currentStep),
        });
        currentStep++;
      } else {
        setStatsCounter(targetStats);
        clearInterval(counterInterval);
      }
    }, duration / stepsCount);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(counterInterval);
    };
  }, []);

  const onHandleNav = (path) => {
    navigate(path);
  };

  const onScrollTo = (id) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter text-slate-900">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-100/40 rounded-full blur-[100px]"></div>
      </div>

      <HomeNavbar
        isScrolled={isScrolled}
        user={user}
        onNav={onHandleNav}
        onScrollTo={onScrollTo}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 z-40 bg-white flex flex-col p-8 pt-24 md:hidden"
          >
            <div className="flex flex-col gap-6 text-xl">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onScrollTo('#features');
                }}
                className="text-left font-semibold"
              >
                Features
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onScrollTo('#how-it-works');
                }}
                className="text-left font-semibold"
              >
                How It Works
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onScrollTo('#exams');
                }}
                className="text-left font-semibold"
              >
                Exams
              </button>
              <hr />
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onHandleNav('/auth');
                }}
                className="text-blue-600 font-bold"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <HeroSection onHandleNav={onHandleNav} />

      <StatsSection statsCounter={statsCounter} />

      <FeaturesSection features={features} />

      <HowItWorksSection steps={steps} onHandleNav={onHandleNav} />

      <ExamsSection exams={exams} />

      <HomeFooter onNav={onHandleNav} />
    </div>
  );
};

export default Home;