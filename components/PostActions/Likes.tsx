'use client'
import React, { useState }from 'react'
import { useAuth } from '@/context/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface LikesProps {
    docId: string;
    currentLikes: string[];
    collectionName: string;
}

function Likes({ docId, currentLikes, collectionName }: LikesProps) {
  const { username } = useAuth();
  const [likes, setLikes] = useState<string[]>(currentLikes || []);
  const [loading, setLoading] = useState(false);

  const hasLiked = username && likes.includes(username.uid);

  const toggleLike = async () => {
    if (!username || loading) return;
    setLoading(true);

    const postRef = doc(db, collectionName, docId);
    try {
        if (hasLiked) {
            await updateDoc(postRef, {
                likes: arrayRemove(username.uid)
            });
            setLikes(prev => prev.filter(uid => uid !== username.uid));
        } else {
            await updateDoc(postRef, {
                likes: arrayUnion(username.uid)
            });
            setLikes(prev => [...prev, username.uid]);
        }
    } catch (error) {
        console.error("Error updating likes:", error);
    } finally {
        setLoading(false);
    }
  }
  return (
    <button onClick={toggleLike} disabled={loading} className="cursor-pointer border">
      {hasLiked ? '❤️' : '🤍'} {likes.length}
    </button>
  )
}

export default Likes