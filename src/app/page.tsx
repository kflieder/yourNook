'use client';
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ToggleLoginSignUp from "../../components/auth/ToggleLoginSignUp";
import GlobalPostFeed from "components/feeds/GlobalPostFeed";

export default function Home() {
  const { username }: any = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (username?.uid) {
      router.push(`/feed`);
    }
  }, [username, router]);

  return (
    <div className="flex justify-around sm:pt-0 pt-20 sm:h-screen">
      <div className='sm:flex sm:flex-col hidden h-full overflow-auto hide-scrollbar pt-10'>
        <GlobalPostFeed currentUser={{
          uid: "",
          displayName: "",
          profilePicture: undefined,
        }} logInPage={true} />
      </div>
      
      <div className='flex justify-center items-center w-full sm:w-1/3'>
        <ToggleLoginSignUp />
      </div>
    </div>
  )
}