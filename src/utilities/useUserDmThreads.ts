import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";

interface DmThread {
    threadId: string;
    isRead?: boolean;
    [key: string]: any;
}

export function useUserDmThreads(uid: string | undefined) {
    const [dmThreads, setDmThreads] = useState<Array<any>>([]);

    useEffect(() => {
        if (!uid) {
            setDmThreads([]);
            return;
        }

        const dmThreadsCollectionRef = collection(db, "users", uid, "dmThreads");

        const unsubscribe = onSnapshot(dmThreadsCollectionRef, (querySnapshot) => {
            const threads: Array<DmThread> = querySnapshot.docs.map(doc => ({
                threadId: doc.id,
                ...doc.data()
            }));
            threads.sort((a, b) => {
                const aIsRead = a.isRead ?? true;
                const bIsRead = b.isRead ?? true;
                if (!aIsRead && bIsRead) return -1;
                if (aIsRead && !bIsRead) return 1;
                return 0;
            })
            setDmThreads(threads);
        }, (error) => {
            console.error("Error in DM threads listener:", error);
        });

        return () => unsubscribe();
    }, [uid]);

    return dmThreads;
}
