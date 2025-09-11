'use client'
import React from 'react'
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LuLogOut } from "react-icons/lu";

function LogOutButton() {
    const { username } = useAuth();
    const router = useRouter();

  

  async function handleSignOut() {
   await signOut(auth);
    router.push('/');
}

if (!username) return null;
  return (
    <div className='flex justify-around items-center p-4 border-2 border-blue-950 rounded-md bg-white sm:mb-5 mb-0 w-full'>
      <h1>Logout</h1>
    <button onClick={() => handleSignOut()} className="cursor-pointer flex">
      
     <LuLogOut />

    </button>
    </div>
  )
}

export default LogOutButton