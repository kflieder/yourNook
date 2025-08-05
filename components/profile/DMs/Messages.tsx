import React, { useState } from "react";
import { useLiveMessages } from "@/utilities/useLiveMessages";
import { useUserDmThreads } from "@/utilities/useUserDmThreads";
import SendMessageForm from "./SendMessageForm";

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

  console.log(currentUserUid);
  console.log("hiiii", userDmThreads);

  function handleSelectedThread(threadId: string) {
    if (selectedThread === threadId) {
      setSelectedThread(null);
    } else {
      setSelectedThread(threadId);
    }
    
  }

  console.log("Selected thread:", useLiveMessages(selectedThread || threadId));

  return (
    <div>
      {userDmThreads.map((thread) => (
        <div onClick={() => handleSelectedThread(thread.threadId)} className="flex items-center space-x-4 p-2 border-b" key={thread.threadId}>
          <strong>
            <img
              className="h-12 w-12 border rounded-full"
              src={thread.otherUserProfilePicture}
              alt={`${thread.otherUserDisplayName}'s profile`}
            />
          </strong>
          <strong>{thread.otherUserDisplayName}</strong>
        </div>
      ))}
      { selectedThread && (
        <div className="p-4">
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
