"use client";
import React, { useState, useEffect } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import getNotifications from "@/utilities/getNotifications";
import { db } from "../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { read } from "fs";

type notificationDropDownProps = {
  userId: string;
};

type notification = {
  id: string;
  message: string;
  createdAt: any;
  isRead: boolean;
};

function NotificationsDropdown({ userId }: notificationDropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<notification[]>([]);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = getNotifications(userId, (notifications) => {
      setNotifications(notifications);
    });
    return () => unsubscribe();
  }, [userId]);

  const unreadNotifications = notifications.filter((n) => n.isRead === false);
  const readNotifications = notifications.filter((n) => n.isRead === true);

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

  console.log("Notifications:", userId, notifications);
  return (
    <div>
      <div className="relative cursor-pointer" onClick={handleOnClick}>
        <IoMdNotificationsOutline />
        {unreadNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadNotifications.length}
          </span>
        )}
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-3/4 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <ul>
            {notifications.length === 0 ? (
              <li className="text-black">No notifications</li>
            ) : unreadNotifications.length > 0 ? (
              <>
                <div className="text-red-500">
                  <h1>New Notifications</h1>
                  {unreadNotifications.map((notification) => (
                    <li key={notification.id} className="p-2">
                      <div className="flex justify-end items-center gap-2 border">
                        <span className="text-sm">{notification.message}</span>
                        <span className="text-xs text-gray-500">
                          {notification.createdAt?.toDate?.().toLocaleString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </div>
                <h1 className="text-black">No new notifications</h1>
                {readNotifications.map((notification) => (
                  <>
                    <div className="text-gray-500">
                      <li key={notification.id} className="p-2">
                        <div className="flex justify-end items-center gap-2 border">
                          <span className="text-black text-sm">
                            {notification.message}
                          </span>
                          <span className="text-xs text-gray-500">
                            {notification.createdAt
                              ?.toDate?.()
                              .toLocaleString()}
                          </span>
                        </div>
                      </li>
                    </div>
                  </>
                ))}
              </>
            ) : (
              <>
              <h1 className="text-black">No New Notifications</h1>
                {readNotifications.map((notification) => (
                  <div>
                    <div className="text-gray-500">
                      <li key={notification.id} className="p-2">
                        <div className="flex justify-end items-center gap-2 border">
                          <span className="text-black text-sm">
                            {notification.message}
                          </span>
                          <span className="text-xs text-gray-500">
                            {notification.createdAt
                              ?.toDate?.()
                              .toLocaleString()}
                          </span>
                        </div>
                      </li>
                    </div>
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
