"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const Header = ({
  aboutRef,
  featureRef,
  workRef,
  heroRef,
}) => {
  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
    console.log("Header::", user);
  }, [])

  const [isAnimating, setIsAnimating] = useState(false);

  const router = useRouter();

  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
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
            className="flex flex-col text-black md:flex-row items-center gap-2 font-extrabold text-1xl"
          > 
            <Image
              src="/images/prospera-logo.png"
              alt="Prospéra Logo"
              width={50}
              height={50}
              className="cursor-pointer"
            />
            Propsera
          </div>
          <nav className="flex flex-col md:flex-row md:justify-center gap-3 md:gap-8 text-black/80 items-center">
          <div className="flex flex-row gap-10">
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
            </div>

            <div className="">
              {loading ? (
                <button className="px-3.5 py-1.5 rounded-xl">
                  Loading...
                </button>
              )
              :
              (
                user ? 
                (
                <button 
                  onMouseOver={()=>setIsAnimating(true)} 
                  onMouseOut={()=>setIsAnimating(false)} 
                  onClick={()=>router.push("/profile")}
                  className={`${isAnimating ? "shadow-2xl" : "shadow-none"} hover:border-transparent relative items-center overflow-hidden px-3.5 py-1.5 bg-black/80 text-white rounded-xl font-semibold cursor-pointer`}>
                    <span className={`absolute inset-0 bg-emerald-700 scale-0 origin-center rounded-full transition-transform duration-400 transform ${isAnimating ? 'scale-120 ' : "scale-0"}`}></span>
                    <span className="relative z-10">Profile</span>
                </button>
                )  
                :
                (
                <button 
                  onMouseOver={()=>setIsAnimating(true)} 
                  onMouseOut={()=>setIsAnimating(false)} 
                  onClick={()=>router.push("sign-up")}
                  className={`${isAnimating ? "shadow-2xl" : "shadow-none"} hover:border-transparent relative items-center overflow-hidden px-3.5 py-1.5 bg-black/80 text-white rounded-xl font-semibold cursor-pointer`}>
                    <span className={`absolute inset-0 bg-emerald-700 scale-0 origin-center rounded-full transition-transform duration-400 transform ${isAnimating ? 'scale-120 ' : "scale-0"}`}></span>
                    <span className="relative z-10">Register / Login</span>
                </button>
                )
              )
              }
            </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;