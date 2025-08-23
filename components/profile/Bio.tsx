import React from "react";
import FollowButton from "../shared/FollowButton";
import FollowerCountPopup from "../shared/FollowerCountPopup";
import { useAuth } from "@/context/AuthContext";
import { ImLink } from "react-icons/im";
import useIsMobile from "@/utilities/useIsMobile";

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
  const isMobile = useIsMobile();

  

  return (
 !isMobile ? (
    <div className="bg-blue-50 rounded p-6 flex">
      <div className="flex min-w-50 border-r">
        <div className="">
          <div className="rounded-full w-36 h-36 overflow-hidden mb-2">
            <img
              src={profilePicture || "/profileAvatar.png"}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover"
            />
          </div>
          <div className='ml-4'>
          <h1 className="text-2xl font-bold capitalize">{displayName}</h1>
          <div className="border-b border-gray-500 w-1/2"></div>
          <div className="flex pt-2 justify-between gap-x-2">
            <h3>@{uniqueUrl}</h3>
            <div className="flex flex-col capitalize">
              {pronouns.she && (
                <span>
                  <div>she/her</div>
                </span>
              )}
              {pronouns.he && (
                <span>
                  <div>he/him</div>
                </span>
              )}
              {pronouns.theyThem && (
                <span>
                  <div>they/them</div>
                </span>
              )}
              {pronouns.other && (
                <span>
                  <div>{pronouns.other}</div>
                </span>
              )}
            </div>
          </div>
          {!isOwner && <FollowButton targetUid={userData.uid ?? ""} />}
        </div>
  </div>
      </div>
      <div className='px-6 flex flex-col justify-between w-full'>
        <div className="text-sm">
          <p>{bio}</p>
        </div>
        
        <div className="">
          
          <div className="">
            <FollowerCountPopup userId={userData.uid ?? ""} />
          </div>
        </div>
        <div className="flex justify-center items-center">
          <h2 className="mr-2"><ImLink /></h2>
          <a
            href={`https://${links}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {links}
          </a>
        </div>
      </div>
    </div> ) : (
      <div>hi</div>
    )
  );
}

export default Bio;
