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
    <div className="flex flex-col border border-gray-300 rounded-lg shadow-2xl p-4 text-center mt-5">
      <h1>All your friends betch</h1>
      <ul className="border border-gray-300 rounded flex flex-wrap justify-around items-center py-4 space-x-2 space-y-4 bg-gray-100">
        {mutualUserData.map((user, index) => (
          <div key={index} className="flex justify-center items-center p-5 w-28 h-28 bg-white  rounded-lg shadow-lg">
            <Link
              className="flex flex-col justify-center items-center"
              href={`/profile/${user.uniqueUrl}`}
            >
              <img
                src={user.profilePicture}
                alt={`${user.displayName}'s profile`}
                className="w-16 h-16 rounded-full"
              />
              <li className="cursor-pointer text-sm hover:underline">
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
