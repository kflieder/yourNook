"use client";
import React, { useState } from "react";
import { usePostComments } from "@/utilities/usePostComments";
import { useAuth } from "@/context/AuthContext";
import { sendNotification } from "@/utilities/sendNotification";
interface AddCommentFormProps {
  postId: string;
  postAuthorId: string;
  maxChar?: number; 
  parentId?: string | null;
  type?: string;
  message?: string;
  setActiveReplyIdAfterSubmit?: (id: string | null) => void;
}

function AddCommentForm({ postId, postAuthorId, maxChar, parentId, type, message, setActiveReplyIdAfterSubmit }: AddCommentFormProps) {
  const { username: currentUser } = useAuth();
  const { addComment } = usePostComments(postId);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      await addComment({
        uid: currentUser.uid,
        displayName: currentUser?.displayName || "Anonymous",
        text: commentText.trim(),
        parentId: parentId || null,
      });
      await sendNotification({
        toUserId: postAuthorId,
        type: type || "commentPost",
        fromUserId: currentUser.uid,
        message: message,
        postId: postId,
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
      setCommentText("");
      setActiveReplyIdAfterSubmit?.(null);
    }
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any); 
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCommentText(e.target.value);
      if (e.target.scrollHeight > e.target.clientHeight) {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
      }
      if (e.target.value.trim() === "") {
        e.target.style.height = "30px"; // Reset to default height
      }
    };
  
   

  return (
    <form onSubmit={handleSubmit} className="flex items-center border border-gray-200">
      <textarea
        value={commentText}
        onChange={handleInputChange}
        placeholder="Add a comment..."
        className="w-full px-2 pt-1 focus:outline-none focus:bg-gray-100 rounded-3xl resize-none overflow-hidden text-md"
        rows={1}
        disabled={isSubmitting}
        maxLength={maxChar}
        style={{ resize: "none" }}
        onKeyDown={handleKeyDown}
      />
      <small className='h-full flex items-end mr-1 text-xs'>{commentText.length}/{maxChar ? maxChar : 'unlimited'}</small>
      <button
        type="submit"
        className={`text-white p-1 rounded-4xl text-xs ${
            commentText.trim()
              ? "bg-blue-950 cursor-pointer"
              : "bg-blue-950/50 cursor-not-allowed"
          }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Send"}
      </button>
    </form>
  );
}

export default AddCommentForm;
