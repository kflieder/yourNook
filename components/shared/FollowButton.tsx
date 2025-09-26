'use client';
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserDocHelper } from "@/utilities/userDocHelper";
import { useLiveUserData } from "@/utilities/useLiveUserData";
import { sendNotification } from "@/utilities/sendNotification";
import { createFollowRequest, getFollowRequestStatus } from "@/utilities/followRequestHelper";
import { useAlert } from "components/customAlertModal/AlertProvider";


interface FollowButtonProps {
  targetUid: string;
  currentUserUid?: string; // Optional prop for current user UID
}

function FollowButton({ targetUid }: FollowButtonProps) {
  const { username: currentUser }: any = useAuth();
  const currentUserDoc = getUserDocHelper(currentUser?.uid);
  const targetUserDoc = getUserDocHelper(targetUid);
  const liveCurrentUser = useLiveUserData(currentUser?.uid);
  const liveTargetUser = useLiveUserData(targetUid);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollower, setIsFollower] = useState(false);
  const needsApproval = liveTargetUser?.autoApproveFollow === false;
  const [followRequestStatus, setFollowRequestStatus] = useState<"pending" | "accepted" | "rejected" | null>(null);
  const { show } = useAlert();
  const alertRef = useRef<HTMLButtonElement>(null);

  if (!currentUser || !targetUid) return null;

  

  useEffect(() => {
    if (!liveCurrentUser || !targetUid) return;
    setIsFollowing(liveCurrentUser.following?.includes(targetUid));
    setIsFollower(liveTargetUser?.followers?.includes(currentUser.uid));
    getFollowRequestStatus(targetUid, currentUser.uid)
      .then((status) => {
        if (status) {
          setFollowRequestStatus(status.status);
        }
      });
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
        message: 'started following you!'
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
      show("Follow request sent. Waiting for approval.", { bottom: 30, left: 0 }, alertRef);
      await createFollowRequest(targetUid, {
        uid: currentUser.uid,
        displayName: currentUser.displayName
      });
      await sendNotification({
        toUserId: targetUid,
        type: "followRequest",
        fromUserId: currentUser.uid,
        message: 'wants to follow you!'
      });
      setFollowRequestStatus("pending");
    } else {
      handleFollow();  
    }
  };
  

  return (
    <div className="flex flex-col items-start gap-2">
      {
        followRequestStatus === "pending" ? (
          <span>Request Pending</span>
        ) : (
          <button
            ref={alertRef}
            onClick={handleFollowButtonClick}
            className={
              `cursor-pointer px-3 py-0.5 text-sm font-medium rounded-full transition-colors` +
              ` ${isFollowing
                ? "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                                : "bg-neutral-900 text-white hover:bg-gray-500 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"}`
                        }
                        aria-pressed={isFollowing}
                    >
                        {isFollowing ? "Following" : "Follow"}
                    </button>
        )
      }
      
    </div>
  );
}

export default FollowButton;
