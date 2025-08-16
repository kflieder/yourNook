"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LivePost from "components/post/LivePost";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

function UserPosts({
  posts: initialPosts,
}: {
  posts: Array<{ id: string; [key: string]: any }>;
}) {
  const { username: currentUser } = useAuth();
  const [livePosts, setLivePosts] = useState(initialPosts);

  // Listen for real-time updates
  useEffect(() => {
    if (!initialPosts?.[0]?.uid) return; // bail early if no uid available

    const q = query(
      collection(db, "posts"),
      where("uid", "==", initialPosts[0].uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLivePosts(updatedPosts);
    });

    return () => unsubscribe();
  }, [initialPosts]);


  return (
    <div className="grid grid-cols-2 gap-4">
      {livePosts
      // .filter(post => !post.mediaUrl?.includes("video")) // Filter out video posts
      .map((post) => (
        <div key={post.id}>
          <LivePost
            thumbnail={true}
            post={post}
            currentUser={currentUser?.uid || ""}
            currentUserDisplayName={currentUser?.displayName || ""}
            styleSelector="profile"
          />
        </div>
      ))}
    </div>
  );
}

export default UserPosts;
