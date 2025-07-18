"use client";
import React, { useState, useEffect } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import getNotifications from "@/utilities/getNotifications";

type notificationDropDownProps = 
{
  userId: string;
};


function NotificationsDropdown({ userId }: notificationDropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any>([]);

    
  useEffect(() =>{
    if (!userId) return;
    const unsubscribe = getNotifications(userId, (notifications) => {
        setNotifications(notifications);
    })
    return () => unsubscribe();
  }, [userId]);

  console.log("Notifications:", userId, notifications);
  return (
    <div>
      <div className="relative" onClick={() => setIsOpen(!isOpen)}>
        <IoMdNotificationsOutline />
      </div>
      <div>
        {isOpen && (
            <div>
                <ul>
                    {notifications.lenghth === 0 ? (
                        <li className="text-gray-500">No notifications</li> ) : (
                            notifications.map ((notification: any) => (
                                <li key={notification.id} className="p-2 hover:bg-gray-100">
                                    <div className="flex items-center gap-2">
                                        <span>{notification.message}</span>
                                        <span className="text-xs text-gray-500">{notification.createdAt?.toDate?.().toLocaleString()}</span>
                                    </div>
                                </li>
                            ))
                        )}
                </ul>
            </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsDropdown;
