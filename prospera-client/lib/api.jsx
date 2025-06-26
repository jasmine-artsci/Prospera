// lib/api.js

export const fetchMatches = async (mentee_id) => {
  console.log("mentee_id:", mentee_id);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/mentee_mentor_matches?mentee_id=eq.${mentee_id}&select=*,mentor:mentor_id(*)&order=match_rank.asc`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch matches");
  return await res.json();
};
