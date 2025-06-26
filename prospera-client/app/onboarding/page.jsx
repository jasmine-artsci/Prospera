"use client"

import EnhancedOnboardingPage from "@/components/onboarding/EnhancedOnboardingPage";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Onboarding() {
 const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const authId = searchParams.get('auth_id');

  useEffect(() => {
    async function fetchData(){
      const { data: { user } } = await supabase.auth.getUser();
      console.log("actual user:::", user);
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('auth_id', user.id)
        .single();

      console.log("userData:::", userData);

      if(userData.role) router.push(`/onboarding/${userData.role}`);
      if(user.id !== authId) router.push('/');

      if (error) console.error("Failed to get custom role:", error.message);
    }
    
    fetchData();

    if (!authId) {
      setError('Missing auth ID');
    }

  }, [authId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('auth_id', authId);

    setLoading(false);

    if (error) {
      setError(error.message)
      alert(error);
      router.push('/');
    } else {
      // Redirect to dashboard or role-specific page
      router.push(`/onboarding/${role}`);
    }
  };


  return (
    <div className=" mx-auto p-6 h-screen w-screen bg-white text-center pt-60">
      <h2 className="text-2xl font-bold mb-4 text-black">Tell us who you are</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <input
            type="radio"
            name="role"
            value="mentor"
            checked={role === 'mentor'}
            onChange={() => setRole('mentor')}
          />
          <span className="ml-2 text-black">I want to be a Mentor</span>
        </label>

        <label className="block">
          <input
            type="radio"
            name="role"
            value="mentee"
            checked={role === 'mentee'}
            onChange={() => setRole('mentee')}
          />
          <span className="ml-2 text-black">I want to be a Mentee</span>
        </label>

        <button
          type="submit"
          className="w-40 bg-green-600 text-white py-2 rounded disabled:opacity-50"
          disabled={!role || loading}
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}