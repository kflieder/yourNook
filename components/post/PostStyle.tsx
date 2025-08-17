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
import Link from "next/link";

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
  thumbnail?: boolean;
  styleSelector?: string;
}

function PostStyle({
  displayName,
  profilePicture,
  textContent,
  mediaUrl,
  createdAt,
  docId,
  currentLikes,
  targetUid,
  currentUser,
  currentUserDisplayName,
  thumbnail = false,
  styleSelector,
}: PostStyleProps) {
  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showEllipsis, setShowEllipsis] = useState(false);
  const [openThumbnail, setOpenThumbnail] = useState(false);

  const handleToggleComments = (postId: string) => {
    setOpenPostId((prev) => (prev === postId ? null : postId));
  };

  const handleShowReportForm = () => {
    setShowReportForm((prev) => !prev);
  };
  const handleShowEllipsis = () => {
    setShowEllipsis((prev) => !prev);
  };

  const handleOpenFromThumbnail = () => {
    setOpenThumbnail((prev) => !prev);
  };



  if (thumbnail && !openThumbnail)
    return (
      <div className="cursor-pointer" onClick={handleOpenFromThumbnail}>
        {mediaUrl ? (
          mediaUrl.includes("video") ? (
            <video
              controls
              className="w-full max-h-62 object-contain"
              src={mediaUrl}
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Post media"
              className="w-full max-h-56 object-contain border"
            />
          )
        ) : null}
        <p>{textContent}</p>
      </div>
    );

  const feedStyleClasses = {
    outterMostDivContainer:
      "pb-4 rounded-lg bg-gradient-to-t from-blue-950 via-gray-400 to-gray-300 text-white min-h-84 w-full sm:w-120 h-110 mx-auto my-4 shadow-xl",
    littleHeaderThing: "flex justify-between items-end gap-2 mb-2 px-2",
  };

  const profileStyleClasses = {
    outterMostDivContainer: `flex flex-col justify-between py-2 rounded-lg bg-gradient-to-t from-blue-950 via-gray-400 to-gray-300 text-white min-h-84 w-64 mx-auto my-4 shadow-xl ${
      thumbnail ? "cursor-pointer" : ""
    }`,
    littleHeaderThing: "border flex justify-between items-end gap-2 mb-2",
  };

  return (
    <div
      onClick={thumbnail ? handleOpenFromThumbnail : undefined}
      className={`relative flex flex-col justify-between
         ${
           styleSelector === "feed"
             ? feedStyleClasses.outterMostDivContainer
             : profileStyleClasses.outterMostDivContainer
         }`}
    >
      <div
        className={`relative z-10 text-black ${
          styleSelector === "feed"
            ? feedStyleClasses.littleHeaderThing
            : profileStyleClasses.littleHeaderThing
        }
        `}
      >
        <div className="flex bg-gray-50/30 rounded p-1 items-center gap-2">
          {profilePicture ? (
            <Link href={`/profile/${targetUid}`}>
              <img
                src={profilePicture}
                alt="Profile"
                className="border-2 w-12 h-12 rounded-full"
              />
            </Link>
          ) : null}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Link href={`/profile/${targetUid}`}>
                <h3 className="font-bold capitalize text-xl">{displayName}</h3>
              </Link>
              {currentUser && targetUid !== currentUser && (
                <FollowButton targetUid={targetUid} />
              )}
            </div>
            {createdAt && (
              <span className="text-sm">
                Posted on: {new Date(createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="p-1 flex flex-col items-end">
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

      <div className="absolute inset-0 flex justify-center items-center">
        {mediaUrl?.includes("video") ? (
          <div className="flex absolute w-full max-h-96 top-0 inset-0">
            <video
              controls
              className="w-full h-full object-contain"
              src={mediaUrl}
            />
            <p>{textContent}</p>
          </div>
        ) : mediaUrl ? (
          <div className="flex absolute w-full max-h-96 top-0 inset-0">
            <img
              src={mediaUrl}
              alt="Post media"
              className="w-full h-full object-contain"
            />
            {textContent && (
              <p className="absolute bottom-0 left-0 p-2 w-full text-center bg-gray-400/80 rounded">
                {textContent}
              </p>
            )}
          </div>
        ) : (
          <p className="bg-white flex justify-center items-center w-full h-46 text-lg text-black text-center">
            {textContent}
          </p>
        )}
      </div>

      <div className="relative z-98 flex justify-around items-center h-10 border-t pt-4">
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
      {openPostId === docId && (
        <div className="bg-white text-black relative z-99 h-3/4">
          <CommentSection
            maxChar={300}
            postId={docId}
            postAuthorId={targetUid}
          />
        </div>
      )}
    </div>
  );
}

export default PostStyle;
