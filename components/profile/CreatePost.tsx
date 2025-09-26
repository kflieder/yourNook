"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useRef, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../lib/firebase";
import { TbPhotoPlus } from "react-icons/tb";
import { GoDeviceCameraVideo } from "react-icons/go";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useAlert } from "../customAlertModal/AlertProvider";

function CreatePost() {
  const { username } = useAuth();
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [picPreview, setPicPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [inputKey, setInputKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { show } = useAlert();
  const alertRef = useRef<HTMLButtonElement | null>(null);

  async function handleCreatePost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    let mediaUrl = "";

    let fileToUpload = mediaFile;

    if (!fileToUpload && fileInputRef.current?.files?.[0]) {
      fileToUpload = fileInputRef.current.files[0];
    }

    if (
      !fileToUpload &&
      fileInputRef.current?.files?.length === 0 &&
      mediaFile === null
    ) {
      show("Please select a photo :)", { bottom: 30, right: 0 }, alertRef);
      setIsLoading(false);
      return;
    }

    if (fileToUpload) {
      const fileRef = ref(storage, `posts/${Date.now()}_${fileToUpload.name}`);
      const snapShot = await uploadBytes(fileRef, fileToUpload);
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
      setPicPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setInputKey((prev) => prev + 1);
      console.log("Post was added to Firestore!");
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      alert("File Selection Failed. Please select a media file.");
      return;
    }
    setMediaFile(file);
    setPicPreview(URL.createObjectURL(file));
  }

  return (
    <div>
      <form
        onSubmit={handleCreatePost}
        className="flex flex-col p-4 bg-white border border-gray-300 rounded-lg shadow-lg"
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
          rows={4}
          maxLength={300}
        />
        <small
          className={`${
            content.length === 300 ? "text-red-500" : "text-gray-500"
          }`}
        >
          {content.length}/300
          {content.length === 300 && (
            <span className="ml-2">Betch go write a blog :D</span>
          )}
        </small>
        <div className="flex justify-between">
          <div className="w-22 rounded-lg overflow-hidden">
            <input
              key={inputKey}
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept="image/jpeg,image/png,image/heic,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div 
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
            className="flex cursor-pointer">
              <TbPhotoPlus size={22} className="mr-2" />
              <GoDeviceCameraVideo size={25} className="mr-2" />
            </div>
          </div>
          <button
            ref={alertRef}
            disabled={!content && !mediaFile}
            type="submit"
            className="flex bg-blue-950 text-white px-2 py-1 text-sm rounded-lg hover:bg-gray-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Post..." : "Post"}
          </button>
        </div>
        <div className="flex justify-between items-center">
          {picPreview && (
            <div className="relative">
              <div
                className="absolute top-[-6] right-[-6] cursor-pointer bg-gray-200 rounded-full"
                onClick={() => {
                  setMediaFile(null);
                  setPicPreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                  setInputKey((prev) => prev + 1);
                }}
              >
                <IoIosCloseCircleOutline size={18} />
              </div>
              {mediaFile?.type.startsWith("video") ? (
                <video
                  src={picPreview}
                  className="w-24 h-24 object-cover rounded"
                  controls
                />
              ) : (
                <img
                  key={mediaFile?.name || picPreview}
                  src={picPreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded"
                />
              )}
            </div>
          )}   
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
