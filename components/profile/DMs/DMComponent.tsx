import React, { useEffect, useState, useRef, use } from "react";
import { useLiveUserData } from "@/utilities/useLiveUserData";
import { getOrCreateDmThread } from "@/utilities/dmThreadHelper";
import Messages from "./Messages";
import { BiMessageAltEdit } from "react-icons/bi";
import NewMessage from "./NewMessage";
import { IoIosCloseCircleOutline } from "react-icons/io";
import useIsMobile from "@/utilities/useIsMobile";
import { TiMessages } from "react-icons/ti";

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
  const isMobile = useIsMobile();

  if (isMobile) {
    console.log("User is on a mobile device");
  }

  useEffect(() => {
    if (dmThreadIdFromSendMessageForm) {
      setDmThreadId(dmThreadIdFromSendMessageForm);
      setDmThreadIdFromSendMessageForm(null);
    }
  }, [dmThreadIdFromSendMessageForm]);

  useEffect(() => {
    if (!toggleMessages) return;
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
  }, [
    currentUser,
    targetUser,
    liveCurrentUserData,
    liveTargetUserData,
    toggleMessages,
    dmThreadId,
  ]);

  function handleToggleNewMessage() {
    setToggleNewMessage((prev) => !prev);
    if (!toggleMessages) {
      setToggleMessages(true);
    }
  }
  function handleToggleMessages() {
    if (toggleMessages) {
      closeEverything();
    } else {
      setToggleMessages(true);
      setToggleNewMessage(false);
    }
  }

  function closeEverything() {
    setToggleMessages(false);
    setToggleNewMessage(false);
    setDmThreadId(null);
    setDmThreadIdFromSendMessageForm(null);
  }

  function handleMobileClose() {
    if (toggleNewMessage) {
      setToggleNewMessage(false);
    } else {
      closeEverything();
    }
  }

  useEffect(() => {
    console.log(
      "DM Thread ID from DMComponent:",
      dmThreadId,
      "fromSendMsg:",
      dmThreadIdFromSendMessageForm
    );
  }, [dmThreadId, dmThreadIdFromSendMessageForm]);

  return (
    <div>
      {isMobile ? (
        <div className="absolute">
          <div>
            <TiMessages className='cursor-pointer' onClick={handleToggleMessages} size={24} />
          </div>
          <div>
            {toggleMessages && (
              <div className="fixed z-40 bottom-8 right-16 w-3/4 bg-white px-4 py-2 rounded-lg shadow-2xl hide-scrollbar">
                <div className="flex justify-between items-center">
                  <h1>Messages</h1>
                  <div className='flex'>
                  <BiMessageAltEdit
                    onClick={handleToggleNewMessage}
                    size={24}
                    className="cursor-pointer"
                  />
                  <IoIosCloseCircleOutline
                    onClick={handleMobileClose}
                    size={24}
                    className="cursor-pointer"
                  />
                  </div>
                </div>
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
              toggleMessages && (
                <Messages
                  threadId={dmThreadId || ""}
                  currentUserUid={currentUser}
                  senderDisplayName={liveCurrentUserData?.displayName || ""}
                  senderProfilePicture={
                    liveCurrentUserData?.profilePicture || ""
                  }
                  setHasUnreadMessages={setHasUnreadMessages}
                  messagesOpen={toggleMessages}
                  setDmThreadFromSendMessageForm={
                    setDmThreadIdFromSendMessageForm
                  }
                />
              )
            )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="border border-gray-300 mt-5 p-2 rounded-lg shadow-lg bg-white">
          <div className="flex justify-between items-center p-1 px-2 bg-gray-100 cursor-pointer rounded">
            <div
              onClick={handleToggleMessages}
              className="sm:w-1/2 cursor-pointer"
            >
              {hasUnreadMessages ? (
                <span className="text-red-500 font-bold">Unread Messages</span>
              ) : (
                <h1 className="font-bold">Messages</h1>
              )}
            </div>

            <div className="flex flex-col items-end space-x-2 cursor-pointer">
              <div>
                {toggleMessages ? (
                  <div className="flex space-x-2">
                    <BiMessageAltEdit
                      onClick={handleToggleNewMessage}
                      size={24}
                    />
                    <IoIosCloseCircleOutline
                      onClick={closeEverything}
                      size={24}
                    />
                  </div>
                ) : (
                  <BiMessageAltEdit
                    onClick={handleToggleNewMessage}
                    size={24}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            className="overflow-scroll hide-scrollbar transition-max-height duration-500 ease-in-out"
            style={{ height: toggleMessages ? "30vh" : "0px" }}
          >
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
              toggleMessages && (
                <Messages
                  threadId={dmThreadId || ""}
                  currentUserUid={currentUser}
                  senderDisplayName={liveCurrentUserData?.displayName || ""}
                  senderProfilePicture={
                    liveCurrentUserData?.profilePicture || ""
                  }
                  setHasUnreadMessages={setHasUnreadMessages}
                  messagesOpen={toggleMessages}
                  setDmThreadFromSendMessageForm={
                    setDmThreadIdFromSendMessageForm
                  }
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DMComponent;
