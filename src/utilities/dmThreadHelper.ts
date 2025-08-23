import { getDoc, doc, setDoc, collection, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase.js';
import { sendNotification } from './sendNotification';

export async function getOrCreateDmThread(
    currentUserUid: string, 
    targetUserUid: string, 
    targetUserDisplayName?: string, 
    targetUserProfilePicture?: string,
    currentUserDisplayName?: string, 
    currentUserProfilePicture?: string) {

        
    const sortedUids = [currentUserUid, targetUserUid].sort();
    const threadId = sortedUids.join('_'); 

    const threadRef = doc(db, 'dmThreads', threadId);
    const currentUserThreadRef = doc(db, 'users', currentUserUid, 'dmThreads', threadId);
    const targetUserThreadRef = doc(db, 'users', targetUserUid, 'dmThreads', threadId);
    const threadSnap = await getDoc(threadRef);

    if (currentUserUid === targetUserUid) return;
    if (threadSnap.exists()) return threadId;
    await setDoc(threadRef, {
        users: [currentUserUid, targetUserUid],
        createdAt:serverTimestamp(),
        lastMessageSenderUid: currentUserUid,
        lastMessageText: "",
        lastMessageTimestamp: serverTimestamp(),
        isRead: false,
    });
    await setDoc(currentUserThreadRef, {
        otherUserUid: targetUserUid,
        otherUserDisplayName: targetUserDisplayName,
        otherUserProfilePicture: targetUserProfilePicture,
        threadId: threadId,
        createdAt: serverTimestamp(),
        lastMessageSenderUid: currentUserUid,
        lastMessageText: "",
        lastMessageTimestamp: serverTimestamp(),
    });
    await setDoc(targetUserThreadRef, {
        otherUserUid: currentUserUid,
        otherUserDisplayName: currentUserDisplayName,
        otherUserProfilePicture: currentUserProfilePicture,
        threadId: threadId,
        createdAt: serverTimestamp(),
        lastMessageSenderUid: currentUserUid,
        lastMessageText: "",
        lastMessageTimestamp: serverTimestamp(),
    });
    return threadId;
}

export async function sendMessage(threadId: string, message: { senderUid: string; content: string; timestamp: Date, senderDisplayName?: string, senderProfilePicture?: string }) {
    const messagesRef = collection(db, 'dmThreads', threadId, 'messages');
    await addDoc(messagesRef, {
        ...message,
        createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, 'dmThreads', threadId), {
        lastMessageSenderUid: message.senderUid,
        lastMessageText: message.content,
        lastMessageTimestamp: serverTimestamp(),
        isRead: false,
    });
    const senderThreadRef = doc(db, 'users', message.senderUid, 'dmThreads', threadId);
    await updateDoc(senderThreadRef, {
        lastMessageSenderUid: message.senderUid,
        lastMessageText: message.content,
        lastMessageTimestamp: serverTimestamp(),
    });
    const receiverThreadRef = doc(db, 'users', threadId.split('_').find(uid => uid !== message.senderUid) || '', 'dmThreads', threadId);
    await updateDoc(receiverThreadRef, {
        lastMessageSenderUid: message.senderUid,
        lastMessageText: message.content,
        lastMessageTimestamp: serverTimestamp(),
        isRead: false
    });
    try {
      await sendNotification({
        toUserId: threadId.split('_').find(uid => uid !== message.senderUid) || '',
        type: 'dm',
        fromUserId: message.senderUid,
        postId: threadId,
        message: `${message.content}`
    });  
    } catch (error) {
        console.error("Error sending message:", error);
        
    }
    
}