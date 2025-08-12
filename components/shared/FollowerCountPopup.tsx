"use client";
import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useLiveUserData } from "@/utilities/useLiveUserData";
import Link from "next/link";
import { IoPeopleOutline } from "react-icons/io5";
import { CiStar } from "react-icons/ci";

interface FollowerProfile {
  uid: string;
  displayName: string;
}

function FollowerCountPopup({ userId }: { userId: string }) {
  const liveUserData = useLiveUserData(userId);
  const [followerProfiles, setFollowerProfiles] = useState<FollowerProfile[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [expandedFollowers, setExpandedFollowers] = useState(false);
  const [expandedFollowing, setExpandedFollowing] = useState(false);
  const [following, setFollowing] = useState<FollowerProfile[]>([]);

  useEffect(() => {
    async function fetchFollowerProfiles() {
      if (!liveUserData?.followers || !liveUserData?.following) return;

      setLoading(true);
      try {
        const profiles = await Promise.all(
          liveUserData?.followers.map(async (followerUid: string) => {
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

        const following = await Promise.all(
          liveUserData?.following.map(async (followingUid: string) => {
            const docRef = doc(db, "users", followingUid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              return {
                uid: followingUid,
                displayName: data.displayName || "Unknown User",
              };
            }
            return { uid: followingUid, displayName: "Unknown User" };
          })
        );

        setFollowerProfiles(profiles);
        setFollowing(following);
      } catch (error) {
        console.error("Error fetching follower profiles:", error);
        setFollowerProfiles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFollowerProfiles();
  }, [liveUserData?.followers, liveUserData?.following]);

  if (loading) return <p>Loading followers...</p>;
  

  const toggleFollowers = () => {
    setExpandedFollowers(!expandedFollowers);
  };
  const toggleFollowing = () => {
    setExpandedFollowing(!expandedFollowing);
  };
  return (
    <div className="flex justify-center items-center gap-12">
      <div >
        <div onClick={toggleFollowers} className="cursor-pointer">
        <p className="cursor-pointer relative flex justify-center items-center font-bold" >
          <IoPeopleOutline className="mr-1" size={20} />
           {followerProfiles.length}
        </p>
        <p className="text-sm">Followers</p>
        </div>
        {expandedFollowers && (
          <div className="absolute bg-white border rounded p-4 shadow-lg z-10">
            <ul>
              {followerProfiles.map((follower) => (
                <Link href={`/profile/${follower.uid}`} key={follower.uid}>
                  <li key={follower.uid}>{follower.displayName}</li>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div>
        <div onClick={toggleFollowing} className="cursor-pointer">
          <p className="relative flex justify-center items-center font-bold" >
            <CiStar className="mr-1" size={22}/>
            {following.length}
          </p>
          <p className="text-sm">Following</p>
        </div>
        
        
        {expandedFollowing && (
          <div className="absolute bg-white border rounded p-4 shadow-lg z-10">
            <ul>
              {following.map((follow) => (
                <Link href={`/profile/${follow.uid}`} key={follow.uid}>
                  <li key={follow.uid}>{follow.displayName}</li>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default FollowerCountPopup;
