import React, { useState, useEffect } from "react";
import PostStyle from "../post/PostStyle";
import { useAuth } from "@/context/AuthContext";

function UserPosts({
  posts,
}: {
  posts: Array<{ id: string; [key: string]: any }>;
}) {
  const { username: currentUser } = useAuth();



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
                  profilePicture={post.profilePicture}
                  textContent={post.content}
                  mediaUrl={post.mediaUrl}
                  createdAt={post.createdAt}
                  docId={post.id}
                  currentLikes={post.likes}
                  collectionName="posts"
                  targetUid={post.uid}
                  currentUser={currentUser?.uid || ''}
                   />
             </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default UserPosts;
