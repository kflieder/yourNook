import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, addDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

type Comment = {
  id: string;
  uid: string;
  displayName: string;
  text: string;
  createdAt: number;
};

export function usePostComments(postId: string): { comments: Comment[], addComment: (data: { text: string; uid: string; displayName: string }) => Promise<void> } {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!postId) return;

    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [postId]);

  const addComment = async (commentData: { text: string; uid: string; displayName: string }) => {
    try {
      const commentsRef = collection(db, 'posts', postId, 'comments');
      await addDoc(commentsRef, {
        ...commentData,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return { comments, addComment };
}
