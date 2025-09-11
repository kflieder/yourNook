import React, { useState, useEffect, use } from 'react'
import { getUserDocHelper } from '@/utilities/userDocHelper';

function PublicOrPrivate({ currentUserUid }: { currentUserUid: string | undefined }) {
    const [isPrivate, setIsPrivate] = useState(false);
    const userDoc = getUserDocHelper(currentUserUid);


    const fetchPrivacySetting = async () => {
        const userData = await userDoc?.fetchUserData();
        if (userData) {
            setIsPrivate(userData.private ?? false);
        }
        return userData?.private;
     }
    
     const handleSubmit = async () => {
        await userDoc?.updateUserData({ private: isPrivate });
     }

    useEffect(() => {
        fetchPrivacySetting();
    }, [currentUserUid]);
   
  
  return (
    <div>
      <h2>Account Privacy</h2>
      <label>
        <input type="radio" name="privacy" checked={!isPrivate} onChange={() => setIsPrivate(false)} />
        Public
      </label>
      <label>
        <input className='ml-2' type="radio" name="privacy" checked={isPrivate} onChange={() => setIsPrivate(true)} />
        Private
      </label>
        <button className="ml-2 border cursor-pointer rounded px-1 bg-blue-950 text-white" onClick={handleSubmit}>
            Save
        </button>
    </div>
  )
}

export default PublicOrPrivate
