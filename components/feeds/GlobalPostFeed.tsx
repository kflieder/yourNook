"use client";
import React from "react";
import { usePaginatedPosts } from "@/utilities/usePaginatedPosts";
import LivePost from "components/post/LivePost";
import CreatePost from "components/profile/CreatePost";
import DMComponent from "components/profile/DMs/DMComponent";

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

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-5 justify-between h-screen pt-20">
      <div className="col-span-3 flex flex-col gap-y-4 overflow-scroll overflow-x-hidden hide-scrollbar">
        <h1 className='pt-10'>Latest Posts</h1>
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
      <div className="hidden sm:flex flex-col col-span-2 gap-y-4 pr-5 pt-20 overflow-scroll overflow-x-hidden hide-scrollbar">
        <DMComponent
          currentUser={currentUser.uid}
          targetUser={currentUser.uid}
        />
        <CreatePost />
      </div>
    </div>
  );
}

export default GlobalPostFeed;
