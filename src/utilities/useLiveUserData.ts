import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase"; // Adjust path if needed

export function useLiveUserData(uid: string | undefined) {
  const [liveUserData, setLiveUserData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    if (!uid) {
    setLiveUserData(null); 
    return;
  }

  
    const userRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setLiveUserData(docSnap.data());
        } else {
          console.log(`No user data found for UID: ${uid}`);
          setLiveUserData(null);
          
        }
      },
      (error) => {
        console.error("Error in live user data listener:", error);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  return liveUserData;
}
