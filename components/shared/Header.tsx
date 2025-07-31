import { RenderUsername } from "@/context/AuthContext";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import NotificationsDropdown from "../profile/notifications/NotificationsDropdown";
import { IoSettingsOutline } from "react-icons/io5";

function Header() {
  const { username }: any = useAuth();
  if (!username) return (
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
    <div className="flex justify-between items-center px-4 py-2 bg-blue-950 text-white text-xl capitalize font-extrabold tracking-wide shadow-xl">
      <div>
        <Link href={`/profile/${username?.uid}`}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={70}
            height={70}
            className="rounded-full"
          />
        </Link>
      </div>
       <div>
          <Link href="/feed">Feed</Link>
        </div>
      <div>
       <div className="flex items-center gap-2">
          <RenderUsername />
          <NotificationsDropdown userId={username.uid} />
          <Link href="/profile-settings">
            <IoSettingsOutline />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
