"use client";
import React, { useState } from "react";
import { usePostComments } from "@/utilities/usePostComments";
import Comment from "./Comment";
import AddCommentForm from "./AddCommentForm";
import { LuMessageCircle } from "react-icons/lu";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface CommentSectionProps {
  postId: string;
  postAuthorId: string;
  maxChar?: number;
  type?: string;
  message?: string;
  clickXfunction?: () => void;
}

function CommentSection({
  postId,
  postAuthorId,
  maxChar,
  type,
  message, 
  clickXfunction,
}: CommentSectionProps) {
  const { comments } = usePostComments(postId);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [showReplies, setShowReplies] = useState<boolean>(false);

  function buildCommentTree(comments: any[]) {
    const map = new Map<string, any>();
    const rootComments: any[] = [];
    comments.forEach((comment) => {
      comment.replies = [];
      map.set(comment.id, comment);
    });
    comments.forEach((comment) => {
      if (!comment.parentId) {
        rootComments.push(comment);
      } else {
        const parent = map.get(comment.parentId);
        if (parent) {
          parent.replies.push(comment);
        }
      }
    });

    return rootComments;
  }

  const commentTree = buildCommentTree(comments);
  return (
    <>
      {comments.length === 0 ? (
        <div className="h-full flex flex-col justify-end rounded-4xl">
          <span className="flex flex-col h-full justify-center items-center">
            <p className="font-extrabold text-xl">No Comments yet,</p> be the
            first!
          </span>
          <AddCommentForm
            postId={postId}
            postAuthorId={postAuthorId}
            maxChar={maxChar}
            type={type}
            parentId={null}
            message={message}
          />
          <div className="absolute top-0 right-0 p-2">
            <IoIosCloseCircleOutline
              className="text-gray-500 cursor-pointer"
              size={24}
              onClick={clickXfunction}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-between h-full">
          <ul className="overflow-y-auto max-h-[60vh] p-2 hide-scrollbar">
            {commentTree.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                maxChar={maxChar}
                setActiveReplyId={setActiveReplyId}
                activeReplyId={activeReplyId}
                setShowReplies={setShowReplies}
                showReplies={showReplies}
              />
            ))}
          </ul>

          <div className="sticky bottom-0 left-0 right-0 bg-white">
            <AddCommentForm
              postId={postId}
              postAuthorId={postAuthorId}
              maxChar={maxChar}
              type={type}
              message={message}
              parentId={null}
              
            />
            
          </div>
          <div className="absolute top-0 right-0 p-2">
            <IoIosCloseCircleOutline
              className="text-gray-500 cursor-pointer"
              size={24}
              onClick={clickXfunction}
            />
          </div>
        </div>
      )}
    </>
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
