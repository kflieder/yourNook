'use client';
import React from "react";
import { usePaginatedPosts } from "@/utilities/usePaginatedPosts";
import LivePost from "components/post/LivePost";
import CreatePost from "components/profile/CreatePost";
import DMComponent from "components/profile/DMs/DMComponent";

interface GlobalPostFeedProps {
  currentUser: { uid: string, displayName: string, profilePicture?: string };
}

function GlobalPostFeed({ currentUser }: GlobalPostFeedProps) {
  const { posts, loading, hasMore, loadMoreRef } =
    usePaginatedPosts("posts", "createdAt", currentUser.uid, "uid");
 
  return (
    <div className='flex w-full justify-between border h-screen pt-30 pr-0'>
      <div className='flex flex-col gap-y-4 px-10 overflow-scroll w-164'>
        <h1>Latest Posts</h1>
      {posts.map((post) => (
        <LivePost key={post.id} post={post} currentUser={currentUser.uid} currentUserDisplayName={currentUser.displayName} />
      ))}
      {loading && <p>Loading...</p>}
      {hasMore && <div ref={loadMoreRef} />}
      </div>
      <div className="flex flex-col gap-y-4 px-10 pt-10 overflow-scroll">
        <DMComponent currentUser={currentUser.uid} targetUser={currentUser.uid} />
        <CreatePost />
      </div>
    </div>
  );
}

export default GlobalPostFeed;
