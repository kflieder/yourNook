import React, {useState, useEffect} from 'react'
import { getUserDocHelper } from '@/utilities/userDocHelper'

interface AutoAcceptFollowersProps {
  uid: string | undefined;
}

function AutoApproveFollowers({ uid }: AutoAcceptFollowersProps) {
    const userDoc = getUserDocHelper(uid);
    const [autoApprove, setAutoApprove] = useState<boolean>(false);
    const [isEditable, setIsEditable] = useState(false);

    const fetchAutoApproveStatus = async () => {
        const userData = await userDoc?.fetchUserData();
        if (userData) {
            setAutoApprove(Boolean(userData.autoApproveFollow));
        }
        return userData?.autoApproveFollow
    }

    function handleSubmit() {
        userDoc?.updateUserData({ autoApproveFollow: autoApprove });
        setIsEditable(false);
    }
    function toggleEditable() {
        setIsEditable(!isEditable);
    }
  

    useEffect(() => {
        fetchAutoApproveStatus();
    }, [uid]);
   

  return (
    <div className='border bg-white border-blue-950 rounded p-2 sm:w-1/2 w-full'>
      <h1>Auto Accept Followers</h1>
      <p className='text-sm'>Automatically accept follow requests from users you follow.</p>
      <div className='flex justify-between'>
      <div className='flex items-center'>
      <input
        disabled={!isEditable}
        type="radio"
        checked={autoApprove}
        onChange={async (e) => {
          const newStatus = e.target.checked;
          setAutoApprove(newStatus);
          await userDoc?.updateUserData({ autoApproveFollow: newStatus });
        }}
        className="cursor-pointer"
      />
      <label className="ml-1">Enable</label>
      <input 
        disabled={!isEditable}
        type="radio"
        checked={!autoApprove}
        onChange={async (e) => {
          const newStatus = !e.target.checked;
          setAutoApprove(newStatus);
          await userDoc?.updateUserData({ autoApproveFollow: newStatus });
        }}
        className="cursor-pointer ml-4"
      />
      <label className="ml-1">Disable</label>
      </div>
      {
        isEditable ? (
          <button className="ml-2 border text-sm cursor-pointer rounded px-1 bg-blue-950 text-white" onClick={handleSubmit}>
            Save
          </button>
        ) : (
          <button className="ml-2 text-sm border cursor-pointer rounded px-1 bg-gray-600 text-white" onClick={toggleEditable}>
            Edit
          </button>
        )
      }
        </div>
    </div>
  )
}

export default AutoApproveFollowers
