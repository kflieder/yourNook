import React from "react";
import Likes from "../PostActions/Likes";

interface PostStyleProps {
  displayName: string;
  textContent?: string;
  mediaUrl?: string;
  createdAt?: string;
  docId: string;
  currentLikes?: string[];
  collectionName?: string;
}

function PostStyle({ displayName, textContent, mediaUrl, createdAt, docId, currentLikes, collectionName }: PostStyleProps) {
  return (
    <div className="p-4 border rounded-lg w-84">
      <h3 className="font-bold">{displayName}</h3>
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
        <div>
            <Likes 
                docId={docId}
                currentLikes={currentLikes || []}
                collectionName={collectionName || "posts"}
            />
        </div>
    </div>
  );
}

export default PostStyle;
