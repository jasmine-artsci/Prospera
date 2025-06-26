"use client";

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import MatchResult from '@/components/matchmake/MatchResult';

const Hero = ({ id }) => {
  console.log("HERO AUTH_ID:", id);
  const [hoveredButton, setHoveredButton] = useState(null);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false); // Initially hidden

  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  const runMatching = async () => {
    try {
      const res = await fetch('http://localhost:8000/run-matching', {
        method: 'POST',
      });

      if (!res.ok) throw new Error("Matching failed");

      const result = await res.json();
      console.log("Backend Matching Done:", result);

      // const matches = await fetchMatches(id);  // ← your existing function
      // setMatches(matches);
    } catch (err) {
      console.error("Error running matching:", err);
    }
  };

  return (
    <section className="h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center relative overflow-hidden">

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-emerald-300/20 rounded-full blur-2xl"></div>
      </div>


      <div className="container mx-auto px-6 text-center relative z-10">

        {/* Main heading */}
        <h1 className="text-6xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight">
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
            onClick={()=>router.push("/sign-up")}
            className={`group relative px-5 py-3 bg-emerald-600 text-white font-semibold rounded-xl text-lg transition-all duration-300 overflow-hidden ${
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
          {/* <Matchmake /> */}
        </div>
        <br />
        <div className='space-y-3'>
          <div className='text-black'>
            <button className='bg-emerald-700 text-white' onClick={toggleVisibility}>Match Me!</button>
          </div>
          <div>
            {isVisible && (
              <MatchResult id={id}/>
            )}
          </div>
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