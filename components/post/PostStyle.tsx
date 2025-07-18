"use client";
import React, { useState } from "react";
import Likes from "../PostActions/Likes";
import CommentSection, {
  CommentCount,
} from "../PostActions/Comments/CommentSection";
import SharePost from "../PostActions/SharePost";
import FollowButton from "../profile/FollowButton";

interface PostStyleProps {
  displayName: string;
  profilePicture?: string;
  textContent?: string;
  mediaUrl?: string;
  createdAt?: string;
  docId: string;
  currentLikes?: string[];
  collectionName?: string;
  targetUid: string;
  currentUser: string;
}

function PostStyle({
  displayName,
  profilePicture,
  textContent,
  mediaUrl,
  createdAt,
  docId,
  currentLikes,
  collectionName,
  targetUid,
  currentUser,
}: PostStyleProps) {
  const [openPostId, setOpenPostId] = useState<string | null>(null);

  const handleToggleComments = (postId: string) => {
    setOpenPostId((prev) => (prev === postId ? null : postId));
  };
  return (
    <div className="p-4 border rounded-lg w-84">
      <div className="flex border items-center gap-2">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="Profile"
            className="border-2 w-12 h-12 rounded-full mt-2"
          />
        ) : null}
        <h3 className="font-bold capitalize text-xl">{displayName}</h3>
        {targetUid !== currentUser && targetUid && currentUser && (
          <FollowButton targetUid={targetUid} />
        )}
      </div>
      <p>{textContent || ""}</p>
      {mediaUrl?.includes("video") ? (
        <video controls className="w-full mt-2" src={mediaUrl} />
      ) : mediaUrl ? (
        <img src={mediaUrl} alt="Post media" className="w-84 mt-2" />
      ) : null}
      {createdAt && (
        <span className="text-gray-500 text-sm">
          Posted on: {new Date(createdAt).toLocaleDateString()}
        </span>
      )}
      <div className="flex items-center mt-2">
        <Likes
          docId={docId}
          currentLikes={currentLikes || []}
          collectionName={collectionName || "posts"}
        />
        <div
          onClick={() => handleToggleComments(docId)}
          className="ml-2 cursor-pointer"
        >
          <CommentCount postId={docId} />
        </div>
        <SharePost postId={docId} />
      </div>
      {openPostId === docId && <CommentSection postId={docId} />}
    </div>
  );
}

export default PostStyle;
