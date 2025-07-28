'use client';
import React from "react";
import { usePaginatedPosts } from "@/utilities/usePaginatedPosts";
import LivePost from "components/post/LivePost";

interface GlobalPostFeedProps {
  currentUser: { uid: string, displayName: string, profilePicture?: string };
}

function GlobalPostFeed({ currentUser }: GlobalPostFeedProps) {
  const { posts, loading, hasMore, loadMoreRef } =
    usePaginatedPosts("posts");

  return (
    <div className='flex flex-col items-center gap-y-4'>
      {posts.map((post) => (
        <LivePost key={post.id} post={post} currentUser={currentUser.uid} currentUserDisplayName={currentUser.displayName} />
      ))}
      {loading && <p>Loading...</p>}
      {hasMore && <div ref={loadMoreRef} />}
    </div>
  );
}

export default GlobalPostFeed;
