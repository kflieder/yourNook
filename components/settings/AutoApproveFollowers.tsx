import React, {useState, useEffect} from 'react'
import { useUserDoc } from '@/utilities/userDocHelper'

interface AutoAcceptFollowersProps {
  uid: string | undefined;
}

function AutoApproveFollowers({ uid }: AutoAcceptFollowersProps) {
    const userDoc = useUserDoc(uid);
    const [autoApprove, setAutoApprove] = useState<boolean>(false);

    const fetchAutoApproveStatus = async () => {
        const userData = await userDoc?.fetchUserData();
        if (userData) {
            setAutoApprove(userData.autoApproveFollow);
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
      <label className="ml-2">Enable Auto Accept</label>
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
      <label className="ml-2">Disable Auto Accept</label>
      <button className="ml-2 border cursor-pointer" onClick={handleSubmit}>
        submit
      </button>
        
    </div>
  )
}

export default AutoApproveFollowers
