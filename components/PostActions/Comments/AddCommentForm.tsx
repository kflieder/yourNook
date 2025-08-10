"use client";
import React, { useState } from "react";
import { usePostComments } from "@/utilities/usePostComments";
import { useAuth } from "@/context/AuthContext";
import { sendNotification } from "@/utilities/sendNotification";
interface AddCommentFormProps {
  postId: string;
  postAuthorId: string;
  maxChar?: number; 
}

function AddCommentForm({ postId, postAuthorId, maxChar }: AddCommentFormProps) {
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
      });
      await sendNotification({
        toUserId: postAuthorId,
        type: "comment",
        fromUserId: currentUser.uid,
        message: `${
          currentUser.displayName || "Someone"
        } commented on your post!`,
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
      setCommentText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mt-4">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..."
        className="w-full p-2 border rounded mb-2"
        rows={3}
        disabled={isSubmitting}
        maxLength={maxChar}
        style={{ resize: "none" }}
      />
      <small>{commentText.length}/{maxChar ? maxChar : 'unlimited'}</small>
      <button
        type="submit"
        className={`bg-blue-500 text-white px-4 py-2 rounded ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Add Comment"}{" "}
      </button>
    </form>
  );
}

export default AddCommentForm;
