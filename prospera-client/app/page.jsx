"use client"

import React, { useEffect, useRef, useState } from 'react'
import Header from "@/components/landing/Header"
import Hero from "@/components/landing/Hero"
import About from "@/components/landing/About"
import Feature from "@/components/landing/Feature"
import Footer from "@/components/landing/Footer"
import { supabase } from '@/lib/supabase'

const Home = () => {
  const aboutRef = useRef(null);
  const featureRef = useRef(null);

  const [id, setId] = useState();
  const [user, setUser] = useState();

    useEffect(() => {
      async function fetchData(){
        const { data: { user } } = await supabase.auth.getUser();
        console.log("actual user:::", user);
        if(user){
          const { data: userData, error } = await supabase
            .from('users')
            .select('auth_id')
            .eq('auth_id', user.id)
            .single();
          
          // console.log("userDataaaaaaaaaaaaaaaaaaaaaa:::", userData.auth_id);
    
          // if(userData.role) router.push(`/onboarding/${userData.role}`);
          // if(user.id !== authId) router.push('/');
    
          if (error) console.error("Error:", error.message);
          setId(userData.auth_id);
          setUser(user);
        }
      }
      
      fetchData();
  
    }, []);

    return (
    <div className="bg-white">
      <Header 
      aboutRef={aboutRef}
      featureRef={featureRef}
      />
      <div>
        <Hero user={user} id={id} />
      </div>
      <div className='pt-20' ref={aboutRef}>
        <About />
      </div>
      <div ref={featureRef}>
        <Feature />
      </div>
      <Footer />
    </div>
  )
}

export default Home