import React from 'react'
import Header from "@/components/landing/Header"
import Hero from "@/components/landing/Hero"
import About from "@/components/landing/About"
import Feature from "@/components/landing/Feature"
import Footer from "@/components/landing/Footer"

const Home = () => {
  return (
    <div className="bg-white">
      <Header 
      />
      <div>
        <Hero />
      </div>
      <div>
        <About />
      </div>
      <div>
        <Feature />
      </div>
      <Footer />
    </div>
  )
}

export default Home