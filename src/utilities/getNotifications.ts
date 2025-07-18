import { db } from '../../lib/firebase';
import { collection, getDocs, orderBy, query, onSnapshot } from 'firebase/firestore';

export default function getNotifications(userId: string, callback: (notifications: any[]) => void) {
    const notificationRef = collection(db, 'users', userId, 'notifications');
    const q = query(notificationRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(notifications);
    });
    return unsubscribe;
}