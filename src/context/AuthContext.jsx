'use client';
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { IoSettingsOutline } from "react-icons/io5";
import Link from 'next/link'

const AuthContext = createContext(null);




export function AuthProvider({ children }) {

  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubsccribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUsername(firebaseUser);
      setLoading(false);
    })
    return unsubsccribe;
  }, []);

  return (
    <AuthContext.Provider value={{ username, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


export function RenderUsername() {
  const { username } = useAuth();

  if (!username) return <p>  Please Log In </p>
  return (
    <div className="flex items-center gap-2">
      Welcome, {username.displayName}!
      <Link href="/profile-settings">
                <IoSettingsOutline />
       </Link>
    </div>
  );
}

