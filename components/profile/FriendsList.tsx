import React, { useEffect } from "react";
import Link from "next/link";
import { useMutualFriends } from "@/utilities/useMutualFriends";

interface FriendsListProps {
  currentUserUid: string;
}

function FriendsList({ currentUserUid }: FriendsListProps) {
  const [mutualUserData, setMutualUserData] = React.useState<
    { displayName: string; uniqueUrl: string; profilePicture: string }[]
  >([]);

  const mutualFriends = useMutualFriends(currentUserUid);
  useEffect(() => {
    async function fetchMutualFriends() {
      if (mutualFriends) {
        const resolvedFriends = await mutualFriends;
        setMutualUserData(resolvedFriends);
      }
    }
    fetchMutualFriends();
  }, [mutualFriends]);


  return (
    <div className="flex flex-col border p-4 mr-4 text-center">
      <h1>This will be the friends list yayayayay</h1>
      <ul className="border flex flex-col items-center space-y-2 py-4">
        {mutualUserData.map((user, index) => (
          <div key={index} className="flex items-center space-x-2 border w-1/2">
            <Link
              className="flex items-center space-x-2"
              href={`/profile/${user.uniqueUrl}`}
            >
              <img
                src={user.profilePicture}
                alt={`${user.displayName}'s profile`}
                className="w-10 h-10 rounded-full"
              />
              <li className="cursor-pointer hover:underline">
                {user.displayName}
              </li>
            </Link>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default FriendsList;
