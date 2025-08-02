import { doc, collection, setDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase.js';

export function blockUser(uid: string | undefined, blockedUid: string) {
    const blockDocRef = collection(db, 'blockedUsers');
    const newBlockDocRef = doc(blockDocRef, `${uid}_${blockedUid}`);
    const blockData = {
        blockedUid,
        blockedBy: uid,
        blockedAt: serverTimestamp()
    };
    return setDoc(newBlockDocRef, blockData, { merge: true });
}

export async function getBlockedUsers(uid: string) {
   const blockedUsersQuery = query(
        collection(db, 'blockedUsers'),
        where('blockedBy', '==', uid)
   )
   const snapshot = await getDocs(blockedUsersQuery);
   const blockedUids = snapshot.docs.map(doc => doc.data().blockedUid);
    return blockedUids;
}

export async function isBlockedBy(targetUid: string, currentUserUid: string) {
    const blockedUsersQuery = query(
        collection(db, 'blockedUsers'),
        where('blockedBy', '==', targetUid),
        where('blockedUid', '==', currentUserUid)
    );
    const snapshot = await getDocs(blockedUsersQuery);
    return !snapshot.empty; 
}

export async function getUsersWhoBlockedMe(currentUserUid: string) {
    const blockedByQuery = query(
        collection(db, 'blockedUsers'),
        where('blockedUid', '==', currentUserUid)
    );
    const snapshot = await getDocs(blockedByQuery);
    return snapshot.docs.map(doc => doc.data().blockedBy);
}