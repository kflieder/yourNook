import React from 'react'
import { usePaginatedPosts } from '@/utilities/usePaginatedPosts'
import DiscussionThreadStyle from 'components/discussionThreads/DiscussionThreadStyle';
import { useLiveUserData } from '@/utilities/useLiveUserData';

function GlobalDiscussionThreadFeed({ currentUser }: { currentUser: string }) {
    const { posts, loading, hasMore, loadMoreRef } = usePaginatedPosts("discussionThreads", "createdAt", currentUser, "authorId");
    const currentUserData = useLiveUserData(currentUser);
    console.log(currentUserData, "Current User Data in GlobalDiscussionThreadFeed");
    console.log(currentUserData?.displayName, "Current User Display Name in GlobalDiscussionThreadFeed");
    
  return (
    <div className='gap-y-2 flex flex-col border w-full justify-center items-center px-10 sm:pb-20'>
      <h2>Global Discussion Threads</h2>
      {loading && <p>Loading...</p>}
      {!loading && posts.length === 0 && <p>No threads found.</p>}
      {posts.map((post) => (
        <DiscussionThreadStyle
           key={post.id}
            currentUser={currentUser}
            title={post.title}
            content={post.content}
            createdAt={post.createdAt}
            authorUid={post.authorId}
            currentLikes={post.likes}
            postId={post.id}
            currentUserDisplayName={currentUserData?.displayName}
          />
        
      ))}
      {hasMore && <div ref={loadMoreRef}>Loading more...</div>}
    </div>
  )
}

export default GlobalDiscussionThreadFeed
