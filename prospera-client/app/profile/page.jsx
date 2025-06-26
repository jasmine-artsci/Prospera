"use client"
import ProfileDisplay from "@/components/profile/ProfileDisplay";
import { fetchMatches } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Profile() {
  const [matches, setMatches] = useState([]);
  const [userData, setUserData] = useState();
  const [role, setRole] = useState();
  useEffect(() => {
    const getMatches = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("Failed to get user or user is null:", error);
        return;
      }

      setUserData(user);

      const { data: menteeData, error: menteeError } = await supabase
        .from("mentees")
        .select("*")
        .eq("id", user.id)
        .single();
        
      if (menteeError) {
        console.error("Failed to fetch mentee data:", menteeError);
        setError("Mentee not found.");
        return;
      }

      setRole(menteeData);

      const data = await fetchMatches(user.id);
      console.log("MATCHES::::::", data);
      setMatches(data);
    };

    getMatches();
  }, []);

  return <ProfileDisplay role={role} matches={matches} />;
}