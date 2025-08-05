"use client";
import React, { useState } from "react";
import { sendMessage } from "@/utilities/dmThreadHelper";

function SendMessageForm({
  threadId,
  currentUserUid,
  senderDisplayName,
  senderProfilePicture,
}: {
  threadId: string;
  currentUserUid: string;
  senderDisplayName: string;
  senderProfilePicture?: string;
}) {
  const [messageContent, setMessageContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return; // Prevent sending empty messages

    const message = {
      senderUid: currentUserUid,
      content: messageContent,
      timestamp: new Date(),
      clientTimestamp: new Date(),
      senderDisplayName: senderDisplayName,
      senderProfilePicture: senderProfilePicture
    };

    try {
      await sendMessage(threadId, message);
      setMessageContent(""); // Clear input after sending
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
