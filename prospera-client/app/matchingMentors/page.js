import React from 'react'
import Header from "@/components/landing/Header"
import Hero from "@/components/landing/Hero"
import MatchingMentors from "@/components/landing/MatchingMentors"
import Footer from "@/components/landing/Footer"

const page = () => {
  return (
    <div className="bg-white">
      <Header />
      <div>
        <MatchingMentors />
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default page