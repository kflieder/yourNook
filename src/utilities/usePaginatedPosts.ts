"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

interface Post {
  id: string;
  content: string;
  displayName: string;
  createdAt: any;
  mediaUrl?: string;
  [key: string]: any;
}

export function usePaginatedPosts(
  collectionName: string,
  sortField = "createdAt"
) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastdoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  useEffect(() => {
    const ref = collection(db, collectionName);
    const q = query(ref, orderBy(sortField, "desc"), limit(5));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firstPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(firstPosts);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(true);
    });
    return () => unsubscribe();
  }, [collectionName, sortField]);

  const fetchMorePosts = useCallback(async () => {
    if (loading || !hasMore || !lastdoc) return;
    setLoading(true);

    try {
      const ref = collection(db, collectionName);
      const q = query(
        ref,
        orderBy(sortField, "desc"),
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
          const existingIds = new Set(prev.map((p) => p.id));
          const unique = newPosts.filter((p) => !existingIds.has(p.id));
          return [...prev, ...unique];
        });
        
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
    }
    setLoading(false);
  }, [loading, hasMore, lastdoc, collectionName, sortField]);

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && lastdoc) {
        fetchMorePosts();
      }
    });
    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }
    return () => observer.current?.disconnect();
  }, [fetchMorePosts]);

  return { posts, loading, hasMore, loadMoreRef };
}
