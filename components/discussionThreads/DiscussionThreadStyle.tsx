"use client";
import React, { useEffect, useState } from "react";
import { getUserDocHelper } from "@/utilities/userDocHelper";
import Link from "next/link";
import Likes from "components/PostActions/Likes";
import CommentSection, {
  CommentCount,
} from "components/PostActions/Comments/CommentSection";
import SharePost from "components/PostActions/SharePost";
import { formatTimeAgo } from "@/utilities/formatTimeAgoHelper";
import topicData from "../topics/topicData.json";
import Elipsis from "components/shared/Elipsis";

function DiscussionThreadStyle({
  currentUser,
  authorUid,
  title,
  content,
  createdAt,
  currentLikes,
  postId,
  currentUserDisplayName,
  topic,
  usersProfileStyle,
}: {
  currentUser: any;
  authorUid?: any;
  title?: string;
  content?: string;
  createdAt?: any;
  currentLikes: string[];
  postId?: string;
  currentUserDisplayName?: string;
  topic: string;
  usersProfileStyle?: boolean;
}) {
  const authorUidsDoc = getUserDocHelper(authorUid);
  const [authorUidData, setauthorUidData] = useState<any>(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchauthorUidData = async () => {
      if (!authorUidsDoc) return;
      const userData = await authorUidsDoc.fetchUserData();
      setauthorUidData(userData);
    };
    fetchauthorUidData();
  }, [authorUid]);

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
  };

 
  return (
    <div className={`border border-gray-300 bg-white  pt-0.25 rounded-lg shadow-sm flex flex-col items-start ${usersProfileStyle ? "w-full" : "sm:w-1/2 w-full lg:w-full"}`} style={{
            background:
              topicData.find((t) => t.topic === topic)?.textBackground ||
              "white"
          }}
      >
        <div className="flex justify-between relative w-full mb-0.25">
          <div
            style={{
              background:
                topicData.find((t) => t.topic === topic)?.textBackground ||
              "white",
            color:
              topicData.find((t) => t.topic === topic)?.textColor || "black",
          }}
          className="text-xs rounded-full flex justify-center items-center px-2"
        >
          {topic}
        </div>
        <Elipsis
          currentUser={currentUser?.uid || currentUser}
          targetUid={authorUid}
          docId={postId || ""}
          collection={"discussionThreads"}
        />
      </div>
      <div className="border p-2 w-full border-gray-300 bg-white rounded-lg shadow-sm flex items-start">
        <Link className="hidden sm:block" href={`/profile/${authorUid}`}>
          <img
            src={authorUidData?.profilePicture}
            alt="Author Profile"
            className="w-10 h-10 rounded-full border"
          />
        </Link>
        <div className="flex-1 ml-2">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <Link className="sm:hidden block" href={`/profile/${authorUid}`}>
              <img
                src={authorUidData?.profilePicture}
                alt="Author Profile"
                className="w-10 h-10 rounded-full border"
              />
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Link href={`/profile/${authorUid}`}>
                  <h2 className="font-semibold capitalize">
                    {authorUidData?.displayName || "Unknown Author"}
                  </h2>
                </Link>

                <p className="text-xs">
                  {createdAt
                    ? formatTimeAgo(
                        createdAt.toDate
                          ? createdAt.toDate()
                          : new Date(createdAt)
                      )
                    : "Unknown time"}
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="">{content}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Likes
              message="liked your thread"
              type="likedDiscussionThread"
              docId={postId || ""}
              currentLikes={currentLikes || []}
              collectionName={"discussionThreads"}
              targetUid={authorUid}
              currentUser={currentUser.uid || currentUser}
              displayName={authorUidData?.displayName || "Unknown Author"}
              currentUserDisplayName={
                currentUserDisplayName ||
                currentUser?.displayName ||
                "Unknown User"
              }
            />
            <div onClick={handleToggleComments} className="cursor-pointer flex">
              <CommentCount postId={postId || ""} />
            </div>
            <SharePost
              postId={postId || ""}
              postAuthorId={authorUid || ""}
              currentUser={currentUser?.uid || currentUser}
              currentUserDisplayName={
                currentUserDisplayName || currentUser?.displayName || ""
              }
              collectionName={"discussionThreads"}
              type={"sharedDiscussionThread"}
            />
            
          </div>
          <div></div>
        </div>
      </div>
      {showComments && (
        <div className="mt-4 w-full">
          <CommentSection postId={postId || ""} postAuthorId={authorUid} maxChar={1000} type={"commentDiscussionThread"} message={'commented on your thread'} />
        </div>
      )}
      
    </div>
  );
}

export default DiscussionThreadStyle;
