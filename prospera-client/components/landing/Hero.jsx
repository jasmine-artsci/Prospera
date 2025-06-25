"use client";

import React, { useState } from 'react'

const Hero = () => {
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-emerald-300/20 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Main heading */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-800 mb-6 leading-tight">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
            Prospéra!
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          Connect with experienced mentors, build meaningful relationships, and navigate your academic and professional journey with confidence. Your success story starts here.
        </p>

        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onMouseEnter={() => setHoveredButton('mentor')}
            onMouseLeave={() => setHoveredButton(null)}
            className={`group relative px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl text-lg transition-all duration-300 overflow-hidden ${
              hoveredButton === 'mentor' 
                ? 'shadow-2xl transform scale-105' 
                : 'shadow-lg hover:shadow-xl'
            }`}
          >
            <span className={`absolute inset-0 bg-emerald-700 scale-0 origin-center rounded-xl transition-transform duration-300 ${
              hoveredButton === 'mentor' ? 'scale-110' : 'scale-0'
            }`}></span>
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Find a Mentor
            </span>
          </button>

          <button
            onMouseEnter={() => setHoveredButton('become')}
            onMouseLeave={() => setHoveredButton(null)}
            className={`group relative px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl text-lg border-2 border-emerald-600 transition-all duration-300 ${
              hoveredButton === 'become' 
                ? 'shadow-2xl transform scale-105 bg-emerald-600 text-white' 
                : 'shadow-lg hover:shadow-xl hover:bg-emerald-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
              </svg>
              Become a Mentor
            </span>
          </button>
        </div>

        {/* Optional: Scroll indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div> */}
      </div>
    </section>
  )
}

export default Hero