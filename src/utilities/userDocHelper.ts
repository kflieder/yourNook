import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase.js'; 


export function useUserDoc(uid: string | undefined) {
    if (!uid) {
        return null;
    }
    const userRef = doc(db, 'users', uid);
    const fetchUserData = async () => {
        const docSnap = await getDoc(userRef);
        return docSnap.exists() ? docSnap.data() : null;
    }
    const updateUserData = async (data: Record<string, any>) => {
        await setDoc(userRef, data, { merge: true });
    }
    const setUserData = async (data: Record<string, any>) => {
        await setDoc(userRef, data, { merge: true });
    }


    return {
        fetchUserData,
        updateUserData,
        setUserData
    }

}