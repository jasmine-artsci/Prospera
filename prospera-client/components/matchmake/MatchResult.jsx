"use client";
import { useEffect, useState } from "react";
import { fetchMatches } from "@/lib/api";

export default function MatchResult({id}) {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const getMatches = async () => {  
      try {
        const data = await fetchMatches(id);
        setMatches(data);
        console.log("MATCHED DATA::::::::::::::::::", data);
      } catch (err) {
        setError("Could not load matches.");
        console.error(err);
      }
    };
    
    console.log("DISPLAY:::", id);
    if (id) getMatches();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!matches.length) return <p className="text-black">Loading matches...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2 text-black">Top Matches</h2>
      <ul>
        {matches.map((m, i) => (
          <li key={m.id} className="mb-2 text-black">
            🥇 Rank {m.match_rank}: <b>{m.mentor.name}</b> <br />
            Score: {m.match_score.toFixed(2)} <br />
            Industry: {m.mentor.industry}
          </li>
        ))}
      </ul>
    </div>
  );
}
