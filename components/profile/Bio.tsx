import React from "react";
import FollowButton from "../shared/FollowButton";
import FollowerCountPopup from "../shared/FollowerCountPopup";
import { useAuth } from "@/context/AuthContext";

interface BioProps {
  userData: {
    displayName: string;
    pronouns?: {
      she?: boolean;
      he?: boolean;
      theyThem?: boolean;
      other?: string;
    };
    bio?: string;
    links?: string;
    uniqueUrl?: string;
    profilePicture?: string;
    uid?: string;
  };
}

function Bio({ userData }: BioProps) {
  if (!userData) {
    return null;
  }
  const { username } = useAuth();
  const isOwner = username?.uid === userData.uid;
  const {
    displayName,
    pronouns = {},
    bio,
    links,
    uniqueUrl,
    profilePicture,
  } = userData;

  return (
    <div className="bg-blue-950 rounded p-6">
      <div className="flex justify-around items-center">
        <div className="border-2 rounded-full p-4 bg-gray-200">
          <img
            src={profilePicture || "/profileAvatar.png"}
            alt="Profile"
            className="w-56 h-56 rounded-full object-cover border-2"
          />
        </div>
        <div className="bg-gray-200 rounded p-4 ml-4 flex flex-col gap-4 justify-center items-center h-64">
          <div>
            <div className="text-center border-2 bg-white rounded-full p-5">
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <h3>@{uniqueUrl}</h3>
              <div className="flex flex-col capitalize">
                {pronouns.she && (
                  <span>
                    <strong>she/her</strong>
                  </span>
                )}
                {pronouns.he && (
                  <span>
                    <strong>he/him</strong>
                  </span>
                )}
                {pronouns.theyThem && (
                  <span>
                    <strong>they/them</strong>
                  </span>
                )}
                {pronouns.other && (
                  <span>
                    <strong>{pronouns.other}</strong>
                  </span>
                )}
              </div>
            </div>
            <div className='flex flex-col items-center mt-4'>
              <div className="flex">
                <h2 className="mr-2">Links:</h2>
                <a
                  href={`https://${links}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {links}
                </a>
              </div>
              <div className="">
                {!isOwner && <FollowButton targetUid={userData.uid ?? ""} />}
                <div className="">
                  <FollowerCountPopup userId={userData.uid ?? ""} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-200 w-1/2 ml-5 p-4 rounded flex justify-center items-center text-xl h-64 overflow-scroll hide-scrollbar">
          <p>{bio}</p>
        </div>
      </div>
    </div>
  );
}

export default Bio;
