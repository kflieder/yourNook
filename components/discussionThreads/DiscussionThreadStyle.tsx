'use client';
import React, { useEffect, useState } from "react";
import { getUserDocHelper } from "@/utilities/userDocHelper";
import Link from "next/link";
import Likes from "components/PostActions/Likes";
import CommentSection, { CommentCount } from "components/PostActions/Comments/CommentSection";
import SharePost from "components/PostActions/SharePost";
import { MdReportGmailerrorred } from "react-icons/md";
import Report from "components/PostActions/Report";

function DiscussionThreadStyle({
  currentUser,
  authorUid,
  title,
  content,
  createdAt,
  currentLikes,
  postId,
  currentUserDisplayName,
}: {
  currentUser: any;
  authorUid?: any;
  title?: string;
  content?: string;
  createdAt?: any;
  currentLikes: string[];
  postId?: string;
  currentUserDisplayName?: string;
}) {
  const authorUidsDoc = getUserDocHelper(authorUid);
  const [authorUidData, setauthorUidData] = useState<any>(null);
  const [showComments, setShowComments] = useState(false);  
  const [showReportForm, setShowReportForm] = useState(false);

  useEffect(() => {
    const fetchauthorUidData = async () => {
      if (!authorUidsDoc) return;
      const userData = await authorUidsDoc.fetchUserData();
      setauthorUidData(userData);
    };
    fetchauthorUidData();
    console.log("Current User:", currentUser);
    console.log("Target User:", authorUid);
  }, [authorUid]);
  

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleShowReportForm = () => {
    setShowReportForm((prev) => !prev);
  }

  return (
    <div className="border w-1/2 p-4 rounded-lg shadow-sm flex flex-col">
      <h3 className="text-lg inline font-semibold border-b">{title}</h3>
      <p className="border inline">{content}</p>
      <div className="flex items-center gap-2 mt-2">
        <Link className="flex items-center gap-2" href={`/profile/${authorUid}`}>
        <img
          src={authorUidData?.profilePicture}
          alt="Author Profile"
          className="w-10 h-10 rounded-full border"
        />
        <h2>{authorUidData?.displayName || "Unknown Author"}</h2>
        </Link>
        <small>
        Created at:{" "}
        {createdAt?.toDate?.() // if it's a Firestore Timestamp, convert to Date
          ? createdAt.toDate().toLocaleString()
          : createdAt instanceof Date
          ? createdAt.toLocaleString()
          : new Date(createdAt).toLocaleString()}
      </small>
      </div>
      <div className='flex items-center space-x-2 mt-2'>
        <Likes
          type='discussionThreads'
          docId={postId || ""}
          currentLikes={currentLikes || []}
          collectionName={"discussionThreads"}
          targetUid={authorUid}
          currentUser={currentUser}
          displayName={authorUidData?.displayName || "Unknown Author"}
          currentUserDisplayName={currentUserDisplayName || currentUser?.displayName || "Unknown User"}
        />
        <div onClick={handleToggleComments} className="cursor-pointer flex">
          <CommentCount postId={postId || ""} />
        </div>
        <SharePost
          postId={postId || ""}
          postAuthorId={authorUid || ""}
          currentUser={currentUser?.uid || ""}
          currentUserDisplayName={currentUserDisplayName || currentUser?.displayName || ""}
          collectionName={"discussionThreads"}
        />
        <div onClick={handleShowReportForm} className="ml-2">
        <MdReportGmailerrorred className="cursor-pointer" size={24} />
        </div>
      </div>
      <div>
        {showComments && (
          <div className="mt-4">
            <CommentSection postId={postId || ""} postAuthorId={authorUid} />  
          </div>
        )}
        {showReportForm && (
          <div className="mt-4">
            <Report postId={postId || ""} />
          </div>
        )}
      </div>
    </div>
  );
}

export default DiscussionThreadStyle;
