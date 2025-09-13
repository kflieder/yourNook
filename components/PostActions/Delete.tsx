import React from 'react'
import deletePost from '@/utilities/deletePost'
import { FaRegTrashCan } from "react-icons/fa6";

function Delete({postId, collection}: { postId: string, collection: string }) {
  async function handleDelete() {
    try {
      await deletePost(postId, collection);
      console.log("Post deleted successfully");
      console.log("Delete function called with postId:", postId);
    console.log('hi')
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
    
  }
  console.log("Delete function called with postId:", postId);
 
  return (
    <div onClick={handleDelete} className="flex hover:bg-gray-200 cursor-pointer justify-start space-x-1 items-center">
      <FaRegTrashCan size={16} />
      <p>Delete</p>
    </div>
  )
}

export default Delete
