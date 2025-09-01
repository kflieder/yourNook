"use client";
import React, { useState } from "react";
import { usePaginatedPosts } from "@/utilities/usePaginatedPosts";
import LivePost from "components/post/LivePost";
import CreatePost from "components/profile/CreatePost";
import DMComponent from "components/profile/DMs/DMComponent";
import BottomBar from "components/mobileComponents/BottomBar";

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
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 justify-between h-screen sm:h-[80vh]">
      <div className="flex flex-col gap-y-4 overflow-scroll overflow-x-hidden hide-scrollbar">
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
      <div className="hidden lg:flex justify-center items-center">
        <div className='w-116 h-full flex flex-col justify-center gap-y-8'>
        <DMComponent
          currentUser={currentUser.uid}
          targetUser={currentUser.uid}
        />
        <CreatePost />
        </div>
      </div>
      
      
    </div>
  );
}

export default GlobalPostFeed;
