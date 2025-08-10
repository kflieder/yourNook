'use client';
import React, { useState } from "react";
import { usePostComments } from "@/utilities/usePostComments";
import Comment from "./Comment";
import AddCommentForm from "./AddCommentForm";
import { LuMessageCircle } from "react-icons/lu";

interface CommentSectionProps {
  postId: string;
  postAuthorId: string; 
  maxChar?: number;
}

function CommentSection({ postId, postAuthorId, maxChar }: CommentSectionProps) {
  const { comments } = usePostComments(postId);
 
  return (
    <div>
      <div>
        {comments.length === 0 ? (
          <div>
            <p>No Comments yets, be the first!</p>
            <AddCommentForm postId={postId} postAuthorId={postAuthorId} maxChar={maxChar} />
          </div>
        ) : (
          <div>
            <AddCommentForm postId={postId} postAuthorId={postAuthorId} maxChar={maxChar} />
            <ul>
              {comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

interface CommentCountProps {
  postId: string;
}

export function CommentCount({ postId }: CommentCountProps) {
  const { comments } = usePostComments(postId);
  return (
    <div className="cursor-pointer flex gap-1 mr-1">
      <LuMessageCircle size={20} />
      {comments.length}
    </div>
  );
}


export default CommentSection;
