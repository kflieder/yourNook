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

    if (!username) return null;
  

  function handleSignOut() {
    signOut(auth)
    router.push('/'); // Redirect to login page after sign out
  }

  return (
    <button onClick={() => handleSignOut()} className="cursor-pointer">
     <LuLogOut />

    </button>
  )
}

export default LogOutButton