import { useState, useEffect } from 'react';
import { Brain, BarChart3, Download, Target, CheckCircle, ArrowRight, Zap, Play } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useUserStore } from '../store/UseUserStore'; 
import {motion} from "framer-motion"

export default function Home() {
  const [activeExam, setActiveExam] = useState(0);
  const [statsCounter, setStatsCounter] = useState({ students: 0, papers: 0, success: 0 });

  const exams = [
    { name: 'JEE Main', logo: '🎯' },
    { name: 'JEE Advanced', logo: '🚀' },
    { name: 'NEET', logo: '⚕️' },
    { name: 'SSC', logo: 'src/assets/ssc-logo.png' },
    { name: 'UPSC', logo: 'src/assets/upsc-logo.png' }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Generation',
      description:
        'Automatically generate exam papers with balanced topic coverage & real exam weightage.'
    },
    {
      icon: Target,
      title: 'Real Exam Simulation',
      description:
        'Experience actual exam environment with timer, navigation, and marking scheme'
    },
    {
      icon: BarChart3,
      title: 'Deep Analytics',
      description: 'Get detailed insights on performance, weak areas, and improvement trends'
    },
    {
      icon: Download,
      title: 'PDF Download',
      description: 'Download beautifully formatted question papers for offline practice'
    }
  ];

  const steps = [
    { title: 'Select Exam', desc: 'Choose your target exam' },
    { title: 'Auto-Generate', desc: 'AI creates your paper' },
    { title: 'Attempt Test', desc: 'Online or download PDF' },
    { title: 'Get Analytics', desc: 'Track your progress' }
  ];

  const footer = {
    Product : ["Features", "Pricing", "Testimonials"],
    Resources : ["Blog", "Guides", "FAQs"],
    Company : ["About", "Contact", "Privacy"]
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveExam((prev) => (prev + 1) % exams.length);
    }, 3000);

    const targetStats = { students: 50000, papers: 200000, success: 95 };
    const duration = 2000;
    const steps = 60;
    const increment = {
      students: targetStats.students / steps,
      papers: targetStats.papers / steps,
      success: targetStats.success / steps
    };

    let currentStep = 0;
    const counterInterval = setInterval(() => {
      if (currentStep < steps) {
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
    }, duration / steps);

    return () => {
      clearInterval(interval);
      clearInterval(counterInterval);
    };
  }, []);

  const navigate = useNavigate()
  const { user } = useUserStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const getUser = () => {
    console.log(user);
    navigate("/user");
  };

  const goToAuth = ()=>{
    navigate("/auth")
  }

  const goToHome = () => {
    navigate("/");
  };

  const goToTool = () => {
    navigate("/tool");
  };

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-white border-b border-gray-200">
          {/* ---------- LOGO ---------- */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={goToHome}>
            <div className="w-10 h-10 bg-gray-200 p-1 rounded-lg flex items-center justify-center">
              <img src="../../logo.png" alt="logo" />
            </div>
            <span className="text-2xl font-bold text-gray-900">PrepKaro</span>
          </div>

          {/* ---------- NAV LINKS (hidden on small screens) ---------- */}
          <div className="hidden md:flex gap-8 items-center">
            {[
              { id: "#features", label: "Features" },
              { id: "#how-it-works", label: "How it Works" },
              { id: "#exams", label: "Exams" },
            ].map((link) => (
              <motion.a
                key={link.id}
                href={link.id}
                onClick={(e) => handleScroll(e, link.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer font-medium"
              >
                {link.label}
              </motion.a>
            ))}

            {user ? (
              <motion.div
                onClick={getUser}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
              ></motion.div>
            ) : (
              <motion.button
                onClick={goToAuth}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
              >
                Get Started
              </motion.button>
            )}
          </div>

          {/* ---------- MOBILE MENU BUTTON ---------- */}
          <button
            className="md:hidden text-gray-700 focus:outline-none text-2xl"
            aria-label="Open navigation menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ☰
          </button>
        </nav>

        {/* ---------- SLIDE-IN MOBILE MENU ---------- */}
        <div
          className={`fixed top-0 right-0 h-full w-2/3 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden z-40`}
        >
          {/* Mobile nav links */}
          <div className="flex flex-col px-6 gap-6 mt-20 text-base font-medium">
            {user ? (
              <div
                onClick={() => {
                  setMenuOpen(false);
                  getUser();
                }}
                className="text-gray-700 hover:text-blue-600"
              >User</div>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  goToAuth();
                }}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all text-center"
              >
                Get Started
              </button>
            )}
            <a href="#features" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600">
              Features
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600">
              How it Works
            </a>
            <a href="#exams" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600">
              Exams
            </a>
          </div>
        </div>

        {/* ---------- BACKDROP (when menu is open) ---------- */}
        {menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/50 md:hidden z-30"
          ></div>
        )}
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 pt-24 pb-12 sm:pb-16 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Side */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 mx-auto lg:mx-0">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-500">AI-Powered Test Generation</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Master Your Exam with{' '}
              <span className="text-blue-500">Smart Practice</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Auto-generated question papers from previous year questions. <br /> Real exam patterns.
                Detailed analytics. Everything you need to <br/> ace your competitive exams.</p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <button onClick={goToTool} 
              className="px-8 py-3.5 bg-blue-500 text-white rounded-lg font-semibold text-base hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                Start Practicing Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-3.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-base hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Floating Card Animation */}
          <div className="relative h-[400px] sm:h-[450px] lg:h-[500px]">
            <div className="absolute inset-0 flex items-center justify-center">
              {exams.map((exam, index) => (
                <div
                  key={exam.name}
                  className={`absolute w-72 sm:w-80 h-96 bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-700 transform ${
                    index === activeExam
                      ? 'scale-100 opacity-100 rotate-0 z-30'
                      : index === (activeExam + 1) % exams.length
                      ? 'scale-95 opacity-50 translate-x-16 rotate-3 z-20'
                      : 'scale-90 opacity-25 translate-x-32 rotate-6 z-10'
                  }`}
                >
                  <div className="p-8 h-full flex flex-col justify-between">
                    <div>
                      <div className='w-18 h-18 mb-3'><img src={exam.logo} className='h-full w-full object-contain' alt=""/></div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">{exam.name}</h3>
                      <p className="text-gray-600 text-sm">Practice Test Paper</p>
                    </div>
                    <div className="space-y-3">
                      {['50 Questions', '3 Hours Duration', 'Previous Year Questions'].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl sm:text-5xl font-bold text-gray-900">
              {statsCounter.students.toLocaleString()}+
            </div>
            <div className="text-gray-600 mt-2 text-sm">Active Students</div>
          </div>
          <div>
            <div className="text-4xl sm:text-5xl font-bold text-gray-900">
              {statsCounter.papers.toLocaleString()}+
            </div>
            <div className="text-gray-600 mt-2 text-sm">Papers Generated</div>
          </div>
          <div>
            <div className="text-4xl sm:text-5xl font-bold text-gray-900">{statsCounter.success}%</div>
            <div className="text-gray-600 mt-2 text-sm">Success Rate</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 sm:px-6 py-16 sm:py-20 max-w-7xl mx-auto bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">
            Why Choose PrepKaro?
          </h2>
          <p className="text-lg text-gray-600">Everything you need to succeed in your exams</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 sm:px-6 py-16 sm:py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">How It Works</h2>
          <p className="text-lg text-gray-600">Get started in 4 simple steps</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 text-blue-600 font-bold text-xl mb-4">
                {i + 1}
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Exams */}
      <section id="exams" className="px-4 sm:px-6 py-16 sm:py-20 max-w-7xl mx-auto bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">Available Exams</h2>
          <p className="text-lg text-gray-600">Prepare for all major competitive exams</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {exams.map((exam, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer text-center"
            >
              <div className='w-full h-18 flex justify-center mb-1'><img src={exam.logo} className='object-contain' alt=""/></div>
              <h3 className="text-base font-bold text-gray-900">{exam.name}</h3>
              <p className="text-xs text-gray-500 mt-2">1000+ Questions</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 max-w-7xl mx-auto">
        <div className="bg-blue-500 rounded-2xl p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Ready to Start Your Preparation?
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of students who are preparing smarter with AI-powered test generation
          </p>
          <button onClick={goToTool} className="px-10 py-3.5 bg-white text-blue-600 rounded-lg font-bold text-base hover:bg-gray-50 transition-all inline-flex items-center gap-2">
            Get Started for Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gray-200 p-1 rounded-lg flex items-center justify-center">
                <img src="../../logo.png" alt="logo" />
                </div>
              <span className="text-xl font-bold text-gray-900">PrepKaro</span>
            </div>
            <p className="text-gray-600 text-sm">
              India's leading exam preparation platform
            </p>
          </div>
            {Object.entries(footer).map(([title, items]) => (
            <div key={title}>
                <h4 className="font-bold mb-4 text-gray-900 text-sm">{title}</h4>
                <div className="space-y-2 text-gray-600 text-sm">
                {items.map((item) => (
                    <div key={item} className="hover:text-blue-600 cursor-pointer transition-colors">{item}</div>
                ))}
                </div>
            </div>
            ))}
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
          © 2025 PrepKaro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}