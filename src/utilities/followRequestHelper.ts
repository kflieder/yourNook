import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase"; 

export async function createFollowRequest(
    targetUid: string, currentUser: { uid: string, displayName: string } | null
) {
    if (!currentUser) return;

    const followRequestRef = doc(db, 'users', targetUid, 'followRequests', currentUser.uid);

    await setDoc(followRequestRef, {
        from: currentUser.uid,
        to: targetUid,
        status: "pending",
        createdAt: new Date()
    }, { merge: true });
}

export async function updateFollowRequestStatus(
    targetUid: string, currentUserUid: string, status: "accepted" | "rejected"
) {
    const followRequestRef = doc(db, 'users', currentUserUid, 'followRequests', targetUid);

    await setDoc(followRequestRef, {
        status,
        updatedAt: new Date()
    }, { merge: true });
}