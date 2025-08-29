"use client";
import { Timestamp } from "firebase-admin/firestore";
import React, { useState } from "react";
import Likes from "components/PostActions/Likes";
import CommentSection, {
  CommentCount,
} from "components/PostActions/Comments/CommentSection";
import SharePost from "components/PostActions/SharePost";
import Report from "components/PostActions/Report";
import { MdReportGmailerrorred } from "react-icons/md";
import { useLiveUserData } from "@/utilities/useLiveUserData";
import Link from "next/link";
import blogTopicData from "@/utilities/blogs/blogTopicData.json";

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
  topic: string;
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
  topic,
}: BlogStyleProps) {
  const [expandedBlog, setExpandedBlog] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const authorData = useLiveUserData(authorUid);

  const handleExpandBlog = (blogId: string) => {
    setExpandedBlog((prev) => (prev === blogId ? null : blogId));
  };

  const handleExpandedComments = (blogId: string) => {
    setExpandedComments((prev) => (prev === blogId ? null : blogId));
  };
  function handleExpandedReportForm() {
    setShowReportForm((prev) => !prev);
  }

  return (
    <div
      className={`flex flex-col rounded overflow-hidden shadow-2xl ${
        expandedBlog === id
          ? "absolute top-0 left-0 w-full z-50 bg-gray-100 h-124 justify-start"
          : "relative bg-white z-1"
      }`}
    >
      <div
        style={{
          background:
            blogTopicData.find((t) => t.topic === topic)?.headerBackground ||
            "white",
        }}
        className="flex items-center space-x-2 p-2"
      >
        <span
          className="text-2xl"
          style={{
            color: blogTopicData.find((t) => t.topic === topic)?.textColor,
          }}
        >
          {blogTopicData.find((t) => t.topic === topic)?.icon}
        </span>
      </div>
      <div
        className="flex flex-col items-center rounded bg-white"
      >
        <div className="flex w-full items-center p-4 gap-4">
          <h2
            className="p-1 px-2 rounded-full"
            style={{
              color:
                blogTopicData.find((t) => t.topic === topic)?.textColor ||
                "black",
              background:
                blogTopicData.find((t) => t.topic === topic)?.textBackground ||
                "white",
            }}
          >
            {topic}
          </h2>
          <p>
            {createdAt instanceof Date
              ? createdAt.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : createdAt
                  ?.toDate?.()
                  ?.toLocaleDateString?.(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) ?? "Unknown"}
          </p>
        </div>
        <div className='relative w-full px-6 space-y-2'>
        <h2
          className={`font-bold text-md capitalize ${
            expandedBlog === id ? "text-2xl pb-2" : "text-xl"
          }`}
        >
          {title}
        </h2>
        <p
          className={`${
            expandedBlog === id
              ? "h-124 overflow-y-auto pt-6 px-10 whitespace-pre-wrap break-word"
              : "h-24 overflow-hidden"
          }`}
        >
          {content}
        </p>
        <button className='absolute bottom-2 right-2 text-white px-2 py-1 rounded-full cursor-pointer bg-gray-600/80' onClick={() => handleExpandBlog(id)}>
          Read More
        </button>
        </div>

        {imageUrl && <img src={imageUrl} alt={title} />}
      </div>
      <div className="flex items-center space-x-2 border-t p-2  w-full">
        <Link href={`/profile/${authorUid}`}>
          <img
            className="w-12 h-12 rounded-full border-2"
            src={authorData?.profilePicture || profilePicture}
            alt={`${authorDisplayName}'s profile`}
          />
        </Link>

        <div className="">
          <Link
            href={`/profile/${authorUid}`}
            className="font-bold hover:underline"
          >
            <p>{authorData?.displayName || authorDisplayName}</p>
          </Link>
        </div>
        <div className="flex space-x-2 ml-auto">
          <Likes
            type={"likedBlog"}
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
          <SharePost
            postId={id}
            postAuthorId={authorUid}
            currentUser={currentUser}
            currentUserDisplayName={currentUserDisplayName}
            collectionName={"blogs"}
          />
          <MdReportGmailerrorred
            onClick={() => handleExpandedReportForm()}
            className="cursor-pointer"
            size={24}
          />
        </div>
      </div>
      {expandedComments === id && (
        <CommentSection
          maxChar={300}
          postId={id}
          postAuthorId={authorUid}
          type="commentBlog"
          message="commented on your blog!"
        />
      )}
      {showReportForm && <Report postId={id} />}
    </div>
  );
}

export default BlogStyle;
