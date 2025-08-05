import { getDoc, doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase.js';

export async function getOrCreateDmThread(currentUserUid: string, targetUserUid: string, targetUserDisplayName?: string, targetUserProfilePicture?: string, currentUserDisplayName?: string, currentUserProfilePicture?: string) {
    const sortedUids = [currentUserUid, targetUserUid].sort();
    const threadId = sortedUids.join('_'); 

    const threadRef = doc(db, 'dmThreads', threadId);
    const currentUserThreadRef = doc(db, 'users', currentUserUid, 'dmThreads', threadId);
    const targetUserThreadRef = doc(db, 'users', targetUserUid, 'dmThreads', threadId);
    const threadSnap = await getDoc(threadRef);


    if (threadSnap.exists()) return threadId;
    await setDoc(threadRef, {
        users: [currentUserUid, targetUserUid],
        createdAt:serverTimestamp(),
    });
    await setDoc(currentUserThreadRef, {
        otherUserUid: targetUserUid,
        otherUserDisplayName: targetUserDisplayName,
        otherUserProfilePicture: targetUserProfilePicture,
        threadId: threadId,
        createdAt: serverTimestamp(),
    });
    await setDoc(targetUserThreadRef, {
        otherUserUid: currentUserUid,
        otherUserDisplayName: currentUserDisplayName,
        otherUserProfilePicture: currentUserProfilePicture,
        threadId: threadId,
        createdAt: serverTimestamp(),
    });
    return threadId;
}

export async function sendMessage(threadId: string, message: { senderUid: string; content: string; timestamp: Date, senderDisplayName?: string, senderProfilePicture?: string }) {
    const messagesRef = collection(db, 'dmThreads', threadId, 'messages');
    await addDoc(messagesRef, {
        ...message,
        createdAt: serverTimestamp(),
    });
}