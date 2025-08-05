import React, { useEffect, useState } from 'react'
import { useLiveUserData } from '@/utilities/useLiveUserData';
import {getOrCreateDmThread} from '@/utilities/dmThreadHelper';
import SendMessageForm from './SendMessageForm';
import Messages from './Messages';
import { TbMessageChatbot } from "react-icons/tb";


function DMComponent({currentUser, targetUser} : {currentUser: string, targetUser: string}) {
   const liveCurrentUserData = useLiveUserData(currentUser);
   const liveTargetUserData = useLiveUserData(targetUser);
   const [dmThreadId, setDmThreadId] = useState<string | null>(null);

   useEffect(() => {
    if(!liveCurrentUserData || !liveTargetUserData) return;
       const fetchDmThread = async () => {
        try {
           const threadId = await getOrCreateDmThread(currentUser, targetUser, liveTargetUserData?.displayName, liveTargetUserData?.profilePicture, liveCurrentUserData?.displayName, liveCurrentUserData?.profilePicture);
           setDmThreadId(threadId);
       } catch (error) {
           console.error("Error fetching or creating DM thread:", error);
       }
       }
       fetchDmThread();
       console.log("DMComponent mounted with currentUser:", currentUser, "and targetUser:", targetUser);
   }, [currentUser, targetUser, liveCurrentUserData, liveTargetUserData]);
  return (
    <div>
        <div className='flex justify-between items-center p-4 bg-gray-100'>
        <h1 className="font-bold">Messages</h1>
        <div className='flex flex-col items-end space-x-2 cursor-pointer'>
        <TbMessageChatbot className='border-b-2' size={24} />
        </div>
        </div>
        <div>
        {dmThreadId ? (
          <Messages threadId={dmThreadId} currentUserUid={currentUser} senderDisplayName={liveCurrentUserData?.displayName || ''} senderProfilePicture={liveCurrentUserData?.profilePicture || ''} />
        ) : (
          <p>Loading messages...</p>
        )}
        <SendMessageForm threadId={dmThreadId || ''} currentUserUid={currentUser} senderDisplayName={liveCurrentUserData?.displayName || ''} senderProfilePicture={liveCurrentUserData?.profilePicture || ''} />
        
        </div>
    </div>
  )
}

export default DMComponent
