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
import { IoIosCloseCircleOutline } from "react-icons/io";

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
        postElement.scrollIntoView({ behavior: "auto", block: "center" });
      }
    }
  }, [clickedPostId]);

  function closePost() {
    setClickedPostId(null);
    setShowThumbnails(true);
  }

  return (
    <div
      className={`relative rounded w-full grid justify-center items-center sm:pb-20  ${
        showThumbnails ? "grid-cols-3 md:grid-cols-4" : "grid-cols-1 h-[70vh] sm:h-[85vh] overflow-auto"
      } gap-4 hide-scrollbar`}
    >
      {clickedPostId && (
        <div className="sticky top-5 sm:top-2 z-50 h-0 flex justify-end pl-10">
          <IoIosCloseCircleOutline
            className="cursor-pointer rounded-full text-white bg-gray-700/50"
            size={34}
            onClick={closePost}
          />
        </div>
      )}
      {livePosts
        // .filter(post => !post.mediaUrl?.includes("video")) // Filter out video posts
        .map((post) => (
          <div
            ref={(el) => {
              postRefs.current[post.id] = el;
            }}
            key={post.id}
            className="flex justify-center"
          >
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
