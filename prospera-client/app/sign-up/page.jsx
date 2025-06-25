'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { useState } from 'react';

export default function SignupPage() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const router = useRouter();
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword){
      return setError("Password don't match!");
    } 
    const email = form.email.trim();
    const name = email.split("@")[0];
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: form.password,
      options: {
        data: {
          name: name,
        }
      }
    });
    
    console.log("USER DATA:", data);

    if (error) {
      setError(error.message);
      return;
    };

    const userId = data.user?.id;
    
    await supabase.from('users').insert({
      auth_id: userId,
      name: name,
      role: null,
      skills: [],
      created_at: new Date(),
    });

    router.push(`/`);
  };

  return (
    <div className='mt-50'>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
        <input 
          onChange={e => setForm({ ...form, email: e.target.value })} 
          placeholder="Email" className="w-full border p-2 mb-2" 
          required/>
        <input
          onChange={e=> setForm({ ...form, password: e.target.value })}
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-2"
          required
        />
        <input
          onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2 mb-2"
          required
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className='flex flex-col gap-2 mt-2'>
          <button onClick={()=>router.push("/")} className="bg-gray-600 text-white p-2 w-full hover:bg-gray-700 rounded transition">Go Back</button>
          <button type="submit" className="bg-green-600 hover:bg-green-700 transition text-white rounded p-2 w-full">Continue</button>
        </div>
      </form>
      <div className="text-center text-white mt-5">
          Already have an account?
          <br />
          <a onClick={()=>router.push('/login')} className="text-blue-500 hover:underline">
            Login
          </a>
      </div>
    </div>
    
  );
}
