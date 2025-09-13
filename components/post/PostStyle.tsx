"use client";
import React, { useState } from "react";
import Likes from "../PostActions/Likes";
import CommentSection, {
  CommentCount,
} from "../PostActions/Comments/CommentSection";
import SharePost from "../PostActions/SharePost";
import FollowButton from "../shared/FollowButton";
import Link from "next/link";
import Elipsis from "components/shared/Elipsis";
import { IoIosCloseCircleOutline } from "react-icons/io";

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
  onThumbnailClick?: (postId: string) => void;
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
  onThumbnailClick,
}: PostStyleProps) {
  const [openPostId, setOpenPostId] = useState<string | null>(null);

  const handleToggleComments = (postId: string) => {
    setOpenPostId((prev) => (prev === postId ? null : postId));
  };

  const handleOpenFromThumbnail = () => {
    onThumbnailClick?.(docId);
  };

  if (thumbnail)
    return (
      <div
        className="cursor-pointer bg-gray-500/50 w-42 h-42"
        onClick={handleOpenFromThumbnail}
      >
        {mediaUrl ? (
          mediaUrl.includes("video") ? (
            <video
              controls
              className="w-full max-h-42 object-contain"
              src={mediaUrl}
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Post media"
              className="w-full h-42 object-contain"
            />
          )
        ) : (
          <div className="h-42 flex justify-center items-center bg-gray-200 text-black p-2">
            <p>{textContent}</p>
          </div>
        )}
      </div>
    );

  const feedStyleClasses = {
    outterMostDivContainer:
      "rounded-lg bg-gradient-to-t from-blue-950 via-gray-400 to-gray-300 text-white h-100 w-[100vw] sm:w-120 shadow-xl",
    littleHeaderThing: "flex justify-between items-end gap-2 mb-2",
  };

  const profileStyleClasses = {
    outterMostDivContainer: `flex flex-col justify-between rounded-lg bg-gradient-to-t from-blue-950 via-gray-400 to-gray-300 text-white min-h-98 w-[100vw] sm:w-120 shadow-xl ${
      thumbnail ? "cursor-pointer" : ""
    }`,
    littleHeaderThing: "flex justify-between items-end gap-2 mb-2",
  };

  const post = (
    <div
      onClick={thumbnail ? handleOpenFromThumbnail : undefined}
      className={`relative w-full flex flex-col justify-between
         ${
           styleSelector === "feed"
             ? feedStyleClasses.outterMostDivContainer
             : profileStyleClasses.outterMostDivContainer
         }`}
    >
      <div
        className={`relative z-2 text-black ${
          styleSelector === "feed"
            ? feedStyleClasses.littleHeaderThing
            : profileStyleClasses.littleHeaderThing
        }
        `}
      >
        <div className="flex bg-gray-100/70 rounded p-1 items-center gap-2">
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
        <div className="p-1 flex flex-col items-end absolute right-0 top-0 bg-gray-300/50 text-white rounded-full">
          <Elipsis
            currentUser={currentUser}
            targetUid={targetUid}
            docId={docId}
            collection={"posts"}
          />
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
          <div className="flex absolute w-full max-h-[60vh] sm:max-h-96 top-0 inset-0">
            <img
              src={mediaUrl}
              alt="Post media"
              className="w-full h-full object-contain"
            />
            {textContent && (
              <p className="absolute bottom-15 sm:bottom-10 left-0 p-2 w-full text-center bg-gray-400/80 rounded">
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

      <div className="relative rounded-b-lg bg-blue-950 flex justify-around items-center border-t p-4">
        <Likes
          type={"likedPost"}
          docId={docId}
          currentLikes={currentLikes || []}
          collectionName={"posts"}
          targetUid={targetUid}
          currentUser={currentUser}
          displayName={displayName}
          currentUserDisplayName={currentUserDisplayName}
          message={"liked your post!"}
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
          type={"sharedPost"}
        />
      </div>
    </div>
  );

  return (
    <>
      {post}
      {openPostId === docId && (
        <div className="fixed top-5 sm:inset-0 z-3 flex md:flex-row flex-col justify-center items-center bg-black/50 w-full h-screen">
          <IoIosCloseCircleOutline
            className="absolute sm:top-30 top-20 right-0 text-white cursor-pointer z-20 sm:bg-gray-100/0 bg-black rounded-full"
            size={36}
            onClick={() => setOpenPostId(null)}
          />
          <div className="w-full m-0 sm:w-120">{post}</div>
          <div className="bg-white rounded shadow-2xl text-black overflow-y-auto hide-scrollbar w-full sm:w-120 sm:h-50 md:h-100 h-65 absolute sm:relative top-70 sm:top-auto">
            <CommentSection
              maxChar={300}
              postId={docId}
              postAuthorId={targetUid}
              type="commentPost"
              message="commented on your post!"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default PostStyle;
