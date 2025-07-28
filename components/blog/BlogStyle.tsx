import { Timestamp } from "firebase-admin/firestore";
import React, { useState } from "react";
import Likes from "components/PostActions/Likes";
import CommentSection, {
  CommentCount,
} from "components/PostActions/Comments/CommentSection";

interface BlogStyleProps {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: any | Timestamp;
  authorDisplayName: string;
  authorUid: string;
  profilePicture: string;
  currentLikes: string[];
  currentUser: string;
  currentUserDisplayName: string;
}

function BlogStyle({
  id,
  title,
  content,
  imageUrl,
  createdAt,
  authorDisplayName,
  profilePicture,
  currentLikes,
  currentUser,
  currentUserDisplayName,
  authorUid,
}: BlogStyleProps) {
  const [expandedBlog, setExpandedBlog] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);

  const handleExpandBlog = (blogId: string) => {
    setExpandedBlog((prev) => (prev === blogId ? null : blogId));
  };

  const handleExpandedComments = (blogId: string) => {
    setExpandedComments((prev) => (prev === blogId ? null : blogId));
  };

  return (
    <div
      className={`flex flex-col border-2 rounded overflow-hidden shadow-2xl p-2 ${
        expandedBlog === id
          ? "absolute top-0 left-0 w-full z-50 bg-gray-100 h-124 justify-start"
          : "relative bg-white"
      }`}
    >
      <div
        className="cursor-pointer border flex flex-col items-center rounded"
        onClick={() => handleExpandBlog(id)}
      >
        <h2
          className={`font-bold text-md capitalize px-4 pt-4 text-center ${
            expandedBlog === id ? "text-2xl pb-2" : "text-md"
          }`}
        >
          {title}
        </h2>
        <div className="border w-3/4"></div>
        <p
          className={`${
            expandedBlog === id
              ? "h-124 overflow-y-auto pt-6 px-10 whitespace-pre-wrap break-word"
              : "h-24 overflow-hidden p-2"
          }`}
        >
          {content}
        </p>

        {imageUrl && <img src={imageUrl} alt={title} />}
      </div>
      <div className="flex items-center space-x-2 border-t p-2 bg-gray-300 w-full">
        {profilePicture && (
          <img
            className="w-12 h-12 rounded-full border-2"
            src={profilePicture}
            alt={`${authorDisplayName}'s profile`}
          />
        )}
        <div className="flex flex-col">
          <p>By: {authorDisplayName}</p>
          <p>
            Created at:{" "}
            {createdAt instanceof Date
              ? createdAt.toLocaleDateString()
              : createdAt?.toDate?.().toLocaleDateString?.() ?? "Unknown"}
          </p>
        </div>
        <Likes
          docId={id}
          currentLikes={currentLikes || []}
          collectionName={"blogs"}
          targetUid={authorUid}
          currentUser={currentUser}
          displayName={authorDisplayName}
          currentUserDisplayName={currentUserDisplayName}
        />
        <div
          onClick={() => handleExpandedComments(id)}
          className="cursor-pointer flex flex-col"
        >
          <CommentCount postId={id} />
        </div>
      </div>
      {expandedComments === id && (
        <CommentSection postId={id} postAuthorId={authorUid} />
      )}
    </div>
  );
}

export default BlogStyle;
