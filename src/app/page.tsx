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
    <div className="flex justify-around pt-5 md:pt-10 sm:h-screen sm:mr-10">
      <div className='md:flex sm:flex-col hidden h-full overflow-auto hide-scrollbar pt-5 md:pt-10 lg:w-full w-1/2'>
        <GlobalPostFeed currentUser={{
          uid: "",
          displayName: "",
          profilePicture: undefined,
        }} logInPage={true} />
      </div>

      <div className='flex flex-col sm:flex justify-center items-center w-full sm:w-1/3 mt-5 sm:mt-0 lg:mr-10'>
        <ToggleLoginSignUp />
        <div className='sm:hidden block mt-4 text-center text-gray-600 text-xs w-3/4 h-124 overflow-auto hide-scrollbar'>
        <GlobalPostFeed currentUser={{
          uid: "",
          displayName: "",
          profilePicture: undefined,
        }} logInPage={true} />
        </div>
      </div>
    </div>
  )
}