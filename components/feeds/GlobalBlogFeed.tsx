'use client'
import React from 'react'
import { usePaginatedPosts } from '@/utilities/usePaginatedPosts';
import BlogStyle from 'components/blog/BlogStyle';
import BlogForm from 'components/blog/BlogForm';

interface GlobalBlogFeedProps {
  currentUser: string;
  currentUserDisplayName: string;
}


function GlobalBlogFeed({ currentUser, currentUserDisplayName }: GlobalBlogFeedProps) {
  const { posts, loading, hasMore, loadMoreRef } = usePaginatedPosts("blogs", "createdAt", currentUser, "authorId");
  return (
    <div className='w-full space-y-4 px-10'>
     {loading && <p>Loading...</p>}
      {!loading && posts.length === 0 && <p>No blogs found.</p>}
      {posts.map((post) => (
        <BlogStyle
          key={post.id}
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
          topic={post.topic}
        />
      ))}
      {hasMore && <div ref={loadMoreRef}>Load more...</div>}
    </div>
  )
}

export default GlobalBlogFeed
