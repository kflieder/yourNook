import React, { useEffect, useState } from 'react'
import { useLiveUserData } from '@/utilities/useLiveUserData';
import {getOrCreateDmThread} from '@/utilities/dmThreadHelper';
import Messages from './Messages';
import { BiMessageAltEdit } from "react-icons/bi";
import NewMessage from './NewMessage';
import { IoIosCloseCircleOutline } from "react-icons/io";


function DMComponent({currentUser, targetUser} : {currentUser: string, targetUser: string}) {
   const liveCurrentUserData = useLiveUserData(currentUser);
   const liveTargetUserData = useLiveUserData(targetUser);
   const [dmThreadId, setDmThreadId] = useState<string | null>(null);
   const [toggleNewMessage, setToggleNewMessage] = useState(false);
   const [dmThreadIdFromSendMessageForm, setDmThreadIdFromSendMessageForm] = useState<string | null>(null);
   
   useEffect(() => {
    if (dmThreadIdFromSendMessageForm) {
      setDmThreadId(dmThreadIdFromSendMessageForm);
      setDmThreadIdFromSendMessageForm(null);
    }
    console.log("DMComponent useEffect triggered with dmThreadIdFromSendMessageForm:", dmThreadIdFromSendMessageForm);
  }, [dmThreadIdFromSendMessageForm]);

   useEffect(() => {
    if(!liveCurrentUserData || !liveTargetUserData) return;
    if(dmThreadId) return;
       const fetchDmThread = async () => {
        try {
           const threadId = await getOrCreateDmThread(currentUser, targetUser, liveTargetUserData?.displayName, liveTargetUserData?.profilePicture, liveCurrentUserData?.displayName, liveCurrentUserData?.profilePicture);
           setDmThreadId(threadId || null);
       } catch (error) {
           console.error("Error fetching or creating DM thread:", error);
       }
       }
       fetchDmThread();
       console.log("DMComponent mounted with currentUser:", currentUser, "and targetUser:", targetUser);
   }, [currentUser, targetUser, liveCurrentUserData, liveTargetUserData]);


   function handleToggleNewMessage() {
    setToggleNewMessage(!toggleNewMessage);
    }
    

  return (
    <div className='border-2 mt-5 p-5 rounded-lg shadow-lg bg-white'>
        <div className='flex justify-between items-center p-4 bg-gray-100'>
        <h1 className="font-bold">Messages</h1>
        <div className='flex flex-col items-end space-x-2 cursor-pointer'>
          <div onClick={handleToggleNewMessage} className='border-b-2'>
            {!toggleNewMessage ? <BiMessageAltEdit  size={24} /> : <IoIosCloseCircleOutline size={24} /> }
        
        
        </div>
        </div>
        </div>
        <div>
          {toggleNewMessage ? (
            <NewMessage currentUserUid={currentUser} senderDisplayName={liveCurrentUserData?.displayName || ''} senderProfilePicture={liveCurrentUserData?.profilePicture || ''}
            toggleNewMessageStateFromSendMessageForm={setToggleNewMessage}
            setDmThreadFromSendMessageForm={setDmThreadIdFromSendMessageForm}
             />
          ) : (
             <Messages threadId={dmThreadId || ''} currentUserUid={currentUser} senderDisplayName={liveCurrentUserData?.displayName || ''} senderProfilePicture={liveCurrentUserData?.profilePicture || ''}
            />
          )}
        </div>
    </div>
  )
}

export default DMComponent
