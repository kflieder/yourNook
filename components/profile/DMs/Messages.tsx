import React, { useEffect, useState } from "react";
import { useLiveMessages } from "@/utilities/useLiveMessages";
import { useUserDmThreads } from "@/utilities/useUserDmThreads";
import SendMessageForm from "./SendMessageForm";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase"; // Adjust the path as necessary

function Messages({
  threadId,
  currentUserUid,
  senderDisplayName,
  senderProfilePicture,
  setHasUnreadMessages,
  messagesOpen
}: {
  threadId: string;
  currentUserUid?: string;
  senderDisplayName?: string;
  senderProfilePicture?: string;
  setDmThreadFromSendMessageForm?: (threadId: string | null) => void;
  setHasUnreadMessages?: (hasUnread: boolean) => void;
  messagesOpen?: boolean;
}) {
  const userDmThreads = useUserDmThreads(currentUserUid);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const messages = useLiveMessages(selectedThread || threadId);
  const [selectedUsersDisplayName, setSelectedUsersDisplayName] = useState<
    string | null
  >(null);
  const [selectedUsersProfilePicture, setSelectedUsersProfilePicture] =
    useState<string | null>(null);
  const [selectedUsersUid, setSelectedUsersUid] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(false);

  function handleSelectedThread(threadId: string) {
    if (selectedThread === threadId) {
      setSelectedThread(null);
    } else {
      setSelectedThread(threadId);
    }
  }

  useEffect(() => {
    if (threadId) {
      setSelectedThread(threadId);
      const selectedThreadData = userDmThreads.find(
        (thread) => thread.threadId === threadId
      );
      if (selectedThreadData) {
        setSelectedUsersDisplayName(selectedThreadData.otherUserDisplayName);
        setSelectedUsersProfilePicture(
          selectedThreadData.otherUserProfilePicture
        );
        setSelectedUsersUid(selectedThreadData.otherUserUid);
      }
    }

     setUnreadMessages(userDmThreads.some(thread => thread.isRead === false && thread.lastMessageSenderUid !== currentUserUid));
     if (setHasUnreadMessages) {
      setHasUnreadMessages(unreadMessages);
    }

    if (!messagesOpen) {
      setSelectedThread(null);
    }


  }, [threadId, userDmThreads, selectedThread, currentUserUid, unreadMessages, setHasUnreadMessages, messagesOpen]);


 
  async function markThreadAsRead(threadId: string, currentUserUid: string) {
    const threadDocRef = doc(db, 'dmThreads', threadId);
    const userThreadDocRef = doc(db, 'users', currentUserUid, 'dmThreads', threadId);
    await updateDoc(threadDocRef, {
        isRead: true,
      });
    await updateDoc(userThreadDocRef, {
      isRead: true,
    });
  }

 

  return (
    <div>
      {selectedThread === null &&
        userDmThreads.map((thread) => {
          const isUnread =
            !thread.isRead && thread.lastMessageSenderUid !== currentUserUid;
          
          return (
            <div
              onClick={() => {
                handleSelectedThread(thread.threadId);
                setSelectedUsersDisplayName(thread.otherUserDisplayName);
                setSelectedUsersProfilePicture(thread.otherUserProfilePicture);
                setSelectedUsersUid(thread.otherUserUid);
                if (currentUserUid) {
                  markThreadAsRead(thread.threadId, currentUserUid);

                }
              }}
              className="flex items-center space-x-4 p-2 border-b"
              key={thread.threadId}
            >
              <div className="border-b flex items-center space-x-4 cursor-pointer hover:bg-gray-100 p-2">
                <strong>
                  <img
                    className="h-12 w-12 border rounded-full"
                    src={thread.otherUserProfilePicture}
                    alt={`${thread.otherUserDisplayName}'s profile`}
                  />
                </strong>
                <strong style={{ fontWeight: isUnread ? "700" : "100" }}>
                  {thread.otherUserDisplayName}
                </strong>
                <span>{thread.lastMessageText}</span>
                <span className="text-gray-500 text-sm">
                  {thread.lastMessageTimestamp?.toDate().toLocaleString()}
                </span>
                
              </div>
            </div>
          );
        })}
      {selectedThread && (
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-4 border-b pb-4">
            <img
              className="h-12 w-12 border rounded-full"
              src={selectedUsersProfilePicture || senderProfilePicture || ""}
              alt={`${selectedUsersDisplayName || senderDisplayName}'s profile`}
            />
            <h1>{selectedUsersDisplayName}</h1>
            <button
              onClick={() => setSelectedThread(null)}
              className="ml-auto cursor-pointer"
            >
              <IoIosCloseCircleOutline size={24} />
            </button>
          </div>
          {messages.map((message) => (
            <div key={message.id} className="mb-2">
              <img
                className="h-8 w-8 rounded-full inline-block mr-2"
                src={message.senderProfilePicture}
                alt={`${message.senderDisplayName}'s profile`}
              />
              <strong>{message.senderDisplayName}</strong>: {message.content}
            </div>
          ))}
          <SendMessageForm
            threadId={selectedThread}
            currentUserUid={currentUserUid ?? ""}
            senderDisplayName={senderDisplayName ?? ""}
            senderProfilePicture={senderProfilePicture ?? ""}
            selectedTargetUserUid={selectedUsersUid ?? ""}
            targetUserDisplayName={selectedUsersDisplayName || ""}
            targetUserProfilePicture={selectedUsersProfilePicture || ""}
          />
        </div>
      )}
    </div>
  );
}

export default Messages;
