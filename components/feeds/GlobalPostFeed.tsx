"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "@/context/AuthContext";
import LivePost from "components/post/LivePost";

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

  // Fetch older posts (pagination)
  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore || !lastdoc) return;
    setLoading(true);

    try {
      const postsRef = collection(db, "posts");
      const q = query(
        postsRef,
        orderBy("createdAt", "desc"),
        startAfter(lastdoc),
        limit(10)
      );

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
      console.error("Error fetching more posts:", error);
    }

    setLoading(false);
  }, [lastdoc, loading, hasMore]);

  // Real-time listener for first 10 posts
  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      setPosts(fetchedPosts);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(true); // Reset in case new posts appeared
    });

    return () => unsubscribe();
  }, []);

  // Intersection Observer to trigger fetchPosts on scroll
  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && lastdoc) {
        fetchPosts();
      }
    });

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => observer.current?.disconnect();
  }, [fetchPosts, hasMore, lastdoc]);

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id}>
          <LivePost post={post} currentUser={currentUser?.uid || ""} currentUserDisplayName={currentUser?.displayName || ""} />
        </div>
      ))}
      <div ref={loadMoreRef} className="h-10" />
      {loading && <p>Loading more posts...</p>} 
    </div>
  );
}

export default GlobalFeed;
