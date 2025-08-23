'use client'
import React from 'react'
import { useLiveUserData } from '@/utilities/useLiveUserData';
import PostStyle from './PostStyle';

function LivePost({ post, currentUser, currentUserDisplayName, thumbnail, styleSelector, onThumbnailClick }: { post: any; currentUser: string; currentUserDisplayName?: string; width?: string; thumbnail?: boolean; styleSelector?: string; onThumbnailClick?: (postId: string) => void }) {
  if (!post) return null;

  const liveUser = useLiveUserData(post.uid);
    return (
    <div>
      <PostStyle
        thumbnail={thumbnail}
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
        styleSelector={styleSelector}
        onThumbnailClick={onThumbnailClick || (() => {})}
        />
    </div>
  )
}

export default LivePost