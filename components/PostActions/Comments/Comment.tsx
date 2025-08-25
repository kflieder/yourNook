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
}

function Comment({ comment, maxChar, setHideCommentFormWhileReplying }: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  function handleReplyClick() {
    if (activeReplyId) {
      setActiveReplyId(null);
    }
    setActiveReplyId(comment.id);
    setShowReplyForm(true);
    setHideCommentFormWhileReplying?.(true);
  }

  return <div>
    <li key={comment.id} className="border-b p-2">
                <p><strong>{comment.displayName}</strong>: {comment.text}</p>
                <span className="text-gray-500 text-sm">{comment.createdAt?.toDate?.().toLocaleString?.() || 'uknown date'}</span>
                {!showReplyForm && (<button onClick={handleReplyClick} className="text-blue-500 hover:underline cursor-pointer ml-1">
                  Reply
                </button>)}
                {comment.replies && comment.replies.length > 0 && (
                  <ul className="ml-4 mt-2">
                    {comment.replies.map((reply) => (
                      <Comment key={reply.id} comment={reply} maxChar={maxChar} />
                    ))}
                  </ul>
                )}
                 {showReplyForm && activeReplyId === comment.id && (
                  <AddCommentForm
                    postId={comment.postId ?? ""}
                    parentId={comment.id}
                    postAuthorId={comment.authorId}
                    maxChar={maxChar}
                    setShowReplyForm={setShowReplyForm}
                  />
                )}
              </li>
            </div>;
}

export default Comment;
