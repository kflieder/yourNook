"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import Bio from "./Bio";
import CreatePost from "./CreatePost";
import UserPosts from "../post/UserPosts";
import UserBlogs from "components/blog/UserBlogs";

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

  const buttonClass = "p-2 hover:bg-blue-500 hover:text-white rounded cursor-pointer";
  return (
    <div>
      <Bio userData={userData} />

      <div>
        <div  className="border flex justify-center space-x-4 p-4">
        <button
          onClick={() => handleTabChange("posts")}
          className={`${buttonClass} ${
            activeTab === "posts" ? "bg-blue-500 text-white" : ""
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => handleTabChange("blogs")}
          className={`${buttonClass}
          ${activeTab === "blogs" ? "bg-blue-500 text-white" : ""}`}
        >
          Blogs
        </button>
        <button
          onClick={() => handleTabChange("threads")}
          className={`${buttonClass}
          ${activeTab === "threads" ? "bg-blue-500 text-white" : ""}`}
        >
          Threads
        </button>
        </div>
        <div className="border relative min-h-screen">
          {activeTab === "posts" ? (
            <div>
              {isOwner && <CreatePost />}
              <UserPosts posts={posts} />
            </div>
          ) : activeTab === "blogs" ? (
            <div>
              <UserBlogs
                authorId={userData.uid || ""}
                authorDisplayName={userData.displayName || ""}
              />
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
