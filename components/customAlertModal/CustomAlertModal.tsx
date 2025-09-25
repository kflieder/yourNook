import React from 'react'

function CustomAlertModal({ message, position }: { message: string, position: { bottom: number, left: number } }) {
  return (
    <div className='absolute bg-white p-2 rounded-lg shadow-lg z-50 w-50 sm:w-96' style={{ bottom: position.bottom, left: position.left }}>
      <p className='border border-red-400 p-4 rounded-2xl'>{message}</p>
    </div>
  )
}

export default CustomAlertModal
