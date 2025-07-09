'use client';
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { IoSettingsOutline } from "react-icons/io5";
import Link from 'next/link'
import { User } from "firebase/auth";
import { doc,  getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";



interface AuthContextType {
  firebaseUser: User | null;
  username: ExtendedUser | null;
  loading: boolean;
}

interface ExtendedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  uniqueUrl?: string;
  profilePicture?: string;
  likes?: string[];
}

const AuthContext = createContext<AuthContextType | null>(null);



export function AuthProvider({ children } : { children: React.ReactNode }) {

  const [username, setUsername] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
  
        const extraData = docSnap.exists() ? docSnap.data() : {};
  
        setUsername({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          uniqueUrl: extraData.uniqueUrl || '',
          profilePicture: extraData.profilePicture || '',
          likes: extraData.likes || [],
        });
      } else {
        setUsername(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ username, loading, firebaseUser: auth.currentUser }}>
      {!loading && children}
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
    <div className="flex items-center gap-2 mr-2">
      Welcome, {username.displayName}!
      <Link href="/profile-settings">
                <IoSettingsOutline />
       </Link>
    </div>
  );
}

