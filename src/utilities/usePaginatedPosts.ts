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
import { getBlockedUsers, getUsersWhoBlockedMe } from "./blockUserHelper";

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
  sortField = "createdAt",
  currentUser: string | undefined,
  authorIdField: string
) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastdoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [blockedUids, setBlockedUids] = useState<string[]>([]);
  const [hasCheckedBlocked, setHasCheckedBlocked] = useState(false);
  const [usersWhoBlockedMe, setUsersWhoBlockedMe] = useState<string[]>([]);

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      if (!collectionName) return;
      try {
        const blockedUsers = await getBlockedUsers(currentUser || "");
        const usersWhoBlocked = await getUsersWhoBlockedMe(currentUser || "");
        setUsersWhoBlockedMe(usersWhoBlocked);
        setBlockedUids(blockedUsers);
      } catch (error) {
        console.error("Error fetching blocked users:", error);
      } finally {
        setHasCheckedBlocked(true);
      }
    };

    fetchBlockedUsers();
  }, [collectionName, sortField, currentUser]);

  useEffect(() => {
    if (!hasCheckedBlocked) return;
    const ref = collection(db, collectionName);
    const q = query(ref, orderBy(sortField, "desc"), limit(5));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firstPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      const filteredPosts = firstPosts.filter(
        (post) =>
          post[authorIdField] && !blockedUids.includes(post[authorIdField]) && !usersWhoBlockedMe.includes(post[authorIdField])
      );
      const lastVisibleDoc = snapshot.docs.findLast((doc) => {
        const data = doc.data();
        return (
          data[authorIdField] && !blockedUids.includes(data[authorIdField]) && !usersWhoBlockedMe.includes(data[authorIdField])
        );
      });
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const unique = filteredPosts.filter((p) => !existingIds.has(p.id));
        return [...prev, ...unique];
      });
      setLastDoc(lastVisibleDoc || null);
      setHasMore(true);
    });
    return () => unsubscribe();
  }, [collectionName, sortField, blockedUids, hasCheckedBlocked]);

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
      const filteredPosts = newPosts.filter((post) => {
        const idToCheck = post[authorIdField] || post.uid;
        return !blockedUids.includes(idToCheck) && !usersWhoBlockedMe.includes(idToCheck);
      });

      console.log(
        "Fetched docs:",
        snapshot.docs.map((doc) => doc.id)
      );
      console.log(
        "Filtered post IDs:",
        newPosts.map((p) => p.id)
      );
      console.log("Blocked UIDs:", blockedUids);

      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const unique = filteredPosts.filter((p) => !existingIds.has(p.id));
          console.log("Previous post IDs:", [...existingIds]);
          console.log(
            "New unique posts:",
            unique.map((p) => p.id)
          );
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
