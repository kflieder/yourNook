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
import { HiOutlineEllipsisHorizontal } from "react-icons/hi2";

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
  width?: string;
}

function PostStyle({
  width,
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
  const [showEllipsis, setShowEllipsis] = useState(false);

  const handleToggleComments = (postId: string) => {
    setOpenPostId((prev) => (prev === postId ? null : postId));
  };

  const handleShowReportForm = () => {
    setShowReportForm((prev) => !prev);
  };
  const handleShowEllipsis = () => {
    setShowEllipsis((prev) => !prev);
  };

  return (
    <div className={`flex flex-col justify-between py-2 rounded-lg bg-gradient-to-t from-blue-950 via-gray-400 to-gray-300 text-white min-h-84 ${width} mx-auto my-4 shadow-lg`}>
      <div className="flex justify-between items-end gap-2 mb-2">
        <div className="flex justify-between items-start w-full gap-2">
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
          <div>
            <HiOutlineEllipsisHorizontal
              size={34}
              className="cursor-pointer"
              onClick={handleShowEllipsis}
            />
            <div className="relative">
              {showEllipsis && (
                <div className="absolute right-0 w-36 p-1 bg-white border rounded shadow-lg z-10 text-black">
                  <ul className="">
                    {currentUser && targetUid === currentUser && (
                      <li>
                        <Delete postId={docId} />
                      </li>
                    )}
                    <li
                      onClick={handleShowReportForm}
                      className="flex hover:bg-gray-200 cursor-pointer justify-start items-center ml-2 space-x-2"
                    >
                      <MdReportGmailerrorred size={22} />
                      <p>Report post</p>
                    </li>
                  </ul>
                  {showReportForm && <Report postId={docId} />}
                </div>
              )}
            </div>
          </div>
        </div>
        {currentUser && targetUid !== currentUser && (
          <FollowButton targetUid={targetUid} />
        )}
      </div>

      <div className="w-full bg-white border mx-auto p-4">
  {mediaUrl?.includes("video") ? (
    <video controls className="w-full max-h-72 object-contain" src={mediaUrl} />
  ) : mediaUrl ? (
    <img src={mediaUrl} alt="Post media" className="w-full max-h-72 object-contain" />
  ) : (
    <p className="text-lg text-black text-center">{textContent}</p>
  )}
</div>

      <div className="flex justify-around items-center border-t pt-5">
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
      </div>
      <div className="text-black">
        {openPostId === docId && (
          <CommentSection
            maxChar={300}
            postId={docId}
            postAuthorId={targetUid}
          />
        )}
      </div>
    </div>
  );
}

export default PostStyle;
