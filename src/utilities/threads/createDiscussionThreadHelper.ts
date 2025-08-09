import { db } from "lib/firebase";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";


interface CreateDiscussionThreadData {
  title: string;
  content: string;
  authorId: string;
  authorDisplayName: string;
  likes?: string[];
  createdAt?: Date;
}

export async function createDiscussionThread(data: CreateDiscussionThreadData): Promise<void> {
  try {
    const discussionThreadsRef = collection(db, "discussionThreads");
    const newDiscussionThreadRef = doc(discussionThreadsRef);

    await setDoc(newDiscussionThreadRef, {
      ...data,
      id: newDiscussionThreadRef.id,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error creating thread:", error);
    throw error;
  }
}