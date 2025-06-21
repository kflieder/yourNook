import { RenderUsername } from '@/context/AuthContext'
import React from 'react'
import LogOutButton from '../shared/LogOutButton'
import Image from 'next/image'


function Header() {
  return (
    <div className='flex justify-between items-center px-4 py-2 bg-gray-200 shadow-xl'>
      <div>
        <Image
          src="/logo.png"
          alt="Logo"
          width={60}
          height={60}
          className="rounded-full"
        />
      </div>
      <div className="flex items-center space-x-4">
        <RenderUsername />
        <LogOutButton />
        
      </div>

    </div>
  )
}

export default Header