import React, { useState, useEffect } from "react";
import Likes from "../PostActions/Likes";
import CommentSection, { CommentCount } from "../PostActions/Comments/CommentSection";
import SharePost from "../PostActions/SharePost";

function UserPosts({
  posts,
}: {
  posts: Array<{ id: string; [key: string]: any }>;
}) {
  console.log("UserPosts component rendered with posts:", posts);

  const [openPostId, setOpenPostId] = useState<string | null>(null);

  const handleToggleComments = (postId: string) => {
  setOpenPostId((prev) => (prev === postId ? null : postId));
};

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Posts</h2>

      <div className="space-y-4">
        {posts.map(
          (post) => (
            console.log("Rendering post:", post),
            (
              <div key={post.id} className="p-4 border rounded-lg w-84">
                <h3 className='font-bold'>{post.displayName}</h3>
                <p>{post.content || "No content available."}</p>
                {post.mediaUrl?.includes("video") ? (
                  <video controls className="w-full mt-2" src={post.mediaUrl} />
                ) : post.mediaUrl ? (
                  <img
                    src={post.mediaUrl}
                    alt="Post media"
                    className="w-84 mt-2"
                  />
                ) : null}

                <span className="text-gray-500 text-sm">
                  Posted on: {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center">
                  <Likes
                    docId={post.id}
                    currentLikes={post.likes || []}
                    collectionName="posts"
                  />
                  <div onClick={() => handleToggleComments(post.id)} className="ml-2">
                  <CommentCount postId={post.id} />
                  </div>
                  <SharePost  postId={post.id} />
                 </div>
                 {openPostId === post.id && (
                    <CommentSection postId={post.id} />
                 )}
                 
                
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default UserPosts;
