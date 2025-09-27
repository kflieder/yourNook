import React, { useState, useEffect, useRef } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { TbPhotoPlus } from "react-icons/tb";
import CreatePost from "components/profile/CreatePost";
import DMComponent from "components/profile/DMs/DMComponent";
import BlogForm from "components/blog/BlogForm";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaThreads } from "react-icons/fa6";
import DiscussionThreadForm from "components/discussionThreads/DiscussionThreadForm";

function BottomBar({ currentUser }: { currentUser: string }) {
  const [toggleCreateMobilePost, setToggleCreateMobilePost] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "messages" | "createPost" | "createBlog" | "createThread" | null
  >(null);
  const bottomBarRef = useRef<HTMLDivElement | null>(null);

  function handleSetActiveTab(
    tab: "messages" | "createPost" | "createBlog" | "createThread" | null
  ) {
    setActiveTab((prev) => (prev === tab ? null : tab));
  }

  useEffect(() => {
    if (!activeTab) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        bottomBarRef.current &&
        !bottomBarRef.current.contains(event.target as Node)
      ) {
        setActiveTab(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeTab]);

  return (
    <div className="flex relative justify-end w-full bg-blue-100 border-gray-300 shadow-lg">
      <div
        ref={bottomBarRef}
        className="flex justify-around items-center p-1 sm:p-2 w-1/2 sm:w-1/4"
      >
        <div
          className="flex items-center justify-center w-8 h-8 lg:hidden"
          onClick={() => setActiveTab("messages")}
        >
          <DMComponent
            currentUser={currentUser}
            targetUser={currentUser}
            forceOpen={activeTab === "messages"}
          />
        </div>
        <TbPhotoPlus
          onClick={() => handleSetActiveTab("createPost")}
          size={22}
          className={`cursor-pointer ${
            toggleCreateMobilePost
              ? "shadow-lg w-8 h-8 rounded"
              : "bg-none shadow-none"
          }`}
        />

        <div
          className="cursor-pointer"
          onClick={() => handleSetActiveTab("createBlog")}
        >
          <HiOutlinePencilSquare size={25} />
        </div>
        <div
          className="cursor-pointer"
          onClick={() => handleSetActiveTab("createThread")}
        >
          <FaThreads size={22} />
        </div>
        {activeTab === "createPost" && (
          <div className={`sm:w-1/2 w-4/5
           absolute bottom-16 right-0 z-49 bg-white p-2`}>
            <div className="flex justify-between shadow-lg">
              <h1>Create Post</h1>
              <IoIosCloseCircleOutline
                className="cursor-pointer"
                size={22}
                onClick={() => handleSetActiveTab(null)}
              />
            </div>
            <CreatePost />
          </div>
        )}
        {activeTab === "createBlog" && (
          <div
            className={`absolute w-4/5 sm:w-1/2 bottom-16 right-0 z-49 bg-white p-2 shadow-lg`}
          >
            <div className="flex justify-between">
              <h1>Create Blog</h1>
              <IoIosCloseCircleOutline
                className="cursor-pointer"
                size={22}
                onClick={() => handleSetActiveTab(null)}
              />
            </div>
            <BlogForm authorId={currentUser} />
          </div>
        )}
        {activeTab === "createThread" && (
          <div
            className={`absolute w-3/4 sm:w-1/2 bottom-16 right-0 z-49 bg-white p-2 shadow-lg`}
          >
            <div className="flex justify-between">
              <h1>Create Thread</h1>
              <IoIosCloseCircleOutline
                className="cursor-pointer"
                size={22}
                onClick={() => handleSetActiveTab(null)}
              />
            </div>
            <DiscussionThreadForm currentUserUid={currentUser} />
          </div>
        )}
      </div>
    </div>
  );
}

export default BottomBar;
