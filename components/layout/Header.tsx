import { RenderUsername } from '@/context/AuthContext'
import React from 'react'
import LogOutButton from '../shared/LogOutButton'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'


function Header() {
  const { username }: any = useAuth();
  return (
    <div className='flex justify-between items-center px-4 py-2 bg-blue-950 text-white text-xl capitalize font-extrabold tracking-wide shadow-xl'>
      <div>
        <Link href={`/profile/${username?.uid}`}>
        <Image
          src="/logo.png"
          alt="Logo"
          width={70}
          height={70}
          className="rounded-full"
        />
        </Link>
      </div>
      <div className="flex items-center">
        <RenderUsername />
        <LogOutButton />
        
      </div>

    </div>
  )
}

export default Header