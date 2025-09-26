import React, {useRef} from 'react'
import { blockUser } from '@/utilities/blockUserHelper'
import { useAlert } from 'components/customAlertModal/AlertProvider';

interface BlockButtonProps {
  blockerUid: string;
  blockedUid: string;
}

function BlockButton({ blockerUid, blockedUid }: BlockButtonProps ) {
  const { show } = useAlert();
  const alertRef = useRef<HTMLButtonElement>(null);
  const handleBlockUser = async () => {
    try {
      if (blockedUid === blockerUid) {
        show("You cannot block yourself.", { bottom: 50, left: 0 }, alertRef);
        return;
      }
      await blockUser(blockerUid, blockedUid);
      console.log('User blocked successfully');
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };
  return (
    <button ref={alertRef} className='cursor-pointer' onClick={handleBlockUser}>
      Block User
    </button>
  );
}

export default BlockButton
