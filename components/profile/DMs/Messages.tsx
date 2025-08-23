import React, { useEffect, useState, useRef } from "react";
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
        setSelectedUsersDisplayName(selectedThreadData.otherUserDisplayName);
        setSelectedUsersProfilePicture(
          selectedThreadData.otherUserProfilePicture
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

  function handleCloseThread() {
    setSelectedThread(null);
    setDmThreadFromSendMessageForm(null);
    setClearDmThread(true);
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
              className="flex items-center space-x-4 border-b py-1 hover:bg-gray-100"
              key={thread.threadId}
            >
              <div className="flex w-full items-center space-x-4 cursor-pointer">
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border">
                  <img
                    className="w-14 h-14 object-cover border rounded-full mr-2"
                    src={thread.otherUserProfilePicture}
                    alt={`${thread.otherUserDisplayName}'s profile`}
                  />
                </div>

                <div className="flex flex-col w-full  overflow-hidden">
                  <div className="flex items-end w-full capitalize">
                    <div className="font-bold">
                      {thread.otherUserDisplayName}
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
        })}
      {selectedThread && (
        <div className="relative">
          <div
            ref={messagesEndRef}
            className="overflow-y-auto max-h-[50vh] p-2 pb-12"
          >
            <div className="sticky top-[-8] left-100 w-full bg-blue-950 text-white flex items-center space-x-4 rounded p-1 px-2">
              <img
                className="h-8 w-8 rounded-full inline-block mr-2"
                src={selectedUsersProfilePicture || ""}
                alt={`${selectedUsersDisplayName}'s profile`}
              />
              <h1>{selectedUsersDisplayName}</h1>
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
                          src={message.senderProfilePicture}
                          alt={`${message.senderDisplayName}'s profile`}
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
