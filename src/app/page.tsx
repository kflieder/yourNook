"use client";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[93vh] overflow-auto hide-scrollbar sm:pt-0 pt-5">

      <div className="order-1 md:order-2 flex justify-center items-center">

        <div className="md:w-3/4 w-full flex justify-center items-center">
          <ToggleLoginSignUp />
        </div>

      </div>

      <div className="order-2 md:order-1 h-[93vh] py-10 overflow-auto hide-scrollbar flex justify-center">

        <div className="w-full sm:px-4 h-[93vh] overflow-auto hide-scrollbar pb-10">
          <GlobalPostFeed
            currentUser={{
              uid: "",
              displayName: "",
              profilePicture: undefined,
            }}
            logInPage={true}
          />
        </div>

      </div>

    </div>
  );
}
