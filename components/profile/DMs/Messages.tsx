import React, { useEffect, useState, useRef } from "react";
import { useLiveMessages } from "@/utilities/useLiveMessages";
import { useUserDmThreads } from "@/utilities/useUserDmThreads";
import SendMessageForm from "./SendMessageForm";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase"; 
import { useLiveUserData } from "@/utilities/useLiveUserData";
import ThreadItem from "./ThreadItem";


type DmThread = {
  threadId: string;
  otherUserUid: string;
  otherUserDisplayName: string;
  otherUserProfilePicture: string;
  lastMessageText?: string;
  lastMessageTimestamp?: any; // or Timestamp if using Firestore
  lastMessageSenderUid?: string;
  isRead?: boolean;
};

function Messages({
  threadId,
  currentUserUid,
  senderDisplayName,
  senderProfilePicture,
  setHasUnreadMessages,
  messagesOpen,
  setDmThreadFromSendMessageForm,
}: {
  threadId: string;
  currentUserUid?: string;
  senderDisplayName?: string;
  senderProfilePicture?: string;
  setDmThreadFromSendMessageForm: (threadId: string | null) => void;
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
  const [clearDmThread, setClearDmThread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const liveSelectedUsersData = useLiveUserData(selectedUsersUid || "");

  useEffect(() => {
    const messageContainer = messagesEndRef.current;
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages, selectedThread]);

  function handleSelectedThread(threadId: string) {
    if (selectedThread === threadId) {
      setSelectedThread(null);
    } else {
      setSelectedThread(threadId);
    }
  }

  useEffect(() => {
    if (clearDmThread) return;
    if (threadId) {
      setSelectedThread(threadId);
      const selectedThreadData = userDmThreads.find(
        (thread) => thread.threadId === threadId
      );
      if (selectedThreadData) {
        setSelectedUsersDisplayName(liveSelectedUsersData?.displayName || selectedThreadData.otherUserDisplayName);
        setSelectedUsersProfilePicture(
          liveSelectedUsersData?.profilePicture || selectedThreadData.otherUserProfilePicture
        );
        setSelectedUsersUid(selectedThreadData.otherUserUid);
      }
    }

    setUnreadMessages(
      userDmThreads.some(
        (thread) =>
          thread.isRead === false &&
          thread.lastMessageSenderUid !== currentUserUid
      )
    );
    if (setHasUnreadMessages) {
      setHasUnreadMessages(unreadMessages);
    }

    if (!messagesOpen) {
      setSelectedThread(null);
    }
  }, [
    threadId,
    userDmThreads,
    selectedThread,
    currentUserUid,
    unreadMessages,
    setHasUnreadMessages,
    messagesOpen,
  ]);

  

  function handleCloseThread() {
    setSelectedThread(null);
    setDmThreadFromSendMessageForm(null);
    setClearDmThread(true);
  }

  return (
    <div>
      {(selectedThread === null || selectedThread === undefined) &&
        userDmThreads.map((thread) => (
          <ThreadItem
            key={thread.threadId}
            thread={thread}
            currentUserUid={currentUserUid}
            onSelect={(thread: DmThread) => {
                 handleSelectedThread(thread.threadId);
                  setSelectedUsersDisplayName(thread.otherUserDisplayName);
                  setSelectedUsersProfilePicture(thread.otherUserProfilePicture);
                  setSelectedUsersUid(thread.otherUserUid);
              }
            }
          />
        ))}
      {selectedThread && (
        <div className="relative">
          <div
            ref={messagesEndRef}
            className="overflow-y-auto max-h-[50vh] p-2 pb-12"
          >
            <div className="sticky top-[-8] left-100 w-full bg-blue-950 text-white flex items-center space-x-4 rounded p-1 px-2">
              <img
                className="h-8 w-8 rounded-full inline-block mr-2"
                src={liveSelectedUsersData?.profilePicture || selectedUsersProfilePicture}
                alt={`${selectedUsersDisplayName}'s profile pic`}
              />
              <h1>{liveSelectedUsersData?.displayName || selectedUsersDisplayName}</h1>
              <button
                onClick={handleCloseThread}
                className="ml-auto cursor-pointer"
              >
                <IoIosCloseCircleOutline size={24} />
              </button>
            </div>

            <div className="">
              {messages.map((message) => (
                <div key={message.id}>
                  {message.senderUid === currentUserUid ? (
                    <div className="flex flex-col justify-end items-end space-x-2">
                      <div className="rounded-2xl p-3 bg-gradient-to-t from-purple-300 via-blue-800 to-blue-400 text-white text-sm my-1 w-2/3">
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start items-end space-x-2">
                      <div className="h-8 w-8 rounded-full mb-2">
                        <img
                          className="h-8 w-8 rounded-full inline-block mr-2"
                          src={liveSelectedUsersData?.profilePicture || message.senderProfilePicture}
                          alt={`${message.senderDisplayName}'s profile pic`}
                        />
                      </div>
                      <div className="rounded-2xl p-3 bg-gradient-to-t from-gray-300 via-gray-100 to-gray-300 text-sm my-1 w-2/3">
                        {message.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-white pt-1">
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
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
