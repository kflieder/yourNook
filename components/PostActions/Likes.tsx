'use client'
import React, { useEffect, useState, useRef }from 'react'
import { useAuth } from '@/context/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { sendNotification } from '@/utilities/sendNotification';
import  CustomAlertModal  from '../customAlertModal/CustomAlertModal';
interface LikesProps {
    docId: string;
    currentLikes: string[];
    collectionName: string;
    targetUid: string;
    currentUser: string;
    displayName: string;
    currentUserDisplayName?: string;
    type: string;
    message: string;
}

function Likes({ docId, currentLikes, collectionName, targetUid, currentUser, type, message }: LikesProps) {
  const { username } = useAuth();
  const [likes, setLikes] = useState<string[]>(currentLikes || []);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);
  const hasLiked = username && likes.includes(username.uid);


  useEffect(() => {
   function handleClickOutside(event: MouseEvent) {
    if (!showAlert) return;
       const target = event.target as HTMLElement;
         if (alertRef.current && !alertRef.current.contains(target)) {
           setShowAlert(false);
       }
   }

   document.addEventListener('mousedown', handleClickOutside);
   return () => {
       document.removeEventListener('mousedown', handleClickOutside);
   };
  }, [showAlert])

  const toggleLike = async () => {
    if (loading) return;
    if (!username) {
        setShowAlert(true);
        return;
    }
    setLoading(true);

    const postRef = doc(db, collectionName, docId);
    const userHasLiked = likes.includes(username.uid);
    try {
        if (userHasLiked) {
            await updateDoc(postRef, {
                likes: arrayRemove(username.uid),
                likeCount: increment(-1)
            });
            setLikes(prev => prev.filter(uid => uid !== username.uid));
        } else {
            await updateDoc(postRef, {
                likes: arrayUnion(username.uid),
                likeCount: increment(1)
            });
            setLikes(prev => [...prev, username.uid]);
            await sendNotification({
                toUserId: targetUid, 
                type: type,
                fromUserId: currentUser,
                message: message,
                postId: docId
            });
            console.log(`Notification sent to ${targetUid} for like by ${currentUser}`);
        }
    } catch (error) {
        console.error("Error updating likes:", error);
    } finally {
        setLoading(false);
    }
  }
  return (
    <>
      <button onClick={toggleLike} disabled={loading} className="cursor-pointer relative">
        {hasLiked ? '❤️' : '🤍'} {likes.length}
        
      </button>
      {showAlert && <div className='absolute left-0 bottom-0' ref={alertRef}><CustomAlertModal  message="Hello, Welcome to yourNook. Please log in or sign up to like posts." position={{ bottom: 40, left: 0 }} /></div>}
    </>
  )
}

export default Likes