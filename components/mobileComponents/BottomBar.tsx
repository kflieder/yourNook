import React, { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { TbPhotoPlus } from "react-icons/tb";
import CreatePost from "components/profile/CreatePost";
import DMComponent from "components/profile/DMs/DMComponent";

function BottomBar({ currentUser }: { currentUser: string }) {
  const [toggleCreateMobilePost, setToggleCreateMobilePost] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "messages" | "createPost" | "creatBlog" | "createThread" | null
  >(null);

  function handleSetActiveTab(
    tab: "messages" | "createPost" | "creatBlog" | "createThread" | null
  ) {
    setActiveTab((prev) => (prev === tab ? null : tab));
  }

  return (
    <div className="flex justify-around w-full relative sm:hidden p-4">
      <TbPhotoPlus
        onClick={() => handleSetActiveTab("createPost")}
        size={22}
        className={`cursor-pointer mr-2 ${
          toggleCreateMobilePost
            ? "shadow-lg w-8 h-8 rounded"
            : "bg-none shadow-none"
        }`}
      />
      <div onClick={() => setActiveTab("messages")}>
        <DMComponent currentUser={currentUser} targetUser={currentUser} forceOpen={activeTab === "messages"} />
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
    </div>
  );
}

export default BottomBar;
