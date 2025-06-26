"use client"

import { EnhancedOnboardingPage } from '@/components/onboarding';
import React from 'react'
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const Mentor = () => {
    const router = useRouter();
    const [role, setRole] = useState(null);
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const [id, setId] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/");
                return;
            }

            const { data: userData, error } = await supabase
                .from('users')
                .select('role, name')
                .eq('auth_id', user.id)
                .single();

            if (error) {
                setError(error.message);
                return;
            }
            
            if(user.id) setId(user.id);

            if(userData.role) setRole(userData.role);
            else setError("Couldn't get the user's role");

            if(userData.name) setName(userData.name);
            else setError("Couldn't fetch the user's name");
        };

        fetchData();
    }, [router]);

    if (error) {
        return (
        <div className="text-red-600 text-7xl">
            {error}
        </div>
        );
    }

    if (!role || !name) {
        return <div className='w-screen h-screen text-7xl text-center pt-70 text-black bg-white'>Loading...</div>;
    }


    return <EnhancedOnboardingPage role={role} name={name} id={id} />;
}

export default Mentor