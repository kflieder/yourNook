import React, { useEffect, useState } from 'react'
import { useLiveUserData } from '@/utilities/useLiveUserData';
import {getOrCreateDmThread} from '@/utilities/dmThreadHelper';
import SendMessageForm from './SendMessageForm';
import Messages from './Messages';


function DMComponent({currentUser, targetUser} : {currentUser: string, targetUser: string}) {
   const liveCurrentUserData = useLiveUserData(currentUser);
   const liveTargetUserData = useLiveUserData(targetUser);
   const [dmThreadId, setDmThreadId] = useState<string | null>(null);

   useEffect(() => {
       const fetchDmThread = async () => {
        try {
           const threadId = await getOrCreateDmThread(currentUser, targetUser);
           setDmThreadId(threadId);
       } catch (error) {
           console.error("Error fetching or creating DM thread:", error);
       }
       }
       fetchDmThread();
       console.log("DMComponent mounted with currentUser:", currentUser, "and targetUser:", targetUser);
   }, [currentUser, targetUser]);
  return (
    <div>
        <div className='flex justify-between items-center p-4 bg-gray-100'>
        <h1>Messages</h1>
        <p>icon to create new message</p>
        </div>
        <div>
        {/* conditionally render map of all messages, create new message input, and existing message*/}
        {dmThreadId ? (
          <Messages threadId={dmThreadId} />
        ) : (
          <p>Loading messages...</p>
        )}
        <SendMessageForm threadId={dmThreadId || ''} currentUserUid={currentUser} />
        <p>This is where the direct messages will be displayed.</p>
        </div>
    </div>
  )
}

export default DMComponent
