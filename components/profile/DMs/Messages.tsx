import React, { useState } from "react";
import { useLiveMessages } from "@/utilities/useLiveMessages";
import { useUserDmThreads } from "@/utilities/useUserDmThreads";
import SendMessageForm from "./SendMessageForm";
import { IoIosCloseCircleOutline } from "react-icons/io";

function Messages({
  threadId,
  currentUserUid,
  senderDisplayName,
  senderProfilePicture
}: {
  threadId: string;
  currentUserUid?: string;
  senderDisplayName?: string;
  senderProfilePicture?: string;
}) {
  
  const userDmThreads = useUserDmThreads(currentUserUid);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const messages = useLiveMessages(selectedThread || threadId);
  const [selectedUsersDisplayName, setSelectedUsersDisplayName] = useState<string | null>(null);
  const [selectedUsersProfilePicture, setSelectedUsersProfilePicture] = useState<string | null>(null);

 

  function handleSelectedThread(threadId: string) {
    if (selectedThread === threadId) {
      setSelectedThread(null);
    } else {
      setSelectedThread(threadId);
      
    }
  }
 console.log(currentUserUid, 'currentUserUid', selectedUsersDisplayName, 'selectedUsersDisplayName', selectedUsersProfilePicture, 'selectedUsersProfilePicture');

  return (
    <div>
      {selectedThread === null && (userDmThreads.map((thread) => (
        <div onClick={() => {handleSelectedThread(thread.threadId); setSelectedUsersDisplayName(thread.otherUserDisplayName); setSelectedUsersProfilePicture(thread.otherUserProfilePicture);}} className="flex items-center space-x-4 p-2 border-b" key={thread.threadId}>
          <div className='border-b flex items-center space-x-4 cursor-pointer hover:bg-gray-100 p-2'>
          <strong>
            <img
              className="h-12 w-12 border rounded-full"
              src={thread.otherUserProfilePicture}
              alt={`${thread.otherUserDisplayName}'s profile`}
            />
          </strong>
          <strong>{thread.otherUserDisplayName}</strong>
          </div>
        </div>
      ))
    )
      }
      { selectedThread && (
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-4 border-b pb-4">
            <img
              className="h-12 w-12 border rounded-full"
              src={selectedUsersProfilePicture || senderProfilePicture || ""}
              alt={`${selectedUsersDisplayName || senderDisplayName}'s profile`}
            />
          <h1>{selectedUsersDisplayName}</h1>
          <button onClick={() => setSelectedThread(null)} className="ml-auto cursor-pointer">
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
          <SendMessageForm threadId={selectedThread} currentUserUid={currentUserUid ?? ""} senderDisplayName={senderDisplayName ?? ""} senderProfilePicture={senderProfilePicture ?? ""} />
        </div>
      )}
    </div>
  );
}

export default Messages;
