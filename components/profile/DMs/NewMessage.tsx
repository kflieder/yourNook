import React, { useState, useEffect } from "react";
import SendMessageForm from "./SendMessageForm";
import { useMutualFriends } from "@/utilities/useMutualFriends";

interface NewMessageProps {
  currentUserUid: string;
  senderDisplayName: string;
  senderProfilePicture: string;
  selectedTargetUserUid?: string;
}

interface Friend {
    displayName: string;
    uid: string;
    profilePicture: string;
    uniqueUrl: string;
}

function NewMessage({
  currentUserUid,
  senderDisplayName,
  senderProfilePicture,
  selectedTargetUserUid,
}: NewMessageProps) {
  const [mutualUserData, setMutualUserData] = useState<Friend[]
  >([]);
  const mutualFriends = useMutualFriends(currentUserUid);
  const [searchText, setSearchText] = useState("");
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<null | Friend>(null);

  useEffect(() => {
    async function fetchMutualFriends() {
      if (mutualFriends) {
        const resolvedFriends = await mutualFriends;
        setMutualUserData(resolvedFriends);
        console.log("resolved Friends:", resolvedFriends);
      }
    }
    fetchMutualFriends();
  }, [mutualFriends]);

  useEffect(() => {
    if (searchText) {
      const filtered = mutualUserData.filter((friend) =>
        friend.displayName.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredFriends(filtered);
    } else {
      setFilteredFriends(mutualUserData);
    }
  }, [searchText, mutualUserData]);

  console.log(selectedFriend, 'selectedFriend');
  return (
    <div className="flex flex-col items-center p-4 border space-y-4">
      <input
        className="border"
        type="text"
        placeholder="Search for friends..."
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setSelectedFriend(null);
        }}
      />
      {searchText && !selectedFriend && (
        <ul className="w-full border bg-white max-h-40 overflow-y-auto">
          {filteredFriends.map((friend) => (
            <li
              key={friend.uid || friend.uniqueUrl}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onClick={() => {
                setSelectedFriend(friend);
                setSearchText(friend.displayName);
              }}
            >
              <img
                src={friend.profilePicture}
                alt={friend.displayName}
                className="w-6 h-6 rounded-full"
              />
              <span>{friend.displayName}</span>
            </li>
          ))}
        </ul>
      )}

      <SendMessageForm
        currentUserUid={currentUserUid}
        senderDisplayName={senderDisplayName}
        senderProfilePicture={senderProfilePicture}
        selectedTargetUserUid={selectedFriend?.uid || selectedTargetUserUid}
        targetUserDisplayName={selectedFriend?.displayName || ""}
        targetUserProfilePicture={selectedFriend?.profilePicture || ""}
      />
    </div>
  );
}

export default NewMessage;
