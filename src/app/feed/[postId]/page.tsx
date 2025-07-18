import React from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../../lib/firebase'
import { notFound } from 'next/navigation'
import PostStyle from '../../../../components/post/PostStyle'
import { getCurrentUserServer } from '@/utilities/getCurrentUserServer'


interface Props {
    params: {
        postId: string;
    }
}

async function Page({ params }: Props) {
    const { postId } = params
    const docRef = doc(db, 'posts', postId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
        notFound()
    }

    const post = docSnap.data()
    const currentUser = await getCurrentUserServer()
   

    console.log(currentUser, 'current user uid in post page')
  return (
    <div>
        <PostStyle
            displayName={post.displayName}
            profilePicture={post.profilePicture}
            textContent={post.content}
            mediaUrl={post.mediaUrl}
            createdAt={post.createdAt?.toDate?.()}
            docId={postId}
            currentLikes={post.likes}
            collectionName="posts"
            targetUid={post.uid}
            currentUser={currentUser || ''}  // Ensure currentUser is defined
             />
    </div>
  )
}

export default Page
