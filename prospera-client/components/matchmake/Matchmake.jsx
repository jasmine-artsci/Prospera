import React, { useState } from "react";
import { submitMatchRequest } from "@/lib/api"; // assuming correct path

const Matchmake = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMatch = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await submitMatchRequest("Fatima Khan"); // replace with real mentee name or object
      setMatches(res.matches);
    } catch (err) {
      setError("Failed to fetch matches.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        className="bg-emerald-500 text-white px-4 py-2 rounded mb-4"
        onClick={handleMatch}
      >
        Match Me!
      </button>

      {loading && <p>Loading matches...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {matches.map((match, i) => (
          <div key={i} className="p-4 border rounded shadow">
            <p><strong>Mentor ID:</strong> {match.mentor_id}</p>
            <p><strong>Score:</strong> {match.score?.toFixed(2)}</p>
            <p><strong>Explanation:</strong> {match.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matchmake;
