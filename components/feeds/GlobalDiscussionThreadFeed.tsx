import React from 'react'
import { usePaginatedPosts } from '@/utilities/usePaginatedPosts'
import DiscussionThreadStyle from 'components/discussionThreads/DiscussionThreadStyle';

function GlobalDiscussionThreadFeed({ currentUser }: { currentUser: string }) {
    const { posts, loading, hasMore, loadMoreRef } = usePaginatedPosts("discussionThreads", "createdAt", currentUser, "authorId");
  return (
    <div className='gap-y-2 flex flex-col'>
      <h2>Global Discussion Threads</h2>
      {loading && <p>Loading...</p>}
      {!loading && posts.length === 0 && <p>No threads found.</p>}
      {posts.map((post) => (
        <div key={post.id}>
          <DiscussionThreadStyle
            currentUser={currentUser}
            title={post.title}
            content={post.content}
            createdAt={post.createdAt}
          />
        </div>
      ))}
      {hasMore && <div ref={loadMoreRef}>Loading more...</div>}
    </div>
  )
}

export default GlobalDiscussionThreadFeed
