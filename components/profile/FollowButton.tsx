import React, { useState, useEffect, use } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserDoc } from "@/utilities/useUserDoc";

interface FollowButtonProps {
  targetUid: string;
  targetDisplayName: string;
}

function FollowButton({ targetUid, targetDisplayName }: FollowButtonProps) {
  const { username: currentUser }: any = useAuth();
  const { updateUserData } = useUserDoc(currentUser?.uid);
  const { updateUserData: updateTargetUserData } = useUserDoc(targetUid);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const targetUserDoc = useUserDoc(targetUid);
  const fetchUserData = useUserDoc(currentUser?.uid).fetchUserData;

  useEffect(() => {
  const checkFollowStatus = async () => {
    if (!currentUser || !targetUid) return;
    const freshUser = await fetchUserData();
    const following = freshUser?.following || [];
    setIsFollowing(following.includes(targetUid));
  };

  checkFollowStatus();
}, [currentUser, targetUid]);
 

  const handleFollow = async () => {
    if (!currentUser) return;

    try {
      const freshUser = await fetchUserData();
      const currentFollowing = freshUser?.following || [];
      const targetUser = await targetUserDoc.fetchUserData();
      const updatedFollowing = Array.from(new Set([...currentFollowing, targetUid]));

      await updateUserData({ following: updatedFollowing });
      await updateTargetUserData({
        followers: [...(targetUser?.followers || []), currentUser.uid],
      });
      setIsFollowing(true);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  return (
    <div>
      <button onClick={handleFollow}>
        {isFollowing ? "Unfollow" : `Follow ${targetDisplayName}`}
      </button>
    </div>
  );
}

export default FollowButton;
