import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default async function deletePost(postId: string) {
  const postRef = doc(db, "posts", postId);

  try {
    await deleteDoc(postRef);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}
