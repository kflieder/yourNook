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

function page() {
  const { username, loading }: any = useAuth();
  const router = useRouter();
  const [profileSetting, setProfileSetting] = useState(true);

  useEffect(() => {
    if (!loading && !username?.uid) {
      router.push('/');
    }
  }, [username, router]);

  function handleProfileSettings() {
    setProfileSetting(true);
  }

  function handleSecuritySettings() {
    setProfileSetting(false);
  }


  return (
    <div className='grid grid-cols-5 p-10'>
      <div>
        <h1>Profile Settings</h1>
        <h1>Security</h1>
      </div>
      <div className='border col-span-4 p-10'>

        {
          profileSetting ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <ProfilePicutre />
                <UniqueUrl />
              </div>
              <div>
                <BlogThreadPosts />
                <BioAndLinks />
              </div>
            </div>


          ) : (
            <div className='flex flex-col gap-4'>
              <ChangePassword />
              <DeleteAccount />
            </div>
          )
        }
      </div>
    </div>
  )
}

export default page