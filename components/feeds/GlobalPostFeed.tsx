"use client";
import React, { useState } from "react";
import { usePaginatedPosts } from "@/utilities/usePaginatedPosts";
import LivePost from "components/post/LivePost";
import { useMutualFriends } from "@/utilities/useMutualFriends";
import { log } from "console";


interface GlobalPostFeedProps {
  currentUser: { uid: string; displayName: string; profilePicture?: string };
  logInPage?: boolean;
}

function GlobalPostFeed({ currentUser, logInPage }: GlobalPostFeedProps) {
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

  const mutualFriends  = useMutualFriends(currentUser.uid);
  const friendUids = mutualFriends.map((friend) => friend.uid);
  const { posts: latestFriendsPosts, loading: latestLoading, hasMore: latestFriendsHasMore, loadMoreRef: loadMoreFriendsRef } = usePaginatedPosts(
    "posts",
    "createdAt",
    currentUser.uid,
    "uid",
    friendUids
  );

  function handleTabChange(tab: "latest" | "trending" | "friends") {
    if (activePostTab === tab) return;
    setActivePostTab(tab);
    console.log(`Active post tab changed to: ${tab}`);
  }
 
 

  return (
      <>
        <div className="flex items-start justify-around w-full">
          <div className={`flex  justify-around gap-x-4 p-2 w-full sm:w-1/3 ${logInPage ? "hidden" : ""}`}>
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
            } ${logInPage ? "hidden" : ""}`}
          >
            Friends
          </h1>
          </div>
        </div>

            <div className={`${activePostTab === "latest" ? "" : "hidden"} h-full`}>
              {latestPosts.map((post) => (
                <div key={post.id} className="w-full mb-2 rounded flex justify-center">
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
              {!hasMore && !loading && (
                <p className="text-center text-gray-700 pt-3">You’ve reached the end of the internet… just kidding! 😎 We’re a growing community. Feel free to add a post or check back later for fresh content!</p>
              )}
            </div>
          


          <div className={`${activePostTab === "trending" ? "" : "hidden"}`}>
            {trendingPosts.map((post) => (
              <div key={post.id} className="w-full mb-4 rounded flex justify-center">
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
          <div className={`${activePostTab === "friends" ? "" : "hidden"}`}>
            {latestFriendsPosts.map((post) => (
              <div key={post.id} className="w-full mb-4 rounded flex justify-center">
                <LivePost
                  post={post}
                  currentUser={currentUser.uid}
                  currentUserDisplayName={currentUser.displayName}
                  styleSelector="feed"
                />
              </div>
            ))}
            {latestFriendsHasMore && <div ref={loadMoreFriendsRef} />}
            {latestLoading && <p>Loading...</p>}
          </div>
      </>
      
  );
}

export default GlobalPostFeed;
