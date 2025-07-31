'use client';
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserDoc } from "@/utilities/userDocHelper";
import { useLiveUserData } from "@/utilities/useLiveUserData";
import { sendNotification } from "@/utilities/sendNotification";
import { createFollowRequest } from "@/utilities/followRequestHelper";


interface FollowButtonProps {
  targetUid: string;
}

function FollowButton({ targetUid }: FollowButtonProps) {
  const { username: currentUser }: any = useAuth();
  const currentUserDoc = useUserDoc(currentUser?.uid);
  const targetUserDoc = useUserDoc(targetUid);
  const liveCurrentUser = useLiveUserData(currentUser?.uid);
  const liveTargetUser = useLiveUserData(targetUid);
  const [isFollowing, setIsFollowing] = useState(false);
 
  const needsApproval = liveTargetUser?.autoApproveFollow === false;
  
  

  if (!currentUser || !targetUid) return null;

  

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

      await currentUserDoc?.updateUserData({ following: updatedFollowing });
      await targetUserDoc?.updateUserData({ followers: updatedFollowers });

      await sendNotification({
        toUserId: targetUid,
        type: "follow",
        fromUserId: currentUser.uid,
        message: `${currentUser.displayName} started following you!`
      });

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

      await currentUserDoc?.updateUserData({ following: updatedFollowing });
      await targetUserDoc?.updateUserData({ followers: updatedFollowers });

      setIsFollowing(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

 const handleFollowButtonClick = async () => {
    if (isFollowing) {
      handleUnfollow();
    } else if (needsApproval) {
      alert("This user requires approval to follow.");
      await createFollowRequest(targetUid, {
        uid: currentUser.uid,
        displayName: currentUser.displayName
      });
      await sendNotification({
        toUserId: targetUid,
        type: "followRequest",
        fromUserId: currentUser.uid,
        message: `${currentUser.displayName} wants to follow you!`
      });
    } else {
      handleFollow();  
    }
  };
  const followerCount = liveTargetUser?.followers?.length || 0;

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleFollowButtonClick}
        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isFollowing ? "Unfollow" : "follow"}
      </button>
    </div>
  );
}

export default FollowButton;
