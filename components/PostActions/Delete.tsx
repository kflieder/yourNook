import React from 'react'
import deletePost from '@/utilities/deletePost'
import { FaRegTrashCan } from "react-icons/fa6";

function Delete({postId}: { postId: string }) {
  async function handleDelete() {
    try {
      await deletePost(postId);
      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  }

  return (
    <div onClick={handleDelete} className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white cursor-pointer hover:bg-red-600 transition-colors duration-200">
      <FaRegTrashCan />
      
    </div>
  )
}

export default Delete
