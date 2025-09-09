'use client'
import React, {useState} from 'react'
import { usePaginatedPosts } from '@/utilities/usePaginatedPosts';
import BlogStyle from 'components/blog/BlogStyle';
import CustomTopicSelectDropdown from 'components/topics/CustomTopicSelectDropdown';


interface GlobalBlogFeedProps {
  currentUser: string;
  currentUserDisplayName: string;
  onExpandChange: (expanded: boolean) => void;
}


function GlobalBlogFeed({ currentUser, currentUserDisplayName, onExpandChange }: GlobalBlogFeedProps) {
  const { posts, loading, hasMore, loadMoreRef } = usePaginatedPosts("blogs", "createdAt", currentUser, "authorId");
  const [searchedTopic, setSearchedTopic] = useState('');
  const filteredPosts = searchedTopic ? posts.filter((post) => post.topic === searchedTopic) : posts;
  return (
    <div className='w-full space-y-4 px-10 flex flex-col justify-center items-center'>
      <div className=''>
        <CustomTopicSelectDropdown selectedTopic={searchedTopic} onSelectTopic={setSearchedTopic} styleSelector='feed' />
      </div>
      {loading && <p>Loading...</p>}
      {!loading && posts.length === 0 && <p>No blogs found.</p>}
      {filteredPosts.map((post) => (
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
          onExpandChange={onExpandChange}
        />
      ))}
      {hasMore && <div ref={loadMoreRef}>Load more...</div>}
    </div>
  )
}

export default GlobalBlogFeed
