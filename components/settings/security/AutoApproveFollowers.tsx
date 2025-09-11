import React, {useState, useEffect} from 'react'
import { getUserDocHelper } from '@/utilities/userDocHelper'

interface AutoAcceptFollowersProps {
  uid: string | undefined;
}

function AutoApproveFollowers({ uid }: AutoAcceptFollowersProps) {
    const userDoc = getUserDocHelper(uid);
    const [autoApprove, setAutoApprove] = useState<boolean>(false);

    const fetchAutoApproveStatus = async () => {
        const userData = await userDoc?.fetchUserData();
        if (userData) {
            setAutoApprove(Boolean(userData.autoApproveFollow));
        }
        return userData?.autoApproveFollow
    }

    function handleSubmit() {
        userDoc?.updateUserData({ autoApproveFollow: autoApprove });
    }

  

    useEffect(() => {
        fetchAutoApproveStatus();
    }, [uid]);
   

  return (
    <div>
      <h1>Auto Accept Followers</h1>
      <p>Automatically accept follow requests from users you follow.</p>
      <input
        type="radio"
        checked={autoApprove}
        onChange={async (e) => {
          const newStatus = e.target.checked;
          setAutoApprove(newStatus);
          await userDoc?.updateUserData({ autoApproveFollow: newStatus });
        }}
        className="cursor-pointer"
      />
      <label className="ml-2">Enable</label>
      <input 
        type="radio"
        checked={!autoApprove}
        onChange={async (e) => {
          const newStatus = !e.target.checked;
          setAutoApprove(newStatus);
          await userDoc?.updateUserData({ autoApproveFollow: newStatus });
        }}
        className="cursor-pointer ml-4"
      />
      <label className="ml-2">Disable</label>
      <button className="ml-2 border cursor-pointer rounded px-1 bg-blue-950 text-white" onClick={handleSubmit}>
        Save
      </button>
        
    </div>
  )
}

export default AutoApproveFollowers
