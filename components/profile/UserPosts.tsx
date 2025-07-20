import React, { useState, useEffect } from "react";
import PostStyle from "../post/PostStyle";
import { useAuth } from "@/context/AuthContext";
import { useLiveUserData } from "@/utilities/useLiveUserData";
import LivePost from "components/post/LivePost";

function UserPosts({
  posts,
}: {
  posts: Array<{ id: string; [key: string]: any }>;
}) {
  const { username: currentUser } = useAuth();

  console.log(currentUser?.displayName, "Current User Display Name in UserPosts");


  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Posts</h2>

      <div className="space-y-4">
        {posts.map((post) => (
        <div
          key={post.id}
        >
          <LivePost
            post={post}
            currentUser={currentUser?.uid || ''}
            currentUserDisplayName={currentUser?.displayName || ''} />
        </div>
      )
      )}
      </div>
    </div>
  );
}

export default UserPosts;
