import React from 'react'
import { FaShare } from "react-icons/fa";
import { sendNotification } from '@/utilities/sendNotification';

interface SharePostProps {
  postId: string;
  postAuthorId: string; 
  currentUser: string; 
  currentUserDisplayName: string; 
}

function SharePost({ postId, postAuthorId, currentUser, currentUserDisplayName }: SharePostProps) {
    const handleshare = async (postId: string) => {
        try {
           const url = `${window.location.origin}/feed/${postId}`;
              await navigator.clipboard.writeText(url);
              alert('Post link copied to clipboard!'); 
              await sendNotification({
                toUserId: postAuthorId,
                type: 'share',
                fromUserId: currentUser,
                message: `${currentUserDisplayName || "Someone"} shared your post!`
              });
        } catch (error) {
           console.error("Error copying post link:", error); 
        }
    }

  return (
    <div>
      <FaShare size={20}
        className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors ml-1"
        onClick={() => handleshare(postId)} 
        title="Share Post" />
    </div>
  )
}

export default SharePost
