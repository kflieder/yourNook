import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, addDoc, orderBy, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';

type Comment = {
  id: string;
  uid: string;
  displayName: string;
  text: string;
  createdAt: any;
  parentId?: string | null;
  postId: string;
};

export function usePostComments(postId: string): { comments: Comment[], addComment: (data: { text: string; uid: string; displayName: string; parentId?: string | null }) => Promise<void> } {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!postId) return;

    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('postId', '==', postId), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        postId: postId,
        ...doc.data(),
      })) as Comment[];
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [postId]);

  const addComment = async (commentData: { text: string; uid: string; displayName: string; parentId?: string | null }) => {
    try {
      const commentsRef = collection(db, 'comments');
      await addDoc(commentsRef, {
        postId,
        parentId: commentData.parentId ?? null,
        ...commentData,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return { comments, addComment };
}
