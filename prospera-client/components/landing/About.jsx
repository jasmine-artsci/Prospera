import React from 'react';
import Image from 'next/image';

const About = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-emerald-50 to-green-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Half - Text Content */}
          <div className="space-y-6 relative z-10">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                About <span className="text-emerald-600">Prospéra</span>
              </h2>
              <div className="w-20 h-1 bg-emerald-600 rounded-full"></div>
            </div>
            
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                Prospéra is dedicated to empowering newcomers to Canada by connecting them with experienced mentors who understand their journey. We believe that every newcomer deserves the support and guidance needed to thrive in their new environment.
              </p>
              
              <p>
                Our platform bridges the gap between ambition and opportunity, creating meaningful relationships that foster personal and professional growth. Through personalized matching and comprehensive support, we help newcomers navigate their path to success.
              </p>
              
              <p>
                Join thousands of newcomers who have found their footing in Canada with the help of our dedicated mentor community. Your success story starts here.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                Learn More
              </button>
              <button className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-300">
                Get Started
              </button>
            </div>
          </div>
          
          {/* Right Half - Image with Fade Effect */}
          <div className="relative h-full">
            <div className="relative overflow-hidden h-full">
              <Image
                src="/images/mentorship-about.png"
                alt="Mentor and mentee working together in a modern office setting"
                width={600}
                height={400}
                className="w-full h-full min-h-[500px] object-cover"
                priority
              />
              
              {/* Fade overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-emerald-500/5 to-emerald-50/40"></div>
              
              {/* Additional fade from left edge */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-emerald-50/50 to-transparent"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-200 rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-200 rounded-full opacity-15"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;