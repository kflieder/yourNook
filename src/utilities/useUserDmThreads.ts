import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase"; 

export function useUserDmThreads(uid: string | undefined) {
    const [dmThreads, setDmThreads] = useState<Array<any>>([]);

    useEffect(() => {
        if (!uid) {
            setDmThreads([]);
            return;
        }

        const dmThreadsCollectionRef = collection(db, "users", uid, "dmThreads");

        const unsubscribe = onSnapshot(dmThreadsCollectionRef, (querySnapshot) => {
            const threads = querySnapshot.docs.map(doc => ({
                threadId: doc.id,
                ...doc.data()
            }));
            setDmThreads(threads);
        }, (error) => {
            console.error("Error in DM threads listener:", error);
        });

        return () => unsubscribe();
    }, [uid]);

    return dmThreads;
}
