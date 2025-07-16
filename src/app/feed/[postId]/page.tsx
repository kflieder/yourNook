import React from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../../lib/firebase'
import { notFound } from 'next/navigation'
import PostStyle from '../../../../components/post/PostStyle'

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
  return (
    <div>
        <PostStyle
            displayName={post.displayName}
            textContent={post.content}
            mediaUrl={post.mediaUrl}
            createdAt={post.createdAt?.toDate?.()}
            docId={postId}
            currentLikes={post.likes}
            collectionName="posts"
             />
    </div>
  )
}

export default Page
