'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import BlogThreadPosts from '../../../components/settings/BlogThreadPosts'
import BioAndLinks from '../../../components/settings/BioAndLinks'
import ProfilePicutre from '../../../components/settings/ProfilePicutre'
import UniqueUrl from '../../../components/settings/UniqueUrl'
import ChangePassword from '../../../components/settings/security/ChangePassword'
import DeleteAccount from '../../../components/settings/security/DeleteAccount'
import LogOutButton from '../../../components/shared/LogOutButton'
import AutoApproveFollowers from 'components/settings/security/AutoApproveFollowers'
import PublicOrPrivate from 'components/settings/security/PublicOrPrivate'

function page() {
  const { username, loading }: any = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'feed'>('profile');

  useEffect(() => {
    if (!loading && !username?.uid) {
      router.push('/');
    }
  }, [username, router]);

  function handleTabChange(tab: 'profile' | 'security' | 'notifications' | 'feed') {
    setActiveTab(tab);
  }




  return (
    <div className='grid grid-cols-5 p-10'>
      <div>
        <button onClick={() => handleTabChange('profile')} className={`w-full text-left p-4 cursor-pointer ${activeTab === 'profile' ? 'bg-gray-200 shadow-lg' : ''}`}>
          <h1>Profile Settings</h1>
        </button>
        <button onClick={() => handleTabChange('security')} className={`w-full text-left p-4 cursor-pointer ${activeTab === 'security' ? 'bg-gray-200 shadow-lg' : ''}`}>
          <h1>Security</h1>
        </button>
        <button onClick={() => handleTabChange('notifications')} className={`w-full text-left p-4 cursor-pointer ${activeTab === 'notifications' ? 'bg-gray-200 shadow-lg' : ''}`}>
          <h1>Notifications</h1>
        </button>
        <button onClick={() => handleTabChange('feed')} className={`w-full text-left p-4 cursor-pointer ${activeTab === 'feed' ? 'bg-gray-200 shadow-lg' : ''}`}>
          <h1>Feed Settings</h1>
        </button>
      </div>
      <div className='col-span-4 p-10 bg-gray-200 shadow-lg'>

        {
          activeTab === 'profile' ? (
            <div className="grid grid-cols-2 gap-4">
              <div className='flex flex-col gap-10'>
                <ProfilePicutre />
                <BlogThreadPosts />
              </div>
              <div>
                <LogOutButton />
                <UniqueUrl />
                <BioAndLinks />
              </div>
            </div>


          ) : activeTab === 'security' ?
            (
              <div className='flex flex-col gap-4'>
                <ChangePassword />
                <DeleteAccount />
                <AutoApproveFollowers uid={username?.uid} />
                <PublicOrPrivate currentUserUid={username?.uid} />
              </div>
            ) : activeTab === 'notifications' ? (
              <div>
                <h2>Notifications Settings</h2>
                {/* Add notification settings components here */}
              </div>
            ) : (
              <div>
                <h2>Feed Settings</h2>
                {/* Add feed settings components here */}
              </div>
            )
        }
      </div>
    </div>
  )
}

export default page