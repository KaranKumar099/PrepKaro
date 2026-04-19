import { useState, useEffect } from 'react';
import { BarChart3, Target, ArrowRight, GraduationCap, Play, Star, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useUserStore } from '../store/UseUserStore'; 
import { motion, AnimatePresence } from "framer-motion";
import { exams, features, steps } from '../constants';
import heroImg from '../assets/hero.png';

export default function Home() {
  const [activeExam, setActiveExam] = useState(0);
  const [statsCounter, setStatsCounter] = useState({ students: 0, papers: 0, success: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    const interval = setInterval(() => {
      setActiveExam((prev) => (prev + 1) % exams.length);
    }, 4000);

    const targetStats = { students: 50000, papers: 200000, success: 95 };
    const duration = 2000;
    const stepsCount = 60;
    const increment = {
      students: targetStats.students / stepsCount,
      papers: targetStats.papers / stepsCount,
      success: targetStats.success / stepsCount
    };

    let currentStep = 0;
    const counterInterval = setInterval(() => {
      if (currentStep < stepsCount) {
        setStatsCounter({
          students: Math.floor(increment.students * currentStep),
          papers: Math.floor(increment.papers * currentStep),
          success: Math.floor(increment.success * currentStep)
        });
        currentStep++;
      } else {
        setStatsCounter(targetStats);
        clearInterval(counterInterval);
      }
    }, duration / stepsCount);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
      clearInterval(counterInterval);
    };
  }, []);

  const handleNav = (path) => {
    navigate(path);
  };

  const scrollTo = (id) => {
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

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleNav('/')}>
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
                onClick={() => scrollTo(`#${item.toLowerCase().replace(/\s+/g, '-')}`)}
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors border-b-2 border-transparent hover:border-blue-200 py-1"
              >
                {item}
              </button>
            ))}
            
            <div className="flex items-center gap-4 ml-4">
              {user ? (
                <button 
                  onClick={() => handleNav('/user')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-100 hover:bg-blue-100 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white">
                    {user.name?.[0] || 'U'}
                  </div>
                  <span className="font-semibold text-sm">Dashboard</span>
                </button>
              ) : (
                <>
                  <button onClick={() => handleNav('/auth')} className="text-slate-700 font-semibold px-4 hover:text-blue-600">Log In</button>
                  <button 
                    onClick={() => handleNav('/auth')}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all"
                  >
                    Start Free
                  </button>
                </>
              )}
            </div>
          </div>

          <button className="md:hidden text-slate-800" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`w-6 h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-current my-1 transition-all ${menuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 z-40 bg-white flex flex-col p-8 pt-24 md:hidden"
          >
            <div className="flex flex-col gap-6 text-xl">
              <button onClick={() => { setMenuOpen(false); scrollTo('#features'); }} className="text-left font-semibold">Features</button>
              <button onClick={() => { setMenuOpen(false); scrollTo('#how-it-works'); }} className="text-left font-semibold">How It Works</button>
              <button onClick={() => { setMenuOpen(false); scrollTo('#exams'); }} className="text-left font-semibold">Exams</button>
              <hr />
              <button onClick={() => { setMenuOpen(false); handleNav('/auth'); }} className="text-blue-600 font-bold">Get Started</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="z-10 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6 mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">New: AI-Enhanced Analytics 2.0</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 tracking-tight">
              Excel in Exams with <br />
              <span className="text-blue-600 italic">Precision Practice</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Transform your preparation with AI-generated mock papers tailored to your target exam. Get real-time feedback and detailed performance tracking.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => handleNav('/tool')}
                className="group px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all flex items-center justify-center gap-3"
              >
                Start Practicing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-slate-700 rounded-xl font-bold text-lg border-2 border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <Play className="w-5 h-5 text-blue-600" />
                See How It Works
              </button>
            </div>

            <div className="mt-12 flex items-center gap-6 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden`}>
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-yellow-400 mb-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-slate-500 font-medium font-dm-sans">Loved by 50,000+ Students</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-blue-200/50">
              <img src={heroImg} alt="AI Exam Prep" className="w-full h-auto object-cover" />
            </div>
            
            {/* Floating UI Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 z-20 bg-white p-4 rounded-xl shadow-xl border border-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-0.5">Mock Accuracy</p>
                  <p className="text-lg font-bold text-slate-800">89.4%</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-8 z-20 bg-white p-5 rounded-xl shadow-xl border border-slate-50"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-bold">Goal Progress</span>
              </div>
              <div className="w-40 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white p-10 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-center md:border-r border-slate-100 px-4">
              <p className="text-4xl font-extrabold text-slate-900 mb-2">{statsCounter.students.toLocaleString()}+</p>
              <p className="text-slate-500 font-medium">Global Learners</p>
            </div>
            <div className="text-center md:border-r border-slate-100 px-4">
              <p className="text-4xl font-extrabold text-slate-900 mb-2">{statsCounter.papers.toLocaleString()}+</p>
              <p className="text-slate-500 font-medium">Papers Generated</p>
            </div>
            <div className="text-center md:border-r border-slate-100 px-4">
              <p className="text-4xl font-extrabold text-slate-900 mb-2">{statsCounter.success}%</p>
              <p className="text-slate-500 font-medium">Rank Improvement</p>
            </div>
            <div className="text-center px-4">
              <p className="text-4xl font-extrabold text-slate-900 mb-2">24/7</p>
              <p className="text-slate-500 font-medium">AI Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Powerful Features</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Built for Serious Aspirants</h3>
            <p className="text-lg text-slate-600">Our platform goes beyond simple questions. We provide a complete ecosystem for exam-readiness.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all"
              >
                <div className={`w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-7 h-7 text-blue-600`} />
                </div>
                <h4 className="text-xl font-bold mb-4">{f.title}</h4>
                <p className="text-slate-600 leading-relaxed font-dm-sans opacity-80">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-900 text-white rounded-2xl mx-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">The Process</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">How PrepKaro Elevates You</h3>
          </div>

          <div className="grid md:grid-cols-4 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-20 right-20 h-0.5 bg-slate-800 z-0"></div>
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-900/40">
                  <s.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold mb-4">{i + 1}. {s.title}</h4>
                <p className="text-slate-400 font-dm-sans">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 p-10 bg-slate-800/50 rounded-3xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-lg font-medium">Join over 5,000 students starting today</p>
            </div>
            <button onClick={() => handleNav('/auth')} className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all">
              Initialize My Prep
            </button>
          </div>
        </div>
      </section>

      {/* Available Exams */}
      <section id="exams" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Exam Coverage</h2>
              <h3 className="text-4xl font-bold">Supported Competitions</h3>
            </div>
            <p className="max-w-md text-slate-600">We cover the most rigorous competitive exams with fresh questions added daily by our AI engine.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {exams.map((exam, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.03 }}
                className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all text-center group cursor-pointer"
              >
                <div className="text-4xl mb-6 bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform">
                  {exam.logo}
                </div>
                <h4 className="text-lg font-bold mb-2">{exam.name}</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">{exam.desc}</p>
                <div className="flex items-center justify-center gap-2 text-blue-600 font-bold text-sm">
                  View Papers <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2 mb-6" onClick={() => handleNav('/')}>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-slate-900">PrepKaro</span>
              </div>
              <p className="text-slate-500 leading-relaxed mb-8">
                The next generation of exam preparation. AI-powered, student-focused, and results-driven.
              </p>
              <div className="flex gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-blue-50 cursor-pointer transition-colors">
                    <Star className="w-5 h-5 text-slate-400 hover:text-blue-500" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-bold mb-6 text-slate-900">Platform</h5>
              <ul className="space-y-4 text-slate-500">
                <li className="hover:text-blue-600 cursor-pointer transition-colors">AI Test Generator</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Performance Dashboard</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Resource Library</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Practice Free</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-slate-900">Company</h5>
              <ul className="space-y-4 text-slate-500">
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Our Mission</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Testimonials</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Partner Program</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Contact Support</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-slate-900">Stay Updated</h5>
              <p className="text-slate-500 text-sm mb-4">Get the latest exam patterns and study tips.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full" />
                <button className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
            <p>© 2026 PrepKaro AI. All rights reserved.</p>
            <div className="flex gap-8">
              <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}