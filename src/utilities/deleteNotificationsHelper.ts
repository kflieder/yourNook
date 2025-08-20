import { deleteDoc, collection, doc, writeBatch, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";


export async function deleteOneNotification(notificationId: string, userId: string) {
  const notificationRef = doc(collection(db, "users", userId, "notifications"), notificationId);
  await deleteDoc(notificationRef);
}

export function deleteAllNotifications(userId: string) {
  const notificationsRef = collection(db, "users", userId, "notifications");
  const batch = writeBatch(db);

  getDocs(notificationsRef).then((snapshot) => {
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    return batch.commit();
  });
}