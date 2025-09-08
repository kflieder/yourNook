import React, {useState} from 'react'
import { usePaginatedPosts } from '@/utilities/usePaginatedPosts'
import DiscussionThreadStyle from 'components/discussionThreads/DiscussionThreadStyle';
import { useLiveUserData } from '@/utilities/useLiveUserData';
import CustomTopicSelectDropdown from 'components/topics/CustomTopicSelectDropdown';

function GlobalDiscussionThreadFeed({ currentUser }: { currentUser: string }) {
    const { posts, loading, hasMore, loadMoreRef } = usePaginatedPosts("discussionThreads", "createdAt", currentUser, "authorId");
    const currentUserData = useLiveUserData(currentUser);
    const [searchedTopic, setSearchedTopic] = useState('');
    const filteredPosts = searchedTopic ? posts.filter((post) => post.topic === searchedTopic) : posts;

  return (
    <div className='gap-y-2 flex flex-col w-full justify-center items-center px-10 sm:pb-20'>
      <div className=''>
        <CustomTopicSelectDropdown selectedTopic={searchedTopic} onSelectTopic={setSearchedTopic} styleSelector='feed' />
      </div>
      {loading && <p>Loading...</p>}
      {!loading && posts.length === 0 && <p>No threads found.</p>}
      {filteredPosts.map((post) => (
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
            topic={post.topic || ""}
          />
        
      ))}
      {hasMore && <div ref={loadMoreRef}>Loading more...</div>}
    </div>
  )
}

export default GlobalDiscussionThreadFeed
