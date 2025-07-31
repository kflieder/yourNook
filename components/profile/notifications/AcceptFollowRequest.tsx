import React from "react";
import { updateFollowRequestStatus } from "@/utilities/followRequestHelper";

export function AcceptFollowRequestButton({ targetUid, currentUserUid }: { targetUid: string; currentUserUid: string }) {
  const handleAccept = async () => {
    await updateFollowRequestStatus(targetUid, currentUserUid, "accepted");
  };

  return (
    <button
      onClick={handleAccept}
      className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
    >
      Accept Follow Request
    </button>
  );
}