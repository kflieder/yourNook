'use client'
import React from 'react'
import { usePaginatedPosts } from '@/utilities/usePaginatedPosts';
import BlogStyle from 'components/blog/BlogStyle';

interface GlobalBlogFeedProps {
  currentUser: string;
  currentUserDisplayName: string;
}


function GlobalBlogFeed({ currentUser, currentUserDisplayName }: GlobalBlogFeedProps) {
  const { posts, loading, hasMore, loadMoreRef } = usePaginatedPosts("blogs");
  return (
    <div className='flex flex-col items-center justify-center'>
      {loading && <p>Loading...</p>}
      {!loading && posts.length === 0 && <p>No blogs found.</p>}
      {posts.map((post) => (
        <div key={post.id} className='w-1/2 gap-y-4 p-4 border'>
        <BlogStyle
          id={post.id}
          title={post.title}
          content={post.content}
          imageUrl={post.imageUrl}
          createdAt={post.createdAt}
          authorDisplayName={post.authorDisplayName}
          profilePicture={post.profilePicture}
          currentLikes={post.likes}
          currentUser={currentUser}
          currentUserDisplayName={currentUserDisplayName}
          authorUid={post.authorId}
        />
        </div>
      ))}
      {hasMore && <div ref={loadMoreRef}>Load more...</div>}
    </div>
  )
}

export default GlobalBlogFeed
