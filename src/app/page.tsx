'use client';
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ToggleLoginSignUp from "../../components/auth/ToggleLoginSignUp";

export default function Home() {
  const { username }: any = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (username?.uid) {
      router.push(`/feed`);
    }
  }, [username, router]);

  return (
    <div className="flex justify-around items-center h-150 border">
      <div></div>
      <div>
      <h1 className="text-3xl font-bold underline text-center mt-4">
        This will be the main feed
      </h1>
      </div>
      <div>
        <ToggleLoginSignUp />
      </div>
    </div>
  )
}