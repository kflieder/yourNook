import React from 'react'
import FollowButton from './FollowButton';

interface BioProps {
  userData: {
    displayName: string;
    pronouns?: {
      she?: boolean;
      he?: boolean;
      theyThem?: boolean;
      other?: string;
    };
    bio?: string;
    links?: string;
    uniqueUrl?: string;
    profilePicture?: string;
    uid?: string;
  }
}


function Bio({ userData }: BioProps) {

  const { displayName, pronouns = {}, bio, links, uniqueUrl, profilePicture } = userData;

  return (
    <div className='flex justify-between items-center w-full border'>
      <div>
        <img
          src={profilePicture || '/profileAvatar.png'}
          alt="Profile"
          className="w-56 h-56 rounded-full object-cover border-2"
        />
      </div>
      <div className=' flex border w-4/5 px-5'>
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <h2 className="">Name:</h2>
          <h1>{displayName}</h1>
          <h2 className="">Pronouns:</h2>
          <div className="flex flex-wrap gap-2 capitalize">
            {pronouns.she && <span><strong>she/her</strong></span>}
            {pronouns.he && <span><strong>he/him</strong></span>}
            {pronouns.theyThem && <span><strong>they/them</strong></span>}
            {pronouns.other && <span><strong>{pronouns.other}</strong></span>}
          </div>

          <h2 className="">Links:</h2>
          <a href={links} target="_blank" rel="noopener noreferrer">{links}</a>
          <h3>{uniqueUrl}</h3>
        </div>
        <div>
          <h2 className="">Bio:</h2>
          <p>{bio}</p>
        </div>
        <FollowButton targetUid={userData.uid ?? ''} targetDisplayName={displayName} />
      </div>
    </div>
  );
}

export default Bio