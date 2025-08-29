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
    <div className='grid grid-cols-5 h-[85vh]'>
    <div className='col-span-3 flex flex-col items-center justify-start hide-scrollbar p-1 overflow-scroll gap-y-4'>
      {loading && <p>Loading...</p>}
      {!loading && posts.length === 0 && <p>No blogs found.</p>}
      {posts.map((post) => (
        <div key={post.id} className='w-full'>
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
          topic={post.topic}
        />
        </div>
      ))}
      {hasMore && <div ref={loadMoreRef}>Load more...</div>}
    </div>
    <div className='col-span-2 h-[80vh] overflow-hidden'>
      <BlogForm authorId={currentUser} authorDisplayName={currentUserDisplayName} />
    </div>
    </div>
  )
}

export default GlobalBlogFeed
