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
}

function Comment({ comment, maxChar }: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false); 
  

  
  return <div>
    <li key={comment.id} className="border-b p-2">
                <p><strong>{comment.displayName}</strong>: {comment.text}</p>
                <span className="text-gray-500 text-sm">{comment.createdAt?.toDate?.().toLocaleString?.() || 'uknown date'}</span>
                {!showReplyForm && (<button onClick={() => setShowReplyForm(!showReplyForm)} className="text-blue-500 hover:underline">
                  Reply
                </button>)}
                {comment.replies && comment.replies.length > 0 && (
                  <ul className="ml-4 mt-2">
                    {comment.replies.map((reply) => (
                      <Comment key={reply.id} comment={reply} maxChar={maxChar} />
                    ))}
                  </ul>
                )}
                 {showReplyForm && (
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
