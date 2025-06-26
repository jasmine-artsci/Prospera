"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Card from "./Cards";

// const userFromSession = JSON.parse(sessionStorage.getItem("user"));

// const mentorsData = [
//   {
//     name: "Sarah Johnson",
//     bio: "Software Engineer at Google with 8+ years in AI and cloud infrastructure.",
//     image: "/mentor-images/mentor-image.png",
//     reason: "Sarah has mentored over 50 junior developers in AI and cloud technologies.",
//     onViewDetails: () => alert("Viewing Sarah's profile..."),
//     onContact: () => alert("Contacting Sarah..."),
//     email: "tandel.brunoi.ca@gmail.com"
//   },
//   {
//     name: "David Kim",
//     bio: "Senior Data Scientist with expertise in machine learning and data pipelines.",
//     image: "/mentor-images/mentor-image.png",
//     reason: "David's skills closely match your interest in data science and MLOps.",
//     onViewDetails: () => alert("Viewing David's profile..."),
//     onContact: () => alert("Contacting David..."),
//     email: "tandel.brunoi.ca@gmail.com"
//   },
//   {
//     name: "Aisha Patel",
//     bio: "UX Designer at Meta, helping teams build intuitive user interfaces.",
//     image: "/mentor-images/mentor-image.png",
//     reason: "Aisha has helped students transition into UX design careers effectively.",
//     onViewDetails: () => alert("Viewing Aisha's profile..."),
//     onContact: () => alert("Contacting Aisha..."),
//     email: "tandel.brunoi.ca@gmail.com"
//   },
// ];

const MatchingMentors = ({ matches }) => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    console.log("MATCHES FROM MATCHINGMENTOR:", matches);
    setMentors(matches);
    console.log("MATCHES FROM MATCHINGMENTOR2:", mentors);
  }, [matches])
  return (
    <section className="min-h-screen bg-gray-100 py-10 px-4 md:px-12 lg:px-24">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Matching Mentors For You
      </h2>
      <div className="flex flex-row gap-6 justify-evenly mx-50 lg:grid-cols-3 justify-items-center">
        {mentors.map((mentor, index) => (
          <Card
            key={index}
            name={mentor.mentor.name}
            bio={mentor.mentor.goal_support}
            // image={mentor.mentors.image}
            image="/mentor-images/mentor-image.png"
            reason={mentor.explanation_text}
            onViewDetails={mentor.onViewDetails}
            onContact={mentor.onContact}
            email={mentor.mentor.email}
          />
        ))}
      </div>
    </section>
  );
};

export default MatchingMentors;