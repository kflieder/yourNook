"use client";
import React, { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

type ReportButtonProps = {
  postId: string;
};

function Report({ postId }: ReportButtonProps) {
  const { username: currentUser } = useAuth();
  const [reasons, setReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState("");
  const [isSubtmitted, setIsSubmitted] = useState(false);

  const reportOptions = [
    "Inappropriate content",
    "Spam or scam",
    "Harassment or bullying",
    "Hate speech",
    "Other",
  ];

  const handleCheckboxChange = (reason: string) => {
    setReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  async function handleSubmitReport(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser || reasons.length === 0) {
      return;
    }

    try {
      await addDoc(collection(db, "reports"), {
        postId,
        reportedBy: currentUser.uid,
        reasons,
        customReason: customReason.trim(),
        reportedAt: serverTimestamp(),
      });
      alert("Report submitted successfully");
      setReasons([]);
      setCustomReason("");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  }

  return (
    <>
      {!isSubtmitted ? (
        <form className='sm:w-96 w-74 border border-gray-300 px-4 py-1 flex flex-col justify-center items-center' onSubmit={handleSubmitReport}>
          <p>Why are you reporting this post?</p>
          <div className='flex flex-col justify-start'>
          {reportOptions.map((reason) => (
            <label key={reason} className="flex items-center mb-1 ml-2">
              <input
                type="checkbox"
                checked={reasons.includes(reason)}
                onChange={() => handleCheckboxChange(reason)}
                className="mr-2"
              />
              {reason}
            </label>
          ))}
          </div>
          <textarea
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Add a custom reason (optional)"
            className="w-full p-2 border rounded mb-2 resize-none"
          />
          <div className='w-full flex justify-end'>
          <button
            disabled={!currentUser || reasons.length === 0}
            type="submit"
            className="flex items-center bg-red-500 text-white px-2 text-sm rounded hover:bg-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Report
          </button>
          </div>
        </form>
      ) : (
        <p className="text-green-500">Thank you for your report!</p>
      )}
    </>
  );
}

export default Report;
