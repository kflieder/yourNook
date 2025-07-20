import React from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../../lib/firebase'
import { notFound } from 'next/navigation'
import PostStyle from '../../../../components/post/PostStyle'
import { getCurrentUserServer, CurrentUser } from '@/utilities/getCurrentUserServer'
import LivePost from 'components/post/LivePost'


interface Props {
    params: {
        postId: string;
    }
}




async function Page({ params }: Props) {
    const { postId } = await params
    const docRef = doc(db, 'posts', postId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
        notFound()
    }

    const post = {
        ...docSnap.data(),
        id: postId,
        createdAt: docSnap.data().createdAt?.toMillis?.() || null
    }
    const currentUser = await getCurrentUserServer()
    
   
  return (
    <div>
        <LivePost
            post={{ ...post, id: postId }}
            currentUser={currentUser?.uid || ''} 
            currentUserDisplayName={currentUser?.displayName || ''}/>
            
    </div>
  )
}

export default Page
