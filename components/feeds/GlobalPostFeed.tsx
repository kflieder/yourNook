"use client";
import React, { useState } from "react";
import { usePaginatedPosts } from "@/utilities/usePaginatedPosts";
import LivePost from "components/post/LivePost";
interface GlobalPostFeedProps {
  currentUser: { uid: string; displayName: string; profilePicture?: string };
}

function GlobalPostFeed({ currentUser }: GlobalPostFeedProps) {
  const { posts: latestPosts, loading, hasMore, loadMoreRef } = usePaginatedPosts(
    "posts",
    "createdAt",
    currentUser.uid,
    "uid"
  );
  const { posts: trendingPosts, loading: trendingLoading, hasMore: trendingHasMore, loadMoreTrendingRef } = usePaginatedPosts(
    "posts",
    "likeCount",
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
      <>
        <div className="flex items-start justify-around w-full">
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

            <div className={`${activePostTab === "latest" ? "" : "hidden"}`}>
              {latestPosts.map((post) => (
                <div key={post.id} className="w-full rounded flex justify-center">
                  <LivePost
                    post={post}
                    currentUser={currentUser.uid}
                    currentUserDisplayName={currentUser.displayName}
                    styleSelector="feed"
                  />
                </div>
              ))}
              {hasMore && <div ref={loadMoreRef} />}
              {loading && <p>Loading...</p>}
            </div>
          


          <div className={`${activePostTab === "trending" ? "" : "hidden"}`}>
            {trendingPosts.map((post) => (
              <div key={post.id} className="w-full rounded flex justify-center">
                <LivePost
                  post={post}
                  currentUser={currentUser.uid}
                  currentUserDisplayName={currentUser.displayName}
                  styleSelector="feed"
                />
              </div>
            ))}
            {trendingHasMore && <div ref={loadMoreTrendingRef} />}
            {trendingLoading && <p>Loading...</p>}
          </div>

      </>
      
  );
}

export default GlobalPostFeed;
