"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Card from "./Cards";

const MENTEE_ID = "ea5e29c8-e1fd-4680-9f60-39897453cdf0";

const mentorsData = [
  {
    name: "Sarah Johnson",
    bio: "Software Engineer at Google with 8+ years in AI and cloud infrastructure.",
    image: "/mentor-images/mentor-image.png",
    reason: "Sarah has mentored over 50 junior developers in AI and cloud technologies.",
    onViewDetails: () => alert("Viewing Sarah's profile..."),
    onContact: () => alert("Contacting Sarah..."),
    email: "tandel.brunoi.ca@gmail.com"
  },
  {
    name: "David Kim",
    bio: "Senior Data Scientist with expertise in machine learning and data pipelines.",
    image: "/mentor-images/mentor-image.png",
    reason: "David's skills closely match your interest in data science and MLOps.",
    onViewDetails: () => alert("Viewing David's profile..."),
    onContact: () => alert("Contacting David..."),
    email: "tandel.brunoi.ca@gmail.com"
  },
  {
    name: "Aisha Patel",
    bio: "UX Designer at Meta, helping teams build intuitive user interfaces.",
    image: "/mentor-images/mentor-image.png",
    reason: "Aisha has helped students transition into UX design careers effectively.",
    onViewDetails: () => alert("Viewing Aisha's profile..."),
    onContact: () => alert("Contacting Aisha..."),
    email: "tandel.brunoi.ca@gmail.com"
  },
];

const MatchingMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("mentee_mentor_matches")
        .select("*")
        .eq("mentee_id", MENTEE_ID)
        .order("match_score", { ascending: false })
        .limit(3);

      if (error) {
        alert('No');
        console.error("Error fetching mentors:", error.message);
      } else {
        alert('yes');
        console.log("Fetched mentors:", data);
        setMentors(data);
      }

      setLoading(false);
    };

    fetchMentors();
  }, []);

  return (
    <section className="min-h-screen bg-gray-100 py-10 px-4 md:px-12 lg:px-24">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Matching Mentors For You
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {mentorsData.map((mentor, index) => (
          <Card
            key={index}
            name={mentor.name}
            bio={mentor.bio}
            image={mentor.image}
            reason={mentor.reason}
            onViewDetails={mentor.onViewDetails}
            onContact={mentor.onContact}
            email={mentor.email}
          />
        ))}
      </div>
    </section>
  );
};

export default MatchingMentors;