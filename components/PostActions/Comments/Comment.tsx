import React, {useState} from "react";
import AddCommentForm from "./AddCommentForm";

interface CommentProps {
  comment: {
    id: string;
    displayName: string;
    text: string;
    createdAt: any;
    authorId: string;
    replies?: any[];
    parentId?: string | null;
    postId?: string;
    maxChar?: number;
  };
  maxChar?: number;
  setHideCommentFormWhileReplying?: (isReplying: boolean) => void;
  setActiveReplyId?: (id: string | null) => void;
  activeReplyId?: string | null;
  showReplies?: boolean;
  setShowReplies?: (show: boolean) => void;
}

function Comment({ comment, maxChar, setHideCommentFormWhileReplying, setActiveReplyId, activeReplyId, showReplies, setShowReplies }: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showNestedReplies, setShowNestedReplies] = useState(false);

  function handleReplyClick() {
    if (activeReplyId === comment.id) {
      setActiveReplyId?.(null);
    } else {
      setActiveReplyId?.(comment.id);
    }
    setHideCommentFormWhileReplying?.(!setHideCommentFormWhileReplying);
  }

  function handleShowRepliesClick(){
    if (comment.parentId === null){
      setShowReplies?.(!showReplies);
    } else {
      setShowNestedReplies?.(!showNestedReplies);
    }

    console.log(showNestedReplies);
  }



  return <div>
    <li key={comment.id} className="p-2 border-5 border-red-400">
                <p><strong>{comment.displayName}</strong>: {comment.text}</p>
                <span className="text-gray-500 text-sm">{comment.createdAt?.toDate?.().toLocaleString?.() || 'uknown date'}</span>
                {!showReplyForm && (<button onClick={handleReplyClick} className="text-blue-500 hover:underline cursor-pointer ml-1">
                  {activeReplyId === comment.id ? 'Cancel Reply' : 'Reply'}
                </button>)}
                {comment.replies && comment.replies.length > 0 && (
                  <button onClick={handleShowRepliesClick} className="text-blue-500 hover:underline cursor-pointer ml-1">
                    {(comment.parentId === null ? (showReplies ? 'Hide Replies' : `Show ${comment.replies.length} replies`) : (showNestedReplies ? 'Hide Replies' : `Show Replies (${comment.replies.length})`))}
                  </button>
                )}
                {activeReplyId === comment.id && (
                  <AddCommentForm
                    postId={comment.postId ?? ""}
                    parentId={comment.id}
                    postAuthorId={comment.authorId}
                    maxChar={maxChar}
                    setShowReplyForm={setShowReplyForm}
                  />
                )}
                </li>
                {(comment.parentId === null ? showReplies : showNestedReplies) && showReplies && comment.replies && comment.replies.length > 0 && (
                  <ul className="ml-4 mt-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="ml-4 mt-2 border">
                      <Comment key={reply.id} comment={reply} maxChar={maxChar} setHideCommentFormWhileReplying={setHideCommentFormWhileReplying} setActiveReplyId={setActiveReplyId} activeReplyId={activeReplyId} setShowReplies={setShowReplies} showReplies={showReplies} />
                    </div>
                    ))}
                  </ul>
                )}
            </div>;
}

export default Comment;
