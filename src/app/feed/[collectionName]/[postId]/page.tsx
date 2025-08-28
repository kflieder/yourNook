import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../lib/firebase";
import { notFound } from "next/navigation";
import {
  getCurrentUserServer,
  CurrentUser,
} from "@/utilities/getCurrentUserServer";
import LivePost from "components/post/LivePost";
import BlogStyle from "components/blog/BlogStyle";
import DiscussionThreadStyle from "components/discussionThreads/DiscussionThreadStyle";

interface Props {
  params: {
    postId: string;
    collectionName: string;
  };
}

async function Page({ params }: Props) {
  const { postId, collectionName } = params;
  const docRef = doc(db, collectionName, postId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound();
  }

  const post = {
    ...docSnap.data(),
    id: postId,
    createdAt: docSnap.data().createdAt?.toMillis?.() || null,
  };
  const blog = {
    ...(docSnap.data() as {
      title?: string;
      content?: string;
      imageUrl?: string;
      authorDisplayName?: string;
      profilePicture: string;
      likes?: string[];
      authorId: string;
      topic?: string;
      [key: string]: any;
    }),
    id: postId,
    createdAt: docSnap.data().createdAt?.toMillis?.() || null,
  };
  const currentUser = await getCurrentUserServer();

//  const authorRef = doc(db, 'users', blog.authorId)
//  const authorSnap = await getDoc(authorRef);
//  const authorData = authorSnap.data();

  let authorData = null;

  if (collectionName === "blogs") {
    const authorId = blog.authorId || blog.authorId; // fallback just in case
    if (authorId) {
      const authorRef = doc(db, "users", authorId);
      const authorSnap = await getDoc(authorRef);
      authorData = authorSnap.data();
    }
  }
console.log(blog)
  return (
    <div className="border pt-10 h-screen flex justify-center items-center">
      {collectionName === "posts" && (
        <LivePost
          styleSelector="feed"
          post={{ ...post, id: postId }}
          currentUser={currentUser?.uid || ""}
          currentUserDisplayName={currentUser?.displayName || ""}
        />
      )}

      {collectionName === "blogs" && (
        <BlogStyle
          id={blog.id}
          title={blog.title ?? ""}
          content={blog.content ?? ""}
          imageUrl={blog.imageUrl}
          createdAt={blog.createdAt ? new Date(blog.createdAt) : null}
          authorDisplayName={blog.authorDisplayName || ""}
          profilePicture={authorData?.profilePicture || ""}
          currentLikes={blog.likes || []}
          currentUser={currentUser?.uid || ""}
          currentUserDisplayName={currentUser?.displayName || ""}
          authorUid={blog.authorId || ""}
          topic={blog.topic || ""}
        />
      )}

      {collectionName === "discussionThreads" && (
        <DiscussionThreadStyle
          currentUser={currentUser}
          authorUid={blog.authorId}
          title={blog.title}
          content={blog.content}
          createdAt={blog.createdAt}
          currentLikes={blog.likes || []}
          postId={postId}
          currentUserDisplayName={currentUser?.displayName}
        />
      )}
    </div>
  );
}

export default Page;
