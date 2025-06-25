'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { useState } from 'react';

export default function SignupPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    console.log("USER DATA:", data);
    if (error) {
      setError(error.message);
    } else {
      router.push('/'); // redirect after login
    }
  };

  return (
    <div className='mt-50'>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Log in</h2>
        <input 
          onChange={e => {setError(""), setForm({ ...form, email: e.target.value })}} 
          placeholder="Email" className="w-full border p-2 mb-2" 
          required/>
        <input
          onChange={e=> setForm({ ...form, password: e.target.value })}
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-2"
          required
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className='flex flex-col gap-2 mt-2'>
          <button onClick={()=>router.push("/")} className="bg-gray-600 text-white p-2 w-full rounded hover:bg-gray-700 transition">Go Back</button>
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 transition rounded text-white p-2 w-full">Continue</button>
        </div>
      </form>
      <div className="text-center text-white mt-2">
          Don't have an account?
          <br />
          <a onClick={()=>router.push('/sign-up')} className="text-blue-500 hover:underline cursor-pointer">
            Sign Up
          </a>
      </div>
    </div>
    
  );
}
