"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import Bio from "./Bio";
import CreatePost from "./CreatePost";
import UserPosts from "../post/UserPosts";
import UserBlogs from "components/blog/UserBlogs";
import BlogForm from "components/blog/BlogForm";
import FriendsList from "./FriendsList";
import { useUserDoc } from "@/utilities/userDocHelper";
import BlockButton from "components/shared/BlockButton";
import { isBlockedBy } from "@/utilities/blockUserHelper";

interface ProfilePageProps {
  userData: {
    displayName: string;
    pronouns?: {
      she?: boolean;
      he?: boolean;
      theyThem?: boolean;
      other?: string;
    };
    bio?: string;
    links?: string;
    uniqueUrl?: string;
    profilePicture?: string;
    uid?: string;
    contentType?: string[];
    defaultContentType?: string;
  };
  posts: Array<{
    id: string;
    [key: string]: any;
  }>;
}

function ProfilePage({ userData, posts }: ProfilePageProps) {
  const { username } = useAuth();
  const isOwner = username?.uid === userData.uid;
  if (!username) {
    return null;
  }
  const currentUsersPostBlogThreadSetting = useUserDoc(username.uid);
  const targetUsersPostBlogThreadSetting = useUserDoc(userData.uid);
  const [activeTab, setActiveTab] = React.useState<
    "posts" | "blog" | "thread"
  >("posts");
  const [isBlocked, setIsBlocked] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (username && userData.uid) {
      isBlockedBy(userData.uid, username.uid).then(setIsBlocked);
    }
  }, [username, userData.uid]);

  console.log("isBlocked", isBlocked);

  async function fetchCurrentUsersPostBlogThreadSettings() {
   const userData = await currentUsersPostBlogThreadSetting?.fetchUserData();
    if (userData) {
      setActiveTab(userData.defaultContentType || "posts");
    }
  }

  async function fetchTargetUsersPostBlogThreadSettings() {
    const userData = await targetUsersPostBlogThreadSetting?.fetchUserData();
    if (userData) {
      setActiveTab(userData.defaultContentType || "posts");
    }
  }
  React.useEffect(() => {
    if (isOwner && currentUsersPostBlogThreadSetting) {
      fetchCurrentUsersPostBlogThreadSettings();
    } else if (targetUsersPostBlogThreadSetting) {
      fetchTargetUsersPostBlogThreadSettings();
    }
  }, [username]);

  function handleTabChange(tab: "posts" | "blog" | "thread") {
    setActiveTab(tab);
  }

  const activeTabClass = "border-b-2 shadow-xl";
  const buttonClass = "px-2 transition-all duration-200 hover:border-b-2 hover:shadow-xl rounded cursor-pointer";

  if (isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2>you're blocked bitch</h2>
        <p>You cannot view their profile.</p>
      </div>
    );
  }


  return (
    <div>
      {
        !isOwner && (
          <BlockButton blockerUid={username.uid || ""} blockedUid={userData.uid || ""} />
        )
      }
      
      <Bio userData={userData} />

      <div>
        <div className="flex justify-center space-x-4 p-4">
          <button
            onClick={() => handleTabChange("posts")}
            className={`${buttonClass} ${
              activeTab === "posts" ? activeTabClass : ""
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => handleTabChange("blog")}
            className={`${buttonClass}
          ${activeTab === "blog" ? activeTabClass : ""}`}
          >
            Blogs
          </button>
          <button
            onClick={() => handleTabChange("thread")}
            className={`${buttonClass}
          ${activeTab === "thread" ? activeTabClass : ""}`}
          >
            Threads
          </button>
        </div>
        <div className="relative min-h-screen grid grid-cols-3">
          {isOwner && (
            <div>
              <FriendsList currentUserUid={username.uid} />
            </div>
          )}

          {activeTab === "posts" ? (
            <div className="border flex flex-col justify-center items-center">
              {isOwner && <CreatePost />}
              <UserPosts posts={posts} />
            </div>
          ) : activeTab === "blog" ? (
            <div className='col-span-2'>
            <div className="grid grid-cols-2">
              {isOwner && (
                <BlogForm
                  authorId={userData.uid || ""}
                  authorDisplayName={userData.displayName || ""}
                />
              )}
              <div className="">
                <UserBlogs
                  authorId={userData.uid || ""}
                  authorDisplayName={userData.displayName || ""}
                  profilePicture={userData.profilePicture || ""}
                  currentUser={username.uid}
                  currentUserDisplayName={username.displayName || ""}
                />
              </div>
            </div>
            </div>
          ) : activeTab === "thread" ? (
            <div>
              <h2>Threads will be implemented soon!</h2>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
