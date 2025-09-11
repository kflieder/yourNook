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
    <div className="flex flex-col border border-gray-300 rounded-lg shadow-2xl p-4 text-center mt-5 bg-white">
      <h1>Your Mutuals</h1>
      <ul className="border border-gray-400 rounded flex flex-wrap gap-y-2 items-center py-2 gap-x-2 bg-gray-100 shadow-inner justify-center">
        {mutualUserData.map((user, index) => (
          <li key={index} className="flex justify-center items-center w-22 h-22 bg-white  rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
            <Link
              className="flex flex-col justify-center items-center"
              href={`/profile/${user.uniqueUrl}`}
            >
              <img
                src={user.profilePicture}
                alt={`${user.displayName}'s profile`}
                className="w-14 h-14 rounded-full border border-gray-500 p-0.5"
              />
              <div className="cursor-pointer text-sm hover:underline capitalize">
                {user.displayName}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendsList;
