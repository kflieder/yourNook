'use client';
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserDoc } from "@/utilities/useUserDoc";
import { useLiveUserData } from "@/utilities/useLiveUserData";

interface FollowButtonProps {
  targetUid: string;
  targetDisplayName: string;
}

function FollowButton({ targetUid, targetDisplayName }: FollowButtonProps) {
  const { username: currentUser }: any = useAuth();

    if (!currentUser || !targetUid) return null;

  const currentUserDoc = useUserDoc(currentUser?.uid);
  const targetUserDoc = useUserDoc(targetUid);

  // Live user data
  const liveCurrentUser = useLiveUserData(currentUser?.uid);
  const liveTargetUser = useLiveUserData(targetUid);

  const [isFollowing, setIsFollowing] = useState(false);


  // Check follow status on live data change
  useEffect(() => {
    if (!liveCurrentUser || !targetUid) return;
    setIsFollowing(liveCurrentUser.following?.includes(targetUid));
  }, [liveCurrentUser, targetUid]);

  const handleFollow = async () => {
    try {
      const updatedFollowing = Array.from(
        new Set([...(liveCurrentUser?.following || []), targetUid])
      );
      const updatedFollowers = Array.from(
        new Set([...(liveTargetUser?.followers || []), currentUser.uid])
      );

      await currentUserDoc.updateUserData({ following: updatedFollowing });
      await targetUserDoc.updateUserData({ followers: updatedFollowers });

      setIsFollowing(true);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const updatedFollowing = (liveCurrentUser?.following || []).filter(
        (uid: string) => uid !== targetUid
      );
      const updatedFollowers = (liveTargetUser?.followers || []).filter(
        (uid: string) => uid !== currentUser.uid
      );

      await currentUserDoc.updateUserData({ following: updatedFollowing });
      await targetUserDoc.updateUserData({ followers: updatedFollowers });

      setIsFollowing(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleClick = () => {
    isFollowing ? handleUnfollow() : handleFollow();
  };

  const followerCount = liveTargetUser?.followers?.length || 0;

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleClick}
        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isFollowing ? "Unfollow" : `Follow ${targetDisplayName}`}
      </button>
      <p className="text-sm text-gray-500">{followerCount} follower{followerCount !== 1 && 's'}</p>
    </div>
  );
}

export default FollowButton;
