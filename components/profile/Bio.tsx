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
      <div className="flex">
        <img
          src={profilePicture || "/profileAvatar.png"}
          alt="Profile"
          className="w-56 h-56 rounded-full object-cover border-2"
        />
        <div className="bg-gray-200 w-3/4 ml-5 p-4 rounded flex justify-center items-center text-xl">
          <p>{bio}</p>
        </div>
      </div>
      <div className="bg-gray-200 rounded mt-5 flex justify-around">
        <div>
          <h2 className="">Links:</h2>
          <a href={links} target="_blank" rel="noopener noreferrer">
            {links}
          </a>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <h3>@{uniqueUrl}</h3>
          <div className="flex gap-2 capitalize">
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
        <div className="border">
         {!isOwner && (
          <FollowButton
            targetUid={userData.uid ?? ""}
          />
        )}
        <div className="border">
          <FollowerCountPopup userId={userData.uid ?? ""} />
        </div>
      </div>
      </div>
</div>
  );
}

export default Bio;
