'use client'
import React from 'react'
import GlobalPostFeed from './GlobalPostFeed'
import { useAuth } from '@/context/AuthContext'
import GlobalBlogFeed from './GlobalBlogFeed'
import GlobalDiscussionThreadFeed from './GlobalDiscussionThreadFeed'



function FeedPage() {
  const { username: currentUser } = useAuth();
  const [activeTab, setActiveTab] = React.useState<'posts' | 'blogs' | 'threads'>('posts'); 

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  function handleTabChange(tab: 'posts' | 'blogs' | 'threads') {
    setActiveTab(tab);
  }

  const buttonStyle = 'px-4 py-2 rounded-3xl focus:outline-none cursor-pointer';
  const activeButtonStyle = `${buttonStyle} bg-blue-950 text-white`;

  return (
    <div className='flex flex-col items-center justify-center h-full '>
      <div className="fixed top-12 flex w-full justify-center items-center bg-white shadow-md">
      <div className="grid grid-cols-3 justify-around bg-gray-300 w-3/4 rounded-3xl">
        <button onClick={() => handleTabChange('posts')} className={activeTab === 'posts' ? activeButtonStyle : buttonStyle}>Posts</button>
        <button onClick={() => handleTabChange('blogs')} className={activeTab === 'blogs' ? activeButtonStyle : buttonStyle}>Blogs</button>
        <button onClick={() => handleTabChange('threads')} className={activeTab === 'threads' ? activeButtonStyle : buttonStyle}>Threads</button>
      </div>
      </div>

      <div className=''></div>
      {activeTab === 'posts' && <GlobalPostFeed currentUser={{ ...currentUser, displayName: currentUser.displayName ?? '' }} />}
      {activeTab === 'blogs' && <GlobalBlogFeed currentUser={currentUser.uid} currentUserDisplayName={currentUser.displayName ?? ''} />}
     
      {activeTab === 'threads' && <GlobalDiscussionThreadFeed currentUser={currentUser.uid} />}
    </div>
  )
}

export default FeedPage