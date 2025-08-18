"use client";
import React, { useState, useRef } from "react";
import { sendMessage, getOrCreateDmThread } from "@/utilities/dmThreadHelper";

function SendMessageForm({
  currentUserUid,
  senderDisplayName,
  senderProfilePicture,
  selectedTargetUserUid,
  targetUserDisplayName,
  targetUserProfilePicture,
  setDmThreadFromSendMessageForm,
  toggleNewMessageStateFromSendMessageForm,
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
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isSending, setIsSending] = useState(false);


  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSending(true);
      const newMessageThreadId = await getOrCreateDmThread(
        currentUserUid,
        selectedTargetUserUid || "",
        targetUserDisplayName,
        targetUserProfilePicture,
        senderDisplayName,
        senderProfilePicture
      );

      const message = {
        senderUid: currentUserUid,
        content: messageContent,
        timestamp: new Date(),
        clientTimestamp: new Date(),
        senderDisplayName: senderDisplayName,
        senderProfilePicture: senderProfilePicture,
        targetUserDisplayName: targetUserDisplayName,
        targetUserProfilePicture: targetUserProfilePicture,
        read: false,
      };

      if (setDmThreadFromSendMessageForm) {
        setDmThreadFromSendMessageForm(newMessageThreadId || null);
      }
      if (toggleNewMessageStateFromSendMessageForm) {
        toggleNewMessageStateFromSendMessageForm(false);
      }
      setMessageContent("");
      await sendMessage(newMessageThreadId || "", message);
      
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "40px"; // Reset to default height
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageContent(e.target.value);
    if (e.target.scrollHeight > e.target.clientHeight) {
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
    if (e.target.value.trim() === "") {
      e.target.style.height = "40px"; // Reset to default height
    }
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center border rounded-3xl"
      >
        <textarea
          ref={textAreaRef}
          placeholder="Type your message here..."
          className="w-full px-4 pt-2 h-10 focus:outline-none focus:bg-gray-100 rounded-3xl resize-none overflow-hidden"
          value={messageContent}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className={`text-white p-2.5  rounded-4xl text-sm ${
            messageContent.trim()
              ? "bg-blue-950 cursor-pointer"
              : "bg-blue-950/50 cursor-not-allowed"
          }`}
          disabled={!messageContent.trim()}
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default SendMessageForm;
