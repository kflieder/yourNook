import React, { useState, useEffect } from "react";
import AddCommentForm from "./AddCommentForm";
import { getUserDocHelper } from "@/utilities/userDocHelper";
import { formatTimeAgo } from "@/utilities/formatTimeAgoHelper";

interface CommentProps {
  comment: {
    id: string;
    displayName: string;
    text: string;
    createdAt: any;
    postAuthorId: string;
    replies?: any[];
    parentId?: string | null;
    postId?: string;
    maxChar?: number;
    uid: string;
  };
  maxChar?: number;
  setActiveReplyId?: (id: string | null) => void;
  activeReplyId?: string | null;
  showReplies?: boolean;
  setShowReplies?: (show: boolean) => void;
}

function Comment({
  comment,
  maxChar,
  setActiveReplyId,
  activeReplyId,
  showReplies,
  setShowReplies,
}: CommentProps) {
   const [showNestedReplies, setShowNestedReplies] = useState(false);
  const useCommentersUid = getUserDocHelper(comment.uid);
  const [authorData, setAuthorData] = useState<any>(null);

  useEffect(() => {
    if (!comment.uid) return;
    const fetchCommentersData = async () => {
      const userData = await useCommentersUid?.fetchUserData();
      setAuthorData(userData);
    };
    fetchCommentersData();
  }, [comment.uid]);

  function handleReplyClick() {
    if (activeReplyId === comment.id) {
      setActiveReplyId?.(null);
    } else {
      setActiveReplyId?.(comment.id);
    }
  }

  function handleShowRepliesClick() {
    if (comment.parentId === null) {
      setShowReplies?.(!showReplies);
    } else {
      setShowNestedReplies?.(!showNestedReplies);
    }
  }

  return (
    <>
      <li key={comment.id} className="flex p-2 shadow-md">
        <img
          className="w-8 h-8 rounded-full"
          src={authorData?.profilePicture}
          alt={`${authorData?.displayName}'s profile`}
        />
        <div className="ml-2">
        <div className="flex items-baseline space-x-1">
          <strong>{comment.displayName}</strong> 
          <span> ‧ </span>
          <span className="text-gray-500 text-sm">
            {comment.createdAt ? formatTimeAgo(comment.createdAt.toDate()) : 'Just Now'}
          </span>
        </div>
        <p>
          {comment.text}
        </p>
        <div className='space-x-1 flex items-center'>
        <button
          onClick={handleReplyClick}
          className="text-gray-500 hover:underline cursor-pointer text-xs"
        >
          {activeReplyId === comment.id ? "Cancel Reply" : "Reply"}
        </button>
        {
          comment.replies && comment.replies.length > 0 && (
            <span> ‧ </span>
          )
        }
        {comment.replies && comment.replies.length > 0 && (
          <button
            onClick={handleShowRepliesClick}
            className="text-gray-500 hover:underline cursor-pointer text-xs"
          >
            {comment.parentId === null
              ? showReplies
                ? "Hide Replies"
                : `Show ${comment.replies.length} replies`
              : showNestedReplies
              ? "Hide Replies"
              : `Show Replies (${comment.replies.length})`}
          </button>
        )}
        </div>
        {activeReplyId === comment.id && (
          <div className="border border-gray-300 rounded-2xl overflow-hidden">
          <AddCommentForm
            postId={comment.postId ?? ""}
            parentId={comment.id}
            postAuthorId={comment.postAuthorId}
            maxChar={maxChar}
            setActiveReplyIdAfterSubmit={setActiveReplyId}
          />
          </div>
        )}
        </div>
      </li>
      {(comment.parentId === null ? showReplies : showNestedReplies) &&
        showReplies &&
        comment.replies &&
        comment.replies.length > 0 && (
          <ul className="ml-4 max-h-84 overflow-y-auto hide-scrollbar">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="border-l-2 pl-4">
                <Comment
                  key={reply.id}
                  comment={reply}
                  maxChar={maxChar}
                  setActiveReplyId={setActiveReplyId}
                  activeReplyId={activeReplyId}
                  setShowReplies={setShowReplies}
                  showReplies={showReplies}
                />
              </div>
            ))}
          </ul>
        )}
    </>
  );
}

export default Comment;
