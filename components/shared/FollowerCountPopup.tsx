import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useLiveUserData } from "@/utilities/useLiveUserData";
import Link from "next/link";

interface FollowerProfile {
  uid: string;
  displayName: string;
}

function FollowerCountPopup({ userId }: { userId: string }) {
  const liveUserData = useLiveUserData(userId);
  const [followerProfiles, setFollowerProfiles] = useState<FollowerProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchFollowerProfiles() {
      if (!liveUserData?.followers?.length) {
        setFollowerProfiles([]);
        return;
      }

      setLoading(true);
      try {
        const profiles = await Promise.all(
          liveUserData.followers.map(async (followerUid: string) => {
            const docRef = doc(db, "users", followerUid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              return {
                uid: followerUid,
                displayName: data.displayName || "Unknown User",
              };
            }
            return { uid: followerUid, displayName: "Unknown User" };
          })
        );
        setFollowerProfiles(profiles);
      } catch (error) {
        console.error("Error fetching follower profiles:", error);
        setFollowerProfiles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFollowerProfiles();
  }, [liveUserData?.followers]);

  if (loading) return <p>Loading followers...</p>;
  if (!followerProfiles.length) return <p>No followers yet.</p>;

  return (
    <div>
      <p>Followers: {followerProfiles.length}</p>
      <ul>
        {followerProfiles.map((follower) => (
          <Link href={`/profile/${follower.uid}`} key={follower.uid}>
            <li key={follower.uid}>{follower.displayName}</li>
          </Link>
          
        ))}
      </ul>
    </div>
  );
}

export default FollowerCountPopup;
