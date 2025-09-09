import Delete from "components/PostActions/Delete";
import React, { useState, useRef, useEffect } from "react";
import { MdReportGmailerrorred } from "react-icons/md";
import Report from "components/PostActions/Report";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { HiOutlineEllipsisHorizontal } from "react-icons/hi2";

function Elipsis({
  currentUser,
  targetUid,
  docId,
}: {
  currentUser: string | null;
  targetUid: string;
  docId: string;
}) {
  const [showReportForm, setShowReportForm] = useState(false);
  const closeEllipsisRef = useRef<HTMLDivElement | null>(null);
  const [showEllipsis, setShowEllipsis] = useState(false);

  const handleShowReportForm = () => {
    setShowReportForm((prev) => !prev);
  };
  const handleShowEllipsis = () => {
    setShowEllipsis((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (closeEllipsisRef.current && !closeEllipsisRef.current.contains(event.target as Node)) {
        setShowEllipsis(false);
        setShowReportForm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={closeEllipsisRef}>
      <div >
        <HiOutlineEllipsisHorizontal
          size={34}
          className="cursor-pointer"
          onClick={handleShowEllipsis}
        />
      </div>

      {showEllipsis && (
        <div className="absolute right-0 top-8 p-1 bg-white border rounded shadow-lg z-10 text-black">
          <ul
            className={`${
              showReportForm ? "max-h-0 overflow-hidden" : "max-h-96"
            }`}
          >
            {currentUser && targetUid === currentUser && (
              <li className="flex border border-gray-300 rounded hover:bg-gray-200 cursor-pointer justify-start items-start space-x-0.5 w-36 text-sm">
                <Delete postId={docId} />
              </li>
            )}
            <li
              onClick={handleShowReportForm}
              className="flex border border-gray-300 rounded hover:bg-gray-200 cursor-pointer justify-start items-start space-x-0.5 w-36 text-sm"
            >
              <MdReportGmailerrorred size={18} />
              <p>Report post</p>
            </li>
          </ul>
          {showReportForm && (
            <div className="relative">
              <IoIosCloseCircleOutline
                className="absolute top-0 right-0 cursor-pointer"
                size={20}
                onClick={handleShowReportForm}
              />
              <Report postId={docId} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Elipsis;
