"use client";
import React, { useState } from "react";
import Likes from "../PostActions/Likes";
import CommentSection, {
  CommentCount,
} from "../PostActions/Comments/CommentSection";
import SharePost from "../PostActions/SharePost";
import FollowButton from "../shared/FollowButton";
import { MdReportGmailerrorred } from "react-icons/md";
import Report from "../PostActions/Report";
import Delete from "../PostActions/Delete";

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
  currentUserDisplayName: string;
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
  currentUserDisplayName,
}: PostStyleProps) {
  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);

  const handleToggleComments = (postId: string) => {
    setOpenPostId((prev) => (prev === postId ? null : postId));
  };

  const handleShowReportForm = () => {
    setShowReportForm((prev) => !prev);
  };

  return (
    <div className="p-4 rounded-lg w-full bg-gradient-to-t from-blue-950 via-gray-400 to-gray-300 text-white min-h-84">
      <div className="flex justify-between items-end gap-2">
        <div className="flex items-center gap-2">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="border-2 w-12 h-12 rounded-full"
            />
          ) : null}
          <div className="flex flex-col">
            <h3 className="font-bold capitalize text-xl">{displayName}</h3>
            {createdAt && (
              <span className="text-sm">
                Posted on: {new Date(createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        {currentUser && targetUid !== currentUser && (
          <FollowButton targetUid={targetUid} />
        )}
        {currentUser && targetUid === currentUser && (
          <div className="flex items-center">
            <Delete postId={docId} />
          </div>
        )}
      </div>

      {mediaUrl?.includes("video") ? (
        <div>
          <video controls className="w-full max-h-[300px] object-contain" src={mediaUrl} />
         <p>{textContent || ""}</p>
        </div>
      ) : mediaUrl ? (
        <div className='mt-10 border-b'>
          <img src={mediaUrl} alt="Post media" className="w-full max-h-[300px] object-contain" />
           <p className="p-5">{textContent}</p>
        </div>
      ) : (
        <div className="text-black bg-white h-36">
          <p className="text-lg">{textContent}</p>
        </div>
      )}
      
      <div className="flex justify-around items-center py-5">
        <Likes
          docId={docId}
          currentLikes={currentLikes || []}
          collectionName={"posts"}
          targetUid={targetUid}
          currentUser={currentUser}
          displayName={displayName}
          currentUserDisplayName={currentUserDisplayName}
        />
        <div
          onClick={() => handleToggleComments(docId)}
          className="ml-2 cursor-pointer"
        >
          <CommentCount postId={docId} />
        </div>
        <SharePost
          postId={docId}
          postAuthorId={targetUid}
          currentUser={currentUser}
          currentUserDisplayName={currentUserDisplayName}
          collectionName={"posts"}
        />
        <div onClick={handleShowReportForm} className="ml-2 cursor-pointer">
          <MdReportGmailerrorred size={22} />
        </div>
      </div>
      <div className="text-black">
      {openPostId === docId && (
        <CommentSection maxChar={300} postId={docId} postAuthorId={targetUid} />
      )}
      {showReportForm && <Report postId={docId} />}
      </div>
    </div>
  );
}

export default PostStyle;
