import React, { useEffect, useState } from "react";
import { useUserDoc } from "@/utilities/userDocHelper";

function DiscussionThreadStyle({
  currentUser,
  targetUser,
  title,
  content,
  createdAt,
}: {
  currentUser: any;
  targetUser?: any;
  title?: string;
  content?: string;
  createdAt?: any;
}) {
  // const targetUsersDoc = useUserDoc(targetUser);
  const [targetUserData, setTargetUserData] = useState<any>(null);

  // useEffect(() => {
  //   const fetchTargetUserData = async () => {
  //     if (!targetUsersDoc) return;
  //     const userData = await targetUsersDoc.fetchUserData();
  //     setTargetUserData(userData);
  //   };
  //   fetchTargetUserData();
  //   console.log("Current User:", currentUser);
  //   console.log("Target User:", targetUser);
  // }, [targetUser]);

  return (
    <div className="border w-1/2 p-4 rounded-lg shadow-sm flex flex-col">
      <h3 className="text-lg inline font-semibold border-b">{title}</h3>
      <p className="border inline">{content}</p>
      <small>
        Created at:{" "}
        {createdAt?.toDate?.() // if it's a Firestore Timestamp, convert to Date
          ? createdAt.toDate().toLocaleString()
          : createdAt instanceof Date
          ? createdAt.toLocaleString()
          : new Date(createdAt).toLocaleString()}
      </small>
    </div>
  );
}

export default DiscussionThreadStyle;
