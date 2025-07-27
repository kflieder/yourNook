'use client';
import React from "react";
import { usePaginatedPosts } from "@/utilities/usePaginatedPosts";
import LivePost from "components/post/LivePost";

interface GlobalPostFeedProps {
  currentUser: { uid: string };
}

function GlobalPostFeed({ currentUser }: GlobalPostFeedProps) {
  const { posts, loading, hasMore, loadMoreRef, fetchMorePosts } =
    usePaginatedPosts("posts");

  return (
    <div>
      {posts.map((post) => (
        <LivePost key={post.id} post={post} currentUser={currentUser.uid} />
      ))}
      {loading && <p>Loading...</p>}
      {hasMore && <div ref={loadMoreRef} />}
    </div>
  );
}

export default GlobalPostFeed;
