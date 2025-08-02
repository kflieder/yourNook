import React from 'react'
import { blockUser } from '@/utilities/blockUserHelper'

interface BlockButtonProps {
  blockerUid: string;
  blockedUid: string;
}

function BlockButton({ blockerUid, blockedUid }: BlockButtonProps ) {
  const handleBlockUser = async () => {
    try {
      await blockUser(blockerUid, blockedUid);
      console.log('User blocked successfully');
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };
  return (
    <button className='cursor-pointer' onClick={handleBlockUser}>
      Block User
    </button>
  );
}

export default BlockButton
