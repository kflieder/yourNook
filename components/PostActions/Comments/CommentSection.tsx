import React, { useState } from 'react'
import { usePostComments } from '@/utilities/usePostComments';
import Comment from './Comment';
import AddCommentForm from './AddCommentForm';
import { LuMessageCircle } from 'react-icons/lu';

interface CommentSectionProps {
    postId: string;
    }

function CommentSection({postId}: CommentSectionProps) {
    const { comments } = usePostComments(postId);
    const [toggleComments, setToggleComments] = useState(false);

    const handleToggleComments = () => {
        setToggleComments(prev => !prev); 
    }
  return (
    <div>
      <div className='cursor-pointer flex gap-1 mr-1' onClick={handleToggleComments}>
        <LuMessageCircle size={20} />
        {comments.length}
      </div>
      <div className={`${toggleComments ? 'block' : 'hidden'}`} >
      { comments.length === 0 ? (
        <div>
        <p>No Comments yets, be the first!</p>
        <AddCommentForm postId={postId} />
        </div>
      ) : (
        <div>
           <AddCommentForm postId={postId} />
     <ul>
        {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
        ))}
     </ul>
        </div>
      )}
     </div>
    </div>
  )
}

export default CommentSection
