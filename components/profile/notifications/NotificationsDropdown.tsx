"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import getNotifications from "@/utilities/getNotifications";
import { db } from "../../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { AnswerFollowRequestButtons } from "./AnswerFollowRequest";
import FollowButton from "components/shared/FollowButton";
import { formatTimeAgo } from "@/utilities/formatTimeAgoHelper";
import Link from "next/link";
import { useUserDoc } from "@/utilities/userDocHelper";

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
  const [senderUserInfo, setSenderUserInfo] = useState<any[]>([]);

  const getSenderInfo = async (userId: string) => {
    if (!userId) return null;
    const userDoc = await useUserDoc(userId);
    if (!userDoc) return null;
    return await userDoc.fetchUserData();
  };

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = getNotifications(userId, async (notifications) => {
      setNotifications(notifications);

      const senderData = await Promise.all(
        notifications.map(async (notif) => {
          const info = await getSenderInfo(notif.fromUserId);
          return { uid: notif.fromUserId, ...info };
        })
      );
      setSenderUserInfo(senderData);
    });
    return unsubscribe;
  }, [userId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!isOpen) return;

      if (
        notificationsDivRef.current &&
        !notificationsDivRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        markAsRead(userId, notifications);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, notifications, userId]);

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

  const sharedClassNamesForNotification =
    "flex justify-between items-center py-2 border-b border-gray-200 sm:text-sm text-xs";

  const notificationDiv = (notification: notification, senderInfo: any) => (
    <div key={notification.id} className="">
      <li className="">
        <div className={sharedClassNamesForNotification}>
          <div className="text-sm flex items-center">
            <Link onClick={handleOnClick}
              className="mr-1 flex items-center"
              href={`/profile/${notification.fromUserId}`}
            >
              <img
                src={senderInfo.profilePicture}
                alt={senderInfo.displayName}
                className="w-6 h-6 rounded-full mr-1 border"
              />
              {senderInfo.displayName}
            </Link>
            <span> {notification.message}</span>

            <span className="text-xs text-gray-500 ml-1">
              {formatTimeAgo(notification.createdAt?.toDate?.())}
            </span>
          </div>

          {notification.type === "followRequest" && (
            <AnswerFollowRequestButtons
              targetUid={notification.fromUserId}
              currentUserUid={notification.toUserId}
            />
          )}
          {notification.type === "follow" && (
            <span className="text-xs text-gray-500">
              <FollowButton
                targetUid={notification.fromUserId}
                currentUserUid={notification.toUserId}
              />
            </span>
          )}
        </div>
      </li>
    </div>
  );

  return (
    <div ref={notificationsDivRef}>
      <div className="relative cursor-pointer" onClick={handleOnClick}>
        <IoMdNotificationsOutline size={20} />
        {unreadNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadNotifications.length}
          </span>
        )}
      </div>
      {isOpen && (
        <div className="fixed right-10 mt-2 w-[85vw] sm:w-1/2 h-84 overflow-scroll hide-scrollbar bg-white border-t-10 border-teal-700/60 rounded-lg shadow-lg p-4 z-50">
          <ul>
            {notifications.length === 0 ? (
              <li className="text-black">No notifications</li>
            ) : unreadNotifications.length > 0 ? (
              <>
                <div className="text-red-500">
                  <h1>New Notifications</h1>
                  {unreadNotifications.map((notification) => {
                    const senderInfo = senderUserInfo.find(
                      (user: any) => user.uid === notification.fromUserId
                    );
                    return notificationDiv(notification, senderInfo);
                  })}
                </div>
                <div className="text-black">
                  <h1>No New Notifications</h1>
                  {readNotifications.map((notification) => {
                    const senderInfo = senderUserInfo.find(
                      (user: any) => user.uid === notification.fromUserId
                    );
                    return notificationDiv(notification, senderInfo);
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="text-black">
                  <h1>No New Notifications</h1>
                  {readNotifications.map((notification) => {
                    const senderInfo = senderUserInfo.find(
                      (user: any) => user.uid === notification.fromUserId
                    );
                    return notificationDiv(notification, senderInfo);
                  })}
                </div>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default NotificationsDropdown;
