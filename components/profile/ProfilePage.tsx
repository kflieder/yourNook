"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import Bio from "./Bio";
import CreatePost from "./CreatePost";
import UserPosts from "../post/UserPosts";
import UserBlogs from "components/blog/UserBlogs";
import BlogForm from "components/blog/BlogForm";

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

  const [activeTab, setActiveTab] = React.useState<
    "posts" | "blogs" | "threads"
  >("posts");

  function handleTabChange(tab: "posts" | "blogs" | "threads") {
    
    setActiveTab(tab);
  }

  const activeTabClass = "border-b-2 shadow-xl";

  const buttonClass = "px-2 transition-all duration-200 hover:border-b-2 hover:shadow-xl rounded cursor-pointer";
  return (
    <div>
      <Bio userData={userData} />

      <div>
        <div  className="flex justify-center space-x-4 p-4">
        <button
          onClick={() => handleTabChange("posts")}
          className={`${buttonClass} ${
            activeTab === "posts" ? activeTabClass : ""
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => handleTabChange("blogs")}
          className={`${buttonClass}
          ${activeTab === "blogs" ? activeTabClass : ""}`}
        >
          Blogs
        </button>
        <button
          onClick={() => handleTabChange("threads")}
          className={`${buttonClass}
          ${activeTab === "threads" ? activeTabClass : ""}`}
        >
          Threads
        </button>
        </div>
        <div className="relative min-h-screen">
          {activeTab === "posts" ? (
            <div className="border flex flex-col justify-center items-center">
              {isOwner && <CreatePost />}
              <UserPosts posts={posts} />
            </div>
          ) : activeTab === "blogs" ? (
            <div className="grid grid-cols-2">
              {isOwner && <BlogForm
                authorId={userData.uid || ""}
                authorDisplayName={userData.displayName || ""}
              />}
              <div>
              <UserBlogs
                authorId={userData.uid || ""}
                authorDisplayName={userData.displayName || ""}
                profilePicture={userData.profilePicture || ""}
                currentUser={username.uid}
                currentUserDisplayName={username.displayName || ""}
              />
                </div>
            </div>
          ) : activeTab === "threads" ? (
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
