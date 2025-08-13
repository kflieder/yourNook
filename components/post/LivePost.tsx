'use client'
import React from 'react'
import { useLiveUserData } from '@/utilities/useLiveUserData';
import PostStyle from './PostStyle';

function LivePost({ post, currentUser, currentUserDisplayName, width }: { post: any; currentUser: string; currentUserDisplayName?: string; width?: string; }) {
  if (!post) return null;

  const liveUser = useLiveUserData(post.uid);
    return (
    <div>
      <PostStyle
        width={width}
        displayName={liveUser?.displayName || post.displayName}
        profilePicture={liveUser?.profilePicture || post.profilePicture}
        textContent={post.content}
        mediaUrl={post.mediaUrl}
        createdAt={post.createdAt?.toDate?.()}
        docId={post.id}
        currentLikes={post.likes}
        collectionName="posts"
        targetUid={post.uid}
        currentUser={currentUser || ''}
        currentUserDisplayName={currentUserDisplayName || ''}
        />
    </div>
  )
}

export default LivePost