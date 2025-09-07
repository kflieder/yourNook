"use client";
import React, { useState } from "react";
import { usePaginatedPosts } from "@/utilities/usePaginatedPosts";
import LivePost from "components/post/LivePost";
interface GlobalPostFeedProps {
  currentUser: { uid: string; displayName: string; profilePicture?: string };
}

function GlobalPostFeed({ currentUser }: GlobalPostFeedProps) {
  const { posts, loading, hasMore, loadMoreRef } = usePaginatedPosts(
    "posts",
    "createdAt",
    currentUser.uid,
    "uid"
  );
  const [activePostTab, setActivePostTab] = useState<
    "latest" | "trending" | "friends"
  >("latest");
  
  function handleTabChange(tab: "latest" | "trending" | "friends") {
    if (activePostTab === tab) return;
    setActivePostTab(tab);
    console.log(`Active post tab changed to: ${tab}`);
  }

 

  return (
      <div>
        <div className="flex items-start justify-around w-full sm:mt-5">
          <h1
            onClick={() => handleTabChange("latest")}
            className={`cursor-pointer ${
              activePostTab === "latest" ? "font-bold" : ""
            }`}
          >
            Latest
          </h1>
          <h1
            onClick={() => handleTabChange("trending")}
            className={`cursor-pointer ${
              activePostTab === "trending" ? "font-bold" : ""
            }`}
          >
            Trending
          </h1>
          <h1
            onClick={() => handleTabChange("friends")}
            className={`cursor-pointer ${
              activePostTab === "friends" ? "font-bold" : ""
            }`}
          >
            Friends
          </h1>
        </div>
        {posts.map((post) => (
          <div key={post.id} className="w-full rounded flex justify-center">
            <LivePost
              post={post}
              currentUser={currentUser.uid}
              currentUserDisplayName={currentUser.displayName}
              styleSelector="feed"
            />
          </div>
        ))}
        {loading && <p>Loading...</p>}
        {hasMore && <div ref={loadMoreRef} />}
      </div>
      
  );
}

export default GlobalPostFeed;
