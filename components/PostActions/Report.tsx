"use client";
import React, { useState, useRef } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "components/customAlertModal/AlertProvider";

type ReportButtonProps = {
  postId: string;
};

function Report({ postId }: ReportButtonProps) {
  const { username: currentUser } = useAuth();
  const [reasons, setReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState("");
  const [isSubtmitted, setIsSubmitted] = useState(false);
  const { show } = useAlert();
  const alertRef = useRef<HTMLButtonElement | null>(null);

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
    if (!currentUser ) {
      show("Please log in to report a post.", { bottom: 30, left: 0 }, alertRef);
      return;
    }
      if (reasons.length === 0) {
        show("Please select at least one reason for reporting.", { bottom: 30, left: 0 }, alertRef);
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
      show("Report submitted successfully", { bottom: 80, right: 10 }, alertRef);
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
            ref={alertRef}
            disabled={!currentUser || reasons.length === 0}
            type="submit"
            className="flex items-center bg-red-500 text-white px-2 text-sm rounded hover:bg-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Report
          </button>
          </div>
        </form>
      ) : (
        <p className="text-green-500 p-2">Thank you for your report!</p>
      )}
    </>
  );
}

export default Report;
