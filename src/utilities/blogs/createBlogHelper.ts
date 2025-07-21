import { db } from "lib/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

type Blog = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  imageUrl?: string;
  authorDisplayName: string;
};
interface CreateBlogData {
  title: string;
  content: string;
  imageUrl?: string;
  authorId: string;
  authorDisplayName: string;
}

export async function createBlog(data: CreateBlogData): Promise<void> {
  try {
    const blogsRef = collection(db, "blogs");
    const newBlogRef = doc(blogsRef);

    await setDoc(newBlogRef, {
      ...data,
      id: newBlogRef.id,
      createdAt: new Date(),
    } as Blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
}
