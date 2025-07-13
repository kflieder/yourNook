import React from "react";

interface CommentProps {
  comment: {
    id: string;
    displayName: string;
    text: string;
    createdAt: any;
  };
}

function Comment({ comment }: CommentProps) {
  return <div>
    <li key={comment.id} className="border-b p-2">
                <p><strong>{comment.displayName}</strong>: {comment.text}</p>
                <span className="text-gray-500 text-sm">{comment.createdAt?.toDate?.().toLocaleString?.() || 'uknown date'}</span>
     </li>
  </div>;
}

export default Comment;
