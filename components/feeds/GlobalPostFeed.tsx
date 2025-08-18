"use client";
import React, { useState } from "react";
import { usePaginatedPosts } from "@/utilities/usePaginatedPosts";
import LivePost from "components/post/LivePost";
import CreatePost from "components/profile/CreatePost";
import DMComponent from "components/profile/DMs/DMComponent";
import { TbPhotoPlus } from "react-icons/tb";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface GlobalPostFeedProps {
  currentUser: { uid: string; displayName: string; profilePicture?: string };
}

function GlobalPostFeed({ currentUser }: GlobalPostFeedProps) {
  const { posts, loading, hasMore, loadMoreRef } = usePaginatedPosts(
    "posts",
    "createdAt",
    currentUser.uid,
    "uid"
  );
  const [activePostTab, setActivePostTab] = useState<
    "latest" | "trending" | "friends"
  >("latest");
  const [toggleCreateMobilePost, setToggleCreateMobilePost] = useState(false);

  function handleTabChange(tab: "latest" | "trending" | "friends") {
    if (activePostTab === tab) return;
    setActivePostTab(tab);
    console.log(`Active post tab changed to: ${tab}`);
  }

  function handleToggleCreateMobilePost() {
    setToggleCreateMobilePost((prev) => !prev);
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-5 justify-between h-screen pt-20">
      <div className="col-span-3 flex flex-col gap-y-4 overflow-scroll overflow-x-hidden hide-scrollbar">
        <div className="flex items-start justify-around w-full mt-10">
          <h1
            onClick={() => handleTabChange("latest")}
            className={`cursor-pointer ${
              activePostTab === "latest" ? "font-bold" : ""
            }`}
          >
            Latest
          </h1>
          <h1
            onClick={() => handleTabChange("trending")}
            className={`cursor-pointer ${
              activePostTab === "trending" ? "font-bold" : ""
            }`}
          >
            Trending
          </h1>
          <h1
            onClick={() => handleTabChange("friends")}
            className={`cursor-pointer ${
              activePostTab === "friends" ? "font-bold" : ""
            }`}
          >
            Friends
          </h1>
        </div>
        {posts.map((post) => (
          <div key={post.id} className="w-full rounded flex justify-center">
            <LivePost
              post={post}
              currentUser={currentUser.uid}
              currentUserDisplayName={currentUser.displayName}
              styleSelector="feed"
            />
          </div>
        ))}
        {loading && <p>Loading...</p>}
        {hasMore && <div ref={loadMoreRef} />}
      </div>
      <div className="hidden sm:flex flex-col col-span-2 gap-y-4 pr-5 pt-20 overflow-hidden overflow-x-hidden hide-scrollbar">
        <DMComponent
          currentUser={currentUser.uid}
          targetUser={currentUser.uid}
        />
        <CreatePost />
      </div>
      <div className="relative sm:hidden flex justify-around p-2">
        <TbPhotoPlus
          onClick={handleToggleCreateMobilePost}
          size={22}
          className="cursor-pointer mr-2"
        />
        <DMComponent
          currentUser={currentUser.uid}
          targetUser={currentUser.uid}
        />
      </div>
      {toggleCreateMobilePost && (
        <div className="absolute bottom-10 left-0 right-0 z-49 bg-white p-2">
          <div className="flex justify-between">
          <h1>Create Post</h1>
          <IoIosCloseCircleOutline className="cursor-pointer" size={22} onClick={handleToggleCreateMobilePost} />
          </div>
          <CreatePost />
        </div>
      )}
    </div>
  );
}

export default GlobalPostFeed;
