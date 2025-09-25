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
      "w-full max-w-xl mx-auto overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900",
    littleHeaderThing: "flex items-center justify-between p-4",
    body: "relative bg-neutral-100 dark:bg-neutral-800",
  };

  const profileStyleClasses = {
    outterMostDivContainer: `w-full max-w-xl mx-auto overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 ${
      thumbnail ? "cursor-pointer" : ""
    }`,
    littleHeaderThing: "flex items-center justify-between p-4",
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
        <div className="flex items-center gap-3 w-full">
          {profilePicture ? (
            <Link
              className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded-full"
              href={`/profile/${targetUid}`}
            >
              <img
                src={profilePicture}
                alt="Profile"
                className="h-11 w-11 rounded-full object-cover"
              />
            </Link>
          ) : null}
          <div className="w-full">
            <div className="flex items-center justify-between gap-2 w-full">
              <Link href={`/profile/${targetUid}`}>
                <h3 className="truncate font-semibold text-neutral-900 dark:text-neutral-50 capitalize">
                  {displayName}
                </h3>
              </Link>
            </div>
            <div className="flex items-center justify-between">
            {createdAt && (
              <span className="text-sm">
                Posted on: {new Date(createdAt).toLocaleDateString()}
              </span>
            )}
            {currentUser && targetUid !== currentUser && (
                <FollowButton targetUid={targetUid} />
              )}
            </div>
          </div>
        </div>
        <div className="p-1 flex flex-col items-end absolute right-0 top-0 rounded-full">
          <Elipsis
            currentUser={currentUser}
            targetUid={targetUid}
            docId={docId}
            collection={"posts"}
          />
        </div>
      </div>

      <div className="relative bg-neutral-100 dark:bg-neutral-800 border border-gray-300">
        {mediaUrl?.includes("video") ? (
          <>
            <video
              controls
              className="w-full h-auto object-contain aspect-[4/5] sm:aspect-video"
              src={mediaUrl}
            />
          </>
        ) : (
          mediaUrl && (
            <>
              <img
                src={mediaUrl}
                alt="Post media"
                className="w-full h-auto object-contain aspect-[5/5] sm:aspect-video"
              />
            </>
          )
        )}
        {textContent && <p className="w-full text-center flex justify-center items-center px-5">{textContent}</p>}
      </div>
      <div className="px-2 sm:px-10 py-2">
        <div className="flex items-center justify-around">
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
    </div>
  );

  return (
    <>
      {post}
      {openPostId === docId && (
        <div className="fixed bottom-10 sm:inset-0 z-3 flex md:flex-row flex-col justify-center items-center bg-black/50 w-full h-screen p-2">
          <div className="w-full m-0 sm:w-120">{post}</div>
          <div className="bg-white rounded-2xl shadow-2xl text-black text-sm overflow-y-auto hide-scrollbar w-full sm:w-120 sm:h-50 md:max-h-120 md:min-h-92 h-65 absolute sm:relative sm:bottom-0 bottom-10 sm:top-auto">
            <CommentSection
              maxChar={300}
              postId={docId}
              postAuthorId={targetUid}
              type="commentPost"
              message="commented on your post!"
              clickXfunction={() => setOpenPostId(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default PostStyle;
