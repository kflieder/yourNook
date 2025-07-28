import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export function useGetBlog(authorId: string) {
    const [blogs, setBlogs] = useState<Array<{ id: string; title: string; content: string; authorId: string; createdAt: Date; imageUrl?: string; authorDisplayName: string, likes: string[] }>>([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        if (!authorId) return;
        setLoading(true);
        const blogsRef = collection(db, 'blogs');
        const q = query(
            blogsRef,
            where('authorId', '==', authorId),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            
            const newBlogs = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title ?? "",
                    content: data.content ?? "",
                    authorId: data.authorId ?? "",
                    createdAt: data.createdAt?.toDate() ?? new Date(),
                    imageUrl: data.imageUrl,
                    authorDisplayName: data.authorDisplayName ?? "",
                    likes: data.likes || []
                };
            });
            setBlogs(newBlogs);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching blogs:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [authorId]);

    return { blogs, loading };
}