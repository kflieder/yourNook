import React from 'react'
import DiscussionThreadStyle from './DiscussionThreadStyle'
import { useGetDiscussionThread } from 'src/utilities/threads/useGetDiscussionThread';

function UserDiscussionThreads({ currentUser, targetUser }: { currentUser: any; targetUser: string }) {
  const { discussionThreads, loading } = useGetDiscussionThread(targetUser); 
  console.log("Discussion Threads:", discussionThreads);
  return (
    <div className='space-y-4 sm:pr-20 px-2 sm:pl-16'>
      {loading && <p>Loading discussion threads...</p>}
      {!loading && discussionThreads.length === 0 && <p>No discussion threads found.</p>}
      {discussionThreads.map((thread) => (
        <DiscussionThreadStyle 
        key={thread.id} 
        currentUser={currentUser} 
        title={thread.title} 
        content={thread.content} 
        createdAt={thread.createdAt} 
        authorUid={thread.authorId} 
        currentLikes={thread.likes} 
        postId={thread.id}
        topic={thread.topic || ''}
        usersProfileStyle={true}
        />
      ))}
    </div>
  )
}

export default UserDiscussionThreads
