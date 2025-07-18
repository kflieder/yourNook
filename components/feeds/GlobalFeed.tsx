"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import PostStyle from "../post/PostStyle";
import { useAuth } from "@/context/AuthContext";


interface Post {
  id: string;
  content: string;
  displayName: string;
  createdAt: any;
  mediaUrl?: string;
  [key: string]: any;
}

function GlobalFeed() {
  const { username: currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastdoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [toggleComments, setToggleComments] = useState(false);

  const handleToggleComments = () => {
    setToggleComments((prev) => !prev);
  };

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const postsRef = collection(db, "posts");
      const q = lastdoc
        ? query(
            postsRef,
            orderBy("createdAt", "desc"),
            startAfter(lastdoc),
            limit(10)
          )
        : query(postsRef, orderBy("createdAt", "desc"), limit(10));

      const snapshot = await getDocs(q);
      const newPosts: Post[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setPosts((prev) => {
          const existingIds = new Set(prev.map((post) => post.id));
          const uniquePosts = newPosts.filter(
            (post) => !existingIds.has(post.id)
          );
          return [...prev, ...uniquePosts];
        });
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setLoading(false);
  }, [lastdoc, loading, hasMore]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchPosts();
      }
    });

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }
    return () => observer.current?.disconnect();
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);


  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
        >
          <PostStyle
                  displayName={post.displayName}
                  profilePicture={post.profilePicture}
                  textContent={post.content}
                  mediaUrl={post.mediaUrl}
                  createdAt={post.createdAt?.toDate?.()}
                  docId={post.id}
                  currentLikes={post.likes}
                  collectionName="posts"
                  targetUid={post.uid}
                  currentUser={currentUser?.uid || ''}
                   />
        </div>
      ))}
    </div>
  );
}

export default GlobalFeed;
