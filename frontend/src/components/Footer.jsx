import React from 'react'

function Footer() {
  return (
      <footer className="bg-[#1b4332] text-gray-400 text-sm py-8 px-6 mt-auto">
          {/* ---------------- FOOTER ---------------- */}
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            © {new Date().getFullYear()} <span className="text-white font-medium">ExamCraft</span>.
            All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#privacy" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white">
              Terms of Service
            </a>
            <a href="#contact" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
  )
}

export default Footer