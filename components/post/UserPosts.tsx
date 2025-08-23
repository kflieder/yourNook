"use client";

import React, { useEffect, useState, useRef } from "react";
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
  const [showThumbnails, setShowThumbnails] = useState(true);
  const postRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [clickedPostId, setClickedPostId] = useState<string | null>(null);

 
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

  function onThumbnailClick(postId: string) {
    setClickedPostId((prev) => (prev === postId ? null : postId));
    setShowThumbnails(false);
    console.log("Thumbnail clicked:", postId);
  }

  useEffect(() => {
    if (clickedPostId) {
      const postElement = postRefs.current[clickedPostId];
      if (postElement) {
        postElement.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }
  }, [clickedPostId]);

  return (
    <div className={`grid ${showThumbnails ? "grid-cols-3" : "grid-cols-1 h-[60vh] overflow-scroll"} gap-4`}>
      {livePosts
        // .filter(post => !post.mediaUrl?.includes("video")) // Filter out video posts
        .map((post) => (
          <div ref={(el) => {postRefs.current[post.id] = el}} key={post.id}>
            <LivePost
              thumbnail={showThumbnails}
              onThumbnailClick={onThumbnailClick}
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
