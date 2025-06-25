import { supabase } from "@/lib/supabase";

export async function POST(req) {
    console.log("I AM HEREEE");
    try {
        const body = await req.json();
        const { auth_id, name, role, skills, bio } = body;
      
        const { error } = await supabase.from('users').insert({
          auth_id,
          name,
          role,
          skills,
          bio
        });

        if(error) return new Response(JSON.stringify({ error: error.message }), { 
            status: 404, 
            headers: {
            "Content-Type": "application/json",
        }, });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 404,
        headers: {
            "Content-Type": "application/json",
        },
    });
    }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
