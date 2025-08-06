import {useEffect, useState} from 'react';
import { useLiveUserData } from './useLiveUserData';
import { useUserDoc } from './userDocHelper';

interface Friend {
    displayName: string;
    uid: string;
    profilePicture: string;
    uniqueUrl: string;
}


export function useMutualFriends(currentUserUid: string | undefined) {
    const liveUserData = useLiveUserData(currentUserUid);
    const [mutualUserData, setMutualUserData] = useState<Friend[]>([]);


    useEffect(() => {
        if (!liveUserData) return;
    
        const followers = liveUserData?.followers || [];
        const following = liveUserData?.following || [];
        const mutuals: string[] = followers.filter((follower: string) =>
          following.includes(follower)
        );
    
        async function fetchMutualUserData() {
          const mutualUserData = await Promise.all(
            mutuals.map(async (uid: string) => {
              const userData = await useUserDoc(uid)?.fetchUserData();
              return {
                displayName: userData?.displayName || "Unknown User",
                uniqueUrl: userData?.uniqueUrl || "",
                profilePicture: userData?.profilePicture || "",
                uid: uid,
              };
            })
          );
          setMutualUserData(mutualUserData);
        }
    
        fetchMutualUserData();
      }, [liveUserData]);
        return mutualUserData;
}

