"use client";
import React, { useState, useRef } from "react";
import GlobalPostFeed from "./GlobalPostFeed";
import { useAuth } from "@/context/AuthContext";
import GlobalBlogFeed from "./GlobalBlogFeed";
import GlobalDiscussionThreadFeed from "./GlobalDiscussionThreadFeed";
import BottomBar from "components/mobileComponents/BottomBar";
import DMComponent from "components/profile/DMs/DMComponent";
import CreatePost from "components/profile/CreatePost";
import BlogForm from "components/blog/BlogForm";
import DiscussionThreadForm from "components/discussionThreads/DiscussionThreadForm";

function FeedPage() {
  const { username: currentUser } = useAuth();
  const [activeTab, setActiveTab] = React.useState<
    "posts" | "blogs" | "threads"
  >("posts");
  const [expandedBlog, setExpandedBlog] = useState(false);
  const [showTabs, setShowTabs] = useState(true);
  const lastScrollY = useRef(0);
  const feedRef = useRef<HTMLDivElement>(null);

 React.useEffect(() => {
  const scrollEl = feedRef.current;
  if (!scrollEl) return;

  let lastScrollTop = 0;

  function handleDivScroll() {
    const currentScrollTop = scrollEl.scrollTop;

    if (currentScrollTop > lastScrollTop + 10) {
      // Scrolling down
      setShowTabs(false);
    } else if (currentScrollTop < lastScrollTop - 10) {
      // Scrolling up
      setShowTabs(true);
    }

    lastScrollTop = currentScrollTop;
  }

  scrollEl.addEventListener("scroll", handleDivScroll);

  return () => scrollEl.removeEventListener("scroll", handleDivScroll);
}, []);


  if (!currentUser) {
    return <div>Loading...</div>;
  }

  function handleTabChange(tab: "posts" | "blogs" | "threads") {
    setActiveTab(tab);
  }
  console.log(expandedBlog);

  const buttonStyle = "px-4 py-2 rounded-3xl focus:outline-none cursor-pointer";
  const activeButtonStyle = `${buttonStyle} bg-blue-950 text-white`;

  return (
    <div className="flex flex-col items-center justify-center h-full ">
      <div className={`fixed top-15 z-49 shadow-lg grid grid-cols-3 justify-around bg-gray-300 sm:w-3/4 w-full rounded-3xl sm:text-base text-xs transition-transform duration-300 ${showTabs ? "translate-y-0" : "-translate-y-20"}`}>
        <button
          onClick={() => handleTabChange("posts")}
          className={activeTab === "posts" ? activeButtonStyle : buttonStyle}
        >
          Posts
        </button>
        <button
          onClick={() => handleTabChange("blogs")}
          className={activeTab === "blogs" ? activeButtonStyle : buttonStyle}
        >
          Blogs
        </button>
        <button
          onClick={() => handleTabChange("threads")}
          className={activeTab === "threads" ? activeButtonStyle : buttonStyle}
        >
          Threads
        </button>
      </div>

      <div className={`w-full grid grid-cols-1 lg:grid-cols-2 lg:pl-10 justify-between h-screen transition-all duration-300 ${showTabs ? "pt-30" : ""} pb-20`}>
        <div ref={feedRef} className={`flex flex-col gap-y-4 overflow-x-hidden hide-scrollbar ${expandedBlog ? "overflow-hidden" : "overflow-scroll"}`}>
        {activeTab === "posts" && (
          <GlobalPostFeed
            currentUser={{
              ...currentUser,
              displayName: currentUser.displayName ?? "",
            }}
          />
        )}
        {activeTab === "blogs" && (
          <GlobalBlogFeed
            currentUser={currentUser.uid}
            currentUserDisplayName={currentUser.displayName ?? ""}
            onExpandChange={(expanded) => {
              setExpandedBlog(expanded);
            }}
          />
        )}

        {activeTab === "threads" && (
          <GlobalDiscussionThreadFeed currentUser={currentUser.uid} />
        )}
        </div>
        <div className="hidden lg:flex justify-center items-center">
          <div className="w-116 h-full flex flex-col justify-center gap-y-8">
            <DMComponent
              currentUser={currentUser.uid}
              targetUser={currentUser.uid}
            />
            {activeTab === "posts" && <CreatePost />}
            {activeTab === "blogs" && <BlogForm authorId={currentUser.uid} />}
            {activeTab === "threads" && <DiscussionThreadForm currentUserUid={currentUser.uid} />}
          </div>
        </div>
      </div>

      <div className="fixed z-10 bottom-0 left-0 right-0 bg-white flex justify-around">
        <BottomBar currentUser={currentUser.uid} />
      </div>
    </div>
  );
}

export default FeedPage;
