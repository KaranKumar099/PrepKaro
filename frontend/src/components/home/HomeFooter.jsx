import React from 'react';
import { GraduationCap, Star, ArrowRight } from 'lucide-react';

const HomeFooter = ({ onNav }) => {
  return (
    <footer className="pt-24 pb-12 px-6 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onNav('/')}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-900">PrepKaro</span>
            </div>
            <p className="text-slate-500 leading-relaxed mb-8">
              The next generation of exam preparation. AI-powered, student-focused, and
              results-driven.
            </p>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <Star className="w-5 h-5 text-slate-400 hover:text-blue-500" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-bold mb-6 text-slate-900">Platform</h5>
            <ul className="space-y-4 text-slate-500">
              <li className="hover:text-blue-600 cursor-pointer transition-colors">
                AI Test Generator
              </li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">
                Performance Dashboard
              </li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">
                Resource Library
              </li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Practice Free</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6 text-slate-900">Company</h5>
            <ul className="space-y-4 text-slate-500">
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Our Mission</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Testimonials</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">
                Partner Program
              </li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Contact Support</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6 text-slate-900">Stay Updated</h5>
            <p className="text-slate-500 text-sm mb-4">
              Get the latest exam patterns and study tips.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full"
              />
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
  );
};

export default HomeFooter;
