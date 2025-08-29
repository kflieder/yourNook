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
    <div className="w-full grid grid-cols-1 sm:grid-cols-5 justify-between h-screen sm:h-[80vh]">
      <div className="col-span-3 flex flex-col gap-y-4 overflow-scroll overflow-x-hidden hide-scrollbar">
        <div className="flex items-start justify-around w-full sm:mt-10">
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
      <div className="hidden h-[80vh] sm:flex flex-col col-span-2 gap-y-4 pt-20 pr-2 overflow-auto overflow-x-hidden hide-scrollbar">
        <DMComponent
          currentUser={currentUser.uid}
          targetUser={currentUser.uid}
        />
        <CreatePost />
      </div>
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white flex justify-around p-2">
        <BottomBar currentUser={currentUser.uid} />
      </div>
      
    </div>
  );
}

export default GlobalPostFeed;
