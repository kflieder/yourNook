import { db } from "lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";


async function deleteUserContent(uid: string) {
    const postsQuery = query(collection(db, "posts"), where("uid", "==", uid));
    const postsSnapshot = await getDocs(postsQuery);

    for (const postDoc of postsSnapshot.docs) {
        await deleteDoc(doc(db, "posts", postDoc.id));
    }


    const blogsQuery = query(collection(db, "blogs"), where("uid", "==", uid));
    const blogsSnapshot = await getDocs(blogsQuery);

    for (const blogDoc of blogsSnapshot.docs) {
        await deleteDoc(doc(db, "blogs", blogDoc.id));
    }

    const threadsQuery = query(collection(db, "discussionThreads"), where("uid", "==", uid));
    const threadsSnapshot = await getDocs(threadsQuery);

    for (const threadDoc of threadsSnapshot.docs) {
        await deleteDoc(doc(db, "discussionThreads", threadDoc.id));
    }

    const commentsQuery = query(collection(db, "comments"), where("uid", "==", uid));
    const commentsSnapshot = await getDocs(commentsQuery);
    for (const commentDoc of commentsSnapshot.docs) {
        await deleteDoc(doc(db, "comments", commentDoc.id));
    }

    
}

export default deleteUserContent;