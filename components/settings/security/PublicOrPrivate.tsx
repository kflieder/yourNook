import React, { useState, useEffect, use } from 'react'
import { getUserDocHelper } from '@/utilities/userDocHelper';

function PublicOrPrivate({ currentUserUid }: { currentUserUid: string | undefined }) {
    const [isPrivate, setIsPrivate] = useState(false);
    const userDoc = getUserDocHelper(currentUserUid);
    const [isEditable, setIsEditable] = useState(false);


    const fetchPrivacySetting = async () => {
        const userData = await userDoc?.fetchUserData();
        if (userData) {
            setIsPrivate(userData.private ?? false);
        }
        return userData?.private;
     }
    
     const handleSubmit = async () => {
        await userDoc?.updateUserData({ private: isPrivate });
        setIsEditable(false);
     }

     const toggleIsEditable = () => {
        setIsEditable(!isEditable);
     }
    useEffect(() => {
        fetchPrivacySetting();
    }, [currentUserUid]);
   
  
  return (
    <div className='border bg-white rounded sm:w-1/2 w-full p-2'>
      <h2>Account Privacy</h2>
      <div className='flex justify-between'>
      <div>
      <label>
        <input disabled={!isEditable} type="radio" name="privacy" checked={!isPrivate} onChange={() => setIsPrivate(false)} />
        Public
      </label>
      <label>
        <input className='ml-2 mr-1' disabled={!isEditable} type="radio" name="privacy" checked={isPrivate} onChange={() => setIsPrivate(true)} />
        Private
      </label>
      </div>
        {
            isEditable ? (
              <button className="ml-2 text-sm border cursor-pointer rounded px-1 bg-blue-950 text-white" onClick={handleSubmit}>
            Save
        </button> ) : (
            <button className="ml-2 border cursor-pointer rounded px-1 bg-gray-600 text-sm text-white" onClick={toggleIsEditable}>
            Edit
        </button>
            )
        }
      </div>
    </div>
  )
}

export default PublicOrPrivate
