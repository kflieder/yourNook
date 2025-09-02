import React, { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { TbPhotoPlus } from "react-icons/tb";
import CreatePost from "components/profile/CreatePost";
import DMComponent from "components/profile/DMs/DMComponent";
import BlogForm from "components/blog/BlogForm";
import { HiOutlinePencilSquare } from "react-icons/hi2";

function BottomBar({ currentUser }: { currentUser: string }) {
  const [toggleCreateMobilePost, setToggleCreateMobilePost] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "messages" | "createPost" | "createBlog" | "createThread" | null
  >(null);

  function handleSetActiveTab(
    tab: "messages" | "createPost" | "createBlog" | "createThread" | null
  ) {
    setActiveTab((prev) => (prev === tab ? null : tab));
  }

  return (
    <div className="flex justify-around items-center w-full relative p-4 bg-blue-100">
      <TbPhotoPlus
        onClick={() => handleSetActiveTab("createPost")}
        size={22}
        className={`cursor-pointer ${
          toggleCreateMobilePost
            ? "shadow-lg w-8 h-8 rounded"
            : "bg-none shadow-none"
        }`}
      />
      <div className="flex items-center justify-center w-8 h-8 lg:hidden" onClick={() => setActiveTab("messages")}>
        <DMComponent currentUser={currentUser} targetUser={currentUser} forceOpen={activeTab === "messages"} />
      </div>
      <div className="cursor-pointer" onClick={() => handleSetActiveTab("createBlog")}>
        <HiOutlinePencilSquare size={28} />
      </div>
      {activeTab === "createPost" && (
        <div className={`absolute bottom-10 left-0 right-0 z-49 bg-white p-2`}>
          <div className="flex justify-between">
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
        <div className={`absolute bottom-10 left-0 right-0 z-49 bg-white p-2`}>
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
    </div>
  );
}

export default BottomBar;
