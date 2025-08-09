import React, { useEffect, useState, useRef } from "react";
import { useLiveUserData } from "@/utilities/useLiveUserData";
import { getOrCreateDmThread } from "@/utilities/dmThreadHelper";
import Messages from "./Messages";
import { BiMessageAltEdit } from "react-icons/bi";
import NewMessage from "./NewMessage";
import { IoIosCloseCircleOutline } from "react-icons/io";

function DMComponent({
  currentUser,
  targetUser,
}: {
  currentUser: string;
  targetUser: string;
}) {
  const liveCurrentUserData = useLiveUserData(currentUser);
  const liveTargetUserData = useLiveUserData(targetUser);
  const [dmThreadId, setDmThreadId] = useState<string | null>(null);
  const [toggleNewMessage, setToggleNewMessage] = useState(false);
  const [dmThreadIdFromSendMessageForm, setDmThreadIdFromSendMessageForm] =
    useState<string | null>(null);
  const [toggleMessages, setToggleMessages] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  

  useEffect(() => {
    if (dmThreadIdFromSendMessageForm) {
      setDmThreadId(dmThreadIdFromSendMessageForm);
      setDmThreadIdFromSendMessageForm(null);
    }
  }, [dmThreadIdFromSendMessageForm]);

  useEffect(() => {
    if (!liveCurrentUserData || !liveTargetUserData) return;
    if (dmThreadId) return;
    const fetchDmThread = async () => {
      try {
        const threadId = await getOrCreateDmThread(
          currentUser,
          targetUser,
          liveTargetUserData?.displayName,
          liveTargetUserData?.profilePicture,
          liveCurrentUserData?.displayName,
          liveCurrentUserData?.profilePicture
        );
        setDmThreadId(threadId || null);
      } catch (error) {
        console.error("Error fetching or creating DM thread:", error);
      }
    };
    fetchDmThread();
    
  }, [currentUser, targetUser, liveCurrentUserData, liveTargetUserData]);

  function handleToggleNewMessage() {
    setToggleNewMessage(!toggleNewMessage);
    if (!toggleMessages) {
      setToggleMessages(true);
    }
  }
  function handleToggleMessages() {
    if (toggleNewMessage) {
      setToggleNewMessage(false);
    }
    if (!toggleNewMessage) {
      setToggleMessages(!toggleMessages);
    }
    setDmThreadId(null);
    setDmThreadIdFromSendMessageForm(null);
  }
  
  return (
    <div className="border-2 mt-5 p-5 rounded-lg shadow-lg bg-white">
      <div className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer rounded">
        <div onClick={handleToggleMessages} 
        className="border w-1/2 cursor-pointer">
        <h1 className="font-bold">
          Messages
        </h1>
        </div>
        {
          hasUnreadMessages && (
            <span className="text-red-500 font-bold">Unread Messages</span>
          )
        }
        <div className="flex flex-col items-end space-x-2 cursor-pointer">
          <div>
            {toggleMessages ? (
              <div className="flex space-x-2">
                <BiMessageAltEdit onClick={handleToggleNewMessage} size={24} />
                <IoIosCloseCircleOutline
                  onClick={handleToggleMessages}
                  size={24}
                />
              </div>
            ) : (
              <BiMessageAltEdit onClick={handleToggleNewMessage} size={24} />
            )}
          </div>
        </div>
      </div>
<div className="overflow-y-auto transition-max-height duration-500 ease-in-out" style={{height: toggleMessages ? "300px" : "0px"}} >
      <div>
        <div>
            {toggleNewMessage ? (
              <NewMessage
                currentUserUid={currentUser}
                senderDisplayName={liveCurrentUserData?.displayName || ""}
                senderProfilePicture={liveCurrentUserData?.profilePicture || ""}
                toggleNewMessageStateFromSendMessageForm={setToggleNewMessage}
                setDmThreadFromSendMessageForm={
                  setDmThreadIdFromSendMessageForm
                }
                
              />
            ) : (
              <Messages
                threadId={dmThreadId || ""}
                currentUserUid={currentUser}
                senderDisplayName={liveCurrentUserData?.displayName || ""}
                senderProfilePicture={liveCurrentUserData?.profilePicture || ""}
                setHasUnreadMessages={setHasUnreadMessages}
                messagesOpen={toggleMessages}
              />
            )}
          </div>
      </div>
    </div>
    </div>
  );
}

export default DMComponent;
