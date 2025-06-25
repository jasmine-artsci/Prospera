"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Header = ({
  aboutRef,
  pricingRef,
  featureRef,
  workRef,
  heroRef,
}) => {
  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  }
    
  const [isAnimating, setIsAnimating] = useState(false);


  return (
    <header className="sticky top-0 backdrop-blur-sm bg-green-700/40 z-20">
      <div className="flex justify-center items-center py-1.5 bg-black text-white text-sm gap-3">
        <p className="text-white/60 hidden md:block">
          Explore your environment with <span className="">Prospéra</span>.
        </p>
        <div className="inline-flex gap-1 items-center">
            Start your journey today. 
        </div>
      </div>

      <div className="container py-3 mx-auto my-auto">
        <div className="flex items-center justify-around gap-6 md:justify-between sticky top-0 px-3 md:mx-60 lg:px-0">
          <div
            onClick={() => scrollToSection(heroRef)}
            className="flex flex-col md:flex-row items-center gap-2 font-extrabold text-1xl"
          >
            <Image
              src="/images/prospera-logo.png"
              alt="Prospéra Logo"
              width={120}
              height={40}
              className="cursor-pointer"
            />
          </div>
          <nav className="flex flex-col md:flex-row md:justify-center gap-3 md:gap-8 text-black/80 items-center">
            <div className="flex gap-3 md:gap-6">
              <button
                onClick={() => scrollToSection(aboutRef)}
                className="cursor-pointer hover:text-black"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection(featureRef)}
                className="cursor-pointer hover:text-black"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection(workRef)}
                className="cursor-pointer hover:text-black"
              >
                Work
              </button>
              <button
                onClick={() => scrollToSection(pricingRef)}
                className="cursor-pointer hover:text-black"
              >
                Pricing
              </button>
            </div>

            <div className="">
              <Link href="/onboarding">
                <button onMouseOver={()=>setIsAnimating(true)} onMouseOut={()=>setIsAnimating(false)} className={`${isAnimating ? "shadow-2xl" : "shadow-none"} hover:border-transparent relative items-center overflow-hidden px-3.5 py-1.5 bg-black/80 text-white rounded-xl font-semibold cursor-pointer`}>
                    <span className={`absolute inset-0 bg-emerald-700 scale-0 origin-center rounded-full transition-transform duration-400 transform ${isAnimating ? 'scale-110 ' : "scale-0"}`}></span>
                    <span className="relative z-10">Get Started</span>
                </button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;