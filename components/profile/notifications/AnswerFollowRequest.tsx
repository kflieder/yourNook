import React, { useState, useEffect } from "react";
import {
  updateFollowRequestStatus,
  getFollowRequestStatus,
} from "@/utilities/followRequestHelper";
import { getUserDocHelper } from "@/utilities/userDocHelper";
import { useLiveUserData } from "@/utilities/useLiveUserData";
import { sendNotification } from "@/utilities/sendNotification";
import { arrayUnion } from "firebase/firestore";
import FollowButton from "components/shared/FollowButton";

export function AnswerFollowRequestButtons({
  targetUid,
  currentUserUid,
}: {
  targetUid: string;
  currentUserUid: string;
}) {
  const [followRequestStatus, setFollowRequestStatus] = useState<
    "pending" | "accepted" | "rejected" | null
  >(null);
  const currentUserDoc = getUserDocHelper(currentUserUid);
  const targetUserDoc = getUserDocHelper(targetUid);
  const liveCurrentUser = useLiveUserData(currentUserUid);

  async function updateFollowers() {
    if (!currentUserDoc || !targetUserDoc) return;
    try {
      await targetUserDoc?.updateUserData({
        following: arrayUnion(currentUserUid),
      });
      await currentUserDoc?.updateUserData({
        followers: arrayUnion(targetUid),
      });
    } catch (error) {
      console.error("Error updating followers:", error);
    }
  }

  useEffect(() => {
    if (!targetUid || !currentUserUid) return;
    async function fetchFollowRequestStatus() {
      const status = await getFollowRequestStatus(targetUid, currentUserUid);
      setFollowRequestStatus(status?.status || null);
    }
    fetchFollowRequestStatus();
  }, [targetUid, currentUserUid]);

  const handleAccept = async () => {
    await updateFollowRequestStatus(targetUid, currentUserUid, "accepted");
    setFollowRequestStatus("accepted");
    await updateFollowers();
    await sendNotification({
      toUserId: targetUid,
      type: "followRequestAccepted",
      fromUserId: currentUserUid,
      message: `${liveCurrentUser?.displayName} accepted your follow request!`,
    });
    console.log(targetUid, "accepted follow request from", currentUserUid);
  };

  const handleDecline = async () => {
    await updateFollowRequestStatus(targetUid, currentUserUid, "rejected");
    setFollowRequestStatus("rejected");
    await sendNotification({
      toUserId: targetUid,
      type: "followRequestRejected",
      fromUserId: currentUserUid,
      message: `${liveCurrentUser?.displayName} declined your follow request.`,
    });
  };

  return (
    <div>
      {followRequestStatus === "pending" ? (
        <div>
          <button
            onClick={handleAccept}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Accept Follow Request
          </button>
          <button
            onClick={handleDecline}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Decline Follow Request
          </button>
        </div>
      ) : followRequestStatus === "accepted" ? (
        <span className="text-green-500">
            <FollowButton
              targetUid={targetUid} currentUserUid={currentUserUid}/>
          Follow Request Accepted</span>
      ) : followRequestStatus === "rejected" ? (
        <span className="text-red-500">Follow Request Rejected</span>
      ) : (
        <span className="text-gray-500">No Follow Request</span>
      )}
    </div>
  );
}
