import React, { useState, useEffect } from "react";
import CommentSection, { CommentCount } from "../PostActions/Comments/CommentSection";
import Likes from "../PostActions/Likes";
import SharePost from "../PostActions/SharePost";
import PostStyle from "../post/PostStyle";

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
             <div key={post.id}>
                <PostStyle
                  displayName={post.displayName}
                  textContent={post.content}
                  mediaUrl={post.mediaUrl}
                  createdAt={post.createdAt}
                  docId={post.id}
                  currentLikes={post.likes}
                  collectionName="posts"
                   />

                
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
