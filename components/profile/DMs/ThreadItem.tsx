import React from "react";
import { useLiveUserData } from "@/utilities/useLiveUserData";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../../../lib/firebase";

function ThreadItem({ thread, currentUserUid, onSelect }: any) {
  const liveSenderUserData = useLiveUserData(thread.otherUserUid || "");

  const otherUsersDisplayName =
    liveSenderUserData?.displayName || thread.otherUserDisplayName;
  const otherUsersProfilePicture =
    liveSenderUserData?.profilePicture || thread.otherUserProfilePicture;

  const isUnread =
    !thread.isRead && thread.lastMessageSenderUid !== currentUserUid;

    async function markThreadAsRead(threadId: string, currentUserUid: string) {
    const threadDocRef = doc(db, "dmThreads", threadId);
    const userThreadDocRef = doc(
      db,
      "users",
      currentUserUid,
      "dmThreads",
      threadId
    );
    await updateDoc(threadDocRef, {
      isRead: true,
    });
    await updateDoc(userThreadDocRef, {
      isRead: true,
    });
  }

  function handleClick() {
    markThreadAsRead(thread.threadId, currentUserUid);
    onSelect(thread);
  }

  return (
    <div
      onClick={handleClick}
      className="flex items-center space-x-4 border-b py-1 hover:bg-gray-100"
      key={thread.threadId}
    >
      <div className="flex w-full items-center space-x-4 cursor-pointer">
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border">
          <img
            className="w-14 h-14 object-cover border rounded-full mr-2"
            src={otherUsersProfilePicture}
            alt={`${otherUsersDisplayName}'s profile pic`}
          />
        </div>

        <div className="flex flex-col w-full  overflow-hidden">
          <div className="flex items-end w-full capitalize">
            <div className="font-bold">
              {otherUsersDisplayName}
              {isUnread && (
                <span className="text-red-500 text-xs ml-1">New</span>
              )}
            </div>
            <span className="w-full ml-2 text-nowrap overflow-hidden flex text-gray-500 text-sm">
              - {thread.lastMessageText}
            </span>
          </div>

          <span className="text-gray-400 text-xs">
            {thread.lastMessageTimestamp?.toDate().toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ThreadItem;
