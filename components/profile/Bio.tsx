import React from 'react'

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
  };
}


function Bio({ userData}: BioProps) {

  console.log('User data in Bio component:', userData);
  const { displayName, pronouns = {}, bio, links, uniqueUrl, profilePicture} = userData;

  console.log('Display Name:', displayName);
  return (
    <div className='flex justify-between items-center w-full border'>
      <div>
        <img
          src={profilePicture || '/profileAvatar.png'}
          alt="Profile"
          className="w-56 h-56 rounded-full object-cover border-2"
        />
      </div>
      <div className='border w-4/5 p-10'>
        <h1>{displayName}</h1>

        <div className="flex flex-wrap gap-2">
          {pronouns.she && <span><strong>she/her</strong></span>}
          {pronouns.he && <span><strong>he/him</strong></span>}
          {pronouns.theyThem && <span><strong>they/them</strong></span>}
          {pronouns.other && <span><strong>{pronouns.other}</strong></span>}
        </div>

        <h3>{uniqueUrl}</h3>
        <p>{bio}</p>
        <a href={links} target="_blank" rel="noopener noreferrer">{links}</a>
      </div>
    </div>
  );
}

export default Bio