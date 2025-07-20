import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function sendNotification({
    toUserId,
    type,
    fromUserId,
    postId, 
    message
} : {
    toUserId: string;
    type: string;
    fromUserId: string;
    postId?: string;
    message?: string;
}) {
    if (!toUserId || !type || !fromUserId) return;

    const notifRef = collection(db , 'users', toUserId, 'notifications');

    // if (toUserId === fromUserId) {
    //     return; // Prevent sending notification to self
    // }
    await addDoc (notifRef, {
        type, 
        fromUserId,
        postId: postId || null,
        createdAt: serverTimestamp(),
        isRead: false,
        message: message || null
    })
}