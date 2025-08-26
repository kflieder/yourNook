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
  setShowReplyForm?: (show: boolean) => void;
  type?: string;
  message?: string;
}

function AddCommentForm({ postId, postAuthorId, maxChar, parentId, setShowReplyForm, type, message }: AddCommentFormProps) {
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
      if (setShowReplyForm){
        setShowReplyForm(false);
      }
    }
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any); 
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center border rounded-3xl">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..."
        className="w-full px-4 focus:outline-none focus:bg-gray-100 rounded-3xl resize-none overflow-hidden"
        rows={1}
        disabled={isSubmitting}
        maxLength={maxChar}
        style={{ resize: "none" }}
        onKeyDown={handleKeyDown}
      />
      <small>{commentText.length}/{maxChar ? maxChar : 'unlimited'}</small>
      <button
        type="submit"
        className={`text-white p-2.5  rounded-4xl text-sm ${
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
