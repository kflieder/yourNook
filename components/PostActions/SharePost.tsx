import React from 'react'
import { FaShare } from "react-icons/fa";

interface SharePostProps {
  postId: string;
}

function SharePost({ postId }: SharePostProps) {
    const handleshare = async (postId: string) => {
        try {
           const url = `${window.location.origin}/feed/${postId}`;
              await navigator.clipboard.writeText(url);
              alert('Post link copied to clipboard!'); 
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
