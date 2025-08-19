"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import getNotifications from "@/utilities/getNotifications";
import { db } from "../../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { AnswerFollowRequestButtons } from "./AnswerFollowRequest";
import FollowButton from "components/shared/FollowButton";

type notificationDropDownProps = {
  userId: string;
};

type notification = {
  id: string;
  message: string;
  createdAt: any;
  isRead: boolean;
  type: string;
  fromUserId: string;
  toUserId: string;
};

function NotificationsDropdown({ userId }: notificationDropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<notification[]>([]);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = getNotifications(userId, (notifications) => {
      setNotifications(notifications);
    });

    function handleClickOutside(event: MouseEvent) {
      if (notificationsDivRef.current && !notificationsDivRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      unsubscribe();
    };
  }, [userId]);

  const unreadNotifications = notifications.filter((n) => n.isRead === false);
  const readNotifications = notifications.filter((n) => n.isRead === true);
  const notificationsDivRef = useRef<HTMLDivElement | null>(null);

  async function markAsRead(userId: string, notifications: notification[]) {
    const updatePromises = notifications.filter((n) => {
      const notifRef = doc(db, "users", userId, "notifications", n.id);
      return updateDoc(notifRef, { isRead: true });
    });
    await Promise.all(updatePromises);
  }

  function handleOnClick() {
    const wasOpen = isOpen;
    setIsOpen(!wasOpen);
    if (wasOpen) {
      markAsRead(userId, notifications);
    }
  }

  const sharedClassNamesForNotification = "flex justify-between items-center gap-2 border-b border-gray-200 sm:text-sm text-xs";

  return (
    <div>
      <div className="relative cursor-pointer" onClick={handleOnClick}>
        <IoMdNotificationsOutline size={20} />
        {unreadNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadNotifications.length}
          </span>
        )} 
      </div>
      {isOpen && (
        <div ref={notificationsDivRef} className="fixed right-10 mt-2 w-[85vw] sm:w-1/2 h-84 overflow-scroll hide-scrollbar bg-white border-t-10 border-teal-700/60 rounded-lg shadow-lg p-4 z-50">
          <ul>
            {notifications.length === 0 ? (
              <li className="text-black">No notifications</li>
            ) : unreadNotifications.length > 0 ? (
              <>
                <div className="text-red-500">
                  <h1>New Notifications</h1>
                  {unreadNotifications.map((notification) => (
                    <li key={notification.id} className="p-2">
                      <div className={sharedClassNamesForNotification}>
                        <span className="text-sm">{notification.message}</span>
                        <span className="text-xs text-gray-500">
                          {notification.createdAt?.toDate?.().toLocaleString()}
                        </span>
                        {notification.type === "followRequest" && (
                        <AnswerFollowRequestButtons
                          targetUid={notification.fromUserId}
                          currentUserUid={notification.toUserId}
                        />
                      )}
                      </div>
                      
                    </li>
                  ))}
                </div>
                <h1 className="text-black">No new notifications</h1>
                {readNotifications.map((notification) => (
                  <div key={notification.id} className="text-gray-500">
                    <li className="p-2">
                      <div className={sharedClassNamesForNotification}>
                        <span className="text-black text-sm">
                          {notification.message}
                        </span>
                        <span className="text-xs text-gray-500">
                          {notification.createdAt?.toDate?.().toLocaleString()}
                        </span>
                        {notification.type === "followRequest" && (
                        <AnswerFollowRequestButtons
                          targetUid={notification.fromUserId}
                          currentUserUid={notification.toUserId}
                        />
                      )}
                      </div>
                      
                    </li>
                  </div>
                ))}
              </>
            ) : (
              <>
                <h1 className="text-black">No New Notifications</h1>
                {readNotifications.map((notification) => (
                   <div key={notification.id} className="text-gray-500">
                      <li className="p-2">
                        <div className={sharedClassNamesForNotification}>
                          <span className="text-black text-sm">
                            {notification.message}
                          </span>
                          <span className="text-xs text-gray-500">
                            {notification.createdAt
                              ?.toDate?.()
                              .toLocaleString()}
                          </span>
                          {notification.type === "followRequest" && (
                        <AnswerFollowRequestButtons
                          targetUid={notification.fromUserId}
                          currentUserUid={notification.toUserId}
                        />
                      )}
                      {
                        notification.type === "follow" && (
                          <span className="text-xs text-gray-500">
                            <FollowButton targetUid={notification.fromUserId} currentUserUid={notification.toUserId} />
                          </span>
                        )}
                      </div>
                    </li>
                  </div>
                ))}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default NotificationsDropdown;
