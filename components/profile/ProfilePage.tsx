"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import Bio from "./Bio";
import CreatePost from "./CreatePost";
import UserPosts from "../post/UserPosts";
import UserBlogs from "components/blog/UserBlogs";
import BlogForm from "components/blog/BlogForm";
import FriendsList from "./FriendsList";
import { getUserDocHelper } from "@/utilities/userDocHelper";
import BlockButton from "components/shared/BlockButton";
import { isBlockedBy } from "@/utilities/blockUserHelper";
import FollowButton from "components/shared/FollowButton";
import DMComponent from "./DMs/DMComponent";
import DiscussionThreadStyle from "components/discussionThreads/DiscussionThreadStyle";
import DiscussionThreadForm from "components/discussionThreads/DiscussionThreadForm";
import UserDiscussionThreads from "components/discussionThreads/UserDiscussionThreads";
import useIsMobile from "@/utilities/useIsMobile";
import BottomBar from "components/mobileComponents/BottomBar";
import { FaEllipsisVertical } from "react-icons/fa6";

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
    private?: boolean;
    autoApproveFollow?: boolean;
    isAdmin?: boolean;
  };
  posts: Array<{
    id: string;
    [key: string]: any;
  }>;
}

function ProfilePage({ userData, posts }: ProfilePageProps) {
  const { username } = useAuth();
  const [activeTab, setActiveTab] = useState<"posts" | "blog" | "thread">(
    "posts"
  );
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [isPrivate, setIsPrivate] = useState<boolean>(
    userData.private || false
  );
  const [currentUserIsFollowing, setCurrentUserIsFollowing] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isMobile = useIsMobile();
  const bioRef = useRef<HTMLDivElement>(null);
  const postsRef = useRef<HTMLDivElement>(null);
  const [enableScroll, setEnableScroll] = useState<boolean>(false);
  const [contentType, setContentType] = useState<string[]>([]);
  const [showBlockButton, setShowBlockButton] = useState(false);
  if (!username) {
    return null;
  }
  const currentUsersDoc = getUserDocHelper(username.uid);
  const targetUsersDoc = getUserDocHelper(userData.uid);
  const isOwner = username?.uid === userData.uid;

  const handleScroll = () => {
    if (isMobile) return;
    if (!bioRef.current || !postsRef.current) return;
    const rect = bioRef.current.getBoundingClientRect();
    const threshold = window.innerHeight * 0.1;
    const pastBio = rect.bottom < threshold;
    if (!pastBio) {
      postsRef.current.scrollTop = 0;
    }
    setEnableScroll(pastBio);
  };

  useEffect(() => {
    const onScroll = () => handleScroll();
    handleScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    async function checkAllTheThings() {
      try {
        if (!username || !userData.uid) return;
        const blocked = await isBlockedBy(userData.uid, username.uid);
        setIsBlocked(blocked);

        const targetUserData = await targetUsersDoc?.fetchUserData();
        const currentUserData = await currentUsersDoc?.fetchUserData();

        const settingUser = isOwner
          ? await currentUsersDoc?.fetchUserData()
          : targetUserData;
        if (settingUser) {
          setActiveTab(settingUser.defaultContentType || "posts");
        }
        if (settingUser?.contentType) {
          setContentType(settingUser.contentType);
        }

        if (targetUserData?.private) {
          setIsPrivate(targetUserData.private);
          if (currentUserData?.following) {
            setCurrentUserIsFollowing(
              currentUserData.following.includes(userData.uid)
            );
          }
        }
      } catch (error) {
        console.error("Error checking profile settings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    checkAllTheThings();
  }, [username, userData.uid]);

  function handleTabChange(tab: "posts" | "blog" | "thread") {
    setActiveTab(tab);
  }

  function Elipsis() {
    setShowBlockButton(!showBlockButton);
  }

  const activeTabClass = "shadow-xl h-8";
  const buttonClass =
    "w-1/3 cursor-pointer bg-blue-950/80 text-white hover:shadow-xl transition-all duration-200 h-6";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2>Loading...</h2>
      </div>
    );
  } else if (isPrivate && !currentUserIsFollowing && !isOwner) {
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <h2>This profile is private.</h2>
        <p>You must follow them to view their content.</p>
        <FollowButton
          currentUserUid={username.uid || ""}
          targetUid={userData.uid || ""}
        />
      </div>
    );
  } else if (isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <h2>you're blocked bitch</h2>
        <p>You cannot view their profile.</p>
      </div>
    );
  }

  return (
    <div className="sm:pt-15 pt-10 relative">
      {!isOwner && (
        <div className="absolute top-15 right-0 sm:right-10 flex flex-col">
          <FaEllipsisVertical className="cursor-pointer" onClick={Elipsis} />

          {showBlockButton && (
            <div className="absolute rounded right-0 top-5 bg-white border p-2">
              <BlockButton
                blockerUid={username.uid || ""}
                blockedUid={userData.uid || ""}
              />
            </div>
          )}
        </div>
      )}

      <div ref={bioRef} className="sm:mx-10 sm:pt-10 shadow-xl">
        <Bio userData={userData} />
      </div>
      <div
        className={`hide-scrollbar sm:pt-2 sm:pl-5 flex flex-col sm:grid sm:grid-cols-5 sm:h-[95vh]`}
      >
        <div
          ref={postsRef}
          className={`hide-scrollbar pb-5 sm:pb-20 ${
            isOwner ? "col-span-3" : "col-span-5"
          } 
          h-[75vh] sm:h-auto 
           ${
             isMobile
               ? "overflow-scroll touch-pan-y"
               : enableScroll
               ? "sm:overflow-scroll"
               : "sm:overflow-hidden"
           }`}
        >
          <div className="sticky top-0 sm:top-2.5 z-40 flex justify-center space-x-4 p-4 bg-white/70 backdrop-blur-sm rounded">
            {contentType.includes("posts") && (
              <button
                onClick={() => handleTabChange("posts")}
                className={`${buttonClass}
              ${activeTab === "posts" ? activeTabClass : ""}`}
              >
                Posts
              </button>
            )}
            {contentType.includes("blog") && (
              <button
                onClick={() => handleTabChange("blog")}
                className={`${buttonClass}
              ${activeTab === "blog" ? activeTabClass : ""}`}
              >
                Blogs
              </button>
            )}
            {contentType.includes("thread") && (
              <button
                onClick={() => handleTabChange("thread")}
                className={`${buttonClass}
              ${activeTab === "thread" ? activeTabClass : ""}`}
              >
                Threads
              </button>
            )}
          </div>
          {/* tabs div ^^ */}

          <div className="flex flex-col justify-center items-center pt-4 sm:pb-0">
            {activeTab === "posts" ? (
              <UserPosts posts={posts} />
            ) : activeTab === "blog" ? (
              <UserBlogs
                authorId={userData.uid || ""}
                authorDisplayName={userData.displayName || ""}
                profilePicture={userData.profilePicture || ""}
                currentUser={username.uid}
                currentUserDisplayName={username.displayName || ""}
              />
            ) : activeTab === "thread" ? (
              <UserDiscussionThreads
                currentUser={username}
                targetUser={userData.uid || ""}
              />
            ) : null}
          </div>
        </div>
        {/* content div ^^ */}
        {isOwner && (
          <div
            className={`col-span-2 sm:h-[95vh]  hide-scrollbar ${
              enableScroll ? "overflow-scroll" : "overflow-hidden"
            }`}
          >
            <div className="sm:block hidden p-5">
              <div>
                {activeTab === "posts" && <CreatePost />}
                {activeTab === "blog" && (
                  <BlogForm
                    authorId={username.uid || ""}
                    authorDisplayName={username.displayName || ""}
                  />
                )}
                {activeTab === "thread" && (
                  <DiscussionThreadForm
                    currentUserUid={username.uid || ""}
                    currentUserDisplayName={username.displayName || ""}
                  />
                )}
                <div className="sm:hidden lg:block mt-4">
                  <DMComponent
                    currentUser={username.uid}
                    targetUser={userData.uid || ""}
                  />
                </div>
                <FriendsList currentUserUid={username.uid} />
              </div>
            </div>
          </div>
        )}
        {/* bottom bar div ^^^ */}
        <div className="fixed bottom-0 left-0 right-0 flex z-50 bg-blue-100">
          <BottomBar currentUser={username.uid} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
