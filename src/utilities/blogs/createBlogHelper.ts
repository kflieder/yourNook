import { db } from "lib/firebase";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";


interface CreateBlogData {
  title: string;
  content: string;
  imageUrl?: string;
  authorId: string;
  authorDisplayName: string;
  likes?: string[];
  createdAt?: Date;
}

export async function createBlog(data: CreateBlogData): Promise<void> {
  try {
    const blogsRef = collection(db, "blogs");
    const newBlogRef = doc(blogsRef);

    await setDoc(newBlogRef, {
      ...data,
      id: newBlogRef.id,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
}
