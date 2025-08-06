"use client";
import React, { useState } from "react";
import { sendMessage, getOrCreateDmThread } from "@/utilities/dmThreadHelper";

function SendMessageForm({
  currentUserUid,
  senderDisplayName,
  senderProfilePicture,
  selectedTargetUserUid,
  targetUserDisplayName,
  targetUserProfilePicture,
  setDmThreadFromSendMessageForm,
  toggleNewMessageStateFromSendMessageForm
}: {
  threadId?: string;
  currentUserUid: string;
  senderDisplayName: string;
  senderProfilePicture?: string;
  selectedTargetUserUid?: string;
  targetUserDisplayName?: string;
  targetUserProfilePicture?: string;
  setDmThreadFromSendMessageForm?: (threadId: string | null) => void;
  toggleNewMessageStateFromSendMessageForm?: (state: boolean) => void;
}) {
  const [messageContent, setMessageContent] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;

    try {
      const newMessageThreadId = await getOrCreateDmThread(
        currentUserUid,
        selectedTargetUserUid || "",
        targetUserDisplayName,
        targetUserProfilePicture,
        senderDisplayName,
        senderProfilePicture,
      );

      const message = {
        senderUid: currentUserUid,
        content: messageContent,
        timestamp: new Date(),
        clientTimestamp: new Date(),
        senderDisplayName: senderDisplayName,
        senderProfilePicture: senderProfilePicture,
        targetUserDisplayName: targetUserDisplayName,
        targetUserProfilePicture: targetUserProfilePicture
      };

      
      if (setDmThreadFromSendMessageForm) {
        setDmThreadFromSendMessageForm(newMessageThreadId);
      }
      if (toggleNewMessageStateFromSendMessageForm) {
        toggleNewMessageStateFromSendMessageForm(false);
      }
      await sendMessage(newMessageThreadId, message);
      setMessageContent(""); // Clear input after sending
     
      console.log(senderDisplayName, 'senderDisplayName')
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="textarea"
          placeholder="Type your message here..."
          className="w-full p-2 border rounded"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default SendMessageForm;
