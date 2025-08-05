import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // Adjust path if needed


export function useLiveMessages(threadId: string | undefined) {
    const [liveMessages, setLiveMessages] = useState<Array<Record<string, any>>>([]);

    useEffect(() => {
        if (!threadId) return;
        const messagesRef = collection(db, 'dmThreads', threadId, 'messages');
        const q = query(messagesRef, 
                orderBy('timestamp', 'desc')); 
        const unsubscribe = onSnapshot(
            q, (docSnap) => {
                const messages = docSnap.docs
                .map(doc => ({ id: doc.id, ...(doc.data() as { timestamp?: any; clientTimestamp?: any }) }))
                .filter(m => m.timestamp || m.clientTimestamp) 
                .sort((a, b) => a.timestamp?.toMillis() - b.timestamp?.toMillis());
                setLiveMessages(messages);
            }
        )
        return () => unsubscribe();
    }, [threadId]);
    return liveMessages;
}