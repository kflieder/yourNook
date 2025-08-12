"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../lib/firebase";
import { TbPhotoPlus } from "react-icons/tb";
import { GoDeviceCameraVideo } from "react-icons/go";

function CreatePost() {
  const { username } = useAuth();
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  async function handleCreatePost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let mediaUrl = "";

    if (mediaFile) {
      const fileRef = ref(storage, `posts/${Date.now()}_${mediaFile.name}`);
      const snapShot = await uploadBytes(fileRef, mediaFile);
      mediaUrl = await getDownloadURL(snapShot.ref);
    }

    if (!username) {
      alert("You must be logged in to create a post.");
      return;
    }

    try {
      console.log("Attempting to create post with data:", {
        uid: username.uid,
        displayName: username.displayName,
        content,
        mediaUrl,
      });
      await addDoc(collection(db, "posts"), {
        uid: username.uid,
        displayName: username.displayName,
        content: content,
        createdAt: Timestamp.fromDate(new Date()),
        uniqueUrl: username?.uniqueUrl || "",
        profilePicture: username.profilePicture || "",
        likes: [],
        comments: [],
        shares: 0,
        isEdited: false,
        isDeleted: false,
        isReported: false,
        reportCount: 0,
        mediaUrl,
      });
      setContent("");
      setMediaFile(null);
      console.log("Post was added to Firestore!");
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again later.");
    }
  }

  return (
    <div>
      <form
        onSubmit={handleCreatePost}
        className="flex flex-col p-4 border border-gray-300 rounded-lg shadow-lg"
      >
        <div className="flex items-center mb-2">
          <div className="w-12 h-12 overflow-hidden rounded-full border">
            <img
              src={username?.profilePicture || ""}
              alt={username?.displayName || ""}
              className="w-12 h-12 rounded-full"
            />
          </div>
          <h1 className="capitalize ml-2">{username?.displayName}</h1>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="p-4 rounded-lg mb-4 resize-none bg-gray-200"
          rows={2}
          maxLength={500}
        />
        <input
        id="file-upload"
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setMediaFile(e.target.files?.[0] || null); // Use the first file if multiple files are selected
            }
          }}
          className="hidden"
        />
        <div className="flex justify-between items-center">
        <label htmlFor="file-upload" className="cursor-pointer flex items-center">
          <TbPhotoPlus size={22} className="mr-2" />
          <GoDeviceCameraVideo size={25} className="mr-2" />
        </label>

        <button
          type="submit"
          className="bg-blue-950 text-white px-2 py-1 text-sm rounded-lg hover:bg-blue-600 transition-colors"
        >
          Post
        </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
