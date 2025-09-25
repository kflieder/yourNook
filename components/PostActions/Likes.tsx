'use client'
import React, { useEffect, useState, useRef }from 'react'
import { useAuth } from '@/context/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { sendNotification } from '@/utilities/sendNotification';
import  CustomAlertModal  from '../customAlertModal/CustomAlertModal';
import { useAlert } from 'components/customAlertModal/AlertProvider';
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
  const hasLiked = username && likes.includes(username.uid);
  const { show } = useAlert();
  const buttonRef = useRef<HTMLButtonElement>(null);


  

  const toggleLike = async () => {
    if (loading) return;
    if (!username) {
        show("Hello, Welcome to yourNook! Please login or sign up to like posts.", { bottom: 30, left: 0 }, buttonRef);
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
      <button ref={buttonRef} onClick={toggleLike} disabled={loading} className="cursor-pointer relative">
        {hasLiked ? '❤️' : '🤍'} {likes.length}
        
      </button>
   
    </>
  )
}

export default Likes