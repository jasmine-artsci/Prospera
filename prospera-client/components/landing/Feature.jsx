"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const Feature = () => {
  const [hoveredButton, setHoveredButton] = useState(null);

  const features = [
    {
      id: 1,
      image: '/images/feature-1.jpg',
      title: 'Career List',
      description: 'Access a comprehensive list of career paths tailored to your interests and skills. Discover opportunities beyond your imagination.'
    },
    {
      id: 2,
      image: '/images/feature-2.jpg',
      title: 'Hiring Access',
      description: 'Get direct access to hiring managers and exclusive job opportunities through our mentor network and partnership programs.'
    },
    {
      id: 3,
      image: '/images/feature-3.jpg',
      title: 'NGO Participation',
      description: 'Connect with NGOs and volunteer organizations to build meaningful community relationships and gain valuable experience.'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-emerald-50">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Why <span className="text-emerald-600">Prospéra</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock potential, transform lives, and build a brighter future
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              {/* Feature Image */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={400}
                  height={320}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Title Overlay (Always Visible) */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-xl font-bold text-white group-hover:opacity-0 transition-opacity duration-300">
                    {feature.title}
                  </h3>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-emerald-600/95 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-6">
                  <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-white/90 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;