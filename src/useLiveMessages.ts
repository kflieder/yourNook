import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Adjust path if needed


export function useLiveMessages(threadId: string | undefined) {
    const [liveMessages, setLiveMessages] = useState<Array<Record<string, any>>>([]);

    useEffect(() => {
        if (!threadId) return;
        const messagesRef = collection(db, 'dmThreads', threadId, 'messages');
        const q = query(messagesRef);
        
    }, [threadId]);
}