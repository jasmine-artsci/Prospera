"use client"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // adjust path
import { fetchMatches } from "@/lib/api"; // adjust path
import Header from "@/components/landing/Header";
import MatchingMentors from "@/components/landing/MatchingMentors";

const MatchingPage = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const getMatches = async () => {
      console.log("I AM HERE");

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("Failed to get user or user is null:", error);
        return;
      }

      console.log("USER ID::::::::::", user.id);

      const data = await fetchMatches(user.id);
      console.log("MATCHES::::::", data);
      setMatches(data);
    };

    getMatches();
  }, []);

  return (
    <div className="bg-white">
      <Header />
      <div>
        <MatchingMentors matches={matches} />
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default MatchingPage