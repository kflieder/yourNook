import React from 'react'
import { FaShare } from "react-icons/fa";
import { sendNotification } from '@/utilities/sendNotification';

interface SharePostProps {
  postId: string;
  postAuthorId: string; 
  currentUser: string; 
  currentUserDisplayName: string;
  collectionName: string;
  type: string;
}

function SharePost({ postId, postAuthorId, currentUser, currentUserDisplayName, collectionName, type }: SharePostProps) {
    const handleshare = async (postId: string) => {
        try {
           const url = `${window.location.origin}/feed/${collectionName}/${postId}`;
              await navigator.clipboard.writeText(url);
              alert('Post link copied to clipboard!'); 
              await sendNotification({
                postId: postId,
                toUserId: postAuthorId,
                type: type,
                fromUserId: currentUser,
                message: `${currentUserDisplayName || "Someone"} shared your post!`
              });
              console.log('postAuthorId:', postAuthorId);
              console.log('currentUser:', currentUser);
              console.log('currentUserDisplayName:', currentUserDisplayName);
              console.log('type:', type);
              console.log('postId:', postId);
              console.log('collectionName:', collectionName);
              console.log('url:', url);
              console.log('currentUserDisplayName:', currentUserDisplayName);
              console.log('currentUser:', currentUser);
              console.log('postAuthorId:', postAuthorId);
        } catch (error) {
           console.error("Error copying post link:", error); 
        }
    }

  return (
    <div>
      <FaShare size={20}
        className="cursor-pointer"
        onClick={() => handleshare(postId)} 
        title="Share Post" />
    </div>
  )
}

export default SharePost
