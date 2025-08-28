import { RenderUsername } from "@/context/AuthContext";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import NotificationsDropdown from "../profile/notifications/NotificationsDropdown";
import { IoSettingsOutline } from "react-icons/io5";

function Header() {
  const { username: user }: any = useAuth();
  if (!user) return (
    <div className="flex justify-between items-center px-4 py-2 bg-blue-950 text-white text-xl capitalize font-extrabold tracking-wide shadow-xl">
       <Image
            src="/logo.png"
            alt="Logo"
            width={70}
            height={70}
            className="rounded-full"
          />
        <h1>Please Login :D</h1>
      </div>
  );
  return (
    <div className="flex justify-between items-center px-2 py-1 bg-blue-950 text-white text-xl capitalize font-extrabold tracking-wide shadow-xl fixed w-full top-0 z-50">
      <div>
        <Link href={`/feed`}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
        </Link>
      </div>
      <div>
       <div className="flex items-center gap-2 text-base">
        <Link href={`/profile/${user?.uid}`}>
          <RenderUsername />
        </Link>
          <NotificationsDropdown userId={user.uid} />
          <Link href="/profile-settings">
            <IoSettingsOutline />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
