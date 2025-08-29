import React, { useEffect, useState, useRef, use } from "react";
import { useLiveUserData } from "@/utilities/useLiveUserData";
import { getOrCreateDmThread } from "@/utilities/dmThreadHelper";
import Messages from "./Messages";
import { BiMessageAltEdit } from "react-icons/bi";
import NewMessage from "./NewMessage";
import { IoIosCloseCircleOutline } from "react-icons/io";
import useIsMobile from "@/utilities/useIsMobile";
import { TiMessages } from "react-icons/ti";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

function DMComponent({
  currentUser,
  targetUser,
  forceOpen,
}: {
  currentUser: string;
  targetUser: string;
  forceOpen?: boolean;
}) {
  const liveCurrentUserData = useLiveUserData(currentUser);
  const [dmThreadId, setDmThreadId] = useState<string | null>(null);
  const [toggleNewMessage, setToggleNewMessage] = useState(false);
  const [dmThreadIdFromSendMessageForm, setDmThreadIdFromSendMessageForm] =
    useState<string | null>(null);
  const [toggleMessages, setToggleMessages] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const isMobile = useIsMobile();
  const isOpen = forceOpen ?? toggleMessages;
  const [toggleOpen, setToggleOpen] = useState(false);
 

  // useEffect(() => {
  //   if (dmThreadIdFromSendMessageForm) {
  //     setDmThreadId(dmThreadIdFromSendMessageForm);
  //     setDmThreadIdFromSendMessageForm(null);
  //   }
  // }, [dmThreadIdFromSendMessageForm]);

  // useEffect(() => {
  //   if (!toggleMessages) return;
  //   if (!liveCurrentUserData || !liveTargetUserData) return;
  //   if (dmThreadId) return;

  //   const fetchDmThread = async () => {
  //     try {
  //       const threadId = await getOrCreateDmThread(
  //         currentUser,
  //         targetUser,
  //         liveTargetUserData?.displayName,
  //         liveTargetUserData?.profilePicture,
  //         liveCurrentUserData?.displayName,
  //         liveCurrentUserData?.profilePicture
  //       );
  //       setDmThreadId(threadId || null);
  //     } catch (error) {
  //       console.error("Error fetching or creating DM thread:", error);
  //     }
  //   };
  //   fetchDmThread();
  // }, [
  //   currentUser,
  //   targetUser,
  //   liveCurrentUserData,
  //   liveTargetUserData,
  //   toggleMessages,
  //   dmThreadId,
  //   hasUnreadMessages,
  // ]);

  function handleToggleNewMessage() {
    setToggleNewMessage((prev) => !prev);
    if (!toggleMessages) {
      setToggleMessages(true);
    }
  }
  function handleToggleMessages() {
    if (!toggleMessages) {
      setToggleMessages(true);
      handleOpenCloseDiv();
    }
    if (toggleMessages) {
        handleOpenCloseDiv();
        const setTimeOut = setTimeout(() => {
          closeEverything();
        }, 500);
        return () => clearTimeout(setTimeOut);
    }
  }

  function closeEverything() {
    setToggleOpen(false);
    const timeout = setTimeout(() => {
      setToggleMessages(false);
      setToggleNewMessage(false);
      setDmThreadId(null);
      setDmThreadIdFromSendMessageForm(null);
    }, 500);
    return () => clearTimeout(timeout);
  }

  function handleMobileClose() {
    if (toggleNewMessage) {
      setToggleNewMessage(false);
    } else {
      closeEverything();
    }
  }

  // useEffect(() => {
  //   console.log(
  //     "DM Thread ID from DMComponent:",
  //     dmThreadId,
  //     "fromSendMsg:",
  //     dmThreadIdFromSendMessageForm
  //   );
  // }, [dmThreadId, dmThreadIdFromSendMessageForm]);
  
  function handleOpenCloseDiv() {
    setToggleOpen((prev) => !prev);
  }

  return (
    <div>
      {isMobile ? (
        <div className="absolute">
          <TiMessages
            className={`cursor-pointer ${
              hasUnreadMessages ? "text-blue-500" : ""
            }`}
            onClick={handleToggleMessages}
            size={24}
          />
          <div
            className={
              hasUnreadMessages
                ? "absolute -top-1 -right-1 bg-red-500 text-xs rounded-full p-1"
                : ""
            }
          ></div>
          <div>
            <div
              className={
                isOpen && toggleMessages
                  ? "block fixed z-40 bottom-10 right-17 w-3/4 bg-white px-4 py-2 rounded-lg shadow-2xl hide-scrollbar"
                  : "hidden"
              }
            >
              <div className="flex justify-between items-center">
                <h1>Messages</h1>
                <div className="flex">
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
                  senderProfilePicture={
                    liveCurrentUserData?.profilePicture || ""
                  }
                  toggleNewMessageStateFromSendMessageForm={setToggleNewMessage}
                  setDmThreadFromSendMessageForm={
                    setDmThreadIdFromSendMessageForm
                  }
                />
              ) : (
                <div>
                  <Messages
                    key={toggleMessages ? "open" : "closed"}
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
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-gray-300 mt-5 p-2 rounded-lg shadow-lg bg-white">
          <div className="flex justify-between items-center p-1 px-2 bg-gray-100 rounded ">
            <div
              onClick={handleToggleMessages}
              className="cursor-pointer "
            >
              {hasUnreadMessages ? (
                <span className="text-red-500 font-bold">Unread Messages</span>
              ) : (
                <div className="font-bold w-full flex justify-between items-center gap-1">
                  <h1 className='' >Messages</h1>
                   {
                    toggleOpen ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />
                  }
                </div>
              )}
            </div>

            <div className="flex flex-col items-end space-x-2 cursor-pointer">
              <div>
                {toggleOpen ? (
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
            className={`hide-scrollbar overflow-y-auto transition-[max-height] duration-1000 ease-in-out ${
              toggleOpen ? "max-h-[50vh]" : "max-h-0"
            }`}
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
              <div>
                <Messages
                  key={toggleMessages ? "open" : "closed"}
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DMComponent;
