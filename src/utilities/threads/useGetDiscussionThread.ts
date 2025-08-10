import { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export function useGetDiscussionThread(authorId: string) {
    const [discussionThreads, setDiscussionThreads] = useState<Array<{ id: string; title: string; content: string; authorId: string; createdAt: Date; authorDisplayName: string, likes: string[] }>>([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        if (!authorId) return;
        setLoading(true);
        const discussionThreadsRef = collection(db, 'discussionThreads');
        const q = query(
            discussionThreadsRef,
            where('authorId', '==', authorId),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {

            const newDiscussionThreads = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title ?? "",
                    content: data.content ?? "",
                    authorId: data.authorId ?? "",
                    createdAt: data.createdAt?.toDate() ?? new Date(),
                    authorDisplayName: data.authorDisplayName ?? "",
                    likes: data.likes || []
                };
            });
            setDiscussionThreads(newDiscussionThreads);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching discussion threads:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [authorId]);

    return { discussionThreads, loading };
}