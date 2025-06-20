'use client';
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";

const AuthContext = createContext(null);



export function AuthProvider({  children }) {

    const [username, setUsername] = useState(null);
  useEffect(() => {
    const unsubsccribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUsername(firebaseUser);
    })
    return unsubsccribe;
  }, []);

  return (
    <AuthContext.Provider value={{ username }}>
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
    <p>
      Welcome, {username.displayName}!
    </p>
  );
}

