import React, {useRef} from 'react'
import { FaShare } from "react-icons/fa";
import { sendNotification } from '@/utilities/sendNotification';
import { useAlert } from 'components/customAlertModal/AlertProvider';

interface SharePostProps {
  postId: string;
  postAuthorId: string; 
  currentUser: string; 
  currentUserDisplayName: string;
  collectionName: string;
  type: string;
}

function SharePost({ postId, postAuthorId, currentUser, currentUserDisplayName, collectionName, type }: SharePostProps) {
    const { show } = useAlert();
    const alertRef = useRef<HTMLDivElement | null>(null);

    const handleshare = async (postId: string) => {
        try {
           const url = `${window.location.origin}/feed/${collectionName}/${postId}`;
              await navigator.clipboard.writeText(url);
              show('Post link copied to clipboard!', { bottom: 20, right: 0 }, alertRef);
              await sendNotification({
                postId: postId,
                toUserId: postAuthorId,
                type: type,
                fromUserId: currentUser,
                message: `${currentUserDisplayName || "Someone"} shared your post!`
              });
        } catch (error) {
           console.error("Error copying post link:", error);
           show("Failed to copy post link. Please try again.", { bottom: 20, right: 0 }, alertRef);
        }
    }

  return (
    <div ref={alertRef}>
      <FaShare size={20}
        className="cursor-pointer"
        onClick={() => handleshare(postId)} 
        title="Share Post" />
    </div>
  )
}

export default SharePost
