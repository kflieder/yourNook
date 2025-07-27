'use client'
import React from 'react'
import GlobalPostFeed from './GlobalPostFeed'
import { useAuth } from '@/context/AuthContext'

type FeedPageProps = {
  currentUser: {
    uid: string;
  }
}
function FeedPage() {
  const { username: currentUser } = useAuth();

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <GlobalPostFeed currentUser={currentUser} />
    </div>
  )
}

export default FeedPage