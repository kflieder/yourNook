import { getDoc, doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase.js';

export async function getOrCreateDmThread(currentUserUid: string, targetUserUid: string) {
    const sortedUids = [currentUserUid, targetUserUid].sort();
    const threadId = sortedUids.join('_'); // Create a unique thread ID based on user UIDs

    const threadRef = doc(db, 'dmThreads', threadId);
    const threadSnap = await getDoc(threadRef);
    if (threadSnap.exists()) return threadId;

    // If the thread doesn't exist, create it
    await setDoc(threadRef, {
        users: [currentUserUid, targetUserUid],
        createdAt: new Date(),
    });
    return threadId;
}

export async function sendMessage(threadId: string, message: { senderUid: string; content: string; timestamp: Date }) {
    const messagesRef = collection(db, 'dmThreads', threadId, 'messages');
    await addDoc(messagesRef, {
        ...message,
        createdAt: serverTimestamp(),
    });
}